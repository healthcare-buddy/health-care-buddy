"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Moon, Sun, Heart, User, Plus } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import SignOutButton from "./form/SignOutButton";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  const { data: session } = authClient.useSession();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const navItems =
    session?.user.role === "admin"
      ? [
          { href: "/dashboard", label: "Dashboard" },
          { href: "/admin", label: "Admin Panel" },
          { href: "/patients", label: "Patients" },
        ]
      : [
          { href: "/dashboard", label: "Dashboard" },
          { href: "/follow-up-plan", label: "Follow-up Plan" },
          { href: "/medications", label: "Medications" },
          { href: "/ai-assistant", label: "AI Assistant" },
          { href: "/progress", label: "Progress" },
        ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg md:text-xl">
                Healthcare Buddy
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {session && (
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    <Button
                      variant={pathname === item.href ? "default" : "ghost"}
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </>
            )}
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user.image || ""}
                        alt={session.user.name || ""}
                      />
                      <AvatarFallback>
                        {session.user.name?.charAt(0) ||
                          session.user.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user.name && (
                        <p className="font-medium">{session.user.name}</p>
                      )}
                      {session.user.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {session.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/discharge-summary">
                      <Plus className="mr-2 h-4 w-4" />
                      Discharge Summary
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <SignOutButton className="w-full cursor-pointer text-white" />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Navigation */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-4">
                  {session ? (
                    <>
                      <SheetTitle className="px-3 mt-2">
                        <div className="flex items-center space-x-2 pb-4 border-b">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={session.user.image || ""}
                              alt={session.user.name || ""}
                            />
                            <AvatarFallback>
                              {session.user.name?.charAt(0) ||
                                session.user.email?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">
                              {session.user.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {session.user.email}
                            </p>
                          </div>
                        </div>
                      </SheetTitle>

                      <div className="flex flex-col w-full gap-2 px-5">
                        {navItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm font-medium transition-colors hover:text-primary cursor-pointer"
                            onClick={() => setIsOpen(false)}
                          >
                            <Button
                              variant={
                                pathname === item.href ? "default" : "secondary"
                              }
                              className="w-full cursor-pointer"
                            >
                              {item.label}
                            </Button>
                          </Link>
                        ))}
                      </div>

                      <div className="pt-4 border-t px-5">
                        <Link
                          href="/profile"
                          className="flex items-center text-sm font-medium transition-colors hover:text-primary py-2 cursor-pointer"
                          onClick={() => setIsOpen(false)}
                        >
                          <Button
                            variant={
                              pathname === "/profile" ? "default" : "secondary"
                            }
                            className="justify-start w-full cursor-pointer"
                          >
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Button>
                        </Link>
                        <Link
                          href="/discharge-summary"
                          className="flex items-center text-sm font-medium transition-colors hover:text-primary py-2 cursor-pointer"
                          onClick={() => setIsOpen(false)}
                        >
                          <Button
                            variant={
                              pathname === "/discharge-summary"
                                ? "default"
                                : "secondary"
                            }
                            className="justify-start w-full cursor-pointer"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Discharge Summary
                          </Button>
                        </Link>

                        <SignOutButton className="w-full cursor-pointer text-white mt-2" />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col w-full gap-2 px-5 mt-10">
                      <Button asChild variant={"outline"}>
                        <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                      <Button variant={"outline"} asChild>
                        <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                          Sign Up
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
