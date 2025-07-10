import { ONBEFOREROUTE, ONROUTE, ONUNROUTE } from "./constants";

let destroyer: (() => void) | null = null;
export default function init() {
    if (destroyer !== null) {
        return destroyer;
    }
    const { HTMLElement } = window;

    const HTMLElementAddEventListener = HTMLElement.prototype.addEventListener;
    HTMLElement.prototype.addEventListener = function (
        type: string,
        listener: EventListener,
        options: boolean | AddEventListenerOptions = false
    ) {
        const useCapture = (typeof options === "boolean" ?
            options :
            (options ?
                options.capture != null :
                false
            )
        );
        switch (type) {
            case "beforeroute": {
                const onbeforeroute = this[ONBEFOREROUTE] = this[ONBEFOREROUTE] || [];
                onbeforeroute.push({ listener, useCapture });
                break;
            }
            case "unroute": {
                const onunroute = this[ONUNROUTE] = this[ONUNROUTE] || [];
                onunroute.push({ listener, useCapture });
                break;
            }
            case "route": {
                const onroute = this[ONROUTE] = this[ONROUTE] || [];
                onroute.push({ listener, useCapture });
                break;
            }
            default: {
                return HTMLElementAddEventListener.call(this, type, listener, options);
            }
        }
    };

    const HTMLElementRemoveEventListener = HTMLElement.prototype.removeEventListener;
    HTMLElement.prototype.removeEventListener = function (
        type: string,
        listener: (this: HTMLElement, ev: Event) => any,
        options?: boolean | EventListenerOptions
    ) {
        const useCapture = (typeof options === "boolean" ?
            options :
            (options ?
                options.capture != null :
                false
            )
        );
        switch (type) {
            case "beforeroute": {
                const onbeforeroute = this[ONBEFOREROUTE];
                if (!onbeforeroute) {
                    return;
                }
                const index = onbeforeroute.findIndex((item) => {
                    return (
                        item.listener === listener &&
                        item.useCapture === useCapture
                    );
                })
                if (index < 0) {
                    return;
                }

                onbeforeroute.splice(index, 1);
                break;
            }
            case "unroute": {
                const onunroute = this[ONUNROUTE];
                if (!onunroute) {
                    return;
                }
                const index = onunroute.findIndex((item) => {
                    return (
                        item.listener === listener &&
                        item.useCapture === useCapture
                    );
                })
                if (index < 0) {
                    return;
                }

                onunroute.splice(index, 1);
                break;
            }
            case "route": {
                const onroute = this[ONROUTE];
                if (!onroute) {
                    return;
                }
                const index = onroute.findIndex((item) => {
                    return (
                        item.listener === listener &&
                        item.useCapture === useCapture
                    );
                })
                if (index < 0) {
                    return;
                }

                onroute.splice(index, 1);
                break;
            }
            default: {
                return HTMLElementRemoveEventListener.call(this, type, listener, options);
            }
        }
    };

    return destroyer = () => {
        HTMLElement.prototype.addEventListener = HTMLElementAddEventListener;
        HTMLElement.prototype.removeEventListener = HTMLElementRemoveEventListener;
        destroyer = null;
    };
}
