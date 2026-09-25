import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { organizationApi } from '@/api/organization';

/**
 * Standard Official Master Catalog: Universitas Bakti Tunas Husada
 * Digunakan sebagai basis data standar dan graceful fallback saat backend service dalam fase pengerjaan lokal
 */
const DEFAULT_FACULTIES = [
  { id: 1, code: 'FF', name: 'Fakultas Farmasi', is_active: true },
  { id: 2, code: 'FIK', name: 'Fakultas Ilmu Kesehatan', is_active: true },
  { id: 3, code: 'FTB', name: 'Fakultas Teknologi & Bisnis', is_active: true },
];

const DEFAULT_STUDY_PROGRAMS = [
  {
    id: 1,
    faculty_id: 1,
    faculty_code: 'FF',
    faculty_name: 'Fakultas Farmasi',
    code: 'FARM',
    nim_code: '01',
    name: 'S1 Farmasi',
    degree: 'S1',
    degree_title: 'S.Farm.',
    accreditation: 'Unggul',
    ukt_estimate: 'Rp 6.500.000 / semester',
    is_active: true,
  },
  {
    id: 2,
    faculty_id: 3,
    faculty_code: 'FTB',
    faculty_name: 'Fakultas Teknologi & Bisnis',
    code: 'TI',
    nim_code: '55',
    name: 'S1 Teknologi Informasi',
    degree: 'S1',
    degree_title: 'S.Kom.',
    accreditation: 'Baik Sekali',
    ukt_estimate: 'Rp 4.500.000 / semester',
    is_active: true,
  },
  {
    id: 3,
    faculty_id: 2,
    faculty_code: 'FIK',
    faculty_name: 'Fakultas Ilmu Kesehatan',
    code: 'ARS',
    nim_code: '03',
    name: 'S1 Administrasi Rumah Sakit',
    degree: 'S1',
    degree_title: 'S.Kes.',
    accreditation: 'Baik Sekali',
    ukt_estimate: 'Rp 4.500.000 / semester',
    is_active: true,
  },
  {
    id: 4,
    faculty_id: 2,
    faculty_code: 'FIK',
    faculty_name: 'Fakultas Ilmu Kesehatan',
    code: 'TLM',
    nim_code: '04',
    name: 'D3 Analis Kesehatan (TLM)',
    degree: 'D3',
    degree_title: 'A.Md.Kes.',
    accreditation: 'Baik Sekali',
    ukt_estimate: 'Rp 4.750.000 / semester',
    is_active: true,
  },
  {
    id: 5,
    faculty_id: 1,
    faculty_code: 'FF',
    faculty_name: 'Fakultas Farmasi',
    code: 'DFARM',
    nim_code: '05',
    name: 'D3 Farmasi',
    degree: 'D3',
    degree_title: 'A.Md.Farm.',
    accreditation: 'Unggul',
    ukt_estimate: 'Rp 4.800.000 / semester',
    is_active: true,
  },
  {
    id: 6,
    faculty_id: 3,
    faculty_code: 'FTB',
    faculty_name: 'Fakultas Teknologi & Bisnis',
    code: 'BD',
    nim_code: '57',
    name: 'S1 Bisnis Digital',
    degree: 'S1',
    degree_title: 'S.Bns.',
    accreditation: 'Baik',
    ukt_estimate: 'Rp 4.250.000 / semester',
    is_active: true,
  },
  {
    id: 7,
    faculty_id: 2,
    faculty_code: 'FIK',
    faculty_name: 'Fakultas Ilmu Kesehatan',
    code: 'SKEP',
    nim_code: '09',
    name: 'S1 Keperawatan',
    degree: 'S1',
    degree_title: 'S.Kep.',
    accreditation: 'Baik Sekali',
    ukt_estimate: 'Rp 5.200.000 / semester',
    is_active: true,
  },
];

