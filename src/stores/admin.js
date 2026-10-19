import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useApplicantStore, PRODI_METADATA } from './applicant';
import { useAuthStore } from './auth';
import { useReferralStore } from './referral';
import axios from 'axios';
import { admissionApi, financeApi, scoringApi, studentApi, nimApi, getApiBaseUrl } from '@/api';

const STORAGE_KEY = 'bth_admin_data_real_v5';
const PATH_CHANGES_KEY = 'bth_admin_path_changes_v4';
const WITHDRAWALS_KEY = 'bth_admin_withdrawals_v4';
const REFUNDS_KEY = 'bth_admin_refunds_v4';
const INSTALLMENTS_KEY = 'bth_admin_installments_v4';

function generateRegNumber(userId, email) {
  const seed = String(userId || email || 'CANDIDATE')
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const num = (Math.abs(seed * 73) % 90000) + 10000;
  return `BTH-2026-REG-${num}`;
}

function buildDocumentsForApplicant(applicantId, docStatus, verifiedCount = 5, pendingCount = 0) {
  const titles = [
    { id: 'doc-1', title: 'Ijazah / Surat Keterangan Lulus (SKL)' },
    { id: 'doc-2', title: 'Kartu Tanda Penduduk (KTP) / Kartu Pelajar' },
    { id: 'doc-3', title: 'Kartu Keluarga (KK)' },
    { id: 'doc-4', title: 'Pas Foto 4x6' },
    { id: 'doc-5', title: 'Surat Keterangan Sehat' },
  ];

  return titles.map((t, idx) => {
    let status = 'unuploaded';
    let filename = 'Belum diunggah';
    let notes = '';

    if (docStatus === 'verified' || idx < verifiedCount) {
      status = 'verified';
      filename = `BERKAS_${applicantId.slice(-5)}_${t.id}.pdf`;
      notes = 'Telah diverifikasi dan disahkan panitia PMB.';
    } else if (docStatus === 'revision' && idx === 1) {
      status = 'revision';
      filename = `BERKAS_${applicantId.slice(-5)}_${t.id}.jpg`;
      notes = 'Pindaian KTP buram dan nomor NIK tidak terbaca jelas. Mohon unggah ulang pindaian beresolusi tinggi.';
    } else if (docStatus === 'pending' || idx < (verifiedCount + pendingCount)) {
      status = 'pending';
      filename = `BERKAS_${applicantId.slice(-5)}_${t.id}.pdf`;
      notes = 'Menunggu peninjauan petugas verifikasi berkas.';
    }

    return {
      id: t.id,
      title: t.title,
      filename,
      filesize: filename !== 'Belum diunggah' ? '1.4 MB' : '',
      fileType: filename.endsWith('.jpg') ? 'image/jpeg' : 'application/pdf',
      status,
      notes,
    };
  });
}

