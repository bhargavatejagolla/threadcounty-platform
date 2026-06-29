'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PillNav from '@/components/ui/PillNav';
import { Search } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ];

  const authButtons = (
    <div className="flex items-center gap-2">
      <Link href="/login">
        <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-white/5 rounded-full px-4">
          Sign In
        </Button>
      </Link>
      <Link href="/signup">
        <Button className="bg-white text-black hover:bg-zinc-200 rounded-full px-6 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all">
          Get Started
        </Button>
      </Link>
    </div>
  );

  return (
    <header className="fixed top-6 inset-x-0 z-50 flex justify-center w-full pointer-events-none px-6">
      <div className="pointer-events-auto flex items-center justify-between w-full max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex flex-1 items-center gap-2 group relative z-50">
          <img src="/logo.png" alt="NovaWeave Logo" className="h-8 w-auto rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] transition-shadow" />
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-indigo-100 transition-colors hidden md:block">
            NovaWeave
          </span>
        </Link>

        {/* Center Pill Nav */}
        <div className="hidden md:flex flex-[2] justify-center">
          <PillNav
            items={navLinks}
            activeHref={pathname}
            baseColor="#18181b"
            pillColor="#ffffff"
            hoveredPillTextColor="#000000"
            pillTextColor="#ffffff"
            initialLoadAnimation={true}
          />
        </div>

        {/* Mobile Pill Nav */}
        <div className="md:hidden flex-1 flex justify-end">
          <PillNav
            items={navLinks}
            activeHref={pathname}
            baseColor="#18181b"
            pillColor="#ffffff"
            hoveredPillTextColor="#000000"
            pillTextColor="#ffffff"
            initialLoadAnimation={true}
            mobileActions={
              <div className="flex flex-col gap-3 mt-4">
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full rounded-full border-black/20 text-black">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" className="w-full">
                  <Button className="w-full rounded-full bg-indigo-600 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            }
          />
        </div>

        {/* Right Auth Buttons */}
        <div className="hidden md:flex flex-1 justify-end">
          {authButtons}
        </div>
      </div>
    </header>
  );
}
