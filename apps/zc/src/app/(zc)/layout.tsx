import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen">
      <div className="flex h-14 items-center px-4 justify-between border-b border-gray-200">
        <div className="flex items-center gap-8">
          <Link href="/">
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent cursor-pointer">
              ZAC
            </h2>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/docs"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Docs
            </Link>
            <Link
              href="/english"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              English
            </Link>
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
