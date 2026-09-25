<template>
  <div class="space-y-6">
    <!-- Header Meja Master Data -->
    <div class="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono bg-blue-50 text-[#1E3A8A] border border-blue-200/70">
              PRD FASE 2: UC-32
            </span>
            <span class="text-xs font-medium text-slate-400">•</span>
            <span class="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              organization-service
            </span>
          </div>
          <h2 class="font-sora font-extrabold text-slate-900 text-lg sm:text-xl mt-1.5">
            Master Data Organisasi: Fakultas & Program Studi
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">
            Basis data resmi seluruh fakultas dan program studi untuk penerimaan mahasiswa baru, kuota jalur, dan penerbitan NIM.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
          <button
            @click="syncData"
            :disabled="organizationStore.isLoading"
            class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-sora font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Sinkronkan data dengan service backend"
          >
            <svg :class="{ 'animate-spin': organizationStore.isLoading }" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{{ organizationStore.isLoading ? 'Sinkron...' : 'Sinkronkan Data' }}</span>
          </button>

          <button
            @click="openAddModal"
            class="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-sora font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Tambah Program Studi</span>
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sora">Fakultas Aktif</div>
          <div class="font-sora font-extrabold text-xl text-slate-900 mt-0.5">
            {{ organizationStore.facultiesCount }}
          </div>
          <div class="text-[11px] text-slate-500 mt-0.5">Unit Akademik</div>
        </div>

        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sora">Total Program Studi</div>
          <div class="font-sora font-extrabold text-xl text-[#1E3A8A] mt-0.5">
            {{ organizationStore.totalProgramsCount }}
          </div>
          <div class="text-[11px] text-slate-500 mt-0.5">Semua Jenjang (S1 / D3)</div>
        </div>

        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sora">Prodi Buka Pendaftaran</div>
          <div class="font-sora font-extrabold text-xl text-emerald-700 mt-0.5">
            {{ organizationStore.activeProgramsCount }}
          </div>
          <div class="text-[11px] text-emerald-600 font-medium mt-0.5">Status Aktif PMB</div>
        </div>

        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sora">Format NIM Terstandar</div>
          <div class="font-sora font-extrabold text-sm text-slate-800 mt-1 font-mono">
            {YY}{NIM}{JALUR}{URUT}
          </div>
          <div class="text-[10px] text-slate-500 mt-0.5">Standar PRD Fase 2</div>
        </div>
      </div>
    </div>

    <!-- Alert Sukses Operasi -->
    <div
      v-if="toastMessage"
      class="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between animate-fadeIn"
    >
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>{{ toastMessage }}</span>
      </div>
      <button @click="toastMessage = ''" class="text-emerald-600 hover:text-emerald-900 font-bold">&times;</button>
    </div>

    <!-- Tabel Program Studi & Filter -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <!-- Filter Bar -->
      <div class="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <span class="text-xs font-semibold text-slate-700 whitespace-nowrap">Filter Fakultas:</span>
          <select
            v-model="selectedFacultyFilter"
            class="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none focus:border-[#1E3A8A]"
          >
            <option value="ALL">Semua Fakultas ({{ organizationStore.studyPrograms.length }} Prodi)</option>
            <option v-for="f in organizationStore.faculties" :key="f.code" :value="f.code">
              {{ f.name }} ({{ f.code }})
            </option>
          </select>
        </div>

        <div class="w-full sm:w-72 relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari prodi / kode / NIM code..."
            class="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#1E3A8A] text-slate-800"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Table Container -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 border-b border-slate-200/70 text-slate-600 font-sora font-semibold">
            <tr>
              <th class="py-3 px-4">No</th>
              <th class="py-3 px-4">Kode Prodi</th>
              <th class="py-3 px-4">Kode NIM</th>
              <th class="py-3 px-4">Nama Program Studi</th>
              <th class="py-3 px-4">Fakultas</th>
              <th class="py-3 px-4">Jenjang</th>
              <th class="py-3 px-4">Akreditasi</th>
              <th class="py-3 px-4">Estimasi UKT</th>
              <th class="py-3 px-4 text-center">Status PMB</th>
              <th class="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-sans">
            <tr
              v-for="(sp, idx) in filteredPrograms"
              :key="sp.id"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <td class="py-3 px-4 font-mono text-slate-400">{{ idx + 1 }}</td>
              <td class="py-3 px-4">
                <span class="font-mono font-bold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                  {{ sp.code }}
                </span>
              </td>
              <td class="py-3 px-4">
                <span class="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  {{ sp.nim_code }}
                </span>
              </td>
              <td class="py-3 px-4 font-semibold text-slate-900">
                {{ sp.name }}
              </td>
              <td class="py-3 px-4 text-slate-600 font-medium">
                {{ sp.faculty_name }}
              </td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 rounded text-[11px] font-semibold" :class="sp.degree === 'S1' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'">
                  {{ sp.degree }}
                </span>
              </td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-bold rounded text-[10px] border border-emerald-200">
                  {{ sp.accreditation }}
                </span>
              </td>
              <td class="py-3 px-4 font-mono text-slate-700">
                {{ sp.ukt_estimate }}
              </td>
              <td class="py-3 px-4 text-center">
                <button
                  @click="toggleStatus(sp)"
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer border"
                  :class="sp.is_active
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'"
                  :title="sp.is_active ? 'Klik untuk nonaktifkan prodi ini dari formulir pendaftaran' : 'Klik untuk mengaktifkan prodi ini'"
                >
                  <span>{{ sp.is_active ? 'Aktif' : 'Nonaktif' }}</span>
                </button>
              </td>
              <td class="py-3 px-4 text-right">
                <button
                  @click="toggleStatus(sp)"
                  class="text-xs text-[#1E3A8A] hover:underline font-medium cursor-pointer"
                >
                  {{ sp.is_active ? 'Tutup Pendaftaran' : 'Buka Pendaftaran' }}
                </button>
              </td>
            </tr>
            <tr v-if="filteredPrograms.length === 0">
              <td colspan="10" class="py-8 text-center text-slate-400">
                Tidak ada program studi yang cocok dengan filter atau kata kunci pencarian.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Tambah Program Studi Baru -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn"
    >
      <div class="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-xl border border-slate-100 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-base">Tambah Program Studi Baru</h3>
            <p class="text-xs text-slate-500">Daftarkan prodi baru ke Organization Service PMB BTH</p>
          </div>
          <button @click="showAddModal = false" class="text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer">&times;</button>
        </div>

        <form @submit.prevent="submitAddProgram" class="space-y-3.5 text-xs">
          <div>
            <label class="block font-medium text-slate-700 mb-1">Nama Program Studi</label>
            <input
              v-model="newForm.name"
              type="text"
              required
              placeholder="Contoh: S1 Biomedis"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1E3A8A]"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-medium text-slate-700 mb-1">Kode Unik Prodi (scope_id)</label>
              <input
                v-model="newForm.code"
                type="text"
                required
                placeholder="Contoh: BIO"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono uppercase focus:border-[#1E3A8A]"
              />
            </div>
            <div>
              <label class="block font-medium text-slate-700 mb-1">Kode NIM (2 Digit)</label>
              <input
                v-model="newForm.nim_code"
                type="text"
                required
                maxlength="2"
                placeholder="Contoh: 12"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono focus:border-[#1E3A8A]"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-medium text-slate-700 mb-1">Fakultas</label>
              <select
                v-model="newForm.faculty_code"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1E3A8A]"
              >
                <option v-for="f in organizationStore.faculties" :key="f.code" :value="f.code">
                  {{ f.name }} ({{ f.code }})
                </option>
              </select>
            </div>
            <div>
              <label class="block font-medium text-slate-700 mb-1">Jenjang</label>
              <select
                v-model="newForm.degree"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1E3A8A]"
              >
                <option value="S1">S1 (Sarjana)</option>
                <option value="D3">D3 (Diploma 3)</option>
                <option value="Profesi">Profesi</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-medium text-slate-700 mb-1">Akreditasi</label>
              <select
                v-model="newForm.accreditation"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1E3A8A]"
              >
                <option value="Unggul">Unggul</option>
                <option value="Baik Sekali">Baik Sekali</option>
                <option value="Baik">Baik</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>
            <div>
              <label class="block font-medium text-slate-700 mb-1">Estimasi UKT</label>
              <input
                v-model="newForm.ukt_estimate"
                type="text"
                placeholder="Rp 5.000.000 / semester"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1E3A8A]"
              />
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              @click="showAddModal = false"
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold rounded-xl cursor-pointer"
            >
              Simpan Program Studi
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useOrganizationStore } from '@/stores/organization';

