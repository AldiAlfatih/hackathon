'use client';

import { useState } from 'react';
import { 
  Building2, Calendar, FileText, CheckCircle2, Clock, ChevronRight, Home, TrendingUp,
  CheckSquare, AlertTriangle, Send, X, Users, ImageIcon, UploadCloud, GraduationCap, Package, MessageSquare, AlertCircle,
  UserPlus
} from 'lucide-react';
import type { SekolahSubView, ActiveSubView, GlobalComplaint, GlobalComplaintStatus } from './KawalApp';

interface SchoolPortalProps {
  activeSubView: SekolahSubView;
  setActiveSubView: (sub: ActiveSubView) => void;
  complaints: GlobalComplaint[];
  updateComplaintStatus: (id: string, status: GlobalComplaintStatus) => void;
  addComplaint: (complaint: Omit<GlobalComplaint, 'id' | 'status' | 'tanggal' | 'sekolah'>) => void;
}

export default function SchoolPortal({ 
  activeSubView, 
  setActiveSubView,
  complaints,
  updateComplaintStatus,
  addComplaint
}: SchoolPortalProps) {
  const [receiptStep, setReceiptStep] = useState<'pending' | 'confirming' | 'done'>('pending');
  const [receiptQty, setReceiptQty] = useState(450);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [newComplaint, setNewComplaint] = useState({ 
    isi: '', 
    severity: 'Low' as 'Low' | 'Medium' | 'High',
    kategori: 'Kualitas Makanan',
    fotoBukti: false
  });
  const [students, setStudents] = useState([
    { nama: 'Ahmad Raihan', nisn: '0012345678', kelas: '4A', alergi: '-', status: 'Hadir' },
    { nama: 'Budi Santoso', nisn: '0012345679', kelas: '4A', alergi: 'Kacang', status: 'Hadir' },
    { nama: 'Citra Kirana', nisn: '0012345680', kelas: '4B', alergi: '-', status: 'Sakit' },
  ]);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [studentForm, setStudentForm] = useState({
    nama: '',
    nisn: '',
    kelas: '4A',
    alergi: '',
    status: 'Hadir' as 'Hadir' | 'Sakit' | 'Izin' | 'Alergi'
  });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.nama.trim() || !studentForm.nisn.trim()) return;
    setStudents(prev => [
      ...prev,
      {
        nama: studentForm.nama,
        nisn: studentForm.nisn,
        kelas: studentForm.kelas,
        alergi: studentForm.alergi.trim() || '-',
        status: studentForm.status
      }
    ]);
    setStudentForm({ nama: '', nisn: '', kelas: '4A', alergi: '', status: 'Hadir' });
    setShowAddStudentModal(false);
  };

  const submitComplaint = () => {
    if (!newComplaint.isi.trim()) return;
    addComplaint({ 
      severity: newComplaint.severity, 
      laporan: newComplaint.isi,
      kategori: newComplaint.kategori,
      fotoBukti: newComplaint.fotoBukti,
      sumber: 'Sekolah'
    });
    setNewComplaint({ isi: '', severity: 'Low', kategori: 'Kualitas Makanan', fotoBukti: false });
    setShowComplaintForm(false);
  };

  const breadcrumb = activeSubView === 'dashboard' ? 'Dashboard'
    : activeSubView === 'receipt' ? 'Goods Receipt'
    : 'Complaint Inbox';

  const statusBadge: Record<GlobalComplaintStatus, string> = {
    Open: 'bg-slate-100 text-slate-600 border-slate-200',
    Investigating: 'bg-purple-50 text-purple-700 border-purple-200',
    Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Escalated: 'bg-red-50 text-red-700 border-red-200',
  };

  const severityBadge: Record<'Low'|'Medium'|'High', string> = {
    Low: 'bg-blue-50 text-blue-700 border-blue-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    High: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6 font-sans bg-slate-50">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1.5">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Portal Penerima</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-800">{breadcrumb}</span>
        </div>
        <h1 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">SDN 1 Parepare</h1>
        <p className="text-sm text-slate-500 mt-0.5">Jl. Jend. Sudirman No. 12, Kota Parepare, Sulawesi Selatan &bull; NPSN: 40302150</p>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">

        {/* DASHBOARD */}
        {activeSubView === 'dashboard' && (
          <div className="space-y-6 pb-6">
            {/* Dashboard Distribusi Hari Ini Banner */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-blue-800">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-blue-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider bg-blue-500/30 text-blue-200 px-2.5 py-0.5 rounded border border-blue-400/30">
                      Dashboard Distribusi Hari Ini
                    </span>
                    <span className="text-[11px] text-slate-300 font-mono">Senin, 12 Agustus 2026</span>
                  </div>
                  <h2 className="text-xl font-heading font-bold text-white mt-1">Status Penyaluran Makanan Sekolah</h2>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  receiptStep === 'done'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                }`}>
                  {receiptStep === 'done' ? '✓ Telah Diterima & Diverifikasi' : '⏳ Menunggu Konfirmasi Sekolah'}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 p-3.5 rounded-xl border border-white/10">
                  <div className="text-[10px] text-blue-200 font-bold uppercase mb-1">Target Penerima</div>
                  <div className="text-xl font-mono font-bold text-white">450 <span className="text-xs font-sans font-normal">Siswa</span></div>
                  <div className="text-[10px] text-slate-300 mt-1">Siswa Terdaftar MBG</div>
                </div>
                <div className="bg-white/10 p-3.5 rounded-xl border border-white/10">
                  <div className="text-[10px] text-blue-200 font-bold uppercase mb-1">Mitra SPPG Pengirim</div>
                  <div className="text-sm font-bold text-white truncate" title="CV. Dapur Nusantara Sejahtera">CV. Dapur Nusantara</div>
                  <div className="text-[10px] text-slate-300 mt-1">Armada Rute A (Kedatangan 06:45)</div>
                </div>
                <div className="bg-white/10 p-3.5 rounded-xl border border-white/10">
                  <div className="text-[10px] text-blue-200 font-bold uppercase mb-1">Menu Hari Ini</div>
                  <div className="text-xs font-bold text-cyan-200 truncate" title="Nasi Putih, Ayam Fillet, Tumis Bayam, Pisang Mas, Susu">Nasi, Ayam Fillet, Bayam, Pisang, Susu</div>
                  <div className="text-[10px] text-slate-300 mt-1">Standard Gizi BGN</div>
                </div>
                <div className="bg-white/10 p-3.5 rounded-xl border border-white/10">
                  <div className="text-[10px] text-blue-200 font-bold uppercase mb-1">Status Verifikasi</div>
                  <div className="text-sm font-bold text-emerald-300">{receiptStep === 'done' ? 'BAP Terbit' : 'Perlu Checklist'}</div>
                  <div className="text-[10px] text-slate-300 mt-1">BAP Penerimaan Makanan</div>
                </div>
              </div>
            </div>

            {/* KPI Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Jumlah Target Penerima</div>
                <div className="text-3xl font-mono font-bold text-slate-900">450 <span className="text-xs font-sans text-slate-500 font-normal">Siswa</span></div>
                <div className="text-xs text-slate-500 mt-2">Target Alokasi Porsi Harian</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Konfirmasi Penerimaan BAP</div>
                <div className={`flex items-center gap-2 font-bold text-base mt-1 ${receiptStep === 'done' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {receiptStep === 'done' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  {receiptStep === 'done' ? 'Telah Diterima & Sesuai' : 'Menunggu Konfirmasi'}
                </div>
                <div className="text-xs text-slate-500 mt-2">BAP Digital Terintegrasi BGN</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Monitoring Status Tindak Lanjut</div>
                <div className="text-3xl font-mono font-bold text-blue-600">
                  {complaints.filter(c => c.status !== 'Resolved').length} <span className="text-xs font-sans text-slate-500 font-normal">Aduan</span>
                </div>
                <div className="text-xs text-slate-500 mt-2">Aduan aktif dalam penanganan BGN/SPPG</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setActiveSubView('receipt')}
                className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">Konfirmasi Penerimaan & Checklist</div>
                  <div className="text-xs text-slate-500 mt-0.5">Verifikasi porsi, kondisi makanan & foto bukti</div>
                </div>
              </button>
              <button
                onClick={() => setActiveSubView('complaint')}
                className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 hover:border-amber-300 hover:bg-amber-50 transition-all shadow-sm text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                  <MessageSquare className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">Aduan, Feedback & Tracking</div>
                  <div className="text-xs text-slate-500 mt-0.5">{complaints.filter(c=>c.status!=='Resolved').length} aduan dalam monitoring tindak lanjut</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* GOODS RECEIPT */}
        {activeSubView === 'receipt' && (
          <div className="max-w-2xl mx-auto pb-6 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <CheckSquare className="w-4.5 h-4.5 text-blue-600" /> Konfirmasi Penerimaan & Checklist Makanan (BAP)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Form verifikasi jumlah porsi, kesesuaian menu, checklist kondisi, & foto bukti kedatangan.</p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                  BAP Digital Sekolah
                </span>
              </div>

              {receiptStep === 'done' ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Berita Acara Penerimaan (BAP) Terkonfirmasi</h3>
                  <p className="text-sm text-slate-500 mb-6">Anda telah mengkonfirmasi penerimaan <strong>{receiptQty} porsi</strong> dari CV. Dapur Nusantara Sejahtera.</p>
                  <div className="grid grid-cols-2 gap-3 text-left mb-6">
                    {[
                      ['Waktu Konfirmasi', '07:42 WITA'],
                      ['Jumlah Diterima', `${receiptQty} Porsi (100% Sesuai)`],
                      ['Kondisi Makanan', 'Hangat, Steril, & Segar (Lolos Checklist)'],
                      ['Kesesuaian Menu', 'Sesuai Standar Gizi (5 Komponen)'],
                      ['Foto Bukti', 'Uploaded & Verified'],
                      ['Status BAP', 'Telah Diterbitkan & Terkirim ke BGN'],
                    ].map(([l, v]) => (
                      <div key={l} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{l}</div>
                        <div className="text-xs font-bold text-slate-800 mt-0.5">{v}</div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setReceiptStep('pending')} className="text-sm text-blue-600 hover:text-blue-800 font-bold underline">
                    Edit / Laporkan Selisih Baru
                  </button>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {/* Info Vendor & Tanggal */}
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mitra SPPG Pengirim</div>
                      <div className="font-bold text-slate-900 text-sm">CV. Dapur Nusantara Sejahtera</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tanggal & Waktu</div>
                      <div className="font-mono text-xs font-bold text-slate-800">12 Agustus 2026 (06:45 WITA)</div>
                    </div>
                  </div>

                  {/* 1. Verifikasi Jumlah Porsi */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Package className="w-4 h-4 text-blue-600" /> 1. Verifikasi Jumlah Porsi
                        </div>
                        <div className="text-[11px] text-slate-500">Target Surat Jalan: <b>450 Porsi</b></div>
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                        Ekspektasi: 450
                      </span>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Jumlah porsi yang benar-benar diterima sekolah:</label>
                      <input 
                        type="number" 
                        value={receiptQty}
                        onChange={(e) => setReceiptQty(Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 font-mono text-xl font-bold text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                      {receiptQty !== 450 && (
                        <p className="text-xs text-red-600 mt-1.5 font-bold flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> Selisih {Math.abs(receiptQty - 450)} porsi akan dicatat di BAP dan dilaporkan ke BGN.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 2. Verifikasi Kesesuaian Menu */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 2. Verifikasi Kesesuaian Menu
                    </div>
                    <div className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800">Menu Acuan Hari Ini (BGN):</div>
                      <div className="text-slate-700 font-medium">Nasi Putih + Ayam Goreng Fillet + Tumis Bayam + Buah Pisang Mas + Susu UHT Plain</div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="menuMatch" defaultChecked className="text-blue-600" />
                        <span>Sesuai 100% Dengan Menu Acuan</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-slate-500">
                        <input type="radio" name="menuMatch" className="text-blue-600" />
                        <span>Ada Penyesuaian / Perbedaan</span>
                      </label>
                    </div>
                  </div>

                  {/* 3. Checklist Kondisi Makanan */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-indigo-600" /> 3. Checklist Kondisi Makanan
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-700">
                      {[
                        'Suhu makanan masih hangat (Di atas 60°C)',
                        'Wadah/Kemasan porsi bersih, tertutup, & steril',
                        'Aroma, rasa, & kondisi fisik makanan segar',
                        'Bebas dari benda asing / kontaminasi',
                      ].map((chk, i) => (
                        <label key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                          <input type="checkbox" defaultChecked className="mt-0.5 text-blue-600 rounded" />
                          <span>{chk}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 4. Upload Foto Bukti Kedatangan */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-blue-600" /> 4. Upload Foto Bukti Penerimaan
                    </div>
                    <button 
                      onClick={() => alert('Foto kedatangan makanan di sekolah berhasil diunggah dan terverifikasi dengan geotag GPS.')}
                      className="w-full py-4 bg-white border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 rounded-xl flex flex-col items-center justify-center gap-1.5 text-slate-600 transition-colors"
                    >
                      <UploadCloud className="w-6 h-6 text-blue-500" />
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Ambil Foto / Unggah Bukti Kedatangan</span>
                      <span className="text-[10px] text-slate-400">Pastikan boks makanan & armada pengiriman terlihat</span>
                    </button>
                  </div>

                  {/* Tombol Konfirmasi BAP */}
                  <div className="pt-2">
                    <button 
                      onClick={() => setReceiptStep('done')}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors flex justify-center items-center gap-2 shadow-md text-sm"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      TERBITKAN BAP PENERIMAAN DIGITAL ({receiptQty} PORSI)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* COMPLAINT & FEEDBACK INBOX */}
        {activeSubView === 'complaint' && (
          <div className="space-y-6 pb-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div>
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-4.5 h-4.5 text-amber-600" /> Aduan, Feedback, & Monitoring Status Tindak Lanjut
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Kirim laporan aduan / feedback kualitas makanan dan pantau status tindak lanjut BGN & SPPG secara real-time.</p>
                </div>
                <button
                  onClick={() => setShowComplaintForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" /> Buat Aduan & Feedback Baru
                </button>
              </div>

              {/* Form buat aduan */}
              {showComplaintForm && (
                <div className="p-5 border-b border-slate-100 bg-blue-50/70">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-blue-900">Form Laporan Aduan & Feedback Sekolah</span>
                    <button onClick={() => setShowComplaintForm(false)}><X className="w-4 h-4 text-blue-600" /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1 block">Kategori Masalah / Feedback</label>
                      <select
                        value={newComplaint.kategori}
                        onChange={(e) => setNewComplaint(p => ({...p, kategori: e.target.value}))}
                        className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 font-medium"
                      >
                        <option value="Kualitas Makanan">Kualitas Makanan (Rasa, Kematangan, Suhu)</option>
                        <option value="Higiene & Keamanan">Higiene & Keamanan (Sanitasi / Kontaminasi)</option>
                        <option value="Porsi Kurang">Porsi Kurang (Selisih Surat Jalan)</option>
                        <option value="Keterlambatan/Absen">Keterlambatan Pengiriman / Armada Absen</option>
                        <option value="Feedback Positif">Feedback Positif & Apresiasi Menu</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1 block">Tingkat Keparahan (Severity)</label>
                      <select
                        value={newComplaint.severity}
                        onChange={(e) => setNewComplaint(p => ({...p, severity: e.target.value as 'Low'|'Medium'|'High'}))}
                        className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 font-medium"
                      >
                        <option value="Low">Low (Keluhan / Feedback Ringan)</option>
                        <option value="Medium">Medium (Berpengaruh pada sebagian porsi/siswa)</option>
                        <option value="High">High (Insiden Kritis / Berbahaya)</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1 block">Deskripsi Detail & Feedback</label>
                    <textarea
                      value={newComplaint.isi}
                      onChange={(e) => setNewComplaint(p => ({...p, isi: e.target.value}))}
                      placeholder="Jelaskan secara rinci keluhan atau feedback dari siswa & guru..."
                      className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 h-20 resize-none font-medium"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1 block">Upload Foto Bukti Keluhan / Kondisi</label>
                    <button 
                      onClick={() => setNewComplaint(p => ({...p, fotoBukti: !p.fotoBukti}))}
                      className={`w-full py-3.5 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 transition-colors ${
                        newComplaint.fotoBukti ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-blue-200 text-slate-600 hover:bg-blue-50'
                      }`}
                    >
                      {newComplaint.fotoBukti ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          <span className="text-xs font-bold uppercase tracking-wider">Foto Bukti Berhasil Dilampirkan</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-5 h-5 text-blue-500" />
                          <span className="text-xs font-bold uppercase tracking-wider">Klik untuk Unggah Foto Bukti Makanan</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button onClick={() => setShowComplaintForm(false)} className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-300 transition-colors">Batal</button>
                    <button onClick={submitComplaint} className="px-6 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                      Kirim Laporan Aduan
                    </button>
                  </div>
                </div>
              )}
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-5">ID Aduan</th>
                      <th className="py-3.5 px-5">Severity</th>
                      <th className="py-3.5 px-5">Deskripsi & Feedback</th>
                      <th className="py-3.5 px-5">Tanggal Laporkan</th>
                      <th className="py-3.5 px-5">Status & Timeline Tindak Lanjut</th>
                      <th className="py-3.5 px-5">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {complaints.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-5 font-mono text-xs text-slate-500 font-bold">{c.id}</td>
                        <td className="py-4 px-5">
                          <span className={`px-2 py-1 rounded border text-[11px] font-bold uppercase ${severityBadge[c.severity]}`}>{c.severity}</span>
                        </td>
                        <td className="py-4 px-5 font-medium text-slate-800 max-w-xs">
                          <div className="mb-1 text-xs">{c.laporan}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">{c.kategori}</span>
                            {c.fotoBukti && <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1"><ImageIcon className="w-3 h-3"/> Foto Bukti</span>}
                          </div>
                        </td>
                        <td className="py-4 px-5 text-xs text-slate-500 font-mono">{c.tanggal}</td>
                        <td className="py-4 px-5">
                          <div className="space-y-1">
                            <span className={`inline-block px-2.5 py-1 rounded border text-[10px] font-bold uppercase ${statusBadge[c.status]}`}>{c.status}</span>
                            <div className="text-[10px] text-slate-500 font-medium">
                              {c.status === 'Resolved' ? '✓ Masalah Selesai & Dapur SPPG Telah Dikoreksi' :
                               c.status === 'Investigating' ? '🔍 Tim BGN Sedang Investigasi Lapangan' :
                               c.status === 'Escalated' ? '↗ Dieskalasi ke BGN Pusat' :
                               '⏳ Menunggu Respon SPPG'}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          {c.status !== 'Resolved' && c.status !== 'Escalated' && c.status !== 'Investigating' && (
                            <select
                              value={c.status}
                              onChange={(e) => updateComplaintStatus(c.id, e.target.value as GlobalComplaintStatus)}
                              className="text-xs bg-white border border-slate-300 rounded-lg px-2 py-1.5 font-bold text-slate-700 cursor-pointer outline-none focus:border-blue-500"
                            >
                              <option value="Open">Open</option>
                              <option value="Investigating">Investigating</option>
                              <option value="Resolved">Resolved ✓</option>
                              <option value="Escalated">Escalate ke BGN ↗</option>
                            </select>
                          )}
                          {(c.status === 'Resolved' || c.status === 'Escalated' || c.status === 'Investigating') && (
                            <span className="text-xs text-slate-400 font-medium italic">
                              {c.status === 'Resolved' ? 'Selesai' : c.status === 'Investigating' ? 'BGN Sedang Investigasi' : 'Diteruskan ke BGN'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* STUDENT LIST */}
        {activeSubView === 'student-list' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" /> Daftar Siswa Penerima MBG
              </h2>
              <div className="flex items-center gap-4">
                <div className="text-xs text-slate-500 font-semibold">Tahun Ajaran 2026/2027</div>
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Tambah Siswa
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-5">Nama Siswa</th>
                    <th className="py-3.5 px-5">NISN</th>
                    <th className="py-3.5 px-5">Kelas</th>
                    <th className="py-3.5 px-5">Alergi (Restriksi)</th>
                    <th className="py-3.5 px-5">Status Hari Ini</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-3.5 px-5 font-bold text-slate-800">{row.nama}</td>
                      <td className="py-3.5 px-5 font-mono text-xs text-slate-500">{row.nisn}</td>
                      <td className="py-3.5 px-5 text-slate-600">{row.kelas}</td>
                      <td className="py-3.5 px-5">
                        {row.alergi !== '-' ? <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">{row.alergi}</span> : <span className="text-xs text-slate-400">-</span>}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                          row.status === 'Hadir' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          row.status === 'Sakit' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          row.status === 'Izin' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={5} className="py-4 px-5 text-center text-xs text-slate-500 font-medium italic bg-slate-50">
                      dan {450 - students.length} siswa lainnya...
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}


      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative border border-slate-200" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowAddStudentModal(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2.5 text-blue-700 mb-1">
                <UserPlus className="w-5 h-5" />
                <h3 className="font-heading font-bold text-lg">Tambah Siswa Penerima MBG</h3>
              </div>
              <p className="text-xs text-slate-500">Daftarkan siswa baru penerima jatah Makan Bergizi Gratis.</p>
            </div>
            
            <form onSubmit={handleAddStudent} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Nama Lengkap Siswa</label>
                <input 
                  type="text" 
                  required
                  value={studentForm.nama}
                  onChange={e => setStudentForm(p => ({ ...p, nama: e.target.value }))}
                  placeholder="Contoh: Ahmad Hidayat"
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">NISN (10 Digit)</label>
                  <input 
                    type="text" 
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                    value={studentForm.nisn}
                    onChange={e => setStudentForm(p => ({ ...p, nisn: e.target.value.replace(/\D/g, '') }))}
                    placeholder="Contoh: 0012345678"
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Kelas</label>
                  <select 
                    value={studentForm.kelas}
                    onChange={e => setStudentForm(p => ({ ...p, kelas: e.target.value }))}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2.5 focus:border-blue-500 outline-none transition-all bg-white"
                  >
                    {['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B'].map(k => (
                      <option key={k} value={k}>Kelas {k}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Alergi / Restriksi Makanan</label>
                <input 
                  type="text" 
                  value={studentForm.alergi}
                  onChange={e => setStudentForm(p => ({ ...p, alergi: e.target.value }))}
                  placeholder="Contoh: Kacang, Seafood (Isi '-' jika tidak ada)"
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Status Kehadiran Hari Ini</label>
                <select 
                  value={studentForm.status}
                  onChange={e => setStudentForm(p => ({ ...p, status: e.target.value as any }))}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2.5 focus:border-blue-500 outline-none transition-all bg-white"
                >
                  <option value="Hadir">Hadir</option>
                  <option value="Sakit">Sakit</option>
                  <option value="Izin">Izin</option>
                  <option value="Alergi">Alergi (Restriksi)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3 bg-slate-50 -mx-6 -mb-6 p-6">
                <button 
                  type="button"
                  onClick={() => setShowAddStudentModal(false)} 
                  className="flex-1 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm shadow-sm"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors text-sm shadow-sm"
                >
                  Simpan Siswa
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
