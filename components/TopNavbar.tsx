'use client';

import { Shield, Building2, User, HelpCircle, LogIn, Menu, X } from 'lucide-react';
import type { ActiveView } from './KawalApp';
import { useState } from 'react';

interface TopNavbarProps {
  setActiveView: (view: ActiveView) => void;
}

export default function TopNavbar({ setActiveView }: TopNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-[var(--color-bg-surface)] border-b border-[var(--color-border-subtle)] px-4 sm:px-6 sticky top-0 z-50">
      <div className="h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <img src="/logo-mbg.png" alt="KAWAL-MBG Logo" className="h-9 sm:h-10 w-auto object-contain" />
          <div className="font-heading font-bold text-base sm:text-lg tracking-wide text-[var(--color-text-primary)] flex items-center gap-2">
            KAWAL-MBG
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-mono hidden sm:inline-block">PORTAL</span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--color-text-secondary)]">
          <a href="#about" className="hover:text-blue-600 transition-colors">Tentang Program</a>
          <a href="#stats" className="hover:text-blue-600 transition-colors">Statistik Nasional</a>
          <a href="#cek-sppg" className="text-red-600 hover:text-red-700 transition-colors font-bold flex items-center gap-1.5"><Shield className="w-4 h-4" /> Cek SPPG Publik</a>
          <div className="w-px h-4 bg-[var(--color-border-subtle)]" />
          <button 
            onClick={() => setActiveView('login')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold"
          >
            <LogIn className="w-4 h-4" /> Login Sistem
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 border-t border-slate-100 space-y-3 bg-white px-2">
          <a 
            href="#about" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Tentang Program
          </a>
          <a 
            href="#stats" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Statistik Nasional
          </a>
          <a 
            href="#cek-sppg" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
          >
            <Shield className="w-4 h-4" /> Cek SPPG Publik
          </a>
          <div className="pt-2 border-t border-slate-100">
            <button 
              onClick={() => { setMobileMenuOpen(false); setActiveView('login'); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-sm"
            >
              <LogIn className="w-4 h-4" /> Login Sistem
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
