'use client';

import { ArrowRight, Building2, GraduationCap, BarChart3, Shield, User, Lock, Info } from 'lucide-react';
import type { ActiveView } from './KawalApp';
import { useState } from 'react';

interface LoginPageProps {
  setActiveView: (view: ActiveView) => void;
  vendors?: any[];
  setLoggedInVendor?: (vendor: any) => void;
}

export default function LoginPage({ setActiveView, vendors, setLoggedInVendor }: LoginPageProps) {
  const [role, setRole] = useState<'command' | 'sppg' | 'sekolah'>('command');
  const [email, setEmail] = useState('admin@bgn.go.id');
  const [password, setPassword] = useState('password123');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginNotice, setLoginNotice] = useState<string | null>(null);

  const handleRoleChange = (newRole: 'command' | 'sppg' | 'sekolah') => {
    setRole(newRole);
    setLoginError(null);
    setLoginNotice(null);
    if (newRole === 'command') {
      setEmail('admin@bgn.go.id');
    } else if (newRole === 'sppg') {
      setEmail('vendor@dapurnusantara.com');
    } else {
      setEmail('kepsek@sdn01cilandak.sch.id');
    }
    setPassword('password123');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginNotice(null);

    if (role === 'sppg') {
      // Check default vendor credentials
      if (email === 'vendor@dapurnusantara.com' && password === 'password123') {
        if (setLoggedInVendor) {
          setLoggedInVendor({
            id: 'V-001',
            nama: 'CV. Dapur Nusantara Sejahtera',
            email: 'vendor@dapurnusantara.com'
          });
        }
        setActiveView('sppg');
        return;
      }

      // Check dynamically registered vendors
      const match = vendors?.find(v => (v as any).email === email);
      if (match) {
        if ((match as any).password !== password) {
          setLoginError('Kata sandi yang Anda masukkan salah.');
          return;
        }
        
        if (match.statusVerifikasi === 'Pending') {
          // Allow login but keep status pending
          if (setLoggedInVendor) {
            setLoggedInVendor(match);
          }
          setActiveView('sppg');
          return;
        }

        if (match.statusVerifikasi === 'Ditolak') {
          setLoginError('Kemitraan Ditolak: Pendaftaran dapur Anda ditolak oleh BGN Pusat karena ketidaksesuaian dokumen.');
          return;
        }

        // Active
        if (setLoggedInVendor) {
          setLoggedInVendor(match);
        }
        setActiveView('sppg');
      } else {
        setLoginError('Kredensial login tidak terdaftar di sistem BGN.');
      }
    } else {
      setActiveView(role);
    }
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
                <button
                  type="button"
                  onClick={() => handleRoleChange('command')}
                  className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all text-left w-full ${role === 'command' ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold shadow-sm' : 'border-slate-200 hover:border-slate-300 font-medium'}`}
                >
                  <BarChart3 className={`w-5 h-5 ${role === 'command' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="text-sm">BGN Command Center (Regulator)</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleRoleChange('sppg')}
                  className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all text-left w-full ${role === 'sppg' ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold shadow-sm' : 'border-slate-200 hover:border-slate-300 font-medium'}`}
                >
                  <Building2 className={`w-5 h-5 ${role === 'sppg' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="text-sm">SPPG Portal (Mitra Vendor)</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleRoleChange('sekolah')}
                  className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all text-left w-full ${role === 'sekolah' ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold shadow-sm' : 'border-slate-200 hover:border-slate-300 font-medium'}`}
                >
                  <GraduationCap className={`w-5 h-5 ${role === 'sekolah' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="text-sm">School Portal (Penerima)</span>
                </button>
              </div>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-800 text-xs font-bold p-3 rounded-lg flex items-start gap-2">
                <Shield className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{loginError}</span>
              </div>
            )}

            {loginNotice && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold p-3 rounded-lg flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>{loginNotice}</span>
              </div>
            )}

            {!loginError && !loginNotice && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-2">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-blue-900 text-sm mb-1">Demo Hackathon</div>
                    <div className="text-xs text-blue-700">
                      Silakan pilih <strong>Role</strong> di atas, lalu klik tombol <strong>Masuk ke Sistem</strong> untuk melihat antarmuka masing-masing role. Anda juga dapat mengubah ID/email dan password jika diinginkan.
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                ID Kredensial / Email
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 pl-10 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="Masukkan email..."
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 pl-10 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="Masukkan kata sandi..."
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
