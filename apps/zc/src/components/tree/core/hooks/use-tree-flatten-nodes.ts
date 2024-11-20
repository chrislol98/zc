import { useSyncExternalStore } from "react";
import { useTreeNodeManagerContext } from "..";
export function useTreeFlattenNodes() {
  const treeNodeManager = useTreeNodeManagerContext();
  const flattenNodes = useSyncExternalStore(
    treeNodeManager.subscribe,
    treeNodeManager.getFlattenNodes,
    treeNodeManager.getFlattenNodes
  );
  return flattenNodes;
}
