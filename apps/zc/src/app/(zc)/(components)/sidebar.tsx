'use client';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface MenuItem {
  title: string;
  href?: string;
  children?: MenuItem[];
  icon?: React.ElementType;
}

const menuItems: MenuItem[] = [
  { title: 'Tree', href: '/docs/tree' },
  { title: 'Rate', href: '/docs/rate' },
  { title: 'Dynamic Form', href: '/docs/dynamic-form' },
  { title: 'Data-Table', href: '/docs/data-table' },
  { title: 'Tanstack Query', href: '/docs/tanstack-query' },
];

function MenuItem({ item, depth = 0 }: { item: MenuItem; depth?: number }) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  const toggleOpen = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  const content = (
    <div
      className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-gray-100 cursor-pointer
        ${depth ? 'pl-' + (depth * 4 + 2) : ''}
      `}
      onClick={toggleOpen}
    >
      <div className="flex items-center">
        {Icon && <Icon className="mr-2 h-4 w-4" />}
        {item.title}
      </div>
      {hasChildren && (
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      )}
    </div>
  );

  return (
    <div className="w-full">
      {item.href ? (
        <Link href={item.href}>
          {content}
        </Link>
      ) : (
        content
      )}
      {hasChildren && isOpen && (
        <div className="mt-1 ml-4">
          {item.children?.map((child, index) => (
            <MenuItem key={index} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-gray-50">
      <nav className="space-y-1 p-4">
        {menuItems.map((item, index) => (
          <MenuItem key={index} item={item} />
        ))}
      </nav>
    </aside>
  );
}
