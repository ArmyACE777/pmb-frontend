<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-fadeIn"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="flex-shrink-0 px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-blue-50 text-[#1E3A8A] flex items-center justify-center">
              <Camera class="w-4 h-4" />
            </div>
            <div>
              <h3 class="font-sora font-bold text-slate-900 text-sm leading-tight">Pindai e-KTP</h3>
              <p class="text-[11px] text-slate-500 font-sans">Gunakan kamera atau unggah foto KTP</p>
            </div>
          </div>
          <button
            type="button"
            @click="closeModal"
            class="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 text-xl font-bold flex items-center justify-center transition-colors cursor-pointer"
          >
            &times;
          </button>
        </div>

        <!-- Modal Body -->
        <div class="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">
          <!-- Mode Selector Tabs -->
          <div v-if="ocrState === 'idle' || ocrState === 'retake_required'" class="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              @click="switchOcrInputMode('camera')"
              :class="ocrInputMode === 'camera' ? 'bg-white text-[#1E3A8A] shadow-xs' : 'text-slate-600 hover:text-slate-900'"
              class="flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Camera class="w-3.5 h-3.5" />
              <span>Kamera</span>
            </button>
            <button
              type="button"
              @click="switchOcrInputMode('upload')"
              :class="ocrInputMode === 'upload' ? 'bg-white text-[#1E3A8A] shadow-xs' : 'text-slate-600 hover:text-slate-900'"
              class="flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UploadCloud class="w-3.5 h-3.5" />
              <span>Unggah Foto</span>
            </button>
          </div>

          <input
            ref="ocrFileInputRef"
            type="file"
            class="hidden"
            accept=".jpg,.jpeg,.png,.pdf"
            @change="handleOcrFileSelected"
          />

          <!-- State 1: IDLE -->
          <div v-if="ocrState === 'idle'" class="space-y-3">
            <!-- TAB 1: Live Camera -->
            <div v-if="ocrInputMode === 'camera'" class="space-y-3">
              <div
                v-if="cameraPermissionDenied"
                class="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 space-y-2"
              >
                <div class="flex items-center gap-2 font-bold text-amber-900">
                  <AlertTriangle class="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Izin Akses Kamera Diperlukan</span>
                </div>
                <p class="leading-relaxed text-slate-700 text-[11px]">
                  Aktifkan izin kamera melalui ikon gembok di bilah URL browser, lalu coba lagi atau unggah berkas foto KTP.
                </p>
                <div class="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    @click="startCamera"
                    class="px-3.5 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white rounded-lg font-semibold cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw class="w-3.5 h-3.5" />
                    <span>Coba Aktifkan Kamera</span>
                  </button>
                  <button
                    type="button"
                    @click="switchOcrInputMode('upload')"
                    class="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer flex items-center gap-1.5"
                  >
                    <UploadCloud class="w-3.5 h-3.5 text-slate-500" />
                    <span>Gunakan Unggah Berkas</span>
                  </button>
                </div>
              </div>

              <div
                v-else-if="isCameraLoading || cameraPermissionNeeded"
                class="p-3 bg-blue-50/90 border border-blue-200/80 rounded-xl text-xs text-blue-900"
              >
                <strong class="font-semibold text-[#1E3A8A]">Perlu Izin Kamera:</strong>
                <span> Silakan pilih <strong>Izinkan (Allow)</strong> pada browser untuk mengaktifkan kamera.</span>
              </div>

              <div
                v-else-if="isCameraActive"
                class="px-3 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center justify-between gap-2 text-[11px] text-emerald-800"
              >
                <span class="font-medium">Kamera Aktif: Posisikan kartu ke bingkai</span>
                <div class="flex items-center gap-2">
                  <select
                    v-if="availableCameras.length > 1"
                    v-model="selectedDeviceId"
                    @change="startCamera"
                    class="bg-white border border-emerald-300 text-emerald-900 text-[10px] rounded-lg px-2 py-0.5 outline-none max-w-[140px] truncate"
                  >
                    <option v-for="(cam, idx) in availableCameras" :key="cam.deviceId || idx" :value="cam.deviceId">
                      {{ cam.label || `Kamera ${idx + 1}` }}
                    </option>
                  </select>
                  <button
                    type="button"
                    @click="switchCamera"
                    class="text-emerald-700 hover:text-emerald-950 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw class="w-3 h-3" />
                    <span>Ganti</span>
                  </button>
                </div>
              </div>

              <!-- Viewfinder -->
              <div class="relative w-full h-[240px] sm:h-[260px] bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center select-none border border-slate-800">
                <video ref="videoRef" autoplay playsinline muted class="w-full h-full object-cover"></video>

                <div
                  ref="cardGuideRef"
                  class="absolute z-10 w-[86%] sm:w-[82%] max-w-[390px] aspect-[85.6/53.98] rounded-xl border border-white/60 shadow-[0_0_0_9999px_rgba(15,23,42,0.65)] pointer-events-none flex flex-col justify-end p-2.5"
                >
                  <div class="text-center pb-1">
                    <span class="inline-block text-[10px] font-sans font-medium text-white/90 bg-slate-950/70 px-3 py-0.5 rounded-full">
                      Posisikan kartu KTP di dalam bingkai
                    </span>
                  </div>
                </div>

                <div
                  v-if="cameraError && !cameraPermissionDenied"
                  class="absolute inset-0 z-30 bg-slate-950/90 flex flex-col items-center justify-center p-4 text-center text-white space-y-2.5"
                >
                  <AlertTriangle class="w-7 h-7 text-amber-400" />
                  <p class="text-xs text-slate-300 max-w-sm">{{ cameraError }}</p>
                  <div class="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      @click="startCamera"
                      class="px-3.5 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Coba Lagi
                    </button>
                    <button
                      type="button"
                      @click="switchOcrInputMode('upload')"
                      class="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Unggah Foto
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 2: Upload File -->
            <div v-else class="space-y-3">
              <div
                @click="triggerOcrPicker"
                class="border-2 border-dashed border-slate-300 hover:border-[#1E3A8A] bg-slate-50/70 hover:bg-blue-50/40 rounded-xl p-7 text-center cursor-pointer transition-all space-y-2"
              >
                <div class="w-11 h-11 rounded-xl bg-white border border-slate-200 mx-auto flex items-center justify-center text-[#1E3A8A]">
                  <UploadCloud class="w-5 h-5" />
                </div>
                <div class="font-sora font-semibold text-slate-800 text-sm">Pilih Foto KTP</div>
                <p class="text-xs text-slate-500">Format JPG, PNG, atau PDF (maks. 5 MB)</p>
              </div>
            </div>

            <!-- Opsi Kunci API Cloud (Opsional) -->
            <div class="border-t border-slate-100 pt-2 text-right">
              <button
                type="button"
                @click="showApiKeyInput = !showApiKeyInput"
                class="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Opsi API Cloud <span v-if="geminiApiKey" class="text-emerald-600 font-medium">(Aktif)</span>
              </button>

              <div v-if="showApiKeyInput" class="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 text-left">
                <div class="text-slate-700 font-medium text-[11px]">Kunci API Google Gemini (Opsional)</div>
                <div class="flex items-center gap-2">
                  <input
                    v-model="geminiApiKeyInput"
                    type="password"
                    placeholder="Masukkan API Key (AIzaSy...)"
                    class="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#1E3A8A] font-mono"
                  />
                  <button
                    type="button"
                    @click="saveGeminiApiKey"
                    class="px-3.5 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white rounded-lg font-medium text-xs cursor-pointer"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- State 2: SCANNING -->
          <div v-else-if="ocrState === 'scanning'" class="py-8 px-4 text-center space-y-5">
            <div class="relative w-14 h-14 mx-auto">
              <div class="absolute inset-0 rounded-full border-3 border-blue-100 border-t-[#1E3A8A] animate-spin"></div>
              <div class="absolute inset-2 rounded-full bg-blue-50 flex items-center justify-center text-[#1E3A8A]">
                <ScanLine class="w-5 h-5" />
              </div>
            </div>
            <div class="space-y-2 max-w-sm mx-auto">
              <h4 class="font-sora font-bold text-slate-800 text-sm">Memproses Dokumen...</h4>
              <div class="flex items-center justify-between text-[11px] font-semibold text-[#1E3A8A]">
                <span>{{ ocrPipelineStepText }}</span>
                <span>{{ ocrProgressPercent }}%</span>
              </div>
              <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div class="bg-blue-600 h-full transition-all duration-300 rounded-full" :style="{ width: `${ocrProgressPercent}%` }"></div>
              </div>
            </div>
          </div>

          <!-- State 3: COMPLETED -->
          <div v-else-if="ocrState === 'completed' && ocrData" class="space-y-3">
            <div class="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center gap-2.5 text-xs">
              <CheckCircle2 class="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div>
                <div class="font-semibold text-slate-800">Data KTP Berhasil Dibaca</div>
                <div class="text-[11px] text-slate-500">Periksa kesesuaian data sebelum diterapkan ke formulir</div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div v-if="capturedKtpPreviewUrl" class="sm:col-span-1 bg-slate-900 rounded-xl p-2 flex items-center justify-center border border-slate-200 overflow-hidden">
                <img :src="capturedKtpPreviewUrl" alt="Foto KTP" class="w-full max-h-32 object-contain rounded-lg" />
              </div>

              <div :class="capturedKtpPreviewUrl ? 'sm:col-span-2' : 'sm:col-span-3'" class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-lg sm:col-span-2">
                  <span class="text-[10px] font-semibold text-slate-500 uppercase block">NIK</span>
                  <div class="font-mono font-bold text-slate-900 text-sm">{{ ocrData.fields?.nik?.value || '-' }}</div>
                </div>
                <div class="p-2.5 bg-white border border-slate-200 rounded-lg sm:col-span-2">
                  <span class="text-[10px] font-semibold text-slate-500 uppercase block">Nama Lengkap</span>
                  <div class="font-semibold text-slate-900 text-xs">{{ ocrData.fields?.nama?.value || '-' }}</div>
                </div>
                <div class="p-2.5 bg-white border border-slate-200 rounded-lg">
                  <span class="text-[10px] font-semibold text-slate-500 uppercase block">Tempat, Tgl Lahir</span>
                  <div class="font-medium text-slate-800 text-[11px]">{{ [ocrData.fields?.tempat_lahir?.value, ocrData.fields?.tanggal_lahir?.value].filter(Boolean).join(', ') || '-' }}</div>
                </div>
                <div class="p-2.5 bg-white border border-slate-200 rounded-lg">
                  <span class="text-[10px] font-semibold text-slate-500 uppercase block">Jenis Kelamin</span>
                  <div class="font-medium text-slate-800 text-[11px]">{{ ocrData.fields?.jenis_kelamin?.value || '-' }}</div>
                </div>
                <div class="sm:col-span-2 p-2.5 bg-white border border-slate-200 rounded-lg">
                  <span class="text-[10px] font-semibold text-slate-500 uppercase block">Alamat Lengkap</span>
                  <div class="text-slate-800 text-[11px]">{{ formatOcrAddress(ocrData.fields) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- State 4: RETAKE REQUIRED -->
          <div v-else-if="ocrState === 'retake_required'" class="space-y-3 py-4 text-center">
            <AlertTriangle class="w-8 h-8 text-amber-600 mx-auto" />
            <div class="space-y-1 max-w-md mx-auto">
              <h4 class="font-sora font-bold text-slate-900 text-sm">Data KTP Tidak Terbaca</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                {{ ocrRejectionMessage || 'Pastikan foto KTP tidak buram dan seluruh bagian kartu berada di dalam bingkai.' }}
              </p>
            </div>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
              <button
                type="button"
                @click="switchOcrInputMode('camera')"
                class="w-full sm:w-auto rounded-lg px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold cursor-pointer"
              >
                Pindai Ulang via Kamera
              </button>
              <button
                type="button"
                @click="switchOcrInputMode('upload')"
                class="w-full sm:w-auto rounded-lg px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Unggah Foto Lain
              </button>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div
          v-if="ocrState === 'idle' && ocrInputMode === 'camera'"
          class="flex-shrink-0 px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3"
        >
          <span class="text-[11px] text-slate-500 hidden sm:inline">Pegang kartu stabil tanpa kilap lampu.</span>
          <button
            type="button"
            @click="captureFromCamera"
            :disabled="!isCameraActive"
            class="w-full sm:w-auto px-5 py-2 bg-[#1E3A8A] hover:bg-[#172554] disabled:opacity-40 text-white rounded-lg font-sora font-semibold text-xs cursor-pointer"
          >
            Ambil Foto
          </button>
        </div>

        <div
          v-else-if="ocrState === 'completed'"
          class="flex-shrink-0 px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2"
        >
          <button
            type="button"
            @click="resetOcrModal"
            class="rounded-lg px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
          >
            Pindai Ulang
          </button>
          <button
            type="button"
            @click="emitApply"
            class="rounded-lg px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-sora font-semibold cursor-pointer"
          >
            Terapkan ke Formulir
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { Camera, ScanLine, UploadCloud, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-vue-next';
import { ref, watch, onBeforeUnmount, nextTick } from 'vue';
import axios from 'axios';
import { createWorker } from 'tesseract.js';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'apply']);

const ocrInputMode = ref('camera');
const ocrState = ref('idle');
const ocrProgressPercent = ref(0);
const ocrPipelineStepText = ref('');
const ocrData = ref(null);
const ocrRejectionMessage = ref('');
const ocrFileInputRef = ref(null);
const currentOcrFile = ref(null);
const capturedKtpPreviewUrl = ref('');

const geminiApiKey = ref(
  localStorage.getItem('pmb_gemini_api_key') ||
  (import.meta.env.VITE_GEMINI_API_KEY ? String(import.meta.env.VITE_GEMINI_API_KEY).trim() : '') ||
  ''
);
const geminiApiKeyInput = ref(geminiApiKey.value);
const showApiKeyInput = ref(false);

const saveGeminiApiKey = () => {
  const trimmed = geminiApiKeyInput.value.trim();
  geminiApiKey.value = trimmed;
  if (trimmed) {
    localStorage.setItem('pmb_gemini_api_key', trimmed);
  } else {
    localStorage.removeItem('pmb_gemini_api_key');
  }
  showApiKeyInput.value = false;
};

const videoRef = ref(null);
const cardGuideRef = ref(null);
const cameraStream = ref(null);
const isCameraActive = ref(false);
const isCameraLoading = ref(false);
const cameraPermissionNeeded = ref(false);
const cameraPermissionDenied = ref(false);
const cameraError = ref('');
const currentFacingMode = ref('user');
const availableCameras = ref([]);
const selectedDeviceId = ref('');

const loadAvailableCameras = async () => {
  if (!navigator?.mediaDevices?.enumerateDevices) return [];
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter((d) => d.kind === 'videoinput');
    availableCameras.value = videoInputs;
    if (videoInputs.length > 0 && !selectedDeviceId.value) {
      const physicalCam = videoInputs.find((cam) => !/virtual|obs|screen|dummy|vmix|split/i.test(cam.label || ''));
      selectedDeviceId.value = physicalCam ? physicalCam.deviceId : videoInputs[0].deviceId;
    }
    return videoInputs;
  } catch {
    return [];
  }
};

const stopCamera = () => {
  if (cameraStream.value) {
    cameraStream.value.getTracks().forEach((track) => track.stop());
    cameraStream.value = null;
  }
  if (videoRef.value) {
    videoRef.value.srcObject = null;
  }
  isCameraActive.value = false;
};

const startCamera = async () => {
  stopCamera();
  cameraError.value = '';
  cameraPermissionDenied.value = false;
  isCameraLoading.value = true;
  cameraPermissionNeeded.value = true;

  try {
    if (!navigator?.mediaDevices?.getUserMedia) {
      throw new Error('Fitur kamera tidak didukung di peramban ini.');
    }

    let stream = null;
    if (selectedDeviceId.value) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedDeviceId.value }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
      } catch {}
    }
    if (!stream) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: currentFacingMode.value }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
      } catch {}
    }
    if (!stream) {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    }

    cameraStream.value = stream;
    cameraPermissionNeeded.value = false;
    await loadAvailableCameras();

    const videoTrack = stream.getVideoTracks()?.[0];
    const settings = videoTrack?.getSettings?.();
    if (settings?.deviceId) selectedDeviceId.value = settings.deviceId;

    await nextTick();
    if (videoRef.value) {
      videoRef.value.srcObject = stream;
      videoRef.value.setAttribute('playsinline', 'true');
      videoRef.value.setAttribute('autoplay', 'true');
      videoRef.value.muted = true;
      await new Promise((resolve) => {
        let done = false;
        videoRef.value.onloadedmetadata = async () => {
          if (!done) {
            done = true;
            try { await videoRef.value.play(); } catch {}
            resolve();
          }
        };
        setTimeout(async () => {
          if (!done) {
            done = true;
            try { await videoRef.value?.play(); } catch {}
            resolve();
          }
        }, 500);
      });
    }
    isCameraActive.value = true;
  } catch (err) {
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      cameraPermissionDenied.value = true;
    } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      cameraError.value = 'Perangkat webcam tidak terdeteksi. Gunakan opsi Unggah Foto KTP.';
    } else {
      cameraError.value = `Gagal membuka kamera: ${err.message || 'Perangkat tidak tersedia.'}`;
    }
    isCameraActive.value = false;
  } finally {
    isCameraLoading.value = false;
    cameraPermissionNeeded.value = false;
  }
};

