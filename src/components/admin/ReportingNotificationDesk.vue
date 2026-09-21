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
      <div class="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-sora font-semibold">
        <button
          @click="activeSubTab = 'reporting'"
          class="px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          :class="activeSubTab === 'reporting' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>1. Ekspor Laporan Resmi</span>
        </button>

        <button
          @click="activeSubTab = 'broadcast'"
          class="px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          :class="activeSubTab === 'broadcast' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <span>2. Broadcast Notifikasi Massal</span>
        </button>

        <button
          @click="activeSubTab = 'ledger'"
          class="px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          :class="activeSubTab === 'ledger' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>3. Buku Besar Kas Masuk</span>
        </button>
      </div>
    </div>

    <!-- Alert Toast Feedback -->
    <div
      v-if="toastMessage"
      class="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between animate-fadeIn"
    >
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>{{ toastMessage }}</span>
      </div>
      <button @click="toastMessage = ''" class="text-emerald-600 hover:text-emerald-900 font-bold text-sm leading-none">&times;</button>
    </div>

    <!-- ================================================================= -->
    <!-- TAB 1: EXECUTIVE REPORTING & EXPORT CENTER                        -->
    <!-- ================================================================= -->
    <div v-if="activeSubTab === 'reporting'" class="space-y-6 animate-fadeIn">
      <!-- 3 Pre-Packaged Official Report Options -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- 1. Rekap Pendaftaran -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
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
              class="flex-1 py-2 bg-slate-100 hover:bg-[#1E3A8A] hover:text-white text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer text-center"
            >
              Unduh CSV
            </button>
            <button
              @click="openFormalPrintModal('pendaftar')"
              class="px-3 py-2 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
              title="Pratinjau Format Cetak Resmi"
            >
              Cetak
            </button>
          </div>
        </div>

        <!-- 2. Rekap Kelulusan CBT & LoA -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
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
              class="flex-1 py-2 bg-slate-100 hover:bg-[#1E3A8A] hover:text-white text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer text-center"
            >
              Unduh CSV
            </button>
            <button
              @click="openFormalPrintModal('kelulusan')"
              class="px-3 py-2 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
              title="Pratinjau Format Cetak Resmi"
            >
              Cetak
            </button>
          </div>
        </div>

        <!-- 3. Rekap Keuangan & Piutang UKT -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
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
              class="flex-1 py-2 bg-slate-100 hover:bg-[#1E3A8A] hover:text-white text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer text-center"
            >
              Unduh CSV
            </button>
            <button
              @click="openFormalPrintModal('keuangan')"
              class="px-3 py-2 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
              title="Pratinjau Format Cetak Resmi"
            >
              Cetak
            </button>
          </div>
        </div>
      </div>

      <!-- Filterable Interactive Data Preview Table -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div class="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-sm">Pratinjau Data Rekapitulasi Terpadu</h3>
            <p class="text-xs text-slate-500">Menampilkan seluruh arsip calon mahasiswa hasil filter kustom.</p>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <select
              v-model="filterProdi"
              class="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
            >
              <option value="all">Semua Program Studi</option>
              <option v-for="p in prodiOptions" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-700">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-sora uppercase text-[10px]">
              <tr>
                <th class="py-3 px-4 font-bold">No. Registrasi</th>
                <th class="py-3 px-4 font-bold">Nama Mahasiswa</th>
                <th class="py-3 px-4 font-bold">Program Studi</th>
                <th class="py-3 px-4 font-bold">Formulir</th>
                <th class="py-3 px-4 font-bold">Skor CBT</th>
                <th class="py-3 px-4 font-bold">Status LoA</th>
                <th class="py-3 px-4 font-bold">UKT Semester 1</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="a in filteredReportApplicants" :key="a.id" class="hover:bg-slate-50/80">
                <td class="py-3 px-4 font-mono font-bold text-[#1E3A8A]">{{ a.id }}</td>
                <td class="py-3 px-4 font-medium text-slate-900">{{ a.fullName }}</td>
                <td class="py-3 px-4 text-slate-600">{{ a.prodi1 }}</td>
                <td class="py-3 px-4">
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-bold"
                    :class="a.payments.registrationFee.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'"
                  >
                    {{ a.payments.registrationFee.status === 'paid' ? 'Lunas' : 'Belum' }}
                  </span>
                </td>
                <td class="py-3 px-4 font-mono font-bold">{{ a.selection.cbtScore }}</td>
                <td class="py-3 px-4">
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-bold"
                    :class="a.selection.passedStatus === 'passed' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'"
                  >
                    {{ a.selection.passedStatus === 'passed' ? 'Lulus' : 'Evaluasi' }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-bold"
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
    <div v-else-if="activeSubTab === 'broadcast'" class="space-y-6 animate-fadeIn">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Message Composer Form (Col 2) -->
        <div class="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
                Formulir Siaran Notifikasi Massal (Blast)
              </h3>
              <p class="text-xs text-slate-500">Kirimkan instruksi resmi, pengingat tenggat pembayaran, dan jadwal ujian.</p>
            </div>
            <span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200 font-mono">
              WhatsApp & Email Aktif
            </span>
          </div>

          <form @submit.prevent="dispatchBroadcast" class="space-y-4 text-xs">
            <!-- Pilihan Template Siaran -->
            <div>
              <label class="block font-medium text-slate-700 mb-1">Pilih Template Pesan Siaran</label>
              <select
                v-model="selectedTemplate"
                @change="applyTemplate"
                class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] rounded-xl outline-none text-slate-800"
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
                class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] rounded-xl outline-none text-slate-800 font-semibold"
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
                class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] rounded-xl outline-none text-slate-900 font-sora font-semibold"
              />
            </div>

            <!-- Body Pesan -->
            <div>
              <label class="block font-medium text-slate-700 mb-1">Isi Pesan Siaran</label>
              <textarea
                v-model="broadcastBody"
                rows="5"
                required
                class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] rounded-xl outline-none text-slate-800 font-sans"
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
                class="px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
          <!-- WhatsApp Card Style Preview -->
          <div class="bg-[#0b141a] text-white rounded-2xl p-4 shadow-md space-y-2 border border-slate-800">
            <div class="flex items-center gap-2 pb-2 border-b border-white/10 text-xs">
              <div class="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white text-[10px]">
                WA
              </div>
              <span class="font-sora font-semibold text-white">PMB Universitas BTH (Centang Hijau)</span>
            </div>
            <div class="bg-[#202c33] p-3 rounded-xl text-xs text-slate-100 space-y-1.5 leading-relaxed font-sans">
              <div class="font-bold text-emerald-400 font-sora">{{ broadcastSubject }}</div>
              <p class="text-[11px] text-slate-300 whitespace-pre-line">{{ previewPersonalizedBody }}</p>
              <div class="text-[9px] text-slate-400 text-right">Baru saja • Terkirim Resmi</div>
            </div>
          </div>

          <!-- Dispatch Log History -->
          <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h4 class="font-sora font-bold text-slate-900 text-xs uppercase tracking-wider">
              Riwayat Siaran Terkirim
            </h4>
            <div class="space-y-2 text-xs">
              <div
                v-for="(log, idx) in broadcastLogs"
                :key="idx"
                class="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1"
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
    <div v-else-if="activeSubTab === 'ledger'" class="space-y-6 animate-fadeIn">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Penerimaan VA Bank Syariah Indonesia</div>
          <div class="font-sora font-extrabold text-2xl text-[#1E3A8A] mt-1">
            Rp {{ (totalBsiRevenue).toLocaleString('id-ID') }}
          </div>
          <div class="text-xs text-slate-500 mt-1">Kode Institusi BSI: 900 7800</div>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Penerimaan VA Bank Mandiri</div>
          <div class="font-sora font-extrabold text-2xl text-slate-900 mt-1">
            Rp {{ (totalMandiriRevenue).toLocaleString('id-ID') }}
          </div>
          <div class="text-xs text-slate-500 mt-1">Kode Perusahaan Mandiri: 88708</div>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
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
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 class="font-sora font-bold text-slate-900 text-sm">
            Buku Besar Kas Masuk Host-to-Host (Rekonsiliasi Otomatis)
          </h3>
          <span class="text-xs text-emerald-600 font-mono font-semibold">Tersinkronisasi Real-Time</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-700">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-sora uppercase text-[10px]">
              <tr>
                <th class="py-3 px-4 font-bold">Waktu Transaksi</th>
                <th class="py-3 px-4 font-bold">No. Invoice & VA</th>
                <th class="py-3 px-4 font-bold">Nama Mahasiswa</th>
                <th class="py-3 px-4 font-bold">Jenis Pembayaran</th>
                <th class="py-3 px-4 font-bold">Kanal Bank</th>
                <th class="py-3 px-4 font-bold text-right">Kredit Masuk</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-sans">
              <tr v-for="trx in completedLedgerRows" :key="trx.id" class="hover:bg-slate-50/80">
                <td class="py-3 px-4 text-slate-500">{{ trx.time }}</td>
                <td class="py-3 px-4 font-mono font-medium text-slate-800">{{ trx.invoice }}</td>
                <td class="py-3 px-4 font-medium text-slate-900">{{ trx.name }}</td>
                <td class="py-3 px-4 text-slate-700">{{ trx.type }}</td>
                <td class="py-3 px-4 font-mono">{{ trx.bank }}</td>
                <td class="py-3 px-4 text-right font-mono font-bold text-emerald-700">
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
    <div
      v-if="printModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
    >
      <div class="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
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
            Sekretariat Panitia PMB TA 2026/2027 • Pos-el: pmb@bth.ac.id • Telp: (0265) 334111
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
            <table class="w-full text-left text-[11px] border border-slate-200">
              <thead class="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <tr>
                  <th class="p-2">No. Reg</th>
                  <th class="p-2">Nama Calon Mahasiswa</th>
                  <th class="p-2">Prodi Pilihan</th>
                  <th class="p-2">Status Seleksi</th>
                  <th class="p-2">Status Biaya</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="a in adminStore.applicants" :key="a.id">
                  <td class="p-2 font-mono">{{ a.id }}</td>
                  <td class="p-2 font-medium">{{ a.fullName }}</td>
                  <td class="p-2">{{ a.prodi1 }}</td>
                  <td class="p-2 font-semibold">{{ a.selection.passedStatus === 'passed' ? 'Lulus' : 'Dalam Proses' }}</td>
                  <td class="p-2">{{ a.payments.uktFee.status === 'paid' ? 'Lunas UKT' : 'Pending UKT' }}</td>
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
            class="px-5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Cetak Dokumen Resmi</span>
          </button>
          <button
            @click="printModalOpen = false"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAdminStore } from '@/stores/admin';
