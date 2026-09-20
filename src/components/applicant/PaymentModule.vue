<template>
  <div class="space-y-6">
    <!-- Header Modul -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-lg text-slate-900">
          Tagihan & Pembayaran Keuangan Mahasiswa
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Pantau status tagihan pendaftaran formulir dan biaya UKT semester 1 via Virtual Account resmi BTH.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <span
          class="px-3 py-1 rounded-full text-xs font-semibold font-sora"
          :class="isUktPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'"
        >
          {{ isUktPaid ? 'Semua Tagihan Lunas' : '1 Tagihan Menunggu Pembayaran' }}
        </span>
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

    <!-- Tagihan Cards Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 1. Biaya Formulir (LUNAS) -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <span class="text-[11px] font-mono text-slate-500">
              {{ regPayment.id }}
            </span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold font-sora">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ regPayment.statusLabel }}</span>
            </span>
          </div>

          <h3 class="font-sora font-bold text-slate-900 text-base mb-1">
            {{ regPayment.title }}
          </h3>
          <div class="font-sora font-black text-2xl text-[#1E3A8A] mb-4">
            Rp {{ regPayment.amount.toLocaleString('id-ID') }}
          </div>

          <div class="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2 text-xs">
            <div class="flex justify-between items-center text-slate-600">
              <span class="text-slate-500">Metode Bayar:</span>
              <span class="font-semibold text-slate-800">{{ regPayment.paymentMethod }}</span>
            </div>
            <div class="flex justify-between items-center text-slate-600">
              <span class="text-slate-500">No. Virtual Account:</span>
              <span class="font-mono font-bold text-slate-800">{{ regPayment.vaNumber }}</span>
            </div>
            <div class="flex justify-between items-center text-slate-600">
              <span class="text-slate-500">Waktu Pembayaran:</span>
              <span class="text-emerald-700 font-medium">{{ regPayment.paidAt }}</span>
            </div>
          </div>
        </div>

        <div class="pt-5 border-t border-slate-100 mt-5">
          <button
            @click="openReceiptModal('reg')"
            class="w-full py-2.5 bg-slate-100 hover:bg-[#1E3A8A] hover:text-white text-slate-700 text-xs font-sora font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Lihat Kwitansi Resmi Formulir</span>
          </button>
        </div>
      </div>

      <!-- 2. Biaya UKT Semester 1 (Menunggu / Lunas) -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <span class="text-[11px] font-mono text-slate-500">
              {{ uktPayment.id }}
            </span>
            <span
              class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold font-sora"
              :class="isUktPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'"
            >
              <svg v-if="isUktPaid" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else class="w-3 h-3 animate-spin text-amber-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>{{ uktPayment.statusLabel }}</span>
            </span>
          </div>

          <h3 class="font-sora font-bold text-slate-900 text-base mb-1">
            {{ uktPayment.title }}
          </h3>
          <div class="font-sora font-black text-2xl text-[#1E3A8A] mb-4">
            Rp {{ uktPayment.amount.toLocaleString('id-ID') }}
          </div>

          <!-- If Pending: Show VA options -->
          <div v-if="!isUktPaid" class="space-y-3 text-xs">
            <div class="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-bold text-[#1E3A8A]">VA Bank Syariah Indonesia (BSI)</span>
                <button
                  @click="copyText(uktPayment.vaBsi, 'Nomor VA BSI')"
                  class="text-[11px] font-semibold text-[#1E3A8A] hover:underline flex items-center gap-1"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Salin</span>
                </button>
              </div>
              <div class="font-mono font-bold text-base text-slate-900 tracking-wider">
                {{ uktPayment.vaBsi }}
              </div>
              <div class="text-[11px] text-slate-500">
                Atas Nama: <strong>PMB BTH - Siti Rahmawati</strong>
              </div>
            </div>

            <div class="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-800">VA Bank Mandiri</span>
                <button
                  @click="copyText(uktPayment.vaMandiri, 'Nomor VA Mandiri')"
                  class="text-[11px] font-semibold text-[#1E3A8A] hover:underline flex items-center gap-1"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Salin</span>
                </button>
              </div>
              <div class="font-mono font-bold text-base text-slate-900 tracking-wider">
                {{ uktPayment.vaMandiri }}
              </div>
              <div class="text-[11px] text-slate-500">
                Batas Akhir: <strong class="text-rose-600">{{ uktPayment.dueDate }}</strong>
              </div>
            </div>
          </div>

          <!-- If Paid: Show Paid Info -->
          <div v-else class="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2 text-xs">
            <div class="flex justify-between items-center text-slate-600">
              <span class="text-slate-500">Status Pembayaran:</span>
              <span class="font-bold text-emerald-800">Lunas & Terverifikasi Otomatis</span>
            </div>
            <div class="flex justify-between items-center text-slate-600">
              <span class="text-slate-500">Kanal Pembayaran:</span>
              <span class="font-medium text-slate-800">Virtual Account BSI</span>
            </div>
            <div class="flex justify-between items-center text-slate-600">
              <span class="text-slate-500">Waktu Pelunasan:</span>
              <span class="text-emerald-700 font-medium">{{ uktPayment.paidAt }}</span>
            </div>
          </div>
        </div>

        <div class="pt-5 border-t border-slate-100 mt-5 flex flex-col sm:flex-row gap-2">
          <button
            v-if="!isUktPaid"
            @click="simulatePayUkt"
            class="flex-1 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-sora font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Simulasi Bayar Tagihan (Mock)</span>
          </button>

          <button
            v-else
            @click="openReceiptModal('ukt')"
            class="flex-1 py-2.5 bg-slate-100 hover:bg-[#1E3A8A] hover:text-white text-slate-700 text-xs font-sora font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Lihat Kwitansi Resmi UKT</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Panduan Pembayaran Virtual Account -->
    <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
      <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base pb-3 border-b border-slate-100">
        Petunjuk Tata Cara Pembayaran Virtual Account BTH
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
        <div class="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
          <div class="font-sora font-bold text-slate-800">1. Mobile Banking (BSI / Mandiri)</div>
          <p class="leading-relaxed">
            Pilih menu <strong>Bayar &gt; Akademik / Pendidikan</strong>, masukkan kode institusi BTH dan nomor Virtual Account di atas.
          </p>
        </div>
        <div class="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
          <div class="font-sora font-bold text-slate-800">2. Melalui Mesin ATM</div>
          <p class="leading-relaxed">
            Pilih menu <strong>Transaksi Lainnya &gt; Transfer &gt; Ke Rekening Virtual Account</strong>. Masukkan nomor VA secara lengkap.
          </p>
        </div>
        <div class="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
          <div class="font-sora font-bold text-slate-800">3. Verifikasi Realtime</div>
          <p class="leading-relaxed">
            Sistem PMB BTH menggunakan integrasi otomatis host-to-host. Status pembayaran akan berubah lunas dalam hitungan detik.
          </p>
        </div>
      </div>
    </div>

    <!-- Modal Kwitansi Digital Resmi BTH -->
    <div
      v-if="selectedReceipt"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
    >
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
        <!-- Close Button -->
        <button
          @click="selectedReceipt = null"
          class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 text-2xl font-bold leading-none"
        >
          &times;
        </button>

        <!-- Receipt Header with Logo & Institution -->
        <div class="text-center pb-4 border-b border-slate-200">
          <div class="font-sora font-extrabold text-sm text-[#1E3A8A] tracking-wider uppercase">
            Universitas Bakti Tunas Husada
          </div>
          <div class="text-[11px] text-slate-500 mt-0.5">
            Jl. Cilolohan No. 36, Kahuripan, Tawang, Kota Tasikmalaya
          </div>
          <div class="font-sora font-bold text-base text-slate-900 mt-3">
            TANDA BUKTI PEMBAYARAN SAH (KWITANSI)
          </div>
          <div class="font-mono text-xs text-slate-500">
            No: {{ selectedReceiptData.id }}
          </div>
        </div>

        <!-- Receipt Details Body -->
        <div class="py-4 space-y-2.5 text-xs text-slate-700">
          <div class="flex justify-between">
            <span class="text-slate-500">Telah Diterima Dari:</span>
            <span class="font-bold text-slate-900">{{ candidate.fullName }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">No. Registrasi:</span>
            <span class="font-mono font-semibold text-slate-800">{{ candidate.registrationNumber }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Program Studi:</span>
            <span class="font-semibold text-[#1E3A8A]">{{ admission.prodi1 }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Untuk Pembayaran:</span>
            <span class="font-medium text-slate-800">{{ selectedReceiptData.title }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Waktu Pelunasan:</span>
            <span class="font-medium text-slate-800">{{ selectedReceiptData.paidAt || '12 September 2026' }}</span>
          </div>
          <div class="flex justify-between pt-2 border-t border-slate-100 font-sora">
            <span class="font-bold text-slate-700">Jumlah Terbayar:</span>
            <span class="font-extrabold text-base text-[#1E3A8A]">
              Rp {{ selectedReceiptData.amount.toLocaleString('id-ID') }}
            </span>
          </div>
        </div>

        <!-- Paid Digital Stamp -->
        <div class="my-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-sora font-bold text-emerald-800">LUNAS - VERIFIKASI SISTEM HOST-TO-HOST BTH</span>
          </div>
          <span class="font-mono text-[10px] text-emerald-700">AUTOPAY-BSI</span>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
          <button
            @click="windowPrint"
            class="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Cetak Kwitansi</span>
          </button>
          <button
            @click="selectedReceipt = null"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useApplicantStore } from '@/stores/applicant';

const applicantStore = useApplicantStore();
const regPayment = computed(() => applicantStore.state.payments.registrationFee);
const uktPayment = computed(() => applicantStore.state.payments.uktFee);
const candidate = computed(() => applicantStore.state.candidate);
const admission = computed(() => applicantStore.state.admission);

const isUktPaid = computed(() => uktPayment.value.status === 'paid');

const toastMessage = ref('');
const selectedReceipt = ref(null);

const selectedReceiptData = computed(() => {
  if (selectedReceipt.value === 'ukt') return uktPayment.value;
  return regPayment.value;
});

const copyText = async (text, label) => {
  try {
    await navigator.clipboard.writeText(text);
    toastMessage.value = `${label} (${text}) berhasil disalin ke papan klip.`;
  } catch {
    toastMessage.value = `${label} (${text}) siap digunakan.`;
  }
};

const simulatePayUkt = () => {
  applicantStore.payUktFee();
  toastMessage.value = 'Pembayaran UKT Semester 1 sebesar Rp 6.500.000 berhasil dilunasi via Virtual Account!';
};

const openReceiptModal = (type) => {
  selectedReceipt.value = type;
};

const windowPrint = () => {
  window.print();
};
</script>
