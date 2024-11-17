import { getId, getChildren } from "../utils";
import { TreeNode } from "./tree-node";
export class TreeNodeManager<T> {
  data: TreeNode<T>[] = [];
  flattenData: TreeNode<T>[] = [];
  getId: typeof getId
  getChildren: typeof getChildren

  constructor() {
    this.getId = getId
    this.getChildren = getChildren
  }

  run(data: T[], options: {
    getId?: TreeNodeManager<T>['getId']
    getChildren?: TreeNodeManager<T>['getChildren']
  } = {}) {
    const { getId, getChildren } = options;
    this.getId = getId || this.getId;
    this.getChildren = getChildren || this.getChildren;
    this.data = this.build(data)
    this.flattenData = this.flatten(this.data)
  }


  build(data: T[]) {
    const impl = (data: T[]): TreeNode<T>[] => {
      const processedData = data.map(record => {
        const treeNode = new TreeNode<T>({
          data: record,
          parentId: this.getId(record),
          id: this.getId(record),
          children: impl(this.getChildren(record)),
        });
        return treeNode;
      });
      return processedData;
    }
    const builtData = impl(data)
    return builtData
  }


  flatten(data: TreeNode<T>[]) {
    const flattenData: TreeNode<T>[] = [];
    impl(data);
    return flattenData;
    function impl(data: TreeNode<T>[]) {
      data.forEach((record) => {
        flattenData.push(record);
        if (record.children && record.children.length) {
          impl(record.children);
        }
      });
    }
  }
}