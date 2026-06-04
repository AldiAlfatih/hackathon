export interface Vendor {
  id: string;
  nama: string;
  kota: string;
  provinsi: string;
  kapasitas: number;
  hargaSatuan: number;
  distribusiHariIni: number;
  statusVerifikasi: "Terverifikasi" | "Pending" | "Ditolak";
  risikoSkor: number;
  anomali: string[];
  lat: number;
  lng: number;
  lastReport: string;
  // Anti-Ghost fields
  statusOnboarding: "Aktif" | "Pending Verifikasi" | "Belum Beroperasi" | "Diblokir";
  tanggalDaftar: string;
  totalDistribusiAllTime: number;
  ceklistOnboarding: {
    nib: boolean;
    fotoDapur: boolean;
    gpsLokasi: boolean;
    rekeningAktif: boolean;
    kunjunganLapangan: boolean;
  };
}


export interface FeedItem {
  id: string;
  waktu: string;
  vendor: string;
  lokasi: string;
  pesan: string;
  tipe: "aman" | "anomali" | "warning";
}

export interface DistribusiData {
  tanggal: string;
  target: number;
  realisasi: number;
  anomali: number;
}

export const vendors: Vendor[] = [
  {
    id: "V-001",
    nama: "PT Nusantara Gizi Mandiri",
    kota: "Jakarta Selatan",
    provinsi: "DKI Jakarta",
    kapasitas: 5000,
    hargaSatuan: 15000,
    distribusiHariIni: 4850,
    statusVerifikasi: "Terverifikasi",
    risikoSkor: 92,
    anomali: [],
    lat: -6.25,
    lng: 106.82,
    lastReport: "10 menit lalu",
    statusOnboarding: "Aktif",
    tanggalDaftar: "10 Jan 2026",
    totalDistribusiAllTime: 287400,
    ceklistOnboarding: { nib: true, fotoDapur: true, gpsLokasi: true, rekeningAktif: true, kunjunganLapangan: true },
  },
  {
    id: "V-002",
    nama: "CV Berkah Pangan Sehat",
    kota: "Bandung",
    provinsi: "Jawa Barat",
    kapasitas: 3000,
    hargaSatuan: 14500,
    distribusiHariIni: 2100,
    statusVerifikasi: "Terverifikasi",
    risikoSkor: 78,
    anomali: ["Laporan tanpa geotag (3 kali)"],
    lat: -6.91,
    lng: 107.61,
    lastReport: "25 menit lalu",
    statusOnboarding: "Aktif",
    tanggalDaftar: "15 Jan 2026",
    totalDistribusiAllTime: 124500,
    ceklistOnboarding: { nib: true, fotoDapur: true, gpsLokasi: true, rekeningAktif: true, kunjunganLapangan: true },
  },
  {
    id: "V-003",
    nama: "UD Maju Bersama Catering",
    kota: "Surabaya",
    provinsi: "Jawa Timur",
    kapasitas: 4500,
    hargaSatuan: 21000,
    distribusiHariIni: 4500,
    statusVerifikasi: "Terverifikasi",
    risikoSkor: 31,
    anomali: ["Harga bahan baku tidak wajar (+40%)", "Laporan tanpa geotag (7 kali)", "Distribusi melebihi kapasitas"],
    lat: -7.25,
    lng: 112.75,
    lastReport: "2 jam lalu",
    statusOnboarding: "Aktif",
    tanggalDaftar: "20 Jan 2026",
    totalDistribusiAllTime: 198000,
    ceklistOnboarding: { nib: true, fotoDapur: true, gpsLokasi: false, rekeningAktif: true, kunjunganLapangan: true },
  },
  {
    id: "V-004",
    nama: "PT Cipta Rasa Nusantara",
    kota: "Medan",
    provinsi: "Sumatera Utara",
    kapasitas: 2500,
    hargaSatuan: 14800,
    distribusiHariIni: 2480,
    statusVerifikasi: "Terverifikasi",
    risikoSkor: 88,
    anomali: [],
    lat: 3.59,
    lng: 98.67,
    lastReport: "15 menit lalu",
    statusOnboarding: "Aktif",
    tanggalDaftar: "05 Feb 2026",
    totalDistribusiAllTime: 112000,
    ceklistOnboarding: { nib: true, fotoDapur: true, gpsLokasi: true, rekeningAktif: true, kunjunganLapangan: true },
  },
  {
    id: "V-005",
    nama: "Koperasi Santri Sejahtera",
    kota: "Yogyakarta",
    provinsi: "DI Yogyakarta",
    kapasitas: 1800,
    hargaSatuan: 13500,
    distribusiHariIni: 1750,
    statusVerifikasi: "Terverifikasi",
    risikoSkor: 95,
    anomali: [],
    lat: -7.79,
    lng: 110.36,
    lastReport: "5 menit lalu",
    statusOnboarding: "Aktif",
    tanggalDaftar: "12 Feb 2026",
    totalDistribusiAllTime: 89600,
    ceklistOnboarding: { nib: true, fotoDapur: true, gpsLokasi: true, rekeningAktif: true, kunjunganLapangan: true },
  },
  {
    id: "V-006",
    nama: "PT Surya Pangan Makassar",
    kota: "Makassar",
    provinsi: "Sulawesi Selatan",
    kapasitas: 3200,
    hargaSatuan: 18500,
    distribusiHariIni: 890,
    statusVerifikasi: "Pending",
    risikoSkor: 52,
    anomali: ["Harga bahan baku tidak wajar (+25%)"],
    lat: -5.14,
    lng: 119.43,
    lastReport: "3 jam lalu",
    statusOnboarding: "Pending Verifikasi",
    tanggalDaftar: "01 Mar 2026",
    totalDistribusiAllTime: 14200,
    ceklistOnboarding: { nib: true, fotoDapur: false, gpsLokasi: false, rekeningAktif: true, kunjunganLapangan: false },
  },
  {
    id: "V-007",
    nama: "CV Delta Catring Padang",
    kota: "Padang",
    provinsi: "Sumatera Barat",
    kapasitas: 2000,
    hargaSatuan: 14200,
    distribusiHariIni: 1950,
    statusVerifikasi: "Terverifikasi",
    risikoSkor: 84,
    anomali: [],
    lat: -0.95,
    lng: 100.35,
    lastReport: "20 menit lalu",
    statusOnboarding: "Aktif",
    tanggalDaftar: "18 Jan 2026",
    totalDistribusiAllTime: 97500,
    ceklistOnboarding: { nib: true, fotoDapur: true, gpsLokasi: true, rekeningAktif: true, kunjunganLapangan: true },
  },
  {
    id: "V-008",
    nama: "PT Pangan Kaltim Jaya",
    kota: "Balikpapan",
    provinsi: "Kalimantan Timur",
    kapasitas: 2800,
    hargaSatuan: 22000,
    distribusiHariIni: 120,
    statusVerifikasi: "Ditolak",
    risikoSkor: 18,
    anomali: ["Dokumen palsu terdeteksi", "Harga tidak wajar (+60%)", "Tidak ada geotag sama sekali"],
    lat: -1.27,
    lng: 116.83,
    lastReport: "1 hari lalu",
    statusOnboarding: "Diblokir",
    tanggalDaftar: "10 Mar 2026",
    totalDistribusiAllTime: 240,
    ceklistOnboarding: { nib: false, fotoDapur: false, gpsLokasi: false, rekeningAktif: false, kunjunganLapangan: false },
  },
  // ⚠️ SPPG GHOIB — Sudah menerima dana tapi tidak pernah beroperasi
  {
    id: "V-009",
    nama: "CV Arjuna Sentosa Pangan",
    kota: "Semarang",
    provinsi: "Jawa Tengah",
    kapasitas: 2200,
    hargaSatuan: 15000,
    distribusiHariIni: 0,
    statusVerifikasi: "Pending",
    risikoSkor: 8,
    anomali: ["TIDAK ADA distribusi sejak 45 hari terdaftar", "NIB tidak ditemukan di sistem OSS", "Foto fasilitas tidak diunggah", "Kunjungan lapangan: GAGAL (alamat tidak ditemukan)"],
    lat: -6.97,
    lng: 110.42,
    lastReport: "Tidak pernah lapor",
    statusOnboarding: "Belum Beroperasi",
    tanggalDaftar: "20 Mar 2026",
    totalDistribusiAllTime: 0,
    ceklistOnboarding: { nib: false, fotoDapur: false, gpsLokasi: false, rekeningAktif: true, kunjunganLapangan: false },
  },
  {
    id: "V-010",
    nama: "PT Berkah Selalu Catering",
    kota: "Palembang",
    provinsi: "Sumatera Selatan",
    kapasitas: 3000,
    hargaSatuan: 15000,
    distribusiHariIni: 0,
    statusVerifikasi: "Pending",
    risikoSkor: 5,
    anomali: ["TIDAK ADA distribusi sejak 60 hari terdaftar", "NIB terdaftar di kota berbeda (Jambi)", "Nomor telepon tidak aktif", "Dana Rp 135 juta sudah tersalurkan ke rekening terdaftar"],
    lat: -2.99,
    lng: 104.75,
    lastReport: "Tidak pernah lapor",
    statusOnboarding: "Belum Beroperasi",
    tanggalDaftar: "01 Mar 2026",
    totalDistribusiAllTime: 0,
    ceklistOnboarding: { nib: false, fotoDapur: false, gpsLokasi: false, rekeningAktif: true, kunjunganLapangan: false },
  },
];


