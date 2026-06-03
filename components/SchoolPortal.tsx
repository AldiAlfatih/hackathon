'use client';

import { useState } from 'react';
import { 
  Building2, Calendar, FileText, CheckCircle2, Clock, ChevronRight, Home, TrendingUp,
  CheckSquare, AlertTriangle, Send, X, Users, ImageIcon, UploadCloud, GraduationCap, Package, MessageSquare, AlertCircle
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
        <h1 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">SDN 01 Cilandak</h1>
        <p className="text-sm text-slate-500 mt-0.5">Jl. Cilandak Raya No. 1, Jakarta Selatan &bull; NPSN: 20104852</p>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">

        {/* DASHBOARD */}
        {activeSubView === 'dashboard' && (
          <div className="space-y-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Siswa Terdaftar MBG</div>
                <div className="text-3xl font-mono font-bold text-slate-900">450</div>
                <div className="text-xs text-slate-500 mt-2">Aktif menerima porsi harian</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Status Pengiriman Hari Ini</div>
                <div className={`flex items-center gap-2 font-bold text-base mt-1 ${receiptStep === 'done' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {receiptStep === 'done' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  {receiptStep === 'done' ? 'Telah Diterima' : 'Menunggu Konfirmasi'}
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Aduan Belum Selesai</div>
                <div className="text-3xl font-mono font-bold text-red-600">
                  {complaints.filter(c => c.status !== 'Resolved').length}
                </div>
                <div className="text-xs text-slate-500 mt-2">Memerlukan tindak lanjut Anda</div>
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
                  <div className="font-bold text-slate-800">Konfirmasi Penerimaan</div>
                  <div className="text-xs text-slate-500 mt-0.5">Verifikasi porsi makanan hari ini</div>
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
                  <div className="font-bold text-slate-800">Kelola Aduan</div>
                  <div className="text-xs text-slate-500 mt-0.5">{complaints.filter(c=>c.status!=='Resolved').length} aduan aktif perlu ditangani</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* GOODS RECEIPT */}
        {activeSubView === 'receipt' && (
          <div className="max-w-xl mx-auto pb-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Konfirmasi Penerimaan Barang</h2>
                <p className="text-xs text-slate-500 mt-1">Verifikasi jumlah porsi makanan yang tiba hari ini dari SPPG.</p>
              </div>

              {receiptStep === 'done' ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Penerimaan Terkonfirmasi</h3>
                  <p className="text-sm text-slate-500 mb-6">Anda telah mengkonfirmasi penerimaan <strong>{receiptQty} porsi</strong> dari CV. Dapur Nusantara.</p>
                  <div className="grid grid-cols-2 gap-3 text-left mb-6">
                    {[
                      ['Waktu Konfirmasi', '07:42 WIB'],
                      ['Jumlah Diterima', `${receiptQty} porsi`],
                      ['Pengirim', 'CV. Dapur Nusantara'],
                      ['Status', 'Terverifikasi'],
                    ].map(([l, v]) => (
                      <div key={l} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{l}</div>
                        <div className="text-sm font-bold text-slate-800 mt-0.5">{v}</div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setReceiptStep('pending')} className="text-sm text-slate-500 hover:text-slate-700 underline">
                    Laporkan selisih / masalah
                  </button>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vendor Pengirim</div>
                      <div className="font-bold text-slate-900">CV. Dapur Nusantara Sejahtera</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tanggal</div>
                      <div className="font-mono text-sm font-bold text-slate-800">12 Agustus 2026</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ekspektasi Porsi (Surat Jalan)</div>
                      <div className="text-3xl font-mono font-bold text-blue-600">450</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-100 text-amber-700 font-bold text-xs uppercase mt-1 border border-amber-200">
                        <Clock className="w-3.5 h-3.5" /> Pending
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-slate-200 mb-4">
                    <label className="block text-xs font-bold text-slate-700 mb-2">Jumlah porsi yang benar-benar Anda terima:</label>
                    <input 
                      type="number" 
                      value={receiptQty}
                      onChange={(e) => setReceiptQty(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 font-mono text-2xl font-bold text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                    {receiptQty !== 450 && (
                      <p className="text-xs text-red-600 mt-2 font-bold flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> Selisih {Math.abs(receiptQty - 450)} porsi akan dilaporkan & dieskalasi ke BGN.
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => setReceiptStep('done')}
                      className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex justify-center items-center gap-2 shadow-sm"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      {receiptQty === 450 ? 'TERIMA SESUAI SURAT JALAN' : `KONFIRMASI ${receiptQty} PORSI`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* COMPLAINT INBOX */}
        {activeSubView === 'complaint' && (
          <div className="space-y-4 pb-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div>
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Complaint Inbox</h2>
                  <p className="text-xs text-slate-500 mt-1">Sekolah sebagai <strong>first responder</strong> untuk aduan Low &amp; Medium.</p>
                </div>
                <button
                  onClick={() => setShowComplaintForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" /> Buat Aduan Baru
                </button>
              </div>

              {/* Form buat aduan */}
              {showComplaintForm && (
                <div className="p-5 border-b border-slate-100 bg-blue-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-blue-800">Buat Aduan Baru</span>
                    <button onClick={() => setShowComplaintForm(false)}><X className="w-4 h-4 text-blue-600" /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1 block">Kategori Masalah</label>
                      <select
                        value={newComplaint.kategori}
                        onChange={(e) => setNewComplaint(p => ({...p, kategori: e.target.value}))}
                        className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                      >
                        <option value="Kualitas Makanan">Kualitas Makanan</option>
                        <option value="Higiene & Keamanan">Higiene & Keamanan</option>
                        <option value="Porsi Kurang">Porsi Kurang</option>
                        <option value="Keterlambatan/Absen">Keterlambatan / SPPG Absen</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1 block">Tingkat Keparahan (Severity)</label>
                      <select
                        value={newComplaint.severity}
                        onChange={(e) => setNewComplaint(p => ({...p, severity: e.target.value as 'Low'|'Medium'|'High'}))}
                        className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                      >
                        <option value="Low">Low (Keluhan Ringan)</option>
                        <option value="Medium">Medium (Berpengaruh pada sebagian siswa)</option>
                        <option value="High">High (Berbahaya / Kritis)</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1 block">Deskripsi Detail</label>
                    <textarea
                      value={newComplaint.isi}
                      onChange={(e) => setNewComplaint(p => ({...p, isi: e.target.value}))}
                      placeholder="Jelaskan secara rinci keluhan yang dialami..."
                      className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 h-20 resize-none"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1 block">Foto Bukti Keluhan</label>
                    <button 
                      onClick={() => setNewComplaint(p => ({...p, fotoBukti: !p.fotoBukti}))}
                      className={`w-full py-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 transition-colors ${
                        newComplaint.fotoBukti ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-blue-200 text-slate-500 hover:bg-blue-50/50'
                      }`}
                    >
                      {newComplaint.fotoBukti ? (
                        <>
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                          <span className="text-xs font-bold uppercase tracking-wider">Foto Bukti Terlampir</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-6 h-6 text-blue-400" />
                          <span className="text-xs font-bold uppercase tracking-wider">Klik untuk Upload Foto (Simulasi)</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex justify-end">
                    <button onClick={submitComplaint} className="px-6 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                      Kirim Aduan
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
                      <th className="py-3.5 px-5">Isi Laporan</th>
                      <th className="py-3.5 px-5">Tanggal</th>
                      <th className="py-3.5 px-5">Status</th>
                      <th className="py-3.5 px-5">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {complaints.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="py-4 px-5 font-mono text-xs text-slate-500">{c.id}</td>
                        <td className="py-4 px-5">
                          <span className={`px-2 py-1 rounded border text-[11px] font-bold uppercase ${severityBadge[c.severity]}`}>{c.severity}</span>
                        </td>
                        <td className="py-4 px-5 font-medium text-slate-800 max-w-xs">
                          <div className="mb-1">{c.laporan}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">{c.kategori}</span>
                            {c.fotoBukti && <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1"><ImageIcon className="w-3 h-3"/> Foto Terlampir</span>}
                          </div>
                        </td>
                        <td className="py-4 px-5 text-xs text-slate-500">{c.tanggal}</td>
                        <td className="py-4 px-5">
                          <span className={`px-2 py-1 rounded border text-[11px] font-bold uppercase ${statusBadge[c.status]}`}>{c.status}</span>
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
              <div className="text-xs text-slate-500">Tahun Ajaran 2026/2027</div>
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
                  {[
                    { nama: 'Ahmad Raihan', nisn: '0012345678', kelas: '4A', alergi: '-', status: 'Hadir' },
                    { nama: 'Budi Santoso', nisn: '0012345679', kelas: '4A', alergi: 'Kacang', status: 'Hadir' },
                    { nama: 'Citra Kirana', nisn: '0012345680', kelas: '4B', alergi: '-', status: 'Sakit' },
                    { label: 'dan 447 siswa lainnya...' }
                  ].map((row, i) => (
                    row.label ? (
                      <tr key={i}><td colSpan={5} className="py-4 px-5 text-center text-xs text-slate-500 font-medium italic bg-slate-50">{row.label}</td></tr>
                    ) : (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-3.5 px-5 font-bold text-slate-800">{row.nama}</td>
                        <td className="py-3.5 px-5 font-mono text-xs text-slate-500">{row.nisn}</td>
                        <td className="py-3.5 px-5 text-slate-600">{row.kelas}</td>
                        <td className="py-3.5 px-5">
                          {row.alergi !== '-' ? <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">{row.alergi}</span> : <span className="text-xs text-slate-400">-</span>}
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded border ${row.status === 'Hadir' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    )
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
