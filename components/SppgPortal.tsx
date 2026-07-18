'use client';

import { useState, useRef } from 'react';
import {
  Building2, Upload, FileText, ChevronRight, Package, Camera,
  Info, Calendar, CheckCircle2, AlertCircle, Loader2, 
  Clock, CheckSquare, XCircle, Home, Utensils, BarChart3,
  TrendingUp, TrendingDown, MapPin, Lock, Navigation,
  BrainCircuit, ShieldCheck, Link, GraduationCap, Plus
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
  const [ocrState, setOcrState] = useState<'idle' | 'processing' | 'done'>('idle');
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [nutritionState, setNutritionState] = useState<'idle' | 'uploading' | 'analyzing' | 'done'>('idle');
  const [hygieneState, setHygieneState] = useState<'idle' | 'uploading' | 'analyzing' | 'done'>('idle');
  const [selectedSchoolForDetail, setSelectedSchoolForDetail] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nutritionInputRef = useRef<HTMLInputElement>(null);
  const hygieneInputRef = useRef<HTMLInputElement>(null);

  // School list state
  const [schools, setSchools] = useState([
    { 
      id: 'sch-01',
      nama: 'SDN 01 Cilandak', 
      lokasi: 'Cilandak Barat, Jakarta Selatan', 
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
      nama: 'SDN 05 Lebak Bulus', 
      lokasi: 'Lebak Bulus, Jakarta Selatan', 
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
      nama: 'MTS Nurul Iman', 
      lokasi: 'Jagakarsa, Jakarta Selatan', 
      siswa: 420, 
      kontrak: '420 Porsi / Hari (Jam 08:00)',
      daftarSiswa: [
        { nama: 'Gita Gutawa', nisn: '0012345701', kelas: '7A', alergi: '-' },
        { nama: 'Hendra Setiawan', nisn: '0012345702', kelas: '8B', alergi: 'Telur' },
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
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" /> Manajemen Sekolah & Penerima
                </h2>
                <p className="text-xs text-slate-500 mt-1">Daftar sekolah penerima manfaat di bawah pengelolaan dapur Anda.</p>
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
                    <th className="py-3.5 px-5">Alamat / Wilayah</th>
                    <th className="py-3.5 px-5 text-center">Jumlah Siswa</th>
                    <th className="py-3.5 px-5">Kontrak Pengiriman</th>
                    <th className="py-3.5 px-5">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schools.map(school => (
                    <tr key={school.id} className="hover:bg-slate-50">
                      <td className="py-4 px-5 font-bold text-slate-800">{school.nama}</td>
                      <td className="py-4 px-5 text-slate-600">{school.lokasi}</td>
                      <td className="py-4 px-5 text-center font-mono font-bold text-blue-600 text-base">{school.siswa}</td>
                      <td className="py-4 px-5 text-xs text-slate-500 font-medium">{school.kontrak}</td>
                      <td className="py-4 px-5">
                        <button
                          onClick={() => setSelectedSchoolForDetail(school)}
                          className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          Lihat Siswa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              <div className="p-5 border-b border-slate-100 bg-slate-50">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" /> Syarat Verifikasi Penerbitan SPPG (AI OCR)
                </h2>
                <p className="text-xs text-slate-500 mt-1">Lengkapi dokumen persyaratan wajib di bawah untuk memproses verifikasi penerbitan izin SPPG Anda.</p>
              </div>
              
              {/* Status Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200">
                {[
                  { key: 'akta', label: 'Akta Pendirian Badan Usaha' },
                  { key: 'nib', label: 'Nomor Induk Berusaha (NIB)' },
                  { key: 'npwp', label: 'Nomor Pokok Wajib Pajak (NPWP)' },
                  { key: 'proposal', label: 'Proposal Kerja Sama' },
                  { key: 'logo', label: 'Logo Mitra' },
                  { key: 'kontak', label: 'NIK & Kontak Perwakilan' },
                  { key: 'lokasi', label: 'Lokasi & Kesiapan Bangunan' },
                ].map((item, i) => {
                  const docData = loggedInVendor?.dokumenPersyaratan?.[item.key];
                  const docStatus = docData ? docData.status : 'Terverifikasi';
                  const docColor = docStatus === 'Terverifikasi' ? 'emerald' : docStatus === 'Menunggu Verifikasi' ? 'blue' : 'amber';
                  
                  return (
                    <div key={i} className="bg-white p-4">
                      <div className="text-[11px] text-slate-500 font-bold mb-2 uppercase tracking-wider h-8 flex items-center leading-tight">{item.label}</div>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border
                        ${docColor === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                          docColor === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        {docStatus}
                      </span>
                      {docData?.namaFile && (
                        <div className="text-[9px] text-slate-400 mt-2 truncate font-mono" title={docData.namaFile}>
                          📄 {docData.namaFile}
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* Pad the 8th slot in the grid for balance */}
                <div className="bg-slate-50/50 p-4 flex items-center justify-center border-l border-slate-100 hidden lg:flex">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center">Sinkronisasi Ke Database BGN</div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4 text-xs font-bold text-slate-700 uppercase tracking-wider">Pilih & Upload Dokumen Baru</div>
                <div className="p-5 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Pilih Dokumen yang Diupload</label>
                      <select 
                        value={selectedDocKey} 
                        onChange={(e) => setSelectedDocKey(e.target.value)}
                        className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-lg p-2 outline-none"
                      >
                        <option value="akta">1. Akta Pendirian Badan Usaha</option>
                        <option value="nib">2. Nomor Induk Berusaha (NIB) OSS</option>
                        <option value="npwp">3. Nomor Pokok Wajib Pajak (NPWP)</option>
                        <option value="proposal">4. Proposal Kerja Sama</option>
                        <option value="logo">5. Logo Mitra SPPG</option>
                        <option value="kontak">6. NIK & Kontak Perwakilan</option>
                        <option value="lokasi">7. Lokasi & Kesiapan Bangunan</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-slate-400" />
                      <div>
                        <div className="font-bold text-slate-800 text-sm">
                          {selectedDocKey === 'akta' ? 'Akta Pendirian Badan Usaha'
                           : selectedDocKey === 'nib' ? 'Nomor Induk Berusaha (NIB)'
                           : selectedDocKey === 'npwp' ? 'Nomor Pokok Wajib Pajak (NPWP)'
                           : selectedDocKey === 'proposal' ? 'Proposal Kerja Sama'
                           : selectedDocKey === 'logo' ? 'Logo Mitra SPPG'
                           : selectedDocKey === 'kontak' ? 'NIK & Kontak Perwakilan'
                           : 'Lokasi & Kesiapan Bangunan'}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          Status saat ini: <span className="font-bold uppercase text-slate-700">{loggedInVendor?.dokumenPersyaratan?.[selectedDocKey]?.status || 'Terverifikasi'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {ocrState === 'idle' && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-8 flex flex-col items-center gap-3 rounded-lg bg-white border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.jpg,.png" onChange={handleOcrUpload} />
                      <Upload className="w-6 h-6 text-blue-500" />
                      <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Pilih File / Foto Dokumen</span>
                      <span className="text-xs text-slate-400">PDF, JPG, atau PNG — maks. 10MB</span>
                    </button>
                  )}

                  {ocrState === 'processing' && (
                    <div className="py-8 flex flex-col items-center gap-4 bg-white rounded-lg border border-slate-200">
                      <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                      <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Mengekstrak Data OCR & Mengunggah...</div>
                    </div>
                  )}

                  {ocrState === 'done' && ocrResult && (
                    <div className="mt-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200 shadow-sm animate-in fade-in duration-300">
                      <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Dokumen Berhasil Diunggah & Diverifikasi (AI OCR)
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          ['Nomor Registrasi', ocrResult.noSurat],
                          ['Penerbit Dokumen', ocrResult.penerbit],
                          ['Masa Berlaku', ocrResult.masaBerlaku],
                          ['Sumber Validasi', 'Sistem Informasi BGN / OSS'],
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
                            <div className="text-lg font-mono font-bold text-slate-800">99.1%</div>
                            <div className="text-[9px] text-slate-500 mt-1">Akurasi pembacaan karakter OCR tingkat tinggi.</div>
                          </div>
                          <div className="bg-white/50 p-3 rounded border border-emerald-100">
                            <div className="text-[10px] text-emerald-600 font-bold uppercase mb-1 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Status Keaslian
                            </div>
                            <div className="text-sm font-bold text-emerald-700">Valid & Terverifikasi</div>
                            <div className="text-[9px] text-slate-500 mt-1">Sesuai dengan database master OSS & BGN.</div>
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
                            <div className="text-xs text-slate-700 font-medium">Koordinat titik SPPG cocok dengan data pengajuan fisik. Foto kesiapan bangunan terverifikasi memiliki kapasitas memadai untuk melayani target porsi harian.</div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button 
                          onClick={() => {
                            setOcrState('idle');
                            setOcrResult(null);
                          }} 
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors"
                        >Unggah Dokumen Lain</button>
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
                      🗓️ Siklus I (Senin - Rabu)
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
                      🗓️ Siklus II (Kamis - Jumat)
                    </button>
                  </div>

                  <div className="space-y-3">
                    {menuSiklus === 'siklus1' ? (
                      [
                        { name: 'Nasi Putih', type: 'Karbohidrat Utama' },
                        { name: 'Telur Dadar Slice', type: 'Protein Hewani' },
                        { name: 'Sayur Sop / Bayam', type: 'Serat & Vitamin' },
                        { name: 'Buah Pisang Mas', type: 'Suplemen & Kalium' },
                        { name: 'Susu UHT Plain 200ml', type: 'Kalsium Tambahan' },
                      ].map((item) => (
                        <div key={item.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200/60 hover:bg-slate-100/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                            <span className="text-sm font-bold text-slate-700">{item.name}</span>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{item.type}</span>
                        </div>
                      ))
                    ) : (
                      [
                        { name: 'Nasi Merah / Kuning', type: 'Karbohidrat Utama' },
                        { name: 'Ayam Goreng Fillet Tepung', type: 'Protein Hewani' },
                        { name: 'Tumis Wortel & Buncis', type: 'Serat & Vitamin' },
                        { name: 'Buah Apel / Jeruk Manis', type: 'Suplemen & Kalium' },
                        { name: 'Susu UHT Cokelat 200ml', type: 'Kalsium Tambahan' },
                      ].map((item) => (
                        <div key={item.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200/60 hover:bg-slate-100/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                            <span className="text-sm font-bold text-slate-700">{item.name}</span>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{item.type}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-5 p-3.5 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700 font-semibold leading-relaxed">
                  💡 <strong>Informasi Siklus Menu:</strong> Menu berganti otomatis setiap 2 kali seminggu untuk memenuhi standar AKG (Angka Kecukupan Gizi) nasional BGN. Harap sesuaikan bahan baku harian dapur Anda.
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
                      <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Hasil Deteksi AI:</div>
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
                  placeholder="Contoh: SDN 03 Cilandak" 
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
                  placeholder="Contoh: Cilandak Timur, Jakarta Selatan" 
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

      </div>
    </div>
  );
}
