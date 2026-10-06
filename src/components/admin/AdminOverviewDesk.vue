<template>
  <div class="space-y-6">
    <!-- Header Meja Kerja -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900">
          Ringkasan Eksekutif & Statistik PMB
        </h2>
        <p class="text-xs text-slate-500 mt-0.5 font-sans">
          Pemantauan performa penerimaan mahasiswa baru TA 2026/2027 terintegrasi.
        </p>
      </div>
      <div class="flex items-center gap-2 self-start sm:self-auto">
        <span class="text-xs text-slate-500 font-sans">
          Tahun Akademik 2026/2027
        </span>
      </div>
    </div>

    <!-- 4 KPI Cards Grid: Bersih, Rapi, Tipografi Kuat, dan Terhubung ke Meja Kerja Operasional -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Card 1: Total Pendaftar -->
      <div
        @click="emit('switch-desk', 'verification')"
        class="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all group"
        title="Klik untuk membuka Meja Verifikasi Pendaftar"
      >
        <div class="flex items-center justify-between text-xs font-medium text-slate-500 font-sans">
          <span>Total Pendaftar</span>
          <span class="text-[11px] text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">Buka &rarr;</span>
        </div>
        <div class="mt-2">
          <div class="font-sora font-extrabold text-2xl sm:text-3xl text-slate-900 group-hover:text-[#1E3A8A] transition-colors">
            {{ adminStore.totalApplicants.toLocaleString('id-ID') }}
          </div>
          <div class="text-[11px] text-slate-500 mt-1 font-sans">
            Calon mahasiswa terdaftar
          </div>
        </div>
      </div>

      <!-- Card 2: Berkas Pending -->
      <div
        @click="emit('switch-desk', 'verification')"
        class="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-amber-300 hover:shadow-sm transition-all group"
        title="Klik untuk memvalidasi berkas calon mahasiswa"
      >
        <div class="flex items-center justify-between text-xs font-medium text-slate-500 font-sans">
          <span>Antrean Verifikasi Berkas</span>
          <span class="text-[11px] text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">Validasi &rarr;</span>
        </div>
        <div class="mt-2">
          <div class="font-sora font-extrabold text-2xl sm:text-3xl text-slate-900 group-hover:text-amber-600 transition-colors">
            {{ adminStore.pendingVerificationCount }} <span class="text-sm font-normal text-slate-500 font-sans">Berkas</span>
          </div>
          <div class="text-[11px] text-slate-500 mt-1 font-sans">
            Menunggu validasi berkas
          </div>
        </div>
      </div>

      <!-- Card 3: Penerimaan Dana -->
      <div
        @click="emit('switch-desk', 'finance')"
        class="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-emerald-300 hover:shadow-sm transition-all group"
        title="Klik untuk membuka Meja Rekonsiliasi Keuangan"
      >
        <div class="flex items-center justify-between text-xs font-medium text-slate-500 font-sans">
          <span>Penerimaan Pembayaran</span>
          <span class="text-[11px] text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">Keuangan &rarr;</span>
        </div>
        <div class="mt-2">
          <div class="font-sora font-extrabold text-xl sm:text-2xl text-slate-900 group-hover:text-emerald-700 transition-colors">
            {{ formattedRevenue }}
          </div>
          <div class="text-[11px] text-slate-500 mt-1 font-sans">
            Formulir & UKT terverifikasi
          </div>
        </div>
      </div>

      <!-- Card 4: Mahasiswa Diterima -->
      <div
        @click="emit('switch-desk', 'scoring')"
        class="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all group"
        title="Klik untuk membuka Meja Seleksi & Kelulusan"
      >
        <div class="flex items-center justify-between text-xs font-medium text-slate-500 font-sans">
          <span>Dinyatakan Lulus Seleksi</span>
          <span class="text-[11px] text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">Seleksi &rarr;</span>
        </div>
        <div class="mt-2">
          <div class="font-sora font-extrabold text-2xl sm:text-3xl text-slate-900 group-hover:text-[#1E3A8A] transition-colors">
            {{ adminStore.passedStudentsCount }} <span class="text-sm font-normal text-slate-500 font-sans">Maba</span>
          </div>
          <div class="text-[11px] text-slate-500 mt-1 font-sans">
            Tingkat kelulusan {{ passRatePercent }}%
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section: Visualisasi Data Ringkas -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Chart 1: Distribusi Peminat per Program Studi (Doughnut) -->
      <div class="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
              Proporsi Peminat per Program Studi
            </h3>
            <p class="text-xs text-slate-500 font-sans mt-0.5">Pilihan program studi pendaftar aktif.</p>
          </div>
          <span class="text-xs font-medium text-slate-500 font-sans">
            {{ adminStore.applicants.length }} Pelamar
          </span>
        </div>

        <div class="h-64 sm:h-72 my-3 flex items-center justify-center">
          <DoughnutChart
            v-if="adminStore.applicants.length > 0"
            :chart-data="prodiDoughnutData"
          />
          <div v-else class="text-center text-slate-400 text-xs italic py-12">
            Belum ada data pendaftar untuk ditampilkan pada grafik.
          </div>
        </div>

        <div class="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100 font-sans">
          Data registrasi calon mahasiswa Universitas BTH
        </div>
      </div>

      <!-- Chart 2: Funnel Konversi Alur Seleksi PMB (Bar Horizontal) -->
      <div class="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
              Funnel Konversi Tahapan PMB
            </h3>
            <p class="text-xs text-slate-500 font-sans mt-0.5">Progres pelamar dari pendaftaran hingga penetapan NIM.</p>
          </div>
          <span class="text-xs font-medium text-slate-500 font-sans">
            Tahapan Pendaftaran
          </span>
        </div>

        <div class="h-64 sm:h-72 my-3">
          <BarChart
            :chart-data="funnelBarData"
            :horizontal="true"
          />
        </div>

        <div class="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100 font-sans">
          Konversi ke mahasiswa resmi (NIM): {{ conversionRatePercent }}%
        </div>
      </div>
    </div>

    <!-- Kuota Program Studi (Full Width, Bersih & Terstruktur) -->
    <div class="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
            Keterisian Daya Tampung Program Studi
          </h3>
          <p class="text-xs text-slate-500 font-sans mt-0.5">Pemantauan kuota penerimaan mahasiswa baru per program studi TA 2026/2027.</p>
        </div>
        <span class="text-xs text-slate-400 font-sans">Gelombang 1</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-sans">
        <div v-for="item in prodiQuotas" :key="item.name" class="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
          <div class="flex justify-between items-start gap-2">
            <span class="font-sora font-semibold text-slate-800 text-xs">{{ item.name }}</span>
            <span class="text-slate-500 text-[11px] font-mono flex-shrink-0">
              <strong class="text-slate-900">{{ item.enrolled }}</strong>/{{ item.quota }}
            </span>
          </div>
          <div class="w-full h-1.5 bg-slate-200/70 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="item.color"
              :style="{ width: `${item.percent}%` }"
            ></div>
          </div>
          <div class="flex justify-between items-center text-[11px] text-slate-400">
            <span>Terisi {{ item.percent }}%</span>
            <span>Sisa {{ item.quota - item.enrolled }} kursi</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAdminStore } from '@/stores/admin';
