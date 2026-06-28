import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import CommandPalette from '@/components/ui/CommandPalette';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full relative bg-zinc-950 selection:bg-indigo-500/30">
      <Sidebar />
      <div className="lg:pl-72 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 overflow-x-hidden p-6 md:p-8">
          {children}
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
