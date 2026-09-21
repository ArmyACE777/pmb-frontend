<template>
  <div class="space-y-6">
    <!-- Header Meja Kerja -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-lg text-slate-900">
          Meja Rekonsiliasi Keuangan & Virtual Account
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Pantau transaksi biaya formulir PMB dan pelunasan UKT Semester 1 via BSI & Mandiri.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="exportCsv"
          class="px-3.5 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
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
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Formulir Terbayar</div>
        <div class="font-sora font-extrabold text-2xl text-slate-900 mt-1">
          {{ paidRegFeeCount }} / {{ adminStore.applicants.length }} <span class="text-xs font-normal text-emerald-600 font-sans">Lunas {{ regFeePercent }}%</span>
        </div>
        <div class="text-xs text-slate-500 mt-1">Rp 250.000 / formulir pendaftaran</div>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pelunasan UKT Semester 1</div>
        <div class="font-sora font-extrabold text-2xl text-[#1E3A8A] mt-1">
          {{ paidUktCount }} <span class="text-xs font-normal text-slate-500 font-sans">dari {{ adminStore.applicants.length }} Calon Mahasiswa</span>
        </div>
        <div class="text-xs text-amber-600 font-medium mt-1">
          {{ adminStore.applicants.length - paidUktCount }} Mahasiswa Menunggu Pembayaran
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

    <!-- Transactions Table -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 class="font-sora font-bold text-slate-900 text-sm">
          Daftar Tagihan & Status Transaksi Virtual Account
        </h3>
        <span class="text-xs text-slate-400">Total {{ allTransactions.length }} Tagihan Terdaftar</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-700">
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
                  <span>Lunas</span>
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[11px] font-semibold font-sora"
                >
                  <svg class="w-3 h-3 animate-spin text-amber-600" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Menunggu Bayar</span>
                </span>
              </td>

              <!-- Action Button -->
              <td class="py-3.5 px-4 text-right">
                <button
                  v-if="trx.status !== 'paid'"
                  @click="confirmManual(trx)"
                  class="px-3 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs rounded-xl transition-all shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Konfirmasi Lunas</span>
                </button>
                <span v-else class="text-[11px] text-slate-400 font-mono">
                  {{ trx.paidAt || 'Tervalidasi' }}
                </span>
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

const allTransactions = computed(() => {
  const list = [];
  adminStore.applicants.forEach((a) => {
    // UKT Fee
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
      typeKey: 'uktFee',
    });
    // Registration Fee
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
      typeKey: 'registrationFee',
    });
  });
  return list;
});

const bsiCount = computed(() => allTransactions.value.filter((t) => t.method?.toLowerCase().includes('bsi') && t.status === 'paid').length);
const mandiriCount = computed(() => allTransactions.value.filter((t) => t.method?.toLowerCase().includes('mandiri') && t.status === 'paid').length);
const totalPaidTrx = computed(() => bsiCount.value + mandiriCount.value);
const bsiPercent = computed(() => (totalPaidTrx.value ? Math.round((bsiCount.value / totalPaidTrx.value) * 100) : 75));
const mandiriPercent = computed(() => (totalPaidTrx.value ? 100 - bsiPercent.value : 25));

const confirmManual = (trx) => {
  adminStore.confirmPayment(trx.applicantId, trx.typeKey);
  toastMessage.value = `Tagihan ${trx.invoiceId} atas nama ${trx.applicantName} berhasil dikonfirmasi LUNAS.`;
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