const switchCamera = async () => {
  if (availableCameras.value.length > 1) {
    const idx = availableCameras.value.findIndex((c) => c.deviceId === selectedDeviceId.value);
    selectedDeviceId.value = availableCameras.value[(idx + 1) % availableCameras.value.length].deviceId;
  } else {
    currentFacingMode.value = currentFacingMode.value === 'environment' ? 'user' : 'environment';
  }
  await startCamera();
};

const switchOcrInputMode = async (mode) => {
  ocrInputMode.value = mode;
  ocrState.value = 'idle';
  ocrRejectionMessage.value = '';
  if (mode === 'camera') {
    await nextTick();
    await loadAvailableCameras();
    await startCamera();
  } else {
    stopCamera();
  }
};

const closeModal = () => {
  stopCamera();
  isCameraLoading.value = false;
  cameraPermissionNeeded.value = false;
  cameraPermissionDenied.value = false;
  emit('update:modelValue', false);
};

const resetOcrModal = async () => {
  ocrState.value = 'idle';
  ocrProgressPercent.value = 0;
  ocrData.value = null;
  ocrRejectionMessage.value = '';
  if (ocrInputMode.value === 'camera') {
    await nextTick();
    await startCamera();
  }
};

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen) {
      ocrState.value = 'idle';
      ocrProgressPercent.value = 0;
      ocrData.value = null;
      ocrRejectionMessage.value = '';
      capturedKtpPreviewUrl.value = '';
      cameraPermissionDenied.value = false;
      cameraPermissionNeeded.value = false;
      cameraError.value = '';
      ocrInputMode.value = 'camera';
      await nextTick();
      await loadAvailableCameras();
      await startCamera();
    } else {
      stopCamera();
    }
  }
);

