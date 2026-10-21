<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
    <!-- 1. Top Bar Portal CMS Mandiri -->
    <header class="bg-slate-950/90 border-b border-slate-800 backdrop-blur sticky top-0 z-40 px-4 sm:px-6 py-3.5">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <!-- Logo & Identitas Studio CMS -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <Layers class="w-5 h-5 text-white" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="font-sora font-bold text-base sm:text-lg text-white tracking-tight">
                BTH Content Studio & CMS Hub
              </h1>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Rancangan Mandiri (Terpisah)
              </span>
            </div>
            <p class="text-xs text-slate-400">
              Workspace Khusus Tim Humas, Publikasi & Manajemen Konten Web PMB Universitas BTH
            </p>
          </div>
        </div>

        <!-- Quick Actions & Status -->
        <div class="flex items-center gap-2.5 flex-wrap">
          <div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
            <span class="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Status: <strong>Layout Blueprint (Mock State)</strong></span>
          </div>

          <!-- Tombol Switch Preview Canvas -->
          <button
            type="button"
            @click="activeTab = 'preview'"
            class="px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer border"
            :class="activeTab === 'preview' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'"
          >
            <Eye class="w-3.5 h-3.5" />
            <span>Pratinjau Visual Web</span>
          </button>

          <!-- Simulasi Publish / Ekspor -->
          <button
            type="button"
            @click="simulatePublish"
            class="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 class="w-4 h-4" />
            <span>Simpan Rancangan</span>
          </button>
        </div>
      </div>
    </header>

    <!-- 2. Banner Notifikasi Arsitektur Terpisah -->
    <div class="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-3">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs">
        <div class="flex items-center gap-2.5 text-blue-200">
          <ShieldAlert class="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            <strong>Skenario Isolasi CMS:</strong> Halaman ini dirancang mandiri tanpa terikat pada hak akses operasional Superadmin PMB. Seluruh data, teks, aset media, dan tombol telah disiapkan dengan <em>integration anchor</em> sehingga bila diputuskan dipisah ke microservice/domain tersendiri (misal: <code class="bg-blue-900/60 px-1 py-0.5 rounded text-blue-300">cms.bth.ac.id</code>), tinggal menghubungkan payload store/API saja.
          </span>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <RouterLink
            to="/admin"
            class="text-[11px] text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 font-medium"
          >
            <span>Kembali ke Admin PMB</span>
            <ExternalLink class="w-3 h-3" />
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- 3. Workspace Utama: Sidebar + Content Desk -->
    <div class="max-w-7xl mx-auto w-full flex-1 flex flex-col lg:flex-row gap-6 p-4 sm:p-6">
      <!-- SIDEBAR NAVIGASI SEKSI CMS -->
      <aside class="w-full lg:w-72 flex-shrink-0 space-y-4">
        <div class="bg-slate-950/60 rounded-2xl border border-slate-800 p-3.5 space-y-1">
          <p class="px-3 py-1.5 text-[11px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
            Modul Konten PMB
          </p>

          <button
            v-for="item in navSections"
            :key="item.id"
            type="button"
            @click="activeTab = item.id"
            class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer text-left"
            :class="activeTab === item.id ? 'bg-blue-600 text-white shadow-md shadow-blue-950 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'"
          >
            <div class="flex items-center gap-2.5">
              <component :is="item.icon" class="w-4 h-4" />
              <span>{{ item.label }}</span>
            </div>
            <span
              v-if="item.badge"
              class="text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold"
              :class="activeTab === item.id ? 'bg-blue-800 text-blue-100' : 'bg-slate-800 text-slate-400'"
            >
              {{ item.badge }}
            </span>
          </button>
        </div>

        <!-- Kartu Schema & Target Komponen Web -->
        <div class="bg-slate-950/60 rounded-2xl border border-slate-800 p-4 space-y-3 text-xs">
          <div class="flex items-center gap-2 text-slate-300 font-semibold">
            <Sparkles class="w-4 h-4 text-amber-400" />
            <span>Target Komponen Web</span>
          </div>
          <p class="text-[11px] text-slate-400 leading-relaxed">
            Konten dari CMS ini ditargetkan untuk menyuplai:
          </p>
          <ul class="space-y-1 text-[11px] text-slate-300">
            <li class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              Header, Navbar & Footer Publik
            </li>
            <li class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Dashboard Calon Mahasiswa (Step 1 - 6)
            </li>
            <li class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              Halaman Onboarding WhatsApp (/onboarding-wa)
            </li>
            <li class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Dashboard Mitra Guru BK (/bk)
            </li>
          </ul>
        </div>
      </aside>

      <!-- CONTENT WORKSPACE AREA -->
      <main class="flex-1 bg-slate-950/60 rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
        <!-- 1. IDENTITAS & BRANDING KAMPUS -->
        <section v-if="activeTab === 'identity'" class="space-y-6">
          <div class="border-b border-slate-800 pb-4">
            <h2 class="font-sora font-bold text-lg text-white">Identitas & Brand Institusi</h2>
            <p class="text-xs text-slate-400 mt-1">
              Atribut resmi nama kampus, akreditasi, logo, dan teks institusi yang tampil di seluruh antarmuka web.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-medium text-slate-300 mb-1">Nama Resmi Institusi</label>
              <input
                v-model="schema.identity.name"
                type="text"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <span class="text-[10px] text-slate-500 mt-1 block">ID Pemanggilan: <code>identity.name</code></span>
            </div>

            <div>
              <label class="block font-medium text-slate-300 mb-1">Nama Singkat Resmi</label>
              <input
                v-model="schema.identity.shortName"
                type="text"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <span class="text-[10px] text-slate-500 mt-1 block">ID Pemanggilan: <code>identity.shortName</code></span>
            </div>

            <div>
              <label class="block font-medium text-slate-300 mb-1">Akronim / Inisial</label>
              <input
                v-model="schema.identity.acronym"
                type="text"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono"
              />
              <span class="text-[10px] text-slate-500 mt-1 block">ID Pemanggilan: <code>identity.acronym</code></span>
            </div>

            <div>
              <label class="block font-medium text-slate-300 mb-1">Tahun Akademik Aktif</label>
              <input
                v-model="schema.identity.academicYear"
                type="text"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono"
              />
              <span class="text-[10px] text-slate-500 mt-1 block">ID Pemanggilan: <code>identity.academicYear</code></span>
            </div>

            <div class="md:col-span-2">
              <label class="block font-medium text-slate-300 mb-1">Tagline Utama Kampus</label>
              <input
                v-model="schema.identity.tagline"
                type="text"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <span class="text-[10px] text-slate-500 mt-1 block">ID Pemanggilan: <code>identity.tagline</code></span>
            </div>

            <div class="md:col-span-2">
              <label class="block font-medium text-slate-300 mb-1">Sub-Tagline Sistem PMB</label>
              <input
                v-model="schema.identity.subTagline"
                type="text"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <span class="text-[10px] text-slate-500 mt-1 block">ID Pemanggilan: <code>identity.subTagline</code></span>
            </div>

            <div>
              <label class="block font-medium text-slate-300 mb-1">Status Akreditasi Institusi</label>
              <input
                v-model="schema.identity.accreditation"
                type="text"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label class="block font-medium text-slate-300 mb-1">Nama Rektor / Pimpinan</label>
              <input
                v-model="schema.identity.rectorName"
                type="text"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </section>

        <!-- 2. HERO, BANNER & PENGUMUMAN -->
        <section v-if="activeTab === 'hero_announcement'" class="space-y-6">
          <div class="border-b border-slate-800 pb-4">
            <h2 class="font-sora font-bold text-lg text-white">Hero Section & Pengumuman Global</h2>
            <p class="text-xs text-slate-400 mt-1">
              Atur headline halaman depan, teks pemicu registrasi, serta banner pengumuman darurat/penting.
            </p>
          </div>

          <!-- Pengumuman Global Banner Switch -->
          <div class="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-4 text-xs">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-semibold text-slate-200">Banner Pengumuman Global</h3>
                <p class="text-[11px] text-slate-400">Tampilkan strip pengumuman penting di bagian paling atas aplikasi.</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="schema.announcement.enabled" class="sr-only peer" />
                <div class="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div v-if="schema.announcement.enabled" class="space-y-3 pt-2 border-t border-slate-800">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label class="block font-medium text-slate-300 mb-1">Badge Teks</label>
                  <input
                    v-model="schema.announcement.badge"
                    type="text"
                    class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                  />
                </div>
                <div class="sm:col-span-2">
                  <label class="block font-medium text-slate-300 mb-1">Judul Pengumuman</label>
                  <input
                    v-model="schema.announcement.title"
                    type="text"
                    class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label class="block font-medium text-slate-300 mb-1">Isi Narasi Pengumuman</label>
                <textarea
                  v-model="schema.announcement.text"
                  rows="2"
                  class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 outline-none"
                ></textarea>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block font-medium text-slate-300 mb-1">Teks Tombol Aksi</label>
                  <input
                    v-model="schema.announcement.actionText"
                    type="text"
                    class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                  />
                </div>
                <div>
                  <label class="block font-medium text-slate-300 mb-1">Tautan Aksi (URL / WA)</label>
                  <input
                    v-model="schema.announcement.actionLink"
                    type="url"
                    class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Hero Headline Fields -->
          <div class="space-y-4 text-xs">
            <h3 class="font-semibold text-slate-200">Konten Hero Landing Page</h3>
            <div>
              <label class="block font-medium text-slate-300 mb-1">Headline Utama (Title)</label>
              <input
                v-model="schema.hero.headline"
                type="text"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 outline-none"
              />
            </div>
            <div>
              <label class="block font-medium text-slate-300 mb-1">Sub-Headline Narasi</label>
              <textarea
                v-model="schema.hero.subheadline"
                rows="3"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 outline-none"
              ></textarea>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-medium text-slate-300 mb-1">Teks Tombol CTA Utama</label>
                <input
                  v-model="schema.hero.ctaPrimaryText"
                  type="text"
                  class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                />
              </div>
              <div>
                <label class="block font-medium text-slate-300 mb-1">Teks Tombol CTA Sekunder (Brosur)</label>
                <input
                  v-model="schema.hero.ctaSecondaryText"
                  type="text"
                  class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- 3. MEDIA & ASET VISUAL (GAMBAR & DOKUMEN) -->
        <section v-if="activeTab === 'media_assets'" class="space-y-6">
          <div class="border-b border-slate-800 pb-4">
            <h2 class="font-sora font-bold text-lg text-white">Media Library & Aset Visual</h2>
            <p class="text-xs text-slate-400 mt-1">
              Katalog seluruh file gambar, logo, emblem, latar kampus, dan berkas panduan PDF resmi PMB.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <!-- Asset 1: Logo Utama -->
            <div class="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-3">
              <div class="flex items-center justify-between">
                <span class="font-semibold text-slate-200">1. Logo Utama Kampus (PNG/SVG)</span>
                <span class="text-[10px] font-mono text-blue-400">Dimensi: 512x512</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center p-2 border border-slate-700">
                  <img :src="schema.media.logoUrl" alt="Preview Logo" class="max-h-full object-contain" />
                </div>
                <div class="flex-1 space-y-1">
                  <input
                    v-model="schema.media.logoUrl"
                    type="text"
                    class="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono"
                  />
                  <span class="text-[10px] text-slate-500">ID: <code>media.logoUrl</code></span>
                </div>
              </div>
            </div>

            <!-- Asset 2: Emblem / Segel Resmi -->
            <div class="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-3">
              <div class="flex items-center justify-between">
                <span class="font-semibold text-slate-200">2. Emblem & Segel Resmi PMB</span>
                <span class="text-[10px] font-mono text-purple-400">Kartu Ujian & LoA</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center p-2 border border-slate-700">
                  <img :src="schema.media.emblemUrl" alt="Preview Emblem" class="max-h-full object-contain" />
                </div>
                <div class="flex-1 space-y-1">
                  <input
                    v-model="schema.media.emblemUrl"
                    type="text"
                    class="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono"
                  />
                  <span class="text-[10px] text-slate-500">ID: <code>media.emblemUrl</code></span>
                </div>
              </div>
            </div>

            <!-- Asset 3: Background Hero Kampus -->
            <div class="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-3 md:col-span-2">
              <div class="flex items-center justify-between">
                <span class="font-semibold text-slate-200">3. Background Panorama Kampus BTH</span>
                <span class="text-[10px] font-mono text-emerald-400">1920x1080 (Lanskap)</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="h-24 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden relative">
                  <img :src="schema.media.heroCampusBgUrl" alt="Campus BG" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-blue-950/40 flex items-center justify-center">
                    <span class="text-[10px] bg-slate-900/80 px-2 py-0.5 rounded text-white font-mono">Live Preview</span>
                  </div>
                </div>
                <div class="sm:col-span-2 space-y-2">
                  <input
                    v-model="schema.media.heroCampusBgUrl"
                    type="text"
                    class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono"
                  />
                  <p class="text-[11px] text-slate-400">
                    Digunakan pada header formulir pendaftaran calon mahasiswa, portal login satu pintu, dan kartu registrasi PMB.
                  </p>
                </div>
              </div>
            </div>

            <!-- Asset 4: Dokumen PDF Brosur & Panduan -->
            <div class="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-2 md:col-span-2">
              <span class="font-semibold text-slate-200">4. Tautan Unduh Berkas Panduan & Brosur Digital</span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label class="block text-slate-400 text-[11px] mb-1">URL Brosur PMB PDF</label>
                  <input
                    v-model="schema.media.brochurePdfUrl"
                    type="url"
                    class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs"
                  />
                </div>
                <div>
                  <label class="block text-slate-400 text-[11px] mb-1">URL Buku Petunjuk Pendaftaran</label>
                  <input
                    v-model="schema.media.guidePdfUrl"
                    type="url"
                    class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 4. GRUP WHATSAPP & INTEGRASI TAUTAN DIGITAL -->
        <section v-if="activeTab === 'whatsapp_links'" class="space-y-6">
          <div class="border-b border-slate-800 pb-4">
            <h2 class="font-sora font-bold text-lg text-white">Grup WhatsApp & Integrasi Link</h2>
            <p class="text-xs text-slate-400 mt-1">
              Konfigurasi tautan grup WhatsApp sesuai segmen audiens dan link sistem eksternal (CBT, Tour 360, Web).
            </p>
          </div>

          <div class="space-y-3.5 text-xs">
            <!-- 1. Grup WhatsApp Umum -->
            <div class="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Smartphone class="w-4 h-4" />
                  Grup WhatsApp Umum / Komunitas Terbuka
                </span>
                <span class="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full">
                  Semua Orang / Publik
                </span>
              </div>
              <p class="text-[11px] text-slate-400">
                Tautan grup terbuka yang dapat diakses oleh publik, calon mahasiswa umum, dan pengunjung website.
              </p>
              <input
                v-model="schema.links.publicWaGroup"
                type="url"
                class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
              />
            </div>

            <!-- 2. Grup WhatsApp Onboarding -->
            <div class="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-semibold text-blue-400 flex items-center gap-1.5">
                  <Smartphone class="w-4 h-4" />
                  Grup WhatsApp Onboarding Calon Mahasiswa Baru
                </span>
                <span class="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full">
                  Khusus Pendaftar Baru
                </span>
              </div>
              <p class="text-[11px] text-slate-400">
                Tautan grup resmi yang otomatis disajikan pada halaman orientasi <code>/onboarding-wa</code> setelah pendaftar selesai verifikasi OTP.
              </p>
              <input
                v-model="schema.links.onboardingWaGroup"
                type="url"
                class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
              />
            </div>

            <!-- 3. Grup WhatsApp Mitra BK -->
            <div class="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-semibold text-amber-400 flex items-center gap-1.5">
                  <Smartphone class="w-4 h-4" />
                  Grup WhatsApp Mitra Guru BK & Sekolah
                </span>
                <span class="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-full">
                  Khusus Guru BK
                </span>
              </div>
              <p class="text-[11px] text-slate-400">
                Tautan grup koordinasi kemitraan sekolah binaan dan pencairan insentif voucher yang tampil pada dashboard Guru BK (<code>/bk</code>).
              </p>
              <input
                v-model="schema.links.bkWaGroup"
                type="url"
                class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
              />
            </div>

            <!-- Link Server CBT & Virtual Tour -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div class="bg-slate-900 rounded-xl p-3.5 border border-slate-800 space-y-1.5">
                <label class="block font-semibold text-slate-300">Server CBT Mandiri</label>
                <input
                  v-model="schema.links.cbtServerUrl"
                  type="url"
                  class="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs"
                />
              </div>
              <div class="bg-slate-900 rounded-xl p-3.5 border border-slate-800 space-y-1.5">
                <label class="block font-semibold text-slate-300">Virtual Tour Kampus 360°</label>
                <input
                  v-model="schema.links.virtualTourUrl"
                  type="url"
                  class="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- 5. PROGRAM STUDI & FAKULTAS -->
        <section v-if="activeTab === 'faculties'" class="space-y-6">
          <div class="border-b border-slate-800 pb-4">
            <h2 class="font-sora font-bold text-lg text-white">Program Studi & Fakultas</h2>
            <p class="text-xs text-slate-400 mt-1">
              Daftar program studi resmi, jenjang gelar, daya tampung kuota, dan estimasi UKT semester 1.
            </p>
          </div>

          <div class="space-y-3 text-xs">
            <div
              v-for="prodi in schema.studyPrograms"
              :key="prodi.code"
              class="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-2.5"
            >
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded font-mono font-bold bg-blue-900/60 text-blue-300 text-[10px]">
                    {{ prodi.code }}
                  </span>
                  <h3 class="font-sora font-bold text-slate-100">{{ prodi.name }}</h3>
                  <span class="text-[11px] text-slate-400">({{ prodi.degree }})</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Akreditasi: {{ prodi.accreditation }}
                  </span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                    Kuota: {{ prodi.quota }} Maba
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label class="block text-slate-400 text-[10px] mb-1">Fakultas Naungan</label>
                  <input
                    v-model="prodi.faculty"
                    type="text"
                    class="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div>
                  <label class="block text-slate-400 text-[10px] mb-1">Estimasi UKT Sem. 1 (Rp)</label>
                  <input
                    v-model.number="prodi.uktFee"
                    type="number"
                    class="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label class="block text-slate-400 text-[10px] mb-1">Gugus Orientasi Maba</label>
                  <input
                    v-model="prodi.gugus"
                    type="text"
                    class="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 6. JALUR PENDAFTARAN & TARIF FORMULIR -->
        <section v-if="activeTab === 'tracks'" class="space-y-6">
          <div class="border-b border-slate-800 pb-4">
            <h2 class="font-sora font-bold text-lg text-white">Jalur Pendaftaran & Tarif Biaya</h2>
            <p class="text-xs text-slate-400 mt-1">
              Pengaturan skema jalur PMB, tarif formulir, dan ketentuan pembebasan biaya seleksi.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div
              v-for="track in schema.tracks"
              :key="track.id"
              class="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-2.5"
            >
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-slate-200">{{ track.name }}</h3>
                <span
                  class="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                  :class="track.fee === 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-blue-950 text-blue-300 border border-blue-800'"
                >
                  {{ track.fee === 0 ? 'BEBAS BIAYA (Rp 0)' : `Rp ${track.fee.toLocaleString('id-ID')}` }}
                </span>
              </div>
              <p class="text-[11px] text-slate-400 leading-relaxed">{{ track.description }}</p>
              <div class="pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
                <span>Status Jalur: <strong class="text-emerald-400">Buka</strong></span>
                <span>Gelombang: <strong>{{ track.wave }}</strong></span>
              </div>
            </div>
          </div>
        </section>

        <!-- 7. KONTAK & MEDIA SOSIAL -->
        <section v-if="activeTab === 'contact'" class="space-y-6">
          <div class="border-b border-slate-800 pb-4">
            <h2 class="font-sora font-bold text-lg text-white">Kontak, Alamat & Sosial Media</h2>
            <p class="text-xs text-slate-400 mt-1">
              Data sekretariat PMB, email helpdesk, nomor telepon, dan link kanal media sosial resmi.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div class="md:col-span-2">
              <label class="block font-medium text-slate-300 mb-1">Alamat Kampus Utama</label>
              <textarea
                v-model="schema.contact.address"
                rows="2"
                class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
              ></textarea>
            </div>

            <div>
              <label class="block font-medium text-slate-300 mb-1">Lokasi Gedung / Ruang Sekretariat</label>
              <input
                v-model="schema.contact.buildingName"
                type="text"
                class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
              />
            </div>

            <div>
              <label class="block font-medium text-slate-300 mb-1">Email Resmi PMB</label>
              <input
                v-model="schema.contact.email"
                type="email"
                class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
              />
            </div>

            <div>
              <label class="block font-medium text-slate-300 mb-1">Telepon Kantor</label>
              <input
                v-model="schema.contact.phone"
                type="text"
                class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
              />
            </div>

            <div>
              <label class="block font-medium text-slate-300 mb-1">WhatsApp Helpdesk Center</label>
              <input
                v-model="schema.contact.whatsapp"
                type="text"
                class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
              />
            </div>

            <div class="md:col-span-2 space-y-2 pt-2 border-t border-slate-800">
              <h3 class="font-semibold text-slate-200">Kanal Media Sosial Kampus</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-slate-400 text-[11px] mb-1">Instagram (@)</label>
                  <input
                    v-model="schema.socialMedia.instagram"
                    type="url"
                    class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs"
                  />
                </div>
                <div>
                  <label class="block text-slate-400 text-[11px] mb-1">YouTube Channel</label>
                  <input
                    v-model="schema.socialMedia.youtube"
                    type="url"
                    class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs"
                  />
                </div>
                <div>
                  <label class="block text-slate-400 text-[11px] mb-1">TikTok</label>
                  <input
                    v-model="schema.socialMedia.tiktok"
                    type="url"
                    class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs"
                  />
                </div>
                <div>
                  <label class="block text-slate-400 text-[11px] mb-1">Facebook</label>
                  <input
                    v-model="schema.socialMedia.facebook"
                    type="url"
                    class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 8. FAQ & PUSAT BANTUAN PMB -->
        <section v-if="activeTab === 'faqs'" class="space-y-6">
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 class="font-sora font-bold text-lg text-white">Basis Pengetahuan & FAQ PMB</h2>
              <p class="text-xs text-slate-400 mt-1">
                Tanya-jawab resmi yang disajikan ke pendaftar untuk mengurangi beban tiket helpdesk.
              </p>
            </div>
            <button
              type="button"
              @click="addFaqItem"
              class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus class="w-3.5 h-3.5" />
              <span>Tambah FAQ</span>
            </button>
          </div>

          <div class="space-y-3 text-xs">
            <div
              v-for="(faq, idx) in schema.faqs"
              :key="faq.id"
              class="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-2"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="flex-1 space-y-1">
                  <span class="text-[10px] font-mono text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-900">
                    Kategori: {{ faq.category }}
                  </span>
                  <input
                    v-model="faq.question"
                    type="text"
                    placeholder="Pertanyaan FAQ..."
                    class="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-semibold"
                  />
                </div>
                <button
                  type="button"
                  @click="removeFaqItem(idx)"
                  class="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-950/40 cursor-pointer"
                  title="Hapus FAQ"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
              <textarea
                v-model="faq.answer"
                rows="2"
                placeholder="Jawaban resmi..."
                class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300"
              ></textarea>
            </div>
          </div>
        </section>

        <!-- 9. PRATINJAU LANGSUNG (LIVE CANVAS INSPECTOR) -->
        <section v-if="activeTab === 'preview'" class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 class="font-sora font-bold text-lg text-white">Live Canvas Inspector</h2>
              <p class="text-xs text-slate-400 mt-1">
                Simulasi rendering langsung konten CMS pada komponen UI nyata calon mahasiswa.
              </p>
            </div>
            <!-- Viewport Switcher -->
            <div class="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                @click="previewViewport = 'desktop'"
                class="px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                :class="previewViewport === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'"
              >
                <Laptop class="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                @click="previewViewport = 'mobile'"
                class="px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                :class="previewViewport === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'"
              >
                <Smartphone class="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>
          </div>

          <!-- Canvas Container -->
          <div
            class="mx-auto transition-all duration-300 bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
            :class="previewViewport === 'mobile' ? 'max-w-sm' : 'w-full'"
          >
            <!-- Canvas Header -->
            <div class="bg-[#1E3A8A] text-white px-5 py-3.5 flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <img :src="schema.media.logoUrl" alt="Logo" class="w-8 h-8 object-contain bg-white rounded-md p-0.5" />
                <div>
                  <h4 class="font-sora font-bold text-xs sm:text-sm tracking-tight leading-none">{{ schema.identity.shortName }}</h4>
                  <p class="text-[10px] text-blue-200 font-sans mt-0.5">{{ schema.identity.tagline }}</p>
                </div>
              </div>
              <span class="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono font-semibold">
                {{ schema.identity.academicYear }}
              </span>
            </div>

            <!-- Canvas Announcement Banner (Jika Aktif) -->
            <div v-if="schema.announcement.enabled" class="bg-amber-500 text-slate-950 px-4 py-2 text-xs flex items-center justify-between gap-2">
              <div class="flex items-center gap-2 truncate">
                <span class="bg-black/20 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase">
                  {{ schema.announcement.badge }}
                </span>
                <span class="font-semibold truncate">{{ schema.announcement.title }}</span>
              </div>
              <a :href="schema.announcement.actionLink" target="_blank" class="underline font-bold text-[11px] whitespace-nowrap">
                {{ schema.announcement.actionText }}
              </a>
            </div>

            <!-- Canvas Hero Preview -->
            <div class="p-6 bg-slate-50 border-b border-slate-200 text-center space-y-2.5">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-900">
                Penerimaan Mahasiswa Baru {{ schema.identity.activeWave }}
              </span>
              <h3 class="font-sora font-extrabold text-base sm:text-xl text-slate-900">
                {{ schema.hero.headline }}
              </h3>
              <p class="text-xs text-slate-600 max-w-lg mx-auto">
                {{ schema.hero.subheadline }}
              </p>
              <div class="pt-2 flex items-center justify-center gap-2.5 flex-wrap">
                <span class="px-4 py-2 rounded-xl bg-[#1E3A8A] text-white text-xs font-semibold shadow-xs">
                  {{ schema.hero.ctaPrimaryText }}
                </span>
                <span class="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold">
                  {{ schema.hero.ctaSecondaryText }}
                </span>
              </div>
            </div>

            <!-- Canvas WhatsApp Multi-Group Integration Preview -->
            <div class="p-5 space-y-3">
              <h4 class="font-sora font-bold text-xs text-slate-800">Pratinjau Integrasi WhatsApp Terpisah</h4>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span class="font-bold text-emerald-900 text-[11px] block">Grup Umum (Semua Orang)</span>
                  <p class="text-[10px] text-emerald-700 font-mono mt-0.5 truncate">{{ schema.links.publicWaGroup }}</p>
                </div>
                <div class="p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <span class="font-bold text-blue-900 text-[11px] block">Grup Onboarding Pendaftar</span>
                  <p class="text-[10px] text-blue-700 font-mono mt-0.5 truncate">{{ schema.links.onboardingWaGroup }}</p>
                </div>
                <div class="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <span class="font-bold text-amber-900 text-[11px] block">Grup Mitra Guru BK</span>
                  <p class="text-[10px] text-amber-700 font-mono mt-0.5 truncate">{{ schema.links.bkWaGroup }}</p>
                </div>
              </div>
            </div>

            <!-- Canvas Footer Preview -->
            <div class="p-4 bg-slate-900 text-slate-300 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>{{ schema.identity.name }} • {{ schema.contact.city }}</span>
              <span class="text-slate-400">Helpdesk WA: {{ schema.contact.whatsapp }}</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, markRaw } from 'vue';
