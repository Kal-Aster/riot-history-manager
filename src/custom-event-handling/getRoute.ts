import getComponent from "./getComponent";

export default function getRoute(element: Element) {
    return getComponent(element, "rhm-route");
}
