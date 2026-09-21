<template>
  <div class="space-y-6">
    <!-- Header Modul -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900">
          Dokumen & Berkas Persyaratan Pendaftaran
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Unggah pindaian (scan) berkas asli dalam format PDF atau JPG/PNG maksimal 2 MB per berkas.
        </p>
      </div>
      <div class="flex items-center gap-2 self-start sm:self-auto">
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-sora border transition-colors"
          :class="isAllVerified
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : hasRevision
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : isAllUploaded
                ? 'bg-blue-50 text-[#1E3A8A] border-blue-200'
                : uploadedCount > 0
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200'"
        >
          <span
            class="w-1.5 h-1.5 rounded-full"
            :class="isAllVerified
              ? 'bg-emerald-500'
              : hasRevision
                ? 'bg-rose-500'
                : isAllUploaded
                  ? 'bg-blue-500'
                  : uploadedCount > 0
                    ? 'bg-amber-500'
                    : 'bg-slate-400'"
          ></span>
          <span>
            {{ isAllVerified
              ? 'Seluruh Berkas Sah & Terverifikasi'
              : hasRevision
                ? 'Ada Berkas Perlu Perbaikan'
                : isAllUploaded
                  ? `${uploadedCount} Berkas Diunggah (Menunggu Verifikasi)`
                  : uploadedCount > 0
                    ? `${uploadedCount} dari ${documents.length} Berkas Diunggah`
                    : 'Belum Ada Berkas Diunggah' }}
          </span>
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

    <!-- Alert Error Feedback -->
    <div
      v-if="errorMessage"
      class="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center justify-between animate-fadeIn"
    >
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{{ errorMessage }}</span>
      </div>
      <button @click="errorMessage = ''" class="text-red-600 hover:text-red-900 font-bold text-sm leading-none">&times;</button>
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
        class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4"
      >
        <div class="flex items-start gap-3 sm:gap-3.5 min-w-0">
          <!-- Icon Dokumen -->
          <div
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
            :class="doc.status === 'verified'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : doc.status === 'pending'
                ? 'bg-blue-50 text-[#1E3A8A] border border-blue-200'
                : 'bg-slate-100 text-slate-400 border border-slate-200'"
          >
            <svg class="w-4.5 h-4.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          <div class="space-y-1 min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h3 class="font-sora font-bold text-slate-900 text-xs sm:text-sm">
                {{ doc.title }}
              </h3>
              <span class="text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                {{ doc.category }}
              </span>
              <span v-if="doc.required" class="text-[9px] sm:text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                Wajib
              </span>
            </div>

            <div class="text-[11px] sm:text-xs text-slate-500 font-sans flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span v-if="doc.filename" class="truncate max-w-[200px] xs:max-w-[260px] sm:max-w-none">File: <strong class="text-slate-700 font-mono text-[11px]">{{ doc.filename }}</strong></span>
              <span v-else class="text-slate-400 italic">Belum ada berkas yang diunggah</span>
              <template v-if="doc.filename">
                <span>•</span>
                <span>{{ doc.filesize }}</span>
                <span>•</span>
                <span>{{ doc.uploadDate }}</span>
              </template>
            </div>

            <div class="text-[10px] sm:text-[11px] text-slate-600 pt-0.5">
              <span class="font-medium text-slate-500">Catatan:</span> {{ doc.notes }}
            </div>
          </div>
        </div>

        <!-- Right Side: Status Badge & Actions -->
        <div class="flex flex-wrap items-center justify-between md:justify-end gap-2.5 pt-2.5 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0 w-full md:w-auto">
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
              v-else-if="doc.status === 'pending'"
              class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold font-sora"
            >
              <svg class="w-3.5 h-3.5 animate-spin text-amber-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>{{ doc.statusLabel }}</span>
            </span>
            <span
              v-else
              class="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-full text-xs font-semibold font-sora"
            >
              <span>○ {{ doc.statusLabel }}</span>
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2">
            <button
              v-if="doc.filename"
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
              class="px-3.5 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>{{ doc.filename ? 'Ganti File' : 'Unggah Berkas' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Pratinjau Dokumen Asli / Viewer Riil -->
    <div
      v-if="selectedPreviewDoc"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn"
    >
      <div class="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 relative max-h-[88vh] flex flex-col">
        <!-- Header Modal -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 flex-shrink-0">
          <div class="min-w-0 pr-2">
            <div class="flex items-center gap-2">
              <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base truncate">
                {{ selectedPreviewDoc.title }}
              </h3>
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#1E3A8A] border border-blue-200 whitespace-nowrap">
                {{ selectedPreviewDoc.category }}
              </span>
            </div>
            <p class="text-xs text-slate-500 font-mono mt-0.5 truncate">
              Berkas: {{ selectedPreviewDoc.filename }} <span v-if="selectedPreviewDoc.filesize">({{ selectedPreviewDoc.filesize }})</span>
            </p>
          </div>
          <button
            @click="selectedPreviewDoc = null"
            class="text-slate-400 hover:text-slate-700 text-2xl font-bold leading-none p-1 cursor-pointer transition-colors flex-shrink-0"
          >
            &times;
          </button>
        </div>

        <!-- Document Preview Canvas Box -->
        <div class="flex-1 overflow-y-auto my-3 border border-slate-200 rounded-2xl bg-slate-50/80 p-2 sm:p-4 flex flex-col items-center justify-center min-h-[250px] sm:min-h-[320px]">
          <!-- Tampilan Berkas Gambar (JPG/PNG) -->
          <template v-if="selectedPreviewDoc.fileBlobUrl && (selectedPreviewDoc.fileType?.startsWith('image/') || isImageFile(selectedPreviewDoc.filename))">
            <div class="max-w-full max-h-[60vh] flex items-center justify-center overflow-auto rounded-xl bg-slate-900/5 p-2">
              <img
                :src="selectedPreviewDoc.fileBlobUrl"
                :alt="selectedPreviewDoc.title"
                class="max-h-[56vh] max-w-full object-contain rounded-lg shadow-md border border-white"
              />
            </div>
          </template>

          <!-- Tampilan Berkas PDF -->
          <template v-else-if="selectedPreviewDoc.fileBlobUrl && (selectedPreviewDoc.fileType === 'application/pdf' || selectedPreviewDoc.filename?.toLowerCase().endsWith('.pdf'))">
            <iframe
              :src="selectedPreviewDoc.fileBlobUrl"
              class="w-full h-[58vh] rounded-xl border border-slate-200 bg-white shadow-inner"
              title="Pratinjau PDF"
            ></iframe>
          </template>

          <!-- Tampilan Placeholder Informatif Jika Belum Ada Blob URL -->
          <div v-else class="w-full text-center space-y-4 py-8 px-4 relative overflow-hidden">
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

            <div class="p-3 bg-white/90 rounded-xl border border-slate-200 text-xs text-slate-600 text-left max-w-md mx-auto shadow-2xs">
              <div class="font-semibold text-slate-700 mb-1">Catatan Tim PMB:</div>
              <div>{{ selectedPreviewDoc.notes }}</div>
            </div>
          </div>
        </div>

        <!-- Footer Modal: Status & External Actions -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 flex-shrink-0">
          <div class="flex items-center gap-2">
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-sora"
              :class="selectedPreviewDoc.status === 'verified'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : selectedPreviewDoc.status === 'pending'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'"
            >
              <span>{{ selectedPreviewDoc.statusLabel }}</span>
            </span>
            <span class="text-xs text-slate-500 hidden sm:inline">• Diunggah: {{ selectedPreviewDoc.uploadDate || 'Hari ini' }}</span>
          </div>

          <div class="flex items-center gap-2">
            <a
              v-if="selectedPreviewDoc.fileBlobUrl"
              :href="selectedPreviewDoc.fileBlobUrl"
              target="_blank"
              class="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1E3A8A] font-semibold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>Buka di Tab Baru</span>
            </a>

            <button
              @click="selectedPreviewDoc = null"
              class="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Tutup
            </button>
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
const documents = computed(() => applicantStore.state.documents);

