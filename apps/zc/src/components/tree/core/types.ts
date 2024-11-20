export interface TreeNode {
  id: string | number;
  label: string;
  children?: TreeNode[];
  parentId?: TreeNode['id'];
  isExpanded?: boolean;
  isChecked?: boolean;
}
