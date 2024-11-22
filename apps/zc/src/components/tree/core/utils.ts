import { TreeNode } from './types';

function hasTreeId(data: unknown): data is { id: TreeNode['id'] } {
  return typeof data === 'object' && data !== null && 'id' in data;
}

export function getId<T>(data: T): TreeNode['id'] {
  if (!hasTreeId(data)) {
    throw new Error('tree node is missing property id')
  }
  return data.id;
}


function hasTreeChildren<T>(data: unknown): data is { children: T[] } {
  return typeof data === 'object' && data !== null && 'children' in data;
}

export function getChildren<T>(data: T): T[] {
  if (!hasTreeChildren<T>(data)) {
    throw new Error('tree node is missing property children')
  }
  return data.children
}


