<template>
  <div class="space-y-6">
    <!-- Header Modul -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900">
          Tagihan & Pembayaran Keuangan Mahasiswa
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Pantau status tagihan pendaftaran formulir dan biaya UKT semester 1 via Virtual Account resmi BTH.
        </p>
      </div>
      <div class="flex items-center gap-2 self-start sm:self-auto">
        <span
          class="px-3 py-1 rounded-full text-xs font-semibold font-sora"
          :class="isUktPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : regPayment.status === 'paid' ? 'bg-blue-50 text-[#1E3A8A] border border-blue-200/80' : 'bg-amber-50 text-amber-700 border border-amber-200'"
        >
          {{ isUktPaid ? 'Semua Tagihan Lunas' : regPayment.status === 'paid' ? 'Biaya Formulir Lunas' : 'Menunggu Pembayaran Formulir' }}
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
            <span
              class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold font-sora border"
              :class="regPayment.status === 'paid'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'"
            >
              <svg v-if="regPayment.status === 'paid'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span v-else class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
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
              <span :class="regPayment.status === 'paid' ? 'text-emerald-700 font-medium' : 'text-slate-400 italic'">
                {{ regPayment.paidAt || 'Menunggu Pembayaran' }}
              </span>
            </div>
          </div>
        </div>

        <div class="pt-5 border-t border-slate-100 mt-5">
          <button
            v-if="regPayment.status === 'paid'"
            @click="openReceiptModal('reg')"
            class="w-full py-2.5 bg-slate-100 hover:bg-[#1E3A8A] hover:text-white text-slate-700 text-xs font-sora font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Lihat Kwitansi Resmi Formulir</span>
          </button>
          <button
            v-else
            @click="handlePayReg"
            class="w-full py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-sora font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Konfirmasi Pembayaran Formulir</span>
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
              :class="isUktPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : applicantStore.isResultPassed ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600 border border-slate-200'"
            >
              <svg v-if="isUktPaid" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ isUktPaid ? 'Lunas' : applicantStore.isResultPassed ? 'Menunggu Pembayaran' : 'Daftar Ulang' }}</span>
            </span>
          </div>

          <h3 class="font-sora font-bold text-slate-900 text-base mb-1">
            {{ uktPayment.title }}
          </h3>
          <div class="font-sora font-black text-2xl text-[#1E3A8A] mb-4">
            Rp {{ uktPayment.amount.toLocaleString('id-ID') }}
          </div>

          <!-- If Pre-Acceptance: Show info note -->
          <div v-if="!applicantStore.isResultPassed && !isUktPaid" class="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 space-y-1.5 text-xs text-slate-600">
            <div class="font-sora font-semibold text-[#1E3A8A] flex items-center gap-1.5">
              <svg class="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Tagihan Pra-Kelulusan Seleksi</span>
            </div>
            <p class="text-[11px] leading-relaxed text-slate-500">
              Virtual Account UKT Semester 1 aktif dan dapat dibayarkan untuk daftar ulang setelah Anda menyelesaikan Ujian CBT dan dinyatakan Lulus Seleksi pada Surat Penerimaan (LoA).
            </p>
          </div>

          <!-- If Passed & Pending: Show VA options -->
          <div v-else-if="!isUktPaid" class="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2 text-xs">
            <div class="flex justify-between items-center text-slate-600">
              <span class="text-slate-500">Batas Waktu Bayar:</span>
              <span class="font-bold text-rose-600 font-mono">{{ uktPayment.dueDate }}</span>
            </div>
            <div class="flex justify-between items-center text-slate-600">
              <span class="text-slate-500">VA Bank Syariah Indonesia:</span>
              <div class="flex items-center gap-1.5">
                <span class="font-mono font-bold text-slate-800">{{ uktPayment.vaBsi }}</span>
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
            </div>
            <div class="font-mono font-bold text-base text-slate-900 tracking-wider">
              {{ uktPayment.vaBsi }}
            </div>
            <div class="text-[11px] text-slate-500">
              Atas Nama: <strong>PMB BTH - {{ candidate.fullName }}</strong>
            </div>

            <div class="bg-white border border-slate-200 rounded-xl p-3 space-y-1.5 mt-2">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-800">VA Bank Mandiri:</span>
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
            v-if="!applicantStore.isResultPassed && !isUktPaid"
            disabled
            class="flex-1 py-2.5 bg-slate-100 text-slate-400 text-xs font-sora font-semibold rounded-xl cursor-not-allowed text-center"
          >
            Aktif Pasca Pengumuman Kelulusan
          </button>
          <button
            v-else-if="!isUktPaid"
            @click="handlePayUkt"
            class="flex-1 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-sora font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Konfirmasi Pembayaran UKT</span>
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

    <!-- Modal Kwitansi Resmi Universitas BTH (Standar Institusi Akademik Indonesia) -->
    <div
      v-if="selectedReceipt"
      class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn overflow-y-auto no-print-backdrop"
      @click.self="selectedReceipt = null"
    >
      <div class="relative w-full max-w-2xl my-4 sm:my-8 bg-white shadow-2xl rounded-xl sm:rounded-2xl border border-slate-300 overflow-hidden text-slate-900 max-h-[92vh] flex flex-col">
        <!-- Floating Close & Print Bar (No Print) -->
        <div class="no-print bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between flex-shrink-0">
          <div class="flex items-center gap-2 text-xs font-sora font-semibold text-slate-700">
            <svg class="w-4 h-4 text-[#1E3A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Pratinjau Kwitansi Pembayaran Resmi</span>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="windowPrint"
              class="px-3 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Cetak kwitansi fisik atau simpan sebagai dokumen PDF"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Cetak / PDF</span>
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

        <!-- Kwitansi Paper Sheet (A4 Proportionate Document) -->
        <div id="printable-receipt" class="p-5 sm:p-8 overflow-y-auto flex-1 bg-white relative font-sans text-slate-800 selection:bg-none">
          <!-- Subtle Watermark Logo BTH in Background -->
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] overflow-hidden">
            <img src="/assets/icons/bth.png" alt="BTH Watermark" class="w-96 h-96 object-contain" />
          </div>

          <div class="relative z-10 space-y-4">
            <!-- 1. KOP SURAT RESMI UNIVERSITAS BAKTI TUNAS HUSADA -->
            <div class="flex items-center gap-3 sm:gap-4 pb-2">
              <img src="/assets/icons/bth.png" alt="Logo Universitas BTH" class="w-16 h-16 sm:w-20 sm:h-20 object-contain flex-shrink-0" />
              <div class="text-center flex-1">
                <div class="font-serif font-bold text-[11px] sm:text-xs text-slate-800 uppercase tracking-wider">
                  YAYASAN BAKTI TUNAS HUSADA TASIKMALAYA
                </div>
                <h1 class="font-sora font-extrabold text-base sm:text-xl text-[#1E3A8A] tracking-tight uppercase leading-tight mt-0.5">
                  UNIVERSITAS BAKTI TUNAS HUSADA
                </h1>
                <div class="text-[9px] sm:text-[10px] text-slate-600 font-medium mt-0.5">
                  SK Mendikbudristek RI No. 65/E/O/2022 • Terakreditasi BAN-PT
                </div>
                <div class="text-[9px] sm:text-[10px] text-slate-500 mt-0.5 leading-snug">
                  Jl. Cilolohan No. 36, Kahuripan, Kec. Tawang, Kota Tasikmalaya, Jawa Barat 46115<br class="hidden sm:inline" />
                  Telp. (0265) 334149 • Laman: pmb.universitas-bth.ac.id • Pos-el: pmb@universitas-bth.ac.id
                </div>
              </div>
            </div>

            <!-- Garis Ganda Pembatas Kop Surat Resmi (Double Line) -->
            <div class="pt-0 pb-1">
              <div class="h-[2.5px] bg-slate-900 w-full"></div>
              <div class="h-[0.75px] bg-slate-900 w-full mt-[1.5px]"></div>
            </div>

            <!-- 2. JUDUL DOKUMEN & NOMOR KWITANSI RESMI -->
            <div class="text-center py-1">
              <h2 class="font-sora font-extrabold text-sm sm:text-base text-slate-900 tracking-wide uppercase">
                TANDA BUKTI PEMBAYARAN BIAYA PENDIDIKAN
              </h2>
              <div class="font-serif italic text-xs font-semibold text-slate-700 mt-0.5">
                ( KWITANSI RESMI PMB )
              </div>
              <div class="font-mono text-xs text-slate-800 font-bold mt-1">
                Nomor: {{ officialReceiptNumber }}
              </div>
            </div>

            <!-- 3. TABEL FORMULIR KWITANSI STANDAR INDONESIA -->
            <div class="border border-slate-300 rounded-lg p-3 sm:p-4 bg-slate-50/40 text-xs">
              <table class="w-full text-left border-collapse">
                <tbody class="divide-y divide-slate-200/60">
                  <tr class="align-top">
                    <td class="py-1.5 w-36 sm:w-44 font-semibold text-slate-700">Telah Diterima Dari</td>
                    <td class="py-1.5 w-3 text-center font-bold">:</td>
                    <td class="py-1.5 font-bold text-slate-900 uppercase font-sans">
                      {{ candidate.fullName || 'CALON MAHASISWA BARU' }}
                    </td>
                  </tr>

                  <tr class="align-top">
                    <td class="py-1.5 font-semibold text-slate-700">Nomor Registrasi / NIK</td>
                    <td class="py-1.5 text-center font-bold">:</td>
                    <td class="py-1.5 font-mono text-slate-900">
                      <strong>{{ candidate.registrationNumber || '-' }}</strong>
                      <span class="text-slate-500 font-sans ml-2 text-[11px]">(NIK: {{ candidate.nik || '-' }})</span>
                    </td>
                  </tr>

                  <tr class="align-top">
                    <td class="py-1.5 font-semibold text-slate-700">Program Studi Pilihan</td>
                    <td class="py-1.5 text-center font-bold">:</td>
                    <td class="py-1.5 font-semibold text-[#1E3A8A]">
                      {{ admission.prodi1 || 'S1 Farmasi' }}
                      <span class="text-slate-600 font-normal">({{ admission.prodi1Degree || 'S1' }} • {{ admission.prodi1Faculty || 'Fakultas Farmasi' }})</span>
                    </td>
                  </tr>

                  <tr class="align-top">
                    <td class="py-1.5 font-semibold text-slate-700">Tahun Akademik / Jalur</td>
                    <td class="py-1.5 text-center font-bold">:</td>
                    <td class="py-1.5 text-slate-800">
                      TA {{ admission.academicYear || '2026/2027' }} • {{ admission.track || 'Jalur Reguler Gelombang 1' }}
                    </td>
                  </tr>

                  <tr class="align-top">
                    <td class="py-2 font-semibold text-slate-700">Uang Sejumlah (Huruf)</td>
                    <td class="py-2 text-center font-bold">:</td>
                    <td class="py-2">
                      <div class="px-3 py-1.5 bg-white border border-slate-300 rounded font-serif italic font-bold text-slate-900 text-[11px] sm:text-xs leading-relaxed shadow-2xs">
                        # {{ angkaKeTerbilang(selectedReceiptData.amount) }} #
                      </div>
                    </td>
                  </tr>

                  <tr class="align-top">
                    <td class="py-1.5 font-semibold text-slate-700">Untuk Pembayaran</td>
                    <td class="py-1.5 text-center font-bold">:</td>
                    <td class="py-1.5 font-medium text-slate-900">
                      {{ paymentDescription }}
                    </td>
                  </tr>

                  <tr class="align-top">
                    <td class="py-1.5 font-semibold text-slate-700">Kanal / Metode Bayar</td>
                    <td class="py-1.5 text-center font-bold">:</td>
                    <td class="py-1.5 text-slate-800">
                      {{ selectedReceiptData.paymentMethod || 'Virtual Account Bank Syariah Indonesia (BSI)' }} (Host-to-Host Online)
                    </td>
                  </tr>

                  <tr class="align-top">
                    <td class="py-1.5 font-semibold text-slate-700">Nomor Transaksi / VA</td>
                    <td class="py-1.5 text-center font-bold">:</td>
                    <td class="py-1.5 font-mono text-slate-900">
                      {{ selectedReceiptData.vaNumber || '988260100042' }}
                      <span class="text-slate-400 font-sans text-[11px] ml-1.5">(Ref: {{ selectedReceiptData.id }})</span>
                    </td>
                  </tr>

                  <tr class="align-top">
                    <td class="py-1.5 font-semibold text-slate-700">Waktu Pelunasan Bank</td>
                    <td class="py-1.5 text-center font-bold">:</td>
                    <td class="py-1.5 font-mono text-slate-900">
                      {{ receiptDateFormatted }} WIB
                    </td>
                  </tr>

                  <tr class="align-top">
                    <td class="py-1.5 font-semibold text-slate-700">Status Pembayaran</td>
                    <td class="py-1.5 text-center font-bold">:</td>
                    <td class="py-1.5">
                      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono font-bold text-[11px] border border-emerald-300 uppercase">
                        <span>✓</span>
                        <span>LUNAS (SAH & TERVERIFIKASI SISTEM)</span>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 4. KOTAK NOMINAL BESAR (Khas Standar Kwitansi Keuangan) -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
              <div class="border-2 border-slate-900 px-4 py-2.5 bg-slate-50 flex items-center gap-3 rounded">
                <span class="font-serif font-bold text-xs uppercase tracking-wider text-slate-700">JUMLAH :</span>
                <span class="font-mono font-black text-base sm:text-xl text-slate-900 tracking-tight">
                  Rp {{ Number(selectedReceiptData.amount || 0).toLocaleString('id-ID') }},-
                </span>
              </div>

              <div class="text-[10px] text-slate-500 font-mono italic">
                *Telah diverifikasi lunas secara otomatis oleh Gateway Perbankan BTH.
              </div>
            </div>

            <!-- 5. AREA PENGESAHAN, STEMPEL BASAH RESMI & TANDA TANGAN -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 mt-2 border-t border-slate-200 text-xs">
              <!-- Sisi Kiri: Barcode Keabsahan & Pengamanan Dokumen -->
              <div class="space-y-2 text-slate-600 flex flex-col justify-between">
                <div>
                  <div class="font-sora font-bold text-[11px] text-slate-800 uppercase tracking-wide">
                    Keabsahan Dokumen Elektronik
                  </div>
                  <p class="text-[10px] text-slate-500 mt-1 leading-relaxed">
                    Kwitansi ini diterbitkan secara sah oleh Sistem Informasi PMB Universitas Bakti Tunas Husada melalui verifikasi data elektronik perbankan mitra.
                  </p>
                </div>

                <div class="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  <!-- QR Code Mini Simulasi -->
                  <div class="w-14 h-14 bg-white p-1 border border-slate-300 rounded flex items-center justify-center flex-shrink-0">
                    <svg class="w-12 h-12 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h2v2h-2v-2zm-4 0h2v2h-2v-2zm2 2h2v2h-2v-2zm2 2h2v2h-2v-2zm-6 0h2v2h-2v-2zm4 2h2v2h-2v-2zm-6-8h2v2h-2v-2zm8-2h2v2h-2v-2z" />
                    </svg>
                  </div>
                  <div class="text-[9px] font-mono text-slate-500 leading-tight">
                    <span class="font-bold text-slate-700 block">ID TRANSAKSI RESMI:</span>
                    <span>{{ selectedReceiptData.id }}</span><br />
                    <span class="text-[8px] text-emerald-700 font-semibold block mt-0.5">STATUS: TERDAFTAR DI PANGKALAN DATA BTH</span>
                  </div>
                </div>
              </div>

              <!-- Sisi Kanan: Pengesahan Pejabat Keuangan & Stempel Resmi -->
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

                <!-- Tanda Tangan & Stempel Visual Area -->
                <div class="relative w-44 h-20 my-1 flex items-center justify-center">
                  <!-- Stempel Lingkaran Basah Resmi Universitas (Ungu/Indigo Klasik) -->
                  <div class="absolute right-6 top-0 w-20 h-20 pointer-events-none select-none opacity-85">
                    <svg viewBox="0 0 100 100" class="w-full h-full text-indigo-800 fill-current">
                      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="2.5" />
                      <circle cx="50" cy="50" r="41" fill="none" stroke="currentColor" stroke-width="1.2" />
                      <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2,2" />
                      <!-- Circular Text -->
                      <path id="stamp-path-1" fill="none" d="M 16,50 A 34,34 0 1,1 84,50" />
                      <text font-size="7.5" font-family="sans-serif" font-weight="bold" letter-spacing="1">
                        <textPath href="#stamp-path-1" startOffset="50%" text-anchor="middle">
                          UNIVERSITAS BTH
                        </textPath>
                      </text>
                      <path id="stamp-path-2" fill="none" d="M 84,50 A 34,34 0 0,1 16,50" />
                      <text font-size="7" font-family="sans-serif" font-weight="bold" letter-spacing="0.8">
                        <textPath href="#stamp-path-2" startOffset="50%" text-anchor="middle">
                          * BIRO KEUANGAN *
                        </textPath>
                      </text>
                      <!-- Center Box / Text -->
                      <rect x="22" y="44" width="56" height="13" fill="white" stroke="currentColor" stroke-width="1" />
                      <text x="50" y="53.5" font-size="9" font-family="sans-serif" font-weight="900" text-anchor="middle">
                        LUNAS
                      </text>
                    </svg>
                  </div>

                  <!-- Tanda Tangan Digital Realistis -->
                  <svg class="w-36 h-14 text-[#1E3A8A] relative z-10 opacity-95" viewBox="0 0 160 60" fill="none" stroke="currentColor">
                    <path d="M15 45 C 30 20, 45 10, 60 30 C 70 45, 80 50, 95 25 C 105 10, 115 15, 125 35 C 135 50, 140 30, 150 20" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M40 38 Q 75 15, 130 22" stroke-width="1.6" stroke-linecap="round"/>
                    <path d="M25 50 Q 80 46, 145 42" stroke-width="1.4" stroke-linecap="round"/>
                  </svg>
                </div>

                <div class="font-sora font-bold text-slate-900 text-xs underline underline-offset-2">
                  ( Hj. Neni Rohaeni, S.E., M.M. )
                </div>
                <div class="font-mono text-[10px] text-slate-500 mt-0.5">
                  NIP. 19820514 200801 2 001
                </div>
              </div>
            </div>

            <!-- 6. CATATAN KAKI RESMI KAMPUS -->
            <div class="pt-2 border-t border-slate-200 text-[9px] sm:text-[10px] text-slate-500 leading-relaxed font-sans">
              <strong>Catatan Penting:</strong>
              <ol class="list-decimal list-inside space-y-0.5 mt-0.5 text-slate-600">
                <li>Tanda bukti pembayaran ini adalah sah dan mengikat sesuai ketentuan Penerimaan Mahasiswa Baru Universitas BTH TA 2026/2027.</li>
                <li>Dana yang telah disetorkan dan diverifikasi oleh sistem perbankan tidak dapat ditarik kembali dengan alasan apa pun.</li>
                <li>Simpan dokumen kwitansi ini sebagai syarat verifikasi administrasi saat mengikuti Ujian CBT dan Registrasi Ulang.</li>
              </ol>
            </div>
          </div>
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
    toastMessage.value = `${label} (${text}) berhasil disalin ke papan klip.`;
  } catch {
    toastMessage.value = `${label} (${text}) siap digunakan.`;
  }
};

const handlePayReg = () => {
  applicantStore.payRegFee();
  toastMessage.value = 'Pembayaran Formulir Pendaftaran PMB sebesar Rp 250.000 berhasil dikonfirmasi lunas!';
};

const handlePayUkt = () => {
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

<style scoped>
@media print {
  /* Sembunyikan seluruh elemen halaman kecuali kertas kwitansi */
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
