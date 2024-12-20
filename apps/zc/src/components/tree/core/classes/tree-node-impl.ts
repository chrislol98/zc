import { TreeNode } from "../types";

export class TreeNodeImpl implements TreeNode {
  id: TreeNode['id'];
  label: TreeNode['label'];
  parentId: NonNullable<TreeNode['parentId']>;
  isExpanded: TreeNode['isExpanded'];
  isChecked: TreeNode['isChecked'];
  children: TreeNodeImpl[];
  data: TreeNode;
  level?: number;

  constructor(params: {
    id: TreeNodeImpl['id'];
    label: TreeNodeImpl['label'];
    parentId: TreeNodeImpl['parentId'];
    isExpanded?: TreeNodeImpl['isExpanded'];
    isChecked?: TreeNodeImpl['isChecked'];
    level?: TreeNodeImpl['level'];
    children: TreeNodeImpl[];
    data: TreeNode;
  }) {
    this.id = params.id;
    this.label = params.label;
    this.parentId = params.parentId;
    this.isExpanded = params.isExpanded;
    this.isChecked = params.isChecked;
    this.level = params.level;
    this.children = params.children;
    this.data = params.data;
  }


  clone(data: Partial<TreeNodeImpl>): TreeNodeImpl {
    return new TreeNodeImpl({
      id: data.id ?? this.id,
      label: data.label ?? this.label,
      parentId: data.parentId ?? this.parentId,
      isExpanded: data.isExpanded ?? this.isExpanded,
      isChecked: data.isChecked ?? this.isChecked,
      level: data.level ?? this.level,
      children: this.children,
      data: { ...this.data, ...data }
    });
  }
}


