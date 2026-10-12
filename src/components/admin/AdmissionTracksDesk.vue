<template>
  <div class="space-y-6">
    <!-- Header Meja Manajemen Jalur Pendaftaran -->
    <div class="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="font-sora font-extrabold text-slate-900 text-lg sm:text-xl">
              Manajemen Jalur Pendaftaran PMB
            </h2>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#1E3A8A] border border-blue-200/80">
              T.A. 2026/2027
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-1 font-sans">
            Konfigurasi jalur masuk PMB, pengaturan kuota daya tampung, biaya formulir, jadwal gelombang, dan syarat berkas seleksi.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
          <button
            type="button"
            @click="openAddTrackModal"
            class="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-sora font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Plus class="w-4 h-4 text-white" />
            <span>Tambah Jalur Baru</span>
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
        <div class="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sora">Total Jalur Terdaftar</div>
          <div class="font-sora font-extrabold text-xl text-slate-900 mt-0.5">
            {{ tracksList.length }}
          </div>
          <div class="text-[11px] text-slate-500 mt-0.5">Kategori Masuk</div>
        </div>

        <div class="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sora">Jalur Buka Pendaftaran</div>
          <div class="font-sora font-extrabold text-xl text-emerald-700 mt-0.5">
            {{ activeTracksCount }}
          </div>
          <div class="text-[11px] text-emerald-600 font-medium mt-0.5">Pendaftaran Aktif</div>
        </div>

        <div class="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sora">Bebas Biaya Formulir</div>
          <div class="font-sora font-extrabold text-xl text-[#1E3A8A] mt-0.5">
            {{ freeTracksCount }}
          </div>
          <div class="text-[11px] text-slate-500 mt-0.5">Biaya Pendaftaran Rp 0</div>
        </div>

        <div class="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sora">Total Kuota Alokasi</div>
          <div class="font-sora font-extrabold text-xl text-slate-800 mt-0.5 font-mono">
            {{ totalQuota }}
          </div>
          <div class="text-[11px] text-slate-500 mt-0.5">Kursi Mahasiswa Baru</div>
        </div>
      </div>
    </div>

    <!-- Filter & Tabel Jalur Pendaftaran -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <span class="text-xs font-semibold text-slate-700 whitespace-nowrap">Filter Status:</span>
          <select
            v-model="statusFilter"
            class="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none focus:border-[#1E3A8A]"
          >
            <option value="ALL">Semua Status ({{ tracksList.length }} Jalur)</option>
            <option value="ACTIVE">Buka Pendaftaran ({{ activeTracksCount }})</option>
            <option value="INACTIVE">Tutup Pendaftaran ({{ tracksList.length - activeTracksCount }})</option>
          </select>
        </div>

        <div class="w-full sm:w-72">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama jalur / kode / sistem seleksi..."
            class="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#1E3A8A] text-slate-800"
          />
        </div>
      </div>

      <!-- Tabel Data Jalur -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs min-w-[950px]">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-sora font-semibold whitespace-nowrap">
            <tr>
              <th class="py-3 px-4 min-w-[40px]">No</th>
              <th class="py-3 px-4 min-w-[110px]">Kode Jalur</th>
              <th class="py-3 px-4 min-w-[220px]">Nama Jalur Masuk</th>
              <th class="py-3 px-4 min-w-[120px]">Biaya Formulir</th>
              <th class="py-3 px-4 min-w-[90px] text-center">Kuota</th>
              <th class="py-3 px-4 min-w-[170px]">Mekanisme Seleksi</th>
              <th class="py-3 px-4 min-w-[180px]">Periode Pendaftaran</th>
              <th class="py-3 px-4 min-w-[120px]">Grup WhatsApp</th>
              <th class="py-3 px-4 min-w-[100px] text-center">Status</th>
              <th class="py-3 px-4 min-w-[130px] text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-sans">
            <tr
              v-for="(t, idx) in filteredTracks"
              :key="t.id"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <td class="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">{{ idx + 1 }}</td>
              <td class="py-3.5 px-4 whitespace-nowrap">
                <span class="font-mono font-bold text-slate-900 text-xs px-2.5 py-0.5 bg-slate-100 rounded whitespace-nowrap inline-block">
                  {{ t.code }}
                </span>
              </td>
              <td class="py-3.5 px-4 min-w-[180px]">
                <div class="font-bold text-slate-900 text-xs whitespace-nowrap">{{ t.name }}</div>
                <div class="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{{ t.description }}</div>
              </td>
              <td class="py-3.5 px-4 whitespace-nowrap min-w-[150px]">
                <span
                  class="font-mono font-semibold text-xs px-2.5 py-0.5 rounded whitespace-nowrap inline-block"
                  :class="t.fee === 0 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-800'"
                >
                  {{ t.fee === 0 ? 'Bebas Biaya (Rp 0)' : `Rp ${t.fee.toLocaleString('id-ID')}` }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-center font-mono font-bold text-slate-800 text-xs whitespace-nowrap">
                {{ t.quota }}
              </td>
              <td class="py-3.5 px-4 text-slate-600 whitespace-nowrap min-w-[130px]">
                <span class="inline-flex items-center gap-1 text-[11px] font-medium bg-blue-50 text-[#1E3A8A] px-2.5 py-0.5 rounded border border-blue-200/60 whitespace-nowrap">
                  {{ t.selectionMethod }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-[11px] text-slate-600 font-mono whitespace-nowrap min-w-[150px]">
                {{ t.period }}
              </td>
              <td class="py-3.5 px-4 whitespace-nowrap min-w-[130px]">
                <a
                  v-if="t.whatsappGroupUrl"
                  :href="t.whatsappGroupUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 hover:bg-emerald-100 transition-colors whitespace-nowrap"
                  title="Buka Tautan Grup WhatsApp"
                >
                  <span>Grup Terhubung</span>
                </a>
                <span v-else class="text-[11px] text-slate-400 whitespace-nowrap">Belum diatur</span>
              </td>
              <td class="py-3.5 px-4 text-center whitespace-nowrap min-w-[90px]">
                <span
                  class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap inline-block"
                  :class="t.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'"
                >
                  {{ t.isActive ? 'Buka' : 'Tutup' }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    @click="toggleTrackStatus(t)"
                    class="px-2.5 py-1 text-xs font-medium rounded border transition-colors cursor-pointer"
                    :class="t.isActive
                      ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'"
                    :title="t.isActive ? 'Tutup Pendaftaran Jalur' : 'Buka Pendaftaran Jalur'"
                  >
                    {{ t.isActive ? 'Tutup' : 'Buka' }}
                  </button>
                  <button
                    type="button"
                    @click="editTrack(t)"
                    class="px-2.5 py-1 text-xs font-semibold rounded bg-[#1E3A8A] hover:bg-[#172554] text-white transition-colors cursor-pointer"
                    title="Ubah Kuota & Pengaturan Jalur"
                  >
                    Edit
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredTracks.length === 0">
              <td colspan="9" class="py-8 text-center text-slate-400">
                Tidak ada jalur pendaftaran yang cocok dengan filter pencarian.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Tambah / Edit Jalur Pendaftaran -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm modal-sharp"
        @click.self="showModal = false"
      >
        <div class="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
          <div class="h-1 w-full bg-[#1E3A8A] flex-shrink-0"></div>

          <div class="p-5 sm:p-6 pb-4 flex items-center justify-between border-b border-slate-100 flex-shrink-0">
            <div>
              <h3 class="font-sora font-bold text-slate-900 text-base">
                {{ isEditing ? 'Edit Jalur Pendaftaran' : 'Tambah Jalur Pendaftaran Baru' }}
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">T.A. 2026/2027 • Universitas Bakti Tunas Husada</p>
            </div>
            <button @click="showModal = false" class="text-slate-400 hover:text-slate-700 p-1">
              <X class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="saveTrack" class="p-5 sm:p-6 space-y-4 text-xs font-sans flex-1 overflow-y-auto">
            <div>
              <label class="block font-semibold text-slate-800 mb-1">Kode Jalur *</label>
              <input
                v-model="form.code"
                required
                placeholder="Contoh: REG, USKP, PMDK, KIP"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] uppercase font-mono"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-800 mb-1">Nama Jalur Masuk *</label>
              <input
                v-model="form.name"
                required
                placeholder="Contoh: Jalur Reguler Mandiri"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A]"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-800 mb-1">Biaya Formulir (Rp) *</label>
                <input
                  v-model.number="form.fee"
                  type="number"
                  min="0"
                  required
                  placeholder="0 untuk gratis"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] font-mono"
                />
              </div>
              <div>
                <label class="block font-semibold text-slate-800 mb-1">Daya Tampung (Kuota) *</label>
                <input
                  v-model.number="form.quota"
                  type="number"
                  min="1"
                  required
                  placeholder="Jumlah kuota kursi"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] font-mono"
                />
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-800 mb-1">Mekanisme Seleksi *</label>
              <select
                v-model="form.selectionMethod"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] bg-white"
              >
                <option value="CBT Mandiri & Wawancara">CBT Mandiri & Wawancara</option>
                <option value="Nilai Rapor & Portofolio">Nilai Rapor & Portofolio</option>
                <option value="Sertifikat Prestasi Kejuaraan">Sertifikat Prestasi Kejuaraan</option>
                <option value="Verifikasi Dokumen KIP & Afirmasi">Verifikasi Dokumen KIP & Afirmasi</option>
                <option value="Transkrip Nilai D3 & Portofolio">Transkrip Nilai D3 & Portofolio</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-800 mb-1">Periode Pendaftaran *</label>
              <input
                v-model="form.period"
                required
                placeholder="Contoh: 01 Des 2025 - 30 Apr 2026"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A]"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-800 mb-1">Tautan Grup WhatsApp Calon Mahasiswa</label>
              <input
                v-model="form.whatsappGroupUrl"
                type="url"
                placeholder="https://chat.whatsapp.com/..."
                class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] font-mono text-xs"
              />
              <span class="text-[11px] text-slate-500 mt-1 block">
                Calon mahasiswa yang memilih jalur ini akan melihat tombol tautan untuk bergabung ke grup komunikasi resmi tersebut.
              </span>
            </div>

            <div>
              <label class="block font-semibold text-slate-800 mb-1">Deskripsi & Syarat Khusus</label>
              <textarea
                v-model="form.description"
                rows="2"
                placeholder="Penjelasan ringkas syarat jalur..."
                class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A]"
              ></textarea>
            </div>

            <div class="pt-3 border-t border-slate-100 flex justify-end gap-2.5 flex-shrink-0">
              <button
                type="button"
                @click="showModal = false"
                class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                class="px-5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold rounded-lg shadow-xs cursor-pointer"
              >
                {{ isEditing ? 'Simpan Perubahan' : 'Tambahkan Jalur' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Plus, X } from 'lucide-vue-next';
import { useToast } from '@/composables/useToast';
import { useCmsStore } from '@/stores/cms';

const toast = useToast();
const cmsStore = useCmsStore();

const statusFilter = ref('ALL');
const searchQuery = ref('');
const showModal = ref(false);
const isEditing = ref(false);

const TRACKS_STORAGE_KEY = 'bth_pmb_tracks_v1';

const INITIAL_TRACKS = [
  {
    id: 1,
    code: 'REG',
    name: 'Jalur Reguler (Mandiri Umum)',
    fee: 250000,
    quota: 350,
    selectionMethod: 'CBT Mandiri & Wawancara',
    period: '01 Des 2025 – 30 Apr 2026',
    description: 'Pendaftaran reguler melalui ujian Computer-Based Test (CBT) dan wawancara minat bakat.',
    isActive: true,
    whatsappGroupUrl: 'https://chat.whatsapp.com/BTH-Reguler2026',
  },
  {
    id: 2,
    code: 'USKP',
    name: 'Jalur USKP (Ujian Saringan Khusus Prestasi)',
    fee: 0,
    quota: 150,
    selectionMethod: 'Nilai Rapor & Portofolio',
    period: '01 Des 2025 – 28 Feb 2026',
    description: 'Jalur bebas biaya pendaftaran bagi siswa berprestasi nilai rapor semester 1 hingga 5.',
    isActive: true,
    whatsappGroupUrl: 'https://chat.whatsapp.com/BTH-USKP-Prestasi',
  },
  {
    id: 3,
    code: 'PMDK',
    name: 'Jalur Prestasi Unggulan (Minat & Bakat)',
    fee: 0,
    quota: 75,
    selectionMethod: 'Sertifikat Prestasi Kejuaraan',
    period: '01 Des 2025 – 31 Mar 2026',
    description: 'Bebas biaya pendaftaran untuk pemenang kejuaraan sains, olahraga, seni, atau tahfidz Quran.',
    isActive: true,
    whatsappGroupUrl: 'https://chat.whatsapp.com/BTH-PrestasiUnggulan',
  },
  {
    id: 4,
    code: 'KIP-K',
    name: 'Jalur Beasiswa KIP-Kuliah (Afirmasi)',
    fee: 0,
    quota: 60,
    selectionMethod: 'Verifikasi Dokumen KIP & Afirmasi',
    period: '01 Jan 2026 – 31 Mei 2026',
    description: 'Bebas biaya pendaftaran program bantuan biaya pendidikan tinggi Kemendikbudristek.',
    isActive: true,
    whatsappGroupUrl: 'https://chat.whatsapp.com/BTH-KIPKuliah',
  },
  {
    id: 5,
    code: 'TRANSFER',
    name: 'Jalur Alih Jenjang / Transfer (RPL)',
    fee: 250000,
    quota: 30,
    selectionMethod: 'Transkrip Nilai D3 & Portofolio',
    period: '01 Jan 2026 – 30 Jun 2026',
    description: 'Penerimaan lanjutan bagi lulusan D3 Farmasi / Kebidanan / TLM ke jenjang S1.',
    isActive: true,
    whatsappGroupUrl: 'https://chat.whatsapp.com/BTH-AlihJenjangRPL',
  },
];

const loadTracks = () => {
  try {
    const saved = localStorage.getItem(TRACKS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Gagal memuat data jalur:', e);
  }
  return INITIAL_TRACKS;
};

const tracksList = ref(loadTracks());

const persistTracks = () => {
  try {
    localStorage.setItem(TRACKS_STORAGE_KEY, JSON.stringify(tracksList.value));
  } catch (e) {
    console.warn('Gagal menyimpan data jalur:', e);
  }
};

const form = ref({
  id: null,
  code: '',
  name: '',
  fee: 250000,
  quota: 100,
  selectionMethod: 'CBT Mandiri & Wawancara',
  period: '01 Des 2025 – 30 Apr 2026',
  description: '',
  whatsappGroupUrl: '',
  isActive: true,
});

const activeTracksCount = computed(() => {
  return tracksList.value.filter((t) => t.isActive).length;
});

const freeTracksCount = computed(() => {
  return tracksList.value.filter((t) => t.fee === 0).length;
});

const totalQuota = computed(() => {
  return tracksList.value.reduce((acc, t) => acc + (t.quota || 0), 0);
});

const filteredTracks = computed(() => {
  return tracksList.value.filter((t) => {
    if (statusFilter.value === 'ACTIVE' && !t.isActive) return false;
    if (statusFilter.value === 'INACTIVE' && t.isActive) return false;

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      const matchName = t.name.toLowerCase().includes(q);
      const matchCode = t.code.toLowerCase().includes(q);
      const matchMethod = t.selectionMethod.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchMethod) return false;
    }

    return true;
  });
});