export const OFFICIAL_CANDIDATE_SEEDS = [
  {
    id: 'BTH-2026-REG-09182',
    fullName: 'Ujang Mahasiswa',
    email: 'ujang@gmail.com',
    phone: '08123456789',
    gender: 'Laki-laki',
    nik: '3278011204040008',
    nisn: '0061284918',
    schoolName: 'SMK MARHAS MARGAHAYU',
    city: 'Kab. Bandung',
    averageScore: '86.50',
    track: 'Jalur Kemitraan Guru BK (SMK MARHAS MARGAHAYU)',
    faculty: 'Fakultas Farmasi',
    prodi1: 'S1 Farmasi',
    prodi2: 'D3 Farmasi',
    registrationDate: '15 Feb 2026',
    documentStatus: 'verified',
    pendingDocsCount: 0,
    verifiedDocsCount: 5,
    referralCode: 'MARHASBISA',
    referralSchool: 'SMK MARHAS MARGAHAYU',
    referralPic: 'Kemal Ramadhan',
    documents: buildDocumentsForApplicant('BTH-2026-REG-09182', 'verified', 5, 0),
    payments: {
      registrationFee: {
        id: 'INV-REG-09182',
        amount: 250000,
        status: 'paid',
        paidAt: '15 Feb 2026 10:00',
        method: 'Duitku Virtual Account BSI',
      },
      uktFee: {
        id: 'INV-UKT-09182',
        amount: 6500000,
        status: 'unpaid',
        paidAt: null,
        dueDate: '30 Apr 2026',
        method: 'Virtual Account BSI',
      },
    },
    selection: {
      cbtScore: 85,
      interviewScore: 84,
      interviewer: 'apt. Dr. Nining Suryani, M.Si.',
      interviewNotes: 'Pendaftar jalur kemitraan BK SMK MARHAS MARGAHAYU.',
      passedStatus: 'passed',
      decisionLetterNo: '09182/SK-PMB/UBTH/X/2026',
    },
    onboarding: {
      isEnrolled: false,
      nim: null,
      pkkmbGroup: null,
    },
  },
  {
    id: 'BTH-2026-REG-10928',
    fullName: 'Rian Firdaus',
    email: 'rian.firdaus@gmail.com',
    phone: '081223344551',
    gender: 'Laki-laki',
    nik: '3278011204040001',
    nisn: '0061284910',
    schoolName: 'SMA Negeri 1 Tasikmalaya',
    city: 'Kota Tasikmalaya',
    averageScore: '88.50',
    track: 'Jalur Reguler Gelombang 1',
    faculty: 'Fakultas Farmasi',
    prodi1: 'S1 Farmasi',
    prodi2: 'D3 Farmasi',
    registrationDate: '10 Feb 2026',
    documentStatus: 'verified',
    pendingDocsCount: 0,
    verifiedDocsCount: 5,
    documents: buildDocumentsForApplicant('BTH-2026-REG-10928', 'verified', 5, 0),
    payments: {
      registrationFee: {
        id: 'INV-REG-10928',
        amount: 250000,
        status: 'paid',
        paidAt: '10 Feb 2026 14:20',
        method: 'Duitku QRIS (NOBU)',
      },
      uktFee: {
        id: 'INV-UKT-10928',
        amount: 6500000,
        status: 'paid',
        paidAt: '25 Feb 2026 10:15',
        dueDate: '30 Apr 2026',
        method: 'Duitku BSI Virtual Account',
      },
    },
    selection: {
      cbtScore: 86,
      interviewScore: 88,
      interviewer: 'apt. Dr. Nining Suryani, M.Si.',
      interviewNotes: 'Kemampuan analisis biologi dan kimia sangat baik. Memenuhi standar kelulusan.',
      passedStatus: 'passed',
      decisionLetterNo: '08928/SK-PMB/UBTH/X/2026',
    },
    onboarding: {
      isEnrolled: false,
      nim: null,
      pkkmbGroup: null,
    },
  },
  {
    id: 'BTH-2026-REG-30512',
    fullName: 'Dinda Ayu Lestari',
    email: 'dinda.lestari@gmail.com',
    phone: '085221990421',
    gender: 'Perempuan',
    nik: '3207015408040002',
    nisn: '0063920194',
    schoolName: 'SMA Negeri 2 Ciamis',
    city: 'Kab. Ciamis',
    averageScore: '86.20',
    track: 'Jalur Prestasi Rapor (PMDK)',
    faculty: 'Fakultas Farmasi',
    prodi1: 'S1 Farmasi',
    prodi2: 'S1 Teknologi Informasi',
    registrationDate: '14 Feb 2026',
    documentStatus: 'verified',
    pendingDocsCount: 0,
    verifiedDocsCount: 5,
    documents: buildDocumentsForApplicant('BTH-2026-REG-30512', 'verified', 5, 0),
    payments: {
      registrationFee: {
        id: 'INV-REG-30512',
        amount: 250000,
        status: 'paid',
        paidAt: '14 Feb 2026 09:40',
        method: 'Virtual Account Mandiri',
      },
      uktFee: {
        id: 'INV-UKT-30512',
        amount: 6500000,
        status: 'unpaid',
        paidAt: null,
        dueDate: '30 Apr 2026',
        method: 'Cicilan UKT 2x Termin',
      },
    },
    selection: {
      cbtScore: 80,
      interviewScore: 84,
      interviewer: 'Dosen Penguji PMB BTH',
      interviewNotes: 'Portofolio prestasi akademik konsisten dari semester 1-5.',
      passedStatus: 'passed',
      decisionLetterNo: '08512/SK-PMB/UBTH/X/2026',
    },
    onboarding: {
      isEnrolled: false,
      nim: null,
      pkkmbGroup: null,
    },
  },
  {
    id: 'BTH-2026-REG-40192',
    fullName: 'Muhammad Rizky Pratama',
    email: 'm.rizky.pratama@gmail.com',
    phone: '081394820192',
    gender: 'Laki-laki',
    nik: '3278021503040005',
    nisn: '0069481029',
    schoolName: 'SMK Negeri 2 Tasikmalaya',
    city: 'Kota Tasikmalaya',
    averageScore: '84.40',
    track: 'Jalur CBT Reguler Gelombang 1',
    faculty: 'Fakultas Teknologi & Bisnis',
    prodi1: 'S1 Teknologi Informasi',
    prodi2: 'S1 Manajemen Bisnis Informasi',
    registrationDate: '18 Feb 2026',
    documentStatus: 'verified',
    pendingDocsCount: 0,
    verifiedDocsCount: 5,
    documents: buildDocumentsForApplicant('BTH-2026-REG-40192', 'verified', 5, 0),
    payments: {
      registrationFee: {
        id: 'INV-REG-40192',
        amount: 250000,
        status: 'paid',
        paidAt: '18 Feb 2026 11:25',
        method: 'Duitku ShopeePay QRIS',
      },
      uktFee: {
        id: 'INV-UKT-40192',
        amount: 4500000,
        status: 'unpaid',
        paidAt: null,
        dueDate: '30 Apr 2026',
        method: 'Cicilan UKT 3x Termin',
      },
    },
    selection: {
      cbtScore: 84,
      interviewScore: 82,
      interviewer: 'Ir. Hendra Gunawan, M.T., Ph.D.',
      interviewNotes: 'Latar belakang kejuruan rekayasa perangkat lunak sangat selaras.',
      passedStatus: 'passed',
      decisionLetterNo: '08192/SK-PMB/UBTH/X/2026',
    },
    onboarding: {
      isEnrolled: false,
      nim: null,
      pkkmbGroup: null,
    },
  },
  {
    id: 'BTH-2026-REG-20419',
    fullName: 'Fitri Handayani',
    email: 'fitri.handayani@yahoo.com',
    phone: '082194820419',
    gender: 'Perempuan',
    nik: '3206016207040003',
    nisn: '0068102948',
    schoolName: 'SMA Negeri 1 Singaparna',
    city: 'Kab. Tasikmalaya',
    averageScore: '85.60',
    track: 'Jalur Reguler Gelombang 1',
    faculty: 'Fakultas Ilmu Kesehatan',
    prodi1: 'D3 Analis Kesehatan (TLM)',
    prodi2: 'S1 Administrasi Rumah Sakit',
    registrationDate: '20 Feb 2026',
    documentStatus: 'verified',
    pendingDocsCount: 0,
    verifiedDocsCount: 5,
    documents: buildDocumentsForApplicant('BTH-2026-REG-20419', 'verified', 5, 0),
    payments: {
      registrationFee: {
        id: 'INV-REG-20419',
        amount: 250000,
        status: 'paid',
        paidAt: '20 Feb 2026 13:00',
        method: 'Duitku BCA Virtual Account',
      },
      uktFee: {
        id: 'INV-UKT-20419',
        amount: 4750000,
        status: 'paid',
        paidAt: '28 Feb 2026 09:30',
        dueDate: '30 Apr 2026',
        method: 'Duitku Mandiri VA (H2H)',
      },
    },
    selection: {
      cbtScore: 76,
      interviewScore: 78,
      interviewer: 'drg. Hj. Rina Marlina, M.Kes.',
      interviewNotes: 'Peminatan laboratorium medik memadai.',
      passedStatus: 'passed',
      decisionLetterNo: '08419/SK-PMB/UBTH/X/2026',
    },
    onboarding: {
      isEnrolled: false,
      nim: null,
      pkkmbGroup: null,
    },
  },
  {
    id: 'BTH-2026-REG-41098',
    fullName: 'Budi Santoso',
    email: 'budi.santoso@gmail.com',
    phone: '081293840198',
    gender: 'Laki-laki',
    nik: '3278031805040004',
    nisn: '0061948201',
    schoolName: 'SMK Bakti Tunas Husada',
    city: 'Kota Tasikmalaya',
    averageScore: '87.10',
    track: 'Jalur CBT Mandiri',
    faculty: 'Fakultas Ilmu Kesehatan',
    prodi1: 'S1 Administrasi Rumah Sakit',
    prodi2: 'D3 Analis Kesehatan (TLM)',
    registrationDate: '22 Feb 2026',
    documentStatus: 'verified',
    pendingDocsCount: 0,
    verifiedDocsCount: 5,
    documents: buildDocumentsForApplicant('BTH-2026-REG-41098', 'verified', 5, 0),
    payments: {
      registrationFee: {
        id: 'INV-REG-41098',
        amount: 250000,
        status: 'paid',
        paidAt: '22 Feb 2026 15:45',
        method: 'Virtual Account BSI',
      },
      uktFee: {
        id: 'INV-UKT-41098',
        amount: 4500000,
        status: 'paid',
        paidAt: '02 Mar 2026 11:10',
        dueDate: '30 Apr 2026',
        method: 'Virtual Account BSI',
      },
    },
    selection: {
      cbtScore: 82,
      interviewScore: 85,
      interviewer: 'drg. Hj. Rina Marlina, M.Kes.',
      interviewNotes: 'Pemahaman manajemen fasilitas pelayanan kesehatan sangat antusias.',
      passedStatus: 'passed',
      decisionLetterNo: '08098/SK-PMB/UBTH/X/2026',
    },
    onboarding: {
      isEnrolled: true,
      nim: '26030005',
      pkkmbGroup: 'Gugus 05 - Asklepios Kesehatan',
    },
  },
  {
    id: 'BTH-2026-REG-55210',
    fullName: 'Siti Sarah',
    email: 'siti.sarah@gmail.com',
    phone: '085319482010',
    gender: 'Perempuan',
    nik: '3205014902040006',
    nisn: '0068492018',
    schoolName: 'MA Al-Hikmah Garut',
    city: 'Kab. Garut',
    averageScore: '83.20',
    track: 'Jalur Reguler Gelombang 1',
    faculty: 'Fakultas Farmasi',
    prodi1: 'D3 Farmasi',
    prodi2: 'S1 Farmasi',
    registrationDate: '24 Feb 2026',
    documentStatus: 'pending',
    pendingDocsCount: 2,
    verifiedDocsCount: 3,
    documents: buildDocumentsForApplicant('BTH-2026-REG-55210', 'pending', 3, 2),
    payments: {
      registrationFee: {
        id: 'INV-REG-55210',
        amount: 250000,
        status: 'paid',
        paidAt: '24 Feb 2026 16:10',
        method: 'Virtual Account Mandiri',
      },
      uktFee: {
        id: 'INV-UKT-55210',
        amount: 4800000,
        status: 'unpaid',
        paidAt: null,
        dueDate: '30 Apr 2026',
        method: 'Virtual Account BSI',
      },
    },
    selection: {
      cbtScore: 71,
      interviewScore: 74,
      interviewer: 'Dosen Penguji PMB BTH',
      interviewNotes: 'Nilai seleksi awal memenuhi syarat kelulusan.',
      passedStatus: 'passed',
      decisionLetterNo: '08210/SK-PMB/UBTH/X/2026',
    },
    onboarding: {
      isEnrolled: false,
      nim: null,
      pkkmbGroup: null,
    },
  },
  {
    id: 'BTH-2026-REG-12401',
    fullName: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@gmail.com',
    phone: '087794820141',
    gender: 'Laki-laki',
    nik: '3279011409040002',
    nisn: '0062948102',
    schoolName: 'SMA Negeri 3 Banjar',
    city: 'Kota Banjar',
    averageScore: '89.40',
    track: 'Jalur Prestasi Rapor (PMDK)',
    faculty: 'Fakultas Teknologi & Bisnis',
    prodi1: 'S1 Teknologi Informasi',
    prodi2: 'S1 Manajemen Bisnis Informasi',
    registrationDate: '25 Feb 2026',
    documentStatus: 'verified',
    pendingDocsCount: 0,
    verifiedDocsCount: 5,
    documents: buildDocumentsForApplicant('BTH-2026-REG-12401', 'verified', 5, 0),
    payments: {
      registrationFee: {
        id: 'INV-REG-12401',
        amount: 250000,
        status: 'paid',
        paidAt: '25 Feb 2026 08:30',
        method: 'Duitku Indomaret Retail',
      },
      uktFee: {
        id: 'INV-UKT-12401',
        amount: 4500000,
        status: 'paid',
        paidAt: '01 Mar 2026 14:50',
        dueDate: '30 Apr 2026',
        method: 'Duitku DANA E-Wallet',
      },
    },
    selection: {
      cbtScore: 91,
      interviewScore: 89,
      interviewer: 'Ir. Hendra Gunawan, M.T., Ph.D.',
      interviewNotes: 'Pemenang olimpiade komputer tingkat kota. Nilai CBT unggulan.',
      passedStatus: 'passed',
      decisionLetterNo: '08401/SK-PMB/UBTH/X/2026',
    },
    onboarding: {
      isEnrolled: true,
      nim: '26020001',
      pkkmbGroup: 'Gugus 07 - Turing Informatika',
    },
  },
  {
    id: 'BTH-2026-REG-23094',
    fullName: 'Nabila Putri',
    email: 'nabila.putri@gmail.com',
    phone: '081294820394',
    gender: 'Perempuan',
    nik: '3278016506040007',
    nisn: '0064920194',
    schoolName: 'SMA Al-Muttaqin Tasikmalaya',
    city: 'Kota Tasikmalaya',
    averageScore: '90.10',
    track: 'Jalur Reguler Gelombang 1',
    faculty: 'Fakultas Farmasi',
    prodi1: 'S1 Farmasi',
    prodi2: 'D3 Farmasi',
    registrationDate: '26 Feb 2026',
    documentStatus: 'verified',
    pendingDocsCount: 0,
    verifiedDocsCount: 5,
    documents: buildDocumentsForApplicant('BTH-2026-REG-23094', 'verified', 5, 0),
    payments: {
      registrationFee: {
        id: 'INV-REG-23094',
        amount: 250000,
        status: 'paid',
        paidAt: '26 Feb 2026 11:20',
        method: 'Virtual Account BSI',
      },
      uktFee: {
        id: 'INV-UKT-23094',
        amount: 6500000,
        status: 'paid',
        paidAt: '03 Mar 2026 16:30',
        dueDate: '30 Apr 2026',
        method: 'Virtual Account BSI',
      },
    },
    selection: {
      cbtScore: 88,
      interviewScore: 86,
      interviewer: 'apt. Dr. Nining Suryani, M.Si.',
      interviewNotes: 'Kandidat unggul program S1 Farmasi. Memenuhi kriteria beasiswa.',
      passedStatus: 'passed',
      decisionLetterNo: '08094/SK-PMB/UBTH/X/2026',
    },
    onboarding: {
      isEnrolled: true,
      nim: null,
      pkkmbGroup: null,
    },
  },
  {
    id: 'BTH-2026-REG-61920',
    fullName: 'Reza Pratama',
    email: 'reza.pratama@gmail.com',
    phone: '085294820619',
    gender: 'Laki-laki',
    nik: '3207011904040008',
    nisn: '0069102947',
    schoolName: 'SMK Negeri 1 Ciamis',
    city: 'Kab. Ciamis',
    averageScore: '82.80',
    track: 'Jalur CBT Mandiri',
    faculty: 'Fakultas Teknologi & Bisnis',
    prodi1: 'S1 Manajemen Bisnis Informasi',
    prodi2: 'S1 Teknologi Informasi',
    registrationDate: '27 Feb 2026',
    documentStatus: 'revision',
    pendingDocsCount: 2,
    verifiedDocsCount: 2,
    documents: buildDocumentsForApplicant('BTH-2026-REG-61920', 'revision', 2, 2),
    payments: {
      registrationFee: {
        id: 'INV-REG-61920',
        amount: 250000,
        status: 'paid',
        paidAt: '27 Feb 2026 14:15',
        method: 'Virtual Account Mandiri',
      },
      uktFee: {
        id: 'INV-UKT-61920',
        amount: 4250000,
        status: 'unpaid',
        paidAt: null,
        dueDate: '30 Apr 2026',
        method: 'Virtual Account Mandiri',
      },
    },
    selection: {
      cbtScore: 68,
      interviewScore: null,
      interviewer: null,
      interviewNotes: 'Menunggu perbaikan dokumen ijazah yang belum terbaca.',
      passedStatus: 'evaluating',
      decisionLetterNo: null,
    },
    onboarding: {
      isEnrolled: false,
      nim: null,
      pkkmbGroup: null,
    },
  },
  {
    id: 'BTH-2026-REG-74218',
    fullName: 'Dewi Lestari',
    email: 'dewi.lestari@gmail.com',
    phone: '081394820742',
    gender: 'Perempuan',
    nik: '3218015507040009',
    nisn: '0063948105',
    schoolName: 'SMA Negeri 1 Pangandaran',
    city: 'Kab. Pangandaran',
    averageScore: '83.90',
    track: 'Jalur Reguler Gelombang 1',
    faculty: 'Fakultas Ilmu Kesehatan',
    prodi1: 'D3 Analis Kesehatan (TLM)',
    prodi2: 'S1 Administrasi Rumah Sakit',
    registrationDate: '28 Feb 2026',
    documentStatus: 'pending',
    pendingDocsCount: 4,
    verifiedDocsCount: 1,
    documents: buildDocumentsForApplicant('BTH-2026-REG-74218', 'pending', 1, 4),
    payments: {
      registrationFee: {
        id: 'INV-REG-74218',
        amount: 250000,
        status: 'paid',
        paidAt: '28 Feb 2026 10:40',
        method: 'Virtual Account BSI',
      },
      uktFee: {
        id: 'INV-UKT-74218',
        amount: 4750000,
        status: 'unpaid',
        paidAt: null,
        dueDate: '30 Apr 2026',
        method: 'Virtual Account BSI',
      },
    },
    selection: {
      cbtScore: 72,
      interviewScore: null,
      interviewer: null,
      interviewNotes: 'Pemberkasan dan tes kesehatan sedang ditinjau.',
      passedStatus: 'evaluating',
      decisionLetterNo: null,
    },
    onboarding: {
      isEnrolled: false,
      nim: null,
      pkkmbGroup: null,
    },
  },
];

