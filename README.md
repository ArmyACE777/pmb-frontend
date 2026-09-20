# PMB Universitas Bakti Tunas Husada - Frontend

Aplikasi web modern berbasis **Vue 3 + Vite** untuk Sistem Penerimaan Mahasiswa Baru (PMB) Universitas Bakti Tunas Husada (BTH).

---

## 🚀 Fitur Utama

- **Autentikasi Aman & Asimetris (RS256 JWT)**:
  - Pendaftaran Akun Mahasiswa Baru dengan live password strength meter & validasi.
  - Verifikasi OTP 6 digit otomatis dengan dukungan Mailpit lokal & vendor SMTP nyata.
  - Masuk Akun dengan proteksi brute force rate limit.
  - Lupa & Reset Kata Sandi berbasis token.
- **Portal Calon Mahasiswa (PMB BTH)**:
  - Hero banner selamat datang resmi dengan nomor registrasi unik & tombol salin instan.
  - Gauge progres pendaftaran (SVG Circular Ring).
  - Alur 6 Tahapan PMB yang interaktif (*Clickable Stepper*).
  - Cetak / Pratinjau Bukti Pendaftaran Sementara ber-QR Code & pas foto latar merah.
  - Rincian nomor Virtual Account (VA) Bank BSI / Mandiri.
  - Unggah & Verifikasi Berkas (Ijazah/SKL, KTP, KK, Pas Foto) dengan simulasi progress upload.
  - Hitung Mundur (*Live Countdown*) ke jadwal ujian CBT online.
  - Simulasi Ujian CBT Mini (3 Soal Logika, Sains, dan Bahasa Inggris) dengan penilaian skor langsung.
  - Eksplorasi Program Studi BTH (S1 Farmasi, S1 TI, D3 Keperawatan, dsb.).
  - Manajemen keamanan akun & ganti kata sandi terhubung ke Go backend.

---

## 🛠️ Teknologi & Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API with `<script setup>`)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Routing**: [Vue Router 4](https://router.vuejs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS
- **HTTP Client**: [Axios](https://axios-http.com/) dengan interceptor refresh token otomatis
- **Typography**: Google Fonts (Sora & Figtree)

---

## 📦 Menjalankan Secara Lokal

### Prasyarat
- Node.js (v18 ke atas)
- Backend PMB (Go Microservices & Docker) berjalan di port `8000`

### Instalasi & Menjalankan Dev Server
```bash
# Instal dependensi
npm install

# Jalankan server pengembangan lokal (http://localhost:5173)
npm run dev

# Kompilasi untuk produksi
npm run build

# Pratinjau hasil build
npm run preview
```
