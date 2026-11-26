<template>
  <div class="space-y-6">
    <!-- Header Modul -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900">
          Formulir Biodata Calon Mahasiswa
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Lengkapi data identitas pribadi, domisili, orang tua/wali, dan riwayat pendidikan asal sekolah Anda.
        </p>
      </div>
      <div class="text-xs text-slate-500 font-sans self-start sm:self-auto">
        Status: <strong :class="applicantStore.isProfileComplete ? 'text-emerald-700' : 'text-amber-700'">{{ applicantStore.isProfileComplete ? 'Biodata Lengkap' : 'Biodata Belum Lengkap' }}</strong>
      </div>
    </div>

    <!-- Banner Ringkas OCR Auto-Fill KTP -->
    <div class="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <Camera class="w-4 h-4 text-[#1E3A8A] flex-shrink-0" />
        <p class="text-xs text-slate-600 font-sans">
          <strong class="text-slate-900 font-sora">Isi otomatis dari e-KTP:</strong> Unggah atau pindai foto KTP untuk mengisi NIK, nama, tanggal lahir, dan alamat.
        </p>
      </div>

      <button
        type="button"
        @click="isOcrModalOpen = true"
        class="rounded-xl px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 flex-shrink-0 cursor-pointer self-start sm:self-center"
      >
        <ScanLine class="w-3.5 h-3.5" />
        <span>Pindai Foto KTP</span>
      </button>
    </div>

    <form @submit.prevent="saveProfile" class="space-y-6">
      <!-- 1. Identitas Pribadi -->
      <div id="section-pribadi" class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm scroll-mt-24">
        <div class="text-xs font-sora font-bold text-[#1E3A8A] uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
          <span>1. Identitas Pribadi</span>
          <span class="text-[11px] text-slate-400 font-sans font-normal normal-case">Kolom dengan tanda (<span class="text-rose-500 font-bold">*</span>) wajib diisi</span>
        </div>

        <!-- Pasfoto Profil Mahasiswa (Terhubung dari Dokumen) -->
        <div class="mb-5 p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-xl bg-slate-200 text-slate-700 font-sora font-bold text-sm flex items-center justify-center flex-shrink-0 border border-slate-300 overflow-hidden shadow-2xs">
              <img
                v-if="applicantStore.candidatePhoto"
                :src="applicantStore.candidatePhoto"
                alt="Pasfoto Mahasiswa"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-xs text-slate-400 font-sans">4x6</span>
            </div>
            <div>
              <div class="font-sora font-semibold text-xs sm:text-sm text-slate-900">
                Foto Profil Mahasiswa
              </div>
              <p class="text-[11px] text-slate-500 mt-0.5">
                {{ applicantStore.candidatePhoto ? 'Pasfoto Anda telah terpasang pada profil akun dan kartu ujian.' : 'Unggah pasfoto formal pakaian berkerah ukuran 4x6 pada menu Berkas Persyaratan.' }}
              </p>
            </div>
          </div>

          <button
            type="button"
            @click="applicantStore.setActiveTab('documents')"
            class="text-xs font-semibold text-[#1E3A8A] hover:underline flex items-center gap-1 self-start sm:self-center cursor-pointer"
          >
            <span>{{ applicantStore.candidatePhoto ? 'Ganti Pasfoto' : 'Unggah Pasfoto' }}</span>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <!-- Kode Pendaftar -->
          <div>
            <label class="block font-medium text-slate-700 mb-1">Kode Pendaftar</label>
            <input
              :value="form.registrationNumber || applicantStore.state.candidate?.registrationNumber || 'BTH-2026-REG-XXXXX'"
              type="text"
              readonly
              class="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-300 rounded-xl outline-none text-slate-700 font-mono font-bold cursor-not-allowed"
            />
          </div>

          <!-- Nama Lengkap -->
          <div>
            <label class="block font-medium text-slate-700 mb-1">
              Nama Lengkap (Sesuai KTP/Ijazah) <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.fullName"
              type="text"
              required
              placeholder="Nama lengkap sesuai e-KTP / ijazah"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>

          <!-- Jenis Kelamin -->
          <div>
            <label class="block font-medium text-slate-700 mb-1">
              Jenis Kelamin <span class="text-rose-500">*</span>
            </label>
            <select
              v-model="form.gender"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            >
              <option value="" disabled>-- Pilih Jenis Kelamin --</option>
              <option value="Laki-laki">Laki-laki (L)</option>
              <option value="Perempuan">Perempuan (P)</option>
            </select>
          </div>

          <!-- Tempat Lahir -->
          <div>
            <label class="block font-medium text-slate-700 mb-1">
              Tempat Lahir <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.birthPlace"
              type="text"
              required
              placeholder="Kota / Kabupaten tempat lahir"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>

          <!-- Tanggal Lahir -->
          <div>
            <label class="block font-medium text-slate-700 mb-1">
              Tanggal Lahir <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.birthDate"
              type="date"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>

          <!-- Jenis Program -->
          <div>
            <label class="block font-medium text-slate-700 mb-1">
              Jenis Program Perkuliahan <span class="text-rose-500">*</span>
            </label>
            <select
              v-model="form.programType"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            >
              <option value="IPA">IPA (Sains & Farmasi)</option>
              <option value="IPS">IPS (Sosial & Humaniora)</option>
              <option value="Reguler">Reguler Pagi</option>
              <option value="Karyawan">Kelas Karyawan / Sore</option>
            </select>
          </div>

          <!-- Agama -->
          <div>
            <label class="block font-medium text-slate-700 mb-1">
              Agama <span class="text-rose-500">*</span>
            </label>
            <select
              v-model="form.religion"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            >
              <option value="">-- Pilih Agama --</option>
              <option value="Islam">Islam</option>
              <option value="Kristen">Kristen Protestan</option>
              <option value="Katolik">Katolik</option>
              <option value="Hindu">Hindu</option>
              <option value="Budha">Budha</option>
              <option value="Konghucu">Konghucu</option>
              <option value="Lain-lain">Lain-lain</option>
            </select>
          </div>

          <!-- NIK -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block font-medium text-slate-700">
                Nomor Induk Kependudukan (NIK) <span class="text-rose-500">*</span>
              </label>
              <span
                v-if="form.nik"
                class="text-[11px] font-mono"
                :class="nikValidation.status === 'valid' ? 'text-emerald-600 font-semibold' : nikValidation.status === 'duplicate' ? 'text-rose-600 font-bold' : 'text-slate-400'"
              >
                {{ form.nik.length }}/16 digit
              </span>
            </div>
            <div class="relative">
              <input
                :value="form.nik"
                @input="onNikInput"
                type="text"
                maxlength="16"
                required
                placeholder="Contoh: 327801XXXXXXXXXX (16 digit)"
                :class="[
                  'w-full px-3.5 py-2.5 bg-white border rounded-xl outline-none font-mono text-slate-800 transition-all',
                  nikValidation.status === 'duplicate'
                    ? 'border-rose-500 focus:border-rose-600 focus:ring-2 focus:ring-rose-100 bg-rose-50/30 text-rose-900 pr-10'
                    : nikValidation.status === 'valid'
                    ? 'border-emerald-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 pr-10'
                    : 'border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100'
                ]"
              />
              <div v-if="nikValidation.status === 'valid'" class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-600">
                <CheckCircle2 class="w-4 h-4" />
              </div>
              <div v-else-if="nikValidation.status === 'duplicate'" class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-rose-600">
                <AlertCircle class="w-4 h-4" />
              </div>
            </div>
            <!-- Notifikasi Validasi Real-time NIK -->
            <p v-if="nikValidation.status === 'duplicate'" class="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1.5 animate-fadeIn">
              <AlertCircle class="w-3.5 h-3.5 shrink-0 text-rose-600" />
              <span>{{ nikValidation.message }}</span>
            </p>
            <p v-else-if="nikValidation.status === 'valid'" class="text-[11px] text-emerald-600 font-medium mt-1.5 flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 class="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span>{{ nikValidation.message }}</span>
            </p>
            <p v-else-if="nikValidation.status === 'incomplete'" class="text-[11px] text-amber-600 mt-1.5 flex items-center gap-1.5">
              <Info class="w-3.5 h-3.5 shrink-0 text-amber-500" />
              <span>Nomor KTP harus terdiri dari tepat 16 digit angka.</span>
            </p>
          </div>

          <!-- No. KK -->
          <div>
            <label class="block font-medium text-slate-700 mb-1">
              Nomor Kartu Keluarga (No. KK)
            </label>
            <input
              v-model="form.familyCardNumber"
              type="text"
              maxlength="16"
              placeholder="Contoh: 327801XXXXXXXXXX (16 digit)"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-mono"
            />
          </div>

          <!-- NISN -->
          <div>
            <label class="block font-medium text-slate-700 mb-1">
              NISN (Nomor Induk Siswa Nasional)
            </label>
            <input
              v-model="form.nisn"
              type="text"
              maxlength="10"
              placeholder="Contoh: 0056789123 (10 digit)"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-mono"
            />
          </div>

          <!-- Kewarganegaraan -->
          <div>
            <label class="block font-medium text-slate-700 mb-1">
              Kewarganegaraan <span class="text-rose-500 font-semibold">*</span>
            </label>
            <select
              v-model="form.citizenship"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            >
              <option value="IDN">Indonesia (IDN)</option>
              <option value="MYS">Malaysia (MYS)</option>
              <option value="SGP">Singapura (SGP)</option>
              <option value="OTH">Warga Negara Asing (WNA)</option>
            </select>
          </div>

          <!-- Ukuran Jas Almamater -->
          <div>
            <label class="block font-medium text-slate-700 mb-1">
              Ukuran Jas Almamater <span class="text-rose-500 font-semibold">*</span>
            </label>
            <select
              v-model="form.almamaterSize"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans font-semibold"
            >
              <option value="S">S (Small)</option>
              <option value="M">M (Medium)</option>
              <option value="L">L (Large)</option>
              <option value="XL">XL (Extra Large)</option>
              <option value="XXL">XXL (Double XL)</option>
              <option value="XXXL">XXXL (Triple XL)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 2. Alamat Domisili & Kontak -->
      <div id="section-alamat" class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm scroll-mt-24">
        <div class="text-xs font-sora font-bold text-[#1E3A8A] uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
          <span>2. Alamat Domisili & Kontak</span>
          <span class="text-[10px] text-slate-400 font-normal">Sesuai KTP / Tempat Tinggal Sekarang</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div class="sm:col-span-2 lg:col-span-4">
            <label class="block font-medium text-slate-700 mb-1">
              Alamat Lengkap (Jalan, No. Rumah, Blok) <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.address"
              type="text"
              required
              placeholder="Contoh: Jl. Cilolohan No. 36, Kahuripan"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">
              RT / RW
            </label>
            <div class="flex items-center gap-2">
              <input
                v-model="form.rt"
                type="text"
                placeholder="No. RT"
                class="w-1/2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-[#1E3A8A]"
              />
              <span class="text-slate-400">/</span>
              <input
                v-model="form.rw"
                type="text"
                placeholder="No. RW"
                class="w-1/2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-[#1E3A8A]"
              />
            </div>
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">
              Desa / Kelurahan
            </label>
            <input
              v-model="form.subDistrict"
              type="text"
              placeholder="Nama desa atau kelurahan"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">
              Kota / Kabupaten <span class="text-rose-500 font-semibold">*</span>
            </label>
            <input
              v-model="form.city"
              type="text"
              required
              placeholder="Nama kota atau kabupaten domisili"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">
              Provinsi <span class="text-rose-500 font-semibold">*</span>
            </label>
            <input
              v-model="form.province"
              type="text"
              required
              placeholder="Nama provinsi domisili"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">
              Kodepos
            </label>
            <input
              v-model="form.postalCode"
              type="text"
              placeholder="Contoh: 46115"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] rounded-xl outline-none text-slate-800 font-mono"
            />
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">
              Nomor WhatsApp Aktif <span class="text-rose-500 font-semibold">*</span>
            </label>
            <input
              v-model="form.phone"
              type="tel"
              required
              placeholder="Contoh: 081234567890"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-mono"
            />
          </div>
          <div class="sm:col-span-2">
            <label class="block font-medium text-slate-700 mb-1">
              Alamat Email Aktif <span class="text-rose-500 font-semibold">*</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="nama.aktif@gmail.com"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>
        </div>
      </div>

      <!-- 3. Riwayat Asal Sekolah -->
      <div id="section-pendidikan" class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm scroll-mt-24">
        <div class="text-xs font-sora font-bold text-[#1E3A8A] uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
          <span>3. Riwayat Pendidikan Asal Sekolah</span>
          <span class="text-[10px] text-slate-400 font-normal">Data Sekolah Terakhir Pendaftar</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div class="sm:col-span-2">
            <label class="block font-medium text-slate-700 mb-1">
              Nama Asal Sekolah (SMA/SMK/MA/Sederajat) <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.schoolName"
              type="text"
              required
              placeholder="Contoh: SMA Negeri 1 Tasikmalaya / SMK Bhakti Kencana"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>

          <!-- Pendidikan Terakhir -->
          <div>
            <label class="block font-medium text-slate-700 mb-1">
              Pendidikan Terakhir <span class="text-rose-500">*</span>
            </label>
            <select
              v-model="form.lastEducation"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] rounded-xl outline-none text-slate-800 font-sans"
            >
              <option value="SMA">SMA - SMA/SMK/MA Sederajat</option>
              <option value="D1">D1 - Diploma 1</option>
              <option value="D2">D2 - Diploma 2</option>
              <option value="D3">D3 - Diploma 3</option>
              <option value="D4">D4 - Diploma 4</option>
              <option value="S1">S1 - Sarjana</option>
            </select>
          </div>

          <!-- ID Jenis Institusi -->
          <div>
            <label class="block font-medium text-slate-700 mb-1">
              Jenis Institusi Sekolah Asal <span class="text-rose-500">*</span>
            </label>
            <select
              v-model="form.institutionType"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] rounded-xl outline-none text-slate-800 font-sans"
            >
              <option value="7">Sekolah Menengah Atas / Kejuruan (SMA/SMK)</option>
              <option value="6">Sekolah Tinggi</option>
              <option value="8">Politeknik</option>
              <option value="5">Akademi</option>
              <option value="9">Institut</option>
            </select>
          </div>

          <div>
            <label class="block font-medium text-slate-700 mb-1">
              Jurusan Asal Sekolah <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.schoolMajor"
              type="text"
              required
              placeholder="Contoh: MIPA / Farmasi Klinis / Rekayasa Perangkat Lunak"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>

          <div>
            <label class="block font-medium text-slate-700 mb-1">
              Tahun Lulus <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.graduationYear"
              type="text"
              required
              placeholder="Contoh: 2026"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>

          <div>
            <label class="block font-medium text-slate-700 mb-1">
              NPSN Sekolah Asal
            </label>
            <input
              v-model="form.npsn"
              type="text"
              placeholder="Contoh: 20268912 (8 digit)"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] rounded-xl outline-none text-slate-800 font-mono"
            />
          </div>

          <div>
            <label class="block font-medium text-slate-700 mb-1">
              Nilai Rata-rata UAN / Rapor
            </label>
            <input
              v-model="form.unScore"
              type="text"
              placeholder="Contoh: 85.50 (skala 0 - 100)"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] rounded-xl outline-none text-slate-800 font-mono"
            />
          </div>
        </div>
      </div>

      <!-- 4. Data Orang Tua / Wali & Informasi Tambahan -->
      <div id="section-keluarga" class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm scroll-mt-24 space-y-5">
        <div class="text-xs font-sora font-bold text-[#1E3A8A] uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
          <span>4. Data Orang Tua & Informasi Tambahan</span>
          <span class="text-[10px] text-slate-400 font-normal">Ayah, Ibu, Pesantren & KIP Kuliah</span>
        </div>

        <!-- Sub: Data Ayah -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div class="text-xs font-bold text-slate-800 font-sora">A. Data Ayah Kandung</div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label class="block font-medium text-slate-700 mb-1">
                Nama Ayah <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.fatherName"
                type="text"
                required
                placeholder="Nama lengkap ayah kandung (tanpa gelar)"
                class="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 outline-none focus:border-[#1E3A8A]"
              />
            </div>
            <div>
              <label class="block font-medium text-slate-700 mb-1">
                Pekerjaan Ayah <span v-if="form.fatherLifeStatus !== '2'" class="text-rose-500 font-semibold">*</span>
              </label>
              <input
                v-model="form.fatherJob"
                type="text"
                :required="form.fatherLifeStatus !== '2'"
                :placeholder="form.fatherLifeStatus === '2' ? 'Almarhum' : 'Contoh: Wiraswasta / PNS / Karyawan Swasta'"
                class="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 outline-none focus:border-[#1E3A8A]"
              />
            </div>
            <div>
              <label class="block font-medium text-slate-700 mb-1">Pendidikan Ayah</label>
              <select
                v-model="form.fatherEducation"
                class="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 outline-none focus:border-[#1E3A8A]"
              >
                <option value="SD">SD</option>
                <option value="SMP">SMP</option>
                <option value="SMA">SMA/SMK</option>
                <option value="D3">D3</option>
                <option value="S1">S1</option>
                <option value="S2">S2</option>
              </select>
            </div>
            <div>
              <label class="block font-medium text-slate-700 mb-1">
                Status Hidup Ayah <span class="text-rose-500 font-semibold">*</span>
              </label>
              <select
                v-model="form.fatherLifeStatus"
                class="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 outline-none focus:border-[#1E3A8A]"
              >
                <option value="1">1 - Masih Hidup</option>
                <option value="2">2 - Meninggal Dunia</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Sub: Data Ibu -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div class="text-xs font-bold text-slate-800 font-sora">B. Data Ibu Kandung</div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label class="block font-medium text-slate-700 mb-1">
                Nama Ibu Kandung <span class="text-rose-500 font-semibold">*</span>
              </label>
              <input
                v-model="form.motherName"
                type="text"
                required
                placeholder="Nama lengkap ibu kandung (sesuai Kartu Keluarga)"
                class="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 outline-none focus:border-[#1E3A8A]"
              />
            </div>
            <div>
              <label class="block font-medium text-slate-700 mb-1">
                Pekerjaan Ibu <span v-if="form.motherLifeStatus !== '2'" class="text-rose-500 font-semibold">*</span>
              </label>
              <input
                v-model="form.motherJob"
                type="text"
                :required="form.motherLifeStatus !== '2'"
                :placeholder="form.motherLifeStatus === '2' ? 'Almarhumah' : 'Contoh: Ibu Rumah Tangga / Guru / Wiraswasta'"
                class="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 outline-none focus:border-[#1E3A8A]"
              />
            </div>
            <div>
              <label class="block font-medium text-slate-700 mb-1">Pendidikan Ibu</label>
              <select
                v-model="form.motherEducation"
                class="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 outline-none focus:border-[#1E3A8A]"
              >
                <option value="SD">SD</option>
                <option value="SMP">SMP</option>
                <option value="SMA">SMA/SMK</option>
                <option value="D3">D3</option>
                <option value="S1">S1</option>
                <option value="S2">S2</option>
              </select>
            </div>
            <div>
              <label class="block font-medium text-slate-700 mb-1">
                Status Hidup Ibu <span class="text-rose-500 font-semibold">*</span>
              </label>
              <select
                v-model="form.motherLifeStatus"
                class="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 outline-none focus:border-[#1E3A8A]"
              >
                <option value="1">1 - Masih Hidup</option>
                <option value="2">2 - Meninggal Dunia</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Sub: Informasi Tambahan (Pesantren, KIP Kuliah, Kontak Darurat) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label class="block font-medium text-slate-700 mb-1">
              Penghasilan Orang Tua / Bulan
            </label>
            <select
              v-model="form.parentIncome"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] rounded-xl outline-none text-slate-800 font-sans"
            >
              <option value="" disabled>-- Pilih Rentang Penghasilan --</option>
              <option value="< Rp 2.500.000">&lt; Rp 2.500.000 (Kurang dari 2,5 jt)</option>
              <option value="Rp 2.500.000 - Rp 5.000.000">Rp 2.500.000 - Rp 5.000.000</option>
              <option value="Rp 5.000.000 - Rp 10.000.000">Rp 5.000.000 - Rp 10.000.000</option>
              <option value="> Rp 10.000.000">&gt; Rp 10.000.000 (Lebih dari 10 jt)</option>
            </select>
          </div>

          <div>
            <label class="block font-medium text-slate-700 mb-1">Pernah Nyantri di Pesantren?</label>
            <select
              v-model="form.isPesantren"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] rounded-xl outline-none text-slate-800 font-sans"
            >
              <option value="0">Tidak</option>
              <option value="1">Ya (Alumni Pondok Pesantren)</option>
            </select>
          </div>

          <div>
            <label class="block font-medium text-slate-700 mb-1">Pengusul KIP Kuliah?</label>
            <select
              v-model="form.isKipKuliah"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] rounded-xl outline-none text-slate-800 font-sans"
            >
              <option value="0">Tidak (Reguler)</option>
              <option value="1">Ya (Memiliki Kartu KIP Kuliah)</option>
            </select>
          </div>

          <div>
            <label class="block font-medium text-slate-700 mb-1">
              Kontak Darurat Keluarga <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.emergencyContact"
              type="text"
              required
              placeholder="Contoh: 081223344556 (Bpk. Rahmat - Paman/Wali)"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>
        </div>
      </div>

      <!-- Tombol Aksi Simpan & Navigasi Antar Tahapan PMB -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            :class="applicantStore.isProfileComplete ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'"
          >
            <CheckCircle2 v-if="applicantStore.isProfileComplete" class="w-5 h-5 text-emerald-600" />
            <AlertCircle v-else class="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <div class="font-sora font-semibold text-xs sm:text-sm text-slate-900">
              {{ applicantStore.isProfileComplete ? 'Biodata Calon Mahasiswa Lengkap' : 'Pengisian Formulir Biodata' }}
            </div>
            <p class="text-[11px] text-slate-500 font-sans mt-0.5">
              {{ applicantStore.isProfileComplete ? 'Data identitas, domisili, dan riwayat sekolah Anda telah tersimpan.' : 'Simpan data biodata Anda sebelum melanjutkan ke pemilihan jalur & prodi.' }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="submit"
            :disabled="isSaving || nikValidation.status === 'duplicate'"
            class="w-full sm:w-auto rounded-xl px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Loader2 v-if="isSaving" class="animate-spin h-3.5 w-3.5 text-slate-600" />
            <span>{{ isSaving ? 'Menyimpan...' : 'Simpan Data Biodata' }}</span>
          </button>

          <button
            type="button"
            @click="goToAdmission"
            :disabled="nikValidation.status === 'duplicate'"
            class="w-full sm:w-auto rounded-xl px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Lanjut: Jalur Pendaftaran</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </form>

    <!-- Modal Scanner OCR KTP (Diekstrak ke Komponen Modular) -->
    <OcrKtpModal v-model="isOcrModalOpen" @apply="handleOcrApplied" />
  </div>
</template>

<script setup>
import {
  Camera,
  ScanLine,
  Loader2,
  Info,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-vue-next';
import { reactive, ref, watch, computed } from 'vue';
import { useApplicantStore } from '@/stores/applicant';
import { useAuthStore } from '@/stores/auth';
import { identityApi } from '@/api';
import { useToast } from '@/composables/useToast';
import OcrKtpModal from '@/components/applicant/OcrKtpModal.vue';

const emit = defineEmits(['switch-tab']);
const applicantStore = useApplicantStore();
const authStore = useAuthStore();
const toast = useToast();

const form = reactive({ ...applicantStore.state.candidate });
const isSaving = ref(false);
const isOcrModalOpen = ref(false);

watch(
  () => applicantStore.state.candidate,
  (newCandidate) => {
    Object.assign(form, newCandidate);
  },
  { deep: true }
);

const onNikInput = (e) => {
  const digits = (e.target?.value || '').replace(/\D/g, '').slice(0, 16);
  form.nik = digits;
};

const nikValidation = computed(() => {
  const val = String(form.nik || '').trim().replace(/\D/g, '');
  if (!val) {
    return { status: 'empty', message: '' };
  }
  if (val.length < 16) {
    return {
      status: 'incomplete',
      message: `${val.length}/16 digit (masukkan 16 digit lengkap)`,
    };
  }
  const dup = applicantStore.checkNikDuplication(val);
  if (dup.isDuplicate) {
    return {
      status: 'duplicate',
      message: `NIK ini sudah terdaftar pada akun lain (${dup.conflictName || 'Pendaftar lain'}). Satu NIK hanya dapat digunakan untuk satu akun pendaftar.`,
      conflictName: dup.conflictName,
    };
  }
  return {
    status: 'valid',
    message: 'NIK valid & belum pernah terdaftar di sistem.',
  };
});

const goToAdmission = () => {
  if (nikValidation.value.status === 'duplicate') {
    toast.error(`NIK ${form.nik} sudah digunakan oleh akun lain (${nikValidation.value.conflictName || 'Pendaftar lain'}). Mohon gunakan NIK Anda sendiri sebelum melanjutkan.`);
    return;
  }
  emit('switch-tab', 'admission');
  applicantStore.setActiveTab('admission');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleOcrApplied = ({ fields, file }) => {
  if (!fields) return;

  if (fields.nik?.value) {
    const cleanOcrNik = String(fields.nik.value).trim().replace(/\D/g, '').slice(0, 16);
    const dupCheck = applicantStore.checkNikDuplication(cleanOcrNik);
    if (dupCheck.isDuplicate) {
      toast.error(`NIK pada e-KTP (${cleanOcrNik}) sudah terdaftar pada akun lain (${dupCheck.conflictName || 'Pendaftar lain'}). Formulir tidak dapat diisi dengan NIK yang sama.`);
      return;
    }
    form.nik = cleanOcrNik;
  }
  if (fields.nama?.value) form.fullName = fields.nama.value;
  if (fields.tempat_lahir?.value) form.birthPlace = fields.tempat_lahir.value;
  if (fields.tanggal_lahir?.value) form.birthDate = fields.tanggal_lahir.value;

  if (fields.jenis_kelamin?.value) {
    const val = fields.jenis_kelamin.value.trim().toUpperCase();
    form.gender = val.startsWith('L') ? 'Laki-laki' : 'Perempuan';
  }

  if (fields.agama?.value) {
    const ag = fields.agama.value.trim().toUpperCase();
    const mapAgama = {
      ISLAM: 'Islam',
      KRISTEN: 'Kristen',
      KATOLIK: 'Katolik',
      HINDU: 'Hindu',
      BUDDHA: 'Buddha',
      KONGHUCU: 'Konghucu',
    };
    form.religion = mapAgama[ag] || fields.agama.value;
  }

  if (fields.alamat?.value) {
    let fullAddr = fields.alamat.value;
    if (fields.rt_rw?.value) fullAddr += `, RT/RW: ${fields.rt_rw.value}`;
    if (fields.kel_desa?.value) fullAddr += `, Kel. ${fields.kel_desa.value}`;
    if (fields.kecamatan?.value) fullAddr += `, Kec. ${fields.kecamatan.value}`;
    form.address = fullAddr;
  }

  if (fields.kota?.value && !form.city) form.city = fields.kota.value;
  if (fields.provinsi?.value && !form.province) form.province = fields.provinsi.value;

  try {
    applicantStore.updateProfile(form);
  } catch (storeErr) {
    if (storeErr.message && storeErr.message.startsWith('DUPLICATE_NIK:')) {
      toast.error(storeErr.message.replace('DUPLICATE_NIK: ', ''));
      return;
    }
  }

  if (file) {
    const ktpDoc = applicantStore.state.documents.find((d) => d.id === 'doc-2');
    if (ktpDoc && ktpDoc.status === 'unuploaded') {
      const blobUrl = URL.createObjectURL(file);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const formattedSize = sizeMb > 0.1 ? `${sizeMb} MB` : `${Math.round(file.size / 1024)} KB`;
      applicantStore.uploadDocument('doc-2', {
        name: file.name,
        size: formattedSize,
        fileBlobUrl: blobUrl,
        fileType: file.type || 'image/jpeg',
        notes: 'Foto e-KTP diunggah melalui pemindai KTP.',
      });
    }
  }

  isOcrModalOpen.value = false;
  toast.success('Data e-KTP berhasil dimasukkan ke formulir biodata.');
};

const saveProfile = async () => {
  const cleanNik = String(form.nik || '').trim().replace(/\D/g, '');
  if (!cleanNik) {
    toast.error('Nomor Induk Kependudukan (NIK) wajib diisi.');
    return;
  }
  if (cleanNik.length !== 16) {
    toast.error('NIK tidak valid. NIK wajib terdiri dari tepat 16 digit angka.');
    return;
  }

  const dupCheck = applicantStore.checkNikDuplication(cleanNik);
  if (dupCheck.isDuplicate) {
    toast.error(`Penyimpanan ditolak: NIK ${cleanNik} sudah terdaftar pada akun lain (${dupCheck.conflictName || 'Pendaftar lain'}). Duplikasi akun dicegah.`);
    return;
  }

  isSaving.value = true;
  try {
    // Sinkronisasi data ke microservices backend (Auth, Identity, Admission)
    const hasAuthToken = authStore.isAuthenticated && (authStore.accessToken || authStore.token);
    if (hasAuthToken) {
      // 1. Auth service profile
      await authStore.updateProfile({
        full_name: form.fullName,
        phone: form.phone || '',
      }).catch(() => null);

      // 2. Identity service profile (NIK, tempat/tgl lahir, gender, agama)
      try {
        await identityApi.updateProfile({
          full_name: form.fullName,
          nik: cleanNik,
          birth_place: form.birthPlace,
          birth_date: form.birthDate,
          gender: form.gender === 'Laki-laki' ? 'L' : 'P',
          religion: form.religion || 'Islam',
          nationality: 'WNI',
          phone: form.phone || '',
        });
      } catch (idErr) {
        if (idErr.response?.data?.error_code === 'DUPLICATE_NIK' || idErr.response?.status === 409) {
          toast.error(idErr.response?.data?.message || 'NIK sudah terdaftar pada akun calon mahasiswa lain di sistem.');
          isSaving.value = false;
          return;
        }
        console.warn('Identity service update warning:', idErr);
      }

      // 3. Identity service address
      await identityApi.updateAddress({
        type: 'ktp',
        street: form.address || '',
        city: form.city || '',
        province: form.province || '',
        postal_code: form.postalCode || '',
      }).catch(() => null);

      // 4. Identity service guardian
      if (form.fatherName || form.motherName) {
        await identityApi.updateGuardian({
          relation: 'ayah',
          name: form.fatherName || '',
          occupation: form.fatherJob || '',
          income_range: form.parentIncome || '',
          phone: form.emergencyContact || '',
        }).catch(() => null);
      }

      // 5. Identity service education
      if (form.schoolName) {
        await identityApi.updateEducation({
          level: 'SMA',
          school_name: form.schoolName,
          major: form.schoolMajor || '',
          graduation_year: parseInt(form.graduationYear) || 2024,
        }).catch(() => null);
      }
    }

    applicantStore.updateProfile({ ...form, nik: cleanNik });
    toast.success('Formulir biodata calon mahasiswa berhasil disimpan.');
  } catch (err) {
    if (err.message && err.message.startsWith('DUPLICATE_NIK:')) {
      toast.error(err.message.replace('DUPLICATE_NIK: ', ''));
      return;
    }
    console.warn('Gagal update profile ke backend:', err);
    toast.info('Biodata tersimpan di penyimpanan browser lokal.');
  } finally {
    isSaving.value = false;
  }
};
</script>