onBeforeUnmount(() => stopCamera());

const captureFromCamera = async () => {
  if (!videoRef.value || !cardGuideRef.value) return;
  const video = videoRef.value;
  const cardGuide = cardGuideRef.value;

  const vWidth = video.videoWidth || 1280;
  const vHeight = video.videoHeight || 720;
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = vWidth;
  tempCanvas.height = vHeight;
  tempCanvas.getContext('2d').drawImage(video, 0, 0, vWidth, vHeight);

  const videoRect = video.getBoundingClientRect();
  const guideRect = cardGuide.getBoundingClientRect();
  const videoRatio = vWidth / vHeight;
  const elemRatio = videoRect.width / videoRect.height;

  let renderWidth, renderHeight, offsetX, offsetY;
  if (elemRatio > videoRatio) {
    renderWidth = videoRect.width;
    renderHeight = videoRect.width / videoRatio;
    offsetX = 0;
    offsetY = (videoRect.height - renderHeight) / 2;
  } else {
    renderHeight = videoRect.height;
    renderWidth = videoRect.height * videoRatio;
    offsetX = (videoRect.width - renderWidth) / 2;
    offsetY = 0;
  }

  const scaleX = vWidth / renderWidth;
  const scaleY = vHeight / renderHeight;
  const cropX = Math.max(0, (guideRect.left - videoRect.left - offsetX) * scaleX);
  const cropY = Math.max(0, (guideRect.top - videoRect.top - offsetY) * scaleY);
  const cropW = Math.min(vWidth - cropX, guideRect.width * scaleX);
  const cropH = Math.min(vHeight - cropY, guideRect.height * scaleY);

  const cropCanvas = document.createElement('canvas');
  cropCanvas.width = cropW;
  cropCanvas.height = cropH;
  cropCanvas.getContext('2d').drawImage(tempCanvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

  stopCamera();

  cropCanvas.toBlob(async (blob) => {
    if (!blob) return;
    const file = new File([blob], `ktp_cam_${Date.now()}.jpg`, { type: 'image/jpeg' });
    currentOcrFile.value = file;
    capturedKtpPreviewUrl.value = URL.createObjectURL(blob);
    await runOcrPipeline(file, cropCanvas);
  }, 'image/jpeg', 0.95);
};

const triggerOcrPicker = () => {
  if (ocrFileInputRef.value) {
    ocrFileInputRef.value.value = '';
    ocrFileInputRef.value.click();
  }
};

const handleOcrFileSelected = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    ocrRejectionMessage.value = 'Ukuran berkas KTP melebihi batas maksimal 5 MB.';
    ocrState.value = 'retake_required';
    return;
  }
  currentOcrFile.value = file;
  capturedKtpPreviewUrl.value = URL.createObjectURL(file);
  await runOcrPipeline(file);
};

