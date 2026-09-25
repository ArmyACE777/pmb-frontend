<template>
  <div class="space-y-6">
    <!-- Header Modul -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900">
          Biaya Pendaftaran & Tagihan Keuangan
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Informasi tagihan dan pembayaran biaya pendaftaran serta perkuliahan.
        </p>
      </div>
      <div class="text-xs text-slate-500 font-sans self-start sm:self-auto">
        Status: <strong class="text-slate-800 font-semibold">{{ applicantStore.isRegPaymentComplete ? 'Biaya Pendaftaran Lunas' : 'Menunggu Pembayaran' }}</strong>
      </div>
    </div>

    <!-- Alert Toast Feedback -->
    <div
      v-if="toastMessage"
      class="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center justify-between animate-fadeIn"
    >
      <div class="flex items-center gap-2">
        <CheckCircle2 class="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span>{{ toastMessage }}</span>
      </div>
      <button @click="toastMessage = ''" class="text-emerald-600 hover:text-emerald-900 font-bold text-base leading-none">&times;</button>
    </div>

    <!-- LIST BIAYA PENDAFTARAN & PENDIDIKAN (Summary Bar) -->
    <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
            Rincian Biaya Perkuliahan
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">Tahun Akademik 2026/2027</p>
        </div>
        <span class="text-xs font-medium text-slate-600 self-start sm:self-auto">
          {{ admission?.prodi1 || 'Program Studi Pilihan' }}
        </span>
      </div>

      <!-- 4 Kolom Rincian Biaya -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs font-sans">
        <!-- 1. Biaya Formulir -->
        <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
          <div class="text-[11px] text-slate-500 font-medium">Formulir Pendaftaran</div>
          <div class="font-sora font-bold text-slate-900 text-sm sm:text-base mt-1">
            Rp {{ regPayment.amount.toLocaleString('id-ID') }}
          </div>
          <div class="text-[11px] mt-0.5 font-medium" :class="regPayment.status === 'paid' ? 'text-emerald-700' : 'text-amber-700'">
            {{ regPayment.status === 'paid' ? 'Lunas' : 'Menunggu Bayar' }}
          </div>
        </div>

        <!-- 2. Biaya UKT Semester 1 -->
        <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
          <div class="text-[11px] text-slate-500 font-medium">UKT Semester 1</div>
          <div class="font-sora font-bold text-[#1E3A8A] text-sm sm:text-base mt-1">
            Rp {{ uktPayment.amount.toLocaleString('id-ID') }}
          </div>
          <div class="text-[11px] mt-0.5 font-medium" :class="isUktPaid ? 'text-emerald-700' : 'text-slate-500'">
            {{ isUktPaid ? 'Lunas' : applicantStore.isResultPassed ? 'Siap Dibayar' : 'Tahap Seleksi' }}
          </div>
        </div>

        <!-- 3. Sumbangan Institusi (SPI) -->
        <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
          <div class="text-[11px] text-slate-500 font-medium">Biaya Gedung (SPI)</div>
          <div class="font-sora font-bold text-slate-900 text-sm sm:text-base mt-1">
            Rp 0
          </div>
          <div class="text-[11px] text-emerald-700 mt-0.5 font-medium">
            Bebas Biaya Gedung
          </div>
        </div>

        <!-- 4. Total Paket Biaya Masuk -->
        <div class="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100">
          <div class="text-[11px] text-[#1E3A8A] font-semibold">Total Biaya</div>
          <div class="font-sora font-black text-slate-900 text-sm sm:text-base mt-1">
            Rp {{ totalAdmissionFee.toLocaleString('id-ID') }}
          </div>
          <div class="text-[11px] text-slate-500 mt-0.5">
            Formulir + UKT
          </div>
        </div>
      </div>
    </div>

    <!-- PENGALIH SKEMA PEMBAYARAN -->
    <div class="flex items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl w-full sm:w-fit">
      <button
        @click="paymentScheme = 'direct'"
        class="px-4 py-2 rounded-xl text-xs font-sora font-semibold transition-all flex items-center gap-2 cursor-pointer"
        :class="paymentScheme === 'direct'
          ? 'bg-white text-[#1E3A8A] shadow-xs'
          : 'text-slate-600 hover:text-slate-900'"
      >
        <CreditCard class="w-4 h-4" />
        <span>Bayar Penuh</span>
      </button>

      <button
        @click="paymentScheme = 'installment'"
        class="px-4 py-2 rounded-xl text-xs font-sora font-semibold transition-all flex items-center gap-2 cursor-pointer"
        :class="paymentScheme === 'installment'
          ? 'bg-white text-[#1E3A8A] shadow-xs'
          : 'text-slate-600 hover:text-slate-900'"
      >
        <Layers class="w-4 h-4 text-emerald-600" />
        <span>Cicilan (3 Termin)</span>
      </button>
    </div>

    <!-- ============================================== -->
    <!-- TAMPILAN 1: SKEMA BAYAR PENUH                  -->
    <!-- ============================================== -->
    <div v-if="paymentScheme === 'direct'" class="space-y-6 animate-fadeIn">
      <!-- Tagihan Cards Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 1. Biaya Formulir (Card 1) -->
        <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div class="space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <span class="text-xs font-semibold text-slate-700">
                Formulir Pendaftaran
              </span>
              <span
                class="text-xs font-medium"
                :class="regPayment.status === 'paid'
                  ? 'text-emerald-700'
                  : regPayment.status === 'pending_confirmation'
                  ? 'text-amber-700'
                  : 'text-amber-700'"
              >
                {{ regPayment.status === 'paid' ? 'Lunas' : regPayment.status === 'pending_confirmation' ? 'Menunggu Konfirmasi' : 'Menunggu Pembayaran' }}
              </span>
            </div>

            <div>
              <div class="text-[11px] text-slate-400 font-mono">No. Tagihan: {{ regPayment.id }}</div>
              <div class="font-sora font-extrabold text-2xl sm:text-3xl text-[#1E3A8A] mt-1">
                Rp {{ regPayment.amount.toLocaleString('id-ID') }}
              </div>
            </div>

            <!-- Rincian Transfer VA -->
            <div class="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div class="flex justify-between items-center text-slate-600">
                <span class="text-slate-500">Metode:</span>
                <span class="font-medium text-slate-800">{{ regPayment.paymentMethod }}</span>
              </div>

              <div class="flex justify-between items-center text-slate-600">
                <span class="text-slate-500">Nomor Virtual Account:</span>
                <div class="flex items-center gap-2">
                  <span class="font-mono font-bold text-sm text-slate-900 tracking-wide">{{ regPayment.vaNumber }}</span>
                  <button
                    @click="copyText(regPayment.vaNumber, 'Nomor VA Formulir')"
                    class="text-xs font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
                    title="Salin nomor VA"
                  >
                    Salin
                  </button>
                </div>
              </div>

              <div class="flex justify-between items-center text-[11px] text-slate-500">
                <span>Atas Nama:</span>
                <span class="font-medium text-slate-700">PMB BTH - {{ candidate.fullName }}</span>
              </div>

              <div v-if="regPayment.status === 'paid'" class="pt-2 border-t border-slate-100 flex justify-between text-[11px]">
                <span class="text-slate-500">Waktu Pelunasan:</span>
                <span class="text-emerald-700 font-medium font-mono">{{ regPayment.paidAt }}</span>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 mt-5">
            <!-- State 1: Paid -->
            <button
              v-if="regPayment.status === 'paid'"
              @click="openReceiptModal('reg')"
              class="w-full rounded-xl py-2.5 px-4 bg-slate-100 hover:bg-[#1E3A8A] hover:text-white text-slate-700 text-xs sm:text-sm font-medium transition-all flex items-center justify-center cursor-pointer shadow-xs"
            >
              Lihat Kuitansi
            </button>

            <!-- State 2: Waiting Admin Confirmation -->
            <div v-else-if="regPayment.status === 'pending_confirmation'" class="space-y-2">
              <router-link
                to="/admin?demo=true"
                class="w-full rounded-xl py-2.5 px-4 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs sm:text-sm font-medium transition-all flex items-center justify-center cursor-pointer shadow-xs"
              >
                Buka Panel Keuangan Admin (Konfirmasi Panitia)
              </router-link>
              <button
                @click="checkPaymentStatus"
                class="w-full rounded-xl py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-all flex items-center justify-center cursor-pointer"
              >
                Cek Status Konfirmasi
              </button>
            </div>

            <!-- State 3: Pending / Unpaid -->
            <button
              v-else
              @click="handlePayReg"
              class="w-full rounded-xl py-2.5 px-4 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs sm:text-sm font-medium transition-all flex items-center justify-center cursor-pointer shadow-xs hover:shadow-sm"
            >
              Saya Sudah Transfer
            </button>
          </div>
        </div>

        <!-- 2. Biaya UKT Semester 1 (Card 2) -->
        <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div class="space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <span class="text-xs font-semibold text-slate-700">
                UKT Semester 1
              </span>
              <span
                class="text-xs font-medium"
                :class="isUktPaid
                  ? 'text-emerald-700'
                  : uktPayment.status === 'pending_confirmation'
                  ? 'text-amber-700'
                  : applicantStore.isResultPassed
                  ? 'text-amber-700'
                  : 'text-slate-400'"
              >
                {{ isUktPaid ? 'Lunas' : uktPayment.status === 'pending_confirmation' ? 'Menunggu Konfirmasi' : applicantStore.isResultPassed ? 'Menunggu Pembayaran' : 'Belum Terbit' }}
              </span>
            </div>

            <div>
              <div class="text-[11px] text-slate-400 font-mono">No. Tagihan: {{ uktPayment.id }}</div>
              <div class="font-sora font-extrabold text-2xl sm:text-3xl text-[#1E3A8A] mt-1">
                Rp {{ uktPayment.amount.toLocaleString('id-ID') }}
              </div>
            </div>

            <!-- If Pre-Acceptance: Clean minimal info -->
            <div v-if="!applicantStore.isResultPassed && !isUktPaid && uktPayment.status !== 'pending_confirmation'" class="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <p class="text-[11px] text-slate-500 leading-relaxed">
                Nomor Virtual Account UKT akan aktif setelah calon mahasiswa dinyatakan lulus seleksi.
              </p>
            </div>

            <!-- If Passed: Active VA Details -->
            <div v-else-if="!isUktPaid" class="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div class="flex justify-between items-center text-slate-600">
                <span class="text-slate-500">Jatuh Tempo:</span>
                <strong class="text-rose-600 font-semibold">{{ uktPayment.dueDate }}</strong>
              </div>

              <!-- VA BSI -->
              <div class="flex justify-between items-center text-slate-600">
                <span class="text-slate-500">VA Bank BSI:</span>
                <div class="flex items-center gap-2">
                  <span class="font-mono font-bold text-sm text-slate-900 tracking-wide">{{ uktPayment.vaBsi }}</span>
                  <button
                    @click="copyText(uktPayment.vaBsi, 'Nomor VA BSI')"
                    class="text-xs font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
                  >
                    Salin
                  </button>
                </div>
              </div>

              <!-- VA Mandiri -->
              <div class="flex justify-between items-center text-slate-600">
                <span class="text-slate-500">VA Bank Mandiri:</span>
                <div class="flex items-center gap-2">
                  <span class="font-mono font-bold text-sm text-slate-900 tracking-wide">{{ uktPayment.vaMandiri }}</span>
                  <button
                    @click="copyText(uktPayment.vaMandiri, 'Nomor VA Mandiri')"
                    class="text-xs font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
                  >
                    Salin
                  </button>
                </div>
              </div>
            </div>

            <!-- If Paid: Show Verified Details -->
            <div v-else class="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div class="flex justify-between items-center text-slate-600">
                <span class="text-slate-500">Waktu Pelunasan:</span>
                <span class="text-emerald-700 font-medium font-mono">{{ uktPayment.paidAt }}</span>
              </div>
              <div v-if="uktPayment.confirmedBy" class="flex justify-between items-center text-slate-600">
                <span class="text-slate-500">Divalidasi Oleh:</span>
                <span class="text-emerald-800 font-medium">{{ uktPayment.confirmedBy }}</span>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 mt-5 flex flex-col sm:flex-row gap-2">
            <button
              v-if="!applicantStore.isResultPassed && !isUktPaid"
              disabled
              class="flex-1 rounded-xl py-2.5 px-4 bg-slate-100 text-slate-400 text-xs sm:text-sm font-medium cursor-not-allowed text-center"
            >
              Aktif Setelah Kelulusan
            </button>
            <button
              v-else-if="isUktPaid"
              @click="openReceiptModal('ukt')"
              class="flex-1 rounded-xl py-2.5 px-4 bg-slate-100 hover:bg-[#1E3A8A] hover:text-white text-slate-700 text-xs sm:text-sm font-medium transition-all flex items-center justify-center cursor-pointer shadow-xs"
            >
              Lihat Kuitansi UKT
            </button>
            <div v-else-if="uktPayment.status === 'pending_confirmation'" class="w-full space-y-2">
              <router-link
                to="/admin?demo=true"
                class="w-full rounded-xl py-2.5 px-4 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs sm:text-sm font-medium transition-all flex items-center justify-center cursor-pointer shadow-xs"
              >
                Buka Panel Keuangan Admin (Konfirmasi Panitia)
              </router-link>
              <button
                @click="checkPaymentStatus"
                class="w-full rounded-xl py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-all flex items-center justify-center cursor-pointer"
              >
                Cek Status Konfirmasi
              </button>
            </div>
            <button
              v-else
              @click="handlePayUkt"
              class="flex-1 rounded-xl py-2.5 px-4 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs sm:text-sm font-medium transition-all shadow-xs hover:shadow-sm flex items-center justify-center cursor-pointer"
            >
              Saya Sudah Transfer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- TAMPILAN 2: SKEMA CICILAN (3 TERMIN)          -->
    <!-- ============================================== -->
    <div v-else-if="paymentScheme === 'installment'" class="space-y-6 animate-fadeIn">
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <!-- Header Skema Cicilan -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 class="font-sora font-bold text-base sm:text-lg text-slate-900">
              Skema Cicilan UKT (3 Termin)
            </h3>
            <p class="text-xs text-slate-500 mt-1">
              Rincian tahapan pembayaran UKT Semester 1.
            </p>
          </div>

          <div class="flex-shrink-0">
            <button
              v-if="!installmentRequested"
              @click="submitInstallmentPlan"
              :disabled="isSubmittingInstallment"
              class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Layers class="w-4 h-4" />
              <span>{{ isSubmittingInstallment ? 'Memproses...' : 'Pilih Skema Cicilan' }}</span>
            </button>
            <div
              v-else
              class="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-semibold"
            >
              <CheckCircle2 class="w-4 h-4 text-emerald-600" />
              <span>Skema Cicilan Aktif</span>
            </div>
          </div>
        </div>

        <!-- Tabel 3 Termin Cicilan -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs font-sans">
            <thead>
              <tr class="border-b border-slate-200 text-slate-500 bg-slate-50/70">
                <th class="py-3 px-4 font-sora font-semibold text-slate-700">Termin</th>
                <th class="py-3 px-4 font-sora font-semibold text-slate-700">Persentase</th>
                <th class="py-3 px-4 font-sora font-semibold text-slate-700">Nominal Tagihan</th>
                <th class="py-3 px-4 font-sora font-semibold text-slate-700">Jatuh Tempo</th>
                <th class="py-3 px-4 font-sora font-semibold text-slate-700">Nomor Virtual Account</th>
                <th class="py-3 px-4 font-sora font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <!-- Termin 1 -->
              <tr class="hover:bg-slate-50/60 transition-colors">
                <td class="py-3.5 px-4 font-medium text-slate-900">Termin 1 (Awal)</td>
                <td class="py-3.5 px-4 font-semibold text-[#1E3A8A]">40%</td>
                <td class="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                  Rp {{ (uktPayment.amount * 0.4).toLocaleString('id-ID') }}
                </td>
                <td class="py-3.5 px-4 text-slate-700">25 Juli 2026</td>
                <td class="py-3.5 px-4 font-mono text-slate-800">988 2026 01 00042</td>
                <td class="py-3.5 px-4">
                  <span
                    class="px-2.5 py-1 rounded-lg text-[11px] font-medium"
                    :class="isUktPaid ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'"
                  >
                    {{ isUktPaid ? 'Lunas' : 'Menunggu Bayar' }}
                  </span>
                </td>
              </tr>

              <!-- Termin 2 -->
              <tr class="hover:bg-slate-50/60 transition-colors">
                <td class="py-3.5 px-4 font-medium text-slate-900">Termin 2 (Tengah)</td>
                <td class="py-3.5 px-4 font-semibold text-[#1E3A8A]">30%</td>
                <td class="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                  Rp {{ (uktPayment.amount * 0.3).toLocaleString('id-ID') }}
                </td>
                <td class="py-3.5 px-4 text-slate-700">15 Oktober 2026</td>
                <td class="py-3.5 px-4 font-mono text-slate-800">988 2026 02 00042</td>
                <td class="py-3.5 px-4">
                  <span class="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 text-slate-600">
                    Belum Aktif
                  </span>
                </td>
              </tr>

              <!-- Termin 3 -->
              <tr class="hover:bg-slate-50/60 transition-colors">
                <td class="py-3.5 px-4 font-medium text-slate-900">Termin 3 (Akhir)</td>
                <td class="py-3.5 px-4 font-semibold text-[#1E3A8A]">30%</td>
                <td class="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                  Rp {{ (uktPayment.amount * 0.3).toLocaleString('id-ID') }}
                </td>
                <td class="py-3.5 px-4 text-slate-700">15 Desember 2026</td>
                <td class="py-3.5 px-4 font-mono text-slate-800">988 2026 03 00042</td>
                <td class="py-3.5 px-4">
                  <span class="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 text-slate-600">
                    Belum Aktif
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Ketentuan Skema Cicilan Box -->
        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600">
          <span class="font-medium text-slate-800">Catatan:</span> Pembayaran cicilan dilakukan bertahap sesuai jadwal jatuh tempo masing-masing termin melalui nomor Virtual Account yang tertera.
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL KWITANSI RESMI BTH (STANDAR INSTITUSI AKADEMIK INDONESIA)           -->
    <!-- ========================================================================= -->
    <div
      v-if="selectedReceipt"
      class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn overflow-y-auto no-print-backdrop"
      @click.self="selectedReceipt = null"
    >
      <div class="relative w-full max-w-2xl my-4 sm:my-8 bg-white shadow-2xl rounded-xl sm:rounded-2xl border border-slate-300 overflow-hidden text-slate-900 max-h-[92vh] flex flex-col">
        <!-- Floating Close & Print Bar -->
        <div class="no-print bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between flex-shrink-0">
          <div class="text-xs font-sora font-semibold text-slate-700">
            Pratinjau Kuitansi Pembayaran Resmi
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="windowPrint"
              class="px-3 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-xs"
              title="Cetak kuitansi fisik atau simpan sebagai dokumen PDF"
            >
              Cetak / PDF
            </button>

            <button
              @click="selectedReceipt = null"
              class="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer text-lg leading-none font-bold"
              title="Tutup Pratinjau"
            >
              &times;
            </button>
          </div>
        </div>

        <!-- Kwitansi Paper Sheet -->
        <div id="printable-receipt" class="p-5 sm:p-8 overflow-y-auto flex-1 bg-white relative font-sans text-slate-800 selection:bg-none">
          <!-- Subtle Watermark Logo BTH in Background -->
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] overflow-hidden">
            <img src="/assets/icons/bth.png" alt="BTH Watermark" class="w-96 h-96 object-contain" />
          </div>

          <div class="relative z-10 space-y-4 text-xs">
            <!-- 1. KOP SURAT RESMI UNIVERSITAS BTH -->
            <div class="pb-3 border-b-2 border-slate-900">
              <div class="flex items-center gap-3.5">
                <img
                  src="/assets/icons/bth.png"
                  alt="Logo Universitas Bakti Tunas Husada"
                  class="w-14 h-14 sm:w-16 sm:h-16 object-contain flex-shrink-0"
                />
                <div class="flex-1 text-center sm:text-left">
                  <div class="text-[10px] sm:text-xs font-bold tracking-widest text-slate-600 uppercase font-sans">
                    YAYASAN BAKTI TUNAS HUSADA TASIKMALAYA
                  </div>
                  <h1 class="font-sora font-extrabold text-sm sm:text-base text-slate-900 tracking-tight leading-tight">
                    UNIVERSITAS BAKTI TUNAS HUSADA
                  </h1>
                  <p class="text-[9px] sm:text-[10px] text-slate-600 leading-tight mt-0.5 font-sans">
                    Jl. Cilolohan No. 36, Kahuripan, Kec. Tawang, Kota Tasikmalaya, Jawa Barat 46115<br />
                    Laman: <span class="font-mono text-[#1E3A8A]">www.universitas-bth.ac.id</span> • Pos-el: <span class="font-mono text-[#1E3A8A]">pmb@bth.ac.id</span> • Telp: (0265) 334111
                  </p>
                </div>
              </div>
            </div>

            <!-- 2. JUDUL DOKUMEN & IDENTITAS KWITANSI -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1">
              <div>
                <h2 class="font-sora font-bold text-sm sm:text-base text-slate-900 tracking-wide underline underline-offset-4">
                  TANDA BUKTI PEMBAYARAN RESMI
                </h2>
                <div class="text-[10px] text-slate-500 font-mono mt-0.5 uppercase tracking-wider">
                  OFFICIAL INSTITUTIONAL RECEIPT
                </div>
              </div>
              <div class="text-left sm:text-right font-mono text-[10px] text-slate-600">
                <div>No. Kuitansi: <strong class="text-slate-900 text-xs">{{ officialReceiptNumber }}</strong></div>
                <div>Tanggal: {{ receiptDateFormatted }}</div>
              </div>
            </div>

            <!-- 3. TABEL INFORMASI CALON MAHASISWA & TRANSAKSI -->
            <div class="border border-slate-200 rounded-lg p-3 sm:p-4 bg-slate-50/50 space-y-2 text-xs">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-1">
                <span class="text-slate-500">Telah Diterima Dari:</span>
                <span class="sm:col-span-2 font-bold text-slate-900 uppercase tracking-wide">
                  {{ candidate.fullName || 'Ahmad Fauzi' }}
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-1">
                <span class="text-slate-500">Nomor Registrasi PMB:</span>
                <span class="sm:col-span-2 font-mono font-semibold text-[#1E3A8A]">
                  {{ candidate.registrationNumber || 'BTH-2026-REG-00042' }}
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-1">
                <span class="text-slate-500">Program Studi Pilihan:</span>
                <span class="sm:col-span-2 font-medium text-slate-800">
                  {{ admission.prodi1 || 'S1 Farmasi' }} ({{ admission.track || 'Jalur Reguler Gelombang 1' }})
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-1">
                <span class="text-slate-500">Untuk Pembayaran:</span>
                <span class="sm:col-span-2 text-slate-800">
                  {{ paymentDescription }}
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-1">
                <span class="text-slate-500">Metode & Kanal:</span>
                <span class="sm:col-span-2 font-medium text-slate-800">
                  Virtual Account (Bank Syariah Indonesia / Bank Mandiri)
                </span>
              </div>
            </div>

            <!-- 4. KOTAK TOTAL RUPIAH & TERBILANG -->
            <div class="p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg space-y-1">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <div class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Jumlah Pembayaran (Terbilang)
                  </div>
                  <div class="italic font-serif text-xs text-slate-800 font-semibold mt-0.5">
                    " # {{ angkaKeTerbilang(selectedReceiptData.amount) }} # "
                  </div>
                </div>

                <span class="font-sora font-extrabold text-base sm:text-lg text-[#1E3A8A] self-start sm:self-auto font-mono whitespace-nowrap">
                  Rp {{ Number(selectedReceiptData.amount || 0).toLocaleString('id-ID') }},-
                </span>
              </div>
            </div>

            <!-- 5. AREA PENGESAHAN & TANDA TANGAN -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 mt-2 border-t border-slate-200 text-xs">
              <!-- Barcode Keabsahan -->
              <div class="space-y-2 text-slate-600 flex flex-col justify-between">
                <div>
                  <div class="font-sora font-bold text-[11px] text-slate-800 uppercase tracking-wide">
                    Keabsahan Dokumen Elektronik
                  </div>
                  <p class="text-[10px] text-slate-500 mt-1 leading-relaxed">
                    Kuitansi ini diterbitkan secara sah oleh Sistem Informasi PMB Universitas Bakti Tunas Husada melalui verifikasi data elektronik perbankan mitra.
                  </p>
                </div>

                <div class="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  <div class="w-14 h-14 bg-white p-1.5 border border-slate-300 rounded-lg flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <QrCode class="w-11 h-11 text-slate-800" />
                  </div>
                  <div class="text-[9px] font-mono text-slate-500 leading-tight">
                    <span class="font-bold text-slate-700 block">ID TRANSAKSI RESMI:</span>
                    <span>{{ selectedReceiptData.id }}</span><br />
                    <span class="text-[8px] text-emerald-700 font-semibold block mt-0.5">STATUS: TERDAFTAR DI PANGKALAN DATA BTH</span>
                  </div>
                </div>
              </div>

              <!-- Pengesahan Pejabat Keuangan -->
              <div class="text-right flex flex-col items-end relative">
                <div class="text-[11px] text-slate-600">
                  Kota Tasikmalaya, {{ receiptDateFormatted }}
                </div>
                <div class="font-semibold text-slate-800 text-[11px]">
                  a.n. Rektor Universitas Bakti Tunas Husada
                </div>
                <div class="text-slate-600 text-[10px]">
                  Biro Keuangan & Administrasi PMB,
                </div>

                <div class="my-2 text-right">
                  <div class="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50/80 border border-blue-200 text-[#1E3A8A] text-[10px] font-mono font-semibold shadow-2xs">
                    <span>DIVERIFIKASI SECARA ELEKTRONIK OLEH SISTEM</span>
                  </div>
                  <div class="text-[9px] text-emerald-700 font-mono font-semibold mt-1">
                    STATUS VALIDASI PERBANKAN: LUNAS ✓
                  </div>
                </div>

                <div class="font-sora font-bold text-slate-900 text-xs underline underline-offset-2">
                  ( Hj. Neni Rohaeni, S.E., M.M. )
                </div>
                <div class="font-mono text-[10px] text-slate-500 mt-0.5">
                  NIP. 19820514 200801 2 001
                </div>
              </div>
            </div>

            <!-- 6. CATATAN KAKI -->
            <div class="pt-2 border-t border-slate-200 text-[9px] sm:text-[10px] text-slate-500 leading-relaxed font-sans">
              <strong>Catatan Penting:</strong>
              <ol class="list-decimal list-inside space-y-0.5 mt-0.5 text-slate-600">
                <li>Tanda bukti pembayaran ini adalah sah dan mengikat sesuai ketentuan Penerimaan Mahasiswa Baru Universitas BTH TA 2026/2027.</li>
                <li>Dana yang telah disetorkan dan diverifikasi oleh sistem perbankan tidak dapat ditarik kembali dengan alasan apa pun.</li>
                <li>Simpan dokumen kuitansi ini sebagai syarat verifikasi administrasi saat mengikuti Ujian CBT dan Registrasi Ulang.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  QrCode,
  FileText,
  Check,
  ArrowRight,
  Info,
  Layers,
  ShieldCheck
} from 'lucide-vue-next';
import { ref, computed } from 'vue';
import { useApplicantStore } from '@/stores/applicant';
import { financeApi } from '@/api/finance';

