<template>
  <div class="space-y-6">
    <!-- Header Meja Kerja Pelaporan & Broadcast -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-lg text-slate-900">
          Pusat Pelaporan Eksekutif & Notifikasi Broadcast PMB
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Ekspor dokumen rekapitulasi pendaftaran, penyiaran notifikasi massal WhatsApp/Email, dan pembukuan ledger kas PMB.
        </p>
      </div>

      <!-- Navigation Tabs Between Reporting vs Broadcasting vs Ledger -->
      <div class="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-sora font-semibold">
        <button
          v-if="canAccessSubTab('reporting')"
          @click="activeSubTab = 'reporting'"
          class="px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
          :class="activeSubTab === 'reporting' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Ekspor Laporan</span>
        </button>

        <button
          v-if="canAccessSubTab('broadcast')"
          @click="activeSubTab = 'broadcast'"
          class="px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
          :class="activeSubTab === 'broadcast' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <span>Broadcast Notifikasi</span>
        </button>

        <button
          v-if="canAccessSubTab('ledger')"
          @click="activeSubTab = 'ledger'"
          class="px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
          :class="activeSubTab === 'ledger' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Buku Besar Kas</span>
        </button>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- TAB 1: EXECUTIVE REPORTING & EXPORT CENTER                        -->
    <!-- ================================================================= -->
    <div v-if="activeSubTab === 'reporting'" class="space-y-6">
      <!-- 3 Pre-Packaged Official Report Options -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- 1. Rekap Pendaftaran -->
        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div class="w-8 h-8 rounded-lg bg-blue-50 text-[#1E3A8A] flex items-center justify-center mb-3">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="font-sora font-bold text-slate-900 text-sm">Laporan Pendaftar PMB</h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              Rekap seluruh biodata, NISN, asal sekolah, dan pilihan program studi TA 2026/2027.
            </p>
          </div>
          <div class="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
            <button
              @click="exportReport('pendaftar')"
              class="flex-1 py-2 bg-slate-100 hover:bg-[#1E3A8A] hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center"
            >
              Unduh CSV
            </button>
            <button
              @click="openFormalPrintModal('pendaftar')"
              class="px-3 py-2 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              title="Pratinjau Format Cetak Resmi"
            >
              Cetak
            </button>
          </div>
        </div>

        <!-- 2. Rekap Kelulusan CBT & LoA -->
        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="font-sora font-bold text-slate-900 text-sm">Laporan Kelulusan Seleksi</h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              Daftar nominasi kelulusan hasil CBT, nilai wawancara, dan nomor Surat Keputusan Rektor.
            </p>
          </div>
          <div class="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
            <button
              @click="exportReport('kelulusan')"
              class="flex-1 py-2 bg-slate-100 hover:bg-[#1E3A8A] hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center"
            >
              Unduh CSV
            </button>
            <button
              @click="openFormalPrintModal('kelulusan')"
              class="px-3 py-2 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              title="Pratinjau Format Cetak Resmi"
            >
              Cetak
            </button>
          </div>
        </div>

        <!-- 3. Rekap Keuangan & Piutang UKT -->
        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="font-sora font-bold text-slate-900 text-sm">Laporan Rekonsiliasi Kas</h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              Arsip transaksi pelunasan biaya formulir dan daftar ulang UKT Semester 1 via BSI/Mandiri.
            </p>
          </div>
          <div class="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
            <button
              @click="exportReport('keuangan')"
              class="flex-1 py-2 bg-slate-100 hover:bg-[#1E3A8A] hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center"
            >
              Unduh CSV
            </button>
            <button
              @click="openFormalPrintModal('keuangan')"
              class="px-3 py-2 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              title="Pratinjau Format Cetak Resmi"
            >
              Cetak
            </button>
          </div>
        </div>

        <!-- 4. Format Migrasi SEVIMA Resmi (62 Kolom Standar PDDIKTI) -->
        <div class="bg-white rounded-xl p-5 border-2 border-emerald-200 bg-emerald-50/20 shadow-xs flex flex-col justify-between md:col-span-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-start gap-3">
              <div class="h-10 px-2.5 rounded-xl bg-white border border-emerald-200 flex items-center justify-center flex-shrink-0 shadow-2xs">
                <img src="/assets/icons/sevima.png" alt="SEVIMA" class="h-6 w-auto object-contain" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-sora font-bold text-slate-900 text-sm">Format Migrasi SIAKAD SEVIMA (Standar 62 Kolom)</h3>
                  <span class="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 whitespace-nowrap inline-block">
                    Standar 20261007
                  </span>
                </div>
                <p class="text-xs text-slate-600 mt-0.5 leading-relaxed max-w-2xl font-sans">
                  Sesuai format resmi migrasi SEVIMA. Dilengkapi penandaan warna hijau (kolom wajib) dan kuning (opsional) untuk sinkronisasi biodata, orang tua, sekolah asal, dan prodi langsung ke database SIAKAD.
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
              <button
                @click="exportSevimaExcel"
                class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <span>Unduh Format Excel SEVIMA (.xls)</span>
              </button>
              <button
                @click="exportSevimaCsv"
                class="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Unduh CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Filterable Interactive Data Preview Table -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div class="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-sm">Pratinjau Data Rekapitulasi Terpadu</h3>
            <p class="text-xs text-slate-500">Menampilkan seluruh arsip calon mahasiswa hasil filter kustom.</p>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <select
              v-model="filterProdi"
              class="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none"
            >
              <option value="all">Semua Program Studi</option>
              <option v-for="p in prodiOptions" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-700 min-w-[860px]">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-sora uppercase text-[10px] whitespace-nowrap">
              <tr>
                <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[130px]">No. Registrasi</th>
                <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[180px]">Nama Mahasiswa</th>
                <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[180px]">Program Studi</th>
                <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[90px]">Formulir</th>
                <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[90px]">Skor CBT</th>
                <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[110px]">Status LoA</th>
                <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[140px]">UKT Semester 1</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-sans">
              <tr v-for="a in filteredReportApplicants" :key="a.id" class="hover:bg-slate-50/80">
                <td class="py-3 px-4 font-mono font-bold text-[#1E3A8A] whitespace-nowrap">{{ a.id }}</td>
                <td class="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">{{ a.fullName }}</td>
                <td class="py-3 px-4 text-slate-600 whitespace-nowrap">{{ a.prodi1 }}</td>
                <td class="py-3 px-4 whitespace-nowrap">
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap"
                    :class="a.payments.registrationFee.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'"
                  >
                    {{ a.payments.registrationFee.status === 'paid' ? 'Lunas' : 'Belum' }}
                  </span>
                </td>
                <td class="py-3 px-4 font-mono font-bold whitespace-nowrap">{{ a.selection.cbtScore }}</td>
                <td class="py-3 px-4 whitespace-nowrap">
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap"
                    :class="a.selection.passedStatus === 'passed' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'"
                  >
                    {{ a.selection.passedStatus === 'passed' ? 'Lulus' : 'Evaluasi' }}
                  </span>
                </td>
                <td class="py-3 px-4 whitespace-nowrap">
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap"
                    :class="a.payments.uktFee.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'"
                  >
                    {{ a.payments.uktFee.status === 'paid' ? 'Lunas UKT' : 'Menunggu' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- TAB 2: NOTIFICATION & MESSAGE BROADCAST CENTER                   -->
    <!-- ================================================================= -->
    <div v-else-if="activeSubTab === 'broadcast'" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Message Composer Form (Col 2) -->
        <div class="lg:col-span-2 bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
                Formulir Notifikasi & Pengumuman Massal
              </h3>
              <p class="text-xs text-slate-500">Kirimkan instruksi resmi, pengingat tenggat pembayaran, dan jadwal seleksi kepada calon mahasiswa.</p>
            </div>
            <span class="text-xs text-slate-500 font-sans">
              Saluran: WhatsApp & Email
            </span>
          </div>

          <form @submit.prevent="dispatchBroadcast" class="space-y-4 text-xs">
            <!-- Pilihan Template Siaran -->
            <div>
              <label class="block font-medium text-slate-700 mb-1">Pilih Template Pesan Siaran</label>
              <select
                v-model="selectedTemplate"
                @change="applyTemplate"
                class="w-full px-3.5 py-2 bg-white border border-slate-300 focus:border-[#1E3A8A] rounded-lg outline-none text-slate-800"
              >
                <option value="reminder_reg">Pengingat: Batas Waktu Pembayaran Biaya Formulir</option>
                <option value="schedule_cbt">Panggilan: Sesi Ujian CBT Online & Wawancara</option>
                <option value="announcement_loa">Pengumuman: Surat Penerimaan (LoA) & Penetapan Kelulusan</option>
                <option value="reminder_ukt">Peringatan: Batas Akhir Pelunasan UKT Semester 1</option>
                <option value="custom">Pesan Kustom Panitia PMB</option>
              </select>
            </div>

            <!-- Target Segment Audience -->
            <div>
              <label class="block font-medium text-slate-700 mb-1">Target Segmen Calon Mahasiswa</label>
              <select
                v-model="targetAudience"
                class="w-full px-3.5 py-2 bg-white border border-slate-300 focus:border-[#1E3A8A] rounded-lg outline-none text-slate-800 font-semibold"
              >
                <option value="all">Semua Pendaftar Terdata ({{ adminStore.applicants.length }} Mahasiswa)</option>
                <option value="unpaid_reg">Pendaftar Belum Bayar Formulir ({{ unpaidRegApplicantsCount }} Orang)</option>
                <option value="ready_cbt">Peserta Siap Ujian CBT ({{ readyCbtApplicantsCount }} Orang)</option>
                <option value="passed_unpaid_ukt">Lulus Seleksi Belum Lunas UKT ({{ passedUnpaidUktCount }} Orang)</option>
              </select>
            </div>

            <!-- Saluran Pengiriman -->
            <div>
              <label class="block font-medium text-slate-700 mb-1">Saluran Pengiriman</label>
              <div class="flex items-center gap-4">
                <label class="inline-flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" v-model="channels.whatsapp" class="rounded text-[#1E3A8A]" />
                  <span class="font-medium text-slate-800">WhatsApp Gateway Resmi</span>
                </label>
                <label class="inline-flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" v-model="channels.email" class="rounded text-[#1E3A8A]" />
                  <span class="font-medium text-slate-800">Email Kampus BTH</span>
                </label>
              </div>
            </div>

            <!-- Judul Pesan -->
            <div>
              <label class="block font-medium text-slate-700 mb-1">Subjek / Judul Notifikasi</label>
              <input
                v-model="broadcastSubject"
                type="text"
                required
                class="w-full px-3.5 py-2 bg-white border border-slate-300 focus:border-[#1E3A8A] rounded-lg outline-none text-slate-900 font-sora font-semibold"
              />
            </div>

            <!-- Body Pesan -->
            <div>
              <label class="block font-medium text-slate-700 mb-1">Isi Pesan Siaran</label>
              <textarea
                v-model="broadcastBody"
                rows="5"
                required
                class="w-full px-3.5 py-2 bg-white border border-slate-300 focus:border-[#1E3A8A] rounded-lg outline-none text-slate-800 font-sans"
              ></textarea>
              <span class="text-[11px] text-slate-400 mt-1 block">
                Variabel dinamis yang didukung: <code>[NAMA_LENGKAP]</code>, <code>[NO_REGISTRASI]</code>, <code>[PRODI]</code>.
              </span>
            </div>

            <div class="pt-2 flex items-center justify-between border-t border-slate-100">
              <span class="text-xs text-slate-500">
                Penerima terestimasi: <strong>{{ computedTargetCount }} calon mahasiswa</strong>
              </span>
              <button
                type="submit"
                :disabled="isDispatching"
                class="px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <svg v-if="isDispatching" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>{{ isDispatching ? 'Mengirim Siaran...' : 'Kirim Siaran Notifikasi Sekarang' }}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Live Preview & Delivery History (Col 1) -->
        <div class="space-y-4">
          <!-- Clean Message Preview -->
          <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div class="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                  WA
                </div>
                <span class="font-sora font-semibold text-slate-800 text-xs">Pratinjau Pesan Siaran</span>
              </div>
              <span class="text-[10px] text-slate-400 font-mono">WhatsApp & Email</span>
            </div>
            <div class="bg-slate-50 border border-slate-200/80 p-3.5 rounded-lg text-xs text-slate-800 space-y-2 leading-relaxed font-sans">
              <div class="font-semibold text-slate-900 font-sora text-xs pb-1.5 border-b border-slate-200/60">{{ broadcastSubject || 'Subjek Notifikasi' }}</div>
              <p class="text-[11px] text-slate-600 whitespace-pre-line">{{ previewPersonalizedBody }}</p>
              <div class="text-[10px] text-slate-400 text-right pt-1 font-mono">Pengirim: Panitia PMB BTH</div>
            </div>
          </div>

          <!-- Dispatch Log History -->
          <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h4 class="font-sora font-bold text-slate-900 text-xs uppercase tracking-wider">
              Riwayat Siaran Terkirim
            </h4>
            <div class="space-y-2 text-xs">
              <div
                v-for="(log, idx) in broadcastLogs"
                :key="idx"
                class="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1"
              >
                <div class="flex justify-between items-center">
                  <span class="font-semibold text-slate-800 truncate max-w-[170px]">{{ log.title }}</span>
                  <span class="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded font-mono">{{ log.status }}</span>
                </div>
                <div class="flex justify-between text-[10px] text-slate-400">
                  <span>{{ log.recipients }} Calon Mahasiswa</span>
                  <span>{{ log.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- TAB 3: ADVANCED FINANCIAL LEDGER & RECONCILIATION                 -->
    <!-- ================================================================= -->
    <div v-else-if="activeSubTab === 'ledger'" class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Penerimaan VA Bank Syariah Indonesia</div>
          <div class="font-sora font-extrabold text-2xl text-[#1E3A8A] mt-1">
            Rp {{ (totalBsiRevenue).toLocaleString('id-ID') }}
          </div>
          <div class="text-xs text-slate-500 mt-1">Kode Institusi BSI: 900 7800</div>
        </div>

        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Penerimaan VA Bank Mandiri</div>
          <div class="font-sora font-extrabold text-2xl text-slate-900 mt-1">
            Rp {{ (totalMandiriRevenue).toLocaleString('id-ID') }}
          </div>
          <div class="text-xs text-slate-500 mt-1">Kode Perusahaan Mandiri: 88708</div>
        </div>

        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estimasi Piutang UKT Tertunda</div>
          <div class="font-sora font-extrabold text-2xl text-rose-600 mt-1">
            Rp {{ (totalPendingUktReceivables).toLocaleString('id-ID') }}
          </div>
          <div class="text-xs text-amber-600 font-medium mt-1">
            {{ passedUnpaidUktCount }} Mahasiswa Lulus Belum Lunas UKT
          </div>
        </div>
      </div>

      <!-- Detail Ledger Breakdown -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 class="font-sora font-bold text-slate-900 text-sm">
            Buku Besar Kas Masuk Host-to-Host (Rekonsiliasi Otomatis)
          </h3>
          <span class="text-xs text-emerald-600 font-mono font-semibold">Tersinkronisasi Otomatis</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-700 min-w-[850px]">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-sora uppercase text-[10px] whitespace-nowrap">
              <tr>
                <th class="py-3 px-4 font-bold whitespace-nowrap min-w-[120px]">Waktu Transaksi</th>
                <th class="py-3 px-4 font-bold whitespace-nowrap min-w-[150px]">No. Invoice & VA</th>
                <th class="py-3 px-4 font-bold whitespace-nowrap min-w-[180px]">Nama Mahasiswa</th>
                <th class="py-3 px-4 font-bold whitespace-nowrap min-w-[140px]">Jenis Pembayaran</th>
                <th class="py-3 px-4 font-bold whitespace-nowrap min-w-[110px]">Kanal Bank</th>
                <th class="py-3 px-4 font-bold text-right whitespace-nowrap min-w-[140px]">Kredit Masuk</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-sans">
              <tr v-for="trx in completedLedgerRows" :key="trx.id" class="hover:bg-slate-50/80">
                <td class="py-3 px-4 text-slate-500 whitespace-nowrap">{{ trx.time }}</td>
                <td class="py-3 px-4 font-mono font-medium text-slate-800 whitespace-nowrap">{{ trx.invoice }}</td>
                <td class="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">{{ trx.name }}</td>
                <td class="py-3 px-4 text-slate-700 whitespace-nowrap">{{ trx.type }}</td>
                <td class="py-3 px-4 font-mono whitespace-nowrap">{{ trx.bank }}</td>
                <td class="py-3 px-4 text-right font-mono font-bold text-emerald-700 whitespace-nowrap min-w-[140px]">
                  Rp {{ trx.amount.toLocaleString('id-ID') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- MODAL PRATINJAU CETAK LAPORAN RESMI (PRINT PREVIEW)              -->
    <!-- ================================================================= -->
    <Teleport to="body">
      <div
        v-if="printModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        @click.self="printModalOpen = false"
      >
        <div class="bg-white rounded-xl max-w-3xl w-full p-6 sm:p-8 shadow-xl border border-slate-200 relative max-h-[90vh] overflow-y-auto my-auto">
        <button
          @click="printModalOpen = false"
          class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 text-2xl font-bold leading-none cursor-pointer"
        >
          &times;
        </button>

        <!-- Official Academic Letterhead -->
        <div class="text-center pb-4 border-b-2 border-slate-900">
          <div class="text-xs uppercase font-bold text-slate-600 tracking-widest">
            Yayasan Bakti Tunas Husada Tasikmalaya
          </div>
          <div class="font-sora font-black text-xl text-[#1E3A8A] tracking-tight mt-0.5">
            UNIVERSITAS BAKTI TUNAS HUSADA
          </div>
          <div class="text-[11px] text-slate-500">
            Jl. Cilolohan No. 36, Kahuripan, Tawang, Kota Tasikmalaya, Jawa Barat 46115<br />
            Sekretariat Panitia PMB TA 2026/2027 | Pos-el: pmb@bth.ac.id | Telp: (0265) 334111
          </div>
        </div>

        <!-- Report Content Details -->
        <div class="py-5 space-y-4 text-xs text-slate-800">
          <div class="text-center space-y-1">
            <h4 class="font-sora font-extrabold text-sm sm:text-base text-slate-900 uppercase">
              {{ formalReportTitle }}
            </h4>
            <div class="font-mono text-[11px] text-slate-500">
              Nomor Berita Acara: 042/BA-PMB/UBTH/IX/2026
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-[11px] border border-slate-200 min-w-[650px]">
              <thead class="bg-slate-100 text-slate-800 font-bold border-b border-slate-200 whitespace-nowrap">
                <tr>
                  <th class="p-2 whitespace-nowrap min-w-[100px]">No. Reg</th>
                  <th class="p-2 whitespace-nowrap min-w-[180px]">Nama Calon Mahasiswa</th>
                  <th class="p-2 whitespace-nowrap min-w-[160px]">Prodi Pilihan</th>
                  <th class="p-2 whitespace-nowrap min-w-[100px]">Status Seleksi</th>
                  <th class="p-2 whitespace-nowrap min-w-[100px]">Status Biaya</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-sans">
                <tr v-for="a in adminStore.applicants" :key="a.id">
                  <td class="p-2 font-mono whitespace-nowrap">{{ a.id }}</td>
                  <td class="p-2 font-medium whitespace-nowrap">{{ a.fullName }}</td>
                  <td class="p-2 whitespace-nowrap">{{ a.prodi1 }}</td>
                  <td class="p-2 font-semibold whitespace-nowrap">{{ a.selection.passedStatus === 'passed' ? 'Lulus' : 'Dalam Proses' }}</td>
                  <td class="p-2 whitespace-nowrap">{{ a.payments.uktFee.status === 'paid' ? 'Lunas UKT' : 'Pending UKT' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Signatures -->
          <div class="pt-6 flex justify-between items-end text-[11px]">
            <div>
              <div class="text-slate-400">Dicetak melalui Sistem PMB BTH:</div>
              <div class="font-mono text-slate-500">{{ new Date().toLocaleString('id-ID') }}</div>
            </div>
            <div class="text-right space-y-1">
              <div class="text-slate-600">Tasikmalaya, 21 September 2026</div>
              <div class="font-bold text-slate-900 font-sora">Ketua Panitia PMB 2026,</div>
              <div class="h-10"></div>
              <div class="font-bold underline text-slate-900">apt. Dedi Mulyadi, M.Farm.</div>
              <div class="text-slate-500 text-[10px]">NIP. 19800314 200501 1 003</div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
          <button
            @click="triggerPrint"
            class="px-5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Cetak Dokumen Resmi</span>
          </button>
          <button
            @click="printModalOpen = false"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useAdminStore } from '@/stores/admin';
import { PRODI_METADATA } from '@/stores/applicant';
import { exportToExcelTable, exportToCsvSeparated, exportToSevimaMigrationExcel, exportToSevimaMigrationCsv } from '@/utils/exportHelper';
import { useToast } from '@/composables/useToast';

const props = defineProps({
  currentRole: {
    type: String,
    default: () => localStorage.getItem('bth_admin_rbac_role') || 'superadmin',
  },
});

const adminStore = useAdminStore();
const toast = useToast();
const userRole = computed(() => props.currentRole || localStorage.getItem('bth_admin_rbac_role') || 'superadmin');

const canAccessSubTab = (tab) => {
  if (tab === 'reporting') return ['superadmin', 'keuangan', 'prodi', 'pimpinan'].includes(userRole.value);
  if (tab === 'broadcast') return ['superadmin'].includes(userRole.value);
  if (tab === 'ledger') return ['superadmin', 'keuangan', 'pimpinan'].includes(userRole.value);
  return false;
};

const activeSubTab = ref(canAccessSubTab('reporting') ? 'reporting' : 'ledger');

watch(userRole, () => {
  if (!canAccessSubTab(activeSubTab.value)) {
    activeSubTab.value = canAccessSubTab('reporting') ? 'reporting' : canAccessSubTab('ledger') ? 'ledger' : 'broadcast';
  }
});
const filterProdi = ref('all');
const printModalOpen = ref(false);
const printType = ref('pendaftar');
const isDispatching = ref(false);

const prodiOptions = Object.keys(PRODI_METADATA);

// Broadcast state
const selectedTemplate = ref('reminder_reg');
const targetAudience = ref('all');
const channels = ref({ whatsapp: true, email: true });
const broadcastSubject = ref('Pengingat Pembayaran Formulir PMB BTH 2026/2027');
const broadcastBody = ref(
  'Halo [NAMA_LENGKAP]! Terima kasih telah mendaftar di Universitas Bakti Tunas Husada. Mohon segera selesaikan pembayaran biaya formulir pendaftaran untuk aktivasi sesi Ujian CBT Anda.'
);

const broadcastLogs = ref([
  {
    title: 'Pengingat Pembayaran Formulir Gel. 1',
    status: 'Terkirim',
    recipients: 5,
    time: '21 Sep 2026, 14:00',
  },
  {
    title: 'Instruksi Teknis Ujian CBT Online',
    status: 'Terkirim',
    recipients: 4,
    time: '20 Sep 2026, 09:30',
  },
]);

// Counts
const unpaidRegApplicantsCount = computed(() => {
  return adminStore.applicants.filter((a) => a.payments.registrationFee.status !== 'paid').length;
});

const readyCbtApplicantsCount = computed(() => {
  return adminStore.applicants.filter((a) => a.payments.registrationFee.status === 'paid').length;
});

const passedUnpaidUktCount = computed(() => {
  return adminStore.applicants.filter((a) => a.selection.passedStatus === 'passed' && a.payments.uktFee.status !== 'paid').length;
});

const computedTargetCount = computed(() => {
  if (targetAudience.value === 'unpaid_reg') return unpaidRegApplicantsCount.value;
  if (targetAudience.value === 'ready_cbt') return readyCbtApplicantsCount.value;
  if (targetAudience.value === 'passed_unpaid_ukt') return passedUnpaidUktCount.value;
  return adminStore.applicants.length;
});

const previewPersonalizedBody = computed(() => {
  const sample = adminStore.applicants[0] || {
    fullName: 'Calon Mahasiswa Baru',
    id: 'BTH-2026-REG-XXXXX',
    prodi1: 'S1 Farmasi',
  };
  return broadcastBody.value
    .replace('[NAMA_LENGKAP]', sample.fullName)
    .replace('[NO_REGISTRASI]', sample.id)
    .replace('[PRODI]', sample.prodi1);
});

const filteredReportApplicants = computed(() => {
  if (filterProdi.value === 'all') return adminStore.applicants;
  return adminStore.applicants.filter((a) => a.prodi1 === filterProdi.value);
});

// Financial Ledger
const totalBsiRevenue = computed(() => {
  let sum = 0;
  adminStore.applicants.forEach((a) => {
    if (a.payments?.registrationFee?.status === 'paid' && a.payments?.registrationFee?.method?.includes('BSI')) {
      sum += a.payments.registrationFee.amount || 0;
    }
    if (a.payments?.uktFee?.status === 'paid' && a.payments?.uktFee?.method?.includes('BSI')) {
      sum += a.payments.uktFee.amount || 0;
    }
  });
  return sum;
});

const totalMandiriRevenue = computed(() => {
  let sum = 0;
  adminStore.applicants.forEach((a) => {
    if (a.payments?.registrationFee?.status === 'paid' && a.payments?.registrationFee?.method?.includes('Mandiri')) {
      sum += a.payments.registrationFee.amount || 0;
    }
    if (a.payments?.uktFee?.status === 'paid' && a.payments?.uktFee?.method?.includes('Mandiri')) {
      sum += a.payments.uktFee.amount || 0;
    }
  });
  return sum;
});

const totalPendingUktReceivables = computed(() => {
  let sum = 0;
  adminStore.applicants.forEach((a) => {
    if (a.selection.passedStatus === 'passed' && a.payments.uktFee.status !== 'paid') {
      sum += a.payments.uktFee.amount || 0;
    }
  });
  return sum;
});

const completedLedgerRows = computed(() => {
  const rows = [];
  adminStore.applicants.forEach((a) => {
    if (a.payments.registrationFee.status === 'paid') {
      rows.push({
        id: `reg-${a.id}`,
        time: a.payments.registrationFee.paidAt || 'Terkonfirmasi',
        invoice: a.payments.registrationFee.id || 'INV-REG-2026',
        name: a.fullName,
        type: 'Biaya Formulir PMB',
        bank: a.payments.registrationFee.method?.includes('Mandiri') ? 'VA Mandiri' : 'VA BSI',
        amount: a.payments.registrationFee.amount || 250000,
      });
    }
    if (a.payments.uktFee.status === 'paid') {
      rows.push({
        id: `ukt-${a.id}`,
        time: a.payments.uktFee.paidAt || 'Terkonfirmasi',
        invoice: a.payments.uktFee.id || 'INV-UKT-2026',
        name: a.fullName,
        type: 'UKT Semester 1 (Daftar Ulang)',
        bank: a.payments.uktFee.method?.includes('Mandiri') ? 'VA Mandiri' : 'VA BSI',
        amount: a.payments.uktFee.amount || 4500000,
      });
    }
  });
  return rows;
});

const applyTemplate = () => {
  const t = selectedTemplate.value;
  if (t === 'reminder_reg') {
    broadcastSubject.value = 'Pengingat Pembayaran Formulir PMB BTH 2026/2027';
    broadcastBody.value =
      'Halo [NAMA_LENGKAP]! Terima kasih telah mendaftar di Universitas Bakti Tunas Husada. Mohon segera selesaikan pembayaran biaya formulir pendaftaran untuk aktivasi sesi Ujian CBT Anda.';
  } else if (t === 'schedule_cbt') {
    broadcastSubject.value = 'Panggilan Ujian Mandiri CBT & Wawancara Peminatan';
    broadcastBody.value =
      'Yth. [NAMA_LENGKAP] ([NO_REGISTRASI]), Anda dijadwalkan mengikuti Ujian CBT Online mandiri prodi [PRODI]. Harap masuk ke portal ujian 15 menit sebelum waktu pengerjaan.';
  } else if (t === 'announcement_loa') {
    broadcastSubject.value = 'Pemberitahuan Penetapan Kelulusan & Surat Penerimaan (LoA)';
    broadcastBody.value =
      'Selamat [NAMA_LENGKAP]! Anda resmi dinyatakan LULUS SELEKSI pada program studi [PRODI]. Silakan unduh Surat Penerimaan (LoA) resmi di portal pendaftaran dan tuntaskan daftar ulang.';
  } else if (t === 'reminder_ukt') {
    broadcastSubject.value = 'Pengingat Batas Waktu Registrasi Ulang UKT Semester 1';
    broadcastBody.value =
      'Pemberitahuan: Batas akhir pembayaran UKT Semester 1 untuk penerbitan NIM resmi prodi [PRODI] adalah tanggal 28 Oktober 2026. Mohon segera lakukan pembayaran via VA BSI / Mandiri.';
  }
};

const dispatchBroadcast = () => {
  isDispatching.value = true;
  setTimeout(() => {
    isDispatching.value = false;
    broadcastLogs.value.unshift({
      title: broadcastSubject.value,
      status: 'Terkirim',
      recipients: computedTargetCount.value,
      time: new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    });
    toast.success(`Siaran notifikasi "${broadcastSubject.value}" berhasil dikirimkan kepada ${computedTargetCount.value} calon mahasiswa.`);
  }, 1200);
};

const exportReport = (type) => {
  const applicants = filteredReportApplicants.value;
  const columns = [
    { header: 'No.', key: 'index', align: 'center' },
    { header: 'No. Registrasi', key: 'id', align: 'center' },
    { header: 'Nama Lengkap Calon Mahasiswa', key: 'fullName', align: 'left' },
    { header: 'NIK', key: 'nik', align: 'center' },
    { header: 'Asal Sekolah', key: 'schoolName', align: 'left' },
    { header: 'Program Studi', key: 'prodi1', align: 'left' },
    { header: 'Status Seleksi', key: 'selectionStatus', align: 'center', format: 'status' },
    { header: 'Biaya Formulir', key: 'regStatus', align: 'center', format: 'status' },
    { header: 'Status UKT', key: 'uktStatus', align: 'center', format: 'status' },
  ];

  const formattedData = applicants.map((a, idx) => ({
    index: idx + 1,
    id: a.id,
    fullName: a.fullName,
    nik: a.nik,
    schoolName: a.schoolName,
    prodi1: a.prodi1,
    selectionStatus: a.selection?.passedStatus === 'passed' ? 'Lulus Seleksi' : a.selection?.passedStatus === 'evaluating' ? 'Evaluasi Pleno' : 'Tidak Lulus',
    regStatus: a.payments?.registrationFee?.status === 'paid' ? 'Lunas' : 'Belum Bayar',
    uktStatus: a.payments?.uktFee?.status === 'paid' ? 'Lunas' : 'Belum Bayar',
  }));

  exportToExcelTable({
    filename: `Rekap_PMB_BTH_${type}_${new Date().toISOString().slice(0, 10)}`,
    title: 'UNIVERSITAS BAKTI TUNAS HUSADA - SISTEM PMB',
    subtitle: `REKAPITULASI LAPORAN DATA EKSEKUTIF PMB TA 2026/2027 (${type.toUpperCase()})`,
    metadata: [
      { label: 'Waktu Pengunduhan', value: new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'medium' }) },
      { label: 'Total Pendaftar', value: `${applicants.length} Calon Mahasiswa` },
    ],
    columns,
    data: formattedData,
  });

  toast.success(`Rekapitulasi ${type} berhasil diunduh dalam format tabel Excel.`);
};

const exportSevimaExcel = () => {
  const applicants = adminStore.applicants || [];
  if (applicants.length === 0) {
    toast.error('Belum ada data pendaftar untuk diekspor.');
    return;
  }
  exportToSevimaMigrationExcel({
    filename: `Format_Migrasi_SEVIMA_PMB_BTH_${new Date().toISOString().slice(0, 10)}`,
    applicants,
  });
  toast.success(`Berhasil mengekspor ${applicants.length} pendaftar ke format migrasi resmi SEVIMA (.xls).`);
};

const exportSevimaCsv = () => {
  const applicants = adminStore.applicants || [];
  if (applicants.length === 0) {
    toast.error('Belum ada data pendaftar untuk diekspor.');
    return;
  }
  exportToSevimaMigrationCsv({
    filename: `Format_Migrasi_SEVIMA_PMB_BTH_${new Date().toISOString().slice(0, 10)}`,
    applicants,
  });
  toast.success(`Berhasil mengekspor ${applicants.length} pendaftar ke format CSV SEVIMA.`);
};

const formalReportTitle = computed(() => {
  if (printType.value === 'kelulusan') return 'BERITA ACARA & LAPORAN PENETAPAN KELULUSAN SELEKSI PMB TA 2026/2027';
  if (printType.value === 'keuangan') return 'LAPORAN REKONSILIASI KEUANGAN & PEMBUKUAN PMB TA 2026/2027';
  return 'LAPORAN REKAPITULASI PENDAFTARAN MAHASISWA BARU TA 2026/2027';
});

const openFormalPrintModal = (type) => {
  printType.value = type;
  printModalOpen.value = true;
};

const triggerPrint = () => {
  window.print();
};
</script>
