import { useCreation } from "ahooks";
import { TreeNodeManager } from '../classes/tree-node-manager';
import { TreeNode } from '../types';

export function useTreeNodeManager(data: TreeNode[]) {

  const treeNodeManager = useCreation(() => {
    const treeNodeManager = new TreeNodeManager();
    treeNodeManager.init(data);
    return treeNodeManager;
  }, [data]);

  return treeNodeManager;
}


