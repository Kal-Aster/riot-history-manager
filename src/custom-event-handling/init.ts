import { ONBEFOREROUTE, ONROUTE, ONUNROUTE } from "./constants";

const CUSTOM_EVENTS = {
  'beforeroute': ONBEFOREROUTE,
  'unroute': ONUNROUTE,
  'route': ONROUTE,
} as const;

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
        const useCapture = typeof options === "boolean" ? options : options?.capture ?? false;

        const eventSymbol = CUSTOM_EVENTS[type as keyof typeof CUSTOM_EVENTS];
        if (eventSymbol != null) {
            const handlers = this[eventSymbol] ?? (this[eventSymbol] = []);
            handlers.push({ listener, useCapture });
        } else {
            return HTMLElementAddEventListener.call(this, type, listener, options);
        }
    };

    const HTMLElementRemoveEventListener = HTMLElement.prototype.removeEventListener;
    HTMLElement.prototype.removeEventListener = function (
        type: string,
        listener: (this: HTMLElement, ev: Event) => any,
        options?: boolean | EventListenerOptions
    ) {
        const useCapture = typeof options === "boolean" ? options : options?.capture ?? false;
        
        const eventSymbol = CUSTOM_EVENTS[type as keyof typeof CUSTOM_EVENTS];
        if (eventSymbol) {
            const handlers = this[eventSymbol];
            if (handlers) {
                const index = handlers.findIndex((item) => {
                    return (
                        item.listener === listener &&
                        item.useCapture === useCapture
                    );
                });
                if (index >= 0) {
                    handlers.splice(index, 1); // Fixed: was slice in original
                }
            }
        } else {
            return HTMLElementRemoveEventListener.call(this, type, listener, options);
        }
    };

    return destroyer = () => {
        document.querySelectorAll('*').forEach((element) => {
            if (!(element instanceof HTMLElement)) {
                return;
            }

            if (element[ONBEFOREROUTE]) {
                delete element[ONBEFOREROUTE];
            }
            if (element[ONROUTE]) {
                delete element[ONROUTE];
            }
            if (element[ONUNROUTE]) {
                delete element[ONUNROUTE];
            }
        });

        HTMLElement.prototype.addEventListener = HTMLElementAddEventListener;
        HTMLElement.prototype.removeEventListener = HTMLElementRemoveEventListener;
        destroyer = null;
    };
}
