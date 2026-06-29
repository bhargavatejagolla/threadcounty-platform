'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    category: "Platform & AI Analysis",
    questions: [
      { q: "How accurate is the weave pattern detection?", a: "Our AI models achieve 99.4% accuracy on standard weaves (Plain, Twill, Satin) and 96% on complex jacquards, utilizing GLCM feature extraction and OpenCV." },
      { q: "How long does analysis take?", a: "The NovaWeave Engine runs edge inferences in an average of 2.1 seconds per 10MB high-resolution fabric scan." },
      { q: "What is the 'Explainability Score'?", a: "Instead of a black box, our model outputs an Explainability Score based on Entropy, Homogeneity, and Contrast. This shows you exactly *why* the AI made its decision." }
    ]
  },
  {
    category: "Pricing & Accounts",
    questions: [
      { q: "Can I try it for free?", a: "Yes, our Free plan includes 5 image uploads per month so you can test the basic thread density metrics before committing." },
      { q: "What happens if I hit my upload limit?", a: "You will be unable to analyze new scans until the next billing cycle, or you can upgrade instantly from your Billing Dashboard." },
      { q: "How do I delete my account?", a: "You can permanently delete your account and all associated scan data from the Profile Settings page. This action is irreversible." }
    ]
  },
  {
    category: "Technical Specs",
    questions: [
      { q: "What file types are supported?", a: "We currently support high-resolution JPG and PNG files up to 10MB." },
      { q: "Can I export my reports?", a: "Yes. Professional and Enterprise users can export compliance-ready PDF reports directly from the Inspection Vault." },
      { q: "Do you offer an API?", a: "Enterprise clients receive a dedicated API key for integrating the NovaWeave Engine directly into their existing manufacturing pipelines." }
    ]
  }
];

export default function FAQPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <Navbar />
      
      {/* Background */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none z-0"></div>
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[150px] pointer-events-none rounded-full"></div>

      <main className="flex-grow pt-32 pb-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-20 space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-medium text-zinc-300"
            >
              <HelpCircle className="h-4 w-4 text-indigo-400" /> Knowledge Base
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight"
            >
              Frequently asked questions
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-zinc-400 max-w-2xl mx-auto"
            >
              Everything you need to know about the product and billing. Can't find the answer? <a href="/contact" className="text-indigo-400 hover:underline">Contact our team.</a>
            </motion.p>
          </div>

          <div className="space-y-16">
            {faqs.map((section, sectionIdx) => (
              <motion.div 
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (sectionIdx * 0.1) }}
              >
                <h2 className="text-2xl font-bold mb-6 text-indigo-400">{section.category}</h2>
                <div className="bg-zinc-950/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
                  <Accordion type="single" collapsible className="w-full">
                    {section.questions.map((item, i) => (
                      <AccordionItem key={i} value={`item-${sectionIdx}-${i}`} className="border-white/10">
                        <AccordionTrigger className="text-left text-lg font-medium text-white hover:text-indigo-300 hover:no-underline py-4">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-zinc-400 text-base leading-relaxed">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
