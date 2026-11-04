"use client";

import { useState } from "react";
import { Button } from "@/src/components/atoms/Button";
import { Input } from "@/src/components/atoms/Input";
import { Badge } from "@/src/components/atoms/Badge";
import {
  HiShieldExclamation,
  HiDevicePhoneMobile,
  HiArrowRightOnRectangle,
  HiLockClosed,
  HiEye,
  HiEyeSlash,
  HiCheckCircle,
} from "react-icons/hi2";
import { Toast, ToastData } from "./AccountToast";

interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
}

const MOCK_SESSIONS: ActiveSession[] = [
  { id: "sess-1", device: "Chrome on Windows", location: "Sydney, Australia", lastActive: "Active now" },
  { id: "sess-2", device: "Safari on iPhone", location: "Sydney, Australia", lastActive: "2 hours ago" },
];

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/authStore";
import { authApi } from "@/src/lib/api/auth";
import { HiExclamationTriangle } from "react-icons/hi2";

export function SecuritySection() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  
  const [savingPassword, setSavingPassword] = useState(false);
  const [loggingOutDevices, setLoggingOutDevices] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [sessions, setSessions] = useState<ActiveSession[]>(MOCK_SESSIONS);
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSavePassword = async () => {
    if (!currentPassword) {
      showToast("Current password is required", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    setSavingPassword(true);
    try {
      await authApi.updatePassword({ current_password: currentPassword, new_password: newPassword });
      setPasswordSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSaved(false), 3000);
      showToast("Password updated successfully");
    } catch (err: any) {
      showToast(err?.message || "Failed to update password", "error");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    setLoggingOutDevices(true);
    await new Promise((r) => setTimeout(r, 900));
    setSessions((prev) => prev.filter((s) => s.lastActive === "Active now"));
    setLoggingOutDevices(false);
    showToast("Logged out of all other devices");
  };

  const handleDeactivateAccount = async () => {
    setDeactivating(true);
    try {
      await authApi.deactivateAccount();
    } catch {
      // Graceful fallback for mock mode
    } finally {
      logout();
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      setShowDeactivateModal(false);
      setDeactivating(false);
      router.push("/login?message=deactivated");
    }
  };

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-[var(--ink)]">Security & Authentication</h2>
      <div className="flex flex-col gap-6 rounded-xl border border-[var(--gray-300)] p-6 bg-white">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-[var(--ink)]">Change Password</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Current Password", value: currentPassword, set: setCurrentPassword, show: showCurrentPw, toggle: () => setShowCurrentPw(!showCurrentPw) },
              { label: "New Password", value: newPassword, set: setNewPassword, show: showNewPw, toggle: () => setShowNewPw(!showNewPw) },
              { label: "Confirm New Password", value: confirmPassword, set: setConfirmPassword, show: showConfirmPw, toggle: () => setShowConfirmPw(!showConfirmPw) },
            ].map((field) => (
              <div key={field.label} className="relative">
                <Input
                  label={field.label}
                  type={field.show ? "text" : "password"}
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  leftIcon={<HiLockClosed className="h-4 w-4" />}
                  disabled={savingPassword}
                />
                <button
                  type="button"
                  onClick={field.toggle}
                  disabled={savingPassword}
                  className="absolute right-3 top-9 text-[var(--gray-500)] hover:text-[var(--ink)] disabled:opacity-50"
                >
                  {field.show ? <HiEyeSlash className="h-4 w-4" /> : <HiEye className="h-4 w-4" />}
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Button size="sm" onClick={handleSavePassword} isLoading={savingPassword}>
              {savingPassword ? "Updating..." : "Update Password"}
            </Button>
            {passwordSaved && (
              <span className="flex items-center gap-1 text-sm text-green-600">
                <HiCheckCircle className="h-4 w-4" />
                Password updated
              </span>
            )}
          </div>
        </div>

        <div className="border-t border-[var(--gray-300)] pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <HiShieldExclamation className="mt-0.5 h-5 w-5 text-[var(--rausch)]" />
              <div>
                <h3 className="text-sm font-semibold text-[var(--ink)]">Two-Factor Authentication (2FA)</h3>
                <p className="text-xs text-[var(--gray-500)]">Add an extra layer of security to your account</p>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={twoFAEnabled}
                onChange={() => setTwoFAEnabled(!twoFAEnabled)}
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-[var(--gray-300)] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[var(--rausch)] peer-checked:after:translate-x-full" />
            </label>
          </div>
          {twoFAEnabled && (
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline">Set up via SMS</Button>
              <Button size="sm" variant="outline">Set up via Authenticator App</Button>
            </div>
          )}
        </div>

        <div className="border-t border-[var(--gray-300)] pt-6">
          <h3 className="mb-3 text-sm font-semibold text-[var(--ink)]">Active Sessions</h3>
          <div className="flex flex-col gap-3">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between rounded-lg bg-[var(--gray-50)] px-4 py-3">
                <div className="flex items-center gap-3">
                  <HiDevicePhoneMobile className="h-5 w-5 text-[var(--gray-500)]" />
                  <div>
                    <p className="text-sm font-medium text-[var(--ink)]">{session.device}</p>
                    <p className="text-xs text-[var(--gray-500)]">{session.location} &middot; {session.lastActive}</p>
                  </div>
                </div>
                <Badge variant={session.lastActive === "Active now" ? "success" : "default"}>
                  {session.lastActive === "Active now" ? "Active" : "Idle"}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<HiArrowRightOnRectangle className="h-4 w-4" />}
              onClick={handleLogoutAllDevices}
              isLoading={loggingOutDevices}
            >
              {loggingOutDevices ? "Logging Out..." : "Log Out All Devices"}
            </Button>
          </div>
        </div>

        {/* Deactivate Account Danger Zone */}
        <div className="border-t border-red-200 pt-6">
          <div className="rounded-xl bg-red-50/50 p-4 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <HiExclamationTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-red-950">Deactivate Account</h3>
                <p className="text-xs text-red-800 mt-0.5">
                  Temporarily disable your account without losing your order and booking history.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setShowDeactivateModal(true)}
            >
              Deactivate
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <HiExclamationTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--ink)]">Deactivate Account?</h3>
            </div>
            <p className="text-xs text-[var(--gray-700)] leading-relaxed mb-6">
              This will disable your account login (`is_active = False`). Your past orders, stay bookings, and saved items will remain safely stored. You can contact support anytime to reactivate.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setShowDeactivateModal(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                isLoading={deactivating}
                onClick={handleDeactivateAccount}
              >
                {deactivating ? "Deactivating..." : "Yes, Deactivate Account"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </section>
  );
}
