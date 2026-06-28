"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Loader2, Zap, ArrowRight, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
const GridScan = dynamic(() => import('@/components/ui/GridScan'), { ssr: false });

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { 
      email: "",
      password: "",
      remember: false 
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) {
        if (error.message.includes("Failed to fetch")) {
          setError("Unable to connect to the authentication server. Please check your connection or try again later.");
        } else {
          setError(error.message);
        }
      } else {
        router.push("/mission-control");
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 overflow-hidden relative selection:bg-white/20">
      {/* Dynamic WebGL GridScan Background */}
      <div className="fixed inset-0 z-0 opacity-100 pointer-events-auto">
        <GridScan
          sensitivity={0.55}
          lineThickness={1}
          linesColor="#2e1065"
          gridScale={0.1}
          scanColor="#c084fc"
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
        className="w-full max-w-[400px] relative z-10"
      >
        <Card className="backdrop-blur-2xl bg-zinc-950/50 border border-purple-500/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_0_40px_rgba(168,85,247,0.15)] relative rounded-3xl overflow-hidden">
          
          <CardHeader className="space-y-4 pt-10 pb-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex justify-center mb-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 flex items-center justify-center shadow-[inset_0_0_20px_rgba(168,85,247,0.2)]">
                <Zap className="text-purple-400 w-7 h-7" />
              </div>
            </motion.div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-semibold text-center tracking-tight text-white">
                Welcome back
              </CardTitle>
              <CardDescription className="text-center text-zinc-400 text-sm font-normal px-2">
                Log in to ThreadCounty to access your Mission Control.
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
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase ml-1">Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              className="bg-zinc-950/50 border-zinc-800/50 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 rounded-xl h-11 transition-all px-4 text-sm shadow-inner [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#09090b] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
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
                      name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase ml-1">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                className="bg-zinc-950/50 border-zinc-800/50 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 rounded-xl h-11 transition-all pl-4 pr-10 text-sm shadow-inner [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#09090b] [&:-webkit-autofill]:[-webkit-text-fill-color:white]" 
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
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="remember"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0 p-1 mt-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-zinc-700 data-[state=checked]:bg-zinc-200 data-[state=checked]:text-black rounded-md w-4 h-4"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-medium text-xs text-zinc-400 cursor-pointer">
                              Remember me
                            </FormLabel>
                          </div>
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
                      <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 text-center font-medium mt-2">
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
                    className="group w-full rounded-xl h-12 text-sm font-semibold bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white hover:opacity-90 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-white/10" 
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                    ) : (
                      <>
                        Sign In <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                  <Link href="/forgot-password" className="text-zinc-300 hover:text-white transition-colors underline decoration-white/20 underline-offset-4">
                    Forgot password?
                  </Link>
                  <div>
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-zinc-300 hover:text-white transition-colors ml-1 underline decoration-white/20 underline-offset-4">
                      Sign up
                    </Link>
                  </div>
                </motion.div>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </motion.div>
    </div>
  );
}
