<template>
  <div class="space-y-6">
    <!-- Header Meja Kode Referal Guru BK & Mitra Sekolah (CR-014) -->
    <div class="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="font-sora font-extrabold text-slate-900 text-lg sm:text-xl">
              Kode Referal & Kemitraan Guru BK
            </h2>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#1E3A8A] border border-blue-200/80">
              Program Kemitraan PMB 2026
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-1 font-sans">
            Pengelolaan kode referal sekolah mitra, monitoring siswa pengguna kode, verifikasi kolektif guru BK, dan rekapitulasi setoran komisi.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
          <button
            type="button"
            @click="exportReferralReport"
            class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Download class="w-3.5 h-3.5" />
            <span>Ekspor Laporan</span>
          </button>

          <button
            type="button"
            @click="openAddModal"
            class="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-sora font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Plus class="w-4 h-4 text-white" />
            <span>Buat Kode Referal</span>
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
        <div class="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sora">Total Mitra Terdaftar</div>
          <div class="font-sora font-extrabold text-xl text-slate-900 mt-0.5">
            {{ referralList.length }}
          </div>
          <div class="text-[11px] text-slate-500 mt-0.5">Guru BK & Sekolah</div>
        </div>

        <div class="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sora">Siswa Pendaftar Referal</div>
          <div class="font-sora font-extrabold text-xl text-[#1E3A8A] mt-0.5">
            {{ totalReferredStudents }}
          </div>
          <div class="text-[11px] text-slate-500 mt-0.5">Calon Mahasiswa</div>
        </div>

        <div class="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sora">Pembayaran Terverifikasi</div>
          <div class="font-sora font-extrabold text-xl text-emerald-700 mt-0.5">
            {{ totalVerifiedPayments }}
          </div>
          <div class="text-[11px] text-emerald-600 font-medium mt-0.5">Bypass Pembayaran</div>
        </div>

        <div class="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sora">Total Setoran Diterima</div>
          <div class="font-sora font-extrabold text-sm sm:text-base text-slate-800 mt-1 font-mono">
            Rp {{ (totalSettledAmount).toLocaleString('id-ID') }}
          </div>
          <div class="text-[10px] text-slate-500 mt-0.5">Disetor ke Kas PMB</div>
        </div>
      </div>
    </div>

    <!-- Filter & Tabel Kode Referal -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <span class="text-xs font-semibold text-slate-700 whitespace-nowrap">Filter Status:</span>
          <select
            v-model="statusFilter"
            class="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none focus:border-[#1E3A8A]"
          >
            <option value="ALL">Semua Kode ({{ referralList.length }})</option>
            <option value="ACTIVE">Aktif ({{ activeCodesCount }})</option>
            <option value="PENDING">Menunggu Aktivasi</option>
          </select>
        </div>

        <div class="w-full sm:w-80">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari kode referal / nama guru BK / sekolah..."
            class="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#1E3A8A] text-slate-800"
          />
        </div>
      </div>

      <!-- Tabel Data Kode Referal -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs min-w-[1000px]">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-sora font-semibold whitespace-nowrap">
            <tr>
              <th class="py-3 px-4 min-w-[40px]">No</th>
              <th class="py-3 px-4 min-w-[140px]">Kode Referal</th>
              <th class="py-3 px-4 min-w-[200px]">Penanggung Jawab (Mitra)</th>
              <th class="py-3 px-4 min-w-[180px]">Institusi / Sekolah</th>
              <th class="py-3 px-4 min-w-[130px]">Skema Komisi</th>
              <th class="py-3 px-4 min-w-[100px] text-center">Siswa Terdaftar</th>
              <th class="py-3 px-4 min-w-[120px] text-center">Terverifikasi</th>
              <th class="py-3 px-4 min-w-[130px] font-mono">Total Setoran</th>
              <th class="py-3 px-4 min-w-[90px] text-center">Status</th>
              <th class="py-3 px-4 min-w-[110px] text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-sans">
            <tr
              v-for="(r, idx) in filteredReferrals"
              :key="r.id"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <td class="py-3.5 px-4 font-mono text-slate-400">{{ idx + 1 }}</td>
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-1.5">
                  <span class="font-mono font-bold text-slate-900 text-xs px-2.5 py-1 bg-blue-50 border border-blue-200/70 rounded">
                    {{ r.code }}
                  </span>
                  <button
                    type="button"
                    @click="copyCode(r.code)"
                    class="p-1 text-slate-400 hover:text-[#1E3A8A] rounded transition-colors"
                    title="Salin Kode Referal"
                  >
                    <Copy class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
              <td class="py-3.5 px-4">
                <div class="font-semibold text-slate-900 text-xs">{{ r.picName }}</div>
                <div class="text-[11px] text-slate-500 font-mono mt-0.5">{{ r.picPhone }}</div>
              </td>
              <td class="py-3.5 px-4">
                <div class="text-slate-800 font-medium">{{ r.schoolName }}</div>
                <div class="text-[10px] text-slate-400 mt-0.5">{{ r.schoolCity }}</div>
              </td>
              <td class="py-3.5 px-4">
                <span class="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                  {{ r.commissionType === 'percentage' ? `${r.commissionValue}% per siswa` : `Rp ${r.commissionValue.toLocaleString('id-ID')} / siswa` }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                {{ r.registeredCount }}
              </td>
              <td class="py-3.5 px-4 text-center">
                <span class="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                  {{ r.verifiedCount }}
                </span>
              </td>
              <td class="py-3.5 px-4 font-mono font-semibold text-slate-800">
                Rp {{ (r.settledAmount).toLocaleString('id-ID') }}
              </td>
              <td class="py-3.5 px-4 text-center">
                <span
                  class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  :class="r.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'"
                >
                  {{ r.status === 'active' ? 'Aktif' : 'Pending' }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-right">
                <button
                  type="button"
                  @click="viewDetail(r)"
                  class="px-2.5 py-1 text-xs font-semibold rounded bg-[#1E3A8A] hover:bg-[#172554] text-white transition-colors cursor-pointer"
                >
                  Detail
                </button>
              </td>
            </tr>
            <tr v-if="filteredReferrals.length === 0">
              <td colspan="10" class="py-8 text-center text-slate-400">
                Tidak ada kode referal yang cocok dengan filter pencarian.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Buat Kode Referal Baru -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm overflow-y-auto modal-sharp"
        @click.self="showModal = false"
      >
        <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
          <div class="h-1.5 w-full bg-gradient-to-r from-[#1E3A8A] via-blue-600 to-indigo-500"></div>

          <div class="p-5 sm:p-6 pb-4 flex items-center justify-between border-b border-slate-100">
            <div>
              <h3 class="font-sora font-bold text-slate-900 text-base">
                Buat Akun Guru BK & Kode Referal Baru
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">Program Sosialisasi PMB Universitas BTH</p>
            </div>
            <button @click="showModal = false" class="text-slate-400 hover:text-slate-700 p-1">
              <X class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="saveReferral" class="p-5 sm:p-6 space-y-4 text-xs font-sans">
            <div>
              <label class="block font-semibold text-slate-800 mb-1">Kode Referal Unik *</label>
              <input
                v-model="form.code"
                required
                placeholder="Contoh: SMKCONTOH01, SMAN1TSM, BK-FARMASI"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] uppercase font-mono"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-800 mb-1">Nama Guru BK / Mitra *</label>
                <input
                  v-model="form.picName"
                  required
                  placeholder="Nama Lengkap Penanggung Jawab"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A]"
                />
              </div>
              <div>
                <label class="block font-semibold text-slate-800 mb-1">No. WhatsApp / HP *</label>
                <input
                  v-model="form.picPhone"
                  required
                  placeholder="081234567890"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] font-mono"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-800 mb-1">Nama Asal Sekolah / Mitra *</label>
                <input
                  v-model="form.schoolName"
                  required
                  placeholder="Contoh: SMAN 1 Tasikmalaya"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A]"
                />
              </div>
              <div>
                <label class="block font-semibold text-slate-800 mb-1">Kota / Kabupaten *</label>
                <input
                  v-model="form.schoolCity"
                  required
                  placeholder="Kota Tasikmalaya"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A]"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-800 mb-1">Skema Komisi Mitra *</label>
                <select
                  v-model="form.commissionType"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] bg-white"
                >
                  <option value="fixed">Nominal Tetap (Rp)</option>
                  <option value="percentage">Persentase (%)</option>
                </select>
              </div>
              <div>
                <label class="block font-semibold text-slate-800 mb-1">Besaran Nilai Komisi *</label>
                <input
                  v-model.number="form.commissionValue"
                  type="number"
                  min="0"
                  required
                  placeholder="Contoh: 50000 atau 10"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] font-mono"
                />
              </div>
            </div>

            <div class="p-3 bg-blue-50 border border-blue-200/80 rounded-lg text-slate-600 text-[11px] leading-relaxed">
              Siswa yang memasukkan kode referal ini akan diverifikasi pembayarannya oleh guru BK terkait, lalu setoran formulir dikirimkan ke Biro Keuangan PMB.
            </div>

            <div class="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
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
                Simpan & Terbitkan Kode
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Plus, X, Download, Copy } from 'lucide-vue-next';
import { useToast } from '@/composables/useToast';
import { useReferralStore } from '@/stores/referral';

