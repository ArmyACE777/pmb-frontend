<template>
  <div class="space-y-6">
    <!-- Header Modul -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900">
          Proses Seleksi Masuk Calon Mahasiswa Baru
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Pelaksanaan Seleksi Akademik Mandiri CBT dan Tes Lisan / Wawancara Daring Universitas Bakti Tunas Husada.
        </p>
      </div>
      <div class="text-xs text-slate-500 font-sans self-start sm:self-auto">
        Status: <strong class="text-slate-800 font-semibold">{{ activeSubTab === 'cbt' ? (examStatus === 'completed' ? 'Ujian CBT Selesai' : isTesting ? 'Ujian Sedang Berlangsung' : !applicantStore.isRegPaymentComplete ? 'Menunggu Pembayaran Formulir' : 'Sesi CBT Siap') : (interviewAttended ? 'Presensi Wawancara Terkonfirmasi' : 'Sesi Wawancara Terjadwal') }}</strong>
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

    <!-- Sub-Navigasi 2 Tahap Seleksi: CBT Online & Wawancara Daring -->
    <div v-if="!isTesting" class="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl w-full sm:w-fit">
      <button
        @click="activeSubTab = 'cbt'"
        class="px-4 py-2 rounded-xl text-xs font-sora font-semibold transition-all flex items-center gap-2 cursor-pointer"
        :class="activeSubTab === 'cbt'
          ? 'bg-white text-[#1E3A8A] shadow-xs'
          : 'text-slate-600 hover:text-slate-900'"
      >
        <Monitor class="w-4 h-4" />
        <span>Ujian CBT Online</span>
      </button>

      <button
        @click="activeSubTab = 'interview'"
        class="px-4 py-2 rounded-xl text-xs font-sora font-semibold transition-all flex items-center gap-2 cursor-pointer"
        :class="activeSubTab === 'interview'
          ? 'bg-white text-[#1E3A8A] shadow-xs'
          : 'text-slate-600 hover:text-slate-900'"
      >
        <Video class="w-4 h-4 text-emerald-600" />
        <span>Wawancara Daring</span>
      </button>
    </div>

    <!-- ========================================== -->
    <!-- BAGIAN 1: UJIAN MANDIRI CBT ONLINE        -->
    <!-- ========================================== -->
    <div v-if="activeSubTab === 'cbt'" class="space-y-6">
      <!-- VIEW 1: SELESAI UJIAN (SCORE SCREEN) -->
      <div v-if="examStatus === 'completed' && !isTesting" class="space-y-6 animate-fadeIn">
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm text-center max-w-2xl mx-auto space-y-4">
          <div class="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 class="w-8 h-8" />
          </div>

          <div>
            <h3 class="font-sora font-extrabold text-2xl text-slate-900 mt-1">
              Ujian Berhasil Diselesaikan
            </h3>
            <p class="text-xs text-slate-500 mt-1">
              Waktu Penyelesaian: {{ examState.completedAt }}
            </p>
          </div>

          <div class="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl max-w-md mx-auto grid grid-cols-2 gap-4 text-center">
            <div class="border-r border-slate-200 pr-2">
              <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Skor Akhir</div>
              <div class="font-sora font-black text-3xl text-[#1E3A8A] mt-1">
                {{ examState.score }}<span class="text-sm font-normal text-slate-400">/100</span>
              </div>
            </div>
            <div class="pl-2">
              <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Jawaban Benar</div>
              <div class="font-sora font-black text-3xl text-emerald-600 mt-1">
                {{ examState.correctAnswers }}<span class="text-sm font-normal text-slate-400">/{{ questions.length }}</span>
              </div>
            </div>
          </div>

          <div class="inline-flex items-center px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-md text-xs text-emerald-800 font-medium">
            <span>{{ examState.passedStatus }}</span>
          </div>

          <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
            <button
              @click="restartExam"
              class="w-full sm:w-auto rounded-xl px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-all cursor-pointer text-center"
            >
              Kerjakan Ulang Ujian
            </button>
            <button
              @click="activeSubTab = 'interview'"
              class="w-full sm:w-auto rounded-xl px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Video class="w-3.5 h-3.5" />
              <span>Lanjut ke Wawancara Daring</span>
            </button>
            <button
              @click="$emit('switch-tab', 'result')"
              class="w-full sm:w-auto rounded-xl px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-medium text-xs transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Lihat Pengumuman Kelulusan</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <!-- VIEW 2: SEDANG UJIAN (ACTIVE CBT INTERFACE) -->
      <div v-else-if="isTesting" class="space-y-4 animate-fadeIn">
        <!-- Exam Control Bar -->
        <div class="bg-[#1E3A8A] text-white rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-sora font-bold text-base">
              {{ currentIndex + 1 }}
            </div>
            <div>
              <div class="text-xs text-blue-200 font-sora">Ujian CBT PMB Universitas BTH</div>
              <div class="text-sm font-bold font-sora text-white">
                Soal Nomor {{ currentIndex + 1 }} dari {{ questions.length }}
              </div>
            </div>
          </div>

          <!-- Timer Box -->
          <div class="flex items-center gap-3 bg-black/30 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/10">
            <Clock class="w-4 h-4 text-amber-400" />
            <div class="text-right">
              <div class="text-[10px] text-blue-200 uppercase font-bold">Sisa Waktu</div>
              <div class="font-mono font-bold text-sm text-amber-300">
                {{ formattedTime }}
              </div>
            </div>
          </div>
        </div>

        <!-- Question & Options Card -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Question Content (Col 3) -->
          <div class="lg:col-span-3 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div class="space-y-5">
              <!-- Question Header & Mark Button -->
              <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                <span class="text-xs font-semibold text-slate-500">
                  Pertanyaan {{ currentIndex + 1 }} dari {{ questions.length }}
                </span>
                <button
                  @click="toggleRagu(currentIndex)"
                  class="text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer"
                  :class="raguList[currentIndex] ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'"
                >
                  <span>{{ raguList[currentIndex] ? 'Ragu-ragu (Ditandai)' : 'Tandai Ragu-ragu' }}</span>
                </button>
              </div>

              <!-- Question Text -->
              <div class="text-sm sm:text-base text-slate-900 font-medium leading-relaxed">
                {{ currentQuestion.question }}
              </div>

              <!-- Options Radio List -->
              <div class="space-y-2.5 pt-2">
                <label
                  v-for="opt in currentQuestion.options"
                  :key="opt.key"
                  class="flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none"
                  :class="userAnswers[currentIndex] === opt.key ? 'bg-blue-50/80 border-[#1E3A8A] text-[#1E3A8A] font-semibold ring-1 ring-blue-200' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'"
                >
                  <input
                    type="radio"
                    :name="'q_' + currentIndex"
                    :value="opt.key"
                    v-model="userAnswers[currentIndex]"
                    class="mt-0.5 text-[#1E3A8A] focus:ring-[#1E3A8A]"
                  />
                  <div class="text-xs sm:text-sm">
                    <strong class="mr-2">{{ opt.key }}.</strong>
                    <span>{{ opt.text }}</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- Bottom Navigation Controls -->
            <div class="pt-5 border-t border-slate-100 mt-5 flex items-center justify-between gap-2">
              <button
                @click="prevQuestion"
                :disabled="currentIndex === 0"
                class="rounded-xl px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none text-slate-700 font-medium text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft class="w-3.5 h-3.5 flex-shrink-0" />
                <span>Sebelumnya</span>
              </button>

              <button
                v-if="currentIndex < questions.length - 1"
                @click="nextQuestion"
                class="rounded-xl px-5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-medium text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Berikutnya</span>
                <ArrowRight class="w-3.5 h-3.5 flex-shrink-0" />
              </button>

              <button
                v-else
                @click="showFinishModal = true"
                class="rounded-xl px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Check class="w-4 h-4 flex-shrink-0" />
                <span>Selesaikan Ujian</span>
              </button>
            </div>
          </div>

          <!-- Question Grid Navigator (Col 1) -->
          <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
            <div class="font-sora font-bold text-xs text-slate-900 pb-2 border-b border-slate-100">
              Daftar Navigasi Soal
            </div>

            <div class="grid grid-cols-5 gap-1.5 sm:gap-2">
              <button
                v-for="(_, idx) in questions"
                :key="idx"
                @click="currentIndex = idx"
                class="h-9 sm:h-10 w-full rounded-xl font-sora font-bold text-xs flex items-center justify-center border transition-all cursor-pointer"
                :class="{
                  'ring-2 ring-[#1E3A8A] ring-offset-2': currentIndex === idx,
                  'bg-amber-100 border-amber-300 text-amber-900': raguList[idx],
                  'bg-blue-600 text-white border-blue-700': userAnswers[idx] && !raguList[idx],
                  'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100': !userAnswers[idx] && !raguList[idx]
                }"
              >
                {{ idx + 1 }}
              </button>
            </div>

            <!-- Ringkasan Status Soal -->
            <div class="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div class="flex items-center justify-between">
                <span>Sudah Dijawab</span>
                <strong class="font-semibold text-slate-800">{{ answeredCount }}</strong>
              </div>
              <div class="flex items-center justify-between">
                <span>Ragu-ragu</span>
                <strong class="font-semibold text-amber-700">{{ raguCount }}</strong>
              </div>
              <div class="flex items-center justify-between">
                <span>Belum Dijawab</span>
                <strong class="font-semibold text-slate-500">{{ questions.length - answeredCount }}</strong>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-100">
              <button
                @click="showFinishModal = true"
                class="w-full rounded-xl py-2.5 bg-slate-900 hover:bg-black text-white font-medium text-xs transition-colors cursor-pointer"
              >
                Selesai & Kumpulkan
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- VIEW 3: SEBELUM MULAI (JADWAL & PETUNJUK CBT) -->
      <div v-else class="space-y-6 animate-fadeIn">
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <h3 class="font-sora font-extrabold text-xl sm:text-2xl text-slate-900">
                Ujian CBT Online
              </h3>
              <p class="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Ujian dilaksanakan secara daring. Pastikan koneksi internet stabil sebelum memulai. Hasil nilai akan langsung ditampilkan setelah ujian selesai.
              </p>
            </div>

            <div class="flex-shrink-0">
              <button
                v-if="applicantStore.isRegPaymentComplete"
                @click="startExam"
                class="w-full sm:w-auto rounded-2xl py-3 px-8 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Monitor class="w-4 h-4" />
                <span>Mulai Ujian CBT</span>
              </button>
              <button
                v-else
                @click="$emit('switch-tab', 'payment')"
                class="w-full sm:w-auto rounded-2xl py-3 px-8 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard class="w-4 h-4" />
                <span>Bayar Biaya Pendaftaran untuk Membuka Sesi</span>
              </button>
            </div>
          </div>

          <!-- Parameter Sesi CBT Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs">
            <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div class="text-[11px] text-slate-400 font-medium">Jadwal Sesi</div>
              <div class="font-sora font-bold text-slate-800 mt-1">{{ schedule.cbt.date }}</div>
              <div class="text-[10px] text-slate-500 mt-0.5">{{ schedule.cbt.time }}</div>
            </div>

            <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div class="text-[11px] text-slate-400 font-medium">Durasi & Soal</div>
              <div class="font-sora font-bold text-slate-800 mt-1">15 Menit</div>
              <div class="text-[10px] text-slate-500 mt-0.5">5 Soal Pilihan Ganda</div>
            </div>

            <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div class="text-[11px] text-slate-400 font-medium">Standar Kelulusan</div>
              <div class="font-sora font-bold text-emerald-700 mt-1">Nilai Minimal 70</div>
              <div class="text-[10px] text-slate-500 mt-0.5">Skor minimal kelulusan</div>
            </div>

            <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div class="text-[11px] text-slate-400 font-medium">Media Pelaksanaan</div>
              <div class="font-sora font-bold text-slate-800 mt-1">Portal CBT Daring</div>
              <div class="text-[10px] text-slate-500 mt-0.5">{{ schedule.cbt.room }}</div>
            </div>
          </div>
        </div>

        <!-- Petunjuk Pengerjaan CBT -->
        <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-3">
          <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base pb-3 border-b border-slate-100">
            Petunjuk Pengerjaan
          </h3>
          <ul class="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
            <li>Ujian terdiri dari 5 butir soal pilihan ganda dengan durasi pengerjaan 15 menit.</li>
            <li>Pilihlah salah satu jawaban yang paling tepat. Jawaban dapat diperbarui selama waktu ujian masih berjalan.</li>
            <li>Gunakan tombol "Tandai Ragu-ragu" jika Anda belum yakin dengan opsi jawaban yang dipilih.</li>
            <li>Kerjakan secara mandiri dan pastikan koneksi internet stabil hingga ujian dikumpulkan.</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- BAGIAN 2: TES LISAN & WAWANCARA DARING (MEET, ZOOM, DLL)       -->
    <!-- ============================================================== -->
    <div v-else-if="activeSubTab === 'interview'" class="space-y-6 animate-fadeIn">
      <!-- 1. Ruang Virtual Wawancara -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 class="font-sora font-extrabold text-xl sm:text-2xl text-slate-900">
              Wawancara Daring
            </h3>
            <p class="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Sesi wawancara daring bersama Tim Penguji Universitas Bakti Tunas Husada melalui media video konferensi.
            </p>
          </div>

          <!-- Attendance Confirmation Button -->
          <div class="flex-shrink-0">
            <div
              v-if="interviewAttended"
              class="px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-semibold"
            >
              <CheckCircle2 class="w-4 h-4 text-emerald-600" />
              <span>Presensi Kehadiran Terverifikasi</span>
            </div>
            <button
              v-else
              @click="recordInterviewAttendance"
              :disabled="isSubmittingAttendance"
              class="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <UserCheck class="w-4 h-4" />
              <span>{{ isSubmittingAttendance ? 'Mencatat Presensi...' : 'Konfirmasi Kehadiran' }}</span>
            </button>
          </div>
        </div>

        <!-- 2 Pilihan Video Telekonferensi: Google Meet & Zoom -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Opsi 1: Google Meet -->
          <div class="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-4">
            <div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs flex-shrink-0 p-2">
                  <img src="/images/icons/google-meet.svg" alt="Google Meet Logo" class="w-full h-full object-contain" />
                </div>
                <h4 class="font-sora font-bold text-slate-900 text-base">Google Meet</h4>
              </div>

              <div class="mt-4 p-3 bg-white rounded-xl border border-slate-200/80 space-y-1.5 text-xs font-sans">
                <div class="flex items-center justify-between text-slate-600">
                  <span class="text-slate-500">Kode Pertemuan:</span>
                  <div class="flex items-center gap-2">
                    <span class="font-mono font-bold text-slate-900">pmb-ubth-2026</span>
                    <button
                      @click="copyText('pmb-ubth-2026', 'Kode Google Meet')"
                      class="text-[11px] font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
                    >
                      Salin
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <a
              href="https://meet.google.com/pmb-ubth-2026"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full py-2.5 px-4 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-2 text-center"
            >
              <span>Masuk Google Meet</span>
              <ExternalLink class="w-3.5 h-3.5" />
            </a>
          </div>

          <!-- Opsi 2: Zoom Meetings -->
          <div class="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-4">
            <div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs flex-shrink-0 p-1.5">
                  <img src="/images/icons/zoom.svg" alt="Zoom Meetings Logo" class="w-full h-full object-contain" />
                </div>
                <h4 class="font-sora font-bold text-slate-900 text-base">Zoom Meetings</h4>
              </div>

              <div class="mt-4 p-3 bg-white rounded-xl border border-slate-200/80 space-y-1.5 text-xs font-sans">
                <div class="flex items-center justify-between text-slate-600">
                  <span class="text-slate-500">Meeting ID:</span>
                  <div class="flex items-center gap-2">
                    <span class="font-mono font-bold text-slate-900">894 2026 0042</span>
                    <button
                      @click="copyText('894 2026 0042', 'Meeting ID Zoom')"
                      class="text-[11px] font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
                    >
                      Salin
                    </button>
                  </div>
                </div>
                <div class="flex items-center justify-between text-slate-600">
                  <span class="text-slate-500">Passcode:</span>
                  <div class="flex items-center gap-2">
                    <span class="font-mono font-bold text-slate-900">BTH2026</span>
                    <button
                      @click="copyText('BTH2026', 'Passcode Zoom')"
                      class="text-[11px] font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
                    >
                      Salin
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <a
              href="https://zoom.us/j/89420260042"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-2 text-center"
            >
              <span>Masuk Zoom</span>
              <ExternalLink class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <!-- Detail Jadwal & Tim Dewan Penguji -->
        <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
          <div class="space-y-1">
            <span class="text-slate-500 block">Jadwal Wawancara:</span>
            <strong class="font-sora text-slate-900 block text-sm">{{ schedule.interview.date }}</strong>
            <span class="text-slate-600">{{ schedule.interview.time }}</span>
          </div>

          <div class="space-y-1">
            <span class="text-slate-500 block">Pewawancara:</span>
            <strong class="font-sora text-slate-900 block text-sm">Dr. apt. Keni Idacahyati, M.Farm.</strong>
            <span class="text-slate-600">Dosen Penguji PMB BTH</span>
          </div>

          <div class="space-y-1">
            <span class="text-slate-500 block">Estimasi Durasi:</span>
            <strong class="font-sora text-slate-900 block text-sm">15 - 20 Menit</strong>
            <span class="text-slate-600">Sesi tanya jawab</span>
          </div>
        </div>
      </div>

      <!-- 2. Tata Tertib & Ketentuan Wawancara -->
      <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-3">
        <h4 class="font-sora font-bold text-slate-900 text-sm sm:text-base pb-3 border-b border-slate-100">
          Tata Tertib & Ketentuan Wawancara
        </h4>
        <ul class="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
          <li>Peserta wajib mengenakan pakaian rapi dan sopan (kemeja berkerah).</li>
          <li>Kamera video (webcam) dan mikrofon harus dalam kondisi aktif selama wawancara berlangsung.</li>
          <li>Berada di ruangan yang tenang dan memiliki pencahayaan memadai.</li>
          <li>Menyiapkan kartu identitas atau bukti pendaftaran untuk keperluan verifikasi oleh penguji.</li>
        </ul>
      </div>
    </div>

    <!-- Modal Konfirmasi Selesai Ujian CBT -->
    <div
      v-if="showFinishModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
    >
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center">
        <div class="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
          <AlertTriangle class="w-6 h-6" />
        </div>

        <h3 class="font-sora font-bold text-slate-900 text-base">
          Konfirmasi Pengumpulan Lembar Jawaban CBT
        </h3>

        <p class="text-xs text-slate-600 leading-relaxed">
          Anda telah menjawab <strong>{{ answeredCount }} dari {{ questions.length }} soal</strong>. Apakah Anda yakin ingin mengakhiri sesi ujian CBT sekarang?
        </p>

        <div class="flex items-center justify-center gap-3 pt-2">
          <button
            @click="showFinishModal = false"
            class="rounded-xl px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            Kembali Memeriksa
          </button>
          <button
            @click="finishExam"
            class="rounded-xl px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-sora font-bold text-xs transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            Ya, Kumpulkan Jawaban
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Check,
  CreditCard,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Monitor,
  Video,
  ExternalLink,
  UserCheck
} from 'lucide-vue-next';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useApplicantStore } from '@/stores/applicant';
import { examApi } from '@/api/exam';
import { scoringApi } from '@/api/scoring';

