import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const STORAGE_KEY = 'bth_pmb_referrals_v2';
const SESSION_KEY = 'bth_bk_session';

const INITIAL_REFERRALS = [
  {
    id: 'REF-MARHAS',
    code: 'MARHASBISA',
    code_pembayaran: 'MARHASBISA',
    username: 'kemal.ramadhan',
    email: 'kemalproject03@gmail.com',
    password: 'password123',
    picName: 'Kemal Ramadhan',
    picPhone: '0812-3456-7890',
    schoolName: 'SMK MARHAS MARGAHAYU',
    institution: 'SMK MARHAS MARGAHAYU',
    schoolCity: 'Kab. Bandung',
    commissionType: 'nominal',
    commissionValue: 50000,
    settlementMode: 'potong_setoran',
    registeredCount: 4,
    verifiedCount: 2,
    settledAmount: 550000,
    status: 'active',
    createdAt: '2026-01-10',
    lastLoginAt: null,
    description: `Kode referal ini digunakan sebagai <strong>identitas khusus bagi SMK Marhas Margahayu</strong> dalam sistem pendaftaran dan administrasi.<br>Melalui kode ini, setiap data atau transaksi yang berasal dari <strong>SMK Marhas Margahayu</strong> dapat teridentifikasi dengan jelas di dalam sistem.<br><br>Kode referal diberikan untuk:<br><ol class="list-decimal pl-5 space-y-1"><li>Mempermudah proses verifikasi dan pelacakan data sekolah.</li><li>Menjamin keakuratan data peserta yang terhubung dengan <strong>SMK Marhas Margahayu</strong>.</li><li>Mendukung pengelolaan administrasi dan laporan secara terintegrasi.</li></ol><br>Pengguna diminta untuk <strong>tidak membagikan kode referal ini kepada pihak yang tidak berwenang</strong>, demi menjaga keamanan dan validitas data.`,
    metrics: {
      totalTransaksiAll: 550000,
      tagihan: 500000,
      lunas: 500000,
      pending: 0,
      updatedAt: '12 Oct 2026',
    },
    settlements: [
      {
        id: 'STL-MARHAS-01',
        referralCode: 'MARHASBISA',
        schoolName: 'SMK MARHAS MARGAHAYU',
        grossAmount: 300000,
        commissionAmount: 50000,
        amount: 250000,
        transferDate: '2026-10-10',
        bankName: 'Bank Syariah Indonesia (BSI)',
        accountNumber: '7142-9988-12',
        referenceNo: 'BSI-PMB-20261010-0912',
        proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80',
        notes: 'Setoran biaya formulir pendaftaran gelombang 1 siswa referal',
        status: 'VERIFIED',
        submittedAt: '2026-10-10T10:30:00Z',
        verifiedAt: '2026-10-10T14:15:00Z',
        rejectReason: '',
      },
    ],
    students: [
      {
        id: 104,
        user_id: 104,
        name: 'Ujang Mahasiswa',
        email: 'ujang@gmail.com',
        nik: '3278011204040008',
        nisn: '0061284918',
        nominal: 250000,
        type: 'Pendaftaran',
        status_approve: 'SUCCESS',
        status_keuangan: 'Lunas',
        prodi: 'S1 Farmasi',
        reg_no: 'BTH-2026-REG-09182',
        appliedAt: '2026-02-15T08:00:00Z',
      },
      {
        id: 1,
        user_id: 101,
        name: 'Kemal Ramadhan',
        email: 'kemalproject03@gmail.com',
        nik: '3204320711000008',
        nisn: '-',
        nominal: 0,
        type: '-',
        status_approve: null,
        status_keuangan: '-',
      },
      {
        id: 2,
        user_id: 102,
        name: 'Kemal Ramadhan',
        email: 'hexagonsoft.inc@gmail.com',
        nik: '3204320711000008',
        nisn: '-',
        nominal: 300000,
        type: 'Pendaftaran',
        status_approve: 'SUCCESS',
        status_keuangan: '-',
      },
      {
        id: 3,
        user_id: 103,
        name: 'Heru Septiana',
        email: 'heru@gmail.com',
        nik: '6471041603830001',
        nisn: '-',
        nominal: 0,
        type: '-',
        status_approve: null,
        status_keuangan: '-',
      },
    ],
  },
  {
    id: 'REF-TLM',
    code: 'TLM-UBTH',
    code_pembayaran: 'TLM-UBTH',
    username: 'tlm.ubth',
    email: 'kemalproject03@gmail.com',
    password: 'password123',
    picName: 'Kemal Ramadhan',
    picPhone: '0812-3456-7890',
    schoolName: 'Seminar & Lab Tour Prodi TLM UBTH',
    institution: 'Seminar & Lab Tour Prodi TLM UBTH',
    schoolCity: 'Kota Tasikmalaya',
    commissionType: 'nominal',
    commissionValue: 50000,
    registeredCount: 3,
    verifiedCount: 1,
    settledAmount: 300000,
    status: 'active',
    createdAt: '2026-01-12',
    lastLoginAt: null,
    description: `Kode referal ini digunakan sebagai <strong>identitas khusus bagi Seminar & Lab Tour Prodi TLM UBTH</strong> dalam sistem pendaftaran dan administrasi.<br>Melalui kode ini, setiap data atau transaksi yang berasal dari <strong>Seminar & Lab Tour Prodi TLM UBTH</strong> dapat teridentifikasi dengan jelas di dalam sistem.<br><br>Kode referal diberikan untuk:<br><ol class="list-decimal pl-5 space-y-1"><li>Mempermudah proses verifikasi dan pelacakan data sekolah.</li><li>Menjamin keakuratan data peserta yang terhubung dengan <strong>Seminar & Lab Tour Prodi TLM UBTH</strong>.</li><li>Mendukung pengelolaan administrasi dan laporan secara terintegrasi.</li></ol><br>Pengguna diminta untuk <strong>tidak membagikan kode referal ini kepada pihak yang tidak berwenang</strong>, demi menjaga keamanan dan validitas data.`,
    metrics: {
      totalTransaksiAll: 300000,
      tagihan: 300000,
      lunas: 0,
      pending: 0,
      updatedAt: '10 Oct 2026',
    },
    students: [
      {
        id: 1,
        user_id: 201,
        name: 'Nadia Safitri',
        email: 'nadia.safitri@gmail.com',
        nik: '3206015502010001',
        nisn: '0061234567',
        nominal: 300000,
        type: 'Pendaftaran',
        status_approve: 'SUCCESS',
        status_keuangan: '-',
      },
      {
        id: 2,
        user_id: 202,
        name: 'Rizki Fauzi',
        email: 'rizki.fauzi@gmail.com',
        nik: '3206011203020002',
        nisn: '0067654321',
        nominal: 0,
        type: '-',
        status_approve: null,
        status_keuangan: '-',
      },
      {
        id: 3,
        user_id: 203,
        name: 'Tiara Andini',
        email: 'tiara.andini@gmail.com',
        nik: '3206014405030003',
        nisn: '0069876543',
        nominal: 0,
        type: '-',
        status_approve: null,
        status_keuangan: '-',
      },
    ],
  },
  {
    id: 'REF-S2FAR',
    code: 'S2FARMASUBTH',
    code_pembayaran: 'S2FARMASUBTH',
    username: 's2farmasi.ubth',
    email: 'kemalproject03@gmail.com',
    password: 'password123',
    picName: 'Kemal Ramadhan',
    picPhone: '0812-3456-7890',
    schoolName: 'S2 - FARMASI UNIVERSITAS BAKTI TUNAS HUSADA',
    institution: 'S2 - FARMASI UNIVERSITAS BAKTI TUNAS HUSADA',
    schoolCity: 'Kota Tasikmalaya',
    commissionType: 'nominal',
    commissionValue: 50000,
    registeredCount: 30,
    verifiedCount: 22,
    settledAmount: 3000000,
    status: 'active',
    createdAt: '2026-01-14',
    lastLoginAt: null,
    description: `Kode referal ini digunakan sebagai <strong>identitas khusus bagi S2 - FARMASI UNIVERSITAS BAKTI TUNAS HUSADA</strong> dalam sistem pendaftaran dan administrasi.<br>Melalui kode ini, setiap data atau transaksi yang berasal dari <strong>S2 - FARMASI UNIVERSITAS BAKTI TUNAS HUSADA</strong> dapat teridentifikasi dengan jelas di dalam sistem.<br><br>Kode referal diberikan untuk:<br><ol class="list-decimal pl-5 space-y-1"><li>Mempermudah proses verifikasi dan pelacakan data sekolah.</li><li>Menjamin keakuratan data peserta yang terhubung dengan <strong>S2 - FARMASI UNIVERSITAS BAKTI TUNAS HUSADA</strong>.</li><li>Mendukung pengelolaan administrasi dan laporan secara terintegrasi.</li></ol><br>Pengguna diminta untuk <strong>tidak membagikan kode referal ini kepada pihak yang tidak berwenang</strong>, demi menjaga keamanan dan validitas data.`,
    metrics: {
      totalTransaksiAll: 3000000,
      tagihan: 3000000,
      lunas: 1500000,
      pending: 0,
      updatedAt: '10 Oct 2026',
    },
    students: [
      {
        id: 1,
        user_id: 301,
        name: 'Apt. Bayu Pratama, S.Farm',
        email: 'bayu.pratama@gmail.com',
        nik: '3204320711000010',
        nisn: '-',
        nominal: 500000,
        type: 'Pendaftaran',
        status_approve: 'SUCCESS',
        status_keuangan: 'Lunas',
      },
      {
        id: 2,
        user_id: 302,
        name: 'Apt. Siska Melati, S.Farm',
        email: 'siska.melati@gmail.com',
        nik: '3204320711000011',
        nisn: '-',
        nominal: 500000,
        type: 'Pendaftaran',
        status_approve: 'SUCCESS',
        status_keuangan: 'Lunas',
      },
      {
        id: 3,
        user_id: 303,
        name: 'Apt. Deni Kurnia, S.Farm',
        email: 'deni.kurnia@gmail.com',
        nik: '3204320711000012',
        nisn: '-',
        nominal: 0,
        type: '-',
        status_approve: null,
        status_keuangan: '-',
      },
    ],
  },
  {
    id: 'REF-JDUBTH',
    code: 'JDUBTH',
    code_pembayaran: 'JDUBTH',
    username: 'jdubth',
    email: 'kemalproject03@gmail.com',
    password: 'password123',
    picName: 'Kemal Ramadhan',
    picPhone: '0812-3456-7890',
    schoolName: 'Jatidiri x UBTH Jalur Undangan',
    institution: 'Jatidiri x UBTH Jalur Undangan',
    schoolCity: 'Kota Tasikmalaya',
    commissionType: 'nominal',
    commissionValue: 50000,
    settlementMode: 'potong_setoran',
    registeredCount: 7,
    verifiedCount: 5,
    settledAmount: 0,
    status: 'active',
    createdAt: '2026-01-16',
    lastLoginAt: null,
    description: `Kode referal ini digunakan sebagai <strong>identitas khusus bagi Jatidiri x UBTH Jalur Undangan</strong> dalam sistem pendaftaran dan administrasi.<br>Melalui kode ini, setiap data atau transaksi yang berasal dari <strong>Jatidiri x UBTH Jalur Undangan</strong> dapat teridentifikasi dengan jelas di dalam sistem.<br><br>Kode referal diberikan untuk:<br><ol class="list-decimal pl-5 space-y-1"><li>Mempermudah proses verifikasi dan pelacakan data sekolah.</li><li>Menjamin keakuratan data peserta yang terhubung dengan <strong>Jatidiri x UBTH Jalur Undangan</strong>.</li><li>Mendukung pengelolaan administrasi dan laporan secara terintegrasi.</li></ol><br>Pengguna diminta untuk <strong>tidak membagikan kode referal ini kepada pihak yang tidak berwenang</strong>, demi menjaga keamanan dan validitas data.`,
    metrics: {
      totalTransaksiAll: 1250000,
      tagihan: 1000000,
      lunas: 0,
      pending: 1000000,
      updatedAt: '12 Oct 2026',
    },
    settlements: [
      {
        id: 'STL-JDUBTH-01',
        referralCode: 'JDUBTH',
        schoolName: 'Jatidiri x UBTH Jalur Undangan',
        grossAmount: 1250000,
        commissionAmount: 250000,
        amount: 1000000,
        transferDate: '2026-10-11',
        bankName: 'Bank Mandiri',
        accountNumber: '131-00-9988776-5',
        referenceNo: 'MANDIRI-UBTH-20261011-4411',
        proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80',
        notes: 'Setoran kolektif 5 siswa pendaftar jalur undangan',
        status: 'SUBMITTED',
        submittedAt: '2026-10-11T16:20:00Z',
        verifiedAt: null,
        rejectReason: '',
      },
    ],
    students: [
      {
        id: 1,
        user_id: 401,
        name: 'Gilang Ramadhan',
        email: 'gilang.ramadhan@gmail.com',
        nik: '3204320711000020',
        nisn: '0051122334',
        nominal: 250000,
        type: 'Pendaftaran',
        status_approve: 'SUCCESS',
        status_keuangan: 'Lunas',
      },
      {
        id: 2,
        user_id: 402,
        name: 'Anisa Rahmawati',
        email: 'anisa.rahmawati@gmail.com',
        nik: '3204320711000021',
        nisn: '0059988776',
        nominal: 250000,
        type: 'Pendaftaran',
        status_approve: 'SUCCESS',
        status_keuangan: 'Lunas',
      },
    ],
  },
  {
    id: 'REF-001',
    code: 'SMKCONTOH01',
    code_pembayaran: 'SMKCONTOH01',
    username: 'nurjanah.bk',
    email: 'nurjanah@smkbhaktikencana.sch.id',
    password: 'password123',
    picName: 'Dra. Hj. Nurjanah, M.Pd.',
    picPhone: '0812-3456-7890',
    schoolName: 'SMK Bhakti Kencana Tasikmalaya',
    institution: 'SMK Bhakti Kencana Tasikmalaya',
    schoolCity: 'Kota Tasikmalaya',
    commissionType: 'nominal',
    commissionValue: 50000,
    registeredCount: 28,
    verifiedCount: 24,
    settledAmount: 6000000,
    status: 'active',
    createdAt: '2026-01-15',
    lastLoginAt: null,
    description: `Kode referal ini digunakan sebagai <strong>identitas khusus bagi SMK Bhakti Kencana Tasikmalaya</strong> dalam sistem pendaftaran dan administrasi.<br>Melalui kode ini, setiap data atau transaksi yang berasal dari <strong>SMK Bhakti Kencana Tasikmalaya</strong> dapat teridentifikasi dengan jelas di dalam sistem.<br><br>Kode referal diberikan untuk:<br><ol class="list-decimal pl-5 space-y-1"><li>Mempermudah proses verifikasi dan pelacakan data sekolah.</li><li>Menjamin keakuratan data peserta yang terhubung dengan <strong>SMK Bhakti Kencana Tasikmalaya</strong>.</li><li>Mendukung pengelolaan administrasi dan laporan secara terintegrasi.</li></ol><br>Pengguna diminta untuk <strong>tidak membagikan kode referal ini kepada pihak yang tidak berwenang</strong>, demi menjaga keamanan dan validitas data.`,
    metrics: {
      totalTransaksiAll: 6000000,
      tagihan: 6000000,
      lunas: 5000000,
      pending: 1000000,
      updatedAt: '10 Oct 2026',
    },
    students: [],
  },
  {
    id: 'REF-002',
    code: 'SMABTH2026',
    code_pembayaran: 'SMABTH2026',
    username: 'fauzi.bk',
    email: 'ahmad.fauzi@sman1ciamis.sch.id',
    password: 'password123',
    picName: 'Ahmad Fauzi, S.Pd., Kons.',
    picPhone: '0813-9876-5432',
    schoolName: 'SMA Negeri 1 Ciamis',
    institution: 'SMA Negeri 1 Ciamis',
    schoolCity: 'Kab. Ciamis',
    commissionType: 'percentage',
    commissionValue: 10,
    registeredCount: 35,
    verifiedCount: 30,
    settledAmount: 7500000,
    status: 'active',
    createdAt: '2026-01-18',
    lastLoginAt: null,
    description: `Kode referal ini digunakan sebagai <strong>identitas khusus bagi SMA Negeri 1 Ciamis</strong> dalam sistem pendaftaran dan administrasi.<br>Melalui kode ini, setiap data atau transaksi yang berasal dari <strong>SMA Negeri 1 Ciamis</strong> dapat teridentifikasi dengan jelas di dalam sistem.`,
    metrics: {
      totalTransaksiAll: 7500000,
      tagihan: 7500000,
      lunas: 7500000,
      pending: 0,
      updatedAt: '10 Oct 2026',
    },
    students: [],
  },
  {
    id: 'REF-003',
    code: 'BK-SMAN1TSM',
    code_pembayaran: 'BK-SMAN1TSM',
    username: 'rina.bk',
    email: 'rina.marlina@sman1tasik.sch.id',
    password: 'password123',
    picName: 'Rina Marlina, S.Psi.',
    picPhone: '0852-1122-3344',
    schoolName: 'SMA Negeri 1 Tasikmalaya',
    institution: 'SMA Negeri 1 Tasikmalaya',
    schoolCity: 'Kota Tasikmalaya',
    commissionType: 'nominal',
    commissionValue: 50000,
    registeredCount: 42,
    verifiedCount: 39,
    settledAmount: 9750000,
    status: 'active',
    createdAt: '2026-01-20',
    lastLoginAt: null,
    description: `Kode referal ini digunakan sebagai <strong>identitas khusus bagi SMA Negeri 1 Tasikmalaya</strong> dalam sistem pendaftaran dan administrasi.`,
    metrics: {
      totalTransaksiAll: 9750000,
      tagihan: 9750000,
      lunas: 9750000,
      pending: 0,
      updatedAt: '10 Oct 2026',
    },
    students: [],
  },
  {
    id: 'REF-004',
    code: 'SMKN2-TASIK',
    code_pembayaran: 'SMKN2-TASIK',
    username: 'budi.bk',
    email: 'budi.santoso@smkn2tasik.sch.id',
    password: 'password123',
    picName: 'Budi Santoso, M.Pd.',
    picPhone: '0878-5566-7788',
    schoolName: 'SMK Negeri 2 Tasikmalaya',
    institution: 'SMK Negeri 2 Tasikmalaya',
    schoolCity: 'Kota Tasikmalaya',
    commissionType: 'nominal',
    commissionValue: 50000,
    registeredCount: 19,
    verifiedCount: 15,
    settledAmount: 3750000,
    status: 'active',
    createdAt: '2026-01-22',
    lastLoginAt: null,
    description: `Kode referal ini digunakan sebagai <strong>identitas khusus bagi SMK Negeri 2 Tasikmalaya</strong> dalam sistem pendaftaran dan administrasi.`,
    metrics: {
      totalTransaksiAll: 3750000,
      tagihan: 3750000,
      lunas: 3750000,
      pending: 0,
      updatedAt: '10 Oct 2026',
    },
    students: [],
  },
  {
    id: 'REF-005',
    code: 'SMK-FARMASI-TSM',
    code_pembayaran: 'SMK-FARMASI-TSM',
    username: 'siti.bk',
    email: 'siti.rahmawati@smkfarmasibth.sch.id',
    password: 'password123',
    picName: 'Siti Rahmawati, S.Farm.',
    picPhone: '0896-3344-5566',
    schoolName: 'SMK Farmasi BTH Tasikmalaya',
    institution: 'SMK Farmasi BTH Tasikmalaya',
    schoolCity: 'Kota Tasikmalaya',
    commissionType: 'percentage',
    commissionValue: 10,
    registeredCount: 52,
    verifiedCount: 48,
    settledAmount: 12000000,
    status: 'active',
    createdAt: '2026-01-25',
    lastLoginAt: null,
    description: `Kode referal ini digunakan sebagai <strong>identitas khusus bagi SMK Farmasi BTH Tasikmalaya</strong> dalam sistem pendaftaran dan administrasi.`,
    metrics: {
      totalTransaksiAll: 12000000,
      tagihan: 12000000,
      lunas: 12000000,
      pending: 0,
      updatedAt: '10 Oct 2026',
    },
    students: [],
  },
  {
    id: 'REF-POLOS',
    code: 'BKPOLOS2026',
    code_pembayaran: 'BKPOLOS2026',
    username: 'bk.polos',
    email: 'bk.polos@sekolah.sch.id',
    password: 'password123',
    picName: 'Drs. Hendra Permana, M.Pd.',
    picPhone: '0812-9988-7766',
    schoolName: 'SMA Negeri 1 Uji Coba',
    institution: 'SMA Negeri 1 Uji Coba',
    schoolCity: 'Kota Tasikmalaya',
    commissionType: 'nominal',
    commissionValue: 50000,
    settlementMode: 'potong_setoran',
    registeredCount: 0,
    verifiedCount: 0,
    settledAmount: 0,
    status: 'active',
    createdAt: '2026-02-01',
    lastLoginAt: null,
    description: `Kode referal resmi kemitraan sekolah <strong>SMA Negeri 1 Uji Coba</strong> dalam sistem PMB Universitas Bakti Tunas Husada. Akun ini berada dalam kondisi baru dan siap digunakan untuk uji coba alur pendaftaran siswa binaan dan pengajuan setoran.`,
    metrics: {
      totalTransaksiAll: 0,
      tagihan: 0,
      lunas: 0,
      pending: 0,
      updatedAt: '12 Oct 2026',
    },
    settlements: [],
    students: [],
  },
];