const toast = useToast();
const referralStore = useReferralStore();

const statusFilter = ref('ALL');
const searchQuery = ref('');
const showModal = ref(false);

const referralList = computed(() => referralStore.referralList);

const form = ref({
  code: '',
  picName: '',
  picPhone: '',
  schoolName: '',
  schoolCity: '',
  commissionType: 'fixed',
  commissionValue: 50000,
});

const totalReferredStudents = computed(() => {
  return referralList.value.reduce((acc, r) => acc + (r.registeredCount || 0), 0);
});

const totalVerifiedPayments = computed(() => {
  return referralList.value.reduce((acc, r) => acc + (r.verifiedCount || 0), 0);
});

const totalSettledAmount = computed(() => {
  return referralList.value.reduce((acc, r) => acc + (r.settledAmount || 0), 0);
});

const activeCodesCount = computed(() => {
  return referralList.value.filter((r) => r.status === 'active').length;
});

const filteredReferrals = computed(() => {
  return referralList.value.filter((r) => {
    if (statusFilter.value === 'ACTIVE' && r.status !== 'active') return false;
    if (statusFilter.value === 'PENDING' && r.status === 'active') return false;

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      const matchCode = r.code.toLowerCase().includes(q);
      const matchPic = r.picName.toLowerCase().includes(q);
      const matchSchool = r.schoolName.toLowerCase().includes(q);
      if (!matchCode && !matchPic && !matchSchool) return false;
    }

    return true;
  });
});

