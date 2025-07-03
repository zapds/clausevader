"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./button";
import { Menu } from "lucide-react";

export default function NavBar({ user }) {
  const pathname = usePathname();

  return (
    <nav className="bg-black text-white border-b border-red-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-red-600">
          ClauseVader
        </Link>

        <div className="space-x-4 hidden md:flex">
        <Link href="/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>
        {user ? (
          <Link href="/logout">
            <Button variant="ghost">Logout</Button>
          </Link>
        ) : (
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
        )}
        </div>

        {/* Mobile menu icon (optional for future expansion) */}
        <button className="md:hidden text-red-500 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}
