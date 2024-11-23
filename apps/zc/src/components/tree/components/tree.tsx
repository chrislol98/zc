import { FixedSizeList } from 'react-window';
import { Row } from './row';
import {
  type TreeNode,
  useTreeNodeManager,
  useTreeFlattenNodeCount,
  TreeNodeManagerContext,
} from '../core';

interface TreeProps {
  data: TreeNode[];
}

export function Tree(
  props: TreeProps & Parameters<typeof useTreeNodeManager>[1]
) {
  const { data } = props;
  
  const treeNodeManager = useTreeNodeManager(data, props);
  return (
    <TreeNodeManagerContext.Provider value={treeNodeManager}>
      <TreeImpl />
    </TreeNodeManagerContext.Provider>
  );
}

function TreeImpl() {
  // this hook control the re-render of the TreeImpl
  const count = useTreeFlattenNodeCount();
  return (
    <FixedSizeList
      itemCount={count}
      height={500}
      width={500}
      itemSize={30}
    >
      {Row}
    </FixedSizeList>
  );
}
