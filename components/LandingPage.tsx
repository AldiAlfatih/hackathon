'use client';

import { Shield, TrendingUp, Users, MapPin, Activity, ArrowRight, CheckCircle, AlertTriangle, Zap, Globe } from 'lucide-react';
import type { ActiveView } from './KawalApp';
import { statsData } from '@/lib/mockData';

interface LandingPageProps {
  setActiveView: (view: ActiveView) => void;
}

const features = [
  {
    icon: Users,
    title: 'Portal Vendor',
    desc: 'Pendaftaran digital dengan OCR pintar dan pelaporan distribusi bergeotag.',
    view: 'vendor' as ActiveView,
    color: '#3b82f6',
    badge: 'Vendor',
  },
  {
    icon: Activity,
    title: 'Aplikasi Pengawas',
    desc: 'AI Nutrition Scanner real-time untuk verifikasi standar gizi porsi makanan.',
    view: 'inspector' as ActiveView,
    color: '#10b981',
    badge: 'Pengawas',
  },
  {
    icon: Globe,
    title: 'Command Center',
    desc: 'Dashboard analitik dengan Vendor Risk Scoring dan peta distribusi nasional.',
    view: 'command' as ActiveView,
    color: '#8b5cf6',
    badge: 'Regulator',
  },
];

const kontribusi = [
  { label: 'Target Pertumbuhan Ekonomi', value: '8%', desc: 'Sesuai Asta Cita', color: '#3b82f6' },
  { label: 'Nilai Ekonomi Harian', value: statsData.nilaiEkonomi, desc: 'Perputaran vendor MBG', color: '#10b981' },
  { label: 'Siswa Penerima Manfaat', value: '82.540', desc: 'Distribusi hari ini', color: '#f59e0b' },
  { label: 'Vendor Terverifikasi', value: '2.391', desc: 'Dari 2.847 terdaftar', color: '#8b5cf6' },
];

export default function LandingPage({ setActiveView }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 md:py-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #1d4ed8, transparent)', filter: 'blur(60px)' }} />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #0ea5e9, transparent)', filter: 'blur(50px)' }} />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-700/50 text-sm text-blue-300 mb-8"
            style={{ background: 'rgba(29, 78, 216, 0.1)' }}>
            <Zap className="w-4 h-4 text-yellow-400" />
            Prototipe Kompetisi PIDI Digdaya 2026
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Platform Digital{' '}
            <span className="gradient-text">KAWAL-MBG</span>
          </h1>

          <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-8 leading-relaxed">
            Sistem terintegrasi untuk perizinan, pengawasan, dan transparansi program{' '}
            <strong className="text-white">Makan Bergizi Gratis</strong> — mendorong akuntabilitas
            layanan publik dan pertumbuhan ekonomi digital Indonesia.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <button
              onClick={() => setActiveView('command')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #1d4ed8, #0ea5e9)' }}
            >
              Masuk Command Center
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveView('vendor')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-blue-300 border border-blue-700/60 hover:bg-blue-900/30 transition-all"
            >
              Daftar sebagai Vendor
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-4">
            {[
              { label: 'Total Vendor', value: statsData.totalVendor.toLocaleString('id-ID'), icon: '🏭' },
              { label: 'Distribusi Hari Ini', value: statsData.distribusiHariIni.toLocaleString('id-ID'), icon: '🍱' },
              { label: 'Nilai Ekonomi', value: statsData.nilaiEkonomi, icon: '💰' },
              { label: 'Anomali Terdeteksi', value: statsData.anomaliTerdeteksi.toString(), icon: '⚠️' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-4 fade-in">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-blue-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Summary Section */}
      <section className="px-6 py-12 border-t border-blue-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 rounded-full bg-blue-500" />
            <h2 className="text-2xl font-bold text-white">Ringkasan Eksekutif</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Left text */}
            <div className="glass-card p-6">
              <div className="flex items-start gap-3 mb-4">
                <Shield className="w-6 h-6 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white mb-2">Latar Belakang</h3>
                  <p className="text-blue-200 text-sm leading-relaxed">
                    Program Makan Bergizi Gratis (MBG) merupakan program prioritas nasional dengan anggaran Rp 71 triliun
                    yang berdampak langsung pada 82 juta penerima manfaat. Tanpa sistem pengawasan digital yang kuat,
                    risiko penyimpangan dan inefisiensi dapat menghambat target pertumbuhan ekonomi 8%.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-800/40">
                <p className="text-sm text-blue-300 leading-relaxed">
                  <strong className="text-white">KAWAL-MBG</strong> hadir sebagai solusi GovTech yang
                  mengintegrasikan AI, geospatial tracking, dan fraud detection untuk memastikan setiap
                  rupiah anggaran tepat sasaran dan teraudit secara real-time.
                </p>
              </div>
            </div>

            {/* Right: kontribusi */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Kontribusi terhadap Target 8%
              </h3>
              <div className="space-y-3">
                {kontribusi.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm text-blue-200">{item.label}</div>
                      <div className="text-xs text-blue-500">{item.desc}</div>
                    </div>
                    <div className="text-lg font-bold flex-shrink-0" style={{ color: item.color }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="glass-card p-6 hover:border-blue-600/50 transition-all duration-300 group cursor-pointer"
                  onClick={() => setActiveView(feature.view)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${feature.color}22` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: feature.color }} />
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ background: `${feature.color}22`, color: feature.color }}
                    >
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-blue-300 leading-relaxed mb-4">{feature.desc}</p>
                  <div className="flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all"
                    style={{ color: feature.color }}
                  >
                    Akses Portal <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Keunggulan */}
      <section className="px-6 py-12 border-t border-blue-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 rounded-full bg-green-500" />
            <h2 className="text-2xl font-bold text-white">Keunggulan Platform</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Smart OCR Document Processing', desc: 'Ekstraksi data dokumen otomatis dengan akurasi 95%+' },
              { label: 'AI Nutrition Verification', desc: 'Validasi porsi gizi via computer vision real-time' },
              { label: 'Vendor Risk Scoring', desc: 'Deteksi anomali otomatis berbasis machine learning' },
              { label: 'Geospatial Tracking', desc: 'Setiap laporan distribusi terverifikasi koordinat GPS' },
              { label: 'Fraud Detection Engine', desc: 'Identifikasi harga tidak wajar dan dokumen palsu' },
              { label: 'Real-time Command Center', desc: 'Dashboard kebijakan nasional berbasis data aktual' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 p-4 rounded-xl border border-blue-900/30 hover:border-blue-700/40 transition-colors"
                style={{ background: 'rgba(15, 30, 60, 0.4)' }}
              >
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-white">{item.label}</div>
                  <div className="text-xs text-blue-400 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-900/30 px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-blue-400" />
          <span className="font-semibold text-white">KAWAL-MBG</span>
        </div>
        <p className="text-sm text-blue-500">
          Prototipe untuk Kompetisi PIDI Digdaya 2026 · Dibangun untuk Layanan Publik Indonesia
        </p>
      </footer>
    </div>
  );
}
