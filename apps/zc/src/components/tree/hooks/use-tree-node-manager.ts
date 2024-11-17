import { useCreation } from "ahooks";
import { TreeNodeManager } from '../classes/tree-node-manager';

export function useTreeNodeManager<T>(data: T[], options: {
  getId?: TreeNodeManager<T>['getId']
  getChildren?: TreeNodeManager<T>['getChildren']
} = {}) {
  const treeNodeManager = useCreation(() => {
    const treeNodeManager = new TreeNodeManager<T>();
    treeNodeManager.run(data, options);
    return treeNodeManager;
  }, [data]);

  return treeNodeManager;
}