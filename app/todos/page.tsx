"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { LoginButton } from "@/components/auth/login-button";
import { LogoutButton } from "@/components/auth/logout-button";
import { UserTodos } from "@/components/examples/user-todos";
import { useAuth } from "@/lib/hooks/use-auth";

export default function TodosPage() {
  const { user, loading } = useAuth();

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

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-800 to-indigo-950">
        <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
          <div className="rounded-xl bg-white/10 p-8 text-center text-white">
            <h1 className="mb-4 text-2xl font-bold">Sign In Required</h1>
            <p className="mb-6">You need to be logged in to view your todos.</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <LoginButton className="bg-blue-600 text-white hover:bg-blue-700" />
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-white transition-colors hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-800 to-indigo-950 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-white transition-colors hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-white">My Todos</h1>
          </div>
          <LogoutButton
            variant="destructive"
            size="sm"
            className="border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700"
          />
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
            <UserTodos />
          </div>
        </div>
      </div>
    </main>
  );
}
