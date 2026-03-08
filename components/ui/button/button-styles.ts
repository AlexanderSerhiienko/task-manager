export type ButtonVariant = "default" | "secondary" | "danger" | "ghost";
export type ButtonSize = "xs" | "sm" | "md";

const baseClasses =
  "inline-flex cursor-pointer items-center justify-center rounded-lg border font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 active:scale-[0.99]";

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "border-zinc-100 bg-zinc-100 text-zinc-900 shadow-sm hover:border-white hover:bg-white",
  secondary: "border-zinc-700 bg-zinc-900/70 text-zinc-100 hover:border-zinc-500 hover:bg-zinc-800/80",
  danger:
    "border-red-700/60 bg-red-950/35 text-red-300 hover:border-red-600 hover:bg-red-900/40",
  ghost: "border-transparent bg-transparent text-zinc-300 hover:bg-zinc-800/70 hover:text-zinc-100",
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-3 py-2 text-sm",
};

export function getButtonClasses({
  variant = "secondary",
  size = "md",
  className,
  disabled = false,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
}) {
  const disabledClasses = disabled ? "disabled:cursor-not-allowed disabled:opacity-60" : "";

  return [baseClasses, variantClasses[variant], sizeClasses[size], disabledClasses, className]
    .filter(Boolean)
    .join(" ");
}
