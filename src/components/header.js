"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // daftar link menu
  const menuLinks = [
    { href: "/", label: "Beranda" },
    { href: "/tracker", label: "Aksi Hijau" },
    { href: "/summary", label: "Ringkasan" },
    { href: "/graph", label: "Grafik" },
    { href: "/leaderboard", label: "Skor" },
    { href: "/waste-bank", label: "Bank Sampah" },
  ];

  return (
    
    // Tambahkan kelas: fixed top-0 w-full z-50 dan efek blur/background
    <header 
        id="siteHeader" 
        className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm shadow-md transition-shadow duration-300"
    >
      <div className="max-w-6xl mx-auto h-16 px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="GreenCycle logo"
            width={28}
            height={28}
            priority={true} // Priority loading untuk logo
          />
          <span className="font-bold text-lg text-green-700">GreenHabit</span>
        </Link>

        {/* Menu desktop */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6">
            {menuLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-gray-600 hover:text-green-600 transition ${
                    pathname === link.href ? "font-bold text-green-700 underline underline-offset-4 decoration-2" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Button hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-md border border-slate-200 bg-white/70 backdrop-blur"
          aria-expanded={isOpen}
          aria-controls="mobileMenu"
        >
          {!isOpen ? (
            <Image
              src="/images/hamburger.svg"
              alt="menu"
              width={24}
              height={24}
              className="h-6 w-6"
            />
          ) : (
            <Image
              src="/images/close.svg"
              alt="close"
              width={24}
              height={24}
              className="h-6 w-6"
            />
          )}
        </button>
      </div>

      {/* Menu mobile */}
      <div
        id="mobileMenu"
        className={`md:hidden border-t border-slate-100 absolute w-full transition-all duration-300 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <ul className="p-4 space-y-2 bg-white shadow-lg">
          {menuLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block p-2 rounded hover:bg-slate-100 transition ${
                  pathname === link.href ? "font-bold text-green-700 bg-slate-50" : ""
                }`}
                onClick={() => setIsOpen(false)} // tutup menu setelah klik
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
