import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useAuthStore } from './auth';

/**
 * Generate nomor registrasi resmi format BTH-2026-REG-XXXXX
 */
function generateRegNumber(userId, email) {
  const seed = String(userId || email || 'CANDIDATE')
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const num = (Math.abs(seed * 73) % 90000) + 10000;
  return `BTH-2026-REG-${num}`;
}

/**
 * Master Metadata Program Studi Universitas BTH
 */
export const PRODI_METADATA = {
  'S1 Farmasi': {
    code: '01',
    faculty: 'Fakultas Farmasi',
    degree: 'S.Farm.',
    uktFee: 6500000,
    gugus: 'Gugus 01 - Hygeia Farmasi',
  },
  'S1 Teknologi Informasi': {
    code: '02',
    faculty: 'Fakultas Teknologi & Bisnis',
    degree: 'S.Kom.',
    uktFee: 4500000,
    gugus: 'Gugus 07 - Turing Informatika',
  },
  'S1 Administrasi Rumah Sakit': {
    code: '03',
    faculty: 'Fakultas Ilmu Kesehatan',
    degree: 'S.Kes.',
    uktFee: 4500000,
    gugus: 'Gugus 05 - Asklepios Kesehatan',
  },
  'D3 Analis Kesehatan (TLM)': {
    code: '04',
    faculty: 'Fakultas Ilmu Kesehatan',
    degree: 'A.Md.Kes.',
    uktFee: 4750000,
    gugus: 'Gugus 05 - Asklepios Kesehatan',
  },
  'D3 Farmasi': {
    code: '05',
    faculty: 'Fakultas Farmasi',
    degree: 'A.Md.Farm.',
    uktFee: 4800000,
    gugus: 'Gugus 02 - Galen Kefarmasian',
  },
  'S1 Manajemen Bisnis Informasi': {
    code: '06',
    faculty: 'Fakultas Teknologi & Bisnis',
    degree: 'S.M.',
    uktFee: 4250000,
    gugus: 'Gugus 08 - Lovelace Komputer',
  },
};

/**
 * Inisialisasi state awal pendaftaran calon mahasiswa
 */