export const feedItems: FeedItem[] = [
  {
    id: "F-001",
    waktu: "22:14:32",
    vendor: "Koperasi Santri Sejahtera",
    lokasi: "Yogyakarta",
    pesan: "Laporan distribusi 1.750 porsi berhasil diverifikasi dengan geotag valid.",
    tipe: "aman",
  },
  {
    id: "F-002",
    waktu: "22:09:17",
    vendor: "UD Maju Bersama Catering",
    lokasi: "Surabaya",
    pesan: "ANOMALI: Harga bahan baku melebihi batas wajar sebesar 40%. Investigasi diperlukan.",
    tipe: "anomali",
  },
  {
    id: "F-003",
    waktu: "22:01:55",
    vendor: "PT Nusantara Gizi Mandiri",
    lokasi: "Jakarta Selatan",
    pesan: "4.850 porsi terdistribusi. AI Scanner memvalidasi standar gizi terpenuhi.",
    tipe: "aman",
  },
  {
    id: "F-004",
    waktu: "21:55:08",
    vendor: "PT Surya Pangan Makassar",
    lokasi: "Makassar",
    pesan: "PERINGATAN: Laporan distribusi terakhir tidak memiliki data geolokasi.",
    tipe: "warning",
  },
  {
    id: "F-005",
    waktu: "21:48:21",
    vendor: "CV Berkah Pangan Sehat",
    lokasi: "Bandung",
    pesan: "2.100 porsi terdistribusi. Satu laporan tanpa geotag terdeteksi.",
    tipe: "warning",
  },
  {
    id: "F-006",
    waktu: "21:32:40",
    vendor: "PT Pangan Kaltim Jaya",
    lokasi: "Balikpapan",
    pesan: "ANOMALI KRITIS: Dokumen tidak valid. Status vendor diblokir otomatis oleh sistem.",
    tipe: "anomali",
  },
  {
    id: "F-007",
    waktu: "21:15:00",
    vendor: "PT Cipta Rasa Nusantara",
    lokasi: "Medan",
    pesan: "2.480 porsi terdistribusi. Semua laporan terverifikasi dengan geotag lengkap.",
    tipe: "aman",
  },
];

export const distribusiData: DistribusiData[] = [
  { tanggal: "28 Mar", target: 95000, realisasi: 88000, anomali: 3 },
  { tanggal: "29 Mar", target: 95000, realisasi: 91000, anomali: 5 },
  { tanggal: "30 Mar", target: 96000, realisasi: 93500, anomali: 2 },
  { tanggal: "31 Mar", target: 96000, realisasi: 90000, anomali: 8 },
  { tanggal: "1 Apr", target: 97000, realisasi: 94000, anomali: 4 },
  { tanggal: "2 Apr", target: 97000, realisasi: 95200, anomali: 1 },
  { tanggal: "3 Apr", target: 98000, realisasi: 96800, anomali: 2 },
  { tanggal: "4 Apr", target: 98000, realisasi: 82540, anomali: 6 },
];

export const statsData = {
  totalVendor: 2847,
  vendorAktif: 2391,
  distribusiHariIni: 82540,
  targetHarian: 98000,
  nilaiEkonomi: "Rp 1,24 T",
  siswaTeraih: 82540,
  anomaliTerdeteksi: 6,
  verifikasiPending: 124,
};
