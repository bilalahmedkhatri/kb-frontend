import Link from "next/link";
import { cn } from "@/src/lib/utils";

interface LogoProps {
  href?: string;
  className?: string;
  compact?: boolean;
}

export function Logo({ href = "/", className, compact = false }: LogoProps) {
  const content = (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--rausch),#ff7a76)] shadow-[0_10px_30px_rgba(255,56,92,0.18)] ring-1 ring-black/5">
        <svg
          viewBox="0 0 64 64"
          className="h-6 w-6 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M14 42c8-10 12-18 18-24 5-5 12-8 18-10-2 10-7 19-13 28-6 9-12 14-23 16" />
          <path d="M16 32c8 6 13 12 16 20" />
          <path d="M32 20c4 3 7 7 9 11" />
        </svg>
        <span className="absolute bottom-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-[var(--babu)] ring-2 ring-white" />
      </div>

      {!compact && (
        <div className="flex flex-col leading-none">
          <span className="text-[0.95rem] font-black tracking-[-0.03em] text-[var(--ink)] sm:text-[1rem]">
            Island
          </span>
          <span className="text-[0.95rem] font-black tracking-[-0.03em] text-[var(--rausch)] sm:text-[1rem]">
            Connects
          </span>
        </div>
      )}
    </div>
  );

  return (
    <Link href={href} className="inline-flex items-center" aria-label="Island Connects home">
      {content}
    </Link>
  );
}
