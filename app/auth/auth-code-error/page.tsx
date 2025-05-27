"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, Mail, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const error = searchParams.get("error");
  const errorCode = searchParams.get("error_code");
  const errorDescription = searchParams.get("error_description");

  const supabase = createClient();

  const getErrorInfo = () => {
    if (errorCode === "otp_expired") {
      return {
        title: "Magic Link Expired",
        description:
          "Your email link has expired. Magic links are only valid for a limited time for security reasons.",
        icon: <AlertTriangle className="h-12 w-12 text-amber-500" />,
        suggestion: "Request a new magic link below to continue signing in.",
      };
    }

    if (error === "access_denied") {
      return {
        title: "Access Denied",
        description: "There was an issue with your authentication request.",
        icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
        suggestion: "Please try signing in again with a fresh magic link.",
      };
    }

    return {
      title: "Authentication Error",
      description:
        errorDescription || "There was an error with your authentication link.",
      icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
      suggestion: "Please try signing in again.",
    };
  };

  const handleResendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_VERCEL_URL}/auth/callback`,
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("✅ New magic link sent! Check your email.");
      }
    } catch (error) {
      setMessage("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const errorInfo = getErrorInfo();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Error Display */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
            {errorInfo.icon}
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">
            {errorInfo.title}
          </h1>
          <p className="mb-4 text-gray-300">{errorInfo.description}</p>
          <p className="text-sm text-gray-400">{errorInfo.suggestion}</p>
        </div>

        {/* Quick Magic Link Resend Form */}
        <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
          <div className="mb-4 flex items-center gap-2 text-white">
            <Mail className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Get a New Magic Link</h2>
          </div>

          <form
            onSubmit={(e) => void handleResendMagicLink(e)}
            className="space-y-4"
          >
            <div>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:border-white/40"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-white font-semibold text-black hover:bg-gray-100"
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send New Magic Link
                </>
              )}
            </Button>

            {message && (
              <div className="rounded-lg border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                <p
                  className={`text-sm font-medium ${
                    message.includes("error") || message.includes("Please")
                      ? "text-red-300"
                      : "text-green-300"
                  }`}
                >
                  {message}
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Navigation Options */}
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/20"
          >
            Go to Login Page
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-transparent px-4 py-2 text-white/70 backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:text-white"
          >
            Back to Home
          </Link>
        </div>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === "development" &&
          (error || errorCode || errorDescription) && (
            <details className="rounded-lg border border-white/10 bg-white/5 p-4 text-xs text-white/60">
              <summary className="mb-2 cursor-pointer font-medium text-white/80">
                Debug Information
              </summary>
              <div className="space-y-1">
                {error && (
                  <p>
                    <strong>Error:</strong> {error}
                  </p>
                )}
                {errorCode && (
                  <p>
                    <strong>Error Code:</strong> {errorCode}
                  </p>
                )}
                {errorDescription && (
                  <p>
                    <strong>Description:</strong>{" "}
                    {decodeURIComponent(errorDescription)}
                  </p>
                )}
              </div>
            </details>
          )}
      </div>
    </div>
  );
}

export default function AuthCodeError() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
