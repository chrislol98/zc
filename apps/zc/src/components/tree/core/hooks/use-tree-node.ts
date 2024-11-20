
import { useSyncExternalStore } from "react";
import { useTreeNodeManagerContext } from "./use-tree-node-manager-context";

export function useTreeNode(index: number) {
  const treeNodeManager = useTreeNodeManagerContext();
  const treeNode = useSyncExternalStore(
    treeNodeManager.subscribe,
    () => treeNodeManager.getNodeByIndex(index),
    () => treeNodeManager.getNodeByIndex(index)
  );
  return treeNode;
}