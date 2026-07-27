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

export function SecuritySection() {
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
    // Simulate backend response delay
    await new Promise((r) => setTimeout(r, 1000));
    setSavingPassword(false);
    setPasswordSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSaved(false), 3000);
    showToast("Password updated successfully");
  };

  const handleLogoutAllDevices = async () => {
    setLoggingOutDevices(true);
    // Simulate backend response delay
    await new Promise((r) => setTimeout(r, 900));
    setSessions((prev) => prev.filter((s) => s.lastActive === "Active now"));
    setLoggingOutDevices(false);
    showToast("Logged out of all other devices");
  };

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-[#222222]">Security & Authentication</h2>
      <div className="flex flex-col gap-6 rounded-xl border border-[#DDDDDD] p-6 bg-white">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-[#222222]">Change Password</h3>
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
                  className="absolute right-3 top-9 text-[#717171] hover:text-[#222222] disabled:opacity-50"
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

        <div className="border-t border-[#DDDDDD] pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <HiShieldExclamation className="mt-0.5 h-5 w-5 text-[#FF385C]" />
              <div>
                <h3 className="text-sm font-semibold text-[#222222]">Two-Factor Authentication (2FA)</h3>
                <p className="text-xs text-[#717171]">Add an extra layer of security to your account</p>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={twoFAEnabled}
                onChange={() => setTwoFAEnabled(!twoFAEnabled)}
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-[#DDDDDD] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[#FF385C] peer-checked:after:translate-x-full" />
            </label>
          </div>
          {twoFAEnabled && (
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline">Set up via SMS</Button>
              <Button size="sm" variant="outline">Set up via Authenticator App</Button>
            </div>
          )}
        </div>

        <div className="border-t border-[#DDDDDD] pt-6">
          <h3 className="mb-3 text-sm font-semibold text-[#222222]">Active Sessions</h3>
          <div className="flex flex-col gap-3">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between rounded-lg bg-[#F7F7F7] px-4 py-3">
                <div className="flex items-center gap-3">
                  <HiDevicePhoneMobile className="h-5 w-5 text-[#717171]" />
                  <div>
                    <p className="text-sm font-medium text-[#222222]">{session.device}</p>
                    <p className="text-xs text-[#717171]">{session.location} &middot; {session.lastActive}</p>
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
              variant="destructive"
              leftIcon={<HiArrowRightOnRectangle className="h-4 w-4" />}
              onClick={handleLogoutAllDevices}
              isLoading={loggingOutDevices}
            >
              {loggingOutDevices ? "Logging Out..." : "Log Out All Devices"}
            </Button>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </section>
  );
}