import DoughnutChart from '@/components/charts/DoughnutChart.vue';
import BarChart from '@/components/charts/BarChart.vue';

const props = defineProps({
  currentRole: {
    type: String,
    default: 'superadmin',
  },
});

const emit = defineEmits(['switch-desk']);

const adminStore = useAdminStore();

const formattedRevenue = computed(() => {
  const rev = adminStore.totalPaidRevenue;
  if (rev >= 1000000) {
    return `Rp ${(rev / 1000000).toFixed(1)} Jt`;
  }
  return `Rp ${rev.toLocaleString('id-ID')}`;
});

const passRatePercent = computed(() => {
  if (!adminStore.applicants.length) return '0.0';
  return ((adminStore.passedStudentsCount / adminStore.applicants.length) * 100).toFixed(1);
});

const conversionRatePercent = computed(() => {
  if (!adminStore.applicants.length) return 0;
  const enrolledCount = adminStore.applicants.filter(
    (a) => a.onboarding?.isEnrolled || a.payments?.uktFee?.status === 'paid'
  ).length;
  return Math.round((enrolledCount / adminStore.applicants.length) * 100);
});

// Chart 1: Donut Distribusi Peminat Program Studi
const prodiDoughnutData = computed(() => {
  const counts = {
    'S1 Farmasi': 0,
    'S1 Teknologi Informasi': 0,
    'D3 Farmasi': 0,
    'D3 Analis Kesehatan (TLM)': 0,
    'S1 Administrasi RS': 0,
    'S1 Manajemen Bisnis': 0,
  };

  adminStore.applicants.forEach((a) => {
    const p = a.prodi1 || '';
    if (p.includes('D3 Farmasi')) counts['D3 Farmasi']++;
    else if (p.includes('S1 Farmasi')) counts['S1 Farmasi']++;
    else if (p.includes('Teknologi')) counts['S1 Teknologi Informasi']++;
    else if (p.includes('Analis') || p.includes('TLM')) counts['D3 Analis Kesehatan (TLM)']++;
    else if (p.includes('Administrasi')) counts['S1 Administrasi RS']++;
    else if (p.includes('Bisnis') || p.includes('MBI')) counts['S1 Manajemen Bisnis']++;
    else counts['S1 Farmasi']++;
  });

  return {
    labels: Object.keys(counts),
    datasets: [
      {
        data: Object.values(counts),
        backgroundColor: [
          '#1E3A8A', // BTH Navy
          '#2563EB', // Blue
          '#6366F1', // Indigo
          '#10B981', // Emerald
          '#F59E0B', // Amber
          '#EC4899', // Pink
        ],
        borderWidth: 2,
        borderColor: '#FFFFFF',
      },
    ],
  };
});

