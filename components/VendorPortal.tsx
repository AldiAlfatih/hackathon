'use client';

import { useState, useRef } from 'react';
import {
  Building2, Upload, FileText, MapPin, CheckCircle2, Loader2,
  AlertCircle, ChevronRight, Clock, Package, Plus, X, Eye, Camera
} from 'lucide-react';

interface FormData {
  namaVendor: string;
  npwp: string;
  namaRepresentatif: string;
  email: string;
  telepon: string;
  alamat: string;
  kota: string;
  provinsi: string;
  kapasitas: string;
  jenisLayanan: string;
  pengalaman: string;
}

interface OcrResult {
  noSurat: string;
  penerbit: string;
  masaBerlaku: string;
  status: 'valid' | 'invalid';
}

interface LaporanItem {
  id: string;
  tanggal: string;
  jumlahPorsi: string;
  lokasiNama: string;
  lat: string;
  lng: string;
  status: 'verified' | 'no-geotag' | 'pending';
}

const provinsiList = [
  'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur',
  'Sumatera Utara', 'Sumatera Barat', 'Sumatera Selatan', 'Banten', 'Bali',
  'Sulawesi Selatan', 'Kalimantan Timur', 'Kalimantan Selatan', 'Papua', 'Lainnya',
];

const riwayatLaporan: LaporanItem[] = [
  { id: 'L-001', tanggal: '04 Apr 2026', jumlahPorsi: '4.850', lokasiNama: 'SMPN 12 Jakarta Selatan', lat: '-6.2501', lng: '106.8243', status: 'verified' },
  { id: 'L-002', tanggal: '03 Apr 2026', jumlahPorsi: '4.830', lokasiNama: 'SDN 01 Cilandak', lat: '-6.2820', lng: '106.7951', status: 'verified' },
  { id: 'L-003', tanggal: '02 Apr 2026', jumlahPorsi: '4.720', lokasiNama: 'SMAN 5 Jakarta', lat: '', lng: '', status: 'no-geotag' },
  { id: 'L-004', tanggal: '01 Apr 2026', jumlahPorsi: '4.800', lokasiNama: 'SDN 03 Kebayoran', lat: '-6.2645', lng: '106.8012', status: 'verified' },
];

