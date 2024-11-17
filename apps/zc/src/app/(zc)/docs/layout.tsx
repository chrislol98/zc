import { Sidebar } from '@/app/(zc)/(components)/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
