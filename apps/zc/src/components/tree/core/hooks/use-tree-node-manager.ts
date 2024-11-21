import { TreeNodeManager } from '../classes/tree-node-manager';
import { TreeNode } from '../types';
import { useState } from "react";

export function useTreeNodeManager(data: TreeNode[], options: {
  expandedIds?: TreeNode['id'][];
  defaultExpandedIds?: TreeNode['id'][];
  onExpand?: (expandedIds: TreeNode['id'][]) => void;
  loadData?: (node: TreeNode) => Promise<TreeNode[]>;
}) {
  const [treeNodeManager] = useState(() => {
    const treeNodeManager = new TreeNodeManager();
    treeNodeManager.init(data, options);
    return treeNodeManager;
  });

  // NOTE: update onExpand, loadData wont re-build flattenTree 
  // NOTE: update expandedIds, defaultExpandedIds will re-build flattenTree
  treeNodeManager.update(options)

  return treeNodeManager;
}
