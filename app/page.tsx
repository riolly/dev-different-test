"use client";

import Link from "next/link";

import { LoginButton } from "@/components/auth/login-button";
import { LogoutButton } from "@/components/auth/logout-button";
import { useAuth } from "@/lib/hooks/use-auth";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-800 to-indigo-950">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          AirEstate
        </h1>

        <div className="flex flex-col items-center gap-4">
          {loading ? (
            <div className="rounded-xl bg-white/10 p-6 text-center text-white">
              <p>Loading authentication...</p>
            </div>
          ) : user ? (
            <div className="flex flex-col items-center gap-4 rounded-xl bg-white/10 p-6 text-white">
              <div className="flex flex-col items-center gap-2">
                <h3 className="text-xl font-bold text-green-300">
                  ✅ Login Successful!
                </h3>
                <p className="text-center">
                  Welcome back, {user.user_metadata?.full_name || user.email}!
                </p>
                <div className="text-center text-sm text-white/80">
                  <p>Email: {user.email}</p>
                  <p>User ID: {user.id}</p>
                  <p className="mt-2 text-xs text-green-200">
                    🔐 Successfully authenticated via Supabase magic link
                  </p>
                  <p className="mt-1 text-xs text-white/60">
                    Last sign in:{" "}
                    {new Date(user.last_sign_in_at || "").toLocaleString()}
                  </p>
                </div>
                {/* {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    className="h-12 w-12 rounded-full border-2 border-white/20"
                  />
                )} */}
              </div>
              <div className="flex flex-col items-center gap-2">
                <Link
                  href="/todos"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  View My Todos
                </Link>
                <LogoutButton
                  variant="destructive"
                  className="border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-xl bg-white/10 p-6 text-center text-white">
                <h3 className="mb-2 text-xl font-bold">Welcome to AirEstate</h3>
                <p className="mb-4 text-white/80">
                  Sign in to access your account and manage your properties
                </p>
                <LoginButton
                  size="lg"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
