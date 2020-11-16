import { __ } from 'riot';
import { R as ROUTER, c as claimLoadingBar, L as LAST_ROUTED, d as dispatchEventOver, U as UNROUTE_METHOD, h as hasLoadingBar, e as endLoadingBar } from './misc-6bdf283c.js';

function onloadingcomplete(routeComponent, currentMount, route, router, claimer) {
    if (router[LAST_ROUTED] !== routeComponent) {
        return;
    }
    const currentEl = currentMount.el;
    if (hasLoadingBar(claimer)) {
        endLoadingBar(claimer);
    }
    router[UNROUTE_METHOD]();
    // const currentElChildren = [];
    router[UNROUTE_METHOD] = () => {
        const unrouteEvent = new CustomEvent("unroute", { cancelable: false, detail: { ...route } });
        dispatchEventOver(routeComponent.root.children, unrouteEvent, null, []);
        // dispatchEventOver(routeComponent.root.children, unrouteEvent, null, []);
        // currentElChildren.forEach(child => {
        //     routeComponent.root.removeChild(child);
        //     currentEl.appendChild(child);
        // });
        currentMount.unmount(
            {...routeComponent[__.globals.PARENT_KEY_SYMBOL], route: { ...route } },
            routeComponent[__.globals.PARENT_KEY_SYMBOL]
        );
        // routeComponent.root.removeChild(currentEl);
        currentEl.style.display = "none";
        router[UNROUTE_METHOD] = () => {};
    };
    currentEl.style.display = "inline-block";
    // while (currentEl.childNodes.length) {
    //     const node = currentEl.childNodes[0];
    //     currentEl.removeChild(node);
    //     routeComponent.root.appendChild(node);
    //     currentElChildren.push(node);
    // }
    const routeEvent = new CustomEvent("route", { cancelable: false, detail: { ...route } });
    dispatchEventOver(currentEl.children, routeEvent, null, []);
    // dispatchEventOver(routeComponent.root.children, routeEvent, null, []);
    // currentMount.update({ ...routeComponent[__.globals.PARENT_KEY_SYMBOL], route }, routeComponent[__.globals.PARENT_KEY_SYMBOL]);
}

function onroute(routeComponent) { return (function (location, keymap, redirection) {
    const route = { location, keymap, redirection };

    const claimer = Object.create(null);
    claimLoadingBar(claimer);

    const router = this[__.globals.PARENT_KEY_SYMBOL].router;
    router[LAST_ROUTED] = this;

    const slot = this.slots[0];
    const currentEl = document.createElement("div");
    this.root.appendChild(currentEl);
    const currentMount = __.DOMBindings.template(slot.html, slot.bindings).mount(
        currentEl,
        { ...this[__.globals.PARENT_KEY_SYMBOL], route: { ...route } },
        this[__.globals.PARENT_KEY_SYMBOL]
    );
    currentEl.style.display = "none";
    
    const needLoading = [];
    const routerChildren = [];
    {
        const beforeRouteEvent = new CustomEvent("beforeroute", { cancelable: false, detail: { ...route } });
        dispatchEventOver(currentEl.children, beforeRouteEvent, needLoading, routerChildren);
    }
    if (needLoading.length > 0) {
        let loaded = 0;
        needLoading.forEach(el => {
            loaded++;
            const onload = el => {
                const fn = () => {
                    el.removeEventListener("load", fn);
                    Array.prototype.forEach.call(
                        currentEl.querySelectorAll("[need-loading]:not([need-loading='false'])"),
                        el => {
                            if (needLoading.some(other => other === el)) { return; }
                            needLoading.push(el);
                            loaded++;
                            el.addEventListener("load", onload(el));
                        }
                    );
                    if (--loaded <= 0) {
                        onloadingcomplete(routeComponent, currentMount, route, router, claimer);
                    }
                };
                return fn;
            };
            el.addEventListener("load", onload(el));
        });
    } else {
        onloadingcomplete(routeComponent, currentMount, route, router, claimer);
    }
}).bind(routeComponent); }

var RouteComponent = {
  'css': null,

  'exports': {
    _valid: false,
    _onroute: null,
    _path: null,

    onMounted() {
        const router = this[__.globals.PARENT_KEY_SYMBOL].router;
        if (router == null) {
            return;
        }
        this._valid = true;

        if (this.props.redirect) {
            router[ROUTER].redirect(this.props.path, this.props.redirect);
        } else {
            router[ROUTER].route(this._path = this.props.path, this._onroute = onroute(this));
        }
    },

    onUnmounted() {
        if (this._onroute == null) {
            return;
        }
        this[__.globlas.PARENT_KEY_SYMBOL].router[ROUTER].unroute(this._path, this._onroute);
    }
  },

  'template': null,
  'name': 'route'
};

export default RouteComponent;
