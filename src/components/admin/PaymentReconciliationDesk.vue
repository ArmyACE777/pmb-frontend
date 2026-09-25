<template>
  <div class="space-y-6">
    <!-- Header Meja Kerja -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900">
          Rekonsiliasi Keuangan & Virtual Account
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Pantau transaksi biaya formulir PMB dan pelunasan UKT Semester 1 via BSI & Mandiri.
        </p>
      </div>
      <div class="flex items-center gap-2 self-start sm:self-auto">
        <button
          @click="exportCsv"
          class="w-full sm:w-auto px-3.5 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Ekspor Rekap CSV</span>
        </button>
      </div>
    </div>

    <!-- Alert Toast Feedback -->
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
      <button @click="toastMessage = ''" class="text-emerald-600 hover:text-emerald-900 font-bold text-sm leading-none">&times;</button>
    </div>

    <!-- Summary Metrics Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Formulir Terbayar</div>
        <div class="font-sora font-extrabold text-2xl text-slate-900 mt-1">
          {{ paidRegFeeCount }} / {{ adminStore.applicants.length }} <span class="text-xs font-normal text-emerald-600 font-sans">Lunas {{ regFeePercent }}%</span>
        </div>
        <div class="text-xs text-slate-500 mt-1">Rp 250.000 / formulir pendaftaran</div>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs" :class="pendingConfirmationCount > 0 ? 'border-amber-300 ring-1 ring-amber-200 bg-amber-50/30' : ''">
        <div class="text-[11px] font-bold uppercase tracking-wider flex items-center justify-between" :class="pendingConfirmationCount > 0 ? 'text-amber-700' : 'text-slate-400'">
          <span>Perlu Konfirmasi Admin</span>
        </div>
        <div class="font-sora font-extrabold text-2xl mt-1" :class="pendingConfirmationCount > 0 ? 'text-amber-600' : 'text-slate-900'">
          {{ pendingConfirmationCount }} <span class="text-xs font-normal text-slate-500 font-sans">Transaksi</span>
        </div>
        <div class="text-xs mt-1 font-sans" :class="pendingConfirmationCount > 0 ? 'text-amber-800 font-medium' : 'text-slate-500'">
          {{ pendingConfirmationCount > 0 ? 'Segera validasi transaksi pendaftar' : 'Semua pembayaran telah disahkan' }}
        </div>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pelunasan UKT Semester 1</div>
        <div class="font-sora font-extrabold text-2xl text-[#1E3A8A] mt-1">
          {{ paidUktCount }} <span class="text-xs font-normal text-slate-500 font-sans">dari {{ adminStore.applicants.length }} Mhs</span>
        </div>
        <div class="text-xs text-slate-500 mt-1">
          Total Dana: Rp {{ totalUktFeePaid.toLocaleString('id-ID') }}
        </div>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kanal Host-to-Host</div>
        <div class="font-sora font-extrabold text-lg text-slate-800 mt-1">
          BSI ({{ bsiPercent }}%) • Mandiri ({{ mandiriPercent }}%)
        </div>
        <div class="text-xs text-emerald-600 font-medium mt-1">
          Sinkronisasi otomatis aktif
        </div>
      </div>
    </div>

    <!-- Charts Section: Visualisasi Keuangan PMB -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Chart 1: Komposisi Penerimaan Kas (Formulir vs UKT) -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-sm">
              Proporsi Penerimaan Dana PMB
            </h3>
            <p class="text-xs text-slate-500">Biaya Formulir Registrasi vs UKT Semester 1</p>
          </div>
          <span class="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            Rp {{ (totalRevenue).toLocaleString('id-ID') }}
          </span>
        </div>
        <div class="h-56 my-2 flex items-center justify-center">
          <DoughnutChart
            v-if="totalRevenue > 0"
            :chart-data="revenueDoughnutData"
          />
          <div v-else class="text-xs text-slate-400 italic py-8 text-center">
            Belum ada pembayaran yang terkonfirmasi lunas.
          </div>
        </div>
        <div class="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100">
          Formulir Lunas: Rp {{ totalRegFeePaid.toLocaleString('id-ID') }} • UKT Lunas: Rp {{ totalUktFeePaid.toLocaleString('id-ID') }}
        </div>
      </div>

      <!-- Chart 2: Pangsa Kanal Virtual Account (BSI vs Mandiri) -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-sm">
              Distribusi Kanal Host-to-Host Virtual Account
            </h3>
            <p class="text-xs text-slate-500">Transaksi terverifikasi melalui Bank BSI & Mandiri</p>
          </div>
          <span class="text-xs font-mono font-bold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded">
            {{ totalPaidTrx }} Transaksi Lunas
          </span>
        </div>
        <div class="h-56 my-2 flex items-center justify-center">
          <DoughnutChart
            v-if="totalPaidTrx > 0"
            :chart-data="channelDoughnutData"
          />
          <div v-else class="text-xs text-slate-400 italic py-8 text-center">
            Belum ada transaksi Virtual Account terbayar.
          </div>
        </div>
        <div class="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100">
          Bank BSI (Syariah): {{ bsiCount }} trx • Bank Mandiri: {{ mandiriCount }} trx
        </div>
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 class="font-sora font-bold text-slate-900 text-sm">
          Daftar Tagihan & Status Transaksi Virtual Account
        </h3>
        <span class="text-xs text-slate-400">Total {{ allTransactions.length }} Tagihan Terdaftar</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-700 min-w-[680px]">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-sora uppercase text-[10px] tracking-wider">
            <tr>
              <th class="py-3.5 px-4 font-bold">No. Invoice</th>
              <th class="py-3.5 px-4 font-bold">Nama Mahasiswa & Prodi</th>
              <th class="py-3.5 px-4 font-bold">Jenis Tagihan</th>
              <th class="py-3.5 px-4 font-bold">Nominal</th>
              <th class="py-3.5 px-4 font-bold">Kanal Bayar</th>
              <th class="py-3.5 px-4 font-bold">Status</th>
              <th class="py-3.5 px-4 font-bold text-right">Aksi Konfirmasi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-sans">
            <tr
              v-for="trx in allTransactions"
              :key="trx.invoiceId"
              class="hover:bg-slate-50/80 transition-colors"
            >
              <!-- Invoice No -->
              <td class="py-3.5 px-4 font-mono font-bold text-slate-800">
                {{ trx.invoiceId }}
              </td>

              <!-- Candidate & Prodi -->
              <td class="py-3.5 px-4">
                <div class="font-sora font-bold text-slate-900">{{ trx.applicantName }}</div>
                <div class="text-[11px] text-slate-500">{{ trx.prodi }}</div>
              </td>

              <!-- Fee Type -->
              <td class="py-3.5 px-4">
                <span class="font-medium text-slate-800">{{ trx.feeType }}</span>
              </td>

              <!-- Amount -->
              <td class="py-3.5 px-4">
                <div class="font-sora font-bold text-[#1E3A8A]">
                  Rp {{ trx.amount.toLocaleString('id-ID') }}
                </div>
              </td>

              <!-- Method -->
              <td class="py-3.5 px-4 font-mono text-slate-600">
                {{ trx.method }}
              </td>

              <!-- Status Pill -->
              <td class="py-3.5 px-4">
                <span
                  v-if="trx.status === 'paid'"
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-semibold font-sora"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Lunas (Disahkan)</span>
                </span>
                <span
                  v-else-if="trx.status === 'pending_confirmation'"
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-300 rounded-full text-[11px] font-semibold font-sora animate-pulse"
                >
                  <svg class="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Perlu Konfirmasi Admin</span>
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-[11px] font-semibold font-sora"
                >
                  <svg class="w-3 h-3 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Menunggu Bayar</span>
                </span>
              </td>

              <!-- Action Button -->
              <td class="py-3.5 px-4 text-right">
                <div v-if="trx.status === 'pending_confirmation'" class="flex items-center justify-end gap-2">
                  <button
                    @click="confirmManual(trx)"
                    class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-sora font-semibold text-xs rounded-xl transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer ring-2 ring-emerald-400/40"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Konfirmasi Selesai</span>
                  </button>
                </div>
                <div v-else-if="trx.status === 'paid'" class="flex flex-col items-end">
                  <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 font-sora">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Disahkan Admin
                  </span>
                  <span class="text-[10px] text-slate-400 font-mono">
                    {{ trx.paidAt || 'Tervalidasi' }}
                  </span>
                </div>
                <div v-else class="flex items-center justify-end">
                  <button
                    @click="confirmManual(trx)"
                    class="px-3 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs rounded-xl transition-all shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                    title="Konfirmasi manual pelunasan oleh Panitia PMB"
                  >
                    <span>Konfirmasi Lunas</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="allTransactions.length === 0">
              <td colspan="7" class="py-12 text-center text-slate-400">
                <div class="max-w-xs mx-auto space-y-2">
                  <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="font-sora font-semibold text-slate-700 text-sm">Belum Ada Transaksi</div>
                  <p class="text-xs text-slate-400">Belum ada transaksi pembayaran formulir atau UKT yang tercatat.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAdminStore } from '@/stores/admin';
