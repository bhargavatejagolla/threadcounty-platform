'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase/client';

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    // Fetch last analysis for context
    const { data } = await supabase
      .from('analyses')
      .select('fabric_type, weave_pattern, quality_score, defects')
      .order('created_at', { ascending: false })
      .limit(1);
    const context = data?.[0] || null;
    // Call Groq with context
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: input, context }),
    });
    
    if (res.ok) {
        const result = await res.json();
        setMessages(prev => [...prev, { role: 'assistant', content: result.answer }]);
    } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't connect to the chat service." }]);
    }
    
    setLoading(false);
  };

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg"
        onClick={() => setOpen(true)}
      >
        💬
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>AI Chat Assistant</DialogTitle></DialogHeader>
          <div className="h-64 overflow-y-auto border p-2 space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className={`p-2 rounded ${msg.role === 'user' ? 'bg-primary text-white ml-auto' : 'bg-muted'} max-w-[80%]`}>
                {msg.content}
              </div>
            ))}
            {loading && <p className="text-muted-foreground">Thinking...</p>}
          </div>
          <div className="flex gap-2">
            <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about fabric..." onKeyDown={e => e.key === 'Enter' && sendMessage()} />
            <Button onClick={sendMessage} disabled={loading}>Send</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
