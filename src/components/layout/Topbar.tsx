'use client';

import { Bell, User, CheckCircle2, Clock, Trash2, X, Activity, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAppStore } from '@/store/useAppStore';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function Topbar() {
  const { notifications, getUnreadCount, markAllNotificationsRead, markNotificationRead, clearNotifications } = useAppStore();
  const unreadCount = getUnreadCount();
  const router = useRouter();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center gap-4">
          {/* Engine Status */}
          <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-emerald-400 tracking-wider uppercase">Engine Ready</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <span className="text-xs font-medium text-zinc-400">NovaWeave v3.2.1</span>
            <div className="w-px h-3 bg-white/10" />
            <span className="text-xs font-medium text-zinc-500">Groq Llama-3.3</span>
          </div>
        </div>
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-full relative">
                <span className="sr-only">View notifications</span>
                <Bell className="h-5 w-5" aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-zinc-950/95 backdrop-blur-xl border-white/10 text-white shadow-2xl p-0">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-rose-500/20 text-rose-400 text-[10px] px-2 py-0.5 rounded-full font-medium">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={markAllNotificationsRead} className="text-xs text-zinc-400 hover:text-white transition-colors">
                    Mark all read
                  </button>
                  <button onClick={clearNotifications} className="text-xs text-zinc-400 hover:text-white transition-colors" title="Clear All">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500 flex flex-col items-center">
                    <Bell className="h-8 w-8 mb-2 opacity-20" />
                    <p className="text-sm">You're all caught up</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-4 flex gap-3 hover:bg-white/5 transition-colors cursor-pointer ${notif.read ? 'opacity-60' : 'bg-white/[0.02]'}`}
                      >
                        <div className={`mt-0.5 flex shrink-0 h-2 w-2 rounded-full ${
                          notif.type === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                          notif.type === 'error' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' :
                          notif.type === 'warning' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
                          'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]'
                        }`} />
                        <div className="flex-1 space-y-1">
                          <p className={`text-sm font-medium ${notif.read ? 'text-zinc-300' : 'text-white'}`}>{notif.title}</p>
                          <p className="text-xs text-zinc-400 line-clamp-2">{notif.message}</p>
                          <div className="flex items-center gap-1 text-[10px] text-zinc-500 mt-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(notif.timestamp, { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-2 border-t border-white/5">
                <Button variant="ghost" className="w-full text-xs text-zinc-400 hover:text-white hover:bg-white/5 h-8">
                  View All Activity
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-white/10" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center p-1.5 gap-2 hover:bg-white/5 rounded-full outline-none focus:ring-2 focus:ring-indigo-500/50">
                  <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 overflow-hidden relative group-hover:border-indigo-400 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/40 to-purple-500/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <User className="h-4 w-4 text-indigo-300 relative z-10" />
                  </div>
                  <span className="hidden lg:flex lg:items-center">
                    <span className="ml-2 text-sm font-medium leading-6 text-zinc-300 group-hover:text-white transition-colors" aria-hidden="true">
                      Quality Inspector
                    </span>
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-zinc-950/95 backdrop-blur-xl border-white/10 text-white shadow-2xl rounded-xl">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">Quality Inspector</p>
                    <p className="text-xs leading-none text-zinc-400">admin@threadcounty.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="cursor-pointer hover:bg-white/5 focus:bg-white/5 rounded-lg text-zinc-300 hover:text-white transition-colors">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  onSelect={(e) => {
                    e.preventDefault();
                    setShowLogoutDialog(true);
                  }}
                  className="cursor-pointer text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 focus:bg-rose-500/10 focus:text-rose-300 rounded-lg transition-colors font-medium"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Premium Logout Confirmation Dialog */}
            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
              <AlertDialogContent className="bg-zinc-950 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent pointer-events-none"></div>
                <AlertDialogHeader className="relative z-10">
                  <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
                    <LogOut className="h-5 w-5 text-rose-400" />
                  </div>
                  <AlertDialogTitle className="text-xl font-semibold text-white tracking-tight">Disconnect from NovaWeave Engine?</AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-400">
                    Are you sure you want to end your session? Any unsaved local analysis buffers will be cleared from memory.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="relative z-10 mt-6 border-t border-white/5 pt-4">
                  <AlertDialogCancel disabled={isLoggingOut} className="bg-zinc-900 border-white/10 hover:bg-zinc-800 text-white rounded-xl">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                    disabled={isLoggingOut}
                    className="bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] rounded-xl border border-rose-400/50"
                  >
                    {isLoggingOut ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Disconnecting...</>
                    ) : (
                      "Confirm Disconnect"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
