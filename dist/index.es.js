import { Router, URLManager, HistoryManager } from 'history-manager';
import * as riot from 'riot';
import { __, register } from 'riot';

let loadingBar = null;
let loadingBarContainer = null;
function getLoadingElements() {
    let container = loadingBarContainer;
    if (container === null) {
        (container = loadingBarContainer = document.body.appendChild(document.createElement("div"))).setAttribute("style", "position: fixed; top: 0; left: 0; right: 0; height: 4px; z-index: 999999; background: rgba(250, 120, 30, .5); display: none;");
    }
    let bar = loadingBar;
    if (bar === null) {
        (bar = loadingBar = container.appendChild(document.createElement("div"))).setAttribute("style", "height: 100%; width: 100%; background: rgb(250, 120, 30) none repeat scroll 0% 0%; transform-origin: center left;");
    }
    return {
        container: container,
        bar: bar
    };
}
let actualClaimedBy = null;
let nextFrame = -1;
let loadingProgress = 0;
let loadingDone = false;
// velocità della barra, in funzione del progresso, finchè non è stato ancora terminato il caricamento
let progressVel = (progress) => {
    return (8192 - (1.08 * progress * progress)) / 819.2;
};
// tempo di visibilità della barra, da quando ha il progresso è completo
const visibilityTime = 300;
let doneTime = visibilityTime;
let claimedWhenVisible = 0;
function dispatchRouterLoad() {
    document.dispatchEvent(new Event("routerload", { bubbles: true, cancelable: false }));
}
function startLoading() {
    // se era già previsto un aggiornamento della barra, annullarlo
    if (nextFrame) {
        cancelAnimationFrame(nextFrame);
    }
    let lastTime;
    let eventDispatched = false;
    const { container: loadingBarContainer, bar: loadingBar } = getLoadingElements();
    let step = () => {
        nextFrame = -1;
        if (loadingDone && loadingProgress === 5 && claimedWhenVisible === 5) {
            loadingProgress = 100;
            loadingBarContainer.style.display = "none";
            dispatchRouterLoad();
            return;
        }
        let last = lastTime;
        let delta = ((lastTime = Date.now()) - last);
        // se il progresso della barra è completo, attendere che passi il tempo previsto prima di nasconderla
        if (loadingProgress >= 100) {
            if (!eventDispatched) {
                dispatchRouterLoad();
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
        // se il caricamento è determinato, aggiungere un valore fisso per raggiungere il completamento
        // altrimenti richiedere la velocità alla funzione designata
        if (loadingDone) {
            loadingProgress += delta / 2;
        }
        else {
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
function claim(claimer) {
    if (claimer == null) {
        return;
    }
    // ricomincia il progresso della barra, gestita da un altro processo
    actualClaimedBy = claimer;
    claimedWhenVisible = getLoadingElements().container.style.display === "block" ? loadingProgress : 5;
    loadingProgress = 5;
    loadingDone = false;
    startLoading();
}
function claimedBy(claimer) {
    return claimer != null && claimer === actualClaimedBy;
}
const claimed = claimedBy;
function release(claimer) {
    // se chi ha chiamato questa funzione è lo stesso che ha chiamato
    // per ultimo la funzione precedente, allora termina il caricamento
    if (claimer == null || actualClaimedBy !== claimer) {
        return;
    }
    // console.log("claim end at", Date.now() - lastClaim + "ms");
    loadingDone = true;
}
function isLoading() {
    return nextFrame !== -1;
}
const rgbRegex = /^\s*rgb\s*\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\)\s*$/;
const shortHexRegex = /^\s*#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])\s*$/;
const hexRegex = /^\s*#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})\s*$/;
function applyColor(r, g, b) {
    const { container: loadingBarContainer, bar: loadingBar } = getLoadingElements();
    loadingBar.style.background = `rgb(${r},${g},${b})`;
    loadingBarContainer.style.background = `rgb(${r},${g},${b},0.5)`;
}
function setColor(color) {
    if (typeof color !== "string") {
        throw new TypeError("color must be string");
    }
    let match = color.match(rgbRegex);
    if (match != null) {
        const r = parseFloat(match[1]);
        const g = parseFloat(match[2]);
        const b = parseFloat(match[3]);
        if (r > 255 || g > 255 || b > 255) {
            throw new TypeError("invalid color rgb arguments");
        }
        applyColor(r, g, b);
        return;
    }
    match = color.match(shortHexRegex);
    if (match != null) {
        color = "#" + match[1].repeat(2) + match[2].repeat(2) + match[3].repeat(2);
    }
    match = color.match(hexRegex);
    if (match != null) {
        const r = parseInt(match[1], 16);
        const g = parseInt(match[2], 16);
        const b = parseInt(match[3], 16);
        applyColor(r, g, b);
        return;
    }
    throw new TypeError("invalid color format");
}

var loadingBar$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    claim: claim,
    claimedBy: claimedBy,
    claimed: claimed,
    release: release,
    isLoading: isLoading,
    setColor: setColor
});

var RhmNavigate = {
  'css': `rhm-navigate a[ref=-navigate-a],[is="rhm-navigate"] a[ref=-navigate-a]{ color: inherit; text-decoration: none; outline: none; }`,

  'exports': {
    onMounted() {
        this.root.style.cursor = "pointer";
        if (this.root.style.display === "") {
            this.root.style.display = "inline";
        }

        this.root.setAttribute("route-listener", "true");
        this.root.addEventListener("route", () => {
            this.update();
        });
        
        this.root.firstElementChild.addEventListener("click", event => {
            event.preventDefault();
            let href = this.href(false);
            if (href != null) {
                Router.go(href, { replace: this.replace() });
            } else {
                let context = this.context();
                if (context) {
                    Router.restoreContext(context);
                }
            }
            return false;
        });
    },

    onBeforeUpdate() {
        this._href = null;
    },

    replace() {
        if (typeof this.props.replace !== "boolean") {
            return (this.props.replace != null && this.props.replace !== "false") || this.props.replace === "";
        }
        return this.props.replace;
    },

    href(toA = true) {
        if (typeof this.props.href !== "string") {
            if (toA) {
                const context = this.context();
                return context != null ? Router.getContextDefaultOf(context) : null;
            }
            return null;
        }
        if (this._href == null) {
            this._href = Router.getLocation().hrefIf(this.props.href);
            // console.log("got href", this._href, "from", this.props.href, "and", Router.location.href, this.root);
        }
        return toA ? URLManager.construct(this._href, true) : this._href; // (toA ? Router.base : "") + this._href;
    },

    context() {
        if (typeof this.props.context !== "string") {
            return null;
        }
        return this.props.context;
    }
  },

  'template': function(
    template,
    expressionTypes,
    bindingTypes,
    getComponent
  ) {
    return template(
      '<a expr1="expr1" ref="-navigate-a"><slot expr2="expr2"></slot></a>',
      [
        {
          'redundantAttribute': 'expr1',
          'selector': '[expr1]',

          'expressions': [
            {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'href',

              'evaluate': function(
                _scope
              ) {
                return _scope.href();
              }
            },
            {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'style',

              'evaluate': function(
                _scope
              ) {
                return [
                  'display: ',
                  _scope.root.style.display,
                  '; width: 100%; height: 100%;'
                ].join(
                  ''
                );
              }
            }
          ]
        },
        {
          'type': bindingTypes.SLOT,
          'attributes': [],
          'name': 'default',
          'redundantAttribute': 'expr2',
          'selector': '[expr2]'
        }
      ]
    );
  },

  'name': 'rhm-navigate'
};

const ROUTER = Symbol("router");
const UNROUTE_METHOD = Symbol("unroute");
const LAST_ROUTED = Symbol("last-routed");
const ROUTE_PLACEHOLDER = Symbol("route-placeholder");
const IS_UNMOUNTING = Symbol("is-unmounting");

const noop = () => { };

var RhmRouter = {
  'css': null,

  'exports': {
    [IS_UNMOUNTING]: false,
    _mounted: false,

    _refesh() {
        this[ROUTER].destroy();
        const router = this[ROUTER] = Router.create();
        Array.prototype.forEach.call(this.root.querySelectorAll("rhm-route"), route => {
            route[__.globals.DOM_COMPONENT_INSTANCE_PROPERTY]._setup();
        });
        router.route("(.*)", (location, ) => {
            claim(this); release(this);
            this[LAST_ROUTED] = null;
            this[UNROUTE_METHOD]();
            this[UNROUTE_METHOD] = noop;
        });
        // it should check if LAST_ROUTED would be the same,
        // if so it should not emit
        router.emit();
    },

    getSelfSlotProp() {
        return { [ROUTER]: this };
    },

    isMounted() {
        return this._mounted;
    },

    onBeforeMount() {
        this[UNROUTE_METHOD] = noop;
        this[ROUTER] = Router.create();
    },

    onMounted() {
        this[ROUTER].route("(.*)", (location, ) => {
            claim(this); release(this);
            this[LAST_ROUTED] = null;
            this[UNROUTE_METHOD]();
            this[UNROUTE_METHOD] = noop;
        });

        this._mounted = true;

        if (HistoryManager.isStarted()) {
            this[ROUTER].emit();
        }
    },

    onBeforeUnmount() {
        this[IS_UNMOUNTING] = true;
    },

    onUnmounted() {
        this[IS_UNMOUNTING] = false;

        this[LAST_ROUTED] = null;
        this[UNROUTE_METHOD] = noop;
        this[ROUTER].destroy();
        this[ROUTER] = null;

        this._mounted = false;
    },

    [LAST_ROUTED]: null
  },

  'template': function(
    template,
    expressionTypes,
    bindingTypes,
    getComponent
  ) {
    return template(
      '<slot expr0="expr0"></slot>',
      [
        {
          'type': bindingTypes.SLOT,

          'attributes': [
            {
              'type': expressionTypes.ATTRIBUTE,
              'name': null,

              'evaluate': function(
                _scope
              ) {
                return _scope.getSelfSlotProp();
              }
            }
          ],

          'name': 'default',
          'redundantAttribute': 'expr0',
          'selector': '[expr0]'
        }
      ]
    );
  },

  'name': 'rhm-router'
};

const ONBEFOREROUTE = Symbol("onbeforeroute");
const ONUNROUTE = Symbol("onunroute");
const ONROUTE = Symbol("onroute");
const DOM_COMPONENT_INSTANCE_PROPERTY = riot.__.globals.DOM_COMPONENT_INSTANCE_PROPERTY;
function getRouter(element) {
    if (!(element instanceof HTMLElement)) {
        return null;
    }
    let tag = element[DOM_COMPONENT_INSTANCE_PROPERTY];
    if (tag && tag.name === "rhm-router") {
        return tag;
    }
    return null;
}
function dispatchEventOver(children, event, collectLoaders, collectRouter) {
    // variabili per controllare se è stata richiesta l'interruzione della
    // propagazione dell'evento all'interno di un ascolatatore
    let stop = false;
    let immediateStop = false;
    // sostituisci le funzioni native per sovrascrivere
    // la modalità di propagazione dell'evento
    event.stopImmediatePropagation = function () {
        stop = true;
        immediateStop = true;
    };
    event.stopPropagation = function () {
        stop = true;
    };
    // funzione per propagare l'evento all'elemento specificato ed i suoi figli
    function propagateEvent(child) {
        // se l'elemento è un router, non propagare l'evento
        let routerTag = getRouter(child);
        if (routerTag) {
            // se è specificata la lista di collezionamento degli elementi router, aggiungere questo
            if (collectRouter != null) {
                collectRouter.push(routerTag);
            }
            return false;
        }
        let listeners;
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
        let isLoader = collectLoaders != null && ((attr) => attr != null && attr !== "false")(child.getAttribute("need-loading"));
        if (isLoader) {
            child.addEventListener("load", function load() {
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
            collectLoaders.push(child);
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

function onunroute(routeComponent, currentMount, route, router, shouldFireEvent, shouldResetUnroute) {
    const currentEl = currentMount.el;
    {
        if (shouldFireEvent) {
            const unrouteEvent = new CustomEvent("unroute", { cancelable: false, detail: {
                location: route.location,
                keymap: route.keymap,
                redirection: route.redirection
            } });
            dispatchEventOver(routeComponent.root.children, unrouteEvent, null, []);
        }
        const scope = Object.create(routeComponent[__.globals.PARENT_KEY_SYMBOL], { route: { value: {
            location: route.location,
            keymap: route.keymap,
            redirection: route.redirection
        } } });
        currentMount.unmount( scope, routeComponent[__.globals.PARENT_KEY_SYMBOL] );
    }
    // if want to keep some route for faster loading, just `display: none` the element?
    // currentEl.style.display = "none";
    routeComponent.root.removeChild(currentEl);
    if (shouldResetUnroute) {
        router[UNROUTE_METHOD] = () => {};
    }
}

function onloadingcomplete(routeComponent, currentMount, route, router, claimer) {
    if (router[LAST_ROUTED] !== routeComponent) {
        onunroute(routeComponent, currentMount, route, router, false, false);
        return;
    }
    const currentEl = currentMount.el;
    if (claimed(claimer)) {
        release(claimer);
    }
    const routerUNROUTE = router[UNROUTE_METHOD];
    let reachedRouterLoad = false;
    let unrouted = false;
    const thisUNROUTE = () => {
        if (unrouted) {
            return;
        }
        unrouted = true;
        onunroute(routeComponent, currentMount, route, router, reachedRouterLoad, reachedRouterLoad);
    };
    router[UNROUTE_METHOD] = () => {
        window.removeEventListener("routerload", onrouterload, true);
        routerUNROUTE();
        thisUNROUTE();
    };

    window.addEventListener("routerload", onrouterload, true);

    function onrouterload() {
        window.removeEventListener("routerload", onrouterload, true);
        reachedRouterLoad = true;
        routerUNROUTE();
        router[UNROUTE_METHOD] = thisUNROUTE;
        currentEl.style.display = "block";
        if (typeof routeComponent.props.title === "string") {
            document.title = routeComponent.props.title;
        }
        {
            const routeEvent = new CustomEvent("route", { cancelable: false, detail: {
                location: route.location,
                keymap: route.keymap,
                redirection: route.redirection
            } });
            dispatchEventOver(currentEl.children, routeEvent, null, []);
        }
    }
}

function onroute(routeComponent) { return (function (location, keymap, redirection) {
    const route = { location, keymap, redirection };

    const claimer = Object.create(null);
    claim(claimer);

    const router = this[ROUTER];
    router[LAST_ROUTED] = this;

    const slot = this.slots[0];
    const currentEl = document.createElement("div");
    this.root.appendChild(currentEl);
    const currentMount = __.DOMBindings.template(slot.html, slot.bindings).mount(
        currentEl,
        Object.create(this[__.globals.PARENT_KEY_SYMBOL], { route: { value: { location, keymap, redirection } } }),
        this[__.globals.PARENT_KEY_SYMBOL]
    );
    currentEl.style.display = "none";
    
    const needLoading = [];
    const routerChildren = [];
    {
        const beforeRouteEvent = new CustomEvent("beforeroute", {
            cancelable: false, detail: { location, keymap, redirection }
        });
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

var RhmRoute = {
  'css': null,

  'exports': {
    [IS_UNMOUNTING]: false,
    _valid: false,
    _onroute: null,
    _path: null,

    _setup() {
        if (!this._valid || this[IS_UNMOUNTING]) {
            return;
        }
        const router = this[ROUTER][ROUTER];

        if (this.props.redirect) {
            router.redirect(this.props.path, this.props.redirect);
        } else {
            router.route(this._path = this.props.path, this._onroute = onroute(this));
        }
    },

    onBeforeMount() {
    },

    onMounted() {
        this.root.removeAttribute("title");

        this[ROUTE_PLACEHOLDER] = this.root; // document.createComment("");
        // this.root.replaceWith(placeholder);
        const router = this[__.globals.PARENT_KEY_SYMBOL][ROUTER];
        if (router == null) {
            return;
        }
        this._valid = true;
        this[ROUTER] = router;

        if (router.isMounted()) {
            router._refesh();
        } else {
            this._setup();
        }
    },

    onBeforeUnmount() {
        this[IS_UNMOUNTING] = true;
        // this[ROUTE_PLACEHOLDER].replaceWith(this.root);
    },

    onUnmounted() {
        if (this._valid) {
            // console.log(this.root.parentElement);
            const router = this[__.globals.PARENT_KEY_SYMBOL][ROUTER];
            if (router[IS_UNMOUNTING]) {
                return;
            }
            if (router[LAST_ROUTED] === this) {
                router._refesh();
            } else {
                router[ROUTER].unroute(this._path);
            }
        }

        this[IS_UNMOUNTING] = false;
    },

    onUpdated() {
        this.root.removeAttribute("title");
    }
  },

  'template': null,
  'name': 'rhm-route'
};

/**
 * Giuliano Collacchioni: 2019
 */
register("rhm-navigate", RhmNavigate);
register("rhm-router", RhmRouter);
register("rhm-route", RhmRoute);
// tslint:disable-next-line:typedef
const components = {
    RhmNavigate,
    RhmRouter,
    RhmRoute
};

export { components, loadingBar$1 as loadingBar };
