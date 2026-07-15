"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/src/components/atoms/Button";
import { Input } from "@/src/components/atoms/Input";
import { HiLockClosed, HiCheckCircle } from "react-icons/hi2";

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
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

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => router.push("/login"), 2000);
  };

  if (success) {
    return (
      <div className="container-app flex min-h-[calc(100vh-8rem)] items-center justify-center py-16">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-[#DDDDDD] p-8 text-center">
            <HiCheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
            <h1 className="mb-2 text-2xl font-bold text-[#222222]">Password reset successful</h1>
            <p className="text-sm text-[#717171]">Redirecting you to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app flex min-h-[calc(100vh-8rem)] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-[#DDDDDD] p-8">
          <h1 className="mb-6 text-2xl font-bold text-[#222222]">Set new password</h1>
          <p className="mb-6 text-sm text-[#717171]">
            Token: <span className="font-mono text-xs">{token.slice(0, 8)}...</span>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<HiLockClosed className="h-4 w-4" />}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<HiLockClosed className="h-4 w-4" />}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" isLoading={loading} className="w-full">
              Reset Password
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
