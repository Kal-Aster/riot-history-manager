import { TemplateChunk } from "@riotjs/dom-bindings";
import { RiotComponent } from "riot";

import { PARENT_KEY_SYMBOL, UNROUTE_METHOD } from "../constants";

import dispatchEventOver from "../custom-event-handling/dispatchEventOver";

export default function onunroute(
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
    [UNROUTE_METHOD]: () => void;
  },
  shouldFireEvent: boolean,
  shouldResetUnroute: boolean,
) {
  const currentEl = currentMount.el!;
  {
    if (shouldFireEvent) {
      const unrouteEvent = new CustomEvent("unroute", { cancelable: false, detail: {
        location: route.location,
        keymap: route.keymap,
        redirection: route.redirection
      } });
      dispatchEventOver(
        currentEl.children,
        unrouteEvent,
        undefined,
        []
      );
    }
    const scope = Object.create(
      routeComponent[PARENT_KEY_SYMBOL],
      {
        route: {
          value: { ...route }
        }
      }
    );
    currentMount.unmount(scope, routeComponent[PARENT_KEY_SYMBOL]);
  }
  // if want to keep some route for faster loading, just `display: none` the element?
  // currentEl.style.display = "none";
  currentEl.parentElement?.removeChild(currentEl);
  if (shouldResetUnroute) {
    router[UNROUTE_METHOD] = () => {};
  }
}
