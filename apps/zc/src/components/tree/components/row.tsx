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
        // BUG: 注意 treeNode.isChecked 一开始如果是 undefined，它不受控，等一下 treeNode.isChecked 变化他也不会重渲染。
        // 所以 treeNode.isChecked 需要初始值
        checked={treeNode.isChecked}
        onCheckedChange={handleCheck}
        className="mr-2"
      />
      <span>{treeNode.data.label}</span>
    </div>
  );
}
