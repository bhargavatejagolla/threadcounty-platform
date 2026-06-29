'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import dynamic from 'next/dynamic';

const ColorBends = dynamic(() => import('@/components/ui/ColorBends'), { ssr: false });

export default function AdminUploadsPage() {
  const [uploads, setUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUploads = async () => {
    setLoading(true);
    // Ideally this goes through an API route to enforce admin checks, but for hackathon demo we query supabase directly if RLS allows (assuming admin has bypass RLS or policy allows)
    // For production, create `src/app/api/admin/uploads/route.ts`. We'll just fetch directly for speed.
    const { data } = await supabase.from('uploads').select('*, analyses(id, fabric_type)').order('created_at', { ascending: false }).limit(50);
    if (data) setUploads(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const deleteUpload = async (id: string, url: string) => {
    if (!confirm('Delete this upload and associated analysis globally?')) return;
    
    // Extract path from URL (assuming public URL)
    const urlObj = new URL(url);
    const path = urlObj.pathname.split('/').slice(3).join('/'); 
    await supabase.storage.from('fabric-images').remove([path]);
    
    const { error } = await supabase.from('uploads').delete().eq('id', id);
    if (error) {
      toast.error('Error', { description: error.message });
    } else {
      toast.success('Success', { description: 'Upload deleted.' });
      fetchUploads();
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)]">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen">
        <ColorBends
          colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
          rotation={90}
          speed={0.1}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          noise={0.1}
          parallax={0.5}
          iterations={1}
          intensity={1.2}
          bandWidth={6}
          transparent
          autoRotate={0}
        />
      </div>
      <div className="p-6 max-w-6xl mx-auto space-y-6 relative z-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">Manage Uploads</h1>
          <p className="text-zinc-400 mt-1">View and moderate all images uploaded to the platform.</p>
        </div>

        <Card className="bg-zinc-950/50 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Recent Uploads (Global)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-4">Loading uploads...</TableCell></TableRow>
              ) : uploads.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-4">No uploads found.</TableCell></TableRow>
              ) : (
                uploads.map(upload => (
                  <TableRow key={upload.id}>
                    <TableCell>
                      <img src={upload.file_url} alt="preview" className="h-10 w-10 object-cover rounded" />
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">{upload.file_name}</TableCell>
                    <TableCell>{formatBytes(upload.file_size)}</TableCell>
                    <TableCell className="max-w-[100px] truncate" title={upload.user_id}>{upload.user_id}</TableCell>
                    <TableCell>{new Date(upload.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => window.open(upload.file_url, '_blank')}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteUpload(upload.id, upload.file_url)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
