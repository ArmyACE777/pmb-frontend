<template>
  <div class="space-y-6">
    <!-- Header Modul Keuangan PMB -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900">
          Biaya Pendaftaran & Tagihan Keuangan
        </h2>
        <p class="text-xs text-slate-500 mt-0.5 font-sans">
          Kelola rincian tagihan, lakukan pembayaran melalui payment gateway terpadu, dan pantau status kelulusan transaksi.
        </p>
      </div>
      <div class="text-xs text-slate-500 font-sans self-start sm:self-auto flex items-center gap-2">
        <span>Status Tagihan:</span>
        <span
          class="font-semibold px-2.5 py-0.5 rounded-full text-[11px]"
          :class="applicantStore.isRegPaymentComplete
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : regPayment.status === 'pending_confirmation'
            ? 'bg-amber-50 text-amber-800 border border-amber-200'
            : 'bg-blue-50 text-[#1E3A8A] border border-blue-200'"
        >
          {{ applicantStore.isRegPaymentComplete ? 'Formulir Lunas' : regPayment.status === 'pending_confirmation' ? 'Menunggu Konfirmasi' : 'Menunggu Pembayaran' }}
        </span>
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
      <button @click="toastMessage = ''" class="text-emerald-600 hover:text-emerald-900 font-bold text-base leading-none cursor-pointer">&times;</button>
    </div>

    <!-- ========================================================================= -->
    <!-- 3 BUTTON ACTIVE PEMBAYARAN (3 Halaman: Detail, Pembayaran, Status)        -->
    <!-- ========================================================================= -->
    <div class="bg-white p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <!-- Button 1: Detail -->
        <button
          @click="paymentStep = 'detail'"
          class="flex items-center gap-3 p-3 rounded-xl sm:rounded-2xl transition-all cursor-pointer text-left border"
          :class="paymentStep === 'detail'
            ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs ring-2 ring-blue-100'
            : 'bg-slate-50/70 hover:bg-slate-100 text-slate-700 border-slate-200/60'"
        >
          <div
            class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0"
            :class="paymentStep === 'detail' ? 'bg-white/20 text-white' : 'bg-blue-50 text-[#1E3A8A]'"
          >
            <FileText class="w-4 h-4" />
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-xs sm:text-sm font-sora font-bold leading-tight">Detail</div>
            <div
              class="text-[10px] truncate mt-0.5 font-sans"
              :class="paymentStep === 'detail' ? 'text-blue-100' : 'text-slate-400'"
            >
              Rincian Biaya & Skema
            </div>
          </div>
        </button>

        <!-- Button 2: Pembayaran yang pakai Payment gateway -->
        <button
          @click="paymentStep = 'gateway'"
          class="flex items-center gap-3 p-3 rounded-xl sm:rounded-2xl transition-all cursor-pointer text-left border"
          :class="paymentStep === 'gateway'
            ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs ring-2 ring-blue-100'
            : 'bg-slate-50/70 hover:bg-slate-100 text-slate-700 border-slate-200/60'"
        >
          <div
            class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0"
            :class="paymentStep === 'gateway' ? 'bg-white/20 text-white' : 'bg-blue-50 text-[#1E3A8A]'"
          >
            <CreditCard class="w-4 h-4" />
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-xs sm:text-sm font-sora font-bold leading-tight">Pembayaran Gateway</div>
            <div
              class="text-[10px] truncate mt-0.5 font-sans"
              :class="paymentStep === 'gateway' ? 'text-blue-100' : 'text-slate-400'"
            >
              Kanal VA, QRIS & E-Wallet
            </div>
          </div>
        </button>

        <!-- Button 3: Status Pembayaran -->
        <button
          @click="paymentStep = 'status'"
          class="flex items-center gap-3 p-3 rounded-xl sm:rounded-2xl transition-all cursor-pointer text-left border"
          :class="paymentStep === 'status'
            ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs ring-2 ring-blue-100'
            : 'bg-slate-50/70 hover:bg-slate-100 text-slate-700 border-slate-200/60'"
        >
          <div
            class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0"
            :class="paymentStep === 'status' ? 'bg-white/20 text-white' : 'bg-blue-50 text-[#1E3A8A]'"
          >
            <CheckCircle2 v-if="applicantStore.isRegPaymentComplete" class="w-4 h-4 text-emerald-400" />
            <Clock v-else class="w-4 h-4" />
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-xs sm:text-sm font-sora font-bold leading-tight flex items-center gap-1.5">
              <span>Status Pembayaran</span>
              <span
                v-if="applicantStore.isRegPaymentComplete"
                class="px-1.5 py-0.2 rounded-full text-[9px] font-bold"
                :class="paymentStep === 'status' ? 'bg-emerald-400 text-slate-900' : 'bg-emerald-100 text-emerald-800'"
              >
                Lunas
              </span>
            </div>
            <div
              class="text-[10px] truncate mt-0.5 font-sans"
              :class="paymentStep === 'status' ? 'text-blue-100' : 'text-slate-400'"
            >
              Riwayat & Kuitansi Resmi
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- HALAMAN 1: DETAIL (Rincian Biaya & Tagihan)                               -->
    <!-- ========================================================================= -->
    <div v-if="paymentStep === 'detail'" class="space-y-6 animate-fadeIn">
      <!-- Summary Bar Rincian Biaya -->
      <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
              Rincian Biaya Perkuliahan Mahasiswa Baru
            </h3>
            <p class="text-xs text-slate-500 mt-0.5 font-sans">
              Tahun Akademik {{ admission?.academicYear || '2026/2027' }} • {{ admission?.track || 'Jalur Reguler Gelombang 1' }}
            </p>
          </div>
          <span class="text-xs font-semibold text-[#1E3A8A] bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 self-start sm:self-auto font-sans">
            {{ admission?.prodi1 || 'S1 Farmasi' }}
          </span>
        </div>

        <!-- 4 Kolom Rincian Biaya -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs font-sans">
          <!-- 1. Formulir -->
          <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <div class="text-[11px] text-slate-500 font-medium">1. Formulir Pendaftaran</div>
            <div class="font-sora font-bold text-slate-900 text-sm sm:text-base mt-1">
              Rp {{ regPayment.amount.toLocaleString('id-ID') }}
            </div>
            <div class="text-[11px] mt-0.5 font-medium" :class="regPayment.status === 'paid' ? 'text-emerald-700' : 'text-amber-700'">
              {{ regPayment.status === 'paid' ? '✓ Lunas' : 'Menunggu Bayar' }}
            </div>
          </div>

          <!-- 2. UKT Semester 1 -->
          <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <div class="text-[11px] text-slate-500 font-medium">2. UKT Semester 1</div>
            <div class="font-sora font-bold text-[#1E3A8A] text-sm sm:text-base mt-1">
              Rp {{ uktPayment.amount.toLocaleString('id-ID') }}
            </div>
            <div class="text-[11px] mt-0.5 font-medium" :class="isUktPaid ? 'text-emerald-700' : 'text-slate-500'">
              {{ isUktPaid ? '✓ Lunas' : applicantStore.isResultPassed ? 'Siap Dibayar' : 'Tahap Seleksi' }}
            </div>
          </div>

          <!-- 3. Sumbangan Pengembangan Institusi (SPI) -->
          <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <div class="text-[11px] text-slate-500 font-medium">3. Uang Gedung / SPI</div>
            <div class="font-sora font-bold text-slate-900 text-sm sm:text-base mt-1">
              Rp 0
            </div>
            <div class="text-[11px] text-emerald-700 mt-0.5 font-medium">
              Bebas Biaya Gedung
            </div>
          </div>

          <!-- 4. Total Paket Biaya Masuk -->
          <div class="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100">
            <div class="text-[11px] text-[#1E3A8A] font-semibold">Total Biaya Masuk</div>
            <div class="font-sora font-black text-slate-900 text-sm sm:text-base mt-1">
              Rp {{ totalAdmissionFee.toLocaleString('id-ID') }}
            </div>
            <div class="text-[11px] text-slate-500 mt-0.5">
              Formulir + UKT Smt 1
            </div>
          </div>
        </div>
      </div>

      <!-- Pemilihan Skema Pembayaran UKT -->
      <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
              Opsi Skema Pembayaran UKT Semester 1
            </h3>
            <p class="text-xs text-slate-500 mt-0.5 font-sans">
              Pilih fleksibilitas pembayaran penuh atau cicilan bertahap 3 kali termin tanpa bunga.
            </p>
          </div>

          <!-- Toggle Skema -->
          <div class="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              @click="paymentScheme = 'direct'"
              class="px-3.5 py-1.5 rounded-lg text-xs font-sora font-semibold transition-all cursor-pointer"
              :class="paymentScheme === 'direct'
                ? 'bg-white text-[#1E3A8A] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'"
            >
              Bayar Penuh
            </button>
            <button
              @click="paymentScheme = 'installment'"
              class="px-3.5 py-1.5 rounded-lg text-xs font-sora font-semibold transition-all cursor-pointer flex items-center gap-1"
              :class="paymentScheme === 'installment'
                ? 'bg-white text-[#1E3A8A] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'"
            >
              <Layers class="w-3.5 h-3.5 text-emerald-600" />
              <span>Cicilan (3 Termin)</span>
            </button>
          </div>
        </div>

        <!-- Detail Skema Bayar Penuh -->
        <div v-if="paymentScheme === 'direct'" class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div class="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
            <div class="font-sora font-bold text-slate-900 text-sm">Keuntungan Bayar Penuh</div>
            <p class="text-slate-600 leading-relaxed text-xs">
              Pelunasan 100% langsung memverifikasi status registrasi ulang, penerbitan Nomor Induk Mahasiswa (NIM), dan plotting gugus PKKMB secara otomatis.
            </p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div class="text-slate-500">Nominal Pelunasan Langsung:</div>
            <div class="font-sora font-extrabold text-xl text-[#1E3A8A]">
              Rp {{ uktPayment.amount.toLocaleString('id-ID') }}
            </div>
            <div class="text-[11px] text-slate-400">Jatuh Tempo: {{ uktPayment.dueDate || '25 Juli 2026' }}</div>
          </div>
        </div>

        <!-- Detail Skema Cicilan (3 Termin) -->
        <div v-else class="space-y-4">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs font-sans">
              <thead>
                <tr class="border-b border-slate-200 text-slate-500 bg-slate-50/70">
                  <th class="py-2.5 px-3 font-sora font-semibold text-slate-700">Termin</th>
                  <th class="py-2.5 px-3 font-sora font-semibold text-slate-700">Porsi</th>
                  <th class="py-2.5 px-3 font-sora font-semibold text-slate-700">Nominal</th>
                  <th class="py-2.5 px-3 font-sora font-semibold text-slate-700">Jatuh Tempo</th>
                  <th class="py-2.5 px-3 font-sora font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td class="py-2.5 px-3 font-medium text-slate-900">Termin 1 (Awal)</td>
                  <td class="py-2.5 px-3 font-semibold text-[#1E3A8A]">40%</td>
                  <td class="py-2.5 px-3 font-mono font-bold text-slate-900">Rp {{ (uktPayment.amount * 0.4).toLocaleString('id-ID') }}</td>
                  <td class="py-2.5 px-3">25 Juli 2026</td>
                  <td class="py-2.5 px-3">
                    <span class="px-2 py-0.5 rounded text-[10px] font-semibold" :class="isUktPaid ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'">
                      {{ isUktPaid ? 'Lunas' : 'Menunggu Bayar' }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="py-2.5 px-3 font-medium text-slate-900">Termin 2 (Tengah)</td>
                  <td class="py-2.5 px-3 font-semibold text-[#1E3A8A]">30%</td>
                  <td class="py-2.5 px-3 font-mono font-bold text-slate-900">Rp {{ (uktPayment.amount * 0.3).toLocaleString('id-ID') }}</td>
                  <td class="py-2.5 px-3">15 Oktober 2026</td>
                  <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-500">Belum Aktif</span></td>
                </tr>
                <tr>
                  <td class="py-2.5 px-3 font-medium text-slate-900">Termin 3 (Akhir)</td>
                  <td class="py-2.5 px-3 font-semibold text-[#1E3A8A]">30%</td>
                  <td class="py-2.5 px-3 font-mono font-bold text-slate-900">Rp {{ (uktPayment.amount * 0.3).toLocaleString('id-ID') }}</td>
                  <td class="py-2.5 px-3">15 Desember 2026</td>
                  <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-500">Belum Aktif</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="flex items-center justify-between pt-2">
            <span class="text-[11px] text-slate-500">Skema cicilan resmi difasilitasi Biro Keuangan Universitas BTH tanpa biaya tambahan.</span>
            <button
              v-if="!installmentRequested"
              @click="submitInstallmentPlan"
              :disabled="isSubmittingInstallment"
              class="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              {{ isSubmittingInstallment ? 'Memproses...' : 'Terapkan Skema Cicilan' }}
            </button>
            <span v-else class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
              ✓ Skema Cicilan Aktif
            </span>
          </div>
        </div>
      </div>

      <!-- Kebijakan Transparansi & Fasilitas PMB BTH -->
      <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
        <h3 class="font-sora font-bold text-slate-900 text-sm">Fasilitas Termasuk dalam Biaya Masuk:</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-slate-600 font-sans">
          <div class="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl">
            <Check class="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Jas Almamater & Dasi Resmi BTH</span>
          </div>
          <div class="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl">
            <Check class="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Kartu Tanda Mahasiswa (KTM) BSI Smart</span>
          </div>
          <div class="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl">
            <Check class="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Biaya Orientasi PKKMB & Atribut</span>
          </div>
          <div class="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl">
            <Check class="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Akun SIAKAD & Microsoft 365 Kampus</span>
          </div>
          <div class="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl">
            <Check class="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Asuransi Mahasiswa Selama Perkuliahan</span>
          </div>
          <div class="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl">
            <Check class="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Praktikum Lab Farmasi & Kesehatan</span>
          </div>
        </div>

        <!-- Tombol Lanjut ke Halaman 2 (Pembayaran Gateway) -->
        <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="text-xs text-slate-500">
            Siap untuk menyelesaikan tagihan? Lanjutkan ke modul pembayaran gateway.
          </div>
          <button
            @click="paymentStep = 'gateway'"
            class="px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Lanjut ke Pembayaran Gateway</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- HALAMAN 2: PEMBAYARAN YANG PAKAI PAYMENT GATEWAY (Proses Checkout)        -->
    <!-- ========================================================================= -->
    <div v-else-if="paymentStep === 'gateway'" class="space-y-6 animate-fadeIn">
      <!-- 1. Pilihan Tagihan Yang Ingin Dibayar -->
      <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
              Pilih Item Tagihan yang Akan Dibayar
            </h3>
            <p class="text-xs text-slate-500 mt-0.5 font-sans">
              Pilih tagihan aktif yang ingin Anda selesaikan melalui Payment Gateway.
            </p>
          </div>
          <span class="text-xs text-slate-500 font-mono">No. Reg: {{ candidate.registrationNumber || 'BTH-2026-REG-00042' }}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Item 1: Formulir -->
          <div
            @click="selectedBillType = 'reg'"
            class="p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between gap-3"
            :class="selectedBillType === 'reg'
              ? 'border-[#1E3A8A] bg-blue-50/40 ring-2 ring-blue-100'
              : 'border-slate-200 bg-white hover:border-slate-300'"
          >
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <input type="radio" :checked="selectedBillType === 'reg'" class="accent-[#1E3A8A] cursor-pointer" />
                <span class="font-sora font-bold text-xs sm:text-sm text-slate-900">Biaya Formulir Pendaftaran</span>
              </div>
              <p class="text-[11px] text-slate-500 font-sans pl-5">Syarat utama mengikuti seleksi & aktivasi CBT</p>
              <div class="font-sora font-extrabold text-base sm:text-lg text-[#1E3A8A] pl-5 mt-1">
                Rp {{ regPayment.amount.toLocaleString('id-ID') }}
              </div>
            </div>
            <span
              class="px-2 py-0.5 rounded text-[10px] font-semibold"
              :class="regPayment.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'"
            >
              {{ regPayment.status === 'paid' ? '✓ Lunas' : 'Menunggu Bayar' }}
            </span>
          </div>

          <!-- Item 2: UKT Semester 1 -->
          <div
            @click="selectedBillType = 'ukt'"
            class="p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between gap-3"
            :class="selectedBillType === 'ukt'
              ? 'border-[#1E3A8A] bg-blue-50/40 ring-2 ring-blue-100'
              : 'border-slate-200 bg-white hover:border-slate-300'"
          >
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <input type="radio" :checked="selectedBillType === 'ukt'" class="accent-[#1E3A8A] cursor-pointer" />
                <span class="font-sora font-bold text-xs sm:text-sm text-slate-900">UKT Semester 1 (Daftar Ulang)</span>
              </div>
              <p class="text-[11px] text-slate-500 font-sans pl-5">{{ admission?.prodi1 || 'S1 Farmasi' }} • Gelombang 1</p>
              <div class="font-sora font-extrabold text-base sm:text-lg text-[#1E3A8A] pl-5 mt-1">
                Rp {{ uktPayment.amount.toLocaleString('id-ID') }}
              </div>
            </div>
            <span
              class="px-2 py-0.5 rounded text-[10px] font-semibold"
              :class="isUktPaid ? 'bg-emerald-50 text-emerald-700' : applicantStore.isResultPassed ? 'bg-amber-50 text-amber-800' : 'bg-slate-100 text-slate-500'"
            >
              {{ isUktPaid ? '✓ Lunas' : applicantStore.isResultPassed ? 'Siap Dibayar' : 'Tahap Seleksi' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 2. Pilihan Kanal Pembayaran Gateway -->
      <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
              Metode Pembayaran Payment Gateway
            </h3>
            <p class="text-xs text-slate-500 mt-0.5 font-sans">
              Terhubung langsung dengan Payment Gateway Terverifikasi (Duitku / Midtrans BTH) 24 Jam Otomatis.
            </p>
          </div>
          <div class="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-medium">
            <ShieldCheck class="w-4 h-4" />
            <span>Enkripsi Aman 256-bit</span>
          </div>
        </div>

        <!-- Category Tabs -->
        <div class="flex flex-wrap gap-2">
          <button
            @click="activeGatewayCategory = 'va'"
            class="px-3.5 py-2 rounded-xl text-xs font-semibold font-sora transition-all cursor-pointer border"
            :class="activeGatewayCategory === 'va'
              ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-2xs'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200/70'"
          >
            Virtual Account (VA) Bank
          </button>
          <button
            @click="activeGatewayCategory = 'qris'"
            class="px-3.5 py-2 rounded-xl text-xs font-semibold font-sora transition-all cursor-pointer border"
            :class="activeGatewayCategory === 'qris'
              ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-2xs'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200/70'"
          >
            QRIS Real-Time
          </button>
          <button
            @click="activeGatewayCategory = 'ewallet'"
            class="px-3.5 py-2 rounded-xl text-xs font-semibold font-sora transition-all cursor-pointer border"
            :class="activeGatewayCategory === 'ewallet'
              ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-2xs'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200/70'"
          >
            E-Wallet (GoPay/ShopeePay)
          </button>
        </div>

        <!-- TAMPILAN METODE 1: VIRTUAL ACCOUNT -->
        <div v-if="activeGatewayCategory === 'va'" class="space-y-4">
          <!-- Pilihan Bank VA -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <button
              v-for="bank in vaBanks"
              :key="bank.code"
              @click="selectedVaBank = bank.code"
              class="p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20"
              :class="selectedVaBank === bank.code
                ? 'border-[#1E3A8A] bg-blue-50/50 shadow-2xs ring-1 ring-[#1E3A8A]'
                : 'border-slate-200 bg-white hover:border-slate-300'"
            >
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-900 font-sora">{{ bank.name }}</span>
                <span v-if="bank.isPrimary" class="text-[9px] bg-[#1E3A8A] text-white px-1.5 py-0.2 rounded font-sans">Utama</span>
              </div>
              <div class="text-[10px] text-slate-500 font-sans">{{ bank.desc }}</div>
            </button>
          </div>

          <!-- VA Display Card -->
          <div class="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/70">
              <div>
                <div class="text-[11px] text-slate-500 font-sans">Nomor Virtual Account {{ currentVaBankName }}:</div>
                <div class="flex items-center gap-2 mt-1">
                  <span class="font-mono font-black text-xl sm:text-2xl text-slate-900 tracking-wider">
                    {{ currentVaNumber }}
                  </span>
                  <button
                    @click="copyText(currentVaNumber, 'Nomor Virtual Account')"
                    class="px-2.5 py-1 bg-white hover:bg-slate-100 text-xs font-semibold text-[#1E3A8A] rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                  >
                    Salin
                  </button>
                </div>
              </div>

              <div class="text-left sm:text-right">
                <div class="text-[11px] text-slate-500 font-sans">Total Tagihan:</div>
                <div class="font-sora font-extrabold text-lg text-[#1E3A8A] mt-0.5">
                  Rp {{ currentActiveAmount.toLocaleString('id-ID') }}
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 font-sans pt-1">
              <div>
                <span class="text-slate-400 text-[11px] block">Atas Nama Penerima:</span>
                <strong class="text-slate-800">PMB BTH - {{ candidate.fullName || 'Kemal Ramadhan' }}</strong>
              </div>
              <div>
                <span class="text-slate-400 text-[11px] block">Waktu Tersisa:</span>
                <span class="font-mono font-semibold text-rose-600">23 Jam 58 Menit (Otomatis)</span>
              </div>
              <div>
                <span class="text-slate-400 text-[11px] block">Verifikasi:</span>
                <span class="text-emerald-700 font-semibold">Otomatis & Real-Time</span>
              </div>
            </div>
          </div>
        </div>

        <!-- TAMPILAN METODE 2: QRIS REAL-TIME -->
        <div v-else-if="activeGatewayCategory === 'qris'" class="space-y-4">
          <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col md:flex-row items-center gap-6">
            <!-- QR Code Box -->
            <div class="bg-white p-4 rounded-2xl border border-slate-300 shadow-xs flex flex-col items-center flex-shrink-0">
              <div class="flex items-center gap-1.5 mb-2">
                <span class="font-black text-xs font-sora text-slate-900 tracking-wider">QRIS</span>
                <span class="text-[9px] text-slate-400">Standar Pembayaran Nasional</span>
              </div>
              <div class="w-44 h-44 bg-slate-900 rounded-xl p-2 flex items-center justify-center text-white">
                <QrCode class="w-36 h-36 text-white" />
              </div>
              <div class="text-[10px] text-slate-500 font-mono mt-2">NMID: ID102026BTH00042</div>
            </div>

            <!-- Petunjuk Scan -->
            <div class="space-y-3 text-xs text-slate-600 font-sans flex-1">
              <div class="font-sora font-bold text-slate-900 text-sm">
                Bayar Instan dengan QRIS (Semua Aplikasi)
              </div>
              <p class="leading-relaxed">
                Scan kode QR di samping menggunakan aplikasi perbankan (BSI Mobile, Livin Mandiri, BCA Mobile) atau e-wallet (GoPay, OVO, ShopeePay, Dana, LinkAja).
              </p>
              <div class="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                <div class="flex justify-between">
                  <span class="text-slate-500">Nominal Tagihan:</span>
                  <strong class="font-mono text-slate-900">Rp {{ currentActiveAmount.toLocaleString('id-ID') }}</strong>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Biaya Layanan:</span>
                  <span class="text-emerald-700 font-semibold">Rp 0 (Ditanggung Kampus)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAMPILAN METODE 3: E-WALLET -->
        <div v-else class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div class="font-sora font-bold text-slate-900">GoPay</div>
              <p class="text-slate-500 text-[11px]">Pembayaran langsung via aplikasi Gojek</p>
              <span class="text-emerald-700 font-semibold text-[11px]">Tersedia 24 Jam</span>
            </div>
            <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div class="font-sora font-bold text-slate-900">ShopeePay</div>
              <p class="text-slate-500 text-[11px]">Direct checkout dengan saldo ShopeePay</p>
              <span class="text-emerald-700 font-semibold text-[11px]">Tersedia 24 Jam</span>
            </div>
            <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div class="font-sora font-bold text-slate-900">OVO / Dana</div>
              <p class="text-slate-500 text-[11px]">Notifikasi push langsung ke ponsel Anda</p>
              <span class="text-emerald-700 font-semibold text-[11px]">Tersedia 24 Jam</span>
            </div>
          </div>
        </div>

        <!-- Tombol Aksi Gateway / Bayar Sekarang -->
        <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
          <!-- Tombol Simulasi Payment Gateway Snap Modal -->
          <button
            @click="showGatewayModal = true"
            class="flex-1 py-3 px-5 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <CreditCard class="w-4 h-4" />
            <span>Bayar Sekarang via Payment Gateway</span>
          </button>

          <!-- Tombol Sudah Transfer Manual -->
          <button
            @click="handleManualPaymentComplete"
            class="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Saya Sudah Transfer / Cek Status</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- HALAMAN 3: STATUS PEMBAYARAN (Status, Riwayat Transaksi & Kuitansi)       -->
    <!-- ========================================================================= -->
    <div v-else-if="paymentStep === 'status'" class="space-y-6 animate-fadeIn">
      <!-- 1. Hero Card Status Utama -->
      <div
        class="rounded-3xl p-6 sm:p-7 border shadow-xs transition-all"
        :class="applicantStore.isRegPaymentComplete
          ? 'bg-emerald-50/70 border-emerald-200'
          : regPayment.status === 'pending_confirmation'
          ? 'bg-amber-50/70 border-amber-200'
          : 'bg-white border-slate-200/80'"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-start gap-4">
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              :class="applicantStore.isRegPaymentComplete
                ? 'bg-emerald-600 text-white shadow-xs'
                : regPayment.status === 'pending_confirmation'
                ? 'bg-amber-500 text-white'
                : 'bg-blue-100 text-[#1E3A8A]'"
            >
              <CheckCircle2 v-if="applicantStore.isRegPaymentComplete" class="w-6 h-6" />
              <Clock v-else class="w-6 h-6" />
            </div>

            <div class="space-y-1">
              <div class="font-sora font-bold text-base sm:text-lg text-slate-900">
                {{ applicantStore.isRegPaymentComplete ? 'Pembayaran Biaya Formulir Lunas' : regPayment.status === 'pending_confirmation' ? 'Menunggu Konfirmasi Admin Keuangan' : 'Menunggu Pembayaran' }}
              </div>
              <p class="text-xs text-slate-600 font-sans leading-relaxed max-w-xl">
                {{ applicantStore.isRegPaymentComplete
                  ? `Transaksi sebesar Rp ${regPayment.amount.toLocaleString('id-ID')} telah berhasil diverifikasi oleh sistem perbankan. Akses Ujian CBT Online dan Tes Wawancara telah aktif.`
                  : regPayment.status === 'pending_confirmation'
                  ? 'Pengajuan transaksi sedang dalam proses verifikasi rekonsiliasi perbankan oleh Panitia PMB. Anda dapat memantau status secara berkala.'
                  : 'Silakan selesaikan tagihan formulir pendaftaran melalui halaman Pembayaran Gateway untuk mengaktifkan sesi Ujian CBT Anda.' }}
              </p>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center gap-2 self-start sm:self-auto flex-shrink-0">
            <button
              v-if="applicantStore.isRegPaymentComplete"
              @click="openReceiptModal('reg')"
              class="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-slate-50 text-[#1E3A8A] font-semibold text-xs rounded-xl border border-slate-200 shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText class="w-4 h-4" />
              <span>Lihat Kuitansi Resmi</span>
            </button>

            <button
              v-else
              @click="checkPaymentStatus"
              class="w-full sm:w-auto px-4 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Cek Status Terkini
            </button>
          </div>
        </div>
      </div>

      <!-- 2. Alur Tracker 3 Tahap Transaksi -->
      <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 class="font-sora font-bold text-slate-900 text-sm">
          Alur & Riwayat Pemrosesan Transaksi PMB
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
          <!-- Step 1 -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="font-sora font-bold text-slate-800">1. Penerbitan Tagihan</span>
              <span class="text-emerald-700 font-bold">✓ Selesai</span>
            </div>
            <p class="text-[11px] text-slate-500">Invoice elektronik resmi dibuat dengan kode referensi {{ regPayment.id }}</p>
          </div>

          <!-- Step 2 -->
          <div
            class="p-4 rounded-2xl border space-y-1.5"
            :class="applicantStore.isRegPaymentComplete ? 'bg-slate-50 border-slate-200' : 'bg-blue-50/50 border-blue-200'"
          >
            <div class="flex items-center justify-between">
              <span class="font-sora font-bold text-slate-800">2. Pembayaran Gateway</span>
              <span :class="applicantStore.isRegPaymentComplete ? 'text-emerald-700 font-bold' : 'text-blue-700 font-semibold'">
                {{ applicantStore.isRegPaymentComplete ? '✓ Diterima' : 'Sedang Berjalan' }}
              </span>
            </div>
            <p class="text-[11px] text-slate-500">Penyetoran melalui Virtual Account Bank / QRIS Payment Gateway</p>
          </div>

          <!-- Step 3 -->
          <div
            class="p-4 rounded-2xl border space-y-1.5"
            :class="applicantStore.isRegPaymentComplete ? 'bg-slate-50 border-slate-200' : 'bg-slate-50/50 border-slate-100 opacity-60'"
          >
            <div class="flex items-center justify-between">
              <span class="font-sora font-bold text-slate-800">3. Validasi SIAKAD BTH</span>
              <span :class="applicantStore.isRegPaymentComplete ? 'text-emerald-700 font-bold' : 'text-slate-400'">
                {{ applicantStore.isRegPaymentComplete ? '✓ Tercatat' : 'Menunggu' }}
              </span>
            </div>
            <p class="text-[11px] text-slate-500">Penerbitan kuitansi sah & pembukaan hak akses tahapan seleksi</p>
          </div>
        </div>
      </div>

      <!-- 3. Tabel Riwayat Invoice & Pembayaran Resmi -->
      <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 class="font-sora font-bold text-slate-900 text-sm">
            Daftar Tagihan & Bukti Pembayaran Resmi
          </h3>
          <span class="text-xs text-slate-500 font-sans">2 Tagihan Terdaftar</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs font-sans">
            <thead>
              <tr class="border-b border-slate-200 text-slate-500 bg-slate-50/70">
                <th class="py-3 px-4 font-sora font-semibold text-slate-700">No. Invoice</th>
                <th class="py-3 px-4 font-sora font-semibold text-slate-700">Deskripsi Tagihan</th>
                <th class="py-3 px-4 font-sora font-semibold text-slate-700">Metode</th>
                <th class="py-3 px-4 font-sora font-semibold text-slate-700">Nominal</th>
                <th class="py-3 px-4 font-sora font-semibold text-slate-700">Status</th>
                <th class="py-3 px-4 font-sora font-semibold text-slate-700 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <!-- Baris 1: Formulir -->
              <tr class="hover:bg-slate-50/60 transition-colors">
                <td class="py-3.5 px-4 font-mono font-medium text-slate-900">{{ regPayment.id }}</td>
                <td class="py-3.5 px-4 font-medium text-slate-800">Biaya Formulir Pendaftaran PMB</td>
                <td class="py-3.5 px-4 text-slate-600">{{ regPayment.paymentMethod || 'Virtual Account BSI' }}</td>
                <td class="py-3.5 px-4 font-mono font-bold text-slate-900">Rp {{ regPayment.amount.toLocaleString('id-ID') }}</td>
                <td class="py-3.5 px-4">
                  <span
                    class="px-2.5 py-1 rounded-lg text-[11px] font-semibold"
                    :class="regPayment.status === 'paid'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'"
                  >
                    {{ regPayment.status === 'paid' ? 'Lunas' : 'Menunggu Bayar' }}
                  </span>
                </td>
                <td class="py-3.5 px-4 text-right">
                  <button
                    v-if="regPayment.status === 'paid'"
                    @click="openReceiptModal('reg')"
                    class="px-3 py-1.5 bg-blue-50 hover:bg-[#1E3A8A] hover:text-white text-[#1E3A8A] font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Kuitansi
                  </button>
                  <button
                    v-else
                    @click="paymentStep = 'gateway'; selectedBillType = 'reg'"
                    class="px-3 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Bayar
                  </button>
                </td>
              </tr>

              <!-- Baris 2: UKT Semester 1 -->
              <tr class="hover:bg-slate-50/60 transition-colors">
                <td class="py-3.5 px-4 font-mono font-medium text-slate-900">{{ uktPayment.id }}</td>
                <td class="py-3.5 px-4 font-medium text-slate-800">UKT Semester 1 - {{ admission?.prodi1 || 'S1 Farmasi' }}</td>
                <td class="py-3.5 px-4 text-slate-600">Virtual Account Mitra BTH</td>
                <td class="py-3.5 px-4 font-mono font-bold text-slate-900">Rp {{ uktPayment.amount.toLocaleString('id-ID') }}</td>
                <td class="py-3.5 px-4">
                  <span
                    class="px-2.5 py-1 rounded-lg text-[11px] font-semibold"
                    :class="isUktPaid
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : applicantStore.isResultPassed
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-500'"
                  >
                    {{ isUktPaid ? 'Lunas' : applicantStore.isResultPassed ? 'Siap Dibayar' : 'Tahap Seleksi' }}
                  </span>
                </td>
                <td class="py-3.5 px-4 text-right">
                  <button
                    v-if="isUktPaid"
                    @click="openReceiptModal('ukt')"
                    class="px-3 py-1.5 bg-blue-50 hover:bg-[#1E3A8A] hover:text-white text-[#1E3A8A] font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Kuitansi
                  </button>
                  <button
                    v-else-if="applicantStore.isResultPassed"
                    @click="paymentStep = 'gateway'; selectedBillType = 'ukt'"
                    class="px-3 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Bayar
                  </button>
                  <span v-else class="text-[11px] text-slate-400">Terkunci</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL SIMULASI PAYMENT GATEWAY (Ala Midtrans / Xendit Snap Checkout)      -->
    <!-- ========================================================================= -->
    <div
      v-if="showGatewayModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      @click.self="showGatewayModal = false"
    >
      <div class="bg-white rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative space-y-5">
        <!-- Gateway Header -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center font-bold font-sora">
              BTH
            </div>
            <div>
              <div class="font-sora font-bold text-xs sm:text-sm text-slate-900">BTH Payment Gateway</div>
              <div class="text-[10px] text-slate-400 font-sans">Sistem Pembayaran Terpadu PMB</div>
            </div>
          </div>
          <button @click="showGatewayModal = false" class="text-slate-400 hover:text-slate-700 text-2xl font-bold p-1 leading-none cursor-pointer">&times;</button>
        </div>

        <!-- Detail Pembayaran di Gateway -->
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs font-sans">
          <div class="flex justify-between items-center text-slate-600">
            <span>Item Pembayaran:</span>
            <strong class="text-slate-800 font-semibold">{{ selectedBillType === 'reg' ? 'Biaya Formulir Pendaftaran' : 'UKT Semester 1' }}</strong>
          </div>
          <div class="flex justify-between items-center text-slate-600">
            <span>Metode Terpilih:</span>
            <span class="font-medium text-slate-800">{{ activeGatewayCategory === 'qris' ? 'QRIS Real-Time' : currentVaBankName + ' Virtual Account' }}</span>
          </div>
          <div class="flex justify-between items-center text-slate-600">
            <span>Nama Pendaftar:</span>
            <span class="font-medium text-slate-800">{{ candidate.fullName || 'Kemal Ramadhan' }}</span>
          </div>
          <div class="pt-2 border-t border-slate-200 flex justify-between items-center">
            <span class="font-semibold text-slate-700">Total Tagihan:</span>
            <strong class="font-sora font-black text-lg text-[#1E3A8A]">
              Rp {{ currentActiveAmount.toLocaleString('id-ID') }}
            </strong>
          </div>
        </div>

        <p class="text-[11px] text-slate-500 font-sans leading-relaxed">
          Simulasi verifikasi instan: Klik tombol di bawah untuk menyimulasikan transaksi berhasil dari payment gateway mitra.
        </p>

        <!-- Gateway Action Buttons -->
        <div class="space-y-2 pt-2">
          <button
            @click="simulateGatewayPaymentSuccess"
            class="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-sora font-semibold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
          >
            <CheckCircle2 class="w-4 h-4" />
            <span>Simulasikan Pembayaran Lunas (Testing)</span>
          </button>

          <button
            @click="showGatewayModal = false"
            class="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans font-medium text-xs rounded-xl transition-colors cursor-pointer"
          >
            Tutup / Batal
          </button>
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
                  {{ candidate.fullName || 'Kemal Ramadhan' }}
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
  QrCode,
  FileText,
  Check,
  ArrowRight,
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

// 3 Halaman Alur Pembayaran: 'detail' | 'gateway' | 'status'
const paymentStep = ref('detail');

// Tipe tagihan yang sedang dipilih untuk dibayar di Gateway: 'reg' (Formulir) | 'ukt' (UKT)
const selectedBillType = ref('reg');

// Kategori metode gateway aktif: 'va' | 'qris' | 'ewallet'
const activeGatewayCategory = ref('va');
const selectedVaBank = ref('bsi');

const showGatewayModal = ref(false);

const vaBanks = [
  { code: 'bsi', name: 'Bank BSI', desc: 'Bank Syariah Indonesia (Utama)', isPrimary: true },
  { code: 'mandiri', name: 'Mandiri', desc: 'Bank Mandiri Virtual Account', isPrimary: false },
  { code: 'bca', name: 'BCA', desc: 'Bank Central Asia Virtual Account', isPrimary: false },
  { code: 'bni', name: 'BNI', desc: 'Bank Negara Indonesia VA', isPrimary: false },
];

const currentVaBankName = computed(() => {
  const found = vaBanks.find((b) => b.code === selectedVaBank.value);
  return found ? found.name : 'Bank BSI';
});

const currentVaNumber = computed(() => {
  if (selectedVaBank.value === 'bsi') {
    return selectedBillType.value === 'ukt'
      ? (uktPayment.value.vaBsi || '4201 0821 1710 0200')
      : (regPayment.value.vaNumber || '4201 0821 1710 0200');
  }
  if (selectedVaBank.value === 'mandiri') {
    return '88908 0821 1710 0200';
  }
  if (selectedVaBank.value === 'bca') {
    return '39088 0821 1710 0200';
  }
  return '98808 0821 1710 0200';
});

const currentActiveAmount = computed(() => {
  if (selectedBillType.value === 'ukt') {
    return uktPayment.value.amount || 6500000;
  }
  return regPayment.value.amount || 250000;
});

// Skema pembayaran aktif di Tab Detail: 'direct' (Bayar Langsung) atau 'installment' (Cicilan 3 Termin)
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

const handleManualPaymentComplete = () => {
  if (selectedBillType.value === 'reg') {
    applicantStore.submitRegPayment();
    toastMessage.value = 'Transaksi formulir dicatat. Menuju halaman Status Pembayaran...';
  } else {
    applicantStore.submitUktPayment();
    toastMessage.value = 'Transaksi UKT dicatat. Menuju halaman Status Pembayaran...';
  }
  paymentStep.value = 'status';
};

const simulateGatewayPaymentSuccess = () => {
  showGatewayModal.value = false;
  if (selectedBillType.value === 'reg') {
    applicantStore.payRegFee('Gateway Duitku / Midtrans BTH');
    toastMessage.value = 'Pembayaran Formulir Rp 250.000 BERHASIL diverifikasi lunas oleh Payment Gateway!';
  } else {
    applicantStore.payUktFee('Gateway Duitku / Midtrans BTH');
    toastMessage.value = 'Pembayaran UKT Semester 1 BERHASIL diverifikasi lunas oleh Payment Gateway!';
  }
  paymentStep.value = 'status';
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