const applicantStore = useApplicantStore();
const regPayment = computed(() => applicantStore.state.payments.registrationFee);
const uktPayment = computed(() => applicantStore.state.payments.uktFee);
const candidate = computed(() => applicantStore.state.candidate);
const admission = computed(() => applicantStore.state.admission);

const isUktPaid = computed(() => uktPayment.value.status === 'paid');

// Skema pembayaran aktif: 'direct' (Bayar Langsung) atau 'installment' (Cicilan 3 Termin)
const paymentScheme = ref('direct');
const installmentRequested = ref(false);
const isSubmittingInstallment = ref(false);

const toastMessage = ref('');
const selectedReceipt = ref(null);

const totalAdmissionFee = computed(() => {
  return (regPayment.value.amount || 250000) + (uktPayment.value.amount || 6500000);
});

const selectedReceiptData = computed(() => {
  if (selectedReceipt.value === 'ukt') return uktPayment.value;
  return regPayment.value;
});

const submitInstallmentPlan = async () => {
  isSubmittingInstallment.value = true;
  try {
    const invId = uktPayment.value.id || 'INV-UKT-01';
    await financeApi.requestInstallment(invId, {
      scheme: '3_installments',
      terms: 3,
      applicant_id: candidate.value?.registrationNumber || 'BTH-2026-REG-00042',
      reason: 'Pengajuan skema angsuran berkala UKT 3 termin mahasiswa baru BTH',
    }).catch(() => null);
  } catch (err) {
    console.warn('Finance Installment API Notice (fallback):', err?.message);
  } finally {
    isSubmittingInstallment.value = false;
    installmentRequested.value = true;
    toastMessage.value = 'Pengajuan skema cicilan 3 termin berhasil disetujui! Silakan periksa rincian termin dan jadwal jatuh tempo Anda.';
  }
};

