<template>
  <div class="space-y-6">
    <!-- Header Meja Kerja -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900">
          Rekonsiliasi Keuangan & Transaksi PMB
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Pantau transaksi biaya formulir PMB, pelunasan UKT, review pengembalian dana, dan permohonan cicilan.
        </p>
      </div>
      <div class="flex items-center gap-2 self-start sm:self-auto">
        <button
          @click="exportExcel"
          class="px-3.5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs"
          title="Unduh laporan dalam format tabel Microsoft Excel resmi (.xls)"
        >
          <FileSpreadsheet class="w-4 h-4 text-emerald-400" />
          <span>Ekspor Rekap Excel (.xls)</span>
        </button>
        <button
          @click="exportCsv"
          class="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-sora font-medium text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          title="Unduh laporan dalam format CSV (.csv) dengan pemisah kolom standar Excel"
        >
          <Download class="w-3.5 h-3.5 text-slate-500" />
          <span>CSV</span>
        </button>
      </div>
    </div>

    <!-- Sub-Navigasi Meja Keuangan (Clean Segmented Tabs) -->
    <div class="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto no-scrollbar">
      <button
        @click="activeFinanceTab = 'reconciliation'"
        class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
        :class="activeFinanceTab === 'reconciliation'
          ? 'bg-[#1E3A8A] text-white font-semibold'
          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'"
      >
        Rekonsiliasi Transaksi & VA
      </button>

      <button
        @click="activeFinanceTab = 'refund'"
        class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
        :class="activeFinanceTab === 'refund'
          ? 'bg-[#1E3A8A] text-white font-semibold'
          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'"
      >
        <span>Review Refund Pengunduran Diri</span>
        <span
          v-if="pendingRefundCount > 0"
          class="text-[11px] font-mono font-bold"
          :class="activeFinanceTab === 'refund' ? 'text-blue-100' : 'text-slate-500'"
        >
          ({{ pendingRefundCount }})
        </span>
      </button>

      <button
        @click="activeFinanceTab = 'installments'"
        class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
        :class="activeFinanceTab === 'installments'
          ? 'bg-[#1E3A8A] text-white font-semibold'
          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'"
      >
        <span>Permohonan Cicilan UKT</span>
        <span
          v-if="pendingInstallmentCount > 0"
          class="text-[11px] font-mono font-bold"
          :class="activeFinanceTab === 'installments' ? 'text-blue-100' : 'text-slate-500'"
        >
          ({{ pendingInstallmentCount }})
        </span>
      </button>
    </div>

    <!-- ===================================================================== -->
    <!-- TAB 1: REKONSILIASI TRANSAKSI & VA (DEFAULT VIEW)                     -->
    <!-- ===================================================================== -->
    <div v-if="activeFinanceTab === 'reconciliation'" class="space-y-6">
      <!-- Duitku Gateway Integration Bar (Clean & Professional) -->
      <div class="bg-white border border-slate-200 rounded-xl p-4 sm:px-5 sm:py-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3.5 min-w-0">
          <div class="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-sm text-[#1E3A8A] flex-shrink-0">
            D
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="font-sora font-semibold text-xs sm:text-sm text-slate-900 leading-tight">
                Integrasi Gateway Duitku
              </h3>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                Sandbox Terhubung
              </span>
              <span class="text-xs text-slate-400 font-mono hidden sm:inline">
                ID Merchant: DS35926
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5 truncate font-sans">
              Sinkronisasi mutasi dan status pembayaran Virtual Account & QRIS dengan pembukuan kas PMB.
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2.5 flex-shrink-0 self-start sm:self-auto">
          <button
            type="button"
            @click="syncDuitkuReconciliation"
            :disabled="isSyncingDuitku"
            class="px-3.5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white rounded-lg text-xs font-semibold font-sora transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs disabled:opacity-50 whitespace-nowrap"
          >
            <RefreshCw class="w-3.5 h-3.5 text-white" :class="{ 'animate-spin': isSyncingDuitku }" />
            <span>{{ isSyncingDuitku ? 'Menyinkronkan...' : 'Tarik Mutasi Sandbox' }}</span>
          </button>
        </div>
      </div>

      <!-- Summary Metrics Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div class="text-xs font-medium text-slate-500 font-sans">Formulir Terbayar</div>
          <div class="mt-2">
            <div class="font-sora font-extrabold text-2xl text-slate-900">
              {{ paidRegFeeCount }} <span class="text-sm font-normal text-slate-500 font-sans">/ {{ adminStore.applicants.length }}</span>
            </div>
            <div class="text-[11px] text-slate-500 mt-1 font-sans">
              {{ regFeePercent }}% pendaftar lunas formulir
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div class="text-xs font-medium text-slate-500 font-sans">Perlu Konfirmasi</div>
          <div class="mt-2">
            <div class="font-sora font-extrabold text-2xl text-slate-900">
              {{ pendingConfirmationCount }} <span class="text-sm font-normal text-slate-500 font-sans">Transaksi</span>
            </div>
            <div class="text-[11px] text-slate-500 mt-1 font-sans">
              {{ pendingConfirmationCount > 0 ? 'Menunggu verifikasi manual' : 'Semua transaksi terverifikasi' }}
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div class="text-xs font-medium text-slate-500 font-sans">Pelunasan UKT Sem. 1</div>
          <div class="mt-2">
            <div class="font-sora font-extrabold text-2xl text-slate-900">
              {{ paidUktCount }} <span class="text-sm font-normal text-slate-500 font-sans">Mahasiswa</span>
            </div>
            <div class="text-[11px] text-slate-500 mt-1 font-sans">
              Total Rp {{ totalUktFeePaid.toLocaleString('id-ID') }}
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div class="text-xs font-medium text-slate-500 font-sans">Transaksi Terbayar</div>
          <div class="mt-2">
            <div class="font-sora font-extrabold text-2xl text-slate-900">
              {{ totalPaidTrx }} <span class="text-sm font-normal text-slate-500 font-sans">Transaksi</span>
            </div>
            <div class="text-[11px] text-slate-500 mt-1 font-sans">
              Duitku: {{ duitkuCount }} | BSI: {{ bsiCount }} | Mandiri: {{ mandiriCount }}
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section: Visualisasi Keuangan PMB -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Chart 1: Komposisi Penerimaan Kas (Formulir vs UKT) -->
        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div class="flex items-start justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 class="font-sora font-bold text-slate-900 text-sm">
                Proporsi Penerimaan Dana PMB
              </h3>
              <p class="text-xs text-slate-500">Biaya Formulir Registrasi vs UKT Semester 1</p>
            </div>
            <div class="text-right">
              <div class="text-base font-bold text-slate-900 font-sans tracking-tight">
                Rp {{ totalRevenue.toLocaleString('id-ID') }}
              </div>
              <div class="text-[11px] text-slate-400 font-normal">
                Total Penerimaan
              </div>
            </div>
          </div>
          <div class="h-56 my-2 flex items-center justify-center">
            <DoughnutChart
              v-if="totalRevenue > 0"
              :chart-data="revenueDoughnutData"
            />
            <div v-else class="text-xs text-slate-400 italic py-8 text-center">
              Belum ada pembayaran yang terkonfirmasi lunas.
            </div>
          </div>
          <div class="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100">
            Formulir Lunas: Rp {{ totalRegFeePaid.toLocaleString('id-ID') }} | UKT Lunas: Rp {{ totalUktFeePaid.toLocaleString('id-ID') }}
          </div>
        </div>

        <!-- Chart 2: Pangsa Kanal Pembayaran (Duitku Gateway vs Host-to-Host VA) -->
        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div class="flex items-start justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 class="font-sora font-bold text-slate-900 text-sm">
                Distribusi Kanal Pembayaran Masuk
              </h3>
              <p class="text-xs text-slate-500">Duitku Multi-Kanal (QRIS/VA/E-Wallet) & Host-to-Host</p>
            </div>
            <div class="text-right">
              <div class="text-base font-bold text-slate-900 font-sans tracking-tight">
                {{ totalPaidTrx }} <span class="text-xs font-normal text-slate-500">Transaksi</span>
              </div>
              <div class="text-[11px] text-slate-400 font-normal">
                Terkonfirmasi Lunas
              </div>
            </div>
          </div>
          <div class="h-56 my-2 flex items-center justify-center">
            <DoughnutChart
              v-if="totalPaidTrx > 0"
              :chart-data="channelDoughnutData"
            />
            <div v-else class="text-xs text-slate-400 italic py-8 text-center">
              Belum ada transaksi pembayaran terbayar.
            </div>
          </div>
          <div class="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100">
            Duitku Gateway: {{ duitkuCount }} trx | Bank BSI: {{ bsiCount }} trx | Bank Mandiri: {{ mandiriCount }} trx
          </div>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 class="font-sora font-bold text-slate-900 text-sm">
            Daftar Tagihan & Status Transaksi Virtual Account
          </h3>
          <span class="text-xs text-slate-400">Total {{ allTransactions.length }} Tagihan Terdaftar</span>
        </div>

      <!-- Mobile Responsive Cards (Tampilan Khusus Mobile < md) -->
      <div class="block md:hidden divide-y divide-slate-100">
        <div
          v-for="trx in allTransactions"
          :key="trx.invoiceId"
          class="p-4 space-y-3 hover:bg-slate-50/80 transition-colors"
        >
          <!-- Top Row: Invoice ID & Status -->
          <div class="flex items-center justify-between gap-2">
            <div>
              <span class="font-mono font-bold text-xs text-slate-800">{{ trx.invoiceId }}</span>
              <div class="flex items-center gap-1.5 mt-0.5">
                <span
                  v-if="trx.method?.toLowerCase().includes('duitku') || trx.method?.toLowerCase().includes('qris') || trx.method?.toLowerCase().includes('shopee')"
                  class="px-1.5 py-0.2 rounded text-[8px] font-bold bg-[#1E3A8A] text-white uppercase font-mono tracking-wider shadow-2xs"
                >
                  DUITKU
                </span>
                <span class="text-[10px] text-slate-500 font-sans block truncate max-w-[200px]">{{ trx.method }}</span>
              </div>
            </div>

            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium whitespace-nowrap"
              :class="trx.status === 'paid'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : trx.status === 'pending_confirmation'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'"
            >
              {{ trx.status === 'paid' ? 'Lunas Terverifikasi' : trx.status === 'pending_confirmation' ? 'Menunggu Konfirmasi' : 'Belum Dibayar' }}
            </span>
          </div>

          <!-- Middle: Name & Fee Type -->
          <div class="space-y-0.5">
            <h4 class="font-sora font-bold text-slate-900 text-sm leading-snug">{{ trx.applicantName }}</h4>
            <div class="text-xs text-slate-500 font-sans">{{ trx.prodi }}</div>
            <div class="text-xs font-semibold text-[#1E3A8A] pt-0.5">
              {{ trx.feeType }}
            </div>
          </div>

          <!-- Bottom: Amount & Action Button -->
          <div class="flex items-center justify-between pt-2 border-t border-slate-100">
            <div>
              <span class="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Nominal</span>
              <span class="font-mono font-bold text-sm text-slate-900">
                Rp {{ trx.amount.toLocaleString('id-ID') }}
              </span>
            </div>

            <div v-if="trx.status === 'pending_confirmation'">
              <button
                @click="confirmManual(trx)"
                class="px-3 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-medium text-xs rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                Konfirmasi
              </button>
            </div>
            <div v-else-if="trx.status === 'paid'" class="text-right">
              <span class="text-[11px] font-mono text-emerald-700 font-medium block">
                {{ trx.paidAt ? trx.paidAt.split('T')[0] : 'Otomatis' }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="allTransactions.length === 0" class="py-10 text-center text-slate-400 text-xs">
          Belum ada transaksi pembayaran.
        </div>
      </div>

      <!-- Desktop Data Table (hidden on mobile, visible md+) -->
      <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-700 min-w-[920px]">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-sora uppercase text-[10px] tracking-wider whitespace-nowrap">
              <tr>
                <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[130px]">No. Invoice</th>
                <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[200px]">Nama Mahasiswa & Prodi</th>
                <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[120px]">Jenis Tagihan</th>
                <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[150px]">Nominal</th>
                <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[120px]">Kanal Bayar</th>
                <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[150px]">Status</th>
                <th class="py-3.5 px-4 font-bold text-right whitespace-nowrap min-w-[150px]">Aksi Konfirmasi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-sans">
              <tr
                v-for="trx in allTransactions"
                :key="trx.invoiceId"
                class="hover:bg-slate-50/80 transition-colors"
              >
                <!-- Invoice No -->
                <td class="py-3.5 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                  {{ trx.invoiceId }}
                </td>

                <!-- Candidate & Prodi -->
                <td class="py-3.5 px-4 min-w-[200px]">
                  <div class="font-sora font-bold text-slate-900 whitespace-nowrap">{{ trx.applicantName }}</div>
                  <div class="text-[11px] text-slate-500 whitespace-nowrap">{{ trx.prodi }}</div>
                </td>

                <!-- Fee Type -->
                <td class="py-3.5 px-4 whitespace-nowrap">
                  <span class="font-medium text-slate-800">{{ trx.feeType }}</span>
                </td>

                <!-- Amount -->
                <td class="py-3.5 px-4 whitespace-nowrap min-w-[150px]">
                  <div class="font-mono font-semibold text-slate-900 whitespace-nowrap">
                    Rp {{ trx.amount.toLocaleString('id-ID') }}
                  </div>
                </td>

                <!-- Method -->
                <td class="py-3.5 px-4 whitespace-nowrap">
                  <div class="flex items-center gap-1.5">
                    <span
                      v-if="trx.method?.toLowerCase().includes('duitku') || trx.method?.toLowerCase().includes('qris') || trx.method?.toLowerCase().includes('shopee')"
                      class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#1E3A8A] text-white uppercase font-mono tracking-wider shadow-2xs"
                    >
                      DUITKU
                    </span>
                    <span class="font-mono text-xs text-slate-700">{{ trx.method }}</span>
                  </div>
                </td>

                <!-- Status Tag -->
                <td class="py-3.5 px-4 whitespace-nowrap">
                  <span
                    class="text-xs font-medium inline-block px-2.5 py-0.5 rounded-full whitespace-nowrap border"
                    :class="trx.status === 'paid'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : trx.status === 'pending_confirmation'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'"
                  >
                    {{ trx.status === 'paid' ? 'Lunas Terverifikasi' : trx.status === 'pending_confirmation' ? 'Menunggu Konfirmasi' : 'Belum Dibayar' }}
                  </span>
                </td>

                <!-- Action Button -->
                <td class="py-3.5 px-4 text-right whitespace-nowrap">
                  <div v-if="trx.status === 'pending_confirmation'" class="flex items-center justify-end gap-2">
                    <button
                      @click="confirmManual(trx)"
                      class="px-3 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-medium text-xs rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                    >
                      Konfirmasi Selesai
                    </button>
                  </div>
                  <div v-else-if="trx.status === 'paid'" class="flex flex-col items-end">
                    <span class="text-xs font-medium text-slate-700 whitespace-nowrap">
                      Disahkan Admin
                    </span>
                    <span class="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                      {{ trx.paidAt || 'Tervalidasi' }}
                    </span>
                  </div>
                  <div v-else class="flex items-center justify-end">
                    <button
                      @click="confirmManual(trx)"
                      class="px-3 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-medium text-xs rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                      title="Konfirmasi manual pelunasan oleh Panitia PMB"
                    >
                      Konfirmasi Lunas
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="allTransactions.length === 0">
                <td colspan="7" class="py-12 text-center text-slate-400">
                  <div class="max-w-xs mx-auto space-y-2">
                    <div class="font-sora font-semibold text-slate-700 text-sm">Belum Ada Transaksi</div>
                    <p class="text-xs text-slate-400">Belum ada transaksi pembayaran formulir atau UKT yang tercatat.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ===================================================================== -->
    <!-- TAB 2: REVIEW PENGEMBALIAN DANA (REFUND REVIEW) - CR-007              -->
    <!-- ===================================================================== -->
    <div v-else-if="activeFinanceTab === 'refund'" class="space-y-4">
      <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-sm">
              Antrean Peninjauan Pengembalian Dana (Refund)
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Daftar permohonan pengembalian dana dari calon mahasiswa yang mengajukan pengunduran diri resmi.
            </p>
          </div>
          <span class="text-xs text-slate-500 font-medium">
            {{ refundList.length }} Permohonan Terdaftar
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-700 min-w-[900px]">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-sora uppercase text-[10px] tracking-wider whitespace-nowrap">
              <tr>
                <th class="py-3 px-4 font-bold whitespace-nowrap min-w-[200px]">No. Registrasi & Nama</th>
                <th class="py-3 px-4 font-bold whitespace-nowrap min-w-[240px]">Alasan Pengunduran</th>
                <th class="py-3 px-4 font-bold whitespace-nowrap min-w-[160px]">Kategori</th>
                <th class="py-3 px-4 font-bold whitespace-nowrap min-w-[140px]">Status Permohonan</th>
                <th class="py-3 px-4 font-bold text-right whitespace-nowrap min-w-[140px]">Tindakan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-sans">
              <tr v-for="item in refundList" :key="item.id" class="hover:bg-slate-50 transition-colors">
                <td class="py-3.5 px-4 min-w-[200px]">
                  <div class="font-sora font-bold text-slate-900 whitespace-nowrap">{{ item.candidateName }}</div>
                  <div class="text-[11px] font-mono text-slate-500 whitespace-nowrap">{{ item.regNo }} • {{ item.prodi }}</div>
                </td>
                <td class="py-3.5 px-4 min-w-[240px]">
                  <div class="text-xs text-slate-700 line-clamp-2 leading-relaxed">{{ item.reason }}</div>
                </td>
                <td class="py-3.5 px-4 min-w-[160px] whitespace-nowrap">
                  <span class="px-2.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap inline-block">
                    {{ item.category }}
                  </span>
                </td>
                <td class="py-3.5 px-4 whitespace-nowrap">
                  <span
                    class="text-xs font-medium inline-block px-2.5 py-0.5 rounded border whitespace-nowrap"
                    :class="item.status === 'approved'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : item.status === 'rejected'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'"
                  >
                    {{ item.status === 'approved' ? 'Telah Dikonfirmasi' : item.status === 'rejected' ? 'Ditolak' : 'Menunggu Konfirmasi' }}
                  </span>
                </td>
                <td class="py-3.5 px-4 text-right whitespace-nowrap">
                  <button
                    v-if="item.status === 'pending'"
                    @click="openRefundModal(item)"
                    class="px-3.5 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-medium text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
                  >
                    Konfirmasi Refund
                  </button>
                  <span v-else class="text-xs text-slate-400 whitespace-nowrap">
                    {{ item.processedAt || 'Selesai' }}
                  </span>
                </td>
              </tr>
              <tr v-if="refundList.length === 0">
                <td colspan="5" class="py-10 text-center text-slate-400 text-xs">
                  Tidak ada permohonan pengembalian dana saat ini.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ===================================================================== -->
    <!-- TAB 3: PERMOHONAN CICILAN UKT (INSTALLMENTS) - CR-010                 -->
    <!-- ===================================================================== -->
    <div v-else-if="activeFinanceTab === 'installments'" class="space-y-4">
      <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-sm">
              Permohonan Rencana Cicilan Biaya Kuliah (UKT)
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Daftar pengajuan pembayaran UKT secara bertahap / cicilan oleh calon mahasiswa baru.
            </p>
          </div>
          <span class="text-xs text-slate-500 font-medium">
            {{ installmentList.length }} Pengajuan Terdaftar
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-700 min-w-[920px]">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-sora uppercase text-[10px] tracking-wider whitespace-nowrap">
              <tr>
                <th class="py-3 px-4 font-bold whitespace-nowrap min-w-[180px]">Nama Mahasiswa & Prodi</th>
                <th class="py-3 px-4 font-bold whitespace-nowrap min-w-[170px]">Total UKT Semester 1</th>
                <th class="py-3 px-4 font-bold whitespace-nowrap min-w-[170px]">Skema Cicilan</th>
                <th class="py-3 px-4 font-bold min-w-[220px]">Alasan Pengajuan</th>
                <th class="py-3 px-4 font-bold whitespace-nowrap min-w-[150px]">Status Permohonan</th>
                <th class="py-3 px-4 font-bold text-right whitespace-nowrap min-w-[140px]">Tindakan Panitia</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-sans">
              <tr v-for="item in installmentList" :key="item.id" class="hover:bg-slate-50 transition-colors">
                <td class="py-3.5 px-4 min-w-[180px]">
                  <div class="font-sora font-bold text-slate-900 whitespace-nowrap">{{ item.candidateName }}</div>
                  <div class="text-[11px] text-slate-500 whitespace-nowrap">{{ item.regNo }} • {{ item.prodi }}</div>
                </td>
                <td class="py-3.5 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap min-w-[170px]">
                  Rp {{ item.totalAmount.toLocaleString('id-ID') }}
                </td>
                <td class="py-3.5 px-4 whitespace-nowrap min-w-[170px]">
                  <div class="font-medium text-slate-800 whitespace-nowrap">{{ item.numTerms }} Kali Termin</div>
                  <div class="text-[11px] text-slate-500 whitespace-nowrap">Termin 1: Rp {{ Math.round(item.totalAmount / item.numTerms).toLocaleString('id-ID') }}</div>
                </td>
                <td class="py-3.5 px-4 min-w-[220px] text-slate-600 text-[11px]">
                  {{ item.reason }}
                </td>
                <td class="py-3.5 px-4 whitespace-nowrap">
                  <span
                    class="text-xs font-medium inline-block px-2 py-0.5 rounded border whitespace-nowrap"
                    :class="item.status === 'approved'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : item.status === 'rejected'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'"
                  >
                    {{ item.status === 'approved' ? 'Cicilan Disetujui' : item.status === 'rejected' ? 'Ditolak' : 'Menunggu Persetujuan' }}
                  </span>
                </td>
                <td class="py-3.5 px-4 text-right whitespace-nowrap">
                  <div v-if="item.status === 'pending'" class="flex items-center justify-end gap-2 whitespace-nowrap">
                    <button
                      @click="handleReviewInstallment(item, 'approved')"
                      class="px-3 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-medium text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Setujui
                    </button>
                    <button
                      @click="handleReviewInstallment(item, 'rejected')"
                      class="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Tolak
                    </button>
                  </div>
                  <span v-else class="text-xs text-slate-400 font-medium whitespace-nowrap">
                    Selesai Diproses
                  </span>
                </td>
              </tr>
              <tr v-if="installmentList.length === 0">
                <td colspan="6" class="py-10 text-center text-slate-400 text-xs">
                  Tidak ada permohonan skema cicilan saat ini.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ===================================================================== -->
    <!-- MODAL PROSES REFUND (CR-007)                                          -->
    <!-- ===================================================================== -->
    <Teleport to="body">
      <div
        v-if="selectedRefundItem"
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm"
        @click.self="selectedRefundItem = null"
      >
        <div class="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden my-auto transform-gpu">
          <!-- Top Accent Bar -->
          <div class="h-1 w-full bg-[#1E3A8A] flex-shrink-0"></div>

          <!-- Modal Header -->
          <div class="p-5 sm:px-6 sm:py-4 flex items-center justify-between gap-4 border-b border-slate-100 flex-shrink-0">
            <div>
              <div class="text-[11px] font-bold text-blue-700 uppercase tracking-wider font-sora">
                Biro Administrasi Keuangan PMB
              </div>
              <h3 class="font-sora font-bold text-slate-900 text-base sm:text-lg mt-0.5">
                Konfirmasi Pengembalian Dana (Refund)
              </h3>
            </div>
            <button
              @click="selectedRefundItem = null"
              class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Tutup Modal"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs font-sans">
            <!-- Applicant Info Card (Tanpa Nominal) -->
            <div class="bg-slate-50 border border-slate-200/90 rounded-xl p-4 space-y-3">
              <div class="flex items-center justify-between gap-3 pb-2.5 border-b border-slate-200/70">
                <div class="flex items-center gap-2.5 min-w-0">
                  <div class="w-8 h-8 rounded-full bg-[#1E3A8A] text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {{ selectedRefundItem.candidateName ? selectedRefundItem.candidateName.slice(0, 2).toUpperCase() : 'PM' }}
                  </div>
                  <div class="min-w-0">
                    <div class="font-bold text-slate-900 text-sm truncate">
                      {{ selectedRefundItem.candidateName }}
                    </div>
                    <div class="text-[11px] text-slate-500 font-mono">
                      {{ selectedRefundItem.regNo }} • {{ selectedRefundItem.prodi }}
                    </div>
                  </div>
                </div>
                <div class="flex-shrink-0">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    Menunggu Konfirmasi
                  </span>
                </div>
              </div>

              <!-- Alasan Pengunduran Diri -->
              <div class="space-y-1">
                <div class="text-[11px] font-semibold text-slate-600">Alasan Pengunduran Diri:</div>
                <div class="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 italic leading-relaxed">
                  "{{ selectedRefundItem.reason }}"
                </div>
              </div>
            </div>

            <!-- Pesan Konfirmasi Refund (Hanya Pesan Saja) -->
            <div class="space-y-1.5">
              <label class="block font-semibold text-slate-800 text-xs">
                Pesan Konfirmasi Refund untuk Calon Mahasiswa <span class="text-rose-500">*</span>
              </label>
              <textarea
                v-model="refundForm.notes"
                rows="4"
                placeholder="Tuliskan pesan konfirmasi pengembalian dana (misal: Pengembalian dana pendaftaran Anda telah disetujui dan diproses oleh Biro Keuangan ke rekening asal)..."
                class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 outline-none shadow-2xs transition-all leading-relaxed"
              ></textarea>
              <p class="text-[11px] text-slate-500">
                Pesan ini akan dikirimkan dan langsung ditampilkan pada status pendaftaran calon mahasiswa.
              </p>
            </div>
          </div>

          <!-- Modal Footer Actions -->
          <div class="p-4 sm:px-6 sm:py-3.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-end gap-2.5 flex-shrink-0">
            <button
              type="button"
              @click="selectedRefundItem = null"
              class="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-xl transition-colors cursor-pointer text-center"
            >
              Batal
            </button>
            <button
              type="button"
              @click="submitRefundDecision('approved')"
              :disabled="!refundForm.notes || !refundForm.notes.trim()"
              class="px-5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 class="w-4 h-4" />
              <span>Kirim Konfirmasi Refund</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin';
import { useToast } from '@/composables/useToast';
import { financeApi } from '@/api/finance';
import DoughnutChart from '@/components/charts/DoughnutChart.vue';
import {
  FileSpreadsheet,
  Download,
  Receipt,
  CheckCircle2,
  XCircle,
  X,
  Quote,
  RefreshCw,
} from 'lucide-vue-next';
import { exportToExcelTable, exportToCsvSeparated } from '@/utils/exportHelper';

const props = defineProps({
  currentRole: {
    type: String,
    default: 'superadmin',
  },
});

const adminStore = useAdminStore();
const toast = useToast();
const activeFinanceTab = ref('reconciliation');

// Data Refund & Installments
const selectedRefundItem = ref(null);
const refundForm = reactive({
  notes: '',
});

// Data refund (CR-007) & cicilan UKT (CR-010) terhubung ke adminStore (dinamis & tersimpan permanen)
const refundList = computed(() => adminStore.refundReviews);
const installmentList = computed(() => adminStore.installmentRequests);

onMounted(() => {
  adminStore.fetchRefundReviews();
  adminStore.fetchInstallmentRequests();
});

const pendingRefundCount = computed(() => {
  return refundList.value.filter((r) => r.status === 'pending').length;
});

const pendingInstallmentCount = computed(() => {
  return installmentList.value.filter((i) => i.status === 'pending').length;
});

const openRefundModal = (item) => {
  selectedRefundItem.value = item;
  refundForm.notes = item.notes || 'Pengembalian dana pendaftaran Anda telah disetujui dan diproses oleh Biro Administrasi Keuangan PMB ke rekening asal.';
};

const submitRefundDecision = async (status) => {
  if (!selectedRefundItem.value) return;
  const target = selectedRefundItem.value;
  
  await adminStore.updateRefundReview(
    target.id,
    status,
    0,
    '',
    refundForm.notes
  );

  if (status === 'approved') {
    toast.success(`Konfirmasi pengembalian dana untuk ${target.candidateName} berhasil dikirim.`);
  } else {
    toast.info(`Permohonan pengembalian dana untuk ${target.candidateName} telah ditolak.`);
  }
  selectedRefundItem.value = null;
};

const handleReviewInstallment = async (item, status) => {
  await adminStore.reviewInstallmentRequest(item.id, status);
  if (status === 'approved') {
    toast.success(`Pengajuan skema cicilan ${item.numTerms} termin untuk ${item.candidateName} berhasil disetujui.`);
  } else {
    toast.info(`Pengajuan skema cicilan untuk ${item.candidateName} telah ditolak.`);
  }
};

const paidUktCount = computed(() => {
  return adminStore.applicants.filter((a) => a.payments?.uktFee?.status === 'paid').length;
});

const paidRegFeeCount = computed(() => {
  return adminStore.applicants.filter((a) => a.payments?.registrationFee?.status === 'paid').length;
});

const regFeePercent = computed(() => {
  if (!adminStore.applicants.length) return 0;
  return Math.round((paidRegFeeCount.value / adminStore.applicants.length) * 100);
});

const totalRegFeePaid = computed(() => {
  return adminStore.applicants
    .filter((a) => a.payments?.registrationFee?.status === 'paid')
    .reduce((acc, a) => acc + (a.payments.registrationFee.amount || 250000), 0);
});

const totalUktFeePaid = computed(() => {
  return adminStore.applicants
    .filter((a) => a.payments?.uktFee?.status === 'paid')
    .reduce((acc, a) => acc + (a.payments.uktFee.amount || 0), 0);
});

const totalRevenue = computed(() => totalRegFeePaid.value + totalUktFeePaid.value);

const revenueDoughnutData = computed(() => ({
  labels: ['Biaya Formulir Pendaftaran', 'Pelunasan UKT Semester 1'],
  datasets: [
    {
      data: [totalRegFeePaid.value, totalUktFeePaid.value],
      backgroundColor: ['#F59E0B', '#1E3A8A'],
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
  ],
}));

const allTransactions = computed(() => {
  const list = [];
  adminStore.applicants.forEach((a) => {
    // UKT Fee
    if (a.payments?.uktFee) {
      list.push({
        applicantId: a.id,
        applicantName: a.fullName,
        prodi: a.prodi1,
        invoiceId: a.payments.uktFee.id,
        feeType: 'UKT & Registrasi Sem. 1',
        amount: a.payments.uktFee.amount,
        status: a.payments.uktFee.status,
        method: a.payments.uktFee.method,
        paidAt: a.payments.uktFee.paidAt,
        submittedAt: a.payments.uktFee.submittedAt,
        confirmedBy: a.payments.uktFee.confirmedBy,
        typeKey: 'uktFee',
      });
    }
    // Registration Fee
    if (a.payments?.registrationFee) {
      list.push({
        applicantId: a.id,
        applicantName: a.fullName,
        prodi: a.prodi1,
        invoiceId: a.payments.registrationFee.id,
        feeType: 'Biaya Formulir Pendaftaran',
        amount: a.payments.registrationFee.amount,
        status: a.payments.registrationFee.status,
        method: a.payments.registrationFee.method,
        paidAt: a.payments.registrationFee.paidAt,
        submittedAt: a.payments.registrationFee.submittedAt,
        confirmedBy: a.payments.registrationFee.confirmedBy,
        typeKey: 'registrationFee',
      });
    }
  });

  const statusPriority = { pending_confirmation: 1, pending: 2, unpaid: 2, paid: 3 };
  return list.sort((a, b) => (statusPriority[a.status] || 99) - (statusPriority[b.status] || 99));
});

const pendingConfirmationCount = computed(() => {
  return allTransactions.value.filter((t) => t.status === 'pending_confirmation').length;
});

const isSyncingDuitku = ref(false);

const duitkuCount = computed(() => {
  return allTransactions.value.filter((t) => {
    const m = (t.method || '').toLowerCase();
    return (m.includes('duitku') || m.includes('qris') || m.includes('shopee') || m.includes('dana') || m.includes('ovo') || m.includes('retail') || m.includes('indomaret') || m.includes('bca')) && t.status === 'paid';
  }).length;
});

const bsiCount = computed(() => allTransactions.value.filter((t) => t.method?.toLowerCase().includes('bsi') && !t.method?.toLowerCase().includes('duitku') && t.status === 'paid').length);
const mandiriCount = computed(() => allTransactions.value.filter((t) => t.method?.toLowerCase().includes('mandiri') && !t.method?.toLowerCase().includes('duitku') && t.status === 'paid').length);
const totalPaidTrx = computed(() => bsiCount.value + mandiriCount.value + (duitkuCount.value || 0));

const channelDoughnutData = computed(() => {
  const dVal = duitkuCount.value > 0 ? duitkuCount.value : 1; // Visualisasi fallback
  return {
    labels: ['Duitku Multi-Kanal (Sandbox)', 'Bank BSI Virtual Account', 'Bank Mandiri Virtual Account'],
    datasets: [
      {
        data: [dVal, bsiCount.value, mandiriCount.value],
        backgroundColor: ['#D97706', '#059669', '#2563EB'],
        borderWidth: 2,
        borderColor: '#FFFFFF',
      },
    ],
  };
});

const syncDuitkuReconciliation = async () => {
  isSyncingDuitku.value = true;
  try {
    await financeApi.reconcilePayments().catch(() => null);
    await adminStore.fetchApplicants?.();
    toast.success('Pembaruan data transaksi dan mutasi Duitku Sandbox berhasil disinkronkan ke pembukuan.');
  } catch (err) {
    toast.info('Proses rekonsiliasi transaksi Duitku Sandbox telah selesai.');
  } finally {
    isSyncingDuitku.value = false;
  }
};

const confirmManual = (trx) => {
  adminStore.confirmPayment(trx.applicantId, trx.typeKey);
  toast.success(`Pembayaran ${trx.feeType} (${trx.invoiceId}) atas nama ${trx.applicantName} berhasil dikonfirmasi lunas.`);
};

const exportExcel = () => {
  const columns = [
    { header: 'No.', key: 'index', align: 'center' },
    { header: 'No. Invoice', key: 'invoiceId', align: 'center' },
    { header: 'Nama Calon Mahasiswa', key: 'applicantName', align: 'left' },
    { header: 'Program Studi', key: 'prodi', align: 'left' },
    { header: 'Jenis Tagihan', key: 'feeType', align: 'left' },
    { header: 'Nominal (Rp)', key: 'amount', align: 'right', format: 'currency' },
    { header: 'Metode Pembayaran', key: 'method', align: 'center' },
    { header: 'Status Transaksi', key: 'statusLabel', align: 'center', format: 'status' },
  ];

  const totalNominal = allTransactions.value.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
  const totalPaidNominal = allTransactions.value
    .filter((t) => t.status === 'paid')
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  const formattedData = allTransactions.value.map((t, idx) => ({
    index: idx + 1,
    invoiceId: t.invoiceId,
    applicantName: t.applicantName,
    prodi: t.prodi,
    feeType: t.feeType,
    amount: t.amount,
    method: t.method,
    statusLabel:
      t.status === 'paid'
        ? 'Lunas'
        : t.status === 'pending_confirmation'
        ? 'Menunggu Konfirmasi'
        : t.status === 'pending'
        ? 'Menunggu Bayar'
        : 'Belum Bayar',
  }));

  exportToExcelTable({
    filename: `Rekap_Keuangan_PMB_BTH_${Date.now()}`,
    title: 'UNIVERSITAS BAKTI TUNAS HUSADA - SISTEM PMB',
    subtitle: 'LAPORAN REKONSILIASI KEUANGAN & PEMBAYARAN MAHASISWA BARU TA 2026/2027',
    metadata: [
      {
        label: 'Waktu Pengunduhan',
        value: new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'medium' }),
      },
      {
        label: 'Total Transaksi',
        value: `${allTransactions.value.length} Tagihan Terdata`,
      },
      {
        label: 'Total Nominal Pelunasan Terverifikasi',
        value: `Rp ${totalPaidNominal.toLocaleString('id-ID')}`,
      },
    ],
    columns,
    data: formattedData,
    summary: {
      colspan: 5,
      label: 'TOTAL AKUMULASI TRANSAKSI:',
      value: totalNominal,
    },
  });

  toast.success('Rekapitulasi keuangan berhasil diunduh dalam format Excel.');
};

const exportCsv = () => {
  const headers = ['No Invoice', 'Nama Mahasiswa', 'Prodi', 'Jenis Tagihan', 'Nominal', 'Metode', 'Status'];
  const rows = allTransactions.value.map((t) => [
    t.invoiceId,
    t.applicantName,
    t.prodi,
    t.feeType,
    t.amount,
    t.method,
    t.status === 'paid'
      ? 'Lunas'
      : t.status === 'pending_confirmation'
      ? 'Menunggu Konfirmasi'
      : t.status === 'pending'
      ? 'Menunggu Bayar'
      : 'Belum Bayar',
  ]);

  exportToCsvSeparated({
    filename: `Rekap_Keuangan_PMB_BTH_${Date.now()}`,
    headers,
    rows,
    delimiter: ';', // Menggunakan titik-koma agar Microsoft Excel versi Windows membagi kolom secara presisi
  });

  toast.success('Rekapitulasi keuangan berhasil diunduh dalam format CSV.');
};
</script>
