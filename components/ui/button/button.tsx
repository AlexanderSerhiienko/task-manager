import { ButtonHTMLAttributes } from "react";
import { ButtonSize, ButtonVariant, getButtonClasses } from "@/components/ui/button/button-styles";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = "secondary",
  size = "md",
  className,
  type = "button",
  disabled,
  ...props
}: Props) {
  const classes = getButtonClasses({
    variant,
    size,
    className,
    disabled: Boolean(disabled),
  });

  return <button type={type} className={classes} disabled={disabled} {...props} />;
}