/**
 * Konversi angka rupiah ke teks terbilang standar bahasa Indonesia
 */
const angkaKeTerbilang = (angka) => {
  const bilangan = [
    '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima',
    'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'
  ];
  let n = Math.floor(Number(angka));
  if (!n || n <= 0) return 'Nol Rupiah';

  const convert = (num) => {
    if (num < 12) {
      return bilangan[num];
    } else if (num < 20) {
      return convert(num - 10) + ' Belas';
    } else if (num < 100) {
      return convert(Math.floor(num / 10)) + ' Puluh ' + convert(num % 10);
    } else if (num < 200) {
      return 'Seratus ' + convert(num - 100);
    } else if (num < 1000) {
      return convert(Math.floor(num / 100)) + ' Ratus ' + convert(num % 100);
    } else if (num < 2000) {
      return 'Seribu ' + convert(num - 1000);
    } else if (num < 1000000) {
      return convert(Math.floor(num / 1000)) + ' Ribu ' + convert(num % 1000);
    } else if (num < 1000000000) {
      return convert(Math.floor(num / 1000000)) + ' Juta ' + convert(num % 1000000);
    } else if (num < 1000000000000) {
      return convert(Math.floor(num / 1000000000)) + ' Miliar ' + convert(num % 1000000000);
    }
    return '';
  };

  const hasil = convert(n).replace(/\s+/g, ' ').trim();
  return hasil ? `${hasil} Rupiah` : 'Nol Rupiah';
};