const formatOcrAddress = (fields) => {
  if (!fields) return '-';
  const parts = [];
  if (fields.alamat?.value) parts.push(fields.alamat.value);
  if (fields.rt_rw?.value) parts.push(`RT/RW: ${fields.rt_rw.value}`);
  if (fields.kel_desa?.value) parts.push(`Kel: ${fields.kel_desa.value}`);
  if (fields.kecamatan?.value) parts.push(`Kec: ${fields.kecamatan.value}`);
  return parts.join(', ') || '-';
};

const preprocessKtpCanvas = (sourceCanvas) => {
  const c = document.createElement('canvas');
  c.width = sourceCanvas.width;
  c.height = sourceCanvas.height;
  const ctx = c.getContext('2d');
  ctx.drawImage(sourceCanvas, 0, 0);

  try {
    const imgData = ctx.getImageData(0, 0, c.width, c.height);
    const d = imgData.data;
    const totalPixels = d.length / 4;
    const histogram = new Array(256).fill(0);
    const grays = new Uint8Array(totalPixels);

    for (let i = 0, j = 0; i < d.length; i += 4, j++) {
      const g = Math.round(0.35 * d[i] + 0.55 * d[i + 1] + 0.1 * d[i + 2]);
      grays[j] = g;
      histogram[g]++;
    }

    let accum = 0;
    let pLow = 40;
    let pHigh = 220;
    const lowTarget = totalPixels * 0.05;
    const highTarget = totalPixels * 0.95;

    for (let t = 0; t < 256; t++) {
      accum += histogram[t];
      if (accum >= lowTarget && pLow === 40) pLow = t;
      if (accum >= highTarget) {
        pHigh = t;
        break;
      }
    }

    const range = Math.max(30, pHigh - pLow);
    for (let i = 0, j = 0; i < d.length; i += 4, j++) {
      const norm = Math.max(0, Math.min(1, (grays[j] - pLow) / range));
      const finalVal = Math.round(norm * norm * (3 - 2 * norm) * 255);
      d[i] = finalVal;
      d[i + 1] = finalVal;
      d[i + 2] = finalVal;
    }
    ctx.putImageData(imgData, 0, 0);
  } catch {}

  return c;
};

