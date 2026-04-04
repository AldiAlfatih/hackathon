'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Camera, Scan, CheckCircle2, XCircle, AlertTriangle,
  RefreshCw, Zap, ChevronRight, Info, Clock
} from 'lucide-react';

interface ScanResult {
  id: string;
  timestamp: string;
  vendor: string;
  lokasi: string;
  skor: number;
  status: 'lulus' | 'gagal' | 'warning';
  deteksi: {
    nasi: { detected: boolean; porsi: string; nilai: number };
    lauk: { detected: boolean; jenis: string; nilai: number };
    sayur: { detected: boolean; jenis: string; nilai: number };
    buah: { detected: boolean; ada: boolean; nilai: number };
  };
  kalori: number;
  protein: number;
  catatan: string;
}

const riwayatScan: ScanResult[] = [
  {
    id: 'SC-001',
    timestamp: '22:01:12',
    vendor: 'PT Nusantara Gizi Mandiri',
    lokasi: 'SDN 01 Cilandak',
    skor: 96,
    status: 'lulus',
    deteksi: {
      nasi: { detected: true, porsi: '200g', nilai: 95 },
      lauk: { detected: true, jenis: 'Ayam Goreng', nilai: 98 },
      sayur: { detected: true, jenis: 'Bayam + Wortel', nilai: 97 },
      buah: { detected: true, ada: true, nilai: 90 },
    },
    kalori: 650, protein: 28, catatan: 'Standar gizi terpenuhi',
  },
  {
    id: 'SC-002',
    timestamp: '21:45:33',
    vendor: 'CV Berkah Pangan Sehat',
    lokasi: 'SMPN 7 Bandung',
    skor: 72,
    status: 'warning',
    deteksi: {
      nasi: { detected: true, porsi: '150g', nilai: 75 },
      lauk: { detected: true, jenis: 'Tempe Goreng', nilai: 80 },
      sayur: { detected: true, jenis: 'Kol', nilai: 65 },
      buah: { detected: false, ada: false, nilai: 0 },
    },
    kalori: 450, protein: 15, catatan: 'Porsi nasi kurang, buah tidak ada',
  },
  {
    id: 'SC-003',
    timestamp: '21:22:08',
    vendor: 'UD Maju Bersama',
    lokasi: 'SDN 03 Surabaya',
    skor: 45,
    status: 'gagal',
    deteksi: {
      nasi: { detected: true, porsi: '100g', nilai: 50 },
      lauk: { detected: false, jenis: 'Tidak Terdeteksi', nilai: 0 },
      sayur: { detected: false, jenis: 'Tidak Terdeteksi', nilai: 0 },
      buah: { detected: false, ada: false, nilai: 0 },
    },
    kalori: 320, protein: 5, catatan: 'Tidak memenuhi standar gizi minimum',
  },
];

type ScanPhase = 'idle' | 'detecting' | 'analyzing' | 'done';

