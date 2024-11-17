import { TreeId } from "../types";

export class TreeNode<T> {
  data: T;
  children: TreeNode<T>[];
  parentId: TreeId;
  id: TreeId;

  constructor(params: {
    data: T,
    parentId: TreeId,
    id: TreeId
    children: TreeNode<T>[],
  }) {
    const { data, children, parentId, id } = params;
    this.data = data;
    this.children = children;
    this.parentId = parentId;
    this.id = id;
  }
}



