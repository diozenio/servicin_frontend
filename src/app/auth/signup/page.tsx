import { SignupForm } from "@/components/signup-form";
import Logo from "@/components/logo";

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 max-h-screen overflow-y-auto">
        <Logo />

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
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
