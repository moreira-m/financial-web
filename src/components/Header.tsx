"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { Eye, EyeOff } from "lucide-react";
import { usePrivacy } from "@/contexts/PrivacyContext";

interface HeaderProps {
  loading?: boolean;
}

export function Header({ loading }: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { showValues, toggleValues } = usePrivacy();

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

        <div className="status-indicator desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={toggleValues}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--blueprint-text)', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            title={showValues ? "Ocultar valores" : "Mostrar valores"}
          >
            {showValues ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
          <span>{loading ? "PROCESSANDO..." : "SISTEMA OPERACIONAL"}</span>
        </div>
      </div>

      <nav className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        <Link href="/" onClick={() => setIsMenuOpen(false)} className={pathname === "/" ? "active" : ""}>[ DASHBOARD ]</Link>
        <Link href="/accounts" onClick={() => setIsMenuOpen(false)} className={pathname === "/accounts" ? "active" : ""}>[ ACCOUNTS ]</Link>
        <Link href="/transactions" onClick={() => setIsMenuOpen(false)} className={pathname === "/transactions" ? "active" : ""}>[ TRANSACTIONS ]</Link>
        
        {/* Mobile Toggle */}
        <button 
          onClick={toggleValues}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--blueprint-text)', 
            cursor: 'pointer',
            padding: '1rem',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: 'var(--font-mono)'
          }}
        >
          {showValues ? <Eye size={16} /> : <EyeOff size={16} />}
          [ {showValues ? "OCULTAR VALORES" : "MOSTRAR VALORES"} ]
        </button>
      </nav>
    </header>
  );
}