const syncTrackToCms = (track) => {
  if (!cmsStore || !Array.isArray(cmsStore.tracks)) return;
  const matchIdx = cmsStore.tracks.findIndex(
    (ct) =>
      ct.name?.toLowerCase().includes(track.name?.toLowerCase()) ||
      track.name?.toLowerCase().includes(ct.name?.toLowerCase()) ||
      ct.id?.toLowerCase() === track.code?.toLowerCase()
  );
  if (matchIdx !== -1) {
    cmsStore.tracks[matchIdx].fee = Number(track.fee) || 0;
    cmsStore.tracks[matchIdx].isActive = track.isActive;
    if (track.description) cmsStore.tracks[matchIdx].description = track.description;
  } else {
    cmsStore.tracks.push({
      id: track.code?.toLowerCase() || `track-${Date.now()}`,
      name: track.name,
      fee: Number(track.fee) || 0,
      description: track.description || '',
      isActive: track.isActive,
    });
  }
  cmsStore.saveAll();
};

const toggleTrackStatus = (track) => {
  track.isActive = !track.isActive;
  persistTracks();
  syncTrackToCms(track);
  toast.success(`Jalur ${track.name} berhasil diubah statusnya menjadi ${track.isActive ? 'Buka Pendaftaran' : 'Tutup Pendaftaran'}.`);
};

