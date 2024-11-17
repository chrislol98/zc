import { TreeNodeManagerContext } from "../contexts";
import { useContext } from "react";
import { TreeNodeManager } from "../classes/tree-node-manager";
export function useTreeNodeManagerContext<T>() {
  // TODO 不用 as
  const context = useContext(TreeNodeManagerContext) as TreeNodeManager<T> | null;
  if (!context) {
    throw new Error('useTreeNodeManager must be used within a TreeNodeManager');
  }
  return context;
}
