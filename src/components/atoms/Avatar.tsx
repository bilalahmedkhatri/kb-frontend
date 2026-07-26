import { cn } from "@/src/lib/utils";
import Image from "next/image";
import { HiUser } from "react-icons/hi2";

interface AvatarProps {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const sizeClass = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" }[size];
  const sizePx = { sm: 32, md: 40, lg: 48 }[size];
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : undefined;

  if (src) {
    return (
      <Image
        src={src}
        alt={name || "Avatar"}
        width={sizePx}
        height={sizePx}
        className={cn("rounded-full object-cover shrink-0", sizeClass, className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full aspect-square shrink-0 bg-gray-200 text-[#717171]",
        sizeClass,
        className
      )}
      title={name}
    >
      {initials ? (
        <span className="text-xs font-semibold">{initials}</span>
      ) : (
        <HiUser className="h-5 w-5" />
      )}
    </div>
  );
}