import { RouterLink } from 'vue-router';
import {
  Layers,
  Building2,
  Megaphone,
  Share2,
  HelpCircle,
  Eye,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Smartphone,
  Laptop,
  Plus,
  Trash2,
  ExternalLink,
  BookOpen,
  DollarSign,
  MapPin,
  Image as ImageIcon,
} from 'lucide-vue-next';
import { useToast } from '@/composables/useToast';

const toast = useToast();

const activeTab = ref('identity');
const previewViewport = ref('desktop');

// Daftar Navigasi Seksi Mandiri CMS
const navSections = [
  { id: 'identity', label: '1. Identitas & Brand', icon: markRaw(Building2) },
  { id: 'hero_announcement', label: '2. Hero & Pengumuman', icon: markRaw(Megaphone) },
  { id: 'media_assets', label: '3. Media Library & File', icon: markRaw(ImageIcon), badge: '4 File' },
  { id: 'whatsapp_links', label: '4. Link WhatsApp & URL', icon: markRaw(Share2), badge: '3 Grup' },
  { id: 'faculties', label: '5. Program Studi', icon: markRaw(BookOpen), badge: '6 Prodi' },
  { id: 'tracks', label: '6. Jalur & Biaya PMB', icon: markRaw(DollarSign), badge: '5 Jalur' },
  { id: 'contact', label: '7. Kontak & Sosmed', icon: markRaw(MapPin) },
  { id: 'faqs', label: '8. FAQ Pendaftaran', icon: markRaw(HelpCircle), badge: '5 Item' },
  { id: 'preview', label: '9. Live Canvas Inspector', icon: markRaw(Eye) },
];