const openAddTrackModal = () => {
  isEditing.value = false;
  form.value = {
    id: Date.now(),
    code: '',
    name: '',
    fee: 250000,
    quota: 100,
    selectionMethod: 'CBT Mandiri & Wawancara',
    period: '01 Des 2025 – 30 Apr 2026',
    description: '',
    whatsappGroupUrl: 'https://chat.whatsapp.com/BTH-PMB2026',
    isActive: true,
  };
  showModal.value = true;
};

const editTrack = (track) => {
  isEditing.value = true;
  form.value = { ...track };
  showModal.value = true;
};

const saveTrack = () => {
  if (isEditing.value) {
    const idx = tracksList.value.findIndex((t) => t.id === form.value.id);
    if (idx !== -1) {
      tracksList.value[idx] = { ...form.value };
      persistTracks();
      syncTrackToCms(form.value);
      toast.success(`Jalur ${form.value.name} berhasil diperbarui.`);
    }
  } else {
    const newTrack = { ...form.value, id: Date.now() };
    tracksList.value.unshift(newTrack);
    persistTracks();
    syncTrackToCms(newTrack);
    toast.success(`Jalur ${form.value.name} berhasil ditambahkan.`);
  }
  showModal.value = false;
};

onMounted(() => {
  if (cmsStore.tracks && cmsStore.tracks.length > 0) {
    // Sinkronkan biaya jalur dari CMS jika ada pembaruan terpusat
    tracksList.value.forEach((t) => {
      const cmsMatch = cmsStore.tracks.find(
        (ct) =>
          ct.name?.toLowerCase().includes(t.name?.toLowerCase()) ||
          t.name?.toLowerCase().includes(ct.name?.toLowerCase()) ||
          ct.id?.toLowerCase() === t.code?.toLowerCase()
      );
      if (cmsMatch && cmsMatch.fee !== undefined) {
        t.fee = cmsMatch.fee;
      }
    });
    persistTracks();
  }
});
</script>
