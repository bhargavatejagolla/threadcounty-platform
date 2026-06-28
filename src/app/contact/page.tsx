'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, MapPin, Phone } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    toast.success("Message sent!", {
        description: "We'll get back to you as soon as possible."
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold sm:text-5xl mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">
            Have questions about our AI models, pricing, or enterprise integration? We're here to help.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold">Email</h3>
              <p className="text-muted-foreground">threadcounty@gmail.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold">Location</h3>
              <p className="text-muted-foreground">DKTE Society's Textile & Engineering Institute (DKTESTEI) Ichalkaranji, Maharashtra</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold">Phone</h3>
              <p className="text-muted-foreground">+91 98765 43210</p>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send us a Message</CardTitle>
          <CardDescription>Fill out the form below and our team will contact you.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input required placeholder="John" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input required placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" required placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea required placeholder="How can we help you?" className="min-h-[120px]" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
