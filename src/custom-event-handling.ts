import * as riot from "riot";

const ONBEFOREROUTE: unique symbol = Symbol("onbeforeroute");
const ONUNROUTE: unique symbol = Symbol("onunroute");
const ONROUTE: unique symbol = Symbol("onroute");
const CAPTURING_PHASE: unique symbol = Symbol("bubbling-phase");
const BUBBLING_PHASE: unique symbol = Symbol("capturing-phase");

const DOM_COMPONENT_INSTANCE_PROPERTY: unique symbol = (riot as any).__.globals.DOM_COMPONENT_INSTANCE_PROPERTY;

declare global {
    interface HTMLElement {
        [ONBEFOREROUTE]: Array<ListenerObject>
        [ONROUTE]: Array<ListenerObject>
        [ONUNROUTE]: Array<ListenerObject>

        [DOM_COMPONENT_INSTANCE_PROPERTY]: riot.RiotComponent
    }
}

// listen "beforeroute", "unroute" and "route" differently,
// limiting the handling of these events to this library
type EventListener = ((this: HTMLElement, ev: Event) => any) | {
    handleEvent(ev: Event): any
};
type ListenerObject = {
    listener: EventListener,
    useCapture: boolean
};
let destroyer: (() => void) | null = null;
export function init() {
    if (destroyer !== null) {
        return destroyer;
    }
    const HTMLElement = window.HTMLElement;

    let HTMLElementAddEventListener: typeof HTMLElement.prototype.addEventListener = HTMLElement.prototype.addEventListener;
    HTMLElement.prototype.addEventListener = function (
        type: string,
        listener: EventListener,
        options: boolean | AddEventListenerOptions = false
    ): void {
        switch (type) {
            case "beforeroute": {
                let onbeforeroute: Array<ListenerObject> = this[ONBEFOREROUTE] = this[ONBEFOREROUTE] || [];
                let useCapture: boolean = typeof options === "boolean" ? options : options ? options.capture != null : false;
                onbeforeroute.push({ listener, useCapture });
                break;
            }
            case "unroute": {
                let onunroute: Array<ListenerObject> = this[ONUNROUTE] = this[ONUNROUTE] || [];
                let useCapture: boolean = typeof options === "boolean" ? options : options ? options.capture != null : false;
                onunroute.push({ listener, useCapture });
                break;
            }
            case "route": {
                let onroute: Array<ListenerObject> = this[ONROUTE] = this[ONROUTE] || [];
                let useCapture: boolean = typeof options === "boolean" ? options : options ? options.capture != null : false;
                onroute.push({ listener, useCapture });
                break;
            }
            default: {
                return HTMLElementAddEventListener.call(this, type, listener, options);
            }
        }
    };
    let HTMLElementRemoveEventListener: typeof HTMLElement.prototype.removeEventListener = HTMLElement.prototype.removeEventListener;
    HTMLElement.prototype.removeEventListener = function (
        this: HTMLElement,
        type: string,
        listener: (this: HTMLElement, ev: Event) => any,
        options?: boolean | AddEventListenerOptions
    ): void {
        switch (type) {
            case "beforeroute": {
                let onbeforeroute: Array<ListenerObject> = this[ONBEFOREROUTE];
                if (!onbeforeroute) {
                    return;
                }
                let useCapture: boolean = typeof options === "boolean" ? options : options ? options.capture != null : false;
                let index: number = -1;
                if (!onbeforeroute.some((l, i) => {
                    if (l.listener === listener && l.useCapture === useCapture) {
                        index = i;
                        return true;
                    }
                    return false;
                })) {
                    return;
                }
                onbeforeroute.slice(index, 1);
                break;
            }
            case "unroute": {
                let onunroute: Array<ListenerObject> = this[ONUNROUTE];
                if (!onunroute) {
                    return;
                }
                let useCapture: boolean = typeof options === "boolean" ? options : options ? options.capture != null : false;
                let index: number = -1;
                if (!onunroute.some((l, i) => {
                    if (l.listener === listener && l.useCapture === useCapture) {
                        index = i;
                        return true;
                    }
                    return false;
                })) {
                    return;
                }
                onunroute.slice(index, 1);
                break;
            }
            case "route": {
                let onroute: Array<ListenerObject> = this[ONROUTE];
                if (!onroute) {
                    return;
                }
                let useCapture: boolean = typeof options === "boolean" ? options : options ? options.capture != null : false;
                let index: number = -1;
                if (!onroute.some((l, i) => {
                    if (l.listener === listener && l.useCapture === useCapture) {
                        index = i;
                        return true;
                    }
                    return false;
                })) {
                    return;
                }
                onroute.slice(index, 1);
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

export function getRouter(element: Element): any {
    if (!(element instanceof HTMLElement)) {
        return null;
    }
    let tag: any = element[DOM_COMPONENT_INSTANCE_PROPERTY];
    if (tag && tag.name === "rhm-router") {
        return tag;
    }
    return null;
}

export function getRoute(element: Element): any {
    if (!(element instanceof HTMLElement)) {
        return null;
    }
    let tag: any = element[DOM_COMPONENT_INSTANCE_PROPERTY];
    if (tag && tag.name === "rhm-route") {
        return tag;
    }
    return null;
}

export function dispatchEventOver(children: Array<Element>, event: Event, collectLoaders?: Array<any>, collectRouter?: Array<any>): void {
    // variabili per controllare se è stata richiesta l'interruzione della
    // propagazione dell'evento all'interno di un ascolatatore
    let stop: boolean = false;
    let immediateStop: boolean = false;
    // sostituisci le funzioni native per sovrascrivere
    // la modalità di propagazione dell'evento
    event.stopImmediatePropagation = function (): void {
        stop = true;
        immediateStop = true;
    };
    event.stopPropagation = function (): void {
        stop = true;
    };
    // funzione per propagare l'evento all'elemento specificato ed i suoi figli
    function propagateEvent(child: HTMLElement): boolean {
        // se l'elemento è un router, non propagare l'evento
        let routerTag: any = getRouter(child);
        if (routerTag) {
            // se è specificata la lista di collezionamento degli elementi router, aggiungere questo
            if (collectRouter != null) {
                collectRouter.push(routerTag);
            }
            return false;
        }
        let listeners: Array<ListenerObject>;
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
        let isLoader: boolean = collectLoaders != null && ((attr) => attr != null && attr !== "false")(child.getAttribute("need-loading"));
        if (isLoader) {
            child.addEventListener("load", function load(): void {
                child.removeEventListener("load", load);
                isLoader = false;
            });
        }
        if (listeners) {
            listeners.some(listener => {
                if (listener.useCapture) {
                    if (typeof listener.listener === "function") {
                        listener.listener.call(child, event);
                        return immediateStop;
                    }
                    if (typeof listener.listener !== "object" || listener.listener.handleEvent == null) {
                        return immediateStop;
                    }
                    if (typeof listener.listener.handleEvent !== "function") {
                        return immediateStop;
                    }
                    listener.listener.handleEvent(event);
                    return immediateStop;
                }
            });
        }
        // propagare l'evento ai figli del presente elemento
        if (!stop) {
            if (!Array.prototype.some.call(child.children, propagateEvent) && listeners) {
                listeners.some(listener => {
                    if (!listener.useCapture) {
                        if (typeof listener.listener === "function") {
                            listener.listener.call(child, event);
                            return immediateStop;
                        }
                        if (typeof listener.listener !== "object" || listener.listener.handleEvent == null) {
                            return immediateStop;
                        }
                        if (typeof listener.listener.handleEvent !== "function") {
                            return immediateStop;
                        }
                        listener.listener.handleEvent(event);
                        return immediateStop;
                    }
                });
            }
        }
        // se è specificata la lista di collezionamento degli elementi che hanno bisogno
        // di un caricamento ed il presente elemento dovrebbe essere tra questi, aggiungerlo
        if (isLoader) {
            collectLoaders!.push(child);
        }
        return stop;
    }
    Array.prototype.some.call(children, propagateEvent);
    // elimina le funzioni sostitutive
    // @ts-ignore
    delete event.stopImmediatePropagation;
    // @ts-ignore
    delete event.stopPropagation;
}