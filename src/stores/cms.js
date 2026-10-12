import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

/**
 * Master Data Bawaan Resmi: Universitas Bakti Tunas Husada (Default Fallback)
 * Memastikan semua data yang sudah ada saat ini tetap utuh dan tidak hilang.
 */
export const DEFAULT_CMS_DATA = {
  identity: {
    name: 'Universitas Bakti Tunas Husada',
    shortName: 'Universitas BTH',
    acronym: 'BTH',
    tagline: 'Transforming New Generation',
    subTagline: 'Sistem Informasi Penerimaan Mahasiswa Baru Terpadu',
    academicYear: '2026/2027',
    activeWave: 'Gelombang 1',
    accreditation: 'Terakreditasi BAN-PT & LAM-PTKes',
    rectorName: 'Dr. Hj. Eni Kartika, M.Si.',
    logoUrl: '/assets/icons/bth.png',
    emblemUrl: '/assets/icons/bth-emblem.png',
    heroCampusBgUrl: '/assets/images/bth-campus-bg.jpg',
  },
  contact: {
    address: 'Jl. Cilolohan No. 36, Kahuripan, Kec. Tawang, Kota Tasikmalaya, Jawa Barat 46115',
    city: 'Kota Tasikmalaya',
    province: 'Jawa Barat',
    postalCode: '46115',
    buildingName: 'Sekretariat PMB, Gedung Rektorat Lt. 1',
    email: 'pmb@bth.ac.id',
    phone: '(0265) 345678',
    whatsapp: '0821-1710-0200',
    whatsappLink: 'https://api.whatsapp.com/send?phone=6282117100200&text=Halo%20Helpdesk%20PMB%20BTH%2C%20saya%20ingin%20bertanya%20mengenai%20pendaftaran.',
    officeHours: 'Senin - Jumat (08.00 - 16.00 WIB)',
    websiteUrl: 'https://universitas-bth.ac.id',
  },
  announcement: {
    enabled: false,
    badge: 'Informasi PMB 2026',
    title: 'Pendaftaran Mahasiswa Baru Tahun Akademik 2026/2027 Dibuka!',
    text: 'Pendaftaran Jalur Reguler, Prestasi Akademik, dan Kemitraan Guru BK telah dibuka. Manfaatkan kemudahan verifikasi berkas daring dan tes CBT mandiri.',
    actionText: 'Tanya Panitia via WA',
    actionLink: 'https://api.whatsapp.com/send?phone=6282117100200',
  },
  socialMedia: {
    instagram: 'https://instagram.com/universitas_bth',
    youtube: 'https://youtube.com/@universitasbth',
    facebook: 'https://facebook.com/universitasbth',
    tiktok: 'https://tiktok.com/@universitasbth',
  },
  links: {
    publicWaGroup: 'https://chat.whatsapp.com/BTH-KomunitasPMB2026',
    onboardingWaGroup: 'https://chat.whatsapp.com/BTH-MabaOnboarding2026',
    bkWaGroup: 'https://chat.whatsapp.com/BTH-MitraGuruBK2026',
    officialWaGroup: 'https://chat.whatsapp.com/BTH-MabaOnboarding2026',
    brochurePdfUrl: 'https://pmb.bth.ac.id/brosur-pmb-2026.pdf',
    cbtServerUrl: 'https://cbt.universitas-bth.ac.id',
    virtualTourUrl: 'https://universitas-bth.ac.id/virtual-tour',
  },
  faqs: [
    {
      id: 'faq-1',
      question: 'Bagaimana alur pendaftaran mahasiswa baru di Universitas BTH?',
      answer: 'Alur pendaftaran terdiri dari 6 tahapan: Pengisian Biodata Pribadi, Pemilihan Jalur & Program Studi, Unggah Dokumen Berkas, Pembayaran Biaya Formulir (atau bypass referral BK), Ujian Mandiri CBT, dan Pengumuman Kelulusan serta Registrasi Ulang.',
      category: 'Pendaftaran',
    },
    {
      id: 'faq-2',
      question: 'Dokumen apa saja yang wajib diunggah saat pendaftaran?',
      answer: 'Dokumen wajib meliputi Ijazah atau Surat Keterangan Lulus (SKL), Kartu Tanda Penduduk (KTP) atau Kartu Pelajar, Kartu Keluarga (KK), Pasfoto formal 4x6, dan Surat Keterangan Sehat.',
      category: 'Berkas',
    },
    {
      id: 'faq-3',
      question: 'Apakah jalur Mitra Guru BK mendapatkan bebas biaya pendaftaran?',
      answer: 'Ya, pendaftar yang memasukkan kode referal resmi dari Guru BK sekolah mitra berhak mendapatkan pembebasan biaya formulir langsung atau skema pendaftaran khusus kemitraan.',
      category: 'Jalur & Biaya',
    },
    {
      id: 'faq-4',
      question: 'Berapa passing grade nilai ujian CBT untuk dinyatakan lulus?',
      answer: 'Nilai ambang batas minimal kelulusan Computer-Based Test (CBT) adalah 70 dari skala 100. Jika belum lulus, pendaftar dapat membuka pendaftaran jalur baru tanpa perlu mengisi ulang biodata.',
      category: 'Seleksi CBT',
    },
    {
      id: 'faq-5',
      question: 'Kapan nomor induk mahasiswa (NIM) resmi diterbitkan?',
      answer: 'NIM resmi akan diterbitkan secara otomatis setelah calon mahasiswa dinyatakan lulus seleksi dan menyelesaikan pelunasan Uang Kuliah Tunggal (UKT) Semester 1.',
      category: 'Registrasi Ulang',
    },
  ],
  tracks: [
    {
      id: 'reguler',
      name: 'Jalur Reguler Gelombang 1',
      fee: 250000,
      wave: 'Gelombang 1',
      description: 'Jalur pendaftaran umum dengan seleksi Computer-Based Test (CBT) dan verifikasi berkas.',
    },
    {
      id: 'prestasi',
      name: 'Jalur Prestasi Akademik / Rapor',
      fee: 250000,
      wave: 'Gelombang 1',
      description: 'Bebas tes tulis CBT bagi siswa berprestasi peringkat 1-10 paralel sekolah atau nilai rata-rata rapor min 82.',
    },
    {
      id: 'bk',
      name: 'Jalur Kemitraan Sekolah & Guru BK',
      fee: 0,
      wave: 'Gelombang 1',
      description: 'Pendaftaran kemitraan dengan kode referal sekolah mitra. Bebas biaya formulir pendaftaran Rp 0.',
    },
    {
      id: 'kip',
      name: 'Jalur Beasiswa KIP-Kuliah',
      fee: 0,
      wave: 'Gelombang 1',
      description: 'Program beasiswa subsidi pemerintah bagi calon mahasiswa berprestasi dari keluarga prasejahtera.',
    },
  ],
  studyPrograms: [
    {
      code: '01',
      name: 'S1 Farmasi',
      faculty: 'Fakultas Farmasi',
      degree: 'S.Farm.',
      uktFee: 6500000,
      gugus: 'Gugus 01 - Hygeia Farmasi',
    },
    {
      code: '02',
      name: 'S1 Teknologi Informasi',
      faculty: 'Fakultas Teknologi & Bisnis',
      degree: 'S.Kom.',
      uktFee: 4500000,
      gugus: 'Gugus 07 - Turing Informatika',
    },
    {
      code: '03',
      name: 'S1 Administrasi Rumah Sakit',
      faculty: 'Fakultas Ilmu Kesehatan',
      degree: 'S.Kes.',
      uktFee: 4500000,
      gugus: 'Gugus 05 - Asklepios Kesehatan',
    },
    {
      code: '04',
      name: 'D3 Analis Kesehatan (TLM)',
      faculty: 'Fakultas Ilmu Kesehatan',
      degree: 'A.Md.Kes.',
      uktFee: 4750000,
      gugus: 'Gugus 05 - Asklepios Kesehatan',
    },
    {
      code: '05',
      name: 'D3 Farmasi',
      faculty: 'Fakultas Farmasi',
      degree: 'A.Md.Farm.',
      uktFee: 4800000,
      gugus: 'Gugus 02 - Galen Kefarmasian',
    },
    {
      code: '06',
      name: 'S1 Manajemen Bisnis Informasi',
      faculty: 'Fakultas Teknologi & Bisnis',
      degree: 'S.M.',
      uktFee: 4250000,
      gugus: 'Gugus 08 - Lovelace Komputer',
    },
  ],
};

