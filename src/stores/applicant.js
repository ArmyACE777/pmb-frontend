import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useAuthStore } from './auth';
import { useReferralStore } from './referral';
import { useCmsStore } from './cms';
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
 * Helper tanggal relatif dinamis dalam format resmi Indonesia
 */
export function getUpcomingDateString(daysFromNow, weekdayPrefix = true) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  if (weekdayPrefix) {
    options.weekday = 'long';
  }
  return d.toLocaleDateString('id-ID', options);
}

/**
 * Inisialisasi state awal pendaftaran calon mahasiswa
 */
function createInitialState(user) {
  let adminSeed = null;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem('bth_admin_data_real_v5');
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          const uEmail = (user?.email || '').toLowerCase().trim();
          adminSeed = list.find((a) => uEmail && a.email?.toLowerCase().trim() === uEmail);
        }
      }
    }
  } catch {}

  const regNo = adminSeed?.id || generateRegNumber(user?.id, user?.email);
  const currentYear = new Date().getFullYear();
  const regSuffix = String(regNo).split('-').pop() || '1001';

  const isFeePaid = adminSeed?.payments?.registrationFee?.status === 'paid';
  const isUktPaid = adminSeed?.payments?.uktFee?.status === 'paid';
  const isPassed = adminSeed?.selection?.passedStatus === 'passed';
  const hasNim = !!adminSeed?.onboarding?.nim;

  return {
    candidate: {
      registrationNumber: regNo,
      fullName: adminSeed?.fullName || user?.full_name || '',
      nik: adminSeed?.nik && adminSeed.nik !== '-' ? adminSeed.nik : '',
      nisn: adminSeed?.nisn && adminSeed.nisn !== '-' ? adminSeed.nisn : '',
      email: user?.email || adminSeed?.email || '',
      phone: adminSeed?.phone && adminSeed.phone !== '-' ? adminSeed.phone : (user?.phone || ''),
      gender: adminSeed?.gender && adminSeed.gender !== '-' ? adminSeed.gender : 'Laki-laki',
      birthPlace: '',
      birthDate: '',
      religion: 'Islam',
      citizenship: 'WNI',
      address: '',
      city: adminSeed?.city || '',
      province: 'Jawa Barat',
      postalCode: '',
      schoolName: adminSeed?.schoolName && adminSeed.schoolName !== 'Belum Diisi' ? adminSeed.schoolName : '',
      schoolMajor: '',
      graduationYear: String(currentYear),
      averageScore: adminSeed?.averageScore && adminSeed.averageScore !== '-' ? adminSeed.averageScore : '',
      fatherName: '',
      fatherJob: '',
      fatherIncome: '',
      fatherEducation: '',
      fatherLifeStatus: '1',
      fatherAddress: '',
      fatherBirthPlace: '',
      fatherBirthDate: '',
      motherName: '',
      motherJob: '',
      motherIncome: '',
      motherEducation: '',
      motherLifeStatus: '1',
      motherAddress: '',
      motherBirthPlace: '',
      motherBirthDate: '',
      parentIncome: '',
      emergencyContact: user?.phone || '',
      photoUrl: user?.avatar || '',
      // Atribut Tambahan Format Migrasi SEVIMA (20261007 format migrasi sevima.xlsx)
      rt: '',
      rw: '',
      dusun: '',
      subDistrict: '',
      familyCardNumber: '',
      almamaterSize: 'L',
      programType: 'IPA',
      lastEducation: 'SMA',
      institutionType: '7',
      isPesantren: '0',
      pesantrenName: '',
      pesantrenDuration: '',
      isKipKuliah: '0',
      npsn: '',
      schoolProvince: 'Jawa Barat',
      schoolCity: '',
      unScore: '',
    },
    admission: {
      track: adminSeed?.track || 'Jalur Reguler Gelombang 1',
      academicYear: `${currentYear}/${currentYear + 1}`,
      prodi1: adminSeed?.prodi1 && adminSeed.prodi1 !== 'Belum Memilih Prodi' ? adminSeed.prodi1 : '',
      prodi1Faculty: adminSeed?.faculty && adminSeed.faculty !== '-' ? adminSeed.faculty : '',
      prodi1Degree: 'S1',
      prodi2: adminSeed?.prodi2 && adminSeed.prodi2 !== '-' ? adminSeed.prodi2 : '',
      prodi2Faculty: '',
      prodi2Degree: '',
      quotaWave1: 120,
      status: hasNim ? 'Mahasiswa Resmi Terdaftar (NIM Terbit)' : (isPassed ? 'Dinyatakan Lulus Seleksi' : (isFeePaid ? 'Berkas & Pembayaran Terverifikasi' : 'Pengisian Formulir Pendaftaran')),
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
        notes: 'Kartu Keluarga terbaru dengan barcode Disdukcapil.',
      },
      {
        id: 'doc-4',
        title: 'Pas Foto 4x6',
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
        notes: 'Surat dokter dari Puskesmas, Rumah Sakit, atau Klinik.',
      },
    ],
    payments: {
      registrationFee: {
        id: `INV-REG-${currentYear}-${regSuffix}`,
        title: isFeePaid ? 'Biaya Formulir Pendaftaran PMB (Lunas)' : 'Biaya Formulir Pendaftaran PMB',
        amount: 250000,
        status: isFeePaid ? 'paid' : 'pending',
        statusLabel: isFeePaid ? 'Lunas' : 'Menunggu Pembayaran',
        paidAt: isFeePaid ? (adminSeed?.payments?.registrationFee?.paidAt || '15 Februari 2026 10:00 WIB') : null,
        paymentMethod: isFeePaid ? (adminSeed?.payments?.registrationFee?.paymentMethod || 'Virtual Account BSI') : 'Virtual Account BSI',
        vaNumber: `988 2026 01 ${regSuffix}`,
      },
      uktFee: {
        id: `INV-UKT-${currentYear}-${regSuffix}`,
        title: 'Biaya Daftar Ulang & UKT Semester 1',
        amount: 0,
        status: isUktPaid ? 'paid' : 'pending',
        statusLabel: isUktPaid ? 'Lunas' : 'Menunggu Pembayaran',
        dueDate: getUpcomingDateString(25, false),
        vaBsi: `988 2026 01 ${regSuffix}`,
        vaMandiri: `88908 2026 ${regSuffix}`,
        paidAt: isUktPaid ? (adminSeed?.payments?.uktFee?.paidAt || '18 Februari 2026 14:00 WIB') : null,
      },
    },
    schedule: {
      cbt: {
        date: getUpcomingDateString(5),
        time: '08:30 - 10:00 WIB',
        room: 'Laboratorium CBT Kampus BTH / Daring Mandiri',
        serverUrl: 'https://cbt.universitas-bth.ac.id',
        sessionName: 'Sesi 1 (Pagi)',
      },
      interview: {
        date: getUpcomingDateString(7),
        time: '09:00 - 11:30 WIB',
        location: 'Ruang Wawancara Kampus BTH / Daring PMB',
      },
      announcementDate: getUpcomingDateString(10),
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
      decisionDate: getUpcomingDateString(10, false),
      reRegistrationPeriod: `${getUpcomingDateString(11, false)} - ${getUpcomingDateString(25, false)}`,
    },
    onboarding: {
      nim: '',
      studentEmail: '',
      faculty: '',
      studyProgram: '',
      pkkmbGroup: '',
      siakadAccess: 'Aktif setelah pelunasan UKT',
    },
    referral: {
      code: adminSeed?.referral?.code || '',
      picName: adminSeed?.referral?.picName || '',
      schoolName: adminSeed?.referral?.schoolName || '',
      appliedAt: adminSeed?.referral?.appliedAt || null,
      isApplied: !!adminSeed?.referral?.code,
    },
    statusLogs: [
      {
        id: 'log-1',
        timestamp: new Date().toISOString(),
        stage: 'Registrasi Akun',
        title: 'Akun Calon Mahasiswa Berhasil Dibuat',
        description: 'Pendaftaran akun resmi sistem PMB Universitas Bakti Tunas Husada berhasil diverifikasi.',
        status: 'completed',
        actor: 'Sistem PMB',
      },
    ],
  };
}

