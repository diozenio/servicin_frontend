"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import clsx from "clsx";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import Logo from "./logo";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, User, Settings } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

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
          <Logo />

          <nav className="hidden md:flex items-center space-x-6 absolute left-1/2 -translate-x-1/2">
            <Button variant="link" asChild className="text-sm">
              <Link href="/search">Serviços</Link>
            </Button>
            <Button variant="link" asChild className="text-sm">
              <Link href="#">Profissionais</Link>
            </Button>
            <Button variant="link" asChild className="text-sm">
              <Link href="/contracts">Contratos</Link>
            </Button>
            <Button variant="link" asChild className="text-sm">
              <Link href="#">Sobre</Link>
            </Button>
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="outline-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full">
                    <Avatar className="w-8 h-8 cursor-pointer">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((word) => word.charAt(0).toUpperCase())
                          .join("")
                          .substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none line-clamp-1">
                        {user.name}
                      </p>
                      {user.email && (
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configurações</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    variant="destructive"
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