import DoughnutChart from '@/components/charts/DoughnutChart.vue';

const adminStore = useAdminStore();
const toastMessage = ref('');

const paidUktCount = computed(() => {
  return adminStore.applicants.filter((a) => a.payments.uktFee.status === 'paid').length;
});

const paidRegFeeCount = computed(() => {
  return adminStore.applicants.filter((a) => a.payments?.registrationFee?.status === 'paid').length;
});

const regFeePercent = computed(() => {
  if (!adminStore.applicants.length) return 0;
  return Math.round((paidRegFeeCount.value / adminStore.applicants.length) * 100);
});

const totalRegFeePaid = computed(() => {
  return adminStore.applicants
    .filter((a) => a.payments?.registrationFee?.status === 'paid')
    .reduce((acc, a) => acc + (a.payments.registrationFee.amount || 250000), 0);
});

const totalUktFeePaid = computed(() => {
  return adminStore.applicants
    .filter((a) => a.payments?.uktFee?.status === 'paid')
    .reduce((acc, a) => acc + (a.payments.uktFee.amount || 0), 0);
});

const totalRevenue = computed(() => totalRegFeePaid.value + totalUktFeePaid.value);

const revenueDoughnutData = computed(() => ({
  labels: ['Biaya Formulir Pendaftaran', 'Pelunasan UKT Semester 1'],
  datasets: [
    {
      data: [totalRegFeePaid.value, totalUktFeePaid.value],
      backgroundColor: ['#F59E0B', '#1E3A8A'],
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
  ],
}));

const allTransactions = computed(() => {
  const list = [];
  adminStore.applicants.forEach((a) => {
    // UKT Fee
    if (a.payments?.uktFee) {
      list.push({
        applicantId: a.id,
        applicantName: a.fullName,
        prodi: a.prodi1,
        invoiceId: a.payments.uktFee.id,
        feeType: 'UKT & Registrasi Sem. 1',
        amount: a.payments.uktFee.amount,
        status: a.payments.uktFee.status,
        method: a.payments.uktFee.method,
        paidAt: a.payments.uktFee.paidAt,
        submittedAt: a.payments.uktFee.submittedAt,
        confirmedBy: a.payments.uktFee.confirmedBy,
        typeKey: 'uktFee',
      });
    }
    // Registration Fee
    if (a.payments?.registrationFee) {
      list.push({
        applicantId: a.id,
        applicantName: a.fullName,
        prodi: a.prodi1,
        invoiceId: a.payments.registrationFee.id,
        feeType: 'Biaya Formulir Pendaftaran',
        amount: a.payments.registrationFee.amount,
        status: a.payments.registrationFee.status,
        method: a.payments.registrationFee.method,
        paidAt: a.payments.registrationFee.paidAt,
        submittedAt: a.payments.registrationFee.submittedAt,
        confirmedBy: a.payments.registrationFee.confirmedBy,
        typeKey: 'registrationFee',
      });
    }
  });

  // Urutkan transaksi: yang membutuhkan konfirmasi admin ('pending_confirmation') ditempatkan paling atas
  const statusPriority = { pending_confirmation: 1, pending: 2, unpaid: 2, paid: 3 };
  return list.sort((a, b) => (statusPriority[a.status] || 99) - (statusPriority[b.status] || 99));
});

const pendingConfirmationCount = computed(() => {
  return allTransactions.value.filter((t) => t.status === 'pending_confirmation').length;
});

const bsiCount = computed(() => allTransactions.value.filter((t) => t.method?.toLowerCase().includes('bsi') && t.status === 'paid').length);
const mandiriCount = computed(() => allTransactions.value.filter((t) => t.method?.toLowerCase().includes('mandiri') && t.status === 'paid').length);
const totalPaidTrx = computed(() => bsiCount.value + mandiriCount.value);
const bsiPercent = computed(() => (totalPaidTrx.value ? Math.round((bsiCount.value / totalPaidTrx.value) * 100) : 0));
const mandiriPercent = computed(() => (totalPaidTrx.value ? Math.round((mandiriCount.value / totalPaidTrx.value) * 100) : 0));

const channelDoughnutData = computed(() => ({
  labels: ['Bank BSI Virtual Account', 'Bank Mandiri Virtual Account'],
  datasets: [
    {
      data: [bsiCount.value, mandiriCount.value],
      backgroundColor: ['#059669', '#2563EB'],
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
  ],
}));

const confirmManual = (trx) => {
  adminStore.confirmPayment(trx.applicantId, trx.typeKey);
  toastMessage.value = `✓ Sukses: Pembayaran ${trx.feeType} (${trx.invoiceId}) atas nama ${trx.applicantName} telah disahkan lunas oleh Admin PMB.`;
};

const exportCsv = () => {
  const headers = ['No Invoice', 'Nama Mahasiswa', 'Prodi', 'Jenis Tagihan', 'Nominal', 'Metode', 'Status'];
  const rows = allTransactions.value.map((t) => [
    t.invoiceId,
    `"${t.applicantName}"`,
    `"${t.prodi}"`,
    `"${t.feeType}"`,
    t.amount,
    `"${t.method}"`,
    t.status,
  ]);
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Rekap_Keuangan_PMB_BTH_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toastMessage.value = 'Laporan rekapitulasi keuangan berhasil diunduh dalam format CSV.';
};
</script>