const DIGIT_REPLACEMENTS = {
  O: '0', o: '0', D: '0', Q: '0',
  I: '1', l: '1', '|': '1', i: '1', '!': '1', ']': '1', '[': '1',
  Z: '2', z: '2', A: '4', S: '5', s: '5', G: '6', b: '6', T: '7', B: '8', q: '9', g: '9',
};

const sanitizeDigitString = (raw) => {
  if (!raw) return '';
  let cleaned = '';
  for (const ch of raw) {
    if (/\d/.test(ch)) cleaned += ch;
    else if (DIGIT_REPLACEMENTS[ch]) cleaned += DIGIT_REPLACEMENTS[ch];
  }
  return cleaned;
};

const parseNikMetadata = (nik) => {
  if (typeof nik !== 'string' || nik.length !== 16 || !/^\d{16}$/.test(nik)) {
    return { isValid: false, birthDate: null, gender: null };
  }
  const dayVal = parseInt(nik.slice(6, 8), 10);
  const monthVal = parseInt(nik.slice(8, 10), 10);
  const year2d = parseInt(nik.slice(10, 12), 10);
  if (monthVal < 1 || monthVal > 12) return { isValid: false, birthDate: null, gender: null };

  let gender = 'Laki-laki';
  let birthDay = dayVal;
  if (dayVal > 40) {
    gender = 'Perempuan';
    birthDay = dayVal - 40;
  }
  if (birthDay < 1 || birthDay > 31) return { isValid: false, birthDate: null, gender: null };

  const currentYear2d = new Date().getFullYear() % 100;
  const fullYear = year2d <= currentYear2d ? 2000 + year2d : 1900 + year2d;
  const pad = (n) => String(n).padStart(2, '0');
  return { isValid: true, birthDate: `${fullYear}-${pad(monthVal)}-${pad(birthDay)}`, gender };
};

