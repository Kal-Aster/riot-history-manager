import { Router } from 'history-manager';
import { __, register } from 'riot';

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
            window.dispatchEvent(new Event("routerload"));
            return;
        }
        var last = lastTime;
        var delta = ((lastTime = Date.now()) - last);
        if (loadingProgress >= 100) {
            if (!eventDispatched) {
                window.dispatchEvent(new Event("routerload"));
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

var loadingBar$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    claim: claim,
    claimedBy: claimedBy,
    claimed: claimed,
    release: release,
    isLoading: isLoading
});

var ROUTER = Symbol("router");
var IS_ROUTER = Symbol("is-router");
var UNROUTE_METHOD = Symbol("unroute");
var LAST_ROUTED = Symbol("last-routed");

var RouterComponent = {
  'css': null,

  'exports': {
    onBeforeMount() {
        this.root[IS_ROUTER] = true;
        this[UNROUTE_METHOD] = () => {};
        this[ROUTER] = Router.create();
    },

    onMounted() {
        this[ROUTER].route("(.*)", () => {
            claim(this); release(this);
            this[LAST_ROUTED] = null;
            this[UNROUTE_METHOD]();
            this[UNROUTE_METHOD] = () => {};
        });
    },

    onUnmounted() {
        delete this.root[IS_ROUTER];
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
      '<slot expr2="expr2"></slot>',
      [
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

  'name': 'router'
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
    var tag = parent[__.globals.DOM_COMPONENT_INSTANCE_PROPERTY];
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

function onunroute(routeComponent, currentMount, route, router, shouldFireEvent, shouldResetUnroute) {
    const currentEl = currentMount.el;
    {
        if (shouldFireEvent) {
            const unrouteEvent = new CustomEvent("unroute", { cancelable: false, detail: { ...route } });
            dispatchEventOver(routeComponent.root.children, unrouteEvent, null, []);
        }
        const scope = Object.create(routeComponent[__.globals.PARENT_KEY_SYMBOL], { route: { value: { ...route } } });
        currentMount.unmount( scope, routeComponent[__.globals.PARENT_KEY_SYMBOL] );
    }
    {
        routeComponent.root.removeChild(currentEl);
        // if want to keep some route for faster loading, just `display: none` the element
        // currentEl.style.display = "none";
    }
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
    const thisUNROUTE = () => {
        onunroute(routeComponent, currentMount, route, router, reachedRouterLoad, reachedRouterLoad);
    };
    router[UNROUTE_METHOD] = () => {
        window.removeEventListener("routerload", onrouterload);
        routerUNROUTE();
        thisUNROUTE();
    };

    window.addEventListener("routerload", onrouterload);

    function onrouterload() {
        window.removeEventListener("routerload", onrouterload);
        reachedRouterLoad = true;
        routerUNROUTE();
        router[UNROUTE_METHOD] = thisUNROUTE;
        currentEl.style.display = "block";
        {
            const routeEvent = new CustomEvent("route", { cancelable: false, detail: { ...route } });
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
    const currentMount = __.DOMBindings.template(slot.html, slot.bindings).mount(
        currentEl,
        Object.create(this[__.globals.PARENT_KEY_SYMBOL], { route: { value: { ...route } } }),
        this[__.globals.PARENT_KEY_SYMBOL]
    );
    currentEl.style.display = "none";
    
    const needLoading = [];
    const routerChildren = [];
    {
        const beforeRouteEvent = new CustomEvent("beforeroute", { cancelable: false, detail: { ...route } });
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
    _valid: false,
    _onroute: null,
    _path: null,

    onMounted() {
        let routerEl = this.root;
        while (routerEl != null) {
            if ((routerEl = routerEl.parentElement)[IS_ROUTER]) {
                break;
            }
        }
        const router = routerEl != null ? routerEl[__.globals.DOM_COMPONENT_INSTANCE_PROPERTY] : null;
        if (routerEl == null) {
            return;
        }
        this._valid = true;
        this[ROUTER] = router;

        if (this.props.redirect) {
            router[ROUTER].redirect(this.props.path, this.props.redirect);
        } else {
            router[ROUTER].route(this._path = this.props.path, this._onroute = onroute(this));
        }
    },

    onUnmounted() {
        if (this._onroute == null) {
            return;
        }
        this[__.globlas.PARENT_KEY_SYMBOL].router[ROUTER].unroute(this._path, this._onroute);
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
            event.preventDefault();
            let href = this.href(false);
            if (href != null) {
                Router.go(href, { replace: this.replace() });
            } else {
                let context = this.context();
                if (context) {
                    Router.restoreContext(context);
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
                return context != null ? Router.getContextDefaultOf(context) : null;
            }
            return null;
        }
        if (this._href == null) {
            this._href = Router.getLocation().hrefIf(this.props.href);
            // console.log("got href", this._href, "from", this.props.href, "and", Router.location.href, this.root);
        }
        return this._href; // (toA ? Router.base : "") + this._href;
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
      '<a expr0="expr0" ref="-navigate-a"><slot expr1="expr1"></slot></a>',
      [
        {
          'redundantAttribute': 'expr0',
          'selector': '[expr0]',

          'expressions': [
            {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'href',

              'evaluate': function(
                scope
              ) {
                return "#" + scope.href();
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
          'redundantAttribute': 'expr1',
          'selector': '[expr1]'
        }
      ]
    );
  },

  'name': 'navigate'
};

register("router", RouterComponent);
register("route", RouteComponent);
register("navigate", NavigateComponent);
var components = {
    router: RouterComponent,
    route: RouteComponent,
    navigate: NavigateComponent
};

export { components, loadingBar$1 as loadingBar };
