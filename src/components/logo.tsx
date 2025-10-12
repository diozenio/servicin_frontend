import { Wrench } from "lucide-react";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-1.5">
      <Wrench className="size-4" />
      <span className="font-medium">Servicin</span>
    </Link>
  );
}
