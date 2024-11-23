import { useSyncExternalStore } from "react";
import { useTreeNodeManagerContext } from "..";
export function useTreeFlattenNodeCount() {
  const treeNodeManager = useTreeNodeManagerContext();
  const flattenNodeCount = useSyncExternalStore(
    treeNodeManager.subscribe,
    treeNodeManager.getFlattenNodeCount,
    treeNodeManager.getFlattenNodeCount
  );
  return flattenNodeCount;
}
