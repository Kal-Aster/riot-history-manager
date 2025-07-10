import { RiotComponent } from "riot";
import { ONBEFOREROUTE, ONROUTE, ONUNROUTE } from "./constants";
import getRouter from "./getRouter";

export default function dispatchEventOver(
    children: Iterable<Element>,
    event: Event,
    collectLoaders?: Array<HTMLElement>,
    collectRouter?: Array<RiotComponent>,
) {
    let stop = false;
    let immediateStop = false;
    event.stopImmediatePropagation = function () {
        stop = true;
        immediateStop = true;
    };
    event.stopPropagation = function () {
        stop = true;
    };

    function propagateEvent(child: Element) {
        if (!(child instanceof HTMLElement)) {
            return false;
        }

        const routerTag = getRouter(child);
        if (routerTag != null) {
            if (collectRouter != null) {
                collectRouter.push(routerTag);
            }
            return false;
        }
        const listeners = (() => {
            switch (event.type) {
                case "beforeroute": {
                    return child[ONBEFOREROUTE];
                }
                case "unroute": {
                    return child[ONUNROUTE];
                }
                case "route": {
                    return child[ONROUTE];
                }
                default: {
                    return null;
                }
            }
        })();

        let isLoader = (
            collectLoaders != null &&
            ((attr) => {
                return (
                    attr != null &&
                    attr !== "false"
                );
            })(child.getAttribute("need-loading"))
        );
        if (isLoader) {
            child.addEventListener("load", function load() {
                child.removeEventListener("load", load);
                isLoader = false;
            });
        }

        listeners?.some(({ listener, useCapture }) => {
            if (!useCapture) {
                return false;
            }

            if (typeof listener === "function") {
                listener.call(child, event);
                return immediateStop;
            }

            if (
                typeof listener !== "object" ||
                listener.handleEvent == null
            ) {
                return false;
            }

            if (typeof listener.handleEvent !== "function") {
                return false;
            }

            listener.handleEvent(event);
            return immediateStop;
        });

        if (!stop) {
            if (!Array.prototype.some.call(child.children, propagateEvent)) {
                listeners?.some(({ listener, useCapture }) => {
                    if (useCapture) {
                        return false;
                    }

                    if (typeof listener === "function") {
                        listener.call(child, event);
                        return immediateStop;
                    }

                    if (
                        typeof listener !== "object" ||
                        listener.handleEvent == null
                    ) {
                        return false;
                    }

                    if (typeof listener.handleEvent !== "function") {
                        return false;
                    }

                    listener.handleEvent(event);
                    return immediateStop;
                });
            }
        }

        if (isLoader) {
            collectLoaders!.push(child);
        }
        return stop;
    }

    Array.prototype.some.call(children, propagateEvent);
    // @ts-ignore
    delete event.stopImmediatePropagation;
    // @ts-ignore
    delete event.stopPropagation;
}