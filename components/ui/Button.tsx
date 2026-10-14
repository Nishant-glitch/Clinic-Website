import * as React from "react";
import Link, { type LinkProps } from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "filled" | "tonal" | "outlined" | "text";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonBaseProps {}

export interface ButtonLinkProps
  extends LinkProps,
    ButtonBaseProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
  children: React.ReactNode;
  className?: string;
}

export const buttonVariantStyles: Record<ButtonVariant, string> = {
  filled:
    "bg-md-primary text-md-on-primary shadow-sm hover:opacity-95 hover:shadow-md active:scale-95 focus-visible:ring-md-primary",
  tonal:
    "bg-md-secondary-container text-md-on-secondary-container hover:opacity-90 active:scale-95 focus-visible:ring-md-primary",
  outlined:
    "border-2 border-md-outline/60 text-md-primary hover:bg-md-primary/10 active:scale-95 focus-visible:ring-md-primary",
  text:
    "text-md-primary hover:bg-md-primary/10 active:scale-95 focus-visible:ring-md-primary",
};

export const buttonSizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs gap-1.5",
  md: "h-10 px-6 text-sm gap-2",
  lg: "h-12 px-8 text-base gap-2.5",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "filled",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-full cursor-pointer select-none",
          "transition-all duration-200 ease-md",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100",
          buttonVariantStyles[variant],
          buttonSizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      className,
      variant = "filled",
      size = "md",
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Link
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-full select-none no-underline",
          "transition-all duration-200 ease-md",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          buttonVariantStyles[variant],
          buttonSizeStyles[size],
          className
        )}
        {...props}
      >
        {leftIcon}
        <span>{children}</span>
        {rightIcon}
      </Link>
    );
  }
);

ButtonLink.displayName = "ButtonLink";
