'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ScanSearch, LineChart, Zap, Sparkles, Database, CheckCircle2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import BorderGlow from '@/components/ui/BorderGlow';
import TrueFocus from '@/components/ui/TrueFocus';
import StarBorder from '@/components/ui/StarBorder';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SpotlightCard from '@/components/ui/SpotlightCard';

const Lightfall = dynamic(() => import('@/components/ui/Lightfall'), { ssr: false });
const Ferrofluid = dynamic(() => import('@/components/ui/Ferrofluid'), { ssr: false });
const Strands = dynamic(() => import('@/components/ui/Strands'), { ssr: false });

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

const itemVariants: any = {
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

      <Navbar />

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
      <section className="py-40 px-6 relative z-10 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0 opacity-80 pointer-events-none mix-blend-screen">
          <Strands
            colors={["#c084fc", "#818cf8", "#4f46e5", "#06b6d4"]}
            count={5}
            speed={0.4}
            amplitude={1.2}
            waviness={1.5}
            thickness={0.8}
            glow={3.0}
            taper={2.5}
            spread={1.5}
            intensity={0.8}
            saturation={2}
            opacity={0.8}
            scale={1.5}
            glass={false}
          />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0)_60%)] pointer-events-none z-0"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl mx-auto text-center space-y-12 relative z-10 p-8 md:p-16 rounded-[3rem]"
        >
          <div className="space-y-6">
            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-white via-indigo-100 to-indigo-400 text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              Deploy your QC.
            </h2>
            <p className="text-2xl text-zinc-300 font-medium max-w-2xl mx-auto drop-shadow-md">
              Join the future of manufacturing intelligence.
            </p>
          </div>
          <div className="flex justify-center mt-8">
            <Link href="/signup">
              <StarBorder 
                as="button" 
                color="#6366f1" 
                speed="4s" 
                className="px-12 py-5 text-xl font-bold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_80px_rgba(255,255,255,0.5)]"
              >
                Get Started Now
              </StarBorder>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 px-6 relative z-10 border-t border-white/5 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">How it works</h2>
            <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">Three simple steps to transform your quality control pipeline.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0 z-0 border-dashed border-t border-indigo-500/50"></div>
            
            {[
              { step: '01', title: 'Upload Image', desc: 'Drag and drop high-resolution fabric scans. We support JPG and PNG up to 10MB.' },
              { step: '02', title: 'Neural Analysis', desc: 'NovaWeave Vision Engine extracts thread density, patterns, and quality metrics instantly.' },
              { step: '03', title: 'Export & Share', desc: 'Download compliance-ready PDF reports or share insights securely with your team.' }
            ].map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-3xl font-black text-indigo-400 mb-6 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                  {s.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-zinc-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Trusted by Industry Leaders</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "NovaWeave reduced our manual inspection time by 85%. The weave pattern detection is flawlessly accurate.", author: "Sarah Jenkins", role: "QC Director, Loom & Thread" },
              { quote: "The explainability metrics helped us trust the AI immediately. It's not a black box; it shows exactly why it scored the fabric.", author: "David Chen", role: "Textile Engineer, FabricCorp" },
              { quote: "Generating PDF compliance reports instantly has completely streamlined our export pipeline.", author: "Elena Rodriguez", role: "Operations Lead, WeaveMasters" }
            ].map((t, i) => (
              <SpotlightCard key={i} className="bg-zinc-950/50 border border-white/5 rounded-2xl p-8" spotlightColor="rgba(99,102,241,0.15)">
                <div className="flex flex-col h-full justify-between">
                  <p className="text-lg text-zinc-300 italic mb-8">"{t.quote}"</p>
                  <div>
                    <p className="font-bold text-white">{t.author}</p>
                    <p className="text-sm text-indigo-400">{t.role}</p>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}
