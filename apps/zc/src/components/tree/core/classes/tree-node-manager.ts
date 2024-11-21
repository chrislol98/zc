import { TreeNode } from "../types";
import { TreeNodeImpl } from "./tree-node-impl";

export class TreeNodeManager {
  private loadData?: (node: TreeNode) => Promise<TreeNode[]>;
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
  private rootNodes: TreeNodeImpl[] = [];

  private nodeMap: Map<TreeNodeImpl['id'], TreeNodeImpl> = new Map();
  private expandedIds: {
    isControlled?: boolean;
    value?: TreeNode['id'][];
    preValue?: TreeNode['id'][];
  } = {};
  private onExpand?: (expandedIds: TreeNode['id'][]) => void;

  updateNodeExpansion(id: TreeNodeImpl['id'], value: TreeNode[keyof TreeNode]) {
    const { isControlled } = this.expandedIds;
    const expandedIds = value ? [...(this.expandedIds?.value || []), id] : (this.expandedIds?.value || []).filter(expandedId => expandedId !== id);
    if (!isControlled) {
      this.updateNodeImpl(id, 'isExpanded', value);
      this.flattenNodes = this.flattenTree(this.rootNodes);
      this.expandedIds.value = expandedIds;
      this.notifySubscribers();
    }
    this.onExpand?.(expandedIds);
  }
  updateExpandedIds(expandedIds?: TreeNode['id'][], defaultExpandedIds?: TreeNode['id'][]): void {
    const currentExpandedIds = this.expandedIds.value;
    const newExpandedIds = expandedIds || defaultExpandedIds;

    if (currentExpandedIds !== newExpandedIds) {
      this.expandedIds.isControlled = !!expandedIds;
      this.expandedIds.value = newExpandedIds;
      this.expandedIds.preValue = currentExpandedIds;
    }
  }
  applyExpandIds() {
    if (this.expandedIds.preValue) {
      this.expandedIds.preValue.forEach(id => {
        this.updateNodeImpl(id, 'isExpanded', false);
      });
    }

    if (this.expandedIds.value) {
      this.expandedIds.value.forEach(id => {
        this.updateNodeImpl(id, 'isExpanded', true);
      });
    }
  }

  private flattenNodes: TreeNodeImpl[] = [];
  getFlattenNodes = (): TreeNodeImpl[] => {
    return this.flattenNodes;
  };
  getNodeByIndex = (index: number): TreeNodeImpl | undefined => {
    return this.flattenNodes[index];
  };

  updateNode = (id: TreeNodeImpl['id'], key: keyof TreeNode, value: TreeNode[keyof TreeNode]): void => {
    if (key === 'isExpanded') {
      this.updateNodeExpansion(id, value);
    } else if (key === 'isChecked') {
      this.updateNodeCheck(id, value);
    }
  };

  getNodeCheckState(id: TreeNodeImpl['id']): boolean | 'indeterminate' {
    const node = this.nodeMap.get(id);
    if (!node || node.children.length === 0) {
      return !!node?.isChecked;
    }

    const childStates = node.children.map(child => {
      if (child.children.length > 0) {
        return this.getNodeCheckState(child.id);
      }
      return !!child.isChecked;
    });

    const hasIndeterminate = childStates.includes('indeterminate');
    const hasChecked = childStates.includes(true);
    const hasUnchecked = childStates.includes(false);

    if (hasIndeterminate || (hasChecked && hasUnchecked)) {
      return 'indeterminate';
    }

    return hasChecked && !hasUnchecked;
  }

  setNodeIndeterminate(id: TreeNodeImpl['id']): void {
    const impl = (id: TreeNodeImpl['id']) => {
      const node = this.nodeMap.get(id);
      if (!node) return;
      const nodeCheckState = this.getNodeCheckState(id);

      this.updateNodeImpl(id, 'isChecked', nodeCheckState);

      const parentNode = this.nodeMap.get(node.parentId)
      if (!parentNode) return;
      console.log('parentNode', parentNode);
      impl(parentNode.id);
    }

    impl(id);
  }

  updateNodeCheck(id: TreeNodeImpl['id'], value: TreeNode[keyof TreeNode]) {
    this.updateNodeImpl(id, 'isChecked', value);

    const node = this.nodeMap.get(id);
    if (node) {
      const updateNodeCheckImpl = (children: TreeNodeImpl[]) => {
        for (const child of children) {
          this.updateNodeImpl(child.id, 'isChecked', value);
          if (child.children.length > 0) {
            updateNodeCheckImpl(child.children);
          }
        }
      };

      updateNodeCheckImpl(node.children);
    }

    this.setNodeIndeterminate(id);
    this.flattenNodes = this.flattenTree(this.rootNodes);
    this.notifySubscribers();
  }

  updateNodeImpl(id: TreeNodeImpl['id'], key: keyof TreeNode, value: TreeNode[keyof TreeNode]): void {
    const node = this.nodeMap.get(id);
    if (node) {
      const newNode = node.clone({ [key]: value });
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
    }
  }


  init(data: TreeNode[], options: {
    expandedIds?: TreeNode['id'][];
    onExpand?: (expandedIds: TreeNode['id'][]) => void;
    loadData?: (node: TreeNode) => Promise<TreeNode[]>;
    defaultExpandedIds?: TreeNode['id'][];
  }): void {
    const { expandedIds, onExpand, loadData, defaultExpandedIds } = options;
    this.onExpand = onExpand;
    this.loadData = loadData;
    this.updateExpandedIds(expandedIds, defaultExpandedIds);
    this.rootNodes = this.buildTree(data);
    this.applyExpandIds();
    this.flattenNodes = this.flattenTree(this.rootNodes);
  }

  update(options: {
    expandedIds?: TreeNode['id'][];
    defaultExpandedIds?: TreeNode['id'][];
    onExpand?: (expandedIds: TreeNode['id'][]) => void;
    loadData?: (node: TreeNode) => Promise<TreeNode[]>;
  }): void {
    const { expandedIds, defaultExpandedIds, onExpand, loadData } = options;

    if (onExpand && this.onExpand !== onExpand) {
      this.onExpand = onExpand;
    }

    if (loadData && this.loadData !== loadData) {
      this.loadData = loadData;
    }

    if (expandedIds || defaultExpandedIds) {
      this.updateExpandedIds(expandedIds || defaultExpandedIds);
      this.applyExpandIds();
      this.flattenNodes = this.flattenTree(this.rootNodes);
    }
  }

  private buildTree(data: TreeNode[]): TreeNodeImpl[] {
    const buildTreeImpl = (nodes: TreeNode[], parentId: TreeNode['id'] = 'root'): TreeNodeImpl[] => {
      return nodes.map(item => {
        const node = new TreeNodeImpl({
          id: item.id,
          label: item.label,
          parentId,
          data: item,
          children: item.children ? buildTreeImpl(item.children, item.id) : []
        });
        this.nodeMap.set(node.id, node);
        return node;
      });
    };

    return buildTreeImpl(data);
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

