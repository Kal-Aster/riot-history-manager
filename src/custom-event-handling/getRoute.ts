import { DOM_COMPONENT_INSTANCE_PROPERTY } from "./constants";

export default function getRoute(element: Element) {
    if (!(element instanceof HTMLElement)) {
        return null;
    }

    const riotComponent = element[DOM_COMPONENT_INSTANCE_PROPERTY];
    return (riotComponent != null && riotComponent.name === "rhm-route" ?
        riotComponent :
        null
    );
}
