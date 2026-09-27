<template>
  <div
    class="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
    aria-hidden="true"
  >
    <!-- 1. Ambient Color Pemanis: Soft Radial Mesh Glows (Identitas Warna BTH) -->
    <!-- Glow Biru BTH (Top-Right) -->
    <div
      class="absolute -top-[12%] -right-[8%] w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] lg:w-[850px] lg:h-[850px] rounded-full bg-gradient-to-br from-blue-900/[0.045] via-blue-600/[0.025] to-transparent blur-3xl transform-gpu"
    ></div>

    <!-- Glow Biru Langit / Azure (Bottom-Left) -->
    <div
      class="absolute -bottom-[15%] -left-[10%] w-[450px] h-[450px] sm:w-[650px] sm:h-[650px] lg:w-[750px] lg:h-[750px] rounded-full bg-gradient-to-tr from-sky-600/[0.035] via-blue-400/[0.02] to-transparent blur-3xl transform-gpu"
    ></div>

    <!-- Glow Emerald / Mint Halus (Center-Right: Mewakili rumpun Farmasi & Kesehatan BTH) -->
    <div
      class="absolute top-[38%] -right-[5%] w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] rounded-full bg-gradient-to-l from-emerald-600/[0.02] to-transparent blur-3xl transform-gpu"
    ></div>

    <!-- 2. Tekstur Geometris / Academic Grid Mikro Halus (Ultra-Low Opacity) -->
    <div
      class="absolute inset-0 opacity-[0.03] transform-gpu"
      style="
        background-image: radial-gradient(#1E3A8A 1px, transparent 1px);
        background-size: 28px 28px;
        mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black 20%, transparent 80%);
        -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black 20%, transparent 80%);
      "
    ></div>

    <!-- 3. Watermark Lambang Resmi Universitas BTH (Sangat Samar & Elegan) -->
    <div
      v-if="showWatermark"
      class="absolute -bottom-10 -right-8 sm:bottom-4 sm:right-6 lg:bottom-10 lg:right-14 pointer-events-none select-none"
    >
      <img
        src="/assets/icons/bth-emblem.png"
        alt=""
        class="w-60 sm:w-80 lg:w-[380px] h-auto object-contain opacity-[0.025] grayscale contrast-125 filter"
        loading="lazy"
        decoding="async"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  showWatermark: {
    type: Boolean,
    default: true,
  },
});
</script>
