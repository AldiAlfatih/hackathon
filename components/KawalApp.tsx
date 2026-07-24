'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SppgPortal from './SppgPortal';
import SchoolPortal from './SchoolPortal';
import CommandCenter from './CommandCenter';
import { vendors as defaultVendors, type Vendor } from '@/lib/mockData';

export type ActiveView = 'landing' | 'login' | 'sppg' | 'sekolah' | 'command';

// Sub-views per role
export type BgnSubView = 'overview' | 'risk' | 'licensing-review' | 'finance' | 'complaints' | 'ghost-detection';
export type SppgSubView = 'dashboard' | 'licensing' | 'nutrition' | 'delivery-history' | 'onboarding' | 'hygiene' | 'schools';
export type SekolahSubView = 'dashboard' | 'receipt' | 'complaint' | 'student-list';
export type ActiveSubView = BgnSubView | SppgSubView | SekolahSubView;

export type GlobalComplaintStatus = 'Open' | 'Investigating' | 'Resolved' | 'Escalated';
export interface GlobalComplaint {
  id: string;
  sekolah: string;
  severity: 'Low' | 'Medium' | 'High';
  laporan: string;
  status: GlobalComplaintStatus;
  tanggal: string;
  kategori: string;
  fotoBukti: boolean;
  sumber: 'Sekolah' | 'Publik';
}

