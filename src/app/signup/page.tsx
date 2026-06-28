"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import Link from 'next/link'
import { Loader2, Sparkles, ArrowRight, CheckCircle2, ArrowLeft, ScanSearch, Eye, EyeOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
const GridScan = dynamic(() => import('@/components/ui/GridScan'), { ssr: false })

const signupSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  })

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.fullName },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/verify`,
        }
      })
      if (error) {
        if (error.message.includes("Failed to fetch")) {
          setError("Unable to connect to the authentication server. Please check your connection or try again later.");
        } else {
          setError(error.message);
        }
      } else {
        setSuccess(true)
        // Auto redirect after a few seconds could be implemented here
      }
    } catch (err: any) {
       setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950 to-zinc-950"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-[2rem] blur opacity-30"></div>
          <Card className="backdrop-blur-2xl bg-zinc-950/80 border-white/5 shadow-2xl relative rounded-[2rem] overflow-hidden p-8 flex flex-col items-center text-center">
             <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
               className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6"
             >
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
             </motion.div>
            <CardTitle className="text-3xl font-bold text-white mb-3">Check your email</CardTitle>
            <CardDescription className="text-zinc-400 text-base mb-8">
              We&apos;ve sent a verification link to your email to complete your registration.
            </CardDescription>
            <Button onClick={() => router.push('/login')} className="w-full rounded-xl h-12 bg-white text-zinc-950 hover:bg-zinc-200">
              Go to Login
            </Button>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 overflow-hidden relative selection:bg-white/20">
      {/* Dynamic WebGL GridScan Background */}
      <div className="fixed inset-0 z-0 opacity-100 pointer-events-auto">
        <GridScan
          sensitivity={0.55}
          lineThickness={1}
          linesColor="#1e1b4b"
          gridScale={0.1}
          scanColor="#818cf8"
          scanOpacity={0.5}
          enablePost
          bloomIntensity={0.8}
          chromaticAberration={0.002}
          noiseIntensity={0.02}
          lineJitter={0.1}
          scanGlow={1.0}
          scanSoftness={2}
          enableWebcam={false}
          showPreview={false}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#000000_100%)] pointer-events-none"></div>
      </div>

      <Link href="/" className="absolute top-8 left-8 z-50 flex items-center text-zinc-500 hover:text-white transition-colors group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium text-sm">Back</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[400px] relative z-10 my-8"
      >
        <Card className="backdrop-blur-2xl bg-zinc-950/50 border border-indigo-500/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_0_40px_rgba(99,102,241,0.15)] relative rounded-3xl overflow-hidden">
          
          <CardHeader className="space-y-4 pt-10 pb-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex justify-center mb-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-500/30 flex items-center justify-center shadow-[inset_0_0_20px_rgba(99,102,241,0.2)]">
                <ScanSearch className="text-indigo-400 w-7 h-7" />
              </div>
            </motion.div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-semibold text-center tracking-tight text-white">
                Create account
              </CardTitle>
              <CardDescription className="text-center text-zinc-400 text-sm font-normal px-2">
                Join ThreadCounty to experience the next generation of AI fabric analysis.
              </CardDescription>
            </div>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <CardContent className="space-y-5 px-8 pb-2">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase ml-1">Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="John Doe" 
                              className="bg-zinc-950/50 border-zinc-800/50 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 rounded-xl h-11 transition-all px-4 text-sm shadow-inner [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#09090b] [&:-webkit-autofill]:[-webkit-text-fill-color:white]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-rose-400 text-xs" />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase ml-1">Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="you@example.com" 
                              type="email" 
                              className="bg-zinc-950/50 border-zinc-800/50 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 rounded-xl h-11 transition-all px-4 text-sm shadow-inner [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#09090b] [&:-webkit-autofill]:[-webkit-text-fill-color:white]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-rose-400 text-xs" />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase ml-1">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                className="bg-zinc-950/50 border-zinc-800/50 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 rounded-xl h-11 transition-all pl-4 pr-10 text-sm shadow-inner [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#09090b] [&:-webkit-autofill]:[-webkit-text-fill-color:white]" 
                                {...field} 
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-rose-400 text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase ml-1">Confirm</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                className="bg-zinc-950/50 border-zinc-800/50 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 rounded-xl h-11 transition-all pl-4 pr-10 text-sm shadow-inner [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#09090b] [&:-webkit-autofill]:[-webkit-text-fill-color:white]" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-rose-400 text-xs" />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400 text-center font-medium mt-2">
                        {error}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-5 px-8 pb-8 pt-2">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="w-full"
                >
                  <Button 
                    type="submit" 
                    className="group w-full rounded-xl h-12 text-sm font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:opacity-90 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-white/10" 
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                    ) : (
                      <>
                        Sign Up <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="flex flex-col space-y-3 text-xs text-zinc-500 text-center font-medium w-full pt-4 border-t border-white/[0.08]"
                >
                  <div>
                    Already have an account?{" "}
                    <Link href="/login" className="text-zinc-300 hover:text-white transition-colors ml-1 underline decoration-white/20 underline-offset-4">
                      Sign in
                    </Link>
                  </div>
                </motion.div>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </motion.div>
    </div>
  )
}
