import { TreeNodeManagerContext } from "../contexts";
import { useContext } from "react";

export function useTreeNodeManagerContext() {
  const context = useContext(TreeNodeManagerContext);
  if (!context) {
    throw new Error('useTreeNodeManager must be used within a TreeNodeManager');
  }
  return context;
}
