"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

function VerifyContent() {
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // In Supabase, email links usually use implicit flow (hash fragment) which is handled by supabase-js automatically.
    // If we're on this page and there's an error in the query string, show it.
    const errorDesc = searchParams.get("error_description");
    if (errorDesc) {
      setStatus("error");
      return;
    }

    // Since Supabase handles the session creation automatically via the hash, we just wait a bit and assume success if no explicit error in URL.
    // A more robust way is to listen to auth state changes.
    const checkSession = async () => {
      const { supabase } = await import("@/lib/supabase/client");
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setStatus("success");
      } else {
        // Give it a second to process the hash fragment
        setTimeout(async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setStatus("success");
          } else {
            // If still no session, maybe they are just viewing this page after signup telling them to verify.
            setStatus("verifying");
          }
        }, 1000);
      }
    };
    checkSession();
  }, [searchParams]);

  return (
    <Card className="w-full max-w-md backdrop-blur-2xl bg-white/60 dark:bg-zinc-900/60 border-white/40 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] relative z-10 rounded-3xl overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500"></div>
      <CardHeader className="text-center space-y-4 pt-8">
        {status === "verifying" && (
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center animate-pulse">
              <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
            </div>
          </div>
        )}
        {status === "success" && (
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
          </div>
        )}
        {status === "error" && (
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
          </div>
        )}
        
        <CardTitle className="text-3xl font-extrabold tracking-tight">
          {status === "verifying" && "Verify your email"}
          {status === "success" && "Verification Successful!"}
          {status === "error" && "Verification Failed"}
        </CardTitle>
        <CardDescription className="text-base text-foreground/70">
          {status === "verifying" && "We've sent a magic link to your email. Please click the link to verify your account."}
          {status === "success" && "Your email has been successfully verified. You can now access your Mission Control."}
          {status === "error" && "The verification link is invalid or has expired. Please try signing up again."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center pb-8 pt-4">
        {status === "success" && (
          <Button onClick={() => router.push("/mission-control")} className="w-full rounded-xl h-12 text-md font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 transition-all">
            Go to Mission Control
          </Button>
        )}
        {status === "error" && (
          <Button onClick={() => router.push("/signup")} variant="outline" className="w-full rounded-xl h-12 text-md font-semibold">
            Back to Sign Up
          </Button>
        )}
        {status === "verifying" && (
          <Button onClick={() => router.push("/login")} variant="outline" className="w-full rounded-xl h-12 text-md font-semibold">
            Go to Login
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 dark:from-zinc-950 dark:via-indigo-950/30 dark:to-zinc-950 p-4 overflow-hidden relative">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/30 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob dark:bg-purple-900/40"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-cyan-500/30 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000 dark:bg-cyan-900/40"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-500/30 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-4000 dark:bg-pink-900/40"></div>
      
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      <Suspense fallback={
        <Card className="w-full max-w-md backdrop-blur-2xl bg-white/60 dark:bg-zinc-900/60 border-white/40 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] rounded-3xl overflow-hidden p-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </Card>
      }>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
