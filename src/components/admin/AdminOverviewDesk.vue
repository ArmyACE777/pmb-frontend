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

    <!-- 4 KPI Cards Grid: Bersih, Rapi, Tipografi Kuat Tanpa Icon Box Mengambang -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Card 1: Total Pendaftar -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div class="text-xs font-medium text-slate-500 font-sans">Total Pendaftar</div>
        <div class="mt-2">
          <div class="font-sora font-extrabold text-2xl sm:text-3xl text-slate-900">
            {{ adminStore.totalApplicants.toLocaleString('id-ID') }}
          </div>
          <div class="text-[11px] text-slate-500 mt-1 font-sans">
            Akun calon mahasiswa terdaftar
          </div>
        </div>
      </div>

      <!-- Card 2: Berkas Pending -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div class="text-xs font-medium text-slate-500 font-sans">Antrean Verifikasi Berkas</div>
        <div class="mt-2">
          <div class="font-sora font-extrabold text-2xl sm:text-3xl text-amber-600">
            {{ adminStore.pendingVerificationCount }} <span class="text-sm font-normal text-slate-500 font-sans">Berkas</span>
          </div>
          <div class="text-[11px] text-slate-500 mt-1 font-sans">
            Menunggu validasi tim panitia
          </div>
        </div>
      </div>

      <!-- Card 3: Penerimaan Dana -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div class="text-xs font-medium text-slate-500 font-sans">Penerimaan Pembayaran</div>
        <div class="mt-2">
          <div class="font-sora font-extrabold text-xl sm:text-2xl text-[#1E3A8A]">
            {{ formattedRevenue }}
          </div>
          <div class="text-[11px] text-emerald-700 mt-1 font-sans">
            Formulir & UKT terverifikasi
          </div>
        </div>
      </div>

      <!-- Card 4: Mahasiswa Diterima -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div class="text-xs font-medium text-slate-500 font-sans">Dinyatakan Lulus Seleksi</div>
        <div class="mt-2">
          <div class="font-sora font-extrabold text-2xl sm:text-3xl text-slate-900">
            {{ adminStore.passedStudentsCount }} <span class="text-sm font-normal text-slate-500 font-sans">Maba</span>
          </div>
          <div class="text-[11px] text-slate-500 mt-1 font-sans">
            Tingkat kelulusan seleksi {{ passRatePercent }}%
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section: Visualisasi Data Interaktif -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Chart 1: Distribusi Peminat per Program Studi (Doughnut) -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
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
          Diperbarui otomatis dari database akun calon mahasiswa Universitas BTH
        </div>
      </div>

      <!-- Chart 2: Funnel Konversi Alur Seleksi PMB (Bar Horizontal) -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
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
          Tingkat konversi pendaftar ke mahasiswa resmi (NIM): {{ conversionRatePercent }}%
        </div>
      </div>
    </div>

    <!-- Kuota Program Studi & Log Aktivitas Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Kuota Pendaftaran per Prodi (Col 2) -->
      <div class="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
              Distribusi Peminat & Keterisian Kuota Gelombang 1
            </h3>
            <p class="text-xs text-slate-500 font-sans mt-0.5">Kapasitas daya tampung program studi aktif.</p>
          </div>
          <span class="text-xs text-slate-500 font-medium font-sans">Batas Kuota TA 2026/2027</span>
        </div>

        <div class="space-y-4 text-xs font-sans">
          <div v-for="item in prodiQuotas" :key="item.name" class="space-y-1.5">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
              <span class="font-sora font-semibold text-slate-800">{{ item.name }}</span>
              <span class="text-slate-500 flex-shrink-0 text-[11px] sm:text-xs">
                <strong class="text-slate-900">{{ item.enrolled }}</strong> / {{ item.quota }} Kursi ({{ item.percent }}%)
              </span>
            </div>
            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="item.color"
                :style="{ width: `${item.percent}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Log Aktivitas Terkini Panitia (Col 1) -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
            Log Aktivitas Panitia PMB
          </h3>
          <span class="text-[11px] text-slate-400 font-medium font-sans">Terkini</span>
        </div>

        <div class="space-y-3 text-xs">
          <div
            v-for="(act, idx) in recentActivities"
            :key="idx"
            class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1"
          >
            <div class="flex justify-between items-center">
              <span class="font-bold" :class="act.color">{{ act.title }}</span>
              <span class="text-[10px] text-slate-400">{{ act.time }}</span>
            </div>
            <p class="text-slate-600 leading-relaxed">{{ act.desc }}</p>
          </div>
          <div v-if="!recentActivities.length" class="p-4 text-center text-slate-400 italic">
            Belum ada aktivitas baru tercatat.
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

const recentActivities = computed(() => {
  const list = [];
  adminStore.applicants.forEach((a) => {
    if (a.onboarding?.nim) {
      list.push({
        title: 'Penerbitan NIM Mahasiswa',
        time: 'Terkini',
        color: 'text-indigo-700',
        desc: `NIM ${a.onboarding.nim} resmi diterbitkan untuk ${a.fullName} (${a.prodi1}).`,
      });
    }
    if (a.payments?.uktFee?.status === 'paid') {
      list.push({
        title: 'Pelunasan UKT Mahasiswa',
        time: a.payments.uktFee.paidAt || 'Terkini',
        color: 'text-emerald-700',
        desc: `Pelunasan UKT Semester 1 Rp ${a.payments.uktFee.amount?.toLocaleString('id-ID')} atas nama ${a.fullName}.`,
      });
    }
    if (a.documentStatus === 'verified') {
      list.push({
        title: 'Verifikasi Dokumen',
        time: 'Terverifikasi',
        color: 'text-slate-800',
        desc: `Berkas persyaratan PMB atas nama ${a.fullName} telah disetujui panitia.`,
      });
    }
  });
  return list.slice(0, 4);
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
