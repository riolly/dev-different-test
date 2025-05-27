"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { MagicLinkAuth } from "@/components/auth/supabase-auth";
import { useAuth } from "@/lib/hooks/use-auth";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-800 to-indigo-950">
        <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
          <div className="rounded-xl bg-white/10 p-8 text-center text-white">
            <p>Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  if (user) {
    return null; // Will redirect in useEffect
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-800 to-indigo-950">
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
        <div className="mb-6 flex w-full max-w-md items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-white transition-colors hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-white/80">Sign in to your AirEstate account</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg">
            <MagicLinkAuth />
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/60">
              Don&apos;t have an account? Just enter your email above and
              we&apos;ll create one for you.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
