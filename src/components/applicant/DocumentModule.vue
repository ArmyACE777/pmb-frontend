<template>
  <div class="space-y-6">
    <!-- Header Modul -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-lg text-slate-900">
          Dokumen & Berkas Persyaratan Pendaftaran
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Unggah pindaian (scan) berkas asli dalam format PDF atau JPG/PNG maksimal 2 MB per berkas.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <span class="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold font-sora">
          {{ verifiedCount }} dari {{ documents.length }} Dokumen Sah
        </span>
      </div>
    </div>

    <!-- Alert Feedback -->
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

    <!-- Panduan Unggah Berkas Banner -->
    <div class="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-5 text-xs">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-[#1E3A8A] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="space-y-1">
          <h4 class="font-sora font-bold text-slate-900 text-xs sm:text-sm">
            Panduan Validasi Berkas PMB Universitas BTH
          </h4>
          <p class="text-slate-700 leading-relaxed">
            Pastikan seluruh teks dan angka pada berkas terbaca dengan jelas (tidak buram/terpotong). Tim panitia PMB memverifikasi berkas dalam 1x24 jam kerja setelah diunggah.
          </p>
        </div>
      </div>
    </div>

    <!-- Hidden native file input -->
    <input
      ref="fileInputRef"
      type="file"
      class="hidden"
      accept=".pdf,.jpg,.jpeg,.png"
      @change="handleFileUpload"
    />

    <!-- Daftar Dokumen List -->
    <div class="space-y-4">
      <div
        v-for="doc in documents"
        :key="doc.id"
        class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div class="flex items-start gap-3.5">
          <!-- Icon Dokumen -->
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            :class="doc.status === 'verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="font-sora font-bold text-slate-900 text-sm">
                {{ doc.title }}
              </h3>
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                {{ doc.category }}
              </span>
              <span v-if="doc.required" class="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                Wajib
              </span>
            </div>

            <div class="text-xs text-slate-500 font-sans flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>File: <strong class="text-slate-700 font-mono text-[11px]">{{ doc.filename }}</strong></span>
              <span>•</span>
              <span>Ukuran: {{ doc.filesize }}</span>
              <span>•</span>
              <span>Diunggah: {{ doc.uploadDate }}</span>
            </div>

            <div class="text-[11px] text-slate-600 pt-1">
              <span class="font-medium text-slate-500">Catatan Verifikator:</span> {{ doc.notes }}
            </div>
          </div>
        </div>

        <!-- Right Side: Status Badge & Actions -->
        <div class="flex flex-row md:flex-col lg:flex-row items-center justify-between md:items-end lg:items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
          <!-- Status Pill -->
          <div>
            <span
              v-if="doc.status === 'verified'"
              class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold font-sora"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ doc.statusLabel }}</span>
            </span>
            <span
              v-else
              class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold font-sora"
            >
              <svg class="w-3.5 h-3.5 animate-spin text-amber-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>{{ doc.statusLabel }}</span>
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2">
            <button
              @click="previewDoc(doc)"
              class="px-3 py-1.5 border border-slate-200 hover:border-[#1E3A8A] text-slate-700 hover:text-[#1E3A8A] text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Lihat</span>
            </button>

            <button
              @click="triggerUpload(doc.id)"
              class="px-3 py-1.5 bg-slate-100 hover:bg-[#1E3A8A] hover:text-white text-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Ganti File</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Pratinjau Dokumen -->
    <div
      v-if="selectedPreviewDoc"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
    >
      <div class="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
              Pratinjau Dokumen Resmi PMB
            </h3>
            <p class="text-xs text-slate-500 font-mono">{{ selectedPreviewDoc.filename }}</p>
          </div>
          <button
            @click="selectedPreviewDoc = null"
            class="text-slate-400 hover:text-slate-700 text-2xl font-bold leading-none p-1"
          >
            &times;
          </button>
        </div>

        <!-- Document Preview Canvas Box -->
        <div class="bg-slate-100 border border-slate-200 rounded-2xl p-6 text-center space-y-4 my-2 relative overflow-hidden">
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none">
            <span class="text-6xl font-sora font-black text-slate-900 transform -rotate-12">
              UNIVERSITAS BTH
            </span>
          </div>

          <div class="w-16 h-16 rounded-2xl bg-white border border-slate-200 mx-auto flex items-center justify-center shadow-xs text-[#1E3A8A]">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          <div class="space-y-1">
            <div class="font-sora font-bold text-slate-800 text-sm">
              {{ selectedPreviewDoc.title }}
            </div>
            <div class="text-xs text-slate-500 font-sans">
              Status Verifikasi: <strong class="text-emerald-700">{{ selectedPreviewDoc.statusLabel }}</strong>
            </div>
          </div>

          <div class="p-3 bg-white/80 rounded-xl border border-slate-200/80 text-xs text-slate-600 text-left max-w-md mx-auto">
            <div class="font-semibold text-slate-700 mb-1">Catatan Tim PMB:</div>
            <div>{{ selectedPreviewDoc.notes }}</div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
          <button
            @click="selectedPreviewDoc = null"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
          >
            Tutup Pratinjau
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useApplicantStore } from '@/stores/applicant';

const applicantStore = useApplicantStore();
const documents = computed(() => applicantStore.state.documents);

const verifiedCount = computed(() => {
  return documents.value.filter((d) => d.status === 'verified').length;
});

const fileInputRef = ref(null);
const activeDocIdToUpload = ref(null);
const toastMessage = ref('');
const selectedPreviewDoc = ref(null);

const triggerUpload = (docId) => {
  activeDocIdToUpload.value = docId;
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
    fileInputRef.value.click();
  }
};

const handleFileUpload = (e) => {
  const file = e.target.files?.[0];
  if (!file || !activeDocIdToUpload.value) return;

  const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
  const formattedSize = sizeMb > 0.1 ? `${sizeMb} MB` : `${Math.round(file.size / 1024)} KB`;

  applicantStore.uploadDocument(activeDocIdToUpload.value, {
    name: file.name,
    size: formattedSize,
  });

  toastMessage.value = `Berkas "${file.name}" berhasil diunggah dan sedang dalam antrean verifikasi tim PMB.`;
  activeDocIdToUpload.value = null;
};

const previewDoc = (doc) => {
  selectedPreviewDoc.value = doc;
};
</script>
