'use client';

import { useState, useEffect } from 'react';
import {
  AlertTriangle, CheckCircle2, TrendingDown, TrendingUp, Eye,
  Filter, Search, ChevronDown, ChevronUp, RefreshCw, Bell,
  MapPin, BarChart3, Activity, Shield, ChevronRight, X,
  Package, DollarSign, Clock, FileText, Database, Server,
  Lock, Siren, Microscope, Check, XCircle, AlertOctagon, ImageIcon, User, Building2, Ghost, Banknote, Send
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { feedItems, distribusiData, statsData, type Vendor, type FeedItem } from '@/lib/mockData';
import IndonesiaMap from './IndonesiaMap';

import type { BgnSubView, ActiveSubView, GlobalComplaint, GlobalComplaintStatus } from './KawalApp';

type SortField = 'risikoSkor' | 'distribusiHariIni' | 'kapasitas';
type SortDir = 'asc' | 'desc';

interface CommandCenterProps {
  activeSubView: BgnSubView;
  setActiveSubView: (sub: ActiveSubView) => void;
  complaints: GlobalComplaint[];
  updateComplaintStatus: (id: string, status: GlobalComplaintStatus) => void;
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
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

export default function CommandCenter({ activeSubView, setActiveSubView, complaints, updateComplaintStatus, vendors, setVendors }: CommandCenterProps) {
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

  // Penyaluran Dana Berkala (Jadwal Setiap Hari Senin)
  const [showDisbursementModal, setShowDisbursementModal] = useState(false);
  const [disbursementForm, setDisbursementForm] = useState({
    sppgId: 'v1',
    periode: 'Senin, 17 Agustus 2026',
    porsi: 22500,
    catatan: 'Penyaluran dana operasional berkala mingguan (Hari Senin)'
  });
  const [disbursements, setDisbursements] = useState([
    { id: 'DISB-20260810-01', sppgId: 'v1', sppgNama: 'CV. Dapur Nusantara Sejahtera', periode: 'Senin, 10 Ags 2026', porsi: 22500, nominal: 337500000, bank: 'Bank Mandiri (152009988112)', status: 'Disalurkan (Senin)' },
    { id: 'DISB-20260810-02', sppgId: 'v2', sppgNama: 'PT. Parepare Gizi Mandiri', periode: 'Senin, 10 Ags 2026', porsi: 10500, nominal: 152250000, bank: 'Bank BRI (001201099238)', status: 'Disalurkan (Senin)' },
    { id: 'DISB-20260810-03', sppgId: 'v3', sppgNama: 'CV. Bacukiki Berkah Pangan', periode: 'Senin, 10 Ags 2026', porsi: 22500, nominal: 337500000, bank: 'Bank BNI (0891234771)', status: 'Disalurkan (Senin)' },
    { id: 'DISB-20260817-01', sppgId: 'v4', sppgNama: 'UD. Soreang Sehat Catering', periode: 'Senin, 17 Ags 2026', porsi: 12400, nominal: 183520000, bank: 'Bank Mandiri (152008877119)', status: 'Terjadwal (Senin Depan)' },
    { id: 'DISB-20260817-02', sppgId: 'v5', sppgNama: 'PT. Sinar Lumpue Pangan', periode: 'Senin, 17 Ags 2026', porsi: 8750, nominal: 131250000, bank: 'Bank Syariah Indonesia (712399812)', status: 'Terjadwal (Senin Depan)' },
  ]);

  const handleCreateDisbursement = (e: React.FormEvent) => {
    e.preventDefault();
    const vendor = vendors.find(v => v.id === disbursementForm.sppgId) || vendors[0];
    const nominal = disbursementForm.porsi * vendor.hargaSatuan;
    const newDisb = {
      id: `DISB-${Date.now().toString().slice(-8)}`,
      sppgId: vendor.id,
      sppgNama: vendor.nama,
      periode: disbursementForm.periode,
      porsi: disbursementForm.porsi,
      nominal: nominal,
      bank: 'Bank Mandiri (152009988112)',
      status: 'Disalurkan (Senin)'
    };
    setDisbursements(prev => [newDisb, ...prev]);
    showToast(`Dana Rp ${nominal.toLocaleString('id-ID')} berhasil disalurkan ke ${vendor.nama} untuk jadwal ${disbursementForm.periode}!`, 'success');
    setShowDisbursementModal(false);
  };

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
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : 
           toast.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-amber-600" /> : 
           <AlertOctagon className="w-5 h-5 text-red-600" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>BGN Command Center</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-800 font-bold">
              {activeSubView === 'overview' ? 'Dashboard Nasional'
               : activeSubView === 'risk' ? 'Risk Monitoring'
               : activeSubView === 'ghost-detection' ? 'SPPG Ghost Detection'
               : activeSubView === 'licensing-review' ? 'Licensing Review'
               : activeSubView === 'finance' ? 'Distribusi & Keuangan'
               : 'Complaint Management'}
            </span>
          </div>
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

      {/* ========= GHOST DETECTION SUB-PAGE ========= */}
      {activeSubView === 'ghost-detection' && (() => {
        const ghostVendors = vendors.filter(v => v.statusOnboarding === 'Belum Beroperasi' || v.statusOnboarding === 'Diblokir');
        const pendingVendors = vendors.filter(v => v.statusOnboarding === 'Pending Verifikasi');
        const danaTerblokir = ghostVendors.reduce((acc, v) => acc + (v.kapasitas * v.hargaSatuan * 30), 0);
        return (
          <div className="space-y-6">
            {/* Alert Banner */}
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                <AlertOctagon className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="font-bold text-red-800 text-base mb-1">⚠️ Sistem Mendeteksi {ghostVendors.length} SPPG Ghoib</div>
                <div className="text-sm text-red-700">SPPG berikut telah terdaftar dan menerima alokasi dana, namun <strong>tidak pernah melakukan distribusi</strong> dan tidak dapat diverifikasi keberadaan fisiknya. Tindakan segera diperlukan untuk memblokir aliran dana.</div>
              </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'SPPG Terdeteksi Ghoib', value: ghostVendors.length.toString(), icon: Ghost, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
                { label: 'Pending Verifikasi Lapangan', value: pendingVendors.length.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
                { label: 'Estimasi Dana Terancam', value: `Rp ${(danaTerblokir/1e9).toFixed(1)} M`, icon: DollarSign, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
                { label: 'Verifikasi Lapangan Gagal', value: ghostVendors.filter(v => !v.ceklistOnboarding.kunjunganLapangan).length.toString(), icon: MapPin, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
              ].map(k => (
                <div key={k.label} className={`bg-white p-5 rounded-2xl border-2 ${k.border} shadow-sm`}>
                  <div className={`w-9 h-9 ${k.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <k.icon className={`w-4.5 h-4.5 ${k.color}`} />
                  </div>
                  <div className={`text-2xl font-heading font-black ${k.color}`}>{k.value}</div>
                  <div className="text-xs text-slate-500 font-semibold mt-1">{k.label}</div>
                </div>
              ))}
            </div>

            {/* Ghost SPPG Table */}
            <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-red-100 bg-red-50 flex items-center justify-between">
                <div className="font-bold text-red-800 flex items-center gap-2">
                  <Ghost className="w-4 h-4" /> Daftar SPPG Berindikasi Ghoib
                </div>
                <span className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">{ghostVendors.length} Kasus Aktif</span>
              </div>
              <div className="divide-y divide-slate-100">
                {ghostVendors.map(v => (
                  <div key={v.id} className="p-5">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{v.id}</span>
                          <span className="text-sm font-bold text-slate-900">{v.nama}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                            {v.statusOnboarding}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mb-3">{v.kota}, {v.provinsi} · Terdaftar: {v.tanggalDaftar} · Terakhir Lapor: {v.lastReport}</div>
                        {/* Anomali list */}
                        <div className="space-y-1.5">
                          {v.anomali.map((a, i) => (
                            <div key={i} className="text-xs text-red-700 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 flex items-start gap-2">
                              <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" /> {a}
                            </div>
                          ))}
                        </div>
                        {/* Checklist onboarding */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {Object.entries(v.ceklistOnboarding).map(([key, val]) => (
                            <span key={key} className={`text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 ${
                              val ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                              {val ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                              {key === 'nib' ? 'NIB / OSS' : key === 'fotoDapur' ? 'Foto Fasilitas' : key === 'gpsLokasi' ? 'GPS Lokasi' : key === 'rekeningAktif' ? 'Rekening Bank' : 'Kunjungan Lapangan'}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 min-w-[140px]">
                        <button onClick={() => showToast(`Dana ${v.nama} berhasil diblokir!`, 'success')} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors">
                          <Lock className="w-3.5 h-3.5" /> Blokir Dana
                        </button>
                        <button onClick={() => showToast(`Tim investigasi dikirim ke ${v.kota}`, 'warning')} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors">
                          <MapPin className="w-3.5 h-3.5" /> Kirim Investigasi
                        </button>
                        <button onClick={() => showToast(`${v.nama} dilaporkan ke APH`, 'danger')} className="px-4 py-2 bg-white border border-slate-200 hover:border-red-300 text-slate-700 hover:text-red-600 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors">
                          <Siren className="w-3.5 h-3.5" /> Laporkan ke APH
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Checklist Framework */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" /> Protokol Verifikasi Wajib Sebelum Dana Aktif
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {[
                  { step: 1, label: 'Validasi NIB di OSS', desc: 'Nomor Induk Berusaha harus aktif dan terdaftar resmi', ok: true },
                  { step: 2, label: 'Foto Fasilitas Dapur', desc: 'Min. 3 foto interior dapur produksi bergeotag GPS', ok: true },
                  { step: 3, label: 'Verifikasi Lokasi GPS', desc: 'Koordinat lokasi harus sesuai alamat NIB ±500m', ok: true },
                  { step: 4, label: 'Rekening Bank Aktif', desc: 'Rekening harus atas nama badan usaha terdaftar', ok: true },
                  { step: 5, label: 'Kunjungan Lapangan BGN', desc: 'Petugas BGN wajib kunjungi fisik sebelum dana cair', ok: false },
                ].map(s => (
                  <div key={s.step} className={`p-4 rounded-xl border-2 ${s.ok ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-black mb-2 ${s.ok ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>{s.step}</div>
                    <div className={`font-bold text-sm mb-1 ${s.ok ? 'text-emerald-800' : 'text-red-800'}`}>{s.label}</div>
                    <div className={`text-[11px] leading-tight ${s.ok ? 'text-emerald-700' : 'text-red-700'}`}>{s.desc}</div>
                    {!s.ok && <div className="mt-2 text-[10px] font-bold text-red-600 uppercase">⚠️ Celah Utama SPPG Ghoib</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========= OVERVIEW / COMMAND CENTER MAIN ========= */}
      {activeSubView === 'overview' && <>

      {/* Notifikasi Risiko Real-Time Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-red-500/10 to-blue-500/10 border border-amber-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 text-amber-700 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
                Notifikasi Risiko Real-Time
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Peringatan Otomatis AI Command Center</span>
            </div>
            <p className="text-xs font-medium text-slate-700 mt-1">
              Terdeteksi <strong>{vendors.filter(v => v.anomali.length > 0).length} SPPG dengan anomali aktif</strong> dan <strong>{complaints.filter(c => c.status === 'Open').length} aduan baru</strong> yang memerlukan inspeksi mendadak hari ini.
            </p>
          </div>
        </div>
        <button 
          onClick={() => setActiveSubView('risk')}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
        >
          <Shield className="w-3.5 h-3.5" /> Buka Risk Monitoring
        </button>
      </div>

      {/* KPI Cards Grid - 8 Key Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Jumlah Total SPPG',
            value: statsData.totalVendor.toLocaleString('id-ID'),
            sub: 'Terdaftar di Database BGN',
            icon: Building2,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            trend: '+12 Bulan Ini',
            up: true,
          },
          {
            label: 'SPPG Aktif / Nonaktif',
            value: `${statsData.vendorAktif.toLocaleString('id-ID')} / ${(statsData.totalVendor - statsData.vendorAktif).toLocaleString('id-ID')}`,
            sub: 'Dapur Beroperasi & Memenuhi Izin',
            icon: CheckCircle2,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            trend: '84% Aktif',
            up: true,
          },
          {
            label: 'Tingkat Kepatuhan',
            value: '94.2%',
            sub: 'Rata-rata Kepatuhan Nasional',
            icon: Shield,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            trend: '+1.5%',
            up: true,
          },
          {
            label: 'SPPG Risiko Tinggi',
            value: `${vendors.filter(v => v.risikoSkor < 50).length} Dapur`,
            sub: 'Perlu Pengawasan & Audit',
            icon: AlertOctagon,
            color: 'text-red-600',
            bg: 'bg-red-50',
            trend: 'Perlu Inspeksi',
            up: false,
          },
          {
            label: 'Aduan Aktif',
            value: complaints.filter(c => c.status !== 'Resolved').length.toString(),
            sub: `${complaints.filter(c => c.status === 'Investigating').length} Dalam Investigasi`,
            icon: AlertTriangle,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            trend: '-3 Kasus',
            up: true,
          },
          {
            label: 'Distribusi Bermasalah',
            value: statsData.anomaliTerdeteksi.toString(),
            sub: 'Insiden Keterlambatan / Porsi',
            icon: Clock,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            trend: '2 Kasus Kritis',
            up: false,
          },
          {
            label: 'Distribusi Hari Ini',
            value: statsData.distribusiHariIni.toLocaleString('id-ID'),
            sub: `${pctRealisasi}% Target Harian Terpenuhi`,
            icon: Package,
            color: 'text-cyan-600',
            bg: 'bg-cyan-50',
            trend: '+3.2%',
            up: true,
          },
          {
            label: 'Notifikasi Risiko',
            value: `${vendors.filter(v => v.anomali.length > 0).length} Alert`,
            sub: 'Peringatan Otomatis Terdeteksi',
            icon: Bell,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            trend: 'Real-Time',
            up: false,
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all">
              <div className="flex items-start justify-between mb-3">
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
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">{kpi.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{kpi.sub}</div>
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
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">Compliance & Risk Monitoring Dashboard</h1>
              <p className="text-sm text-slate-500 mt-1">
                Matriks evaluasi kepatuhan holistik (Lisensi, SOP, Gizi, Anggaran) dan rekomendasi tindak lanjut otomatis berbasis AI.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-blue-900">Penilaian Otomatis BGN Audit Engine</span>
            </div>
          </div>

          {/* Compliance & Risk KPI Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Rata-rata Overall Score', value: '91.8 / 100', color: 'text-indigo-600', border: 'border-indigo-200', sub: 'Standar Kepatuhan Nasional' },
              { label: 'SPPG Risiko Tinggi (High Risk)', value: `${vendors.filter(v => v.risikoSkor < 50).length} SPPG`, color: 'text-red-600', border: 'border-red-200', sub: 'Perlu Eskalasi & Sidak' },
              { label: 'SPPG Risiko Sedang (Medium)', value: `${vendors.filter(v => v.risikoSkor >= 50 && v.risikoSkor < 80).length} SPPG`, color: 'text-amber-600', border: 'border-amber-200', sub: 'Dalam Pengawasan Khusus' },
              { label: 'SPPG Kepatuhan Tinggi (Low Risk)', value: `${vendors.filter(v => v.risikoSkor >= 80).length} SPPG`, color: 'text-emerald-600', border: 'border-emerald-200', sub: 'Operasional Memenuhi Standar' },
            ].map(s => (
              <div key={s.label} className={`bg-white p-5 rounded-2xl border ${s.border} shadow-sm flex flex-col justify-between`}>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{s.label}</div>
                  <div className={`text-2xl font-mono font-bold ${s.color}`}>{s.value}</div>
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-2">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Detailed Compliance & Risk Monitoring Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Matriks Compliance & Risk Monitoring SPPG</h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">Evaluasi Real-Time Parameter Kepatuhan BGN</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Entitas SPPG</th>
                    <th className="py-3.5 px-4 text-center">Overall Compliance</th>
                    <th className="py-3.5 px-4 text-center">Risk Level</th>
                    <th className="py-3.5 px-4">Breakdown Skor Kepatuhan</th>
                    <th className="py-3.5 px-4">Budget Compliance</th>
                    <th className="py-3.5 px-4">Penyebab Risiko</th>
                    <th className="py-3.5 px-4">Rekomendasi Tindak Lanjut</th>
                    <th className="py-3.5 px-4 text-center">Prioritas Inspeksi</th>
                    <th className="py-3.5 px-4">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vendors.map((v) => {
                    const esc = escalationStatus[v.id];
                    
                    // Computed Compliance Metrics
                    const licenseScore = v.statusVerifikasi === 'Terverifikasi' ? 98 : v.statusVerifikasi === 'Pending' ? 65 : 20;
                    const sopScore = Math.min(100, Math.max(10, v.risikoSkor + 2));
                    const nutritionScore = Math.min(100, Math.max(15, v.risikoSkor + 5));
                    const isBudgetOver = v.hargaSatuan > 15500;
                    const budgetScore = isBudgetOver ? 50 : 98;
                    const overallScore = Math.round((licenseScore + sopScore + nutritionScore + budgetScore) / 4);
                    
                    const riskLevel = overallScore >= 80 ? 'Low' : overallScore >= 50 ? 'Medium' : 'High';
                    const riskBadgeClass = riskLevel === 'Low' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : riskLevel === 'Medium' 
                      ? 'bg-amber-50 text-amber-700 border-amber-200' 
                      : 'bg-red-50 text-red-700 border-red-200';

                    const penyebab = v.anomali.length > 0 
                      ? v.anomali.join('; ') 
                      : isBudgetOver 
                      ? `Tarif per porsi (Rp ${v.hargaSatuan.toLocaleString('id-ID')}) melebihi batas acuan BGN` 
                      : 'Tidak ada anomali terdeteksi. Seluruh indikator dalam batas aman.';

                    const rekomendasi = overallScore < 50
                      ? 'Tangguhkan operasional dapur segera, audit forensik keuangan & sidak Satgas BGN'
                      : overallScore < 80
                      ? 'Kirim peringatan tertulis, evaluasi ulang SOP higiene sanitasi & kalibrasi alat masak'
                      : 'Pertahankan standar kualitas, lakukan pengawasan berkala bulanan';

                    const prioritas = overallScore < 50 
                      ? { label: 'P1 - Mendesak', class: 'bg-red-600 text-white' }
                      : overallScore < 80 
                      ? { label: 'P2 - Sedang', class: 'bg-amber-500 text-white' }
                      : { label: 'P3 - Rutin', class: 'bg-slate-200 text-slate-700' };

                    return (
                      <tr key={v.id} className={`hover:bg-slate-50 transition-colors ${esc === 'suspended' ? 'bg-red-50/40 opacity-75' : ''}`}>
                        {/* Entitas */}
                        <td className="py-4 px-4 font-medium">
                          <div className="font-bold text-slate-900 text-sm">{v.nama}</div>
                          <div className="text-[11px] text-slate-500">{v.kota}, {v.provinsi}</div>
                          <div className="font-mono text-[10px] text-slate-400 mt-0.5">{v.id}</div>
                        </td>

                        {/* Overall Compliance */}
                        <td className="py-4 px-4 text-center">
                          <div className="text-base font-extrabold font-mono text-slate-900">{overallScore}%</div>
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto mt-1 overflow-hidden">
                            <div 
                              className={`h-full ${overallScore >= 80 ? 'bg-emerald-500' : overallScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} 
                              style={{ width: `${overallScore}%` }}
                            />
                          </div>
                        </td>

                        {/* Risk Level */}
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-md border font-black uppercase text-[10px] tracking-wider ${riskBadgeClass}`}>
                            {riskLevel}
                          </span>
                        </td>

                        {/* Breakdown Scores */}
                        <td className="py-4 px-4 space-y-1">
                          <div className="flex items-center justify-between gap-2 text-[10px]">
                            <span className="text-slate-500 font-semibold">License Score:</span>
                            <span className="font-mono font-bold text-slate-800">{licenseScore}%</span>
                          </div>
                          <div className="flex items-center justify-between gap-2 text-[10px]">
                            <span className="text-slate-500 font-semibold">SOP Compliance:</span>
                            <span className="font-mono font-bold text-slate-800">{sopScore}%</span>
                          </div>
                          <div className="flex items-center justify-between gap-2 text-[10px]">
                            <span className="text-slate-500 font-semibold">Nutrition Compliance:</span>
                            <span className="font-mono font-bold text-slate-800">{nutritionScore}%</span>
                          </div>
                        </td>

                        {/* Budget Compliance Status */}
                        <td className="py-4 px-4">
                          {isBudgetOver ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                              <AlertTriangle className="w-3 h-3 text-red-500" /> Over Budget (Rp {v.hargaSatuan.toLocaleString('id-ID')})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Sesuai Acuan (Rp {v.hargaSatuan.toLocaleString('id-ID')})
                            </span>
                          )}
                        </td>

                        {/* Penyebab Risiko */}
                        <td className="py-4 px-4 max-w-xs text-[11px] text-slate-700 font-medium">
                          <div className="line-clamp-2" title={penyebab}>{penyebab}</div>
                        </td>

                        {/* Rekomendasi Tindak Lanjut */}
                        <td className="py-4 px-4 max-w-xs text-[11px] text-blue-900 bg-blue-50/50 p-2 rounded-lg border border-blue-100 font-medium">
                          <div className="flex items-start gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                            <span>{rekomendasi}</span>
                          </div>
                        </td>

                        {/* Prioritas Inspeksi */}
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${prioritas.class}`}>
                            {prioritas.label}
                          </span>
                        </td>

                        {/* Aksi */}
                        <td className="py-4 px-4">
                          {esc === 'suspended' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-800 border border-red-300 rounded text-[10px] font-bold uppercase">
                              <Lock className="w-3 h-3" /> Ditangguhkan
                            </span>
                          ) : (
                            <div className="flex flex-col gap-1.5">
                              <button 
                                onClick={() => setRiskBreakdownVendor(v)}
                                className="px-2.5 py-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                              >
                                Detail Audit
                              </button>
                              {overallScore < 80 && (
                                <button
                                  onClick={() => {
                                    setEscalationStatus(p => ({...p, [v.id]: 'escalated'}));
                                    showToast(`Kasus ${v.nama} telah dieskalasi ke Satgas BGN Pusat. Status operasi ditangguhkan.`, 'danger');
                                    setTimeout(() => setEscalationStatus(p => ({...p, [v.id]: 'suspended'})), 2000);
                                  }}
                                  className="px-2.5 py-1 text-[10px] font-bold text-red-600 bg-white border border-red-200 rounded hover:bg-red-600 hover:text-white transition-colors"
                                >
                                  Eskalasi
                                </button>
                              )}
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
                      <span className="text-slate-600">Perizinan & Legalitas (15%)</span>
                      <span className={riskBreakdownVendor.statusVerifikasi === 'Terverifikasi' ? 'text-emerald-600' : 'text-red-600'}>
                        {riskBreakdownVendor.statusVerifikasi === 'Terverifikasi' ? '100 / 100' : '0 / 100'}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${riskBreakdownVendor.statusVerifikasi === 'Terverifikasi' ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: riskBreakdownVendor.statusVerifikasi === 'Terverifikasi' ? '100%' : '5%'}}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1">
                      <span className="text-slate-600">Kepatuhan Gizi & Menu (25%)</span>
                      <span className={riskBreakdownVendor.risikoSkor >= 80 ? 'text-emerald-600' : 'text-amber-600'}>
                        {Math.min(100, riskBreakdownVendor.risikoSkor + 15)} / 100
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${riskBreakdownVendor.risikoSkor >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(100, riskBreakdownVendor.risikoSkor + 15)}%`}}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1">
                      <span className="text-slate-600">Standar Higienitas (Live Guard) (20%)</span>
                      <span className={riskBreakdownVendor.risikoSkor >= 80 ? 'text-emerald-600' : 'text-red-600'}>
                        {Math.max(0, riskBreakdownVendor.risikoSkor - 10)} / 100
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${riskBreakdownVendor.risikoSkor >= 80 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${Math.max(0, riskBreakdownVendor.risikoSkor - 10)}%`}}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1">
                      <span className="text-slate-600">Ketepatan Waktu Distribusi (10%)</span>
                      <span className={riskBreakdownVendor.risikoSkor >= 80 ? 'text-emerald-600' : 'text-amber-600'}>
                        {Math.max(0, riskBreakdownVendor.risikoSkor - 5)} / 100
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${riskBreakdownVendor.risikoSkor >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.max(0, riskBreakdownVendor.risikoSkor - 5)}%`}}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1">
                      <span className="text-slate-600">Sentimen Aduan Masyarakat (30%)</span>
                      <span className={riskBreakdownVendor.anomali.length === 0 ? 'text-emerald-600' : 'text-red-600'}>
                        {riskBreakdownVendor.anomali.length === 0 ? '98 / 100' : `${Math.max(10, 80 - riskBreakdownVendor.anomali.length * 15)} / 100`}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${riskBreakdownVendor.anomali.length === 0 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${riskBreakdownVendor.anomali.length === 0 ? 98 : Math.max(10, 80 - riskBreakdownVendor.anomali.length * 15)}%`}}></div></div>
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
              Verifikasi persyaratan dokumen wajib untuk penerbitan izin SPPG (Akta, NIB, NPWP, Proposal, Logo, Kontak Perwakilan, serta Lokasi/Kesiapan Bangunan). 
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
                    <th className="py-3.5 px-5">Syarat Dokumen SPPG</th>
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
                            <FileText className="w-3.5 h-3.5" /> TINJAU PERSYARATAN
                          </button>
                        </td>
                        <td className="py-3.5 px-5">
                          {!action ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setLicenseActions(p => ({...p, [v.id]: 'approved'}));
                                  setVendors(prev => prev.map(item => item.id === v.id ? { ...item, statusVerifikasi: 'Terverifikasi', statusOnboarding: 'Aktif' } : item));
                                  showToast(`BERHASIL: ${v.nama} berhasil di-approve. Kontrak aktif. Kredensial login dikirim ke WhatsApp.`, 'success');
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-emerald-600 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors"
                              ><Check className="w-3.5 h-3.5" /> Approve</button>
                              <button
                                onClick={() => {
                                  setLicenseActions(p => ({...p, [v.id]: 'rejected'}));
                                  setVendors(prev => prev.map(item => item.id === v.id ? { ...item, statusVerifikasi: 'Ditolak', statusOnboarding: 'Diblokir' } : item));
                                  showToast(`DITOLAK: ${v.nama} ditolak. Kontrak dibatalkan dan SPPG dinotifikasi.`, 'danger');
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                              ><XCircle className="w-3.5 h-3.5" /> Tolak</button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setLicenseActions(p => ({...p, [v.id]: null}));
                                setVendors(prev => prev.map(item => item.id === v.id ? { ...item, statusVerifikasi: 'Pending', statusOnboarding: 'Pending Verifikasi' } : item));
                              }}
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-2xl relative border border-slate-200 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Syarat Verifikasi Penerbitan SPPG</h3>
                    <p className="text-sm text-slate-500 font-medium">{viewLicenseVendor.nama} - {viewLicenseVendor.kota}</p>
                  </div>
                  <button onClick={() => setViewLicenseVendor(null)} className="p-2 bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg"><X className="w-5 h-5"/></button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 max-h-[350px] overflow-y-auto pr-1">
                  {[
                    { nama: 'Akta Pendirian Badan Usaha', deskripsi: 'Nomor AHU-019924.AH.01.01', status: 'Terverifikasi (AHU Kemenkumham)', icon: Building2, statusColor: 'emerald' },
                    { nama: 'Nomor Induk Berusaha (NIB)', deskripsi: 'NIB: 9120004561239', status: 'Valid (Sistem OSS RBA)', icon: FileText, statusColor: 'emerald' },
                    { nama: 'Nomor Pokok Wajib Pajak (NPWP)', deskripsi: 'NPWP: 01.234.567.8-012.000', status: 'Kring Pajak: Aktif', icon: FileText, statusColor: 'emerald' },
                    { nama: 'Proposal Kerja Sama', deskripsi: 'Rencana kerja & estimasi kapasitas porsi', status: 'Lengkap & Disetujui', icon: FileText, statusColor: 'emerald' },
                    { nama: 'Logo Mitra', deskripsi: 'Logo resmi format PNG resolusi tinggi', status: 'Tersedia', icon: ImageIcon, statusColor: 'emerald' },
                    { nama: 'NIK & Kontak Perwakilan', deskripsi: 'KTP Perwakilan & Kontak Penanggung Jawab', status: 'Tervalidasi Dukcapil', icon: User, statusColor: 'emerald' },
                    { nama: 'Lokasi & Kesiapan Bangunan', deskripsi: 'Geotagging Dapur: ' + viewLicenseVendor.lat + ', ' + viewLicenseVendor.lng, status: 'Lolos Verifikasi Fisik BGN', icon: MapPin, statusColor: 'emerald', colSpan: true },
                  ].map((doc, idx) => {
                    const IconComponent = doc.icon;
                    return (
                      <div 
                        key={idx} 
                        className={`border border-slate-200 rounded-xl p-3 flex items-start gap-3 bg-slate-50/50 hover:bg-slate-50 transition-colors ${doc.colSpan ? 'md:col-span-2' : ''}`}
                      >
                        <div className="p-2 rounded-lg shrink-0 bg-emerald-50 text-emerald-600">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-800 text-xs truncate">{doc.nama}</div>
                          <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{doc.deskripsi}</div>
                          <div className="mt-1.5 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">{doc.status}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                  <button onClick={() => setViewLicenseVendor(null)} className="px-5 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors">Tutup Peninjauan</button>
                  <button onClick={() => {
                    setLicenseActions(p => ({...p, [viewLicenseVendor.id]: 'approved'}));
                    setVendors(prev => prev.map(item => item.id === viewLicenseVendor.id ? { ...item, statusVerifikasi: 'Terverifikasi', statusOnboarding: 'Aktif' } : item));
                    showToast(`BERHASIL: Dokumen ${viewLicenseVendor.nama} disahkan. Akun aktif. Kredensial login dikirim ke WhatsApp.`, 'success');
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
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">Distribusi & Keuangan</h1>
              <p className="text-sm text-slate-500 mt-1">Pemantauan penyaluran porsi makan bergizi, alokasi anggaran, &amp; <b>Penyaluran Dana Berkala SPPG (Jadwal Senin)</b>.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white px-3 py-1.5 border border-slate-200 rounded-lg flex items-center gap-2 shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pilih Tanggal:</span>
                <input type="date" defaultValue="2026-08-12" className="text-sm font-bold text-slate-800 outline-none" />
              </div>
              <button
                onClick={() => setShowDisbursementModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <Banknote className="w-4 h-4" /> + Salurkan Dana ke SPPG (Jadwal Senin)
              </button>
            </div>
          </div>
          
          {/* Banner Informasi Penyaluran Rutin Hari Senin */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-sm border border-blue-800 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30">
                  Jadwal Penyaluran Rutin: Hari Senin
                </span>
                <span className="text-xs font-mono text-slate-300">Jadwal Berikutnya: Senin, 17 Agustus 2026</span>
              </div>
              <h3 className="text-base font-bold text-white">Sistem Penyaluran Dana Berkala Ke SPPG Tujuan</h3>
              <p className="text-xs text-blue-200">Badan Gizi Nasional (BGN) membuat dan menyalurkan alokasi dana mingguan secara otomatis langsung ke rekening bank SPPG penerima.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/10 text-right">
                <div className="text-[10px] text-blue-200 uppercase font-bold">Total Dana Disalurkan (Senin Ini)</div>
                <div className="text-lg font-mono font-bold text-emerald-300">Rp 827.250.000</div>
              </div>
              <button 
                onClick={() => setShowDisbursementModal(true)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                Proses Penyaluran Senin
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold text-red-600 uppercase tracking-wider flex items-center gap-1 mb-2"><Shield className="w-3 h-3"/> Analisis Anomali Keuangan</div>
                <div className="text-xl font-mono font-bold text-slate-900">2 Vendor</div>
              </div>
              <div className="text-[10px] text-slate-500 font-medium leading-tight mt-2">Terindikasi anomali <b className="text-red-500">mark-up</b> harga bahan baku harian.</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1 mb-2"><Activity className="w-3 h-3"/> Price Intelligence</div>
                <div className="text-xl font-mono font-bold text-slate-900">+12% vs Market</div>
              </div>
              <div className="text-[10px] text-slate-500 font-medium leading-tight mt-2">Deviasi rata-rata harga porsi wilayah operasional DKI Jakarta.</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1 mb-2"><FileText className="w-3 h-3"/> Conventional Audit Log</div>
                <div className="text-xl font-mono font-bold text-slate-900">Active Log</div>
              </div>
              <div className="text-[10px] text-slate-500 font-medium leading-tight mt-2">Log aktivitas pengguna, perubahan data, verifikasi &amp; tindak lanjut.</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between bg-blue-50/50">
              <div>
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">Total Penyerapan Harian</div>
                <div className="text-2xl font-mono font-bold text-slate-900">Rp 51,7 M</div>
              </div>
              <div className="text-[10px] text-slate-500 font-medium leading-tight mt-2">Distribusi <b className="text-blue-600">3,45 Juta</b> porsi ke sekolah hari ini.</div>
            </div>
          </div>

          {/* TABEL 1: RINCIAN PENYERAPAN ANGGARAN & DANA MINGGUAN */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Rincian Penyerapan Anggaran &amp; Rekening SPPG Tujuan</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Cari entitas..." className="pl-9 pr-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-300 w-48 outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-5">Entitas SPPG Tujuan</th>
                    <th className="py-3.5 px-5">Wilayah Operasional</th>
                    <th className="py-3.5 px-5">Porsi Harian</th>
                    <th className="py-3.5 px-5">Tarif per Porsi</th>
                    <th className="py-3.5 px-5">Estimasi Total Anggaran</th>
                    <th className="py-3.5 px-5">Aksi Penyaluran (Senin)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vendors.map(v => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-5 font-bold text-slate-800">
                        <div>{v.nama}</div>
                        <div className="text-[10px] text-slate-400 font-mono font-normal">Rek: Bank Mandiri (152009988112)</div>
                      </td>
                      <td className="py-3.5 px-5 text-slate-500">{v.kota}</td>
                      <td className="py-3.5 px-5 font-mono text-blue-700 font-bold">{v.distribusiHariIni.toLocaleString('id-ID')}</td>
                      <td className="py-3.5 px-5 font-mono">
                        Rp {v.hargaSatuan.toLocaleString('id-ID')}
                        {v.hargaSatuan > 15500 && (
                          <div className="mt-1">
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-700 border border-red-200 rounded text-[9px] font-bold uppercase flex items-center gap-1 w-max">
                              <AlertTriangle className="w-2.5 h-2.5"/> Price Anomaly
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-emerald-700 font-bold">
                        Rp {(v.distribusiHariIni * v.hargaSatuan).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-5">
                        <button
                          onClick={() => {
                            setDisbursementForm(p => ({ ...p, sppgId: v.id, porsi: v.distribusiHariIni * 5 }));
                            setShowDisbursementModal(true);
                          }}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Banknote className="w-3.5 h-3.5" /> Salurkan Dana Senin
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TABEL 2: RIWAYAT & JADWAL PENYALURAN DANA BERKALA (SENIN) */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Banknote className="w-4.5 h-4.5 text-blue-600" /> Riwayat &amp; Jadwal Penyaluran Dana Berkala (Jadwal Hari Senin)
                </h2>
                <p className="text-xs text-slate-500 mt-1">Daftar transfer dana berkala dari BGN yang terhubung langsung ke rekening SPPG tujuan.</p>
              </div>
              <button 
                onClick={() => setShowDisbursementModal(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Banknote className="w-3.5 h-3.5" /> + Salurkan Dana Baru
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">ID Transaksi BGN</th>
                    <th className="py-3.5 px-4">SPPG Tujuan &amp; Bank</th>
                    <th className="py-3.5 px-4">Jadwal Penyaluran</th>
                    <th className="py-3.5 px-4">Jumlah Porsi Mingguan</th>
                    <th className="py-3.5 px-4">Nominal Transfer (Rp)</th>
                    <th className="py-3.5 px-4">Status Transfer Kas Negara</th>
                    <th className="py-3.5 px-4">Aksi / Bukti BAP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {disbursements.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-600">{d.id}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        <div>{d.sppgNama}</div>
                        <div className="text-[10px] text-slate-400 font-mono font-normal">{d.bank}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-blue-700">{d.periode}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{d.porsi.toLocaleString('id-ID')} Porsi</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">Rp {d.nominal.toLocaleString('id-ID')}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border ${
                          d.status.includes('Disalurkan') 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button 
                          onClick={() => alert(`Bukti BAP Penyaluran Dana Kas Negara untuk ${d.sppgNama} (${d.periode}) terverifikasi sah.`)}
                          className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded font-bold text-[10px] flex items-center gap-1 shadow-sm transition-colors"
                        >
                          <FileText className="w-3 h-3 text-blue-600" /> Cetak Bukti BAP
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CONVENTIONAL AUDIT LOG TABLE */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" /> Conventional Audit Log (Sistem Log Pengawasan)
                </h2>
                <p className="text-xs text-slate-500 mt-1">Rekam jejak aktivitas pengguna, perubahan data sebelum &amp; sesudah, hasil verifikasi, &amp; tindak lanjut.</p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-600 bg-slate-200 px-3 py-1 rounded-lg">
                Log Real-Time Sistem
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Pengguna (User)</th>
                    <th className="py-3.5 px-4">Aktivitas Operasi</th>
                    <th className="py-3.5 px-4">Waktu (Timestamp)</th>
                    <th className="py-3.5 px-4">Perubahan Data</th>
                    <th className="py-3.5 px-4">Data Sebelum ➔ Sesudah</th>
                    <th className="py-3.5 px-4">Hasil Verifikasi</th>
                    <th className="py-3.5 px-4">Tindak Lanjut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    {
                      pengguna: 'Ahmad Supriyadi (Admin SPPG)',
                      aktivitas: 'Update Alokasi RAB HPP',
                      waktu: '12 Ags 2026, 08:14 WITA',
                      perubahanData: 'HPP Bahan Baku Makanan',
                      sebelumSesudah: 'Rp 9.800 ➔ Rp 10.500 / porsi',
                      hasilVerifikasi: 'Terverifikasi Sesuai Acuan BGN',
                      tindakLanjut: 'RAB Disetujui Sistem',
                      color: 'emerald'
                    },
                    {
                      pengguna: 'Sistem OCR (Automated Extraction)',
                      aktivitas: 'Audit Dokumen Legalitas SLHS',
                      waktu: '12 Ags 2026, 07:30 WITA',
                      perubahanData: 'Status Dokumen SLHS Dapur',
                      sebelumSesudah: 'Pending ➔ Valid (s.d 2031)',
                      hasilVerifikasi: 'Lolos Verifikasi OCR (99.1%)',
                      tindakLanjut: 'Sertifikat Dapur Terbit',
                      color: 'blue'
                    },
                    {
                      pengguna: 'Dra. Endang (Kepsek SDN 1)',
                      aktivitas: 'Verifikasi BAP Goods Receipt',
                      waktu: '12 Ags 2026, 07:15 WITA',
                      perubahanData: 'Porsi Diterima Fisik Sekolah',
                      sebelumSesudah: '450 Porsi ➔ 445 Porsi (Selisih 5)',
                      hasilVerifikasi: 'Terdeteksi Selisih 5 Porsi',
                      tindakLanjut: 'Eskalasi Otomatis ke Vendor',
                      color: 'amber'
                    },
                    {
                      pengguna: 'Satgas Audit BGN Region 5',
                      aktivitas: 'Koreksi Skor Kepatuhan Dapur',
                      waktu: '11 Ags 2026, 16:45 WITA',
                      perubahanData: 'SOP Compliance Score',
                      sebelumSesudah: '88% ➔ 92% (Setelah Inspeksi)',
                      hasilVerifikasi: 'SOP Sterilisasi Lolos Audit',
                      tindakLanjut: 'Perpanjangan Lisensi Dapur',
                      color: 'emerald'
                    },
                    {
                      pengguna: 'Rudi Hermawan (Logistik SPPG)',
                      aktivitas: 'Pembaruan Jam Keberangkatan',
                      waktu: '11 Ags 2026, 06:10 WITA',
                      perubahanData: 'Waktu Pengiriman Rute A',
                      sebelumSesudah: '06:30 ➔ 06:45 WITA',
                      hasilVerifikasi: 'Tepat Waktu (< 30 Menit)',
                      tindakLanjut: 'Notifikasi Sekolah Terkirim',
                      color: 'blue'
                    },
                  ].map((log, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800">{log.pengguna}</td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{log.aktivitas}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{log.waktu}</td>
                      <td className="py-3 px-4 font-medium text-slate-800">{log.perubahanData}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-700">{log.sebelumSesudah}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          log.color === 'blue' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {log.hasilVerifikasi}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{log.tindakLanjut}</td>
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
                          <div className="flex gap-1 mt-1.5">
                            <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[9px] font-bold uppercase flex items-center gap-1">
                              <AlertTriangle className="w-2.5 h-2.5"/> {r.severity === 'High' ? 'Negatif' : 'Netral'}
                            </span>
                            <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded text-[9px] font-bold uppercase">
                              Kategori: {r.kategori.includes('Keterlambatan') ? 'Logistik' : 'Mutu'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-sm font-medium text-slate-800 max-w-xs">
                          <div className="mb-1">{r.laporan}</div>
                          {r.fotoBukti && <span className="w-max text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1 mb-2"><ImageIcon className="w-3 h-3"/> Foto Terlampir</span>}
                          {r.severity === 'High' && (
                            <div className="mt-2 text-[10px] font-medium text-amber-800 bg-amber-50/80 border border-amber-200/60 p-2 rounded-lg flex items-start gap-1.5">
                              <AlertOctagon className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                              <span><b className="font-bold">AI Warning:</b> Terdeteksi 2 aduan serupa ({r.kategori}) di radius 5km dalam 24 jam terakhir. Potensi insiden massal.</span>
                            </div>
                          )}
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

      {/* MODAL PENYALURAN DANA BERKALA (JADWAL SENIN) */}
      {showDisbursementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDisbursementModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative border border-slate-200" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowDisbursementModal(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <Banknote className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30">
                  BGN Financial Transfer
                </span>
              </div>
              <h3 className="font-heading font-bold text-xl text-white">Buat &amp; Salurkan Dana Ke SPPG</h3>
              <p className="text-xs text-blue-200 mt-1">Penyaluran alokasi dana operasional berkala mingguan (Jadwal Setiap Hari Senin).</p>
            </div>
            
            <form onSubmit={handleCreateDisbursement} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Pilih Entitas SPPG Tujuan</label>
                <select 
                  value={disbursementForm.sppgId}
                  onChange={e => {
                    const selId = e.target.value;
                    const v = vendors.find(x => x.id === selId);
                    setDisbursementForm(p => ({ ...p, sppgId: selId, porsi: (v?.distribusiHariIni || 2000) * 5 }));
                  }}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.nama} — ({v.kota}) &bull; Target: {v.distribusiHariIni.toLocaleString('id-ID')} Porsi/Hari
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Jadwal Penyaluran (Hari Senin)</label>
                  <select 
                    value={disbursementForm.periode}
                    onChange={e => setDisbursementForm(p => ({ ...p, periode: e.target.value }))}
                    className="w-full text-xs font-bold border border-slate-300 rounded-xl px-3 py-2.5 bg-white outline-none focus:border-blue-500 text-blue-700"
                  >
                    <option value="Senin, 17 Agustus 2026">Senin, 17 Agustus 2026 (Minggu I)</option>
                    <option value="Senin, 24 Agustus 2026">Senin, 24 Agustus 2026 (Minggu II)</option>
                    <option value="Senin, 31 Agustus 2026">Senin, 31 Agustus 2026 (Minggu III)</option>
                    <option value="Senin, 07 September 2026">Senin, 07 September 2026 (Minggu IV)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Total Porsi Mingguan</label>
                  <input 
                    type="number" 
                    value={disbursementForm.porsi}
                    onChange={e => setDisbursementForm(p => ({ ...p, porsi: Number(e.target.value) }))}
                    className="w-full text-sm font-mono font-bold border border-slate-300 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Autocalculated Nominal Dana */}
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Kalkulasi Total Dana (Porsi x Rp 15.000)</div>
                  <div className="text-2xl font-mono font-bold text-emerald-700 mt-0.5">
                    Rp {((disbursementForm.porsi || 0) * 15000).toLocaleString('id-ID')}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                  Acuan Batas BGN ✓
                </span>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Rekening Kas Negara &amp; Bank SPPG Tujuan</label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 space-y-1">
                  <div className="font-bold text-slate-900">Bank Tujuan: Bank Mandiri (152009988112)</div>
                  <div className="text-slate-500 text-[11px]">Atas Nama: {vendors.find(v=>v.id===disbursementForm.sppgId)?.nama || 'CV. Dapur Nusantara'}</div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Catatan Instruksi BGN</label>
                <input 
                  type="text"
                  value={disbursementForm.catatan}
                  onChange={e => setDisbursementForm(p => ({ ...p, catatan: e.target.value }))}
                  placeholder="Instruksi alokasi bahan baku..."
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3 bg-slate-50 -mx-6 -mb-6 p-6">
                <button 
                  type="button"
                  onClick={() => setShowDisbursementModal(false)} 
                  className="flex-1 py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-xs shadow-sm"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Send className="w-4 h-4" /> Proses Penyaluran Senin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

