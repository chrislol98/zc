import { createContext } from 'react';
import { TreeNodeManager } from './classes/tree-node-manager';
export const TreeNodeManagerContext = createContext<TreeNodeManager | null>(
  null
);
