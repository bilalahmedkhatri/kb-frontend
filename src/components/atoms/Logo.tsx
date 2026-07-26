import Link from "next/link";
import { cn } from "@/src/lib/utils";
import Image from "next/image";

interface LogoProps {
  href?: string;
  className?: string;
  /** Hide the wordmark — show icon only. Useful for compact nav slots. */
  compact?: boolean;
}

export function Logo({ href = "/", className, compact = false }: LogoProps) {
  const content = (
    <div className={cn("flex items-center gap-1", className)}>
      {/* Icon — 32px mobile · 36px tablet · 40px desktop */}
      <div className="relative h-10 w-10 lg:h-13 lg:w-13 md:h-10 md:w-10 shrink-0 overflow-hidden transition-transform group-hover:scale-105">
        <Image
          src="/favicon.png"
          alt="Island Connects Logo"
          width={40}
          height={40}
          priority
          className="h-full w-full object-contain"
        />
      </div>

      {/* Wordmark — hidden when compact */}
      {!compact && (
        <div className="flex flex-col leading-none gap-px">
          <span className="text-[1rem] sm:text-[0.85rem] md:text-[0.9rem] font-black tracking-tight text-[var(--ink)]">
            Island
          </span>
          <span className="text-[1rem] sm:text-[0.85rem] md:text-[0.9rem] font-black tracking-tight text-[var(--rausch)]">
            Connects
          </span>
        </div>
      )}
    </div>
  );

  return (
    <Link href={href} className="group inline-flex items-center" aria-label="Island Connects home">
      {content}
    </Link>
  );
}