/**
 * [INTEGRATION ANCHOR / SCHEMA MASTER]
 * Seluruh komponen, teks, dan media gambar yang dibutuhkan/dipanggil pada web app PMB.
 * Saat skenario CMS terpisah diterapkan, skema ini tinggal dihubungkan langsung ke:
 * -> Pinia useCmsStore() ATAU
 * -> Backend Headless API: GET/PUT http://api.bth.ac.id/cms/v1/content
 */
const schema = reactive({
  identity: {
    name: 'Universitas Bakti Tunas Husada',
    shortName: 'Universitas BTH',
    acronym: 'BTH',
    tagline: 'Transforming New Generation',
    subTagline: 'Sistem Informasi Penerimaan Mahasiswa Baru Terpadu',
    academicYear: '2026/2027',
    activeWave: 'Gelombang 1',
    accreditation: 'Terakreditasi BAN-PT & LAM-PTKes',
    rectorName: 'Dr. Hj. Eni Kartika, M.Si.',
  },
  hero: {
    headline: 'Gerbang Menuju Masa Depan Kesehatan & Teknologi Unggul',
    subheadline: 'Raih karir profesional bersama Universitas BTH dengan kurikulum berbasis industri, dosen berkompeten, dan fasilitas laboratorium modern berstandar nasional.',
    ctaPrimaryText: 'Daftar Akun PMB Baru',
    ctaSecondaryText: 'Unduh Brosur PMB 2026',
  },
  announcement: {
    enabled: true,
    badge: 'Informasi PMB 2026',
    title: 'Pendaftaran Mahasiswa Baru Tahun Akademik 2026/2027 Dibuka!',
    text: 'Pendaftaran Jalur Reguler, Prestasi Akademik, dan Kemitraan Guru BK telah dibuka. Manfaatkan kemudahan verifikasi berkas daring dan tes CBT mandiri.',
    actionText: 'Tanya Panitia via WA',
    actionLink: 'https://api.whatsapp.com/send?phone=6282117100200',
  },
  media: {
    logoUrl: '/assets/icons/bth.png',
    emblemUrl: '/assets/icons/bth-emblem.png',
    heroCampusBgUrl: '/assets/images/bth-campus-bg.jpg',
    brochurePdfUrl: 'https://pmb.bth.ac.id/brosur-pmb-2026.pdf',
    guidePdfUrl: 'https://pmb.bth.ac.id/panduan-pendaftaran-2026.pdf',
  },
  links: {
    publicWaGroup: 'https://chat.whatsapp.com/BTH-KomunitasPMB2026',
    onboardingWaGroup: 'https://chat.whatsapp.com/BTH-MabaOnboarding2026',
    bkWaGroup: 'https://chat.whatsapp.com/BTH-MitraGuruBK2026',
    cbtServerUrl: 'https://cbt.universitas-bth.ac.id',
    virtualTourUrl: 'https://universitas-bth.ac.id/virtual-tour',
    websiteUrl: 'https://universitas-bth.ac.id',
  },
  studyPrograms: [
    {
      code: '01',
      name: 'S1 Farmasi',
      faculty: 'Fakultas Farmasi',
      degree: 'S.Farm.',
      accreditation: 'Unggul (LAM-PTKes)',
      quota: 180,
      uktFee: 6500000,
      gugus: 'Gugus 01 - Hygeia Farmasi',
    },
    {
      code: '02',
      name: 'S1 Teknologi Informasi',
      faculty: 'Fakultas Teknologi & Bisnis',
      degree: 'S.Kom.',
      accreditation: 'Baik Sekali (BAN-PT)',
      quota: 100,
      uktFee: 4500000,
      gugus: 'Gugus 07 - Turing Informatika',
    },
    {
      code: '03',
      name: 'S1 Administrasi Rumah Sakit',
      faculty: 'Fakultas Ilmu Kesehatan',
      degree: 'S.Kes.',
      accreditation: 'Baik Sekali',
      quota: 80,
      uktFee: 4500000,
      gugus: 'Gugus 05 - Asklepios Kesehatan',
    },
    {
      code: '04',
      name: 'D3 Analis Kesehatan (TLM)',
      faculty: 'Fakultas Ilmu Kesehatan',
      degree: 'A.Md.Kes.',
      accreditation: 'A (LAM-PTKes)',
      quota: 90,
      uktFee: 4750000,
      gugus: 'Gugus 05 - Asklepios Kesehatan',
    },
    {
      code: '05',
      name: 'D3 Farmasi',
      faculty: 'Fakultas Farmasi',
      degree: 'A.Md.Farm.',
      accreditation: 'Unggul',
      quota: 120,
      uktFee: 4800000,
      gugus: 'Gugus 02 - Galen Kefarmasian',
    },
    {
      code: '06',
      name: 'S1 Manajemen Bisnis Informasi',
      faculty: 'Fakultas Teknologi & Bisnis',
      degree: 'S.M.',
      accreditation: 'Baik Sekali',
      quota: 75,
      uktFee: 4250000,
      gugus: 'Gugus 08 - Lovelace Komputer',
    },
  ],
  tracks: [
    {
      id: 'reguler',
      name: 'Jalur Reguler Gelombang 1',
      fee: 250000,
      wave: 'Gelombang 1',
      description: 'Jalur pendaftaran umum dengan seleksi Computer-Based Test (CBT) dan verifikasi berkas.',
    },
    {
      id: 'prestasi',
      name: 'Jalur Prestasi Akademik / Rapor',
      fee: 250000,
      wave: 'Gelombang 1',
      description: 'Bebas tes tulis CBT bagi siswa berprestasi peringkat 1-10 paralel sekolah atau nilai rata-rata rapor min 82.',
    },
    {
      id: 'kip',
      name: 'Jalur Beasiswa KIP Kuliah',
      fee: 0,
      wave: 'Gelombang 1',
      description: 'Bantuan biaya pendidikan pemerintah bagi siswa pemegang KIP/KKS berprestasi akademik.',
    },
    {
      id: 's2',
      name: 'Jalur Pascasarjana (S2 Farmasi)',
      fee: 500000,
      wave: 'Gelombang 1',
      description: 'Program magister farmasi bagi lulusan sarjana farmasi atau profesi apoteker.',
    },
  ],
  contact: {
    address: 'Jl. Cilolohan No. 36, Kahuripan, Kec. Tawang, Kota Tasikmalaya, Jawa Barat 46115',
    buildingName: 'Sekretariat PMB, Gedung Rektorat Lt. 1',
    city: 'Kota Tasikmalaya',
    email: 'pmb@bth.ac.id',
    phone: '(0265) 345678',
    whatsapp: '0821-1710-0200',
  },
  socialMedia: {
    instagram: 'https://instagram.com/universitas_bth',
    youtube: 'https://youtube.com/@universitasbth',
    facebook: 'https://facebook.com/universitasbth',
    tiktok: 'https://tiktok.com/@universitasbth',
  },
  faqs: [
    {
      id: 'faq-1',
      category: 'Pendaftaran',
      question: 'Bagaimana alur pendaftaran mahasiswa baru di Universitas BTH?',
      answer: 'Alur pendaftaran terdiri dari 6 tahapan: Pengisian Biodata Pribadi, Pemilihan Jalur & Program Studi, Unggah Dokumen Berkas, Pembayaran Biaya Formulir (atau bypass referral BK), Ujian Mandiri CBT, dan Pengumuman Kelulusan serta Registrasi Ulang.',
    },
    {
      id: 'faq-2',
      category: 'Berkas',
      question: 'Dokumen apa saja yang wajib diunggah saat pendaftaran?',
      answer: 'Dokumen wajib meliputi Ijazah atau Surat Keterangan Lulus (SKL), Kartu Tanda Penduduk (KTP) atau Kartu Pelajar, Kartu Keluarga (KK), Pasfoto formal 4x6, dan Surat Keterangan Sehat.',
    },
    {
      id: 'faq-3',
      category: 'Jalur & Biaya',
      question: 'Apakah jalur Mitra Guru BK mendapatkan bebas biaya pendaftaran?',
      answer: 'Ya, pendaftar yang memasukkan kode referal resmi dari Guru BK sekolah mitra berhak mendapatkan pembebasan biaya formulir langsung atau skema pendaftaran khusus kemitraan.',
    },
    {
      id: 'faq-4',
      category: 'Seleksi CBT',
      question: 'Berapa passing grade nilai ujian CBT untuk dinyatakan lulus?',
      answer: 'Nilai ambang batas minimal kelulusan Computer-Based Test (CBT) adalah 70 dari skala 100.',
    },
  ],
});

const addFaqItem = () => {
  schema.faqs.push({
    id: `faq-${Date.now()}`,
    category: 'Umum',
    question: '',
    answer: '',
  });
  toast.info('Item FAQ baru ditambahkan ke rancangan.');
};

const removeFaqItem = (index) => {
  schema.faqs.splice(index, 1);
  toast.warning('Item FAQ dihapus dari rancangan.');
};

const simulatePublish = () => {
  toast.success('Rancangan Layout CMS Tersimpan! Seluruh skema komponen, teks, dan media siap dihubungkan.');
};
</script>