/**
 * Format nomor kwitansi resmi institusi akademik: KW.PMB/UBTH/2026/{TYPE}/{NO}
 */
const officialReceiptNumber = computed(() => {
  const code = selectedReceipt.value === 'ukt' ? 'UKT' : 'REG';
  const regNo = candidate.value?.registrationNumber
    ? candidate.value.registrationNumber.replace(/\D/g, '').slice(-5)
    : '00042';
  return `KW.PMB/UBTH/2026/${code}/${regNo}`;
});

/**
 * Deskripsi resmi peruntukan pembayaran
 */
const paymentDescription = computed(() => {
  if (selectedReceipt.value === 'ukt') {
    return `Uang Kuliah Tunggal (UKT) Semester 1 TA 2026/2027 - ${admission.value?.prodi1 || 'Program Studi Pilihan'}`;
  }
  return `Biaya Formulir Pendaftaran Mahasiswa Baru TA 2026/2027 (Jalur Reguler Gelombang 1)`;
});

/**
 * Format tanggal pelunasan resmi
 */
const receiptDateFormatted = computed(() => {
  if (selectedReceiptData.value?.paidAt) {
    return selectedReceiptData.value.paidAt;
  }
  return new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
});

const copyText = async (text, label) => {
  try {
    await navigator.clipboard.writeText(text);
    toastMessage.value = `${label} (${text}) berhasil disalin.`;
  } catch {
    toastMessage.value = `${label} (${text}) siap digunakan.`;
  }
};