function createInitialState(user) {
  const regNo = generateRegNumber(user?.id, user?.email);
  const regSuffix = regNo.split('-').pop() || String(Math.floor(10000 + Math.random() * 90000));

  return {
    candidate: {
      registrationNumber: regNo,
      fullName: user?.full_name || '',
      nik: '',
      nisn: '',
      email: user?.email || '',
      phone: user?.phone || '',
      gender: '',
      birthPlace: '',
      birthDate: '',
      religion: '',
      citizenship: 'WNI',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      schoolName: '',
      schoolMajor: '',
      graduationYear: '',
      averageScore: '',
      fatherName: '',
      fatherJob: '',
      motherName: '',
      motherJob: '',
      parentIncome: '',
      emergencyContact: '',
    },
    admission: {
      track: 'Jalur Reguler Gelombang 1',
      academicYear: '2026/2027',
      prodi1: '',
      prodi1Faculty: '',
      prodi1Degree: '',
      prodi2: '',
      prodi2Faculty: '',
      prodi2Degree: '',
      quotaWave1: 120,
      status: 'Pengisian Formulir Pendaftaran',
    },
    documents: [
      {
        id: 'doc-1',
        title: 'Ijazah / Surat Keterangan Lulus (SKL)',
        category: 'Akademik',
        required: true,
        filename: '',
        filesize: '',
        uploadDate: '',
        status: 'unuploaded',
        statusLabel: 'Belum Diunggah',
        notes: 'Unggah pindaian (scan) Ijazah atau SKL asli berlegalisir.',
      },
      {
        id: 'doc-2',
        title: 'Kartu Tanda Penduduk (KTP) / Kartu Pelajar',
        category: 'Identitas',
        required: true,
        filename: '',
        filesize: '',
        uploadDate: '',
        status: 'unuploaded',
        statusLabel: 'Belum Diunggah',
        notes: 'Pindaian KTP / KIA / Kartu Pelajar yang masih berlaku.',
      },
      {
        id: 'doc-3',
        title: 'Kartu Keluarga (KK)',
        category: 'Identitas',
        required: true,
        filename: '',
        filesize: '',
        uploadDate: '',
        status: 'unuploaded',
        statusLabel: 'Belum Diunggah',
        notes: 'Kartu Keluarga terbaru dengan barcode resmi Disdukcapil.',
      },
      {
        id: 'doc-4',
        title: 'Pas Foto Resmi 4x6 (Latar Merah)',
        category: 'Identitas',
        required: true,
        filename: '',
        filesize: '',
        uploadDate: '',
        status: 'unuploaded',
        statusLabel: 'Belum Diunggah',
        notes: 'Pas foto formal terbaru dengan pakaian berkerah latar belakang merah.',
      },
      {
        id: 'doc-5',
        title: 'Surat Keterangan Sehat & Bebas Buta Warna',
        category: 'Kesehatan',
        required: true,
        filename: '',
        filesize: '',
        uploadDate: '',
        status: 'unuploaded',
        statusLabel: 'Belum Diunggah',
        notes: 'Surat dokter resmi dari Puskesmas, Rumah Sakit, atau Klinik.',
      },
    ],
    payments: {
      registrationFee: {
        id: `INV-REG-2026-${regSuffix}`,
        title: 'Biaya Formulir Pendaftaran PMB',
        amount: 250000,
        status: 'pending',
        statusLabel: 'Menunggu Pembayaran',
        paidAt: null,
        paymentMethod: 'Virtual Account BSI',
        vaNumber: `900 1208 ${regSuffix} 0128`,
      },
      uktFee: {
        id: `INV-UKT-2026-${regSuffix}`,
        title: 'Biaya Daftar Ulang & UKT Semester 1',
        amount: 6500000,
        status: 'pending',
        statusLabel: 'Menunggu Pembayaran',
        dueDate: '28 Oktober 2026',
        vaBsi: `900 7800 0026 ${regSuffix}`,
        vaMandiri: `8870 8260 1004 ${regSuffix}`,
        paidAt: null,
      },
    },
    schedule: {
      cbt: {
        date: 'Sabtu, 18 Oktober 2026',
        time: '08:30 - 10:00 WIB',
        room: 'Laboratorium CBT Kampus BTH / Daring Mandiri',
        serverUrl: 'https://cbt.universitas-bth.ac.id',
        sessionName: 'Sesi 1 (Pagi)',
      },
      interview: {
        date: 'Senin, 20 Oktober 2026',
        time: '09:00 - 11:30 WIB',
        location: 'Ruang Wawancara Kampus BTH / Daring PMB',
      },
      announcementDate: 'Jumat, 24 Oktober 2026',
    },
    exam: {
      status: 'scheduled',
      score: 0,
      maxScore: 100,
      totalQuestions: 5,
      correctAnswers: 0,
      passedStatus: 'Menunggu Pengerjaan Ujian',
      completedAt: null,
    },
    result: {
      isAnnounced: false,
      isPassed: false,
      acceptedProdi: '',
      acceptedFaculty: '',
      acceptedDegree: '',
      decisionLetterNo: '',
      decisionDate: '24 Oktober 2026',
      reRegistrationPeriod: '25 Oktober - 05 November 2026',
    },
    onboarding: {
      nim: '',
      studentEmail: '',
      faculty: '',
      studyProgram: '',
      pkkmbGroup: '',
      siakadAccess: 'Aktif setelah pelunasan UKT',
    },
  };
}

