import { TreeNode } from "../types";
import { TreeNodeImpl } from "./tree-node-impl";

export class TreeNodeManager {
  private subscribers: Set<() => void> = new Set();
  private rootNodes: TreeNodeImpl[] = [];
  private nodeMap: Map<TreeNodeImpl['id'], TreeNodeImpl> = new Map();
  private expandedIds: {
    isControlled?: boolean;
    value?: TreeNode['id'][];
    preValue?: TreeNode['id'][];
  } = {};
  private checkedIds: {
    isControlled?: boolean;
    value?: TreeNode['id'][];
    preValue?: TreeNode['id'][];
  } = {};
  checkStrictly: boolean = false;
  private flattenNodes: TreeNodeImpl[] = [];
  private idToIndexMap: Map<TreeNodeImpl['id'], number> = new Map();
  getFlattenNodeCount = (): number => {
    return this.flattenNodes.length;
  };
  private loadData?: (node: TreeNode) => Promise<TreeNode[]>;
  private onCheck?: (checkedIds: TreeNode['id'][]) => void;
  private onExpand?: (expandedIds: TreeNode['id'][]) => void;
  subscribe = (listener: () => void): () => void => {
    this.subscribers.add(listener);
    return () => {
      this.subscribers.delete(listener);
    };
  };
  private notifySubscribers(): void {
    this.subscribers.forEach(listener => listener());
  }

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
      this.updateNodeCheck(id, value as TreeNode['isChecked']);
    }
  };
  updateNodeExpansion(id: TreeNodeImpl['id'], value: TreeNode[keyof TreeNode]) {
    const { isControlled } = this.expandedIds;
    const expandedIds = value ? [...(this.expandedIds?.value || []), id] : (this.expandedIds?.value || []).filter(expandedId => expandedId !== id);
    if (!isControlled) {
      this.updateNodeImpl(id, 'isExpanded', value);
      this.updateExpandedIds(undefined, expandedIds);
      this.flattenNodes = this.flattenTree(this.rootNodes);
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
  // TODO: 看是不是能够优化
  applyExpandedIds() {
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

  updateNodeCheck(id: TreeNodeImpl['id'], value: TreeNode['isChecked']) {
    const { isControlled } = this.checkedIds;
    const thisCheckedIds = new Set(this.checkedIds.value);
    if (!isControlled) {
      this.updateNodeImpl(id, 'isChecked', value);
    }
    if (value) {
      thisCheckedIds.add(id);
    } else {
      thisCheckedIds.delete(id);
    }


    // 1. 收集父子节点
    // 2. 顺便看要不要更新父子节点
    this.collectChildrenCheckedIds(id, { checkedIds: thisCheckedIds, value, isControlled });
    this.collectParentCheckedIds(id, { checkedIds: thisCheckedIds, isControlled });

    if (!isControlled) {
      this.updateCheckedIds(undefined, [...thisCheckedIds]);
      this.notifySubscribers();
    }

    this.onCheck?.([...thisCheckedIds]);
  }

  updateCheckedIds(checkedIds?: TreeNode['id'][], defaultCheckedIds?: TreeNode['id'][]) {
    const currentCheckedIds = this.checkedIds.value;
    const newCheckedIds = checkedIds || defaultCheckedIds;
    if (currentCheckedIds !== newCheckedIds) {
      this.checkedIds.isControlled = !!checkedIds;
      this.checkedIds.value = newCheckedIds;
      this.checkedIds.preValue = currentCheckedIds;
    }
  }
  collectChildrenCheckedIds = (id: TreeNodeImpl['id'], options: {
    checkedIds?: Set<TreeNodeImpl['id']>;
    value: TreeNode['isChecked'];

  }) => {
    const { checkedIds, value, } = options;
    const node = this.nodeMap.get(id);
    if (!node) return;
    node.children?.forEach(child => {
      debugger;
      if (value) {
        checkedIds?.add(child.id);
      } else {
        checkedIds?.delete(child.id);
      }
      if (!this.checkStrictly) {
        this.updateNodeImpl(child.id, 'isChecked', value);
      }
      this.collectChildrenCheckedIds(child.id, { checkedIds, value, });
    })
  }
  collectParentCheckedIds = (id: TreeNodeImpl['id'], options: {
    checkedIds?: Set<TreeNodeImpl['id']>;
  }) => {
    const { checkedIds } = options;

    const isChildrenAllChecked = (id: TreeNodeImpl['id']): boolean => {
      const node = this.nodeMap.get(id);
      if (!node) return false;
      if (!node.children?.length) return true;
      return node.children.every(child => {
        return child.isChecked && isChildrenAllChecked(child.id);
      });
    }
    const isChildrenAllUnchecked = (id: TreeNodeImpl['id']): boolean => {
      const node = this.nodeMap.get(id);
      if (!node) return false;
      if (!node.children?.length) return true;
      return node.children.every(child => {
        return !child.isChecked && isChildrenAllUnchecked(child.id);
      });
    }
    const collectParentCheckedIdsImpl = (id: TreeNodeImpl['id']) => {
      const node = this.nodeMap.get(id);
      if (!node) return;
      const parentNode = this.nodeMap.get(node.parentId);
      if (!parentNode) return;
      if (!isChildrenAllChecked(parentNode.id) && !isChildrenAllUnchecked(parentNode.id)) {
        if (checkedIds?.has(parentNode.id)) {
          checkedIds.delete(parentNode.id);
        }
        if (!this.checkStrictly) {
          this.updateNodeImpl(parentNode.id, 'isChecked', 'indeterminate');
        }
      } else if (isChildrenAllChecked(parentNode.id) && parentNode.isChecked !== true) {
        checkedIds?.add(parentNode.id);
        if (!this.checkStrictly) {
          this.updateNodeImpl(parentNode.id, 'isChecked', true);
        }
      } else if (isChildrenAllUnchecked(parentNode.id) && parentNode.isChecked !== false) {
        checkedIds?.delete(parentNode.id);
        if (!this.checkStrictly) {
          this.updateNodeImpl(parentNode.id, 'isChecked', false);
        }
      }
      collectParentCheckedIdsImpl(parentNode.id);
    }
    collectParentCheckedIdsImpl(id);
  }


  updateNodeImpl(id: TreeNodeImpl['id'], key: keyof TreeNode, value: TreeNode[keyof TreeNode]): void {
    const node = this.nodeMap.get(id);
    // shallow clone node in nodeMap rootNodes flattenNodes，in order to cause re-render
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
      // 3 flattenNodes
      const index = this.idToIndexMap.get(id);
      if (index !== undefined) {
        this.flattenNodes[index] = newNode;
      }
    }
  }



  init(data: TreeNode[], options: {
    expandedIds?: TreeNode['id'][];
    defaultExpandedIds?: TreeNode['id'][];
    onExpand?: (expandedIds: TreeNode['id'][]) => void;
    checkedIds?: TreeNode['id'][];
    defaultCheckedIds?: TreeNode['id'][];
    onCheck?: (checkedIds: TreeNode['id'][]) => void;
    loadData?: (node: TreeNode) => Promise<TreeNode[]>;

  }): void {
    const { expandedIds, onExpand, loadData, defaultExpandedIds, checkedIds, defaultCheckedIds } = options;
    this.onExpand = onExpand;
    this.loadData = loadData;
    this.updateExpandedIds(expandedIds, defaultExpandedIds);
    this.updateCheckedIds(checkedIds, defaultCheckedIds);
    this.rootNodes = this.buildTree(data);
    this.flattenNodes = this.flattenTree(this.rootNodes);
  }

  update(options: Parameters<typeof this.init>[1]) {
    const { expandedIds, defaultExpandedIds, onExpand, loadData, onCheck, checkedIds, defaultCheckedIds } = options;

    if (onCheck && this.onCheck !== onCheck) {
      this.onCheck = onCheck;
    }

    if (onExpand && this.onExpand !== onExpand) {
      this.onExpand = onExpand;
    }

    if (loadData && this.loadData !== loadData) {
      this.loadData = loadData;
    }

    if (checkedIds || defaultCheckedIds) {
      this.updateCheckedIds(checkedIds, defaultCheckedIds);
      const checkedIdsSet = new Set(this.checkedIds.value);
      const oldCheckedIdsSet = new Set(this.checkedIds.preValue);

      oldCheckedIdsSet.forEach(id => {
        if (!checkedIdsSet.has(id)) {
          this.updateNodeImpl(id, 'isChecked', false);
          this.collectChildrenCheckedIds(id, { checkedIds: checkedIdsSet, value: false, });
          this.collectParentCheckedIds(id, { checkedIds: checkedIdsSet, });
        }
      });
      checkedIdsSet.forEach(id => {
        if (!oldCheckedIdsSet.has(id)) {
          this.updateNodeImpl(id, 'isChecked', true);
          this.collectChildrenCheckedIds(id, { checkedIds: checkedIdsSet, value: true, });
          this.collectParentCheckedIds(id, { checkedIds: checkedIdsSet, });
        }
      });
      this.updateCheckedIds([...checkedIdsSet]);
      this.notifySubscribers();
    }

    if (expandedIds || defaultExpandedIds) {
      this.updateExpandedIds(expandedIds || defaultExpandedIds);
      this.applyExpandedIds();
      this.flattenNodes = this.flattenTree(this.rootNodes);
      this.notifySubscribers();
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
          isExpanded: this.expandedIds.value?.includes(item.id),
          isChecked: this.checkedIds.value?.includes(item.id) ?? false,
          children: item.children ? buildTreeImpl(item.children, item.id) : []
        });
        this.nodeMap.set(node.id, node);
        return node;
      });
    };
    return buildTreeImpl(data);
  }

  private flattenTree(nodes: TreeNodeImpl[], level: number = 0): TreeNodeImpl[] {
    const flattenNodes = nodes.reduce<TreeNodeImpl[]>((acc, node) => {
      node.level = level;
      acc.push(node);
      if (node.children?.length && node.isExpanded) {
        acc.push(...this.flattenTree(node.children, level + 1));
      }
      return acc;
    }, []);

    flattenNodes.forEach((node, index) => {
      this.idToIndexMap.set(node.id, index);
    });

    return flattenNodes;
  }
}
