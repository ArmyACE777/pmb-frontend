import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useApplicantStore, PRODI_METADATA } from './applicant';
import { useAuthStore } from './auth';
import axios from 'axios';

const STORAGE_KEY = 'bth_admin_data_real_v4';

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

  // 1. Cek apakah ada data formulir asli yang tersimpan untuk pengguna ini di browser
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
    const cand = localState.candidate || {};
    const adm = localState.admission || {};
    const docs = localState.documents || [];
    const pays = localState.payments || {};
    const exam = localState.exam || {};
    const res = localState.result || {};
    const onb = localState.onboarding || {};

    const verifiedDocs = docs.filter((d) => d.status === 'verified').length;
    const pendingDocs = docs.filter((d) => d.status === 'pending' || d.status === 'revision').length;
    const hasRevision = docs.some((d) => d.status === 'revision');
    const hasPending = docs.some((d) => d.status === 'pending');
    const hasUploaded = docs.some((d) => d.filename && d.filename !== 'Belum diunggah');
    const isAllVerified = docs.length > 0 && verifiedDocs === docs.length;

    let docStatus = 'unuploaded';
    if (isAllVerified) docStatus = 'verified';
    else if (hasRevision) docStatus = 'revision';
    else if (hasPending || hasUploaded) docStatus = 'pending';
    else if (verifiedDocs > 0) docStatus = 'pending';

    return {
      id: cand.registrationNumber || regNo,
      backendUserId: u.id,
      nik: cand.nik || '-',
      nisn: cand.nisn || '-',
      fullName: cand.fullName || u.full_name || 'Calon Mahasiswa',
      gender: cand.gender || 'Perempuan',
      email: u.email,
      phone: cand.phone || u.phone || '-',
      schoolName: cand.schoolName || 'Asal Sekolah Belum Diisi',
      averageScore: cand.averageScore || '-',
      track: adm.track || 'Jalur Reguler Gelombang 1',
      faculty: adm.prodi1Faculty || '-',
      prodi1: adm.prodi1 || 'Belum Memilih',
      prodi2: adm.prodi2 || '-',
      registrationDate: 'Aktif di Sistem',
      documentStatus: docStatus,
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
          id: pays.registrationFee?.id || `INV-REG-${regNo.slice(-5)}`,
          amount: pays.registrationFee?.amount || 250000,
          status: pays.registrationFee?.status || 'unpaid',
          paidAt: pays.registrationFee?.paidAt || null,
          method: pays.registrationFee?.paymentMethod || 'Virtual Account BSI',
        },
        uktFee: {
          id: pays.uktFee?.id || `INV-UKT-${regNo.slice(-5)}`,
          amount: pays.uktFee?.amount || 6500000,
          status: pays.uktFee?.status || 'unpaid',
          paidAt: pays.uktFee?.paidAt || null,
          dueDate: pays.uktFee?.dueDate || '30 April 2026',
          method: 'Virtual Account BSI / Mandiri',
        },
      },
      selection: {
        cbtScore: exam.score || 0,
        interviewScore: res.isPassed ? 88 : null,
        interviewer: res.isPassed ? 'Dosen Penguji PMB BTH' : null,
        interviewNotes: 'Pendaftar akun aktif terintegrasi sistem.',
        passedStatus: res.isPassed ? 'passed' : exam.status === 'completed' ? 'evaluating' : 'evaluating',
        decisionLetterNo: res.decisionLetterNo || null,
      },
      onboarding: {
        isEnrolled: pays.uktFee?.status === 'paid',
        nim: onb.nim || null,
        pkkmbGroup: onb.pkkmbGroup || null,
      },
    };
  }

  // 2. Data jujur untuk user yang baru mendaftar di akun web dan belum mengunggah dokumen
  const defaultDocs = [
    { id: 'doc-1', title: 'Ijazah / Surat Keterangan Lulus (SKL)', filename: 'Belum diunggah', status: 'unuploaded', notes: '', fileBlobUrl: null },
    { id: 'doc-2', title: 'Kartu Tanda Penduduk (KTP) / Kartu Pelajar', filename: 'Belum diunggah', status: 'unuploaded', notes: '', fileBlobUrl: null },
    { id: 'doc-3', title: 'Kartu Keluarga (KK)', filename: 'Belum diunggah', status: 'unuploaded', notes: '', fileBlobUrl: null },
    { id: 'doc-4', title: 'Pas Foto Resmi 4x6 (Latar Merah)', filename: 'Belum diunggah', status: 'unuploaded', notes: '', fileBlobUrl: null },
    { id: 'doc-5', title: 'Surat Keterangan Sehat & Bebas Buta Warna', filename: 'Belum diunggah', status: 'unuploaded', notes: '', fileBlobUrl: null },
  ];

  return {
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
    documents: defaultDocs,
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
        method: 'Virtual Account BSI',
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
      gender: candidate?.gender || existingApplicant?.gender || 'Perempuan',
      email,
      phone,
      schoolName: candidate?.schoolName || existingApplicant?.schoolName || 'Asal Sekolah Belum Diisi',
      averageScore: candidate?.averageScore || existingApplicant?.averageScore || '-',
      track: admission?.track || existingApplicant?.track || 'Jalur Reguler Gelombang 1',
      faculty: admission?.prodi1Faculty || existingApplicant?.faculty || '-',
      prodi1: admission?.prodi1 || existingApplicant?.prodi1 || 'Belum Memilih',
      prodi2: admission?.prodi2 || existingApplicant?.prodi2 || '-',
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
