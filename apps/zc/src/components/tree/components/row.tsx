import { useTreeNode, useTreeNodeManagerContext } from '../core';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export function Row({
  index,
  style,
}: {
  index: number;
  style: React.CSSProperties;
}) {
  // this hook control the re-render of the row
  const treeNode = useTreeNode(index);
  
  const treeNodeManager = useTreeNodeManagerContext();

  if (!treeNode) return null;

  const handleExpand = () => {
    treeNodeManager.updateNode(treeNode.id, 'isExpanded', !treeNode.isExpanded);
  };

  const handleCheck = (checked: boolean) => {
    treeNodeManager.updateNode(treeNode.id, 'isChecked', checked);
  };

  return (
    <div
      className={`flex items-center`}
      style={{
        ...style,
        paddingLeft: `${(treeNode.level || 0) * 20}px`,
      }}
    >
      <span className="w-5 h-5 inline-flex items-center justify-center mr-1">
        {treeNode.children?.length > 0 && (
          <span onClick={handleExpand} className="cursor-pointer">
            {treeNode.isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
      </span>
      <Checkbox
        checked={treeNode.isChecked}
        onCheckedChange={handleCheck}
        className="mr-2"
      />
      <span>{treeNode.data.label}</span>
      <span>{JSON.stringify(treeNode.isChecked)}</span>
    </div>
  );
}
