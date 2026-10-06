<template>
  <div class="space-y-6">
    <!-- Header Modul -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900">
          Pengumuman & Daftar Ulang
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Status kelulusan seleksi calon mahasiswa dan panduan registrasi ulang semester 1.
        </p>
      </div>
      <div class="text-xs text-slate-500 font-sans self-start sm:self-auto">
        Status: <strong class="text-slate-800 font-semibold">{{ applicantStore.isResultPassed ? 'Dinyatakan Lulus Seleksi' : applicantStore.isExamFailed ? 'Belum Memenuhi Syarat' : applicantStore.isExamCompleted ? 'Hasil Sedang Diverifikasi' : 'Menunggu Ujian' }}</strong>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- KONDISI A: DINYATAKAN TIDAK LULUS SELEKSI (BISA TAMBAH PENDAFTARAN LAIN)  -->
    <!-- ========================================================================= -->
    <div v-if="applicantStore.isExamFailed" class="space-y-6 animate-fadeIn">
      <!-- Announcement Banner: Belum Memenuhi Syarat Kelulusan -->
      <div class="bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden border border-rose-800/50">
        <div class="relative z-10 space-y-3 max-w-3xl">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-500/20 border border-rose-400/30 text-rose-200 rounded-md text-[11px] font-medium">
            <AlertCircle class="w-3.5 h-3.5 text-rose-300" />
            <span>Pengumuman Hasil Seleksi PMB Universitas BTH</span>
          </div>

          <div>
            <h3 class="text-xl sm:text-2xl font-sora font-bold text-white tracking-tight">
              Belum Memenuhi Nilai Kelulusan
            </h3>
            <p class="text-xs sm:text-sm text-rose-100/90 mt-1 leading-relaxed">
              Halo, <strong>{{ candidate.fullName || 'Calon Pendaftar' }}</strong>. Berdasarkan hasil seleksi akademik panitia PMB Universitas Bakti Tunas Husada, skor ujian Anda belum memenuhi nilai ambang batas minimal kelulusan untuk pilihan program studi utama Anda.
            </p>
          </div>

          <!-- Rincian Pilihan & Nilai -->
          <div class="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3">
            <div>
              <div class="text-[10px] text-rose-200 uppercase font-semibold tracking-wider">Pilihan Utama Sebelumnya</div>
              <div class="font-sora font-bold text-base sm:text-lg text-white mt-0.5">
                {{ applicantStore.state.admission.prodi1 || 'Program Studi Terpilih' }}
              </div>
              <div class="text-xs text-rose-200/80 mt-0.5">
                Skor CBT Anda: <strong class="text-white">{{ exam.score }} / 100</strong> (Passing Grade: <strong>70</strong>)
              </div>
            </div>

            <!-- Tombol CTA Utama: Tambah Pendaftaran Jalur / Pilihan Lain -->
            <button
              @click="showReapplyModal = true"
              class="rounded-xl px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs transition-all shadow-xs cursor-pointer flex-shrink-0 flex items-center justify-center gap-2"
            >
              <PlusCircle class="w-4 h-4" />
              <span>Tambah Pendaftaran Jalur / Pilihan Lain</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Dua Kolom: Peluang Pendaftaran Baru & Rincian Evaluasi Nilai -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Kolom 1: Peluang & Tata Cara Tambah Pendaftaran -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Sparkles class="w-4 h-4 text-amber-500" />
              <span>Peluang Tambah Pendaftaran Baru</span>
            </h3>
            <span class="text-[10px] font-mono px-2 py-0.5 bg-blue-50 text-[#1E3A8A] rounded font-semibold">Tersedia</span>
          </div>

          <p class="text-xs text-slate-600 leading-relaxed font-sans">
            Sesuai kebijakan penerimaan mahasiswa baru Universitas BTH, peserta yang belum lulus diizinkan untuk <strong>menambah pendaftaran baru</strong> guna memilih jalur lain (seperti Jalur Rapor, Prestasi, atau Gelombang 2) atau memilih program studi alternatif lainnya.
          </p>

          <div class="space-y-2.5 text-xs font-sans">
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
              <CheckCircle2 class="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong class="text-slate-900 font-semibold">Biodata Profil Tersimpan Aman</strong>
                <p class="text-[11px] text-slate-500 mt-0.5">Anda tidak perlu mengisi ulang formulir identitas, data orang tua, dan riwayat sekolah.</p>
              </div>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
              <CheckCircle2 class="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong class="text-slate-900 font-semibold">Berkas Dokumen Tetap Tersimpan</strong>
                <p class="text-[11px] text-slate-500 mt-0.5">Semua berkas ijazah, KTP, dan pasfoto yang telah diunggah tetap valid dan tidak perlu diunggah ulang.</p>
              </div>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
              <CheckCircle2 class="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong class="text-slate-900 font-semibold">Bebas Memilih Jalur & Prodi Baru</strong>
                <p class="text-[11px] text-slate-500 mt-0.5">Dapat langsung memilih program studi baru di Fakultas Farmasi atau Fakultas Ilmu Kesehatan.</p>
              </div>
            </div>
          </div>

          <div class="pt-2">
            <button
              @click="showReapplyModal = true"
              class="w-full rounded-xl px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-medium text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw class="w-3.5 h-3.5" />
              <span>Daftar ke Jalur & Pilihan Lain Sekarang</span>
            </button>
          </div>
        </div>

        <!-- Kolom 2: Rincian Skor Ujian CBT & Konsultasi Jurusan -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div class="pb-3 border-b border-slate-100">
            <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
              Rincian Evaluasi Seleksi Akademik
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">Hasil penilaian Ujian Mandiri CBT.</p>
          </div>

          <div class="space-y-2 text-xs font-sans">
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between">
              <span class="text-slate-600">Skor Ujian CBT Online:</span>
              <strong class="font-sora text-sm text-rose-600">{{ exam.score }} / 100</strong>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between">
              <span class="text-slate-600">Nilai Ambang Batas (Passing Grade):</span>
              <strong class="text-slate-800">70 / 100</strong>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between">
              <span class="text-slate-600">Jawaban Benar:</span>
              <span class="font-mono text-slate-700">{{ exam.correctAnswers || 0 }} dari {{ exam.totalQuestions || 5 }} Soal</span>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between">
              <span class="text-slate-600">Status Kelulusan:</span>
              <span class="font-semibold text-rose-600 px-2 py-0.5 bg-rose-50 rounded border border-rose-100">Belum Memenuhi Syarat</span>
            </div>
          </div>

          <!-- Bantuan & Bimbingan Jurusan Alternatif -->
          <div class="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200/60 space-y-1.5 text-xs">
            <div class="font-semibold text-[#1E3A8A] flex items-center gap-1.5">
              <HelpCircle class="w-4 h-4" />
              <span>Butuh Bimbingan Pemilihan Jurusan?</span>
            </div>
            <p class="text-[11px] text-slate-600 leading-relaxed font-sans">
              Tim panitia PMB siap membantu konsultasi jurusan yang sesuai dengan minat dan potensi Anda. Hubungi Layanan Hotline PMB BTH: <strong>(0265) 334111</strong> atau WhatsApp <strong>0812-2026-BTH</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- KONDISI B: BELUM UJIAN / MENUNGGU PENGUMUMAN RESMI                       -->
    <!-- ========================================================================= -->
    <div v-else-if="!applicantStore.isResultPassed" class="max-w-2xl mx-auto space-y-6 my-4">
      <!-- Status Card Minimalis -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs text-center space-y-4 animate-fadeIn">
        <div class="space-y-1.5">
          <h3 class="font-sora font-bold text-base sm:text-lg text-slate-900">
            {{ !applicantStore.isExamCompleted ? 'Ujian CBT Belum Diselesaikan' : 'Hasil Ujian Sedang Diverifikasi' }}
          </h3>
          <p class="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-sans">
            {{ !applicantStore.isExamCompleted
              ? 'Silakan selesaikan Ujian Mandiri CBT Online agar nilai seleksi dapat diproses oleh panitia PMB BTH.'
              : 'Skor ujian Anda telah tersimpan. Pengumuman kelulusan dan surat penerimaan akan dibuka serentak pada tanggal jadwal pengumuman.'
            }}
          </p>
        </div>

        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
          <span class="text-slate-400 font-sans">Jadwal Pengumuman:</span>
          <strong class="text-slate-800 font-semibold font-sans">{{ schedule?.announcementDate || '24 Oktober 2026' }}</strong>
        </div>

        <div v-if="!applicantStore.isExamCompleted" class="pt-2">
          <button
            @click="$emit('switch-tab', 'exam')"
            class="w-full sm:w-auto rounded-xl px-6 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-medium text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
          >
            Buka Ujian CBT Online
          </button>
        </div>
      </div>

      <!-- Alur Registrasi Ulang Ringkas (Simple 3-Step) -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div class="text-xs font-semibold text-slate-700">Tahapan Setelah Pengumuman:</div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span class="font-mono text-[10px] text-slate-400 font-bold uppercase">Langkah 1</span>
            <div class="font-semibold text-slate-800">Unduh LoA</div>
            <p class="text-[11px] text-slate-500 font-sans">Surat penerimaan berstempel Rektor BTH.</p>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span class="font-mono text-[10px] text-slate-400 font-bold uppercase">Langkah 2</span>
            <div class="font-semibold text-slate-800">Pelunasan UKT</div>
            <p class="text-[11px] text-slate-500 font-sans">Pembayaran UKT semester 1 via Virtual Account.</p>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span class="font-mono text-[10px] text-slate-400 font-bold uppercase">Langkah 3</span>
            <div class="font-semibold text-slate-800">Aktivasi NIM & Berkas</div>
            <p class="text-[11px] text-slate-500 font-sans">Penyerahan berkas fisik & almamater di BAAK.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- KONDISI 2: RESMI DINYATAKAN LULUS SELEKSI -->
    <div v-else class="space-y-6 animate-fadeIn">
      <!-- Acceptance Banner BTH -->
      <div class="bg-gradient-to-r from-[#1E3A8A] via-[#1b3478] to-[#12285a] text-white rounded-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden border border-blue-900/40">
        <div class="relative z-10 space-y-3 max-w-3xl">
          <div class="inline-flex items-center px-2.5 py-0.5 bg-amber-400/20 border border-amber-300/30 text-amber-300 rounded-md text-[11px] font-medium">
            <span>SK Rektor: {{ result.decisionLetterNo }}</span>
          </div>

          <div>
            <h3 class="text-xl sm:text-2xl font-sora font-bold text-white tracking-tight">
              Selamat, {{ candidate.fullName }}!
            </h3>
            <p class="text-xs sm:text-sm text-blue-100/90 mt-1 leading-relaxed">
              Anda dinyatakan <strong>LULUS SELEKSI</strong> sebagai calon mahasiswa baru Universitas Bakti Tunas Husada.
            </p>
          </div>

          <!-- Accepted Prodi & LoA Button -->
          <div class="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3">
            <div>
              <div class="text-[10px] text-blue-200 uppercase font-semibold tracking-wider">Program Studi Diterima</div>
              <div class="font-sora font-bold text-base sm:text-lg text-white mt-0.5">
                {{ result.acceptedProdi }}
              </div>
              <div class="text-xs text-amber-300 mt-0.5">
                {{ result.acceptedFaculty }} - Jenjang Sarjana ({{ result.acceptedDegree }})
              </div>
            </div>

            <button
              @click="openLoAModal = true"
              class="rounded-xl px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold text-xs transition-all shadow-xs cursor-pointer flex-shrink-0"
            >
              Unduh Surat Penerimaan (LoA)
            </button>
          </div>
        </div>
      </div>

      <!-- Two Column Layout: Langkah Daftar Ulang & Hasil Skor -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Kolom 1: Tahapan Daftar Ulang Mahasiswa Baru -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
              Langkah Registrasi Ulang
            </h3>
            <span class="text-xs text-slate-500">25 Okt - 05 Nov 2026</span>
          </div>

          <div class="space-y-3 text-xs">
            <!-- Step 1: Bayar UKT -->
            <div class="p-3.5 rounded-xl border flex items-center justify-between gap-3"
                 :class="payments.uktFee?.status === 'paid' ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200/80'">
              <div>
                <div class="font-semibold text-slate-900">1. Pelunasan UKT Semester 1</div>
                <div class="text-slate-500 mt-0.5">Nominal: <strong>Rp {{ currentUktAmount.toLocaleString('id-ID') }}</strong> via VA Bank BSI / Mandiri</div>
              </div>
              <button
                @click="$emit('switch-tab', 'payment')"
                class="rounded-lg px-3.5 py-1.5 text-xs font-medium cursor-pointer transition-colors flex-shrink-0"
                :class="payments.uktFee?.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-[#1E3A8A] text-white hover:bg-[#172554]'"
              >
                {{ payments.uktFee?.status === 'paid' ? 'Lunas' : 'Bayar Sekarang' }}
              </button>
            </div>

            <!-- Step 2: Berkas Fisik di Kampus -->
            <div class="p-3.5 rounded-xl border bg-slate-50 border-slate-200/80 flex items-center justify-between gap-3">
              <div>
                <div class="font-semibold text-slate-900">2. Validasi Berkas Fisik & KTM</div>
                <div class="text-slate-500 mt-0.5">Penyerahan ijazah terlegalisasi & pasfoto di Gedung BAAK Rektorat Lantai 1</div>
              </div>
              <span class="text-[11px] font-medium text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200 flex-shrink-0">
                Layanan BAAK
              </span>
            </div>

            <!-- Step 3: Almamater -->
            <div class="p-3.5 rounded-xl border bg-slate-50 border-slate-200/80 flex items-center justify-between gap-3">
              <div>
                <div class="font-semibold text-slate-900">3. Pengambilan Almamater & NIM</div>
                <div class="text-slate-500 mt-0.5">Penerbitan kartu mahasiswa dan email institusi @bth.ac.id</div>
              </div>
              <span class="text-[11px] font-medium text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200 flex-shrink-0">
                07 - 12 Nov
              </span>
            </div>
          </div>
        </div>

        <!-- Kolom 2: Rincian Skor Seleksi -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div class="pb-3 border-b border-slate-100">
            <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
              Rincian Skor Seleksi Akademik
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">Hasil penilaian panitia penerimaan mahasiswa baru.</p>
          </div>

          <div class="space-y-2 text-xs">
            <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70 flex items-center justify-between">
              <span class="text-slate-600">Nilai Ujian CBT Online:</span>
              <strong class="font-sora text-sm text-[#1E3A8A]">{{ exam.score }} / 100</strong>
            </div>
            <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70 flex items-center justify-between">
              <span class="text-slate-600">Rata-rata Rapor:</span>
              <strong class="text-slate-800">{{ candidate.averageScore || '88.5' }}</strong>
            </div>
            <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70 flex items-center justify-between">
              <span class="text-slate-600">Hasil Evaluasi Wawancara:</span>
              <strong class="text-emerald-700 font-medium">A (Sangat Direkomendasikan)</strong>
            </div>
            <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70 flex items-center justify-between">
              <span class="text-slate-600">Pemeriksaan Kesehatan:</span>
              <strong class="text-emerald-700 font-medium">Memenuhi Syarat (Sehat)</strong>
            </div>
          </div>

          <p class="text-[11px] text-slate-500 leading-relaxed pt-1">
            Keputusan kelulusan telah disahkan oleh Senat Akademik Universitas BTH dan bersifat mutlak.
          </p>
        </div>
      </div>

      <!-- Official Onboarding Card & Digital KTM (Kartu Tanda Mahasiswa Sementara) -->
      <div v-if="payments.uktFee?.status === 'paid' || applicantStore.isUktPaid || onboarding?.nim" class="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1E3A8A] to-blue-700 text-white flex items-center justify-center flex-shrink-0 shadow-xs border border-blue-800/20">
              <GraduationCap class="w-6 h-6" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-sora font-bold text-slate-900 text-base sm:text-lg">
                  Penetapan Mahasiswa Baru & Kartu Mahasiswa (KTM-S)
                </h3>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  Terdaftar Aktif
                </span>
              </div>
              <p class="text-xs text-slate-500 font-sans mt-0.5">
                Nomor Induk Mahasiswa, akun SIAKAD institusi, dan pembagian gugus pengenalan kampus PKKMB 2026.
              </p>
            </div>
          </div>

          <button
            type="button"
            @click="openKtmModal = true"
            class="rounded-xl px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto flex-shrink-0"
          >
            <Printer class="w-4 h-4" />
            <span>Cetak Kartu Mahasiswa (KTM-S)</span>
          </button>
        </div>

        <!-- 4 Grid Identitas Mahasiswa Baru -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
          <!-- Card NIM -->
          <div class="p-4 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nomor Induk Mahasiswa (NIM)</span>
            <div class="font-mono font-black text-lg text-[#1E3A8A] tracking-wider">
              {{ displayedNim }}
            </div>
            <div class="text-[11px] text-slate-500">Tercatat di PDDikti Kemdikbud</div>
          </div>

          <!-- Card Email Institusi -->
          <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Akun Kampus</span>
            <div class="font-mono font-bold text-xs text-slate-800 truncate" :title="displayedEmail">
              {{ displayedEmail }}
            </div>
            <div class="text-[11px] text-slate-500">Akses Google Workspace & SIAKAD</div>
          </div>

          <!-- Card Gugus PKKMB -->
          <div class="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1">
            <span class="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Gugus PKKMB 2026</span>
            <div class="font-sora font-bold text-xs text-emerald-900 truncate">
              {{ displayedPkkmbGroup }}
            </div>
            <div class="text-[11px] text-emerald-700">Masa Bimbingan Mahasiswa</div>
          </div>

          <!-- Card Status Registrasi Fisik -->
          <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status Berkas Fisik</span>
            <div class="font-sora font-semibold text-xs text-slate-800">
              Validasi BAAK Kampus
            </div>
            <div class="text-[11px] text-slate-500">Jadwal: 25 Okt - 05 Nov 2026</div>
          </div>
        </div>

        <!-- Ukuran Jas Almamater Mahasiswa -->
        <div class="p-4 sm:p-5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 class="font-sora font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <Shirt class="w-4 h-4 text-[#1E3A8A]" />
                <span>Pemesanan Ukuran Jas Almamater BTH</span>
              </h4>
              <p class="text-[11px] text-slate-500 font-sans mt-0.5">
                Pilih ukuran jas almamater Anda untuk pengambilan fisik di Gedung BAAK Rektorat Lantai 1.
              </p>
            </div>
            <span v-if="almamaterSaved" class="text-xs text-emerald-700 font-medium font-sans flex items-center gap-1">
              <CheckCircle2 class="w-3.5 h-3.5" />
              <span>Ukuran tersimpan: {{ selectedAlmamaterSize }}</span>
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-2 pt-1">
            <button
              v-for="size in ['S', 'M', 'L', 'XL', 'XXL', '3XL']"
              :key="size"
              type="button"
              @click="handleSelectAlmamaterSize(size)"
              class="w-12 h-10 rounded-xl font-sora font-bold text-xs transition-all cursor-pointer flex items-center justify-center border"
              :class="selectedAlmamaterSize === size
                ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'"
            >
              {{ size }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL DIGITAL LETTER OF ACCEPTANCE (LoA) RESMI BTH -->
    <Teleport to="body">
      <div
        v-if="openLoAModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-sm animate-fadeIn"
      >
      <div class="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[88vh] overflow-y-auto">
        <button
          @click="openLoAModal = false"
          class="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-slate-700 text-2xl font-bold leading-none p-1 cursor-pointer"
        >
          &times;
        </button>

        <!-- Official Letterhead (Kop Surat Resmi) -->
        <div class="text-center pb-4 border-b-2 border-slate-900">
          <div class="text-[11px] sm:text-xs uppercase font-bold text-slate-600 tracking-widest">
            Yayasan Bakti Tunas Husada Tasikmalaya
          </div>
          <div class="font-sora font-black text-base sm:text-xl text-[#1E3A8A] tracking-tight mt-0.5">
            UNIVERSITAS BAKTI TUNAS HUSADA
          </div>
          <div class="text-[10px] sm:text-[11px] text-slate-500 mt-1 leading-snug">
            Jalan Cilolohan Nomor 36, Kahuripan, Tawang, Kota Tasikmalaya, Jawa Barat 46115<br />
            Laman: www.universitas-bth.ac.id | Pos-el: pmb@bth.ac.id | Telp: (0265) 334111
          </div>
        </div>

        <!-- LoA Content -->
        <div class="py-4 sm:py-6 space-y-3.5 sm:space-y-4 text-xs text-slate-800 leading-relaxed">
          <div class="text-center space-y-1">
            <h4 class="font-sora font-extrabold text-xs sm:text-base text-slate-900 uppercase">
              SURAT KETERANGAN PENERIMAAN (LETTER OF ACCEPTANCE)
            </h4>
            <div class="font-mono text-[10px] sm:text-[11px] text-slate-500">
              Nomor: {{ result.decisionLetterNo }}
            </div>
          </div>

          <p>
            Rektor Universitas Bakti Tunas Husada, berdasarkan hasil rapat dewan juri seleksi Penerimaan Mahasiswa Baru Tahun Akademik 2026/2027 yang dilaksanakan pada tanggal {{ result.decisionDate }}, menerangkan bahwa:
          </p>

          <div class="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-200 space-y-1.5 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
              <span class="text-slate-500">Nomor Registrasi:</span>
              <strong class="sm:col-span-2 font-mono text-slate-900">{{ candidate.registrationNumber }}</strong>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
              <span class="text-slate-500">Nama Lengkap:</span>
              <strong class="sm:col-span-2 text-slate-900">{{ candidate.fullName || 'Calon Mahasiswa' }}</strong>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
              <span class="text-slate-500">Asal Sekolah:</span>
              <span class="sm:col-span-2 text-slate-800">{{ candidate.schoolName || '-' }}</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
              <span class="text-slate-500">Program Studi Diterima:</span>
              <strong class="sm:col-span-2 text-[#1E3A8A] font-sora">{{ result.acceptedProdi || 'Program Studi Terpilih' }} ({{ result.acceptedDegree || 'S1' }})</strong>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
              <span class="text-slate-500">Fakultas:</span>
              <span class="sm:col-span-2 text-slate-800">{{ result.acceptedFaculty || 'Universitas BTH' }}</span>
            </div>
          </div>

          <p>
            Dinyatakan <strong>LULUS SELEKSI</strong> dan diterima sebagai Calon Mahasiswa Baru Universitas Bakti Tunas Husada Tahun Akademik 2026/2027.
          </p>

          <p>
            Demikian surat keterangan ini diterbitkan untuk dipergunakan sebagaimana mestinya dalam proses daftar ulang dan registrasi akademik.
          </p>

          <!-- Signature & Digital Stamp -->
          <div class="pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
            <div class="text-[10px] text-slate-400 font-mono">
              Dokumen terverifikasi secara elektronik oleh Sistem PMB BTH.
            </div>
            <div class="text-left sm:text-right space-y-1 w-full sm:w-auto">
              <div class="text-slate-500 text-[11px]">Tasikmalaya, {{ result.decisionDate }}</div>
              <div class="font-bold text-slate-900 font-sora">Rektor Universitas BTH,</div>
              <div class="h-10 sm:h-12 flex items-center justify-start sm:justify-end">
                <span class="font-mono text-[11px] text-[#1E3A8A] border border-blue-300 bg-blue-50 px-2 py-0.5 rounded">
                  [Tanda Tangan Digital Tersertifikasi]
                </span>
              </div>
              <div class="font-sora font-bold text-slate-900 underline">Prof. Dr. apt. Mohamad Yanuar, M.Si.</div>
              <div class="text-[10px] text-slate-500">NIP. 19740512 200112 1 002</div>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-4 border-t border-slate-100">
          <button
            @click="printLoA"
            class="w-full sm:w-auto rounded-xl px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold text-xs transition-all shadow-xs cursor-pointer text-center"
          >
            Cetak Dokumen LoA
          </button>
          <button
            @click="openLoAModal = false"
            class="w-full sm:w-auto rounded-xl px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer text-center"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- MODAL DIGITAL KARTU TANDA MAHASISWA SEMENTARA (KTM-S) RESMI -->
  <Teleport to="body">
    <div
      v-if="openKtmModal"
      class="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-sm animate-fadeIn"
      @click.self="openKtmModal = false"
    >
      <div class="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto space-y-5">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
            Kartu Tanda Mahasiswa Sementara (KTM-S)
          </h3>
          <button
            @click="openKtmModal = false"
            class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- The Physical Card Representation -->
        <div class="rounded-2xl p-5 bg-gradient-to-br from-[#1E3A8A] via-[#172554] to-slate-900 text-white shadow-xl border border-blue-900/50 space-y-4 relative overflow-hidden">
          <!-- Decorative Accent -->
          <div class="absolute -right-8 -bottom-8 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <!-- Card Header -->
          <div class="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div class="flex items-center gap-2.5">
              <img
                src="/assets/icons/bth-emblem.png"
                alt="Logo BTH"
                class="h-8 w-auto object-contain drop-shadow"
              />
              <div>
                <div class="font-sora font-extrabold text-xs text-white uppercase tracking-tight">UNIVERSITAS BTH</div>
                <div class="text-[9px] text-blue-200 font-sans">KARTU TANDA MAHASISWA SEMENTARA</div>
              </div>
            </div>
            <span class="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold">
              TA 2026/2027
            </span>
          </div>

          <!-- Card Body: Photo & Identity -->
          <div class="flex items-center gap-4">
            <div class="w-20 h-24 rounded-xl bg-slate-200 text-slate-700 font-sora font-bold text-sm flex items-center justify-center flex-shrink-0 border-2 border-white/20 overflow-hidden shadow-inner">
              <img
                v-if="applicantStore.candidatePhoto"
                :src="applicantStore.candidatePhoto"
                alt="Pasfoto Mahasiswa"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-xs text-slate-400">4x6</span>
            </div>

            <div class="min-w-0 flex-1 space-y-1 text-xs">
              <div>
                <div class="text-[10px] text-blue-200 uppercase font-semibold">Nama Mahasiswa</div>
                <div class="font-sora font-bold text-sm text-white truncate">{{ candidate.fullName }}</div>
              </div>
              <div>
                <div class="text-[10px] text-blue-200 uppercase font-semibold">Nomor Induk Mahasiswa</div>
                <div class="font-mono font-black text-sm text-amber-300 tracking-wider">{{ displayedNim }}</div>
              </div>
              <div>
                <div class="text-[10px] text-blue-200 uppercase font-semibold">Program Studi</div>
                <div class="font-sans text-[11px] text-slate-200 truncate">{{ result.acceptedProdi || applicantStore.state.admission?.prodi1 }}</div>
              </div>
            </div>
          </div>

          <!-- Card Footer: Barcode & Security Note -->
          <div class="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-blue-200/80 font-mono">
            <span>BTH-REG-{{ candidate.registrationNumber?.replace(/\D/g, '') || '2026' }}</span>
            <span>Gugus: {{ displayedPkkmbGroup }}</span>
          </div>
        </div>

        <!-- Print / Action Controls -->
        <div class="flex items-center justify-end gap-2.5 pt-2">
          <button
            @click="openKtmModal = false"
            class="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold font-sora cursor-pointer"
          >
            Tutup
          </button>
          <button
            @click="printLoA"
            class="px-5 py-2 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold font-sora shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Printer class="w-3.5 h-3.5" />
            <span>Cetak KTM-S</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>

    <!-- MODAL KONFIRMASI TAMBAH PENDAFTARAN JALUR / PILIHAN LAIN -->
    <Teleport to="body">
      <div
        v-if="showReapplyModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-fadeIn"
        @click.self="showReapplyModal = false"
      >
        <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200/90 space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-[#1E3A8A] flex items-center justify-center flex-shrink-0">
              <RotateCcw class="w-4 h-4" />
            </div>
            <div>
              <h3 class="font-sora font-bold text-base text-slate-900">
                Tambah Pendaftaran Jalur / Pilihan Lain?
              </h3>
              <p class="text-xs text-slate-500 font-sans mt-0.5">
                Membuka formulir pemilihan program studi atau jalur baru
              </p>
            </div>
          </div>

          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-700 space-y-2">
            <div class="font-semibold text-slate-900">Ketentuan Pendaftaran Baru:</div>
            <ul class="space-y-1.5 text-[11px] text-slate-600 list-disc list-inside">
              <li>Seluruh <strong>biodata profil pribadi</strong> Anda tetap tersimpan utuh.</li>
              <li>Seluruh <strong>berkas dokumen</strong> yang sudah terverifikasi tidak perlu diunggah ulang.</li>
              <li>Status ujian dan kelulusan sebelumnya akan diperbarui untuk sesi pendaftaran baru.</li>
            </ul>
          </div>

          <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              @click="showReapplyModal = false"
              class="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold font-sora transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              @click="confirmReapply"
              :disabled="isReapplying"
              class="px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold font-sora rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <span v-if="isReapplying" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{{ isReapplying ? 'Membuka Pendaftaran...' : 'Ya, Tambah Pendaftaran' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  AlertCircle,
  PlusCircle,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  HelpCircle,
  GraduationCap,
  Printer,
  Shirt,
  X,
  CreditCard,
  User,
} from 'lucide-vue-next';
import { useApplicantStore, PRODI_METADATA } from '@/stores/applicant';
import { selectionApi } from '@/api/selection';
import { studentApi } from '@/api/student';
import { useToast } from '@/composables/useToast';

const emit = defineEmits(['switch-tab']);

const applicantStore = useApplicantStore();
const toast = useToast();
const candidate = computed(() => applicantStore.state.candidate);
const result = computed(() => applicantStore.state.result);
const exam = computed(() => applicantStore.state.exam);
const payments = computed(() => applicantStore.state.payments);
const schedule = computed(() => applicantStore.state.schedule);
const onboarding = computed(() => applicantStore.state.onboarding);

const currentUktAmount = computed(() => {
  if (payments.value?.uktFee?.amount) return payments.value.uktFee.amount;
  const prodi = result.value?.acceptedProdi || applicantStore.state.admission?.prodi1;
  const meta = PRODI_METADATA[prodi];
  return meta?.uktFee || 4500000;
});

const openLoAModal = ref(false);
const openKtmModal = ref(false);
const showReapplyModal = ref(false);
const isReapplying = ref(false);
const almamaterSaved = ref(false);

const selectedAlmamaterSize = ref(applicantStore.state.onboarding?.almamaterSize || 'L');

const displayedNim = computed(() => {
  if (onboarding.value?.nim) return onboarding.value.nim;
  const regNo = candidate.value?.registrationNumber || '1001';
  const digits = regNo.replace(/\D/g, '').slice(-4) || '1001';
  return `2601${digits}`;
});

const displayedEmail = computed(() => {
  if (onboarding.value?.studentEmail) return onboarding.value.studentEmail;
  const name = candidate.value?.fullName || 'maba';
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${cleanName || 'mahasiswa'}@bth.ac.id`;
});

const displayedPkkmbGroup = computed(() => {
  if (onboarding.value?.pkkmbGroup) return onboarding.value.pkkmbGroup;
  const prodi = result.value?.acceptedProdi || applicantStore.state.admission?.prodi1 || '';
  const meta = PRODI_METADATA[prodi];
  return meta?.gugus || 'Gugus 01 - Hygeia Farmasi';
});

const handleSelectAlmamaterSize = async (size) => {
  selectedAlmamaterSize.value = size;
  if (!applicantStore.state.onboarding) {
    applicantStore.state.onboarding = {};
  }
  applicantStore.state.onboarding.almamaterSize = size;
  almamaterSaved.value = true;
  toast.success(`Ukuran jas almamater (${size}) berhasil disimpan.`);

  // Tautkan ke backend student-service jika aktif
  await studentApi
    .updateReregistration({ almamater_size: size })
    .catch(() => null);

  setTimeout(() => {
    almamaterSaved.value = false;
  }, 4000);
};

const confirmReapply = async () => {
  isReapplying.value = true;
  try {
    const res = await applicantStore.reapplyNewTrack();
    showReapplyModal.value = false;
    toast.success(res?.message || 'Pendaftaran jalur baru berhasil dibuka.');
    emit('switch-tab', 'admission');
  } catch (err) {
    toast.error(err?.message || 'Gagal membuka pendaftaran baru. Silakan coba kembali.');
  } finally {
    isReapplying.value = false;
  }
};

onMounted(async () => {
  try {
    const selRes = await selectionApi.getMyResult().catch(() => null);
    if (selRes?.data?.data) {
      const d = selRes.data.data;
      if (d.decision_letter_no) applicantStore.state.result.decisionLetterNo = d.decision_letter_no;
      if (d.status === 'passed') applicantStore.state.result.isPassed = true;
      if (d.accepted_program) applicantStore.state.result.acceptedProdi = d.accepted_program;
    }
  } catch (err) {
    console.warn('Selection API Notice (fallback):', err?.message);
  }

  try {
    const studRes = await studentApi.getMyStatus().catch(() => null);
    if (studRes?.data?.data) {
      const s = studRes.data.data;
      if (s.nim) applicantStore.state.onboarding.nim = s.nim;
      if (s.pkkmb_group) applicantStore.state.onboarding.pkkmbGroup = s.pkkmb_group;
    }
  } catch (err) {
    console.warn('Student API Notice (fallback):', err?.message);
  }
});

const printLoA = () => {
  window.print();
};
</script>
