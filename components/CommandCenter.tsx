'use client';

import { useState, useEffect } from 'react';
import {
  AlertTriangle, CheckCircle2, TrendingDown, TrendingUp, Eye,
  Filter, Search, ChevronDown, ChevronUp, RefreshCw, Bell,
  MapPin, BarChart3, Activity, Shield, ChevronRight, X
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { vendors, feedItems, distribusiData, statsData, type Vendor, type FeedItem } from '@/lib/mockData';

type SortField = 'risikoSkor' | 'distribusiHariIni' | 'kapasitas';
type SortDir = 'asc' | 'desc';

const indonesiaProvinces = [
  { name: 'DKI Jakarta', cx: 350, cy: 300, count: 412, anomali: false },
  { name: 'Jawa Barat', cx: 380, cy: 320, count: 387, anomali: false },
  { name: 'Jawa Tengah', cx: 430, cy: 310, count: 298, anomali: false },
  { name: 'Jawa Timur', cx: 490, cy: 315, count: 325, anomali: true },
  { name: 'Sumatera Utara', cx: 185, cy: 155, count: 211, anomali: false },
  { name: 'Sumatera Barat', cx: 200, cy: 210, count: 134, anomali: false },
  { name: 'Sulawesi Selatan', cx: 585, cy: 315, count: 178, anomali: true },
  { name: 'Kalimantan Timur', cx: 555, cy: 230, count: 89, anomali: true },
  { name: 'DI Yogyakarta', cx: 435, cy: 325, count: 95, anomali: false },
  { name: 'Bali', cx: 510, cy: 345, count: 67, anomali: false },
];

function RiskBadge({ skor }: { skor: number }) {
  if (skor >= 80) return <span className="text-xs px-2.5 py-1 rounded-full bg-green-400/10 text-green-400 font-semibold">Rendah ({skor})</span>;
  if (skor >= 50) return <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-400/10 text-yellow-400 font-semibold">Sedang ({skor})</span>;
  return <span className="text-xs px-2.5 py-1 rounded-full bg-red-400/10 text-red-400 font-semibold">Tinggi ({skor})</span>;
}

function StatusBadge({ status }: { status: Vendor['statusVerifikasi'] }) {
  const map = {
    Terverifikasi: 'bg-green-400/10 text-green-400',
    Pending: 'bg-yellow-400/10 text-yellow-400',
    Ditolak: 'bg-red-400/10 text-red-400',
  };
  return <span className={`text-xs px-2 py-1 rounded-full ${map[status]}`}>{status}</span>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card p-3 text-xs border border-blue-700/40">
        <div className="text-white font-semibold mb-1">{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} style={{ color: p.color }}>{p.name}: {p.value.toLocaleString('id-ID')}</div>
        ))}
      </div>
    );
  }
  return null;
};