export default function InspectorApp() {
  const [scanPhase, setScanPhase] = useState<ScanPhase>('idle');
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<ScanResult | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [detectedItems, setDetectedItems] = useState<string[]>([]);

  const startScan = () => {
    setScanPhase('detecting');
    setScanProgress(0);
    setDetectedItems([]);
    setCurrentResult(null);

    // Phase 1: detecting
    const items = ['🍚 Nasi terdeteksi', '🍗 Lauk protein terdeteksi', '🥬 Sayuran terdeteksi', '🍊 Buah terdeteksi'];
    items.forEach((item, i) => {
      setTimeout(() => setDetectedItems((prev) => [...prev, item]), (i + 1) * 600);
    });

    // Phase 2: analyzing
    setTimeout(() => setScanPhase('analyzing'), 3000);

    // Phase 3: done
    setTimeout(() => {
      setScanPhase('done');
      setScanProgress(100);
      setCurrentResult(riwayatScan[0]);
    }, 5000);
  };

  const reset = () => {
    setScanPhase('idle');
    setScanProgress(0);
    setDetectedItems([]);
    setCurrentResult(null);
  };

  const statusStyle = (status: ScanResult['status']) => {
    if (status === 'lulus') return { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-600/30', label: '✓ LULUS' };
    if (status === 'gagal') return { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-600/30', label: '✗ GAGAL' };
    return { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-600/30', label: '⚠ PERINGATAN' };
  };

  const skorColor = (skor: number) => {
    if (skor >= 80) return '#10b981';
    if (skor >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 fade-in">
          <div className="flex items-center gap-2 text-sm text-blue-400 mb-3">
            <Camera className="w-4 h-4" />
            <span>Aplikasi Pengawas</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">AI Nutrition Scanner</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Nutrition Scanner</h1>
          <p className="text-blue-300">Verifikasi standar gizi porsi makanan secara real-time menggunakan Computer Vision</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Camera View - Left */}
          <div className="lg:col-span-3 space-y-4">
            {/* Viewfinder */}
            <div className="glass-card overflow-hidden">
              {/* Camera viewfinder */}
              <div className="relative aspect-video" style={{ background: '#040d1a' }}>
                {/* Simulated camera feed background */}
                <div className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(59,130,246,0.1) 30px, rgba(59,130,246,0.1) 31px), repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(59,130,246,0.1) 30px, rgba(59,130,246,0.1) 31px)'
                  }}
                />

                {/* Food plate simulation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {scanPhase === 'idle' && (
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-blue-700 mx-auto mb-3 opacity-60" />
                      <div className="text-blue-600 text-sm">Arahkan kamera ke piring makanan</div>
                    </div>
                  )}

                  {(scanPhase === 'detecting' || scanPhase === 'analyzing') && (
                    <div className="relative w-48 h-48">
                      {/* Food plate visual */}
                      <div className="absolute inset-0 rounded-full opacity-30"
                        style={{ background: 'radial-gradient(circle, #92400e, #78350f)' }} />
                      <div className="absolute inset-4 rounded-full opacity-60"
                        style={{ background: 'radial-gradient(circle, #d97706, #92400e)' }} />
                      {/* Bounding boxes */}
                      {detectedItems.length > 0 && (
                        <div className="absolute top-2 left-2 w-16 h-14 border-2 border-green-400 rounded"
                          style={{ boxShadow: '0 0 8px rgba(74,222,128,0.4)' }}>
                          <span className="absolute -top-5 left-0 text-xs text-green-400 bg-green-900/80 px-1 rounded">nasi</span>
                        </div>
                      )}
                      {detectedItems.length > 1 && (
                        <div className="absolute top-6 right-2 w-14 h-14 border-2 border-blue-400 rounded"
                          style={{ boxShadow: '0 0 8px rgba(96,165,250,0.4)' }}>
                          <span className="absolute -top-5 left-0 text-xs text-blue-400 bg-blue-900/80 px-1 rounded">lauk</span>
                        </div>
                      )}
                      {detectedItems.length > 2 && (
                        <div className="absolute bottom-2 left-4 w-16 h-10 border-2 border-emerald-400 rounded"
                          style={{ boxShadow: '0 0 8px rgba(52,211,153,0.4)' }}>
                          <span className="absolute -top-5 left-0 text-xs text-emerald-400 bg-emerald-900/80 px-1 rounded">sayur</span>
                        </div>
                      )}
                      {detectedItems.length > 3 && (
                        <div className="absolute bottom-2 right-2 w-10 h-10 border-2 border-orange-400 rounded"
                          style={{ boxShadow: '0 0 8px rgba(251,146,60,0.4)' }}>
                          <span className="absolute -top-5 left-0 text-xs text-orange-400 bg-orange-900/80 px-1 rounded">buah</span>
                        </div>
                      )}
                    </div>
                  )}

                  {scanPhase === 'done' && currentResult && (
                    <div className={`text-center ${statusStyle(currentResult.status).color}`}>
                      {currentResult.status === 'lulus'
                        ? <CheckCircle2 className="w-16 h-16 mx-auto mb-2" />
                        : currentResult.status === 'gagal'
                        ? <XCircle className="w-16 h-16 mx-auto mb-2" />
                        : <AlertTriangle className="w-16 h-16 mx-auto mb-2" />
                      }
                      <div className="text-3xl font-bold">{currentResult.skor}</div>
                      <div className="text-sm opacity-80">Skor Gizi</div>
                    </div>
                  )}
                </div>

                {/* Scanner line animation */}
                {scanPhase === 'detecting' && (
                  <div className="absolute left-0 right-0 scanner-line" style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)' }} />
                )}

                {/* HUD Overlay */}
                <div className="absolute top-3 left-3 text-xs font-mono text-blue-400">
                  <div className="flex items-center gap-1">
                    <span className={scanPhase === 'idle' ? 'text-blue-600' : 'text-red-400 blink'}>●</span>
                    {scanPhase === 'idle' ? 'STANDBY' : scanPhase === 'detecting' ? 'SCANNING...' : scanPhase === 'analyzing' ? 'ANALYZING...' : 'SCAN COMPLETE'}
                  </div>
                </div>
                <div className="absolute top-3 right-3 text-xs font-mono text-blue-500">
                  AI v2.1 | 60fps
                </div>
                <div className="absolute bottom-3 left-3 text-xs font-mono text-blue-500">
                  CAM-01 | {new Date().toLocaleTimeString('id-ID')}
                </div>
                {scanPhase !== 'idle' && (
                  <div className="absolute bottom-3 right-3 text-xs font-mono text-green-400">
                    GPS: -6.2501, 106.8243
                  </div>
                )}

                {/* Corner brackets */}
                {(['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'] as const).map((pos, i) => (
                  <div key={i} className={`absolute ${pos} w-6 h-6 border-blue-500/60 ${i < 2 ? 'border-t-2' : 'border-b-2'} ${i % 2 === 0 ? 'border-l-2' : 'border-r-2'}`} />
                ))}
              </div>

              {/* Controls */}
              <div className="p-4 flex items-center justify-between border-t border-blue-900/30">
                <div className="flex items-center gap-3">
                  {detectedItems.map((item, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-green-900/30 text-green-400 slide-in">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  {scanPhase !== 'idle' && (
                    <button onClick={reset} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-blue-400 border border-blue-800/50 hover:bg-blue-900/30 transition-colors">
                      <RefreshCw className="w-4 h-4" /> Reset
                    </button>
                  )}
                  <button
                    onClick={startScan}
                    disabled={scanPhase !== 'idle'}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                    style={{ background: scanPhase !== 'idle' ? '#1e3a5f' : 'linear-gradient(135deg, #1d4ed8, #0ea5e9)' }}
                  >
                    {scanPhase === 'idle' ? (
                      <><Scan className="w-4 h-4" /> Mulai Scan</>
                    ) : scanPhase === 'detecting' || scanPhase === 'analyzing' ? (
                      <><RefreshCw className="w-4 h-4 animate-spin" /> Memproses...</>
                    ) : (
                      <><Zap className="w-4 h-4" /> Scan Selesai</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Scan Result */}
            {scanPhase === 'done' && currentResult && (
              <div className={`glass-card p-6 border ${statusStyle(currentResult.status).border} fade-in`}>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Hasil Pemeriksaan Gizi</h3>
                    <p className="text-sm text-blue-400">{currentResult.vendor} · {currentResult.lokasi}</p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-sm font-bold ${statusStyle(currentResult.status).bg} ${statusStyle(currentResult.status).color}`}>
                    {statusStyle(currentResult.status).label}
                  </div>
                </div>

                {/* Nutrition breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  {Object.entries(currentResult.deteksi).map(([key, val]) => (
                    <div key={key} className={`p-3 rounded-lg border ${val.detected ? 'border-green-700/30 bg-green-900/10' : 'border-red-700/30 bg-red-900/10'}`}>
                      <div className="text-xs text-blue-400 capitalize mb-1">{key}</div>
                      <div className={`font-semibold text-sm ${val.detected ? 'text-green-400' : 'text-red-400'}`}>
                        {val.detected ? ('porsi' in val ? val.porsi : ('jenis' in val ? val.jenis : 'Ada')) : 'Tidak Terdeteksi'}
                      </div>
                      <div className="mt-1.5 h-1 rounded-full bg-blue-900">
                        <div className="h-full rounded-full transition-all" style={{
                          width: `${val.nilai}%`,
                          background: val.nilai > 80 ? '#10b981' : val.nilai > 50 ? '#f59e0b' : '#ef4444'
                        }} />
                      </div>
                      <div className="text-xs text-blue-500 mt-1">{val.nilai}%</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Skor Gizi', value: `${currentResult.skor}/100`, color: skorColor(currentResult.skor) },
                    { label: 'Kalori', value: `${currentResult.kalori} kkal`, color: '#60a5fa' },
                    { label: 'Protein', value: `${currentResult.protein}g`, color: '#a78bfa' },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-lg bg-blue-900/20 text-center">
                      <div className="text-xs text-blue-400 mb-1">{item.label}</div>
                      <div className="text-lg font-bold" style={{ color: item.color }}>{item.value}</div>
                    </div>
                  ))}
                </div>

                {currentResult.catatan && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-900/20 text-sm">
                    <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-blue-200">{currentResult.catatan}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Riwayat Pemeriksaan - Right */}
          <div className="lg:col-span-2">
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                Riwayat Pemeriksaan Hari Ini
              </h3>
              <div className="space-y-3">
                {riwayatScan.map((item) => {
                  const st = statusStyle(item.status);
                  const isSelected = selectedHistory?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedHistory(isSelected ? null : item)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected ? `${st.border} ${st.bg}` : 'border-blue-900/30 hover:border-blue-700/40 bg-blue-900/10 hover:bg-blue-900/20'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-sm font-medium text-white truncate max-w-36">{item.vendor}</div>
                          <div className="text-xs text-blue-500">{item.lokasi}</div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <div className={`text-xs font-bold ${st.color}`}>{st.label}</div>
                          <div className="text-xs text-blue-500 mt-0.5 font-mono">{item.timestamp}</div>
                        </div>
                      </div>

                      {/* Skor bar */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-blue-900">
                          <div className="h-full rounded-full" style={{
                            width: `${item.skor}%`,
                            background: skorColor(item.skor)
                          }} />
                        </div>
                        <span className="text-xs font-bold" style={{ color: skorColor(item.skor) }}>{item.skor}</span>
                      </div>

                      {/* Detail if selected */}
                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-blue-900/30 grid grid-cols-2 gap-2 text-xs fade-in">
                          {Object.entries(item.deteksi).map(([key, val]) => (
                            <div key={key} className="flex items-center justify-between">
                              <span className="capitalize text-blue-400">{key}</span>
                              <span className={val.detected ? 'text-green-400' : 'text-red-400'}>
                                {val.detected ? '✓' : '✗'}
                              </span>
                            </div>
                          ))}
                          <div className="col-span-2 mt-1">
                            <span className="text-blue-500">{item.catatan}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="mt-5 pt-4 border-t border-blue-900/30 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="text-green-400 font-bold text-lg">1</div>
                  <div className="text-blue-500">Lulus</div>
                </div>
                <div>
                  <div className="text-yellow-400 font-bold text-lg">1</div>
                  <div className="text-blue-500">Peringatan</div>
                </div>
                <div>
                  <div className="text-red-400 font-bold text-lg">1</div>
                  <div className="text-blue-500">Gagal</div>
                </div>
              </div>
            </div>

            {/* Kriteria standar gizi */}
            <div className="glass-card p-5 mt-4">
              <h3 className="text-sm font-semibold text-white mb-4">📊 Standar Gizi MBG</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Nasi / Karbohidrat', min: '150g', color: '#f59e0b' },
                  { label: 'Lauk Hewani / Nabati', min: '75g', color: '#3b82f6' },
                  { label: 'Sayuran Hijau', min: '50g', color: '#10b981' },
                  { label: 'Buah', min: 'Disarankan', color: '#f97316' },
                  { label: 'Total Kalori', min: '550–750 kkal', color: '#8b5cf6' },
                  { label: 'Total Protein', min: '20–35g', color: '#ec4899' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                      <span className="text-blue-200">{item.label}</span>
                    </div>
                    <span className="text-blue-500 font-mono">{item.min}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
