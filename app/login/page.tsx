"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/authStore";
import { Button } from "@/src/components/atoms/Button";
import { Input } from "@/src/components/atoms/Input";
import { Checkbox } from "@/src/components/atoms/Checkbox";
import { HiEnvelope, HiLockClosed } from "react-icons/hi2";

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
    await new Promise((r) => setTimeout(r, 800));
    login({
      id: "u-1",
      name: "John Smith",
      email: "john@example.com",
      avatar: "",
      role: "customer",
      createdAt: "2024-01-10",
    });
    setLoading(false);
    router.push("/");
  };

  return (
    <div className="container-app flex min-h-[calc(100vh-8rem)] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-[#DDDDDD] p-8">
          <h1 className="mb-6 text-2xl font-bold text-[#222222]">Welcome back</h1>

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
          </form>

          <div className="mt-6 flex flex-col items-center gap-3 text-sm text-[#717171]">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium text-[#FF385C] hover:underline">
                Sign up
              </Link>
            </p>
            <Link href="/signup?role=vendor" className="font-medium text-[#FF385C] hover:underline">
              Become a vendor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
