<template>
  <div class="space-y-6">
    <!-- Header Halaman Pembayaran (Formal & Bersih) -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900">
          {{ selectedInvoiceType === 'tuition' ? 'Pembayaran UKT Semester 1' : 'Pembayaran Biaya Pendaftaran' }}
        </h2>
        <p class="text-xs text-slate-500 mt-0.5 font-sans">
          {{ cmsStore.identity.name || 'Universitas Bakti Tunas Husada' }} • Tahun Akademik {{ admission?.academicYear || cmsStore.identity.academicYear || '2026/2027' }}
        </p>
      </div>

      <div class="flex items-center gap-2 self-start sm:self-auto">
        <span
          class="font-semibold px-3 py-1 text-xs font-sans border rounded"
          :class="isCurrentInvoicePaid
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : isCurrentInvoiceExpired
            ? 'bg-rose-50 text-rose-800 border-rose-200'
            : isCurrentInvoicePartial
            ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
            : isCurrentInvoicePending
            ? 'bg-amber-50 text-amber-800 border-amber-200'
            : 'bg-blue-50 text-[#1E3A8A] border-blue-200'"
        >
          {{ isCurrentInvoicePaid ? 'Pembayaran Lunas' : isCurrentInvoiceExpired ? 'Tagihan Kedaluwarsa' : isCurrentInvoicePartial ? 'Sebagian Terbayar (Cicilan)' : isCurrentInvoicePending ? 'Menunggu Konfirmasi' : 'Menunggu Pembayaran' }}
        </span>
      </div>
    </div>

    <!-- Tab Pemilihan Tagihan: Pendaftaran vs UKT (Jika memenuhi syarat kelulusan / ada tagihan UKT) -->
    <div v-if="applicantStore.isResultPassed || hasTuitionInvoice" class="flex items-center gap-2 border-b border-slate-200 pb-2">
      <button
        type="button"
        @click="selectedInvoiceType = 'registration'"
        class="px-4 py-2 text-xs font-semibold font-sora rounded border transition-colors cursor-pointer"
        :class="selectedInvoiceType === 'registration'
          ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
      >
        Biaya Pendaftaran PMB {{ isRegPaid ? '(Lunas)' : '' }}
      </button>

      <button
        type="button"
        @click="selectedInvoiceType = 'tuition'"
        class="px-4 py-2 text-xs font-semibold font-sora rounded border transition-colors cursor-pointer"
        :class="selectedInvoiceType === 'tuition'
          ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
      >
        Biaya UKT Semester 1 {{ isTuitionPaid ? '(Lunas)' : '' }}
      </button>
    </div>

    <!-- Peringatan Tagihan Kedaluwarsa (CR-010 Invoice Renewal) -->
    <div
      v-if="isCurrentInvoiceExpired"
      class="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs text-rose-800 animate-fadeIn"
    >
      <div class="font-semibold text-sm text-rose-900">Masa Berlaku Tagihan Telah Berakhir</div>
      <p class="leading-relaxed">
        Tagihan ini telah melewati batas jatuh tempo (3 hari kerja). Nomor Virtual Account sebelumnya sudah tidak aktif. Silakan lakukan pembaruan tagihan untuk menerbitkan batas waktu dan nomor bayar baru.
      </p>
      <div class="pt-1">
        <button
          type="button"
          @click="handleRenewInvoice"
          :disabled="isRenewing"
          class="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-semibold rounded text-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          {{ isRenewing ? 'Sedang Memperbarui Tagihan...' : 'Perbarui Tagihan Baru' }}
        </button>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- KONDISI A: TAGIHAN AKTIF SUDAH LUNAS                                       -->
    <!-- ========================================================================= -->
    <div v-if="isCurrentInvoicePaid" class="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <div class="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <!-- Status Konfirmasi Sukses -->
        <div class="text-center space-y-2 pb-4 border-b border-slate-100">
          <div class="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mx-auto text-xl font-bold">
            OK
          </div>
          <h3 class="font-sora font-bold text-slate-900 text-base sm:text-lg">
            {{ selectedInvoiceType === 'tuition' ? 'Pembayaran UKT Telah Terverifikasi Lunas' : isFreeRegistration ? 'Jalur Bebas Biaya Formulir (Rp 0)' : 'Pembayaran Formulir Terverifikasi Lunas' }}
          </h3>
          <p class="text-xs text-slate-500 font-sans max-w-md mx-auto">
            {{ isFreeRegistration ? 'Jalur pendaftaran ini dibebaskan dari biaya pendaftaran (Rp 0). Anda langsung berhak melanjutkan ke tahapan seleksi selanjutnya.' : 'Pembayaran telah tercatat dan dikonfirmasi oleh Biro Keuangan Universitas Bakti Tunas Husada.' }}
          </p>
        </div>

        <!-- Peringatan Refund Pengunduran Diri Jika Sudah Dibayar -->
        <div v-if="applicantStore.isWithdrawn" class="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900 text-left">
          <AlertCircle class="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div class="space-y-0.5">
            <div class="font-semibold">Pengajuan Refund Sedang Ditinjau Bagian Keuangan</div>
            <p class="text-[11px] text-amber-800 leading-relaxed font-sans">
              Status pendaftaran Anda telah berstatus mengundurkan diri. Bukti pembayaran ini telah diteruskan ke Bagian Keuangan (BAUK) Universitas BTH untuk proses pengembalian dana (refund).
            </p>
          </div>
        </div>

        <!-- Rincian Data Transaksi Resmi -->
        <div class="bg-slate-50 rounded-lg p-4 sm:p-5 border border-slate-200 space-y-3 text-xs font-sans">
          <div class="flex justify-between items-center py-1 border-b border-slate-200">
            <span class="text-slate-500">Nomor Tagihan:</span>
            <span class="font-mono font-bold text-slate-800">{{ currentInvoiceNumber }}</span>
          </div>

          <div class="flex justify-between items-center py-1 border-b border-slate-200">
            <span class="text-slate-500">Nama Calon Mahasiswa:</span>
            <strong class="text-slate-800">{{ candidateFullName }}</strong>
          </div>

          <div class="flex justify-between items-center py-1 border-b border-slate-200">
            <span class="text-slate-500">Nomor Registrasi PMB:</span>
            <span class="font-mono font-medium text-slate-700">{{ candidateRegNo }}</span>
          </div>

          <div class="flex justify-between items-center py-1 border-b border-slate-200">
            <span class="text-slate-500">Program Studi Pilihan:</span>
            <span class="font-medium text-slate-800">{{ activeProdiName }}</span>
          </div>

          <div class="flex justify-between items-center py-1 border-b border-slate-200">
            <span class="text-slate-500">Uraian Transaksi:</span>
            <span class="font-medium text-slate-800">
              {{ selectedInvoiceType === 'tuition' ? 'Uang Kuliah Tunggal (UKT) Semester 1' : applicantStore.state?.referral?.isApplied ? `Pembebasan Biaya Formulir (Mitra ${applicantStore.state.referral.schoolName})` : isFreeRegistration ? 'Pembebasan Biaya Formulir PMB (Jalur Beasiswa/Afirmasi)' : 'Biaya Formulir Pendaftaran PMB' }}
            </span>
          </div>

          <!-- Info Terhubung Guru BK di Kuitansi/Lunas -->
          <div
            v-if="applicantStore.state?.referral?.isApplied && selectedInvoiceType === 'registration'"
            class="p-3 bg-emerald-50 rounded-lg border border-emerald-200 space-y-1.5 text-xs text-emerald-950"
          >
            <div class="flex items-center justify-between font-semibold">
              <span class="flex items-center gap-1.5">
                <CheckCircle2 class="w-4 h-4 text-emerald-600" />
                <span>Terhubung Kemitraan Guru BK:</span>
              </span>
              <span class="font-mono bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded text-[11px] font-bold">
                {{ applicantStore.state.referral.code }}
              </span>
            </div>
            <div class="flex justify-between text-[11px] text-emerald-900">
              <span class="text-emerald-700">Sekolah Mitra:</span>
              <strong>{{ applicantStore.state.referral.schoolName }}</strong>
            </div>
            <div class="flex justify-between text-[11px] text-emerald-900">
              <span class="text-emerald-700">Guru BK / PIC:</span>
              <strong>{{ applicantStore.state.referral.picName }}</strong>
            </div>
          </div>

          <div class="flex justify-between items-center py-1 border-b border-slate-200">
            <span class="text-slate-500">Waktu Verifikasi:</span>
            <span class="text-slate-700">{{ currentPaidAtFormatted }}</span>
          </div>

          <div class="flex justify-between items-center pt-2">
            <span class="font-semibold text-slate-700">Total Pembayaran:</span>
            <strong class="font-sora font-extrabold text-[#1E3A8A] text-sm sm:text-base">
              {{ isFreeRegistration ? 'Rp 0 (Bebas Biaya / Gratis)' : `Rp ${currentInvoiceAmount.toLocaleString('id-ID')}` }}
            </strong>
          </div>
        </div>

        <!-- Tombol Arah Tahapan Selanjutnya -->
        <div class="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            v-if="selectedInvoiceType === 'registration'"
            type="button"
            @click="emit('switch-tab', 'documents')"
            class="w-full sm:w-1/2 py-2.5 px-4 rounded bg-white border border-[#1E3A8A] text-[#1E3A8A] hover:bg-blue-50 text-xs font-semibold font-sora transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <span>Lanjut Unggah Berkas</span>
            <ChevronRight class="w-4 h-4" />
          </button>

          <button
            v-if="selectedInvoiceType === 'registration'"
            type="button"
            @click="emit('switch-tab', 'exam')"
            class="w-full sm:w-1/2 py-2.5 px-4 rounded bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold font-sora transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <span>Lanjut ke Seleksi CBT</span>
            <ChevronRight class="w-4 h-4" />
          </button>

          <button
            v-else-if="selectedInvoiceType === 'tuition'"
            type="button"
            @click="emit('switch-tab', 'result')"
            class="w-full py-2.5 px-4 rounded bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold font-sora transition-colors cursor-pointer text-center"
          >
            Kembali ke Pengumuman Kelulusan
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- KONDISI KHUSUS: PENGUNDURAN DIRI (TAGIHAN DINONAKTIFKAN / DIBATALKAN)       -->
    <!-- ========================================================================= -->
    <div v-else-if="applicantStore.isWithdrawn" class="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <div class="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-5 text-center">
        <div class="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center mx-auto">
          <AlertCircle class="w-6 h-6 text-slate-500" />
        </div>
        <div class="space-y-1">
          <h3 class="font-sora font-bold text-slate-900 text-base sm:text-lg">
            Tagihan Pembayaran Dibatalkan (Void)
          </h3>
          <p class="text-xs text-slate-500 font-sans max-w-md mx-auto leading-relaxed">
            Status pendaftaran Anda telah resmi mengundurkan diri. Seluruh tagihan aktif dan instruksi pembayaran telah dinonaktifkan secara otomatis.
          </p>
        </div>
        <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 max-w-md mx-auto text-left space-y-2 font-sans">
          <div class="flex justify-between items-center py-1 border-b border-slate-200">
            <span class="text-slate-500">Nomor Registrasi:</span>
            <span class="font-mono font-semibold text-slate-800">{{ candidateRegNo }}</span>
          </div>
          <div class="flex justify-between items-center py-1 border-b border-slate-200">
            <span class="text-slate-500">Jalur Pendaftaran:</span>
            <span class="font-medium text-slate-800">{{ applicantStore.state?.admission?.track || 'Jalur Reguler' }}</span>
          </div>
          <div class="flex justify-between items-center py-1">
            <span class="text-slate-500">Status Finansial:</span>
            <span class="font-semibold text-slate-700">Tidak Ada Tagihan Aktif</span>
          </div>
        </div>
        <div class="pt-2">
          <button
            type="button"
            @click="emit('switch-tab', 'admission')"
            class="px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white rounded-lg text-xs font-semibold font-sora transition-colors cursor-pointer"
          >
            Lihat Status Pengunduran Diri & Refund
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- KONDISI B: BELUM LUNAS (CHECKOUT PEMBAYARAN VIA REAL BACKEND GATEWAY)      -->
    <!-- ========================================================================= -->
    <div v-else-if="!isCurrentInvoiceExpired" class="space-y-6">

      <!-- Program Cicilan UKT (CR-010: Khusus Tagihan UKT) -->
      <div v-if="selectedInvoiceType === 'tuition'" class="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-sm">
              Program Keringanan Cicilan UKT
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Fasilitas pembayaran bertahap 2x atau 3x termin bagi calon mahasiswa yang membutuhkan.
            </p>
          </div>

          <button
            v-if="!hasActiveInstallmentPlan && !isInstallmentRequestPending"
            type="button"
            @click="openInstallmentModal = true"
            class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-sora font-semibold rounded border border-slate-300 transition-colors cursor-pointer self-start sm:self-auto"
          >
            Ajukan Keringanan Cicilan UKT
          </button>
        </div>

        <!-- Status Pengajuan Cicilan (Pending / Approved / Rejected) -->
        <div v-if="currentInstallmentRequest && !hasActiveInstallmentPlan" class="text-xs text-slate-600 space-y-1">
          <div>
            Status Pengajuan ({{ currentInstallmentRequest.requested_terms }} Termin):
            <strong :class="installmentStatusColor">{{ installmentStatusLabel }}</strong>
          </div>
          <p v-if="currentInstallmentRequest.review_note" class="text-[11px] text-slate-500">
            Catatan Keuangan: {{ currentInstallmentRequest.review_note }}
          </p>
        </div>

        <!-- Jika Sudah Ada Rencana Cicilan Yang Disetujui / Diajukan -->
        <div v-if="hasActiveInstallmentPlan" class="space-y-3">
          <div class="text-xs text-slate-600">
            Status Pengajuan:
            <strong :class="installmentStatusColor">{{ installmentStatusLabel }}</strong>
          </div>

          <!-- Mobile Cards (< md) -->
          <div class="block md:hidden space-y-2.5">
            <div
              v-for="item in activeInstallmentSchedule"
              :key="item.term"
              class="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2"
            >
              <div class="flex items-center justify-between">
                <span class="font-sora font-bold text-xs text-slate-800">
                  Cicilan Ke-{{ item.term }} ({{ item.percentage }}%)
                </span>
                <span
                  class="px-2 py-0.5 rounded text-[10px] font-bold"
                  :class="item.isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'"
                >
                  {{ item.isPaid ? 'Lunas' : 'Belum Dibayar' }}
                </span>
              </div>
              <div class="flex items-baseline justify-between pt-1 border-t border-slate-100 text-xs">
                <span class="text-slate-500 text-[11px]">Jatuh Tempo: {{ item.dueDate }}</span>
                <span class="font-mono font-bold text-slate-900 text-xs">
                  Rp {{ item.amount?.toLocaleString('id-ID') }}
                </span>
              </div>
            </div>
          </div>

          <!-- Desktop Table (>= md) -->
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-left text-xs border border-slate-200 rounded min-w-[540px]">
              <thead class="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold whitespace-nowrap">
                <tr>
                  <th class="py-2.5 px-3 whitespace-nowrap min-w-[140px]">Termin</th>
                  <th class="py-2.5 px-3 whitespace-nowrap min-w-[140px]">Nominal Tagihan</th>
                  <th class="py-2.5 px-3 whitespace-nowrap min-w-[130px]">Batas Jatuh Tempo</th>
                  <th class="py-2.5 px-3 whitespace-nowrap min-w-[120px]">Status Pelunasan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-sans">
                <tr v-for="item in activeInstallmentSchedule" :key="item.term">
                  <td class="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">Cicilan Ke-{{ item.term }} ({{ item.percentage }}%)</td>
                  <td class="py-2.5 px-3 font-mono font-semibold text-slate-900 whitespace-nowrap min-w-[140px]">Rp {{ item.amount?.toLocaleString('id-ID') }}</td>
                  <td class="py-2.5 px-3 text-slate-600 whitespace-nowrap">{{ item.dueDate }}</td>
                  <td class="py-2.5 px-3 whitespace-nowrap">
                    <span :class="item.isPaid ? 'text-emerald-700 font-semibold' : 'text-slate-600'" class="whitespace-nowrap">
                      {{ item.isPaid ? 'Lunas' : 'Belum Dibayar' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Kolom Kiri: Rincian Tagihan & Pembayaran (Col 7) -->
        <div class="lg:col-span-7 space-y-4">
          <div class="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
            <div class="border-b border-slate-100 pb-3">
              <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
                Rincian Tagihan
              </h3>
              <p class="text-xs text-slate-500 mt-0.5 font-sans">
                Informasi tagihan resmi yang perlu diselesaikan.
              </p>
            </div>

            <!-- Rincian Data -->
            <div class="space-y-3 text-xs font-sans">
              <div class="flex justify-between items-center text-slate-600">
                <span class="text-slate-500">Nomor Registrasi:</span>
                <span class="font-mono text-slate-900 font-semibold">{{ candidateRegNo }}</span>
              </div>
              <div class="flex justify-between items-center text-slate-600">
                <span class="text-slate-500">Nama Calon Mahasiswa:</span>
                <span class="text-slate-900 font-medium">{{ candidateFullName }}</span>
              </div>
              <div class="flex justify-between items-center text-slate-600">
                <span class="text-slate-500">Program Studi Pilihan:</span>
                <span class="text-slate-900 font-medium">{{ activeProdiName }}</span>
              </div>
              <div class="flex justify-between items-center text-slate-600">
                <span class="text-slate-500">Uraian Pembayaran:</span>
                <span class="text-slate-900 font-medium">
                  {{ selectedInvoiceType === 'tuition' ? 'Uang Kuliah Tunggal (UKT) Semester 1' : 'Biaya Formulir Pendaftaran PMB' }}
                </span>
              </div>
              <div class="flex justify-between items-center text-slate-600">
                <span class="text-slate-500">Batas Waktu Pembayaran:</span>
                <span class="text-slate-800 font-medium">{{ activeDueDateFormatted }}</span>
              </div>
            </div>

            <!-- Total Nominal Tagihan -->
            <div class="pt-3 border-t border-slate-100 space-y-1.5">
              <div v-if="nextUnpaidInstallment" class="flex justify-between items-center text-[11px] text-slate-500">
                <span>Pembayaran Cicilan Termin Ke-{{ nextUnpaidInstallment.term }} (Total UKT: Rp {{ fullInvoiceAmount.toLocaleString('id-ID') }})</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="font-semibold text-slate-800 text-xs">{{ nextUnpaidInstallment ? `Tagihan Termin Ke-${nextUnpaidInstallment.term}:` : 'Total Tagihan:' }}</span>
                <strong class="font-sora font-bold text-lg sm:text-xl text-[#1E3A8A]">
                  Rp {{ currentInvoiceAmount.toLocaleString('id-ID') }}
                </strong>
              </div>
            </div>

            <!-- IN-PAGE PAYMENT GATEWAY NATIVE (TANPA POPUP DUITKU) -->
            <div class="pt-3 border-t border-slate-100 space-y-3 font-sans">
              <div>
                <label class="block font-semibold text-slate-800 text-xs">Pilih Kanal Pembayaran Online:</label>
              </div>

              <!-- Kategori Tabs: Virtual Account Bank vs QRIS -->
              <div class="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs">
                <button
                  type="button"
                  @click="switchPaymentCategory('va')"
                  class="flex-1 py-1.5 rounded-lg font-semibold text-center transition-all cursor-pointer"
                  :class="paymentCategoryTab === 'va' ? 'bg-white text-[#1E3A8A] shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                >
                  Virtual Account Bank
                </button>
                <button
                  type="button"
                  @click="switchPaymentCategory('qris')"
                  class="flex-1 py-1.5 rounded-lg font-semibold text-center transition-all cursor-pointer"
                  :class="paymentCategoryTab === 'qris' ? 'bg-white text-[#1E3A8A] shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                >
                  QRIS (Semua Bank / E-Wallet)
                </button>
              </div>

              <!-- Pilihan Bank VA jika Tab VA aktif -->
              <div v-if="paymentCategoryTab === 'va'" class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <button
                  v-for="bank in vaBankList"
                  :key="bank.code"
                  type="button"
                  @click="selectPaymentBank(bank)"
                  class="p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between"
                  :class="activeVaBank.code === bank.code
                    ? 'border-[#1E3A8A] bg-blue-50/70 ring-1 ring-[#1E3A8A]'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'"
                >
                  <div class="flex items-center justify-between mb-2">
                    <div class="h-6 flex items-center bg-white px-2 py-0.5 rounded border border-slate-100 shadow-2xs">
                      <img :src="bank.logo" :alt="bank.name" class="h-4 max-w-[70px] object-contain" />
                    </div>
                  </div>
                  <div>
                    <span class="font-bold text-xs text-slate-900 block leading-tight">{{ bank.name }}</span>
                    <span class="text-[10px] text-slate-500 mt-1 block truncate">{{ bank.hint }}</span>
                  </div>
                </button>
              </div>

              <!-- Card Detail Pembayaran (Clean & Modern Banking UI) -->
              <div class="mt-3 p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-slate-50/70 space-y-4 shadow-2xs">
                <!-- Header Bank & Status Tag -->
                <div class="flex items-center justify-between pb-3 border-b border-slate-200/70">
                  <div class="flex items-center gap-3">
                    <div class="h-10 px-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs flex-shrink-0">
                      <img
                        v-if="paymentCategoryTab === 'qris'"
                        src="/assets/icons/banks/qris.png"
                        alt="QRIS"
                        class="h-6 w-auto object-contain"
                      />
                      <img
                        v-else
                        :src="activeVaBank.logo"
                        :alt="activeVaBank.name"
                        class="h-6 w-auto max-w-[85px] object-contain"
                      />
                    </div>
                    <div>
                      <div class="font-bold text-xs sm:text-sm text-slate-900">
                        {{ paymentCategoryTab === 'qris' ? 'QRIS Pembayaran PMB' : (activeVaBank.name.includes('Virtual Account') ? activeVaBank.name : `${activeVaBank.name} Virtual Account`) }}
                      </div>
                    </div>
                  </div>
                  <span class="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80">
                    Menunggu Pembayaran
                  </span>
                </div>

                <!-- Tampilan Nomor VA -->
                <div v-if="paymentCategoryTab === 'va'" class="space-y-1.5">
                  <span class="block text-[11px] font-medium text-slate-500">
                    Nomor Virtual Account Pembayaran
                  </span>
                  <div class="flex items-center justify-between gap-3 bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span class="font-mono font-bold text-base sm:text-lg tracking-wider text-slate-900 select-all">
                      {{ displayedVaNumber }}
                    </span>
                    <button
                      type="button"
                      @click="copyToClipboard(displayedVaNumber, 'Nomor Virtual Account')"
                      class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 active:scale-95 text-slate-700 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                    >
                      <Copy class="w-3.5 h-3.5 text-slate-500" />
                      <span>{{ copiedType === 'Nomor Virtual Account' ? 'Tersalin!' : 'Salin Nomor' }}</span>
                    </button>
                  </div>
                </div>

                <!-- Tampilan QRIS Resmi & Realistis Standar Bank Indonesia / ASPI -->
                <div v-else class="py-2 flex flex-col items-center">
                  <div class="w-full max-w-[280px] bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 flex flex-col items-center text-center">
                    <!-- Header Standar QRIS: Merchant & NMID -->
                    <div class="w-full pb-3 mb-3 border-b border-slate-100 flex flex-col items-center">
                      <img src="/assets/icons/banks/qris.png" alt="QRIS Standar Pembayaran Nasional" class="h-7 w-auto object-contain mb-1.5" />
                      <span class="font-sora font-bold text-xs tracking-wide text-slate-900 uppercase">
                        Universitas Bakti Tunas Husada
                      </span>
                      <span class="text-[10px] text-slate-500 font-mono mt-0.5">
                        NMID: ID1024319482103 • A01
                      </span>
                    </div>

                    <!-- Kotak QR Code Realistis -->
                    <div class="p-2.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-center">
                      <img
                        :src="backendQrImageUrl || qrisDataUrl || '/assets/icons/banks/qris-code.svg'"
                        alt="QRIS Universitas Bakti Tunas Husada"
                        class="w-48 h-48 sm:w-52 sm:h-52 object-contain select-none"
                      />
                    </div>

                    <!-- Aksi Unduh QR Code & Keterangan -->
                    <div class="mt-3 w-full flex flex-col items-center gap-2">
                      <span class="text-[11px] text-slate-500 font-medium leading-tight">
                        Pindai kode QR melalui aplikasi m-Banking atau e-Wallet
                      </span>
                      <button
                        type="button"
                        @click="downloadQrisCode"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        <Download class="w-3.5 h-3.5 text-slate-500" />
                        <span>Unduh Kode QR</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Total Jumlah Bayar (Tanpa Salin Jumlah) -->
                <div class="flex items-center justify-between pt-3 border-t border-slate-200/70 text-xs">
                  <span class="text-slate-600 font-medium text-xs">Total Jumlah Bayar:</span>
                  <span class="font-sora font-extrabold text-base sm:text-lg text-slate-900">
                    Rp {{ currentInvoiceAmount.toLocaleString('id-ID') }}
                  </span>
                </div>
              </div>

              <!-- Panduan Cara Bayar (Accordion) -->
              <div class="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <button
                  type="button"
                  @click="showInstructions = !showInstructions"
                  class="w-full p-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-semibold text-slate-800 transition-colors cursor-pointer"
                >
                  <span class="flex items-center gap-2">
                    <img v-if="paymentCategoryTab === 'va'" :src="activeVaBank.logo" :alt="activeVaBank.name" class="h-4 max-w-[60px] object-contain" />
                    <img v-else src="/assets/icons/banks/qris.png" alt="QRIS" class="h-3.5 w-auto object-contain" />
                    <span>Petunjuk Pembayaran ({{ paymentCategoryTab === 'va' ? activeVaBank.shortName : 'QRIS' }})</span>
                  </span>
                  <ChevronDown class="w-4 h-4 text-slate-500 transition-transform" :class="{ 'rotate-180': showInstructions }" />
                </button>
                <div v-show="showInstructions" class="p-3.5 space-y-2 bg-white text-slate-600 leading-relaxed font-sans border-t border-slate-100">
                  <ol class="list-decimal list-inside space-y-1.5 text-[11px]">
                    <li v-if="paymentCategoryTab === 'va'">Buka aplikasi {{ activeVaBank.appHint || activeVaBank.name }}.</li>
                    <li v-else>Buka aplikasi perbankan atau dompet digital (m-Banking / E-Wallet).</li>
                    <li v-if="paymentCategoryTab === 'va'">Pilih menu <strong>Bayar / Pembayaran &gt; Virtual Account</strong>.</li>
                    <li v-else>Pilih fitur <strong>Scan / Bayar QRIS</strong>.</li>
                    <li v-if="paymentCategoryTab === 'va'">Masukkan nomor Virtual Account: <strong class="font-mono text-slate-900">{{ displayedVaNumber }}</strong>.</li>
                    <li v-else>Arahkan kamera ke kode QRIS di atas.</li>
                    <li>Pastikan nama penerima tertera <strong>Universitas Bakti Tunas Husada (PMB BTH)</strong> dengan data tagihan atas nama calon mahasiswa <strong>{{ candidateFullName }}</strong>.</li>
                    <li>Periksa kesesuaian total pembayaran sebesar <strong>Rp {{ currentInvoiceAmount.toLocaleString('id-ID') }}</strong>, lalu selesaikan transaksi.</li>
                  </ol>
                </div>
              </div>

              <!-- Unggah Bukti Transfer Manual (Opsional jika transfer langsung rekening resmi kampus) -->
              <div class="border border-dashed border-slate-300 rounded-xl p-3.5 bg-slate-50/70 space-y-2 text-xs">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div class="font-semibold text-slate-800">Transfer Manual Bank (BSI: 7001234567 a.n. Universitas BTH)</div>
                    <p class="text-[11px] text-slate-500">
                      Jika sudah mentransfer secara manual di teller/ATM tanpa Virtual Account, unggah bukti transfer (JPG/PNG/PDF, maks. 5 MB).
                    </p>
                  </div>
                  <label
                    class="inline-flex items-center justify-center px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg text-[11px] cursor-pointer transition-colors whitespace-nowrap"
                    :class="{ 'opacity-60 pointer-events-none': isUploadingProof }"
                  >
                    <span>{{ isUploadingProof ? 'Mengunggah...' : 'Unggah Bukti Transfer' }}</span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      class="hidden"
                      :disabled="isUploadingProof"
                      @change="handleManualTransferUpload"
                    />
                  </label>
                </div>
              </div>

              <!-- Bantuan Kendala Pembayaran -->
              <div class="text-[11px] text-slate-500 flex items-center justify-between gap-2 pt-1">
                <span>Mengalami kendala pembayaran atau verifikasi tagihan?</span>
                <a
                  :href="cmsStore.contact.whatsappLink || 'https://api.whatsapp.com/send?phone=6282117100200'"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-semibold text-[#1E3A8A] hover:underline whitespace-nowrap"
                >
                  Helpdesk WA ({{ cmsStore.contact.whatsapp || '0821-1710-0200' }})
                </a>
              </div>

              <!-- Tombol Cek Status & Simulasi Bayar Berhasil (In-page) -->
              <div class="pt-2 space-y-3">
                <!-- Panel Sandbox / Simulator Webhook Transaksi (Mode Dummy/Dev/Demo Staging) -->
                <div v-if="isDummyMode" class="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl space-y-2.5">
                  <div class="flex items-center justify-between">
                    <span class="inline-flex items-center gap-1.5 text-[11px] font-sora font-bold text-[#1E3A8A]">
                      <Zap class="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>Pengujian Sandbox & Simulasi Webhook (Demo Mode)</span>
                    </span>
                    <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-[#1E3A8A] font-semibold">
                      Duitku Sandbox Mock
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-600 font-sans leading-relaxed">
                    Karena Anda berada di lingkungan pengujian (sandbox/demo), Anda dapat memicu notifikasi webhook bank langsung tanpa transfer nyata, atau mengecek respons gateway.
                  </p>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <!-- Tombol 1: Trigger Webhook Simulasi Lunas -->
                    <button
                      type="button"
                      @click="triggerSandboxWebhookSimulation"
                      :disabled="isSimulatingWebhook || isCheckingStatus"
                      class="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-sora font-semibold rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50 text-center flex items-center justify-center gap-2 shadow-2xs"
                      title="Memicu webhook pelunasan seolah-olah calon mahasiswa telah transfer di ATM/m-Banking"
                    >
                      <Zap class="w-4 h-4 text-amber-300 fill-amber-300" :class="{ 'animate-pulse': isSimulatingWebhook }" />
                      <span>{{ isSimulatingWebhook ? 'Memproses Webhook...' : 'Simulasikan Bayar (Webhook)' }}</span>
                    </button>

                    <!-- Tombol 2: Cek Status Pembayaran ke Bank/Gateway -->
                    <button
                      type="button"
                      @click="checkPaymentStatus(false)"
                      :disabled="isCheckingStatus || isSimulatingWebhook"
                      class="w-full py-2.5 px-3 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50 text-center flex items-center justify-center gap-2 shadow-2xs"
                      title="Mengecek ke server bank apakah mutasi sudah masuk"
                    >
                      <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isCheckingStatus }" />
                      <span>{{ isCheckingStatus ? 'Menghubungi Bank...' : 'Cek Status Pembayaran' }}</span>
                    </button>
                  </div>
                </div>

                <!-- Tombol Produksi Real Gateway (Jika Dummy Mode Nonaktif) -->
                <div v-else class="space-y-2">
                  <button
                    type="button"
                    @click="checkPaymentStatus(false)"
                    :disabled="isCheckingStatus"
                    class="w-full py-2.5 px-4 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer disabled:opacity-50 text-center flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isCheckingStatus }" />
                    <span>{{ isCheckingStatus ? 'Memeriksa ke Sistem Bank...' : 'Cek Status Pembayaran Sekarang' }}</span>
                  </button>
                  <p class="text-[11px] text-slate-500 text-center font-sans">
                    Sistem mendeteksi pelunasan perbankan secara otomatis dalam beberapa detik setelah Anda menyelesaikan transfer. Anda juga dapat menekan tombol di atas untuk sinkronisasi seketika.
                  </p>
                </div>
              </div>

              <!-- Opsi Batalkan Pendaftaran (Hanya Tampil Sebelum Bayar Pendaftaran) -->
              <div v-if="selectedInvoiceType === 'registration' && applicantStore.canCancelAdmission" class="pt-2 border-t border-slate-100 text-center">
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

        <!-- Kolom Kanan: Kode Referal Sekolah Mitra (Col 5) -->
        <div class="lg:col-span-5 space-y-4">
          <!-- Card Kode Referal (Khusus Pendaftaran) -->
          <div
            v-if="selectedInvoiceType === 'registration'"
            class="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4"
          >
            <div class="border-b border-slate-100 pb-3 flex items-start justify-between">
              <div>
                <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
                  Kode Referal Kemitraan BK
                </h3>
                <p class="text-xs text-slate-500 mt-0.5 font-sans leading-relaxed">
                  Gunakan kode referal dari Guru BK mitra untuk pembebasan biaya formulir pendaftaran.
                </p>
              </div>
              <span
                v-if="applicantStore.state?.referral?.isApplied"
                class="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wide flex-shrink-0"
              >
                Aktif
              </span>
            </div>

            <!-- JIKA SUDAH BERHASIL DITERAPKAN (TERHUBUNG KE GURU BK) -->
            <div
              v-if="applicantStore.state?.referral?.isApplied"
              class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 space-y-3 font-sans shadow-2xs"
            >
              <div class="flex items-center justify-between pb-2 border-b border-slate-200">
                <div class="flex items-center gap-2">
                  <CheckCircle2 class="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span class="font-bold text-xs text-slate-900 font-sora">Akun Terhubung dengan Mitra Guru BK</span>
                </div>
                <span class="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Terverifikasi
                </span>
              </div>

              <div class="bg-white rounded-lg p-3 border border-slate-200 space-y-2 text-xs">
                <div class="flex justify-between items-center">
                  <span class="text-slate-500">Kode Referal:</span>
                  <span class="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-xs">
                    {{ applicantStore.state.referral.code }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-500">Asal Sekolah:</span>
                  <strong class="text-slate-800">{{ applicantStore.state.referral.schoolName }}</strong>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-500">Guru BK / PIC:</span>
                  <strong class="text-slate-800">{{ applicantStore.state.referral.picName }}</strong>
                </div>
                <div class="flex justify-between items-center pt-1 border-t border-slate-100">
                  <span class="text-slate-500">Status Biaya Formulir:</span>
                  <span class="font-bold text-emerald-700">Rp 0 (Bebas Biaya / Lunas)</span>
                </div>
              </div>

              <div class="flex items-center justify-between pt-1">
                <span class="text-[11px] text-slate-500">Data telah tersambung ke Portal Guru BK</span>
                <button
                  type="button"
                  @click="handleRemoveReferral"
                  class="text-[11px] text-slate-500 hover:text-rose-600 hover:underline font-medium cursor-pointer"
                >
                  Ganti / Batalkan Kode
                </button>
              </div>
            </div>

            <!-- JIKA BELUM DITERAPKAN (FORM INPUT KODE) -->
            <div v-else class="space-y-3 font-sans">
              <div class="space-y-1.5">
                <label class="block text-xs font-medium text-slate-700">
                  Kode Referal BK / Sekolah Mitra
                </label>
                <div class="flex items-center gap-2">
                  <input
                    v-model="referralInputCode"
                    type="text"
                    placeholder="Contoh: BKPOLOS2026 / MARHASBISA"
                    class="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-medium text-slate-900 outline-none focus:bg-white focus:border-[#1E3A8A] uppercase transition-colors"
                    :disabled="isApplyingReferral || referralCooldown > 0"
                    @keyup.enter="handleCheckReferral"
                  />
                  <button
                    type="button"
                    @click="handleCheckReferral"
                    :disabled="!referralInputCode.trim() || isApplyingReferral || referralCooldown > 0"
                    class="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap text-center shadow-2xs"
                  >
                    {{ referralCooldown > 0 ? `Tunggu (${referralCooldown}s)` : (isApplyingReferral ? 'Memvalidasi...' : 'Verifikasi Kode') }}
                  </button>
                </div>
                <p v-if="referralCooldown > 0" class="text-[11px] text-rose-600 font-medium">
                  Input dibatasi sementara karena 3x salah memasukkan kode. Mohon hubungi Guru BK Anda untuk mendapatkan kode resmi.
                </p>
                <p v-else class="text-[11px] text-slate-500">
                  Abaikan jika mendaftar mandiri/reguler. Masukkan kode hanya jika Anda mendaftar melalui kemitraan Guru BK sekolah mitra Anda.
                </p>
              </div>

              <!-- Hasil Verifikasi & Konfirmasi Akurat -->
              <div
                v-if="referralValidationResult"
                class="p-4 rounded-xl text-xs space-y-3 border transition-all animate-fadeIn"
                :class="referralValidationResult.valid ? 'bg-white border-slate-200 text-slate-800 shadow-2xs' : 'bg-rose-50 border-rose-200 text-rose-900'"
              >
                <!-- Jika Kode Akurat & Valid: Tampilkan Rincian Mitra Sebelum Diterapkan -->
                <div v-if="referralValidationResult.valid" class="space-y-2.5">
                  <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div class="flex items-center gap-2">
                      <CheckCircle2 class="w-4 h-4 text-emerald-600" />
                      <span class="font-bold text-slate-900 font-sora">Kode Terdaftar di Sistem Mitra BK</span>
                    </div>
                    <span class="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                      Valid
                    </span>
                  </div>

                  <div class="bg-slate-50 rounded-lg p-3 border border-slate-200/80 space-y-1.5 text-xs">
                    <div class="flex justify-between items-center">
                      <span class="text-slate-500">Kode Resmi:</span>
                      <strong class="font-mono text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded">{{ referralValidationResult.code }}</strong>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-slate-500">Mitra Sekolah:</span>
                      <strong class="text-slate-800">{{ referralValidationResult.partner.schoolName }}</strong>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-slate-500">Guru BK / PIC:</span>
                      <strong class="text-slate-800">{{ referralValidationResult.partner.picName }}</strong>
                    </div>
                    <div class="flex justify-between items-center pt-1 border-t border-slate-200">
                      <span class="text-slate-500">Keringanan Biaya:</span>
                      <span class="font-bold text-emerald-700">Rp 0 (Bebas Biaya Formulir)</span>
                    </div>
                  </div>

                  <p class="text-[11px] text-slate-600 leading-relaxed">
                    Dengan mengonfirmasi, data pendaftaran Anda akan langsung terhubung ke dashboard Guru BK <strong>{{ referralValidationResult.partner.picName }}</strong>.
                  </p>

                  <div class="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      @click="confirmApplyReferral"
                      class="flex-1 py-2 px-3 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <CheckCircle2 class="w-3.5 h-3.5" />
                      <span>Konfirmasi & Terapkan Kode</span>
                    </button>
                    <button
                      type="button"
                      @click="cancelReferralCheck"
                      class="py-2 px-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                </div>

                <!-- Jika Kode Tidak Akurat / Salah -->
                <div v-else class="space-y-1.5">
                  <div class="flex items-center gap-1.5 font-bold text-rose-800">
                    <AlertCircle class="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>Kode Tidak Valid / Tidak Akurat</span>
                  </div>
                  <p class="text-[11px] text-rose-700 leading-relaxed">
                    {{ referralValidationResult.message }}
                  </p>
                  <p class="text-[10px] text-slate-500 italic pt-1">
                    Sistem hanya menerima kode resmi yang terdaftar di portal Guru BK. Pastikan tidak ada kesalahan ketik huruf atau angka.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL PENGAJUAN CICILAN UKT (CR-010) -->
    <Teleport to="body">
      <div
        v-if="openInstallmentModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
      >
        <div class="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
          <div class="p-6 space-y-4">
            <div class="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 class="text-base font-sora font-bold text-slate-900">
                  Pengajuan Keringanan Cicilan UKT
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">
                  Pilih skema termin pembayaran bertahap untuk semester 1.
                </p>
              </div>
              <button
                type="button"
                @click="openInstallmentModal = false"
                class="text-slate-400 hover:text-slate-600 font-bold text-lg p-1 leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div class="space-y-3.5 text-xs">
              <div>
                <label class="block font-medium text-slate-700 mb-1">Skema Termin Cicilan</label>
                <select
                  v-model="installmentForm.terms"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs outline-none focus:border-[#1E3A8A]"
                >
                  <option :value="2">2 Kali Cicilan (Termin 1: 50%, Termin 2: 50%)</option>
                  <option :value="3">3 Kali Cicilan (Termin 1: 40%, Termin 2: 30%, Termin 3: 30%)</option>
                </select>
              </div>

              <!-- Simulasi Nominal Rinci -->
              <div class="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
                <div class="font-semibold text-slate-800">Simulasi Jadwal Pembayaran:</div>
                <div v-for="sim in simulatedInstallments" :key="sim.term" class="flex justify-between items-center text-[11px]">
                  <span class="text-slate-600">Cicilan {{ sim.term }} ({{ sim.percentage }}%):</span>
                  <strong class="text-slate-900 font-mono">Rp {{ sim.amount.toLocaleString('id-ID') }}</strong>
                </div>
              </div>

              <div>
                <label class="block font-medium text-slate-700 mb-1">Alasan Pengajuan Keringanan Cicilan</label>
                <textarea
                  v-model="installmentForm.reason"
                  rows="3"
                  required
                  placeholder="Jelaskan kondisi ekonomi / pertimbangan yang mendasari permohonan pembayaran bertahap..."
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs outline-none focus:border-[#1E3A8A]"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              @click="openInstallmentModal = false"
              class="px-4 py-2 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              @click="submitInstallmentApplication"
              :disabled="isSubmittingInstallment || !installmentForm.reason.trim()"
              class="px-4 py-2 rounded bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              {{ isSubmittingInstallment ? 'Mengirim Pengajuan...' : 'Kirim Pengajuan Cicilan' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>



    <!-- MODAL BATALKAN PENDAFTARAN RESMI -->
    <Teleport to="body">
      <div
        v-if="showCancelConfirmModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
      >
        <div class="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
          <div class="p-6">
            <h3 class="text-base font-semibold text-slate-900 leading-snug">
              Batalkan Pilihan Program Studi?
            </h3>
            <p class="text-xs text-slate-500 mt-1">
              Program studi: <span class="font-medium text-slate-800">{{ activeProdiName }}</span>
            </p>

            <div class="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600 leading-relaxed font-sans">
              <p>
                Pilihan program studi saat ini akan dibatalkan dari sistem. Anda dapat memilih kembali program studi atau jalur seleksi lain pada formulir pendaftaran.
              </p>
              <p class="text-slate-400">
                Catatan: Pembatalan hanya dapat dilakukan sebelum biaya formulir pendaftaran dibayarkan.
              </p>
            </div>
          </div>

          <div class="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              @click="showCancelConfirmModal = false"
              :disabled="isCancelling"
              class="px-4 py-2 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              Kembali
            </button>
            <button
              type="button"
              @click="handleCancelAdmission"
              :disabled="isCancelling"
              class="px-4 py-2 rounded bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              {{ isCancelling ? 'Membatalkan...' : 'Ya, Batalkan Pilihan' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { Copy, RefreshCw, ChevronDown, Download, AlertCircle, CheckCircle2, ChevronRight, Zap } from 'lucide-vue-next';
import QRCode from 'qrcode';
import { useApplicantStore } from '@/stores/applicant';
import { useAuthStore } from '@/stores/auth';
import { useReferralStore } from '@/stores/referral';
import { useCmsStore } from '@/stores/cms';
import { financeApi } from '@/api/finance';
import { referralApi } from '@/api/referral';
import { useToast } from '@/composables/useToast';

const emit = defineEmits(['switch-tab']);
const applicantStore = useApplicantStore();
const authStore = useAuthStore();
const referralStore = useReferralStore();
const cmsStore = useCmsStore();
const toast = useToast();

// State In-Page Payment Gateway Native
const paymentCategoryTab = ref('va'); // 'va' | 'qris'
const showInstructions = ref(true);
const copiedType = ref(null);

const vaBankList = ref([
  {
    code: 'bsi',
    duitkuCode: 'BV',
    name: 'Bank Syariah Indonesia (BSI)',
    shortName: 'BSI',
    isDefault: true,
    hint: 'Bebas Biaya Admin • Bank Utama BTH',
    logo: '/assets/icons/banks/bsi.svg',
    appHint: 'BSI Mobile atau ATM BSI / Bersama',
  },
  {
    code: 'bca',
    duitkuCode: 'BC',
    name: 'BCA Virtual Account',
    shortName: 'BCA',
    hint: 'Transfer Otomatis 24 Jam',
    logo: '/assets/icons/banks/bca.svg',
    appHint: 'BCA Mobile, myBCA, KlikBCA, atau ATM BCA',
  },
  {
    code: 'mandiri',
    duitkuCode: 'M2',
    name: 'Mandiri Virtual Account',
    shortName: 'Mandiri',
    hint: 'Livin by Mandiri & ATM',
    logo: '/assets/icons/banks/mandiri.svg',
    appHint: "Livin' by Mandiri atau ATM Bank Mandiri",
  },
  {
    code: 'bri',
    duitkuCode: 'BR',
    name: 'BRI Virtual Account (BRIVA)',
    shortName: 'BRI',
    hint: 'BRImo & Seluruh Agen BRILink',
    logo: '/assets/icons/banks/bri.svg',
    appHint: 'BRImo, ATM BRI, atau Agen BRILink',
  },
  {
    code: 'bni',
    duitkuCode: 'I1',
    name: 'BNI Virtual Account',
    shortName: 'BNI',
    hint: 'BNI Mobile & ATM',
    logo: '/assets/icons/banks/bni.svg',
    appHint: 'BNI Mobile Banking atau ATM BNI',
  },
  {
    code: 'cimb',
    duitkuCode: 'B1',
    name: 'CIMB Niaga Virtual Account',
    shortName: 'CIMB',
    hint: 'OCTO Mobile & CIMB Clicks',
    logo: '/assets/icons/banks/cimb.svg',
    appHint: 'OCTO Mobile atau ATM CIMB Niaga',
  },
]);

const activeVaBank = ref(vaBankList.value[0]);

const referralInputCode = ref('');
const isApplyingReferral = ref(false);
const referralValidationResult = ref(null);
const failedReferralAttempts = ref(0);
const referralCooldown = ref(0);
let cooldownTimer = null;

const startCooldown = (seconds = 30) => {
  referralCooldown.value = seconds;
  if (cooldownTimer) clearInterval(cooldownTimer);
  cooldownTimer = setInterval(() => {
    referralCooldown.value--;
    if (referralCooldown.value <= 0) {
      clearInterval(cooldownTimer);
      cooldownTimer = null;
      failedReferralAttempts.value = 0;
    }
  }, 1000);
};

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer);
});

// Verifikasi kode akurat ke backend / database kemitraan Guru BK
const handleCheckReferral = async () => {
  if (referralCooldown.value > 0) {
    toast.warning(`Input sedang dibatasi. Mohon tunggu ${referralCooldown.value} detik.`);
    return;
  }
  const clean = referralInputCode.value.trim().toUpperCase();
  if (!clean) {
    toast.info('Silakan masukkan kode referal terlebih dahulu.');
    return;
  }

  isApplyingReferral.value = true;
  try {
    let found = null;
    try {
      const apiRes = await referralApi.checkCode(clean);
      const data = apiRes?.data?.data || apiRes?.data;
      if (data?.valid) {
        const localMatch = referralStore.findReferralByCode(clean);
        found = {
          code: clean,
          schoolName: data.institution_name || localMatch?.schoolName || 'Sekolah Mitra PMB',
          picName: data.pic_name || localMatch?.picName || 'Guru BK Mitra',
        };
      }
    } catch {
      // Fallback ke store lokal hanya jika endpoint tidak dapat dijangkau
      found = referralStore.findReferralByCode(clean);
    }

    if (!found) {
      found = referralStore.findReferralByCode(clean);
    }

    if (found) {
      failedReferralAttempts.value = 0;
      referralValidationResult.value = {
        valid: true,
        code: found.code || clean,
        partner: found,
        message: `Kode resmi ${found.code || clean} terverifikasi. Mitra: ${found.picName} – ${found.schoolName}.`,
      };
      toast.success(`Kode ${found.code || clean} akurat dan terverifikasi di sistem BK! Silakan konfirmasi untuk menerapkan.`);
    } else {
      failedReferralAttempts.value++;
      const remaining = 3 - failedReferralAttempts.value;
      if (failedReferralAttempts.value >= 3) {
        startCooldown(30);
        referralValidationResult.value = {
          valid: false,
          message: 'Kode referal salah 3 kali berturut-turut. Penginputan dikunci sementara selama 30 detik untuk mencegah pengisian asal. Hubungi Guru BK sekolah Anda untuk mendapatkan kode resmi yang akurat.',
        };
        toast.error('Batas kesalahan tercapai. Input dikunci selama 30 detik.');
      } else {
        referralValidationResult.value = {
          valid: false,
          message: `Kode "${clean}" tidak ditemukan di database resmi mitra Guru BK. Mohon pastikan kode yang Anda masukkan akurat sesuai yang diterbitkan oleh Guru BK (Sisa percobaan: ${remaining} kali).`,
        };
        toast.error(`Kode referal "${clean}" tidak akurat / tidak terdaftar.`);
      }
    }
  } finally {
    isApplyingReferral.value = false;
  }
};

// Batalkan hasil cek
const cancelReferralCheck = () => {
  referralValidationResult.value = null;
  referralInputCode.value = '';
};

// Konfirmasi & Terapkan Kode Resmi ke Backend + Akun Siswa dan Dashboard Guru BK
const confirmApplyReferral = async () => {
  if (!referralValidationResult.value?.valid || !referralValidationResult.value?.partner) return;
  const partner = referralValidationResult.value.partner;
  const code = referralValidationResult.value.code || partner.code;
  const appId = applicantStore.state?.admission?.id || null;

  isApplyingReferral.value = true;
  try {
    const token = localStorage.getItem('access_token');
    const isRealSession = token && !token.startsWith('mock_') && !token.startsWith('bk_token_') && !token.startsWith('mkt_token_');
    if (isRealSession) {
      try {
        await referralApi.attachCode(code, true, appId);
      } catch (apiErr) {
        const errCode = apiErr?.response?.data?.code;
        const status = apiErr?.response?.status;
        if (errCode === 'REFERRAL_LOCKED' || status === 409) {
          toast.error(apiErr?.response?.data?.message || 'Kode referal sudah terkunci dan tidak dapat diubah lagi.');
          return;
        }
        if (status === 404 || status === 422 || status === 400) {
          toast.error(apiErr?.response?.data?.message || 'Kode referal tidak valid di server.');
          return;
        }
      }
    }

    const res = applicantStore.applyReferralCode(code);
    if (!res.success && token) {
      // Tetap sinkronkan state referal lokal bila kode valid dari backend namun belum ada di localStorage browser ini
      applicantStore.state.referral = {
        code,
        picName: partner.picName || 'Guru BK Mitra',
        schoolName: partner.schoolName || 'Sekolah Mitra PMB',
        appliedAt: new Date().toISOString(),
        isApplied: true,
      };
    }

    await fetchInvoices();
    toast.success(`Kode referal ${code} resmi diterapkan! Akun Anda terhubung ke ${partner.picName} (${partner.schoolName}).`);
    referralValidationResult.value = null;
    referralInputCode.value = '';
  } finally {
    isApplyingReferral.value = false;
  }
};

const handleRemoveReferral = async () => {
  const appId = applicantStore.state?.admission?.id || null;
  const token = localStorage.getItem('access_token');
  const isRealSession = token && !token.startsWith('mock_') && !token.startsWith('bk_token_') && !token.startsWith('mkt_token_');
  if (isRealSession) {
    try {
      await referralApi.removeMyReferral(appId);
    } catch (apiErr) {
      if (apiErr?.response?.status === 409 || apiErr?.response?.data?.code === 'REFERRAL_LOCKED') {
        toast.error('Kode referal sudah terverifikasi dan tidak dapat dibatalkan.');
        return;
      }
    }
  }

  const res = applicantStore.removeReferralCode();
  if (res.success) {
    await fetchInvoices();
    toast.info('Kode referal telah dibatalkan.');
    referralInputCode.value = '';
    referralValidationResult.value = null;
  }
};

const showCancelConfirmModal = ref(false);
const openInstallmentModal = ref(false);

// Mode Payment Gateway: Real Gateway vs Sandbox Dev / Demo Staging (Skenario A)
const allowSimulatorByEnv = import.meta.env.VITE_ENABLE_SANDBOX_SIMULATOR === 'true';
const isDummyMode = ref(allowSimulatorByEnv || import.meta.env.DEV);
const paymentConfig = ref(null);
let dummyAutoConfirmTimer = null;

const loadPaymentConfig = async () => {
  try {
    const res = await financeApi.getPaymentConfig().catch(() => null);
    if (res?.data) {
      paymentConfig.value = res.data;
      if (allowSimulatorByEnv || (import.meta.env.DEV && res.data.can_simulate === true)) {
        isDummyMode.value = true;
      } else {
        isDummyMode.value = false;
      }
    } else {
      isDummyMode.value = allowSimulatorByEnv || import.meta.env.DEV;
    }
  } catch {
    isDummyMode.value = allowSimulatorByEnv || import.meta.env.DEV;
  }
};

const selectedInvoiceType = ref('registration'); // 'registration' | 'tuition'
const selectedVaBank = ref('bsi');
const activeInvoiceId = ref(null);
const activePaymentId = ref(null);
const activePaymentData = ref(null);
const backendVaNumber = ref('');
const backendQrString = ref('');
const backendQrImageUrl = ref('');
const duitkuPaymentUrl = ref('');
const isRenewing = ref(false);
const isCancelling = ref(false);
const isSubmittingInstallment = ref(false);
const isLoadingInvoices = ref(false);
const isCheckingStatus = ref(false);
const isUploadingProof = ref(false);
const installmentForm = ref({ terms: 2, reason: '' });
const backendInvoices = ref([]);

const getSelectedDirectMethodCode = () => {
  if (paymentCategoryTab.value === 'qris') return 'NQ';
  return activeVaBank.value?.duitkuCode || 'BV';
};

const ensureDirectPaymentForSelectedMethod = async (forceRefresh = false) => {
  if (!currentInvoice.value?.id || isCurrentInvoicePaid.value || isCurrentInvoiceExpired.value) {
    return null;
  }
  const methodCode = getSelectedDirectMethodCode();
  try {
    const res = await financeApi.createDirectPayment(currentInvoice.value.id, methodCode);
    const pay = res?.data?.data || res?.data;
    if (pay && pay.payment_id) {
      activePaymentId.value = pay.payment_id;
      activePaymentData.value = pay;
      backendVaNumber.value = pay.va_number || '';
      backendQrString.value = pay.qr_string || '';
      backendQrImageUrl.value = pay.qr_image_url || '';
      if (pay.payment_url) {
        duitkuPaymentUrl.value = pay.payment_url;
      }
      await updateQrisCode();
      return pay;
    }
  } catch (err) {
    if (!forceRefresh) {
      console.warn('Direct payment init notice:', err?.response?.data?.message || err?.message);
    }
  }
  return null;
};

const selectPaymentBank = async (bank) => {
  activeVaBank.value = bank;
  selectedVaBank.value = bank.code;
  backendVaNumber.value = '';
  await ensureDirectPaymentForSelectedMethod();
};

const switchPaymentCategory = async (category) => {
  paymentCategoryTab.value = category;
  await ensureDirectPaymentForSelectedMethod();
  if (category === 'qris') {
    await updateQrisCode();
  }
};

const copyToClipboard = async (text, label) => {
  const str = String(text);
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(str);
    }
  } catch {
    // fallback
  }
  copiedType.value = label;
  toast.success(`${label} berhasil disalin.`);
  setTimeout(() => {
    if (copiedType.value === label) {
      copiedType.value = null;
    }
  }, 2500);
};

const qrisDataUrl = ref('');

function crc16(str) {
  let crc = 0xFFFF;
  for (let c = 0; c < str.length; c++) {
    crc ^= str.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function buildQrisPayload(amount, regNo) {
  const amt = amount || 250000;
  const reg = regNo || 'BTH-2026-REG-9211';
  const amtStr = String(amt);
  const tag54 = `54${String(amtStr.length).padStart(2, '0')}${amtStr}`;
  const billInfo = `01${String(reg.length).padStart(2, '0')}${reg}`;
  const tag62 = `62${String(billInfo.length).padStart(2, '0')}${billInfo}`;
  
  const mpan = '0016ID.CO.DUITKU.WWW01189360091100223344550215000000000000000';
  const tag26 = `26${String(mpan.length).padStart(2, '0')}${mpan}`;
  
  const merchantName = 'UNIVERSITAS BAKTI TUNAS H';
  const tag59 = `59${String(merchantName.length).padStart(2, '0')}${merchantName}`;
  
  const city = 'TASIKMALAYA';
  const tag60 = `60${String(city.length).padStart(2, '0')}${city}`;
  
  const postal = '46115';
  const tag61 = `61${String(postal.length).padStart(2, '0')}${postal}`;

  const raw = `000201010212${tag26}520482205303360${tag54}5802ID${tag59}${tag60}${tag61}${tag62}6304`;
  const checksum = crc16(raw);
  return raw + checksum;
}

const updateQrisCode = async () => {
  const payload = backendQrString.value || buildQrisPayload(currentInvoiceAmount.value, candidateRegNo.value);
  try {
    qrisDataUrl.value = await QRCode.toDataURL(payload, {
      margin: 1,
      width: 400,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('QR code generation notice:', err);
  }
};

const downloadQrisCode = () => {
  const link = document.createElement('a');
  link.href = backendQrImageUrl.value || qrisDataUrl.value || '/assets/icons/banks/qris-code.svg';
  link.download = `QRIS-PMB-BTH-${candidateRegNo.value || 'INVOICE'}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success('Kode QRIS berhasil diunduh ke perangkat Anda.');
};

const candidate = computed(() => applicantStore.state.candidate);
const admission = computed(() => applicantStore.state.admission);
const regPayment = computed(() => applicantStore.state.payments.registrationFee);
const uktPayment = computed(() => applicantStore.state.payments.uktFee);

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

const isTuitionFeeType = (feeType) => {
  return ['tuition', 'ukt', 'reregistration'].includes(String(feeType || '').toLowerCase());
};

// Deteksi Invoice Aktif Berdasarkan selectedInvoiceType
const currentInvoice = computed(() => {
  if (selectedInvoiceType.value === 'tuition') {
    return backendInvoices.value.find((i) => isTuitionFeeType(i.fee_type));
  }
  return backendInvoices.value.find((i) => i.fee_type === 'registration');
});

const hasTuitionInvoice = computed(() => {
  return backendInvoices.value.some((i) => isTuitionFeeType(i.fee_type));
});

const currentInvoiceNumber = computed(() => {
  if (currentInvoice.value?.invoice_number) return currentInvoice.value.invoice_number;
  if (currentInvoice.value?.id) return currentInvoice.value.id;
  if (selectedInvoiceType.value === 'tuition') {
    return uktPayment.value?.id || `INV/2026/UKT-${candidateRegDigits.value}`;
  }
  return regPayment.value?.id || `INV/2026/REG-${candidateRegDigits.value}`;
});

const fullInvoiceAmount = computed(() => {
  if (applicantStore.state?.referral?.isApplied && selectedInvoiceType.value === 'registration') {
    return 0;
  }
  if (currentInvoice.value?.amount !== undefined && currentInvoice.value?.amount !== null) {
    return currentInvoice.value.amount;
  }
  if (selectedInvoiceType.value === 'tuition') {
    return uktPayment.value?.amount || 5000000;
  }
  return regPayment.value?.amount || 250000;
});

const currentInvoiceAmount = computed(() => {
  if (
    selectedInvoiceType.value === 'tuition' &&
    currentInvoice.value?.payment_scheme === 'installment' &&
    nextUnpaidInstallment.value?.amount
  ) {
    return nextUnpaidInstallment.value.amount;
  }
  return fullInvoiceAmount.value;
});

const isRegPaid = computed(() => {
  // 1. Jalur Bebas Biaya (Rp 0) atau Kode Referal Kemitraan Sekolah
  if (applicantStore.isFreeTrack || applicantStore.state?.referral?.isApplied) {
    return true;
  }
  // 2. Prasyarat: Program studi harus sudah ditentukan
  if (!applicantStore.state.admission?.prodi1) return false;

  // 3. Prioritaskan status tagihan backend jika tersedia
  const inv = backendInvoices.value.find((i) => i.fee_type === 'registration');
  if (inv) {
    return inv.status === 'paid' || inv.amount === 0 || inv.payment_scheme === 'free';
  }

  // 4. Fallback store lokal saat mode offline/tanpa invoice backend
  if (applicantStore.state?.payments?.registrationFee?.status === 'paid') {
    return true;
  }
  return applicantStore.isRegPaymentComplete;
});

const isTuitionPaid = computed(() => {
  const inv = backendInvoices.value.find((i) => isTuitionFeeType(i.fee_type));
  if (inv) return inv.status === 'paid';
  return applicantStore.isUktPaid;
});

const isFreeRegistration = computed(() => {
  return (
    selectedInvoiceType.value === 'registration' &&
    (currentInvoiceAmount.value === 0 ||
      currentInvoice.value?.payment_scheme === 'free' ||
      applicantStore.isFreeTrack ||
      applicantStore.state?.referral?.isApplied)
  );
});

const isCurrentInvoicePaid = computed(() => {
  if (selectedInvoiceType.value === 'tuition') return isTuitionPaid.value;
  return isRegPaid.value;
});

const isCurrentInvoicePartial = computed(() => {
  return currentInvoice.value?.status === 'partially_paid' && !isCurrentInvoicePaid.value;
});

const isCurrentInvoicePending = computed(() => {
  if (currentInvoice.value) {
    const hasAwaiting = Array.isArray(currentInvoice.value.payments) &&
      currentInvoice.value.payments.some((p) => p.status === 'awaiting_verification');
    return (
      currentInvoice.value.status === 'pending_confirmation' ||
      activePaymentData.value?.status === 'awaiting_verification' ||
      hasAwaiting
    );
  }
  if (selectedInvoiceType.value === 'tuition') {
    return uktPayment.value?.status === 'pending_confirmation';
  }
  return regPayment.value?.status === 'pending_confirmation';
});

const isCurrentInvoiceExpired = computed(() => {
  if (applicantStore.isWithdrawn || isCurrentInvoicePaid.value) return false;
  if (currentInvoice.value?.status === 'expired') return true;
  if (currentInvoice.value?.due_date) {
    const due = new Date(currentInvoice.value.due_date).getTime();
    return due < Date.now();
  }
  return false;
});

const currentPaidAtFormatted = computed(() => {
  if (currentInvoice.value?.updated_at) {
    return new Date(currentInvoice.value.updated_at).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return 'Telah Diverifikasi Lunas';
});

const displayedVaNumber = computed(() => {
  if (backendVaNumber.value) {
    return backendVaNumber.value;
  }
  if (!currentInvoice.value?.id) {
    const regSuffix = candidateRegDigits.value;
    const prefix = selectedInvoiceType.value === 'tuition' ? '02' : '01';
    const code = activeVaBank.value?.code || selectedVaBank.value;
    if (code === 'bsi') return `988 2026 ${prefix} ${regSuffix}`;
    if (code === 'mandiri') return `88908 2026 ${prefix} ${regSuffix}`;
    if (code === 'bca') return `39088 2026 ${prefix} ${regSuffix}`;
    if (code === 'bri') return `12808 2026 ${prefix} ${regSuffix}`;
    if (code === 'bni') return `98818 2026 ${prefix} ${regSuffix}`;
    if (code === 'cimb') return `28808 2026 ${prefix} ${regSuffix}`;
    return `98808 2026 ${prefix} ${regSuffix}`;
  }
  if (currentInvoice.value?.va_number) return currentInvoice.value.va_number;
  if (Array.isArray(currentInvoice.value?.payments) && currentInvoice.value.payments.length > 0) {
    const p = currentInvoice.value.payments.find((pay) => pay.status === 'pending' && pay.va_number);
    if (p) return p.va_number;
  }
  return 'Memuat Nomor Virtual Account...';
});

const activeDueDateFormatted = computed(() => {
  if (currentInvoice.value?.due_date) {
    return new Date(currentInvoice.value.due_date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  return '3 Hari Kerja dari Penerbitan';
});

// Cicilan UKT
const simulatedInstallments = computed(() => {
  const total = fullInvoiceAmount.value;
  if (installmentForm.value.terms === 2) {
    return [
      { term: 1, percentage: 50, amount: Math.round(total * 0.5) },
      { term: 2, percentage: 50, amount: Math.round(total * 0.5) },
    ];
  }
  return [
    { term: 1, percentage: 40, amount: Math.round(total * 0.4) },
    { term: 2, percentage: 30, amount: Math.round(total * 0.3) },
    { term: 3, percentage: 30, amount: Math.round(total * 0.3) },
  ];
});

const currentInstallmentRequest = computed(() => {
  const reqs = currentInvoice.value?.installment_requests;
  if (!Array.isArray(reqs) || reqs.length === 0) return null;
  return [...reqs].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))[0];
});

const isInstallmentRequestPending = computed(() => {
  return currentInstallmentRequest.value?.status === 'pending';
});

const activeInstallmentSchedule = computed(() => {
  const raw =
    Array.isArray(currentInvoice.value?.installments) && currentInvoice.value.installments.length > 0
      ? currentInvoice.value.installments
      : applicantStore.installmentSchedule || [];
  const totalAmt = fullInvoiceAmount.value || raw.reduce((sum, x) => sum + (Number(x.amount) || 0), 0) || 1;
  return [...raw]
    .sort((a, b) => (a.term_no || a.term_number || a.term || 0) - (b.term_no || b.term_number || b.term || 0))
    .map((item, idx) => {
      const term = item.term ?? item.term_number ?? item.term_no ?? idx + 1;
      const amount = Number(item.amount) || 0;
      const percentage = item.percentage ?? Math.round((amount / totalAmt) * 100);
      const rawDate = item.dueDate || item.due_date;
      const dueDate = rawDate
        ? (typeof rawDate === 'string' && !rawDate.includes('T')
            ? rawDate
            : new Date(rawDate).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }))
        : '-';
      const isPaid = typeof item.isPaid === 'boolean' ? item.isPaid : item.status === 'paid';
      return {
        ...item,
        term,
        amount,
        percentage,
        dueDate,
        isPaid,
      };
    });
});

const nextUnpaidInstallment = computed(() => {
  return activeInstallmentSchedule.value.find((item) => !item.isPaid) || null;
});

const hasActiveInstallmentPlan = computed(() => {
  return activeInstallmentSchedule.value.length > 0;
});

const installmentStatusLabel = computed(() => {
  const st = currentInstallmentRequest.value?.status;
  if (st === 'pending') return 'Menunggu Verifikasi Bagian Keuangan';
  if (st === 'rejected') return 'Pengajuan Cicilan Ditolak';
  return 'Disetujui oleh Bagian Keuangan';
});

const installmentStatusColor = computed(() => {
  const st = currentInstallmentRequest.value?.status;
  if (st === 'pending') return 'text-amber-700 font-semibold';
  if (st === 'rejected') return 'text-rose-700 font-semibold';
  return 'text-emerald-700 font-semibold';
});

// Aksi Operasional
const handleRenewInvoice = async () => {
  if (!currentInvoice.value?.id) return;
  isRenewing.value = true;
  try {
    await applicantStore.renewInvoice(currentInvoice.value.id);
    toast.success('Tagihan berhasil diperbarui dengan batas jatuh tempo baru.');
    await fetchInvoices();
    await ensureDirectPaymentForSelectedMethod();
  } catch (err) {
    toast.error('Gagal memperbarui tagihan: ' + (err?.response?.data?.message || err.message));
  } finally {
    isRenewing.value = false;
  }
};

const submitInstallmentApplication = async () => {
  if (!currentInvoice.value?.id || !installmentForm.value.reason.trim()) return;
  isSubmittingInstallment.value = true;
  try {
    await applicantStore.requestInstallment({
      invoiceId: currentInvoice.value.id,
      numTerms: installmentForm.value.terms,
      reason: installmentForm.value.reason,
    });
    openInstallmentModal.value = false;
    installmentForm.value.reason = '';
    await fetchInvoices();
    toast.success('Permohonan cicilan UKT berhasil diajukan dan sedang ditinjau tim keuangan.');
  } catch (err) {
    toast.error('Gagal mengajukan cicilan: ' + (err?.response?.data?.message || err.message));
  } finally {
    isSubmittingInstallment.value = false;
  }
};

const syncActiveInvoicePaymentState = () => {
  const inv = currentInvoice.value;
  if (!inv) {
    activePaymentId.value = null;
    activePaymentData.value = null;
    backendVaNumber.value = '';
    backendQrString.value = '';
    backendQrImageUrl.value = '';
    return;
  }

  activeInvoiceId.value = inv.id;
  const payments = Array.isArray(inv.payments) ? inv.payments : [];
  const pendingPay = [...payments]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .find((p) => p.status === 'pending' || p.status === 'awaiting_verification');

  if (pendingPay) {
    activePaymentId.value = pendingPay.id;
    activePaymentData.value = pendingPay;
    backendVaNumber.value = pendingPay.va_number || '';
    backendQrString.value = pendingPay.qr_string || '';
    if (pendingPay.method === 'qris' && !pendingPay.va_number) {
      paymentCategoryTab.value = 'qris';
    }
    const matchedBank = vaBankList.value.find(
      (b) =>
        b.code === String(pendingPay.channel || '').toLowerCase() ||
        b.duitkuCode === String(pendingPay.method_code || '').toUpperCase()
    );
    if (matchedBank) {
      activeVaBank.value = matchedBank;
      selectedVaBank.value = matchedBank.code;
    }
  } else {
    activePaymentId.value = null;
    activePaymentData.value = null;
    backendVaNumber.value = '';
    backendQrString.value = '';
    backendQrImageUrl.value = '';
  }
};

const fetchInvoices = async () => {
  isLoadingInvoices.value = true;
  try {
    const res = await financeApi.getMyInvoices();
    if (res?.data?.data && Array.isArray(res.data.data)) {
      backendInvoices.value = res.data.data;
      syncActiveInvoicePaymentState();

      const uktInv = backendInvoices.value.find((i) => isTuitionFeeType(i.fee_type));
      if (uktInv?.id) {
        await applicantStore.fetchInstallments(uktInv.id);
      }
    }
  } catch (err) {
    console.warn('fetchInvoices notice:', err?.message);
  } finally {
    isLoadingInvoices.value = false;
  }
};

let pollInterval = null;

const stopDummyAutoConfirmTimer = () => {
  if (dummyAutoConfirmTimer) {
    clearTimeout(dummyAutoConfirmTimer);
    dummyAutoConfirmTimer = null;
  }
};

const syncPaidToApplicantStore = (methodName) => {
  if (selectedInvoiceType.value === 'registration') {
    applicantStore.payRegFee(methodName);
    if (applicantStore.state?.admission) {
      applicantStore.state.admission.backendStatus = 'form_open';
      applicantStore.state.admission.status = 'Berkas & Pembayaran Terverifikasi';
    }
  } else {
    applicantStore.payUktFee(methodName);
  }
};

const isSimulatingWebhook = ref(false);

// Memicu webhook simulasi pelunasan (Sandbox Mode)
const triggerSandboxWebhookSimulation = async () => {
  if (selectedInvoiceType.value === 'registration' && !applicantStore.state.admission?.prodi1) {
    toast.warning('Pilihan Program Studi belum ditentukan. Silakan pilih program studi Anda terlebih dahulu di menu Jalur Pendaftaran.');
    emit('switch-tab', 'admission');
    return;
  }

  isSimulatingWebhook.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const ok = await executeConfirmPaid();
    if (ok) {
      if (isCurrentInvoicePaid.value) {
        toast.success('⚡ Webhook pembayaran bank berhasil diproses! Tagihan resmi LUNAS.');
      } else if (isCurrentInvoicePartial.value) {
        toast.success('⚡ Pembayaran termin cicilan berhasil diproses! Sisa termin berikutnya telah diperbarui.');
      } else {
        toast.success('⚡ Pembayaran simulasi diproses.');
      }
    }
  } finally {
    isSimulatingWebhook.value = false;
  }
};

const executeConfirmPaid = async () => {
  stopDummyAutoConfirmTimer();
  stopAutoPolling();

  if (selectedInvoiceType.value === 'registration' && !applicantStore.state.admission?.prodi1) {
    toast.warning('Pilihan Program Studi belum ditentukan. Silakan tentukan program studi Anda terlebih dahulu di menu Jalur Pendaftaran.');
    emit('switch-tab', 'admission');
    return false;
  }

  const methodName = paymentCategoryTab.value === 'va'
    ? `Virtual Account ${activeVaBank.value?.shortName || 'BSI'}`
    : 'QRIS Duitku';

  // Jika tagihan backend tersedia, wajib proses lewat backend secara riil tanpa fallback sukses palsu
  if (currentInvoice.value?.id) {
    try {
      if (!activePaymentId.value) {
        const directPay = await ensureDirectPaymentForSelectedMethod();
        if (!directPay?.payment_id) {
          const pRes = await financeApi.payInvoice(currentInvoice.value.id, {
            method: paymentCategoryTab.value === 'va' ? 'virtual_account' : 'online_gateway',
            channel: paymentCategoryTab.value === 'va' ? selectedVaBank.value : 'qris',
          });
          if (pRes?.data?.data?.id) {
            activePaymentId.value = pRes.data.data.id;
          }
        }
      }

      if (!activePaymentId.value) {
        toast.error('Gagal menginisialisasi transaksi pembayaran ke server.');
        return false;
      }

      await financeApi.simulatePaymentPaid(activePaymentId.value);
      await fetchInvoices();
      await applicantStore.syncFromBackend().catch(() => null);

      if (isCurrentInvoicePaid.value) {
        syncPaidToApplicantStore(methodName);
      } else if (isCurrentInvoicePartial.value) {
        // Siapkan payment VA/QRIS untuk termin cicilan berikutnya bila belum lunas penuh
        await ensureDirectPaymentForSelectedMethod(true);
      }
      return true;
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Gagal memproses simulasi pembayaran di server.';
      toast.error(msg);
      return false;
    }
  }

  // Fallback lokal murni (hanya bila mode offline tanpa invoice backend)
  syncPaidToApplicantStore(methodName);
  return true;
};

const startAutoPolling = () => {
  stopAutoPolling();

  // Polling otomatis setiap 4.5 detik untuk mendeteksi konfirmasi webhook perbankan
  pollInterval = setInterval(async () => {
    if (isCurrentInvoicePaid.value) {
      stopAutoPolling();
      return;
    }
    await checkPaymentStatus(true);
  }, 4500);
};

const stopAutoPolling = () => {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
};

const handleWindowFocus = async () => {
  if (!isCurrentInvoicePaid.value) {
    await checkPaymentStatus(true);
  }
};

const checkPaymentStatus = async (isSilent = false) => {
  if (!isSilent) isCheckingStatus.value = true;
  try {
    // 1. Validasi Prasyarat: Jika prodi belum dipilih
    if (selectedInvoiceType.value === 'registration' && !applicantStore.state.admission?.prodi1 && !isCurrentInvoicePaid.value) {
      if (!isSilent) {
        toast.warning('Pilihan Program Studi belum ditentukan. Silakan tentukan program studi Anda terlebih dahulu di menu Jalur Pendaftaran.');
        emit('switch-tab', 'admission');
      }
      return;
    }

    // 2. Jika tagihan sudah tercatat lunas
    if (isCurrentInvoicePaid.value) {
      stopAutoPolling();
      stopDummyAutoConfirmTimer();
      if (!isSilent) {
        toast.success('Pembayaran telah terverifikasi lunas oleh sistem perbankan.');
      }
      return;
    }

    // 3. Pengecekan status riil ke backend gateway
    let isConfirmedPaid = false;
    let isAwaiting = false;

    if (currentInvoice.value?.id && activePaymentId.value) {
      const statusRes = await financeApi
        .getPaymentStatus(currentInvoice.value.id, activePaymentId.value)
        .catch(() => null);

      const pStatus = statusRes?.data?.data || statusRes?.data;
      if (pStatus) {
        if (pStatus.is_paid || pStatus.status === 'success') {
          isConfirmedPaid = true;
        } else if (pStatus.status === 'awaiting_verification') {
          isAwaiting = true;
        }
      }
    }

    await fetchInvoices();

    if (isCurrentInvoicePaid.value || isConfirmedPaid) {
      const methodName = paymentCategoryTab.value === 'va'
        ? `Virtual Account ${activeVaBank.value?.shortName || 'BSI'}`
        : 'QRIS Duitku';
      syncPaidToApplicantStore(methodName);
      stopAutoPolling();
      await applicantStore.syncFromBackend().catch(() => null);
      if (!isSilent) {
        toast.success('Pembayaran telah terverifikasi lunas oleh sistem perbankan.');
      }
    } else if (isCurrentInvoicePartial.value) {
      if (!isSilent) {
        toast.info('Pembayaran termin cicilan tercatat. Silakan selesaikan termin berikutnya sesuai jadwal.');
      }
    } else if (isCurrentInvoicePending.value || isAwaiting) {
      if (!isSilent) {
        toast.info('Status pembayaran sedang dalam antrean verifikasi perbankan / tim keuangan.');
      }
    } else {
      if (!isSilent) {
        if (isDummyMode.value) {
          toast.info('Belum ada mutasi pembayaran terdeteksi dari bank. Silakan klik tombol "Simulasikan Bayar (Webhook)" di atas untuk menguji alur pelunasan.');
        } else {
          toast.warning('Pembayaran belum terdeteksi. Silakan selesaikan transaksi lalu periksa kembali.');
        }
      }
    }
  } catch {
    if (!isSilent) {
      toast.info('Status pembayaran sedang disinkronkan dengan gateway.');
    }
  } finally {
    if (!isSilent) isCheckingStatus.value = false;
  }
};

const handleManualTransferUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    toast.warning('Ukuran berkas melebihi batas maksimal 5 MB.');
    return;
  }

  isUploadingProof.value = true;
  try {
    if (currentInvoice.value?.id) {
      const formData = new FormData();
      formData.append('proof', file);
      const res = await financeApi.payWithManualTransfer(currentInvoice.value.id, formData);
      if (res?.data?.data) {
        activePaymentId.value = res.data.data.id;
        activePaymentData.value = res.data.data;
      }
    }
    if (selectedInvoiceType.value === 'registration') {
      applicantStore.submitRegPayment(`Transfer Bank BSI - File: ${file.name}`);
    } else {
      applicantStore.submitUktPayment(`Transfer Bank BSI - File: ${file.name}`);
    }
    toast.success('Bukti transfer berhasil diunggah dan menunggu verifikasi tim keuangan.');
    await fetchInvoices();
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Gagal mengunggah bukti transfer. Silakan periksa koneksi internet Anda.');
  } finally {
    isUploadingProof.value = false;
    if (event?.target) event.target.value = '';
  }
};

const handleCancelAdmission = async () => {
  isCancelling.value = true;
  try {
    const res = await applicantStore.cancelAdmission();
    showCancelConfirmModal.value = false;
    toast.info(res?.message || 'Pilihan pendaftaran berhasil dibatalkan.');
    applicantStore.setActiveTab('admission');
  } catch (err) {
    toast.error(err?.message || 'Gagal membatalkan pendaftaran.');
  } finally {
    isCancelling.value = false;
  }
};

watch(isCurrentInvoicePaid, (newVal) => {
  if (newVal) {
    stopAutoPolling();
  } else {
    startAutoPolling();
  }
});

watch(selectedInvoiceType, async () => {
  syncActiveInvoicePaymentState();
  if (!isCurrentInvoicePaid.value && !isCurrentInvoiceExpired.value) {
    if (!activePaymentId.value && currentInvoice.value?.id) {
      await ensureDirectPaymentForSelectedMethod();
    }
    startAutoPolling();
  }
  await updateQrisCode();
});

watch([currentInvoiceAmount, candidateRegNo, selectedInvoiceType], () => {
  updateQrisCode();
});

onMounted(async () => {
  await fetchInvoices();
  await loadPaymentConfig();
  if (applicantStore.isResultPassed && hasTuitionInvoice.value) {
    selectedInvoiceType.value = 'tuition';
  }
  syncActiveInvoicePaymentState();
  if (!isCurrentInvoicePaid.value && !isCurrentInvoiceExpired.value) {
    if (!activePaymentId.value && currentInvoice.value?.id) {
      await ensureDirectPaymentForSelectedMethod();
    }
    startAutoPolling();
  }
  await updateQrisCode();
  window.addEventListener('focus', handleWindowFocus);
});

onUnmounted(() => {
  stopAutoPolling();
  stopDummyAutoConfirmTimer();
  window.removeEventListener('focus', handleWindowFocus);
});
</script>
