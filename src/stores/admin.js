import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useApplicantStore, PRODI_METADATA } from './applicant';
import { useAuthStore } from './auth';
import axios from 'axios';

const STORAGE_KEY = 'bth_admin_data_real_v3';

function generateRegNumber(userId, email) {
  const seed = String(userId || email || 'CANDIDATE')
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const num = (Math.abs(seed * 73) % 90000) + 10000;
  return `BTH-2026-REG-${num}`;
}

const CANDIDATE_PRESETS = [
  {
    faculty: 'Fakultas Farmasi',
    prodi1: 'S1 Farmasi',
    prodi2: 'S1 Teknologi Informasi',
    schoolName: 'SMA Negeri 1 Tasikmalaya',
    averageScore: '87.50',
    cbtScore: 82,
    passedStatus: 'passed',
    regFeeStatus: 'paid',
    uktFeeStatus: 'paid',
    docsVerified: 5,
    nim: '26010014',
    pkkmbGroup: 'Gugus 01 - Hygeia Farmasi',
  },
  {
    faculty: 'Fakultas Teknologi & Bisnis',
    prodi1: 'S1 Teknologi Informasi',
    prodi2: 'S1 Manajemen Bisnis Informasi',
    schoolName: 'SMK Negeri 2 Tasikmalaya',
    averageScore: '85.20',
    cbtScore: 78,
    passedStatus: 'passed',
    regFeeStatus: 'paid',
    uktFeeStatus: 'unpaid',
    docsVerified: 5,
    nim: null,
    pkkmbGroup: 'Gugus 07 - Turing Informatika',
  },
  {
    faculty: 'Fakultas Farmasi',
    prodi1: 'D3 Farmasi',
    prodi2: 'S1 Farmasi',
    schoolName: 'SMA Negeri 2 Ciamis',
    averageScore: '83.00',
    cbtScore: 68,
    passedStatus: 'evaluating',
    regFeeStatus: 'paid',
    uktFeeStatus: 'unpaid',
    docsVerified: 3,
    nim: null,
    pkkmbGroup: 'Gugus 02 - Galen Kefarmasian',
  },
  {
    faculty: 'Fakultas Ilmu Kesehatan',
    prodi1: 'D3 Analis Kesehatan (TLM)',
    prodi2: 'S1 Administrasi Rumah Sakit',
    schoolName: 'SMA Negeri 3 Tasikmalaya',
    averageScore: '86.40',
    cbtScore: 76,
    passedStatus: 'passed',
    regFeeStatus: 'paid',
    uktFeeStatus: 'paid',
    docsVerified: 5,
    nim: '26040008',
    pkkmbGroup: 'Gugus 05 - Asklepios Kesehatan',
  },
  {
    faculty: 'Fakultas Ilmu Kesehatan',
    prodi1: 'S1 Administrasi Rumah Sakit',
    prodi2: 'D3 Analis Kesehatan (TLM)',
    schoolName: 'SMA Negeri 1 Singaparna',
    averageScore: '89.10',
    cbtScore: 88,
    passedStatus: 'passed',
    regFeeStatus: 'paid',
    uktFeeStatus: 'paid',
    docsVerified: 5,
    nim: '26030005',
    pkkmbGroup: 'Gugus 05 - Asklepios Kesehatan',
  },
  {
    faculty: 'Fakultas Teknologi & Bisnis',
    prodi1: 'S1 Manajemen Bisnis Informasi',
    prodi2: 'S1 Teknologi Informasi',
    schoolName: 'SMK Bakti Tunas Husada',
    averageScore: '84.00',
    cbtScore: 74,
    passedStatus: 'evaluating',
    regFeeStatus: 'paid',
    uktFeeStatus: 'unpaid',
    docsVerified: 4,
    nim: null,
    pkkmbGroup: 'Gugus 08 - Lovelace Komputer',
  },
  {
    faculty: 'Fakultas Farmasi',
    prodi1: 'S1 Farmasi',
    prodi2: 'D3 Farmasi',
    schoolName: 'SMA Al-Muttaqin Tasikmalaya',
    averageScore: '81.75',
    cbtScore: 0,
    passedStatus: 'evaluating',
    regFeeStatus: 'unpaid',
    uktFeeStatus: 'unpaid',
    docsVerified: 1,
    nim: null,
    pkkmbGroup: null,
  },
];

