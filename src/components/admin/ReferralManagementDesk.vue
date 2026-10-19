<template>
  <div class="space-y-6">
    <!-- Header Meja Kode Referal Guru BK & Mitra Sekolah (CR-014) -->
    <div class="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 class="font-sora font-extrabold text-slate-900 text-lg sm:text-xl">
            Kode Referal & Akun Kemitraan Guru BK
          </h2>
          <p class="text-xs text-slate-500 mt-1 font-sans">
            Pengelolaan akun mitra sekolah, kode referal, dan akumulasi hak komisi kemitraan.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
          <button
            type="button"
            @click="exportReferralReport"
            class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Download class="w-3.5 h-3.5" />
            <span>Ekspor Laporan</span>
          </button>

          <button
            type="button"
            @click="openAddModal"
            class="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-sora font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Plus class="w-4 h-4 text-white" />
            <span>Buat Akun & Kode Baru</span>
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards (Unified Single Desk) -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
        <div class="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sora">Total Mitra Terdaftar</div>
          <div class="font-sora font-extrabold text-xl text-slate-900 mt-1">
            {{ referralList.length }}
          </div>
          <div class="text-[11px] text-slate-500 mt-0.5">
            {{ activeCodesCount }} akun aktif
          </div>
        </div>

        <div class="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sora">Siswa Pendaftar Referal</div>
          <div class="font-sora font-extrabold text-xl text-[#1E3A8A] mt-1">
            {{ totalReferredStudents }}
          </div>
          <div class="text-[11px] text-slate-500 mt-0.5">
            calon mahasiswa terdaftar
          </div>
        </div>

        <div class="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sora">Pembayaran Terverifikasi</div>
          <div class="font-sora font-extrabold text-xl text-emerald-700 mt-1">
            {{ totalVerifiedPayments }}
          </div>
          <div class="text-[11px] text-slate-500 mt-0.5 font-mono">
            Rp {{ (totalSettledAmount).toLocaleString('id-ID') }}
          </div>
        </div>

        <div class="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sora">Total Hak Komisi Mitra</div>
          <div class="font-sora font-extrabold text-base text-emerald-700 mt-1.5 font-mono">
            Rp {{ (totalEarnedCommissions).toLocaleString('id-ID') }}
          </div>
          <div class="text-[11px] text-slate-500 mt-0.5">
            akumulasi insentif mitra
          </div>
        </div>
      </div>

      <!-- SUB-TAB SWITCHER: MITRA SEKOLAH (BK) VS LAPORAN KUNJUNGAN MARKETING -->
      <div class="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl text-xs font-medium self-start w-fit border border-slate-200 mt-4">
        <button
          type="button"
          @click="activeSubTab = 'referrals'"
          class="px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2"
          :class="activeSubTab === 'referrals' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'"
        >
          <Users class="w-4 h-4 text-[#1E3A8A]" />
          <span>Mitra Sekolah & Guru BK ({{ referralList.length }})</span>
        </button>

        <button
          type="button"
          @click="activeSubTab = 'marketing'"
          class="px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2"
          :class="activeSubTab === 'marketing' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'"
        >
          <ExternalLink class="w-4 h-4 text-[#1E3A8A]" />
          <span>Laporan Visitasi Tim Marketing ({{ marketingVisitsList.length }})</span>
        </button>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MEJA UTAMA: DAFTAR MITRA SEKOLAH & PENGATURAN KOMISI                      -->
    <!-- ========================================================================= -->
    <div v-if="activeSubTab === 'referrals'" class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <span class="text-xs font-semibold text-slate-600 whitespace-nowrap">Status:</span>
          <select
            v-model="statusFilter"
            class="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none focus:border-[#1E3A8A]"
          >
            <option value="ALL">Semua Mitra ({{ referralList.length }})</option>
            <option value="ACTIVE">Akun Aktif ({{ activeCodesCount }})</option>
            <option value="INACTIVE">Akun Nonaktif</option>
          </select>
        </div>

        <div class="w-full sm:w-80">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari kode referal / guru BK / sekolah..."
            class="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#1E3A8A] text-slate-800"
          />
        </div>
      </div>

      <!-- Mobile Referral Cards (< md) -->
      <div class="block md:hidden divide-y divide-slate-100">
        <div
          v-for="r in filteredReferrals"
          :key="r.id"
          class="p-4 space-y-3 hover:bg-slate-50/80 transition-colors"
        >
          <!-- Top: School & Referral Code -->
          <div class="flex items-start justify-between gap-2">
            <div>
              <h4 class="font-sora font-bold text-slate-900 text-sm leading-snug">{{ r.schoolName || '-' }}</h4>
              <div class="text-xs text-slate-500 mt-0.5">
                {{ r.picName }} <span v-if="r.schoolCity">• {{ r.schoolCity }}</span>
              </div>
              <div class="text-[11px] text-slate-400 font-mono mt-0.5">{{ r.picPhone }}</div>
            </div>

            <div class="flex items-center gap-1">
              <span class="font-mono font-bold text-slate-900 text-xs px-2.5 py-1 bg-blue-50 border border-blue-200/80 rounded">
                {{ r.code }}
              </span>
              <button
                type="button"
                @click="copyCode(r.code)"
                class="p-1 text-slate-400 hover:text-[#1E3A8A] rounded transition-colors cursor-pointer"
                title="Salin Kode Referal"
              >
                <Copy class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- Parameters: Komisi & Performa Siswa -->
          <div class="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
            <div>
              <span class="text-[10px] text-slate-400 font-bold uppercase block font-sora">Skema Komisi</span>
              <span class="font-semibold text-slate-800 text-xs block mt-0.5">
                {{ r.commissionType === 'percentage' || r.commissionType === 'persen' ? `${r.commissionValue || 10}% / siswa` : `Rp ${(Number(r.commissionValue) || 50000).toLocaleString('id-ID')} / siswa` }}
              </span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 font-bold uppercase block font-sora">Siswa / Hak Komisi</span>
              <div class="flex items-center gap-1 mt-0.5">
                <span class="font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60 text-[11px]">
                  {{ (r.students && r.students.length > 0) ? r.students.filter(s => s.status_approve === 'SUCCESS').length : (r.verifiedCount || 0) }} Lunas
                </span>
                <span class="text-slate-400 text-[10px]">/</span>
                <span class="font-mono text-slate-600 text-[11px]">
                  {{ (r.students && r.students.length > 0) ? r.students.length : (r.registeredCount || 0) }}
                </span>
              </div>
              <div class="text-[10px] font-mono text-emerald-700 font-bold mt-0.5">
                Rp {{ getPartnerEarnedCommission(r).toLocaleString('id-ID') }}
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="pt-1 flex items-center justify-end gap-2">
            <button
              type="button"
              @click="openCommissionModal(r)"
              class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Coins class="w-3.5 h-3.5" />
              <span>Komisi</span>
            </button>
            <button
              type="button"
              @click="openAccountModal(r)"
              class="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#1E3A8A] hover:bg-[#172554] text-white transition-colors cursor-pointer shadow-2xs"
            >
              Akun BK
            </button>
          </div>
        </div>

        <div v-if="filteredReferrals.length === 0" class="py-8 text-center text-slate-400 text-xs">
          Tidak ada kode referal yang cocok dengan filter pencarian.
        </div>
      </div>

      <!-- Desktop Table (>= md) -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-left text-xs min-w-[720px]">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-sora font-semibold whitespace-nowrap">
            <tr>
              <th class="py-3 px-4 w-[30%]">Mitra & Sekolah Asal</th>
              <th class="py-3 px-4 w-[16%]">Kode Referal</th>
              <th class="py-3 px-4 w-[18%]">Skema Komisi</th>
              <th class="py-3 px-4 w-[18%]">Performa & Hak Komisi</th>
              <th class="py-3 px-4 w-[18%] text-right">Aksi Kelola</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-sans">
            <tr
              v-for="r in filteredReferrals"
              :key="r.id"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <!-- 1. Mitra & Sekolah Asal -->
              <td class="py-3.5 px-4">
                <div class="font-semibold text-slate-900 text-xs">{{ r.schoolName || '-' }}</div>
                <div class="text-[11px] text-slate-500 mt-0.5">
                  {{ r.picName }} <span v-if="r.schoolCity">• {{ r.schoolCity }}</span>
                </div>
                <div class="text-[11px] text-slate-400 font-mono mt-0.5">
                  {{ r.picPhone }}
                </div>
              </td>

              <!-- 2. Kode Referal -->
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-1.5">
                  <span class="font-mono font-bold text-slate-900 text-xs px-2.5 py-1 bg-blue-50 border border-blue-200/80 rounded">
                    {{ r.code }}
                  </span>
                  <button
                    type="button"
                    @click="copyCode(r.code)"
                    class="p-1 text-slate-400 hover:text-[#1E3A8A] rounded transition-colors cursor-pointer"
                    title="Salin Kode Referal"
                  >
                    <Copy class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>

              <!-- 3. Skema Komisi -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <div class="font-semibold text-slate-800 text-xs">
                  {{ r.commissionType === 'percentage' || r.commissionType === 'persen' ? `${r.commissionValue || 10}% / siswa` : `Rp ${(Number(r.commissionValue) || 50000).toLocaleString('id-ID')} / siswa` }}
                </div>
              </td>

              <!-- 4. Performa Siswa & Hak Komisi -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <div class="flex items-center gap-1.5">
                  <span class="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 text-xs">
                    {{ (r.students && r.students.length > 0) ? r.students.filter(s => s.status_approve === 'SUCCESS').length : (r.verifiedCount || 0) }} Lunas
                  </span>
                  <span class="text-slate-400 text-[11px]">/</span>
                  <span class="font-mono text-slate-600 text-xs font-semibold">
                    {{ (r.students && r.students.length > 0) ? r.students.length : (r.registeredCount || 0) }} Siswa
                  </span>
                </div>
                <div class="text-[11px] font-mono text-slate-500 mt-1">
                  Komisi: <strong class="text-emerald-700">Rp {{ getPartnerEarnedCommission(r).toLocaleString('id-ID') }}</strong>
                </div>
              </td>

              <!-- 5. Aksi Kelola -->
              <td class="py-3.5 px-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    @click="openCommissionModal(r)"
                    class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                    title="Atur Skema & Nilai Komisi"
                  >
                    <Coins class="w-3.5 h-3.5" />
                    <span>Komisi</span>
                  </button>

                  <button
                    type="button"
                    @click="openAccountModal(r)"
                    class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#1E3A8A] hover:bg-[#172554] text-white transition-colors cursor-pointer"
                    title="Kelola Kredensial & Akun Login Guru BK"
                  >
                    Akun
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredReferrals.length === 0">
              <td colspan="5" class="py-8 text-center text-slate-400">
                Tidak ada kode referal yang cocok dengan filter pencarian.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- TAB 2: LAPORAN VISITASI TIM MARKETING (FOTO KAMERA & GEOTAGGING GPS)      -->
    <!-- ========================================================================= -->
    <div v-else-if="activeSubTab === 'marketing'" class="space-y-4">
      <!-- 3 Kartu KPI Visitasi Marketing -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span class="text-xs text-slate-500 font-medium">Total Visitasi Lapangan</span>
          <div class="my-1">
            <span class="text-xl font-bold font-mono text-slate-900">{{ marketingVisitsList.length }} Kunjungan</span>
          </div>
          <span class="text-[11px] text-slate-500">Tervalidasi dengan foto kamera & GPS</span>
        </div>

        <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span class="text-xs text-slate-500 font-medium">Sekolah Mitra Terjangkau</span>
          <div class="my-1">
            <span class="text-xl font-bold font-mono text-slate-900">{{ uniqueMarketingSchools }} Sekolah</span>
          </div>
          <span class="text-[11px] text-slate-500">Jawa Barat & sekitarnya</span>
        </div>

        <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span class="text-xs text-slate-500 font-medium">Total Audiens Siswa</span>
          <div class="my-1">
            <span class="text-xl font-bold font-mono text-slate-900">{{ totalMarketingAudiences }} Siswa</span>
          </div>
          <span class="text-[11px] text-slate-500">Edukasi & sosialisasi PMB</span>
        </div>
      </div>

      <!-- Tabel Visitasi Lapangan -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 class="font-sora font-semibold text-sm text-slate-900">
              Daftar Laporan Kunjungan Sekolah oleh Tim Marketing
            </h3>
            <p class="text-xs text-slate-500">
              Dokumentasi resmi kunjungan lapangan dengan stempel waktu dan koordinat geotagging kamera
            </p>
          </div>
        </div>

        <!-- Mobile Marketing Visits Cards (< md) -->
        <div class="block md:hidden divide-y divide-slate-100">
          <div
            v-for="(v, idx) in marketingVisitsList"
            :key="v.id || idx"
            class="p-4 space-y-3 hover:bg-slate-50/80 transition-colors"
          >
            <!-- Top: School & Time -->
            <div class="flex items-start justify-between gap-2">
              <div>
                <h4 class="font-sora font-bold text-slate-900 text-sm leading-snug">{{ v.schoolName }}</h4>
                <div class="text-xs text-slate-500 mt-0.5">{{ v.schoolCity || 'Jawa Barat' }}</div>
              </div>

              <span class="px-2.5 py-0.5 rounded bg-slate-100 font-mono font-bold text-slate-800 text-xs border border-slate-200 whitespace-nowrap">
                {{ v.studentAudienceCount || 0 }} Siswa
              </span>
            </div>

            <!-- Officer & PIC -->
            <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5 text-xs">
              <div class="flex justify-between items-center text-slate-700">
                <span class="text-slate-500">Petugas:</span>
                <span class="font-semibold">{{ v.marketingName || 'Tim Marketing PMB' }} ({{ v.visitDate }})</span>
              </div>
              <div class="flex justify-between items-center text-slate-700">
                <span class="text-slate-500">PIC Sekolah:</span>
                <span>{{ v.picMetName || '-' }} - {{ v.picMetRole || '' }}</span>
              </div>
              <div v-if="v.presentationTopic" class="pt-1 border-t border-slate-200/60 text-slate-800">
                <span class="font-semibold text-slate-600 block text-[10px] uppercase font-sora">Topik:</span>
                {{ v.presentationTopic }}
              </div>
            </div>

            <!-- Actions: Foto & Maps -->
            <div class="pt-1 flex items-center justify-end gap-2">
              <a
                v-if="v.latitude"
                :href="`https://www.google.com/maps/search/?api=1&query=${v.latitude},${v.longitude}`"
                target="_blank"
                rel="noopener noreferrer"
                class="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition"
              >
                Buka Peta
              </a>
              <button
                type="button"
                @click="selectedPreviewVisit = v"
                class="px-3.5 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer flex items-center gap-1"
              >
                <span>Lihat Foto Geotag</span>
              </button>
            </div>
          </div>

          <div v-if="marketingVisitsList.length === 0" class="py-8 text-center text-slate-400 text-xs">
            Belum ada laporan kunjungan marketing yang tercatat.
          </div>
        </div>

        <!-- Desktop Table (>= md) -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left text-xs min-w-[720px]">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-sora font-semibold whitespace-nowrap">
              <tr>
                <th class="py-3 px-4 w-12 text-center">#</th>
                <th class="py-3 px-4">Waktu & Petugas</th>
                <th class="py-3 px-4">Sekolah Tujuan</th>
                <th class="py-3 px-4">PIC Sekolah Ditemui</th>
                <th class="py-3 px-4 text-center">Audiens</th>
                <th class="py-3 px-4">Topik & Catatan</th>
                <th class="py-3 px-4 text-center">Bukti Foto & GPS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-sans">
              <tr
                v-for="(v, idx) in marketingVisitsList"
                :key="v.id || idx"
                class="hover:bg-slate-50/70 transition-colors"
              >
                <td class="py-3 px-4 text-center text-slate-400 font-mono">{{ idx + 1 }}</td>
                <td class="py-3 px-4 whitespace-nowrap">
                  <div class="font-semibold text-slate-900">{{ v.marketingName || 'Tim Marketing PMB' }}</div>
                  <div class="text-[11px] text-slate-500 mt-0.5 font-mono">{{ v.visitDate }} • {{ v.timestamp || '-' }}</div>
                </td>
                <td class="py-3 px-4">
                  <div class="font-semibold text-slate-900">{{ v.schoolName }}</div>
                  <div class="text-[11px] text-slate-500 mt-0.5">{{ v.schoolCity || 'Jawa Barat' }}</div>
                </td>
                <td class="py-3 px-4 text-slate-700">
                  <div class="font-medium">{{ v.picMetName || '-' }}</div>
                  <div class="text-[11px] text-slate-500">{{ v.picMetRole || '-' }} ({{ v.picMetPhone || '-' }})</div>
                </td>
                <td class="py-3 px-4 text-center whitespace-nowrap">
                  <span class="px-2.5 py-1 rounded bg-slate-100 font-mono font-bold text-slate-800 text-xs border border-slate-200">
                    {{ v.studentAudienceCount || 0 }} Siswa
                  </span>
                </td>
                <td class="py-3 px-4 text-slate-600 max-w-xs">
                  <div class="font-medium text-slate-800 truncate" :title="v.presentationTopic">
                    {{ v.presentationTopic }}
                  </div>
                  <div class="text-[11px] text-slate-500 line-clamp-1 mt-0.5" :title="v.notes">
                    {{ v.notes || '-' }}
                  </div>
                </td>
                <td class="py-3 px-4 text-center whitespace-nowrap">
                  <div class="flex flex-col items-center gap-1">
                    <button
                      type="button"
                      @click="selectedPreviewVisit = v"
                      class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition cursor-pointer flex items-center gap-1 border border-slate-200"
                    >
                      <span>Lihat Foto Geotag</span>
                    </button>
                    <a
                      v-if="v.latitude"
                      :href="`https://www.google.com/maps/search/?api=1&query=${v.latitude},${v.longitude}`"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-[10px] text-[#1E3A8A] hover:underline font-mono"
                    >
                      Maps: {{ v.latitude.toFixed(4) }}, {{ v.longitude.toFixed(4) }} &rarr;
                    </a>
                  </div>
                </td>
              </tr>
              <tr v-if="marketingVisitsList.length === 0">
                <td colspan="7" class="py-8 text-center text-slate-400">
                  Belum ada laporan kunjungan marketing yang tercatat.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Preview Foto Geotagging Admin -->
      <Teleport to="body">
        <div
          v-if="selectedPreviewVisit"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in"
          @click.self="selectedPreviewVisit = null"
        >
          <div class="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 p-5 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 class="font-sora font-bold text-sm text-slate-900">
                  {{ selectedPreviewVisit.schoolName }}
                </h3>
                <p class="text-[11px] text-slate-500 font-sans">
                  {{ selectedPreviewVisit.schoolCity }} • Petugas: {{ selectedPreviewVisit.marketingName }}
                </p>
              </div>
              <button
                type="button"
                @click="selectedPreviewVisit = null"
                class="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <div class="rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
              <img
                :src="selectedPreviewVisit.photoUrl || '/assets/icons/bth-emblem.png'"
                alt="Bukti Kunjungan"
                class="w-full h-auto object-contain max-h-80 mx-auto"
              />
            </div>

            <div class="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div><strong>Tanggal:</strong> {{ selectedPreviewVisit.visitDate }} ({{ selectedPreviewVisit.timestamp || '-' }})</div>
              <div><strong>PIC Ditemui:</strong> {{ selectedPreviewVisit.picMetName }} ({{ selectedPreviewVisit.picMetRole || '-' }}) • {{ selectedPreviewVisit.picMetPhone || '-' }}</div>
              <div><strong>Audiens:</strong> {{ selectedPreviewVisit.studentAudienceCount }} Siswa</div>
              <div><strong>Topik:</strong> {{ selectedPreviewVisit.presentationTopic }}</div>
              <div v-if="selectedPreviewVisit.notes"><strong>Catatan:</strong> {{ selectedPreviewVisit.notes }}</div>
              <div v-if="selectedPreviewVisit.latitude" class="pt-1 flex items-center justify-between text-[11px]">
                <span class="font-mono text-slate-500">
                  Koordinat: {{ selectedPreviewVisit.latitude.toFixed(6) }}, {{ selectedPreviewVisit.longitude.toFixed(6) }}
                </span>
                <a
                  :href="`https://www.google.com/maps/search/?api=1&query=${selectedPreviewVisit.latitude},${selectedPreviewVisit.longitude}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[#1E3A8A] font-semibold hover:underline"
                >
                  Buka Google Maps &rarr;
                </a>
              </div>
            </div>

            <div class="text-right">
              <button
                type="button"
                @click="selectedPreviewVisit = null"
                class="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL 1: BUAT AKUN GURU BK & KODE REFERAL BARU                            -->
    <!-- ========================================================================= -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm"
        @click.self="showModal = false"
      >
        <div class="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
          <div class="h-1 w-full bg-[#1E3A8A] flex-shrink-0"></div>

          <div class="p-5 sm:p-6 pb-4 flex items-center justify-between border-b border-slate-100 flex-shrink-0">
            <div>
              <h3 class="font-sora font-bold text-slate-900 text-base">
                Buat Akun Guru BK & Kode Referal Baru
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">Program Sosialisasi PMB Universitas BTH</p>
            </div>
            <button @click="showModal = false" class="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
              <X class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="saveReferral" class="p-5 sm:p-6 space-y-4 text-xs font-sans flex-1 overflow-y-auto">
            <div>
              <label class="block font-semibold text-slate-800 mb-1">Kode Referal Unik *</label>
              <input
                v-model="form.code"
                required
                @input="handleCodeInput"
                placeholder="Contoh: SMKCONTOH01, SMAN1TSM, BK-FARMASI"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] uppercase font-mono"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-800 mb-1">Nama Guru BK / Mitra *</label>
                <input
                  v-model="form.picName"
                  required
                  placeholder="Nama Lengkap Penanggung Jawab"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A]"
                />
              </div>
              <div>
                <label class="block font-semibold text-slate-800 mb-1">No. WhatsApp / HP *</label>
                <input
                  v-model="form.picPhone"
                  required
                  placeholder="081234567890"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] font-mono"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-800 mb-1">Nama Asal Sekolah / Mitra *</label>
                <input
                  v-model="form.schoolName"
                  required
                  placeholder="Contoh: SMAN 1 Tasikmalaya"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A]"
                />
              </div>
              <div>
                <label class="block font-semibold text-slate-800 mb-1">Kota / Kabupaten *</label>
                <input
                  v-model="form.schoolCity"
                  required
                  placeholder="Kota Tasikmalaya"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A]"
                />
              </div>
            </div>

            <!-- Kredensial Login Akun Guru BK -->
            <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div class="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                <ShieldCheck class="w-4 h-4 text-[#1E3A8A]" />
                <span>Kredensial Login Portal Guru BK (/login)</span>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-medium text-slate-600 mb-1">Username Login</label>
                  <input
                    v-model="form.username"
                    required
                    placeholder="Contoh: nurjanah.bk"
                    class="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] font-mono text-xs"
                  />
                </div>
                <div>
                  <label class="block text-[11px] font-medium text-slate-600 mb-1">Kata Sandi Awal</label>
                  <input
                    v-model="form.password"
                    required
                    placeholder="Minimal 6 karakter"
                    class="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] font-mono text-xs"
                  />
                </div>
              </div>
              <div>
                <label class="block text-[11px] font-medium text-slate-600 mb-1">Email Sekolah / Kontak</label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="bk@sekolah.sch.id"
                  class="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] text-xs"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-800 mb-1">Skema Komisi Mitra *</label>
                <select
                  v-model="form.commissionType"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] bg-white"
                >
                  <option value="nominal">Nominal Tetap (Rp)</option>
                  <option value="percentage">Persentase (%)</option>
                </select>
              </div>
              <div>
                <label class="block font-semibold text-slate-800 mb-1">Besaran Nilai Komisi *</label>
                <input
                  v-model.number="form.commissionValue"
                  type="number"
                  min="0"
                  required
                  placeholder="Contoh: 50000 atau 10"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] font-mono"
                />
              </div>
            </div>

            <div class="pt-3 border-t border-slate-100 flex justify-end gap-2.5 flex-shrink-0">
              <button
                type="button"
                @click="showModal = false"
                class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                class="px-5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold rounded-lg shadow-xs cursor-pointer"
              >
                Simpan & Terbitkan Akun
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ========================================================================= -->
    <!-- MODAL 2: KELOLA AKUN LOGIN GURU BK (RESET SANDI & TOGGLE STATUS)         -->
    <!-- ========================================================================= -->
    <Teleport to="body">
      <div
        v-if="selectedPartner"
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm"
        @click.self="selectedPartner = null"
      >
        <div class="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
          <div class="h-1 w-full bg-[#1E3A8A] flex-shrink-0"></div>

          <div class="p-5 sm:p-6 pb-4 flex items-center justify-between border-b border-slate-100 flex-shrink-0">
            <div>
              <div class="text-[11px] font-bold text-blue-700 uppercase tracking-wider font-sora">
                Pengaturan Akun Mitra Guru BK
              </div>
              <h3 class="font-sora font-bold text-slate-900 text-base sm:text-lg mt-0.5">
                {{ selectedPartner.picName }}
              </h3>
              <p class="text-xs text-slate-500">{{ selectedPartner.schoolName }} • {{ selectedPartner.schoolCity }}</p>
            </div>
            <button @click="selectedPartner = null" class="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="p-5 sm:p-6 space-y-4 text-xs font-sans flex-1 overflow-y-auto">
            <!-- Ringkasan Status & Performa -->
            <div class="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/90 text-center">
              <div>
                <div class="text-[10px] text-slate-400 font-medium">Kode Referal</div>
                <div class="font-mono font-bold text-sm text-[#1E3A8A] mt-0.5">{{ selectedPartner.code }}</div>
              </div>
              <div>
                <div class="text-[10px] text-slate-400 font-medium">Siswa Terdaftar</div>
                <div class="font-mono font-bold text-sm text-slate-800 mt-0.5">{{ selectedPartner.registeredCount || 0 }} Siswa</div>
              </div>
              <div>
                <div class="text-[10px] text-slate-400 font-medium">Status Akun</div>
                <div class="mt-0.5">
                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold inline-block"
                    :class="selectedPartner.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'"
                  >
                    {{ selectedPartner.status === 'active' ? 'Aktif' : 'Dinonaktifkan' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Form Edit Kredensial -->
            <div class="space-y-3 pt-2">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Username Login</label>
                  <input
                    v-model="editForm.username"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] font-mono"
                  />
                </div>
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Email Sekolah</label>
                  <input
                    v-model="editForm.email"
                    type="email"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A]"
                  />
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="font-semibold text-slate-700">Kata Sandi Akun</label>
                  <button
                    type="button"
                    @click="resetToDefaultPassword"
                    class="text-[11px] font-medium text-blue-700 hover:underline cursor-pointer"
                  >
                    Reset ke "password123"
                  </button>
                </div>
                <input
                  v-model="editForm.password"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] font-mono"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">No. WhatsApp / HP</label>
                  <input
                    v-model="editForm.picPhone"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] font-mono"
                  />
                </div>
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Aksi Status</label>
                  <button
                    type="button"
                    @click="toggleActiveStatusModal"
                    class="w-full py-2 px-3 rounded-lg border font-semibold text-xs transition-colors cursor-pointer text-center"
                    :class="selectedPartner.status === 'active'
                      ? 'border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700'
                      : 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700'"
                  >
                    {{ selectedPartner.status === 'active' ? 'Nonaktifkan Akun' : 'Aktifkan Akun' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Daftar Siswa Terdaftar Pengguna Kode Ini -->
            <div class="pt-2 border-t border-slate-200 space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                  <Users class="w-4 h-4 text-[#1E3A8A]" />
                  <span>Daftar Siswa Pengguna Kode ({{ (selectedPartner.students || []).length }} Siswa)</span>
                </span>
                <span class="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {{ (selectedPartner.students || []).filter(s => s.status_approve === 'SUCCESS').length }} Terverifikasi
                </span>
              </div>

              <div class="rounded-lg border border-slate-200 bg-slate-50/50 overflow-x-auto">
                <table v-if="(selectedPartner.students || []).length > 0" class="w-full text-[11px] text-left">
                  <thead class="bg-slate-100 text-slate-600 font-semibold sticky top-0 border-b border-slate-200">
                    <tr>
                      <th class="py-2 px-3">Nama</th>
                      <th class="py-2 px-3">Email</th>
                      <th class="py-2 px-3 text-right">Nominal</th>
                      <th class="py-2 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200 font-sans">
                    <tr v-for="s in selectedPartner.students" :key="s.id" class="hover:bg-white">
                      <td class="py-2 px-3 font-medium text-slate-900">{{ s.name }}</td>
                      <td class="py-2 px-3 text-slate-500 font-mono text-[10px]">{{ s.email }}</td>
                      <td class="py-2 px-3 text-right text-slate-800 font-mono">Rp {{ Number(s.nominal || 300000).toLocaleString('id-ID') }}</td>
                      <td class="py-2 px-3 text-center">
                        <span
                          class="px-2 py-0.5 rounded text-[10px] font-bold"
                          :class="s.status_approve === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'"
                        >
                          {{ s.status_approve || 'Pending' }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-else class="p-4 text-center text-slate-400 text-xs">
                  Belum ada calon mahasiswa yang mendaftar menggunakan kode ini.
                </div>
              </div>
            </div>


            <!-- Tombol Aksi Cepat: Salin Kredensial & Buka Dashboard -->
            <div class="p-3 bg-blue-50/60 border border-blue-200 rounded-xl flex items-center justify-between gap-3 pt-3">
              <div class="text-[11px] text-slate-600">
                Kirim informasi login langsung ke Guru BK via pesan WhatsApp.
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  @click="copyPartnerCredentials"
                  class="px-3 py-1.5 bg-white border border-blue-300 hover:bg-blue-50 text-[#1E3A8A] font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Copy class="w-3.5 h-3.5" />
                  <span>Salin Info Login</span>
                </button>
                <button
                  type="button"
                  @click="openPartnerDashboard"
                  class="px-3 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ExternalLink class="w-3.5 h-3.5" />
                  <span>Buka Dashboard</span>
                </button>
              </div>
            </div>
          </div>

          <div class="p-4 sm:px-6 sm:py-3.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-end gap-2.5 flex-shrink-0">
            <button
              type="button"
              @click="selectedPartner = null"
              class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white cursor-pointer font-medium"
            >
              Tutup
            </button>
            <button
              type="button"
              @click="saveAccountChanges"
              class="px-5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold rounded-lg shadow-xs cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- MODAL 3: PENGATURAN KOMISI JALUR BK (PERSEN / NOMINAL)                    -->
      <!-- ========================================================================= -->
      <div
        v-if="selectedCommissionPartner"
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm"
        @click.self="selectedCommissionPartner = null"
      >
        <div class="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
          <div class="h-1 w-full bg-[#1E3A8A] flex-shrink-0"></div>

          <div class="p-5 sm:p-6 pb-4 flex items-center justify-between border-b border-slate-100 flex-shrink-0">
            <div>
              <div class="text-[10px] font-bold text-[#1E3A8A] uppercase tracking-wider font-sora">
                Pengaturan Komisi Jalur BK
              </div>
              <h3 class="font-sora font-bold text-slate-900 text-base sm:text-lg mt-0.5">
                {{ selectedCommissionPartner.schoolName || selectedCommissionPartner.picName }}
              </h3>
              <p class="text-xs text-slate-500">
                Kode Referal: <strong class="font-mono text-slate-800">{{ selectedCommissionPartner.code }}</strong> • PIC: {{ selectedCommissionPartner.picName }}
              </p>
            </div>
            <button @click="selectedCommissionPartner = null" class="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
              <X class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="saveCommissionSettings" class="p-5 sm:p-6 space-y-4 text-xs font-sans flex-1 overflow-y-auto">
            <div>
              <label class="block font-semibold text-slate-800 mb-1.5">Skema / Tipe Komisi *</label>
              <div class="grid grid-cols-2 gap-2.5">
                <label
                  class="p-3 border rounded-xl flex items-center gap-2 cursor-pointer transition"
                  :class="commissionForm.commissionType === 'nominal' ? 'border-[#1E3A8A] bg-blue-50/50 font-bold text-[#1E3A8A]' : 'border-slate-200 bg-white text-slate-700'"
                >
                  <input
                    type="radio"
                    value="nominal"
                    v-model="commissionForm.commissionType"
                    class="text-[#1E3A8A] focus:ring-[#1E3A8A]"
                  />
                  <span>Nominal Tetap (Rp)</span>
                </label>

                <label
                  class="p-3 border rounded-xl flex items-center gap-2 cursor-pointer transition"
                  :class="commissionForm.commissionType === 'percentage' ? 'border-[#1E3A8A] bg-blue-50/50 font-bold text-[#1E3A8A]' : 'border-slate-200 bg-white text-slate-700'"
                >
                  <input
                    type="radio"
                    value="percentage"
                    v-model="commissionForm.commissionType"
                    class="text-[#1E3A8A] focus:ring-[#1E3A8A]"
                  />
                  <span>Persentase (%)</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-800 mb-1">
                {{ commissionForm.commissionType === 'nominal' ? 'Nominal Komisi per Pendaftar (Rp) *' : 'Persentase Komisi dari Biaya (%) *' }}
              </label>
              <div class="relative">
                <span v-if="commissionForm.commissionType === 'nominal'" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono font-bold">Rp</span>
                <input
                  v-model.number="commissionForm.commissionValue"
                  type="number"
                  min="0"
                  :max="commissionForm.commissionType === 'percentage' ? 100 : 300000"
                  required
                  :placeholder="commissionForm.commissionType === 'nominal' ? 'Contoh: 50000' : 'Contoh: 10'"
                  class="w-full py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] font-mono text-sm font-bold text-slate-900 bg-white"
                  :class="commissionForm.commissionType === 'nominal' ? 'pl-10 pr-3.5' : 'pl-3.5 pr-8'"
                />
                <span v-if="commissionForm.commissionType === 'percentage'" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono font-bold">%</span>
              </div>
            </div>

            <!-- Live Calculation Simulation -->
            <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div class="text-[11px] font-bold text-slate-700 font-sora">
                Simulasi Perhitungan Komisi (Biaya Formulir Standar: Rp 300.000)
              </div>
              <div class="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div class="text-[10px] text-slate-500 font-medium">Hak Insentif Guru BK</div>
                  <div class="text-[10px] text-slate-400 mt-0.5">diberikan per siswa terdaftar yang lunas</div>
                </div>
                <div class="font-mono font-bold text-sm text-emerald-700">
                  Rp {{ simulatedCommissionAmount.toLocaleString('id-ID') }}
                </div>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-100 flex justify-end gap-2.5 flex-shrink-0">
              <button
                type="button"
                @click="selectedCommissionPartner = null"
                class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                class="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Simpan Pengaturan Komisi</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Plus, X, Download, Copy, ExternalLink, Users, Coins } from 'lucide-vue-next';
import { useToast } from '@/composables/useToast';
import { useAuthStore } from '@/stores/auth';
import { useReferralStore } from '@/stores/referral';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();
const referralStore = useReferralStore();

const statusFilter = ref('ALL');
const searchQuery = ref('');
const showModal = ref(false);
const selectedPartner = ref(null);

const activeSubTab = ref('referrals');
const selectedPreviewVisit = ref(null);
const marketingVisitsList = computed(() => referralStore.marketingVisits || []);
const uniqueMarketingSchools = computed(() => {
  const set = new Set(marketingVisitsList.value.map((v) => v.schoolName));
  return set.size;
});
const totalMarketingAudiences = computed(() => {
  return marketingVisitsList.value.reduce((sum, v) => sum + (Number(v.studentAudienceCount) || 0), 0);
});

const selectedCommissionPartner = ref(null);
const commissionForm = reactive({
  commissionType: 'nominal',
  commissionValue: 50000,
});

const referralList = computed(() => referralStore.referralList);

const form = ref({
  code: '',
  picName: '',
  picPhone: '',
  schoolName: '',
  schoolCity: '',
  username: '',
  email: '',
  password: 'password123',
  commissionType: 'nominal',
  commissionValue: 50000,
});

const editForm = reactive({
  username: '',
  email: '',
  password: '',
  picPhone: '',
});

const totalReferredStudents = computed(() => {
  return referralList.value.reduce((acc, r) => {
    const count = Array.isArray(r.students) && r.students.length > 0 ? r.students.length : (r.registeredCount || 0);
    return acc + count;
  }, 0);
});

const totalVerifiedPayments = computed(() => {
  return referralList.value.reduce((acc, r) => {
    const verified = Array.isArray(r.students) && r.students.length > 0
      ? r.students.filter((s) => s.status_approve === 'SUCCESS').length
      : (r.verifiedCount || 0);
    return acc + verified;
  }, 0);
});

const totalSettledAmount = computed(() => {
  return referralList.value.reduce((acc, r) => {
    const settled = Array.isArray(r.students) && r.students.length > 0
      ? r.students.filter((s) => s.status_approve === 'SUCCESS').reduce((sum, s) => sum + (Number(s.nominal) || 300000), 0)
      : (r.settledAmount || 0);
    return acc + settled;
  }, 0);
});

const activeCodesCount = computed(() => {
  return referralList.value.filter((r) => r.status === 'active').length;
});

const filteredReferrals = computed(() => {
  return referralList.value.filter((r) => {
    if (statusFilter.value === 'ACTIVE' && r.status !== 'active') return false;
    if (statusFilter.value === 'INACTIVE' && r.status === 'active') return false;
    if (statusFilter.value === 'PENDING_SETTLEMENT' && !hasPendingSettlement(r)) return false;

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      const matchCode = r.code.toLowerCase().includes(q);
      const matchPic = (r.picName || '').toLowerCase().includes(q);
      const matchSchool = (r.schoolName || r.institution || '').toLowerCase().includes(q);
      const matchUser = (r.username || '').toLowerCase().includes(q);
      if (!matchCode && !matchPic && !matchSchool && !matchUser) return false;
    }

    return true;
  });
});

const copyCode = async (code) => {
  try {
    await navigator.clipboard.writeText(code);
    toast.success(`Kode referal ${code} berhasil disalin ke clipboard.`);
  } catch {
    toast.info(`Kode referal: ${code}`);
  }
};

const handleCodeInput = () => {
  if (form.value.code) {
    const slug = form.value.code.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!form.value.username) {
      form.value.username = `bk_${slug}`;
    }
    if (!form.value.email) {
      form.value.email = `${slug}@sekolah.sch.id`;
    }
  }
};

const openAddModal = () => {
  form.value = {
    code: '',
    picName: '',
    picPhone: '',
    schoolName: '',
    schoolCity: '',
    username: '',
    email: '',
    password: 'password123',
    commissionType: 'nominal',
    commissionValue: 50000,
  };
  showModal.value = true;
};

const saveReferral = () => {
  const code = form.value.code.toUpperCase();
  referralStore.addReferral({
    code,
    picName: form.value.picName,
    picPhone: form.value.picPhone,
    schoolName: form.value.schoolName,
    schoolCity: form.value.schoolCity,
    username: form.value.username || `bk_${code.toLowerCase()}`,
    email: form.value.email || `${code.toLowerCase()}@sekolah.sch.id`,
    password: form.value.password || 'password123',
    commissionType: form.value.commissionType,
    commissionValue: form.value.commissionValue,
  });
  toast.success(`Akun Guru BK dan kode referal ${code} berhasil dibuat.`);
  showModal.value = false;
};

const openAccountModal = (partner) => {
  selectedPartner.value = partner;
  editForm.username = partner.username || `bk_${partner.code.toLowerCase()}`;
  editForm.email = partner.email || `${partner.code.toLowerCase()}@sekolah.sch.id`;
  editForm.password = partner.password || 'password123';
  editForm.picPhone = partner.picPhone || '';
};

const resetToDefaultPassword = () => {
  editForm.password = 'password123';
  toast.info('Kata sandi diset ke default "password123". Klik Simpan untuk menerapkan.');
};

const toggleStatus = (partner) => {
  const res = referralStore.togglePartnerStatus(partner.id);
  if (res.success) {
    toast.success(res.message);
  }
};

const toggleActiveStatusModal = () => {
  if (!selectedPartner.value) return;
  const res = referralStore.togglePartnerStatus(selectedPartner.value.id);
  if (res.success) {
    selectedPartner.value.status = res.status;
    toast.success(res.message);
  }
};

const saveAccountChanges = () => {
  if (!selectedPartner.value) return;
  referralStore.updateReferral(selectedPartner.value.id, {
    username: editForm.username,
    email: editForm.email,
    password: editForm.password,
    picPhone: editForm.picPhone,
  });
  toast.success('Pembaruan data akun Guru BK berhasil disimpan.');
  selectedPartner.value = null;
};

const copyPartnerCredentials = async () => {
  if (!selectedPartner.value) return;
  const p = selectedPartner.value;
  const text = `*AKSES PORTAL GURU BK - UNIVERSITAS BAKTI TUNAS HUSADA*
Nama Mitra: ${p.picName}
Sekolah: ${p.schoolName}
Kode Referal Siswa: ${p.code}
Username Login: ${editForm.username}
Kata Sandi: ${editForm.password}
Tautan Login: ${window.location.origin}/login

Gunakan akun di atas untuk login dan memantau siswa serta insentif kemitraan PMB BTH.`;

  try {
    await navigator.clipboard.writeText(text);
    toast.success('Kredensial login berhasil disalin. Siap dikirimkan ke Guru BK.');
  } catch {
    toast.info('Gagal menyalin teks otomatis.');
  }
};

const openPartnerDashboard = () => {
  if (!selectedPartner.value) return;
  referralStore.setSessionPartner(selectedPartner.value);
  authStore.setBkUser(selectedPartner.value);
  toast.success(`Membuka Dashboard Guru BK sebagai ${selectedPartner.value.picName}...`);
  router.push('/bk');
};

const exportReferralReport = () => {
  const headers = [
    'No',
    'Kode Referal',
    'Guru BK / PIC',
    'No. WhatsApp',
    'Institusi / Sekolah',
    'Kota',
    'Skema Komisi',
    'Nilai Komisi',
    'Total Siswa Pendaftar',
    'Siswa Lunas',
    'Hak Komisi Mitra (Rp)',
    'Status Akun',
  ];
  const rows = referralList.value.map((r, i) => {
    const studentCount = (r.students && r.students.length > 0) ? r.students.length : (r.registeredCount || 0);
    const verifiedCount = (r.students && r.students.length > 0) ? r.students.filter(s => s.status_approve === 'SUCCESS').length : (r.verifiedCount || 0);
    const earnedComm = getPartnerEarnedCommission(r);
    const commType = r.commissionType === 'percentage' || r.commissionType === 'persen' ? 'Persentase' : 'Nominal Tetap';
    const commVal = r.commissionType === 'percentage' || r.commissionType === 'persen' ? `${r.commissionValue}%` : `Rp ${Number(r.commissionValue || 50000).toLocaleString('id-ID')}`;
    return [
      i + 1,
      r.code,
      `"${r.picName || '-'}"`,
      `"${r.picPhone || '-'}"`,
      `"${r.schoolName || r.institution || '-'}"`,
      `"${r.schoolCity || '-'}"`,
      commType,
      `"${commVal}"`,
      studentCount,
      verifiedCount,
      earnedComm,
      r.status === 'active' ? 'Aktif' : 'Nonaktif',
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `laporan_referral_pmb_bth_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  toast.success('Laporan rekapitulasi kode referal & komisi Guru BK berhasil diunduh (CSV).');
};

// =========================================================================
// PERHITUNGAN HAK KOMISI & PENGATURAN KOMISI
// =========================================================================
const FORM_FEE = 300000;

const simulatedCommissionAmount = computed(() => {
  if (commissionForm.commissionType === 'percentage') {
    return Math.round(((Number(commissionForm.commissionValue) || 0) / 100) * FORM_FEE);
  }
  return Number(commissionForm.commissionValue) || 0;
});

const getPartnerEarnedCommission = (r) => {
  const verifiedCount =
    Array.isArray(r.students) && r.students.length > 0
      ? r.students.filter((s) => s.status_approve === 'SUCCESS').length
      : (r.verifiedCount || 0);
  const val = Number(r.commissionValue) || 50000;
  if (r.commissionType === 'percentage' || r.commissionType === 'persen') {
    return Math.round(verifiedCount * ((val / 100) * FORM_FEE));
  }
  return verifiedCount * val;
};

const totalEarnedCommissions = computed(() => {
  return referralList.value.reduce((acc, r) => acc + getPartnerEarnedCommission(r), 0);
});

const openCommissionModal = (partner) => {
  selectedCommissionPartner.value = partner;
  commissionForm.commissionType = partner.commissionType || 'nominal';
  commissionForm.commissionValue = partner.commissionValue !== undefined ? partner.commissionValue : 50000;
};

const saveCommissionSettings = () => {
  if (!selectedCommissionPartner.value) return;
  const ok = referralStore.updateCommission(selectedCommissionPartner.value.code, {
    commissionType: commissionForm.commissionType,
    commissionValue: commissionForm.commissionValue,
  });
  if (ok) {
    toast.success(`Pengaturan komisi untuk ${selectedCommissionPartner.value.schoolName || selectedCommissionPartner.value.code} berhasil diperbarui.`);
  } else {
    toast.error('Gagal memperbarui pengaturan komisi.');
  }
  selectedCommissionPartner.value = null;
};
</script>