export const OFFICIAL_PATH_CHANGE_SEEDS = [
  {
    id: 'pc-01',
    candidateName: 'Dinda Ayu Lestari',
    regNo: 'BTH-2026-REG-30512',
    oldTrack: 'Jalur Prestasi Rapor (PMDK)',
    oldProdi: 'S1 Farmasi',
    newTrack: 'Jalur CBT Reguler Gelombang 1',
    newProdi: 'S1 Teknologi Informasi',
    reason: 'Ingin fokus ke peminatan teknologi informasi kesehatan dan mengikuti ujian CBT mandiri.',
    status: 'pending',
    submittedAt: '16 Feb 2026',
    reviewedAt: null,
  },
  {
    id: 'pc-02',
    candidateName: 'Budi Santoso',
    regNo: 'BTH-2026-REG-41098',
    oldTrack: 'Jalur CBT Mandiri',
    oldProdi: 'D3 Analis Kesehatan (TLM)',
    newTrack: 'Jalur CBT Mandiri',
    newProdi: 'S1 Administrasi Rumah Sakit',
    reason: 'Memperoleh arahan orang tua untuk mengambil jenjang S1 Administrasi Rumah Sakit.',
    status: 'approved',
    submittedAt: '22 Feb 2026',
    reviewedAt: '24 Feb 2026',
  },
];

export const OFFICIAL_WITHDRAWAL_SEEDS = [
  {
    id: 'wd-01',
    candidateName: 'Rian Firdaus',
    regNo: 'BTH-2026-REG-10928',
    prodi: 'S1 Farmasi',
    category: 'Diterima di PTN (SNBT)',
    reason: 'Telah diterima di Universitas Padjadjaran melalui jalur SNBT dan mengajukan pengunduran diri resmi.',
    verificationCode: 'VERIF-BTH-WD-99410',
    submittedAt: '12 Sep 2026',
    status: 'approved',
    reviewedAt: '12 Sep 2026',
  },
  {
    id: 'wd-02',
    candidateName: 'Siti Sarah',
    regNo: 'BTH-2026-REG-55210',
    prodi: 'D3 Farmasi',
    category: 'Faktor Kesehatan / Lokasi',
    reason: 'Harus mendampingi keluarga di luar kota karena alasan medis mendesak.',
    verificationCode: 'VERIF-BTH-WD-10294',
    submittedAt: '28 Sep 2026',
    status: 'pending',
    reviewedAt: null,
  },
];

export const OFFICIAL_REFUND_SEEDS = [
  {
    id: 'ref-01',
    candidateName: 'Rian Firdaus',
    regNo: 'BTH-2026-REG-10928',
    prodi: 'S1 Farmasi',
    category: 'Diterima di PTN (SNBT)',
    reason: 'Telah diterima di Universitas Padjadjaran melalui jalur SNBT dan mengajukan pengembalian dana UKT.',
    paidAmount: 6500000,
    approvedAmount: 5850000,
    status: 'approved',
    processedAt: '12 Sep 2026',
    proofReference: 'MUTASI-BTH-994102',
  },
  {
    id: 'ref-02',
    candidateName: 'Fitri Handayani',
    regNo: 'BTH-2026-REG-20419',
    prodi: 'D3 Analis Kesehatan (TLM)',
    category: 'Kendala Finansial Keluarga',
    reason: 'Keluarga mengalami musibah ekonomi dan memohon pengunduran diri serta pengembalian dana registrasi.',
    paidAmount: 4750000,
    approvedAmount: 0,
    status: 'pending',
    processedAt: null,
    proofReference: '',
  },
];

export const OFFICIAL_INSTALLMENT_SEEDS = [
  {
    id: 'inst-01',
    candidateName: 'Dinda Ayu Lestari',
    regNo: 'BTH-2026-REG-30512',
    prodi: 'S1 Farmasi',
    totalAmount: 6500000,
    numTerms: 2,
    reason: 'Memohon izin pembayaran dalam 2 termin mengingat pencairan gaji orang tua bertahap.',
    status: 'pending',
    submittedAt: '15 Feb 2026',
    reviewedAt: null,
  },
  {
    id: 'inst-02',
    candidateName: 'Muhammad Rizky Pratama',
    regNo: 'BTH-2026-REG-40192',
    prodi: 'S1 Teknologi Informasi',
    totalAmount: 4500000,
    numTerms: 3,
    reason: 'Orang tua berprofesi wiraswasta, mengajukan pembagian 3 termin cicilan.',
    status: 'approved',
    submittedAt: '19 Feb 2026',
    reviewedAt: '21 Feb 2026',
  },
];

const DEFAULT_APPLICATION_DOCS = [
  { id: 'doc-1', title: 'Ijazah / Surat Keterangan Lulus (SKL)', filename: 'Belum diunggah', status: 'unuploaded', notes: '', fileBlobUrl: null },
  { id: 'doc-2', title: 'Kartu Tanda Penduduk (KTP) / Kartu Pelajar', filename: 'Belum diunggah', status: 'unuploaded', notes: '', fileBlobUrl: null },
  { id: 'doc-3', title: 'Kartu Keluarga (KK)', filename: 'Belum diunggah', status: 'unuploaded', notes: '', fileBlobUrl: null },
  { id: 'doc-4', title: 'Pas Foto 4x6', filename: 'Belum diunggah', status: 'unuploaded', notes: '', fileBlobUrl: null },
  { id: 'doc-5', title: 'Surat Keterangan Sehat', filename: 'Belum diunggah', status: 'unuploaded', notes: '', fileBlobUrl: null },
];

function updateApplicantWithLocalState(applicant, localState) {
  if (!applicant || !localState) return applicant;

  const cand = localState.candidate || {};
  const adm = localState.admission || {};
  const docs = localState.documents || [];
  const pays = localState.payments || {};
  const exam = localState.exam || {};
  const res = localState.result || {};
  const onb = localState.onboarding || {};

  if (cand.fullName) applicant.fullName = cand.fullName;
  if (cand.phone && cand.phone !== '-') applicant.phone = cand.phone;
  if (cand.nik && cand.nik !== '-') applicant.nik = cand.nik;
  if (cand.nisn && cand.nisn !== '-') applicant.nisn = cand.nisn;
  if (cand.gender) applicant.gender = cand.gender;
  if (cand.schoolName && cand.schoolName !== 'Belum Diisi' && cand.schoolName !== '-') applicant.schoolName = cand.schoolName;
  if (cand.averageScore && cand.averageScore !== '-') applicant.averageScore = cand.averageScore;
  if (cand.registrationNumber) applicant.id = cand.registrationNumber;

  if (adm.track) applicant.track = adm.track;
  if (adm.prodi1Faculty) applicant.faculty = adm.prodi1Faculty;
  if (adm.prodi1) applicant.prodi1 = adm.prodi1;
  if (adm.prodi2) applicant.prodi2 = adm.prodi2;

  // Sinkronisasi data referal kemitraan sekolah BK
  const ref = localState.referral || {};
  if (ref.isApplied && ref.code) {
    applicant.referralCode = ref.code;
    applicant.referralSchool = ref.schoolName || applicant.schoolName || '-';
    applicant.referralPic = ref.picName || '-';
  } else if (ref.isApplied === false && applicant.referralCode) {
    applicant.referralCode = null;
    applicant.referralSchool = null;
    applicant.referralPic = null;
  }

  if (Array.isArray(docs) && docs.length > 0) {
    const verifiedDocs = docs.filter((d) => d.status === 'verified').length;
    const pendingDocs = docs.filter((d) => d.status === 'pending' || d.status === 'revision').length;
    const hasRevision = docs.some((d) => d.status === 'revision');
    const hasPending = docs.some((d) => d.status === 'pending');
    const hasUploaded = docs.some((d) => d.filename && d.filename !== 'Belum diunggah');
    const isAllVerified = verifiedDocs === docs.length;

    let docStatus = 'unuploaded';
    if (isAllVerified) docStatus = 'verified';
    else if (hasRevision) docStatus = 'revision';
    else if (hasPending || hasUploaded) docStatus = 'pending';
    else if (verifiedDocs > 0) docStatus = 'pending';

    applicant.documentStatus = docStatus;
    applicant.verifiedDocsCount = verifiedDocs;
    applicant.pendingDocsCount = pendingDocs;

    applicant.documents = docs.map((d) => {
      const def = DEFAULT_APPLICATION_DOCS.find((x) => x.id === d.id);
      return {
        id: d.id,
        title: def?.title || d.title,
        filename: d.filename || 'Belum diunggah',
        filesize: d.filesize || '',
        fileBlobUrl: d.fileBlobUrl || null,
        fileType: d.fileType || '',
        status: d.status || 'unuploaded',
        notes: def?.notes || d.notes || '',
      };
    });
  }

  if (pays.registrationFee) {
    applicant.payments = applicant.payments || {};
    const rf = pays.registrationFee;
    applicant.payments.registrationFee = {
      id: rf.id || applicant.payments.registrationFee?.id,
      amount: rf.amount ?? applicant.payments.registrationFee?.amount ?? 250000,
      status: rf.status || applicant.payments.registrationFee?.status || 'unpaid',
      paidAt: rf.paidAt || applicant.payments.registrationFee?.paidAt || null,
      submittedAt: rf.submittedAt || applicant.payments.registrationFee?.submittedAt || null,
      confirmedBy: rf.confirmedBy || applicant.payments.registrationFee?.confirmedBy || null,
      method: rf.paymentMethod || rf.method || applicant.payments.registrationFee?.method || 'Virtual Account BSI',
    };
  }

  if (pays.uktFee) {
    applicant.payments = applicant.payments || {};
    const uf = pays.uktFee;
    applicant.payments.uktFee = {
      id: uf.id || applicant.payments.uktFee?.id,
      amount: uf.amount ?? applicant.payments.uktFee?.amount ?? 6500000,
      status: uf.status || applicant.payments.uktFee?.status || 'unpaid',
      paidAt: uf.paidAt || applicant.payments.uktFee?.paidAt || null,
      submittedAt: uf.submittedAt || applicant.payments.uktFee?.submittedAt || null,
      confirmedBy: uf.confirmedBy || applicant.payments.uktFee?.confirmedBy || null,
      dueDate: uf.dueDate || applicant.payments.uktFee?.dueDate || '30 April 2026',
      method: uf.paymentMethod || uf.method || 'Virtual Account BSI / Mandiri',
    };
  }

  if (exam.score !== undefined || res.isPassed !== undefined) {
    applicant.selection = applicant.selection || {};
    if (exam.score !== undefined && exam.score > 0) applicant.selection.cbtScore = exam.score;
    if (res.isPassed) {
      applicant.selection.passedStatus = 'passed';
      applicant.selection.interviewScore = applicant.selection.interviewScore || 88;
      applicant.selection.interviewer = applicant.selection.interviewer || 'Dosen Penguji PMB BTH';
      applicant.selection.decisionLetterNo = res.decisionLetterNo || applicant.selection.decisionLetterNo;
    }
  }

  if (onb.nim || pays.uktFee?.status === 'paid') {
    applicant.onboarding = applicant.onboarding || {};
    if (onb.nim) {
      // Normalisasi format lama 8-digit ke format standar resmi 9-digit {YY}{prodi}{jalur}{urut:4}
      if (onb.nim.length === 8 && onb.nim.startsWith('26')) {
        const prodiCode = onb.nim.slice(2, 4);
        const seq = onb.nim.slice(4);
        applicant.onboarding.nim = `26${prodiCode}1${seq}`;
      } else {
        applicant.onboarding.nim = onb.nim;
      }
    }
    if (onb.pkkmbGroup) applicant.onboarding.pkkmbGroup = onb.pkkmbGroup;
    if (pays.uktFee?.status === 'paid') applicant.onboarding.isEnrolled = true;
  }

  return applicant;
}

