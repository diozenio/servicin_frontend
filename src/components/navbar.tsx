"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Wrench, Phone } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import Logo from "./logo";

export default function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);

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
            <Button asChild variant="secondary" className="rounded-lg px-6">
              <Link href="/auth/login">Entrar</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
