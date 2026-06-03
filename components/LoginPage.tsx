'use client';

import { ArrowRight, Building2, GraduationCap, BarChart3, Shield, User, Lock } from 'lucide-react';
import type { ActiveView } from './KawalApp';
import { useState } from 'react';

interface LoginPageProps {
  setActiveView: (view: ActiveView) => void;
}

export default function LoginPage({ setActiveView }: LoginPageProps) {
  const [role, setRole] = useState<'command' | 'sppg' | 'sekolah'>('command');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveView(role);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-blue-50/50" style={{
        backgroundImage: `radial-gradient(var(--color-border-subtle) 1px, transparent 1px)`,
        backgroundSize: '24px 24px'
      }}></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/logo-mbg.png" alt="KAWAL-MBG Logo" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 tracking-tight">Otentikasi Sistem</h1>
          <p className="text-sm text-slate-600 mt-2">Masuk menggunakan kredensial instansi Anda</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pilih Hak Akses (Role)
              </label>
              <div className="grid grid-cols-1 gap-3">
                <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${role === 'command' ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="role" checked={role === 'command'} onChange={() => setRole('command')} className="hidden" />
                  <BarChart3 className={`w-5 h-5 ${role === 'command' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="font-bold text-sm">BGN Command Center (Regulator)</span>
                </label>
                
                <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${role === 'sppg' ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="role" checked={role === 'sppg'} onChange={() => setRole('sppg')} className="hidden" />
                  <Building2 className={`w-5 h-5 ${role === 'sppg' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="font-bold text-sm">SPPG Portal (Mitra Vendor)</span>
                </label>
                
                <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${role === 'sekolah' ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="role" checked={role === 'sekolah'} onChange={() => setRole('sekolah')} className="hidden" />
                  <GraduationCap className={`w-5 h-5 ${role === 'sekolah' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="font-bold text-sm">School Portal (Penerima)</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                ID Kredensial / Email
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Masukkan ID..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 pl-10 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Kata Sandi
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 pl-10 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex justify-center items-center gap-2 shadow-md"
            >
              Masuk ke Sistem <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <button 
              type="button"
              onClick={() => setActiveView('landing')}
              className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Kembali ke Portal Publik
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
