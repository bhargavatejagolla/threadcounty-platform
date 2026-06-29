'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  ScanSearch, 
  Search, 
  Library, 
  BarChart3, 
  Settings, 
  ShieldCheck,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Mission Control', href: '/mission-control', icon: LayoutDashboard },
  { name: 'Fabric Scanner', href: '/scanner', icon: ScanSearch },
  { name: 'Analysis Vault', href: '/vault', icon: Library },
  { name: 'Intelligence Reports', href: '/reports', icon: BarChart3 },
  { name: 'Performance Center', href: '/performance', icon: Activity },
];

const bottomNavigation = [
  { name: 'Admin Console', href: '/admin', icon: ShieldCheck },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  const NavItem = ({ item }: { item: any }) => {
    const isActive = pathname?.startsWith(item.href);
    
    return (
      <Link href={item.href} className="relative block">
        <div
          className={cn(
            'group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200',
            isActive
              ? 'text-white bg-indigo-500/10 border border-indigo-500/20'
              : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
          )}
        >
          <item.icon
            className={cn(
              'mr-3 flex-shrink-0 h-5 w-5 transition-colors',
              isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'
            )}
            aria-hidden="true"
          />
          <span className="truncate">{item.name}</span>
          
          {/* Active Indicator Glow */}
          {isActive && (
            <motion.div
              layoutId="sidebar-active-indicator"
              className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"
              initial={false}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </div>
      </Link>
    );
  };

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 z-50">
      <div className="flex-1 flex flex-col min-h-0 bg-zinc-950/80 backdrop-blur-xl border-r border-white/5 shadow-2xl">
        {/* Logo */}
        <div className="flex items-center h-16 flex-shrink-0 px-6 border-b border-white/5">
          <Link href="/mission-control" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="NovaWeave Logo" className="h-8 w-auto rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] transition-shadow" />
            <span className="font-bold text-lg tracking-tight text-white group-hover:text-indigo-100 transition-colors">
              NovaWeave AI™
            </span>
          </Link>
        </div>

        {/* Search / Command Hint */}
        <div className="px-4 py-4">
          <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-zinc-400 bg-zinc-900/50 hover:bg-zinc-900 border border-white/5 rounded-lg transition-colors group cursor-not-allowed">
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4 text-zinc-500 group-hover:text-zinc-400" />
              Search fabrics...
            </span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 bg-zinc-800 rounded border border-zinc-700">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-white/5 space-y-1">
          {bottomNavigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
