import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "dark" | "light";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    const variants = {
      default:
        "border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:ring-gray-900",
      dark: "border-2 border-white/20 bg-white/90 text-gray-900 placeholder-gray-500 hover:border-white/30 focus:border-white focus:bg-white focus:ring-white/50",
      light:
        "border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:bg-white focus:ring-gray-400",
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
