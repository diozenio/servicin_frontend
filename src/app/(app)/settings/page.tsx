"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Moon, Sun, Monitor } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Configurações</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie suas preferências e configurações da conta
            </p>
          </div>

          <Separator />

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="theme" className="text-base font-semibold">
                Aparência
              </Label>
              <p className="text-sm text-muted-foreground">
                Escolha o tema de aparência da aplicação
              </p>
              <div className="flex items-center gap-4 pt-2">
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger id="theme" className="w-[180px]">
                    <SelectValue>
                      {theme === "light" && (
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          <span>Claro</span>
                        </div>
                      )}
                      {theme === "dark" && (
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          <span>Escuro</span>
                        </div>
                      )}
                      {theme === "system" && (
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          <span>Sistema</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        <span>Claro</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        <span>Escuro</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        <span>Sistema</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

