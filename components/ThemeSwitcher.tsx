"use client";

import { useTheme } from "next-themes";
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const ThemeSwitcher = ({ className }: { className?: string }) => {
  const { setTheme, theme } = useTheme();
  return (
    <Button
      size={"icon"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn("text-white", className)}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
};

export default ThemeSwitcher;
