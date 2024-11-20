export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[calc(100vh-3.5rem)]  overflow-y-auto flex  justify-center ">
      {children}
    </div>
  );
}
