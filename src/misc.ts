// @ts-ignore
import * as riot from "riot";

export const DOM_COMPONENT_INSTANCE_PROPERTY: unique symbol = (riot as any).__.globals.DOM_COMPONENT_INSTANCE_PROPERTY;

export const ROUTER: unique symbol = Symbol("router");
export const BASE: unique symbol = Symbol("base");
export const PARENT_ROUTE: unique symbol = Symbol("parent_route");
export const PARENT_ROUTER: unique symbol = Symbol("parent-router");

export const UNROUTE_METHOD: unique symbol = Symbol("unroute");

export const LAST_ROUTED: unique symbol = Symbol("last-routed");

const ONBEFOREROUTE: unique symbol = Symbol("onbeforeroute");
const ONUNROUTE: unique symbol = Symbol("onunroute");
const ONROUTE: unique symbol = Symbol("onroute");
const CAPTURING_PHASE: unique symbol = Symbol("bubbling-phase");
const BUBBLING_PHASE: unique symbol = Symbol("capturing-phase");

// ascolta gli eventi "beforeroute", "unroute" e "route" diversamente,
// ovvero non rendendo disponibili all'emissione da parte di librerie
// diverse da questa.
type EventListener = (this: HTMLElement, ev: Event) => any;
type ListenerObject = {
    listener: EventListener,
    useCapture: boolean
};
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

export function isRouter(element: Element): any {
    return element.matches("router,[" + (riot as any).__.globals.IS_DIRECTIVE + "=\"router\"]");
}
export function getRouter(element: Element): any {
    let tag: any = parent[DOM_COMPONENT_INSTANCE_PROPERTY];
    if (tag && tag.name === "router") {
        return tag;
    }
    return null;
}

export function isRoute(element: Element): any {
    return element.matches("route,[" + (riot as any).__.globals.IS_DIRECTIVE + "=\"route\"]");
}
export function getRoute(element: Element): any {
    let tag: any = parent[DOM_COMPONENT_INSTANCE_PROPERTY];
    if (tag && tag.name === "route") {
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
        let isLoader: boolean = collectLoaders != null && child.matches("[need-loading]:not([need-loading='false'])");
        if (isLoader) {
            child.addEventListener("load", function load(): void {
                child.removeEventListener("load", load);
                isLoader = false;
            });
        }
        if (listeners) {
            listeners.some(listener => {
                if (listener.useCapture) {
                    listener.listener.call(child, event);
                    return immediateStop;
                }
            });
        }
        // propagare l'evento ai figli del presente elemento
        if (!stop) {
            if (!Array.prototype.some.call(child.children, propagateEvent) && listeners) {
                listeners.some(listener => {
                    if (!listener.useCapture) {
                        listener.listener.call(child, event);
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

// crea la barra di caricamento
let loadingBar: HTMLElement = document.body.appendChild(document.createElement("div"));
let loadingBarContainer: HTMLElement = document.body.appendChild(document.createElement("div"));
loadingBarContainer.setAttribute(
    "style",
    "position: fixed; top: 0; left: 0; right: 0; height: 4px; z-index: 101; background: rgba(250, 120, 30, .5); display: none;"
);
loadingBar = loadingBarContainer.appendChild(document.createElement("div"));
loadingBar.setAttribute(
    "style",
    "height: 100%; width: 100%; background: rgb(250, 120, 30) none repeat scroll 0% 0%; transform-origin: center left;"
);
let actualClaimedBy: any = null;
let nextFrame: number = -1;
let loadingProgress: number = 0;
let loadingDone: boolean = false;
// velocità della barra, in funzione del progresso, finchè non è stato ancora terminato il caricamento
let progressVel: (progress: number) => number = (progress) => {
    return (8192 - (1.08 * progress * progress)) / 819.2;
};
// tempo di visibilità della barra, da quando ha il progresso è completo
const visibilityTime: number = 300;
let doneTime: number = visibilityTime;
function startLoading(): void {
    // se era già previsto un aggiornamento della barra, annullarlo
    if (nextFrame) {
        cancelAnimationFrame(nextFrame);
    }
    let lastTime: number;
    let step: () => void = () => {
        if (loadingDone && loadingProgress === 5) {
            loadingProgress = 100;
            loadingBarContainer.style.display = "none";
            window.dispatchEvent(new Event("routerload"));
            return;
        }
        let last: number = lastTime;
        let delta: number = ((lastTime = Date.now()) - last);
        // se il progresso della barra è completo, attendere che passi il tempo previsto prima di nasconderla
        if (loadingProgress >= 100) {
            if ((doneTime -= delta) <= 0) {
                doneTime = visibilityTime;
                loadingBarContainer.style.display = "none";
                window.dispatchEvent(new Event("routerload"));
            } else {
                requestAnimationFrame(step);
            }
            return;
        }
        // se il caricamento è determinato, aggiungere un valore fisso per raggiungere il completamento
        // altrimenti richiedere la velocità alla funzione designata
        if (loadingDone) {
            loadingProgress += delta;
        } else {
            loadingProgress += delta * progressVel(loadingProgress) / 100;
        }
        // applicare il progresso
        loadingBar.style.transform = "scaleX(" + (loadingProgress / 100) + ")";
        // richiedere il prossimo aggiornamento della barra
        nextFrame = requestAnimationFrame(step);
    };
    // visualizzare la barra
    loadingBarContainer.style.display = "block";
    lastTime = Date.now();
    step();
}
let lastClaim: number;
export function claimLoadingBar(claimer: any): void {
    if (claimer == null) {
        return;
    }
    // ricomincia il progresso della barra, gestita da un altro processo
    actualClaimedBy = claimer;
    loadingProgress = 5;
    loadingDone = false;
    lastClaim = Date.now();
    startLoading();
}
export function hasLoadingBar(claimer: any): boolean {
    return claimer != null && claimer === actualClaimedBy;
}
export function endLoadingBar(claimer: any): void {
    // se chi ha chiamato questa funzione è lo stesso che ha chiamato
    // per ultimo la funzione precedente, allora termina il caricamento
    if (claimer == null || actualClaimedBy !== claimer) {
        return;
    }
    console.log("claim end at", Date.now() - lastClaim + "ms");
    loadingDone = true;
}