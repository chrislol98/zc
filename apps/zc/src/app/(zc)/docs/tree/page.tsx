'use client';
import { Tree } from '@/components/tree';
import { TreeNode } from '@/components/tree/core/types';

function generateTreeData(depth: number = 4, breadth: number = 5): TreeNode[] {
  const generateNode = (prefix: string, currentDepth: number): TreeNode => {
    const node: TreeNode = {
      label: `Node ${prefix}`,
      id: prefix,
      children: [],
    };

    if (currentDepth < depth) {
      for (let i = 1; i <= breadth; i++) {
        const childPrefix = `${prefix}.${i}`;
        node.children?.push(generateNode(childPrefix, currentDepth + 1));
      }
    }

    return node;
  };

  const rootNodes: TreeNode[] = [];
  for (let i = 1; i <= breadth; i++) {
    rootNodes.push(generateNode(i.toString(), 1));
  }

  return rootNodes;
}

export default function Page() {
  const treeData = generateTreeData();

  return <Tree data={treeData} onCheck={console.log}/>;
}
