(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('riot'), require('history-manager')) :
    typeof define === 'function' && define.amd ? define(['exports', 'riot', 'history-manager'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.riotHistoryManager = {}, global.riot, global.historyManager));
}(this, (function (exports, riot, historyManager) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                }
            });
        }
        n['default'] = e;
        return Object.freeze(n);
    }

    var riot__namespace = /*#__PURE__*/_interopNamespace(riot);

    var loadingBar = document.body.appendChild(document.createElement("div"));
    var loadingBarContainer = document.body.appendChild(document.createElement("div"));
    loadingBarContainer.setAttribute("style", "position: fixed; top: 0; left: 0; right: 0; height: 4px; z-index: 999999; background: rgba(250, 120, 30, .5); display: none;");
    loadingBar = loadingBarContainer.appendChild(document.createElement("div"));
    loadingBar.setAttribute("style", "height: 100%; width: 100%; background: rgb(250, 120, 30) none repeat scroll 0% 0%; transform-origin: center left;");
    var actualClaimedBy = null;
    var nextFrame = -1;
    var loadingProgress = 0;
    var loadingDone = false;
    var progressVel = function (progress) {
        return (8192 - (1.08 * progress * progress)) / 819.2;
    };
    var visibilityTime = 300;
    var doneTime = visibilityTime;
    var claimedWhenVisible = 0;
    function dispatchRouterLoad() {
        document.dispatchEvent(new Event("routerload", { bubbles: true, cancelable: false }));
    }
    function startLoading() {
        if (nextFrame) {
            cancelAnimationFrame(nextFrame);
        }
        var lastTime;
        var eventDispatched = false;
        var step = function () {
            nextFrame = -1;
            if (loadingDone && loadingProgress === 5 && claimedWhenVisible === 5) {
                loadingProgress = 100;
                loadingBarContainer.style.display = "none";
                dispatchRouterLoad();
                return;
            }
            var last = lastTime;
            var delta = ((lastTime = Date.now()) - last);
            if (loadingProgress >= 100) {
                if (!eventDispatched) {
                    dispatchRouterLoad();
                    eventDispatched = true;
                }
                if ((doneTime -= delta) <= 0) {
                    doneTime = visibilityTime;
                    loadingBarContainer.style.display = "none";
                }
                else {
                    requestAnimationFrame(step);
                }
                return;
            }
            if (loadingDone) {
                loadingProgress += delta / 2;
            }
            else {
                loadingProgress += delta * progressVel(loadingProgress) / 100;
            }
            loadingBar.style.transform = "scaleX(" + (loadingProgress / 100) + ")";
            nextFrame = requestAnimationFrame(step);
        };
        loadingBarContainer.style.display = "block";
        lastTime = Date.now();
        step();
    }
    function claim(claimer) {
        if (claimer == null) {
            return;
        }
        actualClaimedBy = claimer;
        claimedWhenVisible = loadingBarContainer.style.display === "block" ? loadingProgress : 5;
        loadingProgress = 5;
        loadingDone = false;
        startLoading();
    }
    function claimedBy(claimer) {
        return claimer != null && claimer === actualClaimedBy;
    }
    var claimed = claimedBy;
    function release(claimer) {
        if (claimer == null || actualClaimedBy !== claimer) {
            return;
        }
        loadingDone = true;
    }
    function isLoading() {
        return nextFrame !== -1;
    }
    var rgbRegex = /^\s*rgb\s*\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\)\s*$/;
    var shortHexRegex = /^\s*#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])\s*$/;
    var hexRegex = /^\s*#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})\s*$/;
    function applyColor(r, g, b) {
        loadingBar.style.background = "rgb(" + r + "," + g + "," + b + ")";
        loadingBarContainer.style.background = "rgb(" + r + "," + g + "," + b + ",0.5)";
    }
    function setColor(color) {
        if (typeof color !== "string") {
            throw new TypeError("color must be string");
        }
        var match = color.match(rgbRegex);
        if (match != null) {
            var r = parseFloat(match[1]);
            var g = parseFloat(match[2]);
            var b = parseFloat(match[3]);
            if (r > 255 || g > 255 || b > 255) {
                throw new TypeError("invalid color rgb arguments");
            }
            applyColor(r, g, b);
            return;
        }
        match = color.match(shortHexRegex);
        if (match != null) {
            color = "#" + match[1].repeat(2) + match[2].repeat(2) + match[3].repeat(2);
        }
        match = color.match(hexRegex);
        if (match != null) {
            var r = parseInt(match[1], 16);
            var g = parseInt(match[2], 16);
            var b = parseInt(match[3], 16);
            applyColor(r, g, b);
            return;
        }
        throw new TypeError("invalid color format");
    }

    var loadingBar$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        claim: claim,
        claimedBy: claimedBy,
        claimed: claimed,
        release: release,
        isLoading: isLoading,
        setColor: setColor
    });

    var ROUTER = Symbol("router");
    var UNROUTE_METHOD = Symbol("unroute");
    var LAST_ROUTED = Symbol("last-routed");
    var ROUTE_PLACEHOLDER = Symbol("route-placeholder");
    var IS_UNMOUNTING = Symbol("is-unmounting");

    const noop = () => { };

    var RouterComponent = {
      'css': null,

      'exports': {
        [IS_UNMOUNTING]: false,
        _mounted: false,

        _refesh() {
            this[ROUTER].destroy();
            const router = this[ROUTER] = historyManager.Router.create();
            Array.prototype.forEach.call(this.root.querySelectorAll("rhm-route"), route => {
                route[riot.__.globals.DOM_COMPONENT_INSTANCE_PROPERTY]._setup();
            });
            router.route("(.*)", (location, ) => {
                claim(this); release(this);
                this[LAST_ROUTED] = null;
                this[UNROUTE_METHOD]();
                this[UNROUTE_METHOD] = noop;
            });
            // it should check if LAST_ROUTED would be the same,
            // if so it should not emit
            router.emit();
        },

        getSelfSlotProp() {
            return { [ROUTER]: this };
        },

        isMounted() {
            return this._mounted;
        },

        onBeforeMount() {
            this[UNROUTE_METHOD] = noop;
            this[ROUTER] = historyManager.Router.create();
        },

        onMounted() {
            this[ROUTER].route("(.*)", (location, ) => {
                claim(this); release(this);
                this[LAST_ROUTED] = null;
                this[UNROUTE_METHOD]();
                this[UNROUTE_METHOD] = noop;
            });

            this._mounted = true;

            if (historyManager.HistoryManager.isStarted()) {
                this[ROUTER].emit();
            }
        },

        onBeforeUnmount() {
            this[IS_UNMOUNTING] = true;
        },

        onUnmounted() {
            this[IS_UNMOUNTING] = false;

            this[LAST_ROUTED] = null;
            this[UNROUTE_METHOD] = noop;
            this[ROUTER].destroy();
            this[ROUTER] = null;

            this._mounted = false;
        },

        [LAST_ROUTED]: null
      },

      'template': function(
        template,
        expressionTypes,
        bindingTypes,
        getComponent
      ) {
        return template(
          '<slot expr0="expr0"></slot>',
          [
            {
              'type': bindingTypes.SLOT,

              'attributes': [
                {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': null,

                  'evaluate': function(
                    scope
                  ) {
                    return scope.getSelfSlotProp();
                  }
                }
              ],

              'name': 'default',
              'redundantAttribute': 'expr0',
              'selector': '[expr0]'
            }
          ]
        );
      },

      'name': 'rhm-router'
    };

    var ONBEFOREROUTE = Symbol("onbeforeroute");
    var ONUNROUTE = Symbol("onunroute");
    var ONROUTE = Symbol("onroute");
    var HTMLElementAddEventListener = HTMLElement.prototype.addEventListener;
    HTMLElement.prototype.addEventListener = function (type, listener, options) {
        if (options === void 0) { options = false; }
        switch (type) {
            case "beforeroute": {
                var onbeforeroute = this[ONBEFOREROUTE] = this[ONBEFOREROUTE] || [];
                var useCapture = typeof options === "boolean" ? options : options ? options.capture != null : false;
                onbeforeroute.push({ listener: listener, useCapture: useCapture });
                break;
            }
            case "unroute": {
                var onunroute = this[ONUNROUTE] = this[ONUNROUTE] || [];
                var useCapture = typeof options === "boolean" ? options : options ? options.capture != null : false;
                onunroute.push({ listener: listener, useCapture: useCapture });
                break;
            }
            case "route": {
                var onroute = this[ONROUTE] = this[ONROUTE] || [];
                var useCapture = typeof options === "boolean" ? options : options ? options.capture != null : false;
                onroute.push({ listener: listener, useCapture: useCapture });
                break;
            }
            default: {
                return HTMLElementAddEventListener.call(this, type, listener, options);
            }
        }
    };
    var HTMLElementRemoveEventListener = HTMLElement.prototype.removeEventListener;
    HTMLElement.prototype.removeEventListener = function (type, listener, options) {
        switch (type) {
            case "beforeroute": {
                var onbeforeroute = this[ONBEFOREROUTE];
                if (!onbeforeroute) {
                    return;
                }
                var useCapture_1 = typeof options === "boolean" ? options : options ? options.capture != null : false;
                var index_1 = -1;
                if (!onbeforeroute.some(function (l, i) {
                    if (l.listener === listener && l.useCapture === useCapture_1) {
                        index_1 = i;
                        return true;
                    }
                    return false;
                })) {
                    return;
                }
                onbeforeroute.slice(index_1, 1);
                break;
            }
            case "unroute": {
                var onunroute = this[ONUNROUTE];
                if (!onunroute) {
                    return;
                }
                var useCapture_2 = typeof options === "boolean" ? options : options ? options.capture != null : false;
                var index_2 = -1;
                if (!onunroute.some(function (l, i) {
                    if (l.listener === listener && l.useCapture === useCapture_2) {
                        index_2 = i;
                        return true;
                    }
                    return false;
                })) {
                    return;
                }
                onunroute.slice(index_2, 1);
                break;
            }
            case "route": {
                var onroute = this[ONROUTE];
                if (!onroute) {
                    return;
                }
                var useCapture_3 = typeof options === "boolean" ? options : options ? options.capture != null : false;
                var index_3 = -1;
                if (!onroute.some(function (l, i) {
                    if (l.listener === listener && l.useCapture === useCapture_3) {
                        index_3 = i;
                        return true;
                    }
                    return false;
                })) {
                    return;
                }
                onroute.slice(index_3, 1);
                break;
            }
            default: {
                return HTMLElementRemoveEventListener.call(this, type, listener, options);
            }
        }
    };
    function getRouter(element) {
        var tag = element[riot__namespace.__.globals.DOM_COMPONENT_INSTANCE_PROPERTY];
        if (tag && tag.name === "rhm-router") {
            return tag;
        }
        return null;
    }
    function dispatchEventOver(children, event, collectLoaders, collectRouter) {
        var stop = false;
        var immediateStop = false;
        event.stopImmediatePropagation = function () {
            stop = true;
            immediateStop = true;
        };
        event.stopPropagation = function () {
            stop = true;
        };
        function propagateEvent(child) {
            var routerTag = getRouter(child);
            if (routerTag) {
                if (collectRouter != null) {
                    collectRouter.push(routerTag);
                }
                return false;
            }
            var listeners;
            switch (event.type) {
                case "beforeroute": {
                    listeners = child[ONBEFOREROUTE];
                    break;
                }
                case "unroute": {
                    listeners = child[ONUNROUTE];
                    break;
                }
                case "route": {
                    listeners = child[ONROUTE];
                    break;
                }
                default: return true;
            }
            var isLoader = collectLoaders != null && (function (attr) { return attr != null && attr !== "false"; })(child.getAttribute("need-loading"));
            if (isLoader) {
                child.addEventListener("load", function load() {
                    child.removeEventListener("load", load);
                    isLoader = false;
                });
            }
            if (listeners) {
                listeners.some(function (listener) {
                    if (listener.useCapture) {
                        if (typeof listener.listener === "function") {
                            listener.listener.call(child, event);
                            return immediateStop;
                        }
                        if (typeof listener.listener !== "object" || listener.listener.handleEvent == null) {
                            return immediateStop;
                        }
                        if (typeof listener.listener.handleEvent !== "function") {
                            return immediateStop;
                        }
                        listener.listener.handleEvent(event);
                        return immediateStop;
                    }
                });
            }
            if (!stop) {
                if (!Array.prototype.some.call(child.children, propagateEvent) && listeners) {
                    listeners.some(function (listener) {
                        if (!listener.useCapture) {
                            if (typeof listener.listener === "function") {
                                listener.listener.call(child, event);
                                return immediateStop;
                            }
                            if (typeof listener.listener !== "object" || listener.listener.handleEvent == null) {
                                return immediateStop;
                            }
                            if (typeof listener.listener.handleEvent !== "function") {
                                return immediateStop;
                            }
                            listener.listener.handleEvent(event);
                            return immediateStop;
                        }
                    });
                }
            }
            if (isLoader) {
                collectLoaders.push(child);
            }
            return stop;
        }
        Array.prototype.some.call(children, propagateEvent);
        delete event.stopImmediatePropagation;
        delete event.stopPropagation;
    }

    function onunroute(routeComponent, currentMount, route, router, shouldFireEvent, shouldResetUnroute) {
        const currentEl = currentMount.el;
        {
            if (shouldFireEvent) {
                const unrouteEvent = new CustomEvent("unroute", { cancelable: false, detail: {
                    location: route.location,
                    keymap: route.keymap,
                    redirection: route.redirection
                } });
                dispatchEventOver(routeComponent.root.children, unrouteEvent, null, []);
            }
            const scope = Object.create(routeComponent[riot.__.globals.PARENT_KEY_SYMBOL], { route: { value: {
                location: route.location,
                keymap: route.keymap,
                redirection: route.redirection
            } } });
            currentMount.unmount( scope, routeComponent[riot.__.globals.PARENT_KEY_SYMBOL] );
        }
        // if want to keep some route for faster loading, just `display: none` the element?
        // currentEl.style.display = "none";
        routeComponent.root.removeChild(currentEl);
        if (shouldResetUnroute) {
            router[UNROUTE_METHOD] = () => {};
        }
    }

    function onloadingcomplete(routeComponent, currentMount, route, router, claimer) {
        if (router[LAST_ROUTED] !== routeComponent) {
            onunroute(routeComponent, currentMount, route, router, false, false);
            return;
        }
        const currentEl = currentMount.el;
        if (claimed(claimer)) {
            release(claimer);
        }
        const routerUNROUTE = router[UNROUTE_METHOD];
        let reachedRouterLoad = false;
        let unrouted = false;
        const thisUNROUTE = () => {
            if (unrouted) {
                return;
            }
            unrouted = true;
            onunroute(routeComponent, currentMount, route, router, reachedRouterLoad, reachedRouterLoad);
        };
        router[UNROUTE_METHOD] = () => {
            window.removeEventListener("routerload", onrouterload, true);
            routerUNROUTE();
            thisUNROUTE();
        };

        window.addEventListener("routerload", onrouterload, true);

        function onrouterload() {
            window.removeEventListener("routerload", onrouterload, true);
            reachedRouterLoad = true;
            routerUNROUTE();
            router[UNROUTE_METHOD] = thisUNROUTE;
            currentEl.style.display = "block";
            if (typeof routeComponent.props.title === "string") {
                document.title = routeComponent.props.title;
            }
            {
                const routeEvent = new CustomEvent("route", { cancelable: false, detail: {
                    location: route.location,
                    keymap: route.keymap,
                    redirection: route.redirection
                } });
                dispatchEventOver(currentEl.children, routeEvent, null, []);
            }
        }
    }

    function onroute(routeComponent) { return (function (location, keymap, redirection) {
        const route = { location, keymap, redirection };

        const claimer = Object.create(null);
        claim(claimer);

        const router = this[ROUTER];
        router[LAST_ROUTED] = this;

        const slot = this.slots[0];
        const currentEl = document.createElement("div");
        this.root.appendChild(currentEl);
        const currentMount = riot.__.DOMBindings.template(slot.html, slot.bindings).mount(
            currentEl,
            Object.create(this[riot.__.globals.PARENT_KEY_SYMBOL], { route: { value: { location, keymap, redirection } } }),
            this[riot.__.globals.PARENT_KEY_SYMBOL]
        );
        currentEl.style.display = "none";
        
        const needLoading = [];
        const routerChildren = [];
        {
            const beforeRouteEvent = new CustomEvent("beforeroute", {
                cancelable: false, detail: { location, keymap, redirection }
            });
            dispatchEventOver(currentEl.children, beforeRouteEvent, needLoading, routerChildren);
        }
        if (needLoading.length > 0) {
            let loaded = 0;
            const onrequestvisibility = () => {
                currentEl.style.display = "block";
            };
            needLoading.forEach(el => {
                loaded++;
                const onload = el => {
                    const fn = () => {
                        currentEl.style.display = "none";
                        el.removeEventListener("requestvisibility", onrequestvisibility);
                        el.removeEventListener("load", fn);
                        Array.prototype.forEach.call(
                            currentEl.querySelectorAll("[need-loading]:not([need-loading='false'])"),
                            el => {
                                if (needLoading.some(other => other === el)) { return; }
                                needLoading.push(el);
                                loaded++;
                                el.addEventListener("load", onload(el));
                                el.addEventListener("requestvisibility", onrequestvisibility);
                            }
                        );
                        if (--loaded <= 0) {
                            onloadingcomplete(routeComponent, currentMount, route, router, claimer);
                        }
                    };
                    return fn;
                };
                el.addEventListener("requestvisibility", onrequestvisibility);
                el.addEventListener("load", onload(el));
            });
        } else {
            onloadingcomplete(routeComponent, currentMount, route, router, claimer);
        }
    }).bind(routeComponent); }

    var RouteComponent = {
      'css': null,

      'exports': {
        [IS_UNMOUNTING]: false,
        _valid: false,
        _onroute: null,
        _path: null,

        _setup() {
            if (!this._valid || this[IS_UNMOUNTING]) {
                return;
            }
            const router = this[ROUTER][ROUTER];

            if (this.props.redirect) {
                router.redirect(this.props.path, this.props.redirect);
            } else {
                router.route(this._path = this.props.path, this._onroute = onroute(this));
            }
        },

        onMounted() {
            this[ROUTE_PLACEHOLDER] = this.root; // document.createComment("");
            // this.root.replaceWith(placeholder);
            const router = this[riot.__.globals.PARENT_KEY_SYMBOL][ROUTER];
            if (router == null) {
                return;
            }
            this._valid = true;
            this[ROUTER] = router;

            if (router.isMounted()) {
                router._refesh();
            } else {
                this._setup();
            }
        },

        onBeforeUnmount() {
            this[IS_UNMOUNTING] = true;
            // this[ROUTE_PLACEHOLDER].replaceWith(this.root);
        },

        onUnmounted() {
            if (this._valid) {
                // console.log(this.root.parentElement);
                const router = this[riot.__.globals.PARENT_KEY_SYMBOL][ROUTER];
                if (router[IS_UNMOUNTING]) {
                    return;
                }
                if (router[LAST_ROUTED] === this) {
                    router._refesh();
                } else {
                    router[ROUTER].unroute(this._path);
                }
            }

            this[IS_UNMOUNTING] = false;
        }
      },

      'template': null,
      'name': 'rhm-route'
    };

    var NavigateComponent = {
      'css': `rhm-navigate a[ref=-navigate-a],[is="rhm-navigate"] a[ref=-navigate-a]{ color: inherit; text-decoration: none; outline: none; }`,

      'exports': {
        onMounted() {
            this.root.style.cursor = "pointer";
            if (this.root.style.display === "") {
                this.root.style.display = "inline";
            }

            this.root.setAttribute("route-listener", "true");
            this.root.addEventListener("route", () => {
                this.update();
            });
            
            this.root.firstElementChild.addEventListener("click", event => {
                event.preventDefault();
                let href = this.href(false);
                if (href != null) {
                    historyManager.Router.go(href, { replace: this.replace() });
                } else {
                    let context = this.context();
                    if (context) {
                        historyManager.Router.restoreContext(context);
                    }
                }
                return false;
            });
        },

        onBeforeUpdate() {
            this._href = null;
        },

        replace() {
            if (typeof this.props.replace !== "boolean") {
                return (this.props.replace != null && this.props.replace !== "false") || this.props.replace === "";
            }
            return this.props.replace;
        },

        href(toA = true) {
            if (typeof this.props.href !== "string") {
                if (toA) {
                    const context = this.context();
                    return context != null ? historyManager.Router.getContextDefaultOf(context) : null;
                }
                return null;
            }
            if (this._href == null) {
                this._href = historyManager.Router.getLocation().hrefIf(this.props.href);
                // console.log("got href", this._href, "from", this.props.href, "and", Router.location.href, this.root);
            }
            return toA ? historyManager.URLManager.construct(this._href, true) : this._href; // (toA ? Router.base : "") + this._href;
        },

        context() {
            if (typeof this.props.context !== "string") {
                return null;
            }
            return this.props.context;
        }
      },

      'template': function(
        template,
        expressionTypes,
        bindingTypes,
        getComponent
      ) {
        return template(
          '<a expr1="expr1" ref="-navigate-a"><slot expr2="expr2"></slot></a>',
          [
            {
              'redundantAttribute': 'expr1',
              'selector': '[expr1]',

              'expressions': [
                {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'href',

                  'evaluate': function(
                    scope
                  ) {
                    return scope.href();
                  }
                },
                {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'style',

                  'evaluate': function(
                    scope
                  ) {
                    return [
                      'display: ',
                      scope.root.style.display,
                      '; width: 100%; height: 100%;'
                    ].join(
                      ''
                    );
                  }
                }
              ]
            },
            {
              'type': bindingTypes.SLOT,
              'attributes': [],
              'name': 'default',
              'redundantAttribute': 'expr2',
              'selector': '[expr2]'
            }
          ]
        );
      },

      'name': 'rhm-navigate'
    };

    riot.register("rhm-router", RouterComponent);
    riot.register("rhm-route", RouteComponent);
    riot.register("rhm-navigate", NavigateComponent);
    var components = {
        "rhm-router": RouterComponent,
        "rhm-route": RouteComponent,
        "rhm-navigate": NavigateComponent
    };

    exports.components = components;
    exports.loadingBar = loadingBar$1;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
