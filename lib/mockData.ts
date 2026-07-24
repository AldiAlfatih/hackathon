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
    nama: "CV. Dapur Nusantara Sejahtera",
    kota: "Parepare",
    provinsi: "Sulawesi Selatan",
    kapasitas: 5000,
    hargaSatuan: 15000,
    distribusiHariIni: 4850,
    statusVerifikasi: "Terverifikasi",
    risikoSkor: 94,
    anomali: [],
    lat: -4.0135,
    lng: 119.6234,
    lastReport: "10 menit lalu",
    statusOnboarding: "Aktif",
    tanggalDaftar: "10 Jan 2026",
    totalDistribusiAllTime: 287400,
    ceklistOnboarding: { nib: true, fotoDapur: true, gpsLokasi: true, rekeningAktif: true, kunjunganLapangan: true },
  },
  {
    id: "V-002",
    nama: "PT. Parepare Gizi Mandiri",
    kota: "Parepare (Ujung)",
    provinsi: "Sulawesi Selatan",
    kapasitas: 3000,
    hargaSatuan: 14500,
    distribusiHariIni: 2100,
    statusVerifikasi: "Terverifikasi",
    risikoSkor: 78,
    anomali: ["Laporan tanpa geotag (1 kali)"],
    lat: -4.0211,
    lng: 119.6288,
    lastReport: "25 menit lalu",
    statusOnboarding: "Aktif",
    tanggalDaftar: "15 Jan 2026",
    totalDistribusiAllTime: 124500,
    ceklistOnboarding: { nib: true, fotoDapur: true, gpsLokasi: true, rekeningAktif: true, kunjunganLapangan: true },
  },
  {
    id: "V-003",
    nama: "CV. Bacukiki Berkah Pangan",
    kota: "Parepare (Bacukiki)",
    provinsi: "Sulawesi Selatan",
    kapasitas: 4500,
    hargaSatuan: 15000,
    distribusiHariIni: 4500,
    statusVerifikasi: "Terverifikasi",
    risikoSkor: 85,
    anomali: [],
    lat: -4.0412,
    lng: 119.6451,
    lastReport: "1 jam lalu",
    statusOnboarding: "Aktif",
    tanggalDaftar: "20 Jan 2026",
    totalDistribusiAllTime: 198000,
    ceklistOnboarding: { nib: true, fotoDapur: true, gpsLokasi: true, rekeningAktif: true, kunjunganLapangan: true },
  },
  {
    id: "V-004",
    nama: "UD. Soreang Sehat Catering",
    kota: "Parepare (Soreang)",
    provinsi: "Sulawesi Selatan",
    kapasitas: 2500,
    hargaSatuan: 14800,
    distribusiHariIni: 2480,
    statusVerifikasi: "Terverifikasi",
    risikoSkor: 88,
    anomali: [],
    lat: -4.0045,
    lng: 119.6312,
    lastReport: "15 menit lalu",
    statusOnboarding: "Aktif",
    tanggalDaftar: "05 Feb 2026",
    totalDistribusiAllTime: 112000,
    ceklistOnboarding: { nib: true, fotoDapur: true, gpsLokasi: true, rekeningAktif: true, kunjunganLapangan: true },
  },
  {
    id: "V-005",
    nama: "PT. Sinar Lumpue Pangan",
    kota: "Parepare (Bacukiki Barat)",
    provinsi: "Sulawesi Selatan",
    kapasitas: 1800,
    hargaSatuan: 15000,
    distribusiHariIni: 1750,
    statusVerifikasi: "Terverifikasi",
    risikoSkor: 95,
    anomali: [],
    lat: -4.0520,
    lng: 119.6210,
    lastReport: "5 menit lalu",
    statusOnboarding: "Aktif",
    tanggalDaftar: "12 Feb 2026",
    totalDistribusiAllTime: 89600,
    ceklistOnboarding: { nib: true, fotoDapur: true, gpsLokasi: true, rekeningAktif: true, kunjunganLapangan: true },
  },
  {
    id: "V-006",
    nama: "Koperasi Dapur Peduli Parepare",
    kota: "Parepare (Lakessi)",
    provinsi: "Sulawesi Selatan",
    kapasitas: 3200,
    hargaSatuan: 15000,
    distribusiHariIni: 890,
    statusVerifikasi: "Pending",
    risikoSkor: 60,
    anomali: ["Menunggu verifikasi fisik dapur BGN"],
    lat: -4.0180,
    lng: 119.6265,
    lastReport: "3 jam lalu",
    statusOnboarding: "Pending Verifikasi",
    tanggalDaftar: "01 Mar 2026",
    totalDistribusiAllTime: 14200,
    ceklistOnboarding: { nib: true, fotoDapur: true, gpsLokasi: true, rekeningAktif: true, kunjunganLapangan: false },
  },
  {
    id: "V-007",
    nama: "PT. Habibie Gizi Nusantara",
    kota: "Parepare (Mallusetasi)",
    provinsi: "Sulawesi Selatan",
    kapasitas: 2000,
    hargaSatuan: 14200,
    distribusiHariIni: 1950,
    statusVerifikasi: "Terverifikasi",
    risikoSkor: 91,
    anomali: [],
    lat: -4.0150,
    lng: 119.6225,
    lastReport: "20 menit lalu",
    statusOnboarding: "Aktif",
    tanggalDaftar: "18 Jan 2026",
    totalDistribusiAllTime: 97500,
    ceklistOnboarding: { nib: true, fotoDapur: true, gpsLokasi: true, rekeningAktif: true, kunjunganLapangan: true },
  },
  {
    id: "V-008",
    nama: "CV. Mattirotasi Catering",
    kota: "Parepare (Ujung Sabbang)",
    provinsi: "Sulawesi Selatan",
    kapasitas: 2800,
    hargaSatuan: 22000,
    distribusiHariIni: 120,
    statusVerifikasi: "Ditolak",
    risikoSkor: 18,
    anomali: ["Dokumen palsu terdeteksi", "Harga tidak wajar (+60%)", "Tidak ada geotag sama sekali"],
    lat: -4.0240,
    lng: 119.6250,
    lastReport: "1 hari lalu",
    statusOnboarding: "Diblokir",
    tanggalDaftar: "10 Mar 2026",
    totalDistribusiAllTime: 240,
    ceklistOnboarding: { nib: false, fotoDapur: false, gpsLokasi: false, rekeningAktif: false, kunjunganLapangan: false },
  },
  // ⚠️ SPPG GHOIB — Indikasi fiktif di wilayah Parepare
  {
    id: "V-009",
    nama: "CV. Galung Maloang Sejahtera",
    kota: "Parepare (Galung Maloang)",
    provinsi: "Sulawesi Selatan",
    kapasitas: 2200,
    hargaSatuan: 15000,
    distribusiHariIni: 0,
    statusVerifikasi: "Pending",
    risikoSkor: 8,
    anomali: ["TIDAK ADA distribusi sejak 45 hari terdaftar", "NIB tidak ditemukan di sistem OSS", "Foto fasilitas tidak diunggah", "Kunjungan lapangan: GAGAL (alamat ruko kosong)"],
    lat: -4.0380,
    lng: 119.6510,
    lastReport: "Tidak pernah lapor",
    statusOnboarding: "Belum Beroperasi",
    tanggalDaftar: "20 Mar 2026",
    totalDistribusiAllTime: 0,
    ceklistOnboarding: { nib: false, fotoDapur: false, gpsLokasi: false, rekeningAktif: true, kunjunganLapangan: false },
  },
  {
    id: "V-010",
    nama: "UD. Lakessi Pangan Utama",
    kota: "Parepare (Lakessi)",
    provinsi: "Sulawesi Selatan",
    kapasitas: 3000,
    hargaSatuan: 15000,
    distribusiHariIni: 0,
    statusVerifikasi: "Pending",
    risikoSkor: 5,
    anomali: ["TIDAK ADA distribusi sejak 60 hari terdaftar", "Nomor telepon tidak aktif", "Dana Rp 135 juta sudah tersalurkan ke rekening terdaftar"],
    lat: -4.0160,
    lng: 119.6270,
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
    vendor: "PT. Sinar Lumpue Pangan",
    lokasi: "Bacukiki Barat, Parepare",
    pesan: "Laporan distribusi 1.750 porsi berhasil diverifikasi dengan geotag valid.",
    tipe: "aman",
  },
  {
    id: "F-002",
    waktu: "22:09:17",
    vendor: "CV. Bacukiki Berkah Pangan",
    lokasi: "Bacukiki, Parepare",
    pesan: "Distribusi 4.500 porsi berjalan lancar ke 4 sekolah tujuan.",
    tipe: "aman",
  },
  {
    id: "F-003",
    waktu: "22:01:55",
    vendor: "CV. Dapur Nusantara Sejahtera",
    lokasi: "Ujung, Parepare",
    pesan: "4.850 porsi terdistribusi. AI Scanner memvalidasi standar gizi terpenuhi.",
    tipe: "aman",
  },
  {
    id: "F-004",
    waktu: "21:55:08",
    vendor: "Koperasi Dapur Peduli Parepare",
    lokasi: "Lakessi, Parepare",
    pesan: "INFORMASI: Verifikasi dokumen lapangan sedang dijadwalkan oleh Satgas BGN Parepare.",
    tipe: "warning",
  },
  {
    id: "F-005",
    waktu: "21:48:21",
    vendor: "PT. Parepare Gizi Mandiri",
    lokasi: "Ujung, Parepare",
    pesan: "2.100 porsi terdistribusi ke SDN 1 & SDN 5 Parepare.",
    tipe: "aman",
  },
  {
    id: "F-006",
    waktu: "21:32:40",
    vendor: "CV. Mattirotasi Catering",
    lokasi: "Ujung Sabbang, Parepare",
    pesan: "ANOMALI KRITIS: Dokumen tidak valid. Status vendor diblokir otomatis oleh sistem.",
    tipe: "anomali",
  },
  {
    id: "F-007",
    waktu: "21:15:00",
    vendor: "UD. Soreang Sehat Catering",
    lokasi: "Soreang, Parepare",
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
