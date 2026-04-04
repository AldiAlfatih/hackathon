'use client';

import { Shield, Building2, Camera, LayoutDashboard, Activity, ChevronRight } from 'lucide-react';
import type { ActiveView } from './KawalApp';

interface NavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  currentTime: string;
}

const navItems = [
  {
    id: 'landing' as ActiveView,
    label: 'Beranda',
    icon: LayoutDashboard,
    description: 'Executive Summary',
  },
  {
    id: 'vendor' as ActiveView,
    label: 'Portal Vendor',
    icon: Building2,
    description: 'Pendaftaran & Pelaporan',
  },
  {
    id: 'inspector' as ActiveView,
    label: 'Aplikasi Pengawas',
    icon: Camera,
    description: 'AI Nutrition Scanner',
  },
  {
    id: 'command' as ActiveView,
    label: 'Command Center',
    icon: LayoutDashboard,
    description: 'Analitik Regulator',
  },
];

export default function Navbar({ activeView, setActiveView, currentTime }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-blue-900/40" style={{
      background: 'rgba(8, 20, 46, 0.95)',
      backdropFilter: 'blur(16px)',
    }}>
      {/* Top status bar */}
      <div className="border-b border-blue-900/30 px-6 py-1.5 flex items-center justify-between text-xs text-blue-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
            SISTEM AKTIF
          </span>
          <span className="text-blue-600">|</span>
          <span>KAWAL-MBG v2.4.1</span>
          <span className="text-blue-600">|</span>
          <span className="hidden sm:inline">PIDI Digdaya 2026</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-green-400" />
            <span className="font-mono">{currentTime} WIB</span>
          </span>
          <span className="hidden sm:inline text-blue-500">🇮🇩 Republik Indonesia</span>
        </div>
      </div>

      {/* Main nav */}
      <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-3 group flex-shrink-0"
        >
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1d4ed8, #0ea5e9)' }}
          >
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-white text-sm tracking-wider">KAWAL-MBG</div>
            <div className="text-xs text-blue-400 leading-none">Pengawasan Makan Bergizi Gratis</div>
          </div>
        </button>

        {/* Nav items */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg glow-blue'
                    : 'text-blue-300 hover:text-white hover:bg-blue-900/40'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden lg:inline">{item.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 hidden xl:inline opacity-60" />}
              </button>
            );
          })}
        </nav>

        {/* Right badge */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <div className="px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-700/50"
            style={{ background: 'rgba(29, 78, 216, 0.15)', color: '#93c5fd' }}
          >
            Kompetisi PIDI 2026
          </div>
        </div>
      </div>
    </header>
  );
}
