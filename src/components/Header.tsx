import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  const links = [
    { href: "/", label: "首页" },
    { href: "/settings", label: "设置" },
  ];

  return (
    <header className="bg-white shadow-sm mb-4">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="font-bold text-xl">One API Dashboard</div>
        <nav className="flex gap-2">
          {links.map((link) => (
            <Button variant="ghost" asChild key={link.href}>
              <Link href={link.href} className="hover:bg-accent">
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
