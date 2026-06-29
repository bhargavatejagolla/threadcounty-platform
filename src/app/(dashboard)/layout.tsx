import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import CommandPalette from '@/components/ui/CommandPalette';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full relative bg-zinc-950 print:bg-white selection:bg-indigo-500/30">
      <div className="print:hidden">
        <Sidebar />
      </div>
      <div className="lg:pl-72 print:pl-0 flex flex-col min-h-screen print:min-h-0 print:block">
        <div className="print:hidden">
          <Topbar />
        </div>
        <main className="flex-1 overflow-x-hidden p-6 md:p-8 print:p-0 print:overflow-visible">
          {children}
        </main>
      </div>
      <div className="print:hidden">
        <CommandPalette />
      </div>
    </div>
  );
}
