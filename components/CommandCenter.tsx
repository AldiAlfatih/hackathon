'use client';

import { useState, useEffect } from 'react';
import {
  AlertTriangle, CheckCircle2, TrendingDown, TrendingUp, Eye,
  Filter, Search, ChevronDown, ChevronUp, RefreshCw, Bell,
  MapPin, BarChart3, Activity, Shield, ChevronRight, X,
  Package, DollarSign, Clock, FileText, Database, Server,
  Lock, Siren, Microscope, Check, XCircle, AlertOctagon, ImageIcon, User
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { vendors, feedItems, distribusiData, statsData, type Vendor, type FeedItem } from '@/lib/mockData';
import IndonesiaMap from './IndonesiaMap';

import type { BgnSubView, ActiveSubView, GlobalComplaint, GlobalComplaintStatus } from './KawalApp';

type SortField = 'risikoSkor' | 'distribusiHariIni' | 'kapasitas';
type SortDir = 'asc' | 'desc';

interface CommandCenterProps {
  activeSubView: BgnSubView;
  setActiveSubView: (sub: ActiveSubView) => void;
  complaints: GlobalComplaint[];
  updateComplaintStatus: (id: string, status: GlobalComplaintStatus) => void;
}

function RiskBadge({ skor }: { skor: number }) {
  if (skor >= 80) return <span className="text-[11px] px-2 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-700 font-bold uppercase tracking-wider">Rendah ({skor})</span>;
  if (skor >= 50) return <span className="text-[11px] px-2 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-700 font-bold uppercase tracking-wider">Sedang ({skor})</span>;
  return <span className="text-[11px] px-2 py-0.5 rounded border border-red-200 bg-red-50 text-red-700 font-bold uppercase tracking-wider">Tinggi ({skor})</span>;
}

function StatusBadge({ status }: { status: Vendor['statusVerifikasi'] }) {
  const map = {
    Terverifikasi: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    Pending: 'border-amber-200 bg-amber-50 text-amber-700',
    Ditolak: 'border-red-200 bg-red-50 text-red-700',
  };
  return <span className={`text-[11px] px-2 py-0.5 rounded border font-bold uppercase tracking-wider ${map[status]}`}>{status}</span>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white p-3 text-xs border border-slate-200 shadow-xl rounded-lg">
        <div className="text-slate-800 font-bold mb-2 uppercase tracking-wider">{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} style={{ color: p.color }} className="flex justify-between gap-4 font-mono font-medium">
            <span>{p.name}</span>
            <span>{p.value.toLocaleString('id-ID')}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function CommandCenter({ activeSubView, setActiveSubView, complaints, updateComplaintStatus }: CommandCenterProps) {
  const [sortField, setSortField] = useState<SortField>('risikoSkor');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'semua' | 'anomali' | 'aman'>('semua');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [feed, setFeed] = useState<FeedItem[]>(feedItems);
  const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleTimeString('id-ID'));
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Licensing Review States
  type LicenseAction = 'approved' | 'rejected' | null;
  const [licenseActions, setLicenseActions] = useState<Record<string, LicenseAction>>({});
  const [viewLicenseVendor, setViewLicenseVendor] = useState<Vendor | null>(null);

  // Risk Monitoring States
  type EscalationStatus = 'active' | 'escalated' | 'suspended';
  const [escalationStatus, setEscalationStatus] = useState<Record<string, EscalationStatus>>({});
  const [riskBreakdownVendor, setRiskBreakdownVendor] = useState<Vendor | null>(null);

  // Complaint Management States are now handled via KawalApp props

  // Toast notification
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'warning' | 'danger' } | null>(null);
  const showToast = (msg: string, type: 'success' | 'warning' | 'danger') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefresh(new Date().toLocaleTimeString('id-ID'));
    }, 1500);
  };

  const sortedVendors = [...vendors]
    .filter((v) => {
      const matchSearch = v.nama.toLowerCase().includes(search.toLowerCase()) ||
        v.kota.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        filter === 'semua' ||
        (filter === 'anomali' && v.anomali.length > 0) ||
        (filter === 'aman' && v.anomali.length === 0);
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      return (a[sortField] - b[sortField]) * dir;
    });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const anomaliCount = vendors.filter((v) => v.anomali.length > 0).length;
  const pctRealisasi = Math.round((statsData.distribusiHariIni / statsData.targetHarian) * 100);

  return (
    <div className="p-6 min-h-full flex flex-col gap-6 font-sans bg-[var(--color-bg-base)] relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[999] px-5 py-3.5 rounded-xl shadow-2xl border font-bold text-sm flex items-center gap-3 animate-in slide-in-from-top-2 transition-all ${
          toast.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
          toast.type === 'warning' ? 'bg-amber-50 border-amber-300 text-amber-800' :
          'bg-red-50 border-red-300 text-red-800'
        }`}>
          {toast.type === 'success' ? 'âœ…' : toast.type === 'warning' ? 'âš ï¸' : 'ðŸš¨'}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1.5">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>BGN Command Center</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-800">
              {activeSubView === 'overview' ? 'Dashboard Nasional'
               : activeSubView === 'risk' ? 'Risk Monitoring'
               : activeSubView === 'licensing-review' ? 'Licensing Review'
               : 'Complaint Management'}
            </span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">Pusat Komando & Pemantauan MBG</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500 font-mono font-medium">
            UPDATE TERAKHIR: {lastRefresh}
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            SINKRONISASI
          </button>
        </div>
      </div>

      {/* ========= OVERVIEW / COMMAND CENTER MAIN ========= */}
      {activeSubView === 'overview' && <>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Distribusi Hari Ini',
            value: statsData.distribusiHariIni.toLocaleString('id-ID'),
            sub: `${pctRealisasi}% Target Distribusi`,
            icon: Package,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            trend: '+3.2%',
            up: true,
          },
          {
            label: 'Nilai Ekonomi Berputar',
            value: statsData.nilaiEkonomi,
            sub: 'Pembayaran terverifikasi',
            icon: DollarSign,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            trend: '+2.1%',
            up: true,
          },
          {
            label: 'Insiden / Anomali',
            value: statsData.anomaliTerdeteksi.toString(),
            sub: `${anomaliCount} Memerlukan atensi`,
            icon: AlertTriangle,
            color: 'text-red-600',
            bg: 'bg-red-50',
            trend: '+2 Kasus',
            up: false,
          },
          {
            label: 'Verifikasi Menunggu',
            value: statsData.verifikasiPending.toString(),
            sub: `Dari total ${statsData.totalVendor} vendor`,
            icon: FileText,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            trend: '-12 Antrean',
            up: true,
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg ${kpi.bg}`}>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-[11px] font-bold ${kpi.up ? 'text-emerald-600' : 'text-red-600'}`}>
                  {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.trend}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 text-data tracking-tight mb-1">{kpi.value}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{kpi.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Column (Charts & Map) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Charts Row */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col h-80">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-blue-600" />
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Tren Distribusi (8 Hari)</h2>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={distribusiData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="tanggal" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} iconType="circle" iconSize={6} />
                    <Line type="monotone" dataKey="target" name="Target Distribusi" stroke="#94a3b8" strokeDasharray="4 4" dot={false} strokeWidth={2} />
                    <Line type="monotone" dataKey="realisasi" name="Realisasi Harian" stroke="#2563eb" strokeWidth={2} dot={{ fill: '#2563eb', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col h-80">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Insiden Terdeteksi</h2>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distribusiData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="tanggal" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="anomali" name="Jumlah Anomali" fill="#ef4444" radius={[2, 2, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Map */}
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col h-80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pemetaan Operasional Nasional</h2>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-500 rounded-full" /> NORMAL</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-500 rounded-full" /> ANOMALI</span>
              </div>
            </div>
            <div className="flex-1 min-h-0 bg-slate-50 border border-slate-200 rounded-lg overflow-hidden relative">
              <IndonesiaMap />
            </div>
          </div>
        </div>

        {/* Right Column (Feed) */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-full max-h-[calc(100vh-180px)] overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">System Audit Log</h2>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE FEED
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {feed.map((item) => (
              <div key={item.id} className={`p-4 rounded-lg border text-xs bg-white shadow-sm ${
                item.tipe === 'anomali' ? 'border-red-200 border-l-4 border-l-red-500' :
                item.tipe === 'warning' ? 'border-amber-200 border-l-4 border-l-amber-500' :
                'border-slate-200 border-l-4 border-l-blue-500'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${
                    item.tipe === 'anomali' ? 'bg-red-50 text-red-600' :
                    item.tipe === 'warning' ? 'bg-amber-50 text-amber-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {item.tipe === 'anomali' ? 'KRITIS' : item.tipe === 'warning' ? 'PERINGATAN' : 'INFO'}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 font-medium">{item.waktu}</span>
                </div>
                <div className="font-bold text-slate-800 mb-1 truncate text-sm">{item.vendor}</div>
                <div className="text-[11px] text-slate-500 font-medium mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {item.lokasi}
                </div>
                <div className="text-[12px] text-slate-600 leading-relaxed">{item.pesan}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Monitoring Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col mt-2 overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Operational Monitoring (SPPG)</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari Entitas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 text-xs font-medium rounded-lg bg-white border border-slate-300 text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all w-56"
              />
            </div>
            
            <div className="flex rounded-lg border border-slate-300 overflow-hidden text-[11px] font-bold tracking-wider uppercase">
              {(['semua', 'anomali', 'aman'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 transition-colors ${
                    filter === f ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                {[
                  { label: 'ID Reg', field: null },
                  { label: 'Entitas SPPG', field: null },
                  { label: 'Area Operasional', field: null },
                  { label: 'Skor Risiko', field: 'risikoSkor' as SortField },
                  { label: 'Vol/Hari', field: 'distribusiHariIni' as SortField },
                  { label: 'Status Lisensi', field: null },
                  { label: 'Pending Receipt / Insiden', field: null },
                  { label: 'Aksi', field: null },
                ].map(({ label, field }) => (
                  <th
                    key={label}
                    className={`py-4 px-5 ${field ? 'cursor-pointer hover:text-slate-800 transition-colors' : ''}`}
                    onClick={() => field && toggleSort(field)}
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      {field && sortField === field && (
                        sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px]">
              {sortedVendors.map((vendor) => (
                <tr
                  key={vendor.id}
                  onClick={() => setSelectedVendor(selectedVendor?.id === vendor.id ? null : vendor)}
                  className={`cursor-pointer transition-colors ${
                    selectedVendor?.id === vendor.id ? 'bg-blue-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-3 px-5 font-mono font-medium text-slate-500 text-[11px]">{vendor.id}</td>
                  <td className="py-3 px-5">
                    <div className="text-slate-900 font-bold mb-0.5">{vendor.nama}</div>
                    <div className="text-[10px] text-slate-500 font-mono font-medium">UPDATED: {vendor.lastReport}</div>
                  </td>
                  <td className="py-3 px-5">
                    <div className="text-slate-800 font-medium mb-0.5">{vendor.kota}</div>
                    <div className="text-[11px] text-slate-500 uppercase font-semibold">{vendor.provinsi}</div>
                  </td>
                  <td className="py-3 px-5">
                    <RiskBadge skor={vendor.risikoSkor} />
                  </td>
                  <td className="py-3 px-5">
                    <div className="text-slate-900 font-bold text-data mb-1.5">{vendor.distribusiHariIni.toLocaleString('id-ID')}</div>
                    <div className="w-24 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${Math.min((vendor.distribusiHariIni / vendor.kapasitas) * 100, 100)}%` }} />
                    </div>
                  </td>
                  <td className="py-3 px-5"><StatusBadge status={vendor.statusVerifikasi} /></td>
                  <td className="py-3 px-5">
                    {vendor.anomali.length === 0 ? (
                      <span className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Bersih
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[11px] text-red-600 font-bold uppercase tracking-wider">
                        <AlertTriangle className="w-3.5 h-3.5" /> {vendor.anomali.length} Kasus
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-5">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVendor(selectedVendor?.id === vendor.id ? null : vendor);
                      }}
                      className="px-4 py-1.5 text-[11px] font-bold text-blue-600 bg-white border border-blue-200 rounded-md hover:bg-blue-50 transition-colors shadow-sm"
                    >
                      DETAIL
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected vendor detail Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-2xl relative border border-slate-200">
            <div className="flex items-start justify-between mb-6 border-b border-slate-100 pb-4">
              <div>
                <div className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest mb-1">{selectedVendor.id}</div>
                <h3 className="text-xl font-heading font-bold text-slate-900">{selectedVendor.nama}</h3>
                <p className="text-sm text-slate-600 mt-1 font-medium">{selectedVendor.kota}, {selectedVendor.provinsi}</p>
              </div>
              <button onClick={() => setSelectedVendor(null)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Package className="w-3.5 h-3.5" /> Max Kapasitas
                </div>
                <div className="text-lg text-slate-900 font-bold text-data">{selectedVendor.kapasitas.toLocaleString('id-ID')} <span className="text-xs text-slate-500 font-sans font-medium">porsi</span></div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5" /> Harga Satuan
                </div>
                <div className={`text-lg font-bold text-data ${selectedVendor.hargaSatuan > 18000 ? 'text-red-600' : 'text-slate-900'}`}>
                  Rp {selectedVendor.hargaSatuan.toLocaleString('id-ID')}
                </div>
                {selectedVendor.hargaSatuan > 18000 && <div className="mt-1 text-[10px] text-red-600 font-bold uppercase">âš  Melebihi Batas (Rp15k)</div>}
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" /> Koordinat GPS
                </div>
                <div className="font-mono text-xs font-medium text-slate-700 break-words">{selectedVendor.lat}<br/>{selectedVendor.lng}</div>
              </div>
            </div>

            {selectedVendor.anomali.length > 0 ? (
              <div className="mb-6">
                <div className="text-[11px] text-slate-800 uppercase tracking-wider font-bold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" /> Catatan Anomali
                </div>
                <div className="space-y-2">
                  {selectedVendor.anomali.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-red-700 bg-red-50 px-4 py-3 rounded-lg border border-red-200 font-medium">
                      <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm text-emerald-700 bg-emerald-50 px-4 py-4 rounded-lg border border-emerald-200 mb-6 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Tidak ada catatan anomali atau insiden untuk entitas ini.
              </div>
            )}
            
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button onClick={() => setSelectedVendor(null)} className="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-sm">
                TUTUP DETAIL
              </button>
            </div>
          </div>
        </div>
      )}

      </> /* end overview */}

      {/* ========= RISK MONITORING SUB-PAGE ========= */}
      {activeSubView === 'risk' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">Risk Monitoring Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Tekan <strong>Eskalasi</strong> untuk menangguhkan operasional SPPG dan melimpahkan kasus ke tim audit BGN.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'SPPG Risiko Tinggi', value: vendors.filter(v=>v.risikoSkor<50).length, color: 'text-red-600', border: 'border-red-200' },
              { label: 'SPPG Risiko Sedang', value: vendors.filter(v=>v.risikoSkor>=50&&v.risikoSkor<80).length, color: 'text-amber-600', border: 'border-amber-200' },
              { label: 'SPPG Aman', value: vendors.filter(v=>v.risikoSkor>=80).length, color: 'text-emerald-600', border: 'border-emerald-200' },
            ].map(s => (
              <div key={s.label} className={`bg-white p-6 rounded-xl border ${s.border} shadow-sm`}>
                <div className={`text-3xl font-mono font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 bg-slate-50 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" /> SPPG dengan Anomali Aktif
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-5">Entitas SPPG</th>
                    <th className="py-3.5 px-5">Lokasi</th>
                    <th className="py-3.5 px-5">Skor Risiko</th>
                    <th className="py-3.5 px-5">Catatan Anomali</th>
                    <th className="py-3.5 px-5">Status & Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vendors.filter(v=>v.anomali.length>0).map(v => {
                    const esc = escalationStatus[v.id];
                    return (
                      <tr key={v.id} className={`hover:bg-slate-50 ${esc === 'suspended' ? 'opacity-60' : ''}`}>
                        <td className="py-3.5 px-5 font-bold text-slate-800">{v.nama}</td>
                        <td className="py-3.5 px-5 text-slate-500">{v.kota}, {v.provinsi}</td>
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2">
                            <RiskBadge skor={v.risikoSkor} />
                            <button onClick={() => setRiskBreakdownVendor(v)} className="px-2 py-1 bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-600 rounded uppercase hover:bg-slate-200">Lihat Detail</button>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-xs text-red-700 font-medium max-w-xs">{v.anomali.join(' - ')}</td>
                        <td className="py-3.5 px-5">
                          {esc === 'suspended' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 border border-red-300 rounded-lg text-xs font-bold uppercase">
                              <Lock className="w-3.5 h-3.5" /> DITANGGUHKAN
                            </span>
                          ) : esc === 'escalated' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 border border-amber-300 rounded-lg text-xs font-bold uppercase">
                              <AlertOctagon className="w-3.5 h-3.5" /> Sedang Diaudit
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setEscalationStatus(p => ({...p, [v.id]: 'escalated'}));
                                showToast(`${v.nama} telah dieskasi ke tim audit BGN. Distribusi SPPG ditangguhkan sementara.`, 'danger');
                                setTimeout(() => setEscalationStatus(p => ({...p, [v.id]: 'suspended'})), 2000);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                            >
                              <Siren className="w-3.5 h-3.5" /> Eskalasi & Tangguhkan
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Risk Breakdown Modal */}
          {riskBreakdownVendor && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-2xl relative border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Rincian Skor Risiko</h3>
                  <button onClick={() => setRiskBreakdownVendor(null)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700"/></button>
                </div>
                <div className="mb-4 text-sm text-slate-600 border-b border-slate-100 pb-4">
                  Analisis performa <span className="font-bold text-slate-800">{riskBreakdownVendor.nama}</span> berdasarkan parameter operasional dan aduan.
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1">
                      <span className="text-slate-600">Kepatuhan Gizi & Menu</span>
                      <span className={riskBreakdownVendor.risikoSkor >= 80 ? 'text-emerald-600' : 'text-amber-600'}>
                        {Math.min(100, riskBreakdownVendor.risikoSkor + 15)} / 100
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${riskBreakdownVendor.risikoSkor >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(100, riskBreakdownVendor.risikoSkor + 15)}%`}}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1">
                      <span className="text-slate-600">Ketepatan Waktu Distribusi</span>
                      <span className={riskBreakdownVendor.risikoSkor >= 80 ? 'text-emerald-600' : 'text-red-600'}>
                        {Math.max(0, riskBreakdownVendor.risikoSkor - 10)} / 100
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${riskBreakdownVendor.risikoSkor >= 80 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${Math.max(0, riskBreakdownVendor.risikoSkor - 10)}%`}}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1">
                      <span className="text-slate-600">Higiene & Keamanan</span>
                      <span className={riskBreakdownVendor.risikoSkor >= 80 ? 'text-emerald-600' : 'text-red-600'}>
                        {Math.max(0, riskBreakdownVendor.risikoSkor - 25)} / 100
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${riskBreakdownVendor.risikoSkor >= 80 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${Math.max(0, riskBreakdownVendor.risikoSkor - 25)}%`}}></div></div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button onClick={() => setRiskBreakdownVendor(null)} className="px-5 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors">Tutup</button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========= LICENSING REVIEW SUB-PAGE ========= */}
      {activeSubView === 'licensing-review' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">Licensing Review</h1>
            <p className="text-sm text-slate-500 mt-1">
              Verifikasi legalitas dan dokumen izin (NIB, Sertifikat Halal, Laik Higiene) dari SPPG. 
              Tekan <strong>Approve</strong> untuk mengesahkan, atau <strong>Tolak</strong> untuk menangguhkan SPPG.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Terverifikasi', value: vendors.filter(v=>v.statusVerifikasi==='Terverifikasi').length + Object.values(licenseActions).filter(a=>a==='approved').length, color: 'text-emerald-600' },
              { label: 'Pending Review', value: vendors.filter(v=>v.statusVerifikasi==='Pending').length - Object.values(licenseActions).filter(a=>a !== null).length, color: 'text-amber-600' },
              { label: 'Ditolak', value: vendors.filter(v=>v.statusVerifikasi==='Ditolak').length + Object.values(licenseActions).filter(a=>a==='rejected').length, color: 'text-red-600' },
            ].map(s => (
              <div key={s.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className={`text-3xl font-mono font-bold ${s.color}`}>{Math.max(0, s.value)}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 bg-slate-50 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Antrian Verifikasi Dokumen SPPG</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-5">Entitas SPPG</th>
                    <th className="py-3.5 px-5">Lokasi</th>
                    <th className="py-3.5 px-5">Status Lisensi</th>
                    <th className="py-3.5 px-5">Dokumen Izin (NIB / Halal)</th>
                    <th className="py-3.5 px-5">Aksi BGN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vendors.map(v => {
                    const action = licenseActions[v.id];
                    return (
                      <tr key={v.id} className={`hover:bg-slate-50 ${action ? 'opacity-70' : ''}`}>
                        <td className="py-3.5 px-5 font-bold text-slate-800">{v.nama}</td>
                        <td className="py-3.5 px-5 text-slate-500">{v.kota}</td>
                        <td className="py-3.5 px-5">
                          {action === 'approved' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-700 font-bold uppercase tracking-wider">
                              <Check className="w-3 h-3" /> DI-APPROVE BGN
                            </span>
                          ) : action === 'rejected' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border border-red-200 bg-red-50 text-red-700 font-bold uppercase tracking-wider">
                              <XCircle className="w-3 h-3" /> DITOLAK BGN
                            </span>
                          ) : (
                            <StatusBadge status={v.statusVerifikasi} />
                          )}
                        </td>
                        <td className="py-3.5 px-5">
                          <button onClick={() => setViewLicenseVendor(v)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                            <FileText className="w-3.5 h-3.5" /> LIHAT DOKUMEN
                          </button>
                        </td>
                        <td className="py-3.5 px-5">
                          {!action ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setLicenseActions(p => ({...p, [v.id]: 'approved'}));
                                  showToast(`BERHASIL: ${v.nama} berhasil di-approve. Kontrak aktif.`, 'success');
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-emerald-600 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors"
                              ><Check className="w-3.5 h-3.5" /> Approve</button>
                              <button
                                onClick={() => {
                                  setLicenseActions(p => ({...p, [v.id]: 'rejected'}));
                                  showToast(`DITOLAK: ${v.nama} ditolak. Kontrak dibatalkan dan SPPG dinotifikasi.`, 'danger');
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                              ><XCircle className="w-3.5 h-3.5" /> Tolak</button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setLicenseActions(p => ({...p, [v.id]: null}))}
                              className="text-xs text-slate-400 hover:text-slate-600 underline"
                            >Batalkan</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* License Document Viewer Modal */}
          {viewLicenseVendor && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-2xl relative border border-slate-200">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Peninjauan Dokumen Legal</h3>
                    <p className="text-sm text-slate-500 font-medium">{viewLicenseVendor.nama} - {viewLicenseVendor.kota}</p>
                  </div>
                  <button onClick={() => setViewLicenseVendor(null)} className="p-2 bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg"><X className="w-5 h-5"/></button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-col items-center justify-center h-48 text-center text-slate-400">
                    <FileText className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-xs font-bold uppercase tracking-wider block text-slate-600 mb-1">Surat Izin NIB</span>
                    <span className="text-[10px]">Telah diverifikasi sistem OSS</span>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-4 bg-emerald-50 flex flex-col items-center justify-center h-48 text-center text-emerald-600 border-dashed">
                    <CheckCircle2 className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-xs font-bold uppercase tracking-wider block mb-1">Sertifikat Halal MUI</span>
                    <span className="text-[10px]">Masa Berlaku: 2026-2030</span>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setViewLicenseVendor(null)} className="px-5 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors">Tutup Peninjauan</button>
                  <button onClick={() => {
                    setLicenseActions(p => ({...p, [viewLicenseVendor.id]: 'approved'}));
                    showToast(`BERHASIL: Dokumen ${viewLicenseVendor.nama} disahkan.`, 'success');
                    setViewLicenseVendor(null);
                  }} className="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors">Approve Dokumen</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========= DISTRIBUSI & KEUANGAN SUB-PAGE ========= */}
      {activeSubView === 'finance' && (
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">Distribusi & Keuangan</h1>
              <p className="text-sm text-slate-500 mt-1">Pemantauan penyaluran porsi makan bergizi dan penyerapan anggaran per SPPG.</p>
            </div>
            <div className="bg-white px-3 py-1.5 border border-slate-200 rounded-lg flex items-center gap-2 shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pilih Tanggal:</span>
              <input type="date" defaultValue="2026-08-12" className="text-sm font-bold text-slate-800 outline-none" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-3xl font-mono font-bold text-blue-600">3,45 Juta</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Total Porsi Disalurkan (Harian)</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-3xl font-mono font-bold text-emerald-600">Rp 51,7 M</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Estimasi Anggaran Terserap</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-3xl font-mono font-bold text-slate-900">Rp 15.000</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Rata-rata Harga per Porsi</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Rincian Penyerapan Anggaran SPPG</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Cari entitas..." className="pl-9 pr-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-300 w-48 outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-5">Entitas SPPG</th>
                    <th className="py-3.5 px-5">Wilayah</th>
                    <th className="py-3.5 px-5">Menu yang Disajikan</th>
                    <th className="py-3.5 px-5">Porsi Terkirim</th>
                    <th className="py-3.5 px-5">Tarif per Porsi</th>
                    <th className="py-3.5 px-5">Total Anggaran (Estimasi)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vendors.map(v => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-5 font-bold text-slate-800">{v.nama}</td>
                      <td className="py-3.5 px-5 text-slate-500">{v.kota}</td>
                      <td className="py-3.5 px-5 text-xs text-slate-600 max-w-xs leading-relaxed">Nasi Putih, Lauk Protein, Sayuran, Buah Pisang, Susu UHT</td>
                      <td className="py-3.5 px-5 font-mono text-blue-700 font-bold">{v.distribusiHariIni.toLocaleString('id-ID')}</td>
                      <td className="py-3.5 px-5 font-mono">Rp {v.hargaSatuan.toLocaleString('id-ID')}</td>
                      <td className="py-3.5 px-5 font-mono text-emerald-700 font-bold">
                        Rp {(v.distribusiHariIni * v.hargaSatuan).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========= COMPLAINT MANAGEMENT SUB-PAGE ========= */}
      {activeSubView === 'complaints' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">Complaint Management</h1>
            <p className="text-sm text-slate-500 mt-1">
              <strong>Investigasi</strong> = BGN menurunkan tim untuk menyelidiki laporan secara aktif.
              <strong> Selesai</strong> = Kasus dinyatakan selesai ditangani.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Aduan Masuk (Total)', value: complaints.length, color: 'text-slate-900' },
              { label: 'Sedang Diinvestigasi', value: complaints.filter(c => c.status === 'Investigating').length, color: 'text-blue-600' },
              { label: 'Diselesaikan', value: complaints.filter(c => c.status === 'Resolved').length, color: 'text-emerald-600' },
            ].map(s => (
              <div key={s.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className={`text-3xl font-mono font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 bg-slate-50 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Aduan Nasional Ke BGN</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-5">ID & Sumber</th>
                    <th className="py-3.5 px-5">Lokasi / Sekolah</th>
                    <th className="py-3.5 px-5">Kategori & Severity</th>
                    <th className="py-3.5 px-5">Laporan</th>
                    <th className="py-3.5 px-5">Status & Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {complaints.map(r => {
                    const cAction = r.status;
                    return (
                      <tr key={r.id} className={`hover:bg-slate-50 ${cAction === 'Resolved' ? 'opacity-60' : ''}`}>
                        <td className="py-3.5 px-5">
                          <div className="font-mono text-xs font-bold text-slate-800">{r.id}</div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1 flex items-center gap-1">
                            {r.sumber === 'Publik' ? <User className="w-3 h-3 text-blue-500"/> : <Building2 className="w-3 h-3 text-emerald-500"/>}
                            {r.sumber}
                          </div>
                        </td>
                        <td className="py-3.5 px-5 font-bold text-slate-800">{r.sekolah}</td>
                        <td className="py-3.5 px-5 space-y-1.5">
                          <span className="block w-max px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider border border-slate-200">{r.kategori}</span>
                          <span className={`block w-max px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${r.severity==='High' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{r.severity}</span>
                        </td>
                        <td className="py-3.5 px-5 text-sm font-medium text-slate-800 max-w-xs">
                          <div className="mb-1">{r.laporan}</div>
                          {r.fotoBukti && <span className="w-max text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1"><ImageIcon className="w-3 h-3"/> Foto Terlampir</span>}
                        </td>
                        <td className="py-3.5 px-5">
                          {cAction === 'Resolved' ? (
                            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Kasus Selesai</span>
                          ) : cAction === 'Investigating' ? (
                            <div className="flex gap-2">
                              <span className="text-xs font-bold text-blue-600 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-1.5 w-max">
                                <Search className="w-3.5 h-3.5" /> Sedang Diinvestigasi
                              </span>
                              <button
                                onClick={() => {
                                  updateComplaintStatus(r.id, 'Resolved');
                                  showToast(`BERHASIL: Kasus ${r.id} dinyatakan selesai oleh BGN.`, 'success');
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-600 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors"
                              ><CheckCircle2 className="w-3.5 h-3.5" /> Tandai Selesai</button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  updateComplaintStatus(r.id, 'Investigating');
                                  showToast(`INFO: Kasus ${r.id} sedang diinvestigasi. Tim lapangan BGN akan diturunkan ke ${r.sekolah}.`, 'warning');
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                              ><Search className="w-3.5 h-3.5" /> Investigasi</button>
                              <button
                                onClick={() => {
                                  updateComplaintStatus(r.id, 'Resolved');
                                  showToast(`BERHASIL: Kasus ${r.id} dinyatakan selesai.`, 'success');
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-600 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors"
                              ><CheckCircle2 className="w-3.5 h-3.5" /> Selesai</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

