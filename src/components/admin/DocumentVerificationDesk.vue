<template>
  <div class="space-y-6">
    <!-- Header Meja Kerja -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900">
          Meja Verifikasi & Validasi Berkas Pendaftar
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Periksa keabsahan pindaian ijazah, identitas kependudukan, pas foto, dan surat keterangan sehat.
        </p>
      </div>
      <div class="flex items-center gap-2 self-start sm:self-auto">
        <span class="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-semibold font-sora">
          {{ pendingCount }} Berkas Membutuhkan Tindakan
        </span>
      </div>
    </div>

    <!-- Alert Toast Feedback -->
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

    <!-- Filter & Search Controls Bar -->
    <div class="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="relative flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama, No. Registrasi, NIK..."
          class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] focus:bg-white rounded-xl text-xs outline-none text-slate-800 transition-colors"
        />
        <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- Status Filter Tabs -->
      <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0 text-xs -mx-1 px-1">
        <button
          v-for="filter in filters"
          :key="filter.id"
          @click="selectedFilter = filter.id"
          class="px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer flex-shrink-0"
          :class="selectedFilter === filter.id
            ? 'bg-[#1E3A8A] text-white font-semibold'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Applicants Document Table -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-700 min-w-[720px]">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-sora uppercase text-[10px] tracking-wider">
            <tr>
              <th class="py-3.5 px-4 font-bold">No. Registrasi / NIK</th>
              <th class="py-3.5 px-4 font-bold">Nama Lengkap & Asal Sekolah</th>
              <th class="py-3.5 px-4 font-bold">Program Studi Pilihan</th>
              <th class="py-3.5 px-4 font-bold text-center">Kelengkapan</th>
              <th class="py-3.5 px-4 font-bold">Status Berkas</th>
              <th class="py-3.5 px-4 font-bold text-right">Aksi Panitia</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-sans">
            <tr
              v-for="applicant in filteredApplicants"
              :key="applicant.id"
              class="hover:bg-slate-50/80 transition-colors"
            >
              <!-- Reg & NIK -->
              <td class="py-3.5 px-4">
                <div class="font-mono font-bold text-[#1E3A8A]">{{ applicant.id }}</div>
                <div class="font-mono text-[11px] text-slate-400">NIK: {{ applicant.nik }}</div>
              </td>

              <!-- Name & School -->
              <td class="py-3.5 px-4">
                <div class="font-sora font-bold text-slate-900">{{ applicant.fullName }}</div>
                <div class="text-[11px] text-slate-500">{{ applicant.schoolName }}</div>
              </td>

              <!-- Program Studi -->
              <td class="py-3.5 px-4">
                <div class="font-medium text-slate-800">{{ applicant.prodi1 }}</div>
                <div class="text-[10px] text-slate-400">Pilihan 2: {{ applicant.prodi2 }}</div>
              </td>

              <!-- Documents Count -->
              <td class="py-3.5 px-4 text-center">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold"
                      :class="applicant.pendingDocsCount === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'">
                  {{ applicant.verifiedDocsCount }}/{{ applicant.documents.length }} Sah
                </span>
              </td>

              <!-- Status Pill -->
              <td class="py-3.5 px-4">
                <span
                  v-if="applicant.documentStatus === 'verified'"
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-semibold"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Terverifikasi</span>
                </span>
                <span
                  v-else-if="applicant.documentStatus === 'revision'"
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[11px] font-semibold"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span>Perlu Perbaikan</span>
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[11px] font-semibold"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Menunggu Verifikasi</span>
                </span>
              </td>

              <!-- Action Button -->
              <td class="py-3.5 px-4 text-right">
                <button
                  @click="openVerifyModal(applicant)"
                  class="px-3.5 py-1.5 bg-slate-100 hover:bg-[#1E3A8A] hover:text-white text-[#1E3A8A] font-sora font-semibold text-xs rounded-xl transition-all shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Periksa Berkas</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </td>
            </tr>
            <tr v-if="filteredApplicants.length === 0">
              <td colspan="6" class="py-12 text-center text-slate-400">
                <div class="max-w-xs mx-auto space-y-2">
                  <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="font-sora font-semibold text-slate-700 text-sm">Belum Ada Pendaftar</div>
                  <p class="text-xs text-slate-400">Belum ada calon mahasiswa yang mendaftar pada sistem.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Review & Verifikasi Berkas Detail -->
    <div
      v-if="activeApplicant"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
    >
      <div class="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <!-- Close Button -->
        <button
          @click="activeApplicant = null"
          class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 text-2xl font-bold leading-none cursor-pointer"
        >
          &times;
        </button>

        <!-- Candidate Header Info -->
        <div class="pb-4 border-b border-slate-200">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sora">
            Lembar Verifikasi Berkas Calon Mahasiswa
          </div>
          <div class="flex flex-wrap items-center justify-between gap-2 mt-1">
            <h3 class="font-sora font-extrabold text-xl text-slate-900">
              {{ activeApplicant.fullName }}
            </h3>
            <span class="font-mono text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
              {{ activeApplicant.id }}
            </span>
          </div>
          <div class="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Pilihan Prodi: <strong class="text-slate-800">{{ activeApplicant.prodi1 }}</strong></span>
            <span>•</span>
            <span>Asal Sekolah: {{ activeApplicant.schoolName }}</span>
            <span>•</span>
            <span>NIK: <span class="font-mono">{{ activeApplicant.nik }}</span></span>
          </div>
        </div>

        <!-- Document Checklist Review List -->
        <div class="py-5 space-y-4">
          <div
            v-for="doc in activeApplicant.documents"
            :key="doc.id"
            class="p-4 rounded-2xl border transition-all space-y-3"
            :class="{
              'bg-emerald-50/50 border-emerald-200': doc.status === 'verified',
              'bg-rose-50/50 border-rose-200': doc.status === 'revision',
              'bg-slate-50 border-slate-200/80': doc.status === 'pending'
            }"
          >
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div class="font-sora font-bold text-xs sm:text-sm text-slate-900">
                  {{ doc.title }}
                </div>
                <div class="text-[11px] text-slate-500 font-mono mt-0.5">
                  File: {{ doc.filename }}
                </div>
              </div>

              <!-- Status Tag -->
              <div>
                <span
                  class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                  :class="{
                    'bg-emerald-100 text-emerald-800': doc.status === 'verified',
                    'bg-rose-100 text-rose-800': doc.status === 'revision',
                    'bg-amber-100 text-amber-800': doc.status === 'pending'
                  }"
                >
                  {{ doc.status === 'verified' ? 'Disetujui' : doc.status === 'revision' ? 'Perlu Perbaikan' : 'Menunggu' }}
                </span>
              </div>
            </div>

            <!-- Notes from Committee -->
            <div class="text-xs text-slate-600 bg-white/80 p-2.5 rounded-xl border border-slate-200/60">
              <span class="font-semibold text-slate-700">Catatan Panitia:</span> {{ doc.notes }}
            </div>

            <!-- Action Buttons for this document -->
            <div class="flex flex-wrap items-center gap-2 pt-1">
              <button
                v-if="doc.filename && doc.filename !== 'Belum diunggah'"
                @click="inspectDoc(doc)"
                class="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1E3A8A] font-sora font-semibold text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer border border-blue-200 shadow-2xs"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>Inspeksi Berkas</span>
              </button>

              <button
                @click="setDocStatus(doc.id, 'verified', 'Dokumen terverifikasi sah dan sesuai standar BTH.')"
                class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-sora font-semibold text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Setujui</span>
              </button>

              <button
                @click="promptRevision(doc.id)"
                class="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-sora font-semibold text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Minta Perbaikan</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Master Actions -->
        <div class="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            @click="approveAllDocs"
            class="px-4 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Setujui Seluruh Berkas Peserta Ini</span>
          </button>

          <button
            @click="activeApplicant = null"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Tutup Lembar Kerja
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Inspeksi Visual Berkas Riil (Khusus Panitia Verifikator PMB) -->
    <div
      v-if="inspectingDoc"
      class="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn"
    >
      <div class="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative max-h-[92vh] flex flex-col">
        <!-- Header Inspeksi -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 flex-shrink-0">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 bg-blue-100 text-[#1E3A8A] font-sora font-bold text-[10px] rounded uppercase tracking-wider">
                Inspeksi Berkas Panitia
              </span>
              <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
                {{ inspectingDoc.title }}
              </h3>
            </div>
            <div class="text-xs text-slate-500 font-mono mt-0.5 flex flex-wrap items-center gap-2">
              <span>Peserta: <strong class="text-slate-700">{{ activeApplicant?.fullName }}</strong></span>
              <span>•</span>
              <span>No. Registrasi: <strong class="text-slate-700">{{ activeApplicant?.id }}</strong></span>
              <span>•</span>
              <span>File: {{ inspectingDoc.filename }}</span>
            </div>
          </div>
          <button
            @click="inspectingDoc = null"
            class="text-slate-400 hover:text-slate-700 text-2xl font-bold leading-none p-1 cursor-pointer transition-colors"
          >
            &times;
          </button>
        </div>

        <!-- Document Viewer Content Area -->
        <div class="flex-1 overflow-y-auto my-3 border border-slate-200 rounded-2xl bg-slate-100/70 p-2 sm:p-4 flex flex-col items-center justify-center min-h-[340px]">
          <!-- Jika Berkas Gambar Riil (Object URL) -->
          <template v-if="inspectingDoc.fileBlobUrl && (inspectingDoc.fileType?.startsWith('image/') || isImageFile(inspectingDoc.filename))">
            <div class="max-w-full max-h-[60vh] flex items-center justify-center overflow-auto rounded-xl bg-slate-900/5 p-2">
              <img
                :src="inspectingDoc.fileBlobUrl"
                :alt="inspectingDoc.title"
                class="max-h-[56vh] max-w-full object-contain rounded-lg shadow-md border border-white"
              />
            </div>
          </template>

          <!-- Jika Berkas PDF Riil (Object URL) -->
          <template v-else-if="inspectingDoc.fileBlobUrl && (inspectingDoc.fileType === 'application/pdf' || inspectingDoc.filename?.toLowerCase().endsWith('.pdf'))">
            <iframe
              :src="inspectingDoc.fileBlobUrl"
              class="w-full h-[58vh] rounded-xl border border-slate-200 bg-white shadow-inner"
              title="Inspeksi PDF Dokumen"
            ></iframe>
          </template>

          <!-- Inspeksi Standar Berkas Terverifikasi Sistem (Lembar Dokumen Universitas BTH) -->
          <div v-else class="w-full text-center space-y-4 py-8 px-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs max-w-xl mx-auto relative overflow-hidden">
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] select-none">
              <span class="text-7xl font-sora font-black text-slate-900 transform -rotate-12">
                UNIVERSITAS BTH
              </span>
            </div>

            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div class="text-left">
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sora">Dokumen Arsip PMB Digital</div>
                <div class="font-sora font-bold text-slate-800 text-sm">{{ inspectingDoc.title }}</div>
              </div>
              <span class="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold rounded-lg">
                Berkas Terdaftar
              </span>
            </div>

            <div class="py-4 space-y-2">
              <div class="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-[#1E3A8A] mx-auto flex items-center justify-center">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="font-mono text-xs text-slate-600 font-semibold">{{ inspectingDoc.filename }}</div>
              <p class="text-xs text-slate-500 max-w-md mx-auto">
                Pindaian asli telah diproses dan tervalidasi memenuhi format standar berkas PMB Universitas Bakti Tunas Husada.
              </p>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left">
              <div class="font-semibold text-slate-700 mb-1">Catatan Saat Ini:</div>
              <div class="text-slate-600">{{ inspectingDoc.notes || 'Belum ada catatan perbaikan.' }}</div>
            </div>
          </div>
        </div>

        <!-- Footer Modal Inspeksi: Aksi Langsung Panitia -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 flex-shrink-0">
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-500">Status Saat Ini:</span>
            <span
              class="px-2.5 py-0.5 rounded-md text-[11px] font-bold"
              :class="{
                'bg-emerald-100 text-emerald-800': inspectingDoc.status === 'verified',
                'bg-rose-100 text-rose-800': inspectingDoc.status === 'revision',
                'bg-amber-100 text-amber-800': inspectingDoc.status === 'pending'
              }"
            >
              {{ inspectingDoc.status === 'verified' ? 'Disetujui' : inspectingDoc.status === 'revision' ? 'Perlu Perbaikan' : 'Menunggu Verifikasi' }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="setDocStatusFromInspector('verified')"
              class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-sora font-semibold text-xs rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Setujui Berkas Ini</span>
            </button>

            <button
              @click="setDocStatusFromInspector('revision')"
              class="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-sora font-semibold text-xs rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Minta Perbaikan</span>
            </button>

            <button
              @click="inspectingDoc = null"
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
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore();
const searchQuery = ref('');
const selectedFilter = ref('all');
const activeApplicant = ref(null);
const inspectingDoc = ref(null);
const toastMessage = ref('');

const isImageFile = (filename) => {
  if (!filename) return false;
  return /\.(jpg|jpeg|png|webp)$/i.test(filename);
};

const inspectDoc = (doc) => {
  inspectingDoc.value = doc;
};

const filters = [
  { id: 'all', label: 'Semua Status' },
  { id: 'pending', label: 'Menunggu Verifikasi' },
  { id: 'verified', label: 'Terverifikasi' },
  { id: 'revision', label: 'Perlu Perbaikan' },
];

const pendingCount = computed(() => {
  return adminStore.applicants.filter((a) => a.documentStatus === 'pending' || a.documentStatus === 'revision').length;
});

const filteredApplicants = computed(() => {
  return adminStore.applicants.filter((applicant) => {
    // Filter status
    if (selectedFilter.value !== 'all' && applicant.documentStatus !== selectedFilter.value) {
      return false;
    }
    // Search query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      const matchName = applicant.fullName.toLowerCase().includes(q);
      const matchId = applicant.id.toLowerCase().includes(q);
      const matchNik = applicant.nik.includes(q);
      return matchName || matchId || matchNik;
    }
    return true;
  });
});

