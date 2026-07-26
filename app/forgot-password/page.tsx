"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/atoms/Button";
import { Input } from "@/src/components/atoms/Input";
import { HiEnvelope, HiCheckCircle } from "react-icons/hi2";
import { Logo } from "@/src/components/atoms/Logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="container-app flex min-h-[calc(100vh-8rem)] items-center justify-center py-16">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-[#DDDDDD] p-8 text-center">
            <div className="mb-6 flex justify-center">
              <Logo />
            </div>
            <HiCheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
            <h1 className="mb-2 text-2xl font-bold text-[#222222]">Check your email</h1>
            <p className="mb-6 text-sm text-[#717171]">
              We sent a password reset link to <span className="font-semibold">{email}</span>.
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Back to sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app flex min-h-[calc(100vh-8rem)] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-[#DDDDDD] p-8">
          <div className="mb-6 flex justify-center">
            <Logo />
          </div>
          <h1 className="mb-2 text-center text-2xl font-bold text-[#222222]">Reset your password</h1>
          <p className="mb-6 text-sm text-[#717171]">
            Enter your email and we&apos;ll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<HiEnvelope className="h-4 w-4" />}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" isLoading={loading} className="w-full">
              Send Reset Link
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#717171]">
            <Link href="/login" className="font-medium text-[#FF385C] hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
