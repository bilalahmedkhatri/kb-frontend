import Link from "next/link";
import { cn } from "@/src/lib/utils";
import Image from "next/image"

interface LogoProps {
  href?: string;
  className?: string;
  compact?: boolean;
}

export function Logo({ href = "/", className, compact = false }: LogoProps) {
  const content = (
    <div className={cn("flex items-center gap-2.5 sm:gap-3", className)}>
      <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
        <Image
          src="/favicon.png"
          alt="Island Connects Logo"
          width={80}
          height={80}
          priority
          className="h-full w-full object-contain p-1"
        />
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
    <Link href={href} className="group inline-flex items-center" aria-label="Island Connects home">
      {content}
    </Link>
  );
}