import { PRODI_METADATA } from '@/stores/applicant';

const adminStore = useAdminStore();
const activeSubTab = ref('reporting');
const filterProdi = ref('all');
const printModalOpen = ref(false);
const printType = ref('pendaftar');
const toastMessage = ref('');
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
    status: 'Delivered (100%)',
    recipients: 5,
    time: '21 Sep 2026, 14:00',
  },
  {
    title: 'Instruksi Teknis Ujian CBT Online',
    status: 'Delivered (100%)',
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
  return broadcastBody.value
    .replace('[NAMA_LENGKAP]', 'Dimas Arya Pratama')
    .replace('[NO_REGISTRASI]', 'BTH-2026-REG-08493')
    .replace('[PRODI]', 'S1 Teknologi Informasi');
});

const filteredReportApplicants = computed(() => {
  if (filterProdi.value === 'all') return adminStore.applicants;
  return adminStore.applicants.filter((a) => a.prodi1 === filterProdi.value);
});

// Financial Ledger
const totalBsiRevenue = computed(() => {
  let sum = 0;
  adminStore.applicants.forEach((a) => {
    if (a.payments.registrationFee.status === 'paid' && a.payments.registrationFee.method?.includes('BSI')) {
      sum += a.payments.registrationFee.amount || 0;
    }
    if (a.payments.uktFee.status === 'paid' && a.payments.uktFee.method?.includes('BSI')) {
      sum += a.payments.uktFee.amount || 0;
    }
  });
  return sum || 11750000;
});

