import { TemplateChunk } from "@riotjs/dom-bindings";
import { RiotComponent } from "riot";

import {
  LAST_ROUTED,
  PARENT_KEY_SYMBOL,
  TEST_LAST_ROUTED,
  UNROUTE_METHOD
} from "../constants";

import dispatchEventOver from "../custom-event-handling/dispatchEventOver";

import * as loadingBar from "../loading-bar";

import onunroute from "./onunroute";

export default function onloadingcomplete(
  routeComponent: RiotComponent & {
    [PARENT_KEY_SYMBOL]: any;
  },
  currentMount: TemplateChunk<any, any>,
  route: {
    location: any;
    keymap: any;
    redirection: any;
  },
  router: {
    [LAST_ROUTED]: any;
    [TEST_LAST_ROUTED]: any;
    [UNROUTE_METHOD]: () => void;
  },
  claimer: any,
) {
  if (router[LAST_ROUTED] !== routeComponent) {
    onunroute(routeComponent, currentMount, route, router, false, false);
    return;
  }
  const currentEl = currentMount.el!;
  if (loadingBar.claimed(claimer)) {
    loadingBar.release(claimer);
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
      dispatchEventOver(
        currentEl.children,
        routeEvent,
        undefined,
        []
      );
    }
  }
}
