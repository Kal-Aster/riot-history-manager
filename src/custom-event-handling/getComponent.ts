import { DOM_COMPONENT_INSTANCE_PROPERTY } from "./constants";

export default function getComponent(element: Element, name: string) {
  if (!(element instanceof HTMLElement)) {
    return null;
  }

  const riotComponent = element[DOM_COMPONENT_INSTANCE_PROPERTY];
  return (riotComponent?.name === name ?
    riotComponent : 
    null
  );
}
