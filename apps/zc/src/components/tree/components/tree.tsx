import { FixedSizeList } from 'react-window';
import { Row } from './row';
import {
  type TreeNode,
  useTreeNodeManager,
  useTreeFlattenNodes,
  TreeNodeManagerContext,
} from '../core';
interface TreeProps {
  data: TreeNode[];
  defaultExpandedIds?: TreeNode['id'][];
  expandedIds?: TreeNode['id'][];
  onExpand?: (expandedIds: TreeNode['id'][]) => void;
  loadData?: (node: TreeNode) => Promise<TreeNode[]>;
}
export function Tree(props: TreeProps) {
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
  const flattenData = useTreeFlattenNodes();

  return (
    <FixedSizeList
      itemCount={flattenData.length}
      height={500}
      width={500}
      itemSize={30}
    >
      {Row}
    </FixedSizeList>
  );
}
