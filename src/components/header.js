'use client'

import Link from "next/link";
import Image from "next/image";

export default function Header () {
  return (
    <div>
      <header id="siteHeader" className="header header-solid">
        <div className="max-w-6xl mx-auto h-16 px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/images/logo.svg"
              alt="GreenCycle logo"
              width={28}
              height={28}
            />
            <span className="font-bold text-lg">GreenCycle</span>
          </Link>
          <nav className="hidden md:block">
            <ul className="flex items-center gap-6">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/tracker">Tracker</Link></li>
              <li><Link href="/summary">Summary</Link></li>
              <li><Link href="/graph">Graph</Link></li>
              <li><Link href="/leaderboard">Leaderboard</Link></li>
              <li><Link href="/waste-bank">Waste Bank</Link></li>
            </ul>
          </nav>
          <button
            id="openMenu"
            className="md:hidden p-2 rounded-md border border-slate-200 bg-white/70 backdrop-blur"
            aria-expanded="false"
            aria-controls="mobileMenu"
          >
            <Image
              id="iconHamburger"
              src="/assets/images/hamburger.svg"
              alt="menu"
              width={24}
              height={24}
              className="h-6 w-6"
            />
            <Image
              id="iconClose"
              src="/assets/images/close.svg"
              alt="close"
              width={24}
              height={24}
              className="h-6 w-6 hidden"
            />
          </button>
        </div>
        <div id="mobileMenu" className="md:hidden hidden border-t border-slate-100 relative z-50 bg-white">
          <ul className="p-4 space-y-2">
            <li><Link href="/" className="block p-2 rounded hover:bg-slate-50">Home</Link></li>
            <li><Link href="/overview" className="block p-2 rounded hover:bg-slate-50">Overview</Link></li>
            <li><Link href="/tips-and-trick" className="block p-2 rounded hover:bg-slate-50">Tips & Trick</Link></li>
            <li><Link href="/waste-bank" className="block p-2 rounded hover:bg-slate-50">Waste Bank</Link></li>
            <li><Link href="/contact-us" className="block p-2 rounded hover:bg-slate-50">Contact Us</Link></li>
            <li><Link href="/game" className="block p-2 rounded hover:bg-slate-50 font-pixelify">Play Game</Link></li>
          </ul>
        </div>
      </header>
    </div>
  )
}
