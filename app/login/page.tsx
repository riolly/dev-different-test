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
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
          <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-white backdrop-blur-sm">
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
        <div className="mb-6 flex w-full max-w-md items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-4xl font-bold text-white">Welcome Back</h1>
            <p className="text-lg text-white/70">
              Sign in to your AirEstate account
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
            <MagicLinkAuth />
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-white/50">
              Don&apos;t have an account? Just enter your email above and
              we&apos;ll create one for you.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
