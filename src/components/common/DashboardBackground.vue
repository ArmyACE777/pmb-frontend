<template>
  <div
    class="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
    aria-hidden="true"
  >
    <!-- 1. Top Horizon Ambient Wash (Memberikan depth halus di bawah navbar) -->
    <div class="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-100/35 via-slate-50/50 to-transparent"></div>

    <!-- 2. Ambient Color Mesh Glows (Disesuaikan dengan palet warna resmi BTH) -->
    <!-- Glow Biru BTH Utama (Top-Right) -->
    <div
      class="absolute -top-[10%] -right-[8%] w-[550px] h-[550px] sm:w-[750px] sm:h-[750px] lg:w-[920px] lg:h-[920px] rounded-full bg-gradient-to-br from-blue-700/[0.085] via-[#1E3A8A]/[0.05] to-transparent blur-3xl transform-gpu"
    ></div>

    <!-- Glow Biru Azure / Sky (Bottom-Left) -->
    <div
      class="absolute -bottom-[12%] -left-[10%] w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] lg:w-[820px] lg:h-[820px] rounded-full bg-gradient-to-tr from-sky-600/[0.07] via-blue-500/[0.035] to-transparent blur-3xl transform-gpu"
    ></div>

    <!-- Glow Emerald / Mint (Center-Right: Representasi Rumpun Farmasi & Kesehatan BTH) -->
    <div
      class="absolute top-[32%] -right-[6%] w-[400px] h-[400px] sm:w-[520px] sm:h-[520px] rounded-full bg-gradient-to-l from-emerald-600/[0.045] via-teal-500/[0.02] to-transparent blur-3xl transform-gpu"
    ></div>

    <!-- 3. Aksen Geometris Lingkaran Konsentris Vektor (Modern Academic Blueprint Depth) -->
    <svg
      class="absolute -top-32 -right-32 w-[680px] h-[680px] text-blue-900/[0.04] pointer-events-none transform-gpu"
      viewBox="0 0 680 680"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="340" cy="340" r="160" stroke="currentColor" stroke-width="1" stroke-dasharray="4 6" />
      <circle cx="340" cy="340" r="240" stroke="currentColor" stroke-width="1" />
      <circle cx="340" cy="340" r="320" stroke="currentColor" stroke-width="1" stroke-dasharray="2 4" />
    </svg>

    <svg
      class="absolute -bottom-40 -left-40 w-[640px] h-[640px] text-sky-800/[0.035] pointer-events-none transform-gpu"
      viewBox="0 0 640 640"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="320" cy="320" r="180" stroke="currentColor" stroke-width="1" stroke-dasharray="3 5" />
      <circle cx="320" cy="320" r="280" stroke="currentColor" stroke-width="1" />
    </svg>

    <!-- 4. Tekstur Academic Dot Matrix (Optimal Visibility, Halus & Berkarakter) -->
    <div
      class="absolute inset-0 opacity-[0.08] transform-gpu"
      style="
        background-image: radial-gradient(#1E3A8A 1.15px, transparent 1.15px);
        background-size: 26px 26px;
        mask-image: radial-gradient(ellipse 85% 75% at 50% 40%, black 30%, transparent 85%);
        -webkit-mask-image: radial-gradient(ellipse 85% 75% at 50% 40%, black 30%, transparent 85%);
      "
    ></div>

    <!-- 5. Watermark Lambang Resmi Universitas BTH (Presisi, Terdefinisi & Elegan) -->
    <div
      v-if="showWatermark"
      class="absolute -bottom-8 -right-6 sm:bottom-4 sm:right-6 lg:bottom-8 lg:right-12 pointer-events-none select-none"
    >
      <img
        src="/assets/icons/bth-emblem.png"
        alt=""
        class="w-64 sm:w-84 lg:w-[420px] h-auto object-contain opacity-[0.055] grayscale contrast-125 filter"
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
