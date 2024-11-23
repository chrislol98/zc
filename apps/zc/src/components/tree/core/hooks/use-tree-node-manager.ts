import { TreeNodeManager } from '../classes/tree-node-manager';
import { TreeNode } from '../types';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';

export function useTreeNodeManager(
  data: TreeNode[],
  options: Parameters<typeof TreeNodeManager.prototype.init>[1]
) {
  const [treeNodeManager] = useState(() => {
    const treeNodeManager = new TreeNodeManager();
    treeNodeManager.init(data, options);
    return treeNodeManager;
  });

  // NOTE: update onExpand, loadData wont re-build flattenTree
  // NOTE: update expandedIds, defaultExpandedIds will re-build flattenTree
  const isFirstRender = useRef(true);
  if (isFirstRender.current) {
    isFirstRender.current = false;
  }
  useLayoutEffect(() => {
    if (isFirstRender.current) return;
    treeNodeManager.update(options);
  }, [options, treeNodeManager]);

  return treeNodeManager;
}