export default function CommandCenter() {
  const [sortField, setSortField] = useState<SortField>('risikoSkor');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'semua' | 'anomali' | 'aman'>('semua');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [feed, setFeed] = useState<FeedItem[]>(feedItems);
  const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleTimeString('id-ID'));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedMap, setExpandedMap] = useState(false);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

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
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 fade-in">
          <div>
            <div className="flex items-center gap-2 text-sm text-blue-400 mb-2">
              <BarChart3 className="w-4 h-4" />
              <span>Command Center</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white">Dashboard Regulator</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Command Center MBG</h1>
            <p className="text-blue-300 text-sm">Pemantauan nasional program Makan Bergizi Gratis secara real-time</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-blue-500 font-mono">
              Diperbarui: {lastRefresh}
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-blue-300 border border-blue-800/50 hover:bg-blue-900/30 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <div className="relative">
              <Bell className="w-5 h-5 text-blue-400" />
              {anomaliCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                  {anomaliCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Distribusi Hari Ini',
              value: statsData.distribusiHariIni.toLocaleString('id-ID'),
              sub: `${pctRealisasi}% dari target ${statsData.targetHarian.toLocaleString('id-ID')}`,
              icon: '🍱',
              color: '#3b82f6',
              trend: '+3.2%',
              up: true,
            },
            {
              label: 'Nilai Ekonomi',
              value: statsData.nilaiEkonomi,
              sub: 'Perputaran uang vendor hari ini',
              icon: '💰',
              color: '#10b981',
              trend: '+2.1%',
              up: true,
            },
            {
              label: 'Anomali Terdeteksi',
              value: statsData.anomaliTerdeteksi.toString(),
              sub: `${anomaliCount} vendor bermasalah`,
              icon: '⚠️',
              color: '#ef4444',
              trend: '+2',
              up: false,
            },
            {
              label: 'Verifikasi Pending',
              value: statsData.verifikasiPending.toString(),
              sub: `${statsData.vendorAktif} dari ${statsData.totalVendor} vendor aktif`,
              icon: '📋',
              color: '#f59e0b',
              trend: '-12',
              up: true,
            },
          ].map((kpi) => (
            <div key={kpi.label} className="glass-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="text-2xl">{kpi.icon}</div>
                <div className={`flex items-center gap-1 text-xs font-medium ${kpi.up ? 'text-green-400' : 'text-red-400'}`}>
                  {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.trend}
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1" style={{ color: kpi.color }}>{kpi.value}</div>
              <div className="text-xs text-blue-400 mb-2">{kpi.label}</div>
              <div className="text-xs text-blue-600">{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Line chart */}
          <div className="lg:col-span-2 glass-card p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              Tren Distribusi 8 Hari Terakhir
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={distribusiData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.1)" />
                <XAxis dataKey="tanggal" tick={{ fill: '#60a5fa', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#60a5fa', fontSize: 11 }} tickLine={false} axisLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#60a5fa' }} />
                <Line type="monotone" dataKey="target" name="Target" stroke="#1d4ed8" strokeDasharray="4 4" dot={false} />
                <Line type="monotone" dataKey="realisasi" name="Realisasi" stroke="#10b981" strokeWidth={2}
                  dot={{ fill: '#10b981', r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar chart anomali */}
          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              Anomali per Hari
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={distribusiData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.1)" />
                <XAxis dataKey="tanggal" tick={{ fill: '#60a5fa', fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#60a5fa', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="anomali" name="Anomali" fill="#ef4444" radius={[3, 3, 0, 0]} fillOpacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Map + Feed */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Indonesia Map */}
          <div className={`glass-card p-5 ${expandedMap ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                Peta Sebaran Distribusi Nasional
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Aman</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Anomali</span>
                </div>
                <button onClick={() => setExpandedMap(!expandedMap)} className="text-xs text-blue-400 hover:text-blue-200 transition-colors">
                  {expandedMap ? 'Perkecil' : 'Perbesar'}
                </button>
              </div>
            </div>

            {/* SVG Map */}
            <div className="relative rounded-xl overflow-hidden" style={{ background: 'rgba(4, 13, 40, 0.8)', height: expandedMap ? 360 : 240 }}>
              <svg viewBox="0 0 800 460" className="w-full h-full" style={{ opacity: 0.9 }}>
                {/* Simplified Indonesia outline paths */}
                <g fill="rgba(14, 30, 70, 0.8)" stroke="rgba(59,130,246,0.3)" strokeWidth="1">
                  {/* Sumatera */}
                  <ellipse cx="200" cy="200" rx="85" ry="60" transform="rotate(-25 200 200)" />
                  {/* Jawa */}
                  <ellipse cx="410" cy="318" rx="120" ry="22" transform="rotate(-5 410 318)" />
                  {/* Kalimantan */}
                  <ellipse cx="530" cy="215" rx="90" ry="75" />
                  {/* Sulawesi */}
                  <ellipse cx="600" cy="280" rx="45" ry="70" transform="rotate(15 600 280)" />
                  {/* Papua */}
                  <ellipse cx="720" cy="290" rx="70" ry="50" />
                  {/* Bali */}
                  <ellipse cx="510" cy="345" rx="18" ry="12" />
                  {/* NTT/NTB */}
                  <ellipse cx="560" cy="355" rx="30" ry="12" />
                  {/* Maluku */}
                  <ellipse cx="660" cy="250" rx="25" ry="35" transform="rotate(10 660 250)" />
                </g>

                {/* Province dots */}
                {indonesiaProvinces.map((prov) => (
                  <g key={prov.name}
                    onMouseEnter={() => setHoveredProvince(prov.name)}
                    onMouseLeave={() => setHoveredProvince(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Glow ring */}
                    <circle
                      cx={prov.cx} cy={prov.cy}
                      r={prov.anomali ? 14 : 12}
                      fill={prov.anomali ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)'}
                    />
                    {/* Main dot */}
                    <circle
                      cx={prov.cx} cy={prov.cy} r={6}
                      fill={prov.anomali ? '#ef4444' : '#10b981'}
                    />
                    {/* Count label */}
                    <text x={prov.cx} y={prov.cy + 22} textAnchor="middle"
                      fill={prov.anomali ? '#fca5a5' : '#6ee7b7'} fontSize="9">
                      {prov.count}
                    </text>
                  </g>
                ))}

                {/* Tooltip */}
                {hoveredProvince && (() => {
                  const prov = indonesiaProvinces.find(p => p.name === hoveredProvince);
                  if (!prov) return null;
                  return (
                    <g>
                      <rect x={prov.cx - 55} y={prov.cy - 42} width="110" height="32" rx="4"
                        fill="rgba(10,22,50,0.95)" stroke="rgba(59,130,246,0.4)" strokeWidth="1" />
                      <text x={prov.cx} y={prov.cy - 28} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
                        {prov.name}
                      </text>
                      <text x={prov.cx} y={prov.cy - 16} textAnchor="middle"
                        fill={prov.anomali ? '#fca5a5' : '#6ee7b7'} fontSize="8">
                        {prov.count} vendor · {prov.anomali ? '⚠ Anomali' : '✓ Aman'}
                      </text>
                    </g>
                  );
                })()}

                {/* Sea label */}
                <text x="150" y="280" fill="rgba(59,130,246,0.3)" fontSize="11" fontStyle="italic">Samudra Hindia</text>
                <text x="450" y="180" fill="rgba(59,130,246,0.3)" fontSize="11" fontStyle="italic">Laut Jawa</text>
              </svg>
            </div>
          </div>

          {/* Real-time Feed */}
          {!expandedMap && (
            <div className="glass-card p-5 flex flex-col">
              <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                Feed Real-time
                <span className="ml-auto flex items-center gap-1 text-xs text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
                  LIVE
                </span>
              </h2>
              <div className="space-y-3 flex-1 overflow-y-auto max-h-60">
                {feed.map((item) => (
                  <div key={item.id} className={`p-3 rounded-lg border text-xs fade-in ${
                    item.tipe === 'anomali' ? 'border-red-700/30 bg-red-900/10' :
                    item.tipe === 'warning' ? 'border-yellow-700/30 bg-yellow-900/10' :
                    'border-green-700/20 bg-green-900/10'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-semibold ${
                        item.tipe === 'anomali' ? 'text-red-400' :
                        item.tipe === 'warning' ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {item.tipe === 'anomali' ? '⚠ ANOMALI' : item.tipe === 'warning' ? '⚡ PERINGATAN' : '✓ AMAN'}
                      </span>
                      <span className="font-mono text-blue-500">{item.waktu}</span>
                    </div>
                    <div className="text-white font-medium mb-0.5 truncate">{item.vendor}</div>
                    <div className="text-blue-400">{item.lokasi}</div>
                    <div className="text-blue-300 mt-1 leading-relaxed">{item.pesan}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Vendor Risk Scoring Table */}
        <div className="glass-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              Vendor Risk Scoring
            </h2>
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-500" />
                <input
                  type="text"
                  placeholder="Cari vendor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-2 text-xs rounded-lg border border-blue-800/50 text-white placeholder-blue-700 outline-none focus:border-blue-500 transition-colors"
                  style={{ background: 'rgba(10, 22, 48, 0.8)', width: '160px' }}
                />
              </div>
              {/* Filter */}
              <div className="flex rounded-lg border border-blue-800/50 overflow-hidden text-xs">
                {(['semua', 'anomali', 'aman'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-2 capitalize transition-colors ${
                      filter === f ? 'bg-blue-600 text-white' : 'text-blue-400 hover:bg-blue-900/30'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-blue-900/50">
                  {[
                    { label: 'ID', field: null },
                    { label: 'Nama Vendor', field: null },
                    { label: 'Lokasi', field: null },
                    { label: 'Skor Risiko ↕', field: 'risikoSkor' as SortField },
                    { label: 'Distribusi Hari Ini ↕', field: 'distribusiHariIni' as SortField },
                    { label: 'Status', field: null },
                    { label: 'Anomali', field: null },
                    { label: 'Aksi', field: null },
                  ].map(({ label, field }) => (
                    <th
                      key={label}
                      className={`text-left py-3 px-3 text-xs font-semibold text-blue-500 uppercase tracking-wider ${field ? 'cursor-pointer hover:text-blue-300 transition-colors' : ''}`}
                      onClick={() => field && toggleSort(field)}
                    >
                      <div className="flex items-center gap-1">
                        {label}
                        {field && sortField === field && (
                          sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedVendors.map((vendor) => (
                  <tr
                    key={vendor.id}
                    onClick={() => setSelectedVendor(selectedVendor?.id === vendor.id ? null : vendor)}
                    className={`border-b border-blue-900/20 cursor-pointer transition-colors ${
                      selectedVendor?.id === vendor.id ? 'bg-blue-900/30' : 'hover:bg-blue-900/10'
                    }`}
                  >
                    <td className="py-3 px-3 font-mono text-blue-500 text-xs">{vendor.id}</td>
                    <td className="py-3 px-3">
                      <div className="text-white font-medium text-sm">{vendor.nama}</div>
                      <div className="text-xs text-blue-500 font-mono">{vendor.lastReport}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-blue-200 text-sm">{vendor.kota}</div>
                      <div className="text-xs text-blue-500">{vendor.provinsi}</div>
                    </td>
                    <td className="py-3 px-3">
                      <RiskBadge skor={vendor.risikoSkor} />
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-white font-semibold">{vendor.distribusiHariIni.toLocaleString('id-ID')}</div>
                      <div className="mt-1 w-24 h-1.5 rounded-full bg-blue-900">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${Math.min((vendor.distribusiHariIni / vendor.kapasitas) * 100, 100)}%` }} />
                      </div>
                    </td>
                    <td className="py-3 px-3"><StatusBadge status={vendor.statusVerifikasi} /></td>
                    <td className="py-3 px-3">
                      {vendor.anomali.length === 0 ? (
                        <span className="flex items-center gap-1 text-xs text-green-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Bersih
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-red-400">
                          <AlertTriangle className="w-3.5 h-3.5" /> {vendor.anomali.length} anomali
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVendor(selectedVendor?.id === vendor.id ? null : vendor);
                        }}
                        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Selected vendor detail Modal */}
          {selectedVendor && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm fade-in">
              <div className="glass-card w-full max-w-2xl p-6 relative slide-in border border-blue-700/50" style={{ background: 'rgba(8, 20, 46, 0.95)' }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{selectedVendor.nama}</h3>
                    <p className="text-sm text-blue-400">{selectedVendor.kota}, {selectedVendor.provinsi} · <span className="font-mono">{selectedVendor.id}</span></p>
                  </div>
                  <button onClick={() => setSelectedVendor(null)} className="text-blue-400 hover:text-blue-200 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                  <div className="p-3 bg-blue-900/20 rounded-lg">
                    <div className="text-xs text-blue-500 mb-1">Kapasitas Harian</div>
                    <div className="text-white font-semibold">{selectedVendor.kapasitas.toLocaleString('id-ID')} porsi</div>
                  </div>
                  <div className="p-3 bg-blue-900/20 rounded-lg">
                    <div className="text-xs text-blue-500 mb-1">Harga Satuan</div>
                    <div className={`font-semibold ${selectedVendor.hargaSatuan > 18000 ? 'text-red-400' : 'text-white'}`}>
                      Rp {selectedVendor.hargaSatuan.toLocaleString('id-ID')}
                      {selectedVendor.hargaSatuan > 18000 && <span className="block mt-0.5 text-xs text-red-400 font-normal">⚠ Melebihi standar (Rp15k)</span>}
                    </div>
                  </div>
                  <div className="p-3 bg-blue-900/20 rounded-lg">
                    <div className="text-xs text-blue-500 mb-1">Koordinat GPS</div>
                    <div className="font-mono text-xs text-green-400">{selectedVendor.lat}, {selectedVendor.lng}</div>
                  </div>
                </div>
                {selectedVendor.anomali.length > 0 ? (
                  <div>
                    <div className="text-xs text-red-400 font-semibold mb-2">⚠ Otoritas Deteksi Anomali:</div>
                    <div className="space-y-1.5">
                      {selectedVendor.anomali.map((a, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-red-300 bg-red-900/20 px-3 py-2 rounded-lg border border-red-900/50">
                          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                          {a}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-green-400 bg-green-900/20 px-3 py-2 rounded-lg border border-green-900/50">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    Vendor ini bersih dari catatan anomali.
                  </div>
                )}
                
                <div className="mt-6 flex justify-end">
                  <button onClick={() => setSelectedVendor(null)} className="px-5 py-2.5 rounded-xl text-white font-semibold transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #1d4ed8, #0ea5e9)' }}>
                    Tutup Detail
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
