import { RiotComponent } from "riot";
import { DOM_COMPONENT_INSTANCE_PROPERTY, ONBEFOREROUTE, ONROUTE, ONUNROUTE } from "./constants";

declare global {
    interface HTMLElement {
        [ONBEFOREROUTE]?: Array<ListenerObject>;
        [ONROUTE]?: Array<ListenerObject>;
        [ONUNROUTE]?: Array<ListenerObject>;

        [DOM_COMPONENT_INSTANCE_PROPERTY]?: RiotComponent;
    }
}

// listen "beforeroute", "unroute" and "route" differently,
// limiting the handling of these events to this library

export type ListenerObject = {
    listener: EventListener | EventListenerObject,
    useCapture: boolean
};
