'use client';

import { 
  BarChart3, Building2, GraduationCap, LogOut, Settings, Shield,
  Activity, FileText, MessageSquare, Package, AlertTriangle,
  Utensils, Home, Bell, ChevronRight, Users, Banknote, Ghost, ClipboardCheck,
  Camera
} from 'lucide-react';
import type { ActiveView, ActiveSubView } from './KawalApp';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  activeSubView: ActiveSubView;
  setActiveSubView: (sub: ActiveSubView) => void;
  loggedInVendor?: any;
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
  { id: 'schools',          label: 'Manajemen Sekolah',     icon: GraduationCap, desc: 'Daftar Sekolah & Siswa' },
  { id: 'delivery-history', label: 'Riwayat Pengiriman',    icon: Package,  desc: 'Rekam Jejak Distribusi' },
  { id: 'licensing',        label: 'Syarat Izin SPPG',      icon: FileText, desc: 'Dokumen Persyaratan SPPG' },
  { id: 'nutrition',        label: 'Nutrition Center',      icon: Utensils, desc: 'Laporan Foto & Kepatuhan Gizi' },
  { id: 'hygiene',          label: 'Live Guard Monitoring', icon: Camera,   desc: 'Hygiene Compliance AI' },
];

const SEKOLAH_MENUS: MenuItem[] = [
  { id: 'dashboard',        label: 'Dashboard Sekolah',     icon: Home,           desc: 'Ringkasan Makan Hari Ini' },
  { id: 'receipt',          label: 'Konfirmasi Penerimaan', icon: ClipboardCheck, desc: 'Input Jumlah & Kualitas Porsi' },
  { id: 'complaint',        label: 'Aduan Masalah',         icon: AlertTriangle,  desc: 'Laporkan Ketidaksesuaian' },
  { id: 'student-list',     label: 'Daftar Siswa',          icon: Users,          desc: 'Data Penerima Manfaat' },
];

export default function Sidebar({ activeView, setActiveView, activeSubView, setActiveSubView, loggedInVendor }: SidebarProps) {
  const menus = activeView === 'command' ? BGN_MENUS : activeView === 'sppg' ? SPPG_MENUS : SEKOLAH_MENUS;
  const roleLabel = activeView === 'command' ? 'Regulator BGN' : activeView === 'sppg' ? 'Mitra SPPG' : 'Penerima';
  const RoleIcon = activeView === 'command' ? BarChart3 : activeView === 'sppg' ? Building2 : GraduationCap;

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen shrink-0 font-sans">
      
      {/* Brand logo */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-600 text-white">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="font-heading font-black text-slate-800 text-base leading-none tracking-tight">KAWAL-MBG</div>
            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Regulator & Mitra Portal</div>
          </div>
        </div>
      </div>

      {/* Role Chip */}
      <div className="mx-3 mt-4 mb-2 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
          <RoleIcon className="w-4 h-4 text-blue-600" />
        </div>
        <div className="min-w-0">
          <div className="text-slate-900 font-bold text-xs truncate leading-tight">
            {activeView === 'command' ? 'Admin BGN' : activeView === 'sppg' ? (loggedInVendor?.nama || 'CV. Dapur Nusantara') : 'SDN 01 Cilandak'}
          </div>
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{roleLabel}</div>
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
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`} />
                <div className="min-w-0 flex-1">
                  <div className={`font-bold text-sm leading-tight ${isActive ? 'text-white' : ''}`}>{item.label}</div>
                  <div className={`text-[10px] leading-tight mt-0.5 truncate font-medium ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>{item.desc}</div>
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
      <div className="p-3 border-t border-slate-200 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
          <Settings className="w-4 h-4 text-slate-400" />
          Pengaturan Akun
        </button>
        <button 
          onClick={() => setActiveView('landing')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Keluar Sistem
        </button>
      </div>

    </div>
  );
}
