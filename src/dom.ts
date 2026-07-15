export const removeChild = (node: ChildNode): void => node.remove();

export const insertBefore = (newNode: Node, refNode: Node): void => {
  refNode.parentNode?.insertBefore(newNode, refNode);
};
