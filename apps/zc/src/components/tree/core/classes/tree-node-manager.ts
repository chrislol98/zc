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
  checkStrictly: boolean = true;
  private flattenNodes: TreeNodeImpl[] = [];
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
      this.updateNodeCheck(id, value);
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

  applyExpandedIds(): void {
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

  updateNodeCheck(id: TreeNodeImpl['id'], value: TreeNode[keyof TreeNode]) {
    const { isControlled } = this.checkedIds;
    const thisCheckedIds = new Set(this.checkedIds.value);

    if (value) {
      thisCheckedIds.add(id);
    } else {
      thisCheckedIds.delete(id);
    }

    if (!isControlled) {
      const updateNodeCheckImpl = (id: TreeNodeImpl['id']) => {
        this.updateNodeImpl(id, 'isChecked', value);
        if (this.checkStrictly) return;
        const node = this.nodeMap.get(id);
        if (node) {
          node.children?.forEach(child => {
            updateNodeCheckImpl(child.id);
            if (value) {
              thisCheckedIds.add(child.id);
            } else {
              thisCheckedIds.delete(child.id);
            }
          })
        }
      }
      updateNodeCheckImpl(id);
      this.updateCheckedIds(undefined, [...thisCheckedIds]);
      this.setNodeIndeterminate(id)
      this.flattenNodes = this.flattenTree(this.rootNodes);
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

  setNodeIndeterminate(id: TreeNodeImpl['id']): void {
    const impl = (id: TreeNodeImpl['id']) => {
      const node = this.nodeMap.get(id);
      if (!node) return;
      const nodeCheckState = this.getNodeCheckedState(id);

      this.updateNodeImpl(id, 'isChecked', nodeCheckState);

      const parentNode = this.nodeMap.get(node.parentId)
      if (!parentNode) return;
      impl(parentNode.id);
    }
    const node = this.nodeMap.get(id);
    if (!node) return;
    impl(node.parentId);
  }
  
  getNodeCheckedState(id: TreeNodeImpl['id']): boolean | 'indeterminate' {
    const node = this.nodeMap.get(id);
    if (!node || node.children.length === 0) {
      return !!node?.isChecked;
    }

    const childStates = node.children.map(child => {
      if (child.children.length > 0) {
        return this.getNodeCheckedState(child.id);
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
    defaultExpandedIds?: TreeNode['id'][];
    onExpand?: (expandedIds: TreeNode['id'][]) => void;
    checkedIds?: TreeNode['id'][];
    defaultCheckedIds?: TreeNode['id'][];
    onCheck?: (checkedIds: TreeNode['id'][]) => void;
    loadData?: (node: TreeNode) => Promise<TreeNode[]>;

  }): void {
    const { expandedIds, onExpand, loadData, defaultExpandedIds } = options;
    this.onExpand = onExpand;
    this.loadData = loadData;
    this.updateExpandedIds(expandedIds, defaultExpandedIds);
    this.rootNodes = this.buildTree(data);
    this.flattenNodes = this.flattenTree(this.rootNodes);
  }

  update(options: Parameters<typeof this.init>[1]): void {
    const { expandedIds, defaultExpandedIds, onExpand, loadData, onCheck } = options;

    if (onCheck && this.onCheck !== onCheck) {
      this.onCheck = onCheck;
    }

    if (onExpand && this.onExpand !== onExpand) {
      this.onExpand = onExpand;
    }

    if (loadData && this.loadData !== loadData) {
      this.loadData = loadData;
    }

    if (expandedIds || defaultExpandedIds) {
      this.updateExpandedIds(expandedIds || defaultExpandedIds);
      this.applyExpandedIds();
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
          isExpanded: this.expandedIds.value?.includes(item.id),
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
