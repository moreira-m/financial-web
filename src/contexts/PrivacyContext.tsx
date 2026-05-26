"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface PrivacyContextType {
  showValues: boolean;
  toggleValues: () => void;
  formatValue: (value: number) => string;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export function PrivacyProvider({ children }: { children: ReactNode }) {
  const [showValues, setShowValues] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("@fin:showValues");
    if (saved !== null) {
      setShowValues(saved === "true");
    }
  }, []);

  const toggleValues = () => {
    setShowValues(prev => {
      const next = !prev;
      localStorage.setItem("@fin:showValues", String(next));
      return next;
    });
  };

  const formatValue = (value: number) => {
    if (!mounted || showValues) {
      return `R$ ${value.toFixed(2).replace('.', ',')}`;
    }
    return "••••";
  };

  return (
    <PrivacyContext.Provider value={{ showValues, toggleValues, formatValue }}>
      {children}
    </PrivacyContext.Provider>
  );
}

export function usePrivacy() {
  const context = useContext(PrivacyContext);
  if (context === undefined) {
    throw new Error("usePrivacy must be used within a PrivacyProvider");
  }
  return context;
}