const totalMandiriRevenue = computed(() => {
  let sum = 0;
  adminStore.applicants.forEach((a) => {
    if (a.payments.registrationFee.status === 'paid' && a.payments.registrationFee.method?.includes('Mandiri')) {
      sum += a.payments.registrationFee.amount || 0;
    }
    if (a.payments.uktFee.status === 'paid' && a.payments.uktFee.method?.includes('Mandiri')) {
      sum += a.payments.uktFee.amount || 0;
    }
  });
  return sum || 4750000;
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
      status: 'Delivered (100%)',
      recipients: computedTargetCount.value,
      time: new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    });
    toastMessage.value = `Siaran notifikasi "${broadcastSubject.value}" berhasil disebarkan ke ${computedTargetCount.value} calon mahasiswa.`;
  }, 1200);
};

const exportReport = (type) => {
  const applicants = filteredReportApplicants.value;
  let csvContent = 'No Registrasi,Nama Lengkap,NIK,Asal Sekolah,Program Studi,Status Seleksi,Status Formulir,Status UKT\n';

  applicants.forEach((a) => {
    const row = [
      `"${a.id}"`,
      `"${a.fullName}"`,
      `"${a.nik}"`,
      `"${a.schoolName}"`,
      `"${a.prodi1}"`,
      `"${a.selection.passedStatus}"`,
      `"${a.payments.registrationFee.status}"`,
      `"${a.payments.uktFee.status}"`,
    ];
    csvContent += row.join(',') + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Rekap_PMB_BTH_${type}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toastMessage.value = `Berkas CSV rekapitulasi ${type} berhasil diekspor dan diunduh.`;
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