function createDefaultApplicantForUser(u, index = 0) {
  const regNo = generateRegNumber(u.id, u.email);

  const baseApplicant = {
    id: regNo,
    backendUserId: u.id,
    nik: '-',
    nisn: '-',
    fullName: u.full_name || 'Calon Mahasiswa',
    gender: 'Perempuan',
    email: u.email,
    phone: u.phone || '-',
    schoolName: 'Belum Diisi',
    averageScore: '-',
    track: 'Jalur Reguler Gelombang 1',
    faculty: '-',
    prodi1: 'Belum Memilih Prodi',
    prodi2: '-',
    registrationDate: 'Baru Mendaftar',
    documentStatus: 'unuploaded',
    pendingDocsCount: 0,
    verifiedDocsCount: 0,
    documents: DEFAULT_APPLICATION_DOCS.map((d) => ({ ...d })),
    payments: {
      registrationFee: {
        id: `INV-REG-${regNo.slice(-5)}`,
        amount: 250000,
        status: 'unpaid',
        paidAt: null,
        method: 'Virtual Account BSI',
      },
      uktFee: {
        id: `INV-UKT-${regNo.slice(-5)}`,
        amount: 6500000,
        status: 'unpaid',
        paidAt: null,
        dueDate: '30 April 2026',
        method: 'Virtual Account BSI / Mandiri',
      },
    },
    selection: {
      cbtScore: 0,
      interviewScore: null,
      interviewer: null,
      interviewNotes: 'Pendaftar baru terdaftar di portal PMB.',
      passedStatus: 'evaluating',
      decisionLetterNo: null,
    },
    onboarding: {
      isEnrolled: false,
      nim: null,
      pkkmbGroup: null,
    },
  };

  // Cek apakah ada data formulir asli yang tersimpan untuk pengguna ini di browser
  let localState = null;
  try {
    const raw =
      localStorage.getItem(`bth_applicant_v3_${u.id}`) ||
      localStorage.getItem(`bth_applicant_v3_${u.email}`);
    if (raw) localState = JSON.parse(raw);
  } catch (e) {
    console.warn('Gagal membaca data lokal pengguna:', e);
  }

  if (localState) {
    updateApplicantWithLocalState(baseApplicant, localState);
    if (baseApplicant.registrationDate === 'Baru Mendaftar') {
      baseApplicant.registrationDate = 'Aktif di Sistem';
    }
  }

  return baseApplicant;
}

