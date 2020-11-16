'use strict';

var riot = require('riot');
var misc = require('./misc-bb6a22fa.js');

function onloadingcomplete(routeComponent, currentMount, route, router, claimer) {
    if (router[misc.LAST_ROUTED] !== routeComponent) {
        return;
    }
    const currentEl = currentMount.el;
    if (misc.hasLoadingBar(claimer)) {
        misc.endLoadingBar(claimer);
    }
    router[misc.UNROUTE_METHOD]();
    // const currentElChildren = [];
    router[misc.UNROUTE_METHOD] = () => {
        const unrouteEvent = new CustomEvent("unroute", { cancelable: false, detail: { ...route } });
        misc.dispatchEventOver(routeComponent.root.children, unrouteEvent, null, []);
        // dispatchEventOver(routeComponent.root.children, unrouteEvent, null, []);
        // currentElChildren.forEach(child => {
        //     routeComponent.root.removeChild(child);
        //     currentEl.appendChild(child);
        // });
        currentMount.unmount(
            {...routeComponent[riot.__.globals.PARENT_KEY_SYMBOL], route: { ...route } },
            routeComponent[riot.__.globals.PARENT_KEY_SYMBOL]
        );
        // routeComponent.root.removeChild(currentEl);
        currentEl.style.display = "none";
        router[misc.UNROUTE_METHOD] = () => {};
    };
    currentEl.style.display = "inline-block";
    // while (currentEl.childNodes.length) {
    //     const node = currentEl.childNodes[0];
    //     currentEl.removeChild(node);
    //     routeComponent.root.appendChild(node);
    //     currentElChildren.push(node);
    // }
    const routeEvent = new CustomEvent("route", { cancelable: false, detail: { ...route } });
    misc.dispatchEventOver(currentEl.children, routeEvent, null, []);
    // dispatchEventOver(routeComponent.root.children, routeEvent, null, []);
    // currentMount.update({ ...routeComponent[__.globals.PARENT_KEY_SYMBOL], route }, routeComponent[__.globals.PARENT_KEY_SYMBOL]);
}

function onroute(routeComponent) { return (function (location, keymap, redirection) {
    const route = { location, keymap, redirection };

    const claimer = Object.create(null);
    misc.claimLoadingBar(claimer);

    const router = this[riot.__.globals.PARENT_KEY_SYMBOL].router;
    router[misc.LAST_ROUTED] = this;

    const slot = this.slots[0];
    const currentEl = document.createElement("div");
    this.root.appendChild(currentEl);
    const currentMount = riot.__.DOMBindings.template(slot.html, slot.bindings).mount(
        currentEl,
        { ...this[riot.__.globals.PARENT_KEY_SYMBOL], route: { ...route } },
        this[riot.__.globals.PARENT_KEY_SYMBOL]
    );
    currentEl.style.display = "none";
    
    const needLoading = [];
    const routerChildren = [];
    {
        const beforeRouteEvent = new CustomEvent("beforeroute", { cancelable: false, detail: { ...route } });
        misc.dispatchEventOver(currentEl.children, beforeRouteEvent, needLoading, routerChildren);
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
        const router = this[riot.__.globals.PARENT_KEY_SYMBOL].router;
        if (router == null) {
            return;
        }
        this._valid = true;

        if (this.props.redirect) {
            router[misc.ROUTER].redirect(this.props.path, this.props.redirect);
        } else {
            router[misc.ROUTER].route(this._path = this.props.path, this._onroute = onroute(this));
        }
    },

    onUnmounted() {
        if (this._onroute == null) {
            return;
        }
        this[riot.__.globlas.PARENT_KEY_SYMBOL].router[misc.ROUTER].unroute(this._path, this._onroute);
    }
  },

  'template': null,
  'name': 'route'
};

module.exports = RouteComponent;