const openVerifyModal = (applicant) => {
  activeApplicant.value = applicant;
};

const setDocStatus = (docId, status, notes) => {
  if (!activeApplicant.value) return;
  adminStore.verifyDocument(activeApplicant.value.id, docId, status, notes);
  toastMessage.value = `Status dokumen berhasil diubah menjadi "${status === 'verified' ? 'Disetujui' : 'Perlu Perbaikan'}".`;
};

const setDocStatusFromInspector = (status) => {
  if (!inspectingDoc.value || !activeApplicant.value) return;
  if (status === 'verified') {
    setDocStatus(inspectingDoc.value.id, 'verified', 'Dokumen terverifikasi sah dan sesuai standar BTH.');
    inspectingDoc.value = null;
  } else {
    const note = prompt('Masukkan catatan perbaikan untuk calon mahasiswa:', 'Pindaian dokumen kurang jelas / buram. Mohon unggah ulang dengan resolusi lebih baik.');
    if (note !== null) {
      setDocStatus(inspectingDoc.value.id, 'revision', note || 'Mohon unggah ulang berkas.');
      inspectingDoc.value = null;
    }
  }
};

const promptRevision = (docId) => {
  const note = prompt('Masukkan catatan perbaikan untuk calon mahasiswa:', 'Pindaian dokumen kurang jelas / buram. Mohon unggah ulang dengan resolusi lebih baik.');
  if (note !== null) {
    setDocStatus(docId, 'revision', note || 'Mohon unggah ulang berkas.');
  }
};

const approveAllDocs = () => {
  if (!activeApplicant.value) return;
  activeApplicant.value.documents.forEach((doc) => {
    adminStore.verifyDocument(activeApplicant.value.id, doc.id, 'verified', 'Dokumen terverifikasi sah dan disetujui panitia.');
  });
  toastMessage.value = `Seluruh dokumen ${activeApplicant.value.fullName} berhasil diverifikasi sah.`;
};
</script>
