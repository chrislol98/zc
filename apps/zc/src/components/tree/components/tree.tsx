import { useTreeNodeManager } from '../hooks/use-tree-node-manager';
import { TreeNodeManager } from '../classes/tree-node-manager';
import { TreeNodeManagerContext } from '../contexts';
interface TreeProps<T> {
  data: T[];
  children: React.ReactNode;
  getId?: TreeNodeManager<T>['getId'];
  getChildren?: TreeNodeManager<T>['getChildren'];
}
export function Tree<T>(props: TreeProps<T>) {
  const { data, children, getId, getChildren } = props;
  
  const treeNodeManager = useTreeNodeManager<T>(data, { getId, getChildren });

  return (
    <TreeNodeManagerContext.Provider value={treeNodeManager}>
      {children}
    </TreeNodeManagerContext.Provider>
  );
}
