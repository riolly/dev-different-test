"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";

interface LoginButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
}

export const LoginButton = ({
  variant = "default",
  size = "default",
  className = "",
  showIcon = true,
}: LoginButtonProps) => {
  return (
    <Link href="/login">
      <Button variant={variant} size={size} className={`${className}`}>
        {showIcon && <LogIn className="mr-2 h-4 w-4" />}
        Sign In
      </Button>
    </Link>
  );
};
