<template>
  <div class="space-y-6">
    <!-- Header Halaman Pembayaran (Formal & Bersih) -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900">
          {{ selectedInvoiceType === 'tuition' ? 'Pembayaran UKT Semester 1' : 'Pembayaran Biaya Pendaftaran' }}
        </h2>
        <p class="text-xs text-slate-500 mt-0.5 font-sans">
          Universitas Bakti Tunas Husada • Tahun Akademik {{ admission?.academicYear || '2026/2027' }}
        </p>
      </div>

      <div class="flex items-center gap-2 self-start sm:self-auto">
        <span
          class="font-semibold px-3 py-1 text-xs font-sans border rounded"
          :class="isCurrentInvoicePaid
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : isCurrentInvoiceExpired
            ? 'bg-rose-50 text-rose-800 border-rose-200'
            : isCurrentInvoicePending
            ? 'bg-amber-50 text-amber-800 border-amber-200'
            : 'bg-blue-50 text-[#1E3A8A] border-blue-200'"
        >
          {{ isCurrentInvoicePaid ? 'Pembayaran Lunas' : isCurrentInvoiceExpired ? 'Tagihan Kedaluwarsa' : isCurrentInvoicePending ? 'Menunggu Konfirmasi' : 'Menunggu Pembayaran' }}
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
            <span class="font-medium text-slate-800">{{ selectedInvoiceType === 'tuition' ? 'Uang Kuliah Tunggal (UKT) Semester 1' : isFreeRegistration ? 'Pembebasan Biaya Formulir PMB (Jalur Beasiswa/Afirmasi)' : 'Biaya Formulir Pendaftaran PMB' }}</span>
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

        <!-- Tombol Aksi Kuitansi & Arah Tahapan Selanjutnya -->
        <div class="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            @click="showReceiptModal = true"
            class="w-full sm:w-1/2 py-2.5 px-4 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold font-sora transition-colors cursor-pointer text-center"
          >
            Lihat Kuitansi
          </button>

          <button
            v-if="selectedInvoiceType === 'registration'"
            type="button"
            @click="emit('switch-tab', 'exam')"
            class="w-full sm:w-1/2 py-2.5 px-4 rounded bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold font-sora transition-colors cursor-pointer text-center"
          >
            Lanjut ke Seleksi CBT
          </button>

          <button
            v-else-if="selectedInvoiceType === 'tuition'"
            type="button"
            @click="emit('switch-tab', 'result')"
            class="w-full sm:w-1/2 py-2.5 px-4 rounded bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold font-sora transition-colors cursor-pointer text-center"
          >
            Kembali ke Pengumuman
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- KONDISI B: BELUM LUNAS (CHECKOUT PEMBAYARAN VIA REAL BACKEND GATEWAY)      -->
    <!-- ========================================================================= -->
    <div v-else class="space-y-6">
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
            v-if="!hasActiveInstallmentPlan"
            type="button"
            @click="openInstallmentModal = true"
            class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-sora font-semibold rounded border border-slate-300 transition-colors cursor-pointer self-start sm:self-auto"
          >
            Ajukan Keringanan Cicilan UKT
          </button>
        </div>

        <!-- Jika Sudah Ada Rencana Cicilan Yang Disetujui / Diajukan -->
        <div v-if="hasActiveInstallmentPlan" class="space-y-3">
          <div class="text-xs text-slate-600">
            Status Pengajuan:
            <strong :class="installmentStatusColor">{{ installmentStatusLabel }}</strong>
          </div>

          <div class="overflow-x-auto">
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
            <div class="pt-3 border-t border-slate-100">
              <div class="flex justify-between items-center">
                <span class="font-semibold text-slate-800 text-xs">Total Tagihan:</span>
                <strong class="font-sora font-bold text-lg sm:text-xl text-[#1E3A8A]">
                  Rp {{ currentInvoiceAmount.toLocaleString('id-ID') }}
                </strong>
              </div>
            </div>

            <!-- Tombol Aksi Pembayaran Reguler & Cek Status -->
            <div class="pt-2 space-y-2.5">
              <button
                type="button"
                @click="initiateDuitkuPayment"
                :disabled="isInitiatingDuitku"
                class="w-full py-3 px-4 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer disabled:opacity-50 text-center"
              >
                {{ isInitiatingDuitku ? 'Menyiapkan Pembayaran...' : 'Bayar Tagihan' }}
              </button>

              <button
                type="button"
                @click="checkPaymentStatus"
                :disabled="isCheckingStatus"
                class="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-sora font-medium rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50 text-center"
              >
                {{ isCheckingStatus ? 'Memeriksa ke Sistem Bank...' : 'Cek Status Pembayaran' }}
              </button>
            </div>

            <!-- Opsi Batalkan Pendaftaran (Hanya Tampil Sebelum Bayar Pendaftaran) -->
            <div v-if="selectedInvoiceType === 'registration' && applicantStore.canCancelAdmission" class="pt-3 border-t border-slate-100 text-center">
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

        <!-- Kolom Kanan: Kode Referal Sekolah Mitra (Col 5) -->
        <div class="lg:col-span-5 space-y-4">
          <!-- Card Kode Referal (Khusus Pendaftaran) -->
          <div
            v-if="selectedInvoiceType === 'registration'"
            class="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4"
          >
            <div class="border-b border-slate-100 pb-3">
              <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
                Kode Referal
              </h3>
              <p class="text-xs text-slate-500 mt-0.5 font-sans leading-relaxed">
                Masukkan kode referal dari Guru BK atau sekolah mitra untuk pembebasan biaya pendaftaran.
              </p>
            </div>

            <div class="space-y-3 font-sans">
              <div class="space-y-1.5">
                <label class="block text-xs font-medium text-slate-700">
                  Kode Referal BK / Sekolah Mitra
                </label>
                <div class="flex items-center gap-2">
                  <input
                    v-model="referralInputCode"
                    type="text"
                    placeholder="Contoh: SMKCONTOH01"
                    class="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-medium text-slate-900 outline-none focus:bg-white focus:border-[#1E3A8A] uppercase transition-colors"
                    :disabled="isApplyingReferral"
                    @keyup.enter="handleApplyReferral"
                  />
                  <button
                    type="button"
                    @click="handleApplyReferral"
                    :disabled="!referralInputCode.trim() || isApplyingReferral"
                    class="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap text-center"
                  >
                    {{ isApplyingReferral ? 'Memeriksa...' : 'Periksa Kode' }}
                  </button>
                </div>
              </div>

              <!-- Hasil Verifikasi Kode Referal -->
              <div
                v-if="referralValidationResult"
                class="p-3.5 rounded-lg text-xs space-y-2 border"
                :class="referralValidationResult.valid ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-rose-50/80 border-rose-200 text-rose-800'"
              >
                <div class="flex items-center justify-between">
                  <span class="font-bold">{{ referralValidationResult.valid ? `Kode Terdaftar: ${referralValidationResult.code}` : 'Kode Tidak Terdaftar' }}</span>
                  <span v-if="referralValidationResult.valid" class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                    Bebas Biaya
                  </span>
                </div>
                <p class="text-[11px] leading-relaxed text-slate-600">
                  {{ referralValidationResult.message }}
                </p>
                <div v-if="referralValidationResult.valid" class="pt-1">
                  <button
                    type="button"
                    @click="confirmBypassWithReferral"
                    class="w-full py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Konfirmasi & Lanjutkan ke Seleksi CBT
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Informasi Layanan Pembayaran -->
          <div class="bg-white rounded-xl border border-slate-200 shadow-xs p-5 text-xs text-slate-600 space-y-2.5 font-sans">
            <div class="font-semibold text-slate-800">
              Ketentuan Pembayaran
            </div>
            <ul class="space-y-1.5 text-[11px] text-slate-500 list-disc list-inside leading-relaxed">
              <li>Pembayaran diproses secara otomatis oleh sistem perbankan.</li>
              <li>Tersedia metode pembayaran QRIS, Virtual Account bank, dan dompet digital.</li>
              <li>Kuitansi resmi dapat diakses segera setelah tagihan lunas.</li>
            </ul>
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

    <!-- MODAL KUITANSI RESMI PMB BTH (CR-010 / Kuitansi Digital) -->
    <Teleport to="body">
      <div
        v-if="showReceiptModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-fadeIn"
      >
        <div class="bg-white rounded-xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
          <div class="p-6 space-y-4">
            <!-- Kop Surat Resmi Kuitansi -->
            <div class="text-center pb-3 border-b-2 border-slate-800">
              <div class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Yayasan Bakti Tunas Husada Tasikmalaya
              </div>
              <div class="font-sora font-extrabold text-base text-[#1E3A8A] tracking-tight mt-0.5">
                UNIVERSITAS BAKTI TUNAS HUSADA
              </div>
              <div class="text-[10px] text-slate-500 mt-0.5">
                Biro Administrasi Keuangan PMB • Jl. Cilolohan No. 36, Tasikmalaya
              </div>
            </div>

            <div class="text-center py-1">
              <h4 class="font-sora font-bold text-slate-900 text-sm uppercase tracking-wide">
                Tanda Bukti Pembayaran (Kuitansi)
              </h4>
              <span class="text-[11px] font-mono text-slate-500">Nomor: {{ currentReceiptNumber }}</span>
            </div>

            <!-- Tabel Data Kuitansi -->
            <div class="bg-slate-50 rounded border border-slate-200 p-3.5 space-y-2 text-xs font-sans">
              <div class="flex justify-between py-1 border-b border-slate-200">
                <span class="text-slate-500">Telah Diterima Dari:</span>
                <strong class="text-slate-900">{{ candidateFullName }}</strong>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-200">
                <span class="text-slate-500">Nomor Registrasi PMB:</span>
                <span class="font-mono text-slate-800">{{ candidateRegNo }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-200">
                <span class="text-slate-500">Program Studi:</span>
                <span class="text-slate-800 font-medium">{{ activeProdiName }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-200">
                <span class="text-slate-500">Guna Pembayaran:</span>
                <span class="text-slate-800">{{ selectedInvoiceType === 'tuition' ? 'Uang Kuliah Tunggal (UKT) Semester 1 TA 2026/2027' : 'Biaya Formulir Pendaftaran PMB TA 2026/2027' }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-200">
                <span class="text-slate-500">Waktu Verifikasi Lunas:</span>
                <span class="text-slate-800">{{ currentPaidAtFormatted }}</span>
              </div>
              <div class="flex justify-between items-center pt-2">
                <span class="font-bold text-slate-800">Jumlah Pembayaran:</span>
                <strong class="font-sora font-extrabold text-base text-[#1E3A8A]">
                  Rp {{ currentInvoiceAmount.toLocaleString('id-ID') }}
                </strong>
              </div>
            </div>

            <div class="flex justify-between items-end pt-2 text-[11px] text-slate-600">
              <div>
                <p>Dokumen ini adalah bukti pembayaran digital yang sah.</p>
                <p class="text-slate-400">Dicetak melalui Portal PMB BTH</p>
              </div>
              <div class="text-center font-medium">
                <div>Tasikmalaya, {{ currentDateFormatted }}</div>
                <div class="text-emerald-700 font-bold mt-1">[TERVERIFIKASI LUNAS]</div>
                <div class="text-[10px] text-slate-500 mt-0.5">Biro Keuangan BTH</div>
              </div>
            </div>
          </div>

          <div class="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              @click="printReceipt"
              class="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold rounded cursor-pointer"
            >
              Cetak Kuitansi
            </button>
            <button
              type="button"
              @click="showReceiptModal = false"
              class="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded cursor-pointer"
            >
              Tutup
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
import { useApplicantStore } from '@/stores/applicant';
import { useAuthStore } from '@/stores/auth';
import { useReferralStore } from '@/stores/referral';
import { financeApi } from '@/api/finance';
import { useToast } from '@/composables/useToast';

const emit = defineEmits(['switch-tab']);
const applicantStore = useApplicantStore();
const authStore = useAuthStore();
const referralStore = useReferralStore();
const toast = useToast();

const referralInputCode = ref('');
const isApplyingReferral = ref(false);
const referralValidationResult = ref(null);

const handleApplyReferral = () => {
  if (!referralInputCode.value.trim()) return;
  isApplyingReferral.value = true;
  const clean = referralInputCode.value.trim().toUpperCase();
  const found = referralStore.findReferralByCode(clean);
  if (found) {
    referralValidationResult.value = {
      valid: true,
      code: found.code,
      message: `Mitra terhubung: ${found.picName} – ${found.schoolName}. Biaya formulir dialihkan melalui skema kemitraan sekolah mitra.`,
    };
  } else {
    referralValidationResult.value = {
      valid: false,
      message: 'Kode referal tidak ditemukan atau masa berlaku telah berakhir. Silakan periksa kembali kode Anda.',
    };
  }
  isApplyingReferral.value = false;
};

const confirmBypassWithReferral = () => {
  if (!referralValidationResult.value?.valid) return;
  const res = applicantStore.applyReferralCode(referralValidationResult.value.code);
  if (res.success) {
    const regInv = backendInvoices.value.find((i) => i.fee_type === 'registration');
    if (regInv) {
      regInv.status = 'paid';
    }
    toast.success('Kode referal berhasil dikonfirmasi. Pembayaran pendaftaran lunas.');
    referralValidationResult.value = null;
    referralInputCode.value = '';
    // Langsung menuju ke tahap tes/seleksi CBT
    emit('switch-tab', 'exam');
  } else {
    toast.error(res.message || 'Gagal menerapkan kode referal.');
  }
};

const showCancelConfirmModal = ref(false);
const openInstallmentModal = ref(false);
const showReceiptModal = ref(false);
const showDuitkuModal = ref(false);
const isSimulatingPaid = ref(false);

const selectedInvoiceType = ref('registration'); // 'registration' | 'tuition'
const selectedVaBank = ref('bsi');
const activeInvoiceId = ref(null);
const activePaymentId = ref(null);
const activePaymentData = ref(null);
const backendVaNumber = ref('');
const duitkuPaymentUrl = ref('');
const isInitiatingDuitku = ref(false);
const isRenewing = ref(false);
const isCancelling = ref(false);
const isSubmittingInstallment = ref(false);
const isLoadingInvoices = ref(false);
const isCheckingStatus = ref(false);
const isUploadingProof = ref(false);
const installmentForm = ref({ terms: 2, reason: '' });
const backendInvoices = ref([]);

const duitkuMerchantCode = ref('DS35926');
const duitkuReference = ref('DS35926267H2BNJ38I0QCCLI');
const iframeLoading = ref(true);
const duitkuSelectedCategory = ref('qris'); // 'qris' | 'va' | 'ewallet'
const selectedDuitkuMethod = ref(null);

const duitkuMethodsList = ref([
  { code: 'NQ', name: 'QRIS', category: 'qris', fee: 0, image: 'https://images.duitku.com/hotlink-ok/NQ.PNG', badge: 'Semua m-Banking & E-Wallet' },
  { code: 'SP', name: 'ShopeePay QRIS', category: 'qris', fee: 0, image: 'https://images.duitku.com/hotlink-ok/SHOPEEPAY.PNG', badge: 'Scan QRIS' },
  { code: 'BV', name: 'BSI Virtual Account', category: 'va', fee: 0, image: 'https://images.duitku.com/hotlink-ok/BSI.PNG', badge: 'Bank Utama BTH' },
  { code: 'BC', name: 'BCA Virtual Account', category: 'va', fee: 0, image: 'https://images.duitku.com/hotlink-ok/BCA.SVG', badge: 'Bank Central Asia' },
  { code: 'M2', name: 'Mandiri Virtual Account', category: 'va', fee: 0, image: 'https://images.duitku.com/hotlink-ok/MV.PNG', badge: 'Bank Mandiri' },
  { code: 'BR', name: 'BRI Virtual Account', category: 'va', fee: 0, image: 'https://images.duitku.com/hotlink-ok/BR.PNG', badge: 'Bank Rakyat Indonesia' },
  { code: 'I1', name: 'BNI Virtual Account', category: 'va', fee: 0, image: 'https://images.duitku.com/hotlink-ok/I1.PNG', badge: 'Bank Negara Indonesia' },
  { code: 'B1', name: 'CIMB Niaga Virtual Account', category: 'va', fee: 0, image: 'https://images.duitku.com/hotlink-ok/B1.PNG', badge: 'Bank CIMB Niaga' },
  { code: 'BT', name: 'Permata Virtual Account', category: 'va', fee: 0, image: 'https://images.duitku.com/hotlink-ok/PERMATA.PNG', badge: 'Bank Permata' },
  { code: 'VA', name: 'Maybank Virtual Account', category: 'va', fee: 0, image: 'https://images.duitku.com/hotlink-ok/VA.PNG', badge: 'Bank Maybank' },
  { code: 'A1', name: 'ATM Bersama / Prima', category: 'va', fee: 0, image: 'https://images.duitku.com/hotlink-ok/A1.PNG', badge: 'Transfer Antar Bank' },
  { code: 'NC', name: 'Bank Neo Commerce', category: 'va', fee: 0, image: 'https://images.duitku.com/hotlink-ok/NC.PNG', badge: 'Bank Neo Commerce' },
  { code: 'DA', name: 'DANA', category: 'ewallet', fee: 0, image: 'https://images.duitku.com/hotlink-ok/DA.PNG', badge: 'Dompet Digital' },
  { code: 'OV', name: 'OVO', category: 'ewallet', fee: 0, image: 'https://images.duitku.com/hotlink-ok/OV.PNG', badge: 'Dompet Digital' },
  { code: 'SA', name: 'ShopeePay', category: 'ewallet', fee: 0, image: 'https://images.duitku.com/hotlink-ok/SHOPEEPAY.PNG', badge: 'Dompet Digital' },
  { code: 'LA', name: 'LinkAja', category: 'ewallet', fee: 0, image: 'https://images.duitku.com/hotlink-ok/LINKAJA.PNG', badge: 'Dompet Digital' },
  { code: 'JP', name: 'Jenius Pay', category: 'ewallet', fee: 0, image: 'https://images.duitku.com/hotlink-ok/JP.PNG', badge: 'BTPN Jenius' },
  { code: 'IR', name: 'Indomaret', category: 'retail', fee: 0, image: 'https://images.duitku.com/hotlink-ok/IR.PNG', badge: 'Gerai Kasir' },
  { code: 'FT', name: 'Alfamart / POS / Pegadaian', category: 'retail', fee: 0, image: 'https://images.duitku.com/hotlink-ok/RETAIL.PNG', badge: 'Gerai Kasir' },
]);

// Inisialisasi default metode ke QRIS pertama
selectedDuitkuMethod.value = duitkuMethodsList.value[0];

const filteredDuitkuMethods = computed(() => {
  if (duitkuSelectedCategory.value === 'ewallet') {
    return duitkuMethodsList.value.filter((m) => m.category === 'ewallet' || m.category === 'retail');
  }
  return duitkuMethodsList.value.filter((m) => m.category === duitkuSelectedCategory.value);
});

watch(duitkuSelectedCategory, () => {
  const currentList = filteredDuitkuMethods.value;
  if (currentList && currentList.length > 0) {
    if (!selectedDuitkuMethod.value || !currentList.some((m) => m.code === selectedDuitkuMethod.value.code)) {
      selectedDuitkuMethod.value = currentList[0];
    }
  }
});

const selectDuitkuMethod = (method) => {
  selectedDuitkuMethod.value = method;
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

// Deteksi Invoice Aktif Berdasarkan selectedInvoiceType
const currentInvoice = computed(() => {
  if (selectedInvoiceType.value === 'tuition') {
    return backendInvoices.value.find((i) => i.fee_type === 'tuition' || i.fee_type === 'ukt');
  }
  return backendInvoices.value.find((i) => i.fee_type === 'registration');
});

const hasTuitionInvoice = computed(() => {
  return backendInvoices.value.some((i) => i.fee_type === 'tuition' || i.fee_type === 'ukt');
});

const currentInvoiceNumber = computed(() => {
  if (currentInvoice.value?.invoice_number) return currentInvoice.value.invoice_number;
  if (currentInvoice.value?.id) return currentInvoice.value.id;
  if (selectedInvoiceType.value === 'tuition') {
    return uktPayment.value?.id || `INV/2026/UKT-${candidateRegDigits.value}`;
  }
  return regPayment.value?.id || `INV/2026/REG-${candidateRegDigits.value}`;
});

const currentInvoiceAmount = computed(() => {
  if (currentInvoice.value?.amount) return currentInvoice.value.amount;
  if (selectedInvoiceType.value === 'tuition') {
    return uktPayment.value?.amount || 5000000;
  }
  return regPayment.value?.amount || 250000;
});

const isRegPaid = computed(() => {
  if (!applicantStore.state.admission?.prodi1) return false;
  // 1. Jalur Bebas Biaya (Rp 0) atau Kode Referal Kemitraan Sekolah otomatis lunas
  if (applicantStore.isFreeTrack || applicantStore.state?.referral?.isApplied) {
    return true;
  }
  // 2. Cek backend invoice jika ada
  const inv = backendInvoices.value.find((i) => i.fee_type === 'registration');
  if (inv) {
    if (inv.status === 'paid' || inv.amount === 0 || inv.payment_scheme === 'free') {
      return true;
    }
    // Jika backend invoice belum paid dan status admission di backend masih awaiting_payment
    if (applicantStore.state?.admission?.backendStatus === 'awaiting_payment') {
      return false;
    }
  }
  // 3. Sinkronkan dengan getter utama applicantStore
  return applicantStore.isRegPaymentComplete;
});

const isTuitionPaid = computed(() => {
  const inv = backendInvoices.value.find((i) => i.fee_type === 'tuition' || i.fee_type === 'ukt');
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

const isCurrentInvoicePending = computed(() => {
  if (currentInvoice.value) {
    return currentInvoice.value.status === 'pending_confirmation' || activePaymentData.value?.status === 'awaiting_verification';
  }
  if (selectedInvoiceType.value === 'tuition') {
    return uktPayment.value?.status === 'pending_confirmation';
  }
  return regPayment.value?.status === 'pending_confirmation';
});

const isCurrentInvoiceExpired = computed(() => {
  if (currentInvoice.value?.status === 'expired') return true;
  if (currentInvoice.value?.due_date) {
    const due = new Date(currentInvoice.value.due_date).getTime();
    return due < Date.now() && !isCurrentInvoicePaid.value;
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

const currentReceiptNumber = computed(() => {
  const typeCode = selectedInvoiceType.value === 'tuition' ? 'UKT' : 'REG';
  return `KWT-BTH/${typeCode}/${candidateRegDigits.value}`;
});

const currentDateFormatted = computed(() => {
  return new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
});

const currentActiveVaNumber = computed(() => {
  if (backendVaNumber.value) {
    return backendVaNumber.value;
  }
  if (currentInvoice.value?.va_number) return currentInvoice.value.va_number;
  if (currentInvoice.value?.payments && currentInvoice.value.payments.length > 0) {
    const p = currentInvoice.value.payments.find((pay) => pay.va_number);
    if (p) return p.va_number;
  }

  const regSuffix = candidateRegDigits.value;
  const prefix = selectedInvoiceType.value === 'tuition' ? '02' : '01';
  if (selectedVaBank.value === 'bsi') {
    return `988 2026 ${prefix} ${regSuffix}`;
  } else if (selectedVaBank.value === 'mandiri') {
    return `88908 2026 ${regSuffix}`;
  } else if (selectedVaBank.value === 'bca') {
    return `39088 2026 ${regSuffix}`;
  }
  return `98808 2026 ${regSuffix}`;
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
  const total = currentInvoiceAmount.value;
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

const hasActiveInstallmentPlan = computed(() => {
  return applicantStore.installmentSchedule && applicantStore.installmentSchedule.length > 0;
});

const activeInstallmentSchedule = computed(() => {
  return applicantStore.installmentSchedule || [];
});

const installmentStatusLabel = computed(() => {
  return 'Disetujui oleh Bagian Keuangan';
});

const installmentStatusColor = computed(() => {
  return 'text-emerald-700 font-semibold';
});

// Aksi Operasional
const selectVaBank = async (bankCode) => {
  selectedVaBank.value = bankCode;
  if (currentInvoice.value?.id && !isCurrentInvoicePaid.value) {
    try {
      const res = await financeApi.payInvoice(currentInvoice.value.id, {
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

const triggerDuitkuPopup = (refCode) => {
  const popCallbacks = {
    defaultLanguage: 'id',
    successEvent: function(result) {
      handleDuitkuSuccess(result);
    },
    pendingEvent: function() {
      toast.info('Menunggu penyelesaian pembayaran.');
    },
    errorEvent: function(err) {
      console.warn('Duitku popup notice:', err);
      toast.error('Terjadi kendala pada jendela pembayaran.');
    },
    closeEvent: function() {
      console.log('Jendela pembayaran Duitku ditutup');
      checkPaymentStatus(false);
    },
  };

  if (window.duitku && typeof window.duitku.checkout === 'function') {
    try {
      window.duitku.checkout(refCode, popCallbacks);
      return true;
    } catch (e) {
      console.warn('window.duitku.checkout notice:', e);
    }
  }

  if (window.checkout && typeof window.checkout.process === 'function') {
    try {
      window.checkout.process(refCode, popCallbacks);
      return true;
    } catch (e) {
      console.warn('window.checkout.process notice:', e);
    }
  }

  return false;
};

const initiateDuitkuPayment = async () => {
  isInitiatingDuitku.value = true;
  startAutoPolling();

  try {
    let refCode = duitkuReference.value || 'DS35926267H2BNJ38I0QCCLI';
    let payUrl = `https://app-sandbox.duitku.com/redirect_checkout?reference=${refCode}`;

    if (currentInvoice.value?.id) {
      const res = await financeApi.payInvoice(currentInvoice.value.id, {
        method: 'online_gateway',
        channel: 'duitku',
      }).catch((err) => {
        console.warn('Finance payInvoice notice:', err?.message);
        return null;
      });

      if (res?.data?.data) {
        const pay = res.data.data;
        activePaymentId.value = pay.id;
        activePaymentData.value = pay;
        if (pay.provider_ref) {
          refCode = pay.provider_ref;
        }
        if (pay.payment_url) {
          payUrl = pay.payment_url;
        }
        if (pay.va_number) {
          backendVaNumber.value = pay.va_number;
        }
      }
    }

    duitkuReference.value = refCode;
    duitkuPaymentUrl.value = payUrl;

    // Panggil SATU popup resmi bawaan Duitku
    const triggered = triggerDuitkuPopup(refCode);
    if (!triggered) {
      if (payUrl) {
        window.open(payUrl, '_blank');
        toast.info('Halaman pembayaran dibuka di jendela baru.');
      } else {
        toast.error('Gagal memuat sistem pembayaran. Silakan coba beberapa saat lagi.');
      }
    }
  } catch (err) {
    console.warn('initiateDuitkuPayment error:', err);
    toast.error('Terjadi kendala saat menyiapkan pembayaran.');
  } finally {
    isInitiatingDuitku.value = false;
  }
};

const handleDuitkuSuccess = async (result) => {
  stopAutoPolling();

  const methodName = 'Pembayaran Online (Duitku)';

  if (selectedInvoiceType.value === 'registration') {
    applicantStore.payRegFee(methodName);
  } else {
    applicantStore.payUktFee(methodName);
  }

  if (activePaymentId.value) {
    await financeApi.simulatePaymentPaid(activePaymentId.value).catch(() => null);
  }

  await fetchInvoices();
  toast.success('Pembayaran berhasil diverifikasi lunas.');
  if (selectedInvoiceType.value === 'registration') {
    emit('switch-tab', 'exam');
  }
};

const simulateDuitkuSuccess = async () => {
  isSimulatingPaid.value = true;
  try {
    await handleDuitkuSuccess({ status: 'success', reference: duitkuReference.value });
  } finally {
    isSimulatingPaid.value = false;
  }
};

const checkPaymentStatusFromModal = async () => {
  await checkPaymentStatus(false);
  if (isCurrentInvoicePaid.value) {
    showDuitkuModal.value = false;
  }
};

const loadDuitkuMethods = async () => {
  try {
    const res = await financeApi.getPaymentMethods(currentInvoiceAmount.value).catch(() => null);
    if (res?.data?.data && Array.isArray(res.data.data)) {
      const mapped = res.data.data.map((item) => {
        let cat = 'va';
        const code = item.paymentMethod || item.code;
        let name = item.paymentName || item.name;
        if (code === 'NQ') {
          name = 'QRIS';
        } else {
          name = name.replace(/standar bi/gi, '').replace(/h2h/gi, '').replace(/e-wallet/gi, '').trim();
        }
        if (code === 'NQ' || code === 'SP' || name.toLowerCase().includes('qris')) {
          cat = 'qris';
        } else if (['DA', 'OV', 'SA', 'LA', 'JP'].includes(code) || name.toLowerCase().includes('wallet')) {
          cat = 'ewallet';
        } else if (['IR', 'FT'].includes(code) || name.toLowerCase().includes('retail') || name.toLowerCase().includes('indomaret')) {
          cat = 'retail';
        } else if (['VC', 'DN'].includes(code)) {
          cat = 'retail';
        }

        let badge = 'Transfer Virtual Account';
        if (code === 'NQ') badge = 'Semua m-Banking & E-Wallet';
        else if (code === 'SP') badge = 'Scan QRIS';
        else if (code === 'BV') badge = 'Bank Utama BTH';
        else if (cat === 'ewallet') badge = 'Dompet Digital';
        else if (cat === 'retail') badge = 'Gerai Kasir';

        return {
          code,
          name,
          category: cat,
          fee: item.totalFee || 0,
          image: item.paymentImage || item.image || `https://images.duitku.com/hotlink-ok/${code}.PNG`,
          badge,
        };
      });
      if (mapped.length > 0) {
        duitkuMethodsList.value = mapped;
      }
    }
  } catch (err) {
    console.warn('loadDuitkuMethods notice:', err);
  }
};

const openDuitkuWindow = () => {
  if (duitkuPaymentUrl.value && !duitkuPaymentUrl.value.includes('.local')) {
    const win = window.open(duitkuPaymentUrl.value, '_blank', 'width=800,height=700');
    if (!win) {
      showDuitkuModal.value = true;
      toast.warning('Jendela baru browser diblokir. Halaman pembayaran ditampilkan melalui dialog portal.');
    }
  } else {
    showDuitkuModal.value = true;
  }
};

const handleRenewInvoice = async () => {
  if (!currentInvoice.value?.id) return;
  isRenewing.value = true;
  try {
    await applicantStore.renewInvoice(currentInvoice.value.id);
    toast.success('Tagihan berhasil diperbarui dengan batas jatuh tempo baru.');
    await fetchInvoices();
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
    toast.success('Permohonan cicilan UKT berhasil diajukan dan sedang ditinjau tim keuangan.');
  } catch (err) {
    toast.error('Gagal mengajukan cicilan: ' + (err?.response?.data?.message || err.message));
  } finally {
    isSubmittingInstallment.value = false;
  }
};

const copyText = async (text, label) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} (${text}) berhasil disalin.`);
  } catch {
    toast.info(`${label} (${text}) siap digunakan.`);
  }
};

const printReceipt = () => {
  window.print();
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
      }
    }
  } catch (err) {
    console.warn('fetchInvoices notice:', err?.message);
  } finally {
    isLoadingInvoices.value = false;
  }
};

let pollInterval = null;

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
    let isConfirmedPaid = false;
    let isAwaiting = false;

    if (currentInvoice.value?.id && activePaymentId.value) {
      const statusRes = await financeApi
        .getPaymentStatus(currentInvoice.value.id, activePaymentId.value)
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

    await fetchInvoices();

    if (isCurrentInvoicePaid.value || isConfirmedPaid) {
      stopAutoPolling();
      showDuitkuModal.value = false;
      if (selectedInvoiceType.value === 'registration') {
        applicantStore.payRegFee('Transfer Virtual Account');
      } else {
        applicantStore.payUktFee('Transfer Virtual Account');
      }
      toast.success('Pembayaran telah terverifikasi secara otomatis oleh sistem perbankan.');
    } else if (isCurrentInvoicePending.value || isAwaiting) {
      if (!isSilent) {
        toast.info('Bukti pembayaran sedang dalam antrean verifikasi staf keuangan.');
      }
    } else {
      if (!isSilent) {
        toast.warning('Pembayaran belum terdeteksi. Silakan selesaikan transaksi lalu periksa kembali.');
      }
    }
  } catch (err) {
    if (!isSilent) {
      toast.info('Status pembayaran sedang diperbarui oleh sistem.');
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
      formData.append('file', file);
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

onMounted(async () => {
  await fetchInvoices();
  await loadDuitkuMethods();
  if (applicantStore.isResultPassed && hasTuitionInvoice.value) {
    selectedInvoiceType.value = 'tuition';
  }
  if (!isCurrentInvoicePaid.value) {
    startAutoPolling();
  }
  window.addEventListener('focus', handleWindowFocus);
});

onUnmounted(() => {
  stopAutoPolling();
  window.removeEventListener('focus', handleWindowFocus);
});
</script>
