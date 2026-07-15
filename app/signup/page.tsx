"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/src/store/authStore";
import { Button } from "@/src/components/atoms/Button";
import { Input } from "@/src/components/atoms/Input";
import { Checkbox } from "@/src/components/atoms/Checkbox";
import { cn } from "@/src/lib/utils";
import { HiEnvelope, HiLockClosed, HiUser } from "react-icons/hi2";

function SignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"customer" | "vendor">(
    searchParams.get("role") === "vendor" ? "vendor" : "customer"
  );
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!acceptTerms) {
      setError("You must accept the terms and conditions");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    login({
      id: role === "vendor" ? "v-9" : "u-5",
      name,
      email,
      avatar: "",
      role,
      createdAt: new Date().toISOString().split("T")[0],
    });
    setLoading(false);
    router.push(role === "vendor" ? "/vendor/dashboard" : "/");
  };

  return (
    <div className="container-app flex min-h-[calc(100vh-8rem)] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-[#DDDDDD] p-8">
          <h1 className="mb-6 text-2xl font-bold text-[#222222]">Create your account</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<HiUser className="h-4 w-4" />}
            />
            <Input
              label="Email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<HiEnvelope className="h-4 w-4" />}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<HiLockClosed className="h-4 w-4" />}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<HiLockClosed className="h-4 w-4" />}
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#222222]">I want to</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className={cn(
                    "flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                    role === "customer"
                      ? "border-[#222222] bg-[#222222] text-white"
                      : "border-[#DDDDDD] text-[#717171] hover:border-[#222222]"
                  )}
                >
                  Shop
                </button>
                <button
                  type="button"
                  onClick={() => setRole("vendor")}
                  className={cn(
                    "flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                    role === "vendor"
                      ? "border-[#222222] bg-[#222222] text-white"
                      : "border-[#DDDDDD] text-[#717171] hover:border-[#222222]"
                  )}
                >
                  Sell (Vendor)
                </button>
              </div>
            </div>

            <Checkbox
              id="terms"
              label="I accept the Terms of Service and Privacy Policy"
              checked={acceptTerms}
              onChange={setAcceptTerms}
            />

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button type="submit" isLoading={loading} className="w-full">
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#717171]">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[#FF385C] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupPageContent />
    </Suspense>
  );
}
