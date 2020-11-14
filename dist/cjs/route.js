'use strict';

var riot = require('riot');
var misc = require('./misc-bb6a22fa.js');

function onroute(routeComponent) { return (function (location, keymap, redirection) {
    const route = { location, keymap, redirection };

    const claimer = Object.create(null);
    misc.claimLoadingBar(claimer);

    const router = this[riot.__.globals.PARENT_KEY_SYMBOL].router;
    router[misc.LAST_ROUTED] = this;

    const slot = this.slots[0];
    const currentEl = document.createElement("div");
    const currentMount = riot.__.DOMBindings.template(slot.html, slot.bindings).mount(
        currentEl,
        { ...this[riot.__.globals.PARENT_KEY_SYMBOL], route },
        this[riot.__.globals.PARENT_KEY_SYMBOL]
    );
    const onloadingcomplete = () => {
        if (router[misc.LAST_ROUTED] !== this) {
            return;
        }
        if (misc.hasLoadingBar(claimer)) {
            misc.endLoadingBar(claimer);
        }
        router[misc.UNROUTE_METHOD]();
        const currentElChildren = [];
        router[misc.UNROUTE_METHOD] = () => {
            const unrouteEvent = new CustomEvent("unroute", { cancelable: false, detail: {
                location, keymap, redirection
            } });
            misc.dispatchEventOver(this.root.children, unrouteEvent, null, []);
            currentElChildren.forEach(child => {
                this.root.removeChild(child);
                currentEl.appendChild(child);
            });
            currentMount.unmount();
        };
        while (currentEl.childNodes.length) {
            const node = currentEl.childNodes[0];
            currentEl.removeChild(node);
            this.root.appendChild(node);
            currentElChildren.push(node);
        }
        const routeEvent = new CustomEvent("route", { cancelable: false, detail: {
            location, keymap, redirection
        } });
        misc.dispatchEventOver(this.root.children, routeEvent, null, []);
        currentMount.update();
    };
    
    const needLoading = [];
    const routerChildren = [];
    {
        const beforeRouteEvent = new CustomEvent("beforeroute", { cancelable: false, detail: {
            location, keymap, redirection
        } });
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
                    if (--loaded <= 0) { onloadingcomplete(); }
                };
                return fn;
            };
            el.addEventListener("load", onload(el));
        });
    } else {
        onloadingcomplete();
    }
}).bind(routeComponent); }

var RouteComponent = {
  'css': null,

  'exports': {
    _valid: false,

    onMounted() {
        const router = this[riot.__.globals.PARENT_KEY_SYMBOL].router;
        if (router == null) {
            return;
        }
        this._valid = true;

        if (this.props.redirect) {
            router[misc.ROUTER].redirect(this.props.path, this.props.redirect);
        } else {
            router[misc.ROUTER].route(this.props.path, onroute(this));
        }
    }
  },

  'template': null,
  'name': 'route'
};

module.exports = RouteComponent;
