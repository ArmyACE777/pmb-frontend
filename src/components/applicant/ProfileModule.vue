<template>
  <div class="space-y-6">
    <!-- Header Modul -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-lg text-slate-900">
          Profil & Biodata Calon Mahasiswa
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Pastikan data identitas, alamat, dan riwayat pendidikan sesuai dengan dokumen resmi (KTP & Ijazah).
        </p>
      </div>
      <div class="flex items-center gap-2">
        <span class="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold font-sora">
          Data Terverifikasi
        </span>
      </div>
    </div>

    <!-- Alert Sukses Simpan -->
    <div
      v-if="savedMessage"
      class="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between animate-fadeIn"
    >
      <span>✓ {{ savedMessage }}</span>
      <button @click="savedMessage = ''" class="text-emerald-600 hover:text-emerald-900 font-bold">&times;</button>
    </div>

    <form @submit.prevent="saveProfile" class="space-y-6">
      <!-- 1. Identitas Pribadi -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div class="text-xs font-sora font-bold text-[#1E3A8A] uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
          1. Identitas Pribadi
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label class="block font-medium text-slate-700 mb-1">Nama Lengkap Sesuai KTP</label>
            <input
              v-model="form.fullName"
              type="text"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">Nomor Induk Kependudukan (NIK)</label>
            <input
              v-model="form.nik"
              type="text"
              maxlength="16"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-mono"
            />
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">NISN (Nomor Induk Siswa Nasional)</label>
            <input
              v-model="form.nisn"
              type="text"
              maxlength="10"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-mono"
            />
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">Tempat Lahir</label>
            <input
              v-model="form.birthPlace"
              type="text"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">Tanggal Lahir</label>
            <input
              v-model="form.birthDate"
              type="date"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">Jenis Kelamin</label>
            <select
              v-model="form.gender"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            >
              <option value="Perempuan">Perempuan</option>
              <option value="Laki-laki">Laki-laki</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 2. Alamat & Kontak -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div class="text-xs font-sora font-bold text-[#1E3A8A] uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
          2. Alamat Domisili & Kontak
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div class="sm:col-span-2">
            <label class="block font-medium text-slate-700 mb-1">Alamat Lengkap</label>
            <input
              v-model="form.address"
              type="text"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">Kota / Kabupaten</label>
            <input
              v-model="form.city"
              type="text"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">Provinsi</label>
            <input
              v-model="form.province"
              type="text"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">Nomor WhatsApp Aktif</label>
            <input
              v-model="form.phone"
              type="tel"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-mono"
            />
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">Alamat Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>
        </div>
      </div>

      <!-- 3. Riwayat Asal Sekolah -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div class="text-xs font-sora font-bold text-[#1E3A8A] uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
          3. Riwayat Asal Sekolah
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div class="sm:col-span-2">
            <label class="block font-medium text-slate-700 mb-1">Nama Asal Sekolah (SMA/SMK/MA)</label>
            <input
              v-model="form.schoolName"
              type="text"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">Jurusan Sekolah</label>
            <input
              v-model="form.schoolMajor"
              type="text"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">Tahun Lulus</label>
            <input
              v-model="form.graduationYear"
              type="text"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>
        </div>
      </div>

      <!-- 4. Data Orang Tua / Wali -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div class="text-xs font-sora font-bold text-[#1E3A8A] uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
          4. Data Orang Tua / Wali
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label class="block font-medium text-slate-700 mb-1">Nama Ayah Kandung</label>
            <input
              v-model="form.fatherName"
              type="text"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">Pekerjaan Ayah</label>
            <input
              v-model="form.fatherJob"
              type="text"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">Nama Ibu Kandung</label>
            <input
              v-model="form.motherName"
              type="text"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">Penghasilan Orang Tua / Bulan</label>
            <select
              v-model="form.parentIncome"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            >
              <option value="< Rp 2.500.000">&lt; Rp 2.500.000</option>
              <option value="Rp 2.500.000 - Rp 5.000.000">Rp 2.500.000 - Rp 5.000.000</option>
              <option value="Rp 5.000.000 - Rp 10.000.000">Rp 5.000.000 - Rp 10.000.000</option>
              <option value="> Rp 10.000.000">&gt; Rp 10.000.000</option>
            </select>
          </div>
          <div class="sm:col-span-2">
            <label class="block font-medium text-slate-700 mb-1">Kontak Darurat Keluarga</label>
            <input
              v-model="form.emergencyContact"
              type="text"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans"
            />
          </div>
        </div>
      </div>

      <!-- Tombol Aksi Simpan -->
      <div class="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          class="px-6 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
        >
          <span>Simpan Perubahan Biodata</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useApplicantStore } from '@/stores/applicant';

const applicantStore = useApplicantStore();
const form = reactive({ ...applicantStore.state.candidate });
const savedMessage = ref('');

const saveProfile = () => {
  applicantStore.updateProfile(form);
  savedMessage.value = 'Perubahan data profil calon mahasiswa berhasil disimpan ke sistem!';
  setTimeout(() => {
    savedMessage.value = '';
  }, 4000);
};
</script>
