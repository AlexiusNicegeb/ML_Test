export function getAllTextNodes(node: any): any[] {
  const nodes: any[] = [];
  for (
    let child = node.getFirstChild();
    child !== null;
    child = child.getNextSibling()
  ) {
    if (child.getChildrenSize && child.getChildrenSize() > 0) {
      nodes.push(...getAllTextNodes(child));
    } else if (child.getType() === "text") {
      nodes.push(child);
    }
  }
  return nodes;
}
