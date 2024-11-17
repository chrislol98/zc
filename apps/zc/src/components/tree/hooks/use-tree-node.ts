
import { useTreeNodeManagerContext } from "./use-tree-node-manager-context";

export function useTreeNode<T>() {
  const treeNodeManager = useTreeNodeManagerContext<T>();
  return treeNodeManager;
}