const STORAGE_KEY = 'bth_pmb_cms_v1';

export const useCmsStore = defineStore('cms', () => {
  const loadCmsData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          identity: { ...DEFAULT_CMS_DATA.identity, ...(parsed.identity || {}) },
          contact: { ...DEFAULT_CMS_DATA.contact, ...(parsed.contact || {}) },
          announcement: { ...DEFAULT_CMS_DATA.announcement, ...(parsed.announcement || {}) },
          socialMedia: { ...DEFAULT_CMS_DATA.socialMedia, ...(parsed.socialMedia || {}) },
          links: { ...DEFAULT_CMS_DATA.links, ...(parsed.links || {}) },
          faqs: Array.isArray(parsed.faqs) && parsed.faqs.length > 0 ? parsed.faqs : DEFAULT_CMS_DATA.faqs,
          tracks: Array.isArray(parsed.tracks) && parsed.tracks.length > 0 ? parsed.tracks : DEFAULT_CMS_DATA.tracks,
          studyPrograms: Array.isArray(parsed.studyPrograms) && parsed.studyPrograms.length > 0 ? parsed.studyPrograms : DEFAULT_CMS_DATA.studyPrograms,
        };
      }
    } catch (e) {
      console.warn('Gagal memuat data CMS dari storage:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_CMS_DATA));
  };

  const state = ref(loadCmsData());

  // Otomatis sinkronkan perubahan ke localStorage
  watch(
    state,
    (newVal) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
      } catch (e) {
        console.warn('Gagal menyimpan CMS ke localStorage:', e);
      }
    },
    { deep: true }
  );

  // Akses mudah per seksi
  const identity = computed(() => state.value.identity);
  const contact = computed(() => state.value.contact);
  const announcement = computed(() => state.value.announcement);
  const socialMedia = computed(() => state.value.socialMedia);
  const links = computed(() => state.value.links);
  const faqs = computed(() => state.value.faqs);
  const tracks = computed(() => state.value.tracks || DEFAULT_CMS_DATA.tracks);
  const studyPrograms = computed(() => state.value.studyPrograms || DEFAULT_CMS_DATA.studyPrograms);

  /**
   * Helper Dinamis: Dapatkan Biaya Formulir Pendaftaran per Jalur dari CMS
   */
  const getRegistrationFee = (trackName) => {
    if (!trackName) return 250000;
    const lower = String(trackName).toLowerCase();
    if (lower.includes('bk') || lower.includes('kemitraan') || lower.includes('kip')) {
      return 0;
    }
    const found = (tracks.value || []).find(
      (t) => t.name?.toLowerCase() === lower || t.id === lower
    );
    if (found && typeof found.fee === 'number') {
      return found.fee;
    }
    return 250000;
  };

  /**
   * Helper Dinamis: Dapatkan Biaya UKT Semester 1 per Program Studi dari CMS
   */
  const getUktFee = (prodiName) => {
    if (!prodiName) return 4500000;
    const found = (studyPrograms.value || []).find(
      (p) => p.name?.toLowerCase() === String(prodiName).toLowerCase() || p.code === String(prodiName)
    );
    if (found && typeof found.uktFee === 'number') {
      return found.uktFee;
    }
    return 4500000;
  };

  /**
   * Perbarui seksi tertentu pada CMS
   */
  const updateSection = (section, payload) => {
    if (state.value[section]) {
      state.value[section] = { ...state.value[section], ...payload };
    }
  };

  /**
   * Simpan seluruh konfigurasi CMS
   */
  const saveAll = (newCms) => {
    const mergedLinks = { ...state.value.links, ...(newCms.links || {}) };
    if (mergedLinks.onboardingWaGroup) {
      mergedLinks.officialWaGroup = mergedLinks.onboardingWaGroup;
    }
    state.value = {
      identity: { ...state.value.identity, ...(newCms.identity || {}) },
      contact: { ...state.value.contact, ...(newCms.contact || {}) },
      announcement: { ...state.value.announcement, ...(newCms.announcement || {}) },
      socialMedia: { ...state.value.socialMedia, ...(newCms.socialMedia || {}) },
      links: mergedLinks,
      faqs: Array.isArray(newCms.faqs) ? newCms.faqs : state.value.faqs,
      tracks: Array.isArray(newCms.tracks) ? newCms.tracks : (state.value.tracks || DEFAULT_CMS_DATA.tracks),
      studyPrograms: Array.isArray(newCms.studyPrograms) ? newCms.studyPrograms : (state.value.studyPrograms || DEFAULT_CMS_DATA.studyPrograms),
    };
  };

  /**
   * Reset seluruh pengaturan CMS ke nilai bawaan resmi Universitas BTH
   */
  const resetToDefaults = () => {
    state.value = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA));
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  /**
   * FAQ Management
   */
  const addFaq = ({ question, answer, category = 'Umum' }) => {
    const newFaq = {
      id: `faq-${Date.now()}`,
      question,
      answer,
      category,
    };
    state.value.faqs.push(newFaq);
    return newFaq;
  };

  const updateFaq = (id, updated) => {
    const idx = state.value.faqs.findIndex((f) => f.id === id);
    if (idx !== -1) {
      state.value.faqs[idx] = { ...state.value.faqs[idx], ...updated };
    }
  };

  const removeFaq = (id) => {
    state.value.faqs = state.value.faqs.filter((f) => f.id !== id);
  };

  return {
    state,
    identity,
    contact,
    announcement,
    socialMedia,
    links,
    faqs,
    tracks,
    studyPrograms,
    getRegistrationFee,
    getUktFee,
    updateSection,
    saveAll,
    resetToDefaults,
    addFaq,
    updateFaq,
    removeFaq,
  };
});