const organizationStore = useOrganizationStore();
const toastMessage = ref('');
const selectedFacultyFilter = ref('ALL');
const searchQuery = ref('');
const showAddModal = ref(false);

const newForm = ref({
  name: '',
  code: '',
  nim_code: '',
  faculty_code: 'FF',
  degree: 'S1',
  accreditation: 'Baik Sekali',
  ukt_estimate: 'Rp 5.000.000 / semester',
});

onMounted(async () => {
  await organizationStore.syncAll();
});

const syncData = async () => {
  await organizationStore.syncAll();
  toastMessage.value = 'Data Master Organisasi berhasil disinkronkan dengan database backend.';
};

const filteredPrograms = computed(() => {
  let list = organizationStore.studyPrograms;

  if (selectedFacultyFilter.value !== 'ALL') {
    list = list.filter((sp) => sp.faculty_code === selectedFacultyFilter.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(
      (sp) =>
        sp.name.toLowerCase().includes(q) ||
        sp.code.toLowerCase().includes(q) ||
        sp.nim_code.includes(q) ||
        sp.faculty_name.toLowerCase().includes(q)
    );
  }

  return list;
});

const toggleStatus = async (sp) => {
  await organizationStore.toggleStudyProgram(sp.id);
  toastMessage.value = `Status ${sp.name} berhasil diubah menjadi ${sp.is_active ? 'Aktif' : 'Nonaktif'}.`;
};

const openAddModal = () => {
  newForm.value = {
    name: '',
    code: '',
    nim_code: '',
    faculty_code: organizationStore.faculties[0]?.code || 'FF',
    degree: 'S1',
    accreditation: 'Baik Sekali',
    ukt_estimate: 'Rp 5.000.000 / semester',
  };
  showAddModal.value = true;
};

const submitAddProgram = async () => {
  if (!newForm.value.name || !newForm.value.code || !newForm.value.nim_code) return;

  const added = await organizationStore.addStudyProgram(newForm.value);
  showAddModal.value = false;
  toastMessage.value = `Program Studi ${added.name} (${added.code}) berhasil ditambahkan ke database master.`;
};
</script>