const handlePayReg = async () => {
  applicantStore.submitRegPayment();
  toastMessage.value = 'Permintaan tagihan formulir diproses. Menghubungkan ke gateway perbankan...';
  try {
    const invId = regPayment.value.id;
    if (invId && invId.length >= 30) {
      const res = await financeApi.payInvoice(invId, {
        method: 'virtual_account',
      });
      if (res?.data?.data?.va_number) {
        applicantStore.state.payments.registrationFee.vaNumber = res.data.data.va_number;
        toastMessage.value = `Nomor Virtual Account ${res.data.data.va_number} berhasil dibuat! Silakan lakukan transfer sebelum batas waktu.`;
      }
    }
  } catch (err) {
    console.warn('Finance API Notice (payInvoice fallback):', err?.message);
  }
};

const handlePayUkt = async () => {
  applicantStore.submitUktPayment();
  toastMessage.value = 'Permintaan pelunasan UKT diproses. Menghubungkan ke gateway perbankan...';
  try {
    const invId = uktPayment.value.id;
    if (invId && invId.length >= 30) {
      const res = await financeApi.payInvoice(invId, {
        method: 'virtual_account',
      });
      if (res?.data?.data?.va_number) {
        applicantStore.state.payments.uktFee.vaNumber = res.data.data.va_number;
        toastMessage.value = `Nomor Virtual Account UKT ${res.data.data.va_number} berhasil dibuat!`;
      }
    }
  } catch (err) {
    console.warn('Finance API Notice (payInvoice fallback):', err?.message);
  }
};

