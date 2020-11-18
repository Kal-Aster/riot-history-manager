define(['exports'], function (exports) { 'use strict';

    var ROUTER = Symbol("router");
    var IS_ROUTER = Symbol("is-router");
    var UNROUTE_METHOD = Symbol("unroute");
    var LAST_ROUTED = Symbol("last-routed");

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
    function claimed(claimer) {
        return claimer != null && claimer === actualClaimedBy;
    }
    function release(claimer) {
        if (claimer == null || actualClaimedBy !== claimer) {
            return;
        }
        loadingDone = true;
    }

    exports.IS_ROUTER = IS_ROUTER;
    exports.LAST_ROUTED = LAST_ROUTED;
    exports.ROUTER = ROUTER;
    exports.UNROUTE_METHOD = UNROUTE_METHOD;
    exports.claim = claim;
    exports.claimed = claimed;
    exports.release = release;

});