export const useApplicantStore = defineStore('applicant', () => {
  const authStore = useAuthStore();

  const getStorageKey = () => {
    const userId = authStore.currentUser?.id || authStore.currentUser?.email || 'default';
    return `bth_applicant_v3_${userId}`;
  };

  const loadInitialData = () => {
    const key = getStorageKey();
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (authStore.currentUser) {
          parsed.candidate.fullName = authStore.currentUser.full_name || parsed.candidate.fullName || '';
          parsed.candidate.email = authStore.currentUser.email || parsed.candidate.email || '';
          parsed.candidate.phone = authStore.currentUser.phone || parsed.candidate.phone || '';
        }
        // Clean legacy pre-filled dummy values if any
        if (parsed.payments?.registrationFee?.paidAt === 'Terverifikasi Otomatis') {
          parsed.payments.registrationFee.status = 'pending';
          parsed.payments.registrationFee.statusLabel = 'Menunggu Pembayaran';
          parsed.payments.registrationFee.paidAt = null;
        }
        if (!parsed.candidate?.nik && parsed.admission?.prodi1 === 'S1 Farmasi') {
          parsed.admission.prodi1 = '';
          parsed.admission.prodi1Faculty = '';
          parsed.admission.prodi1Degree = '';
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Gagal memuat data pendaftar dari storage:', e);
    }
    return createInitialState(authStore.currentUser);
  };

  const state = ref(loadInitialData());

  watch(
    state,
    (newVal) => {
      try {
        const key = getStorageKey();
        localStorage.setItem(key, JSON.stringify(newVal));
      } catch (e) {
        console.warn('Gagal menyimpan data pendaftar:', e);
      }
    },
    { deep: true }
  );

  watch(
    () => authStore.currentUser,
    (newUser) => {
      if (newUser) {
        state.value.candidate.fullName = newUser.full_name || state.value.candidate.fullName || '';
        state.value.candidate.email = newUser.email || state.value.candidate.email || '';
        state.value.candidate.phone = newUser.phone || state.value.candidate.phone || '';
      }
    }
  );

  const isProfileComplete = computed(() => {
    const c = state.value.candidate;
    return !!(c.fullName && c.nik && c.schoolName && c.phone);
  });

  const isAdmissionComplete = computed(() => {
    return !!state.value.admission.prodi1;
  });

  const uploadedDocsCount = computed(() => {
    return state.value.documents.filter((d) => d.status !== 'unuploaded').length;
  });

  const isDocumentsComplete = computed(() => {
    return uploadedDocsCount.value >= 3;
  });

  const isRegPaymentComplete = computed(() => {
    return state.value.payments.registrationFee.status === 'paid';
  });

  const isScheduleReady = computed(() => {
    return isRegPaymentComplete.value;
  });

  const isExamCompleted = computed(() => {
    return state.value.exam.status === 'completed';
  });

  const isResultPassed = computed(() => {
    return state.value.result.isPassed;
  });

  const isUktPaid = computed(() => {
    return state.value.payments.uktFee.status === 'paid';
  });

  const completedStepsCount = computed(() => {
    let count = 0;
    if (isProfileComplete.value) count++;
    if (isAdmissionComplete.value) count++;
    if (isDocumentsComplete.value) count++;
    if (isRegPaymentComplete.value) count++;
    if (isExamCompleted.value) count++;
    if (isResultPassed.value) count++;
    return count;
  });

  const progressPercent = computed(() => {
    return Math.round((completedStepsCount.value / 6) * 100);
  });

  const overallStatus = computed(() => {
    if (isUktPaid.value) {
      return {
        label: 'Mahasiswa Baru Terdaftar',
        shortLabel: 'Terdaftar',
        theme: 'emerald',
        description: 'Pembayaran UKT lunas. Silakan lakukan verifikasi fisik & pengambilan almamater di BAAK.',
      };
    }
    if (isResultPassed.value) {
      return {
        label: 'Lulus Seleksi (LoA Siap)',
        shortLabel: 'Lulus Seleksi',
        theme: 'emerald',
        description: 'Dinyatakan diterima. Silakan unduh Surat Penerimaan (LoA) dan selesaikan daftar ulang.',
      };
    }
    if (isExamCompleted.value) {
      return {
        label: 'Ujian Selesai (Proses Nilai)',
        shortLabel: 'Evaluasi Nilai',
        theme: 'blue',
        description: 'Ujian CBT telah diselesaikan. Nilai dan surat kelulusan sedang diproses panitia PMB.',
      };
    }
    if (isRegPaymentComplete.value) {
      return {
        label: 'Sesi Ujian CBT Aktif',
        shortLabel: 'Siap Ujian CBT',
        theme: 'indigo',
        description: 'Biaya formulir lunas. Silakan ikuti Ujian CBT Online sesuai jadwal yang ditentukan.',
      };
    }
    if (isDocumentsComplete.value) {
      return {
        label: 'Menunggu Pembayaran Formulir',
        shortLabel: 'Menunggu Bayar',
        theme: 'amber',
        description: 'Berkas persyaratan lengkap. Selesaikan pembayaran biaya formulir untuk aktivasi sesi CBT.',
      };
    }
    if (isAdmissionComplete.value) {
      return {
        label: 'Pemberkasan Dokumen',
        shortLabel: 'Pemberkasan',
        theme: 'amber',
        description: 'Program studi terpilih. Silakan lengkapi dan unggah berkas persyaratan pendaftaran.',
      };
    }
    if (isProfileComplete.value) {
      return {
        label: 'Pemilihan Program Studi',
        shortLabel: 'Pilih Prodi',
        theme: 'blue',
        description: 'Biodata terisi. Silakan pilih program studi prioritas Anda.',
      };
    }
    return {
      label: 'Pengisian Formulir Pendaftaran',
      shortLabel: 'Isi Formulir',
      theme: 'slate',
      description: 'Lengkapi identitas diri dan asal sekolah untuk memulai proses seleksi PMB.',
    };
  });

  watch(
    overallStatus,
    (statusObj) => {
      if (state.value.admission) {
        state.value.admission.status = statusObj.label;
      }
    },
    { immediate: true }
  );

  const updateProfile = (data) => {
    state.value.candidate = { ...state.value.candidate, ...data };
  };

  const updateAdmission = (data) => {
    state.value.admission = { ...state.value.admission, ...data };
    if (data.prodi1) {
      const meta = PRODI_METADATA[data.prodi1];
      const faculty = meta?.faculty || data.prodi1Faculty || state.value.admission.prodi1Faculty;
      const degree = meta?.degree || data.prodi1Degree || state.value.admission.prodi1Degree;

      state.value.admission.prodi1Faculty = faculty;
      state.value.admission.prodi1Degree = degree;
      state.value.result.acceptedProdi = data.prodi1;
      state.value.result.acceptedFaculty = faculty;
      state.value.result.acceptedDegree = degree;
      state.value.onboarding.studyProgram = data.prodi1;
      state.value.onboarding.faculty = faculty;

      // Update nominal tagihan UKT dinamis sesuai prodi pilihan
      if (meta?.uktFee && state.value.payments?.uktFee) {
        state.value.payments.uktFee.amount = meta.uktFee;
      }
    }
  };

  const uploadDocument = (docId, fileInfo) => {
    const doc = state.value.documents.find((d) => d.id === docId);
    if (doc) {
      doc.filename = fileInfo.name;
      doc.filesize = fileInfo.size;
      doc.uploadDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      doc.status = 'pending';
      doc.statusLabel = 'Sedang Ditinjau';
      doc.notes = 'Berkas berhasil diunggah. Menunggu pemeriksaan dan verifikasi tim panitia PMB.';
    }
  };

  const payRegFee = () => {
    state.value.payments.registrationFee.status = 'paid';
    state.value.payments.registrationFee.statusLabel = 'Lunas';
    state.value.payments.registrationFee.paidAt = new Date().toLocaleString('id-ID');
  };

  const payUktFee = () => {
    state.value.payments.uktFee.status = 'paid';
    state.value.payments.uktFee.statusLabel = 'Lunas';
    state.value.payments.uktFee.paidAt = new Date().toLocaleString('id-ID');

    if (!state.value.onboarding.nim) {
      const regSuffix = state.value.candidate.registrationNumber.split('-').pop() || '0042';
      const yearPrefix = '26';
      const selectedProdi = state.value.admission.prodi1 || 'S1 Farmasi';
      const meta = PRODI_METADATA[selectedProdi] || {
        code: '01',
        faculty: 'Fakultas Farmasi',
        degree: 'S.Farm.',
        uktFee: 6500000,
        gugus: 'Gugus 01 - Hygeia Farmasi',
      };
      const prodiCode = meta.code;
      state.value.onboarding.nim = `${yearPrefix}${prodiCode}${regSuffix.slice(-4)}`;
      
      const emailName = (state.value.candidate.fullName || 'mahasiswa')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '.');
      state.value.onboarding.studentEmail = `${emailName}@bth.ac.id`;
      state.value.onboarding.studyProgram = selectedProdi;
      state.value.onboarding.faculty = meta.faculty || state.value.admission.prodi1Faculty;
      state.value.onboarding.pkkmbGroup = meta.gugus;
    }
  };

  const submitExam = (score, correctCount) => {
    state.value.exam.status = 'completed';
    state.value.exam.score = score;
    state.value.exam.correctAnswers = correctCount;
    state.value.exam.completedAt = new Date().toLocaleString('id-ID');

    const isPass = score >= 70;
    state.value.exam.passedStatus = isPass ? 'Lulus Passing Grade (Min. 70)' : 'Belum Memenuhi Passing Grade';
    
    state.value.result.isAnnounced = true;
    state.value.result.isPassed = isPass;
    state.value.result.acceptedProdi = state.value.admission.prodi1;
    state.value.result.acceptedFaculty = state.value.admission.prodi1Faculty;
    state.value.result.acceptedDegree = state.value.admission.prodi1Degree;
    if (isPass) {
      const regSuffix = state.value.candidate.registrationNumber.split('-').pop() || '082';
      state.value.result.decisionLetterNo = `${regSuffix.slice(-3)}/SK-PMB/UBTH/X/2026`;
    }
    state.value.admission.status = isPass ? 'Dinyatakan Lulus Seleksi' : 'Selesai Ujian CBT';
  };

  const resetAllData = () => {
    state.value = createInitialState(authStore.currentUser);
    try {
      localStorage.removeItem(getStorageKey());
    } catch (e) {
      console.warn('Gagal menghapus storage pendaftar:', e);
    }
  };

  return {
    state,
    overallStatus,
    isProfileComplete,
    isAdmissionComplete,
    uploadedDocsCount,
    isDocumentsComplete,
    isRegPaymentComplete,
    isScheduleReady,
    isExamCompleted,
    isResultPassed,
    isUktPaid,
    completedStepsCount,
    progressPercent,
    updateProfile,
    updateAdmission,
    uploadDocument,
    payRegFee,
    payUktFee,
    submitExam,
    resetAllData,
  };
});
