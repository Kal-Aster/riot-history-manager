import {
  insertBefore,
  removeChild
  // @ts-expect-error
} from "@riotjs/util";
import { RiotComponent, RiotComponentWithoutInternals } from "riot";

function moveChildrenBefore(source: Node, target: Node) {
  if (source.firstChild) {
    insertBefore(source.firstChild, target);
    moveChildrenBefore(source, target);
  }
}

export const END_PLACEHOLDER = Symbol('end-placeholder');

export default function ghost(component: Partial<RiotComponentWithoutInternals<RiotComponent>>) {
  const originalOnMounted = component.onMounted;
  component.onMounted = function(this: RiotComponent & {
    [END_PLACEHOLDER]?: Node;
  }, ...args) {
    // create a temporary placeholder
    const endPlaceholder = document.createComment('');
    
    this[END_PLACEHOLDER] = endPlaceholder;
    
    insertBefore(endPlaceholder, this.root);
    moveChildrenBefore(this.root, endPlaceholder);
    
    removeChild(this.root); 
    
    originalOnMounted?.apply(this, args);
  };
  
  const originalOnUnmounted = component.onUnmounted;
  component.onUnmounted = function(this: RiotComponent & {
    [END_PLACEHOLDER]?: Node;
  }, ...args) {
    this[END_PLACEHOLDER]?.parentElement?.removeChild(this[END_PLACEHOLDER]!);
    originalOnUnmounted?.apply(this, args);
  };

  return component;
}