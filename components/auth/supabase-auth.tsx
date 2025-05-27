"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export const MagicLinkAuth = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
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
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Check your email for the magic link!");
      }
    } catch (error) {
      setMessage("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={(e) => void handleSignIn(e)}
        className="flex flex-col gap-6"
      >
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-white"
          >
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            variant="dark"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-white px-6 py-3 text-base font-semibold text-black transition-all duration-200 hover:bg-gray-100 focus:ring-2 focus:ring-white/50 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Magic Link"}
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
  );
};
