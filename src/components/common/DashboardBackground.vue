<template>
  <div
    class="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
    aria-hidden="true"
  >
    <!-- 1. Top Horizon Ambient Wash (Memberikan depth halus di bawah navbar & header) -->
    <div class="absolute top-0 inset-x-0 h-[480px] bg-gradient-to-b from-blue-100/45 via-slate-50/40 to-transparent"></div>

    <!-- 2. Ambient Color Mesh Glows (Palet Resmi Universitas BTH: Navy, Azure & Emerald) -->
    <!-- Glow Biru BTH Utama (Top-Right) -->
    <div
      class="absolute -top-[12%] -right-[8%] w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] lg:w-[1000px] lg:h-[1000px] rounded-full bg-gradient-to-br from-blue-700/[0.11] via-[#1E3A8A]/[0.07] to-transparent blur-3xl transform-gpu"
    ></div>

    <!-- Glow Biru Azure / Sky (Bottom-Left) -->
    <div
      class="absolute -bottom-[12%] -left-[10%] w-[520px] h-[520px] sm:w-[750px] sm:h-[750px] lg:w-[900px] lg:h-[900px] rounded-full bg-gradient-to-tr from-sky-500/[0.09] via-blue-500/[0.05] to-transparent blur-3xl transform-gpu"
    ></div>

    <!-- Glow Emerald / Mint (Center-Right: Representasi Rumpun Farmasi & Kesehatan BTH) -->
    <div
      class="absolute top-[30%] -right-[5%] w-[420px] h-[420px] sm:w-[560px] sm:h-[560px] rounded-full bg-gradient-to-l from-emerald-500/[0.06] via-teal-500/[0.03] to-transparent blur-3xl transform-gpu"
    ></div>

    <!-- Glow Indigo / Sapphire (Center-Left) -->
    <div
      class="absolute top-[60%] -left-[5%] w-[380px] h-[380px] sm:w-[480px] sm:h-[480px] rounded-full bg-gradient-to-r from-indigo-500/[0.05] via-blue-600/[0.025] to-transparent blur-3xl transform-gpu"
    ></div>

    <!-- 3. Aksen Geometris Lingkaran Konsentris Vektor (Modern Academic Blueprint Depth) -->
    <svg
      class="absolute -top-36 -right-36 w-[720px] h-[720px] text-blue-900/[0.065] pointer-events-none transform-gpu"
      viewBox="0 0 720 720"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="360" cy="360" r="160" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 6" />
      <circle cx="360" cy="360" r="260" stroke="currentColor" stroke-width="1.2" />
      <circle cx="360" cy="360" r="350" stroke="currentColor" stroke-width="1" stroke-dasharray="3 5" />
      <line x1="360" y1="40" x2="360" y2="680" stroke="currentColor" stroke-width="0.8" stroke-dasharray="2 6" />
      <line x1="40" y1="360" x2="680" y2="360" stroke="currentColor" stroke-width="0.8" stroke-dasharray="2 6" />
    </svg>

    <svg
      class="absolute -bottom-44 -left-44 w-[680px] h-[680px] text-sky-800/[0.055] pointer-events-none transform-gpu"
      viewBox="0 0 680 680"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="340" cy="340" r="180" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 5" />
      <circle cx="340" cy="340" r="300" stroke="currentColor" stroke-width="1.2" />
      <circle cx="340" cy="340" r="330" stroke="currentColor" stroke-width="0.8" stroke-dasharray="4 8" />
    </svg>

    <!-- 4. Tekstur Academic Dot Matrix (Optimal Visibility, Halus & Berkarakter) -->
    <div
      class="absolute inset-0 opacity-[0.11] transform-gpu"
      style="
        background-image: radial-gradient(#1E3A8A 1.25px, transparent 1.25px);
        background-size: 26px 26px;
        mask-image: radial-gradient(ellipse 90% 80% at 50% 40%, black 35%, transparent 88%);
        -webkit-mask-image: radial-gradient(ellipse 90% 80% at 50% 40%, black 35%, transparent 88%);
      "
    ></div>

    <!-- 5. Watermark Lambang Resmi Universitas BTH (Presisi, Terdefinisi & Elegan) -->
    <div
      v-if="showWatermark"
      class="absolute -bottom-10 -right-6 sm:bottom-4 sm:right-6 lg:bottom-6 lg:right-10 pointer-events-none select-none transition-opacity duration-300"
    >
      <img
        src="/assets/icons/bth-emblem.png"
        alt=""
        class="w-72 sm:w-96 lg:w-[460px] h-auto object-contain opacity-[0.085] sm:opacity-[0.10] grayscale contrast-125 filter"
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
