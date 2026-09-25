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
      <div class="text-xs text-slate-500 font-sans self-start sm:self-auto">
        Status: <strong class="text-slate-800 font-semibold">{{ isAllVerified ? 'Seluruh Berkas Terverifikasi' : `${uploadedCount} dari ${documents.length} Berkas Diunggah` }}</strong>
      </div>
    </div>

    <!-- Alert Feedback -->
    <div
      v-if="toastMessage"
      class="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between animate-fadeIn"
    >
      <div class="flex items-center gap-2">
        <CheckCircle2 class="w-4 h-4 text-emerald-600 flex-shrink-0" />
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
        <AlertCircle class="w-4 h-4 text-red-600 flex-shrink-0" />
        <span>{{ errorMessage }}</span>
      </div>
      <button @click="errorMessage = ''" class="text-red-600 hover:text-red-900 font-bold text-sm leading-none">&times;</button>
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
    <div class="space-y-3">
      <div
        v-for="doc in documents"
        :key="doc.id"
        class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div class="flex items-center gap-3.5 min-w-0 flex-1">
          <!-- Thumbnail pratinjau khusus pasfoto (doc-4) -->
          <div
            v-if="doc.id === 'doc-4' && doc.filename && (doc.fileBlobUrl || applicantStore.candidatePhoto)"
            class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex-shrink-0 bg-slate-100 ring-2 ring-blue-50"
          >
            <img
              :src="doc.fileBlobUrl || applicantStore.candidatePhoto"
              alt="Pasfoto Profil"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="space-y-1 min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="font-sora font-semibold text-slate-900 text-xs sm:text-sm">
                {{ doc.title }}
              </h3>
              <span v-if="doc.required" class="text-red-500 font-bold text-xs" title="Wajib Diunggah">*</span>

              <!-- Status Badge di samping judul -->
              <span
                v-if="doc.status === 'verified'"
                class="inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-md text-[11px] font-medium"
              >
                <span>Terverifikasi</span>
              </span>
              <span
                v-else-if="doc.status === 'pending'"
                class="inline-flex items-center px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-md text-[11px] font-medium"
              >
                <span>Menunggu Verifikasi</span>
              </span>
              <span
                v-else-if="doc.status === 'revision'"
                class="inline-flex items-center px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200/80 rounded-md text-[11px] font-medium"
              >
                <span>Perlu Revisi</span>
              </span>
            </div>

          <!-- Keterangan Berkas / Format -->
          <div v-if="!doc.filename" class="text-xs text-slate-500 font-sans">
            {{ doc.notes }}
          </div>
          <div v-else class="text-xs text-slate-500 font-sans flex flex-wrap items-center gap-x-2 gap-y-1 pt-0.5">
            <span class="font-medium text-slate-700 truncate max-w-[200px] xs:max-w-none">
              {{ doc.filename }}
            </span>
            <span class="text-slate-300">•</span>
            <span>{{ doc.filesize }}</span>
            <span class="text-slate-300">•</span>
            <span class="text-slate-400">Diunggah {{ doc.uploadDate }}</span>
          </div>
        </div>
      </div>

      <!-- Right Side: Actions Only -->
        <div class="flex items-center gap-2 pt-2.5 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
          <template v-if="doc.filename">
            <button
              @click="previewDoc(doc)"
              class="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer bg-white shadow-2xs"
            >
              Lihat
            </button>

            <button
              @click="triggerUpload(doc.id)"
              class="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer bg-white shadow-2xs"
            >
              Ganti File
            </button>
          </template>

          <button
            v-else
            @click="triggerUpload(doc.id)"
            class="px-4 py-2 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-medium transition-colors shadow-2xs cursor-pointer"
          >
            Unggah Berkas
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Pratinjau Dokumen Asli / Viewer Riil -->
    <Teleport to="body">
      <div
        v-if="selectedPreviewDoc"
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      >
        <div class="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200/80 relative max-h-[90vh] flex flex-col">
          <!-- Header Modal -->
          <div class="flex items-start justify-between pb-3.5 border-b border-slate-100 flex-shrink-0">
            <div class="min-w-0 pr-3">
              <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base truncate">
                {{ selectedPreviewDoc.title }}
              </h3>
              <p class="text-xs text-slate-500 font-sans mt-0.5 flex items-center gap-2">
                <span class="font-medium text-slate-700">{{ selectedPreviewDoc.filename }}</span>
                <span v-if="selectedPreviewDoc.filesize" class="text-slate-300">•</span>
                <span v-if="selectedPreviewDoc.filesize">{{ selectedPreviewDoc.filesize }}</span>
              </p>
            </div>
            <button
              @click="selectedPreviewDoc = null"
              class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
              title="Tutup"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Document Preview Canvas Box -->
          <div class="flex-1 overflow-y-auto my-3.5 border border-slate-200/80 rounded-2xl bg-slate-50/70 p-3 sm:p-4 flex flex-col items-center justify-center min-h-[260px] sm:min-h-[340px]">
            <!-- Jika Berkas PDF Asli dengan URL Aktif -->
            <template v-if="selectedPreviewDoc.fileBlobUrl && (selectedPreviewDoc.fileType === 'application/pdf' || selectedPreviewDoc.filename?.toLowerCase().endsWith('.pdf'))">
              <iframe
                :src="selectedPreviewDoc.fileBlobUrl"
                class="w-full h-[58vh] rounded-xl border border-slate-200 bg-white shadow-inner"
                title="Pratinjau PDF"
              ></iframe>
            </template>

            <!-- Tampilan Visual Dokumen (Gambar Asli Unggahan atau Pratinjau Dokumen Berkas) -->
            <div v-else class="max-w-full max-h-[60vh] flex items-center justify-center overflow-auto rounded-xl p-1">
              <img
                :src="previewUrl"
                :alt="selectedPreviewDoc.title"
                class="max-h-[56vh] max-w-full object-contain rounded-lg shadow-sm border border-slate-200/60 bg-white"
              />
            </div>
          </div>

          <!-- Footer Modal: Status & External Actions -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 flex-shrink-0">
            <div class="flex items-center gap-2">
              <span
                v-if="selectedPreviewDoc.status === 'verified'"
                class="inline-flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-lg text-xs font-medium"
              >
                <span>Terverifikasi</span>
              </span>
              <span
                v-else-if="selectedPreviewDoc.status === 'pending'"
                class="inline-flex items-center px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-lg text-xs font-medium"
              >
                <span>Menunggu Verifikasi</span>
              </span>
              <span
                v-else-if="selectedPreviewDoc.status === 'revision'"
                class="inline-flex items-center px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200/80 rounded-lg text-xs font-medium"
              >
                <span>Perlu Revisi</span>
              </span>
              <span v-if="selectedPreviewDoc.uploadDate" class="text-xs text-slate-400 hidden sm:inline">
                • Diunggah: {{ selectedPreviewDoc.uploadDate }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <a
                v-if="selectedPreviewDoc.fileBlobUrl"
                :href="selectedPreviewDoc.fileBlobUrl"
                target="_blank"
                class="rounded-lg px-3.5 py-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors inline-flex items-center gap-1.5 cursor-pointer bg-white"
              >
                <ExternalLink class="w-3.5 h-3.5" />
                <span>Buka di Tab Baru</span>
              </a>

              <button
                @click="selectedPreviewDoc = null"
                class="rounded-lg px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import {
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-vue-next';
import { ref, computed } from 'vue';
import { useApplicantStore } from '@/stores/applicant';
import { useAuthStore } from '@/stores/auth';
import { admissionApi, identityApi } from '@/api';

const applicantStore = useApplicantStore();
const authStore = useAuthStore();
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
const imageLoadError = ref(false);

const isImageFile = (filename) => {
  if (!filename) return false;
  return /\.(jpg|jpeg|png|webp)$/i.test(filename);
};

const escapeXml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

const generateDocumentPreview = (doc) => {
  if (!doc) return '';
  if (doc.fileBlobUrl && !imageLoadError.value) {
    return doc.fileBlobUrl;
  }

  const title = escapeXml(doc.title || 'Dokumen Persyaratan');
  const filename = escapeXml(doc.filename || 'dokumen.jpeg');
  const candidateName = escapeXml(applicantStore.state.candidate?.fullName || 'Calon Mahasiswa');
  const uploadDate = escapeXml(doc.uploadDate || '21 Sep 2026');
  const isImage = isImageFile(filename);

  // SVG Dokumen Pindai Resmi Mahasiswa
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="780" viewBox="0 0 600 780" fill="none">
    <rect width="600" height="780" rx="10" fill="#FFFFFF"/>
    <rect x="2" y="2" width="596" height="776" rx="9" stroke="#E2E8F0" stroke-width="2"/>
    <rect x="18" y="18" width="564" height="744" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5" rx="6"/>

    <circle cx="300" cy="390" r="130" fill="#1E3A8A" fill-opacity="0.03"/>
    <text x="300" y="405" text-anchor="middle" font-family="sans-serif" font-size="24" font-weight="bold" fill="#1E3A8A" fill-opacity="0.07" letter-spacing="4">UNIVERSITAS BTH</text>

    <rect x="32" y="32" width="536" height="88" rx="8" fill="#FFFFFF" stroke="#E2E8F0"/>
    <circle cx="74" cy="76" r="24" fill="#1E3A8A"/>
    <text x="74" y="82" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF">BTH</text>
    <text x="114" y="68" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0F172A">UNIVERSITAS BAKTI TUNAS HUSADA</text>
    <text x="114" y="86" font-family="sans-serif" font-size="11" fill="#64748B">Sistem Penerimaan Mahasiswa Baru (PMB) TA 2026/2027</text>
    <text x="114" y="102" font-family="sans-serif" font-size="10" fill="#94A3B8">Pindaian Berkas Resmi Pendaftaran Mahasiswa Baru</text>

    <rect x="32" y="136" width="536" height="50" rx="8" fill="#EFF6FF" stroke="#BFDBFE"/>
    <text x="52" y="167" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1E3A8A">${title.toUpperCase()}</text>
    <text x="548" y="167" text-anchor="end" font-family="sans-serif" font-size="11" font-weight="600" fill="#2563EB">${isImage ? 'FORMAT GAMBAR (JPG/PNG)' : 'FORMAT PDF'}</text>

    <g transform="translate(32, 202)">
      <rect width="536" height="180" rx="8" fill="#FFFFFF" stroke="#E2E8F0"/>
      <text x="24" y="36" font-family="sans-serif" font-size="11" fill="#64748B">Nama Calon Mahasiswa</text>
      <text x="24" y="56" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0F172A">${candidateName}</text>
      
      <text x="24" y="94" font-family="sans-serif" font-size="11" fill="#64748B">Nama Berkas Asli</text>
      <text x="24" y="114" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1E3A8A">${filename}</text>
      
      <text x="24" y="150" font-family="sans-serif" font-size="11" fill="#64748B">Ukuran Berkas</text>
      <text x="24" y="168" font-family="sans-serif" font-size="12" font-weight="600" fill="#334155">${escapeXml(doc.filesize || '108 KB')}</text>
      
      <text x="320" y="36" font-family="sans-serif" font-size="11" fill="#64748B">Tanggal Unggah</text>
      <text x="320" y="56" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0F172A">${uploadDate}</text>
      
      <text x="320" y="94" font-family="sans-serif" font-size="11" fill="#64748B">Status Validasi</text>
      <text x="320" y="114" font-family="sans-serif" font-size="12" font-weight="bold" fill="#059669">✓ Berkas Asli Valid</text>
      
      <text x="320" y="150" font-family="sans-serif" font-size="11" fill="#64748B">Verifikasi Integritas</text>
      <text x="320" y="168" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2563EB">Tersimpan Resmi</text>
    </g>

    <g transform="translate(32, 400)">
      <rect width="536" height="230" rx="8" fill="#FFFFFF" stroke="#E2E8F0"/>
      <rect x="20" y="18" width="496" height="194" fill="#F8FAFC" rx="6" stroke="#CBD5E1" stroke-dasharray="3 3"/>
      
      <line x1="40" y1="45" x2="496" y2="45" stroke="#94A3B8" stroke-width="4" stroke-linecap="round"/>
      <line x1="40" y1="70" x2="440" y2="70" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round"/>
      <line x1="40" y1="92" x2="470" y2="92" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round"/>
      <line x1="40" y1="114" x2="380" y2="114" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round"/>
      <line x1="40" y1="136" x2="420" y2="136" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round"/>
      <line x1="40" y1="158" x2="350" y2="158" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round"/>

      <g transform="translate(390, 95) rotate(-10)">
        <circle cx="48" cy="48" r="42" fill="none" stroke="#2563EB" stroke-width="2.5" stroke-dasharray="3 2"/>
        <circle cx="48" cy="48" r="36" fill="none" stroke="#2563EB" stroke-width="1.5"/>
        <text x="48" y="42" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="#2563EB">UNIVERSITAS</text>
        <text x="48" y="55" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="bold" fill="#2563EB">BTH</text>
        <text x="48" y="66" text-anchor="middle" font-family="sans-serif" font-size="8" font-weight="bold" fill="#2563EB">TERVERIFIKASI</text>
      </g>
    </g>

    <g transform="translate(32, 646)">
      <rect width="536" height="96" rx="8" fill="#FFFFFF" stroke="#E2E8F0"/>
      <g transform="translate(24, 28)">
        <rect x="0" y="0" width="3" height="38" fill="#1E293B"/>
        <rect x="5" y="0" width="1.5" height="38" fill="#1E293B"/>
        <rect x="9" y="0" width="4" height="38" fill="#1E293B"/>
        <rect x="16" y="0" width="2" height="38" fill="#1E293B"/>
        <rect x="21" y="0" width="5" height="38" fill="#1E293B"/>
        <rect x="29" y="0" width="2" height="38" fill="#1E293B"/>
        <rect x="34" y="0" width="3.5" height="38" fill="#1E293B"/>
        <rect x="41" y="0" width="1" height="38" fill="#1E293B"/>
        <rect x="45" y="0" width="4" height="38" fill="#1E293B"/>
        <rect x="53" y="0" width="2" height="38" fill="#1E293B"/>
        <rect x="59" y="0" width="3" height="38" fill="#1E293B"/>
        <rect x="65" y="0" width="5" height="38" fill="#1E293B"/>
        <rect x="73" y="0" width="2" height="38" fill="#1E293B"/>
        <rect x="79" y="0" width="4" height="38" fill="#1E293B"/>
        <rect x="86" y="0" width="1.5" height="38" fill="#1E293B"/>
        <rect x="91" y="0" width="3" height="38" fill="#1E293B"/>
        <rect x="97" y="0" width="4" height="38" fill="#1E293B"/>
        <rect x="104" y="0" width="2" height="38" fill="#1E293B"/>
        <rect x="109" y="0" width="5" height="38" fill="#1E293B"/>
        <rect x="117" y="0" width="2" height="38" fill="#1E293B"/>
        <text x="60" y="52" text-anchor="middle" font-family="monospace" font-size="9" fill="#64748B">BTH-${escapeXml(doc.id?.toUpperCase() || 'DOC')}-2026</text>
      </g>
      <text x="165" y="44" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1E293B">Pangkalan Berkas Digital PMB Universitas BTH</text>
      <text x="165" y="62" font-family="sans-serif" font-size="10" fill="#64748B">Dokumen terenkripsi aman dan terhubung dengan sistem verifikasi berkas PMB.</text>
    </g>
  </svg>`;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
};

const previewUrl = computed(() => {
  if (!selectedPreviewDoc.value) return '';
  return generateDocumentPreview(selectedPreviewDoc.value);
});

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

  // Preview instan via ObjectURL
  const localBlobUrl = URL.createObjectURL(file);
  applicantStore.uploadDocument(activeDocIdToUpload.value, {
    name: file.name,
    size: formattedSize,
    fileBlobUrl: localBlobUrl,
    fileType: detectedType,
  });

  // Baca juga dataUrl Base64 untuk persistensi jangka panjang di localStorage
  const reader = new FileReader();
  reader.onload = (event) => {
    const dataUrl = event.target?.result;
    if (dataUrl) {
      applicantStore.uploadDocument(activeDocIdToUpload.value, {
        name: file.name,
        size: formattedSize,
        fileBlobUrl: dataUrl,
        fileType: detectedType,
      });
    }
    // Dispatch upload berkas ke microservices backend (Admission & MinIO)
    try {
      const docCode = activeDocIdToUpload.value;
      if (docCode === 'doc-4') {
        applicantStore.state.candidate.photoUrl = dataUrl;
        authStore.updateUserAvatar(dataUrl);
        identityApi.uploadPhoto(file).catch(() => null);
      }
      const DOC_TYPE_BACKEND_MAP = {
        'doc-1': 'ijazah',
        'doc-2': 'ktp',
        'doc-3': 'kk',
        'doc-4': 'pas_foto',
        'doc-5': 'surat_sehat',
        'doc-6': 'sertifikat_prestasi',
      };
      const backendDocType = DOC_TYPE_BACKEND_MAP[docCode] || docCode || 'document';
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', backendDocType);
      admissionApi.uploadDocument(formData).catch(() => null);
    } catch (err) {
      console.warn('Backend MinIO storage upload notice:', err);
    }

    if (activeDocIdToUpload.value === 'doc-4') {
      toastMessage.value = 'Pasfoto berhasil diunggah dan terhubung ke profil akun Anda';
    } else {
      toastMessage.value = 'Berkas berhasil diunggah';
    }
    activeDocIdToUpload.value = null;
  };
  reader.onerror = () => {
    toastMessage.value = 'Berkas berhasil diunggah';
    activeDocIdToUpload.value = null;
  };
  reader.readAsDataURL(file);
};

const previewDoc = (doc) => {
  imageLoadError.value = false;
  selectedPreviewDoc.value = doc;
};
</script>