export const useAdminStore = defineStore('admin', () => {
  const applicantStore = useApplicantStore();
  const authStore = useAuthStore();
  const isLoadingBackend = ref(false);
  const backendSyncError = ref(null);
  const lastSyncTime = ref(null);

  const loadInitialData = () => {
    try {
      localStorage.removeItem('bth_admin_data_v1');
      localStorage.removeItem('bth_admin_applicants_v2');
      localStorage.removeItem('bth_admin_data_real_v2');
      localStorage.removeItem('bth_admin_data_real_v4');
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned = parsed.filter(
            (a) =>
              !a.email?.includes('admin.pmb@bth') &&
              a.fullName !== 'Administrator PMB' &&
              !a.email?.includes('superadmin@bth')
          );
          return cleaned;
        }
      }
    } catch (e) {
      console.warn('Failed to parse admin data from storage:', e);
    }
    // Hanya gunakan seed data kandidat fiktif saat mode development lokal
    return import.meta.env.DEV ? JSON.parse(JSON.stringify(OFFICIAL_CANDIDATE_SEEDS)) : [];
  };

  const applicants = ref(loadInitialData());

  // Realtime Event Listener untuk konfirmasi pembayaran dari BK / User
  if (typeof window !== 'undefined') {
    window.addEventListener('bth_payment_confirmed', (e) => {
      const email = e?.detail?.email;
      const regNo = e?.detail?.regNo;
      const found = applicants.value.find(
        (a) =>
          (email && a.email && a.email.toLowerCase().trim() === email.toLowerCase().trim()) ||
          (regNo && a.id === regNo)
      );
      if (found && found.payments?.registrationFee) {
        found.payments.registrationFee.status = 'paid';
        found.payments.registrationFee.statusLabel = 'Lunas (Disetujui Guru BK)';
        found.payments.registrationFee.paidAt = new Date().toLocaleString('id-ID');
      }
    });
  }

  watch(
    applicants,
    (newVal) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
      } catch (e) {
        console.warn('Failed to persist admin data:', e);
      }
    },
    { deep: true }
  );

  // Helper: Cek apakah ID pendaftar adalah kandidat aktif yang sedang login di sesi pengguna
  const isCurrentApplicant = (applicantId) => {
    const candidate = applicantStore.state?.candidate;
    const currentEmail = candidate?.email || authStore.currentUser?.email;
    const currentReg = candidate?.registrationNumber;
    const currentUserId = authStore.currentUser?.id;

    const target = applicants.value.find((a) => a.id === applicantId);
    if (!target) {
      return applicantId === currentReg || applicantId === 'current-user';
    }

    return (
      target.id === currentReg ||
      (currentEmail && target.email?.toLowerCase() === currentEmail.toLowerCase()) ||
      (currentUserId && target.backendUserId === currentUserId) ||
      applicantId === 'current-user'
    );
  };

  // Sinkronisasi dinamis pendaftar aktif (dari applicantStore) ke meja kerja admin
  const syncCurrentApplicant = () => {
    const candidate = applicantStore.state?.candidate;
    const admission = applicantStore.state?.admission;
    const payments = applicantStore.state?.payments;
    const exam = applicantStore.state?.exam;
    const result = applicantStore.state?.result;
    const onboarding = applicantStore.state?.onboarding;
    const docs = applicantStore.state?.documents || [];

    const user = authStore.currentUser;
    const isStaff = user?.roles?.some((r) =>
      ['superadmin', 'admin_pmb', 'admin', 'panitia', 'verifikator', 'keuangan', 'penguji', 'pimpinan', 'prodi', 'dosen', 'dekan'].includes(r)
    );
    if (isStaff) return;
    if (!user && !candidate?.email && !candidate?.fullName) return;

    const email = candidate?.email || user?.email || 'pendaftar@bth.ac.id';
    const fullName = candidate?.fullName || user?.full_name || 'Calon Mahasiswa Baru';
    const phone = candidate?.phone || user?.phone || '-';
    const regNo = candidate?.registrationNumber || (user ? generateRegNumber(user.id, user.email) : ('BTH-2026-REG-' + Math.floor(10000 + Math.random() * 90000)));

    const existingIndex = applicants.value.findIndex(
      (a) =>
        (user?.id && a.backendUserId === user.id) ||
        a.id === regNo ||
        (a.email && email && a.email.toLowerCase() === email.toLowerCase())
    );

    const verifiedDocs = docs.filter((d) => d.status === 'verified').length;
    const pendingDocs = docs.filter((d) => d.status === 'pending' || d.status === 'revision').length;
    const hasPendingDoc = docs.some((d) => d.status === 'pending');
    const hasRevisionDoc = docs.some((d) => d.status === 'revision');
    const hasUploaded = docs.some((d) => d.filename && d.filename !== 'Belum diunggah');
    const isAllVerified = docs.length > 0 && verifiedDocs === docs.length;

    let currentDocStatus = 'unuploaded';
    if (isAllVerified) {
      currentDocStatus = 'verified';
    } else if (hasRevisionDoc) {
      currentDocStatus = 'revision';
    } else if (hasPendingDoc || hasUploaded) {
      currentDocStatus = 'pending';
    } else if (verifiedDocs > 0) {
      currentDocStatus = 'pending';
    }

    const existingApplicant = existingIndex >= 0 ? applicants.value[existingIndex] : null;

    const activeApplicantData = {
      id: regNo,
      backendUserId: user?.id || existingApplicant?.backendUserId || null,
      nik: candidate?.nik || existingApplicant?.nik || '-',
      nisn: candidate?.nisn || existingApplicant?.nisn || '-',
      fullName,
      gender: candidate?.gender || existingApplicant?.gender || '-',
      email,
      phone,
      schoolName: candidate?.schoolName || existingApplicant?.schoolName || '-',
      averageScore: candidate?.averageScore || existingApplicant?.averageScore || '-',
      track: admission?.track || existingApplicant?.track || 'Jalur Reguler Gelombang 1',
      faculty: admission?.prodi1Faculty || existingApplicant?.faculty || '-',
      prodi1: admission?.prodi1 || existingApplicant?.prodi1 || 'Belum Memilih',
      prodi2: admission?.prodi2 || existingApplicant?.prodi2 || '-',
      registrationDate: existingApplicant?.registrationDate || 'Hari ini',
      referralCode: applicantStore.state?.referral?.isApplied ? applicantStore.state.referral.code : existingApplicant?.referralCode || null,
      referralSchool: applicantStore.state?.referral?.isApplied ? applicantStore.state.referral.schoolName : existingApplicant?.referralSchool || null,
      referralPic: applicantStore.state?.referral?.isApplied ? applicantStore.state.referral.picName : existingApplicant?.referralPic || null,
      documentStatus: currentDocStatus,
      pendingDocsCount: pendingDocs,
      verifiedDocsCount: verifiedDocs,
      documents: docs.map((d) => ({
        id: d.id,
        title: d.title,
        filename: d.filename || 'Belum diunggah',
        filesize: d.filesize || '',
        fileBlobUrl: d.fileBlobUrl || null,
        fileType: d.fileType || '',
        status: d.status || 'unuploaded',
        notes: d.notes || '',
      })),
      payments: {
        registrationFee: {
          id: payments?.registrationFee?.id || existingApplicant?.payments?.registrationFee?.id || `INV-REG-${regNo.slice(-5)}`,
          amount: payments?.registrationFee?.amount || 250000,
          status: payments?.registrationFee?.status || existingApplicant?.payments?.registrationFee?.status || 'unpaid',
          paidAt: payments?.registrationFee?.paidAt || existingApplicant?.payments?.registrationFee?.paidAt || null,
          submittedAt: payments?.registrationFee?.submittedAt || existingApplicant?.payments?.registrationFee?.submittedAt || null,
          confirmedBy: payments?.registrationFee?.confirmedBy || existingApplicant?.payments?.registrationFee?.confirmedBy || null,
          method: payments?.registrationFee?.paymentMethod || 'Virtual Account BSI',
        },
        uktFee: {
          id: payments?.uktFee?.id || existingApplicant?.payments?.uktFee?.id || `INV-UKT-${regNo.slice(-5)}`,
          amount: payments?.uktFee?.amount || 6500000,
          status: payments?.uktFee?.status || existingApplicant?.payments?.uktFee?.status || 'unpaid',
          paidAt: payments?.uktFee?.paidAt || existingApplicant?.payments?.uktFee?.paidAt || null,
          submittedAt: payments?.uktFee?.submittedAt || existingApplicant?.payments?.uktFee?.submittedAt || null,
          confirmedBy: payments?.uktFee?.confirmedBy || existingApplicant?.payments?.uktFee?.confirmedBy || null,
          dueDate: payments?.uktFee?.dueDate || '30 April 2026',
          method: 'Virtual Account BSI / Mandiri',
        },
      },
      selection: {
        cbtScore: exam?.score || existingApplicant?.selection?.cbtScore || 0,
        interviewScore: existingApplicant?.selection?.interviewScore ?? (result?.isPassed ? 88 : null),
        interviewer: existingApplicant?.selection?.interviewer ?? (result?.isPassed ? 'Dosen Penguji PMB BTH' : null),
        interviewNotes: existingApplicant?.selection?.interviewNotes ?? 'Pendaftar akun aktif terintegrasi sistem.',
        passedStatus: result?.isPassed ? 'passed' : exam?.status === 'completed' ? 'evaluating' : existingApplicant?.selection?.passedStatus || 'evaluating',
        decisionLetterNo: result?.decisionLetterNo || existingApplicant?.selection?.decisionLetterNo || null,
      },
      onboarding: {
        isEnrolled: applicantStore.isUktPaid || existingApplicant?.onboarding?.isEnrolled || false,
        nim: onboarding?.nim || existingApplicant?.onboarding?.nim || null,
        pkkmbGroup: onboarding?.pkkmbGroup || existingApplicant?.onboarding?.pkkmbGroup || null,
      },
    };

    if (existingIndex >= 0) {
      applicants.value[existingIndex] = { ...applicants.value[existingIndex], ...activeApplicantData };
    } else {
      applicants.value.unshift(activeApplicantData);
    }
  };

  // Reaktif terhadap setiap aksi pendaftar di portal calon mahasiswa
  watch(
    () => applicantStore.state,
    () => {
      syncCurrentApplicant();
    },
    { deep: true, immediate: true }
  );

  // Computed Key Metrics Dinamis
  const totalApplicants = computed(() => applicants.value.length);
  const pendingDocCount = computed(() => {
    return applicants.value.filter((a) => a.documentStatus === 'pending' || a.documentStatus === 'revision').length;
  });
  const totalPaidRevenue = computed(() => {
    let sum = 0;
    applicants.value.forEach((a) => {
      if (a.payments?.registrationFee?.status === 'paid') sum += (a.payments.registrationFee.amount || 0);
      if (a.payments?.uktFee?.status === 'paid') sum += (a.payments.uktFee.amount || 0);
    });
    return sum;
  });
  const passedStudentsCount = computed(() => {
    return applicants.value.filter((a) => a.selection?.passedStatus === 'passed').length;
  });

  // Action: Verifikasi dokumen oleh panitia
  const verifyDocument = (applicantId, docId, status, notes) => {
    const applicant = applicants.value.find((a) => a.id === applicantId);
    if (!applicant) return;

    const doc = applicant.documents.find((d) => d.id === docId);
    if (doc) {
      doc.status = status;
      doc.notes = notes;
    }

    const isAllVerified = applicant.documents.length > 0 && applicant.documents.every((d) => d.status === 'verified');
    const hasPending = applicant.documents.some((d) => d.status === 'pending');
    const hasRevision = applicant.documents.some((d) => d.status === 'revision');
    applicant.verifiedDocsCount = applicant.documents.filter((d) => d.status === 'verified').length;
    applicant.pendingDocsCount = applicant.documents.filter((d) => d.status === 'pending' || d.status === 'revision').length;

    if (isAllVerified) {
      applicant.documentStatus = 'verified';
    } else if (hasRevision) {
      applicant.documentStatus = 'revision';
    } else if (hasPending) {
      applicant.documentStatus = 'pending';
    } else if (applicant.verifiedDocsCount > 0) {
      applicant.documentStatus = 'pending';
    } else {
      applicant.documentStatus = 'unuploaded';
    }

    // 1. Sinkronisasi dua arah ke applicantStore jika merupakan kandidat aktif
    if (isCurrentApplicant(applicantId)) {
      const targetInApplicant = applicantStore.state.documents.find((d) => d.id === docId);
      if (targetInApplicant) {
        targetInApplicant.status = status;
        targetInApplicant.statusLabel = status === 'verified' ? 'Terverifikasi' : status === 'revision' ? 'Perlu Perbaikan' : 'Sedang Ditinjau';
        targetInApplicant.notes = notes;
      }
    }

    // 2. Sinkronisasi ke penyimpanan lokal pengguna agar tetap tersimpan saat login ulang
    try {
      const uId = applicant.backendUserId;
      const uEmail = applicant.email;
      const key1 = uId ? `bth_applicant_v3_${uId}` : null;
      const key2 = uEmail ? `bth_applicant_v3_${uEmail}` : null;
      [key1, key2].filter(Boolean).forEach((k) => {
        const raw = localStorage.getItem(k);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.documents) {
            const targetDoc = parsed.documents.find((d) => d.id === docId);
            if (targetDoc) {
              targetDoc.status = status;
              targetDoc.statusLabel = status === 'verified' ? 'Terverifikasi' : status === 'revision' ? 'Perlu Perbaikan' : 'Sedang Ditinjau';
              targetDoc.notes = notes;
              localStorage.setItem(k, JSON.stringify(parsed));
            }
          }
        }
      });
    } catch (e) {
      console.warn('Gagal sinkronisasi berkas ke penyimpanan lokal pengguna:', e);
    }

    // 3. Dispatch ke backend admission-service
    admissionApi
      .verifyDocument(docId, {
        applicant_id: applicantId,
        status,
        notes,
      })
      .catch((e) => {
        console.warn('Admission API Notice (verifyDocument fallback):', e?.message);
      });
  };

  // Helper Sinkronisasi Balik ke Penyimpanan Calon Mahasiswa (Local Storage & Reactive State)
  const syncApplicantToLocalApplicantStorage = (applicant) => {
    if (!applicant) return;
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const targetKeys = new Set();
      if (applicant.backendUserId) targetKeys.add(`bth_applicant_v3_${applicant.backendUserId}`);
      if (applicant.email) targetKeys.add(`bth_applicant_v3_${applicant.email.toLowerCase().trim()}`);

      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('bth_applicant_v3_')) {
          const raw = localStorage.getItem(k);
          if (raw) {
            try {
              const p = JSON.parse(raw);
              const matchEmail = applicant.email && p.candidate?.email?.toLowerCase().trim() === applicant.email.toLowerCase().trim();
              const matchReg = applicant.id && p.candidate?.registrationNumber === applicant.id;
              if (matchEmail || matchReg) targetKeys.add(k);
            } catch {}
          }
        }
      }

      targetKeys.forEach((k) => {
        const raw = localStorage.getItem(k);
        let parsed = raw ? JSON.parse(raw) : null;
        if (!parsed) return;

        // 1. Sync Payments
        if (applicant.payments) {
          if (!parsed.payments) parsed.payments = {};
          if (applicant.payments.registrationFee) {
            parsed.payments.registrationFee = {
              ...(parsed.payments.registrationFee || {}),
              status: applicant.payments.registrationFee.status,
              statusLabel: applicant.payments.registrationFee.statusLabel || (applicant.payments.registrationFee.status === 'paid' ? 'Lunas (Dikonfirmasi Admin)' : 'Menunggu'),
              paidAt: applicant.payments.registrationFee.paidAt || parsed.payments.registrationFee?.paidAt,
              confirmedBy: applicant.payments.registrationFee.confirmedBy || parsed.payments.registrationFee?.confirmedBy,
            };
          }
          if (applicant.payments.uktFee) {
            parsed.payments.uktFee = {
              ...(parsed.payments.uktFee || {}),
              status: applicant.payments.uktFee.status,
              statusLabel: applicant.payments.uktFee.statusLabel || (applicant.payments.uktFee.status === 'paid' ? 'Lunas (Dikonfirmasi Admin)' : 'Menunggu'),
              paidAt: applicant.payments.uktFee.paidAt || parsed.payments.uktFee?.paidAt,
              confirmedBy: applicant.payments.uktFee.confirmedBy || parsed.payments.uktFee?.confirmedBy,
            };
          }
        }

        // 2. Sync Selection Result
        if (applicant.selection) {
          if (!parsed.result) parsed.result = {};
          if (applicant.selection.passedStatus === 'passed') {
            parsed.result.isPassed = true;
            parsed.result.isAnnounced = true;
            parsed.result.decisionLetterNo = applicant.selection.decisionLetterNo || parsed.result.decisionLetterNo || `08${applicant.id.slice(-3)}/SK-PMB/UBTH/X/2026`;
            if (!parsed.admission) parsed.admission = {};
            parsed.admission.status = 'Dinyatakan Lulus Seleksi';
          } else if (applicant.selection.passedStatus === 'failed') {
            parsed.result.isPassed = false;
            parsed.result.isAnnounced = true;
            if (!parsed.admission) parsed.admission = {};
            parsed.admission.status = 'Tidak Lulus Seleksi';
          }
        }

        // 3. Sync Onboarding & NIM
        if (applicant.onboarding?.nim || applicant.payments?.uktFee?.status === 'paid') {
          if (!parsed.onboarding) parsed.onboarding = {};
          if (applicant.onboarding?.nim) parsed.onboarding.nim = applicant.onboarding.nim;
          if (applicant.onboarding?.pkkmbGroup) parsed.onboarding.pkkmbGroup = applicant.onboarding.pkkmbGroup;
          if (applicant.payments?.uktFee?.status === 'paid') parsed.onboarding.isEnrolled = true;
        }

        // 4. Sync Documents
        if (Array.isArray(applicant.documents) && Array.isArray(parsed.documents)) {
          applicant.documents.forEach((ad) => {
            const pd = parsed.documents.find((d) => d.id === ad.id);
            if (pd && ad.status) {
              pd.status = ad.status;
              pd.statusLabel = ad.status === 'verified' ? 'Terverifikasi' : ad.status === 'revision' ? 'Perlu Perbaikan' : 'Sedang Ditinjau';
              pd.notes = ad.notes || pd.notes;
            }
          });
        }

        localStorage.setItem(k, JSON.stringify(parsed));
      });

      // Siarkan event realtime antar modul & tab
      window.dispatchEvent(
        new CustomEvent('bth_applicant_synced_from_admin', {
          detail: { applicantId: applicant.id, email: applicant.email },
        })
      );
    } catch (e) {
      console.warn('Sync applicant to localStorage error:', e);
    }
  };

  // Action: Konfirmasi pelunasan tagihan VA oleh admin
  const confirmPayment = (applicantId, paymentType) => {
    const applicant = applicants.value.find((a) => a.id === applicantId);
    if (!applicant) return;

    const nowStr = new Date().toLocaleString('id-ID');
    const confirmedBy = 'Panitia PMB / Biro Keuangan BTH';

    if (paymentType === 'uktFee') {
      applicant.payments.uktFee.status = 'paid';
      applicant.payments.uktFee.statusLabel = 'Lunas (Dikonfirmasi Admin)';
      applicant.payments.uktFee.paidAt = nowStr;
      applicant.payments.uktFee.confirmedBy = confirmedBy;
      applicant.onboarding.isEnrolled = true;

      // OTOMATIS: Terbitkan NIM jika calon mahasiswa telah lulus seleksi
      if (!applicant.onboarding.nim && applicant.selection?.passedStatus === 'passed') {
        autoGenerateNimForApplicant(applicant);
      }

      if (isCurrentApplicant(applicantId)) {
        applicantStore.payUktFee(confirmedBy);
      }
    } else if (paymentType === 'registrationFee') {
      applicant.payments.registrationFee.status = 'paid';
      applicant.payments.registrationFee.statusLabel = 'Lunas (Dikonfirmasi Admin)';
      applicant.payments.registrationFee.paidAt = nowStr;
      applicant.payments.registrationFee.confirmedBy = confirmedBy;
      if (isCurrentApplicant(applicantId)) {
        applicantStore.payRegFee(confirmedBy);
      }
      // Sinkronkan ke mitra BK bila calon mahasiswa terdaftar lewat referal
      if (applicant.referralCode) {
        try {
          const referralStore = useReferralStore();
          referralStore.approveStudentPayment(applicant.referralCode, applicant.email || applicant.id);
        } catch (e) {
          console.warn('Sync referral on confirmPayment error:', e);
        }
      }
    }

    // Sinkronkan ke local storage siswa dan siarkan update
    syncApplicantToLocalApplicantStorage(applicant);

    // Dispatch ke backend finance-service
    const invoiceId =
      paymentType === 'uktFee'
        ? applicant.payments?.uktFee?.id || `INV-UKT-${applicantId.slice(-5)}`
        : applicant.payments?.registrationFee?.id || `INV-REG-${applicantId.slice(-5)}`;
    financeApi
      .verifyManualPayment(invoiceId, {
        status: 'verified',
        confirmed_by: confirmedBy,
        paid_at: nowStr,
      })
      .catch((e) => {
        console.warn('Finance API Notice (verifyManualPayment fallback):', e?.message);
      });
  };

  // Action: Terbitkan NIM secara otomatis berdasarkan petunjuk dokumen akademik BTH
  const autoGenerateNimForApplicant = (applicant, customSeq = null) => {
    if (!applicant) return null;
    const prodi = applicant.acceptedProdi || applicant.prodi1 || applicant.studyProgram || 'S1 Farmasi';
    const meta = PRODI_METADATA[prodi] || { code: '01', gugus: 'Gugus 01 - Hygeia Farmasi' };
    const prodiCode = meta.code || '01';

    // Digit Jalur: 1=Reguler, 2=Prestasi, 3=Beasiswa/KIP, 4=Pindahan (Standar PRD & DECISIONS.md Q2)
    let jalurDigit = '1';
    const track = (applicant.track || '').toLowerCase();
    if (track.includes('prestasi') || track.includes('pmdk')) {
      jalurDigit = '2';
    } else if (track.includes('beasiswa') || track.includes('kip') || track.includes('afirmasi')) {
      jalurDigit = '3';
    } else if (track.includes('pindahan') || track.includes('alih')) {
      jalurDigit = '4';
    }

    let seqStr = '0001';
    if (customSeq != null) {
      seqStr = String(customSeq).padStart(4, '0');
    } else {
      const regSuffix = (applicant.id || '').replace(/\D/g, '').slice(-4);
      seqStr = regSuffix ? regSuffix.padStart(4, '0') : '0001';
    }

    const nim = `26${prodiCode}${jalurDigit}${seqStr}`;
    const group = meta.gugus || 'Gugus 01 - Hygeia Farmasi';

    applicant.onboarding = applicant.onboarding || {};
    applicant.onboarding.isEnrolled = true;
    applicant.onboarding.nim = nim;
    applicant.onboarding.pkkmbGroup = group;

    if (isCurrentApplicant(applicant.id)) {
      applicantStore.state.onboarding.nim = nim;
      applicantStore.state.onboarding.pkkmbGroup = group;
      applicantStore.state.onboarding.isEnrolled = true;
    }

    syncApplicantToLocalApplicantStorage(applicant);

    nimApi
      .generateNim({
        applicant_id: applicant.id,
        nim,
        faculty: applicant.faculty,
        prodi: applicant.prodi1,
      })
      .catch((e) => {
        console.warn('NIM API Notice (autoGenerateNim fallback):', e?.message);
      });

    return nim;
  };

  // Action: Sinkronkan seluruh pendaftar yang lulus & lunas agar langsung memiliki NIM otomatis
  const syncAutoEnrollAllEligible = () => {
    let count = 0;
    applicants.value.forEach((a, idx) => {
      if (a.selection?.passedStatus === 'passed' && a.payments?.uktFee?.status === 'paid' && !a.onboarding?.nim) {
        autoGenerateNimForApplicant(a, idx + 1);
        count++;
      }
    });
    return count;
  };

  // Action: Simpan nilai wawancara & status kelulusan seleksi
  const updateInterview = (applicantId, score, notes, interviewer) => {
    const applicant = applicants.value.find((a) => a.id === applicantId);
    if (!applicant) return;

    applicant.selection.interviewScore = Number(score);
    applicant.selection.interviewNotes = notes;
    if (interviewer) applicant.selection.interviewer = interviewer;

    const avg = (applicant.selection.cbtScore + Number(score)) / 2;
    const isPass = avg >= 70;
    applicant.selection.passedStatus = isPass ? 'passed' : 'failed';
    if (isPass && !applicant.selection.decisionLetterNo) {
      applicant.selection.decisionLetterNo = `08${applicant.id.slice(-3)}/SK-PMB/UBTH/X/2026`;
    }

    // OTOMATIS: Terbitkan NIM jika telah lunas UKT Semester 1
    if (isPass && applicant.payments?.uktFee?.status === 'paid' && !applicant.onboarding?.nim) {
      autoGenerateNimForApplicant(applicant);
    }

    if (isCurrentApplicant(applicantId)) {
      applicantStore.state.result.isPassed = isPass;
      applicantStore.state.result.isAnnounced = true;
      if (applicant.selection.decisionLetterNo) {
        applicantStore.state.result.decisionLetterNo = applicant.selection.decisionLetterNo;
      }
      applicantStore.state.admission.status = isPass ? 'Dinyatakan Lulus Seleksi' : 'Tidak Lulus Seleksi';
    }

    // Sinkronkan ke local storage siswa dan siarkan update
    syncApplicantToLocalApplicantStorage(applicant);

    // Dispatch ke backend scoring-service
    scoringApi
      .submitExaminerScore(applicantId, {
        applicant_id: applicantId,
        component: 'interview',
        score: Number(score),
        notes,
        examiner: interviewer || 'Dosen Penguji PMB BTH',
      })
      .catch((e) => {
        console.warn('Scoring API Notice (submitExaminerScore fallback):', e?.message);
      });
  };

  // Action: Terbitkan NIM & plot gugus PKKMB (dengan opsi kustom)
  const generateNim = (applicantId, customNim, group) => {
    const applicant = applicants.value.find((a) => a.id === applicantId);
    if (!applicant) return;

    const prodi = applicant.prodi1 || 'S1 Farmasi';
    const meta = PRODI_METADATA[prodi] || { code: '01', gugus: 'Gugus 01 - Hygeia Farmasi' };
    const regSuffix = (applicant.id || '').replace(/\D/g, '').slice(-4) || '1001';

    let jalurDigit = '1';
    const track = (applicant.track || '').toLowerCase();
    if (track.includes('prestasi') || track.includes('pmdk')) {
      jalurDigit = '2';
    } else if (track.includes('beasiswa') || track.includes('kip') || track.includes('afirmasi')) {
      jalurDigit = '3';
    } else if (track.includes('pindahan') || track.includes('alih')) {
      jalurDigit = '4';
    }

    applicant.onboarding.isEnrolled = true;
    applicant.onboarding.nim = customNim || `26${meta.code}${jalurDigit}${regSuffix.padStart(4, '0')}`;
    applicant.onboarding.pkkmbGroup = group || meta.gugus || 'Gugus 01 - Hygeia Farmasi';

    if (isCurrentApplicant(applicantId)) {
      applicantStore.state.onboarding.nim = applicant.onboarding.nim;
      applicantStore.state.onboarding.pkkmbGroup = applicant.onboarding.pkkmbGroup;
      applicantStore.state.onboarding.isEnrolled = true;
    }

    // Sinkronkan ke local storage siswa dan siarkan update
    syncApplicantToLocalApplicantStorage(applicant);

    // Dispatch ke backend nim-service
    nimApi
      .generateNim({
        applicant_id: applicantId,
        nim: applicant.onboarding.nim,
        faculty: applicant.faculty,
        prodi: applicant.prodi1,
      })
      .catch((e) => {
        console.warn('NIM API Notice (generateNim fallback):', e?.message);
      });
  };

  // Helper internal: Dapatkan token otorisasi admin untuk mengakses API backend
  const getAdminAuthorizationToken = async () => {
    const currentToken = localStorage.getItem('access_token');
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    const adminRoles = [
      'superadmin',
      'admin_pmb',
      'admin',
      'panitia',
      'verifikator',
      'keuangan',
      'penguji',
      'pimpinan',
      'prodi',
      'dosen',
      'dekan',
    ];

    if (currentToken && currentUser?.roles?.some((r) => adminRoles.includes(r))) {
      return currentToken;
    }

    const cachedToken = sessionStorage.getItem('bth_admin_session_token');
    if (cachedToken) {
      return cachedToken;
    }

    return currentToken || '';
  };

  // Action: Sinkronkan seluruh data pelamar dari penyimpanan lokal browser (bth_applicant_v3_*)
  const syncAllLocalApplicants = () => {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith('bth_applicant_v3_')) continue;

        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const localState = JSON.parse(raw);
        const cand = localState.candidate || {};
        const email = cand.email;
        const regNo = cand.registrationNumber;
        const userId = key.replace('bth_applicant_v3_', '');

        if (!email && !cand.fullName && !regNo) continue;
        if (email?.includes('admin.pmb@bth') || cand.fullName === 'Administrator PMB' || email?.includes('superadmin@bth')) continue;

        const existingIdx = applicants.value.findIndex(
          (a) =>
            (regNo && a.id === regNo) ||
            (userId && (a.backendUserId === userId || a.id === userId)) ||
            (email && a.email && a.email.toLowerCase() === email.toLowerCase())
        );

        if (existingIdx >= 0) {
          updateApplicantWithLocalState(applicants.value[existingIdx], localState);
        } else {
          const pseudoUser = {
            id: userId.includes('@') ? null : userId,
            email: email || `${userId}@bth.ac.id`,
            full_name: cand.fullName || 'Calon Mahasiswa',
            phone: cand.phone || '',
          };
          const newApp = createDefaultApplicantForUser(pseudoUser, applicants.value.length);
          updateApplicantWithLocalState(newApp, localState);
          applicants.value.unshift(newApp);
        }
      }
    } catch (e) {
      console.warn('Gagal sinkronisasi data pelamar lokal:', e);
    }
  };

  // Action: Ambil data pendaftar riil langsung dari backend API (/auth/admin/users)
  const fetchBackendApplicants = async () => {
    isLoadingBackend.value = true;
    backendSyncError.value = null;
    try {
      const token = await getAdminAuthorizationToken();
      const baseURL = getApiBaseUrl();
      const res = await axios.get(`${baseURL}/auth/admin/users`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: { per_page: 100 },
      });

      // Filter pengguna role calon_mahasiswa riil (kecualikan superadmin dan staf kampus)
      const nonApplicantRoles = ['superadmin', 'admin_pmb', 'admin', 'dosen', 'prodi', 'dekan', 'pimpinan', 'keuangan'];
      const users = (res.data?.data || []).filter((u) => {
        const roles = u.roles || [];
        return !roles.some((r) => nonApplicantRoles.includes(r));
      });

      users.forEach((u, idx) => {
        const regNo = generateRegNumber(u.id, u.email);
        const existingIdx = applicants.value.findIndex(
          (a) =>
            a.backendUserId === u.id ||
            (a.email && a.email.toLowerCase() === u.email.toLowerCase()) ||
            a.id === regNo
        );

        let localState = null;
        try {
          const raw =
            localStorage.getItem(`bth_applicant_v3_${u.id}`) ||
            localStorage.getItem(`bth_applicant_v3_${u.email}`);
          if (raw) localState = JSON.parse(raw);
        } catch (e) {}

        if (existingIdx === -1) {
          // Tambahkan pendaftar riil baru dengan metadata lengkap
          const newApp = createDefaultApplicantForUser(u, idx);
          if (localState) {
            updateApplicantWithLocalState(newApp, localState);
          }
          applicants.value.push(newApp);
        } else {
          // Perbarui metadata profil jika ada perubahan dari database backend
          const existing = applicants.value[existingIdx];
          existing.backendUserId = u.id;
          if (u.full_name) existing.fullName = u.full_name;
          if (u.phone && u.phone !== '-') existing.phone = u.phone;
          if (u.email) existing.email = u.email;

          // Perbarui data jalur, prodi, berkas, pembayaran, dll.
          if (localState) {
            updateApplicantWithLocalState(existing, localState);
          }
        }
      });

      // Sinkronisasi data pelengkap dari admission-service & student-service
      try {
        const [admissionData, studentData] = await Promise.allSettled([
          admissionApi.getApplications({ per_page: 100 }),
          studentApi.getStudents({ per_page: 100 }),
        ]);

        if (admissionData.status === 'fulfilled' && admissionData.value?.data?.data) {
          const apps = admissionData.value.data.data;
          if (Array.isArray(apps)) {
            apps.forEach((app) => {
              const found = applicants.value.find(
                (a) => a.id === app.registration_number || a.backendUserId === app.user_id
              );
              if (found) {
                if (app.track) found.track = app.track;
                if (app.status === 'verified') found.documentStatus = 'verified';
              }
            });
          }
        }

        if (studentData.status === 'fulfilled' && studentData.value?.data?.data) {
          const studs = studentData.value.data.data;
          if (Array.isArray(studs)) {
            studs.forEach((stud) => {
              const found = applicants.value.find(
                (a) => a.id === stud.registration_number || a.backendUserId === stud.user_id
              );
              if (found && stud.nim) {
                found.onboarding.nim = stud.nim;
                found.onboarding.isEnrolled = true;
              }
            });
          }
        }
      } catch (subErr) {
        console.warn('Microservices multi-sync notice:', subErr?.message);
      }

      lastSyncTime.value = new Date().toLocaleTimeString('id-ID');
    } catch (err) {
      console.warn('Pemberitahuan sinkronisasi backend:', err);
      backendSyncError.value = err.response?.data?.message || 'Gagal tersambung ke backend API.';
    } finally {
      // Pastikan seluruh data lokal dan pelamar aktif tetap tersinkronisasi
      syncAllLocalApplicants();
      syncCurrentApplicant();
      isLoadingBackend.value = false;
    }
  };

  // =========================================================================
  // CR-006, CR-007, CR-010: PERMOHONAN PINDAH JALUR, PENGUNDURAN DIRI & CICILAN
  // =========================================================================
  const loadInitialPathChanges = () => {
    try {
      const saved = localStorage.getItem(PATH_CHANGES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse path changes:', e);
    }
    return import.meta.env.DEV ? JSON.parse(JSON.stringify(OFFICIAL_PATH_CHANGE_SEEDS)) : [];
  };

  const loadInitialWithdrawals = () => {
    try {
      const saved = localStorage.getItem(WITHDRAWALS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse withdrawals:', e);
    }
    return import.meta.env.DEV ? JSON.parse(JSON.stringify(OFFICIAL_WITHDRAWAL_SEEDS)) : [];
  };

  const loadInitialRefunds = () => {
    try {
      const saved = localStorage.getItem(REFUNDS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse refund reviews:', e);
    }
    return import.meta.env.DEV ? JSON.parse(JSON.stringify(OFFICIAL_REFUND_SEEDS)) : [];
  };

  const loadInitialInstallments = () => {
    try {
      const saved = localStorage.getItem(INSTALLMENTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse installments:', e);
    }
    return import.meta.env.DEV ? JSON.parse(JSON.stringify(OFFICIAL_INSTALLMENT_SEEDS)) : [];
  };

  const pathChanges = ref(loadInitialPathChanges());
  const withdrawals = ref(loadInitialWithdrawals());
  const refundReviews = ref(loadInitialRefunds());
  const installmentRequests = ref(loadInitialInstallments());

  const pendingPathChangeCount = computed(() => (pathChanges.value || []).filter((p) => p.status === 'pending').length);
  const pendingWithdrawalCount = computed(() => (withdrawals.value || []).filter((w) => w.status === 'pending').length);
  const pendingVerificationCount = computed(() => {
    return pendingDocCount.value + pendingPathChangeCount.value + pendingWithdrawalCount.value;
  });

  watch(
    pathChanges,
    (val) => {
      try { localStorage.setItem(PATH_CHANGES_KEY, JSON.stringify(val)); } catch (e) { console.warn(e); }
    },
    { deep: true }
  );

  watch(
    withdrawals,
    (val) => {
      try { localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(val)); } catch (e) { console.warn(e); }
    },
    { deep: true }
  );

  watch(
    refundReviews,
    (val) => {
      try { localStorage.setItem(REFUNDS_KEY, JSON.stringify(val)); } catch (e) { console.warn(e); }
    },
    { deep: true }
  );

  watch(
    installmentRequests,
    (val) => {
      try { localStorage.setItem(INSTALLMENTS_KEY, JSON.stringify(val)); } catch (e) { console.warn(e); }
    },
    { deep: true }
  );

  const fetchPathChanges = async () => {
    try {
      const res = await admissionApi.getPathChanges();
      const rawItems = res.data?.data?.items || (Array.isArray(res.data?.data) ? res.data.data : []);
      if (rawItems && rawItems.length > 0) {
        const mapped = rawItems.map((item) => {
          const cand = applicants.value.find(
            (a) => a.id === item.application?.registration_no || a.backendUserId === item.user_id || a.email === 'ujang@gmail.com'
          );
          const candName = cand?.fullName || (item.user_id === '32d44743-7a7a-4d22-9e65-56f63f6d91e0' ? 'Ujang' : 'Calon Mahasiswa');
          const regNo = item.application?.registration_no || item.application_id || 'PMB-2026-REG';
          return {
            id: item.id,
            candidateName: candName,
            regNo: regNo,
            oldTrack: item.from_path?.name || 'Jalur Reguler',
            oldProdi: cand?.prodi1 || 'S1 Farmasi',
            newTrack: item.to_path?.name || 'Jalur Prestasi Akademik',
            newProdi: cand?.prodi1 || 'S1 Farmasi',
            reason: item.reason || 'Permohonan pindah jalur pendaftaran',
            status: item.status || 'pending',
            feeDifference: item.fee_difference || 0,
            submittedAt: item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : 'Hari ini',
            reviewedAt: item.reviewed_at ? new Date(item.reviewed_at).toLocaleDateString('id-ID') : null,
          };
        });
        pathChanges.value = mapped;
      }
    } catch (e) {
      console.warn('Gagal memuat permohonan pindah jalur dari backend (menggunakan data lokal):', e?.message);
    }
  };

  const reviewPathChange = async (id, status, notes = '') => {
    // 1. Perbarui state lokal dan persistensinya
    const item = pathChanges.value.find((p) => p.id === id);
    if (item) {
      item.status = status;
      item.reviewedAt = new Date().toLocaleDateString('id-ID');
      item.notes = notes;

      // 2. Sinkronisasi dua arah ke pendaftar di daftar utama applicants
      if (status === 'approved') {
        const candidate = applicants.value.find((a) => a.id === item.regNo);
        if (candidate) {
          candidate.track = item.newTrack;
          candidate.prodi1 = item.newProdi;
          const meta = PRODI_METADATA[item.newProdi];
          if (meta) {
            candidate.faculty = meta.faculty;
            if (candidate.payments?.uktFee && candidate.payments.uktFee.status !== 'paid') {
              candidate.payments.uktFee.amount = meta.uktFee;
            }
          }
        }
        if (isCurrentApplicant(item.regNo)) {
          applicantStore.state.admission.track = item.newTrack;
          applicantStore.state.admission.prodi1 = item.newProdi;
          if (PRODI_METADATA[item.newProdi]) {
            applicantStore.state.admission.prodi1Faculty = PRODI_METADATA[item.newProdi].faculty;
          }
        }
      }
    }

    try {
      const res = await admissionApi.reviewPathChange(id, { status, note: notes || (status === 'approved' ? 'Disetujui Panitia PMB' : 'Ditolak') });
      await fetchPathChanges();
      return res.data;
    } catch (err) {
      console.warn('Admission API Notice (reviewPathChange fallback to local):', err?.message);
      return { success: true, localOnly: true };
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const res = await admissionApi.getWithdrawals();
      const rawItems = res.data?.data?.items || (Array.isArray(res.data?.data) ? res.data.data : []);
      if (rawItems && rawItems.length > 0) {
        const mapped = rawItems.map((item) => {
          const cand = applicants.value.find(
            (a) => a.id === item.application?.registration_no || a.backendUserId === item.user_id || a.email === 'ujang@gmail.com'
          );
          const candName = cand?.fullName || (item.user_id === '32d44743-7a7a-4d22-9e65-56f63f6d91e0' ? 'Ujang' : 'Calon Mahasiswa');
          const regNo = item.application?.registration_no || item.application_id || 'PMB-2026-REG';
          return {
            id: item.id,
            candidateName: candName,
            regNo: regNo,
            prodi: cand?.prodi1 || 'S1 Farmasi',
            category: item.reason_category || 'Lainnya',
            reason: item.reason_text || item.reason || 'Pengunduran diri calon mahasiswa',
            verificationCode: item.letter_number || (item.verify_code_hash ? item.verify_code_hash.slice(0, 10).toUpperCase() : 'VERIF-BTH-WD'),
            submittedAt: item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : 'Hari ini',
            status: item.status === 'effective' ? 'approved' : (item.status || 'pending'),
            reviewedAt: item.effective_at ? new Date(item.effective_at).toLocaleDateString('id-ID') : null,
          };
        });
        withdrawals.value = mapped;
      }
    } catch (e) {
      console.warn('Gagal memuat permohonan pengunduran diri dari backend (menggunakan data lokal):', e?.message);
    }
  };

  const reviewWithdrawal = async (id, status, notes = '') => {
    const item = withdrawals.value.find((w) => w.id === id);
    if (item) {
      item.status = status;
      item.reviewedAt = new Date().toLocaleDateString('id-ID');
      item.notes = notes;

      // Sinkronisasi status kandidat
      if (status === 'approved') {
        const candidate = applicants.value.find((a) => a.id === item.regNo);
        if (candidate) {
          candidate.selection.passedStatus = 'withdrawn';
          candidate.onboarding.isEnrolled = false;
        }
      }
    }

    try {
      const res = await admissionApi.reviewWithdrawal(id, { status, note: notes || (status === 'approved' ? 'Disetujui Panitia PMB' : 'Ditolak') });
      await fetchWithdrawals();
      return res.data;
    } catch (err) {
      console.warn('Admission API Notice (reviewWithdrawal fallback to local):', err?.message);
      return { success: true, localOnly: true };
    }
  };

  const fetchRefundReviews = async () => {
    try {
      const res = await financeApi.getRefundReviews();
      if (res.data?.data && res.data.data.length > 0) {
        refundReviews.value = res.data.data;
      }
    } catch (e) {
      console.warn('Gagal memuat antrean refund review dari backend (menggunakan data lokal):', e?.message);
    }
  };

  const updateRefundReview = async (id, status, approvedAmount = 0, proofRef = '', notes = '') => {
    const item = refundReviews.value.find((r) => r.id === id);
    if (item) {
      item.status = status;
      item.approvedAmount = approvedAmount;
      item.proofReference = proofRef;
      item.processedAt = new Date().toLocaleDateString('id-ID');
      item.notes = notes;

      // Sinkronisasi status keuangan kandidat
      if (status === 'approved') {
        const candidate = applicants.value.find((a) => a.id === item.regNo);
        if (candidate && candidate.payments?.uktFee) {
          candidate.payments.uktFee.statusLabel = 'Dana Dikembalikan (Refund Disetujui)';
        }
      }
    }

    try {
      const res = await financeApi.updateRefundReview(id, {
        status,
        approved_amount: approvedAmount,
        proof_reference: proofRef,
        notes,
      });
      return res.data;
    } catch (err) {
      console.warn('Finance API Notice (updateRefundReview fallback to local):', err?.message);
      return { success: true, localOnly: true };
    }
  };

  const fetchInstallmentRequests = async () => {
    try {
      const res = await financeApi.getInstallmentRequests();
      if (res.data?.data && res.data.data.length > 0) {
        installmentRequests.value = res.data.data;
      }
    } catch (e) {
      console.warn('Gagal memuat permohonan cicilan dari backend (menggunakan data lokal):', e?.message);
    }
  };

  const reviewInstallmentRequest = async (id, status, notes = '') => {
    const item = installmentRequests.value.find((i) => i.id === id);
    if (item) {
      item.status = status;
      item.reviewedAt = new Date().toLocaleDateString('id-ID');
      item.notes = notes;

      // Sinkronisasi metode cicilan kandidat
      if (status === 'approved') {
        const candidate = applicants.value.find((a) => a.id === item.regNo);
        if (candidate && candidate.payments?.uktFee) {
          candidate.payments.uktFee.method = `Cicilan UKT ${item.numTerms}x Termin`;
        }
      }
    }

    try {
      const res = await financeApi.reviewInstallmentRequest(id, { status, notes });
      return res.data;
    } catch (err) {
      console.warn('Finance API Notice (reviewInstallmentRequest fallback to local):', err?.message);
      return { success: true, localOnly: true };
    }
  };

  // Action: Reset admin data ke seed lokal resmi yang utuh dan konsisten
  const resetAdminData = () => {
    applicants.value = JSON.parse(JSON.stringify(OFFICIAL_CANDIDATE_SEEDS));
    pathChanges.value = JSON.parse(JSON.stringify(OFFICIAL_PATH_CHANGE_SEEDS));
    withdrawals.value = JSON.parse(JSON.stringify(OFFICIAL_WITHDRAWAL_SEEDS));
    refundReviews.value = JSON.parse(JSON.stringify(OFFICIAL_REFUND_SEEDS));
    installmentRequests.value = JSON.parse(JSON.stringify(OFFICIAL_INSTALLMENT_SEEDS));
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PATH_CHANGES_KEY);
    localStorage.removeItem(WITHDRAWALS_KEY);
    localStorage.removeItem(REFUNDS_KEY);
    localStorage.removeItem(INSTALLMENTS_KEY);
    syncCurrentApplicant();
  };

  return {
    applicants,
    totalApplicants,
    pendingDocCount,
    pendingPathChangeCount,
    pendingWithdrawalCount,
    pendingVerificationCount,
    totalPaidRevenue,
    passedStudentsCount,
    isLoadingBackend,
    backendSyncError,
    lastSyncTime,
    pathChanges,
    withdrawals,
    refundReviews,
    installmentRequests,
    fetchBackendApplicants,
    fetchPathChanges,
    reviewPathChange,
    fetchWithdrawals,
    reviewWithdrawal,
    fetchRefundReviews,
    updateRefundReview,
    fetchInstallmentRequests,
    reviewInstallmentRequest,
    verifyDocument,
    confirmPayment,
    updateInterview,
    generateNim,
    autoGenerateNimForApplicant,
    syncAutoEnrollAllEligible,
    syncCurrentApplicant,
    syncAllLocalApplicants,
    resetAdminData,
  };
});