const KTP_FUZZY_PATTERNS = [
  /PR[O0o]V[I1l|!]NS[I1l|!]/i,
  /REPU[B86]L[I1l|!]K|INDON[E3]S[I1l|!]A/i,
  /KABUPAT[E3]N|K[O0]TA/i,
  /N[I1l|!][Kk]|N1K|N!K/i,
  /NAM[Aa]|NAMA/i,
  /T[E3]MPAT|LAH[I1l]R|TGL/i,
  /J[E3]N[I1l]S|K[E3]LAM[I1l]N|LAK[I1l]|P[E3]R[E3]MPUAN/i,
  /ALAMAT|ALAMA1/i,
  /K[E3]L|D[E3]SA|LURAH|K[E3]CAMAT|KEC/i,
  /AGAMA|ISLAM|KRISTEN|KATOLIK|HINDU|BUDDHA/i,
];

const validateIsAuthenticKtp = (text) => {
  const upper = text.toUpperCase();
  const keywordHits = KTP_FUZZY_PATTERNS.filter((r) => r.test(upper)).length;

  let foundNik = '';
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (/N[I1l|!][Kk]|N1K/i.test(lines[i])) {
      const san = sanitizeDigitString((lines[i] + ' ' + (lines[i + 1] || '')).replace(/[^0-9Ool|!ZzASsGBbTqg]/g, ''));
      if (san.length >= 16) {
        foundNik = san.slice(0, 16);
        break;
      }
    }
  }
  if (!foundNik) {
    const rawMatches = upper.match(/\b\d{16}\b/);
    if (rawMatches) foundNik = rawMatches[0];
  }
  if (!foundNik) {
    for (const tok of upper.split(/\s+/)) {
      const san = sanitizeDigitString(tok);
      if (san.length === 16) {
        foundNik = san;
        break;
      }
    }
  }
  if (!foundNik) {
    const allDigits = sanitizeDigitString(upper.replace(/[^0-9Ool|!ZzASsGBbTqg]/g, ''));
    if (allDigits.length >= 16) {
      for (let i = 0; i <= allDigits.length - 16; i++) {
        const sub = allDigits.slice(i, i + 16);
        const provCode = parseInt(sub.slice(0, 2), 10);
        if (provCode >= 11 && provCode <= 94) {
          foundNik = sub;
          break;
        }
      }
      if (!foundNik) foundNik = allDigits.slice(0, 16);
    }
  }

  const isAuthentic = foundNik.length === 16 || keywordHits >= 2 || (keywordHits >= 1 && upper.trim().length > 20);
  return { isAuthentic, foundNik };
};

