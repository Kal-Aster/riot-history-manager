define(['exports', 'riot'], function (exports, riot) { 'use strict';

    var DOM_COMPONENT_INSTANCE_PROPERTY = riot.__.globals.DOM_COMPONENT_INSTANCE_PROPERTY;
    var ROUTER = Symbol("router");
    var BASE = Symbol("base");
    var PARENT_ROUTE = Symbol("parent_route");
    var PARENT_ROUTER = Symbol("parent-router");
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
    function isRouter(element) {
        return element.matches("router,[" + riot.__.globals.IS_DIRECTIVE + "=\"router\"]");
    }
    function getRouter(element) {
        var tag = parent[DOM_COMPONENT_INSTANCE_PROPERTY];
        if (tag && tag.name === "router") {
            return tag;
        }
        return null;
    }
    function isRoute(element) {
        return element.matches("route,[" + riot.__.globals.IS_DIRECTIVE + "=\"route\"]");
    }
    function getRoute(element) {
        var tag = parent[DOM_COMPONENT_INSTANCE_PROPERTY];
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
    function claimLoadingBar(claimer) {
        if (claimer == null) {
            return;
        }
        actualClaimedBy = claimer;
        loadingProgress = 5;
        loadingDone = false;
        startLoading();
    }
    function hasLoadingBar(claimer) {
        return claimer != null && claimer === actualClaimedBy;
    }
    function endLoadingBar(claimer) {
        if (claimer == null || actualClaimedBy !== claimer) {
            return;
        }
        loadingDone = true;
    }

    exports.BASE = BASE;
    exports.DOM_COMPONENT_INSTANCE_PROPERTY = DOM_COMPONENT_INSTANCE_PROPERTY;
    exports.LAST_ROUTED = LAST_ROUTED;
    exports.PARENT_ROUTE = PARENT_ROUTE;
    exports.PARENT_ROUTER = PARENT_ROUTER;
    exports.ROUTER = ROUTER;
    exports.UNROUTE_METHOD = UNROUTE_METHOD;
    exports.claimLoadingBar = claimLoadingBar;
    exports.dispatchEventOver = dispatchEventOver;
    exports.endLoadingBar = endLoadingBar;
    exports.getRoute = getRoute;
    exports.getRouter = getRouter;
    exports.hasLoadingBar = hasLoadingBar;
    exports.isRoute = isRoute;
    exports.isRouter = isRouter;

    Object.defineProperty(exports, '__esModule', { value: true });

});
