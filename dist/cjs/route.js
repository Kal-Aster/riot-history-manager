'use strict';

var riot = require('riot');
var constants = require('./constants-85f206eb.js');

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
function claim(claimer) {
    if (claimer == null) {
        return;
    }
    actualClaimedBy = claimer;
    loadingProgress = 5;
    loadingDone = false;
    startLoading();
}
function claimed(claimer) {
    return claimer != null && claimer === actualClaimedBy;
}
function release(claimer) {
    if (claimer == null || actualClaimedBy !== claimer) {
        return;
    }
    loadingDone = true;
}

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
    var tag = parent[riot.__.globals.DOM_COMPONENT_INSTANCE_PROPERTY];
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

function onloadingcomplete(routeComponent, currentMount, route, router, claimer) {
    if (router[constants.LAST_ROUTED] !== routeComponent) {
        return;
    }
    const currentEl = currentMount.el;
    if (claimed(claimer)) {
        release(claimer);
    }
    router[constants.UNROUTE_METHOD]();
    router[constants.UNROUTE_METHOD] = () => {
        {
            const unrouteEvent = new CustomEvent("unroute", { cancelable: false, detail: { ...route } });
            dispatchEventOver(routeComponent.root.children, unrouteEvent, null, []);
        }
        currentMount.unmount(
            {...routeComponent[riot.__.globals.PARENT_KEY_SYMBOL], route: { ...route } },
            routeComponent[riot.__.globals.PARENT_KEY_SYMBOL]
        );
        routeComponent.root.removeChild(currentEl);
        // if want to keep some route for faster loading, just `display: none` the element
        // currentEl.style.display = "none";
        router[constants.UNROUTE_METHOD] = () => {};
    };
    currentEl.style.display = "block";
    {
        const routeEvent = new CustomEvent("route", { cancelable: false, detail: { ...route } });
        dispatchEventOver(currentEl.children, routeEvent, null, []);
    }
}

function onroute(routeComponent) { return (function (location, keymap, redirection) {
    const route = { location, keymap, redirection };

    const claimer = Object.create(null);
    claim(claimer);

    const router = this[riot.__.globals.PARENT_KEY_SYMBOL].router;
    router[constants.LAST_ROUTED] = this;

    const slot = this.slots[0];
    const currentEl = document.createElement("div");
    this.root.appendChild(currentEl);
    const currentMount = riot.__.DOMBindings.template(slot.html, slot.bindings).mount(
        currentEl,
        { ...this[riot.__.globals.PARENT_KEY_SYMBOL], route: { ...route } },
        this[riot.__.globals.PARENT_KEY_SYMBOL]
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
        const router = this[riot.__.globals.PARENT_KEY_SYMBOL].router;
        if (router == null) {
            return;
        }
        this._valid = true;

        if (this.props.redirect) {
            router[constants.ROUTER].redirect(this.props.path, this.props.redirect);
        } else {
            router[constants.ROUTER].route(this._path = this.props.path, this._onroute = onroute(this));
        }
    },

    onUnmounted() {
        if (this._onroute == null) {
            return;
        }
        this[riot.__.globlas.PARENT_KEY_SYMBOL].router[constants.ROUTER].unroute(this._path, this._onroute);
    }
  },

  'template': null,
  'name': 'route'
};

module.exports = RouteComponent;
