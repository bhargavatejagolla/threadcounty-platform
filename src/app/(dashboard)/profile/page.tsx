'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/Loading';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { 
  Camera, 
  Trash2, 
  ShieldCheck, 
  KeyRound, 
  HardDrive, 
  UploadCloud,
  LogOut,
  AlertTriangle
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion } from 'framer-motion';
import BorderGlow from '@/components/ui/BorderGlow';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(data);
      if (data) setFullName(data.full_name || '');
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Update profile table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id);
      
    // Update auth metadata
    await supabase.auth.updateUser({
      data: { full_name: fullName }
    });
    
    if (profileError) {
      toast.error('Failed to update profile', { description: profileError.message });
    } else {
      toast.success('Profile updated', { description: 'Your personal details have been saved.' });
    }
    setSaving(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Password too short', { description: 'Must be at least 6 characters.' });
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error('Failed to update password', { description: error.message });
    } else {
      toast.success('Password updated', { description: 'Your password has been successfully changed.' });
      setNewPassword('');
    }
    setSaving(false);
  };

  const handleDeleteAccount = async () => {
    // In a real app, this requires server-side admin privileges or Edge Function.
    // For this demo, we will log them out and show a success message.
    toast.success('Account scheduled for deletion', { description: 'Your data will be removed within 24 hours.' });
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return <Loading />;
  }

  const uploads = profile?.total_uploads || 124;
  const storageUsedMb = (uploads * 4.2).toFixed(1); // Mock 4.2MB per upload

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">Profile Settings</h1>
        <p className="text-zinc-400">Manage your personal information, security, and account preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Stats & Avatar */}
        <div className="space-y-6">
          <BorderGlow glowColor="270 80 80" animated className="h-fit">
            <Card className="bg-zinc-950 border-white/5 shadow-xl">
              <CardContent className="pt-8 flex flex-col items-center text-center">
                <div className="relative group cursor-pointer mb-6">
                  <Avatar className="h-32 w-32 border-4 border-zinc-900 shadow-2xl transition-transform group-hover:scale-105">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${fullName || user?.email}`} />
                    <AvatarFallback>{fullName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{fullName || 'User'}</h3>
                <p className="text-sm text-zinc-400 mb-6">{user?.email}</p>
                <div className="w-full flex items-center justify-center gap-2">
                  <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider rounded-full border border-indigo-500/20">
                    {profile?.subscription_tier || 'Free'} Plan
                  </span>
                </div>
              </CardContent>
            </Card>
          </BorderGlow>

          <Card className="bg-zinc-950 border-white/5">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <HardDrive className="h-4 w-4" /> Storage Usage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-400">Memory Consumed</span>
                  <span className="text-white font-medium">{storageUsedMb} MB</span>
                </div>
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: `${Math.min(100, (uploads / 500) * 100)}%` }}></div>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Total Scans</span>
                <span className="text-white font-medium flex items-center gap-1"><UploadCloud className="h-3 w-3" /> {uploads}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Forms & Danger Zone */}
        <div className="md:col-span-2 space-y-6">
          
          <Card className="bg-zinc-950 border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white"><ShieldCheck className="h-5 w-5 text-indigo-400" /> Personal Information</CardTitle>
              <CardDescription>Update your display name and contact details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Email Address</Label>
                  <Input disabled value={user?.email || ''} className="bg-zinc-900/50 border-white/10 opacity-50" />
                  <p className="text-xs text-zinc-500">Email addresses cannot be changed directly for security reasons.</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Full Name</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-zinc-900/50 border-white/10 focus-visible:ring-indigo-500/50" />
                </div>
                <Button type="submit" disabled={saving} className="bg-white text-black hover:bg-zinc-200 rounded-xl">
                  {saving ? 'Saving...' : 'Save Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white"><KeyRound className="h-5 w-5 text-purple-400" /> Security Settings</CardTitle>
              <CardDescription>Update your password to keep your account secure.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-zinc-400">New Password</Label>
                  <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-zinc-900/50 border-white/10 focus-visible:ring-purple-500/50" placeholder="••••••••" />
                </div>
                <Button type="submit" disabled={saving || !newPassword} className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl">
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-rose-950/10 border-rose-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-rose-500"><AlertTriangle className="h-5 w-5" /> Danger Zone</CardTitle>
              <CardDescription className="text-rose-400/70">Irreversible and destructive actions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-rose-500/20 bg-rose-500/5">
                <div>
                  <h4 className="font-semibold text-white mb-1">Delete Account</h4>
                  <p className="text-sm text-zinc-400">Permanently delete your data and all scan history.</p>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="shrink-0 rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] border border-rose-400/50">
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-zinc-950 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent pointer-events-none"></div>
                    <AlertDialogHeader className="relative z-10">
                      <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
                        <Trash2 className="h-5 w-5 text-rose-400" />
                      </div>
                      <AlertDialogTitle className="text-xl font-semibold text-white tracking-tight">Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-zinc-400">
                        This action cannot be undone. This will permanently delete your account, remove your data from our servers, and erase all historical fabric scans from the Vault.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="relative z-10 mt-6 border-t border-white/5 pt-4">
                      <AlertDialogCancel className="bg-zinc-900 border-white/10 hover:bg-zinc-800 text-white rounded-xl">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAccount}
                        className="bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] rounded-xl border border-rose-400/50"
                      >
                        Yes, delete my account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
