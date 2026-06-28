'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export default function ComparePage() {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected1, setSelected1] = useState<string>('');
  const [selected2, setSelected2] = useState<string>('');

  useEffect(() => {
    const fetchAnalyses = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('analyses')
        .select('*, uploads(file_name, file_url)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setAnalyses(data);
      setLoading(false);
    };
    fetchAnalyses();
  }, []);

  const data1 = analyses.find(a => a.id === selected1);
  const data2 = analyses.find(a => a.id === selected2);

  if (loading) {
    return <div className="p-6"><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Fabric Comparison Tool</h1>
        <p className="text-muted-foreground">Select two past analyses to compare their metrics side-by-side.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Selector 1 */}
        <div className="space-y-4">
          <Select value={selected1} onValueChange={setSelected1}>
            <SelectTrigger>
              <SelectValue placeholder="Select first fabric..." />
            </SelectTrigger>
            <SelectContent>
              {analyses.map(a => (
                <SelectItem key={a.id} value={a.id}>{a.uploads?.file_name} ({a.fabric_type})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {data1 ? (
            <Card className="border-primary shadow-sm">
              <CardHeader>
                <CardTitle>{data1.uploads?.file_name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <img src={data1.uploads?.file_url} alt="fabric 1" className="w-full h-48 object-cover rounded-md" />
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium text-muted-foreground">Fabric Type:</div>
                  <div>{data1.fabric_type || 'N/A'}</div>
                  <div className="font-medium text-muted-foreground">Weave:</div>
                  <div>{data1.weave_pattern || 'N/A'}</div>
                  <div className="font-medium text-muted-foreground">Warp Count:</div>
                  <div>{data1.warp_count || 'N/A'}</div>
                  <div className="font-medium text-muted-foreground">Weft Count:</div>
                  <div>{data1.weft_count || 'N/A'}</div>
                  <div className="font-medium text-muted-foreground">Quality Score:</div>
                  <div className={`font-bold ${data1.quality_score > 70 ? 'text-green-600' : 'text-red-600'}`}>{data1.quality_score}/100</div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-[400px] border-2 border-dashed rounded-xl flex items-center justify-center text-muted-foreground">
              Select a fabric to view metrics
            </div>
          )}
        </div>

        {/* Selector 2 */}
        <div className="space-y-4">
          <Select value={selected2} onValueChange={setSelected2}>
            <SelectTrigger>
              <SelectValue placeholder="Select second fabric..." />
            </SelectTrigger>
            <SelectContent>
              {analyses.map(a => (
                <SelectItem key={a.id} value={a.id}>{a.uploads?.file_name} ({a.fabric_type})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {data2 ? (
            <Card className="border-primary shadow-sm">
              <CardHeader>
                <CardTitle>{data2.uploads?.file_name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <img src={data2.uploads?.file_url} alt="fabric 2" className="w-full h-48 object-cover rounded-md" />
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium text-muted-foreground">Fabric Type:</div>
                  <div>{data2.fabric_type || 'N/A'}</div>
                  <div className="font-medium text-muted-foreground">Weave:</div>
                  <div>{data2.weave_pattern || 'N/A'}</div>
                  <div className="font-medium text-muted-foreground">Warp Count:</div>
                  <div>{data2.warp_count || 'N/A'}</div>
                  <div className="font-medium text-muted-foreground">Weft Count:</div>
                  <div>{data2.weft_count || 'N/A'}</div>
                  <div className="font-medium text-muted-foreground">Quality Score:</div>
                  <div className={`font-bold ${data2.quality_score > 70 ? 'text-green-600' : 'text-red-600'}`}>{data2.quality_score}/100</div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-[400px] border-2 border-dashed rounded-xl flex items-center justify-center text-muted-foreground">
              Select a fabric to view metrics
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