export default function KawalApp() {
  const [activeView, setActiveView] = useState<ActiveView>('landing');
  const [activeSubView, setActiveSubView] = useState<ActiveSubView>('overview');

  // Global Vendors State
  const [vendors, setVendors] = useState<Vendor[]>(defaultVendors);

  // Logged-in Vendor State
  const [loggedInVendor, setLoggedInVendor] = useState<any>({
    nama: 'CV. Dapur Nusantara Sejahtera',
    email: 'vendor@dapurnusantara.com',
    id: 'V-001'
  });

  // Global Complaints State
  const [globalComplaints, setGlobalComplaints] = useState<GlobalComplaint[]>([
    { id: '#CMP-8801', sekolah: 'SDN 1 Parepare', severity: 'High', laporan: 'Ditemukan benda asing pada makanan', status: 'Investigating', tanggal: '12/08/2026', kategori: 'Higiene & Keamanan', fotoBukti: true, sumber: 'Sekolah' },
    { id: '#CMP-8777', sekolah: 'MTs Negeri Parepare', severity: 'High', laporan: 'SPPG terlambat 1 jam pengiriman tanpa konfirmasi', status: 'Open', tanggal: '11/08/2026', kategori: 'Keterlambatan/Absen', fotoBukti: false, sumber: 'Sekolah' },
    { id: '#CMP-8720', sekolah: 'SDN 5 Parepare', severity: 'Medium', laporan: 'Porsi kurang dari surat jalan selama 3 hari', status: 'Resolved', tanggal: '10/08/2026', kategori: 'Porsi Kurang', fotoBukti: false, sumber: 'Sekolah' },
    { id: '#CMP-8812', sekolah: 'SDN 1 Parepare', severity: 'Low', laporan: 'Nasi agak keras di kelas 4B', status: 'Open', tanggal: '12/08/2026', kategori: 'Kualitas Makanan', fotoBukti: false, sumber: 'Publik' },
  ]);

  const addComplaint = (complaint: Omit<GlobalComplaint, 'id' | 'status' | 'tanggal' | 'sekolah'> & { sekolah?: string }) => {
    const newId = `#CMP-${Math.floor(8900 + Math.random() * 100)}`;
    setGlobalComplaints(prev => [{
      id: newId,
      sekolah: complaint.sekolah || 'SDN 1 Parepare',
      severity: complaint.severity,
      laporan: complaint.laporan,
      kategori: complaint.kategori,
      fotoBukti: complaint.fotoBukti,
      sumber: complaint.sumber,
      status: 'Open',
      tanggal: new Date().toLocaleDateString('id-ID')
    }, ...prev]);
  };

  const updateComplaintStatus = (id: string, status: GlobalComplaintStatus) => {
    setGlobalComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const registerVendor = (newReg: any) => {
    const newId = `V-${String(vendors.length + 1).padStart(3, '0')}`;
    const newVendor: Vendor = {
      id: newId,
      nama: newReg.nama,
      kota: newReg.kota,
      provinsi: newReg.provinsi,
      kapasitas: newReg.kapasitas || 3000,
      hargaSatuan: 14500,
      distribusiHariIni: 0,
      statusVerifikasi: 'Pending',
      risikoSkor: 100,
      anomali: [],
      lat: newReg.lat || -6.2,
      lng: newReg.lng || 106.8,
      lastReport: 'Baru Terdaftar',
      statusOnboarding: 'Pending Verifikasi',
      tanggalDaftar: new Date().toLocaleDateString('id-ID'),
      totalDistribusiAllTime: 0,
      ceklistOnboarding: { nib: true, fotoDapur: false, gpsLokasi: false, rekeningAktif: true, kunjunganLapangan: false }
    };
    
    // Embed login properties
    (newVendor as any).email = newReg.email;
    (newVendor as any).password = newReg.password;
    (newVendor as any).telepon = newReg.telepon;
    (newVendor as any).direktur = newReg.direktur;
    
    // Add 7 documents status & custom filename
    (newVendor as any).dokumenPersyaratan = {
      akta: { namaFile: newReg.files?.akta || 'akta_pendirian.pdf', status: 'Menunggu Verifikasi' },
      nib: { namaFile: newReg.files?.nib || 'nib_oss.pdf', status: 'Menunggu Verifikasi' },
      npwp: { namaFile: newReg.files?.npwp || 'npwp_badan.pdf', status: 'Menunggu Verifikasi' },
      proposal: { namaFile: newReg.files?.proposal || 'proposal_kerjasama.pdf', status: 'Menunggu Verifikasi' },
      logo: { namaFile: newReg.files?.logo || 'logo_sppg.png', status: 'Menunggu Verifikasi' },
      kontak: { namaFile: newReg.files?.kontak || 'ktp_kontak.pdf', status: 'Menunggu Verifikasi' },
      lokasi: { namaFile: newReg.files?.lokasi || 'lokasi_kesiapan.pdf', status: 'Menunggu Verifikasi' },
    };
    
    setVendors(prev => [...prev, newVendor]);
  };

  const updateVendorDocuments = (vendorId: string, docKey: string, status: string, filename?: string) => {
    setVendors(prev => prev.map(v => {
      if (v.id === vendorId) {
        const currentDocs = (v as any).dokumenPersyaratan || {};
        const updatedDoc = {
          namaFile: filename || currentDocs[docKey]?.namaFile || 'document.pdf',
          status: status
        };
        return {
          ...v,
          dokumenPersyaratan: {
            ...currentDocs,
            [docKey]: updatedDoc
          }
        };
      }
      return v;
    }));

    setLoggedInVendor((prev: any) => {
      if (prev && prev.id === vendorId) {
        const currentDocs = prev.dokumenPersyaratan || {};
        const updatedDoc = {
          namaFile: filename || currentDocs[docKey]?.namaFile || 'document.pdf',
          status: status
        };
        return {
          ...prev,
          dokumenPersyaratan: {
            ...currentDocs,
            [docKey]: updatedDoc
          }
        };
      }
      return prev;
    });
  };

  // Reset sub-view when role changes
  const handleSetActiveView = (view: ActiveView) => {
    setActiveView(view);
    if (view === 'command') setActiveSubView('overview');
    else if (view === 'sppg') setActiveSubView('dashboard');
    else if (view === 'sekolah') setActiveSubView('dashboard');
  };

  // Hybrid Routing Layout
  if (activeView === 'landing') {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--color-bg-base)]">
        <TopNavbar setActiveView={handleSetActiveView} />
        <main className="flex-1 w-full max-w-[1440px] mx-auto relative overflow-hidden">
          <LandingPage setActiveView={handleSetActiveView} addComplaint={addComplaint} registerVendor={registerVendor} />
        </main>
      </div>
    );
  }

  if (activeView === 'login') {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--color-bg-base)]">
        <TopNavbar setActiveView={handleSetActiveView} />
        <main className="flex-1 w-full max-w-[1440px] mx-auto relative overflow-hidden">
          <LoginPage setActiveView={handleSetActiveView} vendors={vendors} setLoggedInVendor={setLoggedInVendor} />
        </main>
      </div>
    );
  }

  // Dashboard Layout with Sidebar
  return (
    <div className="min-h-screen flex bg-[var(--color-bg-base)] overflow-hidden">
      <Sidebar
        activeView={activeView}
        setActiveView={handleSetActiveView}
        activeSubView={activeSubView}
        setActiveSubView={setActiveSubView}
        loggedInVendor={loggedInVendor}
      />
      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        {activeView === 'sppg' && (
          <SppgPortal 
            activeSubView={activeSubView as SppgSubView} 
            setActiveSubView={setActiveSubView} 
            loggedInVendor={loggedInVendor}
            updateVendorDocuments={updateVendorDocuments}
          />
        )}
        {activeView === 'sekolah' && (
          <SchoolPortal 
            activeSubView={activeSubView as SekolahSubView} 
            setActiveSubView={setActiveSubView} 
            complaints={globalComplaints.filter(c => c.sekolah === 'SDN 1 Parepare')}
            updateComplaintStatus={updateComplaintStatus}
            addComplaint={addComplaint}
          />
        )}
        {activeView === 'command' && (
          <CommandCenter 
            activeSubView={activeSubView as BgnSubView} 
            setActiveSubView={setActiveSubView}
            complaints={globalComplaints}
            updateComplaintStatus={updateComplaintStatus}
            vendors={vendors}
            setVendors={setVendors}
          />
        )}
      </main>
    </div>
  );
}
