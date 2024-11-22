// most important，this is the meta data
// anything begins with this interface
export interface TreeNode {
  id: string | number;
  label: string;
  children?: TreeNode[];
  parentId?: TreeNode['id'];
  isExpanded?: boolean;
  isChecked?: boolean | 'indeterminate';
}
