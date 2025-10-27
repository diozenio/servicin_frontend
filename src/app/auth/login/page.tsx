"use client";

import { LoginForm } from "@/components/login-form";
import Logo from "@/components/logo";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <Logo />

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm returnUrl={returnUrl} />
          </div>
        </div>
      </div>
      <div className="bg-muted/50 relative hidden lg:block">
        <img
          src="/images/auth_background.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}
