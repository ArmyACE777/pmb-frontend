import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

const STORAGE_KEY = 'bth_applicant_data_v1';

const defaultState = {
  candidate: {
    registrationNumber: 'BTH-2026-REG-08492',
    fullName: 'Siti Rahmawati',
    nik: '3278015504060002',
    nisn: '0068492014',
    email: 'siti.rahma@bth.ac.id',
    phone: '082117100200',
    gender: 'Perempuan',
    birthPlace: 'Tasikmalaya',
    birthDate: '2006-04-15',
    religion: 'Islam',
    citizenship: 'WNI',
    address: 'Jl. BKR No. 45, Kahuripan',
    city: 'Kota Tasikmalaya',
    province: 'Jawa Barat',
    postalCode: '46115',
    schoolName: 'SMA Negeri 1 Tasikmalaya',
    schoolMajor: 'MIPA (Ilmu Alam)',
    graduationYear: '2026',
    averageScore: '88.75',
    fatherName: 'Ahmad Hidayat',
    fatherJob: 'Wiraswasta',
    motherName: 'Nur Hasanah',
    motherJob: 'Guru',
    parentIncome: 'Rp 5.000.000 - Rp 10.000.000',
    emergencyContact: '08122334455 (Ahmad Hidayat - Ayah)',
  },
  admission: {
    track: 'Jalur Reguler Gelombang 1',
    academicYear: '2026/2027',
    prodi1: 'S1 Farmasi',
    prodi1Faculty: 'Fakultas Farmasi',
    prodi1Degree: 'S.Farm.',
    prodi2: 'S1 Teknologi Informasi',
    prodi2Faculty: 'Fakultas Teknologi & Bisnis',
    prodi2Degree: 'S.Kom.',
    quotaWave1: 120,
    status: 'Seleksi Berkas & CBT',
    progressPercent: 70,
  },
  documents: [
    {
      id: 'doc-1',
      title: 'Ijazah / Surat Keterangan Lulus (SKL)',
      category: 'Akademik',
      required: true,
      filename: 'SKL_Siti_Rahmawati_SMAN1.pdf',
      filesize: '1.2 MB',
      uploadDate: '12 Sep 2026',
      status: 'verified',
      statusLabel: 'Terverifikasi',
      notes: 'Dokumen legalisir telah disetujui panitia.',
    },
    {
      id: 'doc-2',
      title: 'Kartu Tanda Penduduk (KTP) / Kartu Pelajar',
      category: 'Identitas',
      required: true,
      filename: 'KTP_Siti_Rahmawati.jpg',
      filesize: '840 KB',
      uploadDate: '12 Sep 2026',
      status: 'verified',
      statusLabel: 'Terverifikasi',
      notes: 'Identitas kependudukan sesuai dengan database.',
    },
    {
      id: 'doc-3',
      title: 'Kartu Keluarga (KK)',
      category: 'Identitas',
      required: true,
      filename: 'Kartu_Keluarga_Terbaru.pdf',
      filesize: '1.4 MB',
      uploadDate: '13 Sep 2026',
      status: 'verified',
      statusLabel: 'Terverifikasi',
      notes: 'Kartu keluarga terbaru terverifikasi valid.',
    },
    {
      id: 'doc-4',
      title: 'Pas Foto Resmi 4x6 (Latar Merah)',
      category: 'Identitas',
      required: true,
      filename: 'Pas_Foto_4x6_Siti.jpg',
      filesize: '620 KB',
      uploadDate: '18 Sep 2026',
      status: 'verified',
      statusLabel: 'Terverifikasi',
      notes: 'Foto formal pakaian berkerah latar merah disetujui.',
    },
    {
      id: 'doc-5',
      title: 'Surat Keterangan Sehat & Bebas Buta Warna',
      category: 'Kesehatan',
      required: true,
      filename: 'Surat_Kesehatan_Puskesmas.pdf',
      filesize: '950 KB',
      uploadDate: '19 Sep 2026',
      status: 'pending',
      statusLabel: 'Sedang Ditinjau',
      notes: 'Sedang diverifikasi oleh tim medis panitia PMB.',
    },
  ],
  payments: {
    registrationFee: {
      id: 'INV-REG-2026-08492',
      title: 'Biaya Formulir Pendaftaran PMB',
      amount: 250000,
      status: 'paid',
      statusLabel: 'Lunas',
      paidAt: '12 September 2026, 10:14 WIB',
      paymentMethod: 'Virtual Account BSI',
      vaNumber: '900 1208 4920 0128',
    },
    uktFee: {
      id: 'INV-UKT-2026-0042',
      title: 'Biaya Daftar Ulang & UKT Semester 1 (S1 Farmasi)',
      amount: 6500000,
      status: 'pending',
      statusLabel: 'Menunggu Pembayaran',
      dueDate: '28 Oktober 2026',
      vaBsi: '900 7800 0026 0042',
      vaMandiri: '8870 8260 1004 2000',
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
      location: 'Ruang Wawancara Fakultas Farmasi Lt. 2 / Zoom',
    },
    announcementDate: 'Jumat, 24 Oktober 2026',
  },
  exam: {
    status: 'completed', // 'scheduled' | 'in_progress' | 'completed'
    score: 85,
    maxScore: 100,
    totalQuestions: 5,
    correctAnswers: 4,
    passedStatus: 'Lulus Passing Grade (Min. 70)',
    completedAt: '18 Oktober 2026, 09:42 WIB',
  },
  result: {
    isAnnounced: true,
    isPassed: true,
    acceptedProdi: 'S1 Farmasi',
    acceptedFaculty: 'Fakultas Farmasi',
    acceptedDegree: 'Sarjana Farmasi (S.Farm.)',
    decisionLetterNo: '082/SK-PMB/UBTH/X/2026',
    decisionDate: '24 Oktober 2026',
    reRegistrationPeriod: '25 Oktober - 05 November 2026',
  },
  onboarding: {
    nim: '26010042',
    studentEmail: 'siti.rahmawati@bth.ac.id',
    faculty: 'Fakultas Farmasi',
    studyProgram: 'S1 Farmasi',
    pkkmbGroup: 'Gugus 03 - Hygeia Farmasi',
    siakadAccess: 'Aktif (Gunakan NIM & Sandi Default)',
  },
};

