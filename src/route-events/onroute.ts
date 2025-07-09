// @ts-expect-error
import { insertBefore } from "@riotjs/util";
import { __, RiotComponent } from "riot";

import {
  LAST_ROUTED,
  PARENT_KEY_SYMBOL,
  ROUTER,
  TEST_LAST_ROUTED,
  UNROUTE_METHOD
} from "../constants";

import dispatchEventOver from "../custom-event-handling/dispatchEventOver";

import { END_PLACEHOLDER } from "../ghost";

import * as loadingBar from "../loading-bar";

import onloadingcomplete from "./onloadingcomplete";

export default function onroute(
  routeComponent: RiotComponent & {
    [ROUTER]: {
      [LAST_ROUTED]: any;
      [TEST_LAST_ROUTED]: any;
      [UNROUTE_METHOD]: () => void;
    };
    [END_PLACEHOLDER]: Node;
    [PARENT_KEY_SYMBOL]: any;
  }
) {
  return (function (this: RiotComponent & {
    [ROUTER]: {
      [LAST_ROUTED]: any;
      [TEST_LAST_ROUTED]: any;
      [UNROUTE_METHOD]: () => void;
    };
    [END_PLACEHOLDER]: Node;
    [PARENT_KEY_SYMBOL]: any;
  }, location: any, keymap: any, redirection: any) {
    const router = this[ROUTER];
    if (router[TEST_LAST_ROUTED] !== false) {
      router[TEST_LAST_ROUTED] = this;
      return;
    }

    const route = { location, keymap, redirection };

    const claimer = Object.create(null);
    loadingBar.claim(claimer);

    router[LAST_ROUTED] = this;

    const slot = this.slots[0];
    const currentEl = document.createElement("div");
    insertBefore(currentEl, this[END_PLACEHOLDER]);
    const currentMount = (__.DOMBindings
      .template(slot.html!, slot.bindings!)
      .mount(
        currentEl,
        Object.create(
          this[PARENT_KEY_SYMBOL],
          {
            route: {
              value: {
                location,
                keymap,
                redirection
              },
            },
          }
        ),
        this[PARENT_KEY_SYMBOL]
      )
    );
    currentEl.style.display = "none";
    
    const needLoading: Array<HTMLElement> = [];
    const routerChildren: Array<RiotComponent> = [];
    {
      const beforeRouteEvent = new CustomEvent("beforeroute", {
        cancelable: false,
        detail: { location, keymap, redirection }
      });
      dispatchEventOver(
        currentEl.children,
        beforeRouteEvent,
        needLoading,
        routerChildren
      );
    }

    if (needLoading.length > 0) {
      let loaded = 0;
      const onrequestvisibility = () => {
        currentEl.style.display = "block";
      };
      needLoading.forEach((element) => {
        loaded++;
        const onload = (element: HTMLElement) => {
          const fn = () => {
            currentEl.style.display = "none";
            element.removeEventListener("requestvisibility", onrequestvisibility);
            element.removeEventListener("load", fn);
            Array.prototype.forEach.call(
              currentEl.querySelectorAll("[need-loading]:not([need-loading='false'])"),
              el => {
                if (needLoading.some(other => other === el)) { return; }
                needLoading.push(el);
                loaded++
                el.addEventListener("load", onload(el));
                el.addEventListener("requestvisibility", onrequestvisibility);
              }
            );
            if (--loaded <= 0) {
              onloadingcomplete(
                routeComponent,
                currentMount,
                route,
                router,
                claimer
              );
            }
          };
          return fn;
        };
        element.addEventListener("requestvisibility", onrequestvisibility);
        element.addEventListener("load", onload(element));
      });
    } else {
      onloadingcomplete(routeComponent, currentMount, route, router, claimer);
    }
  }).bind(routeComponent);
}
