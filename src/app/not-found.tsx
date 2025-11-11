import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-background via-background to-primary/40 dark:to-card">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-serif font-bold text-primary/20 dark:text-primary/10 mb-4">
            404
          </h1>
          <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-4">
            Página não encontrada
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Desculpe, a página que você está procurando não existe ou foi
            movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="rounded-lg">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Voltar ao início
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="rounded-lg">
            <Link href="/search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Buscar serviços
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
