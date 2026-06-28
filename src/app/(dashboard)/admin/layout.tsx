'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Upload, BarChart3, Home } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/uploads', label: 'Uploads', icon: Upload },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-background p-4">
        <h2 className="text-2xl font-bold mb-6">Admin</h2>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted transition-colors ${isActive ? 'bg-muted' : ''}`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
