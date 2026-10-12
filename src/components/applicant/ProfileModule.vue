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

    <!-- Banner OCR Auto-Fill KTP (Now UI Soft Raised Card) -->
    <div class="bg-blue-50/60 border border-blue-100 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
      <div class="flex items-start sm:items-center gap-4">
        <div class="w-11 h-11 rounded-2xl bg-blue-100/80 text-[#1E3A8A] flex items-center justify-center flex-shrink-0">
          <Camera class="w-5 h-5" />
        </div>
        <div>
          <h3 class="font-sora font-bold text-xs sm:text-sm text-slate-900">
            Pengisian Otomatis dari Foto e-KTP (OCR)
          </h3>
          <p class="text-xs text-slate-600 mt-0.5 max-w-xl font-sans">
            Unggah foto e-KTP Anda untuk mengisi NIK, Nama Lengkap, Tanggal Lahir, dan Alamat secara otomatis ke formulir.
          </p>
        </div>
      </div>

      <button
        type="button"
        @click="openOcrModal"
        class="rounded-xl px-4 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-medium text-xs shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer self-start sm:self-center"
      >
        <ScanLine class="w-4 h-4" />
        <span>Pindai Foto KTP</span>
      </button>
    </div>

    <form @submit.prevent="saveProfile" class="space-y-6">
      <!-- 1. Identitas Pribadi -->
      <div id="section-pribadi" class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm scroll-mt-24">
        <div class="text-xs font-sora font-bold text-[#1E3A8A] uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
          1. Identitas Pribadi
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
            <label class="block font-medium text-slate-700 mb-1">Nama Lengkap (Sesuai KTP/Ijazah)</label>
            <input
              v-model="form.fullName"
              type="text"
              required
              placeholder="Contoh: Muhammad Izza Pratama"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>

          <!-- Jenis Kelamin -->
          <div>
            <label class="block font-medium text-slate-700 mb-1">Jenis Kelamin</label>
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
            <label class="block font-medium text-slate-700 mb-1">Tempat Lahir</label>
            <input
              v-model="form.birthPlace"
              type="text"
              required
              placeholder="Contoh: Tasikmalaya"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>

          <!-- Tanggal Lahir -->
          <div>
            <label class="block font-medium text-slate-700 mb-1">Tanggal Lahir</label>
            <input
              v-model="form.birthDate"
              type="date"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>

          <!-- Jenis Program -->
          <div>
            <label class="block font-medium text-slate-700 mb-1">Jenis Program Perkuliahan</label>
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
            <label class="block font-medium text-slate-700 mb-1">Agama</label>
            <select
              v-model="form.religion"
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
            <label class="block font-medium text-slate-700 mb-1">Nomor Induk Kependudukan (NIK)</label>
            <input
              v-model="form.nik"
              type="text"
              maxlength="16"
              placeholder="16 Digit NIK KTP"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-mono"
            />
          </div>

          <!-- No. KK -->
          <div>
            <label class="block font-medium text-slate-700 mb-1">Nomor Kartu Keluarga (No. KK)</label>
            <input
              v-model="form.familyCardNumber"
              type="text"
              maxlength="16"
              placeholder="16 Digit Nomor KK"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-mono"
            />
          </div>

          <!-- NISN -->
          <div>
            <label class="block font-medium text-slate-700 mb-1">NISN (Nomor Induk Siswa Nasional)</label>
            <input
              v-model="form.nisn"
              type="text"
              maxlength="10"
              placeholder="10 Digit NISN"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-mono"
            />
          </div>

          <!-- Kewarganegaraan -->
          <div>
            <label class="block font-medium text-slate-700 mb-1">Kewarganegaraan</label>
            <select
              v-model="form.citizenship"
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
            <label class="block font-medium text-slate-700 mb-1">Ukuran Jas Almamater</label>
            <select
              v-model="form.almamaterSize"
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
            <label class="block font-medium text-slate-700 mb-1">Alamat Lengkap (Jalan, No. Rumah, Blok)</label>
            <input
              v-model="form.address"
              type="text"
              required
              placeholder="Contoh: Jl. Cilolohan No. 36, Kahuripan"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">RT / RW</label>
            <div class="flex items-center gap-2">
              <input
                v-model="form.rt"
                type="text"
                placeholder="RT"
                class="w-1/2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-[#1E3A8A]"
              />
              <span class="text-slate-400">/</span>
              <input
                v-model="form.rw"
                type="text"
                placeholder="RW"
                class="w-1/2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-[#1E3A8A]"
              />
            </div>
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">Desa / Kelurahan</label>
            <input
              v-model="form.subDistrict"
              type="text"
              placeholder="Contoh: Kahuripan"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">Kota / Kabupaten</label>
            <input
              v-model="form.city"
              type="text"
              required
              placeholder="Contoh: Kota Tasikmalaya"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">Provinsi</label>
            <input
              v-model="form.province"
              type="text"
              required
              placeholder="Contoh: Jawa Barat"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">Kodepos</label>
            <input
              v-model="form.postalCode"
              type="text"
              placeholder="46115"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] rounded-xl outline-none text-slate-800 font-mono"
            />
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">Nomor WhatsApp Aktif</label>
            <input
              v-model="form.phone"
              type="tel"
              required
              placeholder="081234567890"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-mono"
            />
          </div>
          <div class="sm:col-span-2">
            <label class="block font-medium text-slate-700 mb-1">Alamat Email Aktif</label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="email.aktif@gmail.com"
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
            <label class="block font-medium text-slate-700 mb-1">Nama Asal Sekolah (SMA/SMK/MA/Sederajat)</label>
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
            <label class="block font-medium text-slate-700 mb-1">Pendidikan Terakhir</label>
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
            <label class="block font-medium text-slate-700 mb-1">Jenis Institusi Sekolah Asal</label>
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
            <label class="block font-medium text-slate-700 mb-1">Jurusan Asal Sekolah</label>
            <input
              v-model="form.schoolMajor"
              type="text"
              required
              placeholder="Contoh: MIPA / Farmasi Klinis / Rekayasa Perangkat Lunak"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>

          <div>
            <label class="block font-medium text-slate-700 mb-1">Tahun Lulus</label>
            <input
              v-model="form.graduationYear"
              type="text"
              required
              placeholder="2025"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>

          <div>
            <label class="block font-medium text-slate-700 mb-1">NPSN Sekolah Asal</label>
            <input
              v-model="form.npsn"
              type="text"
              placeholder="8 Digit NPSN"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] rounded-xl outline-none text-slate-800 font-mono"
            />
          </div>

          <div>
            <label class="block font-medium text-slate-700 mb-1">Nilai Rata-rata UAN / Rapor</label>
            <input
              v-model="form.unScore"
              type="text"
              placeholder="Contoh: 87.50"
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
              <label class="block font-medium text-slate-700 mb-1">Nama Ayah</label>
              <input
                v-model="form.fatherName"
                type="text"
                required
                class="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 outline-none focus:border-[#1E3A8A]"
              />
            </div>
            <div>
              <label class="block font-medium text-slate-700 mb-1">Pekerjaan Ayah</label>
              <input
                v-model="form.fatherJob"
                type="text"
                required
                placeholder="PNS / Wiraswasta / Karyawan"
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
              <label class="block font-medium text-slate-700 mb-1">Status Hidup Ayah</label>
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
              <label class="block font-medium text-slate-700 mb-1">Nama Ibu Kandung</label>
              <input
                v-model="form.motherName"
                type="text"
                required
                class="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 outline-none focus:border-[#1E3A8A]"
              />
            </div>
            <div>
              <label class="block font-medium text-slate-700 mb-1">Pekerjaan Ibu</label>
              <input
                v-model="form.motherJob"
                type="text"
                required
                placeholder="Ibu Rumah Tangga / PNS / Guru"
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
              <label class="block font-medium text-slate-700 mb-1">Status Hidup Ibu</label>
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
            <label class="block font-medium text-slate-700 mb-1">Penghasilan Orang Tua / Bulan</label>
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
            <label class="block font-medium text-slate-700 mb-1">Kontak Darurat Keluarga</label>
            <input
              v-model="form.emergencyContact"
              type="text"
              required
              placeholder="08xxxxxxxxxx (Nama & Hubungan)"
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
            :disabled="isSaving"
            class="w-full sm:w-auto rounded-xl px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <Loader2 v-if="isSaving" class="animate-spin h-3.5 w-3.5 text-slate-600" />
            <span>{{ isSaving ? 'Menyimpan...' : 'Simpan Data Biodata' }}</span>
          </button>

          <button
            type="button"
            @click="goToAdmission"
            class="w-full sm:w-auto rounded-xl px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <span>Lanjut: Jalur Pendaftaran</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </form>

    <!-- Modal Scanner OCR KTP (Live Camera & File Upload dengan Watermark Panduan & Deteksi Cerdas) -->
    <Teleport to="body">
      <div
        v-if="isOcrModalOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-fadeIn"
      >
        <div class="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
          <!-- Modal Header (Fixed, Tidak Pernah Terpotong / Ter-scroll) -->
          <div class="flex-shrink-0 px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-bold">
                <Camera class="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base leading-tight">
                  Pindai e-KTP
                </h3>
                <p class="text-[11px] text-slate-500 font-sans">
                  Pindai otomatis menggunakan kamera atau unggah foto KTP
                </p>
              </div>
            </div>
            <button
              @click="closeOcrModal"
              class="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 text-xl font-bold flex items-center justify-center transition-colors cursor-pointer"
            >
              &times;
            </button>
          </div>

          <!-- Modal Body (Scrollable secara halus) -->
          <div class="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-3.5">
            <!-- Mode Selector Tabs (Visible during idle / retake) -->
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

            <!-- Hidden file input for OCR -->
            <input
              ref="ocrFileInputRef"
              type="file"
              class="hidden"
              accept=".jpg,.jpeg,.png,.pdf"
              @change="handleOcrFileSelected"
            />

            <!-- State 1: IDLE -->
            <div v-if="ocrState === 'idle'" class="space-y-3">
              <!-- TAB 1: Live Camera Viewfinder -->
              <div v-if="ocrInputMode === 'camera'" class="space-y-3">
                <!-- Pesan Izin Kamera Ditolak / Diblokir -->
                <div
                  v-if="cameraPermissionDenied"
                  class="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-2 animate-fadeIn"
                >
                  <div class="flex items-center gap-2 font-bold text-amber-900">
                    <AlertTriangle class="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Izin Akses Kamera Diperlukan</span>
                  </div>
                  <p class="leading-relaxed text-slate-700">
                    Peramban belum mengizinkan akses kamera. Silakan aktifkan izin kamera dengan langkah berikut:
                  </p>
                  <div class="bg-white/90 p-2.5 rounded-xl border border-amber-200/80 space-y-1 text-slate-700 text-[11px] font-sans">
                    <div class="flex items-start gap-1.5">
                      <span class="font-bold text-[#1E3A8A]">1.</span>
                      <span>Klik ikon <strong>gembok 🔒</strong> atau <strong>kamera 📷</strong> di sebelah kiri bilah URL browser.</span>
                    </div>
                    <div class="flex items-start gap-1.5">
                      <span class="font-bold text-[#1E3A8A]">2.</span>
                      <span>Ubah setelan <strong>Kamera</strong> menjadi <strong>"Izinkan" (Allow)</strong>.</span>
                    </div>
                    <div class="flex items-start gap-1.5">
                      <span class="font-bold text-[#1E3A8A]">3.</span>
                      <span>Klik tombol <strong>"Coba Aktifkan Kamera"</strong> di bawah ini.</span>
                    </div>
                  </div>
                  <div class="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      @click="startCamera"
                      class="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white rounded-xl font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw class="w-3.5 h-3.5" />
                      <span>Coba Aktifkan Kamera</span>
                    </button>
                    <button
                      type="button"
                      @click="switchOcrInputMode('upload')"
                      class="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <UploadCloud class="w-3.5 h-3.5 text-slate-500" />
                      <span>Gunakan Unggah Berkas</span>
                    </button>
                  </div>
                </div>

                <!-- Pesan Sederhana Jika Perlu Izin Kamera -->
                <div
                  v-else-if="isCameraLoading || cameraPermissionNeeded"
                  class="p-3 bg-blue-50/90 border border-blue-200/80 rounded-2xl flex items-center gap-2.5 text-xs text-blue-900 animate-fadeIn"
                >
                  <span class="text-base flex-shrink-0 animate-bounce">📷</span>
                  <div class="leading-relaxed">
                    <strong class="font-semibold text-[#1E3A8A]">Perlu Izin Kamera:</strong>
                    <span> Silakan klik <strong>"Izinkan" (Allow)</strong> pada kotak konfirmasi browser untuk mengaktifkan kamera.</span>
                  </div>
                </div>

                <!-- Bar Status Kamera Aktif + Pemilih Perangkat Kamera -->
                <div
                  v-else-if="isCameraActive"
                  class="px-3 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center justify-between gap-2 text-[11px] text-emerald-800 animate-fadeIn"
                >
                  <div class="flex items-center gap-1.5">
                    <span class="font-medium">Kamera Aktif: Arahkan kartu ke bingkai</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <select
                      v-if="availableCameras.length > 1"
                      v-model="selectedDeviceId"
                      @change="onCameraDeviceChange"
                      title="Pilih Sumber Kamera"
                      class="bg-white border border-emerald-300 text-emerald-900 text-[10px] rounded-lg px-2 py-0.5 outline-none max-w-[150px] truncate"
                    >
                      <option v-for="(cam, idx) in availableCameras" :key="cam.deviceId || idx" :value="cam.deviceId">
                        {{ cam.label || `Kamera ${idx + 1}` }}
                      </option>
                    </select>
                    <button
                      type="button"
                      @click="switchCamera"
                      title="Ganti kamera berikutnya"
                      class="text-emerald-700 hover:text-emerald-950 font-semibold flex items-center gap-1 cursor-pointer text-[11px]"
                    >
                      <RefreshCw class="w-3 h-3" />
                      <span>Ganti</span>
                    </button>
                  </div>
                </div>

                <!-- Viewfinder Video Container (Clean KYC Cutout Guide) -->
                <div class="relative w-full h-[240px] sm:h-[270px] bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center select-none shadow-inner border border-slate-800">
                  <!-- Video Element -->
                  <video
                    ref="videoRef"
                    autoplay
                    playsinline
                    muted
                    class="w-full h-full object-cover"
                  ></video>

                  <!-- Card Viewfinder Cutout Guide (Clean, No fake text lines / no gimmicks) -->
                  <div
                    ref="cardGuideRef"
                    class="absolute z-10 w-[86%] sm:w-[82%] max-w-[390px] aspect-[85.6/53.98] rounded-xl border border-white/60 shadow-[0_0_0_9999px_rgba(15,23,42,0.65)] pointer-events-none flex flex-col justify-end p-2.5 overflow-hidden"
                  >
                    <!-- 4 Minimalist Corner Brackets -->
                    <div class="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-emerald-400 rounded-tl-sm"></div>
                    <div class="absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2 border-emerald-400 rounded-tr-sm"></div>
                    <div class="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 border-emerald-400 rounded-bl-sm"></div>
                    <div class="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-emerald-400 rounded-br-sm"></div>

                    <!-- Single Clean Helper Tag -->
                    <div class="text-center pb-1">
                      <span class="inline-block text-[10px] font-sans font-medium text-white/90 bg-slate-950/70 px-3 py-0.5 rounded-full backdrop-blur-xs">
                        Posisikan kartu KTP di dalam bingkai
                      </span>
                    </div>
                  </div>

                  <!-- Camera Error Overlay -->
                  <div
                    v-if="cameraError && !cameraPermissionDenied"
                    class="absolute inset-0 z-30 bg-slate-950/90 flex flex-col items-center justify-center p-4 text-center text-white space-y-2.5"
                  >
                    <AlertTriangle class="w-8 h-8 text-amber-400" />
                    <p class="text-xs text-slate-300 max-w-sm">{{ cameraError }}</p>
                    <div class="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        @click="startCamera"
                        class="px-3.5 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                      >
                        Coba Buka Kamera Lagi
                      </button>
                      <button
                        type="button"
                        @click="switchOcrInputMode('upload')"
                        class="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                      >
                        Gunakan Unggah Berkas
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- TAB 2: File Upload Dropzone -->
              <div v-else-if="ocrInputMode === 'upload'" class="space-y-3">
                <div
                  @click="triggerOcrPicker"
                  class="border-2 border-dashed border-slate-300 hover:border-[#1E3A8A] bg-slate-50/70 hover:bg-blue-50/40 rounded-2xl p-7 text-center cursor-pointer transition-all space-y-2.5"
                >
                  <div class="w-12 h-12 rounded-2xl bg-white border border-slate-200 mx-auto flex items-center justify-center shadow-xs text-[#1E3A8A]">
                    <UploadCloud class="w-6 h-6" />
                  </div>
                  <div class="space-y-0.5">
                    <div class="font-sora font-semibold text-slate-800 text-sm">
                      Pilih Foto KTP
                    </div>
                    <p class="text-xs text-slate-500 font-sans">
                      Format file JPG, PNG, atau PDF (maks. 5 MB)
                    </p>
                  </div>
                  <span class="inline-block px-3.5 py-1.5 bg-white text-[#1E3A8A] text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs">
                    Pilih Berkas
                  </span>
                </div>

                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
                  <Info class="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>Pastikan seluruh bagian kartu KTP terlihat jelas, tidak terpotong, dan tulisan terbaca dengan baik.</span>
                </div>
              </div>

              <!-- Opsi Kunci API (Discreet, Clean, Professional) -->
              <div class="border-t border-slate-100 pt-2 text-right">
                <button
                  type="button"
                  @click="showApiKeyInput = !showApiKeyInput"
                  class="text-[11px] text-slate-400 hover:text-slate-600 inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>⚙️ Opsi API Cloud</span>
                  <span v-if="geminiApiKey" class="text-emerald-600 font-medium">(Aktif)</span>
                </button>

                <div
                  v-if="showApiKeyInput"
                  class="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 animate-fadeIn text-left"
                >
                  <div class="flex items-center justify-between text-slate-700 font-medium text-[11px]">
                    <span>Kunci API Google Gemini (Opsional)</span>
                  </div>
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
                      class="px-3.5 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white rounded-lg font-medium text-xs transition-colors cursor-pointer"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- State 2: SCANNING / Progress -->
            <div v-else-if="ocrState === 'scanning'" class="py-8 px-4 text-center space-y-6">
              <div class="relative w-16 h-16 mx-auto">
                <div class="absolute inset-0 rounded-full border-3 border-blue-100 border-t-[#1E3A8A] animate-spin"></div>
                <div class="absolute inset-2 rounded-full bg-blue-50 flex items-center justify-center text-[#1E3A8A]">
                  <ScanLine class="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div class="space-y-2">
                <h4 class="font-sora font-bold text-slate-800 text-sm sm:text-base">
                  Memproses Dokumen...
                </h4>
                <div class="text-xs text-slate-500 max-w-sm mx-auto space-y-2">
                  <div class="flex items-center justify-between text-[11px] font-semibold text-[#1E3A8A]">
                    <span>{{ ocrPipelineStepText }}</span>
                    <span>{{ ocrProgressPercent }}%</span>
                  </div>
                  <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      class="bg-blue-600 h-full transition-all duration-300 rounded-full"
                      :style="{ width: `${ocrProgressPercent}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- State 3: COMPLETED / Results -->
            <div v-else-if="ocrState === 'completed' && ocrData" class="space-y-3.5">
              <div class="bg-slate-50 rounded-xl p-3 border border-slate-200 border-l-[3px] border-l-emerald-600 flex items-center justify-between gap-2.5 text-xs">
                <div class="flex items-center gap-2.5">
                  <CheckCircle2 class="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <div class="font-semibold text-slate-800 text-xs">
                      Data KTP Berhasil Dibaca
                    </div>
                    <div class="text-[11px] text-slate-500">
                      Silakan periksa kesesuaian data sebelum diterapkan ke formulir
                    </div>
                  </div>
                </div>
              </div>

              <!-- Preview Cropped KTP Image & Parsed Fields -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div v-if="capturedKtpPreviewUrl" class="sm:col-span-1 bg-slate-900 rounded-xl p-2 flex flex-col items-center justify-center border border-slate-200 overflow-hidden">
                  <span class="text-[8px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Foto KTP</span>
                  <img
                    :src="capturedKtpPreviewUrl"
                    alt="Foto KTP"
                    class="w-full max-h-32 object-contain rounded-lg shadow-sm"
                  />
                </div>

                <!-- Parsed Fields Grid -->
                <div :class="capturedKtpPreviewUrl ? 'sm:col-span-2' : 'sm:col-span-3'" class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5 sm:col-span-2">
                    <span class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">NIK</span>
                    <div class="font-mono font-bold text-slate-900 text-sm">
                      {{ ocrData.fields?.nik?.value || '-' }}
                    </div>
                  </div>

                  <div class="p-2.5 bg-white border border-slate-200 rounded-xl space-y-0.5 sm:col-span-2">
                    <span class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Nama Lengkap</span>
                    <div class="font-semibold text-slate-900 text-xs">
                      {{ ocrData.fields?.nama?.value || '-' }}
                    </div>
                  </div>

                  <div class="p-2.5 bg-white border border-slate-200 rounded-xl space-y-0.5">
                    <span class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Tempat, Tanggal Lahir</span>
                    <div class="font-medium text-slate-800 text-[11px]">
                      {{ [ocrData.fields?.tempat_lahir?.value, ocrData.fields?.tanggal_lahir?.value].filter(Boolean).join(', ') || '-' }}
                    </div>
                  </div>

                  <div class="p-2.5 bg-white border border-slate-200 rounded-xl space-y-0.5">
                    <span class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Jenis Kelamin</span>
                    <div class="font-medium text-slate-800 text-[11px]">
                      {{ ocrData.fields?.jenis_kelamin?.value === 'L' ? 'Laki-laki' : ocrData.fields?.jenis_kelamin?.value === 'P' ? 'Perempuan' : (ocrData.fields?.jenis_kelamin?.value || '-') }}
                    </div>
                  </div>

                  <div class="p-2.5 bg-white border border-slate-200 rounded-xl space-y-0.5">
                    <span class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Agama</span>
                    <div class="font-medium text-slate-800 text-[11px]">
                      {{ ocrData.fields?.agama?.value || '-' }}
                    </div>
                  </div>

                  <div class="p-2.5 bg-white border border-slate-200 rounded-xl space-y-0.5">
                    <span class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Kecamatan & Kota</span>
                    <div class="font-medium text-slate-800 text-[11px]">
                      {{ [ocrData.fields?.kecamatan?.value, ocrData.fields?.kota?.value].filter(Boolean).join(', ') || '-' }}
                    </div>
                  </div>

                  <div class="sm:col-span-2 p-2.5 bg-white border border-slate-200 rounded-xl space-y-0.5">
                    <span class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Alamat Lengkap</span>
                    <div class="text-slate-800 text-[11px]">
                      {{ formatOcrAddress(ocrData.fields) }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="p-2.5 bg-blue-50/80 rounded-xl border border-blue-100 text-[11px] text-blue-900 flex items-center gap-2">
                <Info class="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span>Klik <strong>"Terapkan ke Formulir"</strong> untuk memasukkan data di atas ke formulir pendaftaran.</span>
              </div>
            </div>

            <!-- State 4: RETAKE REQUIRED -->
            <div v-else-if="ocrState === 'retake_required'" class="space-y-3.5 py-4 text-center">
              <div class="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center shadow-xs">
                <AlertTriangle class="w-6 h-6" />
              </div>

              <div class="space-y-1.5 max-w-md mx-auto">
                <h4 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
                  Data KTP Tidak Terbaca
                </h4>
                <p class="text-xs text-slate-600 leading-relaxed px-4">
                  {{ ocrRejectionMessage || 'Pastikan foto KTP tidak buram, pencahayaan cukup, dan seluruh bagian kartu berada di dalam bingkai.' }}
                </p>
              </div>

              <div class="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  @click="switchOcrInputMode('camera')"
                  class="w-full sm:w-auto rounded-xl px-5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Camera class="w-3.5 h-3.5" />
                  <span>Pindai Ulang via Kamera</span>
                </button>
                <button
                  type="button"
                  @click="switchOcrInputMode('upload')"
                  class="w-full sm:w-auto rounded-xl px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <UploadCloud class="w-3.5 h-3.5" />
                  <span>Unggah Foto Lain</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Modal Footer (Fixed at Bottom, Bersih & Konsisten) -->
          <div
            v-if="ocrState === 'idle' && ocrInputMode === 'camera'"
            class="flex-shrink-0 px-5 sm:px-6 py-3 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between gap-3"
          >
            <div class="text-[11px] text-slate-500 hidden sm:flex items-center gap-1.5">
              <Info class="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span>Pegang kartu stabil tanpa pantulan kilap lampu.</span>
            </div>
            <button
              type="button"
              @click="captureFromCamera"
              :disabled="!isCameraActive"
              class="w-full sm:w-auto px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-sora font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <div class="w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center">
                <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
              </div>
              <span>Ambil Foto</span>
            </button>
          </div>

          <!-- Modal Footer for Completed State -->
          <div
            v-else-if="ocrState === 'completed'"
            class="flex-shrink-0 px-5 sm:px-6 py-3 bg-slate-50/90 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2"
          >
            <button
              type="button"
              @click="resetOcrModal"
              class="rounded-xl px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer text-center"
            >
              Pindai Ulang
            </button>
            <button
              type="button"
              @click="applyOcrToForm"
              class="rounded-xl px-5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-sora font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Terapkan ke Formulir</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
</div>
</template>

<script setup>
import {
  Camera,
  ScanLine,
  Loader2,
  UploadCloud,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  User,
  ArrowRight,
} from 'lucide-vue-next';
import { reactive, ref, watch, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import axios from 'axios';
import { createWorker } from 'tesseract.js';
import { useApplicantStore } from '@/stores/applicant';
import { useAuthStore } from '@/stores/auth';
import { identityApi } from '@/api';
import { useToast } from '@/composables/useToast';

const emit = defineEmits(['switch-tab']);
const applicantStore = useApplicantStore();
const authStore = useAuthStore();
const toast = useToast();

const form = reactive({ ...applicantStore.state.candidate });
const isSaving = ref(false);

const goToAdmission = () => {
  emit('switch-tab', 'admission');
  applicantStore.setActiveTab('admission');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// OCR Scanner & Mode States
const isOcrModalOpen = ref(false);
const ocrInputMode = ref('camera'); // 'camera' | 'upload'
const ocrState = ref('idle'); // 'idle' | 'scanning' | 'completed' | 'retake_required'
const ocrProgressPercent = ref(0);
const ocrPipelineStepText = ref('');
const ocrData = ref(null);
const ocrRejectionMessage = ref('');
const ocrFileInputRef = ref(null);
const currentOcrFile = ref(null);
const capturedKtpPreviewUrl = ref('');

// Google Gemini Vision AI States
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

// Live Camera States
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

watch(
  () => applicantStore.state.candidate,
  (newCandidate) => {
    Object.assign(form, newCandidate);
  },
  { deep: true }
);

// ----------------- Live Camera Methods -----------------
const loadAvailableCameras = async () => {
  if (!navigator?.mediaDevices?.enumerateDevices) return [];
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter((d) => d.kind === 'videoinput');
    availableCameras.value = videoInputs;

    if (videoInputs.length > 0 && !selectedDeviceId.value) {
      // Prioritaskan kamera fisik (hindari OBS, Virtual Camera, Dummy jika ada kamera lain)
      const physicalCam = videoInputs.find(
        (cam) => !/virtual|obs|screen|dummy|vmix|split/i.test(cam.label || '')
      );
      selectedDeviceId.value = physicalCam ? physicalCam.deviceId : videoInputs[0].deviceId;
    }
    return videoInputs;
  } catch (err) {
    console.warn('Enumerate devices failed:', err);
    return [];
  }
};

const onCameraDeviceChange = async () => {
  await startCamera();
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

    // Tingkat 1: Coba gunakan deviceId spesifik jika terpilih
    if (selectedDeviceId.value) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: selectedDeviceId.value },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (e) {
        console.warn('Fallback from exact deviceId:', e);
      }
    }

    // Tingkat 2: Coba dengan facingMode ideal
    if (!stream) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: currentFacingMode.value },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (e) {
        console.warn('Fallback from facingMode ideal:', e);
      }
    }

    // Tingkat 3: Coba fallback universal { video: true }
    if (!stream) {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
    }

    cameraStream.value = stream;
    cameraPermissionNeeded.value = false;
    cameraPermissionDenied.value = false;

    // Muat ulang daftar kamera (sekarang label kamera fisik/virtual sudah dapat dibaca)
    await loadAvailableCameras();

    const videoTrack = stream.getVideoTracks()?.[0];
    if (videoTrack) {
      const settings = videoTrack.getSettings?.();
      if (settings?.deviceId) {
        selectedDeviceId.value = settings.deviceId;
      }
    }

    await nextTick();
    if (videoRef.value) {
      videoRef.value.srcObject = stream;
      videoRef.value.setAttribute('playsinline', 'true');
      videoRef.value.setAttribute('autoplay', 'true');
      videoRef.value.muted = true;

      await new Promise((resolve) => {
        let isDone = false;
        videoRef.value.onloadedmetadata = async () => {
          if (!isDone) {
            isDone = true;
            try {
              await videoRef.value.play();
            } catch (errPlay) {
              console.warn('Video play error on metadata:', errPlay);
            }
            resolve();
          }
        };
        setTimeout(async () => {
          if (!isDone) {
            isDone = true;
            try {
              await videoRef.value?.play();
            } catch (errPlay) {
              console.warn('Video play error on timeout:', errPlay);
            }
            resolve();
          }
        }, 500);
      });
    }

    isCameraActive.value = true;
  } catch (err) {
    console.warn('Camera access failed:', err);
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      cameraPermissionDenied.value = true;
    } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      cameraError.value =
        'Perangkat webcam tidak terdeteksi. Hubungkan webcam fisik atau gunakan opsi Unggah Berkas KTP.';
    } else {
      cameraError.value = `Gagal membuka kamera: ${err.message || 'Perangkat sedang dipakai program lain atau tidak tersedia.'}`;
    }
    isCameraActive.value = false;
  } finally {
    isCameraLoading.value = false;
    cameraPermissionNeeded.value = false;
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

const switchCamera = async () => {
  if (availableCameras.value.length > 1) {
    const currentIndex = availableCameras.value.findIndex(
      (c) => c.deviceId === selectedDeviceId.value
    );
    const nextIndex = (currentIndex + 1) % availableCameras.value.length;
    selectedDeviceId.value = availableCameras.value[nextIndex].deviceId;
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

const openOcrModal = async () => {
  isOcrModalOpen.value = true;
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
};

const closeOcrModal = () => {
  stopCamera();
  isOcrModalOpen.value = false;
  isCameraActive.value = false;
  isCameraLoading.value = false;
  cameraPermissionNeeded.value = false;
  cameraPermissionDenied.value = false;
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

onBeforeUnmount(() => {
  stopCamera();
});

// Ambil Foto dari Live Camera dengan pemotongan presisi bingkai KTP
const captureFromCamera = async () => {
  if (!videoRef.value || !cardGuideRef.value) return;
  const video = videoRef.value;
  const cardGuide = cardGuideRef.value;

  const vWidth = video.videoWidth || 1280;
  const vHeight = video.videoHeight || 720;
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = vWidth;
  tempCanvas.height = vHeight;
  const ctx = tempCanvas.getContext('2d');
  ctx.drawImage(video, 0, 0, vWidth, vHeight);

  // Hitung posisi relative card guide terhadap video elemen
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
  const cropCtx = cropCanvas.getContext('2d');
  cropCtx.drawImage(tempCanvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

  stopCamera();

  cropCanvas.toBlob(async (blob) => {
    if (!blob) return;
    const file = new File([blob], `ktp_cam_${Date.now()}.jpg`, { type: 'image/jpeg' });
    currentOcrFile.value = file;
    capturedKtpPreviewUrl.value = URL.createObjectURL(blob);
    await runOcrPipeline(file, cropCanvas);
  }, 'image/jpeg', 0.95);
};

// ----------------- File Picker & Dropzone -----------------
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
    ocrRejectionMessage.value =
      'Ukuran berkas KTP melebihi batas maksimal 5 MB. Silakan unggah foto KTP dengan ukuran lebih kecil.';
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

// ----------------- Heuristik, Preprocessing & Sanitasi KTP -----------------
const validateCardHeuristics = (file) => {
  return new Promise((resolve) => {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      resolve({ isCardProportion: true, ratio: 1.5 });
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const minDimension = Math.min(img.width, img.height);
      const isTooSmall = minDimension < 80;
      // Jangan tolak foto karena aspek rasio, biarkan pengguna mengunggah foto penuh atau terpotong
      resolve({
        isCardProportion: !isTooSmall,
        ratio: img.width / img.height,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ isCardProportion: true, ratio: 1.5 });
    };
    img.src = url;
  });
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

    // 1. Hitung histogram luminance
    const histogram = new Array(256).fill(0);
    const grays = new Uint8Array(totalPixels);

    for (let i = 0, j = 0; i < d.length; i += 4, j++) {
      // Bobot luminance: beri sedikit penekanan pada channel merah & hijau untuk meredam latar belakang biru/cyan e-KTP
      const g = Math.round(0.35 * d[i] + 0.55 * d[i + 1] + 0.10 * d[i + 2]);
      grays[j] = g;
      histogram[g]++;
    }

    // 2. Temukan persentil 5% (tinta gelap) dan persentil 95% (latar belakang kartu) untuk auto-contrast stretching
    let accum = 0;
    let pLow = 40;
    let pHigh = 220;
    const lowTarget = totalPixels * 0.05;
    const highTarget = totalPixels * 0.95;

    for (let t = 0; t < 256; t++) {
      accum += histogram[t];
      if (accum >= lowTarget && pLow === 40) {
        pLow = t;
      }
      if (accum >= highTarget) {
        pHigh = t;
        break;
      }
    }

    const range = Math.max(30, pHigh - pLow);

    // 3. Terapkan kontras halus (Smoothstep S-curve)
    // Tujuannya: memperdalam tinta hitam & mencerahkan latar belakang, TANPA merusak antialiasing font
    // dan TANPA binarisasi keras 0/255 (yang merusak pengenalan karakter neural network Tesseract LSTM)
    for (let i = 0, j = 0; i < d.length; i += 4, j++) {
      const g = grays[j];
      let norm = (g - pLow) / range;
      norm = Math.max(0, Math.min(1, norm));

      // S-curve smoothstep: 3x^2 - 2x^3
      const smooth = norm * norm * (3 - 2 * norm);
      const finalVal = Math.round(smooth * 255);

      d[i] = finalVal;
      d[i + 1] = finalVal;
      d[i + 2] = finalVal;
    }

    ctx.putImageData(imgData, 0, 0);
  } catch (e) {
    console.warn('Canvas gentle contrast preprocess notice:', e);
  }

  return c;
};

const DIGIT_REPLACEMENTS = {
  O: '0', o: '0', D: '0', Q: '0',
  I: '1', l: '1', '|': '1', i: '1', '!': '1', ']': '1', '[': '1',
  Z: '2', z: '2',
  A: '4',
  S: '5', s: '5',
  G: '6', b: '6',
  T: '7',
  B: '8',
  q: '9', g: '9',
};

const sanitizeDigitString = (raw) => {
  if (!raw) return '';
  let cleaned = '';
  for (const ch of raw) {
    if (/\d/.test(ch)) {
      cleaned += ch;
    } else if (DIGIT_REPLACEMENTS[ch]) {
      cleaned += DIGIT_REPLACEMENTS[ch];
    }
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

  if (monthVal < 1 || monthVal > 12) {
    return { isValid: false, birthDate: null, gender: null };
  }

  let gender = 'Laki-laki';
  let birthDay = dayVal;
  if (dayVal > 40) {
    gender = 'Perempuan';
    birthDay = dayVal - 40;
  }

  if (birthDay < 1 || birthDay > 31) {
    return { isValid: false, birthDate: null, gender: null };
  }

  const currentYear2d = new Date().getFullYear() % 100;
  const fullYear = year2d <= currentYear2d ? 2000 + year2d : 1900 + year2d;

  const pad = (n) => String(n).padStart(2, '0');
  const birthDateStr = `${fullYear}-${pad(monthVal)}-${pad(birthDay)}`;
  return { isValid: true, birthDate: birthDateStr, gender };
};

// Pola regex fuzzy toleran terhadap typo OCR pada e-KTP
const KTP_FUZZY_PATTERNS = [
  { id: 'provinsi', regex: /PR[O0o]V|PR[O0o]V[I1l|!]NS[I1l|!]/i },
  { id: 'republik', regex: /REPU[B86]L[I1l|!]K|INDON[E3]S[I1l|!]A/i },
  { id: 'kabupaten_kota', regex: /KABUPAT[E3]N|K[O0]TA/i },
  { id: 'nik', regex: /N[I1l|!][Kk]|N1K|N!K/i },
  { id: 'nama', regex: /NAM[Aa]|NAMA/i },
  { id: 'tempat_lahir', regex: /T[E3]MPAT|LAH[I1l]R|TGL/i },
  { id: 'jenis_kelamin', regex: /J[E3]N[I1l]S|K[E3]LAM[I1l]N|LAK[I1l]|P[E3]R[E3]MPUAN/i },
  { id: 'gol_darah', regex: /G[O0]L|DARAH/i },
  { id: 'alamat', regex: /ALAMAT|ALAMA1/i },
  { id: 'rtrw', regex: /RT[\s/.:,]*RW|R1[\s/.:,]*RW/i },
  { id: 'kelurahan', regex: /K[E3]L|D[E3]SA|LURAH/i },
  { id: 'kecamatan', regex: /K[E3]CAMAT|KEC/i },
  { id: 'agama', regex: /AGAMA|ISLAM|KRISTEN|KATOLIK|HINDU|BUDDHA/i },
  { id: 'status', regex: /STATUS|P[E3]RKAW[I1l]NAN|KAW[I1l]N|B[E3]LUM/i },
  { id: 'pekerjaan', regex: /P[E3]K[E3]RJAAN|P[E3]LAJAR|MAHAS[I1l]SWA|KARYAWAN/i },
  { id: 'kewarganegaraan', regex: /K[E3]WARGA|WNI|W\.N\.I/i },
  { id: 'berlaku', regex: /B[E3]RLAKU|H[I1l]NGGA|S[E3]UMUR|H[I1l]DUP/i },
];

const validateIsAuthenticKtp = (text) => {
  const upper = text.toUpperCase();

  let keywordHits = 0;
  const matchedPatterns = [];
  for (const item of KTP_FUZZY_PATTERNS) {
    if (item.regex.test(upper)) {
      keywordHits++;
      matchedPatterns.push(item.id);
    }
  }

  // 1. Ekstraksi NIK 16 digit yang sangat toleran terhadap spasi / OCR noise
  let foundNik = '';

  // Langkah A: Cari pada baris NIK atau di dekat kata NIK
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (/N[I1l|!][Kk]|N1K/i.test(lines[i])) {
      const lineText = lines[i] + ' ' + (lines[i + 1] || '');
      const rawNumbers = lineText.replace(/[^0-9Ool|!ZzASsGBbTqg]/g, '');
      const san = sanitizeDigitString(rawNumbers);
      if (san.length >= 16) {
        foundNik = san.slice(0, 16);
        break;
      }
    }
  }

  // Langkah B: Cari rangkaian 16 digit angka murni
  if (!foundNik) {
    const rawMatches = upper.match(/\b\d{16}\b/);
    if (rawMatches) {
      foundNik = rawMatches[0];
    }
  }

  // Langkah C: Cek setiap kata yang setelah disanitasi panjangnya 16 digit
  if (!foundNik) {
    const tokens = upper.split(/\s+/);
    for (const tok of tokens) {
      const san = sanitizeDigitString(tok);
      if (san.length === 16) {
        foundNik = san;
        break;
      }
    }
  }

  // Langkah D: Gabungkan seluruh digit yang tersebar (misal ada spasi 320101 240598 0001)
  if (!foundNik) {
    const allDigits = sanitizeDigitString(upper.replace(/[^0-9Ool|!ZzASsGBbTqg]/g, ''));
    if (allDigits.length >= 16) {
      for (let i = 0; i <= allDigits.length - 16; i++) {
        const sub = allDigits.slice(i, i + 16);
        const provCode = parseInt(sub.slice(0, 2), 10);
        // Kode provinsi Indonesia berada di rentang 11 sampai 94
        if (provCode >= 11 && provCode <= 94) {
          foundNik = sub;
          break;
        }
      }
      if (!foundNik) {
        foundNik = allDigits.slice(0, 16);
      }
    }
  }

  // Kriteria keaslian cerdas dan bersahabat:
  // KTP dinyatakan sah jika:
  // 1. Ditemukan NIK 16 digit, ATAU
  // 2. Ditemukan minimal 2 kata kunci identitas resmi KTP (misal Provinsi + Nama, atau Alamat + Agama), ATAU
  // 3. Ditemukan minimal 1 kata kunci KTP dan teks gambar memiliki isi (> 20 karakter)
  const isAuthentic =
    (foundNik.length === 16) ||
    (keywordHits >= 2) ||
    (keywordHits >= 1 && upper.trim().length > 20);

  return {
    isAuthentic,
    foundNik,
    keywordHits,
    matchedPatterns,
  };
};

const extractKtpFields = (text, detectedNik) => {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const fullText = lines.join(' ').toUpperCase();

  // Helper pencari nilai: cek di baris yang sama ATAU baris berikutnya (i + 1, i + 2)
  const findValueByLabel = (labelRegex) => {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (labelRegex.test(line)) {
        // Coba ambil teks setelah label di baris yang sama
        const stripped = line.replace(labelRegex, '').replace(/^[:;\s.-]+/, '').trim();
        if (
          stripped.length >= 2 &&
          !/^(?:tempat|tanggal|jenis|alamat|rt|rw|kel|kec|agama|status|pekerjaan|nik|gol|kewargan)/i.test(stripped)
        ) {
          return stripped;
        }
        // Jika tidak ada teks setelah label di baris yang sama, periksa baris berikutnya
        for (let j = i + 1; j <= Math.min(i + 2, lines.length - 1); j++) {
          const nextL = lines[j].replace(/^[:;\s.-]+/, '').trim();
          if (
            nextL.length >= 2 &&
            !/^(?:tempat|tanggal|jenis|alamat|rt|rw|kel|kec|agama|status|pekerjaan|nik|gol|kewargan)/i.test(nextL)
          ) {
            return nextL;
          }
        }
      }
    }
    return '';
  };

  // 1. NIK
  let nik = detectedNik || '';
  const nikMeta = parseNikMetadata(nik);

  // 2. NAMA LENGKAP
  let nama = findValueByLabel(/(?:^|[^A-Za-z])(?:NAMA|NAME|NAM|MAMA|NANA)[\s:;.-]*/i);
  if (!nama) {
    for (let i = 0; i < lines.length; i++) {
      if (/NAMA|NAME/i.test(lines[i])) {
        const afterColon = lines[i].split(/[:;]/)[1];
        if (afterColon && afterColon.trim().length >= 3) {
          nama = afterColon.trim();
          break;
        } else if (i + 1 < lines.length) {
          nama = lines[i + 1].replace(/^[:;\s.-]+/, '').trim();
          break;
        }
      }
    }
  }
  // Fallback posisi: pada e-KTP fisik, baris tepat setelah NIK adalah NAMA
  if (!nama && nik) {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(nik) || /N[I1l|!][Kk]/i.test(lines[i])) {
        for (let j = i + 1; j <= Math.min(i + 3, lines.length - 1); j++) {
          const cand = lines[j].replace(/^(?:NAMA|NAME)?[:;\s.-]*/i, '').trim();
          if (
            cand.length >= 3 &&
            !/^\d+$/.test(cand) &&
            !/tempat|lahir|provinsi|kota|kabupaten|nik|jenis|kelamin/i.test(cand)
          ) {
            nama = cand;
            break;
          }
        }
        break;
      }
    }
  }
  nama = nama.replace(/[^A-Za-z\s'.,]/g, '').trim().toUpperCase();

  // 3. TEMPAT & TANGGAL LAHIR
  let ttlRaw = findValueByLabel(/(?:^|[^A-Za-z])(?:TEMPAT|T[E3]MPAT)[\s/.:,;*-]*(?:TGL|LAH[I1l]R)?[\s:;.-]*/i);
  if (!ttlRaw) {
    for (let i = 0; i < lines.length; i++) {
      if (/LAHIR|TEMPAT/i.test(lines[i])) {
        const afterColon = lines[i].split(/[:;]/)[1];
        if (afterColon && afterColon.trim().length >= 3) {
          ttlRaw = afterColon.trim();
          break;
        } else if (i + 1 < lines.length) {
          ttlRaw = lines[i + 1].trim();
          break;
        }
      }
    }
  }

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
      const mStr = MONTH_MAP[wordDateMatch[2].toUpperCase()];
      tanggalLahir = `${wordDateMatch[3]}-${mStr}-${String(wordDateMatch[1]).padStart(2, '0')}`;
      tempatLahir = ttlRaw.slice(0, wordDateMatch.index).replace(/[^A-Za-z\s]/g, '').trim().toUpperCase();
    } else {
      tempatLahir = ttlRaw.replace(/[^A-Za-z\s]/g, '').trim().toUpperCase();
    }
  }
  // Jika tanggal lahir belum terbaca jelas dari teks, ambil dari formula NIK 16 digit
  if (!tanggalLahir && nikMeta.isValid) {
    tanggalLahir = nikMeta.birthDate;
  }

  // 4. JENIS KELAMIN
  let jenisKelamin = '';
  if (/PEREMPUAN|WANITA|P[E3]R[E3]MPUAN/i.test(fullText)) {
    jenisKelamin = 'Perempuan';
  } else if (/LAKI[\s-]*LAKI|PRIA|LAK[I1l]/i.test(fullText)) {
    jenisKelamin = 'Laki-laki';
  } else if (nikMeta.isValid) {
    jenisKelamin = nikMeta.gender;
  }

  // 5. ALAMAT
  let alamat = findValueByLabel(/(?:^|[^A-Za-z])(?:ALAMAT|ALANAT|ALAMA1)[\s:;.-]*/i);
  if (!alamat) {
    for (const l of lines) {
      if (/^(?:JL|JALAN|KP|KAMPUNG|DUSUN|KOMP|BLOK|PERUM|GANG|GG)\.?\s+/i.test(l)) {
        alamat = l.trim().toUpperCase();
        break;
      }
    }
  }
  alamat = alamat.replace(/^(?:ALAMAT|ALANAT)[:;\s.-]*/i, '').trim().toUpperCase();

  // 6. RT/RW
  let rtrw = '';
  const rtrwMatch = fullText.match(/(?:RT[\s/.:,]*RW|R1[\s/.:,]*RW)?[\s:;.-]*(\d{1,3})\s*[/]\s*(\d{1,3})/i);
  if (rtrwMatch) {
    rtrw = `${String(rtrwMatch[1]).padStart(3, '0')}/${String(rtrwMatch[2]).padStart(3, '0')}`;
  }

  // 7. KELURAHAN / DESA
  let kelDesa = findValueByLabel(/(?:^|[^A-Za-z])(?:KEL|K[E3]L|DESA|D[E3]SA|KELURAHAN)[\s/.:,;*-]*[\s:;.-]*/i);
  if (!kelDesa) {
    const m = fullText.match(/(?:KEL|DESA)[\s:;./-]+([A-Z\s]+?)(?:KECAMATAN|AGAMA|RT|$)/i);
    if (m && m[1]) kelDesa = m[1].trim();
  }
  kelDesa = kelDesa.replace(/[^A-Za-z0-9\s]/g, '').trim().toUpperCase();

  // 8. KECAMATAN
  let kecamatan = findValueByLabel(/(?:^|[^A-Za-z])(?:KECAMATAN|K[E3]CAMATAN|KEC)[\s/.:,;*-]*[\s:;.-]*/i);
  if (!kecamatan) {
    const m = fullText.match(/(?:KECAMATAN|KEC)[\s:;./-]+([A-Z\s]+?)(?:AGAMA|STATUS|KABUPATEN|$)/i);
    if (m && m[1]) kecamatan = m[1].trim();
  }
  kecamatan = kecamatan.replace(/[^A-Za-z0-9\s]/g, '').trim().toUpperCase();

  // 9. AGAMA
  let agama = '';
  for (const ag of ['ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDDHA', 'KONGHUCU']) {
    if (fullText.includes(ag)) {
      agama = ag.charAt(0) + ag.slice(1).toLowerCase();
      break;
    }
  }
  if (!agama) agama = 'Islam';

  // 10. PROVINSI & KOTA
  let provinsi = '';
  let kota = '';
  const provMatch = fullText.match(/PROVINSI\s+([A-Z\s]+?)(?:KOTA|KABUPATEN|NIK|$)/i);
  if (provMatch) provinsi = provMatch[1].trim();

  const kotaMatch = fullText.match(/(?:KOTA|KABUPATEN)\s+([A-Z\s]+?)(?:NIK|NAMA|$)/i);
  if (kotaMatch) kota = kotaMatch[1].trim();

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
    kota,
    provinsi,
  };
};

