"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import clsx from "clsx";

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
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Wrench className="size-3" />
            <span>/</span>
            <span className="text-sm">contato@servicin.com</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <a href="#" className="text-sm hover:underline">
              Serviços
            </a>
            <a href="#" className="text-sm hover:underline">
              Profissionais
            </a>
            <a href="#" className="text-sm hover:underline">
              Como Funciona
            </a>
            <a href="#" className="text-sm hover:underline">
              Sobre
            </a>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <a href="#" className="text-sm hover:underline">
              Entrar
            </a>
            <Button variant="ghost" size="icon" className="rounded-full">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </Button>
            <Button className="rounded-lg px-6">Começar — É Grátis</Button>
          </div>
        </div>
      </div>
    </header>
  );
}
