import { FixedSizeList } from 'react-window';
import { Row } from './row';
import { useControllableValue } from 'ahooks';
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
  onExpend?: (expandedIds: TreeNode['id'][]) => void;
}
export function Tree(props: TreeProps) {
  const { data } = props;
  const [expandedIds, setExpandedIds] = useControllableValue<
    TreeProps['expandedIds']
  >(props, {
    defaultValue: props.defaultExpandedIds,
    defaultValuePropName: 'defaultExpandedIds',
    valuePropName: 'expandedIds',
    trigger: 'onExpend',
  });
  const treeNodeManager = useTreeNodeManager(data);

  return (
    <TreeNodeManagerContext.Provider value={treeNodeManager}>
      <TreeImpl />
    </TreeNodeManagerContext.Provider>
  );
}

function TreeImpl() {
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
