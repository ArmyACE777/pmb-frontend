<template>
  <div class="space-y-6">
    <!-- 1. Header Desk CMS -->
    <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-start sm:items-center gap-3.5">
        <div class="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200/80 text-[#1E3A8A] flex items-center justify-center flex-shrink-0 shadow-2xs">
          <Globe class="w-5 h-5 text-[#1E3A8A]" />
        </div>
        <div>
          <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900 tracking-tight">
            CMS & Pengelolaan Informasi Kampus
          </h2>
          <p class="text-xs text-slate-500 font-sans mt-0.5">
            Sesuaikan identitas resmi, pengumuman, kontak helpdesk, tautan digital, dan FAQ yang tampil di seluruh portal PMB.
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
        <button
          type="button"
          @click="showResetModal = true"
          class="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
          title="Kembalikan semua teks & identitas ke data bawaan resmi Universitas BTH"
        >
          <RotateCcw class="w-3.5 h-3.5 text-slate-500" />
          <span>Reset ke Bawaan</span>
        </button>

        <button
          type="button"
          @click="saveCmsChanges"
          :disabled="isSaving"
          class="px-4 py-2 text-xs font-semibold text-white bg-[#1E3A8A] hover:bg-[#172554] rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-60"
        >
          <Check v-if="!isSaving" class="w-4 h-4" />
          <Loader2 v-else class="w-4 h-4 animate-spin" />
          <span>{{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan CMS' }}</span>
        </button>
      </div>
    </div>

    <!-- 2. Sub-Tab Navigation Bar -->
    <div class="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-2xs flex items-center gap-1 overflow-x-auto scrollbar-none">
      <button
        type="button"
        @click="activeCmsTab = 'identity'"
        class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
        :class="activeCmsTab === 'identity' ? 'bg-[#1E3A8A] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
      >
        <Building2 class="w-4 h-4" />
        <span>Identitas & Branding</span>
      </button>

      <button
        type="button"
        @click="activeCmsTab = 'contact'"
        class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
        :class="activeCmsTab === 'contact' ? 'bg-[#1E3A8A] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
      >
        <MapPin class="w-4 h-4" />
        <span>Kontak & Sekretariat</span>
      </button>

      <button
        type="button"
        @click="activeCmsTab = 'announcement'"
        class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
        :class="activeCmsTab === 'announcement' ? 'bg-[#1E3A8A] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
      >
        <Megaphone class="w-4 h-4" />
        <span>Pengumuman & Banner</span>
      </button>

      <button
        type="button"
        @click="activeCmsTab = 'links'"
        class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
        :class="activeCmsTab === 'links' ? 'bg-[#1E3A8A] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
      >
        <Share2 class="w-4 h-4" />
        <span>Tautan Digital & Media</span>
      </button>

      <button
        type="button"
        @click="activeCmsTab = 'faqs'"
        class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
        :class="activeCmsTab === 'faqs' ? 'bg-[#1E3A8A] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
      >
        <HelpCircle class="w-4 h-4" />
        <span>FAQ Pendaftaran ({{ form.faqs?.length || 0 }})</span>
      </button>

      <button
        type="button"
        @click="activeCmsTab = 'tracks_fees'"
        class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
        :class="activeCmsTab === 'tracks_fees' ? 'bg-[#1E3A8A] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
      >
        <DollarSign class="w-4 h-4" />
        <span>Jalur & Biaya PMB</span>
      </button>

      <button
        type="button"
        @click="activeCmsTab = 'preview'"
        class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
        :class="activeCmsTab === 'preview' ? 'bg-[#1E3A8A] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
      >
        <Eye class="w-4 h-4" />
        <span>Pratinjau Langsung</span>
      </button>
    </div>

    <!-- 3. Tab Contents -->
    <div class="space-y-6">
      <!-- TAB 1: IDENTITAS & BRANDING -->
      <div v-if="activeCmsTab === 'identity'" class="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6 font-sans">
        <div>
          <h3 class="font-sora font-bold text-sm text-slate-900 pb-1 border-b border-slate-100">
            Profil & Atribut Institusi Kampus
          </h3>
          <p class="text-xs text-slate-500 mt-1">
            Data ini akan langsung ditampilkan di header portal, footer seluruh halaman, kartu keputusan kelulusan, dan tanda bukti registrasi.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Nama Resmi Institusi / Universitas</label>
            <input
              v-model="form.identity.name"
              type="text"
              required
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800"
              placeholder="Contoh: Universitas Bakti Tunas Husada"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Nama Ringkas / Singkatan Resmi</label>
            <input
              v-model="form.identity.shortName"
              type="text"
              required
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800"
              placeholder="Contoh: Universitas BTH"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Akronim / Inisial</label>
            <input
              v-model="form.identity.acronym"
              type="text"
              required
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800 font-mono"
              placeholder="Contoh: BTH"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Akreditasi Institusi</label>
            <input
              v-model="form.identity.accreditation"
              type="text"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800"
              placeholder="Contoh: Terakreditasi BAN-PT & LAM-PTKes"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Slogan / Tagline Institusi</label>
            <input
              v-model="form.identity.tagline"
              type="text"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800"
              placeholder="Contoh: Transforming New Generation"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Sub-Tagline Sistem PMB</label>
            <input
              v-model="form.identity.subTagline"
              type="text"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800"
              placeholder="Contoh: Sistem Informasi Penerimaan Mahasiswa Baru Terpadu"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Tahun Akademik Aktif</label>
            <input
              v-model="form.identity.academicYear"
              type="text"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800 font-mono"
              placeholder="Contoh: 2026/2027"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Gelombang Pendaftaran Aktif</label>
            <input
              v-model="form.identity.activeWave"
              type="text"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800"
              placeholder="Contoh: Gelombang 1"
            />
          </div>

          <div class="sm:col-span-2">
            <label class="block font-semibold text-slate-700 mb-1">Nama Rektor (Untuk SK Kelulusan)</label>
            <input
              v-model="form.identity.rectorName"
              type="text"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800"
              placeholder="Contoh: Dr. Hj. Eni Kartika, M.Si."
            />
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100">
          <h4 class="font-sora font-semibold text-xs text-slate-800 mb-3">
            Aset Visual Logo & Gambar Latar
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span class="font-semibold text-slate-700 block">Logo Primer Kampus</span>
              <div class="h-16 flex items-center justify-center bg-white rounded-lg border border-slate-200 p-2">
                <img :src="form.identity.logoUrl" alt="Logo Primer" class="max-h-full max-w-full object-contain" />
              </div>
              <input
                v-model="form.identity.logoUrl"
                type="text"
                class="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-mono outline-none"
                placeholder="/assets/icons/bth.png"
              />
            </div>

            <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span class="font-semibold text-slate-700 block">Emblem Header / Icon</span>
              <div class="h-16 flex items-center justify-center bg-white rounded-lg border border-slate-200 p-2">
                <img :src="form.identity.emblemUrl" alt="Emblem" class="max-h-full max-w-full object-contain" />
              </div>
              <input
                v-model="form.identity.emblemUrl"
                type="text"
                class="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-mono outline-none"
                placeholder="/assets/icons/bth-emblem.png"
              />
            </div>

            <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span class="font-semibold text-slate-700 block">Foto Hero Kampus (Login)</span>
              <div class="h-16 flex items-center justify-center bg-white rounded-lg border border-slate-200 p-1 overflow-hidden">
                <img :src="form.identity.heroCampusBgUrl" alt="Hero Background" class="h-full w-full object-cover rounded" />
              </div>
              <input
                v-model="form.identity.heroCampusBgUrl"
                type="text"
                class="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-mono outline-none"
                placeholder="/assets/images/bth-campus-bg.jpg"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: KONTAK & SEKRETARIAT -->
      <div v-else-if="activeCmsTab === 'contact'" class="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6 font-sans">
        <div>
          <h3 class="font-sora font-bold text-sm text-slate-900 pb-1 border-b border-slate-100">
            Alamat, Helpdesk WhatsApp, & Kontak Pelayanan
          </h3>
          <p class="text-xs text-slate-500 mt-1">
            Informasi ini digunakan pada modal Helpdesk Calon Mahasiswa, petunjuk pendaftaran, dan rincian kontak panitia PMB.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Gedung Pelayanan / Sekretariat</label>
            <input
              v-model="form.contact.buildingName"
              type="text"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800"
              placeholder="Sekretariat PMB, Gedung Rektorat Lt. 1"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Jam Kerja / Operasional Pelayanan</label>
            <input
              v-model="form.contact.officeHours"
              type="text"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800"
              placeholder="Senin - Jumat (08.00 - 16.00 WIB)"
            />
          </div>

          <div class="sm:col-span-2">
            <label class="block font-semibold text-slate-700 mb-1">Alamat Lengkap Kampus</label>
            <textarea
              v-model="form.contact.address"
              rows="2"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800"
              placeholder="Jl. Cilolohan No. 36, Kahuripan, Kec. Tawang, Kota Tasikmalaya, Jawa Barat 46115"
            ></textarea>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Kota</label>
            <input
              v-model="form.contact.city"
              type="text"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800"
              placeholder="Kota Tasikmalaya"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Provinsi & Kode Pos</label>
            <div class="grid grid-cols-2 gap-2">
              <input
                v-model="form.contact.province"
                type="text"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800"
                placeholder="Jawa Barat"
              />
              <input
                v-model="form.contact.postalCode"
                type="text"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800 font-mono"
                placeholder="46115"
              />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Nomor WhatsApp Resmi Helpdesk</label>
            <input
              v-model="form.contact.whatsapp"
              type="text"
              @input="autoSyncWaLink"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800 font-mono font-semibold"
              placeholder="0821-1710-0200"
            />
            <span class="text-[10px] text-slate-400 mt-1 block">Tautan WA otomatis di-generate untuk tombol chat calon mahasiswa.</span>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Email Resmi PMB</label>
            <input
              v-model="form.contact.email"
              type="email"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800 font-mono"
              placeholder="pmb@bth.ac.id"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Nomor Telepon Kantor / Hotline</label>
            <input
              v-model="form.contact.phone"
              type="text"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800"
              placeholder="(0265) 345678"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Website Resmi Universitas</label>
            <input
              v-model="form.contact.websiteUrl"
              type="url"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800 font-mono"
              placeholder="https://universitas-bth.ac.id"
            />
          </div>
        </div>
      </div>

      <!-- TAB 3: PENGUMUMAN & BANNER -->
      <div v-if="activeCmsTab === 'announcement'" class="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6 font-sans">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 class="font-sora font-bold text-sm text-slate-900">
              Banner Pengumuman & Berita Pendaftaran
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Tampilkan pesan penting atau berita pendaftaran gelombang aktif di halaman utama dashboard pendaftar.
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-slate-700">Tampilkan Banner:</span>
            <input
              v-model="form.announcement.enabled"
              type="checkbox"
              class="w-4 h-4 text-[#1E3A8A] rounded focus:ring-blue-500 cursor-pointer"
            />
          </div>
        </div>

        <div class="space-y-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Label / Badge Pengumuman</label>
              <input
                v-model="form.announcement.badge"
                type="text"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800 font-semibold"
                placeholder="Contoh: Informasi PMB 2026"
              />
            </div>
            <div class="sm:col-span-2">
              <label class="block font-semibold text-slate-700 mb-1">Judul Pengumuman</label>
              <input
                v-model="form.announcement.title"
                type="text"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800"
                placeholder="Pendaftaran Mahasiswa Baru Tahun Akademik 2026/2027 Dibuka!"
              />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Isi Pesan Pengumuman Lengkap</label>
            <textarea
              v-model="form.announcement.text"
              rows="3"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800 leading-relaxed"
              placeholder="Tuliskan pesan pengumuman atau petunjuk penting untuk seluruh calon mahasiswa..."
            ></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Teks Tombol Aksi (CTA)</label>
              <input
                v-model="form.announcement.actionText"
                type="text"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800"
                placeholder="Contoh: Tanya Panitia via WA"
              />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Tautan Tujuan Tombol (URL)</label>
              <input
                v-model="form.announcement.actionLink"
                type="text"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800 font-mono"
                placeholder="https://api.whatsapp.com/send?phone=6282117100200"
              />
            </div>
          </div>

          <!-- Pratinjau Tampilan Banner -->
          <div class="pt-3">
            <span class="text-xs font-semibold text-slate-700 block mb-2">Pratinjau Live Banner di Dashboard:</span>
            <div
              v-if="form.announcement.enabled"
              class="p-4 sm:p-5 bg-[#1E3A8A] text-white rounded-xl shadow-xs space-y-2 border border-blue-900/50"
            >
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white border border-white/30">
                  {{ form.announcement.badge || 'Pengumuman' }}
                </span>
                <h4 class="font-sora font-bold text-xs sm:text-sm text-white">
                  {{ form.announcement.title }}
                </h4>
              </div>
              <p class="text-xs text-blue-100/90 leading-relaxed font-sans max-w-2xl">
                {{ form.announcement.text }}
              </p>
              <div v-if="form.announcement.actionText" class="pt-1">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-[#1E3A8A] rounded-lg text-xs font-semibold shadow-2xs">
                  <span>{{ form.announcement.actionText }}</span>
                  <ArrowRight class="w-3 h-3" />
                </span>
              </div>
            </div>
            <div v-else class="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
              Banner saat ini berstatus nonaktif (tidak akan muncul di dashboard pendaftar).
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 4: TAUTAN DIGITAL & MEDIA -->
      <div v-else-if="activeCmsTab === 'links'" class="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6 font-sans">
        <div>
          <h3 class="font-sora font-bold text-sm text-slate-900 pb-1 border-b border-slate-100">
            Tautan Komunitas WhatsApp, Brosur PMB, & Media Sosial
          </h3>
          <p class="text-xs text-slate-500 mt-1">
            Konfigurasi link grup WhatsApp resmi untuk publik umum, onboarding pendaftar, kemitraan Guru BK, serta media informasi digital PMB Universitas BTH.
          </p>
        </div>

        <!-- 3 KARTU KONFIGURASI LINK WHATSAPP -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h4 class="font-sora font-semibold text-xs text-slate-800 uppercase tracking-wider">
              Konfigurasi 3 Grup WhatsApp Resmi
            </h4>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <!-- 1. Link WhatsApp Umum (Semua Orang) -->
            <div class="p-4 rounded-xl border border-blue-200/90 bg-blue-50/40 flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-center gap-2 mb-1.5">
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-600 text-white">Grup 1</span>
                  <span class="font-sora font-bold text-slate-900 text-xs">Grup Umum (Semua Orang)</span>
                </div>
                <p class="text-[11px] text-slate-600 leading-relaxed mb-3">
                  Grup komunitas calon mahasiswa. Ditampilkan secara eksklusif di dalam Dashboard calon pendaftar & modal helpdesk terpadu (bebas spam publik).
                </p>
                <label class="block font-semibold text-slate-700 mb-1">URL Undangan WhatsApp</label>
                <input
                  v-model="form.links.publicWaGroup"
                  type="url"
                  class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-600 text-slate-800 font-mono text-[11px]"
                  placeholder="https://chat.whatsapp.com/BTH-KomunitasPMB2026"
                />
              </div>
              <div class="pt-2 border-t border-blue-200/60 text-[10px] text-blue-700">
                <span>Target Pengguna: Calon Mahasiswa Terdaftar di Dashboard</span>
              </div>
            </div>

            <!-- 2. Link WhatsApp Onboarding (Setelah Pendaftaran) -->
            <div class="p-4 rounded-xl border border-emerald-200/90 bg-emerald-50/40 flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-center gap-2 mb-1.5">
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white">Grup 2</span>
                  <span class="font-sora font-bold text-slate-900 text-xs">Grup Onboarding (User Terdaftar)</span>
                </div>
                <p class="text-[11px] text-slate-600 leading-relaxed mb-3">
                  Wajib bagi pendaftar setelah membuat akun baru. Ditampilkan di alur onboarding pendaftaran & dashboard calon mahasiswa.
                </p>
                <label class="block font-semibold text-slate-700 mb-1">URL Undangan WhatsApp</label>
                <input
                  v-model="form.links.onboardingWaGroup"
                  @input="form.links.officialWaGroup = form.links.onboardingWaGroup"
                  type="url"
                  class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-emerald-600 text-slate-800 font-mono text-[11px]"
                  placeholder="https://chat.whatsapp.com/BTH-MabaOnboarding2026"
                />
              </div>
              <div class="pt-2 border-t border-emerald-200/60 text-[10px] text-emerald-700">
                <span>Target Pengguna: Mahasiswa Baru Terdaftar</span>
              </div>
            </div>

            <!-- 3. Link WhatsApp Guru BK (Forum Kemitraan Sekolah) -->
            <div class="p-4 rounded-xl border border-indigo-200/90 bg-indigo-50/40 flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-center gap-2 mb-1.5">
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#1E3A8A] text-white">Grup 3</span>
                  <span class="font-sora font-bold text-slate-900 text-xs">Grup Forum Mitra Guru BK</span>
                </div>
                <p class="text-[11px] text-slate-600 leading-relaxed mb-3">
                  Khusus Guru BK sekolah mitra untuk koordinasi kuota, konsultasi siswa, & bukti setoran. Ditampilkan di Dashboard Guru BK.
                </p>
                <label class="block font-semibold text-slate-700 mb-1">URL Undangan WhatsApp</label>
                <input
                  v-model="form.links.bkWaGroup"
                  type="url"
                  class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#1E3A8A] text-slate-800 font-mono text-[11px]"
                  placeholder="https://chat.whatsapp.com/BTH-MitraGuruBK2026"
                />
              </div>
              <div class="pt-2 border-t border-indigo-200/60 text-[10px] text-indigo-700">
                <span>Target Pengguna: Guru BK & Mitra Sekolah</span>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100">
          <h4 class="font-sora font-semibold text-xs text-slate-800 mb-3">
            Tautan Pendukung PMB (Brosur, CBT, & Tur Kampus)
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Tautan Unduh Brosur PMB (PDF)</label>
              <input
                v-model="form.links.brochurePdfUrl"
                type="url"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800 font-mono"
                placeholder="https://pmb.bth.ac.id/brosur-pmb-2026.pdf"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">URL Server Ujian Mandiri CBT</label>
              <input
                v-model="form.links.cbtServerUrl"
                type="url"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800 font-mono"
                placeholder="https://cbt.universitas-bth.ac.id"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">URL Virtual Tour / Video Profil</label>
              <input
                v-model="form.links.virtualTourUrl"
                type="url"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800 font-mono"
                placeholder="https://universitas-bth.ac.id/virtual-tour"
              />
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100">
          <h4 class="font-sora font-semibold text-xs text-slate-800 mb-3">
            Akun Media Sosial Resmi
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Instagram PMB / Kampus</label>
              <input
                v-model="form.socialMedia.instagram"
                type="url"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800 font-mono"
                placeholder="https://instagram.com/universitas_bth"
              />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Kanal YouTube</label>
              <input
                v-model="form.socialMedia.youtube"
                type="url"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800 font-mono"
                placeholder="https://youtube.com/@universitasbth"
              />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Facebook Fanpage</label>
              <input
                v-model="form.socialMedia.facebook"
                type="url"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800 font-mono"
                placeholder="https://facebook.com/universitasbth"
              />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">TikTok Official</label>
              <input
                v-model="form.socialMedia.tiktok"
                type="url"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-800 font-mono"
                placeholder="https://tiktok.com/@universitasbth"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 5: FAQ PENDAFTARAN -->
      <div v-else-if="activeCmsTab === 'faqs'" class="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6 font-sans">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div>
            <h3 class="font-sora font-bold text-sm text-slate-900">
              Kelola Tanya Jawab Umum (FAQ PMB)
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Daftar pertanyaan yang sering diajukan pendaftar. Anda dapat menambah, mengedit, atau menghapus item FAQ.
            </p>
          </div>
          <button
            type="button"
            @click="openAddFaqModal"
            class="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#1E3A8A] font-semibold text-xs rounded-xl border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus class="w-4 h-4 text-[#1E3A8A]" />
            <span>Tambah FAQ Baru</span>
          </button>
        </div>

        <!-- FAQ Items List -->
        <div class="space-y-3">
          <div
            v-for="(faq, idx) in form.faqs"
            :key="faq.id || idx"
            class="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all space-y-2 group"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start gap-2.5">
                <span class="w-6 h-6 rounded-lg bg-blue-100 text-[#1E3A8A] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {{ idx + 1 }}
                </span>
                <div>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-200 text-slate-600 inline-block mb-1">
                    {{ faq.category || 'Pendaftaran' }}
                  </span>
                  <h4 class="font-sora font-bold text-xs text-slate-900 leading-snug">
                    {{ faq.question }}
                  </h4>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  @click="editFaq(idx)"
                  class="p-1.5 text-slate-500 hover:text-[#1E3A8A] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Edit Pertanyaan"
                >
                  <Edit2 class="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  @click="deleteFaq(idx)"
                  class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Hapus Pertanyaan"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p class="text-xs text-slate-600 pl-8 leading-relaxed font-sans">
              {{ faq.answer }}
            </p>
          </div>
        </div>
      </div>

      <!-- TAB 6: JALUR & BIAYA PMB DINAMIS -->
      <div v-else-if="activeCmsTab === 'tracks_fees'" class="space-y-6 font-sans">
        <!-- 1. Biaya Formulir Pendaftaran per Jalur -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 class="font-sora font-bold text-slate-900 text-sm">
                Biaya Formulir Pendaftaran per Jalur Seleksi
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">
                Nominal biaya formulir yang ditagihkan kepada pendaftar saat memilih jalur seleksi. Tagihan Virtual Account pendaftar akan otomatis menyesuaikan nilai ini secara real-time.
              </p>
            </div>
            <span class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold self-start sm:self-auto flex-shrink-0">
              Sinkron Dinamis
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="(track, idx) in form.tracks"
              :key="track.id || idx"
              class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
            >
              <div class="flex items-center justify-between">
                <span class="font-sora font-semibold text-xs text-slate-900">{{ track.name }}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-[#1E3A8A]">
                  {{ track.wave || 'Gelombang 1' }}
                </span>
              </div>
              <p class="text-[11px] text-slate-500 leading-relaxed">{{ track.description }}</p>
              <div>
                <label class="block text-[11px] font-semibold text-slate-700 mb-1">Nominal Biaya Formulir (Rp)</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono font-bold text-xs">Rp</span>
                  <input
                    v-model.number="track.fee"
                    type="number"
                    min="0"
                    step="10000"
                    class="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] font-mono text-xs font-bold text-slate-900"
                  />
                </div>
                <span class="text-[10px] text-slate-400 mt-0.5 block">
                  {{ track.fee === 0 ? 'Bebas biaya pendaftaran (Gratis / Subsidi)' : 'Biaya dibayarkan melalui Virtual Account' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Biaya UKT Semester 1 per Program Studi -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 class="font-sora font-bold text-slate-900 text-sm">
                Biaya UKT / Daftar Ulang Semester 1 per Program Studi
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">
                Besaran biaya daftar ulang dan Uang Kuliah Tunggal (UKT) Semester 1 yang diterbitkan ke calon mahasiswa setelah dinyatakan lulus seleksi.
              </p>
            </div>
            <span class="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold self-start sm:self-auto flex-shrink-0">
              {{ form.studyPrograms?.length || 0 }} Program Studi
            </span>
          </div>

          <div class="overflow-x-auto rounded-xl border border-slate-200">
            <table class="w-full border-collapse text-xs">
              <thead class="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th class="px-4 py-2.5 text-center w-12">Kode</th>
                  <th class="px-4 py-2.5 text-left">Program Studi</th>
                  <th class="px-4 py-2.5 text-left">Fakultas</th>
                  <th class="px-4 py-2.5 text-center w-20">Gelar</th>
                  <th class="px-4 py-2.5 text-right w-48 font-mono">Biaya UKT Semester 1 (Rp)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-sans">
                <tr
                  v-for="prodi in form.studyPrograms"
                  :key="prodi.code"
                  class="hover:bg-slate-50 transition-colors"
                >
                  <td class="px-4 py-2.5 text-center font-mono font-bold text-slate-600">{{ prodi.code }}</td>
                  <td class="px-4 py-2.5 font-semibold text-slate-900 whitespace-nowrap">{{ prodi.name }}</td>
                  <td class="px-4 py-2.5 text-slate-600 whitespace-nowrap">{{ prodi.faculty }}</td>
                  <td class="px-4 py-2.5 text-center text-slate-700 font-mono">{{ prodi.degree }}</td>
                  <td class="px-4 py-2.5 text-right">
                    <div class="relative w-40 ml-auto">
                      <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">Rp</span>
                      <input
                        v-model.number="prodi.uktFee"
                        type="number"
                        min="0"
                        step="50000"
                        class="w-full pl-8 pr-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] font-mono text-xs font-bold text-slate-900 text-right"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 7: LIVE PREVIEW -->
      <div v-else-if="activeCmsTab === 'preview'" class="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6 font-sans">
        <div>
          <h3 class="font-sora font-bold text-sm text-slate-900 pb-1 border-b border-slate-100">
            Pratinjau Langsung (Live Preview Portal)
          </h3>
          <p class="text-xs text-slate-500 mt-1">
            Simulasi bagaimana calon mahasiswa melihat identitas, kontak, dan footer kampus berdasarkan pengaturan CMS Anda saat ini.
          </p>
        </div>

        <!-- 1. Simulasi Header -->
        <div class="space-y-1.5">
          <span class="text-xs font-semibold text-slate-700">1. Pratinjau Header Portal:</span>
          <div class="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <img :src="form.identity.emblemUrl" alt="Emblem" class="h-10 w-auto object-contain" />
              <div>
                <div class="font-sora font-extrabold text-slate-900 text-sm leading-tight">
                  {{ form.identity.name }}
                </div>
                <div class="text-[11px] text-slate-500 font-sans mt-0.5">
                  {{ form.identity.tagline }}
                </div>
              </div>
            </div>
            <div class="hidden sm:flex items-center gap-2 text-xs">
              <span class="px-2.5 py-1 rounded-lg bg-blue-50 text-[#1E3A8A] font-semibold font-mono border border-blue-200">
                TA {{ form.identity.academicYear }}
              </span>
            </div>
          </div>
        </div>

        <!-- 2. Simulasi Banner Pengumuman -->
        <div v-if="form.announcement.enabled" class="space-y-1.5">
          <span class="text-xs font-semibold text-slate-700">2. Pratinjau Alert Banner:</span>
          <div class="p-4 bg-[#1E3A8A] text-white rounded-xl shadow-xs space-y-1.5 border border-blue-900/50">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/20 text-white border border-white/30">
                {{ form.announcement.badge }}
              </span>
              <strong class="font-sora text-xs">{{ form.announcement.title }}</strong>
            </div>
            <p class="text-xs text-blue-100 leading-relaxed font-sans">
              {{ form.announcement.text }}
            </p>
          </div>
        </div>

        <!-- 3. Simulasi Modal Helpdesk -->
        <div class="space-y-1.5">
          <span class="text-xs font-semibold text-slate-700">3. Pratinjau Kotak Helpdesk & Kontak:</span>
          <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div class="flex items-center justify-between pb-2 border-b border-slate-200">
              <div class="font-bold text-slate-800 font-sora">Helpdesk PMB {{ form.identity.shortName }}</div>
              <span class="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                WA: {{ form.contact.whatsapp }}
              </span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 text-[11px]">
              <div><strong>Alamat:</strong> {{ form.contact.address }}</div>
              <div><strong>Email:</strong> {{ form.contact.email }}</div>
              <div><strong>Gedung:</strong> {{ form.contact.buildingName }}</div>
              <div><strong>Jam Kerja:</strong> {{ form.contact.officeHours }}</div>
            </div>
          </div>
        </div>

        <!-- 4. Simulasi Footer -->
        <div class="space-y-1.5">
          <span class="text-xs font-semibold text-slate-700">4. Pratinjau Footer Institusi:</span>
          <div class="p-4 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
            <div class="flex items-center gap-2.5">
              <img :src="form.identity.logoUrl" alt="Logo" class="w-7 h-7 object-contain" />
              <div>
                <strong class="text-slate-800">{{ form.identity.name }}</strong>
                <div class="text-[10px] text-slate-400">{{ form.contact.address }}</div>
              </div>
            </div>
            <div class="text-[10px] text-slate-400 font-sans">
              &copy; 2026 Sekretariat PMB {{ form.identity.shortName }}. Seluruh Hak Dilindungi.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Tambah / Edit FAQ -->
    <Teleport to="body">
      <div
        v-if="showFaqModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
        @click.self="showFaqModal = false"
      >
        <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 class="font-sora font-bold text-slate-900 text-sm">
              {{ editingFaqIndex !== null ? 'Edit Pertanyaan FAQ' : 'Tambah Pertanyaan FAQ Baru' }}
            </h3>
            <button @click="showFaqModal = false" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">&times;</button>
          </div>

          <div class="space-y-3 text-xs font-sans">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Kategori Pertanyaan</label>
              <select
                v-model="faqForm.category"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A]"
              >
                <option value="Pendaftaran">Pendaftaran & Alur</option>
                <option value="Berkas">Persyaratan & Berkas</option>
                <option value="Jalur & Biaya">Jalur Seleksi & Biaya</option>
                <option value="Seleksi CBT">Seleksi Ujian CBT</option>
                <option value="Registrasi Ulang">Registrasi Ulang & UKT</option>
                <option value="Umum">Umum</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Kalimat Pertanyaan</label>
              <input
                v-model="faqForm.question"
                type="text"
                required
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A]"
                placeholder="Contoh: Dokumen apa saja yang wajib diunggah?"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Jawaban Penjelasan</label>
              <textarea
                v-model="faqForm.answer"
                rows="4"
                required
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1E3A8A] leading-relaxed"
                placeholder="Tuliskan jawaban yang lengkap, jelas, dan ramah bagi calon mahasiswa..."
              ></textarea>
            </div>
          </div>

          <div class="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              @click="showFaqModal = false"
              class="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              @click="saveFaqItem"
              :disabled="!faqForm.question || !faqForm.answer"
              class="px-4 py-2 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              Simpan FAQ
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal Konfirmasi Reset ke Default -->
    <Teleport to="body">
      <div
        v-if="showResetModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
        @click.self="showResetModal = false"
      >
        <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
              <RotateCcw class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-sora font-bold text-slate-900 text-sm">
                Reset ke Pengaturan Bawaan Kampus?
              </h3>
              <p class="text-xs text-slate-500 mt-1 leading-relaxed">
                Tindakan ini akan mengembalikan seluruh nama institusi, kontak sekretariat, teks pengumuman, dan FAQ ke data resmi default Universitas Bakti Tunas Husada.
              </p>
            </div>
          </div>

          <div class="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              @click="showResetModal = false"
              class="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              @click="confirmResetToDefaults"
              class="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
            >
              Ya, Reset ke Bawaan
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import {
  Globe,
  Building2,
  MapPin,
  Megaphone,
  Share2,
  HelpCircle,
  Eye,
  Check,
  RotateCcw,
  Loader2,
  Plus,
  Edit2,
  Trash2,
  ArrowRight,
  ExternalLink,
  DollarSign
} from 'lucide-vue-next';
import { ref, reactive, watch } from 'vue';
import { useCmsStore, DEFAULT_CMS_DATA } from '@/stores/cms';
import { useToast } from '@/composables/useToast';

const cmsStore = useCmsStore();
const toast = useToast();

const activeCmsTab = ref('identity');
const isSaving = ref(false);
const showResetModal = ref(false);
const showFaqModal = ref(false);
const editingFaqIndex = ref(null);

// Form Reactive State: Deep Clone dari cmsStore
const form = reactive({
  identity: { ...cmsStore.identity },
  contact: { ...cmsStore.contact },
  announcement: { ...cmsStore.announcement },
  socialMedia: { ...cmsStore.socialMedia },
  links: { ...cmsStore.links },
  faqs: [...cmsStore.faqs],
  tracks: JSON.parse(JSON.stringify(cmsStore.tracks)),
  studyPrograms: JSON.parse(JSON.stringify(cmsStore.studyPrograms)),
});

// Auto-sync form jika store berubah dari luar
watch(
  () => cmsStore.state,
  (newVal) => {
    form.identity = { ...newVal.identity };
    form.contact = { ...newVal.contact };
    form.announcement = { ...newVal.announcement };
    form.socialMedia = { ...newVal.socialMedia };
    form.links = { ...newVal.links };
    form.faqs = [...newVal.faqs];
    form.tracks = JSON.parse(JSON.stringify(newVal.tracks || DEFAULT_CMS_DATA.tracks));
    form.studyPrograms = JSON.parse(JSON.stringify(newVal.studyPrograms || DEFAULT_CMS_DATA.studyPrograms));
  },
  { deep: true }
);

// Auto-generate WhatsApp API Link saat nomor diubah
const autoSyncWaLink = () => {
  if (form.contact.whatsapp) {
    const rawNumber = form.contact.whatsapp.replace(/[^0-9]/g, '');
    let formatted = rawNumber;
    if (formatted.startsWith('0')) {
      formatted = '62' + formatted.slice(1);
    }
    form.contact.whatsappLink = `https://api.whatsapp.com/send?phone=${formatted}&text=Halo%20Helpdesk%20PMB%20BTH%2C%20saya%20ingin%20bertanya%20mengenai%20pendaftaran.`;
  }
};

const saveCmsChanges = () => {
  isSaving.value = true;
  try {
    cmsStore.saveAll(form);
    toast.success('Pengaturan CMS & informasi kampus berhasil disimpan dan aktif.');
  } catch (err) {
    toast.error('Gagal menyimpan perubahan CMS.');
  } finally {
    setTimeout(() => {
      isSaving.value = false;
    }, 400);
  }
};

const confirmResetToDefaults = () => {
  cmsStore.resetToDefaults();
  form.identity = { ...DEFAULT_CMS_DATA.identity };
  form.contact = { ...DEFAULT_CMS_DATA.contact };
  form.announcement = { ...DEFAULT_CMS_DATA.announcement };
  form.socialMedia = { ...DEFAULT_CMS_DATA.socialMedia };
  form.links = { ...DEFAULT_CMS_DATA.links };
  form.faqs = [...DEFAULT_CMS_DATA.faqs];
  showResetModal.value = false;
  toast.info('Seluruh konten CMS dikembalikan ke nilai bawaan resmi Universitas BTH.');
};

// FAQ Helpers
const faqForm = reactive({
  category: 'Pendaftaran',
  question: '',
  answer: '',
});

const openAddFaqModal = () => {
  editingFaqIndex.value = null;
  faqForm.category = 'Pendaftaran';
  faqForm.question = '';
  faqForm.answer = '';
  showFaqModal.value = true;
};

const editFaq = (idx) => {
  editingFaqIndex.value = idx;
  const item = form.faqs[idx];
  faqForm.category = item.category || 'Pendaftaran';
  faqForm.question = item.question || '';
  faqForm.answer = item.answer || '';
  showFaqModal.value = true;
};

const saveFaqItem = () => {
  if (editingFaqIndex.value !== null) {
    form.faqs[editingFaqIndex.value] = {
      ...form.faqs[editingFaqIndex.value],
      category: faqForm.category,
      question: faqForm.question,
      answer: faqForm.answer,
    };
  } else {
    form.faqs.push({
      id: `faq-${Date.now()}`,
      category: faqForm.category,
      question: faqForm.question,
      answer: faqForm.answer,
    });
  }
  cmsStore.saveAll(form);
  showFaqModal.value = false;
  toast.success('Data FAQ berhasil diperbarui.');
};

const deleteFaq = (idx) => {
  form.faqs.splice(idx, 1);
  cmsStore.saveAll(form);
  toast.info('Item FAQ berhasil dihapus.');
};
</script>