export const useOrganizationStore = defineStore('organization', () => {
  const faculties = ref(JSON.parse(localStorage.getItem('bth_faculties')) || DEFAULT_FACULTIES);
  const studyPrograms = ref(JSON.parse(localStorage.getItem('bth_study_programs')) || DEFAULT_STUDY_PROGRAMS);
  const isLoading = ref(false);
  const isLiveConnected = ref(false);
  const lastSync = ref(null);

  // Simpan ke localStorage untuk persistensi sesi
  const persistState = () => {
    localStorage.setItem('bth_faculties', JSON.stringify(faculties.value));
    localStorage.setItem('bth_study_programs', JSON.stringify(studyPrograms.value));
  };

  // Getters
  const activeStudyPrograms = computed(() => {
    return studyPrograms.value.filter((sp) => sp.is_active);
  });

  const activeFaculties = computed(() => {
    return faculties.value.filter((f) => f.is_active);
  });

  const totalProgramsCount = computed(() => studyPrograms.value.length);
  const activeProgramsCount = computed(() => activeStudyPrograms.value.length);
  const facultiesCount = computed(() => faculties.value.length);

  /**
   * Mengambil daftar fakultas dari API Gateway / Organization Service
   */
  async function fetchFaculties() {
    isLoading.value = true;
    try {
      const res = await organizationApi.getFaculties();
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        faculties.value = res.data.data;
        isLiveConnected.value = true;
        persistState();
      }
    } catch {
      // Graceful fallback to default catalog
      if (!faculties.value || faculties.value.length === 0) {
        faculties.value = DEFAULT_FACULTIES;
        persistState();
      }
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Mengambil daftar program studi dari API Gateway / Organization Service
   */
  async function fetchStudyPrograms() {
    isLoading.value = true;
    try {
      const res = await organizationApi.getStudyPrograms();
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        studyPrograms.value = res.data.data.map((item, idx) => ({
          id: item.id || idx + 1,
          faculty_id: item.faculty_id,
          faculty_code: item.faculty_code || item.faculty?.code || 'FTB',
          faculty_name: item.faculty_name || item.faculty?.name || 'Fakultas',
          code: item.code,
          nim_code: item.nim_code || '01',
          name: item.name,
          degree: item.degree || 'S1',
          degree_title: item.degree === 'D3' ? 'A.Md.' : item.degree === 'S1' ? 'S.' : 'Gelar',
          accreditation: item.accreditation || 'Baik',
          ukt_estimate: item.ukt_estimate || 'Rp 4.500.000 / semester',
          is_active: item.is_active !== false,
        }));
        isLiveConnected.value = true;
        lastSync.value = new Date().toLocaleTimeString('id-ID');
        persistState();
      }
    } catch {
      // Graceful fallback to default catalog
      if (!studyPrograms.value || studyPrograms.value.length === 0) {
        studyPrograms.value = DEFAULT_STUDY_PROGRAMS;
        persistState();
      }
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Sinkronisasi data menyeluruh
   */
  async function syncAll() {
    await Promise.all([fetchFaculties(), fetchStudyPrograms()]);
  }

  /**
   * Toggle status aktif program studi
   */
  async function toggleStudyProgram(id) {
    const item = studyPrograms.value.find((sp) => sp.id === id);
    if (!item) return;

    item.is_active = !item.is_active;
    persistState();

    try {
      await organizationApi.toggleStudyProgram(id);
    } catch {
      // Tetap tersimpan di state lokal jika backend offline
    }
  }

  /**
   * Toggle status aktif fakultas
   */
  async function toggleFaculty(id) {
    const item = faculties.value.find((f) => f.id === id);
    if (!item) return;

    item.is_active = !item.is_active;
    persistState();

    try {
      await organizationApi.toggleFaculty(id);
    } catch {
      // Tetap tersimpan di state lokal jika backend offline
    }
  }

  /**
   * Tambah Program Studi Baru
   */
  async function addStudyProgram(payload) {
    const newId = studyPrograms.value.length > 0 ? Math.max(...studyPrograms.value.map((p) => p.id)) + 1 : 1;
    const faculty = faculties.value.find((f) => f.id === payload.faculty_id || f.code === payload.faculty_code);

    const newProgram = {
      id: newId,
      faculty_id: faculty ? faculty.id : 1,
      faculty_code: faculty ? faculty.code : 'FTB',
      faculty_name: faculty ? faculty.name : 'Fakultas Umum',
      code: payload.code.toUpperCase().trim(),
      nim_code: String(payload.nim_code).trim(),
      name: payload.name.trim(),
      degree: payload.degree || 'S1',
      degree_title: payload.degree_title || (payload.degree === 'D3' ? 'A.Md.' : 'S.'),
      accreditation: payload.accreditation || 'Baik',
      ukt_estimate: payload.ukt_estimate || 'Rp 4.500.000 / semester',
      is_active: payload.is_active !== false,
    };

    studyPrograms.value.unshift(newProgram);
    persistState();

    try {
      await organizationApi.createStudyProgram(newProgram);
    } catch {
      // Log / handle offline
    }

    return newProgram;
  }

  /**
   * Cari program studi berdasarkan kode (e.g. 'TI', 'FARM')
   */
  function getStudyProgramByCode(code) {
    if (!code) return null;
    return studyPrograms.value.find((sp) => sp.code.toUpperCase() === code.toUpperCase()) || null;
  }

  /**
   * Cari program studi berdasarkan nama lengkap (e.g. 'S1 Farmasi')
   */
  function getStudyProgramByName(name) {
    if (!name) return null;
    return studyPrograms.value.find((sp) => sp.name.toLowerCase() === name.toLowerCase()) || null;
  }

  return {
    faculties,
    studyPrograms,
    isLoading,
    isLiveConnected,
    lastSync,
    activeStudyPrograms,
    activeFaculties,
    totalProgramsCount,
    activeProgramsCount,
    facultiesCount,
    fetchFaculties,
    fetchStudyPrograms,
    syncAll,
    toggleStudyProgram,
    toggleFaculty,
    addStudyProgram,
    getStudyProgramByCode,
    getStudyProgramByName,
  };
});
