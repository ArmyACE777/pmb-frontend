import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { organizationApi } from '@/api/organization';

/**
 * Standard Official Master Catalog: Universitas Bakti Tunas Husada
 * Digunakan sebagai basis data standar dan graceful fallback saat backend service dalam fase pengerjaan lokal
 */
const DEFAULT_FACULTIES = [
  {
    id: 1,
    code: 'FF',
    name: 'Fakultas Farmasi',
    dean: 'Prof. Dr. apt. Budi Rahardjo, M.Si.',
    building: 'Gedung Rektorat & Farmasi Lt. 2',
    accreditation: 'Unggul',
    is_active: true,
  },
  {
    id: 2,
    code: 'FIK',
    name: 'Fakultas Ilmu Kesehatan',
    dean: 'Dr. Ns. Siti Aminah, S.Kep., M.Kep.',
    building: 'Gedung Florence Nightingale',
    accreditation: 'Baik Sekali',
    is_active: true,
  },
  {
    id: 3,
    code: 'FTB',
    name: 'Fakultas Teknologi & Bisnis',
    dean: 'Dr. Ir. Hendra Gunawan, M.T.',
    building: 'Gedung Laboratorium Terpadu Lt. 3',
    accreditation: 'Baik',
    is_active: true,
  },
];

