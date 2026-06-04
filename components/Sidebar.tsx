'use client';

import { 
  BarChart3, Building2, GraduationCap, LogOut, Settings, Shield,
  Activity, FileText, MessageSquare, Package, AlertTriangle,
  Utensils, Home, Bell, ChevronRight, Users, Banknote, Ghost, ClipboardCheck
} from 'lucide-react';
import type { ActiveView, ActiveSubView } from './KawalApp';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  activeSubView: ActiveSubView;
  setActiveSubView: (sub: ActiveSubView) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  desc: string;
  badge?: string;
}

const BGN_MENUS: MenuItem[] = [
  { id: 'overview',         label: 'Command Center',        icon: BarChart3,      desc: 'Dashboard & Peta Nasional' },
  { id: 'risk',             label: 'Risk Monitoring',       icon: AlertTriangle,  desc: 'Anomali & Skor Risiko SPPG' },
  { id: 'ghost-detection',  label: 'SPPG Ghost Detection',  icon: Ghost,          desc: 'Deteksi SPPG Ghoib & Fraud', badge: '2' },
  { id: 'licensing-review', label: 'Licensing Review',      icon: FileText,       desc: 'Verifikasi Perizinan SPPG' },
  { id: 'finance',          label: 'Distribusi & Keuangan', icon: Banknote,       desc: 'Porsi & Anggaran' },
  { id: 'complaints',       label: 'Complaint Management',  icon: MessageSquare,  desc: 'Manajemen Aduan Nasional' },
];

const SPPG_MENUS: MenuItem[] = [
  { id: 'dashboard',        label: 'Dashboard',             icon: Home,     desc: 'Ringkasan Operasional' },
  { id: 'onboarding',       label: 'Onboarding & Verifikasi', icon: ClipboardCheck, desc: 'Wajib Sebelum Distribusi', badge: '!' },
  { id: 'delivery-history', label: 'Riwayat Pengiriman',    icon: Package,  desc: 'Rekam Jejak Distribusi' },
  { id: 'licensing',        label: 'Perizinan (NIB)',       icon: FileText, desc: 'Verifikasi & Upload Izin' },
  { id: 'nutrition',        label: 'Nutrition Center',      icon: Utensils, desc: 'Laporan Foto & Kepatuhan Gizi' },
];

const SEKOLAH_MENUS: MenuItem[] = [
  { id: 'dashboard',    label: 'Dashboard',           icon: Home,           desc: 'Status Harian Sekolah' },
  { id: 'receipt',      label: 'Goods Receipt',       icon: Package,        desc: 'Terima & Verifikasi Porsi' },
  { id: 'student-list', label: 'Data Penerima',       icon: Users,          desc: 'Daftar Siswa & Absensi' },
  { id: 'complaint',    label: 'Complaint Inbox',     icon: MessageSquare,  desc: 'Keluhan Siswa & Orang Tua' },
];

export default function Sidebar({ activeView, setActiveView, activeSubView, setActiveSubView }: SidebarProps) {
  const menus = activeView === 'command' ? BGN_MENUS
              : activeView === 'sppg'    ? SPPG_MENUS
              : SEKOLAH_MENUS;

  const roleLabel = activeView === 'command' ? 'BGN / Regulator'
                  : activeView === 'sppg'    ? 'SPPG Mitra Vendor'
                  : 'Sekolah Penerima';

  const roleIcon = activeView === 'command' ? BarChart3
                 : activeView === 'sppg'    ? Building2
                 : GraduationCap;

  const RoleIcon = roleIcon;

  return (
    <div className="w-64 h-screen shrink-0 bg-[var(--color-bg-sidebar)] border-r border-[var(--color-border-sidebar)] flex flex-col font-sans text-[var(--color-text-inverse)]">
      
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-[var(--color-border-sidebar)]">
        <div className="flex items-center gap-2">
          <img src="/logo-mbg.png" alt="KAWAL-MBG Logo" className="w-7 h-7 object-contain" />
          <div className="font-heading font-bold text-lg tracking-wide text-white">KAWAL-MBG</div>
        </div>
      </div>

      {/* Role Chip */}
      <div className="mx-3 mt-4 mb-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
          <RoleIcon className="w-4 h-4 text-blue-300" />
        </div>
        <div className="min-w-0">
          <div className="text-white font-bold text-xs truncate leading-tight">
            {activeView === 'command' ? 'Admin BGN' : activeView === 'sppg' ? 'CV. Dapur Nusantara' : 'SDN 01 Cilandak'}
          </div>
          <div className="text-slate-400 text-[10px] font-medium uppercase tracking-wider">{roleLabel}</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3 px-2">
          Menu
        </div>
        <div className="space-y-1">
          {menus.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveSubView(item.id as ActiveSubView)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' 
                    : 'text-slate-300 hover:bg-white/8 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <div className="min-w-0 flex-1">
                  <div className={`font-semibold text-sm leading-tight ${isActive ? 'text-white' : ''}`}>{item.label}</div>
                  <div className={`text-[10px] leading-tight mt-0.5 truncate ${isActive ? 'text-blue-100' : 'text-slate-500 group-hover:text-slate-400'}`}>{item.desc}</div>
                </div>
                {'badge' in item && item.badge && (
                  <span className="shrink-0 text-[10px] font-bold bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                    {String(item.badge)}
                  </span>
                )}
                {isActive && !('badge' in item && item.badge) && <ChevronRight className="w-3.5 h-3.5 text-blue-200 shrink-0" />}
              </button>
            );
          })}
        </div>

      </div>

      {/* Bottom Footer Section */}
      <div className="p-3 border-t border-[var(--color-border-sidebar)] space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/8 hover:text-white transition-colors">
          <Settings className="w-4 h-4 text-slate-400" />
          Pengaturan Akun
        </button>
        <button 
          onClick={() => setActiveView('landing')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4 opacity-70" />
          Keluar Sistem
        </button>
      </div>

    </div>
  );
}
