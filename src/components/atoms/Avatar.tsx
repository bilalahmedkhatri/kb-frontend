import { cn } from "@/src/lib/utils";
import { HiUser } from "react-icons/hi2";

interface AvatarProps {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const sizeClass = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" }[size];
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : undefined;

  if (src) {
    return (
      <img
        src={src}
        alt={name || "Avatar"}
        className={cn("rounded-full object-cover", sizeClass, className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gray-200 text-[#717171]",
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
