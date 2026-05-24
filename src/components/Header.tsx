"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface HeaderProps {
  loading?: boolean;
}

export function Header({ loading }: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Map pathnames to page titles
  const getPageTitle = (path: string) => {
    switch (path) {
      case "/": return "Dashboard";
      case "/accounts": return "Accounts";
      case "/transactions": return "Transactions";
      default: return "Financial Analyst";
    }
  };

  return (
    <header>
      <div className="header-main">
        <div className="title-group">
          <h1>{getPageTitle(pathname)}</h1>
          <span>v1.0.0 // LOCAL_HOST // SECURE_MODE</span>
        </div>
        
        <button 
          className="menu-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        <nav className="desktop-nav">
          <Link href="/" className={pathname === "/" ? "active" : ""}>[ DASHBOARD ]</Link>
          <Link href="/accounts" className={pathname === "/accounts" ? "active" : ""}>[ ACCOUNTS ]</Link>
          <Link href="/transactions" className={pathname === "/transactions" ? "active" : ""}>[ TRANSACTIONS ]</Link>
        </nav>

        <div className="status-indicator desktop-only">
          {loading ? "PROCESSANDO..." : "SISTEMA OPERACIONAL"}
        </div>
      </div>

      <nav className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        <Link href="/" onClick={() => setIsMenuOpen(false)} className={pathname === "/" ? "active" : ""}>[ DASHBOARD ]</Link>
        <Link href="/accounts" onClick={() => setIsMenuOpen(false)} className={pathname === "/accounts" ? "active" : ""}>[ ACCOUNTS ]</Link>
        <Link href="/transactions" onClick={() => setIsMenuOpen(false)} className={pathname === "/transactions" ? "active" : ""}>[ TRANSACTIONS ]</Link>
      </nav>
    </header>
  );
}