defineEmits(['switch-tab']);

const applicantStore = useApplicantStore();
const examState = computed(() => applicantStore.state.exam);
const examStatus = computed(() => examState.value.status);
const schedule = computed(() => applicantStore.state.schedule);

// Sub-navigasi tab: 'cbt' atau 'interview'
const activeSubTab = ref('cbt');
const toastMessage = ref('');
const interviewAttended = ref(false);
const isSubmittingAttendance = ref(false);

const isTesting = ref(false);
const currentIndex = ref(0);
const timeLeft = ref(900); // 15 minutes = 900 seconds
let timerInterval = null;
const showFinishModal = ref(false);

onMounted(async () => {
  try {
    const cardRes = await examApi.getMyExamCard().catch(() => null);
    if (cardRes?.data?.data) {
      const card = cardRes.data.data;
      if (card.session_name) applicantStore.state.schedule.cbtSession = card.session_name;
      if (card.exam_date) applicantStore.state.schedule.cbtDate = card.exam_date;
      if (card.venue) applicantStore.state.schedule.cbtVenue = card.venue;
    }
    await examApi.getMySchedule().catch(() => null);
  } catch (err) {
    console.warn('Exam API Notice (fallback):', err?.message);
  }
});

const questions = [
  {
    category: 'Matematika Terapan & Farmasi',
    question: 'Seorang apoteker diminta membuat larutan alkohol 70% sebanyak 500 mL dari sediaan alkohol 96%. Berapakah volume alkohol 96% yang dibutuhkan untuk pengenceran tersebut?',
    correct: 'A',
    options: [
      { key: 'A', text: '364.58 mL' },
      { key: 'B', text: '350.00 mL' },
      { key: 'C', text: '420.25 mL' },
      { key: 'D', text: '280.00 mL' },
      { key: 'E', text: '385.50 mL' },
    ],
  },
  {
    category: 'Biologi Sel & Farmasi Dasar',
    question: 'Organel sel yang berfungsi utama dalam proses sintesis protein dan memiliki partikel ribosom pada permukaan membrannya adalah...',
    correct: 'B',
    options: [
      { key: 'A', text: 'Mitokondria' },
      { key: 'B', text: 'Retikulum Endoplasma Kasar' },
      { key: 'C', text: 'Badan Golgi' },
      { key: 'D', text: 'Lisosom' },
      { key: 'E', text: 'Peroksisom' },
    ],
  },
  {
    category: 'Bahasa Inggris Akademik',
    question: 'Antibiotics are medications used to treat bacterial infections. They work by killing bacteria or preventing them from reproducing. However, overuse can lead to antibiotic resistance. What is the main concern regarding antibiotic overuse?',
    correct: 'B',
    options: [
      { key: 'A', text: 'It cures infections too quickly' },
      { key: 'B', text: 'Bacteria can become resistant to the drugs' },
      { key: 'C', text: 'The cost of medicine decreases' },
      { key: 'D', text: 'Patients become immune to all diseases' },
      { key: 'E', text: 'Antibiotics will lose their color' },
    ],
  },
  {
    category: 'Penalaran Logika Analitik',
    question: 'Semua mahasiswa Fakultas Farmasi BTH wajib mengikuti praktikum kimia dasar. Sebagian peserta praktikum kimia dasar mengenakan kacamata pelindung. Kesimpulan yang paling tepat adalah...',
    correct: 'A',
    options: [
      { key: 'A', text: 'Sebagian mahasiswa Fakultas Farmasi BTH mengenakan kacamata pelindung' },
      { key: 'B', text: 'Semua yang memakai kacamata pelindung adalah dosen farmasi' },
      { key: 'C', text: 'Tidak ada mahasiswa yang mengikuti praktikum kimia' },
      { key: 'D', text: 'Semua mahasiswa farmasi tidak pernah praktikum' },
      { key: 'E', text: 'Kacamata pelindung hanya dipakai di luar ruangan' },
    ],
  },
  {
    category: 'Etika Profesi Tenaga Kesehatan',
    question: 'Prinsip etika profesi tenaga kesehatan yang menekankan kewajiban untuk senantiasa bertindak demi kebaikan, manfaat, dan keselamatan pasien disebut prinsip...',
    correct: 'B',
    options: [
      { key: 'A', text: 'Autonomy' },
      { key: 'B', text: 'Beneficence' },
      { key: 'C', text: 'Non-maleficence' },
      { key: 'D', text: 'Justice' },
      { key: 'E', text: 'Confidentiality' },
    ],
  },
];

