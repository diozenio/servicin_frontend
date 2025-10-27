"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Wrench, Phone } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import Logo from "./logo";
import { useAuth } from "@/hooks/use-auth";

export default function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md",
        scrolled
          ? "bg-background/80 border-b border-border"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative">
          {/* Logo */}
          <Logo />

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6 absolute left-1/2 -translate-x-1/2">
            <Button variant="link" asChild className="text-sm">
              <Link href="/search">Serviços</Link>
            </Button>
            <Button variant="link" asChild className="text-sm">
              <Link href="#">Profissionais</Link>
            </Button>
            <Button variant="link" asChild className="text-sm">
              <Link href="#">Como Funciona</Link>
            </Button>
            <Button variant="link" asChild className="text-sm">
              <Link href="#">Sobre</Link>
            </Button>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : isAuthenticated && user ? (
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase())
                    .join("")
                    .substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Button asChild variant="secondary" className="rounded-lg px-6">
                <Link href="/auth/login">Entrar</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
