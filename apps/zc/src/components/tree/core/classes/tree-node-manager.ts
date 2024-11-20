import { TreeNode } from "../types";
import { TreeNodeImpl } from "./tree-node-impl";

export class TreeNodeManager {
  private rootNodes: TreeNodeImpl[] = [];
  private nodeMap: Map<TreeNodeImpl['id'], TreeNodeImpl> = new Map();
  private flattenNodes: TreeNodeImpl[] = [];
  
  getFlattenNodes = (): TreeNodeImpl[] => {
    return this.flattenNodes;
  };

  getNodeByIndex = (index: number): TreeNodeImpl | undefined => {
    return this.flattenNodes[index];
  };

  editNode = (id: TreeNodeImpl['id'], data: Partial<TreeNode>): void => {

    const node = this.nodeMap.get(id);
    if (node) {
      const newNode = node.clone(data);
      // 1 nodeMap
      this.nodeMap.set(id, newNode);
      // 2 rootNodes
      const parentNode = this.nodeMap.get(node.parentId);

      if (parentNode) {
        const childIndex = parentNode.children.findIndex(n => n.id === id);
        if (childIndex >= 0) {
          parentNode.children[childIndex] = newNode;
        }
      } else {
        const rootIndex = this.rootNodes.findIndex(n => n.id === id);
        if (rootIndex >= 0) {
          this.rootNodes[rootIndex] = newNode;
        }
      }
      // 3 flattenNodes
      this.flattenNodes = this.flattenTree(this.rootNodes);

      this.notifySubscribers();
    }
  };

  private subscribers: Set<() => void> = new Set();
  subscribe = (listener: () => void): () => void => {
    this.subscribers.add(listener);
    return () => {
      this.subscribers.delete(listener);
    };
  };

  private notifySubscribers(): void {
    this.subscribers.forEach(listener => listener());
  }

  init(data: TreeNode[]): void {
    this.rootNodes = this.buildTree(data);
    this.flattenNodes = this.flattenTree(this.rootNodes);
  }



  private buildTree(data: TreeNode[], parentId: TreeNode['id'] = 'root'): TreeNodeImpl[] {
    return data.map(item => {
      const node = new TreeNodeImpl({
        id: item.id,
        label: item.label,
        parentId,
        data: item,
        children: item.children ? this.buildTree(item.children, item.id) : []
      });
      this.nodeMap.set(node.id, node);
      return node;
    });
  }

  private flattenTree(nodes: TreeNodeImpl[], level: number = 0): TreeNodeImpl[] {
    return nodes.reduce<TreeNodeImpl[]>((acc, node) => {
      node.level = level;
      acc.push(node);
      if (node.children?.length && node.isExpanded) {
        acc.push(...this.flattenTree(node.children, level + 1));
      }
      return acc;
    }, []);
  }
}

