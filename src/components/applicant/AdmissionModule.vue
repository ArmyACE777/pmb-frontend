<template>
  <div class="space-y-6">
    <!-- Header Modul Jalur Pendaftaran -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900 tracking-tight">
          Jalur Pendaftaran & Pilihan Program Studi
        </h2>
        <p class="text-xs text-slate-500 font-sans mt-0.5">
          Tentukan jalur seleksi dan program studi prioritas Anda untuk Tahun Akademik 2026/2027 di Universitas Bakti Tunas Husada.
        </p>
      </div>

      <!-- Status Indicator -->
      <div class="self-start sm:self-auto flex flex-wrap items-center gap-2">
        <span
          v-if="applicantStore.isWithdrawn"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200"
        >
          <span>Mengundurkan Diri</span>
        </span>
        <span
          v-else-if="applicantStore.pendingWithdrawal"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200"
        >
          <span>Pengunduran Diri Ditinjau</span>
        </span>
        <span
          v-else-if="applicantStore.pendingPathChange"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#1E3A8A] border border-blue-200"
        >
          <span>Pindah Jalur Ditinjau</span>
        </span>
        <span
          v-else-if="applicantStore.isAdmissionLocked"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
        >
          <span>Pendaftaran Terkunci (Biaya Lunas)</span>
        </span>
        <span
          v-else-if="applicantStore.state.admission.prodi1"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#1E3A8A] border border-blue-200"
        >
          <span>Pilihan Tersimpan (Menunggu Pembayaran)</span>
        </span>
        <span
          v-else
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200"
        >
          <span>Belum Memilih</span>
        </span>
      </div>
    </div>

    <!-- Banner Permohonan Pindah Jalur Sedang Ditinjau Admin (CR-006) -->
    <div
      v-if="applicantStore.pendingPathChange"
      class="p-4 sm:p-5 bg-blue-50/90 border border-blue-200 rounded-xl text-xs space-y-3 text-blue-900 shadow-2xs animate-fadeIn"
    >
      <div class="flex items-center gap-2 pb-2.5 border-b border-blue-100 font-bold text-sm text-[#1E3A8A] font-sora">
        <Clock class="w-4 h-4 text-[#1E3A8A]" />
        <span>Permohonan Pindah Jalur Sedang Ditinjau Admin PMB</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-0.5">
        <div>
          <span class="text-blue-700/80 text-[11px] block">Jalur Pendaftaran Tujuan:</span>
          <span class="font-semibold text-blue-950 font-sora text-xs sm:text-sm">
            {{ applicantStore.pendingPathChange?.new_track_name || 'Jalur Pilihan Baru' }}
          </span>
        </div>
        <div>
          <span class="text-blue-700/80 text-[11px] block">Alasan Pengajuan:</span>
          <span class="text-blue-900 italic font-sans">
            "{{ applicantStore.pendingPathChange?.reason || 'Permohonan perubahan jalur seleksi' }}"
          </span>
        </div>
      </div>

      <div class="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-blue-100/90">
        <span class="text-[11px] text-blue-700 font-sans">
          Diajukan pada: {{ applicantStore.pendingPathChange?.submitted_at || 'Hari ini' }}
        </span>
        <button
          type="button"
          @click="openCancelPathChangeModal"
          :disabled="isCancellingPathChange"
          class="px-3.5 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 self-end sm:self-auto"
        >
          <Loader2 v-if="isCancellingPathChange" class="w-3.5 h-3.5 animate-spin" />
          <span>{{ isCancellingPathChange ? 'Membatalkan...' : 'Batalkan Permohonan' }}</span>
        </button>
      </div>
    </div>

    <!-- Banner Permohonan Pengunduran Diri Ditolak oleh Panitia PMB (CR-007) -->
    <div
      v-if="applicantStore.rejectedWithdrawal"
      class="p-4 sm:p-5 bg-white border-l-[3px] border-l-rose-600 border border-slate-200 rounded-xl text-xs space-y-2.5 text-slate-800 shadow-2xs animate-fadeIn font-sans"
    >
      <div class="flex items-center justify-between gap-2">
        <div class="font-bold flex items-center gap-2 text-sm text-slate-900 font-sora">
          <AlertCircle class="w-4 h-4 text-rose-600" />
          <span>Permohonan Pengunduran Diri Ditolak Panitia PMB</span>
        </div>
        <button
          type="button"
          @click="applicantStore.dismissRejectedWithdrawal"
          class="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
          title="Tutup pemberitahuan"
        >
          &times;
        </button>
      </div>
      <p class="text-xs text-slate-600 leading-relaxed font-sans">
        Permohonan pengunduran diri yang Anda ajukan sebelumnya tidak disetujui oleh Panitia PMB. Status pendaftaran dan hak seleksi Anda saat ini tetap aktif.
      </p>
      <div v-if="applicantStore.rejectedWithdrawal?.review_note" class="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 font-sans">
        <div class="text-[11px] font-semibold text-slate-500 mb-0.5">Catatan & Pesan Panitia PMB:</div>
        <div class="italic">"{{ applicantStore.rejectedWithdrawal.review_note }}"</div>
      </div>
    </div>

    <!-- Banner Permohonan Pengunduran Diri Sedang Diverifikasi (CR-007) -->
    <div
      v-if="applicantStore.pendingWithdrawal"
      class="p-4 sm:p-5 bg-amber-50/90 border border-amber-200 rounded-xl text-xs space-y-3 text-amber-900 shadow-2xs animate-fadeIn font-sans"
    >
      <div class="flex items-center gap-2 pb-2.5 border-b border-amber-200/80 font-bold text-sm text-amber-900 font-sora">
        <AlertCircle class="w-4 h-4 text-amber-600" />
        <span>Permohonan Pengunduran Diri Sedang Diverifikasi</span>
      </div>

      <p class="text-xs text-amber-800 leading-relaxed font-sans">
        Anda telah mengajukan permohonan pengunduran diri dengan kategori alasan
        <strong class="font-semibold text-amber-950">{{ applicantStore.pendingWithdrawal?.reason_category || 'Lainnya' }}</strong>.
        Berkas permohonan saat ini sedang diverifikasi oleh Biro Administrasi Akademik & Kemahasiswaan (BAAK) Universitas BTH.
      </p>

      <div class="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-amber-200/70 text-[11px] text-amber-900">
        <span class="font-medium">Pengajuan ini bersifat permanen dan tidak dapat dibatalkan secara sepihak.</span>
        <span class="text-amber-700 italic">Menunggu keputusan Panitia PMB</span>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- KONDISI A: TAMPILAN RESMI PENGUNDURAN DIRI                                -->
    <!-- ========================================================================= -->
    <div
      v-if="applicantStore.isWithdrawn"
      class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden animate-fadeIn"
    >
      <!-- Header Status Pengunduran Diri Resmi (Tanpa Tombol Unduh PDF) -->
      <div class="p-6 sm:p-7 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center flex-shrink-0 border border-rose-200 shadow-2xs">
            <UserX class="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-rose-600 text-white">
                Mengundurkan Diri
              </span>
              <span class="text-xs text-slate-500 font-medium font-sans">Sekretariat PMB 2026/2027</span>
            </div>
            <h3 class="font-sora font-extrabold text-slate-900 text-base sm:text-lg mt-1">
              Status Pengunduran Diri Calon Mahasiswa
            </h3>
            <p class="text-xs text-slate-500 font-sans mt-0.5">
              Universitas Bakti Tunas Husada • Biro Administrasi Akademik & Kemahasiswaan
            </p>
          </div>
        </div>
      </div>

      <!-- Detail Keterangan Status Pengunduran Diri -->
      <div class="p-6 sm:p-7 space-y-6 font-sans">
        <!-- 4 Grid Informasi Esensial (Clean, Non-Over, Tanpa No SK & Tanpa Kode Keabsahan) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <div class="text-[11px] text-slate-400 font-medium">Tanggal Pengesahan</div>
            <div class="font-sans font-semibold text-xs sm:text-sm text-slate-900">
              {{ formatHistoryDate(applicantStore.withdrawalInfo?.effective_at || applicantStore.withdrawalInfo?.requested_at || new Date().toISOString()) }}
            </div>
          </div>

          <div class="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <div class="text-[11px] text-slate-400 font-medium">Nama Calon Mahasiswa</div>
            <div class="font-sora font-bold text-xs sm:text-sm text-slate-900 truncate">
              {{ applicantStore.state.candidate?.fullName || 'Calon Mahasiswa' }}
            </div>
          </div>

          <div class="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <div class="text-[11px] text-slate-400 font-medium">Nomor Registrasi PMB</div>
            <div class="font-mono font-semibold text-xs sm:text-sm text-slate-700">
              {{ applicantStore.state.candidate?.registrationNumber || 'BTH-2026-REG' }}
            </div>
          </div>

          <div class="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <div class="text-[11px] text-slate-400 font-medium">Kategori Alasan</div>
            <div class="font-sans font-semibold text-xs sm:text-sm text-slate-800">
              {{ applicantStore.withdrawalInfo?.reason_category || applicantStore.state.withdrawalInfo?.reason_category || 'Diterima di Perguruan Tinggi Lain' }}
            </div>
          </div>
        </div>

        <!-- Detail Keterangan Alasan Calon Mahasiswa -->
        <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
          <div class="text-xs font-semibold text-slate-700">Keterangan Alasan Calon Mahasiswa:</div>
          <p class="text-xs text-slate-600 leading-relaxed italic">
            "{{ applicantStore.withdrawalInfo?.reason_text || applicantStore.withdrawalInfo?.reason || applicantStore.state.withdrawalInfo?.reason || 'Pengunduran diri calon mahasiswa yang telah diverifikasi dan disahkan oleh panitia PMB Universitas BTH.' }}"
          </p>
        </div>

        <!-- Detail Catatan Panitia PMB (Jika ada) -->
        <div v-if="applicantStore.withdrawalInfo?.review_note" class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5 font-sans">
          <div class="text-xs font-semibold text-slate-800">Catatan Panitia PMB:</div>
          <p class="text-xs text-slate-700 leading-relaxed font-sans italic">
            "{{ applicantStore.withdrawalInfo.review_note }}"
          </p>
        </div>

        <!-- ========================================================================= -->
        <!-- INFORMASI PENGEMBALIAN DANA (REFUND) - JALUR REGULER VS JALUR BEASISWA     -->
        <!-- ========================================================================= -->
        <div
          class="rounded-xl border p-5 sm:p-6 space-y-3.5 font-sans transition-all"
          :class="applicantStore.isFreeTrack ? 'bg-slate-50 border-slate-200' : 'bg-blue-50/40 border-blue-200'"
        >
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b"
            :class="applicantStore.isFreeTrack ? 'border-slate-200' : 'border-blue-100'"
          >
            <div class="flex items-center gap-2.5">
              <div
                class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                :class="applicantStore.isFreeTrack ? 'bg-slate-200 text-slate-700' : 'bg-[#1E3A8A] text-white'"
              >
                <CreditCard class="w-4 h-4" />
              </div>
              <div>
                <h4 class="font-sora font-bold text-xs sm:text-sm text-slate-900">
                  Informasi Pengembalian Dana (Refund)
                </h4>
                <div class="text-[11px] text-slate-500 font-sans">
                  Status finansial pendaftaran pasca pengunduran diri
                </div>
              </div>
            </div>

            <!-- Status Refund Badge -->
            <span
              v-if="applicantStore.isFreeTrack"
              class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-200 text-slate-700 self-start sm:self-auto border border-slate-300"
            >
              Tidak Berlaku Refund (Jalur Bebas Biaya)
            </span>
            <span
              v-else-if="currentRefundReview?.status === 'approved'"
              class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 self-start sm:self-auto"
            >
              Refund Telah Dikonfirmasi & Diproses
            </span>
            <span
              v-else-if="applicantStore.isRegPaymentComplete || applicantStore.isUktPaid"
              class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200 self-start sm:self-auto"
            >
              Pengajuan Refund Sedang Ditinjau Keuangan
            </span>
            <span
              v-else
              class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 self-start sm:self-auto"
            >
              Tagihan Dibatalkan (Belum Ada Pembayaran Masuk)
            </span>
          </div>

          <!-- KASUS A: JALUR BEASISWA / BEBAS BIAYA -->
          <template v-if="applicantStore.isFreeTrack">
            <div class="text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <p>
                Pendaftaran Anda tercatat melalui <strong class="text-slate-800">{{ applicantStore.state?.admission?.track || 'Jalur Beasiswa / Kemitraan' }}</strong> yang berstatus pembebasan biaya pendaftaran (<strong>Rp 0 / Bebas Biaya</strong>).
              </p>
              <p class="text-[11px] text-slate-500">
                Karena tidak terdapat penerimaan transaksi pembayaran pada kas universitas untuk akun ini, proses pengembalian dana (refund) tidak berlaku.
              </p>
            </div>
          </template>

          <!-- KASUS B: JALUR REGULER (BERBAYAR) DENGAN PEMBAYARAN MASUK -->
          <template v-else-if="applicantStore.isRegPaymentComplete || applicantStore.isUktPaid">
            <div class="space-y-3.5">
              <p class="text-xs text-slate-700 leading-relaxed">
                Pengunduran diri pada <strong class="text-slate-900">{{ applicantStore.state?.admission?.track || 'Jalur Reguler' }}</strong> memenuhi syarat pengembalian dana pembayaran sesuai regulasi PMB Universitas BTH.
              </p>

              <!-- Jika Telah Dikonfirmasi Admin Keuangan -->
              <div v-if="currentRefundReview?.status === 'approved'" class="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2.5">
                <div class="flex items-center gap-2 text-emerald-800 font-semibold text-xs font-sora">
                  <CheckCircle2 class="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Pengembalian Dana Telah Dikonfirmasi & Diproses</span>
                </div>
                <div v-if="currentRefundReview?.notes" class="p-3 bg-white border border-emerald-200/80 rounded-lg text-xs text-slate-700 leading-relaxed">
                  <span class="text-[11px] font-semibold text-slate-500 block mb-0.5">Pesan dari Biro Administrasi Keuangan:</span>
                  "{{ currentRefundReview.notes }}"
                </div>
                <p class="text-[11px] text-emerald-700 leading-relaxed">
                  Pencairan dana dikembalikan melalui transfer ke rekening asal yang digunakan saat pembayaran. Silakan hubungi Helpdesk Keuangan jika dana belum diterima dalam 3–5 hari kerja.
                </p>
              </div>

              <!-- Jika Masih Menunggu Konfirmasi Admin Keuangan -->
              <div v-else class="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                <div class="flex items-center gap-2 text-amber-900 font-semibold text-xs font-sora">
                  <AlertCircle class="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>Menunggu Konfirmasi Biro Keuangan</span>
                </div>
                <p class="text-xs text-slate-700 leading-relaxed">
                  Permohonan pengembalian dana pendaftaran Anda sedang dalam proses peninjauan oleh Biro Administrasi Keuangan PMB. Setelah dikonfirmasi oleh panitia, catatan konfirmasi resmi akan langsung ditampilkan pada bagian ini.
                </p>
                <div class="text-[11px] text-slate-500">
                  Estimasi waktu peninjauan: 1 – 3 hari kerja sejak pengunduran diri disahkan.
                </div>
              </div>

              <div class="p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2.5">
                <AlertCircle class="w-4 h-4 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
                <p class="leading-relaxed">
                  Pencairan dana refund ditransfer ke rekening asal saat pembayaran. Apabila memerlukan konfirmasi nomor rekening penerima, silakan hubungi kontak layanan keuangan PMB BTH.
                </p>
              </div>
            </div>
          </template>

          <!-- KASUS C: JALUR REGULER BELUM BAYAR -->
          <template v-else>
            <div class="text-xs text-slate-600 space-y-1 leading-relaxed">
              <p>
                Tagihan formulir pendaftaran belum diselesaikan sebelum pengunduran diri. Seluruh tagihan aktif telah dibatalkan otomatis (void).
              </p>
              <p class="text-[11px] text-slate-500">
                Tidak ada kewajiban pembayaran yang tertunggak dan tidak ada dana yang perlu dikembalikan.
              </p>
            </div>
          </template>
        </div>

        <!-- Callout Rekonsiliasi & Status Akun -->
        <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 text-xs text-slate-700 font-sans">
          <AlertCircle class="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
          <div class="space-y-1">
            <div class="font-semibold text-slate-900">Status Kepesertaan Pendaftaran Ini Dinonaktifkan Permanen</div>
            <p class="text-[11px] text-slate-600 leading-relaxed font-sans">
              Seluruh hak seleksi, ujian CBT, kelulusan, dan hak daftar ulang terkait formulir pendaftaran ini telah dinonaktifkan secara permanen. Pengunduran diri resmi ini bersifat final dan akun pendaftaran ini tidak dapat memilih jalur kembali.
            </p>
          </div>
        </div>
      </div>

      <!-- Action Footer (Clean: Pusat Layanan BTH) -->
      <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3 font-sans">
        <a
          :href="cmsStore.contact.whatsappLink || 'https://api.whatsapp.com/send?phone=6282117100200&text=Halo%20Helpdesk%20PMB%20BTH%2C%20saya%20ingin%20konfirmasi%20pengunduran%20diri%20dan%20refund.'"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs text-[#1E3A8A] hover:underline font-semibold flex items-center gap-1.5"
        >
          <span>Pusat Layanan PMB & Keuangan BTH</span>
        </a>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- KONDISI B: FORM UTAMA PEMILIHAN JALUR & PROGRAM STUDI                     -->
    <!-- ========================================================================= -->
    <form v-else @submit.prevent="saveAdmission" class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div class="p-6 sm:p-7 space-y-6">
        <!-- 1. Pemilihan Jalur Pendaftaran -->
        <div class="space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <label class="block text-xs font-bold text-slate-800 font-sora">
              Pilihan Jalur Pendaftaran <span class="text-rose-500 font-semibold">*</span>
            </label>
            <span class="text-[11px] text-slate-400 font-sans">
              Tahun Akademik {{ applicantStore.state.admission.academicYear || '2026/2027' }}
            </span>
          </div>

          <select
            v-model="admissionForm.track"
            :disabled="applicantStore.isAdmissionLocked"
            required
            class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-lg outline-none text-slate-800 font-sans font-medium text-xs cursor-pointer transition-colors disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            <option value="" disabled>-- Pilih Jalur Pendaftaran --</option>
            <option v-for="t in trackList" :key="t.name" :value="t.name">
              {{ t.name }} ({{ t.badge }})
            </option>
          </select>

          <!-- Detail Informasi Jalur yang Dipilih -->
          <div v-if="currentTrackDetails" class="space-y-3 pt-1 text-[11px]">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-500">
              <span>{{ currentTrackDetails.description }}</span>
              <!-- Tampilkan status biaya berdasarkan tipe jalur -->
              <span v-if="isCurrentTrackFree" class="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" />
                Biaya Formulir: Rp 0 (Bebas Biaya / Beasiswa)
              </span>
              <span v-else class="font-medium text-slate-700 whitespace-nowrap">
                Biaya Formulir: Rp {{ (currentTrackDetails.registration_fee ?? 250000).toLocaleString('id-ID') }}
              </span>
            </div>

            <!-- Ringkasan Berkas Persyaratan Jalur yang Dipilih -->
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2 animate-fadeIn">
              <div class="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-200/70">
                <div class="flex items-center gap-1.5 font-semibold text-slate-800 text-xs font-sora">
                  <FileText class="w-3.5 h-3.5 text-[#1E3A8A]" />
                  <span>Kebutuhan Berkas Pendaftaran:</span>
                </div>
                <span class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-[#1E3A8A] border border-blue-200">
                  {{ 5 + currentTrackSpecificDocs.length }} Total Berkas (5 Pokok + {{ currentTrackSpecificDocs.length }} Khusus Jalur)
                </span>
              </div>

              <!-- Jika Memiliki Berkas Khusus Jalur -->
              <div v-if="currentTrackSpecificDocs.length > 0" class="space-y-2 pt-0.5">
                <p class="text-[11px] text-slate-500 font-sans">
                  Selain 5 berkas pokok (Ijazah/SKL, KTP, KK, Pas Foto, Surat Sehat), jalur ini mewajibkan berkas pendukung spesifik:
                </p>
                <div class="grid grid-cols-1 gap-1.5">
                  <div
                    v-for="doc in currentTrackSpecificDocs"
                    :key="doc.id"
                    class="p-2.5 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px]"
                  >
                    <div class="flex items-center gap-2">
                      <span class="font-semibold text-slate-800">{{ doc.title || doc.name }}</span>
                      <span
                        class="text-[10px] px-1.5 py-0.2 rounded font-semibold"
                        :class="(doc.required ?? doc.isRequired) ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-600 border border-slate-200'"
                      >
                        {{ (doc.required ?? doc.isRequired) ? 'Wajib' : 'Pendukung' }}
                      </span>
                    </div>
                    <span class="text-[10px] text-slate-500 font-sans">Format: PDF atau JPG/PNG (Maks. 2 MB)</span>
                  </div>
                </div>

                <!-- Tombol Navigasi Cepat Langsung ke Halaman Berkas -->
                <div class="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-200/70">
                  <span class="text-[11px] text-slate-600 font-sans">
                    Seluruh berkas khusus ini diunggah pada <strong>Halaman Berkas</strong>.
                  </span>
                  <button
                    type="button"
                    @click="goToDocumentModule"
                    class="px-3.5 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-[11px] font-semibold rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <Upload class="w-3.5 h-3.5" />
                    <span>Buka Halaman Berkas & Unggah</span>
                  </button>
                </div>
              </div>

              <!-- Jika Jalur Reguler / Hanya Berkas Pokok -->
              <div v-else class="text-[11px] text-slate-600 flex items-center gap-2 py-0.5">
                <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Jalur ini hanya memerlukan <strong>5 Berkas Pokok Standar</strong> tanpa dokumen tambahan khusus.</span>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-slate-100"></div>

        <!-- 2. Pemilihan Program Studi (2 Kolom Terstruktur) -->
        <div class="space-y-3">
          <div class="text-xs font-semibold text-slate-800">
            Pilihan Program Studi
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <!-- Pilihan 1: Prioritas Utama (Wajib) -->
            <div class="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3">
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1.5">
                  Program Studi Pilihan Utama <span class="text-rose-500">*</span>
                </label>
                <select
                  v-model="admissionForm.prodi1"
                  :disabled="applicantStore.isAdmissionLocked"
                  required
                  class="w-full px-3.5 py-2 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-lg outline-none text-slate-800 font-sans font-medium text-xs cursor-pointer transition-colors disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>-- Pilih Program Studi Utama --</option>
                  <option v-for="item in prodiList" :key="item.code" :value="item.name">
                    {{ item.name }} ({{ item.faculty_name }}) - {{ item.degree }}
                  </option>
                </select>
              </div>

              <!-- Metadata Pilihan 1 Ringkas & Bersih -->
              <div v-if="currentProdi1Details" class="pt-2 border-t border-slate-200/60 text-xs space-y-1.5">
                <div class="flex justify-between items-center text-slate-600">
                  <span class="text-slate-400 text-[11px]">Fakultas:</span>
                  <span class="font-medium text-slate-800 text-[11px]">{{ currentProdi1Details.faculty_name }}</span>
                </div>
                <div class="flex justify-between items-center text-slate-600">
                  <span class="text-slate-400 text-[11px]">Jenjang & Akreditasi:</span>
                  <span class="font-medium text-slate-800 text-[11px] flex items-center gap-1.5">
                    <span>{{ currentProdi1Details.degree }}</span>
                    <span v-if="currentProdi1Details.accreditation" class="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Akreditasi {{ currentProdi1Details.accreditation }}
                    </span>
                  </span>
                </div>
                <div class="flex justify-between items-center text-slate-600">
                  <span class="text-slate-400 text-[11px]">Estimasi Biaya UKT:</span>
                  <span class="font-semibold text-slate-800 text-xs font-mono">
                    Rp {{ currentProdi1Fee.toLocaleString('id-ID') }}
                    <span class="text-[10px] text-slate-400 font-sans font-normal">/ semester</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Pilihan 2: Alternatif Cadangan (Opsional) -->
            <div class="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3">
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1.5">
                  Program Studi Pilihan Kedua
                </label>
                <select
                  v-model="admissionForm.prodi2"
                  :disabled="applicantStore.isAdmissionLocked"
                  class="w-full px-3.5 py-2 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-lg outline-none text-slate-800 font-sans font-medium text-xs cursor-pointer transition-colors disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                >
                  <option value="">-- Tanpa Pilihan Kedua --</option>
                  <option
                    v-for="item in prodiList"
                    :key="item.code"
                    :value="item.name"
                    :disabled="item.name === admissionForm.prodi1"
                  >
                    {{ item.name }} ({{ item.faculty_name }}) - {{ item.degree }}
                  </option>
                </select>
              </div>

              <!-- Metadata Pilihan 2 Ringkas & Bersih -->
              <div v-if="currentProdi2Details" class="pt-2 border-t border-slate-200/60 text-xs space-y-1.5">
                <div class="flex justify-between items-center text-slate-600">
                  <span class="text-slate-400 text-[11px]">Fakultas:</span>
                  <span class="font-medium text-slate-800 text-[11px]">{{ currentProdi2Details.faculty_name }}</span>
                </div>
                <div class="flex justify-between items-center text-slate-600">
                  <span class="text-slate-400 text-[11px]">Jenjang & Akreditasi:</span>
                  <span class="font-medium text-slate-800 text-[11px] flex items-center gap-1.5">
                    <span>{{ currentProdi2Details.degree }}</span>
                    <span v-if="currentProdi2Details.accreditation" class="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Akreditasi {{ currentProdi2Details.accreditation }}
                    </span>
                  </span>
                </div>
              </div>
              <div v-else class="pt-2 border-t border-slate-200/60 text-[11px] text-slate-400 italic">
                Pilihan alternatif diproses apabila kuota pilihan utama telah penuh.
              </div>
            </div>
          </div>
        </div>

        <!-- Panduan Pemilihan Jalur PMB (Tips & Ketentuan Ringkas) -->
        <div class="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-2 font-sans">
          <div class="flex items-center gap-2 font-bold text-slate-800 font-sora">
            <HelpCircle class="w-4 h-4 text-[#1E3A8A] shrink-0" />
            <span>Ketentuan Pemilihan Jalur & Program Studi:</span>
          </div>
          <ul class="space-y-1.5 text-[11px] text-slate-500 pl-6 list-disc leading-relaxed">
            <li><strong>Program Studi Pilihan Utama:</strong> Prioritas alokasi kursi seleksi utama calon mahasiswa baru.</li>
            <li><strong>Program Studi Pilihan Kedua:</strong> Alternatif otomatis jika kuota pada pilihan utama telah terpenuhi (tanpa biaya pendaftaran tambahan).</li>
            <li><strong>Jalur Bebas Tes (Prestasi / Rapor):</strong> Kelulusan dievaluasi berdasarkan nilai rapor semester 1–5 atau sertifikat prestasi tanpa perlu mengikuti ujian CBT.</li>
            <li><strong>Perubahan Pilihan:</strong> Sebelum pembayaran formulir dilakukan, Anda dapat bebas mengganti pilihan atau mengosongkan pilihan. Setelah lunas, perubahan jalur dapat diajukan via tombol <em>Ajukan Pindah Jalur</em>.</li>
          </ul>
        </div>
      </div>

      <!-- FOOTER AKSI TERPADU -->
      <div class="px-6 py-4 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <!-- Keterangan Status Terarah -->
        <div class="text-xs text-slate-500 font-sans text-center sm:text-left">
          <span v-if="applicantStore.isAdmissionLocked" class="flex items-center gap-1.5 text-emerald-800">
            <Lock class="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span v-if="applicantStore.isFreeTrack">Pendaftaran telah dikonfirmasi melalui Jalur Bebas Biaya (Rp 0).</span>
            <span v-else>Pendaftaran telah dikunci karena biaya formulir telah terverifikasi lunas.</span>
          </span>
          <span v-else-if="applicantStore.state.admission.prodi1">
            <span>Pilihan tersimpan. Anda dapat langsung mengubah pilihan prodi di atas atau melanjutkan ke tahap berikutnya.</span>
          </span>
          <span v-else>
            <span v-if="isCurrentTrackFree">
              Jalur pendaftaran bebas biaya (Rp 0). Anda langsung diarahkan ke pengunggahan berkas persyaratan.
            </span>
            <span v-else>
              Setelah memilih jalur dan program studi, lanjutkan untuk menyelesaikan biaya formulir pendaftaran.
            </span>
          </span>
        </div>

        <!-- Tombol Aksi Sesuai Kondisi -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto justify-end">
          <!-- Kondisi 1: Jika Terkunci (Lunas) -> Pindah Jalur / Pengunduran Diri / Lanjut ke CBT -->
          <template v-if="applicantStore.isAdmissionLocked">
            <button
              type="button"
              @click="openPathChangeModal"
              :disabled="!!applicantStore.pendingPathChange"
              class="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300 hover:border-blue-300 bg-white hover:bg-blue-50 text-slate-700 hover:text-[#1E3A8A] text-xs font-semibold shadow-xs transition-colors cursor-pointer text-center disabled:opacity-50 disabled:cursor-not-allowed"
              :title="applicantStore.pendingPathChange ? 'Permohonan pindah jalur Anda sedang dalam peninjauan admin' : 'Ajukan permohonan pindah jalur'"
            >
              {{ applicantStore.pendingPathChange ? 'Pindah Jalur Ditinjau' : 'Ajukan Pindah Jalur' }}
            </button>
            <button
              type="button"
              @click="openWithdrawalModal"
              :disabled="!!applicantStore.pendingWithdrawal"
              class="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300 hover:border-rose-300 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer text-center disabled:opacity-50 disabled:cursor-not-allowed"
              :title="applicantStore.pendingWithdrawal ? 'Pengunduran diri Anda sedang dalam proses verifikasi panitia' : 'Ajukan pengunduran diri resmi'"
            >
              {{ applicantStore.pendingWithdrawal ? 'Pengunduran Diri Ditinjau' : 'Pengunduran Diri' }}
            </button>
            <button
              type="button"
              @click="emit('switch-tab', 'exam')"
              class="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs rounded-lg shadow-xs transition-all cursor-pointer text-center"
            >
              Lihat Sesi Ujian CBT
            </button>
          </template>

          <!-- Kondisi 2: Pilihan Tersimpan & Belum Bayar -->
          <template v-else-if="applicantStore.state.admission.prodi1">
            <button
              type="button"
              @click="openCancelModal"
              :disabled="isCancelling"
              class="w-full sm:w-auto px-3.5 py-2 rounded-lg border border-slate-200 hover:border-rose-300 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-medium shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              title="Kosongkan pilihan program studi dan mulai dari awal"
            >
              Kosongkan Pilihan
            </button>

            <!-- Jika Form Diubah: Simpan Perubahan; Jika Tidak: Langsung Lanjut ke Pembayaran / Berkas -->
            <button
              v-if="isFormChanged"
              type="submit"
              :disabled="isSaving || (isReferralTrack && !applicantStore.state?.referral?.isApplied)"
              class="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center"
            >
              {{ isSaving ? 'Menyimpan...' : (isReferralTrack && !applicantStore.state?.referral?.isApplied) ? 'Verifikasi Kode Referal Dahulu' : 'Simpan Perubahan Pilihan' }}
            </button>

            <button
              v-else
              type="button"
              @click="isCurrentTrackFree ? emit('switch-tab', 'documents') : emit('switch-tab', 'payment')"
              class="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer text-center"
            >
              {{ isCurrentTrackFree ? 'Lanjut ke Berkas Dokumen' : 'Lanjut ke Pembayaran' }}
            </button>
          </template>

          <!-- Kondisi 3: Belum Memilih Sama Sekali -->
          <button
            v-else
            type="submit"
            :disabled="isSaving || (isReferralTrack && !applicantStore.state?.referral?.isApplied)"
            class="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center"
          >
            {{ isSaving ? 'Menyimpan...' : (isReferralTrack && !applicantStore.state?.referral?.isApplied) ? 'Verifikasi Kode Referal Dahulu' : isCurrentTrackFree ? 'Simpan & Lanjut ke Berkas' : 'Simpan & Lanjut ke Pembayaran' }}
          </button>
        </div>
      </div>
    </form>

    <!-- ========================================================================= -->
    <!-- MODAL-MODAL DIALOG RESMI (TELEPORT)                                       -->
    <!-- ========================================================================= -->

    <!-- 1. Modal Konfirmasi Pembatalan Pilihan Prodi Sebelum Bayar -->
    <Teleport to="body">
      <div
        v-if="showCancelModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
        @click.self="showCancelModal = false"
      >
        <div class="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
          <div class="p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-base font-semibold text-slate-900 leading-snug font-sora">
                  Batalkan Pilihan Program Studi?
                </h3>
                <p class="text-xs text-slate-500 mt-1">
                  Program studi: <span class="font-medium text-slate-800">{{ admissionForm.prodi1 || applicantStore.state?.admission?.prodi1 || 'Program Studi Terpilih' }}</span>
                  <span class="text-slate-300 mx-1.5">•</span>
                  <span class="text-slate-600">{{ admissionForm.track || applicantStore.state?.admission?.track || 'Reguler' }}</span>
                </p>
              </div>
              <button
                type="button"
                @click="showCancelModal = false"
                class="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                title="Tutup dialog"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            <div class="mt-4 pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600 leading-relaxed font-sans">
              <p>
                Pilihan program studi saat ini akan dibatalkan dari sistem. Anda dapat langsung memilih kembali program studi atau jalur seleksi lain pada formulir pendaftaran.
              </p>
              <p class="text-[11px] text-slate-400">
                Catatan: Pembatalan hanya dapat dilakukan sebelum biaya formulir pendaftaran dibayarkan.
              </p>
            </div>
          </div>

          <div class="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              @click="showCancelModal = false"
              :disabled="isCancelling"
              class="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              Kembali
            </button>
            <button
              type="button"
              @click="confirmCancelAdmission"
              :disabled="isCancelling"
              class="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Loader2 v-if="isCancelling" class="w-3.5 h-3.5 animate-spin" />
              <span>{{ isCancelling ? 'Membatalkan...' : 'Ya, Batalkan Pilihan' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 2. Modal Permohonan Pindah Jalur (CR-006) -->
    <Teleport to="body">
      <div
        v-if="showPathChangeModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
        @click.self="showPathChangeModal = false"
      >
        <div class="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
          <div class="p-6 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 class="font-sora font-bold text-slate-900 text-base">
                Permohonan Pindah Jalur / Program Studi
              </h3>
              <button @click="showPathChangeModal = false" class="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer">&times;</button>
            </div>

            <p class="text-xs text-slate-500 font-sans">
              Karena biaya pendaftaran sudah diverifikasi lunas, perubahan jalur atau program studi memerlukan persetujuan dari panitia PMB Universitas BTH.
            </p>

            <div class="space-y-3 text-xs font-sans">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Jalur Pendaftaran Baru <span class="text-rose-500">*</span></label>
                <select
                  v-model="pathChangeForm.track"
                  required
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] rounded-lg text-xs outline-none"
                >
                  <option value="" disabled>-- Pilih Jalur Baru --</option>
                  <option v-for="t in trackList" :key="t.name" :value="t.name">
                    {{ t.name }} (Biaya: Rp {{ (t.registration_fee || 250000).toLocaleString('id-ID') }})
                  </option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Pilihan Program Studi 1 (Baru) <span class="text-rose-500">*</span></label>
                <select
                  v-model="pathChangeForm.prodi1"
                  required
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] rounded-lg text-xs outline-none"
                >
                  <option value="" disabled>-- Pilih Program Studi 1 --</option>
                  <option v-for="p in prodiList" :key="p.code" :value="p.name">
                    {{ p.name }} ({{ p.faculty_name }})
                  </option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Pilihan Program Studi 2 (Baru)</label>
                <select
                  v-model="pathChangeForm.prodi2"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] rounded-lg text-xs outline-none"
                >
                  <option value="">-- Tidak Memilih Pilihan 2 --</option>
                  <option v-for="p in prodiList" :key="p.code" :value="p.name">
                    {{ p.name }} ({{ p.faculty_name }})
                  </option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Alasan Pengajuan Pindah Jalur <span class="text-rose-500">*</span></label>
                <textarea
                  v-model="pathChangeForm.reason"
                  rows="3"
                  required
                  placeholder="Jelaskan secara singkat alasan kepindahan jalur atau program studi Anda..."
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] rounded-lg text-xs outline-none"
                ></textarea>
              </div>

              <div
                v-if="pathChangeError"
                class="p-3 bg-slate-50 border border-slate-200 border-l-[3px] border-l-rose-600 rounded-xl flex items-start gap-2.5 text-xs text-slate-800"
              >
                <AlertCircle class="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div class="flex-1 space-y-0.5">
                  <div class="font-semibold text-slate-900">Permohonan Belum Dapat Diproses</div>
                  <div class="text-slate-600 leading-relaxed">{{ pathChangeError }}</div>
                </div>
                <button
                  type="button"
                  @click="pathChangeError = ''"
                  class="text-slate-400 hover:text-slate-600 p-0.5 leading-none cursor-pointer"
                  title="Tutup"
                >
                  <X class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div class="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              @click="showPathChangeModal = false"
              class="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              @click="submitPathChange"
              :disabled="!pathChangeForm.track || !pathChangeForm.prodi1 || !pathChangeForm.reason || isSubmittingPathChange"
              class="px-4 py-2 rounded-lg bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Loader2 v-if="isSubmittingPathChange" class="w-3.5 h-3.5 animate-spin" />
              <span>{{ isSubmittingPathChange ? 'Mengirim...' : 'Kirim Permohonan' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 3. Modal Konfirmasi Batalkan Permohonan Pindah Jalur -->
    <Teleport to="body">
      <div
        v-if="showCancelPathChangeModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
        @click.self="showCancelPathChangeModal = false"
      >
        <div class="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
          <div class="p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-base font-semibold text-slate-900 leading-snug font-sora">
                  Batalkan Permohonan Pindah Jalur?
                </h3>
                <p class="text-xs text-slate-500 mt-1">
                  Permohonan alih ke <span class="font-medium text-slate-800">{{ applicantStore.pendingPathChange?.new_track_name || 'Jalur Baru' }}</span> akan dibatalkan.
                </p>
              </div>
              <button
                type="button"
                @click="showCancelPathChangeModal = false"
                class="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            <div class="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 leading-relaxed font-sans">
              Data pendaftaran Anda akan tetap berada pada jalur dan program studi pilihan semula. Tindakan ini akan menghapus permohonan dari antrean verifikasi panitia PMB.
            </div>
          </div>

          <div class="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              @click="showCancelPathChangeModal = false"
              :disabled="isCancellingPathChange"
              class="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-50"
            >
              Kembali
            </button>
            <button
              type="button"
              @click="confirmCancelPathChange"
              :disabled="isCancellingPathChange"
              class="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Loader2 v-if="isCancellingPathChange" class="w-3.5 h-3.5 animate-spin" />
              <span>{{ isCancellingPathChange ? 'Membatalkan...' : 'Ya, Batalkan Permohonan' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 4. Modal Pengunduran Diri Resmi (CR-007) -->
    <Teleport to="body">
      <div
        v-if="showWithdrawalModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
        @click.self="showWithdrawalModal = false"
      >
        <div class="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
          <!-- Header (Sticky) -->
          <div class="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle class="w-4 h-4" />
              </div>
              <div>
                <h3 class="font-sora font-bold text-slate-900 text-sm">
                  Pengajuan Pengunduran Diri Resmi
                </h3>
                <p class="text-[11px] text-slate-500 font-sans">
                  Konfirmasi penghentian kepesertaan seleksi PMB
                </p>
              </div>
            </div>
            <button
              type="button"
              @click="showWithdrawalModal = false"
              class="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Body (Scrollable) -->
          <div class="p-5 space-y-3.5 overflow-y-auto text-xs font-sans">
            <!-- Warning Box (Consolidated & Clean) -->
            <div class="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div class="leading-relaxed">
                <span class="font-semibold text-amber-950">Peringatan Permanen:</span> Pengunduran diri bersifat final. Seluruh hak seleksi, alokasi program studi, dan nomor pendaftaran Anda akan dicabut resmi oleh Panitia PMB.
              </div>
            </div>

            <!-- Form Grid: Kategori Alasan & Konfirmasi Sandi -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-medium text-slate-700 mb-1 text-[11px]">
                  Kategori Alasan <span class="text-rose-500">*</span>
                </label>
                <select
                  v-model="withdrawalForm.category"
                  required
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] focus:bg-white rounded-lg text-xs outline-none transition-colors"
                >
                  <option value="" disabled>-- Pilih Alasan --</option>
                  <option value="Diterima di PTN (SNBP/SNBT)">Diterima di PTN (SNBP / SNBT)</option>
                  <option value="Kendala Finansial / Ekonomi">Kendala Finansial Keluarga</option>
                  <option value="Alasan Lokasi / Domisili Luar Kota">Domisili Luar Kota</option>
                  <option value="Kondisi Medis / Kesehatan">Kondisi Kesehatan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label class="block font-medium text-slate-700 mb-1 text-[11px]">
                  Konfirmasi Kata Sandi Akun <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="withdrawalForm.password"
                  type="password"
                  required
                  placeholder="Kata sandi akun PMB Anda"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] focus:bg-white rounded-lg text-xs outline-none transition-colors"
                />
              </div>
            </div>

            <!-- Rincian Alasan Pengunduran Diri -->
            <div>
              <label class="block font-medium text-slate-700 mb-1 text-[11px]">
                Rincian Surat Permohonan Pengunduran Diri <span class="text-rose-500">*</span>
              </label>
              <textarea
                v-model="withdrawalForm.reason"
                rows="2"
                required
                placeholder="Tuliskan keterangan detail alasan mengajukan pengunduran diri..."
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] focus:bg-white rounded-lg text-xs outline-none transition-colors resize-none"
              ></textarea>
            </div>

            <!-- Agreement Checkbox -->
            <label class="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/70 transition-colors">
              <input
                v-model="withdrawalForm.agreement"
                type="checkbox"
                class="mt-0.5 rounded text-[#1E3A8A] focus:ring-blue-100 cursor-pointer"
              />
              <span class="text-[11px] text-slate-600 leading-snug">
                Saya memahami dan menyetujui bahwa pengajuan ini bersifat <strong>permanen</strong> dan tidak dapat ditarik kembali setelah dikirimkan ke Panitia PMB.
              </span>
            </label>

            <!-- Inline Error Alert if any -->
            <div
              v-if="withdrawalError"
              class="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs text-rose-800"
            >
              <AlertCircle class="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div class="flex-1 text-[11px] leading-relaxed">
                <span class="font-semibold text-rose-900">Gagal: </span>
                <span>{{ withdrawalError }}</span>
              </div>
              <button
                type="button"
                @click="withdrawalError = ''"
                class="text-rose-400 hover:text-rose-600 p-0.5 leading-none cursor-pointer"
                title="Tutup"
              >
                <X class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- Footer (Sticky & Always Visible) -->
          <div class="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              @click="showWithdrawalModal = false"
              class="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              @click="submitWithdrawal"
              :disabled="!withdrawalForm.category || !withdrawalForm.reason || !withdrawalForm.password || !withdrawalForm.agreement || isSubmittingWithdrawal"
              class="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              <Loader2 v-if="isSubmittingWithdrawal" class="w-3.5 h-3.5 animate-spin" />
              <span>{{ isSubmittingWithdrawal ? 'Memproses...' : 'Ajukan Pengunduran Diri' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 5. Modal Konfirmasi Batalkan Pengajuan Pengunduran Diri -->
    <Teleport to="body">
      <div
        v-if="showCancelWithdrawalModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
        @click.self="showCancelWithdrawalModal = false"
      >
        <div class="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
          <div class="p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-base font-semibold text-slate-900 leading-snug font-sora">
                  Batalkan Pengajuan Pengunduran Diri?
                </h3>
                <p class="text-xs text-slate-500 mt-1">
                  Permohonan pengunduran diri Anda yang sedang berstatus <span class="font-medium text-amber-700">pending</span> akan dibatalkan.
                </p>
              </div>
              <button
                type="button"
                @click="showCancelWithdrawalModal = false"
                class="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            <div class="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 leading-relaxed font-sans">
              Status pendaftaran Anda akan tetap aktif sebagai calon mahasiswa di Universitas BTH dan berkas Anda akan tetap diproses pada tahapan seleksi berjalan.
            </div>
          </div>

          <div class="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              @click="showCancelWithdrawalModal = false"
              :disabled="isCancellingWithdrawal"
              class="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-50"
            >
              Kembali
            </button>
            <button
              type="button"
              @click="confirmCancelWithdrawal"
              :disabled="isCancellingWithdrawal"
              class="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Loader2 v-if="isCancellingWithdrawal" class="w-3.5 h-3.5 animate-spin" />
              <span>{{ isCancellingWithdrawal ? 'Membatalkan...' : 'Ya, Batalkan Pengajuan' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 6. Modal Konfirmasi Daftar Kembali (Reapply Baru) -->
    <Teleport to="body">
      <div
        v-if="showReapplyModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
        @click.self="showReapplyModal = false"
      >
        <div class="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
          <div class="p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-base font-semibold text-slate-900 leading-snug font-sora">
                  Buka Pendaftaran Jalur Baru?
                </h3>
                <p class="text-xs text-slate-500 mt-1">
                  Anda akan memulai pendaftaran baru di Universitas Bakti Tunas Husada.
                </p>
              </div>
              <button
                type="button"
                @click="showReapplyModal = false"
                class="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            <div class="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 leading-relaxed font-sans space-y-2">
              <p>
                Biodata diri dan dokumen berkas Anda yang sudah diisi akan tetap tersimpan. Anda hanya perlu memilih kembali jalur seleksi dan program studi tujuan untuk pendaftaran baru Anda.
              </p>
            </div>
          </div>

          <div class="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              @click="showReapplyModal = false"
              class="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              @click="confirmReapply"
              class="px-4 py-2 rounded-lg bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              Lanjutkan Pendaftaran Baru
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import {
  Loader2,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  AlertCircle,
  AlertTriangle,
  Lock,
  X,
  UserX,
  CreditCard,
  Check,
  HelpCircle,
  Upload
} from 'lucide-vue-next';
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue';
import { useApplicantStore, getTrackSpecificDocuments } from '@/stores/applicant';
import { useOrganizationStore } from '@/stores/organization';
import { useCmsStore } from '@/stores/cms';
import { useReferralStore } from '@/stores/referral';
import { admissionApi } from '@/api/admission';
import { useToast } from '@/composables/useToast';

const emit = defineEmits(['switch-tab']);

const applicantStore = useApplicantStore();
const organizationStore = useOrganizationStore();
const cmsStore = useCmsStore();
const referralStore = useReferralStore();
const toast = useToast();

const isSaving = ref(false);
const isCancelling = ref(false);
const showCancelModal = ref(false);

const isCurrentTrackFree = computed(() => {
  const fee = currentTrackDetails.value?.registration_fee ?? 250000;
  return fee === 0 || applicantStore.state?.referral?.isApplied === true;
});

// Pantau status refund dan catatan resmi dari Biro Keuangan
const currentRefundReview = computed(() => {
  if (applicantStore.state?.refundStatus) {
    return applicantStore.state.refundStatus;
  }
  try {
    const raw = localStorage.getItem('bth_admin_refunds_v4');
    if (raw) {
      const list = JSON.parse(raw);
      const reg = applicantStore.state?.candidate?.registrationNumber || applicantStore.state?.admission?.registrationNo;
      const found = list.find((r) => r.regNo === reg);
      if (found) return found;
      // Fallback: periksa nama jika akun aktif
      const name = applicantStore.candidateName || applicantStore.state?.candidate?.fullName;
      if (name) {
        const byName = list.find((r) => r.candidateName?.toLowerCase() === name?.toLowerCase());
        if (byName) return byName;
      }
    }
  } catch {}
  return null;
});

// Pantau notifikasi evaluasi perubahan jalur dan tampilkan popup bersih
watch(
  () => applicantStore.pathChangeNotice,
  (notice) => {
    if (notice) {
      if (notice.type === 'approved') {
        toast.success(notice.message, notice.title || 'Pemberitahuan');
      } else {
        toast.error(notice.message, notice.title || 'Pemberitahuan');
      }
      applicantStore.pathChangeNotice = null;
    }
  },
  { immediate: true }
);

// CR-006 & CR-007 States
const showPathChangeModal = ref(false);
const isSubmittingPathChange = ref(false);
const isCancellingPathChange = ref(false);
const showCancelPathChangeModal = ref(false);

const pathChangeForm = reactive({
  track: '',
  prodi1: '',
  prodi2: '',
  reason: '',
});

const showWithdrawalModal = ref(false);
const isSubmittingWithdrawal = ref(false);
const isCancellingWithdrawal = ref(false);
const showCancelWithdrawalModal = ref(false);
const showReapplyModal = ref(false);

const pathChangeError = ref('');
const withdrawalError = ref('');
const withdrawalForm = reactive({
  category: '',
  reason: '',
  password: '',
  agreement: false,
});

const openPathChangeModal = async () => {
  pathChangeError.value = '';

  // Pastikan record pendaftaran aktif telah tersinkronisasi dari backend
  if (!applicantStore.state.admission?.applicationId) {
    try {
      const res = await admissionApi.getMyApplications();
      const raw = res?.data?.data;
      const found = raw?.active_application || (Array.isArray(raw) && raw.length > 0 ? raw[0] : (raw?.id ? raw : null));
      if (found?.id) {
        applicantStore.state.admission.applicationId = found.id;
        if (found.registration_no) {
          applicantStore.state.candidate.registrationNumber = found.registration_no;
        }
      }
    } catch (e) {
      // Abaikan bila backend sedang offline
    }
  }

  pathChangeForm.track = applicantStore.state.admission?.track || '';
  pathChangeForm.prodi1 = '';
  pathChangeForm.prodi2 = '';
  pathChangeForm.reason = '';
  showPathChangeModal.value = true;
};

const submitPathChange = async () => {
  pathChangeError.value = '';
  isSubmittingPathChange.value = true;
  try {
    const p1 = prodiList.value.find((p) => p.name === pathChangeForm.prodi1);
    const p2 = prodiList.value.find((p) => p.name === pathChangeForm.prodi2);
    const t = trackList.value.find((tr) => tr.name === pathChangeForm.track);

    const formatChoiceUUID = (id) => {
      if (!id) return null;
      if (typeof id === 'string' && id.includes('-')) return id;
      const num = parseInt(id) || 1;
      return `00000000-0000-0000-0000-${String(num).padStart(12, '0')}`;
    };

    const choice1UUID = p1?.uuid || formatChoiceUUID(p1?.id || 1);
    const choice2UUID = p2 ? (p2?.uuid || formatChoiceUUID(p2?.id || 2)) : null;

    let cleanReason = (pathChangeForm.reason || '').trim();
    if (cleanReason.length < 10) {
      cleanReason = `Permohonan alih jalur seleksi: ${cleanReason}`;
    }

    const res = await applicantStore.requestPathChange({
      newPathId: t?.id || 1,
      choice1Id: choice1UUID,
      choice2Id: choice2UUID,
      reason: cleanReason,
      trackName: t?.name,
    });

    showPathChangeModal.value = false;
    if (res?.data?.applied_directly) {
      toast.success('Pilihan jalur pendaftaran berhasil langsung diperbarui.');
    } else {
      toast.success('Permohonan pindah jalur berhasil diajukan dan sedang ditinjau oleh Panitia PMB.');
    }
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || 'Gagal mengirim permohonan pindah jalur. Silakan periksa kembali formulir atau coba beberapa saat lagi.';
    pathChangeError.value = msg;
    toast.error(msg);
  } finally {
    isSubmittingPathChange.value = false;
  }
};

const openCancelPathChangeModal = () => {
  showCancelPathChangeModal.value = true;
};

const confirmCancelPathChange = async () => {
  isCancellingPathChange.value = true;
  try {
    await applicantStore.cancelPendingPathChange();
    showCancelPathChangeModal.value = false;
    toast.success('Permohonan pindah jalur berhasil dibatalkan.');
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Gagal membatalkan permohonan pindah jalur.');
  } finally {
    isCancellingPathChange.value = false;
  }
};

const openWithdrawalModal = () => {
  if (!applicantStore.isRegPaymentComplete) {
    toast.info('Pengunduran diri hanya berlaku setelah biaya pendaftaran dibayarkan. Anda dapat menggunakan tombol "Batalkan Pilihan" untuk membatalkan formulir.');
    return;
  }
  withdrawalError.value = '';
  withdrawalForm.category = '';
  withdrawalForm.reason = '';
  withdrawalForm.password = '';
  withdrawalForm.agreement = false;
  showWithdrawalModal.value = true;
};

const submitWithdrawal = async () => {
  withdrawalError.value = '';
  isSubmittingWithdrawal.value = true;
  try {
    const res = await applicantStore.withdrawApplication({
      reasonCategory: withdrawalForm.category,
      reason: withdrawalForm.reason,
      password: withdrawalForm.password,
    });
    showWithdrawalModal.value = false;
    toast.success(res?.message || 'Pengunduran diri resmi berhasil diajukan.');
  } catch (err) {
    let rawMsg = err?.response?.data?.message || err?.message || 'Gagal memproses pengunduran diri. Periksa kembali kata sandi Anda.';
    if (rawMsg.includes('WITHDRAWAL_NOT_ALLOWED:')) {
      rawMsg = rawMsg.replace(/^.*WITHDRAWAL_NOT_ALLOWED:\s*/i, '');
    }
    withdrawalError.value = rawMsg;
    toast.error(rawMsg);
  } finally {
    isSubmittingWithdrawal.value = false;
  }
};

const openCancelWithdrawalModal = () => {
  showCancelWithdrawalModal.value = true;
};

const confirmCancelWithdrawal = async () => {
  isCancellingWithdrawal.value = true;
  try {
    await applicantStore.cancelPendingWithdrawal();
    showCancelWithdrawalModal.value = false;
    toast.success('Permohonan pengunduran diri berhasil dibatalkan.');
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Gagal membatalkan permohonan pengunduran diri.');
  } finally {
    isCancellingWithdrawal.value = false;
  }
};

const openReapplyModal = () => {
  showReapplyModal.value = true;
};

const confirmReapply = async () => {
  await applicantStore.reapplyNewTrack();
  admissionForm.value.track = '';
  admissionForm.value.prodi1 = '';
  admissionForm.value.prodi2 = '';
  showReapplyModal.value = false;
  toast.info('Silakan pilih jalur seleksi dan program studi pendaftaran baru Anda.');
};



const backendPaths = ref([]);
const activePeriod = ref(null);

onMounted(async () => {
  const [orgRes, periodRes, pathsRes] = await Promise.allSettled([
    organizationStore.syncAll(),
    admissionApi.getActivePeriods(),
    admissionApi.getPaths(),
  ]);

  if (periodRes.status === 'fulfilled' && periodRes.value?.data?.data) {
    activePeriod.value = periodRes.value.data.data;
    if (activePeriod.value.academic_year) {
      applicantStore.state.admission.academicYear = activePeriod.value.academic_year;
    }
  }

  if (pathsRes.status === 'fulfilled' && Array.isArray(pathsRes.value?.data?.data) && pathsRes.value.data.data.length > 0) {
    backendPaths.value = pathsRes.value.data.data;
  }
});

const prodiList = computed(() => {
  return organizationStore.activeStudyPrograms;
});

const DEFAULT_TRACK_LIST = [
  {
    id: 1,
    name: 'Jalur Reguler Gelombang 1',
    badge: 'Seleksi CBT Mandiri',
    tag: 'CBT Online',
    description: 'Jalur pendaftaran umum dengan seleksi Computer-Based Test (CBT) dan verifikasi berkas.',
    registration_fee: 250000,
    requires_exam: true,
  },
  {
    id: 2,
    name: 'Jalur Prestasi Akademik / Rapor',
    badge: 'Bebas Tes Tulis',
    tag: 'Nilai Rapor Smt 1-5',
    description: 'Bebas tes tulis CBT bagi siswa berprestasi peringkat 1-10 paralel sekolah atau nilai rata-rata rapor min 82.',
    registration_fee: 250000,
    requires_exam: false,
  },
  {
    id: 4,
    name: 'Jalur Beasiswa KIP-Kuliah',
    badge: 'Beasiswa Penuh',
    tag: 'Subsidi Pemerintah',
    description: 'Program beasiswa subsidi pemerintah bagi calon mahasiswa berprestasi dari keluarga prasejahtera.',
    registration_fee: 0,
    requires_exam: true,
  },
];

const trackList = computed(() => {
  let list = [];
  if (Array.isArray(cmsStore.tracks) && cmsStore.tracks.length > 0) {
    list = cmsStore.tracks
      .filter((t) => {
        const lower = (t.name || '').toLowerCase();
        return !lower.includes('kemitraan') && !lower.includes('guru bk') && !lower.includes('referral');
      })
      .map((t, idx) => {
        const fee = typeof t.fee === 'number' ? t.fee : 250000;
        const isFree = fee === 0;
        const lower = (t.name || '').toLowerCase();
        const isPrestasi = lower.includes('prestasi') || lower.includes('rapor');
        const isKip = lower.includes('kip') || lower.includes('beasiswa');
        let badge = 'Seleksi CBT Mandiri';
        let tag = 'CBT Online';

        if (isKip) {
          badge = 'Beasiswa Penuh';
          tag = 'Subsidi Pemerintah';
        } else if (isPrestasi) {
          badge = 'Bebas Tes Tulis';
          tag = 'Nilai Rapor Smt 1-5';
        }

        return {
          id: t.id || idx + 1,
          name: t.name,
          badge,
          tag,
          description: t.description || 'Jalur seleksi resmi PMB Universitas BTH.',
          registration_fee: fee,
          requires_exam: !isPrestasi && !isFree,
        };
      });
  } else if (backendPaths.value && backendPaths.value.length > 0) {
    list = backendPaths.value
      .filter((p) => {
        const lower = (p.name || '').toLowerCase();
        return !lower.includes('kemitraan') && !lower.includes('guru bk') && !lower.includes('referral');
      })
      .map((p) => ({
        id: p.id,
        name: p.name,
        badge: p.requires_exam ? 'Seleksi CBT Mandiri' : 'Bebas Tes Tulis',
        tag: p.requires_exam ? 'CBT Online' : 'Seleksi Berkas',
        description: p.description || 'Jalur seleksi resmi PMB Universitas BTH.',
        registration_fee: p.registration_fee ?? 250000,
        requires_exam: p.requires_exam,
      }));
  } else {
    list = [...DEFAULT_TRACK_LIST];
  }

  return list;
});

const defaultTrack =
  applicantStore.state.admission?.track && !applicantStore.state.admission.track.includes('Guru BK')
    ? applicantStore.state.admission.track
    : 'Jalur Reguler Gelombang 1';

const admissionForm = ref({
  track: defaultTrack,
  prodi1: applicantStore.state.admission.prodi1 || '',
  prodi2: applicantStore.state.admission.prodi2 || '',
});

// Sinkronkan data form dari store
watch(
  () => applicantStore.state.admission?.prodi1,
  (newProdi) => {
    if (newProdi && newProdi !== admissionForm.value.prodi1) {
      admissionForm.value.prodi1 = newProdi;
    }
  }
);
watch(
  () => applicantStore.state.admission?.prodi2,
  (newProdi2) => {
    if (newProdi2 !== undefined && newProdi2 !== admissionForm.value.prodi2) {
      admissionForm.value.prodi2 = newProdi2;
    }
  }
);
watch(
  () => applicantStore.state.admission?.track,
  (newTrack) => {
    if (newTrack && newTrack !== admissionForm.value.track) {
      admissionForm.value.track = newTrack;
    }
  }
);

watch(
  () => admissionForm.value.track,
  (newTrack) => {
    if (newTrack) {
      if (applicantStore.state.admission && !applicantStore.isAdmissionLocked) {
        applicantStore.state.admission.track = newTrack;
      }
      if (applicantStore.syncDocumentsForTrack) {
        applicantStore.syncDocumentsForTrack(newTrack);
      }
    }
  }
);

const goToDocumentModule = () => {
  if (admissionForm.value.track) {
    if (applicantStore.state.admission && !applicantStore.isAdmissionLocked) {
      applicantStore.state.admission.track = admissionForm.value.track;
    }
    if (applicantStore.syncDocumentsForTrack) {
      applicantStore.syncDocumentsForTrack(admissionForm.value.track);
    }
  }
  emit('switch-tab', 'documents');
};

const currentTrackDetails = computed(() => {
  return trackList.value.find((t) => t.name === admissionForm.value.track) || trackList.value[0];
});

const currentTrackSpecificDocs = computed(() => {
  return getTrackSpecificDocuments(admissionForm.value.track);
});

const currentProdi1Details = computed(() => {
  return organizationStore.getStudyProgramByName(admissionForm.value.prodi1);
});

const currentProdi2Details = computed(() => {
  return organizationStore.getStudyProgramByName(admissionForm.value.prodi2);
});

const isFormChanged = computed(() => {
  const currentProdi1 = applicantStore.state.admission?.prodi1 || '';
  const currentProdi2 = applicantStore.state.admission?.prodi2 || '';
  const currentTrack = applicantStore.state.admission?.track || 'Jalur Reguler Gelombang 1';

  return (
    admissionForm.value.prodi1 !== currentProdi1 ||
    admissionForm.value.prodi2 !== currentProdi2 ||
    admissionForm.value.track !== currentTrack
  );
});

const PRODI_METADATA_FEE = {
  'S1 Farmasi': 6500000,
  'D3 Farmasi': 4800000,
  'D3 Analis Kesehatan (TLM)': 4750000,
  'S1 Administrasi Rumah Sakit': 4500000,
  'S1 Keperawatan': 5200000,
  'S1 Manajemen Bisnis Informasi': 4250000,
};

const currentProdi1Fee = computed(() => {
  if (!admissionForm.value.prodi1) return 0;
  return cmsStore.getUktFee(admissionForm.value.prodi1) || PRODI_METADATA_FEE[admissionForm.value.prodi1] || 4500000;
});

const saveAdmission = async () => {
  if (!admissionForm.value.prodi1) {
    toast.error('Silakan pilih Program Studi Pilihan Utama terlebih dahulu.');
    return;
  }

  isSaving.value = true;
  try {
    const p1 = currentProdi1Details.value;
    const p2 = currentProdi2Details.value;

    if (applicantStore.state.admission) {
      applicantStore.state.admission.isDraftReapply = false;
    }

    applicantStore.updateAdmission({
      track: admissionForm.value.track,
      requiresExam: currentTrackDetails.value?.requires_exam !== false,
      prodi1: admissionForm.value.prodi1,
      prodi1Code: p1?.code || '',
      prodi1NimCode: p1?.nim_code || '01',
      prodi1Faculty: p1?.faculty_name || '',
      prodi1Degree: p1?.degree || '',
      prodi2: admissionForm.value.prodi2,
      prodi2Code: p2?.code || '',
      prodi2NimCode: p2?.nim_code || '',
      prodi2Faculty: p2?.faculty_name || '',
      prodi2Degree: p2?.degree || '',
    });

    const formatChoiceUUID = (id) => {
      const num = parseInt(id) || 1;
      return `00000000-0000-0000-0000-${String(num).padStart(12, '0')}`;
    };

    const choice1UUID = p1?.uuid || formatChoiceUUID(p1?.id || 1);
    const choice2UUID = p2 ? (p2?.uuid || formatChoiceUUID(p2?.id || 2)) : null;

    // Sinkronisasi ke backend admission-service
    // 0. Pastikan langkah onboarding wa_group_camaba terkonfirmasi di database backend (CR-011)
    await admissionApi.confirmOnboarding('wa_group_camaba').catch(() => null);

    const existingApps = await admissionApi.getMyApplications().catch(() => null);
    const existingList = existingApps?.data?.data;
    const activeApp = existingList?.active_application || (Array.isArray(existingList) && existingList.length > 0 ? existingList[0] : (existingList?.id ? existingList : null));

    if (activeApp?.id) {
      await admissionApi.updateChoices(activeApp.id, {
        choice_1_id: choice1UUID,
        choice_2_id: choice2UUID,
      }).catch((err) => {
        console.warn('Update choices notice:', err?.response?.data || err);
      });
      applicantStore.state.admission.applicationId = activeApp.id;
      if (activeApp.registration_no) {
        applicantStore.state.candidate.registrationNumber = activeApp.registration_no;
      }
    } else {
      let periodId = activePeriod.value?.id || 1;
      let pathId = currentTrackDetails.value?.id || 1;

      if (!pathId && backendPaths.value.length > 0) {
        const found = backendPaths.value.find(
          (p) => p.name === admissionForm.value.track
        );
        if (found?.id) pathId = found.id;
      }

      let createRes = null;
      try {
        createRes = await admissionApi.createApplication({
          period_id: periodId,
          admission_path_id: pathId,
          choice_1_id: choice1UUID,
          choice_2_id: choice2UUID,
        });
      } catch (err) {
        if (err?.response?.data?.error_code === 'WA_GROUP_JOIN_REQUIRED') {
          await admissionApi.confirmOnboarding('wa_group_camaba').catch(() => null);
          createRes = await admissionApi.createApplication({
            period_id: periodId,
            admission_path_id: pathId,
            choice_1_id: choice1UUID,
            choice_2_id: choice2UUID,
          }).catch((e) => {
            console.error('Retry create application notice:', e?.response?.data || e);
            return null;
          });
        } else if (err?.response?.data?.error_code === 'DUPLICATE_APPLICATION' || err?.response?.data?.error_code === 'ACTIVE_APPLICATION_EXISTS') {
          console.info('Pendaftaran sudah terdaftar di backend.');
        } else {
          console.error('Backend create application notice:', err?.response?.data || err);
        }
      }

      if (createRes?.data?.data) {
        const newAppData = createRes.data.data;
        if (newAppData.id) {
          applicantStore.state.admission.applicationId = newAppData.id;
        }
        if (newAppData.registration_no) {
          applicantStore.state.candidate.registrationNumber = newAppData.registration_no;
        }
      }
    }

    const isFreeTrack = isCurrentTrackFree.value;

    if (isFreeTrack) {
      if (applicantStore.state?.payments?.registrationFee) {
        applicantStore.state.payments.registrationFee.amount = 0;
        applicantStore.state.payments.registrationFee.status = 'paid';
        applicantStore.state.payments.registrationFee.isFree = true;
        applicantStore.state.payments.registrationFee.paymentMethod = applicantStore.state?.referral?.isApplied
          ? `Kemitraan Guru BK (${applicantStore.state.referral.code})`
          : 'Jalur Bebas Biaya (Gratis)';
        applicantStore.state.payments.registrationFee.statusLabel = applicantStore.state?.referral?.isApplied
          ? 'Lunas (Mitra BK)'
          : 'Bebas Biaya (Rp 0)';
      }
      applicantStore.state.admission.status = 'form_open';
    } else {
      if (applicantStore.state?.payments?.registrationFee) {
        if (!applicantStore.state?.referral?.isApplied) {
          const trackFee = currentTrackDetails.value?.registration_fee ?? 250000;
          if (applicantStore.state.payments.registrationFee.isFree || applicantStore.state.payments.registrationFee.amount === 0) {
            applicantStore.state.payments.registrationFee.amount = trackFee;
            applicantStore.state.payments.registrationFee.isFree = false;
            applicantStore.state.payments.registrationFee.status = 'unpaid';
            applicantStore.state.payments.registrationFee.statusLabel = 'Menunggu Pembayaran';
            applicantStore.state.payments.registrationFee.paymentMethod = '';
            applicantStore.state.payments.registrationFee.paidAt = null;
          }
        }
      }
    }

    // Refresh sinkronisasi seluruh state dari backend
    await applicantStore.syncFromBackend().catch(() => null);

    if (isFreeTrack) {
      toast.success(
        applicantStore.state?.referral?.isApplied
          ? 'Pilihan program studi berhasil disimpan (Mitra Guru BK Terhubung). Mengalihkan ke unggah berkas...'
          : 'Pilihan jalur bebas biaya berhasil disimpan. Mengalihkan ke unggah berkas...'
      );
      setTimeout(() => {
        emit('switch-tab', 'documents');
      }, 700);
    } else {
      toast.success('Pilihan jalur & program studi berhasil disimpan. Mengalihkan ke pembayaran...');
      setTimeout(() => {
        emit('switch-tab', 'payment');
      }, 600);
    }
  } catch (err) {
    console.warn('Admission save notice (fallback):', err);
    const isFreeTrack = isCurrentTrackFree.value;
    if (isFreeTrack) {
      toast.success(
        applicantStore.state?.referral?.isApplied
          ? 'Pilihan program studi berhasil disimpan (Mitra Guru BK Terhubung). Mengalihkan ke unggah berkas...'
          : 'Pilihan jalur bebas biaya berhasil disimpan. Mengalihkan ke unggah berkas...'
      );
      setTimeout(() => {
        emit('switch-tab', 'documents');
      }, 700);
    } else {
      toast.success('Pilihan jalur & program studi berhasil disimpan. Mengalihkan ke pembayaran...');
      setTimeout(() => {
        emit('switch-tab', 'payment');
      }, 600);
    }
  } finally {
    isSaving.value = false;
  }
};

const openCancelModal = () => {
  if (applicantStore.isAdmissionLocked) {
    toast.info('Pendaftaran tidak dapat dibatalkan karena biaya pendaftaran sudah dibayar.');
    return;
  }
  showCancelModal.value = true;
};

const confirmCancelAdmission = async () => {
  isCancelling.value = true;
  try {
    const res = await applicantStore.cancelAdmission();
    admissionForm.value.prodi1 = '';
    admissionForm.value.prodi2 = '';
    showCancelModal.value = false;
    toast.success(res?.message || 'Pilihan program studi berhasil direset. Silakan tentukan kembali jalur dan prodi yang Anda inginkan.');
  } catch (err) {
    toast.error(err?.message || 'Gagal membatalkan pendaftaran.');
  } finally {
    isCancelling.value = false;
  }
};
</script>
