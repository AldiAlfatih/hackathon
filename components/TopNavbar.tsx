'use client';

import { Shield, Building2, User, HelpCircle, LogIn } from 'lucide-react';
import type { ActiveView } from './KawalApp';

interface TopNavbarProps {
  setActiveView: (view: ActiveView) => void;
}

export default function TopNavbar({ setActiveView }: TopNavbarProps) {
  return (
    <nav className="h-16 bg-[var(--color-bg-surface)] border-b border-[var(--color-border-subtle)] px-6 flex items-center justify-between sticky top-0 z-50">
      
      {/* Brand */}
      <div className="flex items-center gap-3">
        <img src="/logo-mbg.png" alt="KAWAL-MBG Logo" className="h-10 w-auto object-contain" />
        <div className="font-heading font-bold text-lg tracking-wide text-[var(--color-text-primary)] flex items-center gap-2">
          KAWAL-MBG
          <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-mono">PORTAL</span>
        </div>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--color-text-secondary)]">
        <a href="#about" className="hover:text-blue-600 transition-colors">Tentang Program</a>
        <a href="#stats" className="hover:text-blue-600 transition-colors">Statistik Nasional</a>
        <div className="w-px h-4 bg-[var(--color-border-subtle)]" />
        <button 
          onClick={() => setActiveView('login')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold"
        >
          <LogIn className="w-4 h-4" /> Login Sistem
        </button>
      </div>

    </nav>
  );
}