const copyCode = async (code) => {
  try {
    await navigator.clipboard.writeText(code);
    toast.success(`Kode referal ${code} berhasil disalin ke clipboard.`);
  } catch {
    toast.info(`Kode referal: ${code}`);
  }
};

const openAddModal = () => {
  form.value = {
    code: '',
    picName: '',
    picPhone: '',
    schoolName: '',
    schoolCity: '',
    commissionType: 'fixed',
    commissionValue: 50000,
  };
  showModal.value = true;
};

const saveReferral = () => {
  referralStore.addReferral({
    id: `REF-${Date.now()}`,
    code: form.value.code.toUpperCase(),
    picName: form.value.picName,
    picPhone: form.value.picPhone,
    schoolName: form.value.schoolName,
    schoolCity: form.value.schoolCity,
    commissionType: form.value.commissionType,
    commissionValue: form.value.commissionValue,
    registeredCount: 0,
    verifiedCount: 0,
    settledAmount: 0,
    status: 'active',
  });
  toast.success(`Kode referal ${form.value.code.toUpperCase()} berhasil dibuat untuk ${form.value.picName}.`);
  showModal.value = false;
};

const viewDetail = (referral) => {
  toast.info(`Menampilkan rincian performa kode referal ${referral.code} (${referral.schoolName}).`);
};

const exportReferralReport = () => {
  toast.success('Laporan rekapitulasi kode referal & komisi guru BK berhasil diunduh (Excel).');
};
</script>
