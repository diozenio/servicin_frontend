"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface LoginFormProps extends React.ComponentProps<"form"> {
  returnUrl?: string | null;
}

export function LoginForm({ className, returnUrl, ...props }: LoginFormProps) {
  const { login, isLoggingIn, loginError } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
      if (returnUrl) {
        router.push(decodeURIComponent(returnUrl));
      }
    } catch {}
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Entre na sua conta</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Digite seu email abaixo para entrar na sua conta
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="bg-transparent hover:bg-transparent"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        {loginError && (
          <Field>
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {loginError.message}
            </div>
          </Field>
        )}
        <Field>
          <Button type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? "Entrando..." : "Entrar"}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Não tem uma conta?{" "}
            <a href="/auth/signup" className="underline underline-offset-4">
              Cadastre-se
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
