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
import Link from "next/link";
import { Loader2 } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 dark:from-indigo-900/40 dark:via-purple-900/40 dark:to-pink-900/40 p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <Card className="w-full max-w-md backdrop-blur-xl bg-white/40 dark:bg-black/40 border-white/30 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] relative z-10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Check your email</CardTitle>
            <CardDescription className="text-foreground/80">We&apos;ve sent a password reset link to your email.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push('/login')} className="w-full rounded-xl">Back to Login</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 dark:from-zinc-950 dark:via-indigo-950/30 dark:to-zinc-950 p-4 overflow-hidden relative">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/30 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob dark:bg-purple-900/40"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-cyan-500/30 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000 dark:bg-cyan-900/40"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-500/30 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-4000 dark:bg-pink-900/40"></div>
      
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      <Card className="w-full max-w-md backdrop-blur-2xl bg-white/60 dark:bg-zinc-900/60 border-white/40 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] relative z-10 rounded-3xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500"></div>
        <CardHeader className="space-y-3 pb-6">
          <CardTitle className="text-3xl font-extrabold text-center tracking-tight">Forgot Password</CardTitle>
          <CardDescription className="text-center text-base text-foreground/70">
            Enter your email address to reset your password.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="bg-white/50 dark:bg-black/20 border-white/30 dark:border-white/10 focus-visible:ring-indigo-500 rounded-xl transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive text-center font-medium animate-in fade-in slide-in-from-top-1">
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button type="submit" className="w-full rounded-xl h-12 text-md font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 transition-all" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</> : "Send Reset Link"}
              </Button>
              <div className="text-sm text-muted-foreground text-center font-medium pt-4 border-t border-border/40 w-full">
                Remember your password?{" "}
                <Link href="/login" className="text-primary hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline transition-colors">
                  Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
