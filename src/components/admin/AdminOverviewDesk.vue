<template>
  <div class="space-y-6">
    <!-- Header Meja Kerja -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-lg text-slate-900">
          Ringkasan Eksekutif & Statistik PMB BTH
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Pemantauan komprehensif pendaftaran, validasi berkas, dan penerimaan mahasiswa baru TA 2026/2027.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold font-sora">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
          <span>Sistem Host-to-Host Aktif</span>
        </span>
      </div>
    </div>

    <!-- 4 KPI Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Card 1: Total Pendaftar -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Pendaftar</span>
          <div class="w-8 h-8 rounded-lg bg-blue-50 text-[#1E3A8A] flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-3">
          <div class="font-sora font-extrabold text-2xl sm:text-3xl text-slate-900">
            {{ adminStore.totalApplicants.toLocaleString('id-ID') }}
          </div>
          <div class="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>+14.2% dari Gelombang Tahun Lalu</span>
          </div>
        </div>
      </div>

      <!-- Card 2: Berkas Pending -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Antrean Verifikasi Berkas</span>
          <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        <div class="mt-3">
          <div class="font-sora font-extrabold text-2xl sm:text-3xl text-amber-600">
            {{ adminStore.pendingVerificationCount }} <span class="text-sm font-normal text-slate-500">Berkas</span>
          </div>
          <div class="text-[11px] text-slate-500 font-medium mt-1">
            Waktu respon rata-rata 1.4 jam
          </div>
        </div>
      </div>

      <!-- Card 3: Penerimaan Dana -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Penerimaan Dana</span>
          <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-3">
          <div class="font-sora font-extrabold text-xl sm:text-2xl text-[#1E3A8A]">
            {{ formattedRevenue }}
          </div>
          <div class="text-[11px] text-emerald-600 font-medium mt-1">
            Formulir PMB & UKT Semester 1
          </div>
        </div>
      </div>

      <!-- Card 4: Mahasiswa Diterima -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dinyatakan Lulus Seleksi</span>
          <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
        </div>
        <div class="mt-3">
          <div class="font-sora font-extrabold text-2xl sm:text-3xl text-slate-900">
            {{ adminStore.passedStudentsCount }} <span class="text-sm font-normal text-slate-500">Maba</span>
          </div>
          <div class="text-[11px] text-indigo-600 font-medium mt-1">
            Tingkat Kelulusan Seleksi {{ passRatePercent }}%
          </div>
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
            <p class="text-xs text-slate-500">Kapasitas daya tampung program studi aktif.</p>
          </div>
          <span class="text-xs text-[#1E3A8A] font-semibold">Batas Kuota TA 2026/2027</span>
        </div>

        <div class="space-y-4 text-xs">
          <div v-for="item in prodiQuotas" :key="item.name" class="space-y-1.5">
            <div class="flex justify-between items-center">
              <span class="font-sora font-semibold text-slate-800">{{ item.name }}</span>
              <span class="text-slate-500">
                <strong class="text-slate-900">{{ item.enrolled }}</strong> / {{ item.quota }} Kursi ({{ Math.round((item.enrolled / item.quota) * 100) }}%)
              </span>
            </div>
            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="item.color"
                :style="{ width: `${Math.round((item.enrolled / item.quota) * 100)}%` }"
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
          <span class="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold">LIVE</span>
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

const prodiQuotas = [
  { name: 'S1 Farmasi (Fakultas Farmasi)', enrolled: 120, quota: 150, color: 'bg-[#1E3A8A]' },
  { name: 'S1 Teknologi Informasi (Fakultas Teknologi & Bisnis)', enrolled: 65, quota: 80, color: 'bg-[#2563EB]' },
  { name: 'D3 Farmasi (Fakultas Farmasi)', enrolled: 72, quota: 90, color: 'bg-indigo-600' },
  { name: 'D3 Analis Kesehatan / TLM (Fakultas Ilmu Kesehatan)', enrolled: 54, quota: 60, color: 'bg-emerald-600' },
  { name: 'S1 Administrasi Rumah Sakit (Fakultas Ilmu Kesehatan)', enrolled: 48, quota: 60, color: 'bg-amber-500' },
];
</script>
