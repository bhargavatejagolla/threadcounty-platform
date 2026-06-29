'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ScanSearch, LineChart, Zap, Sparkles, Database, CheckCircle2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Lightfall from '@/components/ui/Lightfall';
import BorderGlow from '@/components/ui/BorderGlow';
import TrueFocus from '@/components/ui/TrueFocus';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRef } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: "easeOut" } }
};

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen bg-black text-white overflow-hidden relative selection:bg-indigo-500/30">
      
      {/* Interactive WebGL Lightfall Background */}
      <div className="fixed inset-0 z-0 opacity-100 pointer-events-auto">
        <Lightfall
          colors={['#ffffff', '#a1a1aa', '#52525b']}
          backgroundColor="#000000"
          speed={0.25}
          streakCount={4}
          streakWidth={2.0}
          streakLength={1.5}
          glow={3.0}
          density={0.5}
          twinkle={2.0}
          zoom={2.0}
          backgroundGlow={2.0}
          opacity={1.0}
          mouseInteraction={false}
        />
        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#000000_100%)] pointer-events-none"></div>
      </div>

      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none z-0"></div>

      {/* Hero Section */}
      <section className="relative px-6 min-h-screen flex items-center justify-center z-10 pt-20 pb-16">
        <motion.div 
          style={{ y: y1, opacity: opacity1 }}
          className="max-w-5xl mx-auto text-center space-y-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-4 shadow-2xl shadow-indigo-500/10 hover:bg-white/10 transition-colors cursor-pointer">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="text-sm font-medium text-zinc-300">Introducing ThreadCounty 2.0</span>
          </motion.div>

          <div className="space-y-8">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight drop-shadow-2xl">
              <motion.span variants={itemVariants} className="block text-white">Thread<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">County</span></motion.span>
            </h1>
            
            <motion.div variants={itemVariants} className="flex justify-center scale-75 md:scale-100 origin-top">
              <TrueFocus 
                sentence="True Explainable Machine Vision"
                manualMode={false}
                blurAmount={5}
                borderColor="#818cf8"
                glowColor="rgba(99, 102, 241, 0.6)"
                animationDuration={0.6}
                pauseBetweenAnimations={1.5}
              />
            </motion.div>

            <motion.p variants={itemVariants} className="text-xl md:text-3xl text-zinc-400 max-w-3xl mx-auto font-medium leading-relaxed mt-4">
              Automated textile inspection powered by deep learning. Uncover thread density and patterns in milliseconds.
            </motion.p>
          </div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-8">
            <Link href="/signup">
              <Button size="lg" className="h-16 px-10 text-lg rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all duration-300 hover:-translate-y-1">
                Start Analyzing Free <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="h-16 px-10 text-lg rounded-2xl backdrop-blur-xl bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 shadow-xl">
                View Architecture
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          >
            <Card className="bg-white/5 border-white/5 backdrop-blur-xl shadow-2xl hover:bg-white/10 transition-all duration-500">
              <CardContent className="p-8">
                <h4 className="text-5xl font-extrabold text-white mb-2">99<span className="text-indigo-400">%</span></h4>
                <p className="text-zinc-400 font-medium tracking-wide text-sm uppercase">Accuracy Rate</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/5 backdrop-blur-xl shadow-2xl hover:bg-white/10 transition-all duration-500">
              <CardContent className="p-8">
                <h4 className="text-5xl font-extrabold text-white mb-2">12<span className="text-purple-400">k+</span></h4>
                <p className="text-zinc-400 font-medium tracking-wide text-sm uppercase">Fabrics Scanned</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/5 backdrop-blur-xl shadow-2xl hover:bg-white/10 transition-all duration-500">
              <CardContent className="p-8">
                <h4 className="text-5xl font-extrabold text-white mb-2">2.1<span className="text-cyan-400">s</span></h4>
                <p className="text-zinc-400 font-medium tracking-wide text-sm uppercase">Avg Inference</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/5 backdrop-blur-xl shadow-2xl hover:bg-white/10 transition-all duration-500">
              <CardContent className="p-8">
                <h4 className="text-5xl font-extrabold text-white mb-2">24<span className="text-rose-400">/7</span></h4>
                <p className="text-zinc-400 font-medium tracking-wide text-sm uppercase">Uptime</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 relative z-10">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto space-y-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">Intelligence at scale.</h2>
            <p className="text-xl md:text-2xl text-zinc-400">We rebuilt fabric analysis from the ground up using state-of-the-art vision models.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <ScanSearch className="h-8 w-8 text-indigo-400" />,
                title: "Computer Vision",
                desc: "Microscopic-level weave detection recognizing warp, weft, and thread counts automatically.",
                glowColors: ['#818cf8', '#6366f1', '#4f46e5']
              },
              {
                icon: <Zap className="h-8 w-8 text-purple-400" />,
                title: "Instant Processing",
                desc: "Upload gigabytes of fabric scans. Our edge network processes inferences in milliseconds.",
                glowColors: ['#c084fc', '#a855f7', '#9333ea']
              },
              {
                icon: <Database className="h-8 w-8 text-cyan-400" />,
                title: "Immutable Records",
                desc: "Every scan is securely logged, versioned, and easily exportable as PDF compliance reports.",
                glowColors: ['#22d3ee', '#06b6d4', '#0891b2']
              }
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <BorderGlow
                  edgeSensitivity={25}
                  glowColor="270 80 80"
                  backgroundColor="#09090b"
                  borderRadius={24}
                  glowRadius={30}
                  glowIntensity={1.0}
                  coneSpread={20}
                  animated={true}
                  colors={feat.glowColors}
                  fillOpacity={0.15}
                  className="h-full"
                >
                  <Card className="bg-transparent border-none shadow-none h-full transition-transform duration-500 hover:-translate-y-1">
                    <CardHeader>
                      <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-6 border border-white/5 transition-transform duration-500 hover:scale-110">
                        {feat.icon}
                      </div>
                      <CardTitle className="text-2xl font-bold text-white">{feat.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-zinc-400 text-lg leading-relaxed">{feat.desc}</p>
                    </CardContent>
                  </Card>
                </BorderGlow>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 px-6 relative z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center space-y-12 relative z-10 border border-white/10 bg-white/[0.02] backdrop-blur-3xl p-16 md:p-24 rounded-[3rem] shadow-2xl"
        >
          <div className="space-y-6">
            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight">Deploy your QC.</h2>
            <p className="text-2xl text-zinc-400 font-medium max-w-2xl mx-auto">Join the future of manufacturing intelligence.</p>
          </div>
          <Link href="/signup" className="inline-block">
            <Button size="lg" className="h-16 px-12 text-xl rounded-full bg-white text-zinc-950 hover:bg-zinc-200 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_80px_rgba(255,255,255,0.5)] transition-all duration-500 hover:scale-105">
              Get Started Now
            </Button>
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
