'use client';

import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SpotlightCard from '@/components/ui/SpotlightCard';
import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Free',
    price: '$0',
    duration: 'forever',
    description: 'Perfect for exploring the platform.',
    features: ['5 Image Uploads per month', 'Basic Thread Density', 'Standard Community Support'],
    notIncluded: ['Weave Pattern Detection', 'Downloadable PDF Reports', 'API Access'],
    buttonText: 'Get Started',
    popular: false,
  },
  {
    name: 'Student',
    price: '$9',
    duration: 'per month',
    description: 'For textile students and researchers.',
    features: ['50 Image Uploads per month', 'Advanced AI Analysis', 'Weave Pattern Detection', 'Priority Email Support'],
    notIncluded: ['Downloadable PDF Reports', 'API Access'],
    buttonText: 'Subscribe Student',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$49',
    duration: 'per month',
    description: 'For industry professionals.',
    features: ['Unlimited Uploads', 'Premium AI Analysis', 'Weave Pattern Detection', 'Downloadable PDF Reports', 'Defect Detection', '24/7 Support'],
    notIncluded: ['API Access'],
    buttonText: 'Subscribe Professional',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    duration: 'annual billing',
    description: 'For large textile manufacturers.',
    features: ['Unlimited Everything', 'API Access', 'Custom AI Model Training', 'Dedicated Account Manager', 'On-premise Deployment Options'],
    notIncluded: [],
    buttonText: 'Contact Sales',
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <Navbar />
      
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none z-0"></div>
      <div className="fixed top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent pointer-events-none"></div>

      <main className="flex-grow pt-32 pb-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight"
            >
              Simple, transparent pricing
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-zinc-400"
            >
              Choose the perfect plan for your textile analysis needs. Upgrade or downgrade at any time.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="h-full"
              >
                <SpotlightCard 
                  className={`h-full flex flex-col p-8 rounded-3xl border ${
                    plan.popular 
                      ? 'bg-indigo-950/20 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.15)] relative overflow-hidden' 
                      : 'bg-zinc-950/50 border-white/10'
                  }`}
                  spotlightColor={plan.popular ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.1)'}
                >
                  {plan.popular && (
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
                  )}
                  
                  <div className="mb-8">
                    {plan.popular && (
                      <span className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider rounded-full border border-indigo-500/20 mb-4">
                        Most Popular
                      </span>
                    )}
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-sm text-zinc-400 h-10">{plan.description}</p>
                  </div>

                  <div className="mb-8 flex items-baseline gap-2">
                    <span className="text-5xl font-extrabold tracking-tight text-white">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-sm font-medium text-zinc-500">{plan.duration}</span>}
                  </div>

                  <Button 
                    className={`w-full rounded-xl h-12 font-semibold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] border-none'
                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                    }`}
                  >
                    {plan.buttonText}
                  </Button>

                  <div className="mt-8 space-y-4 flex-grow">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Included</p>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-zinc-300">
                          <Check className="h-5 w-5 text-emerald-400 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {plan.notIncluded.length > 0 && (
                      <>
                        <div className="pt-4 pb-2">
                          <div className="h-px w-full bg-white/5"></div>
                        </div>
                        <ul className="space-y-3">
                          {plan.notIncluded.map((feature) => (
                            <li key={feature} className="flex items-start gap-3 text-sm text-zinc-600">
                              <X className="h-5 w-5 text-zinc-700 shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
