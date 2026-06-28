'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id);
    
    if (error) {
      toast.error('Error updating profile', { description: error.message });
    } else {
      toast.success('Success', { description: 'Profile updated successfully.' });
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return <div className="p-6 max-w-2xl mx-auto space-y-6"><Skeleton className="h-64" /></div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Your Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details here.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${fullName || user?.email}`} />
                <AvatarFallback>{fullName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <Button variant="outline" type="button">Change Picture</Button>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input disabled value={user?.email || ''} />
              <p className="text-xs text-muted-foreground">Your email is managed by your authentication provider.</p>
            </div>

            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>

            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Subscription Tier</span>
            <span className="uppercase text-primary">{profile?.subscription_tier || 'Free'}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Total Uploads</span>
            <span>{profile?.total_uploads || 0}</span>
          </div>
          <div className="pt-4">
             <Button variant="destructive" onClick={handleLogout}>Log Out</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