export default function VendorPortal() {
  const [tab, setTab] = useState<'pendaftaran' | 'laporan'>('pendaftaran');
  const [formStep, setFormStep] = useState(1);
  const [ocrState, setOcrState] = useState<'idle' | 'processing' | 'done'>('idle');
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'done'>('idle');
  const [geoState, setGeoState] = useState<'idle' | 'detecting' | 'done'>('done');
  const [showLaporanModal, setShowLaporanModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    namaVendor: '', npwp: '', namaRepresentatif: '', email: '', telepon: '',
    alamat: '', kota: '', provinsi: '', kapasitas: '', jenisLayanan: '', pengalaman: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    }, 2800);
  };

  const handleUploadLaporan = () => {
    setUploadState('uploading');
    setTimeout(() => setUploadState('done'), 2000);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const statusLabel = (status: LaporanItem['status']) => {
    if (status === 'verified') return { text: 'Terverifikasi', color: 'text-green-400', bg: 'bg-green-400/10' };
    if (status === 'no-geotag') return { text: 'Tanpa Geotag', color: 'text-red-400', bg: 'bg-red-400/10' };
    return { text: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-card p-10 max-w-md w-full text-center fade-in">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Pendaftaran Berhasil!</h2>
          <p className="text-blue-300 mb-6 text-sm leading-relaxed">
            Dokumen Anda sedang dalam proses verifikasi oleh tim regulator. Nomor referensi pendaftaran Anda:
          </p>
          <div className="bg-blue-900/30 rounded-lg p-4 mb-6 font-mono text-blue-300 text-lg font-bold tracking-widest">
            KAWAL-V-2026-08471
          </div>
          <p className="text-xs text-blue-500 mb-6">
            Estimasi verifikasi: 2–3 hari kerja. Anda akan dihubungi melalui email {formData.email || 'yang terdaftar'}.
          </p>
          <button
            onClick={() => { setSubmitted(false); setFormStep(1); setOcrState('idle'); setOcrResult(null); }}
            className="w-full py-3 rounded-xl text-white font-semibold"
            style={{ background: 'linear-gradient(135deg, #1d4ed8, #0ea5e9)' }}
          >
            Daftar Vendor Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 fade-in">
          <div className="flex items-center gap-2 text-sm text-blue-400 mb-3">
            <Building2 className="w-4 h-4" />
            <span>Portal Vendor</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">{tab === 'pendaftaran' ? 'Pendaftaran' : 'Laporan Distribusi'}</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Portal Vendor MBG</h1>
          <p className="text-blue-300">Pusat pendaftaran dan pelaporan distribusi makanan bergizi gratis</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['pendaftaran', 'laporan'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === t
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-400 border border-blue-800/50 hover:bg-blue-900/30'
              }`}
            >
              {t === 'pendaftaran' ? '📄 Pendaftaran Vendor' : '📍 Laporan Distribusi'}
            </button>
          ))}
        </div>

        {/* ===================== PENDAFTARAN TAB ===================== */}
        {tab === 'pendaftaran' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      formStep >= step ? 'bg-blue-600 text-white' : 'border border-blue-800 text-blue-600'
                    }`}>
                      {formStep > step ? '✓' : step}
                    </div>
                    {step < 3 && <div className={`w-12 h-0.5 ${formStep > step ? 'bg-blue-600' : 'bg-blue-900'}`} />}
                  </div>
                ))}
                <div className="ml-2 text-sm text-blue-400">
                  {formStep === 1 && 'Data Perusahaan'}
                  {formStep === 2 && 'Dokumen & Verifikasi OCR'}
                  {formStep === 3 && 'Konfirmasi'}
                </div>
              </div>

              {/* Step 1 */}
              {formStep === 1 && (
                <div className="glass-card p-6 slide-in">
                  <h2 className="text-lg font-semibold text-white mb-5">Data Perusahaan Vendor</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { field: 'namaVendor', label: 'Nama Vendor / Perusahaan', placeholder: 'PT / CV / UD / Koperasi...' },
                      { field: 'npwp', label: 'NPWP', placeholder: '00.000.000.0-000.000' },
                      { field: 'namaRepresentatif', label: 'Nama Representatif', placeholder: 'Nama lengkap PIC' },
                      { field: 'email', label: 'Email', placeholder: 'kontak@perusahaan.co.id' },
                      { field: 'telepon', label: 'Nomor Telepon', placeholder: '+62 8xx xxxx xxxx' },
                      { field: 'kapasitas', label: 'Kapasitas Harian (porsi)', placeholder: 'Contoh: 5000' },
                    ].map(({ field, label, placeholder }) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-blue-300 mb-1.5">{label}</label>
                        <input
                          type="text"
                          placeholder={placeholder}
                          value={formData[field as keyof FormData]}
                          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-blue-700 border border-blue-800/50 outline-none focus:border-blue-500 transition-colors"
                          style={{ background: 'rgba(10, 22, 48, 0.8)' }}
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-sm font-medium text-blue-300 mb-1.5">Provinsi</label>
                      <select
                        value={formData.provinsi}
                        onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg text-sm border border-blue-800/50 outline-none focus:border-blue-500 transition-colors"
                        style={{ background: 'rgba(10, 22, 48, 0.9)', color: formData.provinsi ? 'white' : '#1e3a8a' }}
                      >
                        <option value="">Pilih provinsi...</option>
                        {provinsiList.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-300 mb-1.5">Jenis Layanan</label>
                      <select
                        value={formData.jenisLayanan}
                        onChange={(e) => setFormData({ ...formData, jenisLayanan: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg text-sm border border-blue-800/50 outline-none focus:border-blue-500 transition-colors"
                        style={{ background: 'rgba(10, 22, 48, 0.9)', color: formData.jenisLayanan ? 'white' : '#1e3a8a' }}
                      >
                        <option value="">Pilih jenis layanan...</option>
                        <option>Katering Sekolah Dasar</option>
                        <option>Katering Sekolah Menengah</option>
                        <option>Distribusi Multi-Jenjang</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-blue-300 mb-1.5">Alamat Lengkap Dapur Produksi</label>
                      <textarea
                        rows={2}
                        placeholder="Jl. ... No. ..., Kel. ..., Kec. ..., Kota ..."
                        value={formData.alamat}
                        onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-blue-700 border border-blue-800/50 outline-none focus:border-blue-500 transition-colors resize-none"
                        style={{ background: 'rgba(10, 22, 48, 0.8)' }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => setFormStep(2)}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold transition-all hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #1d4ed8, #0ea5e9)' }}
                    >
                      Lanjut: Unggah Dokumen <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 - Smart Document Uploader */}
              {formStep === 2 && (
                <div className="glass-card p-6 slide-in">
                  <h2 className="text-lg font-semibold text-white mb-2">Smart Document Uploader</h2>
                  <p className="text-sm text-blue-400 mb-6">
                    Unggah dokumen perizinan Anda. Sistem AI akan mengekstrak dan memverifikasi data secara otomatis.
                  </p>

                  {/* Dokumen 1: Surat Izin */}
                  <div className="mb-6 p-4 rounded-xl border border-dashed border-blue-700/50" style={{ background: 'rgba(10, 22, 48, 0.5)' }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <span className="font-medium text-white text-sm">Surat Izin Usaha Pangan</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">Wajib</span>
                      </div>
                      {ocrState === 'done' && ocrResult && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${ocrResult.status === 'valid' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {ocrResult.status === 'valid' ? '✓ Valid' : '✗ Tidak Valid'}
                        </span>
                      )}
                    </div>

                    {ocrState === 'idle' && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-8 flex flex-col items-center gap-2 rounded-lg border border-dashed border-blue-700/40 hover:border-blue-500/60 transition-colors group"
                      >
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept=".pdf,.jpg,.png"
                          onChange={handleOcr} 
                        />
                        <Upload className="w-6 h-6 text-blue-500 group-hover:text-blue-300 transition-colors" />
                        <span className="text-sm text-blue-400 group-hover:text-blue-200 transition-colors">
                          Klik untuk unggah atau seret file PDF/JPG ke sini
                        </span>
                        <span className="text-xs text-blue-600">Maks. 10MB · PDF, JPG, PNG</span>
                      </button>
                    )}

                    {ocrState === 'processing' && (
                      <div className="py-6 flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                        <div className="w-full max-w-xs">
                          <div className="flex justify-between text-xs text-blue-400 mb-1">
                            <span>🤖 AI sedang membaca dokumen...</span>
                            <span>OCR</span>
                          </div>
                          <div className="w-full h-2 bg-blue-900 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '65%' }} />
                          </div>
                          <div className="text-xs text-blue-500 mt-2 text-center">
                            Mengekstrak: nomor izin, penerbit, masa berlaku...
                          </div>
                        </div>
                      </div>
                    )}

                    {ocrState === 'done' && ocrResult && (
                      <div className="mt-2 p-4 rounded-lg border border-green-700/30" style={{ background: 'rgba(16, 185, 129, 0.05)' }}>
                        <div className="flex items-center gap-2 mb-3 text-green-400 text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          Hasil Ekstraksi OCR Berhasil
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {[
                            ['No. Surat Izin', ocrResult.noSurat],
                            ['Diterbitkan Oleh', ocrResult.penerbit],
                            ['Masa Berlaku', ocrResult.masaBerlaku],
                            ['Status', ocrResult.status === 'valid' ? '✓ Dokumen Valid' : '✗ Tidak Valid'],
                          ].map(([l, v]) => (
                            <div key={l} className="bg-blue-900/20 rounded-lg p-2">
                              <div className="text-xs text-blue-500">{l}</div>
                              <div className="text-white font-medium text-xs mt-0.5">{v}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dokumen 2: Sertifikat */}
                  <div className="mb-6 p-4 rounded-xl border border-blue-800/30" style={{ background: 'rgba(10, 22, 48, 0.4)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <span className="font-medium text-white text-sm">Sertifikat Halal / SNI / BPOM</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">Opsional</span>
                    </div>
                    <button 
                      onClick={() => document.getElementById('file-optional')?.click()}
                      className="w-full py-4 text-sm text-blue-500 border border-dashed border-blue-800/40 rounded-lg flex items-center justify-center gap-2 hover:border-blue-600/40 hover:text-blue-300 transition-colors"
                    >
                      <input id="file-optional" type="file" className="hidden" />
                      <Plus className="w-4 h-4" /> Tambah Dokumen
                    </button>
                  </div>

                  <div className="flex justify-between">
                    <button onClick={() => setFormStep(1)} className="px-5 py-2.5 rounded-xl text-blue-400 border border-blue-800/50 hover:bg-blue-900/30 transition-colors text-sm">
                      ← Kembali
                    </button>
                    <button
                      onClick={() => setFormStep(3)}
                      disabled={ocrState !== 'done'}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(135deg, #1d4ed8, #0ea5e9)' }}
                    >
                      Lanjut: Konfirmasi <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 - Konfirmasi */}
              {formStep === 3 && (
                <div className="glass-card p-6 slide-in">
                  <h2 className="text-lg font-semibold text-white mb-5">Konfirmasi Pendaftaran</h2>
                  <div className="space-y-3 mb-6">
                    {[
                      ['Nama Vendor', formData.namaVendor || '—'],
                      ['NPWP', formData.npwp || '—'],
                      ['Email', formData.email || '—'],
                      ['Provinsi', formData.provinsi || '—'],
                      ['Kapasitas Harian', formData.kapasitas ? `${formData.kapasitas} porsi` : '—'],
                      ['Dokumen Izin', ocrResult ? `🟢 ${ocrResult.noSurat}` : '—'],
                    ].map(([l, v]) => (
                      <div key={l} className="flex justify-between py-2 border-b border-blue-900/30 text-sm">
                        <span className="text-blue-400">{l}</span>
                        <span className="text-white font-medium">{v as string}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-800/30 text-xs text-blue-400 mb-6">
                    <AlertCircle className="w-4 h-4 inline mr-1 text-yellow-400" />
                    Dengan mendaftar, Anda menyetujui bahwa semua data yang diberikan adalah benar dan siap diaudit oleh regulator.
                  </div>
                  <div className="flex justify-between">
                    <button onClick={() => setFormStep(2)} className="px-5 py-2.5 rounded-xl text-blue-400 border border-blue-800/50 hover:bg-blue-900/30 transition-colors text-sm">
                      ← Kembali
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold transition-all hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
                    >
                      <CheckCircle2 className="w-4 h-4" /> Submit Pendaftaran
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-4">📋 Persyaratan Dokumen</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Surat Izin Usaha Pangan', required: true },
                    { label: 'NPWP Perusahaan', required: true },
                    { label: 'Sertifikat Halal / SNI', required: false },
                    { label: 'Foto Dapur Produksi (min. 3)', required: true },
                    { label: 'Bukti Pengalaman Katering', required: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-sm">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.required ? 'bg-red-400' : 'bg-blue-500'}`} />
                      <span className="text-blue-200">{item.label}</span>
                      <span className={`ml-auto text-xs ${item.required ? 'text-red-400' : 'text-blue-500'}`}>
                        {item.required ? 'Wajib' : 'Opsional'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-3">⏱️ Estimasi Proses</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-400">Verifikasi Dokumen</span>
                    <span className="text-white">1–2 hari</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-400">Survei Lapangan</span>
                    <span className="text-white">3–5 hari</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-400">Persetujuan Final</span>
                    <span className="text-white">1 hari</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== LAPORAN TAB ===================== */}
        {tab === 'laporan' && (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">Laporan Distribusi Harian</h2>
                  <p className="text-sm text-blue-400">Unggah laporan dengan data geolokasi untuk verifikasi otomatis</p>
                </div>
                <button
                  onClick={() => setShowLaporanModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium"
                  style={{ background: 'linear-gradient(135deg, #1d4ed8, #0ea5e9)' }}
                >
                  <Plus className="w-4 h-4" /> Tambah Laporan
                </button>
              </div>

              {/* Upload area */}
              <div className="mb-6 p-5 rounded-xl border border-dashed border-blue-700/50" style={{ background: 'rgba(10, 22, 48, 0.5)' }}>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <span className="font-medium text-white text-sm">Unggah Laporan Bergeotag</span>
                    </div>
                    <p className="text-xs text-blue-400 mb-4">
                      File laporan harus mengandung metadata GPS. Foto yang diunggah dari lokasi distribusi akan otomatis terverifikasi geolokasi.
                    </p>
                    {uploadState === 'idle' && (
                      <button 
                        onClick={() => document.getElementById('file-laporan')?.click()} 
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-blue-300 border border-blue-700/50 hover:bg-blue-900/30 transition-colors"
                      >
                        <input id="file-laporan" type="file" className="hidden" onChange={handleUploadLaporan} />
                        <Upload className="w-4 h-4" /> Unggah Laporan + Foto
                      </button>
                    )}
                    {uploadState === 'uploading' && (
                      <div className="flex items-center gap-2 text-sm text-blue-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Mengunggah dan memverifikasi geotag...
                      </div>
                    )}
                    {uploadState === 'done' && (
                      <div className="flex items-center gap-2 text-sm text-green-400">
                        <CheckCircle2 className="w-4 h-4" />
                        Laporan berhasil diunggah dan geotag terverifikasi
                      </div>
                    )}
                  </div>
                  <div className="w-full md:w-48 h-28 rounded-lg border border-blue-800/30 flex flex-col items-center justify-center text-center"
                    style={{ background: 'rgba(10, 22, 48, 0.8)' }}>
                    <MapPin className="w-6 h-6 text-blue-500 mb-1" />
                    <div className="text-xs text-blue-400">Koordinat GPS</div>
                    <div className="font-mono text-xs text-green-400 mt-1">-6.2501, 106.8243</div>
                    <div className="text-xs text-blue-500 mt-0.5">Jakarta Selatan</div>
                  </div>
                </div>
              </div>

              {/* Riwayat tabel */}
              <h3 className="text-sm font-semibold text-white mb-3">Riwayat Laporan</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-blue-900/50">
                      {['ID', 'Tanggal', 'Porsi', 'Lokasi', 'Koordinat', 'Status'].map((h) => (
                        <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-blue-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {riwayatLaporan.map((item) => {
                      const st = statusLabel(item.status);
                      return (
                        <tr key={item.id} className="border-b border-blue-900/20 hover:bg-blue-900/10 transition-colors">
                          <td className="py-3 px-3 font-mono text-blue-400 text-xs">{item.id}</td>
                          <td className="py-3 px-3 text-white">{item.tanggal}</td>
                          <td className="py-3 px-3 text-white font-semibold">{item.jumlahPorsi}</td>
                          <td className="py-3 px-3 text-blue-300 max-w-xs truncate">{item.lokasiNama}</td>
                          <td className="py-3 px-3 font-mono text-xs">
                            {item.lat ? (
                              <span className="text-green-400">{item.lat}, {item.lng}</span>
                            ) : (
                              <span className="text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Tidak ada</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${st.bg} ${st.color}`}>
                              {st.text}
                            </span>
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

      {/* Modal Tambah Laporan */}
      {showLaporanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm fade-in">
          <div className="glass-card w-full max-w-lg p-6 relative slide-in border border-blue-700/50" style={{ background: 'rgba(8, 20, 46, 0.95)' }}>
            <button 
              onClick={() => setShowLaporanModal(false)}
              className="absolute top-4 right-4 text-blue-400 hover:text-blue-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-2">Buat Laporan Baru</h2>
            <p className="text-xs text-blue-300 mb-6">Lengkapi data laporan distribusi harian beserta bukti foto geolokasi.</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-blue-300 mb-1.5">Lokasi Sekolah / Penerima</label>
                <input type="text" placeholder="Nama instansi/sekolah" className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-blue-700 border border-blue-800/50 outline-none focus:border-blue-500 transition-colors" style={{ background: 'rgba(10, 22, 48, 0.8)' }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1.5">Jumlah Porsi</label>
                  <input type="number" placeholder="Contoh: 150" className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-blue-700 border border-blue-800/50 outline-none focus:border-blue-500 transition-colors" style={{ background: 'rgba(10, 22, 48, 0.8)' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1.5">Tanggal</label>
                  <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-blue-700 border border-blue-800/50 outline-none focus:border-blue-500 transition-colors" style={{ background: 'rgba(10, 22, 48, 0.8)', colorScheme: 'dark' }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-300 mb-1.5">Foto Bukti (Wajib Geotag)</label>
                <button onClick={() => document.getElementById('file-modal')?.click()} className="w-full py-8 flex flex-col items-center gap-2 rounded-lg border border-dashed border-blue-700/40 hover:border-blue-500/60 transition-colors" style={{ background: 'rgba(59, 130, 246, 0.05)' }}>
                  <input id="file-modal" type="file" className="hidden" accept="image/*" />
                  <Camera className="w-6 h-6 text-blue-500" />
                  <span className="text-sm text-blue-400">Pilih dari Galeri atau Kamera</span>
                </button>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowLaporanModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-blue-400 border border-blue-800/50 hover:bg-blue-900/30 transition-colors">
                Batal
              </button>
              <button 
                onClick={() => {
                  setShowLaporanModal(false);
                  // Simulasi penambahan data bisa dieksekusi di sini
                }} 
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:scale-105" 
                style={{ background: 'linear-gradient(135deg, #1d4ed8, #0ea5e9)' }}
              >
                <CheckCircle2 className="w-4 h-4" /> Simpan Laporan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
