'use client';
import { Tree } from '@/components/tree';

export default function Page() {
  const treeData = [
    {
      label: 'Root 1',
      id: '1',
      children: [
        {
          label: 'Child 1.1',
          id: '1.1',
          children: [
            { label: 'Grandchild 1.1.1', id: '1.1.1', children: [] },
            { label: 'Grandchild 1.1.2', id: '1.1.2', children: [] },
          ],
        },
        { label: 'Child 1.2', id: '1.2', children: [] },
      ],
    },
    {
      label: 'Root 2',
      id: '2',
      children: [
        { label: 'Child 2.1', id: '2.1', children: [] },
        { label: 'Child 2.2', id: '2.2', children: [] },
      ],
    },
  ];

  return <Tree data={treeData} />;
}
