import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useAuthStore } from './auth';
import {
  identityApi,
  admissionApi,
  financeApi,
  examApi,
  selectionApi,
  studentApi,
} from '@/api';

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
      photoUrl: user?.avatar || '',
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
        fileBlobUrl: null,
        fileType: '',
        uploadDate: '',
        status: 'unuploaded',
        statusLabel: 'Belum Diunggah',
        notes: 'Unggah pindaian Ijazah atau SKL asli terlegalisasi.',
      },
      {
        id: 'doc-2',
        title: 'Kartu Tanda Penduduk (KTP) / Kartu Pelajar',
        category: 'Identitas',
        required: true,
        filename: '',
        filesize: '',
        fileBlobUrl: null,
        fileType: '',
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
        fileBlobUrl: null,
        fileType: '',
        uploadDate: '',
        status: 'unuploaded',
        statusLabel: 'Belum Diunggah',
        notes: 'Kartu Keluarga terbaru dengan barcode resmi Disdukcapil.',
      },
      {
        id: 'doc-4',
        title: 'Pas Foto Resmi 4x6',
        category: 'Identitas',
        required: true,
        filename: '',
        filesize: '',
        fileBlobUrl: null,
        fileType: '',
        uploadDate: '',
        status: 'unuploaded',
        statusLabel: 'Belum Diunggah',
        notes: 'Pasfoto formal pakaian berkerah ukuran 4x6.',
      },
      {
        id: 'doc-5',
        title: 'Surat Keterangan Sehat',
        category: 'Kesehatan',
        required: true,
        filename: '',
        filesize: '',
        fileBlobUrl: null,
        fileType: '',
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
  const isSyncingBackend = ref(false);
  const lastBackendSync = ref(null);

  const getStorageKey = (user = authStore.currentUser) => {
    const userId = user?.id || user?.email;
    if (!userId) return null;
    return `bth_applicant_v3_${userId}`;
  };

  const loadInitialData = (user = authStore.currentUser) => {
    const key = getStorageKey(user);
    if (key) {
      try {
        const saved = localStorage.getItem(key);
        if (saved) {
          const parsed = JSON.parse(saved);
          const initial = createInitialState(user);
          const merged = {
            ...initial,
            ...parsed,
            candidate: { ...initial.candidate, ...(parsed.candidate || {}) },
            admission: { ...initial.admission, ...(parsed.admission || {}) },
            payments: {
              ...initial.payments,
              ...(parsed.payments || {}),
              regFee: { ...initial.payments.regFee, ...(parsed.payments?.regFee || {}) },
              uktFee: { ...initial.payments.uktFee, ...(parsed.payments?.uktFee || {}) }
            },
            schedule: { ...initial.schedule, ...(parsed.schedule || {}) },
            exam: { ...initial.exam, ...(parsed.exam || {}) },
            result: { ...initial.result, ...(parsed.result || {}) },
            onboarding: { ...initial.onboarding, ...(parsed.onboarding || {}) },
            documents: (parsed.documents || initial.documents).map((doc) => {
              const initDoc = initial.documents.find((d) => d.id === doc.id);
              return {
                ...doc,
                title: initDoc?.title || doc.title,
                notes: initDoc?.notes || doc.notes,
              };
            }),
          };

          // Sinkronisasi foto pasfoto doc-4 ke candidate.photoUrl & avatar pengguna
          const doc4 = merged.documents.find((d) => d.id === 'doc-4');
          if (doc4?.fileBlobUrl && !merged.candidate.photoUrl) {
            merged.candidate.photoUrl = doc4.fileBlobUrl;
          } else if (merged.candidate.photoUrl && doc4 && !doc4.fileBlobUrl) {
            doc4.fileBlobUrl = merged.candidate.photoUrl;
          }
          if (merged.candidate.photoUrl && user && !user.avatar && authStore?.updateUserAvatar) {
            authStore.updateUserAvatar(merged.candidate.photoUrl);
          }

          if (user) {
            merged.candidate.fullName = user.full_name || merged.candidate.fullName || '';
            merged.candidate.email = user.email || merged.candidate.email || '';
            merged.candidate.phone = user.phone || merged.candidate.phone || '';
          }
          return merged;
        }
      } catch (e) {
        console.warn('Gagal memuat data pendaftar dari storage:', e);
      }
    }
    // Jika belum ada data tersimpan untuk akun ini (pendaftar baru), buat state 100% bersih!
    return createInitialState(user);
  };

  const state = ref(loadInitialData());

  watch(
    state,
    (newVal) => {
      try {
        const key = getStorageKey();
        if (key && authStore.currentUser) {
          localStorage.setItem(key, JSON.stringify(newVal));
        }
      } catch (e) {
        console.warn('Gagal menyimpan data pendaftar:', e);
      }
    },
    { deep: true }
  );

  let lastHandledUserId = authStore.currentUser?.id || null;

  // State navigasi aktif (Halaman Utama, Data Saya, Jalur Pendaftaran, Proses Seleksi, Daftar Ulang)
  const activeTab = ref('overview');
  const activeSection = ref(null);

  const setActiveTab = (tab, section = null) => {
    activeTab.value = tab;
    activeSection.value = section;
    if (section) {
      setTimeout(() => {
        const el = document.getElementById(section);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  };

  watch(
    () => authStore.currentUser,
    (newUser) => {
      const currentId = newUser?.id || null;
      if (currentId !== lastHandledUserId) {
        lastHandledUserId = currentId;
        // User berganti (login akun baru, registrasi akun baru, atau logout)!
        // Selalu muat data spesifik akun tersebut atau reset ke state bersih.
        state.value = loadInitialData(newUser);
      } else if (newUser) {
        state.value.candidate.fullName = newUser.full_name || state.value.candidate.fullName || '';
        state.value.candidate.email = newUser.email || state.value.candidate.email || '';
        state.value.candidate.phone = newUser.phone || state.value.candidate.phone || '';
      }
    },
    { deep: true }
  );

  const isProfileComplete = computed(() => {
    const c = state.value?.candidate;
    if (!c) return false;
    return !!(c.fullName && c.nik && c.schoolName && c.phone);
  });

  const isAdmissionComplete = computed(() => {
    return !!(state.value?.admission?.prodi1 && state.value?.admission?.track);
  });

  const uploadedDocsCount = computed(() => {
    return (state.value?.documents || []).filter((d) => d.status !== 'unuploaded').length;
  });

  const isDocumentsComplete = computed(() => {
    return uploadedDocsCount.value >= 3;
  });

  const isDocumentsVerified = computed(() => {
    const docs = state.value?.documents || [];
    return docs.length > 0 && docs.every((d) => d.status === 'verified');
  });

  const isRegPaymentComplete = computed(() => {
    return state.value?.payments?.registrationFee?.status === 'paid';
  });

  const isScheduleReady = computed(() => {
    return isRegPaymentComplete.value;
  });

  const isExamCompleted = computed(() => {
    return state.value?.exam?.status === 'completed';
  });

  const isResultPassed = computed(() => {
    return !!state.value?.result?.isPassed;
  });

  const isUktPaid = computed(() => {
    return state.value?.payments?.uktFee?.status === 'paid';
  });

  // 6 Tahapan Terpadu PMB (Profil -> Jalur Pendaftaran -> Berkas -> Biaya Pendaftaran -> Ujian Seleksi -> Hasil & Daftar Ulang)
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
        description: 'Biaya formulir lunas dikonfirmasi admin. Silakan ikuti Ujian CBT Online sesuai jadwal yang ditentukan.',
      };
    }
    if (state.value?.payments?.registrationFee?.status === 'pending_confirmation') {
      return {
        label: 'Menunggu Konfirmasi Pembayaran Admin',
        shortLabel: 'Verifikasi Bayar',
        theme: 'amber',
        description: 'Pembayaran formulir telah dikirimkan. Menunggu verifikasi dan konfirmasi lunas oleh admin keuangan.',
      };
    }
    if (isDocumentsComplete.value) {
      return {
        label: 'Menunggu Pembayaran Formulir',
        shortLabel: 'Menunggu Bayar',
        theme: 'amber',
        description: 'Berkas persyaratan berhasil diunggah (dalam peninjauan panitia). Selesaikan pembayaran formulir untuk aktivasi sesi CBT.',
      };
    }
    if (isProfileComplete.value && isAdmissionComplete.value) {
      return {
        label: 'Pemberkasan Dokumen',
        shortLabel: 'Pemberkasan',
        theme: 'blue',
        description: 'Formulir biodata & pilihan prodi lengkap. Silakan lengkapi dan unggah berkas persyaratan pendaftaran.',
      };
    }
    if (isProfileComplete.value) {
      return {
        label: 'Pilihan Jalur Pendaftaran',
        shortLabel: 'Pilih Jalur',
        theme: 'blue',
        description: 'Biodata profil telah lengkap. Silakan tentukan jalur pendaftaran dan pilihan program studi Anda.',
      };
    }
    return {
      label: 'Pengisian Formulir Biodata',
      shortLabel: 'Isi Biodata',
      theme: 'slate',
      description: 'Lengkapi identitas diri, domisili, orang tua, dan asal sekolah Anda.',
    };
  });

  // Foto profil calon mahasiswa terhubung langsung dari pasfoto (doc-4) atau akun
  const candidatePhoto = computed(() => {
    const doc4 = state.value?.documents?.find((d) => d.id === 'doc-4');
    return (
      doc4?.fileBlobUrl ||
      state.value?.candidate?.photoUrl ||
      authStore.currentUser?.avatar ||
      null
    );
  });

  const hasCandidatePhoto = computed(() => !!candidatePhoto.value);

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
      const faculty = data.prodi1Faculty || meta?.faculty || state.value.admission.prodi1Faculty;
      const degree = data.prodi1Degree || meta?.degree || state.value.admission.prodi1Degree;
      const nimCode = data.prodi1NimCode || meta?.code || '01';
      const prodiCode = data.prodi1Code || meta?.code || 'FARM';

      state.value.admission.prodi1Code = prodiCode;
      state.value.admission.prodi1NimCode = nimCode;
      state.value.admission.prodi1Faculty = faculty;
      state.value.admission.prodi1Degree = degree;
      if (state.value.result) {
        state.value.result.acceptedProdi = data.prodi1;
        state.value.result.acceptedFaculty = faculty;
        state.value.result.acceptedDegree = degree;
      }
      if (state.value.onboarding) {
        state.value.onboarding.studyProgram = data.prodi1;
        state.value.onboarding.faculty = faculty;
      }

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
      doc.fileBlobUrl = fileInfo.fileBlobUrl || fileInfo.blobUrl || null;
      doc.fileType = fileInfo.fileType || '';
      doc.uploadDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      doc.status = 'pending';
      doc.statusLabel = 'Sedang Ditinjau';
      doc.notes = fileInfo.notes || 'Berkas berhasil diunggah. Menunggu pemeriksaan dan verifikasi tim panitia PMB.';
    }

    // Jika berkas yang diunggah adalah doc-4 (pasfoto), otomatis set sebagai foto profil akun
    if (docId === 'doc-4') {
      const photoUrl = fileInfo.fileBlobUrl || fileInfo.blobUrl || null;
      if (photoUrl) {
        state.value.candidate.photoUrl = photoUrl;
        if (authStore?.updateUserAvatar) {
          authStore.updateUserAvatar(photoUrl);
        }
      }
    }
  };

  const submitRegPayment = (note = 'Pengajuan pembayaran via Virtual Account BSI') => {
    state.value.payments.registrationFee.status = 'pending_confirmation';
    state.value.payments.registrationFee.statusLabel = 'Menunggu Konfirmasi Admin';
    state.value.payments.registrationFee.submittedAt = new Date().toLocaleString('id-ID');
    state.value.payments.registrationFee.notes = note;
  };

  const payRegFee = (confirmedBy = 'Panitia PMB / Biro Keuangan BTH') => {
    state.value.payments.registrationFee.status = 'paid';
    state.value.payments.registrationFee.statusLabel = 'Lunas (Dikonfirmasi Admin)';
    state.value.payments.registrationFee.confirmedBy = confirmedBy;
    state.value.payments.registrationFee.paidAt = new Date().toLocaleString('id-ID');
  };

  const submitUktPayment = (note = 'Pengajuan pelunasan UKT Semester 1 via Virtual Account') => {
    state.value.payments.uktFee.status = 'pending_confirmation';
    state.value.payments.uktFee.statusLabel = 'Menunggu Konfirmasi Admin';
    state.value.payments.uktFee.submittedAt = new Date().toLocaleString('id-ID');
    state.value.payments.uktFee.notes = note;
  };

  const payUktFee = (confirmedBy = 'Panitia PMB / Biro Keuangan BTH') => {
    state.value.payments.uktFee.status = 'paid';
    state.value.payments.uktFee.statusLabel = 'Lunas (Dikonfirmasi Admin)';
    state.value.payments.uktFee.confirmedBy = confirmedBy;
    state.value.payments.uktFee.paidAt = new Date().toLocaleString('id-ID');

    if (!state.value.onboarding.nim) {
      const regSuffix = state.value.candidate.registrationNumber.split('-').pop() || '0042';
      // Format Standar PRD Fase 2 (Bagian 4.10): {YY}{nim_code_prodi}{jalur_digit}{urut 4}
      // Contoh: 26 (Tahun) + 55 (Prodi TI) + 1 (Reguler) + 0042 (Urut) = 265510042
      const yearPrefix = '26';
      const selectedProdi = state.value.admission.prodi1 || 'S1 Farmasi';
      const meta = PRODI_METADATA[selectedProdi] || {
        code: '01',
        faculty: 'Fakultas Farmasi',
        degree: 'S.Farm.',
        uktFee: 6500000,
        gugus: 'Gugus 01 - Hygeia Farmasi',
      };
      
      const nimCode = String(state.value.admission.prodi1NimCode || meta.code || '01').padStart(2, '0');
      
      // Jalur digit: 1=reguler, 2=prestasi, 3=beasiswa, 4=pindahan (PRD Fase 2)
      let jalurDigit = '1';
      const trackName = (state.value.admission.track || '').toLowerCase();
      if (trackName.includes('prestasi')) jalurDigit = '2';
      else if (trackName.includes('beasiswa')) jalurDigit = '3';
      else if (trackName.includes('pindahan')) jalurDigit = '4';

      const sequence = regSuffix.slice(-4).padStart(4, '0');
      state.value.onboarding.nim = `${yearPrefix}${nimCode}${jalurDigit}${sequence}`;
      
      const emailName = (state.value.candidate.fullName || 'mahasiswa')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '.');
      state.value.onboarding.studentEmail = `${emailName}@bth.ac.id`;
      state.value.onboarding.studyProgram = selectedProdi;
      state.value.onboarding.faculty = meta.faculty || state.value.admission.prodi1Faculty;
      state.value.onboarding.pkkmbGroup = meta.gugus || 'Gugus Mahasiswa Baru BTH';
    }
  };

  const submitExam = (score, correctCount) => {
    state.value.exam.status = 'completed';
    state.value.exam.score = score;
    state.value.exam.correctAnswers = correctCount;
    state.value.exam.completedAt = new Date().toLocaleString('id-ID');

    const isPass = score >= 70;
    state.value.exam.passedStatus = isPass ? 'Lulus Nilai Ambang Batas (Min. 70)' : 'Belum Memenuhi Nilai Ambang Batas';
    
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
      const key = getStorageKey();
      if (key) {
        localStorage.removeItem(key);
      }
      localStorage.removeItem('bth_applicant_v3_default');
    } catch (e) {
      console.warn('Gagal menghapus storage pendaftar:', e);
    }
  };

  // Sinkronisasi data menyeluruh dari microservices backend
  const syncFromBackend = async () => {
    if (!authStore.isAuthenticated) return;
    isSyncingBackend.value = true;
    try {
      // 1. Identity Service (Profil, Alamat, Orang Tua, Pendidikan)
      const profileRes = await identityApi.getProfile().catch(() => null);
      if (profileRes?.data?.data) {
        const p = profileRes.data.data;
        if (p.full_name) state.value.candidate.fullName = p.full_name;
        if (p.nik) state.value.candidate.nik = p.nik;
        if (p.birth_place) state.value.candidate.birthPlace = p.birth_place;
        if (p.birth_date) state.value.candidate.birthDate = p.birth_date;
        if (p.gender) state.value.candidate.gender = p.gender === 'L' ? 'Laki-laki' : 'Perempuan';
        if (p.phone) state.value.candidate.phone = p.phone;
        if (p.religion) state.value.candidate.religion = p.religion;
        if (p.photo_url) {
          state.value.candidate.photoUrl = p.photo_url;
          const doc4 = state.value.documents.find((d) => d.id === 'doc-4');
          if (doc4 && !doc4.fileBlobUrl) doc4.fileBlobUrl = p.photo_url;
          if (authStore?.updateUserAvatar) authStore.updateUserAvatar(p.photo_url);
        }
      }

      const addrRes = await identityApi.getAddresses().catch(() => null);
      if (addrRes?.data?.data && addrRes.data.data.length > 0) {
        const a = addrRes.data.data[0];
        if (a.street) state.value.candidate.address = a.street;
        if (a.city) state.value.candidate.city = a.city;
        if (a.province) state.value.candidate.province = a.province;
        if (a.postal_code) state.value.candidate.postalCode = a.postal_code;
      }

      const guardianRes = await identityApi.getGuardians().catch(() => null);
      if (guardianRes?.data?.data && guardianRes.data.data.length > 0) {
        guardianRes.data.data.forEach((g) => {
          if (g.relation === 'ayah') {
            state.value.candidate.fatherName = g.name;
            state.value.candidate.fatherJob = g.occupation;
            state.value.candidate.parentIncome = g.income_range;
          } else if (g.relation === 'ibu') {
            state.value.candidate.motherName = g.name;
            state.value.candidate.motherJob = g.occupation;
          }
        });
      }

      const eduRes = await identityApi.getEducation().catch(() => null);
      if (eduRes?.data?.data) {
        const e = eduRes.data.data;
        if (e.school_name) state.value.candidate.schoolName = e.school_name;
        if (e.major) state.value.candidate.schoolMajor = e.major;
        if (e.graduation_year) state.value.candidate.graduationYear = String(e.graduation_year);
      }

      // 2. Admission Service (Pilihan Prodi, Status, & Berkas Dokumen)
      const appRes = await admissionApi.getMyApplications().catch(() => null);
      if (appRes?.data?.data && appRes.data.data.length > 0) {
        const app = appRes.data.data[0];
        if (app.id) state.value.admission.applicationId = app.id;
        if (app.registration_no || app.application_number) {
          state.value.candidate.registrationNumber = app.registration_no || app.application_number;
        }
        if (app.admission_path?.name) state.value.admission.track = app.admission_path.name;
        if (app.choice_1_name) state.value.admission.prodi1 = app.choice_1_name;
        if (app.choice_2_name) state.value.admission.prodi2 = app.choice_2_name;
        if (app.status) state.value.admission.backendStatus = app.status;

        // Muat detail berkas terunggah & status verifikasi dari backend
        if (app.id) {
          const detailRes = await admissionApi.getApplicationById(app.id).catch(() => null);
          const docs = detailRes?.data?.data?.documents || app.documents;
          if (docs && Array.isArray(docs)) {
            const DOC_MAP = {
              ijazah: 'doc-1',
              ktp: 'doc-2',
              kk: 'doc-3',
              pas_foto: 'doc-4',
              surat_sehat: 'doc-5',
              rapor: 'doc-6',
              sertifikat_prestasi: 'doc-6',
            };
            docs.forEach((ad) => {
              const targetDocId = DOC_MAP[ad.document_type] || ad.document_type;
              const doc = state.value.documents.find((d) => d.id === targetDocId);
              if (doc) {
                if (ad.file_name) doc.filename = ad.file_name;
                if (ad.file_size) {
                  doc.filesize = ad.file_size > 1048576
                    ? `${(ad.file_size / 1048576).toFixed(1)} MB`
                    : `${Math.round(ad.file_size / 1024)} KB`;
                }
                if (ad.file_url) doc.fileBlobUrl = ad.file_url;
                if (ad.status === 'valid') {
                  doc.status = 'verified';
                  doc.statusLabel = 'Terverifikasi';
                } else if (ad.status === 'invalid') {
                  doc.status = 'rejected';
                  doc.statusLabel = 'Perlu Revisi';
                } else {
                  doc.status = 'pending';
                  doc.statusLabel = 'Sedang Ditinjau';
                }
                if (ad.notes) doc.notes = ad.notes;
              }
            });
          }
        }
      }

      // 3. Finance Service (Tagihan Formulir & UKT)
      const invRes = await financeApi.getMyInvoices().catch(() => null);
      if (invRes?.data?.data && Array.isArray(invRes.data.data)) {
        invRes.data.data.forEach((inv) => {
          let vaNum = inv.va_number || '';
          if (!vaNum && inv.payments && inv.payments.length > 0) {
            const activePay = inv.payments.find((p) => p.va_number);
            if (activePay) vaNum = activePay.va_number;
          }

          if (inv.fee_type === 'registration') {
            state.value.payments.registrationFee.id = inv.id;
            if (inv.status === 'paid') state.value.payments.registrationFee.status = 'paid';
            if (inv.amount) state.value.payments.registrationFee.amount = inv.amount;
            if (vaNum) state.value.payments.registrationFee.vaNumber = vaNum;
          } else if (inv.fee_type === 'reregistration') {
            state.value.payments.uktFee.id = inv.id;
            if (inv.status === 'paid') state.value.payments.uktFee.status = 'paid';
            if (inv.amount) state.value.payments.uktFee.amount = inv.amount;
            if (vaNum) state.value.payments.uktFee.vaNumber = vaNum;
          }
        });
      }

      // 4. Exam Service (Jadwal & Kartu Ujian Peserta)
      const examScheduleRes = await examApi.getMySchedule().catch(() => null);
      if (examScheduleRes?.data?.data) {
        const es = examScheduleRes.data.data;
        if (es.session_name) state.value.schedule.cbtSession = es.session_name;
        if (es.start_time) {
          const dateObj = new Date(es.start_time);
          state.value.schedule.cbtDate = dateObj.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
        }
        if (es.venue) state.value.schedule.cbtVenue = es.venue;
      }

      // 5. Selection Service (Pengumuman Kelulusan)
      const selRes = await selectionApi.getMyResult().catch(() => null);
      if (selRes?.data?.data) {
        const res = selRes.data.data;
        state.value.result.isAnnounced = true;
        if (res.is_passed !== undefined) state.value.result.isPassed = res.is_passed;
        if (res.status === 'passed') state.value.result.isPassed = true;
        if (res.prodi_name) state.value.result.acceptedProdi = res.prodi_name;
        if (res.decision_letter_no) state.value.result.decisionLetterNo = res.decision_letter_no;
      }

      // 6. Student Service (NIM & Status Registrasi Ulang)
      const stdRes = await studentApi.getMyReregistration().catch(() => null);
      if (stdRes?.data?.data) {
        const s = stdRes.data.data;
        if (s.nim) state.value.onboarding.nim = s.nim;
        if (s.pkkmb_group) state.value.onboarding.pkkmbGroup = s.pkkmb_group;
        if (s.is_completed) state.value.onboarding.isCompleted = true;
      }

      lastBackendSync.value = new Date().toLocaleTimeString('id-ID');
    } catch (err) {
      console.warn('Gagal sinkronisasi data pendaftar dari backend:', err);
    } finally {
      isSyncingBackend.value = false;
    }
  };

  return {
    state,
    overallStatus,
    activeTab,
    activeSection,
    setActiveTab,
    isProfileComplete,
    isAdmissionComplete,
    uploadedDocsCount,
    isDocumentsComplete,
    isDocumentsVerified,
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
    submitRegPayment,
    payRegFee,
    submitUktPayment,
    payUktFee,
    submitExam,
    resetAllData,
    syncFromBackend,
    isSyncingBackend,
    lastBackendSync,
    candidatePhoto,
    hasCandidatePhoto,
  };
});