export const useApplicantStore = defineStore('applicant', () => {
  const loadInitialData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse applicant data from storage:', e);
    }
    return JSON.parse(JSON.stringify(defaultState));
  };

  const state = ref(loadInitialData());

  watch(
    state,
    (newVal) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
      } catch (e) {
        console.warn('Failed to persist applicant data:', e);
      }
    },
    { deep: true }
  );

  const updateProfile = (data) => {
    state.value.candidate = { ...state.value.candidate, ...data };
  };

  const updateAdmission = (data) => {
    state.value.admission = { ...state.value.admission, ...data };
  };

  const uploadDocument = (docId, fileInfo) => {
    const doc = state.value.documents.find((d) => d.id === docId);
    if (doc) {
      doc.filename = fileInfo.name;
      doc.filesize = fileInfo.size;
      doc.uploadDate = 'Hari ini';
      doc.status = 'pending';
      doc.statusLabel = 'Sedang Ditinjau';
    }
  };

  const payUktFee = () => {
    state.value.payments.uktFee.status = 'paid';
    state.value.payments.uktFee.statusLabel = 'Lunas';
    state.value.payments.uktFee.paidAt = new Date().toLocaleString('id-ID');
  };

  const submitExam = (score, correctCount) => {
    state.value.exam.status = 'completed';
    state.value.exam.score = score;
    state.value.exam.correctAnswers = correctCount;
    state.value.exam.completedAt = new Date().toLocaleString('id-ID');
  };

  const resetAllData = () => {
    state.value = JSON.parse(JSON.stringify(defaultState));
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    state,
    updateProfile,
    updateAdmission,
    uploadDocument,
    payUktFee,
    submitExam,
    resetAllData,
  };
});
