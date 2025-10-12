import { Wrench } from "lucide-react";

export default function Logo() {
  return (
    <a href="/" className="flex items-center space-x-1.5">
      <Wrench className="size-4" />
      <span className="font-medium">Servicin</span>
    </a>
  );
}
