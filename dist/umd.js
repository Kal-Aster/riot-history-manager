(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('history-manager'), require('riot')) :
    typeof define === 'function' && define.amd ? define(['history-manager', 'riot'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.historyManager, global.riot));
}(this, (function (historyManager, riot) { 'use strict';

    var DOM_COMPONENT_INSTANCE_PROPERTY = riot.__.globals.DOM_COMPONENT_INSTANCE_PROPERTY;
    var ROUTER = Symbol("router");
    var UNROUTE_METHOD = Symbol("unroute");
    var LAST_ROUTED = Symbol("last-routed");
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
        var tag = parent[DOM_COMPONENT_INSTANCE_PROPERTY];
        if (tag && tag.name === "router") {
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
            var routerTag = getRouter();
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
            var isLoader = collectLoaders != null && child.matches("[need-loading]:not([need-loading='false'])");
            if (isLoader) {
                child.addEventListener("load", function load() {
                    child.removeEventListener("load", load);
                    isLoader = false;
                });
            }
            if (listeners) {
                listeners.some(function (listener) {
                    if (listener.useCapture) {
                        listener.listener.call(child, event);
                        return immediateStop;
                    }
                });
            }
            if (!stop) {
                if (!Array.prototype.some.call(child.children, propagateEvent) && listeners) {
                    listeners.some(function (listener) {
                        if (!listener.useCapture) {
                            listener.listener.call(child, event);
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
    var loadingBar = document.body.appendChild(document.createElement("div"));
    var loadingBarContainer = document.body.appendChild(document.createElement("div"));
    loadingBarContainer.setAttribute("style", "position: fixed; top: 0; left: 0; right: 0; height: 4px; z-index: 101; background: rgba(250, 120, 30, .5); display: none;");
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
    function startLoading() {
        if (nextFrame) {
            cancelAnimationFrame(nextFrame);
        }
        var lastTime;
        var step = function () {
            if (loadingDone && loadingProgress === 5) {
                loadingProgress = 100;
                loadingBarContainer.style.display = "none";
                window.dispatchEvent(new Event("routerload"));
                return;
            }
            var last = lastTime;
            var delta = ((lastTime = Date.now()) - last);
            if (loadingProgress >= 100) {
                if ((doneTime -= delta) <= 0) {
                    doneTime = visibilityTime;
                    loadingBarContainer.style.display = "none";
                    window.dispatchEvent(new Event("routerload"));
                }
                else {
                    requestAnimationFrame(step);
                }
                return;
            }
            if (loadingDone) {
                loadingProgress += delta;
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
    var lastClaim;
    function claimLoadingBar(claimer) {
        if (claimer == null) {
            return;
        }
        actualClaimedBy = claimer;
        loadingProgress = 5;
        loadingDone = false;
        lastClaim = Date.now();
        startLoading();
    }
    function hasLoadingBar(claimer) {
        return claimer != null && claimer === actualClaimedBy;
    }
    function endLoadingBar(claimer) {
        if (claimer == null || actualClaimedBy !== claimer) {
            return;
        }
        console.log("claim end at", Date.now() - lastClaim + "ms");
        loadingDone = true;
    }

    var RouterComponent = {
      'css': null,

      'exports': {
        onBeforeMount() {
            this[UNROUTE_METHOD] = () => {};
            this[ROUTER] = historyManager.Router.create();
        },

        onMounted() {
            this[ROUTER].route("(.*)", () => {
                this[LAST_ROUTED] = null;
                this[UNROUTE_METHOD]();
                this[UNROUTE_METHOD] = () => {};
            });
        },

        [LAST_ROUTED]: null
      },

      'template': function(template, expressionTypes, bindingTypes, getComponent) {
        return template('<slot expr15="expr15"></slot>', [{
          'type': bindingTypes.SLOT,

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'router',

            'evaluate': function(scope) {
              return scope;
            }
          }],

          'name': 'default',
          'redundantAttribute': 'expr15',
          'selector': '[expr15]'
        }]);
      },

      'name': 'router'
    };

    function onroute(routeComponent) { return (function (location, keymap, redirection) {
        const route = { location, keymap, redirection };

        const claimer = Object.create(null);
        claimLoadingBar(claimer);

        const router = this[riot.__.globals.PARENT_KEY_SYMBOL].router;
        router[LAST_ROUTED] = this;

        const slot = this.slots[0];
        const currentEl = document.createElement("div");
        const currentMount = riot.__.DOMBindings.template(slot.html, slot.bindings).mount(
            currentEl,
            { ...this[riot.__.globals.PARENT_KEY_SYMBOL], route },
            this[riot.__.globals.PARENT_KEY_SYMBOL]
        );
        const onloadingcomplete = () => {
            if (router[LAST_ROUTED] !== this) {
                return;
            }
            if (hasLoadingBar(claimer)) {
                endLoadingBar(claimer);
            }
            router[UNROUTE_METHOD]();
            router[UNROUTE_METHOD] = () => {
                const unrouteEvent = new CustomEvent("unroute", { cancelable: false, detail: {
                    location, keymap, redirection
                } });
                dispatchEventOver(this.root.children, unrouteEvent, null, []);
                this.root.innerHTML = "";
            };
            while (currentEl.childNodes.length) {
                const node = currentEl.childNodes[0];
                currentEl.removeChild(node);
                this.root.appendChild(node);
            }
            const routeEvent = new CustomEvent("route", { cancelable: false, detail: {
                location, keymap, redirection
            } });
            dispatchEventOver(this.root.children, routeEvent, null, []);
        };
        
        const needLoading = [];
        const routerChildren = [];
        {
            const beforeRouteEvent = new CustomEvent("beforeroute", { cancelable: false, detail: {
                location, keymap, redirection
            } });
            dispatchEventOver(currentEl.children, beforeRouteEvent, needLoading, routerChildren);
        }
        if (needLoading.length > 0) {
            let loaded = 0;
            needLoading.forEach(el => {
                loaded++;
                const onload = el => {
                    const fn = () => {
                        el.removeEventListener("load", fn);
                        Array.prototype.forEach.call(
                            currentEl.querySelectorAll("[need-loading]:not([need-loading='false'])"),
                            el => {
                                if (needLoading.some(other => other === el)) { return; }
                                needLoading.push(el);
                                loaded++;
                                el.addEventListener("load", onload(el));
                            }
                        );
                        if (--loaded <= 0) { onloadingcomplete(); }
                    };
                    return fn;
                };
                el.addEventListener("load", onload(el));
            });
        } else {
            onloadingcomplete();
        }
    }).bind(routeComponent); }

    var RouteComponent = {
      'css': null,

      'exports': {
        _valid: false,

        onMounted() {
            const router = this[riot.__.globals.PARENT_KEY_SYMBOL].router;
            if (router == null) {
                return;
            }
            this._valid = true;

            if (this.props.redirect) {
                router[ROUTER].redirect(this.props.path, this.props.redirect);
            } else {
                router[ROUTER].route(this.props.path, onroute(this));
            }
        }
      },

      'template': null,
      'name': 'route'
    };

    var NavigateComponent = {
      'css': `navigate a[ref=-navigate-a],[is="navigate"] a[ref=-navigate-a]{ color: inherit; text-decoration: none; outline: none; }`,

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
                // console.log(event);
                event.preventDefault();
                let href = this.href(false);
                if (href != null) {
                    // console.log("got href:", this.href(false), this.props.href);
                    historyManager.Router.go(href, { replace: this.replace() });
                    // event.stopPropagation();
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
                return (this.props.replace && this.props.replace !== "false") || this.props.replace === "";
            }
            return this.props.replace;
        },

        href(toA = true) {
            if (typeof this.props.href !== "string") {
                return null;
            }
            if (this._href == null) {
                this._href = historyManager.Router.getLocation().hrefIf(this.props.href);
                // console.log("got href", this._href, "from", this.props.href, "and", router.location.href, this.root);
            }
            return this._href; // (toA ? router.base : "") + this._href;
        },

        context() {
            if (typeof this.props.context !== "string") {
                return null;
            }
            return this.props.context;
        }
      },

      'template': function(template, expressionTypes, bindingTypes, getComponent) {
        return template(
          '<a expr16="expr16" ref="-navigate-a"><slot expr17="expr17"></slot></a>',
          [{
            'redundantAttribute': 'expr16',
            'selector': '[expr16]',

            'expressions': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'href',

              'evaluate': function(scope) {
                return scope.href();
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'style',

              'evaluate': function(scope) {
                return ['display: ', scope.root.style.display, '; width: 100%; height: 100%;'].join('');
              }
            }]
          }, {
            'type': bindingTypes.SLOT,
            'attributes': [],
            'name': 'default',
            'redundantAttribute': 'expr17',
            'selector': '[expr17]'
          }]
        );
      },

      'name': 'navigate'
    };

    riot.register("router", RouterComponent);
    riot.register("route", RouteComponent);
    riot.register("navigate", NavigateComponent);

})));
