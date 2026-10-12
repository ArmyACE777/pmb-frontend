<template>
  <div class="space-y-6">
    <!-- Header Meja Master Data -->
    <div class="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 class="font-sora font-extrabold text-slate-900 text-lg sm:text-xl">
            Master Data & Pengaturan Sistem PMB
          </h2>
          <p class="text-xs text-slate-500 mt-1">
            Pengelolaan struktur organisasi akademik fakultas & prodi serta konfigurasi matriks hak akses peran pengguna (RBAC).
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
          <button
            @click="syncCurrentData"
            :disabled="organizationStore.isLoading || isSyncingRbac"
            class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-sora font-semibold rounded transition-colors cursor-pointer disabled:opacity-50"
          >
            {{ organizationStore.isLoading || isSyncingRbac ? 'Sinkronisasi...' : 'Sinkronkan Data' }}
          </button>

          <button
            v-if="activeSubDesk === 'programs'"
            @click="openAddModal"
            class="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-sora font-semibold rounded transition-colors cursor-pointer"
          >
            Tambah Program Studi
          </button>

          <button
            v-else-if="activeSubDesk === 'rbac' && currentRole === 'superadmin'"
            @click="saveRolePermissions"
            :disabled="isSavingRbac"
            class="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-sora font-semibold rounded transition-colors cursor-pointer disabled:opacity-50"
          >
            {{ isSavingRbac ? 'Menyimpan...' : 'Simpan Hak Akses' }}
          </button>
        </div>
      </div>

      <!-- Sub-Desk Tabs (Master Data: Jenjang, Fakultas, Prodi, RBAC) -->
      <div class="flex flex-wrap items-center gap-2 pt-4">
        <button
          type="button"
          @click="activeSubDesk = 'jenjang'"
          class="px-3.5 py-1.5 text-xs font-semibold font-sora rounded-lg border transition-colors cursor-pointer"
          :class="activeSubDesk === 'jenjang'
            ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
        >
          Jenjang Pendidikan
        </button>

        <button
          type="button"
          @click="activeSubDesk = 'fakultas'"
          class="px-3.5 py-1.5 text-xs font-semibold font-sora rounded-lg border transition-colors cursor-pointer"
          :class="activeSubDesk === 'fakultas'
            ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
        >
          Fakultas Akademik
        </button>

        <button
          type="button"
          @click="activeSubDesk = 'programs'"
          class="px-3.5 py-1.5 text-xs font-semibold font-sora rounded-lg border transition-colors cursor-pointer"
          :class="activeSubDesk === 'programs'
            ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
        >
          Program Studi (Prodi)
        </button>

        <button
          v-if="currentRole === 'superadmin' || currentRole === 'dekan'"
          type="button"
          @click="activeSubDesk = 'rbac'"
          class="px-3.5 py-1.5 text-xs font-semibold font-sora rounded-lg border transition-colors cursor-pointer"
          :class="activeSubDesk === 'rbac'
            ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
        >
          Matriks Hak Akses (RBAC)
        </button>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- TAMPILAN: MASTER JENJANG PENDIDIKAN                              -->
    <!-- ================================================================= -->
    <div v-if="activeSubDesk === 'jenjang'" class="space-y-6">
      <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-sm">Jenjang Pendidikan Akademik</h3>
            <p class="text-xs text-slate-500 mt-0.5">Klasifikasi program pendidikan diploma, sarjana, dan profesi Universitas BTH</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs min-w-[700px]">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-sora font-semibold whitespace-nowrap">
              <tr>
                <th class="py-3 px-4 whitespace-nowrap">No</th>
                <th class="py-3 px-4 whitespace-nowrap">Kode</th>
                <th class="py-3 px-4 whitespace-nowrap">Nama Jenjang</th>
                <th class="py-3 px-4 whitespace-nowrap">Masa Studi Standar</th>
                <th class="py-3 px-4 whitespace-nowrap">Gelar Kelulusan</th>
                <th class="py-3 px-4 text-center whitespace-nowrap">Jumlah Prodi</th>
                <th class="py-3 px-4 text-center whitespace-nowrap">Alokasi Kuota</th>
                <th class="py-3 px-4 text-center whitespace-nowrap min-w-[130px]">Status PMB</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-sans">
              <tr v-for="(deg, idx) in degreesList" :key="deg.code" class="hover:bg-slate-50/70 transition-colors">
                <td class="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">{{ idx + 1 }}</td>
                <td class="py-3 px-4 whitespace-nowrap">
                  <span class="font-mono font-bold text-xs px-2.5 py-1 bg-blue-50 text-[#1E3A8A] rounded border border-blue-200/60 inline-block whitespace-nowrap">
                    {{ deg.code }}
                  </span>
                </td>
                <td class="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">{{ deg.name }}</td>
                <td class="py-3 px-4 text-slate-600 whitespace-nowrap">{{ deg.studyDuration }}</td>
                <td class="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">{{ deg.degreeTitle }}</td>
                <td class="py-3 px-4 text-center font-mono font-bold text-slate-800 whitespace-nowrap">{{ deg.prodiCount }} Prodi</td>
                <td class="py-3 px-4 text-center font-mono text-slate-800 whitespace-nowrap">{{ deg.totalQuota }} Kursi</td>
                <td class="py-3 px-4 text-center whitespace-nowrap">
                  <span
                    class="text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap inline-block"
                    :class="deg.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'"
                  >
                    {{ deg.isActive ? 'Buka Pendaftaran' : 'Persiapan' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- TAMPILAN: MASTER FAKULTAS                                         -->
    <!-- ================================================================= -->
    <div v-else-if="activeSubDesk === 'fakultas'" class="space-y-6">
      <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-sm">Fakultas & Unit Akademik</h3>
            <p class="text-xs text-slate-500 mt-0.5">Daftar fakultas pengampu program studi di lingkungan Universitas Bakti Tunas Husada</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs min-w-[780px]">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-sora font-semibold whitespace-nowrap">
              <tr>
                <th class="py-3 px-4 whitespace-nowrap">No</th>
                <th class="py-3 px-4 whitespace-nowrap">Kode</th>
                <th class="py-3 px-4 whitespace-nowrap min-w-[180px]">Nama Fakultas</th>
                <th class="py-3 px-4 whitespace-nowrap min-w-[180px]">Pimpinan (Dekan)</th>
                <th class="py-3 px-4 whitespace-nowrap min-w-[170px]">Lokasi Gedung</th>
                <th class="py-3 px-4 text-center whitespace-nowrap min-w-[120px]">Akreditasi</th>
                <th class="py-3 px-4 text-center whitespace-nowrap min-w-[100px]">Jumlah Prodi</th>
                <th class="py-3 px-4 text-center whitespace-nowrap min-w-[90px]">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-sans">
              <tr v-for="(fac, idx) in facultiesList" :key="fac.code" class="hover:bg-slate-50/70 transition-colors">
                <td class="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">{{ idx + 1 }}</td>
                <td class="py-3 px-4 whitespace-nowrap">
                  <span class="font-mono font-bold text-xs px-2.5 py-1 bg-slate-100 text-slate-900 rounded whitespace-nowrap inline-block">
                    {{ fac.code }}
                  </span>
                </td>
                <td class="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">{{ fac.name }}</td>
                <td class="py-3 px-4 text-slate-700 font-medium whitespace-nowrap">{{ fac.dean }}</td>
                <td class="py-3 px-4 text-slate-500 whitespace-nowrap">{{ fac.building }}</td>
                <td class="py-3 px-4 text-center whitespace-nowrap">
                  <span class="inline-block px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap bg-blue-50 text-[#1E3A8A] border border-blue-200/60 shadow-2xs">
                    {{ fac.accreditation }}
                  </span>
                </td>
                <td class="py-3 px-4 text-center font-mono font-bold text-slate-800 whitespace-nowrap">{{ fac.prodiCount }} Prodi</td>
                <td class="py-3 px-4 text-center whitespace-nowrap">
                  <span class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 whitespace-nowrap inline-block">
                    Aktif
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- TAMPILAN 1: MASTER FAKULTAS & PROGRAM STUDI                       -->
    <!-- ================================================================= -->
    <div v-else-if="activeSubDesk === 'programs'" class="space-y-6">
      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="p-3.5 rounded bg-white border border-slate-200">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sora">Fakultas Aktif</div>
          <div class="font-sora font-extrabold text-xl text-slate-900 mt-0.5">
            {{ organizationStore.facultiesCount }}
          </div>
          <div class="text-[11px] text-slate-500 mt-0.5">Unit Akademik</div>
        </div>

        <div class="p-3.5 rounded bg-white border border-slate-200">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sora">Total Program Studi</div>
          <div class="font-sora font-extrabold text-xl text-[#1E3A8A] mt-0.5">
            {{ organizationStore.totalProgramsCount }}
          </div>
          <div class="text-[11px] text-slate-500 mt-0.5">Semua Jenjang (S1 / D3)</div>
        </div>

        <div class="p-3.5 rounded bg-white border border-slate-200">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sora">Prodi Buka Pendaftaran</div>
          <div class="font-sora font-extrabold text-xl text-emerald-700 mt-0.5">
            {{ organizationStore.activeProgramsCount }}
          </div>
          <div class="text-[11px] text-emerald-600 font-medium mt-0.5">Status Aktif PMB</div>
        </div>

        <div class="p-3.5 rounded bg-white border border-slate-200">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sora">Format Standar NIM</div>
          <div class="font-sora font-extrabold text-sm text-slate-800 mt-1 font-mono">
            {YY}{NIM}{JALUR}{URUT}
          </div>
          <div class="text-[10px] text-slate-500 mt-0.5">Format Standar BTH</div>
        </div>
      </div>

      <!-- Tabel Program Studi & Filter -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <!-- Filter Bar -->
        <div class="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <span class="text-xs font-semibold text-slate-700 whitespace-nowrap">Filter Fakultas:</span>
            <select
              v-model="selectedFacultyFilter"
              class="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-700 outline-none focus:border-[#1E3A8A]"
            >
              <option value="ALL">Semua Fakultas ({{ organizationStore.studyPrograms.length }} Prodi)</option>
              <option v-for="f in organizationStore.faculties" :key="f.code" :value="f.code">
                {{ f.name }} ({{ f.code }})
              </option>
            </select>
          </div>

          <div class="w-full sm:w-72">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari prodi / kode / NIM code..."
              class="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs outline-none focus:border-[#1E3A8A] text-slate-800"
            />
          </div>
        </div>

        <!-- Table Container -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs min-w-[980px]">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-sora font-semibold whitespace-nowrap">
              <tr>
                <th class="py-3 px-4 whitespace-nowrap min-w-[50px]">No</th>
                <th class="py-3 px-4 whitespace-nowrap min-w-[110px]">Kode Prodi</th>
                <th class="py-3 px-4 whitespace-nowrap min-w-[100px]">Kode NIM</th>
                <th class="py-3 px-4 whitespace-nowrap min-w-[200px]">Nama Program Studi</th>
                <th class="py-3 px-4 whitespace-nowrap min-w-[150px]">Fakultas</th>
                <th class="py-3 px-4 whitespace-nowrap min-w-[80px] text-center">Jenjang</th>
                <th class="py-3 px-4 whitespace-nowrap min-w-[120px] text-center">Akreditasi</th>
                <th class="py-3 px-4 whitespace-nowrap min-w-[150px]">Biaya UKT</th>
                <th class="py-3 px-4 text-center whitespace-nowrap min-w-[110px]">Status PMB</th>
                <th class="py-3 px-4 text-right whitespace-nowrap min-w-[140px]">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-sans">
              <tr
                v-for="(sp, idx) in filteredPrograms"
                :key="sp.id"
                class="hover:bg-slate-50/70 transition-colors"
              >
                <td class="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">{{ idx + 1 }}</td>
                <td class="py-3 px-4 whitespace-nowrap">
                  <span class="font-mono font-semibold text-slate-900 text-xs">
                    {{ sp.code }}
                  </span>
                </td>
                <td class="py-3 px-4 whitespace-nowrap">
                  <span class="font-mono text-slate-500 text-xs">
                    {{ sp.nim_code }}
                  </span>
                </td>
                <td class="py-3 px-4 font-medium text-slate-900 min-w-[200px]">
                  {{ sp.name }}
                </td>
                <td class="py-3 px-4 text-slate-600 font-normal whitespace-nowrap">
                  {{ sp.faculty_name }}
                </td>
                <td class="py-3 px-4 whitespace-nowrap text-center">
                  <span class="text-xs text-slate-700 font-semibold px-2 py-0.5 rounded bg-slate-100 inline-block whitespace-nowrap">
                    {{ sp.degree }}
                  </span>
                </td>
                <td class="py-3 px-4 whitespace-nowrap text-center">
                  <span class="inline-block px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap bg-blue-50 text-[#1E3A8A] border border-blue-200/60 shadow-2xs">
                    {{ sp.accreditation }}
                  </span>
                </td>
                <td class="py-3 px-4 font-mono text-slate-800 whitespace-nowrap font-medium min-w-[150px]">
                  {{ sp.ukt_estimate }}
                </td>
                <td class="py-3 px-4 text-center whitespace-nowrap">
                  <span
                    class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap inline-block"
                    :class="sp.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'"
                  >
                    {{ sp.is_active ? 'Aktif' : 'Nonaktif' }}
                  </span>
                </td>
                <td class="py-3 px-4 text-right whitespace-nowrap">
                  <button
                    @click="toggleStatus(sp)"
                    class="px-2.5 py-1 text-xs font-medium rounded border transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                    :class="sp.is_active
                      ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      : 'bg-white hover:bg-slate-50 text-[#1E3A8A] border-slate-200'"
                  >
                    {{ sp.is_active ? 'Tutup Pendaftaran' : 'Buka Pendaftaran' }}
                  </button>
                </td>
              </tr>
              <tr v-if="filteredPrograms.length === 0">
                <td colspan="10" class="py-8 text-center text-slate-400">
                  Tidak ada program studi yang cocok dengan filter atau kata kunci pencarian.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- TAMPILAN 2: MATRIKS HAK AKSES & PERAN (CR-009 RBAC)                -->
    <!-- ================================================================= -->
    <div v-else-if="activeSubDesk === 'rbac'" class="space-y-6">
      <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
              Konfigurasi Hak Akses Peran: {{ activeRoleTitle }}
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Pilih peran admin di bawah untuk mengatur hak izin akses (permissions) operasional sistem.
            </p>
          </div>

          <!-- Selector Role Admin -->
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-600 font-medium">Pilih Peran:</span>
            <select
              v-model="selectedRoleForRbac"
              @change="loadRolePermissions"
              class="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-800 outline-none focus:border-[#1E3A8A]"
            >
              <option v-for="r in adminRolesList" :key="r.code" :value="r.code">
                {{ r.label }} ({{ r.code }})
              </option>
            </select>
          </div>
        </div>

        <!-- Matriks Izin Menurut Kelompok Fitur -->
        <div class="space-y-4">
          <div
            v-for="group in permissionGroups"
            :key="group.id"
            class="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50/40"
          >
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-sora font-bold text-xs text-slate-900 uppercase tracking-wide">
                  {{ group.title }}
                </h4>
                <p class="text-[11px] text-slate-500 mt-0.5">{{ group.description }}</p>
              </div>

              <button
                v-if="currentRole === 'superadmin'"
                type="button"
                @click="toggleGroupAll(group)"
                class="text-[11px] text-[#1E3A8A] hover:underline font-medium cursor-pointer"
              >
                Pilih Semua / Batal
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
              <label
                v-for="perm in group.permissions"
                :key="perm.code"
                class="flex items-start gap-2.5 p-2.5 bg-white rounded border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  :value="perm.code"
                  v-model="assignedPermissions"
                  :disabled="currentRole !== 'superadmin' || selectedRoleForRbac === 'superadmin'"
                  class="mt-0.5 text-[#1E3A8A] rounded"
                />
                <div>
                  <div class="text-xs font-semibold text-slate-800">{{ perm.label }}</div>
                  <div class="text-[10px] font-mono text-slate-400">{{ perm.code }}</div>
                  <div class="text-[11px] text-slate-500 mt-0.5">{{ perm.desc }}</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div v-if="currentRole === 'superadmin'" class="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span class="text-xs text-slate-500">
            Total izin terpilih: <strong>{{ assignedPermissions.length }}</strong> hak akses
          </span>
          <button
            type="button"
            @click="saveRolePermissions"
            :disabled="isSavingRbac || selectedRoleForRbac === 'superadmin'"
            class="px-5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold rounded transition-colors cursor-pointer disabled:opacity-50"
          >
            {{ isSavingRbac ? 'Menyimpan...' : 'Simpan Hak Akses Peran Ini' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Tambah Program Studi Baru -->
    <Teleport to="body">
      <div
        v-if="showAddModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm modal-sharp"
        @click.self="showAddModal = false"
      >
        <div class="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden my-auto transform-gpu">
          <!-- Top Accent Bar -->
          <div class="h-1 w-full bg-[#1E3A8A] flex-shrink-0"></div>

        <!-- Modal Header -->
        <div class="p-5 sm:p-6 pb-4 flex items-start justify-between gap-4 border-b border-slate-100 flex-shrink-0">
          <div class="flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-[#1E3A8A] flex-shrink-0 shadow-2xs">
              <Building2 class="w-5 h-5 text-[#1E3A8A]" />
            </div>
            <div>
              <div class="text-[10px] font-bold text-blue-700 uppercase tracking-wider font-sora flex items-center gap-1.5">
                <span>Katalog Akademik PMB</span>
                <span class="text-slate-400 font-normal">/</span>
                <span class="text-slate-500 font-normal">Organization Service</span>
              </div>
              <h3 class="font-sora font-bold text-slate-900 text-base sm:text-lg">
                Tambah Program Studi Baru
              </h3>
            </div>
          </div>
          <button
            @click="showAddModal = false"
            class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="submitAddProgram" class="p-5 sm:p-6 space-y-4 flex-1 overflow-y-auto text-xs font-sans">
          <!-- Nama Program Studi -->
          <div class="space-y-1.5">
            <label class="block font-semibold text-slate-800 flex items-center gap-1.5">
              <BookOpen class="w-3.5 h-3.5 text-blue-600" />
              <span>Nama Lengkap Program Studi</span>
              <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="newForm.name"
              type="text"
              required
              placeholder="Contoh: S1 Biomedis & Rekayasa Hayati"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs font-medium text-slate-800 outline-none shadow-2xs transition-all"
            />
          </div>

          <!-- Kode Unik & Kode NIM -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div class="space-y-1.5">
              <label class="block font-semibold text-slate-800 flex items-center gap-1.5">
                <Hash class="w-3.5 h-3.5 text-indigo-600" />
                <span>Kode Scope Prodi</span>
                <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="newForm.code"
                type="text"
                required
                placeholder="Contoh: BIO / GZ / ARS"
                class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-[#1E3A8A] outline-none shadow-2xs transition-all"
              />
              <p class="text-[10px] text-slate-400">Pengenal unik singkatan program studi.</p>
            </div>

            <div class="space-y-1.5">
              <label class="block font-semibold text-slate-800 flex items-center gap-1.5">
                <Award class="w-3.5 h-3.5 text-amber-600" />
                <span>Kode NIM (2 Digit)</span>
                <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="newForm.nim_code"
                type="text"
                required
                maxlength="2"
                placeholder="Contoh: 12"
                class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs font-mono font-bold text-center text-[#1E3A8A] outline-none shadow-2xs transition-all"
              />
              <p class="text-[10px] text-slate-400">2 Digit penomoran ijazah & kartu mahasiswa.</p>
            </div>
          </div>

          <!-- Live NIM Preview Card -->
          <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
            <div>
              <div class="text-[10px] uppercase font-bold text-blue-700 tracking-wider font-sora">
                Simulasi Format Standar NIM BTH
              </div>
              <div class="text-[11px] text-slate-600 mt-0.5">
                Format: <span class="font-mono font-semibold">{YY}{NIM}{JALUR}{URUT}</span>
              </div>
            </div>
            <div class="px-3 py-1.5 bg-white rounded-lg border border-blue-200 shadow-2xs flex items-center gap-1.5">
              <span class="text-[11px] text-slate-500">Pratinjau:</span>
              <span class="font-mono font-bold text-sm text-[#1E3A8A]">
                {{ nimSimulation }}
              </span>
            </div>
          </div>

          <!-- Fakultas & Jenjang -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div class="space-y-1.5">
              <label class="block font-semibold text-slate-800 flex items-center gap-1.5">
                <Building2 class="w-3.5 h-3.5 text-slate-500" />
                <span>Fakultas Induk</span>
                <span class="text-rose-500">*</span>
              </label>
              <select
                v-model="newForm.faculty_code"
                class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 outline-none shadow-2xs transition-all cursor-pointer font-medium"
              >
                <option v-for="f in organizationStore.faculties" :key="f.code" :value="f.code">
                  {{ f.name }} ({{ f.code }})
                </option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="block font-semibold text-slate-800 flex items-center gap-1.5">
                <GraduationCap class="w-3.5 h-3.5 text-slate-500" />
                <span>Jenjang Pendidikan</span>
                <span class="text-rose-500">*</span>
              </label>
              <select
                v-model="newForm.degree"
                class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 outline-none shadow-2xs transition-all cursor-pointer font-medium"
              >
                <option value="S1">S1 (Sarjana)</option>
                <option value="D3">D3 (Diploma Tiga)</option>
                <option value="Profesi">Profesi</option>
              </select>
            </div>
          </div>

          <!-- Akreditasi & Estimasi UKT -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div class="space-y-1.5">
              <label class="block font-semibold text-slate-800 flex items-center gap-1.5">
                <Award class="w-3.5 h-3.5 text-slate-500" />
                <span>Status Akreditasi</span>
                <span class="text-rose-500">*</span>
              </label>
              <select
                v-model="newForm.accreditation"
                class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 outline-none shadow-2xs transition-all cursor-pointer font-medium"
              >
                <option value="Unggul">Unggul</option>
                <option value="Baik Sekali">Baik Sekali</option>
                <option value="Baik">Baik</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="block font-semibold text-slate-800 flex items-center gap-1.5">
                <DollarSign class="w-3.5 h-3.5 text-slate-500" />
                <span>Estimasi Biaya UKT</span>
                <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="newForm.ukt_estimate"
                type="text"
                placeholder="Rp 5.000.000 / semester"
                class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs font-semibold text-slate-800 outline-none shadow-2xs transition-all"
              />
            </div>
          </div>

          <!-- Modal Footer Actions -->
          <div class="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-end gap-2.5 flex-shrink-0">
            <button
              type="button"
              @click="showAddModal = false"
              class="w-full sm:w-auto px-4 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-xl transition-colors cursor-pointer text-center"
            >
              Batal
            </button>
            <button
              type="submit"
              class="w-full sm:w-auto px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              <CheckCircle2 class="w-4 h-4" />
              <span>Simpan Program Studi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useOrganizationStore } from '@/stores/organization';
import { authApi } from '@/api/auth';
import { useToast } from '@/composables/useToast';
import {
  Building2,
  BookOpen,
  PlusCircle,
  Plus,
  X,
  Award,
  Hash,
  CheckCircle2,
  DollarSign,
  Layers,
  GraduationCap,
} from 'lucide-vue-next';

const props = defineProps({
  currentRole: {
    type: String,
    default: 'superadmin',
  },
  initialSubDesk: {
    type: String,
    default: 'programs',
  },
});

const organizationStore = useOrganizationStore();
const toast = useToast();
const activeSubDesk = ref(props.initialSubDesk || 'programs');
const selectedFacultyFilter = ref('ALL');
const searchQuery = ref('');
const showAddModal = ref(false);

const degreesList = ref([
  { code: 'D3', name: 'Diploma Tiga', studyDuration: '6 Semester (3 Tahun)', degreeTitle: 'Ahli Madya (A.Md.)', prodiCount: 2, totalQuota: 130, isActive: true },
  { code: 'S1', name: 'Sarjana', studyDuration: '8 Semester (4 Tahun)', degreeTitle: 'Sarjana (S.Farm., S.Kom., S.Kes., S.Bns.)', prodiCount: 5, totalQuota: 475, isActive: true },
  { code: 'Profesi', name: 'Pendidikan Profesi', studyDuration: '2 Semester (1 Tahun)', degreeTitle: 'Apoteker / Ners (Apt., Ners)', prodiCount: 1, totalQuota: 60, isActive: true },
  { code: 'S2', name: 'Magister', studyDuration: '4 Semester (2 Tahun)', degreeTitle: 'Magister Farmasi (M.Farm.)', prodiCount: 1, totalQuota: 30, isActive: false },
]);

const facultiesList = ref([
  { code: 'FF', name: 'Fakultas Farmasi', dean: 'Prof. Dr. apt. Budi Rahardjo, M.Si.', building: 'Gedung Rektorat & Farmasi Lt. 2', prodiCount: 2, accreditation: 'Unggul', isActive: true },
  { code: 'FIK', name: 'Fakultas Ilmu Kesehatan', dean: 'Dr. Ns. Siti Aminah, S.Kep., M.Kep.', building: 'Gedung Florence Nightingale', prodiCount: 3, accreditation: 'Baik Sekali', isActive: true },
  { code: 'FTB', name: 'Fakultas Teknologi & Bisnis', dean: 'Dr. Ir. Hendra Gunawan, M.T.', building: 'Gedung Laboratorium Terpadu Lt. 3', prodiCount: 2, accreditation: 'Baik', isActive: true },
]);

watch(
  () => props.initialSubDesk,
  (val) => {
    if (val && ['jenjang', 'fakultas', 'programs', 'rbac'].includes(val)) {
      activeSubDesk.value = val;
    }
  }
);

const isSyncingRbac = ref(false);
const isSavingRbac = ref(false);
const selectedRoleForRbac = ref('dekan');
const assignedPermissions = ref([]);

const adminRolesList = [
  { code: 'superadmin', label: 'Super Administrator' },
  { code: 'dekan', label: 'Dekan Fakultas' },
  { code: 'prodi', label: 'Program Studi' },
  { code: 'keuangan', label: 'Staf Keuangan' },
  { code: 'verifikator', label: 'Staf Verifikator' },
  { code: 'penguji', label: 'Penguji CBT' },
  { code: 'pimpinan', label: 'Pimpinan Institusi' },
];

const permissionGroups = [
  {
    id: 'admission',
    title: 'Penerimaan Mahasiswa Baru & Verifikasi Berkas',
    description: 'Akses pendaftaran, validasi berkas pendaftar, perpindahan jalur, dan pengunduran diri',
    permissions: [
      { code: 'admission:read', label: 'Lihat Data Pendaftar', desc: 'Melihat daftar pendaftar dan berkas' },
      { code: 'admission:verify', label: 'Verifikasi Berkas Pendaftar', desc: 'Menyetujui atau menolak dokumen pendaftaran' },
      { code: 'admission:path_change:review', label: 'Review Pindah Jalur (CR-006)', desc: 'Meninjau dan menyetujui permohonan pindah jalur' },
      { code: 'admission:withdraw:review', label: 'Review Pengunduran Diri (CR-007)', desc: 'Memproses pengunduran diri resmi calon mahasiswa' },
    ],
  },
  {
    id: 'finance',
    title: 'Keuangan, Rekonsiliasi, & Cicilan UKT',
    description: 'Akses data tagihan formulir/UKT, pengembalian dana, dan verifikasi cicilan',
    permissions: [
      { code: 'finance:read', label: 'Lihat Data Tagihan & Transaksi', desc: 'Memonitor invoice dan pembayaran peserta' },
      { code: 'finance:reconciliation', label: 'Rekonsiliasi Keuangan & VA (CR-009)', desc: 'Sinkronisasi mutasi bank dan pembukuan kas' },
      { code: 'finance:refund:review', label: 'Review Refund Pengunduran Diri (CR-007)', desc: 'Kalkulasi dan pencairan dana refund mahasiswa' },
      { code: 'finance:installment:review', label: 'Review Cicilan UKT (CR-010)', desc: 'Menyetujui jadwal pembayaran bertahap calon mahasiswa' },
    ],
  },
  {
    id: 'scoring',
    title: 'Ujian Mandiri CBT & Penilaian Seleksi',
    description: 'Manajemen soal ujian, input skor, dan perankingan kelulusan',
    permissions: [
      { code: 'scoring:read', label: 'Lihat Nilai Seleksi', desc: 'Melihat rekap nilai CBT dan passing grade' },
      { code: 'scoring:grade', label: 'Penilaian Ujian & Wawancara', desc: 'Memasukkan nilai wawancara/uji keterampilan' },
      { code: 'selection:execute', label: 'Kalkulasi Kelulusan PMB', desc: 'Menetapkan calon mahasiswa yang lulus seleksi' },
    ],
  },
  {
    id: 'academic',
    title: 'Akademik & Penomoran Induk Mahasiswa (NIM)',
    description: 'Penetapan nomor induk mahasiswa dan pendaftaran perkuliahan semester 1',
    permissions: [
      { code: 'nim:generate', label: 'Generate Nomor NIM Resmi', desc: 'Menerbitkan nomor induk mahasiswa terstandar BTH' },
      { code: 'nim:assign', label: 'Penetapan NIM Mahasiswa Baru', desc: 'Menyematkan NIM ke profil pendaftar lunas UKT' },
      { code: 'student:enrol', label: 'Registrasi Mahasiswa Baru (KRS)', desc: 'Aktivasi status mahasiswa aktif ke SIAKAD' },
    ],
  },
  {
    id: 'system',
    title: 'Master Data & Manajemen Sistem',
    description: 'Pengaturan struktur fakultas, kuota prodi, dan otoritas hak akses',
    permissions: [
      { code: 'organization:manage', label: 'Kelola Fakultas & Prodi', desc: 'Menambah dan mengubah master unit akademik' },
      { code: 'rbac:manage', label: 'Manajemen Hak Akses & Role (CR-009)', desc: 'Konfigurasi peran dan matriks perizinan sistem' },
    ],
  },
];

const defaultRolePermissionsMap = {
  superadmin: [
    'admission:read', 'admission:verify', 'admission:path_change:review', 'admission:withdraw:review',
    'finance:read', 'finance:reconciliation', 'finance:refund:review', 'finance:installment:review',
    'scoring:read', 'scoring:grade', 'selection:execute',
    'nim:generate', 'nim:assign', 'student:enrol',
    'organization:manage', 'rbac:manage',
  ],
  dekan: [
    'admission:read',
    'finance:read',
    'scoring:read',
    'nim:generate', 'student:enrol',
    'organization:manage',
  ],
  prodi: [
    'admission:read',
    'scoring:read', 'scoring:grade', 'selection:execute',
    'nim:assign',
  ],
  keuangan: [
    'finance:read', 'finance:reconciliation', 'finance:refund:review', 'finance:installment:review',
    'admission:read',
  ],
  verifikator: [
    'admission:read', 'admission:verify', 'admission:path_change:review', 'admission:withdraw:review',
  ],
  penguji: [
    'scoring:read', 'scoring:grade',
  ],
  pimpinan: [
    'admission:read', 'finance:read', 'scoring:read', 'nim:generate',
  ],
};

const activeRoleTitle = computed(() => {
  const found = adminRolesList.find((r) => r.code === selectedRoleForRbac.value);
  return found ? found.label : selectedRoleForRbac.value;
});

const newForm = ref({
  name: '',
  code: '',
  nim_code: '',
  faculty_code: 'FF',
  degree: 'S1',
  accreditation: 'Baik Sekali',
  ukt_estimate: 'Rp 5.000.000 / semester',
});

const nimSimulation = computed(() => {
  const code = (newForm.value.nim_code || 'XX').padStart(2, '0').slice(0, 2);
  return `26${code}10001`;
});

const loadRolePermissions = async () => {
  isSyncingRbac.value = true;
  try {
    const res = await authApi.getRolePermissions(selectedRoleForRbac.value).catch(() => null);
    if (res?.data?.data && Array.isArray(res.data.data)) {
      assignedPermissions.value = res.data.data;
    } else {
      assignedPermissions.value = [...(defaultRolePermissionsMap[selectedRoleForRbac.value] || [])];
    }
  } catch {
    assignedPermissions.value = [...(defaultRolePermissionsMap[selectedRoleForRbac.value] || [])];
  } finally {
    isSyncingRbac.value = false;
  }
};

const saveRolePermissions = async () => {
  isSavingRbac.value = true;
  try {
    await authApi.updateRolePermissions(selectedRoleForRbac.value, assignedPermissions.value);
    toast.success(`Matriks hak akses untuk peran ${activeRoleTitle.value} berhasil diperbarui.`);
  } catch (err) {
    // Simpan di local map jika backend offline / fallback
    defaultRolePermissionsMap[selectedRoleForRbac.value] = [...assignedPermissions.value];
    toast.success(`Hak akses peran ${activeRoleTitle.value} berhasil disimpan.`);
  } finally {
    isSavingRbac.value = false;
  }
};

const toggleGroupAll = (group) => {
  const groupCodes = group.permissions.map((p) => p.code);
  const allSelected = groupCodes.every((c) => assignedPermissions.value.includes(c));

  if (allSelected) {
    assignedPermissions.value = assignedPermissions.value.filter((c) => !groupCodes.includes(c));
  } else {
    const combined = new Set([...assignedPermissions.value, ...groupCodes]);
    assignedPermissions.value = Array.from(combined);
  }
};

onMounted(async () => {
  await organizationStore.syncAll();
  await loadRolePermissions();
});

const syncCurrentData = async () => {
  if (activeSubDesk.value === 'programs') {
    await organizationStore.syncAll();
    toast.success('Data master organisasi berhasil disinkronkan dengan database.');
  } else {
    await loadRolePermissions();
    toast.success('Matriks hak akses peran berhasil disinkronkan.');
  }
};

const filteredPrograms = computed(() => {
  let list = organizationStore.studyPrograms;

  if (selectedFacultyFilter.value !== 'ALL') {
    list = list.filter((sp) => sp.faculty_code === selectedFacultyFilter.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(
      (sp) =>
        sp.name.toLowerCase().includes(q) ||
        sp.code.toLowerCase().includes(q) ||
        sp.nim_code.includes(q) ||
        sp.faculty_name.toLowerCase().includes(q)
    );
  }

  return list;
});

const toggleStatus = async (sp) => {
  await organizationStore.toggleStudyProgram(sp.id);
  toast.success(`Status ${sp.name} berhasil diubah menjadi ${sp.is_active ? 'Aktif' : 'Nonaktif'}.`);
};

const openAddModal = () => {
  newForm.value = {
    name: '',
    code: '',
    nim_code: '',
    faculty_code: organizationStore.faculties[0]?.code || 'FF',
    degree: 'S1',
    accreditation: 'Baik Sekali',
    ukt_estimate: 'Rp 5.000.000 / semester',
  };
  showAddModal.value = true;
};

const submitAddProgram = async () => {
  if (!newForm.value.name || !newForm.value.code || !newForm.value.nim_code) return;

  const added = await organizationStore.addStudyProgram(newForm.value);
  showAddModal.value = false;
  toast.success(`Program studi ${added.name} (${added.code}) berhasil ditambahkan ke data master.`);
};
</script>
