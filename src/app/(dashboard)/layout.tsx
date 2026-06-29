import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import CommandPalette from '@/components/ui/CommandPalette';
import Galaxy from '@/components/ui/galaxy';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full relative bg-zinc-950 selection:bg-indigo-500/30 overflow-hidden">
      {/* Immersive Animated Background */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
         <Galaxy />
      </div>
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(79,70,229,0.15),rgba(255,255,255,0))] pointer-events-none" />
      
      <div className="relative z-10 flex h-full">
        <Sidebar />
        <div className="lg:pl-72 flex flex-col min-h-screen w-full">
          <Topbar />
          <main className="flex-1 overflow-x-hidden p-6 md:p-8">
            <div className="max-w-7xl mx-auto backdrop-blur-sm rounded-3xl border border-white/5 bg-zinc-950/20 shadow-2xl shadow-indigo-500/5 overflow-hidden">
              <div className="p-4 md:p-6 lg:p-8">
                 {children}
              </div>
            </div>
          </main>
        </div>
      </div>
      <CommandPalette />
    </div>
  );
}