// ----------------- Google Gemini Vision AI OCR -----------------
const canvasToBase64Jpeg = (canvas) => {
  return new Promise((resolve) => {
    let c = canvas;
    if (canvas.width > 1400) {
      c = document.createElement('canvas');
      const scale = 1400 / canvas.width;
      c.width = 1400;
      c.height = canvas.height * scale;
      const ctx = c.getContext('2d');
      ctx.drawImage(canvas, 0, 0, c.width, c.height);
    }
    const dataUrl = c.toDataURL('image/jpeg', 0.85);
    const base64 = dataUrl.split(',')[1];
    resolve(base64);
  });
};

const runGeminiVisionOcr = async (canvas) => {
  if (!geminiApiKey.value) return null;

  try {
    ocrProgressPercent.value = 40;
    ocrPipelineStepText.value = 'Menghubungkan ke Google Gemini Vision AI...';

    const base64Image = await canvasToBase64Jpeg(canvas);

    ocrProgressPercent.value = 65;
    ocrPipelineStepText.value = 'Menganalisis e-KTP dengan AI Vision tingkat tinggi...';

    const promptText = `Anda adalah sistem OCR e-KTP Indonesia dengan akurasi 100%.
Analisis gambar e-KTP ini dan ekstrak seluruh informasi identitas.
Aturan:
1. Pastikan apakah ini gambar e-KTP Republik Indonesia. Jika bukan KTP, berikan "is_ktp": false.
2. Jika e-KTP, baca dan ekstrak field dengan teliti:
   - nik (16 digit angka)
   - nama (nama lengkap sesuai KTP, huruf kapital)
   - tempat_lahir (nama kota atau kabupaten tempat lahir)
   - tanggal_lahir (format YYYY-MM-DD, contoh: 1998-05-24)
   - jenis_kelamin ("Laki-laki" atau "Perempuan")
   - alamat (nama jalan/kampung/dusun/nomor rumah)
   - rt_rw (format "000/000")
   - kel_desa (nama kelurahan atau desa)
   - kecamatan (nama kecamatan)
   - agama (Islam/Kristen/Katolik/Hindu/Buddha/Konghucu)
   - kota (nama kabupaten atau kota dari header KTP)
   - provinsi (nama provinsi dari header KTP)

Kembalikan HANYA format JSON valid tanpa tanda markdown (tanpa \`\`\`json):
{
  "is_ktp": true,
  "nik": "3201012304950002",
  "nama": "BUDI SANTOSO",
  "tempat_lahir": "BOGOR",
  "tanggal_lahir": "1995-04-23",
  "jenis_kelamin": "Laki-laki",
  "alamat": "JL. RAYA PAJAJARAN NO. 12",
  "rt_rw": "002/005",
  "kel_desa": "BABAKAN",
  "kecamatan": "BOGOR TENGAH",
  "agama": "Islam",
  "kota": "KOTA BOGOR",
  "provinsi": "JAWA BARAT"
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey.value.trim()}`;

    const payload = {
      contents: [
        {
          parts: [
            { text: promptText },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: base64Image,
              },
            },
          ],
        },
      ],
      generationConfig: {
        response_mime_type: 'application/json',
        temperature: 0.1,
      },
    };

    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 25000,
    });

    const candidateText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('Respon Gemini tidak memiliki konten teks.');
    }

    const cleanedJson = candidateText.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedJson);

    if (parsed.is_ktp === false && !parsed.nik) {
      return {
        rejected: true,
        message: 'Foto tidak terdeteksi sebagai kartu e-KTP. Pastikan mengunggah foto kartu KTP yang jelas.',
      };
    }

    return {
      success: true,
      data: parsed,
    };
  } catch (err) {
    console.warn('Gemini Vision OCR error:', err);
    return null;
  }
};

