'use client';

import { useState, useRef } from 'react';
import {
  Building2, Upload, FileText, ChevronRight, Package, Camera,
  Info, Calendar, CheckCircle2, AlertCircle, Loader2, 
  Clock, CheckSquare, XCircle, Home, Utensils, BarChart3,
  TrendingUp, TrendingDown, MapPin, Lock, Navigation,
  ShieldCheck, Link, GraduationCap, Plus, RefreshCw, X, QrCode
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
  loggedInVendor?: any;
  updateVendorDocuments?: (vendorId: string, docKey: string, status: string, filename?: string) => void;
}

export default function SppgPortal({ activeSubView, setActiveSubView, loggedInVendor, updateVendorDocuments }: SppgPortalProps) {
  const [selectedDocKey, setSelectedDocKey] = useState<string>('akta');
  const [menuSiklus, setMenuSiklus] = useState<'siklus1' | 'siklus2'>('siklus1');
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [adjustedItem, setAdjustedItem] = useState('Buah Pisang Mas');
  const [replacementItem, setReplacementItem] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [pendingAdjustment, setPendingAdjustment] = useState<{ original: string; replacement: string; status: 'Pending' | 'Disetujui' } | null>(null);
  const [ocrState, setOcrState] = useState<'idle' | 'processing' | 'done'>('idle');
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [nutritionState, setNutritionState] = useState<'idle' | 'uploading' | 'analyzing' | 'done'>('idle');
  const [hygieneState, setHygieneState] = useState<'idle' | 'uploading' | 'analyzing' | 'done'>('idle');
  const [selectedSchoolForDetail, setSelectedSchoolForDetail] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nutritionInputRef = useRef<HTMLInputElement>(null);
  const hygieneInputRef = useRef<HTMLInputElement>(null);

  // --- Dynamic two-week schedule data (state so it can be updated) ---
  const [menuScheduleData, setMenuScheduleData] = useState([
    // Minggu 1
    { id: 'w1d1', minggu: 'Minggu 1', hari: 'Senin',  tanggal: '11 Agustus 2026', karbohidrat: 'Nasi Putih',        protein: 'Telur Dadar Slice',          sayur: 'Sayur Sop',            buah: 'Pisang Mas',    tambahan: 'Susu UHT Plain 200ml',   status: 'Selesai' as const },
    { id: 'w1d2', minggu: 'Minggu 1', hari: 'Selasa', tanggal: '12 Agustus 2026', karbohidrat: 'Nasi Putih',        protein: 'Ayam Goreng Fillet',         sayur: 'Tumis Bayam',          buah: 'Jeruk Manis',   tambahan: 'Susu UHT Plain 200ml',   status: 'Aktif' as const },
    { id: 'w1d3', minggu: 'Minggu 1', hari: 'Rabu',   tanggal: '13 Agustus 2026', karbohidrat: 'Nasi Merah',        protein: 'Ikan Goreng Tepung',         sayur: 'Sayur Bayam',          buah: 'Apel',          tambahan: 'Susu UHT Cokelat 200ml', status: 'Akan Datang' as const },
    { id: 'w1d4', minggu: 'Minggu 1', hari: 'Kamis',  tanggal: '14 Agustus 2026', karbohidrat: 'Nasi Kuning',       protein: 'Tempe Goreng',               sayur: 'Tumis Wortel & Buncis', buah: 'Pisang Mas',   tambahan: 'Susu UHT Plain 200ml',   status: 'Akan Datang' as const },
    { id: 'w1d5', minggu: 'Minggu 1', hari: 'Jumat',  tanggal: '15 Agustus 2026', karbohidrat: 'Nasi Putih',        protein: 'Daging Semur',               sayur: 'Sayur Asem',           buah: 'Semangka',      tambahan: 'Susu UHT Cokelat 200ml', status: 'Akan Datang' as const },
    // Minggu 2
    { id: 'w2d1', minggu: 'Minggu 2', hari: 'Senin',  tanggal: '18 Agustus 2026', karbohidrat: 'Nasi Merah',        protein: 'Telur Rebus',                sayur: 'Sayur Sop',            buah: 'Jeruk Manis',   tambahan: 'Susu UHT Plain 200ml',   status: 'Akan Datang' as const },
    { id: 'w2d2', minggu: 'Minggu 2', hari: 'Selasa', tanggal: '19 Agustus 2026', karbohidrat: 'Nasi Putih',        protein: 'Ayam Opor',                  sayur: 'Tumis Kangkung',       buah: 'Pisang Ambon',  tambahan: 'Susu UHT Cokelat 200ml', status: 'Akan Datang' as const },
    { id: 'w2d3', minggu: 'Minggu 2', hari: 'Rabu',   tanggal: '20 Agustus 2026', karbohidrat: 'Nasi Kuning',       protein: 'Ikan Bakar',                 sayur: 'Sayur Lodeh',          buah: 'Apel',          tambahan: 'Susu UHT Plain 200ml',   status: 'Akan Datang' as const },
    { id: 'w2d4', minggu: 'Minggu 2', hari: 'Kamis',  tanggal: '21 Agustus 2026', karbohidrat: 'Nasi Merah',        protein: 'Tahu Goreng',                sayur: 'Tumis Buncis',         buah: 'Semangka',      tambahan: 'Susu UHT Cokelat 200ml', status: 'Akan Datang' as const },
    { id: 'w2d5', minggu: 'Minggu 2', hari: 'Jumat',  tanggal: '22 Agustus 2026', karbohidrat: 'Nasi Putih',        protein: 'Rendang Daging',             sayur: 'Sayur Asem',           buah: 'Jeruk Nipis',   tambahan: 'Susu UHT Plain 200ml',   status: 'Akan Datang' as const },
  ]);

  // School list state
  const [schools, setSchools] = useState([
    { 
      id: 'sch-01',
      nama: 'SDN 1 Parepare', 
      lokasi: 'Kec. Ujung, Kota Parepare', 
      siswa: 450, 
      kontrak: '450 Porsi / Hari (Jam 07:00)',
      daftarSiswa: [
        { nama: 'Ahmad Raihan', nisn: '0012345678', kelas: '4A', alergi: '-' },
        { nama: 'Budi Santoso', nisn: '0012345679', kelas: '4A', alergi: 'Kacang' },
        { nama: 'Citra Kirana', nisn: '0012345680', kelas: '4B', alergi: '-' },
      ]
    },
    { 
      id: 'sch-02',
      nama: 'SDN 5 Parepare', 
      lokasi: 'Kec. Bacukiki, Kota Parepare', 
      siswa: 380, 
      kontrak: '380 Porsi / Hari (Jam 07:30)',
      daftarSiswa: [
        { nama: 'Dian Safitri', nisn: '0012345690', kelas: '5A', alergi: 'Seafood' },
        { nama: 'Eko Prasetyo', nisn: '0012345691', kelas: '5B', alergi: '-' },
        { nama: 'Fahri Hamzah', nisn: '0012345692', kelas: '5B', alergi: '-' },
      ]
    },
    { 
      id: 'sch-03',
      nama: 'MTs Negeri Parepare', 
      lokasi: 'Kec. Soreang, Kota Parepare', 
      siswa: 420, 
      kontrak: '420 Porsi / Hari (Jam 08:00)',
      daftarSiswa: [
        { nama: 'Gita Gutawa', nisn: '0012345701', kelas: '7A', alergi: '-' },
        { nama: 'Hendra Setiawan', nisn: '0012345702', kelas: '7B', alergi: 'Telur' },
        { nama: 'Indah Permata', nisn: '0012345703', kelas: '9C', alergi: '-' },
      ]
    },
  ]);

  // Modal states for adding a school
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolAddress, setNewSchoolAddress] = useState('');
  const [newSchoolStudentsCount, setNewSchoolStudentsCount] = useState('');
  const [newSchoolDeliveryTime, setNewSchoolDeliveryTime] = useState('07:00');

  const handleAddSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName || !newSchoolAddress || !newSchoolStudentsCount) return;

    const studentCount = parseInt(newSchoolStudentsCount) || 0;
    const newId = `sch-${String(schools.length + 1).padStart(2, '0')}`;
    
    // Generate some random names for mock students
    const mockStudentNames = [
      ['Rafi Ahmad', 'Aditya Putra', 'Siti Aminah'],
      ['Zaki Mubarak', 'Nabila Putri', 'Fajar Ramadhan'],
      ['Keke Anastasia', 'Rian Hidayat', 'Dwi Cahyo']
    ];
    const setIndex = Math.floor(Math.random() * mockStudentNames.length);
    const selectedMockNames = mockStudentNames[setIndex];

    const newSchool = {
      id: newId,
      nama: newSchoolName,
      lokasi: newSchoolAddress,
      siswa: studentCount,
      kontrak: `${studentCount} Porsi / Hari (Jam ${newSchoolDeliveryTime})`,
      daftarSiswa: [
        { nama: selectedMockNames[0], nisn: `00${Math.floor(10000000 + Math.random() * 90000000)}`, kelas: '4A', alergi: '-' },
        { nama: selectedMockNames[1], nisn: `00${Math.floor(10000000 + Math.random() * 90000000)}`, kelas: '4B', alergi: 'Kacang' },
        { nama: selectedMockNames[2], nisn: `00${Math.floor(10000000 + Math.random() * 90000000)}`, kelas: '4C', alergi: '-' },
      ]
    };

    setSchools(prev => [...prev, newSchool]);
    
    // Reset form & close modal
    setNewSchoolName('');
    setNewSchoolAddress('');
    setNewSchoolStudentsCount('');
    setNewSchoolDeliveryTime('07:00');
    setIsAddModalOpen(false);
  };

  const handleOcr = () => {
    setOcrState('processing');
    setTimeout(() => {
      setOcrState('done');
      setOcrResult({
        noSurat: 'SPPG/LOC/DKI/2026-042',
        penerbit: 'Badan Gizi Nasional (BGN)',
        masaBerlaku: '12 Agustus 2031',
        status: 'valid',
      });
    }, 2000);
  };

  const handleOcrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrState('processing');
    setTimeout(() => {
      setOcrState('done');
      const fakeRegNo = `REG-${Math.floor(100000 + Math.random() * 900000)}`;
      setOcrResult({
        noSurat: fakeRegNo,
        penerbit: 'Kementerian Terkait / BGN',
        masaBerlaku: 'Seumur Hidup / Berlaku',
        status: 'valid',
      });
      
      // Update global vendor state & local loggedInVendor status to "Menunggu Verifikasi"
      if (updateVendorDocuments && loggedInVendor) {
        updateVendorDocuments(loggedInVendor.id, selectedDocKey, 'Menunggu Verifikasi', file.name);
      }
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

  // --- Upload time restriction for Live Guard ---
  // Allowed windows: 02:00–03:00 (subuh) and 10:00–11:00
  const UPLOAD_WINDOWS = [
    { label: '02.00 – 03.00', startHour: 2, endHour: 3 },
    { label: '10.00 – 11.00', startHour: 10, endHour: 11 },
  ];

  const isUploadAllowed = (): boolean => {
    const now = new Date();
    const h = now.getHours();
    return UPLOAD_WINDOWS.some(w => h >= w.startHour && h < w.endHour);
  };

  const getNextWindow = (): string => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    for (const w of UPLOAD_WINDOWS) {
      if (h < w.startHour || (h === w.startHour && m === 0)) {
        return w.label;
      }
    }
    return UPLOAD_WINDOWS[0].label + ' (besok)';
  };

  const breadcrumb = activeSubView === 'dashboard' ? 'Dashboard'
    : activeSubView === 'licensing' ? 'Perizinan (NIB)'
    : activeSubView === 'delivery-history' ? 'Riwayat Pengiriman'
    : activeSubView === 'hygiene' ? 'Live Guard Monitoring'
    : activeSubView === 'schools' ? 'Manajemen Sekolah'
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
        <h1 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">{loggedInVendor?.nama || 'CV. Dapur Nusantara Sejahtera'}</h1>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">

      {/* --- SCHOOL MANAGEMENT VIEW --- */}
      {activeSubView === 'schools' && (
        <div className="space-y-6 pb-6">
          {/* Data Penerima Agregat Card Section */}
          <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-blue-800">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-blue-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider bg-blue-500/30 text-blue-200 px-2.5 py-0.5 rounded border border-blue-400/30">
                    Data Penerima (Agregat Nasional)
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">Privasi Terjaga (Tanpa Nama Individu)</span>
                </div>
                <h2 className="text-xl font-heading font-bold text-white mt-1">Ringkasan Penerima Manfaat & Diet Khusus</h2>
              </div>
              <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi Sistem BGN
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                <div className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mb-1">Jumlah Penerima</div>
                <div className="text-2xl font-mono font-bold text-white">1.250 <span className="text-xs font-normal text-blue-200">Siswa</span></div>
                <div className="text-[10px] text-slate-300 mt-1">Total Kuota Kontrak</div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                <div className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mb-1">Jumlah Siswa Hadir</div>
                <div className="text-2xl font-mono font-bold text-emerald-400">1.215 <span className="text-xs font-normal text-emerald-200">Siswa</span></div>
                <div className="text-[10px] text-slate-300 mt-1">Absensi Harian Terverifikasi</div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                <div className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mb-1">Jumlah Porsi Disiapkan</div>
                <div className="text-2xl font-mono font-bold text-cyan-300">1.250 <span className="text-xs font-normal text-cyan-200">Porsi</span></div>
                <div className="text-[10px] text-slate-300 mt-1">Sesuai Rencana Masak</div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider mb-1">Diet Khusus / Alergi</div>
                <div className="text-2xl font-mono font-bold text-amber-400">20 <span className="text-xs font-normal text-amber-200">Siswa</span></div>
                <div className="text-[10px] text-amber-200/80 mt-1">12 Kacang, 5 Seafood, 3 Laktosa</div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                <div className="text-[10px] text-orange-300 font-bold uppercase tracking-wider mb-1">Selisih Porsi</div>
                <div className="text-2xl font-mono font-bold text-orange-400">35 <span className="text-xs font-normal text-orange-200">Porsi</span></div>
                <div className="text-[10px] text-slate-300 mt-1">Direncanakan vs Diterima</div>
              </div>
            </div>
          </div>

          {/* School Table with Route & Delivery Confirmation */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" /> Manajemen Sekolah & Rute Pengiriman
                </h2>
                <p className="text-xs text-slate-500 mt-1">Pengaturan rute armada, jadwal jam tiba, dan status konfirmasi penerimaan BAP.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
                  Total Terlayani: {schools.length} Sekolah ({schools.reduce((acc, curr) => acc + curr.siswa, 0).toLocaleString('id-ID')} Siswa)
                </div>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Sekolah
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-5">Nama Sekolah</th>
                    <th className="py-3.5 px-5">Alamat & Rute Armada</th>
                    <th className="py-3.5 px-5 text-center">Jumlah Siswa</th>
                    <th className="py-3.5 px-5">Jadwal & Waktu Pengiriman</th>
                    <th className="py-3.5 px-5">Konfirmasi Penerimaan (BAP)</th>
                    <th className="py-3.5 px-5">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schools.map((school, idx) => (
                    <tr key={school.id} className="hover:bg-slate-50">
                      <td className="py-4 px-5 font-bold text-slate-800">
                        <div>{school.nama}</div>
                        <div className="text-[10px] text-slate-400 font-mono font-medium">{school.id}</div>
                      </td>
                      <td className="py-4 px-5 text-slate-600">
                        <div className="font-medium text-xs">{school.lokasi}</div>
                        <div className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded w-max mt-1 border border-indigo-100">
                          📍 Rute Armada {idx === 0 ? 'A (Parepare Utara)' : idx === 1 ? 'B (Parepare Barat)' : 'C (Parepare Selatan)'}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-center font-mono font-bold text-blue-600 text-base">{school.siswa}</td>
                      <td className="py-4 px-5 text-xs text-slate-600 font-medium">
                        <div>{school.kontrak}</div>
                        <div className="text-[10px] text-slate-400">Estimasi Tiba: 25 Menit</div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg uppercase">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> BAP Terkonfirmasi
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <button
                          onClick={() => setSelectedSchoolForDetail(school)}
                          className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          Detail Siswa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Aduan Sekolah Aktif */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" /> Aduan Sekolah Mitra (Aktif)
              </h3>
              <span className="text-xs text-slate-500 font-medium">1 Aduan Perlu Ditindaklanjuti</span>
            </div>
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-900">SDN 5 Parepare</span>
                  <span className="text-[10px] font-bold bg-amber-200 text-amber-800 px-2 py-0.5 rounded">Sedang Ditangani</span>
                </div>
                <p className="text-xs text-slate-700">"Nasi agak kurang hangat pada pengiriman jam 07:30."</p>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">Dilaporkan: Hari ini 08:10 WITA oleh Kepala Sekolah</div>
              </div>
              <button 
                onClick={() => alert('Tindak lanjut dikirim ke tim dapur untuk sterilisasi box thermal pengiriman.')}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm shrink-0"
              >
                Kirim Tanggapan
              </button>
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
                  { sekolah: 'SDN 1 Parepare', porsi: 450, jam: '07:00', status: 'Selesai', statusColor: 'emerald' },
                  { sekolah: 'SDN 5 Parepare', porsi: 380, jam: '07:30', status: 'Selesai', statusColor: 'emerald' },
                  { sekolah: 'MTs Negeri Parepare', porsi: 420, jam: '08:00', status: 'Dalam Perjalanan', statusColor: 'blue' },
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

            {/* BARCODE MOBIL ARMADA / CETAK STIKER QR MENU HARI INI */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-xl shadow-md p-6 border border-blue-800">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-white/10 rounded-2xl border border-white/20 shrink-0">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin + '/?qr=menu' : '')}&bgcolor=ffffff&color=1e3a8a&margin=8`}
                      alt="QR Barcode Mobil Distribusi"
                      width={100}
                      height={100}
                      className="rounded-lg shadow"
                    />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase tracking-wider mb-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      QR Barcode Mobil Armada Distribusi
                    </div>
                    <h3 className="text-lg font-heading font-bold text-white">Stiker Transparansi Menu Harian</h3>
                    <p className="text-xs text-blue-200 mt-1 max-w-xl leading-relaxed">
                      Wajib ditempel di bodi / kaca mobil armada pengiriman. Saat publik atau pihak sekolah meng-scan barcode ini dengan kamera HP, menu makanan hari ini akan langsung ditampilkan secara otomatis secara real-time.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full md:w-auto">
                  <button
                    onClick={() => {
                      const origin = typeof window !== 'undefined' ? window.location.origin : '';
                      const targetUrl = `${origin}/?qr=menu`;
                      const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(targetUrl)}&bgcolor=ffffff&color=1e3a8a&margin=12`;
                      const a = document.createElement('a');
                      a.href = qrApi;
                      a.download = `Stiker_QR_Mobil_Armada_SPPG.png`;
                      a.target = '_blank';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                    className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow"
                  >
                    <Upload className="w-4 h-4 rotate-180" />
                    Download Stiker QR (.PNG)
                  </button>

                  <button
                    onClick={() => {
                      const origin = typeof window !== 'undefined' ? window.location.origin : '';
                      const targetUrl = `${origin}/?qr=menu`;
                      const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(targetUrl)}&bgcolor=ffffff&color=1e3a8a&margin=10`;
                      const printWin = window.open('', '_blank');
                      if (printWin) {
                        printWin.document.write(`
                          <html>
                            <head>
                              <title>Cetak Stiker QR Mobil - ${loggedInVendor?.nama || 'SPPG'}</title>
                              <style>
                                body { font-family: sans-serif; text-align: center; padding: 40px; background: #f8fafc; }
                                .box { border: 4px solid #1e3a8a; padding: 30px; border-radius: 24px; max-width: 380px; margin: 0 auto; background: white; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
                                h2 { color: #1e3a8a; font-size: 20px; margin-bottom: 4px; font-weight: 800; }
                                p { color: #64748b; font-size: 11px; margin-top: 0; font-weight: bold; tracking: wide; }
                                img { border-radius: 12px; margin: 15px 0; border: 2px solid #e2e8f0; }
                                .vendor { font-size: 13px; font-weight: 800; color: #0f172a; margin-top: 5px; }
                                .footer { font-size: 10px; font-weight: bold; color: #0284c7; margin-top: 15px; letter-spacing: 1px; }
                              </style>
                            </head>
                            <body>
                              <div class="box">
                                <h2>TRANSPARANSI MENU MBG</h2>
                                <p>SCAN UNTUK LIHAT MENU HARI INI</p>
                                <img src="${qrApi}" width="260" height="260" />
                                <div class="vendor">${loggedInVendor?.nama || 'CV. DAPUR NUSANTARA SEJAHTERA'}</div>
                                <div class="footer">BADAN GIZI NASIONAL RI • KAWAL MBG</div>
                              </div>
                              <script>window.onload = () => { window.print(); }</script>
                            </body>
                          </html>
                        `);
                        printWin.document.close();
                      }
                    }}
                    className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Cetak Ukuran Stiker (Print/PDF)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LICENSING */}
        {activeSubView === 'licensing' && (
          <div className="w-full space-y-6 pb-6">
            {/* Pending Activation Banner if vendor is not fully verified */}
            {loggedInVendor?.statusVerifikasi === 'Pending' && (
              <div className="bg-amber-50 border-2 border-amber-300 text-amber-900 p-5 rounded-2xl flex items-start gap-4 shadow-sm animate-pulse">
                <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-heading font-bold text-base">⚠️ Akun Belum Aktif (Pending Approval BGN)</h3>
                  <p className="text-xs text-amber-800 mt-1 font-semibold leading-relaxed">
                    Dapur Anda sedang berada dalam tahap peninjauan. Anda masih dapat mengunggah berkas di bawah ini. Akun akan berfungsi penuh menerima alokasi dana dan melayani sekolah setelah BGN Pusat memverifikasi ke-7 dokumen ini.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-600" /> Syarat Verifikasi Penerbitan SPPG (OCR Document Extraction)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Lengkapi & perbarui dokumen persyaratan wajib di bawah untuk memproses verifikasi penerbitan izin SPPG Anda.</p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                  7 Dokumen Wajib
                </span>
              </div>

              {/* Hidden file input for triggering uploads per row */}
              <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.jpg,.png" onChange={handleOcrUpload} />

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 w-12 text-center">No</th>
                      <th className="py-3 px-4">Nama Dokumen Persyaratan</th>
                      <th className="py-3 px-4">File Berkas & Masa Berlaku</th>
                      <th className="py-3 px-4">Status & Reminder</th>
                      <th className="py-3 px-4 text-center">Perbarui Berkas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { key: 'slhs', name: 'SLHS (Sertifikat Laik Higiene Sanitasi)', desc: 'Sertifikat Kelayakan Sanitasi Dapur BGN / Dinkes', expired: '12 Ags 2031 (Reminder: H-30)' },
                      { key: 'akta', name: 'Akta Pendirian Badan Usaha', desc: 'Surat Akta Notaris Pendirian PT/CV', expired: 'Seumur Hidup' },
                      { key: 'nib', name: 'Nomor Induk Berusaha (NIB)', desc: 'Izin Usaha Berbasis Risiko OSS RBA', expired: 'Aktif / Permanen' },
                      { key: 'npwp', name: 'Nomor Pokok Wajib Pajak (NPWP)', desc: 'Kartu / Surat Keterangan NPWP Badan', expired: 'Tervalidasi Pajak' },
                      { key: 'proposal', name: 'Proposal Kerja Sama Dapur', desc: 'Proposal Kesiapan Dapur Pelayanan SPPG', expired: 'Revisi Tahunan' },
                      { key: 'logo', name: 'Logo Resmi Mitra SPPG', desc: 'Logo Resmi Badan Usaha / Dapur', expired: 'Aktif' },
                      { key: 'kontak', name: 'NIK & KTP Penanggung Jawab', desc: 'KTP & Kontak Perwakilan Dapur SPPG', expired: 'Aktif Tervalidasi' },
                      { key: 'lokasi', name: 'Lokasi & Kesiapan Bangunan', desc: 'Denah, Sertifikat & Geotagging Dapur', expired: 'Verifikasi Fisik BGN' },
                    ].map((item, idx) => {
                      const docData = loggedInVendor?.dokumenPersyaratan?.[item.key];
                      const docStatus = docData ? docData.status : 'Terverifikasi';
                      const docColor = docStatus === 'Terverifikasi' ? 'emerald' : docStatus === 'Menunggu Verifikasi' ? 'blue' : 'amber';
                      const fileName = docData?.namaFile || `${item.key}_berkas_resmi_v1.pdf`;

                      return (
                        <tr key={item.key} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4 text-center font-bold text-slate-500">{idx + 1}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                              {item.key === 'slhs' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                              {item.name}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                              <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              <span className="truncate max-w-[180px]" title={fileName}>{fileName}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5 font-sans font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" /> Masa Berlaku: <b className="text-slate-700">{item.expired}</b>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border
                              ${docColor === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                docColor === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                'bg-amber-50 text-amber-700 border-amber-200'}`}>
                              {docStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => {
                                setSelectedDocKey(item.key);
                                fileInputRef.current?.click();
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 text-blue-600 hover:text-white text-xs font-bold rounded-lg transition-all shadow-sm"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              Perbarui Berkas
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Riwayat Verifikasi Dokumen */}
              <div className="p-5 border-t border-slate-200 bg-slate-50/60">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" /> Riwayat Verifikasi Dokumen Smart Licensing
                </div>
                <div className="space-y-2">
                  {[
                    { waktu: '12 Ags 2026 - 14:20 WITA', ket: 'SLHS & NIB diaudit ulang oleh sistem OCR BGN — Hasil: Valid (100%)', status: 'Disahkan' },
                    { waktu: '10 Jul 2026 - 09:15 WITA', ket: 'Verifikasi Fisik Dapur oleh Tim Satgas BGN Parepare — Hasil: Lolos Verifikasi Lapangan', status: 'Selesai' },
                    { waktu: '15 Jan 2026 - 11:00 WITA', ket: 'Pendaftaran Awal Berkas Kemitraan SPPG Parepare', status: 'Terverifikasi' },
                  ].map((log, i) => (
                    <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-slate-400 font-bold">{log.waktu}</span>
                        <span className="text-slate-700 font-medium">{log.ket}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{log.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Processing or OCR Result indicator under the table */}
              {ocrState === 'processing' && (
                <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Mengekstrak Data OCR &amp; Memperbarui Berkas...</div>
                </div>
              )}

              {ocrState === 'done' && ocrResult && (
                <div className="p-6 border-t border-slate-100 bg-emerald-50/70 animate-in fade-in duration-300">
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Dokumen Berhasil Diperbarui &amp; Diverifikasi (OCR Document Extraction)
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-emerald-200 shadow-sm">
                    {[
                      ['Nomor Registrasi', ocrResult.noSurat],
                      ['Penerbit Dokumen', ocrResult.penerbit],
                      ['Masa Berlaku', ocrResult.masaBerlaku],
                      ['Sumber Validasi', 'Sistem Informasi BGN / OSS'],
                    ].map(([l, v]) => (
                      <div key={l}>
                        <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">{l}</div>
                        <div className="text-slate-900 font-bold text-xs">{v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Verification Metrics Additions */}
                  <div className="mt-4 pt-4 border-t border-emerald-200/50">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Hasil Analisis Document Verification</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-white/80 p-3 rounded-lg border border-emerald-100 shadow-sm">
                        <div className="text-[10px] text-emerald-600 font-bold uppercase mb-1 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Confidence Score
                        </div>
                        <div className="text-lg font-mono font-bold text-slate-800">99.1%</div>
                        <div className="text-[9px] text-slate-500 mt-1">Akurasi pembacaan karakter OCR tingkat tinggi.</div>
                      </div>
                      <div className="bg-white/80 p-3 rounded-lg border border-emerald-100 shadow-sm">
                        <div className="text-[10px] text-emerald-600 font-bold uppercase mb-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Status Keaslian
                        </div>
                        <div className="text-xs font-bold text-emerald-700">Valid &amp; Terverifikasi</div>
                        <div className="text-[9px] text-slate-500 mt-1">Sesuai dengan database master OSS &amp; BGN.</div>
                      </div>
                      <div className="bg-white/80 p-3 rounded-lg border border-emerald-100 shadow-sm">
                        <div className="text-[10px] text-emerald-600 font-bold uppercase mb-1 flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Conventional Audit Log ID
                        </div>
                        <div className="text-xs font-mono font-bold text-slate-700 truncate" title="LOG-20260812-8819-VERIFIED">LOG-20260812-8819</div>
                        <div className="text-[9px] text-slate-500 mt-1">Audit log tercatat di database resmi BGN.</div>
                      </div>
                    </div>
                    <div className="mt-3 bg-white/80 p-3 rounded-lg border border-emerald-100 flex items-start gap-2 text-xs">
                      <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] text-blue-800 font-bold uppercase mb-0.5">Catatan Verifikasi Dokumen</div>
                        <div className="text-slate-700 font-medium">Dokumen berhasil diperbarui dan disinkronisasi ke sistem BGN. Foto kesiapan bangunan terverifikasi memiliki kapasitas memadai untuk melayani target porsi harian.</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => {
                        setOcrState('idle');
                        setOcrResult(null);
                      }} 
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-lg transition-colors"
                    >
                      Tutup Notifikasi Verifikasi
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* NUTRITION CENTER */}
        {activeSubView === 'nutrition' && (
          <div className="flex flex-col gap-6 pb-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Planned Menu */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">1. Jadwal Menu Gizi Nasional</h2>
                  <p className="text-xs text-slate-500 mt-1">Siklus menu ditetapkan BGN Pusat (Rotasi 2 Kali Seminggu).</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                  Siklus Aktif
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Cycle Selector Buttons */}
                  <div className="flex gap-2 mb-5 p-1 bg-slate-100 rounded-lg border border-slate-200">
                    <button
                      onClick={() => {
                        setMenuSiklus('siklus1');
                        setNutritionState('idle');
                      }}
                      className={`flex-1 py-2 text-center text-xs font-bold rounded-md transition-all ${
                        menuSiklus === 'siklus1'
                          ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🗓️ Siklus 1 – Minggu Pertama
                    </button>
                    <button
                      onClick={() => {
                        setMenuSiklus('siklus2');
                        setNutritionState('idle');
                      }}
                      className={`flex-1 py-2 text-center text-xs font-bold rounded-md transition-all ${
                        menuSiklus === 'siklus2'
                          ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🗓️ Siklus 2 – Minggu Kedua
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(menuSiklus === 'siklus1' ? [
                      { name: menuScheduleData[0].karbohidrat, type: 'Karbohidrat Utama', dot: 'bg-blue-500' },
                      { name: menuScheduleData[0].protein,     type: 'Protein Hewani',    dot: 'bg-blue-500' },
                      { name: menuScheduleData[0].sayur,       type: 'Serat & Vitamin',   dot: 'bg-blue-500' },
                      { name: menuScheduleData[0].buah,        type: 'Suplemen & Kalium', dot: 'bg-blue-500' },
                      { name: menuScheduleData[0].tambahan,    type: 'Kalsium Tambahan',  dot: 'bg-blue-500' },
                    ] : [
                      { name: menuScheduleData[5].karbohidrat, type: 'Karbohidrat Utama', dot: 'bg-emerald-500' },
                      { name: menuScheduleData[5].protein,     type: 'Protein Hewani',    dot: 'bg-emerald-500' },
                      { name: menuScheduleData[5].sayur,       type: 'Serat & Vitamin',   dot: 'bg-emerald-500' },
                      { name: menuScheduleData[5].buah,        type: 'Suplemen & Kalium', dot: 'bg-emerald-500' },
                      { name: menuScheduleData[5].tambahan,    type: 'Kalsium Tambahan',  dot: 'bg-emerald-500' },
                    ]).map((item) => (
                      <div key={item.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200/60 hover:bg-slate-100/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${item.dot} shrink-0`}></div>
                          <span className="text-sm font-bold text-slate-700">{item.name}</span>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{item.type}</span>
                      </div>
                    ))}
                  </div>

                  {/* Adjustment Request Button and Pending Display */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
                    {pendingAdjustment ? (
                      <div className={`p-3 rounded-lg border text-xs font-semibold flex items-center justify-between ${
                        pendingAdjustment.status === 'Pending'
                          ? 'bg-amber-50 border-amber-200 text-amber-700'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      }`}>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 shrink-0" />
                          <div>
                            <span className="font-bold">Ajuan Penyesuaian Lokal:</span>
                            <div className="font-normal mt-0.5">
                              {pendingAdjustment.original} ➔ <span className="font-bold text-slate-800">{pendingAdjustment.replacement}</span>
                            </div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] tracking-wider border bg-white shadow-sm">
                          {pendingAdjustment.status === 'Pending' ? 'Menunggu Persetujuan BGN' : 'Disetujui'}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsAdjustmentModalOpen(true)}
                        className="w-full py-2 bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 rounded-lg text-xs font-bold transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Ajukan Penyesuaian Menu (Local Swap)
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-5 p-3.5 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700 font-semibold leading-relaxed">
                  💡 <strong>Informasi Siklus Menu:</strong> Menu berganti otomatis setiap 2 kali seminggu untuk memenuhi standar AKG (Angka Kecukupan Gizi) nasional BGN. Harap sesuaikan bahan baku harian dapur Anda.
                </div>
              </div>
            </div>

            {/* Upload & Nutrition Result */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">2. Upload Foto &amp; Nutrition Analysis</h2>
                <p className="text-xs text-slate-500 mt-1">Sistem memverifikasi <strong>Component Completeness</strong> (keberadaan tiap komponen).</p>
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
                      {nutritionState === 'uploading' ? 'Mengunggah Foto...' : 'Menganalisis Komponen Gizi...'}
                    </div>
                  </div>
                )}
                {nutritionState === 'done' && (
                  <div className="flex-1 flex flex-col gap-4">
                    <div className={`flex items-center justify-between p-4 rounded-xl border ${
                      menuSiklus === 'siklus1' ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
                    }`}>
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Component Completeness</div>
                        <div className={`text-3xl font-mono font-bold ${
                          menuSiklus === 'siklus1' ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          {menuSiklus === 'siklus1' ? '80%' : '100%'}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-lg font-bold text-xs uppercase border ${
                        menuSiklus === 'siklus1' 
                          ? 'bg-amber-100 text-amber-700 border-amber-200' 
                          : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}>
                        {menuSiklus === 'siklus1' ? 'Needs Review' : 'Verified & Lengkap'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Hasil Analisis Komponen Gizi:</div>
                      {menuSiklus === 'siklus1' ? (
                        <>
                          <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-2.5 rounded-lg border border-emerald-100">
                            <CheckSquare className="w-4 h-4 shrink-0 text-emerald-600" /> Nasi Putih, Telur Dadar, Sayur Sop, Susu UHT — Terdeteksi ✓
                          </div>
                          <div className="flex items-center gap-2 text-sm font-bold text-red-700 bg-red-50 px-3 py-2.5 rounded-lg border border-red-100">
                            <XCircle className="w-4 h-4 shrink-0 text-red-600" /> Buah Pisang — Tidak Ditemukan ✗
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-2.5 rounded-lg border border-emerald-100">
                          <CheckSquare className="w-4 h-4 shrink-0 text-emerald-600" /> Nasi Merah, Ayam Fillet, Tumis Wortel/Buncis, Buah Apel, Susu Cokelat — Lengkap Terdeteksi ✓
                        </div>
                      )}
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

          {/* ====== NEW: Jadwal Menu Dua Mingguan – full-width card ====== */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" /> 3. Jadwal Menu Dua Mingguan
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Daftar menu makan bergizi yang berlaku selama dua minggu, mulai Senin hingga Jumat.
                </p>
              </div>
              <span className="self-start sm:self-center text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase whitespace-nowrap">
                Siklus Aktif
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left" style={{ minWidth: '900px' }}>
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 whitespace-nowrap">Minggu</th>
                    <th className="py-3 px-4 whitespace-nowrap">Hari</th>
                    <th className="py-3 px-4 whitespace-nowrap">Tanggal</th>
                    <th className="py-3 px-4 whitespace-nowrap">Karbohidrat</th>
                    <th className="py-3 px-4 whitespace-nowrap">Protein</th>
                    <th className="py-3 px-4 whitespace-nowrap">Sayur</th>
                    <th className="py-3 px-4 whitespace-nowrap">Buah</th>
                    <th className="py-3 px-4 whitespace-nowrap">Tambahan</th>
                    <th className="py-3 px-4 whitespace-nowrap">Status</th>
                    <th className="py-3 px-4 whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {menuScheduleData.map((row, idx) => {
                    const isFirstOfGroup = idx === 0 || menuScheduleData[idx - 1].minggu !== row.minggu;
                    const groupRows = menuScheduleData.filter(r => r.minggu === row.minggu).length;
                    const statusBadge =
                      row.status === 'Aktif'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : row.status === 'Selesai'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200';
                    return (
                      <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                        {isFirstOfGroup && (
                          <td
                            rowSpan={groupRows}
                            className="py-3 px-4 font-bold text-slate-800 align-middle border-r border-slate-100 bg-slate-50/60 whitespace-nowrap"
                          >
                            <span className="inline-flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full shrink-0 ${ row.minggu === 'Minggu 1' ? 'bg-blue-500' : 'bg-emerald-500' }`}></span>
                              {row.minggu}
                            </span>
                          </td>
                        )}
                        <td className="py-3 px-4 font-bold text-slate-700 whitespace-nowrap">{row.hari}</td>
                        <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">{row.tanggal}</td>
                        <td className="py-3 px-4 text-slate-700">{row.karbohidrat}</td>
                        <td className="py-3 px-4 text-slate-700">{row.protein}</td>
                        <td className="py-3 px-4 text-slate-700">{row.sayur}</td>
                        <td className="py-3 px-4 text-slate-700">{row.buah}</td>
                        <td className="py-3 px-4 text-slate-700">{row.tambahan}</td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${statusBadge}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                              onClick={() => alert(`Detail menu ${row.hari}, ${row.tanggal}`)}
                            >
                              Lihat Detail
                            </button>
                            <button
                              className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-600 hover:text-white transition-colors"
                              onClick={() => {
                                const newKarbo = prompt(`Ubah Karbohidrat untuk ${row.hari} (${row.tanggal}):`, row.karbohidrat);
                                if (newKarbo !== null) {
                                  setMenuScheduleData(prev => prev.map(r => r.id === row.id ? { ...r, karbohidrat: newKarbo } : r));
                                }
                              }}
                            >
                              Ubah Menu
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {/* ====== END: Jadwal Menu Dua Mingguan ====== */}

          </div>
        )}

        {/* HYGIENE COMPLIANCE / LIVE GUARD */}
        {activeSubView === 'hygiene' && (
          <div className="w-full space-y-6 pb-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Camera className="w-4 h-4 text-blue-600" /> Inspeksi Higiene Dapur (Photo Compliance Check)
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Upload foto/video dapur operasional harian. Sistem memverifikasi penggunaan APD dan standar kebersihan.</p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Jam Upload Diizinkan</div>
                    {UPLOAD_WINDOWS.map(w => (
                      <span key={w.label} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                        isUploadAllowed() && new Date().getHours() >= w.startHour && new Date().getHours() < w.endHour
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {w.label}
                        {isUploadAllowed() && new Date().getHours() >= w.startHour && new Date().getHours() < w.endHour && (
                          <span className="ml-1 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 flex flex-col md:flex-row gap-6">
                {hygieneState === 'idle' && (
                  isUploadAllowed() ? (
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
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-[220px] bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 rounded-full bg-slate-100 border border-slate-200">
                          <Lock className="w-7 h-7 text-slate-400" />
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold text-slate-700 uppercase tracking-wider">Upload Foto Terkunci</div>
                          <div className="text-[11px] text-slate-500 mt-1 max-w-[260px] leading-relaxed">
                            Upload hanya diizinkan pada jam operasional yang ditentukan BGN.
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 w-full max-w-[240px]">
                          {UPLOAD_WINDOWS.map(w => (
                            <div key={w.label} className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-white border border-slate-200 shadow-sm">
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                <Clock className="w-3.5 h-3.5 text-blue-500" />
                                {w.label}
                              </div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Diizinkan</span>
                            </div>
                          ))}
                        </div>
                        <div className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg">
                          ⏰ Jadwal berikutnya: <span className="font-bold">{getNextWindow()}</span>
                        </div>
                      </div>
                    </div>
                  )
                )}
                {(hygieneState === 'uploading' || hygieneState === 'analyzing') && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-slate-50 rounded-xl border border-slate-200 min-h-[200px]">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <div className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                      {hygieneState === 'uploading' ? 'Mengunggah Dokumentasi...' : 'Menganalisis Kepatuhan Higiene...'}
                    </div>
                  </div>
                )}
                {hygieneState === 'done' && (
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div>
                        <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">Skor Kepatuhan Higiene</div>
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

        {/* DISTRIBUSI MAKANAN */}
        {activeSubView === 'delivery-history' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden space-y-6">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" /> Distribusi Makanan & Pelacakan Armada
                </h2>
                <p className="text-xs text-slate-500 mt-1">Jadwal pengiriman harian, sekolah tujuan, menu, waktu pengiriman, & status penerimaan BAP.</p>
              </div>
              <button className="px-3 py-1.5 bg-white border border-slate-300 text-xs font-bold text-slate-700 rounded-lg hover:bg-slate-50 shadow-sm flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" /> Export Laporan PDF
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-5">Jadwal & Tanggal</th>
                    <th className="py-3.5 px-5">Sekolah Tujuan</th>
                    <th className="py-3.5 px-5">Menu yang Disajikan</th>
                    <th className="py-3.5 px-5">Jumlah Porsi</th>
                    <th className="py-3.5 px-5">Waktu Pengiriman</th>
                    <th className="py-3.5 px-5">Status Pengiriman</th>
                    <th className="py-3.5 px-5">QR Transparansi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { date: '12 Agustus 2026', school: 'SDN 1 Parepare', menu: 'Nasi Putih, Ayam Fillet, Tumis Bayam, Pisang, Susu', qty: 450, time: '06:45 WITA (Tiba 07:00)', status: 'Diterima', color: 'emerald' },
                    { date: '12 Agustus 2026', school: 'SDN 5 Parepare', menu: 'Nasi Putih, Ayam Fillet, Tumis Bayam, Pisang, Susu', qty: 380, time: '07:15 WITA (Tiba 07:30)', status: 'Diterima', color: 'emerald' },
                    { date: '12 Agustus 2026', school: 'MTs Negeri Parepare', menu: 'Nasi Putih, Ayam Fillet, Tumis Bayam, Pisang, Susu', qty: 420, time: '07:50 WITA (Tiba 08:05)', status: 'Terkirim', color: 'blue' },
                    { date: '11 Agustus 2026', school: 'SDN 1 Parepare', menu: 'Nasi Merah, Ikan Bakar, Sayur Sop, Apel, Susu', qty: 450, time: '07:10 WITA (Jadwal 07:00)', status: 'Terlambat', color: 'amber' },
                    { date: '10 Agustus 2026', school: 'SDN 5 Parepare', menu: 'Nasi Kuning, Tempe, Sayur Asem, Semangka', qty: 380, time: '08:30 WITA (Laporan Porsi kurang)', status: 'Bermasalah', color: 'red' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-5 font-mono text-xs text-slate-500">{row.date}</td>
                      <td className="py-3.5 px-5 font-bold text-slate-800">{row.school}</td>
                      <td className="py-3.5 px-5 text-xs text-slate-600 max-w-xs">{row.menu}</td>
                      <td className="py-3.5 px-5 text-sm font-bold text-slate-900">{row.qty} <span className="font-normal text-slate-500 text-xs">Porsi</span></td>
                      <td className="py-3.5 px-5 text-xs font-mono text-slate-700">{row.time}</td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${
                          row.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          row.color === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          row.color === 'amber' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {row.status === 'Diterima' ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> :
                           row.status === 'Terkirim' ? <Clock className="w-3 h-3 text-blue-600" /> :
                           row.status === 'Terlambat' ? <AlertCircle className="w-3 h-3 text-amber-600" /> :
                           <XCircle className="w-3 h-3 text-red-600" />}
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <button 
                          onClick={() => alert(`Stiker QR Transparansi BGN untuk ${row.school} (${row.qty} porsi) siap dicetak. Berisi Identitas SPPG, Menu, Waktu Distribusi, Status Higiene & Form Feedback Publik.`)}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-[11px] font-bold flex items-center gap-1 transition-colors"
                        >
                          <QrCode className="w-3.5 h-3.5" /> Cetak Stiker QR
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BUDGET COMPLIANCE SUB-VIEW */}
        {activeSubView === 'budget' && (
          <div className="space-y-6 pb-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">Budget Compliance Dashboard</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Evaluasi efisiensi anggaran per porsi vs acuan ketentuan BGN (Batas Maksimum Rp 15.000 / porsi).
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Status: Sesuai Ketentuan Regulator
              </span>
            </div>

            {/* Budget KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Porsi Bulanan</div>
                <div className="text-2xl font-mono font-bold text-slate-900">37.500 <span className="text-xs font-sans font-normal text-slate-500">porsi</span></div>
                <div className="text-[11px] text-slate-400 mt-1">Target Penyaluran Bulan Agustus</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Dana Alokasi</div>
                <div className="text-2xl font-mono font-bold text-blue-600">Rp 562,5 Jt</div>
                <div className="text-[11px] text-slate-400 mt-1">Realisasi Anggaran BGN</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Rata-rata Biaya / Porsi</div>
                <div className="text-2xl font-mono font-bold text-emerald-600">Rp 15.000</div>
                <div className="text-[11px] text-slate-400 mt-1">Standar HPP BGN</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Acuan Ketentuan Regulator</div>
                <div className="text-2xl font-mono font-bold text-indigo-600">Rp 15.000</div>
                <div className="text-[11px] text-emerald-600 font-bold mt-1">✓ 100% Sesuai Batas Acuan</div>
              </div>
            </div>

            {/* Breakdown RAB HPP Tabel */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Breakdown Rencana Anggaran Biaya (RAB) Per Porsi</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Komposisi HPP Bahan Baku, Biaya Dapur, Logistik, & Margin Kemitraan.</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                  Total: Rp 15.000 / Porsi
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Komponen Pembiayaan</th>
                      <th className="py-3.5 px-4">Alokasi Per Porsi</th>
                      <th className="py-3.5 px-4 text-center">Persentase (%)</th>
                      <th className="py-3.5 px-4">Ketentuan Batas Regulator BGN</th>
                      <th className="py-3.5 px-4">Status Kepatuhan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { komponen: 'Bahan Baku Makanan (Protein, Karbohidrat, Sayur, Buah)', alokasi: 'Rp 10.500', pct: '70.0%', batas: 'Min. 68% (Rp 10.200)', status: 'Sesuai Ketentuan' },
                      { komponen: 'Biaya Operasional Dapur & Bahan Bakar/Gas', alokasi: 'Rp 2.100', pct: '14.0%', batas: 'Maks. 15% (Rp 2.250)', status: 'Sesuai Ketentuan' },
                      { komponen: 'Biaya Kemasan, Hygiene & Tempat Porsi Steril', alokasi: 'Rp 900', pct: '6.0%', batas: 'Maks. 7% (Rp 1.050)', status: 'Sesuai Ketentuan' },
                      { komponen: 'Biaya Logistik & Distribusi Ke Sekolah', alokasi: 'Rp 750', pct: '5.0%', batas: 'Maks. 6% (Rp 900)', status: 'Sesuai Ketentuan' },
                      { komponen: 'Margin Layanan Mitra SPPG', alokasi: 'Rp 750', pct: '5.0%', batas: 'Maks. 5% (Rp 750)', status: 'Sesuai Ketentuan' },
                    ].map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 font-bold text-slate-800">{r.komponen}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{r.alokasi}</td>
                        <td className="py-3.5 px-4 font-mono text-center font-bold text-blue-600">{r.pct}</td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">{r.batas}</td>
                        <td className="py-3.5 px-4">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}


      {/* School Students List Modal */}
      {selectedSchoolForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative border border-slate-200" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedSchoolForDetail(null)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2.5 text-blue-700 mb-1">
                <GraduationCap className="w-5 h-5" />
                <h3 className="font-heading font-bold text-lg">{selectedSchoolForDetail.nama}</h3>
              </div>
              <p className="text-xs text-slate-500">{selectedSchoolForDetail.lokasi} &bull; Total {selectedSchoolForDetail.siswa} Siswa</p>
            </div>
            
            <div className="p-6">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Sampel Data Siswa Penerima</div>
              <div className="border border-slate-200 rounded-xl overflow-hidden mb-4">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Nama Siswa</th>
                      <th className="py-2.5 px-4">NISN</th>
                      <th className="py-2.5 px-4">Kelas</th>
                      <th className="py-2.5 px-4">Alergi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {selectedSchoolForDetail.daftarSiswa.map((s: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50 text-slate-700">
                        <td className="py-2.5 px-4 font-bold text-slate-800">{s.nama}</td>
                        <td className="py-2.5 px-4 font-mono">{s.nisn}</td>
                        <td className="py-2.5 px-4">{s.kelas}</td>
                        <td className="py-2.5 px-4">
                          {s.alergi !== '-' ? (
                            <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold">{s.alergi}</span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={4} className="py-3 px-4 text-center text-[10px] text-slate-400 font-medium italic bg-slate-50">
                        dan {selectedSchoolForDetail.siswa - selectedSchoolForDetail.daftarSiswa.length} siswa lainnya terdaftar...
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => setSelectedSchoolForDetail(null)} 
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors text-xs"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add School Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative border border-slate-200 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsAddModalOpen(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2.5 text-blue-700 mb-1">
                <GraduationCap className="w-5 h-5" />
                <h3 className="font-heading font-bold text-lg">Tambah Sekolah Penerima</h3>
              </div>
              <p className="text-xs text-slate-500">Masukkan informasi sekolah penerima manfaat baru.</p>
            </div>
            
            <form onSubmit={handleAddSchool} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nama Sekolah</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: SDN 3 Parepare" 
                  value={newSchoolName}
                  onChange={e => setNewSchoolName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Alamat / Wilayah</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Kec. Bacukiki Barat, Parepare" 
                  value={newSchoolAddress}
                  onChange={e => setNewSchoolAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Jumlah Siswa</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    placeholder="Contoh: 300" 
                    value={newSchoolStudentsCount}
                    onChange={e => setNewSchoolStudentsCount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Waktu Pengiriman</label>
                  <input 
                    type="time" 
                    required
                    value={newSchoolDeliveryTime}
                    onChange={e => setNewSchoolDeliveryTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)} 
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors text-xs"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-xs shadow-sm"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MENU ADJUSTMENT MODAL --- */}
      {isAdjustmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-heading font-bold text-slate-800 text-sm uppercase tracking-wider">Ajukan Penyesuaian Menu (Local Swap)</h3>
              <button onClick={() => setIsAdjustmentModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 bg-slate-200 hover:bg-slate-300 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setPendingAdjustment({
                original: adjustedItem,
                replacement: replacementItem,
                status: 'Pending'
              });
              setIsAdjustmentModalOpen(false);
              // Auto approve after 4 seconds to show center's authority/control
              setTimeout(() => {
                setPendingAdjustment(prev => prev ? { ...prev, status: 'Disetujui' } : null);
              }, 4000);
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Bahan Menu Asli (BGN)</label>
                <select
                  value={adjustedItem}
                  onChange={e => setAdjustedItem(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                >
                  {menuSiklus === 'siklus1' ? (
                    <>
                      <option value="Buah Pisang Mas">Buah Pisang Mas</option>
                      <option value="Telur Dadar Slice">Telur Dadar Slice</option>
                      <option value="Sayur Sop / Bayam">Sayur Sop / Bayam</option>
                    </>
                  ) : (
                    <>
                      <option value="Buah Apel / Jeruk Manis">Buah Apel / Jeruk Manis</option>
                      <option value="Ayam Goreng Fillet Tepung">Ayam Goreng Fillet Tepung</option>
                      <option value="Tumis Wortel & Buncis">Tumis Wortel & Buncis</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Bahan Pengganti Lokal</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Buah Apel Malang / Jeruk Purut"
                  value={replacementItem}
                  onChange={e => setReplacementItem(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Alasan Keterbatasan / Perubahan</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Contoh: Stok pisang matang dari petani lokal sedang kosong..."
                  value={adjustmentReason}
                  onChange={e => setAdjustmentReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdjustmentModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-xs shadow-sm"
                >
                  Kirim Ajuan ke BGN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
