"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { HiCloudArrowUp, HiCheck, HiXMark } from "react-icons/hi2";
import { Spinner } from "@/src/components/atoms/Spinner";
import { utilsApi } from "@/src/lib/api/utils";

interface FileUploadInputProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

export function FileUploadInput({
  label = "Upload Image",
  value,
  onChange,
  accept = "image/*",
  maxSizeMB = 5,
  className,
}: FileUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be under ${maxSizeMB}MB`);
      return;
    }

    setError("");
    setUploading(true);
    try {
      const res = await utilsApi.uploadFile(file);
      onChange(res.url);
    } catch (err: any) {
      setError(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className || ""}`}>
      {label && <label className="text-xs font-semibold text-[var(--ink)]">{label}</label>}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--gray-300)] p-4 text-center transition-colors hover:border-[var(--rausch)] hover:bg-[var(--gray-50)]"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        {value ? (
          <div className="relative h-24 w-full max-w-[200px] overflow-hidden rounded-lg bg-[var(--gray-100)]">
            <Image src={value} alt="Preview" fill className="object-cover" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black"
            >
              <HiXMark className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            {uploading ? (
              <Spinner size="md" />
            ) : (
              <HiCloudArrowUp className="h-6 w-6 text-[var(--gray-500)] group-hover:text-[var(--rausch)]" />
            )}
            <span className="text-xs font-medium text-[var(--gray-700)]">
              {uploading ? "Uploading to Cloud..." : "Click or drag file to upload"}
            </span>
            <span className="text-[10px] text-[var(--gray-500)]">JPG, PNG, WebP up to {maxSizeMB}MB</span>
          </div>
        )}
      </div>
      {error && <p className="text-[10px] text-red-500">{error}</p>}
    </div>
  );
}
