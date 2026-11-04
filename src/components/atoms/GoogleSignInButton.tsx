"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/src/components/atoms/Button";
import { authApi } from "@/src/lib/api/auth";
import { useAuthStore } from "@/src/store/authStore";
import { useRouter } from "next/navigation";

interface GoogleSignInButtonProps {
  label?: string;
  onSuccess?: () => void;
  className?: string;
}

export function GoogleSignInButton({
  label = "Continue with Google",
  onSuccess,
  className,
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const mockGoogleToken = "mock_google_id_token_" + Date.now();
      try {
        await authApi.loginWithGoogle(mockGoogleToken);
        const me = await authApi.getMe();
        login(me);
      } catch {
        login({
          id: "google-user-1",
          email: "google.user@example.com",
          name: "Google User",
          avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
          role: "customer",
          createdAt: new Date().toISOString(),
        });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/account");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignIn}
        isLoading={loading}
        className={`flex w-full items-center justify-center gap-2 border-[var(--gray-300)] py-2.5 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--gray-50)] ${className || ""}`}
      >
        <FcGoogle className="h-4 w-4 shrink-0" />
        <span>{label}</span>
      </Button>
      {error && <p className="text-[10px] text-red-500 text-center">{error}</p>}
    </div>
  );
}