const extractKtpFields = (text, detectedNik) => {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const fullText = lines.join(' ').toUpperCase();
  const findValueByLabel = (labelRegex) => {
    for (let i = 0; i < lines.length; i++) {
      if (labelRegex.test(lines[i])) {
        const stripped = lines[i].replace(labelRegex, '').replace(/^[:;\s.-]+/, '').trim();
        if (stripped.length >= 2 && !/^(?:tempat|tanggal|jenis|alamat|rt|rw|kel|kec|agama|status|pekerjaan|nik|gol|kewargan)/i.test(stripped)) {
          return stripped;
        }
        for (let j = i + 1; j <= Math.min(i + 2, lines.length - 1); j++) {
          const nextL = lines[j].replace(/^[:;\s.-]+/, '').trim();
          if (nextL.length >= 2 && !/^(?:tempat|tanggal|jenis|alamat|rt|rw|kel|kec|agama|status|pekerjaan|nik|gol|kewargan)/i.test(nextL)) {
            return nextL;
          }
        }
      }
    }
    return '';
  };

  const nik = detectedNik || '';
  const nikMeta = parseNikMetadata(nik);

  let nama = findValueByLabel(/(?:^|[^A-Za-z])(?:NAMA|NAME|NAM|MAMA|NANA)[\s:;.-]*/i);
  if (!nama && nik) {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(nik) || /N[I1l|!][Kk]/i.test(lines[i])) {
        for (let j = i + 1; j <= Math.min(i + 3, lines.length - 1); j++) {
          const cand = lines[j].replace(/^(?:NAMA|NAME)?[:;\s.-]*/i, '').trim();
          if (cand.length >= 3 && !/^\d+$/.test(cand) && !/tempat|lahir|provinsi|kota|kabupaten|nik|jenis|kelamin/i.test(cand)) {
            nama = cand;
            break;
          }
        }
        break;
      }
    }
  }
  nama = nama.replace(/[^A-Za-z\s'.,]/g, '').trim().toUpperCase();

  const ttlRaw = findValueByLabel(/(?:^|[^A-Za-z])(?:TEMPAT|T[E3]MPAT)[\s/.:,;*-]*(?:TGL|LAH[I1l]R)?[\s:;.-]*/i);
  let tempatLahir = '';
  let tanggalLahir = '';
  const MONTH_MAP = {
    JANUARI: '01', JAN: '01', FEBRUARI: '02', FEB: '02', MARET: '03', MAR: '03',
    APRIL: '04', APR: '04', MEI: '05', MAY: '05', JUNI: '06', JUN: '06',
    JULI: '07', JUL: '07', AGUSTUS: '08', AGU: '08', AGS: '08',
    SEPTEMBER: '09', SEP: '09', OKTOBER: '10', OKT: '10',
    NOVEMBER: '11', NOV: '11', DESEMBER: '12', DES: '12',
  };

  if (ttlRaw) {
    const dateMatch = ttlRaw.match(/(\d{1,2})[-\s/.](\d{1,2})[-\s/.](\d{4})/);
    const wordDateMatch = ttlRaw.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
    if (dateMatch) {
      tanggalLahir = `${dateMatch[3]}-${String(dateMatch[2]).padStart(2, '0')}-${String(dateMatch[1]).padStart(2, '0')}`;
      tempatLahir = ttlRaw.slice(0, dateMatch.index).replace(/[^A-Za-z\s]/g, '').trim().toUpperCase();
    } else if (wordDateMatch && MONTH_MAP[wordDateMatch[2].toUpperCase()]) {
      tanggalLahir = `${wordDateMatch[3]}-${MONTH_MAP[wordDateMatch[2].toUpperCase()]}-${String(wordDateMatch[1]).padStart(2, '0')}`;
      tempatLahir = ttlRaw.slice(0, wordDateMatch.index).replace(/[^A-Za-z\s]/g, '').trim().toUpperCase();
    } else {
      tempatLahir = ttlRaw.replace(/[^A-Za-z\s]/g, '').trim().toUpperCase();
    }
  }
  if (!tanggalLahir && nikMeta.isValid) tanggalLahir = nikMeta.birthDate;

  let jenisKelamin = '';
  if (/PEREMPUAN|WANITA|P[E3]R[E3]MPUAN/i.test(fullText)) jenisKelamin = 'Perempuan';
  else if (/LAKI[\s-]*LAKI|PRIA|LAK[I1l]/i.test(fullText)) jenisKelamin = 'Laki-laki';
  else if (nikMeta.isValid) jenisKelamin = nikMeta.gender;

  let alamat = findValueByLabel(/(?:^|[^A-Za-z])(?:ALAMAT|ALANAT|ALAMA1)[\s:;.-]*/i);
  alamat = alamat.replace(/^(?:ALAMAT|ALANAT)[:;\s.-]*/i, '').trim().toUpperCase();

  let rtrw = '';
  const rtrwMatch = fullText.match(/(?:RT[\s/.:,]*RW|R1[\s/.:,]*RW)?[\s:;.-]*(\d{1,3})\s*[/]\s*(\d{1,3})/i);
  if (rtrwMatch) rtrw = `${String(rtrwMatch[1]).padStart(3, '0')}/${String(rtrwMatch[2]).padStart(3, '0')}`;

  const kelDesa = findValueByLabel(/(?:^|[^A-Za-z])(?:KEL|K[E3]L|DESA|D[E3]SA|KELURAHAN)[\s/.:,;*-]*[\s:;.-]*/i).replace(/[^A-Za-z0-9\s]/g, '').trim().toUpperCase();
  const kecamatan = findValueByLabel(/(?:^|[^A-Za-z])(?:KECAMATAN|K[E3]CAMATAN|KEC)[\s/.:,;*-]*[\s:;.-]*/i).replace(/[^A-Za-z0-9\s]/g, '').trim().toUpperCase();

  let agama = 'Islam';
  for (const ag of ['ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDDHA', 'KONGHUCU']) {
    if (fullText.includes(ag)) {
      agama = ag.charAt(0) + ag.slice(1).toLowerCase();
      break;
    }
  }

  const provMatch = fullText.match(/PROVINSI\s+([A-Z\s]+?)(?:KOTA|KABUPATEN|NIK|$)/i);
  const kotaMatch = fullText.match(/(?:KOTA|KABUPATEN)\s+([A-Z\s]+?)(?:NIK|NAMA|$)/i);

  return {
    nik,
    nama,
    tempat_lahir: tempatLahir,
    tanggal_lahir: tanggalLahir,
    jenis_kelamin: jenisKelamin,
    alamat,
    rt_rw: rtrw,
    kel_desa: kelDesa,
    kecamatan,
    agama,
    kota: kotaMatch ? kotaMatch[1].trim() : '',
    provinsi: provMatch ? provMatch[1].trim() : '',
  };
};

const runGeminiVisionOcr = async (canvas) => {
  if (!geminiApiKey.value) return null;
  try {
    ocrProgressPercent.value = 45;
    ocrPipelineStepText.value = 'Menghubungkan ke Gemini Vision AI...';

    let c = canvas;
    if (canvas.width > 1400) {
      c = document.createElement('canvas');
      c.width = 1400;
      c.height = canvas.height * (1400 / canvas.width);
      c.getContext('2d').drawImage(canvas, 0, 0, c.width, c.height);
    }
    const base64Image = c.toDataURL('image/jpeg', 0.85).split(',')[1];
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey.value.trim()}`;
    const response = await axios.post(url, {
      contents: [{
        parts: [
          { text: 'Ekstrak e-KTP Indonesia ke JSON valid: {"is_ktp":true,"nik":"","nama":"","tempat_lahir":"","tanggal_lahir":"YYYY-MM-DD","jenis_kelamin":"Laki-laki/Perempuan","alamat":"","rt_rw":"","kel_desa":"","kecamatan":"","agama":"","kota":"","provinsi":""}. Jika bukan KTP kembalikan {"is_ktp":false}.' },
          { inline_data: { mime_type: 'image/jpeg', data: base64Image } },
        ],
      }],
      generationConfig: { response_mime_type: 'application/json', temperature: 0.1 },
    }, { headers: { 'Content-Type': 'application/json' }, timeout: 25000 });

    const txt = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const parsed = JSON.parse(txt.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim());
    if (parsed.is_ktp === false && !parsed.nik) {
      return { rejected: true, message: 'Foto tidak terdeteksi sebagai kartu e-KTP.' };
    }
    return { success: true, data: parsed };
  } catch {
    return null;
  }
};

const runOcrPipeline = async (file, sourceCanvas = null) => {
  ocrState.value = 'scanning';
  ocrProgressPercent.value = 20;
  ocrPipelineStepText.value = 'Menyiapkan gambar...';
  ocrData.value = null;
  ocrRejectionMessage.value = '';

  let rawCanvas = sourceCanvas;
  if (!rawCanvas) {
    rawCanvas = await new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const c = document.createElement('canvas');
        const scale = Math.min(2, Math.max(0.5, 1600 / img.width));
        c.width = img.width * scale;
        c.height = img.height * scale;
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Gagal memuat gambar'));
      };
      img.src = url;
    }).catch(() => null);
  }

  if (!rawCanvas) {
    ocrState.value = 'retake_required';
    ocrRejectionMessage.value = 'Gagal memproses gambar. Pastikan format file valid.';
    return;
  }

  if (geminiApiKey.value) {
    const geminiRes = await runGeminiVisionOcr(rawCanvas);
    if (geminiRes?.rejected) {
      ocrState.value = 'retake_required';
      ocrRejectionMessage.value = geminiRes.message;
      return;
    }
    if (geminiRes?.success && geminiRes.data) {
      const d = geminiRes.data;
      ocrData.value = {
        status: 'completed',
        fields: {
          nik: { value: d.nik || '' },
          nama: { value: (d.nama || '').toUpperCase() },
          tempat_lahir: { value: (d.tempat_lahir || '').toUpperCase() },
          tanggal_lahir: { value: d.tanggal_lahir || '' },
          jenis_kelamin: { value: d.jenis_kelamin || '' },
          agama: { value: d.agama || 'Islam' },
          alamat: { value: (d.alamat || '').toUpperCase() },
          rt_rw: { value: d.rt_rw || '' },
          kel_desa: { value: (d.kel_desa || '').toUpperCase() },
          kecamatan: { value: (d.kecamatan || '').toUpperCase() },
          kota: { value: (d.kota || '').toUpperCase() },
          provinsi: { value: (d.provinsi || '').toUpperCase() },
        },
      };
      ocrProgressPercent.value = 100;
      ocrState.value = 'completed';
      return;
    }
  }

  ocrProgressPercent.value = 40;
  ocrPipelineStepText.value = 'Membaca data KTP...';
  const processingCanvas = preprocessKtpCanvas(rawCanvas);

  let extractedText = '';
  let worker = null;
  try {
    try { worker = await createWorker(['ind', 'eng']); } catch { worker = await createWorker('eng'); }
    ocrProgressPercent.value = 75;
    const res1 = await worker.recognize(processingCanvas);
    extractedText = res1.data?.text || '';
    if ((extractedText.trim().length < 30 || !/\d{14,16}/.test(extractedText)) && rawCanvas !== processingCanvas) {
      const res2 = await worker.recognize(rawCanvas);
      const t2 = res2.data?.text || '';
      if (t2.length > extractedText.length || /\d{16}/.test(t2)) extractedText = `${extractedText}\n${t2}`;
    }
    await worker.terminate();
  } catch {
    if (worker) await worker.terminate().catch(() => null);
  }

  ocrProgressPercent.value = 92;
  ocrPipelineStepText.value = 'Memvalidasi data...';
  const validation = validateIsAuthenticKtp(extractedText);
  if (!validation.isAuthentic && !validation.foundNik && extractedText.trim().length < 10) {
    ocrState.value = 'retake_required';
    ocrRejectionMessage.value = 'Data KTP tidak terbaca jelas. Pastikan foto tidak buram dan pencahayaan cukup.';
    return;
  }

  const parsed = extractKtpFields(extractedText, validation.foundNik);
  ocrData.value = {
    status: 'completed',
    fields: {
      nik: { value: parsed.nik || validation.foundNik },
      nama: { value: parsed.nama },
      tempat_lahir: { value: parsed.tempat_lahir },
      tanggal_lahir: { value: parsed.tanggal_lahir },
      jenis_kelamin: { value: parsed.jenis_kelamin },
      agama: { value: parsed.agama },
      alamat: { value: parsed.alamat },
      rt_rw: { value: parsed.rt_rw },
      kel_desa: { value: parsed.kel_desa },
      kecamatan: { value: parsed.kecamatan },
      kota: { value: parsed.kota },
      provinsi: { value: parsed.provinsi },
    },
  };
  ocrProgressPercent.value = 100;
  ocrState.value = 'completed';
};

const emitApply = () => {
  if (!ocrData.value?.fields) return;
  emit('apply', {
    fields: ocrData.value.fields,
    file: currentOcrFile.value,
  });
};
</script>