// Chart 2: Funnel Bar Konversi Alur PMB
const funnelBarData = computed(() => {
  const registered = adminStore.applicants.length;
  const docsVerified = adminStore.applicants.filter((a) => a.documentStatus === 'verified').length;
  const regFeePaid = adminStore.applicants.filter((a) => a.payments?.registrationFee?.status === 'paid').length;
  const cbtTaken = adminStore.applicants.filter((a) => (a.selection?.cbtScore > 0) || a.selection?.passedStatus === 'passed').length;
  const passed = adminStore.passedStudentsCount;
  const enrolled = adminStore.applicants.filter((a) => a.onboarding?.isEnrolled || a.payments?.uktFee?.status === 'paid').length;

  return {
    labels: [
      'Pendaftar Akun',
      'Formulir Lunas',
      'Berkas Terverifikasi',
      'Peserta CBT',
      'Lulus Seleksi',
      'NIM Diterbitkan',
    ],
    datasets: [
      {
        label: 'Jumlah Calon Mahasiswa',
        data: [registered, regFeePaid, docsVerified, cbtTaken, passed, enrolled],
        backgroundColor: [
          '#94A3B8', // slate-400
          '#F59E0B', // amber-500
          '#3B82F6', // blue-500
          '#6366F1', // indigo-500
          '#10B981', // emerald-500
          '#1E3A8A', // bth navy
        ],
        borderRadius: 8,
      },
    ],
  };
});

// Kuota murni tanpa angka dummy base
const prodiQuotas = computed(() => {
  const baseConfig = [
    { key: 'S1 Farmasi', name: 'S1 Farmasi (Fakultas Farmasi)', quota: 150, color: 'bg-[#1E3A8A]' },
    { key: 'Teknologi', name: 'S1 Teknologi Informasi (Fakultas Teknologi & Bisnis)', quota: 80, color: 'bg-[#2563EB]' },
    { key: 'D3 Farmasi', name: 'D3 Farmasi (Fakultas Farmasi)', quota: 90, color: 'bg-indigo-600' },
    { key: 'Analis', name: 'D3 Analis Kesehatan / TLM (Fakultas Ilmu Kesehatan)', quota: 60, color: 'bg-emerald-600' },
    { key: 'Administrasi', name: 'S1 Administrasi Rumah Sakit (Fakultas Ilmu Kesehatan)', quota: 60, color: 'bg-amber-500' },
    { key: 'Bisnis', name: 'S1 Manajemen Bisnis Informasi (Fakultas Teknologi & Bisnis)', quota: 60, color: 'bg-pink-500' },
  ];

  return baseConfig.map((item) => {
    const activeCount = adminStore.applicants.filter((a) => {
      const p = a.prodi1 || '';
      if (item.key === 'D3 Farmasi') return p.includes('D3 Farmasi');
      if (item.key === 'S1 Farmasi') return p.includes('S1 Farmasi') || (!p.includes('D3 Farmasi') && p.includes('Farmasi'));
      return p.includes(item.key);
    }).length;

    const percent = item.quota ? Math.round((activeCount / item.quota) * 100) : 0;
    return {
      name: item.name,
      enrolled: activeCount,
      quota: item.quota,
      percent,
      color: item.color,
    };
  });
});
</script>
