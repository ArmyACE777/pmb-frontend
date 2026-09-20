<template>
  <div class="space-y-6">
    <!-- Header Modul -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-lg text-slate-900">
          Portal Ujian Mandiri CBT (Computer Based Test)
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Simulasi dan pengerjaan tes kemampuan akademik & potensi skolastik PMB Universitas BTH.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <span
          class="px-3 py-1 rounded-full text-xs font-semibold font-sora"
          :class="examStatus === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : isTesting ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-[#1E3A8A] border border-blue-200/80'"
        >
          {{ examStatus === 'completed' ? 'Ujian Telah Selesai' : isTesting ? 'Ujian Sedang Berlangsung' : 'Sesi Siap Dimulai' }}
        </span>
      </div>
    </div>

    <!-- VIEW 1: SELESAI UJIAN (SCORE SCREEN) -->
    <div v-if="examStatus === 'completed' && !isTesting" class="space-y-6 animate-fadeIn">
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs text-center max-w-2xl mx-auto space-y-4">
        <div class="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div>
          <div class="text-xs font-semibold text-emerald-700 uppercase tracking-wider font-sora">
            Hasil Penilaian Ujian CBT Online
          </div>
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

        <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs text-emerald-800 font-sora font-semibold">
          <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>{{ examState.passedStatus }}</span>
        </div>

        <div class="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3">
          <button
            @click="restartExam"
            class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-sora font-semibold text-xs rounded-xl transition-all"
          >
            Ulangi Simulasi Ujian
          </button>
          <button
            @click="$emit('switch-tab', 'result')"
            class="px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>Lihat Pengumuman Kelulusan</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
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
          <svg class="w-4 h-4 text-amber-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
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
        <div class="lg:col-span-3 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div class="space-y-5">
            <!-- Category Tag -->
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2.5 py-0.5 rounded">
                Bidang: {{ currentQuestion.category }}
              </span>
              <button
                @click="toggleRagu(currentIndex)"
                class="text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1.5"
                :class="raguList[currentIndex] ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'"
              >
                <span class="w-2 h-2 rounded-full" :class="raguList[currentIndex] ? 'bg-amber-500' : 'bg-slate-300'"></span>
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
          <div class="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
            <button
              @click="prevQuestion"
              :disabled="currentIndex === 0"
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Soal Sebelumnya</span>
            </button>

            <button
              v-if="currentIndex < questions.length - 1"
              @click="nextQuestion"
              class="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Soal Berikutnya</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              v-else
              @click="showFinishModal = true"
              class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sora font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Selesaikan Ujian</span>
            </button>
          </div>
        </div>

        <!-- Question Grid Navigator (Col 1) -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div class="font-sora font-bold text-xs text-slate-900 pb-2 border-b border-slate-100">
            Daftar Navigasi Soal
          </div>

          <div class="grid grid-cols-5 gap-2">
            <button
              v-for="(_, idx) in questions"
              :key="idx"
              @click="currentIndex = idx"
              class="w-10 h-10 rounded-xl font-sora font-bold text-xs flex items-center justify-center border transition-all"
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

          <!-- Legend -->
          <div class="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded bg-blue-600"></span>
              <span>Sudah Dijawab ({{ answeredCount }})</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded bg-amber-100 border border-amber-300"></span>
              <span>Ragu-ragu ({{ raguCount }})</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded bg-slate-100 border border-slate-200"></span>
              <span>Belum Dijawab ({{ questions.length - answeredCount }})</span>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100">
            <button
              @click="showFinishModal = true"
              class="w-full py-2 bg-slate-900 hover:bg-black text-white font-sora font-semibold text-xs rounded-xl transition-colors"
            >
              Selesai & Kumpulkan
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- VIEW 3: SEBELUM MULAI (START INSTRUCTIONS) -->
    <div v-else class="space-y-6 animate-fadeIn">
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs max-w-2xl mx-auto space-y-5">
        <div class="text-center space-y-2">
          <div class="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-[#1E3A8A] flex items-center justify-center mx-auto">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="font-sora font-bold text-xl text-slate-900">
            Petunjuk Simulasi Ujian CBT Online
          </h3>
          <p class="text-xs text-slate-500 max-w-md mx-auto">
            Ujian ini menguji kemampuan akademik dasar untuk penentuan peringkat dan kelulusan program studi pilihan.
          </p>
        </div>

        <div class="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2 text-xs text-slate-700">
          <div class="flex justify-between pb-1.5 border-b border-slate-200">
            <span class="text-slate-500">Jumlah Soal:</span>
            <strong>5 Butir Soal Pilihan Ganda</strong>
          </div>
          <div class="flex justify-between pb-1.5 border-b border-slate-200">
            <span class="text-slate-500">Alokasi Waktu:</span>
            <strong>15 Menit</strong>
          </div>
          <div class="flex justify-between pb-1.5 border-b border-slate-200">
            <span class="text-slate-500">Passing Grade Kelulusan:</span>
            <strong class="text-emerald-700">Minimal Skor 70</strong>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Materi Uji:</span>
            <span>Matematika Terapan, Sains/Farmasi, Bahasa Inggris, Logika</span>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-center">
          <button
            @click="startExam"
            class="px-8 py-3 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Mulai Ujian CBT Sekarang</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Konfirmasi Selesai Ujian -->
    <div
      v-if="showFinishModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
    >
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center">
        <div class="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h3 class="font-sora font-bold text-slate-900 text-base">
          Konfirmasi Pengumpulan Lembar Jawaban
        </h3>

        <p class="text-xs text-slate-600 leading-relaxed">
          Anda telah menjawab <strong>{{ answeredCount }} dari {{ questions.length }} soal</strong>. Apakah Anda yakin ingin mengakhiri sesi ujian CBT sekarang?
        </p>

        <div class="flex items-center justify-center gap-3 pt-2">
          <button
            @click="showFinishModal = false"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
          >
            Kembali Memeriksa
          </button>
          <button
            @click="finishExam"
            class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sora font-bold text-xs rounded-xl transition-all shadow-xs"
          >
            Ya, Kumpulkan Jawaban
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { useApplicantStore } from '@/stores/applicant';

defineEmits(['switch-tab']);

const applicantStore = useApplicantStore();
const examState = computed(() => applicantStore.state.exam);
const examStatus = computed(() => examState.value.status);

const isTesting = ref(false);
const currentIndex = ref(0);
const timeLeft = ref(900); // 15 minutes = 900 seconds
let timerInterval = null;
const showFinishModal = ref(false);

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
};

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>