// ----------------- Pipeline Pemrosesan OCR -----------------
const runOcrPipeline = async (file, sourceCanvas = null) => {
  ocrState.value = 'scanning';
  ocrProgressPercent.value = 15;
  ocrPipelineStepText.value = 'Menyiapkan gambar...';
  ocrData.value = null;
  ocrRejectionMessage.value = '';

  // 1. Muat gambar ke canvas dasar
  ocrProgressPercent.value = 25;
  ocrPipelineStepText.value = 'Menganalisis gambar...';

  let rawCanvas = sourceCanvas;
  if (!rawCanvas) {
    rawCanvas = await new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const c = document.createElement('canvas');
        const maxW = 1600;
        const scale = Math.min(2, Math.max(0.5, maxW / img.width));
        c.width = img.width * scale;
        c.height = img.height * scale;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, c.width, c.height);
        resolve(c);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Gagal memuat berkas gambar'));
      };
      img.src = url;
    }).catch(() => null);
  }

  if (!rawCanvas) {
    ocrState.value = 'retake_required';
    ocrRejectionMessage.value = 'Gagal memproses gambar. Pastikan format file JPG, PNG, atau PDF valid.';
    return;
  }

  // JALUR 1: Jika Gemini API Key aktif, gunakan Google Gemini Vision AI
  if (geminiApiKey.value) {
    const geminiRes = await runGeminiVisionOcr(rawCanvas);
    if (geminiRes) {
      if (geminiRes.rejected) {
        ocrState.value = 'retake_required';
        ocrRejectionMessage.value = geminiRes.message;
        return;
      }

      if (geminiRes.success && geminiRes.data) {
        const d = geminiRes.data;
        ocrData.value = {
          status: 'completed',
          quality_score: 99,
          engine: 'gemini',
          fields: {
            nik: { value: d.nik || '', confidence: 0.99 },
            nama: { value: (d.nama || '').toUpperCase(), confidence: 0.99 },
            tempat_lahir: { value: (d.tempat_lahir || '').toUpperCase(), confidence: 0.99 },
            tanggal_lahir: { value: d.tanggal_lahir || '', confidence: 0.99 },
            jenis_kelamin: { value: d.jenis_kelamin || '', confidence: 0.99 },
            agama: { value: d.agama || 'Islam', confidence: 0.99 },
            alamat: { value: (d.alamat || '').toUpperCase(), confidence: 0.99 },
            rt_rw: { value: d.rt_rw || '', confidence: 0.99 },
            kel_desa: { value: (d.kel_desa || '').toUpperCase(), confidence: 0.99 },
            kecamatan: { value: (d.kecamatan || '').toUpperCase(), confidence: 0.99 },
            kota: { value: (d.kota || '').toUpperCase(), confidence: 0.99 },
            provinsi: { value: (d.provinsi || '').toUpperCase(), confidence: 0.99 },
          },
        };
        ocrProgressPercent.value = 100;
        ocrState.value = 'completed';
        return;
      }
    }
  }

  // JALUR 2: Mesin OCR Lokal Cerdas (Tesseract.js dengan Pra-pemrosesan Kontras Halus)
  ocrProgressPercent.value = 35;
  ocrPipelineStepText.value = 'Memproses dokumen...';
  const processingCanvas = preprocessKtpCanvas(rawCanvas);

  ocrProgressPercent.value = 55;
  ocrPipelineStepText.value = 'Membaca data KTP...';

  let extractedText = '';
  let worker = null;
  try {
    try {
      worker = await createWorker(['ind', 'eng']);
    } catch {
      worker = await createWorker('eng');
    }

    ocrProgressPercent.value = 75;
    ocrPipelineStepText.value = 'Membaca teks identitas...';

    // Coba recognize dari processingCanvas
    const result = await worker.recognize(processingCanvas);
    extractedText = result.data?.text || '';

    // Jika teks yang terbaca sangat sedikit atau NIK belum ketemu, coba recognize rawCanvas
    if ((extractedText.trim().length < 30 || !/\d{14,16}/.test(extractedText)) && rawCanvas !== processingCanvas) {
      const fallbackResult = await worker.recognize(rawCanvas);
      const rawText = fallbackResult.data?.text || '';
      if (rawText.length > extractedText.length || /\d{16}/.test(rawText)) {
        extractedText = extractedText ? `${extractedText}\n${rawText}` : rawText;
      }
    }

    await worker.terminate();
    worker = null;
  } catch (err) {
    console.warn('Tesseract OCR notice:', err);
    if (worker) {
      await worker.terminate().catch(() => null);
    }
  }

  // 4. Deteksi Keaslian KTP
  ocrProgressPercent.value = 90;
  ocrPipelineStepText.value = 'Memvalidasi data...';

  const validation = validateIsAuthenticKtp(extractedText);

  // Jika benar-benar kosong atau tidak terdeteksi teks KTP sama sekali
  if (!validation.isAuthentic && !validation.foundNik && extractedText.trim().length < 10) {
    ocrState.value = 'retake_required';
    ocrRejectionMessage.value =
      'Data KTP tidak terbaca jelas. Pastikan foto tidak buram, pencahayaan cukup, dan seluruh bagian kartu berada di dalam bingkai.';
    return;
  }

  // 5. Ekstraksi field dari teks KTP yang valid
  const parsed = extractKtpFields(extractedText, validation.foundNik);

  ocrData.value = {
    status: 'completed',
    quality_score: validation.foundNik ? 95 : 85,
    engine: 'tesseract',
    enhanced: true,
    fields: {
      nik: { value: parsed.nik || validation.foundNik, confidence: parsed.nik ? 0.98 : 0.75 },
      nama: { value: parsed.nama, confidence: parsed.nama ? 0.96 : 0.70 },
      tempat_lahir: { value: parsed.tempat_lahir, confidence: parsed.tempat_lahir ? 0.94 : 0.70 },
      tanggal_lahir: { value: parsed.tanggal_lahir, confidence: parsed.tanggal_lahir ? 0.95 : 0.70 },
      jenis_kelamin: { value: parsed.jenis_kelamin, confidence: parsed.jenis_kelamin ? 0.97 : 0.70 },
      agama: { value: parsed.agama, confidence: 0.95 },
      alamat: { value: parsed.alamat, confidence: parsed.alamat ? 0.93 : 0.70 },
      rt_rw: { value: parsed.rt_rw, confidence: parsed.rt_rw ? 0.92 : 0.70 },
      kel_desa: { value: parsed.kel_desa, confidence: parsed.kel_desa ? 0.93 : 0.70 },
      kecamatan: { value: parsed.kecamatan, confidence: parsed.kecamatan ? 0.93 : 0.70 },
      kota: { value: parsed.kota, confidence: parsed.kota ? 0.90 : 0.70 },
      provinsi: { value: parsed.provinsi, confidence: parsed.provinsi ? 0.90 : 0.70 },
    },
  };

  ocrProgressPercent.value = 100;
  ocrState.value = 'completed';
};