const DEFAULT_DEGREES = [
  {
    id: 1,
    code: 'D3',
    name: 'Diploma Tiga',
    studyDuration: '6 Semester (3 Tahun)',
    degreeTitle: 'Ahli Madya (A.Md.)',
    totalQuota: 130,
    is_active: true,
  },
  {
    id: 2,
    code: 'S1',
    name: 'Sarjana',
    studyDuration: '8 Semester (4 Tahun)',
    degreeTitle: 'Sarjana (S.Farm., S.Kom., S.Kes., S.Bns.)',
    totalQuota: 475,
    is_active: true,
  },
  {
    id: 3,
    code: 'Profesi',
    name: 'Pendidikan Profesi',
    studyDuration: '2 Semester (1 Tahun)',
    degreeTitle: 'Apoteker / Ners (Apt., Ners)',
    totalQuota: 60,
    is_active: true,
  },
  {
    id: 4,
    code: 'S2',
    name: 'Magister',
    studyDuration: '4 Semester (2 Tahun)',
    degreeTitle: 'Magister Farmasi (M.Farm.)',
    totalQuota: 30,
    is_active: false,
  },
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
  const degrees = ref(JSON.parse(localStorage.getItem('bth_degrees')) || DEFAULT_DEGREES);
  const studyPrograms = ref(JSON.parse(localStorage.getItem('bth_study_programs')) || DEFAULT_STUDY_PROGRAMS);

  const isLoading = ref(false);
  const isLiveConnected = ref(false);
  const lastSync = ref(null);

  // Simpan ke localStorage untuk persistensi sesi
  const persistState = () => {
    localStorage.setItem('bth_faculties', JSON.stringify(faculties.value));
    localStorage.setItem('bth_degrees', JSON.stringify(degrees.value));
    localStorage.setItem('bth_study_programs', JSON.stringify(studyPrograms.value));
  };

  // Getters
  const activeStudyPrograms = computed(() => {
    return studyPrograms.value.filter((sp) => sp.is_active);
  });

  const activeFaculties = computed(() => {
    return faculties.value.filter((f) => f.is_active);
  });

  const activeDegrees = computed(() => {
    return degrees.value.filter((d) => d.is_active);
  });

  const totalProgramsCount = computed(() => studyPrograms.value.length);
  const activeProgramsCount = computed(() => activeStudyPrograms.value.length);
  const facultiesCount = computed(() => faculties.value.length);
  const degreesCount = computed(() => degrees.value.length);

  // Data fakultas dengan perhitungan jumlah prodi otomatis
  const facultiesWithCount = computed(() => {
    return faculties.value.map((f) => ({
      ...f,
      prodiCount: studyPrograms.value.filter((p) => p.faculty_code === f.code || p.faculty_id === f.id).length,
    }));
  });

  // Data jenjang dengan perhitungan jumlah prodi otomatis
  const degreesWithCount = computed(() => {
    return degrees.value.map((d) => ({
      ...d,
      prodiCount: studyPrograms.value.filter((p) => p.degree === d.code).length,
    }));
  });

  /**
   * Mengambil daftar fakultas dari API Gateway / Organization Service
   */
  async function fetchFaculties() {
    isLoading.value = true;
    try {
      const res = await organizationApi.getFaculties();
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        faculties.value = res.data.data.map((item) => {
          const fallback = DEFAULT_FACULTIES.find((df) => df.code === item.code) || {};
          return {
            id: item.id || fallback.id || Math.floor(Math.random() * 1000),
            code: item.code,
            name: item.name,
            dean: item.dean || fallback.dean || '-',
            building: item.building || fallback.building || 'Kampus Utama BTH',
            accreditation: item.accreditation || fallback.accreditation || 'Baik Sekali',
            is_active: item.is_active !== false,
          };
        });
        isLiveConnected.value = true;
        persistState();
      }
    } catch {
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

  // ==========================================
  // CRUD: PROGRAM STUDI (PRODI)
  // ==========================================

  async function toggleStudyProgram(id) {
    const item = studyPrograms.value.find((sp) => sp.id === id);
    if (!item) return;

    item.is_active = !item.is_active;
    persistState();

    try {
      await organizationApi.toggleStudyProgram(id);
    } catch {}
  }

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
      degree_title: payload.degree_title || (payload.degree === 'D3' ? 'A.Md.' : payload.degree === 'S1' ? 'S.' : 'Gelar'),
      accreditation: payload.accreditation || 'Baik',
      ukt_estimate: payload.ukt_estimate || 'Rp 4.500.000 / semester',
      is_active: payload.is_active !== false,
    };

    studyPrograms.value.unshift(newProgram);
    persistState();

    try {
      await organizationApi.createStudyProgram(newProgram);
    } catch {}

    return newProgram;
  }

  async function updateStudyProgram(id, payload) {
    const idx = studyPrograms.value.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    const faculty = faculties.value.find((f) => f.id === payload.faculty_id || f.code === payload.faculty_code);

    const updated = {
      ...studyPrograms.value[idx],
      name: payload.name !== undefined ? payload.name.trim() : studyPrograms.value[idx].name,
      code: payload.code !== undefined ? payload.code.toUpperCase().trim() : studyPrograms.value[idx].code,
      nim_code: payload.nim_code !== undefined ? String(payload.nim_code).trim() : studyPrograms.value[idx].nim_code,
      faculty_id: faculty ? faculty.id : studyPrograms.value[idx].faculty_id,
      faculty_code: faculty ? faculty.code : studyPrograms.value[idx].faculty_code,
      faculty_name: faculty ? faculty.name : studyPrograms.value[idx].faculty_name,
      degree: payload.degree || studyPrograms.value[idx].degree,
      degree_title: payload.degree_title || (payload.degree === 'D3' ? 'A.Md.' : payload.degree === 'S1' ? 'S.' : 'Gelar'),
      accreditation: payload.accreditation || studyPrograms.value[idx].accreditation,
      ukt_estimate: payload.ukt_estimate || studyPrograms.value[idx].ukt_estimate,
      is_active: payload.is_active !== undefined ? payload.is_active : studyPrograms.value[idx].is_active,
    };

    studyPrograms.value[idx] = updated;
    persistState();

    try {
      await organizationApi.updateStudyProgram(id, updated);
    } catch {}

    return updated;
  }

  async function deleteStudyProgram(id) {
    const idx = studyPrograms.value.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    const removed = studyPrograms.value.splice(idx, 1)[0];
    persistState();

    try {
      await organizationApi.deleteStudyProgram(id);
    } catch {}

    return removed;
  }

  // ==========================================
  // CRUD: FAKULTAS AKADEMIK
  // ==========================================

  async function toggleFaculty(id) {
    const item = faculties.value.find((f) => f.id === id);
    if (!item) return;

    item.is_active = !item.is_active;
    persistState();

    try {
      await organizationApi.toggleFaculty(id);
    } catch {}
  }

  async function addFaculty(payload) {
    const newId = faculties.value.length > 0 ? Math.max(...faculties.value.map((f) => f.id)) + 1 : 1;
    const newFac = {
      id: newId,
      code: payload.code.toUpperCase().trim(),
      name: payload.name.trim(),
      dean: payload.dean?.trim() || '-',
      building: payload.building?.trim() || 'Kampus Utama BTH',
      accreditation: payload.accreditation || 'Baik Sekali',
      is_active: payload.is_active !== false,
    };

    faculties.value.push(newFac);
    persistState();

    try {
      await organizationApi.createFaculty(newFac);
    } catch {}

    return newFac;
  }

  async function updateFaculty(id, payload) {
    const idx = faculties.value.findIndex((f) => f.id === id);
    if (idx === -1) return null;

    const oldCode = faculties.value[idx].code;
    const updated = {
      ...faculties.value[idx],
      code: payload.code ? payload.code.toUpperCase().trim() : faculties.value[idx].code,
      name: payload.name ? payload.name.trim() : faculties.value[idx].name,
      dean: payload.dean !== undefined ? payload.dean.trim() : faculties.value[idx].dean,
      building: payload.building !== undefined ? payload.building.trim() : faculties.value[idx].building,
      accreditation: payload.accreditation || faculties.value[idx].accreditation,
      is_active: payload.is_active !== undefined ? payload.is_active : faculties.value[idx].is_active,
    };

    faculties.value[idx] = updated;

    // Sinkronkan nama & kode fakultas ke studyPrograms terkait
    studyPrograms.value.forEach((sp) => {
      if (sp.faculty_id === id || sp.faculty_code === oldCode) {
        sp.faculty_code = updated.code;
        sp.faculty_name = updated.name;
      }
    });

    persistState();

    try {
      await organizationApi.updateFaculty(id, updated);
    } catch {}

    return updated;
  }

  async function deleteFaculty(id) {
    const fac = faculties.value.find((f) => f.id === id);
    if (!fac) return false;

    // Bersihkan fakultas
    faculties.value = faculties.value.filter((f) => f.id !== id);

    // Hapus prodi yang bernaung di bawah fakultas ini
    studyPrograms.value = studyPrograms.value.filter((sp) => sp.faculty_id !== id && sp.faculty_code !== fac.code);

    persistState();

    try {
      await organizationApi.deleteFaculty(id);
    } catch {}

    return fac;
  }

  // ==========================================
  // CRUD: JENJANG PENDIDIKAN
  // ==========================================

  async function toggleDegree(id) {
    const item = degrees.value.find((d) => d.id === id);
    if (!item) return;

    item.is_active = !item.is_active;
    persistState();
  }

  async function addDegree(payload) {
    const newId = degrees.value.length > 0 ? Math.max(...degrees.value.map((d) => d.id)) + 1 : 1;
    const newDeg = {
      id: newId,
      code: payload.code.toUpperCase().trim(),
      name: payload.name.trim(),
      studyDuration: payload.studyDuration?.trim() || '8 Semester (4 Tahun)',
      degreeTitle: payload.degreeTitle?.trim() || 'Sarjana',
      totalQuota: Number(payload.totalQuota) || 100,
      is_active: payload.is_active !== false,
    };

    degrees.value.push(newDeg);
    persistState();
    return newDeg;
  }

  async function updateDegree(id, payload) {
    const idx = degrees.value.findIndex((d) => d.id === id);
    if (idx === -1) return null;

    const oldCode = degrees.value[idx].code;
    const updated = {
      ...degrees.value[idx],
      code: payload.code ? payload.code.toUpperCase().trim() : degrees.value[idx].code,
      name: payload.name ? payload.name.trim() : degrees.value[idx].name,
      studyDuration: payload.studyDuration !== undefined ? payload.studyDuration.trim() : degrees.value[idx].studyDuration,
      degreeTitle: payload.degreeTitle !== undefined ? payload.degreeTitle.trim() : degrees.value[idx].degreeTitle,
      totalQuota: payload.totalQuota !== undefined ? Number(payload.totalQuota) : degrees.value[idx].totalQuota,
      is_active: payload.is_active !== undefined ? payload.is_active : degrees.value[idx].is_active,
    };

    degrees.value[idx] = updated;

    // Jika kode jenjang berubah, perbarui prodi yang bersangkutan
    if (oldCode !== updated.code) {
      studyPrograms.value.forEach((sp) => {
        if (sp.degree === oldCode) sp.degree = updated.code;
      });
    }

    persistState();
    return updated;
  }

  async function deleteDegree(id) {
    const deg = degrees.value.find((d) => d.id === id);
    if (!deg) return false;

    degrees.value = degrees.value.filter((d) => d.id !== id);
    persistState();
    return deg;
  }

  // ==========================================
  // HELPER LOOKUPS
  // ==========================================

  function getStudyProgramByCode(code) {
    if (!code) return null;
    return studyPrograms.value.find((sp) => sp.code.toUpperCase() === code.toUpperCase()) || null;
  }

  function getStudyProgramByName(name) {
    if (!name) return null;
    return studyPrograms.value.find((sp) => sp.name.toLowerCase() === name.toLowerCase()) || null;
  }

  return {
    faculties,
    degrees,
    studyPrograms,
    isLoading,
    isLiveConnected,
    lastSync,
    activeStudyPrograms,
    activeFaculties,
    activeDegrees,
    totalProgramsCount,
    activeProgramsCount,
    facultiesCount,
    degreesCount,
    facultiesWithCount,
    degreesWithCount,
    fetchFaculties,
    fetchStudyPrograms,
    syncAll,
    toggleStudyProgram,
    addStudyProgram,
    updateStudyProgram,
    deleteStudyProgram,
    toggleFaculty,
    addFaculty,
    updateFaculty,
    deleteFaculty,
    toggleDegree,
    addDegree,
    updateDegree,
    deleteDegree,
    getStudyProgramByCode,
    getStudyProgramByName,
  };
});