export const useApplicantStore = defineStore('applicant', () => {
  const authStore = useAuthStore();
  const cmsStore = useCmsStore();
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
              registrationFee: { ...(initial.payments.registrationFee || {}), ...(parsed.payments?.registrationFee || {}) },
              uktFee: { ...(initial.payments.uktFee || {}), ...(parsed.payments?.uktFee || {}) }
            },
            referral: { ...(initial.referral || {}), ...(parsed.referral || {}) },
            statusLogs: Array.isArray(parsed.statusLogs) && parsed.statusLogs.length > 0 ? parsed.statusLogs : initial.statusLogs,
            schedule: { ...initial.schedule, ...(parsed.schedule || {}) },
            exam: { ...initial.exam, ...(parsed.exam || {}) },
            result: { ...initial.result, ...(parsed.result || {}) },
            onboarding: { ...initial.onboarding, ...(parsed.onboarding || {}) },
            documents: ((Array.isArray(parsed.documents) ? parsed.documents : null) || initial.documents).map((doc) => {
              const initDoc = initial.documents.find((d) => d.id === doc.id);
              return {
                ...doc,
                title: initDoc?.title || doc.title,
                notes: initDoc?.notes || doc.notes,
              };
            }),
            withdrawalInfo: parsed.withdrawalInfo || null,
            pendingWithdrawal: parsed.pendingWithdrawal || null,
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



          // Rekonsiliasi dengan data resmi dari Meja Admin jika ada update
          try {
            const adminRaw = localStorage.getItem('bth_admin_data_real_v5');
            const adminList = adminRaw ? JSON.parse(adminRaw) : [];
            const userEmail = (user?.email || merged.candidate.email || '').toLowerCase().trim();
            const regNo = merged.candidate.registrationNumber;
            const matchedAdmin = Array.isArray(adminList)
              ? adminList.find((a) => (userEmail && a.email?.toLowerCase().trim() === userEmail) || (regNo && a.id === regNo))
              : null;
            if (matchedAdmin) {
              if (matchedAdmin.payments?.registrationFee?.status === 'paid') {
                merged.payments.registrationFee.status = 'paid';
                merged.payments.registrationFee.statusLabel = matchedAdmin.payments.registrationFee.statusLabel || 'Lunas (Dikonfirmasi Admin)';
                merged.payments.registrationFee.paidAt = matchedAdmin.payments.registrationFee.paidAt || merged.payments.registrationFee.paidAt;
              }
              if (matchedAdmin.payments?.uktFee?.status === 'paid') {
                merged.payments.uktFee.status = 'paid';
                merged.payments.uktFee.statusLabel = matchedAdmin.payments.uktFee.statusLabel || 'Lunas (Dikonfirmasi Admin)';
                merged.payments.uktFee.paidAt = matchedAdmin.payments.uktFee.paidAt || merged.payments.uktFee.paidAt;
              }
              if (matchedAdmin.selection?.passedStatus === 'passed') {
                merged.result.isPassed = true;
                merged.result.isAnnounced = true;
                merged.result.decisionLetterNo = matchedAdmin.selection.decisionLetterNo || merged.result.decisionLetterNo;
                merged.admission.status = 'Dinyatakan Lulus Seleksi';
              }
              if (matchedAdmin.onboarding?.nim) {
                merged.onboarding.nim = matchedAdmin.onboarding.nim;
                merged.onboarding.pkkmbGroup = matchedAdmin.onboarding.pkkmbGroup || 'Gugus 01 - Hygeia Farmasi';
                merged.onboarding.isEnrolled = true;
              }
              if (Array.isArray(matchedAdmin.documents) && Array.isArray(merged.documents)) {
                matchedAdmin.documents.forEach((ad) => {
                  const md = merged.documents.find((d) => d.id === ad.id);
                  if (md && ad.status) {
                    md.status = ad.status;
                    md.statusLabel = ad.status === 'verified' ? 'Terverifikasi' : ad.status === 'revision' ? 'Perlu Perbaikan' : 'Sedang Ditinjau';
                    md.notes = ad.notes || md.notes;
                  }
                });
              }
            }
          } catch (admErr) {
            console.warn('Reconcile applicant with admin error:', admErr);
          }

          // Rekonsiliasi otomatis dengan referralStore jika siswa terdaftar di kemitraan Guru BK
          try {
            const userEmail = (user?.email || merged.candidate.email || '').toLowerCase().trim();
            const userRegNo = (merged.candidate.registrationNumber || '').toLowerCase().trim();
            const userName = (user?.full_name || user?.name || merged.candidate.fullName || '').toLowerCase().trim();

            const refStore = useReferralStore();
            const foundRef =
              (userEmail ? refStore.findReferralByStudent(userEmail) : null) ||
              (userRegNo ? refStore.findReferralByStudent(userRegNo) : null) ||
              (userName ? refStore.findReferralByStudent(userName) : null);

            if (foundRef && foundRef.partner) {
              const p = foundRef.partner;
              merged.referral = {
                code: p.code,
                schoolName: p.schoolName,
                picName: p.picName,
                appliedAt: foundRef.student?.appliedAt || merged.referral?.appliedAt || new Date().toISOString(),
                isApplied: true,
              };
              if (merged.payments?.registrationFee) {
                merged.payments.registrationFee.amount = 0;
                merged.payments.registrationFee.isFree = true;
                merged.payments.registrationFee.status = 'paid';
                merged.payments.registrationFee.statusLabel = 'Lunas (Kemitraan Guru BK)';
                merged.payments.registrationFee.paymentMethod = `Kemitraan Guru BK (${p.code})`;
              }
              if (merged.admission && !merged.admission.track?.includes('Guru BK')) {
                merged.admission.track = `Jalur Kemitraan Guru BK (${p.schoolName})`;
              }
            }
          } catch (refErr) {
            console.warn('Auto-sync referral with applicant store notice:', refErr);
          }

          return merged;
        }
      } catch (e) {
        console.warn('Gagal memuat data pendaftar dari storage:', e);
      }
    }
    // Jika belum ada data tersimpan untuk akun ini (pendaftar baru), buat state awal
    const fresh = createInitialState(user);
    try {
      const userEmail = (user?.email || fresh.candidate.email || '').toLowerCase().trim();
      const refStore = useReferralStore();
      const foundRef = userEmail ? refStore.findReferralByStudent(userEmail) : null;
      if (foundRef && foundRef.partner) {
        const p = foundRef.partner;
        fresh.referral = {
          code: p.code,
          schoolName: p.schoolName,
          picName: p.picName,
          appliedAt: foundRef.student?.appliedAt || new Date().toISOString(),
          isApplied: true,
        };
        if (fresh.payments?.registrationFee) {
          fresh.payments.registrationFee.amount = 0;
          fresh.payments.registrationFee.isFree = true;
          fresh.payments.registrationFee.status = 'paid';
          fresh.payments.registrationFee.statusLabel = 'Lunas (Kemitraan Guru BK)';
          fresh.payments.registrationFee.paymentMethod = `Kemitraan Guru BK (${p.code})`;
        }
      }
    } catch (refErr) {
      console.warn('Auto-sync referral with new applicant notice:', refErr);
    }
    return fresh;
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

  // Realtime Cross-Component Event Listeners (Sinkronisasi Pembayaran & Referral BK)
  if (typeof window !== 'undefined') {
    window.addEventListener('bth_payment_confirmed', (e) => {
      const email = e?.detail?.email;
      const regNo = e?.detail?.regNo;
      const myEmail = (state.value?.candidate?.email || authStore.currentUser?.email || '').toLowerCase().trim();
      const myRegNo = state.value?.candidate?.registrationNumber;

      if ((email && myEmail === email.toLowerCase().trim()) || (regNo && myRegNo === regNo)) {
        if (state.value?.payments?.registrationFee) {
          state.value.payments.registrationFee.status = 'paid';
          state.value.payments.registrationFee.statusLabel = 'Lunas (Disetujui Guru BK)';
          state.value.payments.registrationFee.paidAt = new Date().toLocaleString('id-ID');
        }
      }
    });

    window.addEventListener('bth_applicant_synced_from_admin', (e) => {
      const email = e?.detail?.email;
      const applicantId = e?.detail?.applicantId;
      const myEmail = (state.value?.candidate?.email || authStore.currentUser?.email || '').toLowerCase().trim();
      const myRegNo = state.value?.candidate?.registrationNumber;

      if ((email && myEmail === email.toLowerCase().trim()) || (applicantId && myRegNo === applicantId)) {
        state.value = loadInitialData(authStore.currentUser);
      }
    });
  }

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

  const isFreeTrack = computed(() => {
    const regFee = state.value?.payments?.registrationFee;
    const track = (state.value?.admission?.track || '').toLowerCase();
    return (
      regFee?.amount === 0 ||
      regFee?.scheme === 'free' ||
      regFee?.isFree === true ||
      state.value?.admission?.isFreeTrack === true ||
      track.includes('beasiswa') ||
      track.includes('kemitraan')
    );
  });

  const isRegPaymentComplete = computed(() => {
    const backendStatus = state.value?.admission?.backendStatus;
    if (backendStatus === 'cancelled') {
      return false;
    }

    // 1. Jalur Bebas Biaya (Rp 0) atau Kode Referal Kemitraan Sekolah otomatis lunas
    if (
      state.value?.referral?.isApplied ||
      isFreeTrack.value ||
      state.value?.payments?.registrationFee?.isFree === true ||
      state.value?.payments?.registrationFee?.amount === 0
    ) {
      return true;
    }

    // Jika belum memilih program studi atau formulir kosong, belum ada pembayaran formulir yang sah
    if (!state.value?.admission?.prodi1) {
      return false;
    }

    // 2. Status registrasi lunas di store
    if (state.value?.payments?.registrationFee?.status === 'paid') {
      return true;
    }

    // 3. Jika backend admission menyatakan status belum bayar (awaiting_payment / draft)
    if (backendStatus === 'awaiting_payment' || backendStatus === 'draft') {
      return state.value?.payments?.registrationFee?.status === 'paid';
    }

    // 4. Status backend yang menandakan pendaftaran sudah melewati tahap pembayaran formulir
    if (backendStatus === 'form_open' || backendStatus === 'submitted' || backendStatus === 'verified' || backendStatus === 'exam_scheduled') {
      return true;
    }

    // 5. Default fallback: cek status pembayaran registrasi di store
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

  // Syarat Fitur Batalkan Pendaftaran:
  // Aktif sebelum ujian dimulai (untuk jalur gratis) atau sebelum pembayaran formulir (jalur berbayar)
  const canCancelAdmission = computed(() => {
    if (isWithdrawn.value) return false;
    if (!state.value?.admission?.prodi1) return false;
    if (isExamCompleted.value) return false;
    if (isFreeTrack.value) {
      return !state.value?.exam?.status || state.value?.exam?.status === 'not_started';
    }
    return !isRegPaymentComplete.value;
  });

  // Pendaftaran hanya terkunci jika sudah memilih prodi DAN biaya pendaftaran telah lunas
  const isAdmissionLocked = computed(() => {
    if (isWithdrawn.value) return false;
    if (!state.value?.admission?.prodi1) return false;
    return isRegPaymentComplete.value;
  });

  // Kondisi jika dinyatakan tidak lulus seleksi
  const isExamFailed = computed(() => {
    return state.value?.exam?.status === 'completed' && state.value?.result?.isAnnounced && !state.value?.result?.isPassed;
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

  const isWithdrawn = computed(() => {
    return state.value?.admission?.backendStatus === 'withdrawn';
  });

  const overallStatus = computed(() => {
    if (isWithdrawn.value) {
      return {
        label: 'Telah Mengundurkan Diri',
        shortLabel: 'Mengundurkan Diri',
        theme: 'rose',
        description: 'Pendaftaran Anda di Universitas BTH telah berstatus mengundurkan diri.',
      };
    }
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
    if (isExamFailed.value) {
      return {
        label: 'Belum Lulus Seleksi',
        shortLabel: 'Belum Lulus',
        theme: 'rose',
        description: 'Nilai ujian belum memenuhi ambang batas kelulusan. Anda dapat mendaftar kembali ke jalur atau program studi lain.',
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

  /**
   * Helper Pencatatan Riwayat Aktivitas & Perubahan Data Terstruktur (CR-Riwayat Activity Stream)
   */
  const recordActivity = ({
    category = 'system',
    categoryLabel,
    action,
    title,
    description,
    actor = 'Calon Mahasiswa',
    badgeColor,
    status = 'completed',
  }) => {
    if (!state.value.statusLogs) {
      state.value.statusLogs = [];
    }

    const categoryMap = {
      profile: { label: 'Biodata & Profil', color: 'emerald' },
      admission: { label: 'Jalur Seleksi', color: 'blue' },
      document: { label: 'Berkas Dokumen', color: 'amber' },
      payment: { label: 'Pembayaran', color: 'purple' },
      exam: { label: 'Ujian Mandiri CBT', color: 'indigo' },
      system: { label: 'Sistem PMB', color: 'slate' },
    };

    const catInfo = categoryMap[category] || { label: categoryLabel || 'Aktivitas PMB', color: 'blue' };
    const resolvedTitle = action || title || 'Aktivitas Tersimpan';
    const resolvedDesc = description || '';

    // Mencegah duplikasi entri identik beruntun dalam rentang 3 detik
    const now = Date.now();
    const isDuplicate =
      state.value.statusLogs.length > 0 &&
      state.value.statusLogs[0].action === resolvedTitle &&
      state.value.statusLogs[0].description === resolvedDesc &&
      now - new Date(state.value.statusLogs[0].timestamp).getTime() < 3000;

    if (isDuplicate) {
      return state.value.statusLogs[0];
    }

    const newLog = {
      id: `act-${now}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      category,
      categoryLabel: categoryLabel || catInfo.label,
      action: resolvedTitle,
      title: resolvedTitle,
      stage: catInfo.label,
      description: resolvedDesc,
      status,
      actor,
      badgeColor: badgeColor || catInfo.color,
    };

    state.value.statusLogs.unshift(newLog);
    // Batasi log maksimal 80 aktivitas agar storage tetap bersih & efisien
    if (state.value.statusLogs.length > 80) {
      state.value.statusLogs.pop();
    }
    return newLog;
  };

  const updateProfile = (data) => {
    state.value.candidate = { ...state.value.candidate, ...data };

    // Catat log aktivitas simpan data biodata
    const summaryItems = [];
    if (data.fullName) summaryItems.push(`Nama: ${data.fullName}`);
    if (data.nik) summaryItems.push(`NIK: ${data.nik}`);
    if (data.schoolName) summaryItems.push(`Sekolah: ${data.schoolName}`);
    if (data.phone) summaryItems.push(`No. HP: ${data.phone}`);

    const details = summaryItems.length > 0
      ? `Data tersimpan: ${summaryItems.join(' • ')}`
      : 'Data identitas diri, domisili, data orang tua, dan riwayat asal sekolah berhasil diperbarui.';

    recordActivity({
      category: 'profile',
      action: 'Simpan Data Biodata Pribadi',
      description: details,
      actor: 'Calon Mahasiswa',
      badgeColor: 'emerald',
    });

    if (state.value.referral?.isApplied && state.value.referral?.code) {
      try {
        const referralStore = useReferralStore();
        referralStore.applyReferralForStudent(state.value.referral.code, {
          candidateName: state.value.candidate?.fullName || 'Calon Mahasiswa',
          email: state.value.candidate?.email || '',
          nik: state.value.candidate?.nik || '-',
          nisn: state.value.candidate?.nisn || '-',
          phone: state.value.candidate?.phone || '',
          registrationNumber: state.value.candidate?.registrationNumber || '',
          prodi: state.value.admission?.prodi1 || '',
          nominal: 300000,
        });
      } catch (e) {
        console.warn('Sync referral on profile update:', e);
      }
    }
  };

  const updateAdmission = (data) => {
    const prevTrack = state.value.admission?.track;
    const prevProdi1 = state.value.admission?.prodi1;
    const isTrackChange = prevTrack && prevTrack !== data.track;
    const isProdiChange = prevProdi1 && prevProdi1 !== data.prodi1;

    state.value.admission = { ...state.value.admission, ...data };

    // Update nominal biaya formulir pendaftaran dinamis sesuai jalur dari CMS
    if (state.value.payments?.registrationFee && state.value.payments.registrationFee.status !== 'paid') {
      const dynamicRegFee = cmsStore.getRegistrationFee(data.track || state.value.admission?.track);
      state.value.payments.registrationFee.amount = dynamicRegFee;
      if (dynamicRegFee === 0) {
        state.value.payments.registrationFee.status = 'paid';
        state.value.payments.registrationFee.paymentMethod = 'Jalur Bebas Biaya (Subsidi / Kemitraan)';
        state.value.payments.registrationFee.statusLabel = 'Bebas Biaya (Lunas Otomatis)';
      }
    }

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

      // Update nominal tagihan UKT dinamis sesuai prodi pilihan dari CMS
      const dynamicUkt = cmsStore.getUktFee(data.prodi1);
      if (state.value.payments?.uktFee) {
        state.value.payments.uktFee.amount = dynamicUkt || meta?.uktFee || 4500000;
      }
    }

    // Catat log aktivitas simpan / ubah jalur & prodi
    const actionLabel = (isTrackChange || isProdiChange)
      ? 'Ubah Pilihan Jalur & Program Studi'
      : 'Simpan Pilihan Jalur & Program Studi';

    const desc = `Jalur: ${data.track || 'Jalur Seleksi'} | Pilihan 1: ${data.prodi1 || '-'}${data.prodi2 ? ` • Pilihan 2: ${data.prodi2}` : ''}`;

    recordActivity({
      category: 'admission',
      action: actionLabel,
      description: desc,
      actor: 'Calon Mahasiswa',
      badgeColor: 'blue',
    });

    if (state.value.referral?.isApplied && state.value.referral?.code) {
      try {
        const referralStore = useReferralStore();
        referralStore.applyReferralForStudent(state.value.referral.code, {
          candidateName: state.value.candidate?.fullName || 'Calon Mahasiswa',
          email: state.value.candidate?.email || '',
          nik: state.value.candidate?.nik || '-',
          nisn: state.value.candidate?.nisn || '-',
          phone: state.value.candidate?.phone || '',
          registrationNumber: state.value.candidate?.registrationNumber || '',
          prodi: state.value.admission?.prodi1 || '',
          nominal: 300000,
        });
      } catch (e) {
        console.warn('Sync referral on admission update:', e);
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

    recordActivity({
      category: 'document',
      action: `Unggah Berkas: ${doc?.title || 'Dokumen Persyaratan'}`,
      description: `Berkas "${fileInfo.name}" (${fileInfo.size || 'Terlampir'}) berhasil diunggah ke sistem PMB.`,
      actor: 'Calon Mahasiswa',
      badgeColor: 'amber',
    });
  };

  const submitRegPayment = (note = 'Pengajuan pembayaran via Virtual Account BSI') => {
    state.value.payments.registrationFee.status = 'pending_confirmation';
    state.value.payments.registrationFee.statusLabel = 'Menunggu Konfirmasi Admin';
    state.value.payments.registrationFee.submittedAt = new Date().toLocaleString('id-ID');
    state.value.payments.registrationFee.notes = note;

    recordActivity({
      category: 'payment',
      action: 'Pengajuan Pembayaran Biaya Formulir',
      description: `Menyerahkan bukti pembayaran biaya formulir (Rp 250.000). Instruksi: ${note}`,
      actor: 'Calon Mahasiswa',
      badgeColor: 'purple',
    });
  };

  const payRegFee = (confirmedBy = 'Panitia PMB / Biro Keuangan BTH') => {
    state.value.payments.registrationFee.status = 'paid';
    state.value.payments.registrationFee.statusLabel = 'Lunas (Dikonfirmasi Admin)';
    state.value.payments.registrationFee.confirmedBy = confirmedBy;
    state.value.payments.registrationFee.paidAt = new Date().toLocaleString('id-ID');

    // Update status aplikasi pendaftaran menjadi form_open dan berkas & pembayaran terverifikasi
    if (state.value.admission) {
      state.value.admission.backendStatus = 'form_open';
      state.value.admission.status = 'Berkas & Pembayaran Terverifikasi';
    }

    recordActivity({
      category: 'payment',
      action: 'Pelunasan Biaya Formulir Pendaftaran',
      description: 'Biaya formulir pendaftaran PMB sebesar Rp 250.000 dinyatakan lunas dan diverifikasi.',
      actor: confirmedBy,
      badgeColor: 'emerald',
    });

    // Sinkronkan ke mitra referal Guru BK bila siswa menggunakan kode referal
    if (state.value.referral?.isApplied && state.value.referral?.code) {
      try {
        const referralStore = useReferralStore();
        referralStore.approveStudentPayment(
          state.value.referral.code,
          state.value.candidate?.email || state.value.candidate?.registrationNumber
        );
      } catch (e) {
        console.warn('Sync referral on payRegFee error:', e);
      }
    }
  };

  const submitUktPayment = (note = 'Pengajuan pelunasan UKT Semester 1 via Virtual Account') => {
    state.value.payments.uktFee.status = 'pending_confirmation';
    state.value.payments.uktFee.statusLabel = 'Menunggu Konfirmasi Admin';
    state.value.payments.uktFee.submittedAt = new Date().toLocaleString('id-ID');
    state.value.payments.uktFee.notes = note;

    recordActivity({
      category: 'payment',
      action: 'Pengajuan Pembayaran UKT Semester 1',
      description: `Menyerahkan instruksi pelunasan UKT & registrasi ulang. Catatan: ${note}`,
      actor: 'Calon Mahasiswa',
      badgeColor: 'purple',
    });
  };

  const payUktFee = (confirmedBy = 'Panitia PMB / Biro Keuangan BTH') => {
    state.value.payments.uktFee.status = 'paid';
    state.value.payments.uktFee.statusLabel = 'Lunas (Dikonfirmasi Admin)';
    state.value.payments.uktFee.confirmedBy = confirmedBy;
    state.value.payments.uktFee.paidAt = new Date().toLocaleString('id-ID');

    if (!state.value.onboarding.nim) {
      const regSuffix = state.value.candidate.registrationNumber.split('-').pop() || '1001';
      // Format Standar PRD Fase 2 (Bagian 4.10): {YY}{nim_code_prodi}{jalur_digit}{urut 4}
      const yearPrefix = new Date().getFullYear().toString().slice(-2);
      const selectedProdi = state.value.result?.acceptedProdi || state.value.admission.prodi1 || 'Program Studi Terpilih';
      const meta = PRODI_METADATA[selectedProdi] || {
        code: '01',
        faculty: 'Universitas BTH',
        degree: 'Sarjana',
        uktFee: 4500000,
        gugus: 'Gugus Mahasiswa Baru BTH',
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
      state.value.onboarding.faculty = meta.faculty || state.value.admission.prodi1Faculty || 'Universitas BTH';
      state.value.onboarding.pkkmbGroup = meta.gugus || 'Gugus Mahasiswa Baru BTH';
    }

    recordActivity({
      category: 'payment',
      action: 'Pelunasan UKT & Registrasi Ulang',
      description: `Pembayaran UKT Semester 1 lunas. NIM Mahasiswa: ${state.value.onboarding.nim || 'Diterbitkan'}.`,
      actor: confirmedBy,
      badgeColor: 'emerald',
    });
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
    state.value.result.acceptedProdi = state.value.admission.prodi1 || 'Program Studi Terpilih';
    state.value.result.acceptedFaculty = state.value.admission.prodi1Faculty || 'Universitas BTH';
    state.value.result.acceptedDegree = state.value.admission.prodi1Degree || 'S1';
    if (isPass) {
      const regSuffix = state.value.candidate.registrationNumber.split('-').pop() || '101';
      state.value.result.decisionLetterNo = `${regSuffix.slice(-3)}/SK-PMB/UBTH/X/${new Date().getFullYear()}`;
    }
    state.value.admission.status = isPass ? 'Dinyatakan Lulus Seleksi' : 'Belum Memenuhi Syarat Kelulusan';

    recordActivity({
      category: 'exam',
      action: 'Penyelesaian Ujian Mandiri CBT',
      description: `Menyelesaikan Computer-Based Test (CBT) dengan perolehan skor ${score}/100 (${correctCount}/5 soal benar). Status: ${isPass ? 'Lulus Passing Grade' : 'Belum Memenuhi Nilai Ambang Batas'}.`,
      actor: 'Sistem Ujian CBT',
      badgeColor: 'indigo',
    });
  };

  /**
   * Fitur Batalkan Pendaftaran:
   * Syarat: HANYA AKTIF SEBELUM BAYAR BIAYA PENDAFTARAN.
   * Jika sudah bayar biaya pendaftaran, pendaftaran terkunci dan tidak bisa dibatalkan.
   */
  const cancelAdmission = async (reason = 'Dibatalkan oleh pendaftar untuk memilih prodi / jalur lain') => {
    if (isRegPaymentComplete.value) {
      throw new Error('Pendaftaran tidak dapat dibatalkan karena biaya pendaftaran sudah dibayar.');
    }

    // 1. Reset pilihan prodi & status pendaftaran pada state
    state.value.admission.prodi1 = '';
    state.value.admission.prodi1Code = '';
    state.value.admission.prodi1NimCode = '';
    state.value.admission.prodi1Faculty = '';
    state.value.admission.prodi1Degree = '';
    state.value.admission.prodi2 = '';
    state.value.admission.prodi2Code = '';
    state.value.admission.prodi2Faculty = '';
    state.value.admission.prodi2Degree = '';
    state.value.admission.status = 'Pengisian Formulir Pendaftaran';
    state.value.admission.backendStatus = 'draft';
    state.value.admission.isDraftReapply = true;

    // Reset status pembayaran pendaftaran & UKT
    if (state.value.payments?.registrationFee) {
      state.value.payments.registrationFee.status = 'unpaid';
      state.value.payments.registrationFee.paidAt = null;
      state.value.payments.registrationFee.isFree = false;
    }
    if (state.value.payments?.uktFee) {
      state.value.payments.uktFee.amount = 0;
      state.value.payments.uktFee.status = 'unpaid';
      state.value.payments.uktFee.paidAt = null;
    }

    // 2. Hubungi backend admission service jika API tersedia
    try {
      await admissionApi.cancelApplication(reason).catch(() => null);
    } catch (e) {
      console.warn('Backend cancel notice:', e?.message);
    }

    recordActivity({
      category: 'admission',
      action: 'Pembatalan Pilihan Jalur & Program Studi',
      description: `Pilihan jalur dan program studi dibatalkan: "${reason}". Status pendaftaran dikembalikan ke tahap pemilihan jalur.`,
      actor: 'Calon Mahasiswa',
      badgeColor: 'rose',
    });

    // Arahkan langsung ke modul pendaftaran agar pendaftar bisa langsung memilih lagi
    setActiveTab('admission');

    return {
      success: true,
      message: 'Pilihan pendaftaran berhasil dibatalkan. Anda dapat memilih kembali jalur pendaftaran dan program studi yang diinginkan.',
    };
  };

  /**
   * Fitur Tambah Pendaftaran Jalur / Pilihan Lain bagi yang Dinyatakan Tidak Lulus
   */
  const reapplyNewTrack = async () => {
    // 1. Buka pendaftaran baru dengan tetap menjaga keutuhan biodata profil dan dokumen
    state.value.admission.backendStatus = '';
    state.value.admission.applicationId = null;
    state.value.admission.isDraftReapply = true;
    withdrawalInfo.value = null;
    pendingWithdrawal.value = null;
    if (state.value) {
      delete state.value.withdrawalInfo;
      delete state.value.pendingWithdrawal;
    }
    state.value.admission.track = '';
    state.value.admission.prodi1 = '';
    state.value.admission.prodi1Code = '';
    state.value.admission.prodi1NimCode = '';
    state.value.admission.prodi1Faculty = '';
    state.value.admission.prodi1Degree = '';
    state.value.admission.prodi2 = '';
    state.value.admission.prodi2Code = '';
    state.value.admission.prodi2Faculty = '';
    state.value.admission.prodi2Degree = '';
    state.value.admission.status = 'Pendaftaran Jalur Baru';

    // Reset status ujian CBT
    state.value.exam.status = 'scheduled';
    state.value.exam.score = 0;
    state.value.exam.correctAnswers = 0;
    state.value.exam.passedStatus = 'Menunggu Pengerjaan Ujian';
    state.value.exam.completedAt = null;

    // Reset status hasil kelulusan
    state.value.result.isAnnounced = false;
    state.value.result.isPassed = false;
    state.value.result.acceptedProdi = '';
    state.value.result.acceptedFaculty = '';
    state.value.result.acceptedDegree = '';
    state.value.result.decisionLetterNo = '';

    // Reset status biaya untuk pendaftaran jalur baru
    state.value.payments.registrationFee.status = 'pending';
    state.value.payments.registrationFee.statusLabel = 'Menunggu Pembayaran';
    state.value.payments.registrationFee.paidAt = null;
    state.value.payments.uktFee.amount = 0;
    state.value.payments.uktFee.status = 'pending';
    state.value.payments.uktFee.paidAt = null;

    // Perbarui jadwal sesi dinamis
    state.value.schedule.cbt.date = getUpcomingDateString(5);
    state.value.schedule.interview.date = getUpcomingDateString(7);
    state.value.schedule.announcementDate = getUpcomingDateString(10);
    state.value.result.decisionDate = getUpcomingDateString(10, false);
    state.value.result.reRegistrationPeriod = `${getUpcomingDateString(11, false)} - ${getUpcomingDateString(25, false)}`;

    recordActivity({
      category: 'admission',
      action: 'Buka Pendaftaran Jalur Baru',
      description: 'Memulai formulir pendaftaran baru di Universitas Bakti Tunas Husada. Biodata identitas dan berkas persyaratan tetap tersimpan.',
      actor: 'Calon Mahasiswa',
      badgeColor: 'blue',
    });

    // Pindah ke modul Jalur Pendaftaran
    setActiveTab('admission');

    return {
      success: true,
      message: 'Pendaftaran jalur baru telah dibuka. Silakan pilih jalur dan program studi pilihan Anda.',
    };
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
      const rawAppData = appRes?.data?.data;
      const app = rawAppData?.active_application || (Array.isArray(rawAppData) ? rawAppData[0] : (rawAppData?.id ? rawAppData : null));

      if (app) {
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
      } else {
        // Jika tidak ada active_application, cek apakah pendaftar sedang dalam mode draft pendaftaran baru
        if (!state.value?.admission?.isDraftReapply) {
          // Cek riwayat pendaftaran apakah berstatus withdrawn
          const histRes = await admissionApi.getMyHistory().catch(() => null);
          const historyList = histRes?.data?.data || [];
          if (historyList.length > 0) {
            const latestHist = historyList[0];
            if (latestHist.status === 'withdrawn') {
              state.value.admission.backendStatus = 'withdrawn';
              state.value.admission.status = 'Pendaftaran Ditarik (Mengundurkan Diri)';
              if (latestHist.registration_no) {
                state.value.candidate.registrationNumber = latestHist.registration_no;
              }
              if (latestHist.admission_path?.name) {
                state.value.admission.track = latestHist.admission_path.name;
              }
            }
          }

          // Cek data pengunduran diri resmi
          const wRes = await admissionApi.getMyWithdrawal().catch(() => null);
          if (wRes?.data?.data) {
            const wd = wRes.data.data;
            if (wd.status === 'effective' || wd.status === 'approved') {
              withdrawalInfo.value = wd;
              state.value.withdrawalInfo = wd;
              state.value.admission.backendStatus = 'withdrawn';
              state.value.admission.status = 'Pendaftaran Ditarik (Mengundurkan Diri)';
              pendingWithdrawal.value = null;
              if (state.value) delete state.value.pendingWithdrawal;
            } else if (wd.status === 'pending') {
              pendingWithdrawal.value = wd;
              state.value.pendingWithdrawal = wd;
              withdrawalInfo.value = wd;
            } else if (wd.status === 'rejected') {
              rejectedWithdrawal.value = wd;
              state.value.rejectedWithdrawal = wd;
              pendingWithdrawal.value = null;
              withdrawalInfo.value = null;
              if (state.value) {
                delete state.value.pendingWithdrawal;
                delete state.value.withdrawalInfo;
              }
            } else {
              // Status 'cancelled'
              rejectedWithdrawal.value = null;
              withdrawalInfo.value = null;
              pendingWithdrawal.value = null;
              if (state.value) {
                delete state.value.withdrawalInfo;
                delete state.value.pendingWithdrawal;
                delete state.value.rejectedWithdrawal;
              }
            }
          } else {
            withdrawalInfo.value = null;
            pendingWithdrawal.value = null;
            rejectedWithdrawal.value = null;
            if (state.value) {
              delete state.value.withdrawalInfo;
              delete state.value.pendingWithdrawal;
              delete state.value.rejectedWithdrawal;
            }
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
            if (inv.status === 'paid') {
              state.value.payments.registrationFee.status = 'paid';
              state.value.payments.registrationFee.statusLabel = 'Lunas';
            } else if (!state.value?.referral?.isApplied && !isFreeTrack.value) {
              state.value.payments.registrationFee.status = 'pending';
              state.value.payments.registrationFee.statusLabel = 'Menunggu Pembayaran';
            }
            if (inv.amount !== undefined && inv.amount !== null) {
              state.value.payments.registrationFee.amount = inv.amount;
            }
            if (inv.payment_scheme === 'free' || inv.amount === 0) {
              state.value.payments.registrationFee.isFree = true;
              state.value.payments.registrationFee.scheme = 'free';
              state.value.payments.registrationFee.status = 'paid';
              state.value.payments.registrationFee.paymentMethod = 'Jalur Bebas Biaya (Gratis)';
              state.value.payments.registrationFee.statusLabel = 'Bebas Biaya (Lunas Otomatis)';
            }
            if (vaNum) state.value.payments.registrationFee.vaNumber = vaNum;
          } else if (inv.fee_type === 'reregistration') {
            state.value.payments.uktFee.id = inv.id;
            if (inv.status === 'paid') state.value.payments.uktFee.status = 'paid';
            if (inv.amount !== undefined && inv.amount !== null) {
              state.value.payments.uktFee.amount = inv.amount;
            }
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

      // 7. Riwayat Pendaftaran & Permohonan Pindah Jalur (CR-006 & CR-005)
      const pcRes = await admissionApi.getMyPendingPathChange().catch(() => null);
      if (pcRes?.data?.data && pcRes.data.data.status === 'pending') {
        const p = pcRes.data.data;
        pendingPathChange.value = {
          id: p.id,
          request_id: p.id,
          status: 'pending',
          new_track_name: p.to_path?.name || 'Jalur Pilihan Baru',
          old_track_name: p.from_path?.name || state.value.admission?.track,
          reason: p.reason || 'Permohonan perubahan jalur seleksi pendaftaran',
          submitted_at: p.created_at ? new Date(p.created_at).toLocaleDateString('id-ID') : 'Hari ini',
          fee_difference: p.fee_difference || 0,
        };
        state.value.pendingPathChange = pendingPathChange.value;
      } else {
        pendingPathChange.value = null;
        if (state.value) delete state.value.pendingPathChange;
      }

      const histRes = await admissionApi.getMyHistory().catch(() => null);
      if (histRes?.data?.data && Array.isArray(histRes.data.data)) {
        applicationHistory.value = histRes.data.data;
      }

      const changesRes = await admissionApi.getMyChanges().catch(() => null);
      const changes = changesRes?.data?.data?.items || (Array.isArray(changesRes?.data?.data) ? changesRes.data.data : []);
      if (changes.length > 0) {
        // Urutkan riwayat perubahan dari yang terbaru (newest first)
        const sortedChanges = [...changes].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        const latestPathChange = sortedChanges.find((c) =>
          c.change_type === 'path_change_requested' ||
          c.change_type === 'path_change' ||
          c.change_type === 'path_change_approved' ||
          c.change_type === 'path_change_rejected' ||
          c.change_type === 'path_change_cancelled'
        );

        if (latestPathChange) {
          if (latestPathChange.change_type === 'path_change_requested' || latestPathChange.change_type === 'path_change') {
            if (!pendingPathChange.value) {
              let toVal = {};
              try {
                toVal = typeof latestPathChange.to_values === 'string' ? JSON.parse(latestPathChange.to_values) : (latestPathChange.to_values || {});
              } catch(e) {}
              pendingPathChange.value = {
                id: latestPathChange.related_request_id || latestPathChange.id,
                new_track_name: toVal.path_name || toVal.target_path_name || 'Jalur Pilihan Baru',
                reason: latestPathChange.reason,
                submitted_at: latestPathChange.created_at_label || new Date(latestPathChange.created_at).toLocaleDateString('id-ID'),
              };
              state.value.pendingPathChange = pendingPathChange.value;
            }
          } else if (latestPathChange.change_type === 'path_change_approved') {
            pendingPathChange.value = null;
            if (state.value) delete state.value.pendingPathChange;
            pathChangeNotice.value = {
              type: 'approved',
              title: 'Permohonan Pindah Jalur Disetujui',
              message: 'Panitia PMB telah menyetujui permohonan alih jalur Anda. Data pendaftaran telah dimutakhirkan.',
            };
          } else if (latestPathChange.change_type === 'path_change_rejected') {
            pendingPathChange.value = null;
            if (state.value) delete state.value.pendingPathChange;
            pathChangeNotice.value = {
              type: 'rejected',
              title: 'Permohonan Pindah Jalur Ditolak',
              message: latestPathChange.reason || 'Permohonan pindah jalur belum dapat disetujui panitia.',
            };
          } else if (latestPathChange.change_type === 'path_change_cancelled') {
            // Permohonan telah dibatalkan secara sah: WAJIB NULL!
            pendingPathChange.value = null;
            if (state.value) delete state.value.pendingPathChange;
          }
        }
      }

      // 8. Cek Pengunduran Diri Resmi (CR-007)
      const wRes = await admissionApi.getMyWithdrawal().catch(() => null);
      if (wRes?.data?.data) {
        const wd = wRes.data.data;
        if (wd.status === 'effective' || wd.status === 'approved') {
          withdrawalInfo.value = wd;
          state.value.withdrawalInfo = wd;
          state.value.admission.backendStatus = 'withdrawn';
          state.value.admission.status = 'Pendaftaran Ditarik (Mengundurkan Diri)';
          pendingWithdrawal.value = null;
          if (state.value) delete state.value.pendingWithdrawal;
        } else if (wd.status === 'pending') {
          withdrawalInfo.value = wd;
          pendingWithdrawal.value = wd;
          state.value.pendingWithdrawal = wd;
        } else if (wd.status === 'rejected') {
          rejectedWithdrawal.value = wd;
          state.value.rejectedWithdrawal = wd;
          pendingWithdrawal.value = null;
          withdrawalInfo.value = null;
          if (state.value) {
            delete state.value.pendingWithdrawal;
            delete state.value.withdrawalInfo;
          }
        } else {
          // Status 'cancelled'
          rejectedWithdrawal.value = null;
          pendingWithdrawal.value = null;
          withdrawalInfo.value = null;
          if (state.value) {
            delete state.value.pendingWithdrawal;
            delete state.value.withdrawalInfo;
            delete state.value.rejectedWithdrawal;
          }
        }
      } else {
        pendingWithdrawal.value = null;
        withdrawalInfo.value = null;
        rejectedWithdrawal.value = null;
        if (state.value) {
          delete state.value.pendingWithdrawal;
          delete state.value.withdrawalInfo;
          delete state.value.rejectedWithdrawal;
        }
      }

      lastBackendSync.value = new Date().toLocaleTimeString('id-ID');
    } catch (err) {
      console.warn('Gagal sinkronisasi data pendaftar dari backend:', err);
    } finally {
      isSyncingBackend.value = false;
    }
  };

  // State baru CR-006 & CR-007 & CR-010
  const applicationHistory = ref([]);
  const pendingPathChange = ref(null);
  const pendingWithdrawal = ref(state.value?.pendingWithdrawal || null);
  const rejectedWithdrawal = ref(state.value?.rejectedWithdrawal || null);
  const pathChangeNotice = ref(null);
  const withdrawalInfo = ref(state.value?.withdrawalInfo || null);
  const installmentSchedule = ref([]);

  const dismissRejectedWithdrawal = () => {
    rejectedWithdrawal.value = null;
    if (state.value) delete state.value.rejectedWithdrawal;
  };

  const fetchHistory = async () => {
    try {
      const res = await admissionApi.getMyHistory();
      if (res.data?.data) {
        applicationHistory.value = res.data.data;
      }
    } catch (e) {
      console.warn('Gagal memuat riwayat pendaftaran:', e);
    }
  };

  const requestPathChange = async ({ newPathId, choice1Id, choice2Id, reason, trackName }) => {
    try {
      const res = await admissionApi.requestPathChange({
        new_path_id: newPathId,
        choice1_id: choice1Id,
        choice2_id: choice2Id,
        reason,
      });
      const data = res.data?.data;
      if (data) {
        if (!data.applied_directly) {
          const pendingObj = {
            id: data.request_id || data.id,
            request_id: data.request_id || data.id,
            status: 'pending',
            new_track_name: trackName || 'Jalur Pilihan Baru',
            old_track_name: state.value.admission?.track,
            reason: reason || 'Permohonan alih jalur seleksi',
            submitted_at: new Date().toLocaleDateString('id-ID'),
          };
          pendingPathChange.value = pendingObj;
          state.value.pendingPathChange = pendingObj;
        } else {
          pendingPathChange.value = null;
          if (state.value) delete state.value.pendingPathChange;
        }
      }
      recordActivity({
        category: 'admission',
        action: 'Pengajuan Alih Jalur Seleksi',
        description: `Mengajukan permohonan alih jalur ke ${trackName || 'Jalur Baru'}. Alasan: "${reason || 'Penyesuaian minat studi'}"`,
        actor: 'Calon Mahasiswa',
        badgeColor: 'blue',
      });
      await syncFromBackend();
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const cancelPendingPathChange = async () => {
    try {
      await admissionApi.cancelPendingPathChange();
      pendingPathChange.value = null;
      if (state.value) {
        delete state.value.pendingPathChange;
      }
      recordActivity({
        category: 'admission',
        action: 'Pembatalan Permohonan Alih Jalur',
        description: 'Permohonan pindah jalur seleksi ditarik kembali oleh pendaftar.',
        actor: 'Calon Mahasiswa',
        badgeColor: 'rose',
      });
      await syncFromBackend();
      return { success: true };
    } catch (err) {
      throw err;
    }
  };

  const withdrawApplication = async ({ reasonCategory, reason, password }) => {
    try {
      const res = await admissionApi.withdrawApplication({
        reason_category: reasonCategory,
        reason,
        password,
      });
      if (res.data?.data) {
        const wd = res.data.data.withdrawal || res.data.data;
        const status = wd.status || res.data.data.status;
        withdrawalInfo.value = wd;
        state.value.withdrawalInfo = wd;
        if (status === 'effective' || status === 'approved') {
          state.value.admission.backendStatus = 'withdrawn';
          state.value.admission.status = 'Pendaftaran Ditarik (Mengundurkan Diri)';
          pendingWithdrawal.value = null;
          if (state.value) delete state.value.pendingWithdrawal;
        } else {
          // Status pending: menunggu persetujuan panitia PMB / BAAK
          pendingWithdrawal.value = wd;
          state.value.pendingWithdrawal = wd;
        }
      }
      recordActivity({
        category: 'admission',
        action: 'Pengajuan Pengunduran Diri Resmi',
        description: `Mengajukan pengunduran diri kepesertaan seleksi PMB (Kategori: ${reasonCategory}). Alasan: "${reason}".`,
        actor: 'Calon Mahasiswa',
        badgeColor: 'rose',
      });
      await syncFromBackend();
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const renewInvoice = async (invoiceId) => {
    try {
      const res = await financeApi.renewInvoice(invoiceId);
      await syncFromBackend();
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const requestInstallment = async ({ invoiceId, numTerms, reason }) => {
    try {
      const res = await financeApi.requestInstallment(invoiceId, {
        num_terms: numTerms,
        reason,
      });
      await fetchInstallments(invoiceId);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const fetchInstallments = async (invoiceId) => {
    try {
      const res = await financeApi.getInstallments(invoiceId);
      if (res.data?.data) {
        installmentSchedule.value = res.data.data;
      }
      return res.data;
    } catch (e) {
      console.warn('Gagal memuat jadwal cicilan:', e);
    }
  };

  const cancelPendingWithdrawal = async () => {
    try {
      await admissionApi.cancelPendingWithdrawal();
      pendingWithdrawal.value = null;
      withdrawalInfo.value = null;
      if (state.value) {
        delete state.value.pendingWithdrawal;
        delete state.value.withdrawalInfo;
      }
      recordActivity({
        category: 'admission',
        action: 'Pembatalan Permohonan Pengunduran Diri',
        description: 'Permohonan pengunduran diri resmi dibatalkan. Status pendaftaran calon mahasiswa aktif kembali.',
        actor: 'Calon Mahasiswa',
        badgeColor: 'blue',
      });
      await syncFromBackend();
      return { success: true };
    } catch (err) {
      throw err;
    }
  };

  const downloadWithdrawalLetter = async () => {
    try {
      const res = await admissionApi.getWithdrawalLetterPDF();
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `SK_Pengunduran_Diri_${state.value.candidate.registrationNumber || 'BTH'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.warn('Gagal mengunduh SK Pengunduran Diri:', e);
      window.print();
    }
  };

  const addStatusLog = ({ stage, title, description, status = 'completed', actor = 'Sistem PMB', category = 'system' }) => {
    return recordActivity({
      category,
      action: title,
      title,
      description,
      status,
      actor,
    });
  };

  const computedStatusHistory = computed(() => {
    const recordedLogs = Array.isArray(state.value?.statusLogs) ? [...state.value.statusLogs] : [];

    // Helper untuk mengecek apakah sudah ada log untuk kategori tertentu
    const hasCategoryAction = (cat, keyword) =>
      recordedLogs.some((l) => l.category === cat || (l.action && l.action.toLowerCase().includes(keyword.toLowerCase())));

    // Baseline fallbacks jika akun sudah memiliki data tapi belum tercatat di statusLogs
    const baseline = [];

    if (isProfileComplete.value && !hasCategoryAction('profile', 'biodata')) {
      baseline.push({
        id: 'base-profile',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        category: 'profile',
        categoryLabel: 'Biodata & Profil',
        action: 'Simpan Data Biodata Pribadi',
        title: 'Biodata Calon Mahasiswa Lengkap',
        stage: 'Biodata & Profil',
        description: `Informasi identitas diri (${state.value?.candidate?.fullName || 'Calon Mahasiswa'}), NIK, orang tua, dan asal sekolah berhasil disimpan.`,
        status: 'completed',
        actor: 'Calon Mahasiswa',
        badgeColor: 'emerald',
      });
    }

    if (isAdmissionComplete.value && !hasCategoryAction('admission', 'jalur')) {
      baseline.push({
        id: 'base-admission',
        timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
        category: 'admission',
        categoryLabel: 'Jalur Seleksi',
        action: 'Simpan Pilihan Jalur & Program Studi',
        title: 'Jalur & Pilihan Program Studi Disimpan',
        stage: 'Jalur Seleksi',
        description: `Memilih ${state.value?.admission?.track || 'Jalur Reguler'} dengan Pilihan 1: ${state.value?.admission?.prodi1 || 'Program Studi'}.`,
        status: 'completed',
        actor: 'Calon Mahasiswa',
        badgeColor: 'blue',
      });
    }

    if (isRegPaymentComplete.value && !hasCategoryAction('payment', 'formulir')) {
      baseline.push({
        id: 'base-regpay',
        timestamp: state.value?.payments?.registrationFee?.paidAt || new Date(Date.now() - 3600000 * 16).toISOString(),
        category: 'payment',
        categoryLabel: 'Pembayaran',
        action: state.value?.referral?.isApplied ? 'Bypass Formulir via Kode Referal' : 'Pelunasan Biaya Formulir Pendaftaran',
        title: state.value?.referral?.isApplied ? 'Bypass Formulir via Kode Referal' : 'Pembayaran Formulir Terverifikasi',
        stage: 'Pembayaran',
        description: state.value?.referral?.isApplied
          ? `Biaya pendaftaran dialihkan via kemitraan sekolah (${state.value.referral.code} - ${state.value.referral.schoolName}).`
          : 'Pembayaran biaya formulir pendaftaran PMB sebesar Rp 250.000 dinyatakan lunas.',
        status: 'completed',
        actor: state.value?.referral?.isApplied ? 'Mitra Sekolah PMB' : 'Biro Keuangan BTH',
        badgeColor: 'emerald',
      });
    }

    if (isDocumentsComplete.value && !hasCategoryAction('document', 'berkas')) {
      baseline.push({
        id: 'base-docs',
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        category: 'document',
        categoryLabel: 'Berkas Persyaratan',
        action: 'Unggah Berkas Persyaratan Lengkap',
        title: 'Seluruh Berkas Persyaratan Terunggah',
        stage: 'Berkas Persyaratan',
        description: 'Seluruh dokumen persyaratan (Ijazah/SKL, KTP, KK, Pasfoto) berhasil diunggah ke sistem.',
        status: 'completed',
        actor: 'Calon Mahasiswa',
        badgeColor: 'amber',
      });
    }

    if (isExamCompleted.value && !hasCategoryAction('exam', 'cbt')) {
      baseline.push({
        id: 'base-exam',
        timestamp: state.value?.exam?.completedAt || new Date(Date.now() - 3600000 * 8).toISOString(),
        category: 'exam',
        categoryLabel: 'Ujian Mandiri CBT',
        action: 'Penyelesaian Ujian Mandiri CBT',
        title: 'Ujian Mandiri CBT Diselesaikan',
        stage: 'Ujian Mandiri CBT',
        description: `Mengerjakan sesi Computer-Based Test (CBT) dengan perolehan skor ${state.value?.exam?.score || 0}/100.`,
        status: 'completed',
        actor: 'Sistem Ujian CBT',
        badgeColor: 'indigo',
      });
    }

    if (isResultPassed.value && !hasCategoryAction('system', 'lulus')) {
      baseline.push({
        id: 'base-result',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        category: 'system',
        categoryLabel: 'Hasil Seleksi',
        action: 'Kelulusan Seleksi PMB',
        title: 'Dinyatakan Lulus Seleksi PMB',
        stage: 'Hasil Seleksi',
        description: `Dinyatakan lulus seleksi pada program studi ${state.value?.result?.acceptedProdi || state.value?.admission?.prodi1}.`,
        status: 'completed',
        actor: 'Panitia Seleksi PMB',
        badgeColor: 'emerald',
      });
    }

    const allLogs = [...recordedLogs, ...baseline];
    return allLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  });

  const applyReferralCode = (code) => {
    const referralStore = useReferralStore();
    const authStore = useAuthStore();
    const candidateData = state.value.candidate || {};
    const currentUser = authStore.currentUser || {};

    const studentName =
      candidateData.fullName ||
      currentUser.full_name ||
      currentUser.name ||
      (currentUser.email ? currentUser.email.split('@')[0] : 'Calon Mahasiswa');

    const studentEmail =
      candidateData.email ||
      currentUser.email ||
      '';

    const result = referralStore.applyReferralForStudent(code, {
      candidateName: studentName,
      email: studentEmail,
      nik: candidateData.nik || '-',
      nisn: candidateData.nisn || '-',
      phone: candidateData.phone || currentUser.phone || '',
      registrationNumber: candidateData.registrationNumber || '',
      prodi: state.value.admission?.prodi1 || '',
      user_id: currentUser.id || null,
      nominal: 300000,
    });

    if (!result.success) {
      return result;
    }

    const refData = result.referral;
    state.value.referral = {
      code: refData.code,
      picName: refData.picName,
      schoolName: refData.schoolName,
      appliedAt: new Date().toISOString(),
      isApplied: true,
    };

    if (state.value.admission) {
      state.value.admission.track = `Jalur Kemitraan Guru BK (${refData.schoolName})`;
      state.value.admission.backendStatus = 'form_open';
    }

    if (state.value.payments?.registrationFee) {
      state.value.payments.registrationFee.amount = 0;
      state.value.payments.registrationFee.isFree = true;
      state.value.payments.registrationFee.status = 'paid';
      state.value.payments.registrationFee.statusLabel = 'Lunas (Kemitraan Sekolah)';
      state.value.payments.registrationFee.paidAt = new Date().toISOString();
      state.value.payments.registrationFee.paymentMethod = `Kemitraan Guru BK (${refData.code})`;
    }

    recordActivity({
      category: 'admission',
      action: 'Penerapan Kode Referal Sekolah Mitra BK',
      description: `Biaya pendaftaran dialihkan melalui kemitraan sekolah (${refData.picName} - ${refData.schoolName}).`,
      status: 'completed',
      actor: 'Mitra Sekolah PMB',
      badgeColor: 'amber',
    });

    try {
      const key = getStorageKey();
      if (key && authStore.currentUser) {
        localStorage.setItem(key, JSON.stringify(state.value));
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('bth_payment_confirmed', {
            detail: { email: studentEmail, regNo: candidateData.registrationNumber },
          })
        );
      }
    } catch (e) {
      console.warn('Gagal menyimpan status referal:', e);
    }

    return result;
  };

  const removeReferralCode = () => {
    const referralStore = useReferralStore();
    const currentCode = state.value.referral?.code;
    const authStore = useAuthStore();
    const candidateData = state.value.candidate || {};
    const currentUser = authStore.currentUser || {};
    const studentEmail = candidateData.email || currentUser.email || '';

    if (currentCode) {
      referralStore.removeStudentFromReferral(currentCode, studentEmail);
    }

    state.value.referral = {
      code: null,
      picName: null,
      schoolName: null,
      appliedAt: null,
      isApplied: false,
    };

    if (state.value.admission) {
      state.value.admission.track = 'Reguler Tes CBT';
    }

    if (state.value.payments?.registrationFee) {
      state.value.payments.registrationFee.amount = 250000;
      state.value.payments.registrationFee.isFree = false;
      state.value.payments.registrationFee.status = 'unpaid';
      state.value.payments.registrationFee.statusLabel = 'Belum Dibayar';
      state.value.payments.registrationFee.paidAt = null;
      state.value.payments.registrationFee.paymentMethod = null;
    }

    recordActivity({
      category: 'admission',
      action: 'Pembatalan Kode Referal BK',
      description: 'Kode referal kemitraan sekolah telah dibatalkan dari akun Anda.',
      status: 'completed',
      actor: 'Calon Mahasiswa',
      badgeColor: 'rose',
    });

    return { success: true, message: 'Kode referal berhasil dibatalkan.' };
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
    isFreeTrack,
    isRegPaymentComplete,
    isScheduleReady,
    isExamCompleted,
    isResultPassed,
    isUktPaid,
    isWithdrawn,
    canCancelAdmission,
    isAdmissionLocked,
    isExamFailed,
    completedStepsCount,
    progressPercent,
    applicationHistory,
    pendingPathChange,
    pendingWithdrawal,
    rejectedWithdrawal,
    dismissRejectedWithdrawal,
    pathChangeNotice,
    withdrawalInfo,
    installmentSchedule,
    fetchHistory,
    requestPathChange,
    cancelPendingPathChange,
    withdrawApplication,
    cancelPendingWithdrawal,
    downloadWithdrawalLetter,
    renewInvoice,
    requestInstallment,
    fetchInstallments,
    updateProfile,
    updateAdmission,
    cancelAdmission,
    reapplyNewTrack,
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
    recordActivity,
    addStatusLog,
    computedStatusHistory,
    applyReferralCode,
    removeReferralCode,
  };
});
