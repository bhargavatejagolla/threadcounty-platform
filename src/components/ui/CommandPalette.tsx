'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { Search, ScanSearch, BarChart3, LayoutDashboard, Library, Settings, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    async function searchDB() {
      if (!query || query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      const { data } = await supabase
        .from('inspections')
        .select('id, inspection_id, material_prediction, created_at')
        .or(`inspection_id.ilike.%${query}%,material_prediction.ilike.%${query}%`)
        .limit(5);
      
      setResults(data || []);
      setLoading(false);
    }
    
    const timeout = setTimeout(searchDB, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950/80 backdrop-blur-sm flex items-start justify-center pt-[15vh]">
      <div className="w-full max-w-xl mx-4 relative bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden shadow-indigo-500/10">
        <Command label="Command Menu" className="w-full bg-transparent text-zinc-100">
          <div className="flex items-center border-b border-white/10 px-4">
            <Search className="h-5 w-5 text-zinc-500 shrink-0" />
            <Command.Input 
              value={query}
              onValueChange={setQuery}
              placeholder="Search fabrics (e.g. TC-2026...), reports, commands..." 
              className="flex-1 bg-transparent border-0 px-4 py-4 text-sm outline-none placeholder:text-zinc-500" 
              autoFocus
            />
            {loading && <Loader2 className="h-4 w-4 text-zinc-500 animate-spin mr-2" />}
            <button onClick={() => setOpen(false)} className="text-[10px] text-zinc-500 bg-white/5 px-2 py-1 rounded border border-white/10 hover:bg-white/10 transition-colors">ESC</button>
          </div>

          <Command.List className="max-h-[400px] overflow-y-auto p-2 custom-scrollbar">
            <Command.Empty className="py-6 text-center text-sm text-zinc-500">
              No results found.
            </Command.Empty>
            
            {results.length > 0 && (
              <Command.Group heading={<div className="px-2 py-1.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">Scans & Reports</div>}>
                {results.map((r) => (
                  <Command.Item 
                    key={r.id}
                    onSelect={() => runCommand(() => router.push(`/inspection/${r.id}`))}
                    className="flex flex-col items-start px-3 py-2 rounded-xl cursor-pointer hover:bg-white/5 aria-selected:bg-white/5 transition-colors text-sm text-zinc-300"
                  >
                    <div className="font-mono text-indigo-400">{r.inspection_id}</div>
                    <div className="text-[10px] text-zinc-500">{r.material_prediction || 'Unknown Material'} • {new Date(r.created_at).toLocaleDateString()}</div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            <Command.Group heading={<div className="px-2 py-1.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</div>}>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/scanner'))}
                className="flex items-center px-2 py-2.5 rounded-xl cursor-pointer hover:bg-indigo-500/10 hover:text-indigo-300 aria-selected:bg-indigo-500/10 aria-selected:text-indigo-300 transition-colors text-sm"
              >
                <ScanSearch className="h-4 w-4 mr-2" />
                Scan New Fabric
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/reports'))}
                className="flex items-center px-2 py-2.5 rounded-xl cursor-pointer hover:bg-indigo-500/10 hover:text-indigo-300 aria-selected:bg-indigo-500/10 aria-selected:text-indigo-300 transition-colors text-sm"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Intelligence Report
              </Command.Item>
            </Command.Group>

            <Command.Group heading={<div className="px-2 py-1.5 text-xs font-medium text-zinc-500 uppercase tracking-wider mt-4">Navigation</div>}>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/mission-control'))}
                className="flex items-center px-2 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 aria-selected:bg-white/5 transition-colors text-sm text-zinc-300"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Mission Control
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/vault'))}
                className="flex items-center px-2 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 aria-selected:bg-white/5 transition-colors text-sm text-zinc-300"
              >
                <Library className="h-4 w-4 mr-2" />
                Analysis Vault
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/settings'))}
                className="flex items-center px-2 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 aria-selected:bg-white/5 transition-colors text-sm text-zinc-300"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
