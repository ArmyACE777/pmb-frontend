import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useApplicantStore } from './applicant';

const STORAGE_KEY = 'bth_admin_data_v1';

const defaultApplicants = [
  {
    id: 'BTH-2026-REG-08493',
    nik: '3278021105050001',
    nisn: '0057891234',
    fullName: 'Dimas Arya Pratama',
    gender: 'Laki-laki',
    email: 'dimas.arya@gmail.com',
    phone: '081322445566',
    schoolName: 'SMK Telkom Tasikmalaya',
    averageScore: '86.50',
    track: 'Jalur Reguler Gelombang 1',
    faculty: 'Fakultas Teknologi & Bisnis',
    prodi1: 'S1 Teknologi Informasi',
    prodi2: 'S1 Manajemen Bisnis Informasi',
    registrationDate: '13 Sep 2026',
    documentStatus: 'verified',
    pendingDocsCount: 0,
    verifiedDocsCount: 5,
    documents: [
      { id: 'doc-1', title: 'Ijazah / SKL', filename: 'SKL_Dimas_Arya.pdf', status: 'verified', notes: 'Ijazah SMK Rekayasa Perangkat Lunak sah.' },
      { id: 'doc-2', title: 'KTP', filename: 'KTP_Dimas.jpg', status: 'verified', notes: 'KTP sah.' },
      { id: 'doc-3', title: 'Kartu Keluarga', filename: 'KK_Dimas_Arya.pdf', status: 'verified', notes: 'KK terverifikasi.' },
      { id: 'doc-4', title: 'Pas Foto 4x6', filename: 'Foto_Dimas_4x6.jpg', status: 'verified', notes: 'Pas foto jas hitam latar biru disetujui.' },
      { id: 'doc-5', title: 'Surat Kesehatan', filename: 'Kesehatan_Puskesmas.pdf', status: 'verified', notes: 'Kondisi fisik prima.' },
    ],
    payments: {
      registrationFee: { id: 'INV-REG-2026-08493', amount: 250000, status: 'paid', paidAt: '13 Sep 2026, 14:20 WIB', method: 'VA Mandiri' },
      uktFee: { id: 'INV-UKT-2026-0043', amount: 4500000, status: 'paid', paidAt: '25 Sep 2026, 09:10 WIB', method: 'VA Mandiri' },
    },
    selection: {
      cbtScore: 92,
      interviewScore: 90,
      interviewer: 'Ir. Hendra Gunawan, M.T.',
      interviewNotes: 'Kemampuan logika pemrograman dan algoritma sangat kuat.',
      passedStatus: 'passed',
      decisionLetterNo: '083/SK-PMB/UBTH/X/2026',
    },
    onboarding: {
      isEnrolled: true,
      nim: '26020015',
      pkkmbGroup: 'Gugus 07 - Turing Informatika',
    },
  },
  {
    id: 'BTH-2026-REG-08494',
    nik: '3278046008060003',
    nisn: '0069012345',
    fullName: 'Anisa Maulida Fitri',
    gender: 'Perempuan',
    email: 'anisa.fitri@gmail.com',
    phone: '085220334411',
    schoolName: 'SMA Negeri 2 Tasikmalaya',
    averageScore: '84.20',
    track: 'Jalur Reguler Gelombang 1',
    faculty: 'Fakultas Farmasi',
    prodi1: 'D3 Farmasi',
    prodi2: 'S1 Farmasi',
    registrationDate: '14 Sep 2026',
    documentStatus: 'revision',
    pendingDocsCount: 1,
    verifiedDocsCount: 4,
    documents: [
      { id: 'doc-1', title: 'Ijazah / SKL', filename: 'SKL_Anisa.pdf', status: 'verified', notes: 'Legalisir valid.' },
      { id: 'doc-2', title: 'KTP', filename: 'KTP_Anisa.jpg', status: 'verified', notes: 'Valid.' },
      { id: 'doc-3', title: 'Kartu Keluarga', filename: 'KK_Anisa.pdf', status: 'verified', notes: 'Valid.' },
      { id: 'doc-4', title: 'Pas Foto 4x6', filename: 'Foto_Anisa.jpg', status: 'revision', notes: 'Foto buram dan latar belakang bukan warna merah standar.' },
      { id: 'doc-5', title: 'Surat Bebas Buta Warna', filename: 'Buta_Warna_RSUD.pdf', status: 'verified', notes: 'Hasil normal.' },
    ],
    payments: {
      registrationFee: { id: 'INV-REG-2026-08494', amount: 250000, status: 'paid', paidAt: '14 Sep 2026, 11:05 WIB', method: 'VA BSI' },
      uktFee: { id: 'INV-UKT-2026-0044', amount: 4800000, status: 'pending', dueDate: '28 Okt 2026', method: 'VA BSI' },
    },
    selection: {
      cbtScore: 78,
      interviewScore: 82,
      interviewer: 'apt. Dedi Mulyadi, M.Farm.',
      interviewNotes: 'Cukup komunikatif dan tertarik pada formulasi obat tradisional.',
      passedStatus: 'passed',
      decisionLetterNo: '084/SK-PMB/UBTH/X/2026',
    },
    onboarding: {
      isEnrolled: false,
      nim: null,
      pkkmbGroup: null,
    },
  },
  {
    id: 'BTH-2026-REG-08495',
    nik: '3278011203060005',
    nisn: '0061234567',
    fullName: 'Rizky Fauzan Fadilah',
    gender: 'Laki-laki',
    email: 'rizky.fauzan@yahoo.com',
    phone: '081299887711',
    schoolName: 'SMA Negeri 3 Ciamis',
    averageScore: '81.40',
    track: 'Jalur Reguler Gelombang 1',
    faculty: 'Fakultas Ilmu Kesehatan',
    prodi1: 'D3 Analis Kesehatan (TLM)',
    prodi2: 'S1 Administrasi Rumah Sakit',
    registrationDate: '15 Sep 2026',
    documentStatus: 'pending',
    pendingDocsCount: 2,
    verifiedDocsCount: 3,
    documents: [
      { id: 'doc-1', title: 'Ijazah / SKL', filename: 'SKL_Rizky.pdf', status: 'verified', notes: 'Valid.' },
      { id: 'doc-2', title: 'KTP', filename: 'KTP_Rizky.jpg', status: 'verified', notes: 'Valid.' },
      { id: 'doc-3', title: 'Kartu Keluarga', filename: 'KK_Rizky.pdf', status: 'verified', notes: 'Valid.' },
      { id: 'doc-4', title: 'Pas Foto 4x6', filename: 'Foto_Rizky_4x6.jpg', status: 'pending', notes: 'Menunggu konfirmasi format ukuran.' },
      { id: 'doc-5', title: 'Surat Bebas Buta Warna', filename: 'Buta_Warna_Puskesmas.pdf', status: 'pending', notes: 'Menunggu verifikasi dokter panitia.' },
    ],
    payments: {
      registrationFee: { id: 'INV-REG-2026-08495', amount: 250000, status: 'paid', paidAt: '15 Sep 2026, 16:45 WIB', method: 'VA Mandiri' },
      uktFee: { id: 'INV-UKT-2026-0045', amount: 4750000, status: 'pending', dueDate: '28 Okt 2026', method: 'VA Mandiri' },
    },
    selection: {
      cbtScore: 74,
      interviewScore: 76,
      interviewer: 'drg. Hj. Rina Marlina, M.Kes.',
      interviewNotes: 'Paham dasar laboratorium medik.',
      passedStatus: 'passed',
      decisionLetterNo: '085/SK-PMB/UBTH/X/2026',
    },
    onboarding: {
      isEnrolled: false,
      nim: null,
      pkkmbGroup: null,
    },
  },
  {
    id: 'BTH-2026-REG-08496',
    nik: '3278054407060002',
    nisn: '0069988776',
    fullName: 'Nadia Putri Khairunnisa',
    gender: 'Perempuan',
    email: 'nadia.khairunnisa@gmail.com',
    phone: '082216554433',
    schoolName: 'SMA Al-Muttaqin Tasikmalaya',
    averageScore: '89.10',
    track: 'Jalur Prestasi Gelombang 1',
    faculty: 'Fakultas Ilmu Kesehatan',
    prodi1: 'S1 Administrasi Rumah Sakit',
    prodi2: 'S1 Teknologi Informasi',
    registrationDate: '16 Sep 2026',
    documentStatus: 'verified',
    pendingDocsCount: 0,
    verifiedDocsCount: 5,
    documents: [
      { id: 'doc-1', title: 'Ijazah / SKL', filename: 'SKL_Nadia.pdf', status: 'verified', notes: 'Rapor dan sertifikat prestasi tahfidz valid.' },
      { id: 'doc-2', title: 'KTP', filename: 'KTP_Nadia.jpg', status: 'verified', notes: 'Valid.' },
      { id: 'doc-3', title: 'Kartu Keluarga', filename: 'KK_Nadia.pdf', status: 'verified', notes: 'Valid.' },
      { id: 'doc-4', title: 'Pas Foto 4x6', filename: 'Foto_Nadia_4x6.jpg', status: 'verified', notes: 'Sesuai standar resmi.' },
      { id: 'doc-5', title: 'Surat Kesehatan', filename: 'Kesehatan_RS_Bunda.pdf', status: 'verified', notes: 'Kondisi sehat.' },
    ],
    payments: {
      registrationFee: { id: 'INV-REG-2026-08496', amount: 250000, status: 'paid', paidAt: '16 Sep 2026, 08:30 WIB', method: 'VA BSI' },
      uktFee: { id: 'INV-UKT-2026-0046', amount: 4500000, status: 'paid', paidAt: '24 Sep 2026, 13:15 WIB', method: 'VA BSI' },
    },
    selection: {
      cbtScore: 88,
      interviewScore: 92,
      interviewer: 'drg. Hj. Rina Marlina, M.Kes.',
      interviewNotes: 'Sangat berminat pada manajemen rekam medis & administrasi RS modern.',
      passedStatus: 'passed',
      decisionLetterNo: '086/SK-PMB/UBTH/X/2026',
    },
    onboarding: {
      isEnrolled: true,
      nim: '26030008',
      pkkmbGroup: 'Gugus 05 - Asklepios Kesehatan',
    },
  },
  {
    id: 'BTH-2026-REG-08497',
    nik: '3278032109060004',
    nisn: '0063344552',
    fullName: 'Bagas Aditya Nugraha',
    gender: 'Laki-laki',
    email: 'bagas.nugraha@gmail.com',
    phone: '081399442200',
    schoolName: 'SMA Negeri 1 Singaparna',
    averageScore: '74.50',
    track: 'Jalur Reguler Gelombang 1',
    faculty: 'Fakultas Teknologi & Bisnis',
    prodi1: 'S1 Manajemen Bisnis Informasi',
    prodi2: 'S1 Teknologi Informasi',
    registrationDate: '18 Sep 2026',
    documentStatus: 'pending',
    pendingDocsCount: 3,
    verifiedDocsCount: 2,
    documents: [
      { id: 'doc-1', title: 'Ijazah / SKL', filename: 'SKL_Bagas.pdf', status: 'verified', notes: 'Valid.' },
      { id: 'doc-2', title: 'KTP', filename: 'KTP_Bagas.jpg', status: 'verified', notes: 'Valid.' },
      { id: 'doc-3', title: 'Kartu Keluarga', filename: 'KK_Bagas.pdf', status: 'pending', notes: 'Scan terpotong pada bagian bawah.' },
      { id: 'doc-4', title: 'Pas Foto 4x6', filename: 'Foto_Bagas.jpg', status: 'pending', notes: 'Menunggu konfirmasi.' },
      { id: 'doc-5', title: 'Surat Kesehatan', filename: 'Surat_Kesehatan.pdf', status: 'pending', notes: 'Menunggu verifikasi.' },
    ],
    payments: {
      registrationFee: { id: 'INV-REG-2026-08497', amount: 250000, status: 'paid', paidAt: '18 Sep 2026, 15:40 WIB', method: 'VA BSI' },
      uktFee: { id: 'INV-UKT-2026-0047', amount: 4250000, status: 'pending', dueDate: '28 Okt 2026', method: 'VA BSI' },
    },
    selection: {
      cbtScore: 65,
      interviewScore: 68,
      interviewer: 'Ir. Hendra Gunawan, M.T.',
      interviewNotes: 'Skor CBT di bawah ambang batas passing grade 70.',
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

export const useAdminStore = defineStore('admin', () => {
  const applicantStore = useApplicantStore();

  const loadInitialData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse admin data from storage:', e);
    }
    return JSON.parse(JSON.stringify(defaultApplicants));
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

  // Helper: Cek apakah ID pendaftar adalah kandidat aktif yang sedang login
  const isCurrentApplicant = (applicantId) => {
    const activeReg = applicantStore.state.candidate?.registrationNumber;
    return applicantId === activeReg || applicantId === 'current-user';
  };

  // Sinkronisasi dinamis pendaftar aktif ke meja kerja admin
  const syncCurrentApplicant = () => {
    const candidate = applicantStore.state.candidate;
    if (!candidate || !candidate.registrationNumber) return;

    const existingIndex = applicants.value.findIndex(
      (a) => a.id === candidate.registrationNumber || (candidate.email && a.email === candidate.email)
    );

    const verifiedDocs = applicantStore.state.documents.filter((d) => d.status === 'verified').length;
    const pendingDocs = applicantStore.state.documents.filter((d) => d.status !== 'verified').length;

    const hasPendingDoc = applicantStore.state.documents.some((d) => d.status === 'pending');
    const hasRevisionDoc = applicantStore.state.documents.some((d) => d.status === 'revision');
    const currentDocStatus = hasRevisionDoc ? 'revision' : hasPendingDoc ? 'pending' : verifiedDocs >= 3 ? 'verified' : 'pending';
    const existingSelection = existingIndex >= 0 ? applicants.value[existingIndex]?.selection : null;

    const activeApplicantData = {
      id: candidate.registrationNumber,
      nik: candidate.nik || '-',
      nisn: candidate.nisn || '-',
      fullName: candidate.fullName || 'Calon Mahasiswa Baru',
      gender: candidate.gender || 'Perempuan',
      email: candidate.email || 'pendaftar@bth.ac.id',
      phone: candidate.phone || '-',
      schoolName: candidate.schoolName || 'Asal Sekolah Belum Diisi',
      averageScore: candidate.averageScore || '85.00',
      track: applicantStore.state.admission.track || 'Jalur Reguler Gelombang 1',
      faculty: applicantStore.state.admission.prodi1Faculty || 'Fakultas Farmasi',
      prodi1: applicantStore.state.admission.prodi1 || 'Belum Ditentukan',
      prodi2: applicantStore.state.admission.prodi2 || 'Belum Ditentukan',
      registrationDate: 'Hari ini',
      documentStatus: currentDocStatus,
      pendingDocsCount: pendingDocs,
      verifiedDocsCount: verifiedDocs,
      documents: applicantStore.state.documents.map((d) => ({
        id: d.id,
        title: d.title,
        filename: d.filename || 'Belum diunggah',
        status: d.status === 'unuploaded' ? 'pending' : d.status,
        notes: d.notes || '',
      })),
      payments: {
        registrationFee: {
          id: applicantStore.state.payments.registrationFee.id,
          amount: applicantStore.state.payments.registrationFee.amount,
          status: applicantStore.state.payments.registrationFee.status,
          paidAt: applicantStore.state.payments.registrationFee.paidAt,
          method: applicantStore.state.payments.registrationFee.paymentMethod,
        },
        uktFee: {
          id: applicantStore.state.payments.uktFee.id,
          amount: applicantStore.state.payments.uktFee.amount,
          status: applicantStore.state.payments.uktFee.status,
          paidAt: applicantStore.state.payments.uktFee.paidAt,
          dueDate: applicantStore.state.payments.uktFee.dueDate,
          method: 'Virtual Account BSI / Mandiri',
        },
      },
      selection: {
        cbtScore: applicantStore.state.exam.score || 0,
        interviewScore: existingSelection?.interviewScore ?? (applicantStore.state.result.isPassed ? 88 : null),
        interviewer: existingSelection?.interviewer ?? (applicantStore.state.result.isPassed ? 'Dosen Penguji PMB BTH' : null),
        interviewNotes: existingSelection?.interviewNotes ?? (applicantStore.state.result.isPassed ? 'Pendaftar akun aktif terintegrasi sistem.' : 'Menunggu pelaksanaan tes wawancara peminatan.'),
        passedStatus: applicantStore.state.result.isPassed ? 'passed' : applicantStore.state.exam.status === 'completed' ? 'evaluating' : 'evaluating',
        decisionLetterNo: applicantStore.state.result.decisionLetterNo || null,
      },
      onboarding: {
        isEnrolled: applicantStore.isUktPaid,
        nim: applicantStore.state.onboarding.nim || null,
        pkkmbGroup: applicantStore.state.onboarding.pkkmbGroup || null,
      },
    };

    if (existingIndex >= 0) {
      applicants.value[existingIndex] = { ...applicants.value[existingIndex], ...activeApplicantData };
    } else {
      applicants.value.unshift(activeApplicantData);
    }
  };

  // Reaktif terhadap perubahan data pendaftar aktif
  watch(
    () => applicantStore.state,
    () => {
      syncCurrentApplicant();
    },
    { deep: true, immediate: true }
  );

  // Computed Key Metrics Murni Dinamis
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
    return applicants.value.filter((a) => a.selection.passedStatus === 'passed').length;
  });

  // Action: Verify specific document
  const verifyDocument = (applicantId, docId, status, notes) => {
    const applicant = applicants.value.find((a) => a.id === applicantId);
    if (!applicant) return;

    const doc = applicant.documents.find((d) => d.id === docId);
    if (doc) {
      doc.status = status;
      doc.notes = notes;
    }

    // Recompute applicant document status
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

    // Sinkronisasi dua arah ke applicantStore jika merupakan user aktif
    if (isCurrentApplicant(applicantId)) {
      const targetInApplicant = applicantStore.state.documents.find((d) => d.id === docId);
      if (targetInApplicant) {
        targetInApplicant.status = status;
        targetInApplicant.statusLabel = status === 'verified' ? 'Terverifikasi' : status === 'revision' ? 'Perlu Perbaikan' : 'Sedang Ditinjau';
        targetInApplicant.notes = notes;
      }
    }
  };

  // Action: Confirm UKT or Registration Fee
  const confirmPayment = (applicantId, paymentType) => {
    const applicant = applicants.value.find((a) => a.id === applicantId);
    if (!applicant) return;

    if (paymentType === 'uktFee') {
      applicant.payments.uktFee.status = 'paid';
      applicant.payments.uktFee.paidAt = new Date().toLocaleString('id-ID');
      if (isCurrentApplicant(applicantId)) {
        applicantStore.payUktFee();
      }
    } else if (paymentType === 'registrationFee') {
      applicant.payments.registrationFee.status = 'paid';
      applicant.payments.registrationFee.paidAt = new Date().toLocaleString('id-ID');
      if (isCurrentApplicant(applicantId)) {
        applicantStore.payRegFee();
      }
    }
  };

  // Action: Update Interview Score & Academic Decision
  const updateInterview = (applicantId, score, notes, interviewer) => {
    const applicant = applicants.value.find((a) => a.id === applicantId);
    if (!applicant) return;

    applicant.selection.interviewScore = Number(score);
    applicant.selection.interviewNotes = notes;
    if (interviewer) applicant.selection.interviewer = interviewer;

    const avg = (applicant.selection.cbtScore + Number(score)) / 2;
    if (avg >= 70) {
      applicant.selection.passedStatus = 'passed';
      if (!applicant.selection.decisionLetterNo) {
        applicant.selection.decisionLetterNo = `08${Math.floor(Math.random() * 90 + 10)}/SK-PMB/UBTH/X/2026`;
      }
    } else {
      applicant.selection.passedStatus = 'failed';
    }

    if (isCurrentApplicant(applicantId)) {
      applicantStore.state.result.isPassed = applicant.selection.passedStatus === 'passed';
      if (applicant.selection.decisionLetterNo) {
        applicantStore.state.result.decisionLetterNo = applicant.selection.decisionLetterNo;
      }
    }
  };

  // Action: Generate Official NIM & Plot Gugus
  const generateNim = (applicantId, customNim, group) => {
    const applicant = applicants.value.find((a) => a.id === applicantId);
    if (!applicant) return;

    applicant.onboarding.isEnrolled = true;
    applicant.onboarding.nim = customNim || `2601${Math.floor(Math.random() * 9000 + 1000)}`;
    applicant.onboarding.pkkmbGroup = group || 'Gugus 01 - Hygeia Farmasi';

    if (isCurrentApplicant(applicantId)) {
      applicantStore.state.onboarding.nim = applicant.onboarding.nim;
      applicantStore.state.onboarding.pkkmbGroup = applicant.onboarding.pkkmbGroup;
    }
  };

  // Action: Reset admin data
  const resetAdminData = () => {
    applicants.value = JSON.parse(JSON.stringify(defaultApplicants));
    syncCurrentApplicant();
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    applicants,
    totalApplicants,
    pendingVerificationCount,
    totalPaidRevenue,
    passedStudentsCount,
    verifyDocument,
    confirmPayment,
    updateInterview,
    generateNim,
    syncCurrentApplicant,
    resetAdminData,
  };
});
