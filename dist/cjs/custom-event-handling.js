'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var riot = require('riot');

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
function isRouter(element) {
    return element.matches("router,[" + riot.__.globals.IS_DIRECTIVE + "=\"router\"]");
}
function getRouter(element) {
    var tag = parent[riot.__.globals.DOM_COMPONENT_INSTANCE_PROPERTY];
    if (tag && tag.name === "router") {
        return tag;
    }
    return null;
}
function isRoute(element) {
    return element.matches("route,[" + riot.__.globals.IS_DIRECTIVE + "=\"route\"]");
}
function getRoute(element) {
    var tag = parent[riot.__.globals.DOM_COMPONENT_INSTANCE_PROPERTY];
    if (tag && tag.name === "route") {
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

exports.dispatchEventOver = dispatchEventOver;
exports.getRoute = getRoute;
exports.getRouter = getRouter;
exports.isRoute = isRoute;
exports.isRouter = isRouter;
