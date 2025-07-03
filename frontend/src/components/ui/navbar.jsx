"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

export default function NavBar() {
  const pathname = usePathname();

  const linkClass = (href) =>
    `px-4 py-2 rounded hover:bg-red-700 ${
      pathname === href ? "bg-red-800" : ""
    }`;

  return (
    <nav className="bg-black text-white border-b border-red-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-red-600">
          ClauseVader
        </Link>

        <div className="space-x-4 hidden md:flex">
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>
          <Link href="/dashboard" className={linkClass("/dashboard")}>
            Dashboard
          </Link>
          <Link href="/login" className={linkClass("/login")}>
            Login
          </Link>
        </div>

        {/* Mobile menu icon (optional for future expansion) */}
        <button className="md:hidden text-red-500 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}
