import getComponent from "./getComponent";

export default function getRouter(element: Element) {
    return getComponent(element, "rhm-router");
}
