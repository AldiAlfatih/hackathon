'use client';

import { useState, useRef } from 'react';
import {
  Building2, Upload, FileText, ChevronRight, Package, Camera,
  Info, Calendar, CheckCircle2, AlertCircle, Loader2, 
  Clock, CheckSquare, XCircle, Home, Utensils, BarChart3,
  TrendingUp, TrendingDown, MapPin, Lock, Navigation,
  BrainCircuit, ShieldCheck, Link
} from 'lucide-react';
import type { SppgSubView, ActiveSubView } from './KawalApp';

interface OcrResult {
  noSurat: string;
  penerbit: string;
  masaBerlaku: string;
  status: 'valid' | 'invalid';
}

interface SppgPortalProps {
  activeSubView: SppgSubView;
  setActiveSubView: (sub: ActiveSubView) => void;
}

export default function SppgPortal({ activeSubView, setActiveSubView }: SppgPortalProps) {
  const [ocrState, setOcrState] = useState<'idle' | 'processing' | 'done'>('idle');
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [nutritionState, setNutritionState] = useState<'idle' | 'uploading' | 'analyzing' | 'done'>('idle');
  const [hygieneState, setHygieneState] = useState<'idle' | 'uploading' | 'analyzing' | 'done'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nutritionInputRef = useRef<HTMLInputElement>(null);
  const hygieneInputRef = useRef<HTMLInputElement>(null);

  const handleOcr = () => {
    setOcrState('processing');
    setTimeout(() => {
      setOcrState('done');
      setOcrResult({
        noSurat: 'IRT/DKI/2024/08/1247',
        penerbit: 'Dinas Kesehatan DKI Jakarta',
        masaBerlaku: '12 Agustus 2026',
        status: 'valid',
      });
    }, 2000);
  };

  const handleNutritionUpload = () => {
    setNutritionState('uploading');
    setTimeout(() => {
      setNutritionState('analyzing');
      setTimeout(() => setNutritionState('done'), 2500);
    }, 1000);
  };

  const handleHygieneUpload = () => {
    setHygieneState('uploading');
    setTimeout(() => {
      setHygieneState('analyzing');
      setTimeout(() => setHygieneState('done'), 2500);
    }, 1000);
  };

  const breadcrumb = activeSubView === 'dashboard' ? 'Dashboard'
    : activeSubView === 'licensing' ? 'Perizinan (NIB)'
    : activeSubView === 'delivery-history' ? 'Riwayat Pengiriman'
    : activeSubView === 'onboarding' ? 'Onboarding & Verifikasi'
    : activeSubView === 'hygiene' ? 'Live Guard Monitoring'
    : 'Nutrition Center';

  return (
    <div className="p-6 h-full flex flex-col gap-6 font-sans bg-slate-50">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1.5">
          <Building2 className="w-3.5 h-3.5" />
          <span>Portal Kemitraan SPPG</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-800">{breadcrumb}</span>
        </div>
        <h1 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">CV. Dapur Nusantara Sejahtera</h1>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">

      {/* --- ONBOARDING VIEW --- */}
      {activeSubView === 'onboarding' && (
        <div className="space-y-6 pb-6">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="font-bold text-amber-800 text-base mb-1">Akses Distribusi Terkunci</div>
              <div className="text-sm text-amber-700">Untuk mencegah praktik SPPG Fiktif (Ghoib), Anda wajib menyelesaikan proses onboarding verifikasi fisik sebelum dapat menerima dana dan memulai distribusi makanan.</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-600" /> Checklist Verifikasi Fisik
            </h2>
            
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {/* Step 1 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-blue-50 border border-blue-100 p-4 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-800 text-sm">Upload Dokumen NIB OSS</h3>
                    <span className="text-[10px] bg-blue-200 text-blue-800 font-bold px-2 py-0.5 rounded uppercase">Dalam Proses</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-3">Sistem kami terhubung dengan OSS untuk verifikasi otomatis.</p>
                  <button className="px-3 py-1.5 bg-white border border-blue-200 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                    Upload PDF NIB
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <Camera className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white border border-slate-200 p-4 rounded-xl opacity-75">
                  <h3 className="font-bold text-slate-800 text-sm mb-1">Upload Foto Fasilitas Dapur</h3>
                  <p className="text-xs text-slate-500 mb-3">Wajib min. 3 foto (depan, dalam, ruang masak) untuk verifikasi kepemilikan fisik.</p>
                  <button disabled className="px-3 py-1.5 bg-slate-100 text-slate-400 text-xs font-bold rounded-lg cursor-not-allowed">
                    Terkunci
                  </button>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <Navigation className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white border border-slate-200 p-4 rounded-xl opacity-75">
                  <h3 className="font-bold text-slate-800 text-sm mb-1">Verifikasi Geotag & GPS</h3>
                  <p className="text-xs text-slate-500 mb-3">Sistem akan merekam koordinat Anda saat ini untuk disandingkan dengan alamat NIB.</p>
                  <button disabled className="px-3 py-1.5 bg-slate-100 text-slate-400 text-xs font-bold rounded-lg cursor-not-allowed flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Deteksi Lokasi Terkunci
                  </button>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white border border-slate-200 p-4 rounded-xl opacity-75">
                  <h3 className="font-bold text-slate-800 text-sm mb-1">Survei Lapangan BGN</h3>
                  <p className="text-xs text-slate-500">Tahap akhir: Petugas BGN akan datang ke lokasi Anda sebelum akun dinyatakan aktif secara penuh.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* DASHBOARD */}
        {activeSubView === 'dashboard' && (
          <div className="space-y-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg"><Calendar className="w-5 h-5 text-blue-600" /></div>
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600"><TrendingUp className="w-3 h-3"/>+1 dari kemarin</span>
                </div>
                <div className="text-3xl font-mono font-bold text-slate-900">3</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Jadwal Pengiriman Hari Ini</div>
                <div className="text-xs text-slate-400 mt-0.5">Sekolah tujuan aktif</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg"><Package className="w-5 h-5 text-indigo-600" /></div>
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600"><TrendingUp className="w-3 h-3"/>100% target</span>
                </div>
                <div className="text-3xl font-mono font-bold text-blue-600">1.250</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Total Porsi Siap</div>
                <div className="text-xs text-slate-400 mt-0.5">Sesuai kontrak harian</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-emerald-50 rounded-lg"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div>
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-500">Bulan ini</span>
                </div>
                <div className="text-3xl font-mono font-bold text-emerald-600">95%</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Compliance Score Gizi</div>
                <div className="text-xs text-slate-400 mt-0.5">AI Component Completeness</div>
              </div>
            </div>

            {/* Today's delivery schedule */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Jadwal Pengiriman Hari Ini</h2>
                <span className="text-xs text-slate-500">Senin, 12 Agustus 2026</span>
              </div>
              <div className="divide-y divide-slate-100">
                {[
                  { sekolah: 'SDN 01 Cilandak', porsi: 450, jam: '07:00', status: 'Selesai', statusColor: 'emerald' },
                  { sekolah: 'SDN 05 Lebak Bulus', porsi: 380, jam: '07:30', status: 'Selesai', statusColor: 'emerald' },
                  { sekolah: 'MTS Nurul Iman', porsi: 420, jam: '08:00', status: 'Dalam Perjalanan', statusColor: 'blue' },
                ].map((row, i) => (
                  <div key={i} className="px-5 py-4 flex items-center justify-between text-sm">
                    <div>
                      <div className="font-bold text-slate-800">{row.sekolah}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{row.porsi} porsi &bull; Jam {row.jam}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase border
                      ${row.statusColor === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LICENSING */}
        {activeSubView === 'licensing' && (
          <div className="w-full space-y-6 pb-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" /> Verifikasi Dokumen Legalitas (AI OCR)
                </h2>
                <p className="text-xs text-slate-500 mt-1">Upload dokumen NIB/Izin Usaha. Sistem OCR akan mengekstrak data secara otomatis.</p>
              </div>
              
              {/* Status Overview */}
              <div className="grid grid-cols-3 gap-px bg-slate-100">
                {[
                  { label: 'Nomor Induk Berusaha (NIB)', status: 'Terverifikasi', color: 'emerald' },
                  { label: 'Sertifikat Halal MUI', status: 'Terverifikasi', color: 'emerald' },
                  { label: 'Sertifikat Higiene Pangan', status: 'Perlu Diperbarui', color: 'amber' },
                ].map((doc, i) => (
                  <div key={i} className="bg-white p-4">
                    <div className="text-[11px] text-slate-500 font-medium mb-2">{doc.label}</div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border
                      ${doc.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-6">
                <div className="mb-4 text-xs font-bold text-slate-700 uppercase tracking-wider">Upload Dokumen Baru</div>
                <div className="p-5 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-slate-400" />
                      <div>
                        <div className="font-bold text-slate-800 text-sm">Sertifikat Higiene Pangan (Kedaluwarsa)</div>
                        <div className="text-[10px] text-red-600 font-bold uppercase mt-0.5 tracking-wider">⚠ Wajib Diperbarui</div>
                      </div>
                    </div>
                    {ocrState === 'done' && ocrResult && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-md border border-emerald-200 text-emerald-700 bg-emerald-50 uppercase tracking-wider shadow-sm">
                        Valid (OSS)
                      </span>
                    )}
                  </div>

                  {ocrState === 'idle' && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-8 flex flex-col items-center gap-3 rounded-lg bg-white border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.jpg,.png" onChange={handleOcr} />
                      <Upload className="w-6 h-6 text-blue-500" />
                      <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Pilih File / Foto Dokumen</span>
                      <span className="text-xs text-slate-400">PDF, JPG, atau PNG — maks. 10MB</span>
                    </button>
                  )}

                  {ocrState === 'processing' && (
                    <div className="py-8 flex flex-col items-center gap-4 bg-white rounded-lg border border-slate-200">
                      <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                      <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Mengekstrak Data OCR...</div>
                    </div>
                  )}

                  {ocrState === 'done' && ocrResult && (
                    <div className="mt-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200 shadow-sm">
                      <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Dokumen Berhasil Diverifikasi (AI OCR)
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          ['Nomor Registrasi', ocrResult.noSurat],
                          ['Penerbit Dokumen', ocrResult.penerbit],
                          ['Masa Berlaku', ocrResult.masaBerlaku],
                          ['Sumber Validasi', 'OSS RBA Kemenkeu'],
                        ].map(([l, v]) => (
                          <div key={l}>
                            <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider mb-1">{l}</div>
                            <div className="text-slate-900 font-bold text-sm">{v}</div>
                          </div>
                        ))}
                      </div>

                      {/* AI Metrics Additions */}
                      <div className="mt-5 pt-5 border-t border-emerald-200/50">
                        <div className="flex items-center gap-2 mb-3">
                          <BrainCircuit className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Hasil Analisis Smart Licensing AI</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="bg-white/50 p-3 rounded border border-emerald-100">
                            <div className="text-[10px] text-emerald-600 font-bold uppercase mb-1 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" /> Confidence Score
                            </div>
                            <div className="text-lg font-mono font-bold text-slate-800">98.5%</div>
                            <div className="text-[9px] text-slate-500 mt-1">Akurasi pembacaan karakter OCR tingkat tinggi.</div>
                          </div>
                          <div className="bg-white/50 p-3 rounded border border-emerald-100">
                            <div className="text-[10px] text-emerald-600 font-bold uppercase mb-1 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Status Keaslian
                            </div>
                            <div className="text-sm font-bold text-emerald-700">Valid & Terverifikasi</div>
                            <div className="text-[9px] text-slate-500 mt-1">Sesuai dengan database master OSS.</div>
                          </div>
                          <div className="bg-white/50 p-3 rounded border border-emerald-100">
                            <div className="text-[10px] text-emerald-600 font-bold uppercase mb-1 flex items-center gap-1">
                              <Link className="w-3 h-3" /> Blockchain Hash
                            </div>
                            <div className="text-xs font-mono font-bold text-slate-700 truncate" title="0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069">0x7f83b165...6d9069</div>
                            <div className="text-[9px] text-slate-500 mt-1">Bukti verifikasi tidak dapat diubah (immutable).</div>
                          </div>
                        </div>
                        <div className="mt-3 bg-white/50 p-3 rounded border border-emerald-100 flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[10px] text-blue-800 font-bold uppercase mb-0.5">Catatan AI Cross-Reference</div>
                            <div className="text-xs text-slate-700 font-medium">Nama direktur yang tertera pada NIB cocok dengan data pengurus di sistem Administrasi Hukum Umum (AHU) Kemenkumham. Tidak ditemukan anomali pada akta pendirian.</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NUTRITION CENTER */}
        {activeSubView === 'nutrition' && (
          <div className="grid lg:grid-cols-2 gap-6 pb-6">
            {/* Planned Menu */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">1. Menu Wajib Hari Ini</h2>
                <p className="text-xs text-slate-500 mt-1">Jadwal Gizi Nasional yang ditetapkan oleh BGN untuk disajikan.</p>
              </div>
              <div className="p-6 flex-1">
                <div className="space-y-3">
                  {['Nasi Putih', 'Telur Dadar', 'Sayur Sop / Bayam', 'Buah Pisang', 'Susu UHT 200ml'].map((item) => (
                    <div key={item} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                      <span className="text-sm font-bold text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700 font-medium">
                  📋 Menu ditetapkan oleh BGN &bull; Update setiap awal pekan
                </div>
              </div>
            </div>

            {/* Upload & AI Result */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">2. Upload Foto & Analisis AI</h2>
                <p className="text-xs text-slate-500 mt-1">AI memverifikasi <strong>Component Completeness</strong> (keberadaan tiap komponen).</p>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                {nutritionState === 'idle' && (
                  <button
                    onClick={() => nutritionInputRef.current?.click()}
                    className="flex-1 min-h-[200px] flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-blue-400 transition-colors"
                  >
                    <input type="file" ref={nutritionInputRef} className="hidden" accept="image/*" onChange={handleNutritionUpload} />
                    <Camera className="w-8 h-8 text-blue-500" />
                    <div className="text-center">
                      <div className="text-sm font-bold text-slate-700 uppercase tracking-wider">Ambil / Upload Foto Porsi</div>
                      <div className="text-[11px] text-slate-500 mt-1">Pastikan semua komponen terlihat jelas</div>
                    </div>
                  </button>
                )}
                {(nutritionState === 'uploading' || nutritionState === 'analyzing') && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-slate-50 rounded-xl border border-slate-200 min-h-[200px]">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <div className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                      {nutritionState === 'uploading' ? 'Mengunggah Foto...' : 'AI Mengidentifikasi Komponen...'}
                    </div>
                  </div>
                )}
                {nutritionState === 'done' && (
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Component Completeness</div>
                        <div className="text-3xl font-mono font-bold text-amber-600">80%</div>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 border border-amber-200 rounded-lg font-bold text-xs uppercase">Needs Review</span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Hasil Deteksi AI:</div>
                      <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-2.5 rounded-lg border border-emerald-100">
                        <CheckSquare className="w-4 h-4 shrink-0" /> Nasi, Telur, Sayur, Susu — Terdeteksi ✓
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-red-700 bg-red-50 px-3 py-2.5 rounded-lg border border-red-100">
                        <XCircle className="w-4 h-4 shrink-0" /> Buah Pisang — Tidak Ditemukan ✗
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                      Hasil deteksi dikirim ke BGN untuk Manual Review. Anda tetap dapat melanjutkan distribusi.
                    </div>
                    <button onClick={() => setNutritionState('idle')} className="w-full py-2.5 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                      AMBIL FOTO ULANG
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* HYGIENE COMPLIANCE / LIVE GUARD */}
        {activeSubView === 'hygiene' && (
          <div className="w-full space-y-6 pb-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Camera className="w-4 h-4 text-blue-600" /> Live Guard Monitoring (Hygiene AI)
                </h2>
                <p className="text-xs text-slate-500 mt-1">Upload foto/video dapur operasional harian. AI akan memverifikasi APD dan standar kebersihan.</p>
              </div>
              <div className="p-6 flex flex-col md:flex-row gap-6">
                {hygieneState === 'idle' && (
                  <button 
                    onClick={() => hygieneInputRef.current?.click()}
                    className="flex-1 flex flex-col items-center justify-center gap-4 bg-slate-50 hover:bg-blue-50 border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl transition-all group min-h-[200px]"
                  >
                    <input type="file" className="hidden" ref={hygieneInputRef} onChange={handleHygieneUpload} accept="image/*,video/*" />
                    <Camera className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
                    <div className="text-center">
                      <div className="text-sm font-bold text-slate-700 uppercase tracking-wider">Ambil Foto / Video Dapur</div>
                      <div className="text-[11px] text-slate-500 mt-1">Sorot area persiapan makanan dan staff</div>
                    </div>
                  </button>
                )}
                {(hygieneState === 'uploading' || hygieneState === 'analyzing') && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-slate-50 rounded-xl border border-slate-200 min-h-[200px]">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <div className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                      {hygieneState === 'uploading' ? 'Mengunggah Dokumentasi...' : 'Computer Vision Menganalisis...'}
                    </div>
                  </div>
                )}
                {hygieneState === 'done' && (
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div>
                        <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">Skor Kepatuhan (AI)</div>
                        <div className="text-3xl font-mono font-bold text-emerald-700">92%</div>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg font-bold text-xs uppercase flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Memenuhi Standar
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 border border-slate-200 rounded-lg bg-slate-50">
                        <div className="text-[10px] text-slate-500 font-bold uppercase mb-2">Deteksi APD Staff</div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-medium"><span className="flex items-center gap-1 text-slate-700"><CheckSquare className="w-3 h-3 text-emerald-600" /> Penutup Kepala</span> <span className="text-emerald-600 font-bold">100%</span></div>
                          <div className="flex items-center justify-between text-xs font-medium"><span className="flex items-center gap-1 text-slate-700"><CheckSquare className="w-3 h-3 text-emerald-600" /> Masker</span> <span className="text-emerald-600 font-bold">100%</span></div>
                          <div className="flex items-center justify-between text-xs font-medium"><span className="flex items-center gap-1 text-slate-700"><XCircle className="w-3 h-3 text-amber-500" /> Sarung Tangan</span> <span className="text-amber-600 font-bold">80%</span></div>
                        </div>
                      </div>
                      <div className="p-3 border border-slate-200 rounded-lg bg-slate-50">
                        <div className="text-[10px] text-slate-500 font-bold uppercase mb-2">Kebersihan Area</div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-medium"><span className="flex items-center gap-1 text-slate-700"><CheckSquare className="w-3 h-3 text-emerald-600" /> Meja Stainless</span> <span className="text-emerald-600 font-bold">Bersih</span></div>
                          <div className="flex items-center justify-between text-xs font-medium"><span className="flex items-center gap-1 text-slate-700"><CheckSquare className="w-3 h-3 text-emerald-600" /> Lantai Dapur</span> <span className="text-emerald-600 font-bold">Aman</span></div>
                          <div className="flex items-center justify-between text-xs font-medium"><span className="flex items-center gap-1 text-slate-700"><CheckSquare className="w-3 h-3 text-emerald-600" /> Tempat Sampah</span> <span className="text-emerald-600 font-bold">Tertutup</span></div>
                        </div>
                      </div>
                    </div>
                    
                    <button onClick={() => setHygieneState('idle')} className="w-full mt-2 py-2.5 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                      UPLOAD FOTO LAINNYA
                    </button>
                  </div>
                )}
                
                {hygieneState === 'done' && (
                  <div className="w-full md:w-1/3 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative min-h-[250px]">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&q=80')] bg-cover bg-center opacity-50"></div>
                    <div className="absolute inset-0 border-4 border-emerald-500/50 m-4 rounded">
                       <div className="absolute -top-3 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">APD Complete 99%</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DELIVERY HISTORY */}
        {activeSubView === 'delivery-history' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Riwayat Pengiriman (Bulan Ini)</h2>
              <button className="px-3 py-1.5 bg-white border border-slate-300 text-xs font-bold text-slate-700 rounded-lg hover:bg-slate-50">Export PDF</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-5">Tanggal</th>
                    <th className="py-3.5 px-5">Sekolah Tujuan</th>
                    <th className="py-3.5 px-5">Menu</th>
                    <th className="py-3.5 px-5">Porsi Terkirim</th>
                    <th className="py-3.5 px-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { date: '11 Agustus 2026', school: 'SDN 01 Cilandak', menu: 'Nasi, Ayam Goreng, Sayur', qty: 450, status: 'Selesai' },
                    { date: '11 Agustus 2026', school: 'SDN 05 Lebak Bulus', menu: 'Nasi, Ayam Goreng, Sayur', qty: 380, status: 'Selesai' },
                    { date: '10 Agustus 2026', school: 'SDN 01 Cilandak', menu: 'Nasi, Ikan Bakar, Sayur', qty: 450, status: 'Selesai' },
                    { date: '10 Agustus 2026', school: 'SDN 05 Lebak Bulus', menu: 'Nasi, Ikan Bakar, Sayur', qty: 380, status: 'Selesai' },
                    { date: '09 Agustus 2026', school: 'SDN 01 Cilandak', menu: 'Nasi, Telur Dadar, Sayur', qty: 450, status: 'Selesai' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-3.5 px-5 font-mono text-xs text-slate-500">{row.date}</td>
                      <td className="py-3.5 px-5 font-bold text-slate-800">{row.school}</td>
                      <td className="py-3.5 px-5 text-sm text-slate-600 max-w-xs">{row.menu}</td>
                      <td className="py-3.5 px-5 text-sm font-bold text-slate-900">{row.qty} <span className="font-normal text-slate-500 text-xs">Porsi</span></td>
                      <td className="py-3.5 px-5">
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> {row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