const verifiedCount = computed(() => {
  return documents.value.filter((d) => d.status === 'verified').length;
});

const uploadedCount = computed(() => {
  return documents.value.filter((d) => d.status !== 'unuploaded').length;
});

const isAllVerified = computed(() => {
  return documents.value.length > 0 && documents.value.every((d) => d.status === 'verified');
});

const isAllUploaded = computed(() => {
  return documents.value.length > 0 && documents.value.every((d) => d.status !== 'unuploaded');
});

const hasRevision = computed(() => {
  return documents.value.some((d) => d.status === 'revision');
});

const fileInputRef = ref(null);
const activeDocIdToUpload = ref(null);
const toastMessage = ref('');
const errorMessage = ref('');
const selectedPreviewDoc = ref(null);

const isImageFile = (filename) => {
  if (!filename) return false;
  return /\.(jpg|jpeg|png|webp)$/i.test(filename);
};

const triggerUpload = (docId) => {
  activeDocIdToUpload.value = docId;
  errorMessage.value = '';
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
    fileInputRef.value.click();
  }
};

const handleFileUpload = (e) => {
  const file = e.target.files?.[0];
  if (!file || !activeDocIdToUpload.value) return;

  errorMessage.value = '';
  toastMessage.value = '';

  // 1. Validasi Ekstensi & MIME Format (FILE_TYPE_NOT_ALLOWED)
  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
  const ext = file.name.includes('.') ? '.' + file.name.split('.').pop().toLowerCase() : '';
  const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

  if (!allowedExtensions.includes(ext) && !allowedMimes.includes(file.type)) {
    errorMessage.value = `Format berkas "${file.name}" tidak didukung (FILE_TYPE_NOT_ALLOWED). Harap unggah berkas bertipe PDF, JPG, atau PNG.`;
    activeDocIdToUpload.value = null;
    return;
  }

  // 2. Validasi Batas Ukuran Maksimal 2 MB (FILE_TOO_LARGE)
  const MAX_BYTES = 2 * 1024 * 1024;
  if (file.size > MAX_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    errorMessage.value = `Ukuran berkas "${file.name}" (${sizeMb} MB) melebihi batas maksimal 2 MB (FILE_TOO_LARGE). Silakan perkecil resolusi atau kompres dokumen Anda.`;
    activeDocIdToUpload.value = null;
    return;
  }

  const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
  const formattedSize = sizeMb > 0.1 ? `${sizeMb} MB` : `${Math.round(file.size / 1024)} KB`;

  const detectedType = file.type || (ext === '.pdf' ? 'application/pdf' : 'image/jpeg');

  // Baca file ke Data URL Base64 agar dapat diinspeksi secara dinamis baik oleh calon mahasiswa maupun panitia di Meja Verifikasi
  const reader = new FileReader();
  reader.onload = (event) => {
    const dataUrl = event.target?.result;
    applicantStore.uploadDocument(activeDocIdToUpload.value, {
      name: file.name,
      size: formattedSize,
      fileBlobUrl: dataUrl,
      fileType: detectedType,
    });
    toastMessage.value = `Berkas "${file.name}" (${formattedSize}) berhasil diunggah. Berkas langsung terhubung secara dinamis dengan Meja Verifikasi Panitia PMB.`;
    activeDocIdToUpload.value = null;
  };
  reader.onerror = () => {
    errorMessage.value = 'Gagal membaca isi berkas. Silakan coba unggah kembali.';
    activeDocIdToUpload.value = null;
  };
  reader.readAsDataURL(file);
};

const previewDoc = (doc) => {
  selectedPreviewDoc.value = doc;
};
</script>
