'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone, MessageSquare, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <Navbar />
      
      {/* Background */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none z-0"></div>
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] pointer-events-none rounded-full"></div>
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] pointer-events-none rounded-full"></div>

      <main className="flex-grow pt-32 pb-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-medium text-zinc-300 mb-2"
            >
              <MessageSquare className="h-4 w-4 text-indigo-400" /> Get in touch
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight"
            >
              Contact our Team
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-zinc-400"
            >
              Have a question about NovaWeave or want to request a demo? We'd love to hear from you.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Email Us</h3>
                  <p className="text-zinc-400 mb-2">Our friendly team is here to help.</p>
                  <a href="mailto:hello@threadcounty.com" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">hello@threadcounty.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Headquarters</h3>
                  <p className="text-zinc-400 mb-2">Come say hello at our office HQ.</p>
                  <p className="text-zinc-300 font-medium">100 Innovation Drive<br/>San Francisco, CA 94105</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Call Us</h3>
                  <p className="text-zinc-400 mb-2">Mon-Fri from 8am to 5pm.</p>
                  <a href="tel:+15550000000" className="text-zinc-300 font-medium hover:text-white transition-colors">+1 (555) 000-0000</a>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>
              
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 relative z-10">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                    <Send className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-zinc-400">Thanks for reaching out. We'll get back to you within 24 hours.</p>
                  <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-8 border-white/10 hover:bg-white/5">Send another</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">First name</label>
                      <Input required className="bg-zinc-900/50 border-white/10 focus-visible:ring-indigo-500/50" placeholder="Jane" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Last name</label>
                      <Input required className="bg-zinc-900/50 border-white/10 focus-visible:ring-indigo-500/50" placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Email</label>
                    <Input required type="email" className="bg-zinc-900/50 border-white/10 focus-visible:ring-indigo-500/50" placeholder="you@company.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Message</label>
                    <Textarea required className="bg-zinc-900/50 border-white/10 focus-visible:ring-indigo-500/50 min-h-[150px]" placeholder="How can we help?" />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl h-12">
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