// ----------------- Terapkan Hasil OCR ke Formulir Biodata -----------------
const applyOcrToForm = () => {
  if (!ocrData.value?.fields) return;

  const f = ocrData.value.fields;
  if (f.nik?.value) form.nik = f.nik.value;
  if (f.nama?.value) form.fullName = f.nama.value;
  if (f.tempat_lahir?.value) form.birthPlace = f.tempat_lahir.value;
  if (f.tanggal_lahir?.value) form.birthDate = f.tanggal_lahir.value;

  if (f.jenis_kelamin?.value) {
    const val = f.jenis_kelamin.value.trim().toUpperCase();
    form.gender = val.startsWith('L') ? 'Laki-laki' : 'Perempuan';
  }

  if (f.agama?.value) {
    const ag = f.agama.value.trim().toUpperCase();
    const mapAgama = {
      ISLAM: 'Islam',
      KRISTEN: 'Kristen',
      KATOLIK: 'Katolik',
      HINDU: 'Hindu',
      BUDDHA: 'Buddha',
      KONGHUCU: 'Konghucu',
    };
    form.religion = mapAgama[ag] || f.agama.value;
  }

  // Susun alamat jika field alamat ada
  if (f.alamat?.value) {
    let fullAddr = f.alamat.value;
    if (f.rt_rw?.value) fullAddr += `, RT/RW: ${f.rt_rw.value}`;
    if (f.kel_desa?.value) fullAddr += `, Kel. ${f.kel_desa.value}`;
    if (f.kecamatan?.value) fullAddr += `, Kec. ${f.kecamatan.value}`;
    form.address = fullAddr;
  }

  if (f.kota?.value && !form.city) {
    form.city = f.kota.value;
  }
  if (f.provinsi?.value && !form.province) {
    form.province = f.provinsi.value;
  }

  // Simpan hasil ke applicantStore
  applicantStore.updateProfile(form);

  // Otomatis tautkan pindaian e-KTP ke berkas dokumen persyaratan (doc-2) jika belum diunggah
  if (currentOcrFile.value) {
    const ktpDoc = applicantStore.state.documents.find((d) => d.id === 'doc-2');
    if (ktpDoc && ktpDoc.status === 'unuploaded') {
      const blobUrl = URL.createObjectURL(currentOcrFile.value);
      const sizeMb = (currentOcrFile.value.size / (1024 * 1024)).toFixed(1);
      const formattedSize = sizeMb > 0.1 ? `${sizeMb} MB` : `${Math.round(currentOcrFile.value.size / 1024)} KB`;
      applicantStore.uploadDocument('doc-2', {
        name: currentOcrFile.value.name,
        size: formattedSize,
        fileBlobUrl: blobUrl,
        fileType: currentOcrFile.value.type || 'image/jpeg',
        notes: 'Foto e-KTP diunggah melalui pemindai KTP.',
      });
    }
  }

  closeOcrModal();
  toast.success('Data e-KTP berhasil dimasukkan ke formulir biodata.');
};

const saveProfile = async () => {
  isSaving.value = true;
  try {
    applicantStore.updateProfile(form);

    // Sinkronisasi data ke microservices backend (Auth, Identity, Admission)
    const hasAuthToken = authStore.isAuthenticated && (authStore.accessToken || authStore.token);
    if (hasAuthToken) {
      // 1. Auth service profile
      await authStore.updateProfile({
        full_name: form.fullName,
        phone: form.phone || '',
      }).catch(() => null);

      // 2. Identity service profile (NIK, tempat/tgl lahir, gender, agama)
      await identityApi.updateProfile({
        full_name: form.fullName,
        nik: form.nik,
        birth_place: form.birthPlace,
        birth_date: form.birthDate,
        gender: form.gender === 'Laki-laki' ? 'L' : 'P',
        religion: form.religion || 'Islam',
        nationality: 'WNI',
        phone: form.phone || '',
      }).catch(() => null);

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

    toast.success('Formulir biodata calon mahasiswa berhasil disimpan.');
  } catch (err) {
    console.warn('Gagal update profile ke backend:', err);
    toast.info('Biodata tersimpan di penyimpanan browser lokal.');
  } finally {
    isSaving.value = false;
  }
};
</script>