const userAnswers = ref(['A', 'B', 'B', 'A', '']);
const raguList = ref([false, false, false, false, false]);

const currentQuestion = computed(() => questions[currentIndex.value]);

const answeredCount = computed(() => {
  return userAnswers.value.filter((ans) => Boolean(ans)).length;
});

const raguCount = computed(() => {
  return raguList.value.filter(Boolean).length;
});

const formattedTime = computed(() => {
  const m = Math.floor(timeLeft.value / 60);
  const s = timeLeft.value % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
});

const startExam = () => {
  isTesting.value = true;
  currentIndex.value = 0;
  timeLeft.value = 900;
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      finishExam();
    }
  }, 1000);
};

const restartExam = () => {
  userAnswers.value = ['', '', '', '', ''];
  raguList.value = [false, false, false, false, false];
  startExam();
};

const toggleRagu = (idx) => {
  raguList.value[idx] = !raguList.value[idx];
};

const prevQuestion = () => {
  if (currentIndex.value > 0) currentIndex.value--;
};

const nextQuestion = () => {
  if (currentIndex.value < questions.length - 1) currentIndex.value++;
};

const finishExam = () => {
  if (timerInterval) clearInterval(timerInterval);
  showFinishModal.value = false;
  isTesting.value = false;

  let correct = 0;
  questions.forEach((q, i) => {
    if (userAnswers.value[i] === q.correct) {
      correct++;
    }
  });

  const finalScore = Math.round((correct / questions.length) * 100);
  applicantStore.submitExam(finalScore, correct);

  scoringApi
    .submitScore({
      applicant_id: applicantStore.state.candidate?.registrationNumber || 'BTH-2026-REG-00042',
      exam_id: 'CBT-ONLINE-01',
      score: finalScore,
      component: 'cbt_test',
      passing_grade: 70,
    })
    .catch((err) => {
      console.warn('Scoring API Notice (fallback):', err?.message);
    });
};

const recordInterviewAttendance = async () => {
  isSubmittingAttendance.value = true;
  try {
    await examApi.recordAttendance('SESSION-INT-01', {
      applicant_id: applicantStore.state.candidate?.registrationNumber || 'BTH-2026-REG-00042',
      status: 'present',
      channel: 'google_meet',
      timestamp: new Date().toISOString(),
    }).catch(() => null);
  } catch (err) {
    console.warn('Interview Attendance API Notice (fallback):', err?.message);
  } finally {
    isSubmittingAttendance.value = false;
    interviewAttended.value = true;
    toastMessage.value = 'Presensi kehadiran tes lisan berhasil dicatat! Silakan bergabung ke ruang rapat Google Meet atau Zoom.';
  }
};

const copyText = async (text, label) => {
  try {
    await navigator.clipboard.writeText(text);
    toastMessage.value = `${label} (${text}) berhasil disalin.`;
  } catch {
    toastMessage.value = `${label}: ${text}`;
  }
};

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>
