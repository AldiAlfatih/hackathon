'use client';

import { Shield, ArrowRight, Zap, Building2, Server, Database, CheckCircle, AlertTriangle, Users, BookOpen, Utensils, QrCode, X, Camera, Loader2, CheckSquare, Search, ImagePlus, ImageIcon, MapPin, AlertOctagon, Clock } from 'lucide-react';
import type { ActiveView, GlobalComplaint } from './KawalApp';
import { useState, useEffect } from 'react';
import { vendors } from '@/lib/mockData';
import IndonesiaMap from './IndonesiaMap';

interface LandingPageProps {
  setActiveView: (view: ActiveView) => void;
  addComplaint: (complaint: Omit<GlobalComplaint, 'id' | 'status' | 'tanggal' | 'sekolah'> & { sekolah?: string }) => void;
}

export default function LandingPage({ setActiveView, addComplaint }: LandingPageProps) {
  const kpis = [
    { label: 'Total SPPG Aktif', value: '4.821', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Sekolah Terlayani', value: '12.450', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Porsi Tersalurkan', value: '8.2M+', icon: Utensils, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Kepatuhan Gizi (AI)', value: '94.2%', icon: CheckCircle, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Keluhan Diselesaikan', value: '1.205', icon: Shield, color: 'text-sky-600', bg: 'bg-sky-50' },
  ];

  const [showQrModal, setShowQrModal] = useState(false);
  const [viewMenuImage, setViewMenuImage] = useState<string | null>(null);
  const [qrState, setQrState] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportData, setReportData] = useState({ kategori: 'Kualitas Makanan', isi: '', fotoBukti: false, severity: 'Medium' as 'Low'|'Medium'|'High' });
  const [sppgSearch, setSppgSearch] = useState('');
  const [showSppgReportForm, setShowSppgReportForm] = useState(false);
  const [sppgReportData, setSppgReportData] = useState({ namaSppg: '', indikasi: 'Tidak Pernah Ada Aktivitas Masak', deskripsi: '', fotoLokasi: false });

  const handleScanQr = () => {
    setShowQrModal(true);
    setQrState('scanning');
    setShowReportForm(false);
    setTimeout(() => setQrState('done'), 2000); // Simulate scanning delay
  };

  const submitReport = () => {
    if (!reportData.isi.trim()) return;
    addComplaint({
      severity: reportData.severity,
      laporan: reportData.isi,
      kategori: reportData.kategori,
      fotoBukti: reportData.fotoBukti,
      sumber: 'Publik'
    });
    alert('Terima kasih! Laporan Anda telah berhasil dikirim ke BGN Command Center.');
    setShowQrModal(false);
  };

  return (
    <div className="h-full flex flex-col font-sans bg-slate-50 overflow-y-auto">
      {/* Hero Section */}
      <div id="about" className="relative bg-white border-b border-slate-200 py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-blue-50/30" style={{
          backgroundImage: `radial-gradient(var(--color-border-subtle) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}></div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-sm font-semibold text-blue-700 mb-8 shadow-sm">
            <Zap className="w-4 h-4" />
            PROTOTIPE PORTAL TRANSPARANSI NASIONAL (HACKATHON)
          </div>
          
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
            Pengawasan Publik Terpadu<br/>
            <span className="text-blue-600">Makan Bergizi Gratis</span>
          </h1>
          
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-10">
            Platform digital terintegrasi untuk pemantauan program Makan Bergizi Gratis (MBG). 
            Melibatkan kecerdasan buatan untuk verifikasi gizi dan partisipasi publik untuk transparansi pengawasan.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button 
              onClick={() => setActiveView('login')}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              Login Sistem Internal <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={handleScanQr} className="px-8 py-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm">
              <QrCode className="w-5 h-5" /> Cek Status QR Makanan
            </button>
            <button onClick={() => {
              const el = document.getElementById('transparansi-anggaran');
              el?.scrollIntoView({ behavior: 'smooth' });
            }} className="px-8 py-3.5 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm">
              <Search className="w-5 h-5" /> Transparansi Anggaran
            </button>
          </div>
        </div>
      </div>

      {/* Public Search Main Section */}
      <div id="transparansi-anggaran" className="max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
          <div className="w-full p-8 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-3xl font-heading font-bold text-slate-900 mb-2">Transparansi Anggaran MBG</h3>
              <p className="text-slate-600 font-medium">Pencarian terbuka untuk data penyaluran dan anggaran program Makan Bergizi Gratis.</p>
            </div>
            
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
              <input type="text" defaultValue="SDN 01 Cilandak" className="w-full pl-12 pr-4 py-4 text-lg bg-white border border-slate-300 rounded-xl font-bold text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 shadow-sm transition-all" placeholder="Cari sekolah..." />
            </div>
          </div>
          
          <div className="w-full p-8">
            
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8 flex items-center justify-between">
              <div>
                <div className="font-bold text-emerald-900 text-2xl">SDN 01 Cilandak</div>
                <div className="text-sm font-bold text-emerald-700 mt-1">Kel. Cilandak Barat, Jakarta Selatan</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Sumber Anggaran</div>
                <div className="inline-block px-3 py-1 bg-emerald-200 text-emerald-800 text-sm font-bold rounded-lg">APBN 2026</div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Penyedia (SPPG)</div>
                  <div className="text-base font-bold text-slate-900">CV. Dapur Nusantara</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Porsi Dikirim</div>
                  <div className="text-2xl font-bold text-blue-700">450 <span className="text-sm font-medium text-slate-500">Porsi</span></div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Tarif per Porsi</div>
                  <div className="text-xl font-bold text-slate-900">Rp 15.000</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Total Anggaran</div>
                  <div className="text-xl font-bold text-emerald-700">Rp 6.750.000</div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                  <div className="text-sm text-slate-800 font-bold uppercase tracking-wider flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-slate-500" />
                    Menu Disajikan Hari Ini
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                      Waktu Distribusi: 07:15 WIB
                    </div>
                    <button onClick={() => setViewMenuImage('Hari Ini')} className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 flex items-center gap-1 transition-colors">
                      <ImageIcon className="w-3.5 h-3.5" /> Lihat Foto Menu
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {['Nasi Putih', 'Telur Dadar', 'Sayur Sop', 'Buah Pisang', 'Susu UHT'].map(m => (
                    <span key={m} className="px-4 py-2 bg-white text-blue-700 border border-blue-100 shadow-sm text-sm font-bold rounded-xl">{m}</span>
                  ))}
                </div>
              </div>
              
              <div className="pt-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-slate-800 font-bold uppercase tracking-wider">Riwayat Distribusi & Menu</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Filter Tanggal:</span>
                    <input type="date" defaultValue="2026-08-12" className="text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="relative pl-6 border-l-4 border-blue-500 py-2">
                    <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[9px] top-4 border-2 border-white"></div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-sm font-bold text-slate-900">11 Ags 2026</div>
                        <div className="text-xs text-slate-500 font-medium">CV. Dapur Nusantara</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-blue-700">450 Porsi</div>
                        <div className="text-xs font-bold text-emerald-600">Rp 6.750.000 <span className="text-slate-400 font-normal">(Rp 15.000/porsi)</span></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="text-sm text-slate-700">
                        Nasi, Ayam Goreng, Sayur Bayam, Jeruk, Susu UHT
                      </div>
                      <button onClick={() => setViewMenuImage('11 Ags 2026')} className="shrink-0 ml-4 text-[11px] font-bold text-slate-600 hover:text-blue-600 bg-white hover:bg-blue-50 border border-slate-200 px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors">
                        <ImageIcon className="w-3 h-3" /> Foto
                      </button>
                    </div>
                  </div>
                  
                  <div className="relative pl-6 border-l-4 border-slate-300 py-2 opacity-80 hover:opacity-100 transition-opacity">
                    <div className="absolute w-3 h-3 bg-slate-300 rounded-full -left-[9px] top-4 border-2 border-white"></div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-sm font-bold text-slate-700">10 Ags 2026</div>
                        <div className="text-xs text-slate-500 font-medium">CV. Dapur Nusantara</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-600">450 Porsi</div>
                        <div className="text-xs font-bold text-emerald-600">Rp 6.750.000 <span className="text-slate-400 font-normal">(Rp 15.000/porsi)</span></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="text-sm text-slate-600">
                        Nasi, Ikan Bakar, Tumis Kangkung, Melon, Susu UHT
                      </div>
                      <button onClick={() => setViewMenuImage('10 Ags 2026')} className="shrink-0 ml-4 text-[11px] font-bold text-slate-500 hover:text-blue-600 bg-white hover:bg-blue-50 border border-slate-200 px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors">
                        <ImageIcon className="w-3 h-3" /> Foto
                      </button>
                    </div>
                  </div>
                  
                  <div className="relative pl-6 border-l-4 border-slate-300 py-2 opacity-80 hover:opacity-100 transition-opacity">
                    <div className="absolute w-3 h-3 bg-slate-300 rounded-full -left-[9px] top-4 border-2 border-white"></div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-sm font-bold text-slate-700">09 Ags 2026</div>
                        <div className="text-xs text-slate-500 font-medium">CV. Dapur Nusantara</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-600">448 Porsi</div>
                        <div className="text-xs font-bold text-emerald-600">Rp 6.720.000 <span className="text-slate-400 font-normal">(Rp 15.000/porsi)</span></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="text-sm text-slate-600">
                        Nasi, Daging Teriyaki, Capcay, Apel, Susu UHT
                      </div>
                      <button onClick={() => setViewMenuImage('09 Ags 2026')} className="shrink-0 ml-4 text-[11px] font-bold text-slate-500 hover:text-blue-600 bg-white hover:bg-blue-50 border border-slate-200 px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors">
                        <ImageIcon className="w-3 h-3" /> Foto
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Image Modal */}
      {viewMenuImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewMenuImage(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900">Bukti Foto Sajian Makanan</h3>
              <button onClick={() => setViewMenuImage(null)} className="text-slate-400 hover:text-slate-600 p-1 bg-slate-200 hover:bg-slate-300 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="w-full h-64 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 mb-4">
                <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                <span className="font-bold text-sm">Foto Menu ({viewMenuImage})</span>
                <span className="text-xs mt-1">Sumber: Laporan SPPG (Terkonfirmasi BGN)</span>
              </div>
              <p className="text-center text-sm font-medium text-slate-500">
                Menu ini telah diaudit dan dipastikan memenuhi standar gizi (Lauk Protein, Nasi, Sayur, Buah, & Susu).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DIREKTORI SPPG PUBLIK SECTION */}
      <div id="cek-sppg" className="max-w-7xl mx-auto px-6 py-24 w-full border-t border-slate-200">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-4 border border-red-200">
            <Shield className="w-4 h-4" /> Pengawasan Sosial
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-black text-slate-900 mb-4 tracking-tight">Cek & Laporkan SPPG Fiktif</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">Bantu BGN mengawasi penyaluran dana. Jika ada SPPG di wilayah Anda yang terdaftar aktif namun <strong>tidak pernah ada aktivitas fisik</strong>, segera laporkan!</p>
        </div>

        <div className="max-w-6xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
          <div className="h-[400px] w-full border-b border-slate-200 relative bg-slate-50">
            <IndonesiaMap />
            <div className="absolute bottom-4 right-4 z-[999] bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-slate-200 text-xs text-slate-600 font-bold max-w-[200px]">
              Peta Sebaran Nasional SPPG. Titik merah menandakan SPPG dengan indikasi anomali.
            </div>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-slate-50 p-8 border-r border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">Cari SPPG</h3>
              <p className="text-sm text-slate-500 mb-6">Cari berdasarkan nama vendor, kota, atau provinsi tempat tinggal Anda.</p>
              <div className="relative mb-6">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Cari Kota / Nama SPPG..." 
                  value={sppgSearch}
                  onChange={e => setSppgSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-sm"
                />
              </div>
              <button 
                onClick={() => setShowSppgReportForm(true)}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <AlertTriangle className="w-4 h-4" /> Form Laporan Warga
              </button>
            </div>
            <div className="md:w-2/3 bg-white p-0">
              <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-100">
              {vendors
                .filter(v => v.nama.toLowerCase().includes(sppgSearch.toLowerCase()) || v.kota.toLowerCase().includes(sppgSearch.toLowerCase()) || v.provinsi.toLowerCase().includes(sppgSearch.toLowerCase()))
                .map(v => (
                <div key={v.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">{v.nama}</h4>
                    <div className="text-xs font-bold text-slate-500 flex items-center gap-1 mt-1 mb-2">
                      <MapPin className="w-3.5 h-3.5" /> {v.kota}, {v.provinsi}
                    </div>
                    <div className="text-[11px] text-slate-500">Kapasitas: {v.kapasitas.toLocaleString('id-ID')} Porsi/Hari</div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    {v.statusOnboarding === 'Aktif' ? (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" /> Beroperasi Aktif
                      </span>
                    ) : v.statusOnboarding === 'Pending Verifikasi' ? (
                      <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Dalam Tinjauan BGN
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-bold flex items-center gap-1.5">
                        <AlertOctagon className="w-3.5 h-3.5" /> Indikasi Ghoib
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* KPI Grid Section */}
      <div id="stats" className="max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-heading font-bold text-slate-900 mb-3">Statistik Nasional Terkini</h2>
          <p className="text-slate-600">Pemantauan real-time performa distribusi dan kualitas gizi di seluruh Indonesia.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${kpi.bg}`}>
                  <Icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <div className="text-3xl font-mono font-bold text-slate-900 mb-1">{kpi.value}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-12 text-center text-sm text-slate-400 font-bold tracking-widest uppercase">
          &copy; 2026 KAWAL MBG &bull; BADAN GIZI NASIONAL RI
        </div>
      </div>

      {/* SPPG Report Modal */}
      {showSppgReportForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative">
            <button onClick={() => setShowSppgReportForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
            <div className="p-6 border-b border-slate-100 bg-red-50">
              <div className="flex items-center gap-3 text-red-700 mb-2">
                <AlertOctagon className="w-6 h-6" />
                <h3 className="font-heading font-bold text-xl">Lapor Indikasi SPPG Fiktif</h3>
              </div>
              <p className="text-sm text-red-600/80">Laporan Anda akan langsung masuk ke Satgas Investigasi BGN pusat secara anonim.</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Nama / Alamat SPPG yang Dicurigai</label>
                <input 
                  type="text" 
                  value={sppgReportData.namaSppg}
                  onChange={e => setSppgReportData(p => ({...p, namaSppg: e.target.value}))}
                  placeholder="Contoh: CV Dapur Sehat di Jl. Merdeka No. 1"
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2.5 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Indikasi Pelanggaran</label>
                <select 
                  value={sppgReportData.indikasi}
                  onChange={e => setSppgReportData(p => ({...p, indikasi: e.target.value}))}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2.5 focus:border-red-500 outline-none transition-all bg-white"
                >
                  <option value="Tidak Pernah Ada Aktivitas Masak">Tidak ada aktivitas memasak sama sekali</option>
                  <option value="Alamat Palsu / Kosong">Alamat berupa ruko kosong / fiktif</option>
                  <option value="Dapur Sangat Kecil / Tidak Wajar">Kapasitas dapur terlalu kecil untuk ribuan porsi</option>
                  <option value="Lainnya">Pelanggaran berat lainnya</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Keterangan Tambahan (Opsional)</label>
                <textarea 
                  value={sppgReportData.deskripsi}
                  onChange={e => setSppgReportData(p => ({...p, deskripsi: e.target.value}))}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2.5 h-20 resize-none focus:border-red-500 outline-none transition-all"
                  placeholder="Ceritakan mengapa Anda curiga..."
                />
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Foto Lokasi (Sangat Dianjurkan)</label>
                <div 
                  onClick={() => setSppgReportData(p => ({...p, fotoLokasi: !p.fotoLokasi}))}
                  className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors ${sppgReportData.fotoLokasi ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}
                >
                  {sppgReportData.fotoLokasi ? (
                    <>
                      <CheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
                      <div className="text-sm font-bold text-emerald-700">Bukti Foto Dilampirkan</div>
                    </>
                  ) : (
                    <>
                      <Camera className="w-8 h-8 text-slate-400 mb-2" />
                      <div className="text-sm font-bold text-slate-700">Lampirkan Foto Lokasi / Bangunan</div>
                      <div className="text-xs text-slate-500 text-center mt-1">Sertakan foto ruko kosong atau kondisi lapangan yang mencurigakan</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3 bg-slate-50">
              <button onClick={() => setShowSppgReportForm(false)} className="flex-1 py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">Batal</button>
              <button 
                onClick={() => {
                  alert('Laporan berhasil dikirim ke Satgas Investigasi BGN secara anonim.');
                  setShowSppgReportForm(false);
                  setSppgReportData({ namaSppg: '', indikasi: 'Tidak Pernah Ada Aktivitas Masak', deskripsi: '', fotoLokasi: false });
                }} 
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-sm"
              >
                Kirim Laporan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
            <button onClick={() => { setShowQrModal(false); setQrState('idle'); setShowReportForm(false); }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">{showReportForm ? 'Lapor Masalah Makanan' : 'Scan QR Makanan'}</h3>
              <p className="text-sm text-slate-500">{showReportForm ? 'Isi form di bawah untuk melaporkan keluhan ke BGN' : 'Arahkan kamera ke kode QR pada kemasan'}</p>
            </div>
            
            {qrState === 'scanning' ? (
              <div className="p-12 flex flex-col items-center justify-center bg-slate-50">
                <div className="relative mb-6">
                  <div className="w-48 h-48 border-4 border-blue-200 rounded-2xl flex items-center justify-center">
                    <div className="w-full h-1 bg-blue-500 absolute top-1/2 left-0 -translate-y-1/2 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[ping_1.5s_ease-in-out_infinite]"></div>
                    <Camera className="w-12 h-12 text-blue-300 opacity-50" />
                  </div>
                </div>
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin mb-2" />
                <div className="text-sm font-bold text-slate-600 uppercase tracking-wider">Membaca QR...</div>
              </div>
            ) : qrState === 'done' ? (
              <div className="p-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-4 text-center">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                  <div className="font-bold text-emerald-800 text-lg">Makanan Valid & Aman</div>
                  <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Telah Melewati Verifikasi BGN</div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Penyedia (SPPG)</div>
                      <div className="text-sm font-bold text-slate-900">CV. Dapur Nusantara</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Sekolah Tujuan</div>
                      <div className="text-sm font-bold text-slate-900">SDN 01 Cilandak</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Waktu Distribusi</div>
                      <div className="text-sm font-bold text-slate-900">12 Ags 2026, 07:15</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Status Higiene & Halal</div>
                      <div className="text-sm font-bold text-emerald-600 flex items-center gap-1"><CheckSquare className="w-4 h-4"/> Valid</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Porsi Dikirim</div>
                      <div className="text-sm font-bold text-blue-700">450 Porsi</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Estimasi Anggaran Negara</div>
                      <div className="text-sm font-bold text-slate-900">Rp 6.750.000 <span className="text-[10px] font-normal text-slate-500">(Rp 15.000/porsi)</span></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Menu Hari Ini (12 Ags 2026)</div>
                    <div className="flex flex-wrap gap-2">
                      {['Nasi Putih', 'Telur Dadar', 'Sayur Sop', 'Buah Pisang', 'Susu UHT'].map(m => (
                        <span key={m} className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold rounded-lg">{m}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Riwayat Menu 3 Hari Terakhir</div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-xs">
                        <div className="w-16 font-bold text-slate-700 shrink-0">11 Ags:</div>
                        <div className="text-slate-600">Nasi, Ayam Goreng, Sayur Bayam, Jeruk, Susu</div>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <div className="w-16 font-bold text-slate-700 shrink-0">10 Ags:</div>
                        <div className="text-slate-600">Nasi, Ikan Bakar, Tumis Kangkung, Melon, Susu</div>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <div className="w-16 font-bold text-slate-700 shrink-0">09 Ags:</div>
                        <div className="text-slate-600">Nasi, Daging Teriyaki, Capcay, Apel, Susu</div>
                      </div>
                    </div>
                  </div>
                  
                  {!showReportForm ? (
                    <div className="pt-4 border-t border-slate-100">
                      <button 
                        onClick={() => setShowReportForm(true)}
                        className="w-full py-3 bg-red-50 text-red-700 hover:bg-red-100 font-bold rounded-xl transition-colors border border-red-200 flex items-center justify-center gap-2"
                      >
                        <AlertTriangle className="w-5 h-5" />
                        Ada Masalah? Lapor ke BGN
                      </button>
                    </div>
                  ) : (
                    <div className="pt-4 border-t border-slate-100">
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Kategori Masalah</label>
                          <select 
                            value={reportData.kategori}
                            onChange={e => setReportData(p => ({...p, kategori: e.target.value}))}
                            className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                          >
                            <option value="Kualitas Makanan">Kualitas Makanan (Basi, Keras, dll)</option>
                            <option value="Higiene & Keamanan">Higiene (Ada benda asing)</option>
                            <option value="Porsi Kurang">Porsi Kurang dari Semestinya</option>
                            <option value="Lainnya">Lainnya</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Deskripsi Masalah</label>
                          <textarea 
                            value={reportData.isi}
                            onChange={e => setReportData(p => ({...p, isi: e.target.value}))}
                            className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 h-16 resize-none focus:border-blue-500 outline-none"
                            placeholder="Ceritakan detail masalahnya..."
                          />
                        </div>
                        <div className="pt-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Lampiran Foto Bukti</label>
                          <div 
                            onClick={() => setReportData(p => ({...p, fotoBukti: !p.fotoBukti}))}
                            className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${reportData.fotoBukti ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'}`}
                          >
                            {reportData.fotoBukti ? (
                              <>
                                <CheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
                                <div className="text-sm font-bold text-emerald-700">Foto Tersimpan</div>
                                <div className="text-[10px] text-emerald-600 font-medium">Klik untuk membatalkan</div>
                              </>
                            ) : (
                              <>
                                <ImagePlus className="w-8 h-8 text-slate-400 mb-2" />
                                <div className="text-sm font-bold text-slate-700">Ambil dari Kamera / Galeri</div>
                                <div className="text-[10px] text-slate-500 font-medium text-center mt-1">Upload foto makanan yang bermasalah<br/>Format: JPG/PNG (Maks 5MB)</div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button onClick={() => setShowReportForm(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors">Batal</button>
                          <button onClick={submitReport} className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Kirim Laporan</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-auto bg-white border-t border-slate-200 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 font-semibold text-emerald-600">
              <Server className="w-4 h-4" />
              <span>Server Operasional</span>
            </div>
            <div className="flex items-center gap-2 font-semibold text-blue-600">
              <Database className="w-4 h-4" />
              <span>Data Tersinkronisasi (Delay &lt; 5 Menit)</span>
            </div>
          </div>
          <div className="text-slate-500 font-medium">
            &copy; 2026 TEAM KEPENCET EMOT (PIDI DIGDAYA x HACKATHON)
          </div>
        </div>
      </div>
    </div>
  );
}
