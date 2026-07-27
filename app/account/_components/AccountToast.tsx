"use client";

import { HiCheckCircle, HiXMark } from "react-icons/hi2";

export interface ToastData {
  message: string;
  type?: "success" | "error";
}

export function Toast({
  message,
  type = "success",
  onClose,
}: {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-[#222222] px-5 py-3 text-sm text-white shadow-lg animate-in fade-in slide-in-from-bottom-5 duration-200">
      <HiCheckCircle className={type === "success" ? "h-5 w-5 text-green-400" : "h-5 w-5 text-red-400"} />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-white/60 hover:text-white">
        <HiXMark className="h-4 w-4" />
      </button>
    </div>
  );
}
