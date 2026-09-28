<template>
  <div class="space-y-6">
    <!-- Header Halaman Pembayaran (Formal & Bersih) -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900">
          {{ isRegPaid ? 'Status Pelunasan Biaya PMB' : 'Pembayaran Biaya Pendaftaran' }}
        </h2>
        <p class="text-xs text-slate-500 mt-0.5 font-sans">
          Universitas Bakti Tunas Husada • Tahun Akademik {{ admission?.academicYear || '2026/2027' }}
        </p>
      </div>

      <div class="flex items-center gap-2 self-start sm:self-auto">
        <span
          class="font-semibold px-3 py-1 rounded-full text-xs font-sans border"
          :class="isRegPaid
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : isRegPending
            ? 'bg-amber-50 text-amber-800 border-amber-200'
            : 'bg-blue-50 text-[#1E3A8A] border-blue-200'"
        >
          {{ isRegPaid ? '✓ Pembayaran Lunas' : isRegPending ? 'Menunggu Konfirmasi' : 'Menunggu Pembayaran' }}
        </span>
      </div>
    </div>

    <!-- Notifikasi Umpan Balik Sederhana -->
    <div
      v-if="toastMessage"
      class="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between animate-fadeIn"
    >
      <div class="flex items-center gap-2">
        <CheckCircle2 class="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span>{{ toastMessage }}</span>
      </div>
      <button
        @click="toastMessage = ''"
        class="text-emerald-700 hover:text-emerald-900 font-bold text-sm leading-none cursor-pointer"
      >
        &times;
      </button>
    </div>

    <!-- ========================================================================= -->
    <!-- KONDISI A: SUDAH LUNAS (STATUS PELUNASAN RESMI & ARAH KE UJIAN CBT)        -->
    <!-- ========================================================================= -->
    <div v-if="isRegPaid && !applicantStore.isResultPassed" class="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <!-- Status Konfirmasi Sukses -->
        <div class="text-center space-y-2 pb-4 border-b border-slate-100">
          <div class="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
            <CheckCircle2 class="w-7 h-7" />
          </div>
          <h3 class="font-sora font-bold text-slate-900 text-base sm:text-lg">
            Pembayaran Formulir Terverifikasi Lunas
          </h3>
          <p class="text-xs text-slate-500 font-sans max-w-md mx-auto">
            Biaya pendaftaran Anda telah tercatat dan dikonfirmasi oleh sistem keuangan Universitas Bakti Tunas Husada.
          </p>
        </div>

        <!-- Rincian Data Transaksi Resmi -->
        <div class="bg-slate-50/70 rounded-xl p-4 sm:p-5 border border-slate-100 space-y-3 text-xs font-sans">
          <div class="flex justify-between items-center py-1 border-b border-slate-200/60">
            <span class="text-slate-500">Nomor Transaksi / Tagihan:</span>
            <span class="font-mono font-bold text-slate-800">{{ activeRegInvoiceNumber }}</span>
          </div>

          <div class="flex justify-between items-center py-1 border-b border-slate-200/60">
            <span class="text-slate-500">Nama Calon Mahasiswa:</span>
            <strong class="text-slate-800">{{ candidateFullName }}</strong>
          </div>

          <div class="flex justify-between items-center py-1 border-b border-slate-200/60">
            <span class="text-slate-500">Nomor Registrasi PMB:</span>
            <span class="font-mono font-medium text-slate-700">{{ candidateRegNo }}</span>
          </div>

          <div class="flex justify-between items-center py-1 border-b border-slate-200/60">
            <span class="text-slate-500">Program Studi Pilihan:</span>
            <span class="font-medium text-slate-800">{{ activeProdiName }}</span>
          </div>

          <div class="flex justify-between items-center py-1 border-b border-slate-200/60">
            <span class="text-slate-500">Metode Pembayaran:</span>
            <span class="font-medium text-slate-800">{{ paymentMethodLabel }}</span>
          </div>

          <div class="flex justify-between items-center py-1 border-b border-slate-200/60">
            <span class="text-slate-500">Waktu Verifikasi:</span>
            <span class="text-slate-700">{{ paidAtFormatted }}</span>
          </div>

          <div class="flex justify-between items-center pt-2">
            <span class="font-semibold text-slate-700">Total Biaya Pendaftaran:</span>
            <strong class="font-sora font-extrabold text-[#1E3A8A] text-sm sm:text-base">
              Rp {{ regAmount.toLocaleString('id-ID') }}
            </strong>
          </div>
        </div>

        <!-- Catatan Terkunci -->
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2.5">
          <Lock class="w-4 h-4 text-slate-500 flex-shrink-0" />
          <span class="font-sans leading-relaxed">
            Pembayaran lunas. Pilihan jalur dan program studi telah <strong>terkunci</strong> dan tidak dapat diubah lagi.
          </span>
        </div>

        <!-- Tombol Aksi Utama Menuju Ujian CBT -->
        <div class="pt-2">
          <button
            type="button"
            @click="emit('switch-tab', 'exam')"
            class="w-full py-3 px-6 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs sm:text-sm font-semibold font-sans transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Lanjut ke Ujian CBT Online</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- KONDISI B: BELUM LUNAS (CHECKOUT PEMBAYARAN VIA API REAL BACKEND)          -->
    <!-- ========================================================================= -->
    <div v-else class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Kolom Kiri: Pilihan Metode Pembayaran (Col 7) -->
        <div class="lg:col-span-7 space-y-5">
          <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
            <div>
              <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
                Pilih Metode Pembayaran
              </h3>
              <p class="text-xs text-slate-500 font-sans mt-0.5">
                Silakan pilih kanal pembayaran resmi yang tersedia untuk melunasi biaya pendaftaran PMB.
              </p>
            </div>

            <!-- Tab Metode Sederhana (Virtual Account, Transfer Bank, QRIS) -->
            <div class="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                @click="activeGatewayCategory = 'va'"
                class="py-2 px-2.5 rounded-lg text-xs font-semibold font-sans transition-all cursor-pointer flex items-center justify-center gap-1.5"
                :class="activeGatewayCategory === 'va'
                  ? 'bg-white text-[#1E3A8A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'"
              >
                <CreditCard class="w-3.5 h-3.5" />
                <span class="truncate">Virtual Account</span>
              </button>

              <button
                type="button"
                @click="activeGatewayCategory = 'manual'"
                class="py-2 px-2.5 rounded-lg text-xs font-semibold font-sans transition-all cursor-pointer flex items-center justify-center gap-1.5"
                :class="activeGatewayCategory === 'manual'
                  ? 'bg-white text-[#1E3A8A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'"
              >
                <Building2 class="w-3.5 h-3.5" />
                <span class="truncate">Transfer Bank</span>
              </button>

              <button
                type="button"
                @click="activeGatewayCategory = 'qris'"
                class="py-2 px-2.5 rounded-lg text-xs font-semibold font-sans transition-all cursor-pointer flex items-center justify-center gap-1.5"
                :class="activeGatewayCategory === 'qris'
                  ? 'bg-white text-[#1E3A8A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'"
              >
                <QrCode class="w-3.5 h-3.5" />
                <span>QRIS</span>
              </button>
            </div>

            <!-- Bagian 1: Virtual Account -->
            <div v-if="activeGatewayCategory === 'va'" class="space-y-4 pt-1">
              <!-- Pilihan Bank -->
              <div class="grid grid-cols-3 gap-2 text-xs">
                <button
                  v-for="bank in vaBanks"
                  :key="bank.code"
                  type="button"
                  @click="selectVaBank(bank.code)"
                  class="p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between"
                  :class="selectedVaBank === bank.code
                    ? 'border-[#1E3A8A] bg-blue-50/60 ring-1 ring-[#1E3A8A]'
                    : 'border-slate-200 bg-white hover:border-slate-300'"
                >
                  <div class="font-semibold text-slate-900 font-sans">{{ bank.name }}</div>
                  <div class="text-[10px] text-slate-500 font-sans mt-0.5">
                    {{ bank.isPrimary ? 'Bank Utama BTH' : 'Bank Mitra' }}
                  </div>
                </button>
              </div>

              <!-- Box Nomor Virtual Account (Bersih & Mudah Disalin) -->
              <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span class="text-[11px] text-slate-500 font-sans">
                      Nomor Virtual Account {{ currentVaBankName }}:
                    </span>
                    <div class="font-mono font-bold text-lg sm:text-xl text-slate-900 tracking-wider mt-0.5">
                      {{ currentActiveVaNumber }}
                    </div>
                  </div>

                  <button
                    type="button"
                    @click="copyText(currentActiveVaNumber, 'Nomor Virtual Account')"
                    class="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-auto"
                  >
                    <Copy class="w-3.5 h-3.5 text-slate-500" />
                    <span>Salin Nomor</span>
                  </button>
                </div>

                <div class="pt-2 border-t border-slate-200/70 text-xs text-slate-600 font-sans flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span>Nama Akun: <strong>PMB BTH - {{ candidateFullName }}</strong></span>
                  <span class="text-rose-600 font-medium">Batas: {{ activeDueDateFormatted }}</span>
                </div>
              </div>

              <!-- Petunjuk Pembayaran Virtual Account -->
              <div class="border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs font-sans">
                <div class="p-3 bg-slate-50/50 font-semibold text-slate-800">
                  Petunjuk Pembayaran Virtual Account
                </div>
                <div class="p-3.5 text-slate-600 space-y-1.5 text-[11px] leading-relaxed">
                  <p>1. Buka aplikasi <strong>{{ currentVaBankName }} Mobile</strong> atau ATM terdekat.</p>
                  <p>2. Pilih menu <strong>Pembayaran</strong> &gt; <strong>Akademik / Virtual Account</strong>.</p>
                  <p>3. Masukkan nomor VA: <strong class="font-mono text-slate-800">{{ currentActiveVaNumber }}</strong>.</p>
                  <p>4. Pastikan nama pendaftar dan total tagihan (<strong>Rp {{ regAmount.toLocaleString('id-ID') }}</strong>) sesuai, lalu selesaikan transaksi.</p>
                  <p>5. Klik tombol <strong>Cek Status Pembayaran</strong> di sebelah kanan setelah mentransfer.</p>
                </div>
              </div>
            </div>

            <!-- Bagian 2: Transfer Bank Manual (Unggah Bukti Transfer) -->
            <div v-else-if="activeGatewayCategory === 'manual'" class="space-y-4 pt-1">
              <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs font-sans">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span class="text-[11px] text-slate-500 font-sans">Rekening Resmi PMB Universitas BTH:</span>
                    <div class="font-mono font-bold text-base sm:text-lg text-slate-900 mt-0.5">
                      1045892019
                    </div>
                    <div class="text-slate-600 text-[11px] mt-0.5">
                      Bank BSI • a.n. <strong>Universitas Bakti Tunas Husada</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    @click="copyText('1045892019', 'Nomor Rekening BSI')"
                    class="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-auto"
                  >
                    <Copy class="w-3.5 h-3.5 text-slate-500" />
                    <span>Salin Rekening</span>
                  </button>
                </div>
              </div>

              <!-- Form Unggah Bukti Transfer -->
              <div class="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                <div class="text-xs font-semibold text-slate-800">
                  Unggah Bukti Transfer Bank
                </div>
                <p class="text-[11px] text-slate-500 font-sans">
                  Format gambar JPG, PNG, atau PDF (maks. 5MB). Bukti transfer akan langsung diteruskan ke staf keuangan backend.
                </p>

                <div v-if="isRegPending" class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                  <Clock class="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Bukti transfer telah diterima dan sedang menunggu verifikasi oleh staf keuangan PMB BTH.</span>
                </div>

                <div v-else class="space-y-3">
                  <label class="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <Upload class="w-6 h-6 text-slate-400 mb-1.5" />
                    <span class="text-xs font-medium text-slate-700">Pilih berkas struk / bukti transfer</span>
                    <span class="text-[10px] text-slate-400 mt-0.5">Klik untuk menjelajah file di perangkat</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      class="hidden"
                      :disabled="isUploadingProof"
                      @change="handleManualTransferUpload"
                    />
                  </label>

                  <div v-if="isUploadingProof" class="text-center text-xs text-slate-500 py-1">
                    Sedang mengunggah berkas ke sistem backend...
                  </div>
                </div>
              </div>
            </div>

            <!-- Bagian 3: QRIS -->
            <div v-else class="space-y-4 pt-1">
              <div class="p-5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-5">
                <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col items-center flex-shrink-0">
                  <div class="w-36 h-36 flex items-center justify-center bg-slate-900 rounded-lg text-white">
                    <QrCode class="w-32 h-32" />
                  </div>
                  <span class="text-[10px] text-slate-400 font-mono mt-1">QRIS PMB BTH</span>
                </div>

                <div class="space-y-2 text-xs text-slate-600 font-sans">
                  <div class="font-semibold text-slate-900 text-sm">Pembayaran via QRIS</div>
                  <p class="text-[11px] leading-relaxed">
                    Dapat dipindai menggunakan aplikasi m-Banking (BCA, Mandiri, BSI, BRI) atau dompet digital (GoPay, OVO, Dana, ShopeePay).
                  </p>
                  <div class="p-2.5 bg-white rounded-lg border border-slate-200 text-[11px] space-y-1">
                    <div class="flex justify-between">
                      <span class="text-slate-500">Nominal:</span>
                      <strong class="text-slate-900">Rp {{ regAmount.toLocaleString('id-ID') }}</strong>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-500">Biaya Transaksi:</span>
                      <span class="text-emerald-700 font-medium">Rp 0 (Gratis)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Kolom Kanan: Rincian Tagihan & Tombol Cek Status (Col 5) -->
        <div class="lg:col-span-5 space-y-4">
          <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
            <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base border-b border-slate-100 pb-3">
              Rincian Tagihan
            </h3>

            <div class="space-y-2.5 text-xs font-sans">
              <div class="flex justify-between items-center text-slate-600">
                <span class="text-slate-400">Nomor Registrasi:</span>
                <span class="font-mono text-slate-900 font-medium">{{ candidateRegNo }}</span>
              </div>
              <div class="flex justify-between items-center text-slate-600">
                <span class="text-slate-400">Nama Pendaftar:</span>
                <span class="text-slate-900 font-medium">{{ candidateFullName }}</span>
              </div>
              <div class="flex justify-between items-center text-slate-600">
                <span class="text-slate-400">Program Studi:</span>
                <span class="text-slate-900 font-medium truncate max-w-[170px]">{{ activeProdiName }}</span>
              </div>
              <div class="flex justify-between items-center text-slate-600">
                <span class="text-slate-400">Uraian Tagihan:</span>
                <span class="text-slate-900 font-medium">Biaya Formulir Pendaftaran PMB</span>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-100 space-y-2">
              <div class="flex justify-between items-center text-xs font-sans text-slate-600">
                <span>Biaya Formulir:</span>
                <span class="font-medium text-slate-900">Rp {{ regAmount.toLocaleString('id-ID') }}</span>
              </div>
              <div class="flex justify-between items-center text-xs font-sans text-slate-600">
                <span>Biaya Transaksi:</span>
                <span class="text-emerald-700 font-medium">Rp 0 (Gratis)</span>
              </div>
              <div class="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span class="font-semibold text-slate-800 text-xs">Total Pembayaran:</span>
                <strong class="font-sora font-bold text-lg text-[#1E3A8A]">
                  Rp {{ regAmount.toLocaleString('id-ID') }}
                </strong>
              </div>
            </div>

            <!-- Tombol Cek Status Pembayaran (Real API Backend) -->
            <div class="pt-2">
              <button
                type="button"
                @click="checkPaymentStatus"
                :disabled="isCheckingStatus"
                class="w-full py-2.5 px-4 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isCheckingStatus }" />
                <span>{{ isCheckingStatus ? 'Memeriksa ke Sistem Bank...' : 'Cek Status Pembayaran' }}</span>
              </button>
            </div>

            <!-- Opsi Batalkan Pendaftaran (Hanya Tampil Sebelum Bayar) -->
            <div v-if="applicantStore.canCancelAdmission" class="pt-3 border-t border-slate-100 text-center">
              <button
                type="button"
                @click="showCancelConfirmModal = true"
                class="text-[11px] text-rose-600 hover:text-rose-800 hover:underline font-sans cursor-pointer transition-colors"
              >
                Ingin mengganti program studi? Batalkan pendaftaran ini
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Catatan Ketentuan Pembayaran -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 text-xs text-slate-600 space-y-2 font-sans">
        <div class="font-semibold text-slate-800 flex items-center justify-between">
          <span>Informasi Pembayaran PMB</span>
          <span class="text-slate-400 font-normal text-[11px]">Biro Administrasi Keuangan BTH</span>
        </div>
        <ul class="space-y-1 text-[11px] text-slate-500 list-disc list-inside">
          <li>Pembayaran diverifikasi secara otomatis oleh sistem gateway perbankan.</li>
          <li>Setelah pembayaran diverifikasi lunas, modul <strong>Ujian CBT Online</strong> akan langsung dibuka.</li>
          <li>Biaya pendaftaran yang telah dibayarkan tidak dapat ditarik kembali atau dibatalkan.</li>
        </ul>
      </div>
    </div>

    <!-- MODAL KONFIRMASI BATALKAN PENDAFTARAN RESMI INSTITUSIONAL -->
    <Teleport to="body">
      <div
        v-if="showCancelConfirmModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
        @click.self="showCancelConfirmModal = false"
      >
        <div class="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200/90 overflow-hidden animate-scaleUp">
          <!-- Body Dialog -->
          <div class="p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-base font-semibold text-slate-900 leading-snug">
                  Batalkan Pilihan Program Studi?
                </h3>
                <p class="text-sm text-slate-500 mt-1">
                  Program studi: <span class="font-medium text-slate-800">{{ activeProdiName || applicantStore.state?.admission?.prodi1 || 'Program Studi Terpilih' }}</span>
                  <span class="text-slate-300 mx-1.5">•</span>
                  <span class="text-slate-600">{{ applicantStore.state?.admission?.track || 'Reguler' }}</span>
                </p>
              </div>
              <button
                type="button"
                @click="showCancelConfirmModal = false"
                class="text-slate-400 hover:text-slate-600 p-1 -mr-1 -mt-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                title="Tutup dialog"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            <div class="mt-4 pt-4 border-t border-slate-100 space-y-2.5 text-sm text-slate-600 leading-relaxed font-sans">
              <p>
                Pilihan program studi saat ini akan dibatalkan dari sistem. Anda dapat langsung memilih kembali program studi atau jalur seleksi lain pada formulir pendaftaran.
              </p>
              <p class="text-xs text-slate-500 pt-1">
                Catatan: Pembatalan hanya dapat dilakukan sebelum biaya formulir pendaftaran dibayarkan.
              </p>
            </div>
          </div>

          <!-- Dialog Footer (Clean grey bar standard) -->
          <div class="px-6 py-3.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-end gap-2.5">
            <button
              type="button"
              @click="showCancelConfirmModal = false"
              :disabled="isCancelling"
              class="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              Kembali
            </button>
            <button
              type="button"
              @click="handleCancelAdmission"
              :disabled="isCancelling"
              class="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Loader2 v-if="isCancelling" class="w-3.5 h-3.5 animate-spin" />
              <span>{{ isCancelling ? 'Membatalkan...' : 'Ya, Batalkan Pilihan' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import {
  CreditCard,
  CheckCircle2,
  QrCode,
  ArrowRight,
  Copy,
  Lock,
  Trash2,
  Building2,
  Upload,
  Clock,
  RefreshCw,
  AlertTriangle,
  Info,
  X,
  Loader2,
} from 'lucide-vue-next';
import { ref, computed, onMounted } from 'vue';
import { useApplicantStore } from '@/stores/applicant';
import { useAuthStore } from '@/stores/auth';
import { financeApi } from '@/api/finance';

const emit = defineEmits(['switch-tab']);
const applicantStore = useApplicantStore();
const authStore = useAuthStore();

const toastMessage = ref('');
const showCancelConfirmModal = ref(false);
const isCancelling = ref(false);
const isCheckingStatus = ref(false);
const isUploadingProof = ref(false);
const isLoadingInvoices = ref(false);

const backendInvoices = ref([]);
const activeInvoiceId = ref(null);
const activePaymentId = ref(null);
const activePaymentData = ref(null);
const backendVaNumber = ref('');

const activeGatewayCategory = ref('va');
const selectedVaBank = ref('bsi');

const vaBanks = [
  { code: 'bsi', name: 'Bank BSI', isPrimary: true },
  { code: 'mandiri', name: 'Bank Mandiri', isPrimary: false },
  { code: 'bca', name: 'Bank BCA', isPrimary: false },
];

const currentVaBankName = computed(() => {
  const found = vaBanks.find((b) => b.code === selectedVaBank.value);
  return found ? found.name : 'Bank BSI';
});

const candidate = computed(() => applicantStore.state.candidate);
const admission = computed(() => applicantStore.state.admission);
const regPayment = computed(() => applicantStore.state.payments.registrationFee);

const activeProdiName = computed(() => {
  return admission.value?.prodi1 || '';
});

const candidateFullName = computed(() => {
  return candidate.value?.fullName || authStore.currentUser?.full_name || 'Calon Mahasiswa';
});

const candidateRegNo = computed(() => {
  return candidate.value?.registrationNumber || applicantStore.state.candidate?.registrationNumber || 'BTH-2026-REG-00000';
});

const candidateRegDigits = computed(() => {
  return candidateRegNo.value.replace(/\D/g, '').slice(-5) || '10001';
});

const activeRegInvoiceNumber = computed(() => {
  const inv = backendInvoices.value.find((i) => i.fee_type === 'registration');
  return inv?.invoice_number || inv?.id || regPayment.value.id || `INV/2026/REG-${candidateRegDigits.value}`;
});

const regAmount = computed(() => {
  const inv = backendInvoices.value.find((i) => i.fee_type === 'registration');
  return inv?.amount || regPayment.value.amount || 250000;
});

const isRegPaid = computed(() => {
  const inv = backendInvoices.value.find((i) => i.fee_type === 'registration');
  if (inv) return inv.status === 'paid';
  return applicantStore.isRegPaymentComplete;
});

const isRegPending = computed(() => {
  const inv = backendInvoices.value.find((i) => i.fee_type === 'registration');
  if (inv) {
    return inv.status === 'pending_confirmation' || activePaymentData.value?.status === 'awaiting_verification';
  }
  return regPayment.value.status === 'pending_confirmation';
});

const paymentMethodLabel = computed(() => {
  if (activePaymentData.value?.method === 'manual_transfer') {
    return 'Transfer Bank BSI (Verifikasi Manual)';
  }
  return `${currentVaBankName.value} Virtual Account`;
});

const paidAtFormatted = computed(() => {
  const inv = backendInvoices.value.find((i) => i.fee_type === 'registration');
  if (inv?.updated_at) {
    return new Date(inv.updated_at).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return regPayment.value.paidAt || 'Telah Diverifikasi';
});

const currentActiveVaNumber = computed(() => {
  if (backendVaNumber.value) {
    return backendVaNumber.value;
  }
  const inv = backendInvoices.value.find((i) => i.fee_type === 'registration');
  if (inv?.va_number) return inv.va_number;
  if (inv?.payments && inv.payments.length > 0) {
    const p = inv.payments.find((pay) => pay.va_number);
    if (p) return p.va_number;
  }

  const regSuffix = candidateRegDigits.value;
  if (selectedVaBank.value === 'bsi') {
    return `988 2026 01 ${regSuffix}`;
  } else if (selectedVaBank.value === 'mandiri') {
    return `88908 2026 ${regSuffix}`;
  } else if (selectedVaBank.value === 'bca') {
    return `39088 2026 ${regSuffix}`;
  }
  return `98808 2026 ${regSuffix}`;
});

const activeDueDateFormatted = computed(() => {
  const inv = backendInvoices.value.find((i) => i.fee_type === 'registration');
  if (inv?.due_date) {
    return new Date(inv.due_date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  return '3 Hari dari Pendaftaran';
});

const selectVaBank = async (bankCode) => {
  selectedVaBank.value = bankCode;

  // Jika invoice ada di backend dan belum lunas, inisiasi Virtual Account riil ke backend
  if (activeInvoiceId.value && !isRegPaid.value) {
    try {
      const res = await financeApi.payInvoice(activeInvoiceId.value, {
        method: 'virtual_account',
        channel: bankCode,
      });
      if (res?.data?.data) {
        const pay = res.data.data;
        activePaymentId.value = pay.id;
        activePaymentData.value = pay;
        if (pay.va_number) {
          backendVaNumber.value = pay.va_number;
        }
      }
    } catch (err) {
      console.warn('API pay invoice notice:', err?.message);
    }
  }
};

const copyText = async (text, label) => {
  try {
    await navigator.clipboard.writeText(text);
    toastMessage.value = `${label} (${text}) berhasil disalin.`;
  } catch {
    toastMessage.value = `${label} (${text}) siap digunakan.`;
  }
};

const fetchInvoices = async () => {
  isLoadingInvoices.value = true;
  try {
    const res = await financeApi.getMyInvoices();
    if (res?.data?.data && Array.isArray(res.data.data)) {
      backendInvoices.value = res.data.data;
      const regInv = backendInvoices.value.find((i) => i.fee_type === 'registration');
      if (regInv) {
        activeInvoiceId.value = regInv.id;

        // Ambil detail lengkap invoice dari backend
        const detailRes = await financeApi.getInvoiceDetail(regInv.id).catch(() => null);
        const detail = detailRes?.data?.data || regInv;

        if (detail.active_payment) {
          activePaymentId.value = detail.active_payment.payment_id || detail.active_payment.id;
          activePaymentData.value = detail.active_payment;
          if (detail.active_payment.va_number) {
            backendVaNumber.value = detail.active_payment.va_number;
          }
        } else if (detail.payments && detail.payments.length > 0) {
          const latestPayment = detail.payments[detail.payments.length - 1];
          activePaymentId.value = latestPayment.id;
          activePaymentData.value = latestPayment;
          if (latestPayment.va_number) {
            backendVaNumber.value = latestPayment.va_number;
          }
        }

        // Sinkronisasi status dengan store
        applicantStore.state.payments.registrationFee.id = detail.id;
        applicantStore.state.payments.registrationFee.amount = detail.amount;

        if (detail.status === 'paid') {
          applicantStore.state.payments.registrationFee.status = 'paid';
          applicantStore.state.payments.registrationFee.paidAt = detail.updated_at
            ? new Date(detail.updated_at).toLocaleString('id-ID')
            : 'Terkonfirmasi';
        } else if (detail.status === 'pending_confirmation' || activePaymentData.value?.status === 'awaiting_verification') {
          applicantStore.state.payments.registrationFee.status = 'pending_confirmation';
        }
      }
    }
  } catch (err) {
    console.warn('fetchInvoices notice:', err?.message);
  } finally {
    isLoadingInvoices.value = false;
  }
};

const checkPaymentStatus = async () => {
  isCheckingStatus.value = true;
  try {
    let isConfirmedPaid = false;
    let isAwaiting = false;

    // 1. Periksa status riil ke endpoint backend jika activePaymentId tersedia
    if (activeInvoiceId.value && activePaymentId.value) {
      const statusRes = await financeApi
        .getPaymentStatus(activeInvoiceId.value, activePaymentId.value)
        .catch(() => null);

      if (statusRes?.data?.data) {
        const pStatus = statusRes.data.data;
        if (pStatus.is_paid || pStatus.status === 'success') {
          isConfirmedPaid = true;
        } else if (pStatus.status === 'awaiting_verification') {
          isAwaiting = true;
        }
      }
    }

    // 2. Refresh data tagihan dari backend finance-service
    await fetchInvoices();

    // 3. Evaluasi hasil status riil
    if (isRegPaid.value || isConfirmedPaid) {
      applicantStore.payRegFee('Sistem Gateway Perbankan / Backend Finance');
      toastMessage.value = 'Pembayaran biaya formulir pendaftaran telah diverifikasi lunas!';
    } else if (isRegPending.value || isAwaiting) {
      toastMessage.value = 'Bukti pembayaran Anda sedang diverifikasi oleh tim keuangan BTH.';
    } else {
      toastMessage.value = 'Pembayaran belum terdeteksi. Silakan selesaikan transfer lalu klik "Cek Status Pembayaran" kembali.';
    }
  } catch (err) {
    console.warn('checkPaymentStatus notice:', err?.message);
    toastMessage.value = 'Status pembayaran sedang diproses oleh sistem.';
  } finally {
    isCheckingStatus.value = false;
  }
};

const handleManualTransferUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    alert('Ukuran berkas maksimal 5MB.');
    return;
  }

  isUploadingProof.value = true;
  try {
    if (activeInvoiceId.value) {
      const formData = new FormData();
      formData.append('file', file);
      const res = await financeApi.payWithManualTransfer(activeInvoiceId.value, formData);
      if (res?.data?.data) {
        activePaymentId.value = res.data.data.id;
        activePaymentData.value = res.data.data;
      }
    }
    applicantStore.submitRegPayment(`Transfer Bank BSI - File: ${file.name}`);
    toastMessage.value = 'Bukti transfer berhasil diunggah. Menunggu verifikasi tim keuangan PMB.';
    await fetchInvoices();
  } catch (err) {
    alert(err?.response?.data?.message || 'Gagal mengunggah bukti transfer.');
  } finally {
    isUploadingProof.value = false;
  }
};

const handleCancelAdmission = async () => {
  isCancelling.value = true;
  try {
    const res = await applicantStore.cancelAdmission();
    showCancelConfirmModal.value = false;
    toastMessage.value = res?.message || 'Pilihan pendaftaran berhasil dibatalkan.';
    applicantStore.setActiveTab('admission');
  } catch (err) {
    alert(err?.message || 'Gagal membatalkan pendaftaran.');
  } finally {
    isCancelling.value = false;
  }
};

onMounted(async () => {
  await fetchInvoices();
});
</script>
