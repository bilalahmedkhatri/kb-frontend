"use client";

import Link from "next/link";
import { Button } from "@/src/components/atoms/Button";
import { HiMap } from "react-icons/hi2";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-12">
      <div className="p-4 bg-rausch/10 text-rausch rounded-full mb-6 animate-bounce">
        <HiMap className="h-10 w-10" />
      </div>
      <h1 className="text-3xl font-extrabold text-ink tracking-tight mb-2">Lost in the Archipelago?</h1>
      <p className="text-sm text-gray-500 max-w-sm mb-8">
        We couldn&apos;t find the island route you were looking for. The page may have been moved or doesn&apos;t exist.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/">
          <Button variant="primary">Return Home</Button>
        </Link>
        <Link href="/search">
          <Button variant="outline">Browse Platform</Button>
        </Link>
      </div>
    </div>
  );
}