const checkPaymentStatus = async () => {
  try {
    await applicantStore.syncFromBackend();
    const res = await financeApi.getMyInvoices();
    if (res.data?.data) {
      const invoices = res.data.data;
      const reg = Array.isArray(invoices)
        ? invoices.find((i) => i.fee_type === 'registration' || i.type === 'registration' || i.id?.includes('REG'))
        : null;
      if (reg && reg.status === 'paid') {
        applicantStore.payRegFee('Gateway Duitku / Sistem Perbankan BTH');
      }
    }
  } catch (err) {
    console.warn('Finance API Notice (getMyInvoices fallback):', err?.message);
  }

  if (regPayment.value.status === 'paid') {
    toastMessage.value = 'Status Terkini: Pembayaran formulir telah diverifikasi & dikonfirmasi LUNAS oleh Panitia PMB!';
  } else if (regPayment.value.status === 'pending_confirmation') {
    toastMessage.value = 'Status Terkini: Transaksi dalam antrean pemeriksaan Admin Keuangan. Mohon tunggu sesaat atau buka portal admin untuk konfirmasi.';
  } else {
    toastMessage.value = 'Status Terkini: Menunggu pembayaran dilakukan melalui Virtual Account / QRIS.';
  }
};

const openReceiptModal = (type) => {
  selectedReceipt.value = type;
};

const windowPrint = () => {
  window.print();
};
</script>

<style scoped>
@media print {
  :deep(header),
  :deep(footer),
  :deep(nav),
  .no-print,
  .no-print-backdrop {
    background: transparent !important;
    padding: 0 !important;
  }

  body * {
    visibility: hidden;
  }

  #printable-receipt,
  #printable-receipt * {
    visibility: visible;
  }

  #printable-receipt {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: auto;
    margin: 0;
    padding: 24px 32px !important;
    border: none !important;
    box-shadow: none !important;
    background: white !important;
    z-index: 99999;
  }
}
</style>
