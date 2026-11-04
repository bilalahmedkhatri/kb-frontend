"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/authStore";
import { users } from "@/src/data/users";
import { Button } from "@/src/components/atoms/Button";
import { Input } from "@/src/components/atoms/Input";
import { Checkbox } from "@/src/components/atoms/Checkbox";
import { GoogleSignInButton } from "@/src/components/atoms/GoogleSignInButton";
import { HiEnvelope, HiLockClosed } from "react-icons/hi2";
import { Logo } from "@/src/components/atoms/Logo";
import { authApi } from "@/src/lib/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setTouched({ email: true, password: true });
    if (!email || !password) {
      return;
    }
    setLoading(true);

    try {
      await authApi.login(email, password);
      const user = await authApi.getMe();
      login(user);
      if (user.role === "vendor") {
        router.push("/vendor/dashboard");
      } else {
        router.push("/account");
      }
    } catch (err: any) {
      setError(err?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (demoUser: (typeof users)[0]) => {
    setLoading(true);
    try {
      await authApi.login(demoUser.email, "password123");
      const user = await authApi.getMe();
      login(user);
      router.push(user.role === "vendor" ? "/vendor/dashboard" : "/account");
    } catch {
      login(demoUser as any);
      router.push("/account");
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { label: "Customer", users: users.filter((u) => u.role === "customer").slice(0, 2) },
    { label: "Vendor", users: users.filter((u) => u.role === "vendor").slice(0, 2) },
    { label: "Admin", users: users.filter((u) => u.role === "admin") },
  ];

  return (
    <div className="container-app flex min-h-[calc(100vh-8rem)] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-[#DDDDDD] p-8">
          <div className="mb-6 flex justify-center">
            <Logo />
          </div>
          <h1 className="mb-6 text-center text-2xl font-bold text-[#222222]">Welcome back</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setTouched((prev) => ({ ...prev, email: true })); }}
                leftIcon={<HiEnvelope className="h-4 w-4" />}
              />
              {touched.email && !email && (
                <p className="mt-1 text-xs text-red-500">Email is required</p>
              )}
            </div>
            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setTouched((prev) => ({ ...prev, password: true })); }}
                leftIcon={<HiLockClosed className="h-4 w-4" />}
              />
              {touched.password && !password && (
                <p className="mt-1 text-xs text-red-500">Password is required</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Checkbox
                id="remember"
                label="Remember me"
                checked={remember}
                onChange={setRemember}
              />
              <Link
                href="/forgot-password"
                className="text-sm text-[#FF385C] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button type="submit" isLoading={loading} className="w-full">
              Sign in
            </Button>

            <div className="relative my-2 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--gray-300)]" />
              </div>
              <span className="relative bg-white px-3 text-xs text-[var(--gray-500)]">or</span>
            </div>

            <GoogleSignInButton label="Sign in with Google" />
          </form>

          <div className="mt-6 flex flex-col items-center gap-3 text-sm text-[var(--gray-500)]">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium text-[var(--rausch)] hover:underline">
                Sign up
              </Link>
            </p>
            <Link href="/signup?role=vendor" className="font-medium text-[var(--rausch)] hover:underline">
              Become a vendor
            </Link>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-[#DDDDDD] p-6">
          <h2 className="mb-4 text-sm font-bold text-[#222222]">Demo Accounts</h2>
          <p className="mb-4 text-xs text-[#717171]">Click any account to log in instantly (no password needed).</p>
          <div className="flex flex-col gap-4">
            {demoAccounts.map((group) => (
              <div key={group.label}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#717171]">{group.label}</p>
                <div className="flex flex-wrap gap-2">
                  {group.users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => demoLogin(u)}
                      className="flex items-center gap-2 rounded-lg border border-[#DDDDDD] px-3 py-2 text-left text-sm transition-colors hover:border-[#FF385C] hover:bg-[#FFF0F3]"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F7F7F7] text-xs font-bold text-[#717171]">
                        {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <p className="font-medium text-[#222222]">{u.name}</p>
                        <p className="text-xs text-[#717171]">{u.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
