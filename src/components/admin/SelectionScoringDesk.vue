<template>
  <div class="space-y-6">
    <!-- Header Meja Kerja -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2.5">
          <span>Seleksi CBT & Penilaian Wawancara</span>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-[#1E3A8A] border border-blue-200/80">
            T.A. 2026/2027
          </span>
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Pusat pengelolaan bank butir soal ujian mandiri, sesi Computer-Based Test (CBT), pemantauan peserta, dan rekapitulasi penilaian kelulusan.
        </p>
      </div>

      <!-- Quick Desk Navigation Tabs -->
      <div class="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar">
        <button
          v-for="tab in cbtTabs"
          :key="tab.id"
          @click="activeCbtTab = tab.id"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer"
          :class="activeCbtTab === tab.id
            ? 'bg-white text-[#1E3A8A] shadow-xs'
            : 'text-slate-600 hover:text-slate-900'"
        >
          <component :is="tab.icon" class="w-3.5 h-3.5" />
          <span>{{ tab.label }}</span>
          <span
            v-if="tab.badge"
            class="px-1.5 py-0.2 bg-blue-100 text-[#1E3A8A] rounded-full text-[10px] font-bold"
          >
            {{ tab.badge }}
          </span>
        </button>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- TAB 1: BANK SOAL & BUTIR PERTANYAAN CMS                                   -->
    <!-- ========================================================================= -->
    <div v-if="activeCbtTab === 'banks'" class="space-y-5">
      <!-- Breadcrumb when viewing questions inside a specific bank -->
      <div v-if="selectedBank" class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div class="flex items-center gap-2 text-xs">
          <button
            @click="selectedBank = null; questionsList = []"
            class="flex items-center gap-1 font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
          >
            <ArrowLeft class="w-3.5 h-3.5" />
            <span>Semua Bank Soal</span>
          </button>
          <span class="text-slate-400">/</span>
          <span class="font-bold text-slate-800 truncate max-w-xs">{{ selectedBank.name }}</span>
          <span class="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium text-[11px] border border-indigo-200/60">
            {{ selectedBank.category || 'Umum' }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="openQuestionModal(null)"
            class="px-3 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>Tambah Butir Soal</span>
          </button>
        </div>
      </div>

      <!-- When NO bank is selected: Grid of Question Banks -->
      <div v-if="!selectedBank" class="space-y-4">
        <!-- Action Toolbar for Bank Soal -->
        <div class="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div class="relative flex-1">
            <input
              v-model="bankSearch"
              type="text"
              placeholder="Cari bank soal, kategori, atau topik..."
              class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] focus:bg-white rounded-lg text-xs outline-none text-slate-800 transition-colors"
            />
            <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="loadQuestionBanks"
              class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              title="Refresh Bank Soal"
            >
              <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': loadingBanks }" />
              <span>Muat Ulang</span>
            </button>
            <button
              @click="openBankModal(null)"
              class="px-3.5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer whitespace-nowrap"
            >
              <Plus class="w-3.5 h-3.5" />
              <span>Buat Bank Soal Baru</span>
            </button>
          </div>
        </div>

        <!-- Bank Soal Cards Grid -->
        <div v-if="loadingBanks" class="py-16 text-center text-slate-400">
          <RefreshCw class="w-6 h-6 animate-spin mx-auto text-[#1E3A8A] mb-2" />
          <p class="text-xs">Memuat katalog bank soal ujian...</p>
        </div>

        <div v-else-if="filteredBanks.length === 0" class="py-16 text-center bg-white rounded-xl border border-slate-200 p-6">
          <BookOpen class="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p class="font-bold text-slate-700 text-sm">Belum Ada Bank Soal</p>
          <p class="text-xs text-slate-400 mt-1">Silakan buat bank soal pertama untuk menampung butir-butir pertanyaan CBT.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="bank in filteredBanks"
            :key="bank.id"
            class="bg-white rounded-xl border border-slate-200/90 hover:border-blue-400 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div class="space-y-2.5">
              <div class="flex items-start justify-between gap-2">
                <span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200/70">
                  {{ bank.category || 'Kategori Umum' }}
                </span>
                <span class="text-[11px] font-mono text-slate-400">
                  {{ bank.code || bank.name.slice(0, 4).toUpperCase() }}
                </span>
              </div>

              <div>
                <h3 class="font-sora font-bold text-slate-900 text-sm group-hover:text-[#1E3A8A] transition-colors">
                  {{ bank.name }}
                </h3>
                <p class="text-xs text-slate-500 line-clamp-2 mt-1">
                  {{ bank.description || 'Tidak ada keterangan tambahan.' }}
                </p>
              </div>
            </div>

            <div class="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div class="flex items-center gap-1.5 text-slate-600 font-medium">
                <HelpCircle class="w-3.5 h-3.5 text-slate-400" />
                <span>{{ bank.total_questions || 0 }} Butir Soal</span>
              </div>

              <div class="flex items-center gap-1">
                <button
                  @click="selectBankToView(bank)"
                  class="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1E3A8A] rounded-lg font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Kelola Soal</span>
                  <ChevronRight class="w-3 h-3" />
                </button>
                <button
                  @click="openBankModal(bank)"
                  class="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                  title="Edit Bank Soal"
                >
                  <Edit2 class="w-3.5 h-3.5" />
                </button>
                <button
                  @click="confirmDeleteBank(bank)"
                  class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                  title="Hapus Bank Soal"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- When a bank IS selected: List of Questions inside the bank -->
      <div v-else class="space-y-4">
        <div v-if="loadingQuestions" class="py-16 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
          <RefreshCw class="w-6 h-6 animate-spin mx-auto text-[#1E3A8A] mb-2" />
          <p class="text-xs">Memuat daftar butir pertanyaan...</p>
        </div>

        <div v-else-if="questionsList.length === 0" class="py-16 text-center bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <HelpCircle class="w-10 h-10 text-slate-300 mx-auto" />
          <p class="font-bold text-slate-700 text-sm">Belum Ada Butir Soal di Bank Ini</p>
          <p class="text-xs text-slate-400 max-w-sm mx-auto">
            Klik tombol di bawah untuk menambahkan pertanyaan pilihan ganda beserta kunci jawaban.
          </p>
          <button
            @click="openQuestionModal(null)"
            class="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>Tambah Butir Soal Pertama</span>
          </button>
        </div>

        <!-- Question Cards List -->
        <div v-else class="space-y-3">
          <div
            v-for="(q, index) in questionsList"
            :key="q.id"
            class="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3 hover:border-slate-300 transition-colors"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start gap-2.5">
                <span class="w-6 h-6 rounded-md bg-[#1E3A8A] text-white font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {{ index + 1 }}
                </span>
                <div>
                  <div class="text-xs font-medium text-slate-900 whitespace-pre-line leading-relaxed">
                    {{ q.question_text }}
                  </div>
                  <div class="flex items-center gap-2 mt-2">
                    <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Bobot: {{ q.points || 1 }} Poin
                    </span>
                    <span class="text-[11px] text-slate-400 font-mono">
                      {{ (q.options || []).length }} Opsi Pilihan
                    </span>
                  </div>
                </div>
              </div>

              <!-- Question Action Buttons -->
              <div class="flex items-center gap-1 flex-shrink-0">
                <button
                  @click="openQuestionModal(q)"
                  class="p-1.5 text-slate-500 hover:text-[#1E3A8A] hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                  title="Edit Soal"
                >
                  <Edit2 class="w-3.5 h-3.5" />
                </button>
                <button
                  @click="confirmDeleteQuestion(q)"
                  class="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                  title="Hapus Soal"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <!-- Options Grid -->
            <div class="pl-8 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-100">
              <div
                v-for="opt in q.options"
                :key="opt.id || opt.option_key"
                class="flex items-center gap-2 p-2 rounded-lg text-xs transition-colors"
                :class="opt.is_correct
                  ? 'bg-emerald-50/80 border border-emerald-300 text-emerald-900 font-semibold'
                  : 'bg-slate-50 border border-slate-200/80 text-slate-700'"
              >
                <span
                  class="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 font-mono"
                  :class="opt.is_correct ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'"
                >
                  {{ opt.option_key }}
                </span>
                <span class="truncate flex-1">{{ opt.option_text }}</span>
                <span v-if="opt.is_correct" class="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded flex-shrink-0">
                  Kunci
                </span>
              </div>
            </div>

            <!-- Explanation / Discussion -->
            <div v-if="q.explanation" class="pl-8 text-[11px] text-slate-500 italic bg-slate-50/70 p-2 rounded-lg border border-slate-100">
              <span class="font-semibold text-slate-700 not-italic">Pembahasan: </span>
              {{ q.explanation }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- TAB 2: PAKET & SESI UJIAN CBT                                             -->
    <!-- ========================================================================= -->
    <div v-else-if="activeCbtTab === 'exams'" class="space-y-4">
      <!-- Toolbar -->
      <div class="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h3 class="font-sora font-bold text-slate-900 text-sm">Paket Ujian Seleksi Mandiri</h3>
          <p class="text-xs text-slate-500">Konfigurasi paket tes berbasis komputer, alokasi waktu pengerjaan, dan ambang batas kelulusan.</p>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="loadCBTExams"
            class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': loadingExams }" />
            <span>Muat Ulang</span>
          </button>
          <button
            @click="openExamModal"
            class="px-3.5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer whitespace-nowrap"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>Buat Paket Ujian Baru</span>
          </button>
        </div>
      </div>

      <!-- Exam List -->
      <div v-if="loadingExams" class="py-16 text-center text-slate-400">
        <RefreshCw class="w-6 h-6 animate-spin mx-auto text-[#1E3A8A] mb-2" />
        <p class="text-xs">Memuat paket ujian CBT...</p>
      </div>

      <div v-else-if="cbtExamsList.length === 0" class="py-16 text-center bg-white rounded-xl border border-slate-200 p-6 space-y-2">
        <Layers class="w-10 h-10 text-slate-300 mx-auto" />
        <p class="font-bold text-slate-700 text-sm">Belum Ada Paket Ujian CBT</p>
        <p class="text-xs text-slate-400">Buat paket ujian untuk membuka akses tes bagi calon mahasiswa.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="exam in cbtExamsList"
          :key="exam.id"
          class="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3.5 flex flex-col justify-between"
        >
          <div class="space-y-2.5">
            <div class="flex items-start justify-between gap-2">
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                :class="exam.status === 'published'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-amber-50 text-amber-700 border-amber-300'"
              >
                {{ exam.status === 'published' ? 'Aktif' : 'Draf' }}
              </span>
              <span class="text-xs font-mono text-slate-400">
                Passing Grade: {{ exam.passing_grade || 70 }}
              </span>
            </div>

            <div>
              <h4 class="font-sora font-bold text-slate-900 text-sm">
                {{ exam.title }}
              </h4>
              <p class="text-xs text-slate-500 mt-1 line-clamp-2">
                {{ exam.description || 'Paket tes kemampuan akademik terpadu PMB.' }}
              </p>
            </div>

            <!-- Parameters Badges -->
            <div class="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                <Clock class="w-3.5 h-3.5 text-slate-400" />
                <span>{{ exam.duration_minutes || 60 }} Menit</span>
              </span>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200/70 text-[#1E3A8A] font-semibold">
                <Award class="w-3.5 h-3.5 text-blue-500" />
                <span>Passing Grade: {{ exam.passing_grade || 70 }}</span>
              </span>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                <Shuffle class="w-3.5 h-3.5 text-slate-400" />
                <span>{{ exam.shuffle_questions ? 'Soal & Opsi Diacak' : 'Urutan Standar' }}</span>
              </span>
            </div>
          </div>

          <!-- Card Actions -->
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              @click="switchMonitoringToExam(exam)"
              class="text-xs font-semibold text-[#1E3A8A] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Activity class="w-3.5 h-3.5" />
              <span>Pengawasan Peserta</span>
            </button>

            <button
              v-if="exam.status !== 'published'"
              @click="publishExam(exam)"
              class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <Send class="w-3.5 h-3.5" />
              <span>Publikasikan Ujian</span>
            </button>
            <span v-else class="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 class="w-3.5 h-3.5" />
              <span>Sesi Terbuka untuk Peserta</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- TAB 3: PENGAWASAN PELAKSANAAN CBT (PROCTORING)                            -->
    <!-- ========================================================================= -->
    <div v-else-if="activeCbtTab === 'monitoring'" class="space-y-4">
      <!-- Toolbar with Exam Selector and Refresh -->
      <div class="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h3 class="font-sora font-bold text-slate-900 text-sm">Pengawasan Pelaksanaan Ujian (CBT)</h3>
          <p class="text-xs text-slate-500">Pemantauan aktivitas peserta ujian secara langsung, durasi pengerjaan, skor perolehan, dan tindakan pengawas.</p>
        </div>

        <div class="flex items-center gap-2">
          <!-- Select Exam -->
          <select
            v-model="selectedExamIdForMonitoring"
            @change="loadMonitoringAttempts"
            class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none cursor-pointer"
          >
            <option v-for="ex in cbtExamsList" :key="ex.id" :value="ex.id">
              {{ ex.title }} ({{ ex.status === 'published' ? 'Aktif' : 'Draf' }})
            </option>
          </select>

          <button
            @click="loadMonitoringAttempts"
            class="px-3 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': loadingAttempts }" />
            <span>Segarkan Data</span>
          </button>
        </div>
      </div>

      <!-- Live Monitoring Stats Bar -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="bg-white rounded-xl p-3.5 border border-slate-200 text-center shadow-2xs">
          <div class="text-[10px] uppercase font-bold text-slate-400">Sedang Mengerjakan</div>
          <div class="font-sora font-bold text-lg text-amber-600 mt-0.5">
            {{ inProgressCount }}
          </div>
        </div>
        <div class="bg-white rounded-xl p-3.5 border border-slate-200 text-center shadow-2xs">
          <div class="text-[10px] uppercase font-bold text-slate-400">Selesai Mengerjakan</div>
          <div class="font-sora font-bold text-lg text-emerald-600 mt-0.5">
            {{ submittedCount }}
          </div>
        </div>
        <div class="bg-white rounded-xl p-3.5 border border-slate-200 text-center shadow-2xs">
          <div class="text-[10px] uppercase font-bold text-slate-400">Rata-rata Nilai CBT</div>
          <div class="font-sora font-bold text-lg text-[#1E3A8A] mt-0.5">
            {{ averageObjectiveScore }}
          </div>
        </div>
      </div>

      <!-- Attempts Table -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div v-if="loadingAttempts" class="py-16 text-center text-slate-400">
          <RefreshCw class="w-6 h-6 animate-spin mx-auto text-[#1E3A8A] mb-2" />
          <p class="text-xs">Mengambil riwayat pengerjaan sesi ujian peserta...</p>
        </div>

        <div v-else-if="attemptsList.length === 0" class="py-16 text-center text-slate-400 p-6 space-y-2">
          <Activity class="w-10 h-10 text-slate-300 mx-auto" />
          <p class="font-bold text-slate-700 text-sm">Belum Ada Peserta yang Mulai Ujian</p>
          <p class="text-xs text-slate-400">Data pengerjaan akan muncul saat peserta mengklik Mulai Ujian di portal siswa.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-700 min-w-[760px]">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-sora uppercase text-[10px] tracking-wider">
              <tr>
                <th class="py-3.5 px-4 font-bold">Peserta / No. Registrasi</th>
                <th class="py-3.5 px-4 font-bold text-center">Status Pengerjaan</th>
                <th class="py-3.5 px-4 font-bold text-center">Waktu Mulai</th>
                <th class="py-3.5 px-4 font-bold text-center">Nilai CBT</th>
                <th class="py-3.5 px-4 font-bold text-center">Terminal / IP</th>
                <th class="py-3.5 px-4 font-bold text-right">Tindakan Pengawas</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-sans">
              <tr v-for="att in attemptsList" :key="att.id" class="hover:bg-slate-50/80 transition-colors">
                <td class="py-3.5 px-4">
                  <div class="font-sora font-bold text-slate-900">
                    {{ att.participant?.applicant_name || att.participant?.applicant_id || 'Peserta CBT' }}
                  </div>
                  <div class="font-mono text-[11px] text-[#1E3A8A]">
                    {{ att.participant?.exam_card_number || att.participant?.applicant_id || att.id.slice(0, 8) }}
                  </div>
                </td>

                <td class="py-3.5 px-4 text-center whitespace-nowrap">
                  <span
                    v-if="att.status === 'in_progress'"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300"
                  >
                    <span>Sedang Mengerjakan</span>
                  </span>
                  <span
                    v-else-if="att.status === 'submitted'"
                    class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300"
                  >
                    <Check class="w-3 h-3 text-emerald-600" />
                    <span>Selesai & Terkirim</span>
                  </span>
                  <span
                    v-else
                    class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300"
                  >
                    {{ att.status }}
                  </span>
                </td>

                <td class="py-3.5 px-4 text-center font-mono text-[11px] text-slate-600 whitespace-nowrap">
                  {{ formatTime(att.started_at) }}
                </td>

                <td class="py-3.5 px-4 text-center whitespace-nowrap">
                  <span class="font-sora font-bold text-sm text-[#1E3A8A]">
                    {{ att.objective_score ?? att.final_score ?? 0 }}
                  </span>
                  <span class="text-[10px] text-slate-400"> Poin</span>
                </td>

                <td class="py-3.5 px-4 text-center font-mono text-[11px] text-slate-500 whitespace-nowrap">
                  <span class="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">
                    {{ att.ip_address || '127.0.0.1' }}
                  </span>
                </td>

                <td class="py-3.5 px-4 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      v-if="att.status === 'in_progress'"
                      @click="extendAttemptTime(att)"
                      class="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#1E3A8A] rounded-lg font-semibold text-[11px] transition-colors cursor-pointer border border-blue-200/60"
                      title="Kompensasi penambahan waktu pengerjaan 15 menit"
                    >
                      +15 Mnt
                    </button>
                    <button
                      @click="openResetModal(att)"
                      class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer border border-rose-200/60"
                      title="Reset sesi ujian peserta"
                    >
                      Reset Sesi
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- TAB 4: REKAPITULASI NILAI & PENETAPAN KELULUSAN (ORIGINAL SCORING DESK)    -->
    <!-- ========================================================================= -->
    <div v-else-if="activeCbtTab === 'scoring'" class="space-y-4">
      <!-- Filter & Search Controls Bar -->
      <div class="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <!-- Search Input -->
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari peserta, No. Peserta, prodi..."
            class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] focus:bg-white rounded-lg text-xs outline-none text-slate-800 transition-colors"
          />
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <!-- Status Filter Tabs -->
        <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0 text-xs -mx-1 px-1">
          <button
            v-for="filter in filters"
            :key="filter.id"
            @click="selectedFilter = filter.id"
            class="px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex-shrink-0"
            :class="selectedFilter === filter.id
              ? 'bg-[#1E3A8A] text-white font-semibold'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <!-- Desktop Selection Scoring Table (>= md) -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 class="font-sora font-bold text-slate-900 text-sm">
            Daftar Penilaian Calon Mahasiswa TA 2026/2027
          </h3>
          <span class="text-xs text-slate-400">Total {{ filteredApplicants.length }} Peserta Ditampilkan</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-700 min-w-[880px]">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-sora uppercase text-[10px] tracking-wider whitespace-nowrap">
              <tr>
                <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[130px]">No. Peserta</th>
                <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[200px]">Nama Lengkap & Prodi</th>
                <th class="py-3.5 px-4 font-bold text-center whitespace-nowrap min-w-[100px]">Skor CBT</th>
                <th class="py-3.5 px-4 font-bold text-center whitespace-nowrap min-w-[130px]">Rata-rata Rapor</th>
                <th class="py-3.5 px-4 font-bold text-center whitespace-nowrap min-w-[130px]">Nilai Wawancara</th>
                <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[140px]">Status Keputusan</th>
                <th class="py-3.5 px-4 font-bold text-right whitespace-nowrap min-w-[130px]">Aksi Penilaian</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-sans">
              <tr
                v-for="applicant in filteredApplicants"
                :key="applicant.id"
                class="hover:bg-slate-50/80 transition-colors"
              >
                <!-- Reg -->
                <td class="py-3.5 px-4 font-mono font-bold text-[#1E3A8A] whitespace-nowrap">
                  {{ applicant.id }}
                </td>

                <!-- Name & Prodi -->
                <td class="py-3.5 px-4 min-w-[200px]">
                  <div class="font-sora font-bold text-slate-900 whitespace-nowrap">{{ applicant.fullName }}</div>
                  <div class="text-[11px] text-slate-500 whitespace-nowrap">{{ applicant.prodi1 }}</div>
                </td>

                <!-- CBT Score -->
                <td class="py-3.5 px-4 text-center whitespace-nowrap">
                  <span class="font-sora font-bold text-base" :class="applicant.selection.cbtScore >= 70 ? 'text-[#1E3A8A]' : 'text-rose-600'">
                    {{ applicant.selection.cbtScore }}
                  </span>
                </td>

                <!-- Rapor -->
                <td class="py-3.5 px-4 text-center font-mono font-medium text-slate-800 whitespace-nowrap">
                  {{ applicant.averageScore }}
                </td>

                <!-- Interview Score -->
                <td class="py-3.5 px-4 text-center whitespace-nowrap">
                  <span v-if="applicant.selection.interviewScore" class="font-sora font-bold text-base text-slate-900">
                    {{ applicant.selection.interviewScore }}
                  </span>
                  <span v-else class="text-[11px] text-slate-400 italic">Belum Diuji</span>
                </td>

                <!-- Decision Status -->
                <td class="py-3.5 px-4 whitespace-nowrap">
                  <span
                    v-if="applicant.selection.passedStatus === 'passed'"
                    class="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded text-xs font-medium whitespace-nowrap"
                  >
                    Lulus Seleksi
                  </span>
                  <span
                    v-else-if="applicant.selection.passedStatus === 'failed'"
                    class="inline-block px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200/80 rounded text-xs font-medium whitespace-nowrap"
                  >
                    Tidak Lulus
                  </span>
                  <span
                    v-else
                    class="inline-block px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200/80 rounded text-xs font-medium whitespace-nowrap"
                  >
                    Evaluasi Pleno
                  </span>
                </td>

                <!-- Action Button -->
                <td class="py-3.5 px-4 text-right whitespace-nowrap">
                  <button
                    @click="openInterviewModal(applicant)"
                    class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                  >
                    Nilai Wawancara
                  </button>
                </td>
              </tr>
              <tr v-if="filteredApplicants.length === 0">
                <td colspan="7" class="py-12 text-center text-slate-400">
                  <div class="max-w-xs mx-auto space-y-2">
                    <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                      <GraduationCap class="w-6 h-6" />
                    </div>
                    <div class="font-sora font-semibold text-slate-700 text-sm">Belum Ada Peserta Seleksi</div>
                    <p class="text-xs text-slate-400">Belum ada peserta yang mengikuti seleksi atau pengerjaan CBT.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODALS SECTION                                                            -->
    <!-- ========================================================================= -->

    <!-- Modal 1: Tambah / Edit Bank Soal -->
    <Teleport to="body">
      <div
        v-if="showBankModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        @click.self="showBankModal = false"
      >
        <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
          <div class="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 class="font-sora font-bold text-slate-900 text-base">
              {{ editingBank ? 'Edit Bank Soal' : 'Buat Bank Soal Baru' }}
            </h3>
            <button @click="showBankModal = false" class="text-slate-400 hover:text-slate-700">
              <X class="w-5 h-5" />
            </button>
          </div>
          <form @submit.prevent="saveBank" class="p-5 space-y-3.5 text-xs">
            <div>
              <label class="block font-semibold text-slate-800 mb-1">Nama Bank Soal *</label>
              <input
                v-model="bankForm.name"
                required
                placeholder="Contoh: Matematika Dasar & Logika Farmasi"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A]"
              />
            </div>
            <div>
              <label class="block font-semibold text-slate-800 mb-1">Kategori Soal *</label>
              <input
                v-model="bankForm.category"
                required
                placeholder="Contoh: Kemampuan Akademik, Sains Medis, dsb."
                class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A]"
              />
            </div>
            <div>
              <label class="block font-semibold text-slate-800 mb-1">Deskripsi Singkat</label>
              <textarea
                v-model="bankForm.description"
                rows="3"
                placeholder="Penjelasan ringkas materi dan cakupan butir soal..."
                class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A]"
              ></textarea>
            </div>
            <div class="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                @click="showBankModal = false"
                class="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="savingBank"
                class="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw v-if="savingBank" class="w-3.5 h-3.5 animate-spin" />
                <span>Simpan Bank Soal</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal 2: Tambah / Edit Butir Soal & Pilihan Kunci -->
    <Teleport to="body">
      <div
        v-if="showQuestionModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
        @click.self="showQuestionModal = false"
      >
        <div class="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
          <div class="p-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
            <div>
              <h3 class="font-sora font-bold text-slate-900 text-base">
                {{ editingQuestion ? 'Edit Butir Pertanyaan CBT' : 'Tambah Butir Pertanyaan CBT' }}
              </h3>
              <p class="text-xs text-slate-500">Bank: {{ selectedBank?.name }}</p>
            </div>
            <button @click="showQuestionModal = false" class="text-slate-400 hover:text-slate-700">
              <X class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="saveQuestion" class="p-5 space-y-4 text-xs overflow-y-auto flex-1 font-sans">
            <div>
              <label class="block font-semibold text-slate-800 mb-1">Pertanyaan / Soal Ujian *</label>
              <textarea
                v-model="questionForm.question_text"
                rows="4"
                required
                placeholder="Tuliskan teks pertanyaan lengkap..."
                class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] text-xs font-normal"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-800 mb-1">Bobot Nilai (Poin) *</label>
                <input
                  v-model.number="questionForm.points"
                  type="number"
                  min="1"
                  required
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] font-bold"
                />
              </div>
              <div>
                <label class="block font-semibold text-slate-800 mb-1">Format Butir Soal</label>
                <div class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 flex items-center justify-between">
                  <span>Pilihan Ganda (A – E)</span>
                  <span class="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Standar CBT</span>
                </div>
              </div>
            </div>

            <!-- Opsi Pilihan A - E with Radio Button for Correct Answer -->
            <div class="space-y-2.5 pt-2 border-t border-slate-100">
              <div class="flex items-center justify-between">
                <label class="block font-bold text-slate-800">Pilihan Jawaban (A – E) & Kunci Jawaban Benar *</label>
                <span class="text-[11px] text-slate-500">Tentukan radio button pada opsi yang menjadi kunci jawaban benar</span>
              </div>

              <div
                v-for="(opt, idx) in questionForm.options"
                :key="opt.option_key"
                class="flex items-center gap-2.5 p-2 rounded-lg border transition-all"
                :class="opt.is_correct ? 'bg-emerald-50/70 border-emerald-300' : 'bg-white border-slate-200'"
              >
                <!-- Radio selection for correct option -->
                <input
                  type="radio"
                  name="correct_option"
                  :value="opt.option_key"
                  :checked="opt.is_correct"
                  @change="selectCorrectOption(opt.option_key)"
                  class="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  title="Tandai sebagai kunci jawaban benar"
                />

                <span
                  class="w-6 h-6 rounded-md font-mono font-bold text-xs flex items-center justify-center flex-shrink-0"
                  :class="opt.is_correct ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'"
                >
                  {{ opt.option_key }}
                </span>

                <input
                  v-model="opt.option_text"
                  required
                  :placeholder="'Teks pilihan ' + opt.option_key"
                  class="flex-1 px-3 py-1.5 border border-slate-300 rounded-md outline-none text-xs"
                  :class="opt.is_correct ? 'border-emerald-400 bg-white font-medium text-emerald-950' : 'bg-slate-50'"
                />
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-800 mb-1">Pembahasan / Catatan Penjelasan (Opsional)</label>
              <textarea
                v-model="questionForm.explanation"
                rows="2"
                placeholder="Penjelasan ringkas dasar penentuan kunci jawaban..."
                class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] text-xs"
              ></textarea>
            </div>

            <div class="pt-3 border-t border-slate-100 flex justify-end gap-2 flex-shrink-0">
              <button
                type="button"
                @click="showQuestionModal = false"
                class="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="savingQuestion"
                class="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw v-if="savingQuestion" class="w-3.5 h-3.5 animate-spin" />
                <span>Simpan Butir Soal</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal 3: Buat Paket Ujian CBT Baru -->
    <Teleport to="body">
      <div
        v-if="showExamModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        @click.self="showExamModal = false"
      >
        <div class="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
          <div class="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 class="font-sora font-bold text-slate-900 text-base">Buat Paket Ujian CBT Baru</h3>
            <button @click="showExamModal = false" class="text-slate-400 hover:text-slate-700">
              <X class="w-5 h-5" />
            </button>
          </div>
          <form @submit.prevent="saveExam" class="p-5 space-y-3.5 text-xs font-sans">
            <div>
              <label class="block font-semibold text-slate-800 mb-1">Judul Paket Ujian *</label>
              <input
                v-model="examForm.title"
                required
                placeholder="Contoh: Ujian CBT Seleksi Mandiri Gelombang 1"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A]"
              />
            </div>
            <div>
              <label class="block font-semibold text-slate-800 mb-1">Deskripsi Ringkas</label>
              <textarea
                v-model="examForm.description"
                rows="2"
                placeholder="Petunjuk pengerjaan dan materi ujian..."
                class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A]"
              ></textarea>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-800 mb-1">Durasi Pengerjaan (Menit) *</label>
                <input
                  v-model.number="examForm.duration_minutes"
                  type="number"
                  min="15"
                  required
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A]"
                />
              </div>
              <div>
                <label class="block font-semibold text-slate-800 mb-1">Passing Grade (0-100) *</label>
                <input
                  v-model.number="examForm.passing_grade"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  required
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A]"
                />
              </div>
            </div>
            <div class="space-y-2 pt-2 border-t border-slate-100">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="examForm.shuffle_questions" class="rounded text-[#1E3A8A]" />
                <span class="font-medium text-slate-700">Acak urutan butir soal untuk setiap peserta</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="examForm.shuffle_options" class="rounded text-[#1E3A8A]" />
                <span class="font-medium text-slate-700">Acak urutan pilihan ganda (A-E)</span>
              </label>
            </div>
            <div class="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                @click="showExamModal = false"
                class="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="savingExam"
                class="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw v-if="savingExam" class="w-3.5 h-3.5 animate-spin" />
                <span>Simpan & Publikasikan</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal 4: Reset Ujian Peserta -->
    <Teleport to="body">
      <div
        v-if="resetAttemptTarget"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        @click.self="resetAttemptTarget = null"
      >
        <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
          <div class="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 class="font-sora font-bold text-slate-900 text-base flex items-center gap-2 text-rose-700">
              <ShieldAlert class="w-5 h-5 text-rose-600" />
              <span>Reset Pengerjaan CBT</span>
            </h3>
            <button @click="resetAttemptTarget = null" class="text-slate-400 hover:text-slate-700">
              <X class="w-5 h-5" />
            </button>
          </div>
          <form @submit.prevent="executeResetAttempt" class="p-5 space-y-3.5 text-xs">
            <p class="text-slate-600">
              Anda akan mereset pengerjaan ujian untuk peserta
              <strong class="text-slate-900">{{ resetAttemptTarget.participant?.applicant_name || 'Peserta' }}</strong>.
              Seluruh jawaban sesi ini akan dihapus dan peserta dapat mengulang kembali ujian dari awal.
            </p>
            <div>
              <label class="block font-semibold text-slate-800 mb-1">Alasan Reset *</label>
              <textarea
                v-model="resetReason"
                rows="2"
                required
                placeholder="Contoh: Gangguan jaringan internet lokal / listrik padam saat ujian..."
                class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-rose-600"
              ></textarea>
            </div>
            <div class="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                @click="resetAttemptTarget = null"
                class="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="resettingAttempt"
                class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw v-if="resettingAttempt" class="w-3.5 h-3.5 animate-spin" />
                <span>Konfirmasi Reset</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal 5: Input / Edit Nilai Wawancara (Original Modal) -->
    <Teleport to="body">
      <div
        v-if="activeApplicant"
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm overflow-y-auto modal-sharp"
        @click.self="activeApplicant = null"
      >
        <div class="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden my-auto transform-gpu">
          <!-- Top Accent Bar -->
          <div class="h-1.5 w-full bg-gradient-to-r from-[#1E3A8A] via-indigo-600 to-sky-500 flex-shrink-0"></div>

          <!-- Modal Header -->
          <div class="p-5 sm:p-6 pb-4 flex items-start justify-between gap-4 border-b border-slate-100">
            <div class="flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-[#1E3A8A] flex-shrink-0 shadow-2xs">
                <GraduationCap class="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <div>
                <div class="text-[10px] font-bold text-[#1E3A8A] uppercase tracking-wider font-sora flex items-center gap-1.5">
                  <span>Penilaian Wawancara Dosen PMB</span>
                  <span class="text-slate-400 font-normal">/</span>
                  <span class="text-slate-500 font-normal">T.A. 2026/2027</span>
                </div>
                <h3 class="font-sora font-bold text-slate-900 text-base sm:text-lg">
                  Formulir Penilaian Wawancara Calon Mahasiswa
                </h3>
              </div>
            </div>
            <button
              @click="activeApplicant = null"
              class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Tutup Modal"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="saveInterview" class="p-5 sm:p-6 space-y-4 max-h-[calc(85vh-130px)] overflow-y-auto text-xs font-sans">
            <!-- Candidate Identity Card -->
            <div class="bg-gradient-to-br from-slate-50 via-indigo-50/20 to-white border border-slate-200/90 rounded-xl p-4 space-y-2.5 shadow-2xs">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-full bg-[#1E3A8A] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {{ activeApplicant.fullName ? activeApplicant.fullName.slice(0, 2).toUpperCase() : 'PS' }}
                  </div>
                  <div>
                    <div class="font-bold text-slate-900 text-sm">
                      {{ activeApplicant.fullName }}
                    </div>
                    <div class="text-[11px] text-slate-500 font-mono">
                      No. Reg: {{ activeApplicant.id }}
                    </div>
                  </div>
                </div>
                <div class="self-start sm:self-auto">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                    {{ activeApplicant.prodi1 || 'Program Studi PMB' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Dosen Pewawancara -->
            <div class="space-y-1.5">
              <label class="block font-semibold text-slate-800 flex items-center gap-1.5">
                <UserCheck class="w-3.5 h-3.5 text-blue-600" />
                <span>Dosen Penguji / Pewawancara</span>
                <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="formInterviewer"
                type="text"
                required
                placeholder="Contoh: apt. Dedi Mulyadi, M.Farm."
                class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs font-medium text-slate-800 outline-none shadow-2xs transition-all"
              />
            </div>

            <!-- Skor Nilai Wawancara with Grade Indicator -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="block font-semibold text-slate-800 flex items-center gap-1.5">
                  <Award class="w-3.5 h-3.5 text-indigo-600" />
                  <span>Nilai Wawancara (Skala 0 - 100)</span>
                  <span class="text-rose-500">*</span>
                </label>
                <!-- Dynamic Grade Badge -->
                <span
                  class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
                  :class="interviewGrade.class"
                >
                  Grade {{ interviewGrade.grade }} — {{ interviewGrade.label }}
                </span>
              </div>

              <!-- Numeric Score Input -->
              <input
                v-model.number="formScore"
                type="number"
                min="0"
                max="100"
                required
                placeholder="Masukkan nilai (0 - 100)"
                class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl text-base font-mono font-bold text-[#1E3A8A] outline-none shadow-2xs transition-all"
              />
              <p class="text-[11px] text-slate-400 font-sans">
                Standar Penilaian: Grade A (≥85), Grade B (75-84), Grade C (60-74), Grade D (&lt;60).
              </p>
            </div>

            <!-- Rekapitulasi Nilai & Penetapan Kelulusan -->
            <div class="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-3 shadow-2xs">
              <div class="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 font-sora">
                <Calculator class="w-3.5 h-3.5 text-blue-600" />
                <span>Rekapitulasi Nilai & Kelulusan (Bobot CBT 50% + Wawancara 50%)</span>
              </div>

              <div class="grid grid-cols-3 gap-2.5 text-center">
                <div class="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                  <div class="text-[10px] text-slate-500 font-medium">Skor CBT</div>
                  <div class="text-base font-bold font-mono text-slate-800 mt-0.5">
                    {{ activeApplicant.selection?.cbtScore || 0 }}
                  </div>
                </div>
                <div class="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                  <div class="text-[10px] text-slate-500 font-medium">Skor Wawancara</div>
                  <div class="text-base font-bold font-mono text-indigo-700 mt-0.5">
                    {{ formScore || 0 }}
                  </div>
                </div>
                <div class="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                  <div class="text-[10px] text-slate-500 font-medium">Rata-rata Gabungan</div>
                  <div class="text-base font-bold font-mono text-[#1E3A8A] mt-0.5">
                    {{ combinedAverage }}
                  </div>
                </div>
              </div>

              <div class="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
                <span class="text-slate-600 font-medium">Rekomendasi Keputusan Seleksi:</span>
                <span
                  class="px-2.5 py-0.5 rounded-full font-bold border flex items-center gap-1"
                  :class="calculatedRecommendation.color"
                >
                  <component :is="calculatedRecommendation.icon" class="w-3 h-3" />
                  <span>{{ calculatedRecommendation.label }}</span>
                </span>
              </div>
            </div>

            <!-- Catatan Evaluasi Dosen -->
            <div class="space-y-1.5">
              <label class="block font-semibold text-slate-800 flex items-center gap-1.5">
                <FileText class="w-3.5 h-3.5 text-slate-500" />
                <span>Catatan Evaluasi / Rekomendasi Penguji</span>
              </label>
              <textarea
                v-model="formNotes"
                rows="3"
                placeholder="Catatan mengenai motivasi program studi, rekam jejak, komitmen studi, atau catatan khusus penguji..."
                class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 outline-none shadow-2xs transition-all"
              ></textarea>
            </div>

            <!-- Modal Footer Actions -->
            <div class="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-end gap-2.5">
              <button
                type="button"
                @click="activeApplicant = null"
                class="w-full sm:w-auto px-4 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-xl transition-colors cursor-pointer text-center"
              >
                Batal
              </button>
              <button
                type="submit"
                class="w-full sm:w-auto px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                <CheckCircle2 class="w-4 h-4" />
                <span>Simpan Penilaian Wawancara</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin';
import { examApi } from '@/api/exam';
import { useToast } from '@/composables/useToast';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  AlertCircle,
  XCircle,
  X,
  UserCheck,
  FileText,
  Calculator,
  BookOpen,
  Layers,
  Activity,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  ChevronRight,
  ArrowLeft,
  HelpCircle,
  Check,
  Send,
  ShieldAlert,
  Clock,
  Shuffle,
} from 'lucide-vue-next';

const props = defineProps({
  currentRole: {
    type: String,
    default: 'superadmin',
  },
});

const adminStore = useAdminStore();
const toast = useToast();

// --- Navigation Tabs ---
const activeCbtTab = ref('banks');
const cbtTabs = [
  { id: 'banks', label: 'Bank Soal', icon: BookOpen },
  { id: 'exams', label: 'Paket & Sesi Ujian', icon: Layers },
  { id: 'monitoring', label: 'Pengawasan CBT', icon: Activity },
  { id: 'scoring', label: 'Penilaian & Kelulusan', icon: Award },
];

// --- General Toast & Feedback ---
const showToast = (msg) => {
  toast.success(msg);
};

const showError = (msg) => {
  toast.error(msg);
};

// =============================================================================
// TAB 1: BANK SOAL & BUTIR PERTANYAAN
// =============================================================================
const questionBanks = ref([]);
const loadingBanks = ref(false);
const bankSearch = ref('');
const selectedBank = ref(null);

const showBankModal = ref(false);
const editingBank = ref(null);
const savingBank = ref(false);
const bankForm = ref({
  name: '',
  category: '',
  description: '',
});

const questionsList = ref([]);
const loadingQuestions = ref(false);
const showQuestionModal = ref(false);
const editingQuestion = ref(null);
const savingQuestion = ref(false);
const questionForm = ref({
  question_text: '',
  points: 10,
  question_type: 'multiple_choice',
  explanation: '',
  options: [
    { option_key: 'A', option_text: '', is_correct: true },
    { option_key: 'B', option_text: '', is_correct: false },
    { option_key: 'C', option_text: '', is_correct: false },
    { option_key: 'D', option_text: '', is_correct: false },
    { option_key: 'E', option_text: '', is_correct: false },
  ],
});

const filteredBanks = computed(() => {
  if (!bankSearch.value.trim()) return questionBanks.value;
  const q = bankSearch.value.toLowerCase();
  return questionBanks.value.filter(
    (b) =>
      b.name.toLowerCase().includes(q) ||
      (b.category && b.category.toLowerCase().includes(q)) ||
      (b.description && b.description.toLowerCase().includes(q))
  );
});

const loadQuestionBanks = async () => {
  loadingBanks.value = true;
  try {
    const res = await examApi.getQuestionBanks();
    questionBanks.value = res.data?.data || res.data || [];
  } catch (err) {
    showError('Gagal memuat bank soal: ' + (err.response?.data?.message || err.message));
  } finally {
    loadingBanks.value = false;
  }
};

const openBankModal = (bank = null) => {
  editingBank.value = bank;
  if (bank) {
    bankForm.value = {
      name: bank.name,
      category: bank.category || '',
      description: bank.description || '',
    };
  } else {
    bankForm.value = {
      name: '',
      category: 'Kemampuan Dasar',
      description: '',
    };
  }
  showBankModal.value = true;
};

const saveBank = async () => {
  savingBank.value = true;
  try {
    if (editingBank.value) {
      await examApi.updateQuestionBank(editingBank.value.id, bankForm.value);
      showToast(`Bank soal "${bankForm.value.name}" berhasil diperbarui.`);
    } else {
      await examApi.createQuestionBank(bankForm.value);
      showToast(`Bank soal "${bankForm.value.name}" berhasil dibuat.`);
    }
    showBankModal.value = false;
    await loadQuestionBanks();
  } catch (err) {
    showError('Gagal menyimpan bank soal: ' + (err.response?.data?.message || err.message));
  } finally {
    savingBank.value = false;
  }
};

const confirmDeleteBank = async (bank) => {
  if (!confirm(`Hapus bank soal "${bank.name}" beserta seluruh butir pertanyaannya?`)) return;
  try {
    await examApi.deleteQuestionBank(bank.id);
    showToast(`Bank soal "${bank.name}" berhasil dihapus.`);
    await loadQuestionBanks();
  } catch (err) {
    showError('Gagal menghapus bank soal: ' + (err.response?.data?.message || err.message));
  }
};

const selectBankToView = async (bank) => {
  selectedBank.value = bank;
  await loadQuestionsForBank(bank.id);
};

const loadQuestionsForBank = async (bankId) => {
  loadingQuestions.value = true;
  try {
    const res = await examApi.getQuestions(bankId);
    questionsList.value = res.data?.data || res.data || [];
  } catch (err) {
    showError('Gagal memuat pertanyaan: ' + (err.response?.data?.message || err.message));
  } finally {
    loadingQuestions.value = false;
  }
};

const openQuestionModal = (question = null) => {
  editingQuestion.value = question;
  if (question) {
    questionForm.value = {
      question_text: question.question_text,
      points: question.points || 10,
      question_type: question.question_type || 'multiple_choice',
      explanation: question.explanation || '',
      options: (question.options && question.options.length === 5)
        ? question.options.map((o) => ({
            option_key: o.option_key,
            option_text: o.option_text,
            is_correct: !!o.is_correct,
          }))
        : [
            { option_key: 'A', option_text: '', is_correct: true },
            { option_key: 'B', option_text: '', is_correct: false },
            { option_key: 'C', option_text: '', is_correct: false },
            { option_key: 'D', option_text: '', is_correct: false },
            { option_key: 'E', option_text: '', is_correct: false },
          ],
    };
  } else {
    questionForm.value = {
      question_text: '',
      points: 10,
      question_type: 'multiple_choice',
      explanation: '',
      options: [
        { option_key: 'A', option_text: '', is_correct: true },
        { option_key: 'B', option_text: '', is_correct: false },
        { option_key: 'C', option_text: '', is_correct: false },
        { option_key: 'D', option_text: '', is_correct: false },
        { option_key: 'E', option_text: '', is_correct: false },
      ],
    };
  }
  showQuestionModal.value = true;
};

const selectCorrectOption = (key) => {
  questionForm.value.options.forEach((opt) => {
    opt.is_correct = opt.option_key === key;
  });
};

const saveQuestion = async () => {
  if (!selectedBank.value) return;
  savingQuestion.value = true;
  try {
    const payload = {
      question_bank_id: selectedBank.value.id,
      question_type: questionForm.value.question_type,
      question_text: questionForm.value.question_text,
      points: Number(questionForm.value.points),
      explanation: questionForm.value.explanation,
      options: questionForm.value.options,
    };

    if (editingQuestion.value) {
      await examApi.updateQuestion(editingQuestion.value.id, payload);
      showToast('Butir soal berhasil diperbarui.');
    } else {
      await examApi.createQuestion(payload);
      showToast('Butir soal baru berhasil ditambahkan ke bank soal.');
    }
    showQuestionModal.value = false;
    await loadQuestionsForBank(selectedBank.value.id);
    await loadQuestionBanks();
  } catch (err) {
    showError('Gagal menyimpan soal: ' + (err.response?.data?.message || err.message));
  } finally {
    savingQuestion.value = false;
  }
};

const confirmDeleteQuestion = async (q) => {
  if (!confirm('Hapus butir pertanyaan ini?')) return;
  try {
    await examApi.deleteQuestion(q.id);
    showToast('Butir pertanyaan berhasil dihapus.');
    await loadQuestionsForBank(selectedBank.value.id);
    await loadQuestionBanks();
  } catch (err) {
    showError('Gagal menghapus pertanyaan: ' + (err.response?.data?.message || err.message));
  }
};

// =============================================================================
// TAB 2: PAKET & SESI UJIAN CBT
// =============================================================================
const cbtExamsList = ref([]);
const loadingExams = ref(false);
const showExamModal = ref(false);
const savingExam = ref(false);
const examForm = ref({
  title: '',
  description: '',
  duration_minutes: 60,
  passing_grade: 70.0,
  shuffle_questions: true,
  shuffle_options: true,
});

const loadCBTExams = async () => {
  loadingExams.value = true;
  try {
    const res = await examApi.getCBTExams();
    cbtExamsList.value = res.data?.data || res.data || [];
    if (cbtExamsList.value.length > 0 && !selectedExamIdForMonitoring.value) {
      selectedExamIdForMonitoring.value = cbtExamsList.value[0].id;
    }
  } catch (err) {
    showError('Gagal memuat paket ujian: ' + (err.response?.data?.message || err.message));
  } finally {
    loadingExams.value = false;
  }
};

const openExamModal = () => {
  examForm.value = {
    title: 'Ujian CBT Saringan Masuk Gelombang 1',
    description: 'Tes potensi akademik, kemampuan dasar sains, dan penalaran logika PMB BTH.',
    duration_minutes: 60,
    passing_grade: 70.0,
    shuffle_questions: true,
    shuffle_options: true,
  };
  showExamModal.value = true;
};

const saveExam = async () => {
  savingExam.value = true;
  try {
    const res = await examApi.createCBTExam({
      title: examForm.value.title,
      description: examForm.value.description,
      duration_minutes: Number(examForm.value.duration_minutes),
      passing_grade: Number(examForm.value.passing_grade),
      shuffle_questions: examForm.value.shuffle_questions,
      shuffle_options: examForm.value.shuffle_options,
      status: 'draft',
    });
    const createdExam = res.data?.data || res.data;
    // Auto publish
    if (createdExam?.id) {
      await examApi.publishCBTExam(createdExam.id);
    }
    showToast(`Paket ujian "${examForm.value.title}" berhasil dibuat dan dipublikasikan.`);
    showExamModal.value = false;
    await loadCBTExams();
  } catch (err) {
    showError('Gagal membuat paket ujian: ' + (err.response?.data?.message || err.message));
  } finally {
    savingExam.value = false;
  }
};

const publishExam = async (exam) => {
  try {
    await examApi.publishCBTExam(exam.id);
    showToast(`Paket ujian "${exam.title}" berhasil dipublikasikan untuk peserta.`);
    await loadCBTExams();
  } catch (err) {
    showError('Gagal mempublikasikan ujian: ' + (err.response?.data?.message || err.message));
  }
};

const switchMonitoringToExam = (exam) => {
  selectedExamIdForMonitoring.value = exam.id;
  activeCbtTab.value = 'monitoring';
  loadMonitoringAttempts();
};

// =============================================================================
// TAB 3: LIVE MONITORING PENGERJAAN CBT
// =============================================================================
const selectedExamIdForMonitoring = ref('');
const attemptsList = ref([]);
const loadingAttempts = ref(false);
const resetAttemptTarget = ref(null);
const resetReason = ref('');
const resettingAttempt = ref(false);

const inProgressCount = computed(() => {
  return attemptsList.value.filter((a) => a.status === 'in_progress').length;
});

const submittedCount = computed(() => {
  return attemptsList.value.filter((a) => a.status === 'submitted').length;
});

const averageObjectiveScore = computed(() => {
  const scored = attemptsList.value.filter((a) => a.objective_score != null);
  if (scored.length === 0) return 0;
  const sum = scored.reduce((acc, a) => acc + (a.objective_score || 0), 0);
  return (sum / scored.length).toFixed(1);
});

const loadMonitoringAttempts = async () => {
  if (!selectedExamIdForMonitoring.value) {
    if (cbtExamsList.value.length > 0) {
      selectedExamIdForMonitoring.value = cbtExamsList.value[0].id;
    } else {
      return;
    }
  }
  loadingAttempts.value = true;
  try {
    const res = await examApi.getExamAttempts(selectedExamIdForMonitoring.value);
    attemptsList.value = res.data?.data || res.data || [];

    // Auto sync candidate score into admin applicants store
    attemptsList.value.forEach((att) => {
      if (att.participant && att.status === 'submitted' && att.objective_score != null) {
        const applicant = adminStore.applicants.find(
          (app) => app.id === att.participant.applicant_id || app.fullName === att.participant.applicant_name
        );
        if (applicant && applicant.selection) {
          applicant.selection.cbtScore = Math.round(att.objective_score);
        }
      }
    });
  } catch (err) {
    showError('Gagal memuat pengerjaan peserta: ' + (err.response?.data?.message || err.message));
  } finally {
    loadingAttempts.value = false;
  }
};

const extendAttemptTime = async (attempt) => {
  try {
    await examApi.extendAttempt(attempt.id, 15, 'Penambahan kompensasi waktu pengawas PMB');
    showToast('Waktu pengerjaan berhasil ditambah +15 menit.');
    await loadMonitoringAttempts();
  } catch (err) {
    showError('Gagal menambah waktu: ' + (err.response?.data?.message || err.message));
  }
};

const openResetModal = (attempt) => {
  resetAttemptTarget.value = attempt;
  resetReason.value = 'Kendala teknis koneksi/perangkat peserta saat tes';
};

const executeResetAttempt = async () => {
  if (!resetAttemptTarget.value) return;
  resettingAttempt.value = true;
  try {
    await examApi.resetAttempt(resetAttemptTarget.value.id, resetReason.value);
    showToast('Pengerjaan peserta berhasil di-reset. Peserta dapat mengulang sesi.');
    resetAttemptTarget.value = null;
    await loadMonitoringAttempts();
  } catch (err) {
    showError('Gagal me-reset ujian: ' + (err.response?.data?.message || err.message));
  } finally {
    resettingAttempt.value = false;
  }
};

const formatTime = (isoString) => {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
  } catch (e) {
    return isoString;
  }
};

// =============================================================================
// TAB 4: REKAPITULASI NILAI & PENETAPAN KELULUSAN
// =============================================================================
const activeApplicant = ref(null);
const formScore = ref(85);
const formNotes = ref('');
const formInterviewer = ref('');
const searchQuery = ref('');
const selectedFilter = ref('all');


const combinedAverage = computed(() => {
  if (!activeApplicant.value) return 0;
  const cbt = Number(activeApplicant.value.selection?.cbtScore || 0);
  const interview = Number(formScore.value || 0);
  return Math.round((cbt + interview) / 2);
});

const calculatedRecommendation = computed(() => {
  const avg = combinedAverage.value;
  if (avg >= 70) {
    return {
      status: 'passed',
      label: 'Lulus Seleksi',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CheckCircle2,
      note: 'Memenuhi standar kelulusan program studi PMB BTH.',
    };
  } else if (avg >= 60) {
    return {
      status: 'evaluating',
      label: 'Evaluasi Pleno',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: AlertCircle,
      note: 'Perlu pertimbangan rapat pleno dewan penguji.',
    };
  } else {
    return {
      status: 'failed',
      label: 'Tidak Lulus',
      color: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: XCircle,
      note: 'Di bawah ambang batas passing grade minimum.',
    };
  }
});

const interviewGrade = computed(() => {
  const score = Number(formScore.value) || 0;
  if (score >= 85) return { grade: 'A', label: 'Sangat Baik', class: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
  if (score >= 75) return { grade: 'B', label: 'Baik', class: 'bg-blue-50 text-blue-800 border-blue-200' };
  if (score >= 60) return { grade: 'C', label: 'Cukup', class: 'bg-amber-50 text-amber-800 border-amber-200' };
  return { grade: 'D', label: 'Kurang', class: 'bg-rose-50 text-rose-800 border-rose-200' };
});

const filters = [
  { id: 'all', label: 'Semua Peserta' },
  { id: 'passed', label: 'Lulus Seleksi' },
  { id: 'evaluating', label: 'Evaluasi Pleno' },
  { id: 'failed', label: 'Tidak Lulus' },
];

const filteredApplicants = computed(() => {
  return adminStore.applicants.filter((applicant) => {
    if (selectedFilter.value !== 'all') {
      if (applicant.selection?.passedStatus !== selectedFilter.value) return false;
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      const matchName = (applicant.fullName || '').toLowerCase().includes(q);
      const matchId = (applicant.id || '').toLowerCase().includes(q);
      const matchProdi = (applicant.prodi1 || '').toLowerCase().includes(q);
      return matchName || matchId || matchProdi;
    }
    return true;
  });
});

const openInterviewModal = (applicant) => {
  activeApplicant.value = applicant;
  formScore.value = applicant.selection.interviewScore || 85;
  formNotes.value = applicant.selection.interviewNotes || '';
  formInterviewer.value =
    applicant.selection.interviewer ||
    (props.currentRole === 'penguji' ? 'Tim Penguji PMB BTH' : 'apt. Dedi Mulyadi, M.Farm.');
};

const saveInterview = () => {
  if (!activeApplicant.value) return;
  adminStore.updateInterview(
    activeApplicant.value.id,
    formScore.value,
    formNotes.value,
    formInterviewer.value
  );
  showToast(`Penilaian wawancara ${activeApplicant.value.fullName} berhasil disimpan dan status kelulusan diperbarui.`);
  activeApplicant.value = null;
};

// Initial Data Load
onMounted(async () => {
  await Promise.all([loadQuestionBanks(), loadCBTExams()]);
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.25s ease-out forwards;
}
</style>
