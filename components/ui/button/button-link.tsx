import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";
import { ButtonSize, ButtonVariant, getButtonClasses } from "@/components/ui/button/button-styles";

type Props = LinkProps & {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isActive?: boolean;
};

export function ButtonLink({
  children,
  className,
  variant = "secondary",
  size = "md",
  isActive = false,
  ...props
}: Props) {
  const classes = getButtonClasses({
    variant: isActive ? "default" : variant,
    size,
    className,
    disabled: false,
  });

  return (
    <Link className={classes} aria-current={isActive ? "page" : undefined} {...props}>
      {children}
    </Link>
  );
}
