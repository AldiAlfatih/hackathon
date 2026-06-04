'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SppgPortal from './SppgPortal';
import SchoolPortal from './SchoolPortal';
import CommandCenter from './CommandCenter';

export type ActiveView = 'landing' | 'login' | 'sppg' | 'sekolah' | 'command';

// Sub-views per role
export type BgnSubView = 'overview' | 'risk' | 'licensing-review' | 'finance' | 'complaints' | 'ghost-detection';
export type SppgSubView = 'dashboard' | 'licensing' | 'nutrition' | 'delivery-history' | 'onboarding' | 'hygiene';
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

  // Global Complaints State
  const [globalComplaints, setGlobalComplaints] = useState<GlobalComplaint[]>([
    { id: '#CMP-8801', sekolah: 'SDN 12 Karet Setiabudi', severity: 'High', laporan: 'Ditemukan benda asing (kecoa) pada makanan', status: 'Investigating', tanggal: '12/08/2026', kategori: 'Higiene & Keamanan', fotoBukti: true, sumber: 'Sekolah' },
    { id: '#CMP-8777', sekolah: 'MTsN 3 Depok', severity: 'High', laporan: 'SPPG tidak hadir 2 hari berturut-turut tanpa konfirmasi', status: 'Open', tanggal: '11/08/2026', kategori: 'Keterlambatan/Absen', fotoBukti: false, sumber: 'Sekolah' },
    { id: '#CMP-8720', sekolah: 'SDN 05 Lebak Bulus', severity: 'Medium', laporan: 'Porsi kurang dari surat jalan selama 3 hari', status: 'Resolved', tanggal: '10/08/2026', kategori: 'Porsi Kurang', fotoBukti: false, sumber: 'Sekolah' },
    { id: '#CMP-8812', sekolah: 'SDN 01 Cilandak', severity: 'Low', laporan: 'Nasi agak keras di kelas 4B', status: 'Open', tanggal: '12/08/2026', kategori: 'Kualitas Makanan', fotoBukti: false, sumber: 'Publik' },
  ]);

  const addComplaint = (complaint: Omit<GlobalComplaint, 'id' | 'status' | 'tanggal' | 'sekolah'> & { sekolah?: string }) => {
    const newId = `#CMP-${Math.floor(8900 + Math.random() * 100)}`;
    setGlobalComplaints(prev => [{
      id: newId,
      sekolah: complaint.sekolah || 'SDN 01 Cilandak',
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
          <LandingPage setActiveView={handleSetActiveView} addComplaint={addComplaint} />
        </main>
      </div>
    );
  }

  if (activeView === 'login') {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--color-bg-base)]">
        <TopNavbar setActiveView={handleSetActiveView} />
        <main className="flex-1 w-full max-w-[1440px] mx-auto relative overflow-hidden">
          <LoginPage setActiveView={handleSetActiveView} />
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
      />
      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        {activeView === 'sppg' && <SppgPortal activeSubView={activeSubView as SppgSubView} setActiveSubView={setActiveSubView} />}
        {activeView === 'sekolah' && (
          <SchoolPortal 
            activeSubView={activeSubView as SekolahSubView} 
            setActiveSubView={setActiveSubView} 
            complaints={globalComplaints.filter(c => c.sekolah === 'SDN 01 Cilandak')}
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
          />
        )}
      </main>
    </div>
  );
}