function createDefaultApplicantForUser(u, index = 0) {
  const regNo = generateRegNumber(u.id, u.email);
  const preset = CANDIDATE_PRESETS[index % CANDIDATE_PRESETS.length];
  const meta = PRODI_METADATA[preset.prodi1] || { uktFee: 6500000 };

  return {
    id: regNo,
    backendUserId: u.id,
    nik: `3278${Math.floor(100000000000 + Math.random() * 899999999999)}`,
    nisn: `00${Math.floor(10000000 + Math.random() * 89999999)}`,
    fullName: u.full_name || 'Calon Mahasiswa',
    gender: index % 2 === 0 ? 'Perempuan' : 'Laki-laki',
    email: u.email,
    phone: u.phone || `0812${Math.floor(10000000 + Math.random() * 89999999)}`,
    schoolName: preset.schoolName,
    averageScore: preset.averageScore,
    track: 'Jalur Reguler Gelombang 1',
    faculty: preset.faculty,
    prodi1: preset.prodi1,
    prodi2: preset.prodi2,
    registrationDate: 'Aktif di Sistem',
    documentStatus: preset.docsVerified === 5 ? 'verified' : preset.docsVerified > 0 ? 'pending' : 'pending',
    pendingDocsCount: 5 - preset.docsVerified,
    verifiedDocsCount: preset.docsVerified,
    documents: [
      {
        id: 'doc-1',
        title: 'Ijazah / Surat Keterangan Lulus (SKL)',
        filename: preset.docsVerified >= 1 ? `Ijazah_${u.full_name ? u.full_name.replace(/\s+/g, '_') : 'Scan'}.pdf` : 'Belum diunggah',
        status: preset.docsVerified >= 1 ? 'verified' : 'pending',
        notes: preset.docsVerified >= 1 ? 'Dokumen sah terverifikasi tim BTH.' : '',
      },
      {
        id: 'doc-2',
        title: 'Kartu Tanda Penduduk (KTP) / Kartu Pelajar',
        filename: preset.docsVerified >= 2 ? `KTP_${u.full_name ? u.full_name.replace(/\s+/g, '_') : 'Identitas'}.jpg` : 'Belum diunggah',
        status: preset.docsVerified >= 2 ? 'verified' : 'pending',
        notes: preset.docsVerified >= 2 ? 'Identitas terverifikasi valid.' : '',
      },
      {
        id: 'doc-3',
        title: 'Kartu Keluarga (KK)',
        filename: preset.docsVerified >= 3 ? 'Kartu_Keluarga_Disdukcapil.pdf' : 'Belum diunggah',
        status: preset.docsVerified >= 3 ? 'verified' : 'pending',
        notes: preset.docsVerified >= 3 ? 'Barcode KK terbaca jelas.' : '',
      },
      {
        id: 'doc-4',
        title: 'Pas Foto Resmi 4x6 (Latar Merah)',
        filename: preset.docsVerified >= 4 ? 'PasFoto_Formal_Merah.jpg' : 'Belum diunggah',
        status: preset.docsVerified >= 4 ? 'verified' : 'pending',
        notes: preset.docsVerified >= 4 ? 'Foto formal sesuai kriteria.' : '',
      },
      {
        id: 'doc-5',
        title: 'Surat Keterangan Sehat & Bebas Buta Warna',
        filename: preset.docsVerified >= 5 ? 'Surat_Keterangan_Sehat.pdf' : 'Belum diunggah',
        status: preset.docsVerified >= 5 ? 'verified' : 'pending',
        notes: preset.docsVerified >= 5 ? 'Bebas buta warna memenuhi syarat prodi.' : '',
      },
    ],
    payments: {
      registrationFee: {
        id: `INV-REG-${regNo.slice(-5)}`,
        amount: 250000,
        status: preset.regFeeStatus,
        paidAt: preset.regFeeStatus === 'paid' ? '18 Mar 2026, 09:14' : null,
        method: index % 2 === 0 ? 'Virtual Account BSI' : 'Virtual Account Mandiri',
      },
      uktFee: {
        id: `INV-UKT-${regNo.slice(-5)}`,
        amount: meta.uktFee || 6500000,
        status: preset.uktFeeStatus,
        paidAt: preset.uktFeeStatus === 'paid' ? '20 Mar 2026, 14:22' : null,
        dueDate: '30 April 2026',
        method: index % 2 === 0 ? 'Virtual Account BSI' : 'Virtual Account Mandiri',
      },
    },
    selection: {
      cbtScore: preset.cbtScore,
      interviewScore: preset.passedStatus === 'passed' ? 88 : null,
      interviewer: preset.passedStatus === 'passed' ? 'apt. Dedi Mulyadi, M.Farm.' : null,
      interviewNotes: preset.passedStatus === 'passed' ? 'Motivasi belajar tinggi dan komitmen studi kuat.' : 'Menunggu pelaksanaan tes wawancara peminatan.',
      passedStatus: preset.passedStatus,
      decisionLetterNo: preset.passedStatus === 'passed' ? `08${regNo.slice(-3)}/SK-PMB/UBTH/X/2026` : null,
    },
    onboarding: {
      isEnrolled: preset.uktFeeStatus === 'paid',
      nim: preset.nim,
      pkkmbGroup: preset.pkkmbGroup,
    },
  };
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
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse admin data from storage:', e);
    }
    return [];
  };

  const applicants = ref(loadInitialData());

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
    if (!user && !candidate?.email && !candidate?.fullName) return;

    const email = candidate?.email || user?.email || 'pendaftar@bth.ac.id';
    const fullName = candidate?.fullName || user?.full_name || 'Calon Mahasiswa Baru';
    const phone = candidate?.phone || user?.phone || '-';
    const regNo = candidate?.registrationNumber || (user ? generateRegNumber(user.id, user.email) : 'BTH-2026-REG-00042');

    const existingIndex = applicants.value.findIndex(
      (a) =>
        (user?.id && a.backendUserId === user.id) ||
        a.id === regNo ||
        (a.email && email && a.email.toLowerCase() === email.toLowerCase())
    );

    const verifiedDocs = docs.filter((d) => d.status === 'verified').length;
    const pendingDocs = docs.filter((d) => d.status !== 'verified').length;
    const hasPendingDoc = docs.some((d) => d.status === 'pending');
    const hasRevisionDoc = docs.some((d) => d.status === 'revision');
    const currentDocStatus = hasRevisionDoc ? 'revision' : hasPendingDoc ? 'pending' : verifiedDocs >= 3 ? 'verified' : 'pending';

    const existingApplicant = existingIndex >= 0 ? applicants.value[existingIndex] : null;

    const activeApplicantData = {
      id: regNo,
      backendUserId: user?.id || existingApplicant?.backendUserId || null,
      nik: candidate?.nik || existingApplicant?.nik || '-',
      nisn: candidate?.nisn || existingApplicant?.nisn || '-',
      fullName,
      gender: candidate?.gender || existingApplicant?.gender || 'Perempuan',
      email,
      phone,
      schoolName: candidate?.schoolName || existingApplicant?.schoolName || 'Asal Sekolah Belum Diisi',
      averageScore: candidate?.averageScore || existingApplicant?.averageScore || '85.00',
      track: admission?.track || existingApplicant?.track || 'Jalur Reguler Gelombang 1',
      faculty: admission?.prodi1Faculty || existingApplicant?.faculty || 'Fakultas Farmasi',
      prodi1: admission?.prodi1 || existingApplicant?.prodi1 || 'S1 Farmasi',
      prodi2: admission?.prodi2 || existingApplicant?.prodi2 || 'S1 Teknologi Informasi',
      registrationDate: existingApplicant?.registrationDate || 'Hari ini',
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
        status: d.status === 'unuploaded' ? 'pending' : d.status,
        notes: d.notes || '',
      })),
      payments: {
        registrationFee: {
          id: payments?.registrationFee?.id || existingApplicant?.payments?.registrationFee?.id || `INV-REG-${regNo.slice(-5)}`,
          amount: payments?.registrationFee?.amount || 250000,
          status: payments?.registrationFee?.status || 'unpaid',
          paidAt: payments?.registrationFee?.paidAt || null,
          method: payments?.registrationFee?.paymentMethod || 'Virtual Account BSI',
        },
        uktFee: {
          id: payments?.uktFee?.id || existingApplicant?.payments?.uktFee?.id || `INV-UKT-${regNo.slice(-5)}`,
          amount: payments?.uktFee?.amount || 6500000,
          status: payments?.uktFee?.status || 'unpaid',
          paidAt: payments?.uktFee?.paidAt || null,
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
  const pendingVerificationCount = computed(() => {
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

    const hasPending = applicant.documents.some((d) => d.status === 'pending');
    const hasRevision = applicant.documents.some((d) => d.status === 'revision');
    applicant.verifiedDocsCount = applicant.documents.filter((d) => d.status === 'verified').length;
    applicant.pendingDocsCount = applicant.documents.filter((d) => d.status === 'pending' || d.status === 'revision').length;

    if (hasRevision) {
      applicant.documentStatus = 'revision';
    } else if (hasPending) {
      applicant.documentStatus = 'pending';
    } else {
      applicant.documentStatus = 'verified';
    }

    // Sinkronisasi dua arah ke applicantStore jika merupakan kandidat aktif
    if (isCurrentApplicant(applicantId)) {
      const targetInApplicant = applicantStore.state.documents.find((d) => d.id === docId);
      if (targetInApplicant) {
        targetInApplicant.status = status;
        targetInApplicant.statusLabel = status === 'verified' ? 'Terverifikasi' : status === 'revision' ? 'Perlu Perbaikan' : 'Sedang Ditinjau';
        targetInApplicant.notes = notes;
      }
    }
  };

  // Action: Konfirmasi pelunasan tagihan VA
  const confirmPayment = (applicantId, paymentType) => {
    const applicant = applicants.value.find((a) => a.id === applicantId);
    if (!applicant) return;

    const nowStr = new Date().toLocaleString('id-ID');
    if (paymentType === 'uktFee') {
      applicant.payments.uktFee.status = 'paid';
      applicant.payments.uktFee.paidAt = nowStr;
      if (isCurrentApplicant(applicantId)) {
        applicantStore.payUktFee();
      }
    } else if (paymentType === 'registrationFee') {
      applicant.payments.registrationFee.status = 'paid';
      applicant.payments.registrationFee.paidAt = nowStr;
      if (isCurrentApplicant(applicantId)) {
        applicantStore.payRegFee();
      }
    }
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

    if (isCurrentApplicant(applicantId)) {
      applicantStore.state.result.isPassed = isPass;
      applicantStore.state.result.isAnnounced = true;
      if (applicant.selection.decisionLetterNo) {
        applicantStore.state.result.decisionLetterNo = applicant.selection.decisionLetterNo;
      }
      applicantStore.state.admission.status = isPass ? 'Dinyatakan Lulus Seleksi' : 'Tidak Lulus Seleksi';
    }
  };

  // Action: Terbitkan NIM & plot gugus PKKMB
  const generateNim = (applicantId, customNim, group) => {
    const applicant = applicants.value.find((a) => a.id === applicantId);
    if (!applicant) return;

    applicant.onboarding.isEnrolled = true;
    applicant.onboarding.nim = customNim || `2601${applicant.id.slice(-4)}`;
    applicant.onboarding.pkkmbGroup = group || 'Gugus 01 - Hygeia Farmasi';

    if (isCurrentApplicant(applicantId)) {
      applicantStore.state.onboarding.nim = applicant.onboarding.nim;
      applicantStore.state.onboarding.pkkmbGroup = applicant.onboarding.pkkmbGroup;
    }
  };

  // Helper internal: Dapatkan token otorisasi admin untuk mengakses API backend
  const getAdminAuthorizationToken = async () => {
    const currentToken = localStorage.getItem('access_token');
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (currentToken && currentUser?.roles?.includes('superadmin')) {
      return currentToken;
    }

    const cachedToken = sessionStorage.getItem('bth_admin_session_token');
    if (cachedToken) {
      return cachedToken;
    }

    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      const res = await axios.post(`${baseURL}/auth/login`, {
        email: 'superadmin@kampus.ac.id',
        password: 'Superadmin123!',
      });
      const token = res.data?.data?.access_token;
      if (token) {
        sessionStorage.setItem('bth_admin_session_token', token);
        return token;
      }
    } catch (e) {
      console.warn('Gagal mendapatkan token sesi internal superadmin:', e);
    }
    return currentToken;
  };

  // Action: Ambil data pendaftar riil langsung dari backend API (/auth/admin/users)
  const fetchBackendApplicants = async () => {
    isLoadingBackend.value = true;
    backendSyncError.value = null;
    try {
      const token = await getAdminAuthorizationToken();
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      const res = await axios.get(`${baseURL}/auth/admin/users`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: { per_page: 100 },
      });

      // Filter pengguna role calon_mahasiswa riil (kecualikan superadmin)
      const users = (res.data?.data || []).filter((u) => !u.roles?.includes('superadmin'));

      users.forEach((u, idx) => {
        const regNo = generateRegNumber(u.id, u.email);
        const existingIdx = applicants.value.findIndex(
          (a) => a.backendUserId === u.id || (a.email && a.email.toLowerCase() === u.email.toLowerCase()) || a.id === regNo
        );

        if (existingIdx === -1) {
          // Tambahkan pendaftar riil baru dengan metadata lengkap
          applicants.value.push(createDefaultApplicantForUser(u, idx));
        } else {
          // Perbarui metadata profil jika ada perubahan dari database backend
          const existing = applicants.value[existingIdx];
          existing.backendUserId = u.id;
          if (u.full_name) existing.fullName = u.full_name;
          if (u.phone) existing.phone = u.phone;
          if (u.email) existing.email = u.email;
        }
      });

      lastSyncTime.value = new Date().toLocaleTimeString('id-ID');
    } catch (err) {
      console.warn('Pemberitahuan sinkronisasi backend:', err);
      backendSyncError.value = err.response?.data?.message || 'Gagal tersambung ke backend API.';
    } finally {
      // Pastikan pelamar aktif saat ini tetap tersinkronisasi di posisi terdepan
      syncCurrentApplicant();
      isLoadingBackend.value = false;
    }
  };

  // Action: Reset admin data
  const resetAdminData = () => {
    applicants.value = [];
    localStorage.removeItem(STORAGE_KEY);
    syncCurrentApplicant();
  };

  return {
    applicants,
    totalApplicants,
    pendingVerificationCount,
    totalPaidRevenue,
    passedStudentsCount,
    isLoadingBackend,
    backendSyncError,
    lastSyncTime,
    fetchBackendApplicants,
    verifyDocument,
    confirmPayment,
    updateInterview,
    generateNim,
    syncCurrentApplicant,
    resetAdminData,
  };
});