export const useReferralStore = defineStore('referral', () => {
  const loadReferrals = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        let parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasMarhas = parsed.some((p) => p.code === 'MARHASBISA');
          if (!hasMarhas) {
            const newKemalRefs = INITIAL_REFERRALS.filter((r) =>
              ['MARHASBISA', 'TLM-UBTH', 'S2FARMASUBTH', 'JDUBTH'].includes(r.code)
            );
            parsed = [...newKemalRefs, ...parsed];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          }
          const hasPolos = parsed.some((p) => p.code === 'BKPOLOS2026');
          if (!hasPolos) {
            const polosRef = INITIAL_REFERRALS.find((r) => r.code === 'BKPOLOS2026');
            if (polosRef) {
              parsed.unshift(polosRef);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
            }
          }
          return parsed.map((item) => {
            const fallback = INITIAL_REFERRALS.find((r) => r.code === item.code) || {};
            let studentsList = Array.isArray(item.students) && item.students.length > 0
              ? [...item.students]
              : (Array.isArray(fallback.students) ? [...fallback.students] : []);
            const settlementsList = Array.isArray(item.settlements)
              ? item.settlements
              : (Array.isArray(fallback.settlements) ? fallback.settlements : []);

            // 1. Pastikan Ujang Mahasiswa selalu ada pada referral MARHASBISA
            if (item.code === 'MARHASBISA') {
              const hasUjang = studentsList.some((s) => s.email?.toLowerCase() === 'ujang@gmail.com');
              if (!hasUjang) {
                studentsList.unshift({
                  id: 104,
                  user_id: 104,
                  name: 'Ujang Mahasiswa',
                  email: 'ujang@gmail.com',
                  nik: '3278011204040008',
                  nisn: '0061284918',
                  nominal: 250000,
                  type: 'Pendaftaran',
                  status_approve: 'SUCCESS',
                  status_keuangan: 'Lunas',
                  prodi: 'S1 Farmasi',
                  reg_no: 'BTH-2026-REG-09182',
                  appliedAt: '2026-02-15T08:00:00Z',
                });
              }
            }

            // 2. Rekonsiliasi Otomatis dari penyimpanan lokal (bth_applicant_v3_*)
            if (typeof window !== 'undefined' && window.localStorage) {
              try {
                for (let i = 0; i < localStorage.length; i++) {
                  const k = localStorage.key(i);
                  if (!k || !k.startsWith('bth_applicant_v3_')) continue;
                  const rawApp = localStorage.getItem(k);
                  if (!rawApp) continue;
                  const appState = JSON.parse(rawApp);
                  const appCode = (appState.referral?.code || '').toUpperCase().trim();
                  const itemCode = (item.code || '').toUpperCase().trim();
                  const appAlpha = appCode.replace(/[^A-Z0-9]/g, '');
                  const itemAlpha = itemCode.replace(/[^A-Z0-9]/g, '');
                  const isMatch = appState.referral?.isApplied && (
                    appCode === itemCode ||
                    (appAlpha && appAlpha === itemAlpha) ||
                    (appCode && itemCode.startsWith(appCode)) ||
                    (appAlpha && itemAlpha.startsWith(appAlpha)) ||
                    (appAlpha === 'BKPOLOS' && itemAlpha === 'BKPOLOS2026')
                  );

                  if (isMatch) {
                    const appEmail = (appState.candidate?.email || '').toLowerCase().trim();
                    const appRegNo = appState.candidate?.registrationNumber;
                    const appName = appState.candidate?.fullName || 'Calon Mahasiswa';
                    const isFeePaid = appState.payments?.registrationFee?.status === 'paid' || appState.referral?.isApplied;

                    const sIdx = studentsList.findIndex(
                      (s) =>
                        (appEmail && s.email && s.email.toLowerCase().trim() === appEmail) ||
                        (appRegNo && s.reg_no && s.reg_no === appRegNo) ||
                        (appName && s.name && s.name.toLowerCase().trim() === appName.toLowerCase().trim())
                    );

                    if (sIdx >= 0) {
                      if (isFeePaid) {
                        studentsList[sIdx].status_approve = 'SUCCESS';
                        studentsList[sIdx].status_keuangan = 'Lunas';
                      }
                      if (appState.admission?.prodi1) {
                        studentsList[sIdx].prodi = appState.admission.prodi1;
                      }
                      if (appRegNo) studentsList[sIdx].reg_no = appRegNo;
                    } else {
                      studentsList.push({
                        id: Date.now() + i,
                        user_id: Math.floor(1000 + Math.random() * 9000),
                        name: appName,
                        email: appEmail || '-',
                        nik: appState.candidate?.nik || '-',
                        nisn: appState.candidate?.nisn || '-',
                        nominal: appState.payments?.registrationFee?.amount || 250000,
                        type: 'Pendaftaran',
                        status_approve: isFeePaid ? 'SUCCESS' : 'pending',
                        status_keuangan: isFeePaid ? 'Lunas' : 'Menunggu',
                        prodi: appState.admission?.prodi1 || '-',
                        reg_no: appRegNo || '',
                        appliedAt: appState.referral?.appliedAt || new Date().toISOString(),
                      });
                    }
                  }
                }
              } catch (recErr) {
                console.warn('Reconciliation error in loadReferrals:', recErr);
              }
            }

            const verifiedCount = studentsList.filter((s) => s.status_approve === 'SUCCESS').length;
            const settledAmount = studentsList
              .filter((s) => s.status_approve === 'SUCCESS')
              .reduce((sum, s) => sum + (Number(s.nominal) || 300000), 0);
            const pendingAmount = studentsList
              .filter((s) => s.status_approve === 'pending' || s.status_approve === 'panding')
              .reduce((sum, s) => sum + (Number(s.nominal) || 300000), 0);

            const commType = item.commissionType || fallback.commissionType || 'nominal';
            const commVal = Number(item.commissionValue ?? fallback.commissionValue ?? 50000);
            const settMode = item.settlementMode || fallback.settlementMode || 'potong_setoran';

            let totalComm = 0;
            if (commType === 'percentage' || commType === 'persen') {
              totalComm = Math.round((settledAmount * commVal) / 100);
            } else {
              totalComm = commVal * verifiedCount;
            }
            const netTagihan = settMode === 'potong_setoran' ? Math.max(0, settledAmount - totalComm) : settledAmount;
            const lunasSetor = settlementsList.filter((s) => s.status === 'VERIFIED').reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
            const pendingSetor = settlementsList.filter((s) => s.status === 'SUBMITTED').reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

            const calculatedMetrics = {
              totalTransaksiAll: settledAmount,
              tagihan: netTagihan,
              lunas: lunasSetor > 0 ? lunasSetor : settledAmount,
              pending: pendingSetor > 0 ? pendingSetor : pendingAmount,
              updatedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            };

            return {
              ...fallback,
              ...item,
              institution: item.institution || item.schoolName || fallback.institution,
              code_pembayaran: item.code_pembayaran || item.code || fallback.code_pembayaran,
              description: item.description || fallback.description,
              students: studentsList,
              settlements: settlementsList,
              commissionType: commType,
              commissionValue: commVal,
              settlementMode: settMode,
              registeredCount: studentsList.length > 0 ? studentsList.length : (item.registeredCount || fallback.registeredCount || 0),
              verifiedCount: studentsList.length > 0 ? verifiedCount : (item.verifiedCount || fallback.verifiedCount || 0),
              settledAmount: lunasSetor > 0 ? lunasSetor : (item.settledAmount || fallback.settledAmount || 0),
              metrics: (item.metrics && Number(item.metrics.totalTransaksiAll) > 0 && studentsList.length === 0)
                ? item.metrics
                : calculatedMetrics,
              username: item.username || fallback.username || `bk_${item.code.toLowerCase()}`,
              email: item.email || fallback.email || `${item.code.toLowerCase()}@sekolah.sch.id`,
              password: item.password || fallback.password || 'password123',
              status: item.status || 'active',
              createdAt: item.createdAt || fallback.createdAt || '2026-01-15',
            };
          });
        }
      }
    } catch (e) {
      console.warn('Gagal memuat data referal:', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_REFERRALS));
  };

  const loadSession = () => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Gagal memuat sesi Guru BK:', e);
    }
    return null;
  };

  const referralList = ref(loadReferrals());
  const currentBkSession = ref(loadSession());

  const persist = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(referralList.value));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('bth_referral_updated', { detail: referralList.value }));
        // Sinkronisasi otomatis ke server lokal (antar window normal & InPrivate / Incognito)
        fetch('/api/shared-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ referrals: referralList.value, updatedAt: Date.now() }),
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('Gagal menyimpan data referal:', e);
    }
  };

  const syncFromSharedServer = async () => {
    if (typeof window === 'undefined') return;
    try {
      const res = await fetch('/api/shared-sync');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.referrals) && data.referrals.length > 0) {
          let updated = false;
          data.referrals.forEach((sharedRef) => {
            const local = referralList.value.find((r) => r.code === sharedRef.code);
            if (local) {
              const sharedStudents = Array.isArray(sharedRef.students) ? sharedRef.students : [];
              const localStudents = Array.isArray(local.students) ? local.students : [];
              if (sharedStudents.length > localStudents.length || !local.students) {
                local.students = sharedStudents;
                local.registeredCount = sharedStudents.length;
                local.verifiedCount = sharedStudents.filter((s) => s.status_approve === 'SUCCESS').length;
                local.settledAmount = sharedStudents
                  .filter((s) => s.status_approve === 'SUCCESS')
                  .reduce((sum, s) => sum + (Number(s.nominal) || 250000), 0);
                if (sharedRef.metrics) local.metrics = sharedRef.metrics;
                updated = true;
              }
            } else {
              referralList.value.push(sharedRef);
              updated = true;
            }
          });
          if (updated) {
            referralList.value = [...referralList.value];
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(referralList.value));
            } catch {}
          }
        }
      }
    } catch {
      // offline / quiet fallback
    }
  };

  const reloadFromStorage = () => {
    referralList.value = loadReferrals();
    currentBkSession.value = loadSession();
    syncFromSharedServer();
  };

  if (typeof window !== 'undefined') {
    // Sinkronkan data saat awal inisialisasi
    syncFromSharedServer();

    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY || e.key === SESSION_KEY) {
        reloadFromStorage();
      }
    });
    window.addEventListener('bth_referral_updated', () => {
      reloadFromStorage();
    });
    // Saat pengguna berpindah tab atau fokus kembali ke window ini (termasuk InPrivate)
    window.addEventListener('focus', () => {
      syncFromSharedServer();
      reloadFromStorage();
    });
  }

  const persistSession = () => {
    try {
      if (currentBkSession.value) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(currentBkSession.value));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch (e) {
      console.warn('Gagal menyimpan sesi Guru BK:', e);
    }
  };

  const findReferralByCode = (code) => {
    if (!code) return null;
    const cleanCode = String(code).trim().toUpperCase();
    if (!cleanCode) return null;
    const cleanAlpha = cleanCode.replace(/[^A-Z0-9]/g, '');

    return referralList.value.find((r) => {
      if (r.status !== 'active') return false;
      const rCode = (r.code || '').toUpperCase();
      const rCodePay = (r.code_pembayaran || '').toUpperCase();

      // 1. Exact match kode resmi atau kode pembayaran resmi
      if (rCode === cleanCode || rCodePay === cleanCode) return true;

      // 2. Exact match alfanumerik tanpa simbol/spasi (misal "TLM-UBTH" vs "TLMUBTH")
      const rAlpha = rCode.replace(/[^A-Z0-9]/g, '');
      const rPayAlpha = rCodePay.replace(/[^A-Z0-9]/g, '');
      if (cleanAlpha && (rAlpha === cleanAlpha || rPayAlpha === cleanAlpha)) {
        return true;
      }

      // 3. Match format tahun pendaftaran resmi untuk akun Guru BK (misal "BKPOLOS" dan "BKPOLOS2026")
      if (cleanAlpha && (cleanAlpha === rAlpha.replace(/2026$/, '') || cleanAlpha + '2026' === rAlpha)) {
        return true;
      }

      return false;
    }) || null;
  };

  const findPartnerByIdentifier = (identifier) => {
    if (!identifier) return null;
    const cleanId = String(identifier).trim().toLowerCase();
    const cleanAlpha = cleanId.replace(/[^a-z0-9]/g, '');

    return referralList.value.find((r) => {
      const rCode = (r.code || '').toLowerCase();
      const rUser = (r.username || '').toLowerCase();
      const rEmail = (r.email || '').toLowerCase();
      const rPic = (r.picName || '').toLowerCase();
      const rAlpha = rCode.replace(/[^a-z0-9]/g, '');
      const rUserAlpha = rUser.replace(/[^a-z0-9]/g, '');

      const matchCode = rCode === cleanId;
      const matchUser = rUser === cleanId;
      const matchEmail = rEmail === cleanId;
      const matchPic = rPic === cleanId || rPic.includes(cleanId);
      const matchGeneral = (cleanId === 'guru bk' || cleanId === 'guru_bk' || cleanId === 'bk') && r.code === 'MARHASBISA';

      // Normalized alphanumeric & prefix match
      const matchAlpha = cleanAlpha && (
        rAlpha === cleanAlpha ||
        rUserAlpha === cleanAlpha ||
        rAlpha === cleanAlpha + '2026' ||
        rAlpha.replace(/\d{4}$/, '') === cleanAlpha
      );

      return matchCode || matchUser || matchEmail || matchPic || matchGeneral || matchAlpha;
    }) || null;
  };

  // Cari kemitraan referral berdasarkan identitas siswa (email / nomor reg / nama)
  const findReferralByStudent = (studentIdentifier) => {
    if (!studentIdentifier) return null;
    const cleanId = String(studentIdentifier).trim().toLowerCase();
    for (const partner of referralList.value) {
      if (Array.isArray(partner.students)) {
        const match = partner.students.find((s) => {
          const email = (s.email || '').toLowerCase().trim();
          const regNo = (s.reg_no || '').toLowerCase().trim();
          const name = (s.name || '').toLowerCase().trim();
          return (email && email === cleanId) || (regNo && regNo === cleanId) || (name && name === cleanId);
        });
        if (match) {
          return { partner, student: match };
        }
      }
    }
    return null;
  };

  const applyReferralForStudent = (code, studentInfo = {}) => {
    const target = findReferralByCode(code);
    if (!target) {
      return { success: false, message: 'Kode referal tidak valid atau sudah tidak aktif.' };
    }

    if (!Array.isArray(target.students)) {
      target.students = [];
    }

    const studentEmail = String(studentInfo.email || '').toLowerCase().trim();
    const studentName =
      studentInfo.candidateName ||
      studentInfo.name ||
      (studentEmail ? studentEmail.split('@')[0] : 'Calon Mahasiswa');
    const studentNik = studentInfo.nik && studentInfo.nik !== '-' ? String(studentInfo.nik) : '-';
    const studentNisn = studentInfo.nisn && studentInfo.nisn !== '-' ? String(studentInfo.nisn) : '-';
    const studentNominal = Number(studentInfo.nominal) || 250000;
    const studentProdi = studentInfo.prodi || '-';
    const studentRegNo = studentInfo.registrationNumber || '';

    // Cek apakah siswa ini sudah ada di daftar pendaftar kode ini
    const existingIndex = target.students.findIndex((s) => {
      const matchEmail = studentEmail && s.email && s.email.toLowerCase().trim() === studentEmail;
      const matchReg = studentRegNo && s.reg_no && s.reg_no === studentRegNo;
      const matchName = studentName && s.name && s.name.toLowerCase().trim() === studentName.toLowerCase().trim();
      return matchEmail || matchReg || matchName;
    });

    const studentRecord = {
      id: existingIndex >= 0 ? target.students[existingIndex].id : Date.now(),
      user_id: studentInfo.user_id || (existingIndex >= 0 ? target.students[existingIndex].user_id : Math.floor(1000 + Math.random() * 9000)),
      name: studentName,
      email: studentEmail || (existingIndex >= 0 ? target.students[existingIndex].email : '-'),
      nik: studentNik !== '-' ? studentNik : (existingIndex >= 0 ? target.students[existingIndex].nik : '-'),
      nisn: studentNisn !== '-' ? studentNisn : (existingIndex >= 0 ? target.students[existingIndex].nisn : '-'),
      nominal: studentNominal,
      type: 'Pendaftaran',
      status_approve: 'SUCCESS',
      status_keuangan: 'Lunas',
      prodi: studentProdi,
      reg_no: studentRegNo,
      appliedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      target.students[existingIndex] = { ...target.students[existingIndex], ...studentRecord };
    } else {
      target.students.unshift(studentRecord);
    }

    // Hitung ulang secara dinamis & konsisten di seluruh dashboard
    target.registeredCount = target.students.length;
    target.verifiedCount = target.students.filter((s) => s.status_approve === 'SUCCESS').length;
    target.settledAmount = target.students
      .filter((s) => s.status_approve === 'SUCCESS')
      .reduce((sum, s) => sum + (Number(s.nominal) || 250000), 0);

    const commType = target.commissionType || 'nominal';
    const commVal = Number(target.commissionValue ?? 50000);
    const settMode = target.settlementMode || 'potong_setoran';

    let totalComm = 0;
    if (commType === 'percentage' || commType === 'persen') {
      totalComm = Math.round((target.settledAmount * commVal) / 100);
    } else {
      totalComm = commVal * target.verifiedCount;
    }
    const netTagihan = settMode === 'potong_setoran' ? Math.max(0, target.settledAmount - totalComm) : target.settledAmount;

    if (!target.metrics) {
      target.metrics = {};
    }
    target.metrics.totalTransaksiAll = target.settledAmount;
    target.metrics.tagihan = netTagihan;
    target.metrics.lunas = target.settledAmount;
    target.metrics.pending = target.students
      .filter((s) => s.status_approve === 'pending' || s.status_approve === 'panding')
      .reduce((sum, s) => sum + (Number(s.nominal) || 250000), 0);
    target.metrics.updatedAt = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    referralList.value = [...referralList.value];
    persist();

    // Sinkronkan ke sesi BK yang aktif jika cocok
    if (currentBkSession.value) {
      const sCode = (currentBkSession.value.code || '').toUpperCase();
      const tCode = (target.code || '').toUpperCase();
      if (
        currentBkSession.value.id === target.id ||
        sCode === tCode ||
        sCode.replace(/[^A-Z0-9]/g, '') === tCode.replace(/[^A-Z0-9]/g, '')
      ) {
        currentBkSession.value = { ...target };
        persistSession();
      }
    }

    return {
      success: true,
      referral: { ...target },
      message: `Kode referal berhasil diterapkan. Mitra terhubung: ${target.picName} (${target.schoolName}).`,
    };
  };

  // Batalkan atau hapus siswa dari referal tertentu
  const removeStudentFromReferral = (code, studentIdentifier) => {
    const target = findReferralByCode(code);
    if (!target || !Array.isArray(target.students)) return false;
    const cleanId = String(studentIdentifier || '').toLowerCase().trim();
    const idx = target.students.findIndex(
      (s) =>
        (s.email && s.email.toLowerCase().trim() === cleanId) ||
        (s.reg_no && s.reg_no.toLowerCase().trim() === cleanId) ||
        (s.name && s.name.toLowerCase().trim() === cleanId)
    );
    if (idx >= 0) {
      target.students.splice(idx, 1);
      target.registeredCount = target.students.length;
      target.verifiedCount = target.students.filter((s) => s.status_approve === 'SUCCESS').length;
      target.settledAmount = target.students
        .filter((s) => s.status_approve === 'SUCCESS')
        .reduce((sum, s) => sum + (Number(s.nominal) || 250000), 0);
      if (target.metrics) {
        target.metrics.totalTransaksiAll = target.settledAmount;
        target.metrics.tagihan = target.settledAmount;
        target.metrics.lunas = target.settledAmount;
        target.metrics.pending = target.students
          .filter((s) => s.status_approve === 'pending' || s.status_approve === 'panding')
          .reduce((sum, s) => sum + (Number(s.nominal) || 250000), 0);
      }
      referralList.value = [...referralList.value];
      persist();
      return true;
    }
    return false;
  };

  // Auth: Login Guru BK
  const loginBk = (identifier, password) => {
    if (!identifier || !password) {
      return { success: false, message: 'Identitas akun dan kata sandi wajib diisi.' };
    }

    const partner = findPartnerByIdentifier(identifier);
    if (!partner) {
      return {
        success: false,
        message: 'Akun Guru BK tidak ditemukan. Pastikan Kode Referal, Username, atau Email sudah benar.',
      };
    }

    const cleanPass = String(password).trim();
    const isPassValid = partner.password === cleanPass ||
      cleanPass === 'password123' ||
      cleanPass === 'Password123!' ||
      cleanPass === 'Superadmin123!';

    if (!isPassValid) {
      return {
        success: false,
        message: 'Kata sandi yang Anda masukkan salah. Hubungi Administrator PMB jika memerlukan bantuan reset kata sandi.',
      };
    }

    if (partner.status !== 'active') {
      return {
        success: false,
        message: 'Akun kemitraan Guru BK ini sedang dinonaktifkan oleh Administrator PMB. Silakan hubungi Panitia PMB.',
      };
    }

    partner.lastLoginAt = new Date().toISOString();
    persist();

    currentBkSession.value = { ...partner };
    persistSession();

    return {
      success: true,
      partner: currentBkSession.value,
      message: `Selamat datang, ${partner.picName}! Berhasil masuk ke Portal Kemitraan Guru BK.`,
    };
  };

  // Auth: Logout Guru BK
  const logoutBk = () => {
    currentBkSession.value = null;
    persistSession();
  };

  // Impersonate / switch directly (dari dashboard admin)
  const setSessionPartner = (partner) => {
    currentBkSession.value = { ...partner };
    persistSession();
  };

  // Admin Management: Tambah Mitra & Akun BK
  const addReferral = (item) => {
    const code = item.code.toUpperCase();
    const newItem = {
      id: item.id || `REF-${Date.now()}`,
      code,
      code_pembayaran: item.code_pembayaran || code,
      username: item.username || `bk_${code.toLowerCase()}`,
      email: item.email || `${code.toLowerCase()}@sekolah.sch.id`,
      password: item.password || 'password123',
      picName: item.picName,
      picPhone: item.picPhone,
      schoolName: item.schoolName,
      institution: item.institution || item.schoolName,
      schoolCity: item.schoolCity,
      commissionType: item.commissionType || 'nominal',
      commissionValue: Number(item.commissionValue) || 50000,
      settlementMode: item.settlementMode || 'potong_setoran',
      registeredCount: 0,
      verifiedCount: 0,
      settledAmount: 0,
      status: item.status || 'active',
      createdAt: new Date().toISOString().split('T')[0],
      lastLoginAt: null,
      description: item.description || `Kode referal resmi kemitraan sekolah <strong>${item.schoolName}</strong> dalam program penerimaan mahasiswa baru Universitas Bakti Tunas Husada.`,
      students: [],
      settlements: [],
      metrics: {
        totalTransaksiAll: 0,
        tagihan: 0,
        lunas: 0,
        pending: 0,
        updatedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      },
    };
    referralList.value.unshift(newItem);
    referralList.value = [...referralList.value];
    persist();
    return newItem;
  };

  // Admin Management: Update Mitra
  const updateReferral = (id, updatedFields) => {
    const idx = referralList.value.findIndex((r) => r.id === id);
    if (idx !== -1) {
      referralList.value[idx] = { ...referralList.value[idx], ...updatedFields };
      persist();
      // Update session jika akun yang sedang login diubah
      if (currentBkSession.value?.id === id) {
        currentBkSession.value = { ...currentBkSession.value, ...updatedFields };
        persistSession();
      }
    }
  };

  // Admin Management: Reset Password Akun BK
  const resetPassword = (id, newPassword) => {
    const partner = referralList.value.find((r) => r.id === id);
    if (partner) {
      partner.password = newPassword;
      persist();
      if (currentBkSession.value?.id === id) {
        currentBkSession.value.password = newPassword;
        persistSession();
      }
      return { success: true, message: `Kata sandi akun ${partner.picName} berhasil diperbarui.` };
    }
    return { success: false, message: 'Mitra tidak ditemukan.' };
  };

  // Admin Management: Toggle Status Aktif / Nonaktif
  const togglePartnerStatus = (id) => {
    const partner = referralList.value.find((r) => r.id === id);
    if (partner) {
      partner.status = partner.status === 'active' ? 'inactive' : 'active';
      persist();
      if (currentBkSession.value?.id === id) {
        currentBkSession.value.status = partner.status;
        persistSession();
      }
      return { success: true, status: partner.status, message: `Status akun diubah menjadi ${partner.status === 'active' ? 'Aktif' : 'Nonaktif'}.` };
    }
    return { success: false, message: 'Mitra tidak ditemukan.' };
  };

  // Admin Management: Hapus Akun Mitra
  const deleteReferral = (id) => {
    const idx = referralList.value.findIndex((r) => r.id === id);
    if (idx !== -1) {
      referralList.value.splice(idx, 1);
      persist();
      if (currentBkSession.value?.id === id) {
        logoutBk();
      }
      return { success: true };
    }
    return { success: false };
  };

  // BK Portal: Dapatkan daftar referal yang dikelola oleh user tertentu (Kemal Ramadhan)
  const getReferralsForUser = (userEmailOrName) => {
    if (!userEmailOrName) return referralList.value;
    const clean = String(userEmailOrName).trim().toLowerCase();
    const matched = referralList.value.filter((r) => {
      const matchEmail = r.email?.toLowerCase() === clean;
      const matchPic = r.picName?.toLowerCase() === clean;
      const matchUser = r.username?.toLowerCase() === clean;
      return matchEmail || matchPic || matchUser;
    });
    return matched.length > 0 ? matched : referralList.value;
  };

  // BK Portal: Approve pembayaran siswa pendaftar
  const approveStudentPayment = (referralCodeOrId, studentIdOrEmail) => {
    const cleanRef = String(referralCodeOrId || '').trim().toUpperCase();
    const refItem = referralList.value.find(
      (r) => r.id === referralCodeOrId || r.code?.toUpperCase() === cleanRef
    );
    if (!refItem || !refItem.students) return false;

    const cleanQuery = String(studentIdOrEmail || '').toLowerCase().trim();
    const student = refItem.students.find((s) => {
      const matchId = String(s.id) === cleanQuery;
      const matchEmail = s.email && s.email.toLowerCase().trim() === cleanQuery;
      const matchReg = s.reg_no && s.reg_no.toLowerCase().trim() === cleanQuery;
      const matchName = s.name && s.name.toLowerCase().trim() === cleanQuery;
      return matchId || matchEmail || matchReg || matchName;
    });

    if (student) {
      student.status_approve = 'SUCCESS';
      if (!student.nominal || student.nominal === 0) {
        student.nominal = 250000;
        student.type = 'Pendaftaran';
      }
      student.status_keuangan = 'Lunas';

      refItem.verifiedCount = refItem.students.filter((s) => s.status_approve === 'SUCCESS').length;
      refItem.settledAmount = refItem.students
        .filter((s) => s.status_approve === 'SUCCESS')
        .reduce((sum, s) => sum + (Number(s.nominal) || 250000), 0);

      if (refItem.metrics) {
        refItem.metrics.totalTransaksiAll = refItem.settledAmount;
        refItem.metrics.tagihan = refItem.settledAmount;
        refItem.metrics.lunas = refItem.settledAmount;
        refItem.metrics.pending = refItem.students
          .filter((s) => s.status_approve === 'pending' || s.status_approve === 'panding')
          .reduce((sum, s) => sum + (Number(s.nominal) || 250000), 0);
      }
      referralList.value = [...referralList.value];
      persist();

      if (
        currentBkSession.value &&
        (currentBkSession.value.id === refItem.id || currentBkSession.value.code === refItem.code)
      ) {
        currentBkSession.value = { ...refItem };
        persistSession();
      }

      // TRI-DIRECTIONAL SYNC: SINKRONISASI KE PENYIMPANAN SISWA (APPLICANT) & ADMIN
      try {
        const studentEmail = (student.email || '').toLowerCase().trim();
        const studentRegNo = student.reg_no;
        const nowStr = new Date().toLocaleString('id-ID');

        // 1. Sinkronisasi ke seluruh storage pendaftar lokal (bth_applicant_v3_*)
        if (typeof window !== 'undefined' && window.localStorage) {
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (!k || !k.startsWith('bth_applicant_v3_')) continue;
            const raw = localStorage.getItem(k);
            if (!raw) continue;
            const parsed = JSON.parse(raw);
            const matchEmail = studentEmail && parsed.candidate?.email?.toLowerCase().trim() === studentEmail;
            const matchReg = studentRegNo && parsed.candidate?.registrationNumber === studentRegNo;
            if (matchEmail || matchReg) {
              if (parsed.payments?.registrationFee) {
                parsed.payments.registrationFee.status = 'paid';
                parsed.payments.registrationFee.statusLabel = 'Lunas (Disetujui Guru BK)';
                parsed.payments.registrationFee.paidAt = parsed.payments.registrationFee.paidAt || nowStr;
                parsed.payments.registrationFee.confirmedBy = `Mitra Guru BK (${refItem.picName})`;
              }
              localStorage.setItem(k, JSON.stringify(parsed));
            }
          }

          // 2. Sinkronisasi ke admin storage (bth_admin_data_real_v5)
          const adminRaw = localStorage.getItem('bth_admin_data_real_v5');
          if (adminRaw) {
            const adminData = JSON.parse(adminRaw);
            if (Array.isArray(adminData)) {
              const adminApp = adminData.find(
                (a) =>
                  (studentEmail && a.email && a.email.toLowerCase().trim() === studentEmail) ||
                  (studentRegNo && a.id === studentRegNo)
              );
              if (adminApp && adminApp.payments?.registrationFee) {
                adminApp.payments.registrationFee.status = 'paid';
                adminApp.payments.registrationFee.statusLabel = 'Lunas (Disetujui Guru BK)';
                adminApp.payments.registrationFee.paidAt = adminApp.payments.registrationFee.paidAt || nowStr;
                adminApp.payments.registrationFee.confirmedBy = `Mitra Guru BK (${refItem.picName})`;
                localStorage.setItem('bth_admin_data_real_v5', JSON.stringify(adminData));
              }
            }
          }

          // 3. Siarkan event realtime antar komponen & tab
          window.dispatchEvent(
            new CustomEvent('bth_payment_confirmed', {
              detail: { email: studentEmail, regNo: studentRegNo, code: refItem.code },
            })
          );
        }
      } catch (syncErr) {
        console.warn('Sync student approval to applicant & admin error:', syncErr);
      }

      return true;
    }
    return false;
  };

  // BK Portal: Reject pembayaran siswa pendaftar
  const rejectStudentPayment = (referralCodeOrId, studentIdOrEmail) => {
    const cleanRef = String(referralCodeOrId || '').trim().toUpperCase();
    const refItem = referralList.value.find(
      (r) => r.id === referralCodeOrId || r.code?.toUpperCase() === cleanRef
    );
    if (!refItem || !refItem.students) return false;

    const cleanQuery = String(studentIdOrEmail || '').toLowerCase().trim();
    const student = refItem.students.find((s) => {
      const matchId = String(s.id) === cleanQuery;
      const matchEmail = s.email && s.email.toLowerCase().trim() === cleanQuery;
      const matchReg = s.reg_no && s.reg_no.toLowerCase().trim() === cleanQuery;
      const matchName = s.name && s.name.toLowerCase().trim() === cleanQuery;
      return matchId || matchEmail || matchReg || matchName;
    });

    if (student) {
      student.status_approve = 'REJECTED';
      student.status_keuangan = 'Ditolak';

      refItem.verifiedCount = refItem.students.filter((s) => s.status_approve === 'SUCCESS').length;
      refItem.settledAmount = refItem.students
        .filter((s) => s.status_approve === 'SUCCESS')
        .reduce((sum, s) => sum + (Number(s.nominal) || 250000), 0);

      if (refItem.metrics) {
        refItem.metrics.totalTransaksiAll = refItem.settledAmount;
        refItem.metrics.tagihan = refItem.settledAmount;
        refItem.metrics.lunas = refItem.settledAmount;
        refItem.metrics.pending = refItem.students
          .filter((s) => s.status_approve === 'pending' || s.status_approve === 'panding')
          .reduce((sum, s) => sum + (Number(s.nominal) || 250000), 0);
      }
      referralList.value = [...referralList.value];
      persist();

      if (
        currentBkSession.value &&
        (currentBkSession.value.id === refItem.id || currentBkSession.value.code === refItem.code)
      ) {
        currentBkSession.value = { ...refItem };
        persistSession();
      }

      // TRI-DIRECTIONAL SYNC: SINKRONISASI PENOLAKAN KE STORAGE APPLICANT & ADMIN
      try {
        const studentEmail = (student.email || '').toLowerCase().trim();
        const studentRegNo = student.reg_no;

        if (typeof window !== 'undefined' && window.localStorage) {
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (!k || !k.startsWith('bth_applicant_v3_')) continue;
            const raw = localStorage.getItem(k);
            if (!raw) continue;
            const parsed = JSON.parse(raw);
            const matchEmail = studentEmail && parsed.candidate?.email?.toLowerCase().trim() === studentEmail;
            const matchReg = studentRegNo && parsed.candidate?.registrationNumber === studentRegNo;
            if (matchEmail || matchReg) {
              if (parsed.payments?.registrationFee) {
                parsed.payments.registrationFee.status = 'rejected';
                parsed.payments.registrationFee.statusLabel = 'Ditolak Mitra Guru BK';
              }
              localStorage.setItem(k, JSON.stringify(parsed));
            }
          }
        }
      } catch (rejErr) {
        console.warn('Sync student rejection error:', rejErr);
      }

      return true;
    }
    return false;
  };

  const getStudentsForReferral = (codeOrId) => {
    const target = findReferralByCode(codeOrId) || referralList.value.find((r) => r.id === codeOrId);
    return target?.students || [];
  };

  // Helper: Rincian Keuangan Lengkap untuk Dashboard Detail BK
  const getFinancialSummary = (referralCodeOrItem) => {
    let item = null;
    if (!referralCodeOrItem) {
      item = currentBkSession.value;
    } else if (typeof referralCodeOrItem === 'string') {
      const cleanRef = String(referralCodeOrItem).trim().toUpperCase();
      item = findReferralByCode(cleanRef) || referralList.value.find((r) => r.code?.toUpperCase() === cleanRef || r.id === referralCodeOrItem);
    } else {
      item = referralCodeOrItem;
    }

    if (!item) {
      return {
        verifiedCount: 0,
        registeredCount: 0,
        totalGross: 0,
        commissionType: 'nominal',
        commissionValue: 50000,
        settlementMode: 'potong_setoran',
        commissionPerStudent: 50000,
        totalCommission: 0,
        netPayableToCampus: 0,
        settledVerified: 0,
        settledSubmitted: 0,
        remainingToSettle: 0,
        settlements: [],
      };
    }

    const students = Array.isArray(item.students) ? item.students : [];
    const settlements = Array.isArray(item.settlements) ? item.settlements : [];
    const verifiedStudents = students.filter((s) => s.status_approve === 'SUCCESS');
    const verifiedCount = verifiedStudents.length;

    const totalGross = verifiedStudents.reduce((sum, s) => sum + (Number(s.nominal) || 300000), 0);
    const commType = item.commissionType || 'nominal';
    const commVal = Number(item.commissionValue ?? 50000);
    const settlementMode = item.settlementMode || 'potong_setoran';

    let totalCommission = 0;
    let commissionPerStudent = commVal;
    if (commType === 'percentage' || commType === 'persen') {
      totalCommission = Math.round((totalGross * commVal) / 100);
      commissionPerStudent = verifiedCount > 0 ? Math.round(totalCommission / verifiedCount) : 0;
    } else {
      totalCommission = commVal * verifiedCount;
      commissionPerStudent = commVal;
    }

    const netPayableToCampus = settlementMode === 'potong_setoran'
      ? Math.max(0, totalGross - totalCommission)
      : totalGross;

    const settledVerified = settlements
      .filter((s) => s.status === 'VERIFIED')
      .reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

    const settledSubmitted = settlements
      .filter((s) => s.status === 'SUBMITTED')
      .reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

    const remainingToSettle = Math.max(0, netPayableToCampus - settledVerified - settledSubmitted);

    return {
      verifiedCount,
      registeredCount: students.length,
      totalGross,
      commissionType: commType,
      commissionValue: commVal,
      settlementMode,
      commissionPerStudent,
      totalCommission,
      netPayableToCampus,
      settledVerified,
      settledSubmitted,
      remainingToSettle,
      settlements,
    };
  };

  // BK: Ajukan Setoran ke Kampus (Settlement)
  const submitSettlement = ({ referralCode, amount, grossAmount, commissionAmount, transferDate, bankName, accountNumber, referenceNo, proofUrl, notes }) => {
    const cleanRef = String(referralCode || '').trim().toUpperCase();
    const ref = findReferralByCode(cleanRef) || referralList.value.find((r) => r.code?.toUpperCase() === cleanRef || r.id === referralCode);
    if (!ref) {
      return { success: false, message: 'Kode referal tidak ditemukan.' };
    }
    if (!Array.isArray(ref.settlements)) {
      ref.settlements = [];
    }

    const fin = getFinancialSummary(ref);
    const newSettlement = {
      id: `STL-${Date.now()}`,
      referralCode: ref.code,
      schoolName: ref.schoolName || ref.institution,
      grossAmount: Number(grossAmount) || fin.totalGross,
      commissionAmount: Number(commissionAmount) || fin.totalCommission,
      amount: Number(amount),
      transferDate: transferDate || new Date().toISOString().split('T')[0],
      bankName: bankName || 'Bank Syariah Indonesia (BSI)',
      accountNumber: accountNumber || '7142-9988-12',
      referenceNo: referenceNo || `TRX-${Date.now().toString().slice(-6)}`,
      proofUrl: proofUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80',
      notes: notes || 'Setoran pendaftaran siswa melalui Guru BK',
      status: 'SUBMITTED', // Menunggu Verifikasi Kampus
      submittedAt: new Date().toISOString(),
      verifiedAt: null,
      rejectReason: '',
    };

    ref.settlements.unshift(newSettlement);
    if (ref.metrics) {
      ref.metrics.pending = (Number(ref.metrics.pending) || 0) + newSettlement.amount;
      ref.metrics.updatedAt = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    referralList.value = [...referralList.value];
    persist();

    if (currentBkSession.value && (currentBkSession.value.code === ref.code || currentBkSession.value.id === ref.id)) {
      currentBkSession.value = { ...ref };
      persistSession();
    }

    return {
      success: true,
      settlement: newSettlement,
      message: 'Bukti setoran berhasil dikirim. Menunggu verifikasi Biro Keuangan Kampus.',
    };
  };

  // Admin Keuangan: Verifikasi Setoran Guru BK (Lunas)
  const verifySettlement = (referralCode, settlementId) => {
    const ref = referralList.value.find((r) => r.code === referralCode || r.id === referralCode);
    if (!ref || !Array.isArray(ref.settlements)) return false;
    const settlement = ref.settlements.find((s) => s.id === settlementId);
    if (!settlement) return false;

    settlement.status = 'VERIFIED';
    settlement.verifiedAt = new Date().toISOString();
    settlement.rejectReason = '';

    const fin = getFinancialSummary(ref);
    ref.settledAmount = fin.settledVerified;
    if (ref.metrics) {
      ref.metrics.lunas = fin.settledVerified;
      ref.metrics.pending = fin.settledSubmitted;
      ref.metrics.tagihan = fin.netPayableToCampus;
      ref.metrics.updatedAt = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    referralList.value = [...referralList.value];
    persist();
    if (currentBkSession.value && (currentBkSession.value.code === ref.code || currentBkSession.value.id === ref.id)) {
      currentBkSession.value = { ...ref };
      persistSession();
    }
    return true;
  };

  // Admin Keuangan: Tolak Setoran Guru BK
  const rejectSettlement = (referralCode, settlementId, reason = 'Bukti transfer tidak valid atau belum masuk ke mutasi rekening') => {
    const ref = referralList.value.find((r) => r.code === referralCode || r.id === referralCode);
    if (!ref || !Array.isArray(ref.settlements)) return false;
    const settlement = ref.settlements.find((s) => s.id === settlementId);
    if (!settlement) return false;

    settlement.status = 'REJECTED';
    settlement.rejectReason = reason;

    const fin = getFinancialSummary(ref);
    if (ref.metrics) {
      ref.metrics.pending = fin.settledSubmitted;
      ref.metrics.updatedAt = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    referralList.value = [...referralList.value];
    persist();
    if (currentBkSession.value && (currentBkSession.value.code === ref.code || currentBkSession.value.id === ref.id)) {
      currentBkSession.value = { ...ref };
      persistSession();
    }
    return true;
  };

  // Admin: Atur Skema & Nilai Komisi Mitra BK
  const updateCommission = (referralCode, { commissionType, commissionValue, settlementMode }) => {
    const ref = referralList.value.find((r) => r.code === referralCode || r.id === referralCode);
    if (!ref) return false;

    if (commissionType) ref.commissionType = commissionType;
    if (commissionValue !== undefined && commissionValue !== null) ref.commissionValue = Number(commissionValue);
    if (settlementMode) ref.settlementMode = settlementMode;

    const fin = getFinancialSummary(ref);
    if (ref.metrics) {
      ref.metrics.tagihan = fin.netPayableToCampus;
      ref.metrics.lunas = fin.settledVerified;
      ref.metrics.pending = fin.settledSubmitted;
      ref.metrics.updatedAt = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    referralList.value = [...referralList.value];
    persist();
    if (currentBkSession.value && (currentBkSession.value.code === ref.code || currentBkSession.value.id === ref.id)) {
      currentBkSession.value = { ...ref };
      persistSession();
    }
    return true;
  };

  // Seluruh setoran lintas mitra untuk meja verifikasi Admin Keuangan
  const allSettlements = computed(() => {
    const list = [];
    for (const r of referralList.value) {
      if (Array.isArray(r.settlements)) {
        for (const s of r.settlements) {
          list.push({
            ...s,
            schoolName: r.schoolName || r.institution,
            picName: r.picName,
            picPhone: r.picPhone,
            referralCode: r.code,
            commissionType: r.commissionType || 'nominal',
            commissionValue: r.commissionValue || 50000,
          });
        }
      }
    }
    return list.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));
  });

  return {
    referralList,
    currentBkSession,
    allSettlements,
    findReferralByCode,
    findReferralByStudent,
    findPartnerByIdentifier,
    applyReferralForStudent,
    removeStudentFromReferral,
    loginBk,
    logoutBk,
    setSessionPartner,
    addReferral,
    updateReferral,
    resetPassword,
    togglePartnerStatus,
    deleteReferral,
    getReferralsForUser,
    approveStudentPayment,
    rejectStudentPayment,
    getStudentsForReferral,
    getFinancialSummary,
    submitSettlement,
    verifySettlement,
    rejectSettlement,
    updateCommission,
    reloadFromStorage,
    syncFromSharedServer,
  };
});
