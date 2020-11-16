'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

exports.claim = claim;
exports.claimed = claimed;
exports.release = release;
