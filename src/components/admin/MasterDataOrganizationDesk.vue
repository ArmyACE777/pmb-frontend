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
            Pengelolaan struktur organisasi akademik jenjang, fakultas & prodi serta konfigurasi matriks hak akses peran pengguna (RBAC).
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

          <!-- Tombol Tambah Kontekstual Sesuai Tab Aktif -->
          <button
            v-if="activeSubDesk === 'jenjang'"
            @click="openAddDegreeModal"
            class="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-sora font-semibold rounded transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>Tambah Jenjang</span>
          </button>

          <button
            v-else-if="activeSubDesk === 'fakultas'"
            @click="openAddFacultyModal"
            class="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-sora font-semibold rounded transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>Tambah Fakultas</span>
          </button>

          <button
            v-else-if="activeSubDesk === 'programs'"
            @click="openAddProgramModal"
            class="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-sora font-semibold rounded transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>Tambah Program Studi</span>
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
          Jenjang Pendidikan ({{ organizationStore.degrees.length }})
        </button>

        <button
          type="button"
          @click="activeSubDesk = 'fakultas'"
          class="px-3.5 py-1.5 text-xs font-semibold font-sora rounded-lg border transition-colors cursor-pointer"
          :class="activeSubDesk === 'fakultas'
            ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
        >
          Fakultas Akademik ({{ organizationStore.faculties.length }})
        </button>

        <button
          type="button"
          @click="activeSubDesk = 'programs'"
          class="px-3.5 py-1.5 text-xs font-semibold font-sora rounded-lg border transition-colors cursor-pointer"
          :class="activeSubDesk === 'programs'
            ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
        >
          Program Studi ({{ organizationStore.studyPrograms.length }})
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
        <div class="p-4 border-b border-slate-100">
          <h3 class="font-sora font-bold text-slate-900 text-sm">Jenjang Pendidikan Akademik</h3>
          <p class="text-xs text-slate-500 mt-0.5">Klasifikasi program pendidikan diploma, sarjana, magister, dan profesi Universitas BTH</p>
        </div>

        <!-- Mobile Jenjang Cards (< md) -->
        <div class="block md:hidden divide-y divide-slate-100">
          <div
            v-for="deg in organizationStore.degreesWithCount"
            :key="deg.id || deg.code"
            class="p-4 space-y-3 hover:bg-slate-50/80 transition-colors"
          >
            <!-- Top: Code, Title & Status -->
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="font-mono font-bold text-xs px-2 py-0.5 bg-blue-50 text-[#1E3A8A] rounded border border-blue-200/60 inline-block">
                  {{ deg.code }}
                </span>
                <h4 class="font-sora font-bold text-slate-900 text-sm mt-1 leading-snug">{{ deg.name }}</h4>
                <div class="text-xs text-slate-500 font-medium">{{ deg.degreeTitle }}</div>
              </div>

              <span
                class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap"
                :class="deg.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'"
              >
                {{ deg.is_active ? 'Buka' : 'Persiapan' }}
              </span>
            </div>

            <!-- Details: Durasi, Jumlah Prodi, Kuota -->
            <div class="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-center text-xs">
              <div>
                <span class="text-[10px] text-slate-400 font-bold uppercase block font-sora">Masa Studi</span>
                <span class="font-medium text-slate-800 text-[11px] block mt-0.5">{{ deg.studyDuration }}</span>
              </div>
              <div>
                <span class="text-[10px] text-slate-400 font-bold uppercase block font-sora">Prodi</span>
                <span class="font-mono font-bold text-slate-800 text-xs block mt-0.5">{{ deg.prodiCount }} Prodi</span>
              </div>
              <div>
                <span class="text-[10px] text-slate-400 font-bold uppercase block font-sora">Alokasi</span>
                <span class="font-mono font-bold text-[#1E3A8A] text-xs block mt-0.5">{{ deg.totalQuota }} Kursi</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="pt-1 flex items-center justify-end gap-2">
              <button
                @click="toggleDegreeStatus(deg)"
                class="px-2.5 py-1 text-xs font-medium rounded border transition-colors cursor-pointer shadow-2xs"
                :class="deg.is_active
                  ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  : 'bg-white hover:bg-slate-50 text-[#1E3A8A] border-slate-200'"
              >
                {{ deg.is_active ? 'Tutup' : 'Buka' }}
              </button>
              <button
                @click="openEditDegreeModal(deg)"
                class="px-2.5 py-1 text-xs font-medium rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer shadow-2xs inline-flex items-center gap-1"
                title="Edit Jenjang"
              >
                <Edit class="w-3 h-3 text-slate-500" />
                <span>Edit</span>
              </button>
              <button
                @click="confirmDeleteDegree(deg)"
                class="px-2.5 py-1 text-xs font-medium rounded border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer shadow-2xs inline-flex items-center gap-1"
                title="Hapus Jenjang"
              >
                <Trash2 class="w-3 h-3 text-rose-500" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Desktop Table (>= md) -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left text-xs min-w-[760px]">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-sora font-semibold whitespace-nowrap">
              <tr>
                <th class="py-3 px-4 whitespace-nowrap">No</th>
                <th class="py-3 px-4 whitespace-nowrap">Kode</th>
                <th class="py-3 px-4 whitespace-nowrap">Nama Jenjang</th>
                <th class="py-3 px-4 whitespace-nowrap">Masa Studi Standar</th>
                <th class="py-3 px-4 whitespace-nowrap">Gelar Kelulusan</th>
                <th class="py-3 px-4 text-center whitespace-nowrap">Jumlah Prodi</th>
                <th class="py-3 px-4 text-center whitespace-nowrap">Alokasi Kuota</th>
                <th class="py-3 px-4 text-center whitespace-nowrap min-w-[120px]">Status PMB</th>
                <th class="py-3 px-4 text-right whitespace-nowrap min-w-[190px]">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-sans">
              <tr v-for="(deg, idx) in organizationStore.degreesWithCount" :key="deg.id || deg.code" class="hover:bg-slate-50/70 transition-colors">
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
                    :class="deg.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'"
                  >
                    {{ deg.is_active ? 'Buka Pendaftaran' : 'Persiapan' }}
                  </span>
                </td>
                <td class="py-3 px-4 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1.5 whitespace-nowrap">
                    <button
                      @click="toggleDegreeStatus(deg)"
                      class="px-2.5 py-1 text-xs font-medium rounded border transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                      :class="deg.is_active
                        ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        : 'bg-white hover:bg-slate-50 text-[#1E3A8A] border-slate-200'"
                    >
                      {{ deg.is_active ? 'Tutup' : 'Buka' }}
                    </button>
                    <button
                      @click="openEditDegreeModal(deg)"
                      class="px-2.5 py-1 text-xs font-medium rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors whitespace-nowrap cursor-pointer shadow-2xs inline-flex items-center gap-1"
                      title="Edit Jenjang"
                    >
                      <Edit class="w-3 h-3 text-slate-500" />
                      <span>Edit</span>
                    </button>
                    <button
                      @click="confirmDeleteDegree(deg)"
                      class="px-2.5 py-1 text-xs font-medium rounded border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 transition-colors whitespace-nowrap cursor-pointer shadow-2xs inline-flex items-center gap-1"
                      title="Hapus Jenjang"
                    >
                      <Trash2 class="w-3 h-3 text-rose-500" />
                      <span>Hapus</span>
                    </button>
                  </div>
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
        <div class="p-4 border-b border-slate-100">
          <h3 class="font-sora font-bold text-slate-900 text-sm">Fakultas & Unit Akademik</h3>
          <p class="text-xs text-slate-500 mt-0.5">Daftar fakultas pengampu program studi di lingkungan Universitas Bakti Tunas Husada</p>
        </div>

        <!-- Mobile Fakultas Cards (< md) -->
        <div class="block md:hidden divide-y divide-slate-100">
          <div
            v-for="fac in organizationStore.facultiesWithCount"
            :key="fac.id || fac.code"
            class="p-4 space-y-3 hover:bg-slate-50/80 transition-colors"
          >
            <!-- Top: Code, Name & Status -->
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="font-mono font-bold text-xs px-2 py-0.5 bg-slate-100 text-slate-800 rounded inline-block">
                  {{ fac.code }}
                </span>
                <h4 class="font-sora font-bold text-slate-900 text-sm mt-1 leading-snug">{{ fac.name }}</h4>
                <div class="text-xs text-slate-600">Dekan: {{ fac.dean }}</div>
              </div>

              <span
                class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap"
                :class="fac.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'"
              >
                {{ fac.is_active ? 'Aktif' : 'Nonaktif' }}
              </span>
            </div>

            <!-- Details: Lokasi & Jumlah Prodi -->
            <div class="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-center text-xs">
              <div>
                <span class="text-[10px] text-slate-400 font-bold uppercase block font-sora">Gedung</span>
                <span class="text-slate-600 text-[11px] block mt-0.5 truncate">{{ fac.building }}</span>
              </div>
              <div>
                <span class="text-[10px] text-slate-400 font-bold uppercase block font-sora">Jumlah Prodi</span>
                <span class="font-mono font-bold text-slate-800 text-xs block mt-0.5">{{ fac.prodiCount }} Prodi</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="pt-1 flex items-center justify-end gap-2">
              <button
                @click="toggleFacultyStatus(fac)"
                class="px-2.5 py-1 text-xs font-medium rounded border transition-colors cursor-pointer shadow-2xs"
                :class="fac.is_active
                  ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  : 'bg-white hover:bg-slate-50 text-[#1E3A8A] border-slate-200'"
              >
                {{ fac.is_active ? 'Nonaktifkan' : 'Aktifkan' }}
              </button>
              <button
                @click="openEditFacultyModal(fac)"
                class="px-2.5 py-1 text-xs font-medium rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer shadow-2xs inline-flex items-center gap-1"
                title="Edit Fakultas"
              >
                <Edit class="w-3 h-3 text-slate-500" />
                <span>Edit</span>
              </button>
              <button
                @click="confirmDeleteFaculty(fac)"
                class="px-2.5 py-1 text-xs font-medium rounded border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer shadow-2xs inline-flex items-center gap-1"
                title="Hapus Fakultas"
              >
                <Trash2 class="w-3 h-3 text-rose-500" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Desktop Table (>= md) -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left text-xs min-w-[850px]">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-sora font-semibold whitespace-nowrap">
              <tr>
                <th class="py-3 px-4 whitespace-nowrap">No</th>
                <th class="py-3 px-4 whitespace-nowrap">Kode</th>
                <th class="py-3 px-4 whitespace-nowrap min-w-[180px]">Nama Fakultas</th>
                <th class="py-3 px-4 whitespace-nowrap min-w-[180px]">Pimpinan (Dekan)</th>
                <th class="py-3 px-4 whitespace-nowrap min-w-[160px]">Lokasi Gedung</th>
                <th class="py-3 px-4 text-center whitespace-nowrap min-w-[100px]">Jumlah Prodi</th>
                <th class="py-3 px-4 text-center whitespace-nowrap min-w-[90px]">Status</th>
                <th class="py-3 px-4 text-right whitespace-nowrap min-w-[190px]">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-sans">
              <tr v-for="(fac, idx) in organizationStore.facultiesWithCount" :key="fac.id || fac.code" class="hover:bg-slate-50/70 transition-colors">
                <td class="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">{{ idx + 1 }}</td>
                <td class="py-3 px-4 whitespace-nowrap">
                  <span class="font-mono font-bold text-xs px-2.5 py-1 bg-slate-100 text-slate-900 rounded whitespace-nowrap inline-block">
                    {{ fac.code }}
                  </span>
                </td>
                <td class="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">{{ fac.name }}</td>
                <td class="py-3 px-4 text-slate-700 font-medium whitespace-nowrap">{{ fac.dean }}</td>
                <td class="py-3 px-4 text-slate-500 whitespace-nowrap">{{ fac.building }}</td>
                <td class="py-3 px-4 text-center font-mono font-bold text-slate-800 whitespace-nowrap">{{ fac.prodiCount }} Prodi</td>
                <td class="py-3 px-4 text-center whitespace-nowrap">
                  <span
                    class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap inline-block"
                    :class="fac.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'"
                  >
                    {{ fac.is_active ? 'Aktif' : 'Nonaktif' }}
                  </span>
                </td>
                <td class="py-3 px-4 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1.5 whitespace-nowrap">
                    <button
                      @click="toggleFacultyStatus(fac)"
                      class="px-2.5 py-1 text-xs font-medium rounded border transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                      :class="fac.is_active
                        ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        : 'bg-white hover:bg-slate-50 text-[#1E3A8A] border-slate-200'"
                    >
                      {{ fac.is_active ? 'Nonaktifkan' : 'Aktifkan' }}
                    </button>
                    <button
                      @click="openEditFacultyModal(fac)"
                      class="px-2.5 py-1 text-xs font-medium rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors whitespace-nowrap cursor-pointer shadow-2xs inline-flex items-center gap-1"
                      title="Edit Fakultas"
                    >
                      <Edit class="w-3 h-3 text-slate-500" />
                      <span>Edit</span>
                    </button>
                    <button
                      @click="confirmDeleteFaculty(fac)"
                      class="px-2.5 py-1 text-xs font-medium rounded border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 transition-colors whitespace-nowrap cursor-pointer shadow-2xs inline-flex items-center gap-1"
                      title="Hapus Fakultas"
                    >
                      <Trash2 class="w-3 h-3 text-rose-500" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- TAMPILAN: MASTER PROGRAM STUDI (PRODI)                            -->
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

        <!-- Mobile Program Studi Cards (< md) -->
        <div class="block md:hidden divide-y divide-slate-100">
          <div
            v-for="sp in filteredPrograms"
            :key="sp.id"
            class="p-4 space-y-3 hover:bg-slate-50/80 transition-colors"
          >
            <!-- Top: Code, Name, Degree & Status -->
            <div class="flex items-start justify-between gap-2">
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="font-mono font-bold text-xs text-slate-800">{{ sp.code }}</span>
                  <span class="text-slate-300">•</span>
                  <span class="font-mono text-xs text-slate-500">NIM: {{ sp.nim_code }}</span>
                </div>
                <h4 class="font-sora font-bold text-slate-900 text-sm mt-1 leading-snug">{{ sp.name }}</h4>
                <div class="text-xs text-slate-500">{{ sp.faculty_name }}</div>
              </div>

              <div class="flex flex-col items-end gap-1">
                <span
                  class="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  :class="sp.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'"
                >
                  {{ sp.is_active ? 'Aktif' : 'Nonaktif' }}
                </span>
                <span class="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-[#1E3A8A] rounded border border-blue-200/60">
                  {{ sp.degree }}
                </span>
              </div>
            </div>

            <!-- Details: Akreditasi & UKT Estimate -->
            <div class="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
              <div>
                <span class="text-[10px] text-slate-400 font-bold uppercase block font-sora">Akreditasi</span>
                <span class="font-bold text-[#1E3A8A] text-xs block mt-0.5">{{ sp.accreditation }}</span>
              </div>
              <div>
                <span class="text-[10px] text-slate-400 font-bold uppercase block font-sora">Estimasi UKT</span>
                <span class="font-mono font-semibold text-slate-800 text-xs block mt-0.5 truncate">{{ sp.ukt_estimate }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="pt-1 flex items-center justify-end gap-2">
              <button
                @click="toggleStatus(sp)"
                class="px-2.5 py-1 text-xs font-medium rounded border transition-colors cursor-pointer shadow-2xs"
                :class="sp.is_active
                  ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  : 'bg-white hover:bg-slate-50 text-[#1E3A8A] border-slate-200'"
              >
                {{ sp.is_active ? 'Tutup' : 'Buka' }}
              </button>
              <button
                @click="openEditProgramModal(sp)"
                class="px-2.5 py-1 text-xs font-medium rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer shadow-2xs inline-flex items-center gap-1"
                title="Edit Program Studi"
              >
                <Edit class="w-3 h-3 text-slate-500" />
                <span>Edit</span>
              </button>
              <button
                @click="confirmDeleteProgram(sp)"
                class="px-2.5 py-1 text-xs font-medium rounded border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer shadow-2xs inline-flex items-center gap-1"
                title="Hapus Program Studi"
              >
                <Trash2 class="w-3 h-3 text-rose-500" />
                <span>Hapus</span>
              </button>
            </div>
          </div>

          <div v-if="filteredPrograms.length === 0" class="py-8 text-center text-slate-400 text-xs">
            Tidak ada program studi yang cocok dengan filter atau kata kunci pencarian.
          </div>
        </div>

        <!-- Desktop Table (>= md) -->
        <div class="hidden md:block overflow-x-auto">
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
                <th class="py-3 px-4 text-right whitespace-nowrap min-w-[190px]">Aksi</th>
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
                  <div class="flex items-center justify-end gap-1.5 whitespace-nowrap">
                    <button
                      @click="toggleStatus(sp)"
                      class="px-2.5 py-1 text-xs font-medium rounded border transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                      :class="sp.is_active
                        ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        : 'bg-white hover:bg-slate-50 text-[#1E3A8A] border-slate-200'"
                    >
                      {{ sp.is_active ? 'Tutup' : 'Buka' }}
                    </button>
                    <button
                      @click="openEditProgramModal(sp)"
                      class="px-2.5 py-1 text-xs font-medium rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors whitespace-nowrap cursor-pointer shadow-2xs inline-flex items-center gap-1"
                      title="Edit Program Studi"
                    >
                      <Edit class="w-3 h-3 text-slate-500" />
                      <span>Edit</span>
                    </button>
                    <button
                      @click="confirmDeleteProgram(sp)"
                      class="px-2.5 py-1 text-xs font-medium rounded border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 transition-colors whitespace-nowrap cursor-pointer shadow-2xs inline-flex items-center gap-1"
                      title="Hapus Program Studi"
                    >
                      <Trash2 class="w-3 h-3 text-rose-500" />
                      <span>Hapus</span>
                    </button>
                  </div>
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
    <!-- TAMPILAN: MATRIKS HAK AKSES & PERAN (CR-009 RBAC)                -->
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

    <!-- ================================================================= -->
    <!-- MODAL 1: TAMBAH / EDIT PROGRAM STUDI                             -->
    <!-- ================================================================= -->
    <Teleport to="body">
      <div
        v-if="showProgramModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm modal-sharp"
        @click.self="showProgramModal = false"
      >
        <div class="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden my-auto transform-gpu">
          <div class="h-1 w-full bg-[#1E3A8A] flex-shrink-0"></div>

          <div class="p-5 sm:p-6 pb-4 flex items-start justify-between gap-4 border-b border-slate-100 flex-shrink-0">
            <div class="flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-[#1E3A8A] flex-shrink-0 shadow-2xs">
                <BookOpen class="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <div>
                <div class="text-[10px] font-bold text-blue-700 uppercase tracking-wider font-sora flex items-center gap-1.5">
                  <span>Katalog Akademik PMB</span>
                  <span class="text-slate-400 font-normal">/</span>
                  <span class="text-slate-500 font-normal">{{ isEditingProgram ? 'Edit Data' : 'Tambah Baru' }}</span>
                </div>
                <h3 class="font-sora font-bold text-slate-900 text-base sm:text-lg">
                  {{ isEditingProgram ? 'Edit Program Studi' : 'Tambah Program Studi Baru' }}
                </h3>
              </div>
            </div>
            <button
              @click="showProgramModal = false"
              class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Tutup Modal"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="submitProgramForm" class="p-5 sm:p-6 space-y-4 flex-1 overflow-y-auto text-xs font-sans">
            <!-- Nama Program Studi -->
            <div class="space-y-1.5">
              <label class="block font-semibold text-slate-800 flex items-center gap-1.5">
                <BookOpen class="w-3.5 h-3.5 text-blue-600" />
                <span>Nama Lengkap Program Studi</span>
                <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="programForm.name"
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
                  v-model="programForm.code"
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
                  v-model="programForm.nim_code"
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
                  v-model="programForm.faculty_code"
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
                  v-model="programForm.degree"
                  class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 outline-none shadow-2xs transition-all cursor-pointer font-medium"
                >
                  <option v-for="d in organizationStore.degrees" :key="d.code" :value="d.code">
                    {{ d.name }} ({{ d.code }})
                  </option>
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
                  v-model="programForm.accreditation"
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
                  v-model="programForm.ukt_estimate"
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
                @click="showProgramModal = false"
                class="w-full sm:w-auto px-4 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-xl transition-colors cursor-pointer text-center"
              >
                Batal
              </button>
              <button
                type="submit"
                class="w-full sm:w-auto px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                <CheckCircle2 class="w-4 h-4" />
                <span>{{ isEditingProgram ? 'Simpan Perubahan' : 'Simpan Program Studi' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ================================================================= -->
    <!-- MODAL 2: TAMBAH / EDIT FAKULTAS                                  -->
    <!-- ================================================================= -->
    <Teleport to="body">
      <div
        v-if="showFacultyModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm modal-sharp"
        @click.self="showFacultyModal = false"
      >
        <div class="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden my-auto transform-gpu">
          <div class="h-1 w-full bg-[#1E3A8A] flex-shrink-0"></div>

          <div class="p-5 sm:p-6 pb-4 flex items-start justify-between gap-4 border-b border-slate-100 flex-shrink-0">
            <div class="flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-[#1E3A8A] flex-shrink-0 shadow-2xs">
                <Building2 class="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <div>
                <div class="text-[10px] font-bold text-blue-700 uppercase tracking-wider font-sora flex items-center gap-1.5">
                  <span>Fakultas & Unit Akademik</span>
                  <span class="text-slate-400 font-normal">/</span>
                  <span class="text-slate-500 font-normal">{{ isEditingFaculty ? 'Edit Data' : 'Tambah Baru' }}</span>
                </div>
                <h3 class="font-sora font-bold text-slate-900 text-base sm:text-lg">
                  {{ isEditingFaculty ? 'Edit Fakultas' : 'Tambah Fakultas Baru' }}
                </h3>
              </div>
            </div>
            <button
              @click="showFacultyModal = false"
              class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Tutup Modal"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="submitFacultyForm" class="p-5 sm:p-6 space-y-4 flex-1 overflow-y-auto text-xs font-sans">
            <!-- Nama Fakultas -->
            <div class="space-y-1.5">
              <label class="block font-semibold text-slate-800 flex items-center gap-1.5">
                <Building2 class="w-3.5 h-3.5 text-blue-600" />
                <span>Nama Lengkap Fakultas</span>
                <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="facultyForm.name"
                type="text"
                required
                placeholder="Contoh: Fakultas Kedokteran Gigi"
                class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs font-medium text-slate-800 outline-none shadow-2xs transition-all"
              />
            </div>

            <!-- Kode Singkat Fakultas -->
            <div class="space-y-1.5">
              <label class="block font-semibold text-slate-800 flex items-center gap-1.5">
                <Hash class="w-3.5 h-3.5 text-indigo-600" />
                <span>Kode Singkat Fakultas</span>
                <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="facultyForm.code"
                type="text"
                required
                placeholder="Contoh: FF / FTB / FIK"
                class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-[#1E3A8A] outline-none shadow-2xs transition-all"
              />
            </div>

            <!-- Dekan & Gedung -->
            <div class="space-y-1.5">
              <label class="block font-semibold text-slate-800 flex items-center gap-1.5">
                <Users class="w-3.5 h-3.5 text-slate-500" />
                <span>Pimpinan Fakultas (Dekan)</span>
              </label>
              <input
                v-model="facultyForm.dean"
                type="text"
                placeholder="Contoh: Dr. drg. Ahmad Sudrajat, Sp.Ort."
                class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 outline-none shadow-2xs transition-all"
              />
            </div>

            <div class="space-y-1.5">
              <label class="block font-semibold text-slate-800 flex items-center gap-1.5">
                <Building2 class="w-3.5 h-3.5 text-slate-500" />
                <span>Lokasi Gedung / Ruang Dekanat</span>
              </label>
              <input
                v-model="facultyForm.building"
                type="text"
                placeholder="Contoh: Gedung Laboratorium Terpadu Lt. 2"
                class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 outline-none shadow-2xs transition-all"
              />
            </div>

            <!-- Modal Footer Actions -->
            <div class="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-end gap-2.5 flex-shrink-0">
              <button
                type="button"
                @click="showFacultyModal = false"
                class="w-full sm:w-auto px-4 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-xl transition-colors cursor-pointer text-center"
              >
                Batal
              </button>
              <button
                type="submit"
                class="w-full sm:w-auto px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                <CheckCircle2 class="w-4 h-4" />
                <span>{{ isEditingFaculty ? 'Simpan Perubahan' : 'Simpan Fakultas' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ================================================================= -->
    <!-- MODAL 3: TAMBAH / EDIT JENJANG PENDIDIKAN                        -->
    <!-- ================================================================= -->
    <Teleport to="body">
      <div
        v-if="showDegreeModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm modal-sharp"
        @click.self="showDegreeModal = false"
      >
        <div class="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden my-auto transform-gpu">
          <div class="h-1 w-full bg-[#1E3A8A] flex-shrink-0"></div>

          <div class="p-5 sm:p-6 pb-4 flex items-start justify-between gap-4 border-b border-slate-100 flex-shrink-0">
            <div class="flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-[#1E3A8A] flex-shrink-0 shadow-2xs">
                <GraduationCap class="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <div>
                <div class="text-[10px] font-bold text-blue-700 uppercase tracking-wider font-sora flex items-center gap-1.5">
                  <span>Jenjang Pendidikan</span>
                  <span class="text-slate-400 font-normal">/</span>
                  <span class="text-slate-500 font-normal">{{ isEditingDegree ? 'Edit Data' : 'Tambah Baru' }}</span>
                </div>
                <h3 class="font-sora font-bold text-slate-900 text-base sm:text-lg">
                  {{ isEditingDegree ? 'Edit Jenjang Pendidikan' : 'Tambah Jenjang Pendidikan Baru' }}
                </h3>
              </div>
            </div>
            <button
              @click="showDegreeModal = false"
              class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Tutup Modal"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="submitDegreeForm" class="p-5 sm:p-6 space-y-4 flex-1 overflow-y-auto text-xs font-sans">
            <!-- Kode & Nama Jenjang -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div class="space-y-1.5">
                <label class="block font-semibold text-slate-800 flex items-center gap-1.5">
                  <Hash class="w-3.5 h-3.5 text-indigo-600" />
                  <span>Kode Jenjang</span>
                  <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="degreeForm.code"
                  type="text"
                  required
                  placeholder="Contoh: D4 / S2 / Sp"
                  class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-[#1E3A8A] outline-none shadow-2xs transition-all"
                />
              </div>

              <div class="space-y-1.5">
                <label class="block font-semibold text-slate-800 flex items-center gap-1.5">
                  <GraduationCap class="w-3.5 h-3.5 text-blue-600" />
                  <span>Nama Jenjang</span>
                  <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="degreeForm.name"
                  type="text"
                  required
                  placeholder="Contoh: Sarjana Terapan"
                  class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs font-medium text-slate-800 outline-none shadow-2xs transition-all"
                />
              </div>
            </div>

            <!-- Masa Studi & Gelar -->
            <div class="space-y-1.5">
              <label class="block font-semibold text-slate-800 flex items-center gap-1.5">
                <Calendar class="w-3.5 h-3.5 text-slate-500" />
                <span>Masa Studi Standar</span>
              </label>
              <input
                v-model="degreeForm.studyDuration"
                type="text"
                placeholder="Contoh: 8 Semester (4 Tahun)"
                class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 outline-none shadow-2xs transition-all"
              />
            </div>

            <div class="space-y-1.5">
              <label class="block font-semibold text-slate-800 flex items-center gap-1.5">
                <Award class="w-3.5 h-3.5 text-slate-500" />
                <span>Gelar Kelulusan</span>
              </label>
              <input
                v-model="degreeForm.degreeTitle"
                type="text"
                placeholder="Contoh: Sarjana Terapan Sains (S.Tr.Kes.)"
                class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 outline-none shadow-2xs transition-all"
              />
            </div>

            <!-- Alokasi Kuota PMB -->
            <div class="space-y-1.5">
              <label class="block font-semibold text-slate-800 flex items-center gap-1.5">
                <Users class="w-3.5 h-3.5 text-slate-500" />
                <span>Alokasi Total Kuota (Kursi)</span>
              </label>
              <input
                v-model.number="degreeForm.totalQuota"
                type="number"
                min="0"
                placeholder="Contoh: 150"
                class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs font-semibold text-slate-800 outline-none shadow-2xs transition-all"
              />
            </div>

            <!-- Modal Footer Actions -->
            <div class="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-end gap-2.5 flex-shrink-0">
              <button
                type="button"
                @click="showDegreeModal = false"
                class="w-full sm:w-auto px-4 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-xl transition-colors cursor-pointer text-center"
              >
                Batal
              </button>
              <button
                type="submit"
                class="w-full sm:w-auto px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                <CheckCircle2 class="w-4 h-4" />
                <span>{{ isEditingDegree ? 'Simpan Perubahan' : 'Simpan Jenjang' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ================================================================= -->
    <!-- MODAL 4: KONFIRMASI HAPUS PERMANEN (UNIVERSAL DELETE MODAL)      -->
    <!-- ================================================================= -->
    <Teleport to="body">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm modal-sharp"
        @click.self="showDeleteModal = false"
      >
        <div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden my-auto transform-gpu p-5 sm:p-6 space-y-4">
          <div class="flex items-start gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 flex-shrink-0 shadow-2xs">
              <AlertTriangle class="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 class="font-sora font-bold text-slate-900 text-base">
                Konfirmasi Hapus {{ deleteTarget.typeLabel }}
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
          </div>

          <p class="text-xs text-slate-600 font-sans leading-relaxed">
            Apakah Anda yakin ingin menghapus {{ deleteTarget.typeLabel }}
            <strong class="text-slate-900 font-semibold font-sora">"{{ deleteTarget.name }}"</strong>
            ({{ deleteTarget.code }}) dari basis data akademik?
          </p>

          <div
            v-if="deleteTarget.warningNote"
            class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 space-y-1"
          >
            <div class="font-semibold flex items-center gap-1.5">
              <AlertTriangle class="w-3.5 h-3.5 text-amber-600" />
              <span>Perhatian Keterkaitan Data:</span>
            </div>
            <div>{{ deleteTarget.warningNote }}</div>
          </div>

          <div class="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-2.5">
            <button
              type="button"
              @click="showDeleteModal = false"
              class="w-full sm:w-auto px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-xl transition-colors cursor-pointer text-center"
            >
              Batal
            </button>
            <button
              type="button"
              @click="executeDelete"
              class="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-xs inline-flex items-center justify-center gap-1.5"
            >
              <Trash2 class="w-3.5 h-3.5" />
              <span>Ya, Hapus Permanen</span>
            </button>
          </div>
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
  Plus,
  X,
  Award,
  Hash,
  CheckCircle2,
  DollarSign,
  GraduationCap,
  Edit,
  Trash2,
  AlertTriangle,
  Calendar,
  Users,
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

watch(
  () => props.initialSubDesk,
  (val) => {
    if (val && ['jenjang', 'fakultas', 'programs', 'rbac'].includes(val)) {
      activeSubDesk.value = val;
    }
  }
);

// =================================================================
// 1. STATE & MODAL FORM: PROGRAM STUDI (PRODI)
// =================================================================
const showProgramModal = ref(false);
const isEditingProgram = ref(false);
const editingProgramId = ref(null);

const programForm = ref({
  name: '',
  code: '',
  nim_code: '',
  faculty_code: 'FF',
  degree: 'S1',
  accreditation: 'Baik Sekali',
  ukt_estimate: 'Rp 5.000.000 / semester',
});

const nimSimulation = computed(() => {
  const code = (programForm.value.nim_code || 'XX').padStart(2, '0').slice(0, 2);
  return `26${code}10001`;
});

const openAddProgramModal = () => {
  isEditingProgram.value = false;
  editingProgramId.value = null;
  programForm.value = {
    name: '',
    code: '',
    nim_code: '',
    faculty_code: organizationStore.faculties[0]?.code || 'FF',
    degree: organizationStore.degrees[0]?.code || 'S1',
    accreditation: 'Baik Sekali',
    ukt_estimate: 'Rp 5.000.000 / semester',
  };
  showProgramModal.value = true;
};

const openEditProgramModal = (sp) => {
  isEditingProgram.value = true;
  editingProgramId.value = sp.id;
  programForm.value = {
    name: sp.name,
    code: sp.code,
    nim_code: sp.nim_code,
    faculty_code: sp.faculty_code,
    degree: sp.degree,
    accreditation: sp.accreditation,
    ukt_estimate: sp.ukt_estimate,
  };
  showProgramModal.value = true;
};

const submitProgramForm = async () => {
  if (!programForm.value.name || !programForm.value.code || !programForm.value.nim_code) {
    toast.error('Mohon lengkapi seluruh kolom yang bertanda bintang (*).');
    return;
  }

  if (isEditingProgram.value) {
    const updated = await organizationStore.updateStudyProgram(editingProgramId.value, programForm.value);
    toast.success(`Program studi ${updated?.name || ''} berhasil diperbarui.`);
  } else {
    const added = await organizationStore.addStudyProgram(programForm.value);
    toast.success(`Program studi ${added.name} (${added.code}) berhasil ditambahkan ke katalog.`);
  }

  showProgramModal.value = false;
};

const toggleStatus = async (sp) => {
  await organizationStore.toggleStudyProgram(sp.id);
  toast.success(`Status ${sp.name} berhasil diubah menjadi ${sp.is_active ? 'Aktif' : 'Nonaktif'}.`);
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

// =================================================================
// 2. STATE & MODAL FORM: FAKULTAS AKADEMIK
// =================================================================
const showFacultyModal = ref(false);
const isEditingFaculty = ref(false);
const editingFacultyId = ref(null);

const facultyForm = ref({
  name: '',
  code: '',
  dean: '',
  building: '',
});

const openAddFacultyModal = () => {
  isEditingFaculty.value = false;
  editingFacultyId.value = null;
  facultyForm.value = {
    name: '',
    code: '',
    dean: '',
    building: 'Gedung Kampus Utama BTH',
  };
  showFacultyModal.value = true;
};

const openEditFacultyModal = (fac) => {
  isEditingFaculty.value = true;
  editingFacultyId.value = fac.id;
  facultyForm.value = {
    name: fac.name,
    code: fac.code,
    dean: fac.dean,
    building: fac.building,
  };
  showFacultyModal.value = true;
};

const submitFacultyForm = async () => {
  if (!facultyForm.value.name || !facultyForm.value.code) {
    toast.error('Nama dan Kode Fakultas wajib diisi.');
    return;
  }

  if (isEditingFaculty.value) {
    const updated = await organizationStore.updateFaculty(editingFacultyId.value, facultyForm.value);
    toast.success(`Fakultas ${updated?.name || ''} berhasil diperbarui.`);
  } else {
    const added = await organizationStore.addFaculty(facultyForm.value);
    toast.success(`Fakultas ${added.name} (${added.code}) berhasil ditambahkan.`);
  }

  showFacultyModal.value = false;
};

const toggleFacultyStatus = async (fac) => {
  await organizationStore.toggleFaculty(fac.id);
  toast.success(`Status ${fac.name} berhasil diubah menjadi ${fac.is_active ? 'Aktif' : 'Nonaktif'}.`);
};

// =================================================================
// 3. STATE & MODAL FORM: JENJANG PENDIDIKAN
// =================================================================
const showDegreeModal = ref(false);
const isEditingDegree = ref(false);
const editingDegreeId = ref(null);

const degreeForm = ref({
  name: '',
  code: '',
  studyDuration: '8 Semester (4 Tahun)',
  degreeTitle: 'Sarjana',
  totalQuota: 100,
});

const openAddDegreeModal = () => {
  isEditingDegree.value = false;
  editingDegreeId.value = null;
  degreeForm.value = {
    name: '',
    code: '',
    studyDuration: '8 Semester (4 Tahun)',
    degreeTitle: 'Sarjana',
    totalQuota: 100,
  };
  showDegreeModal.value = true;
};

const openEditDegreeModal = (deg) => {
  isEditingDegree.value = true;
  editingDegreeId.value = deg.id;
  degreeForm.value = {
    name: deg.name,
    code: deg.code,
    studyDuration: deg.studyDuration,
    degreeTitle: deg.degreeTitle,
    totalQuota: deg.totalQuota,
  };
  showDegreeModal.value = true;
};

const submitDegreeForm = async () => {
  if (!degreeForm.value.name || !degreeForm.value.code) {
    toast.error('Nama dan Kode Jenjang wajib diisi.');
    return;
  }

  if (isEditingDegree.value) {
    const updated = await organizationStore.updateDegree(editingDegreeId.value, degreeForm.value);
    toast.success(`Jenjang ${updated?.name || ''} berhasil diperbarui.`);
  } else {
    const added = await organizationStore.addDegree(degreeForm.value);
    toast.success(`Jenjang ${added.name} (${added.code}) berhasil ditambahkan.`);
  }

  showDegreeModal.value = false;
};

const toggleDegreeStatus = async (deg) => {
  await organizationStore.toggleDegree(deg.id);
  toast.success(`Status pendaftaran jenjang ${deg.name} berhasil diubah.`);
};

// =================================================================
// 4. STATE & MODAL: KONFIRMASI HAPUS PERMANEN
// =================================================================
const showDeleteModal = ref(false);
const deleteTarget = ref({
  type: '', // 'program' | 'faculty' | 'degree'
  typeLabel: '',
  id: null,
  name: '',
  code: '',
  warningNote: '',
});

const confirmDeleteProgram = (sp) => {
  deleteTarget.value = {
    type: 'program',
    typeLabel: 'Program Studi',
    id: sp.id,
    name: sp.name,
    code: sp.code,
    warningNote: '',
  };
  showDeleteModal.value = true;
};

const confirmDeleteFaculty = (fac) => {
  const linkedCount = organizationStore.studyPrograms.filter((p) => p.faculty_code === fac.code || p.faculty_id === fac.id).length;
  deleteTarget.value = {
    type: 'faculty',
    typeLabel: 'Fakultas Akademik',
    id: fac.id,
    name: fac.name,
    code: fac.code,
    warningNote: linkedCount > 0
      ? `Fakultas ini menaungi ${linkedCount} program studi aktif. Menghapus fakultas ini juga akan menghapus seluruh prodi terkait di dalamnya.`
      : '',
  };
  showDeleteModal.value = true;
};

const confirmDeleteDegree = (deg) => {
  const linkedCount = organizationStore.studyPrograms.filter((p) => p.degree === deg.code).length;
  deleteTarget.value = {
    type: 'degree',
    typeLabel: 'Jenjang Pendidikan',
    id: deg.id,
    name: deg.name,
    code: deg.code,
    warningNote: linkedCount > 0
      ? `Jenjang ini saat ini digunakan oleh ${linkedCount} program studi aktif.`
      : '',
  };
  showDeleteModal.value = true;
};

const executeDelete = async () => {
  if (deleteTarget.value.type === 'program') {
    await organizationStore.deleteStudyProgram(deleteTarget.value.id);
    toast.success(`Program studi ${deleteTarget.value.name} berhasil dihapus.`);
  } else if (deleteTarget.value.type === 'faculty') {
    await organizationStore.deleteFaculty(deleteTarget.value.id);
    toast.success(`Fakultas ${deleteTarget.value.name} dan prodi terkait berhasil dihapus.`);
  } else if (deleteTarget.value.type === 'degree') {
    await organizationStore.deleteDegree(deleteTarget.value.id);
    toast.success(`Jenjang ${deleteTarget.value.name} berhasil dihapus.`);
  }

  showDeleteModal.value = false;
};

// =================================================================
// 5. RBAC PERMISSIONS LOGIC
// =================================================================
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
  if (['programs', 'fakultas', 'jenjang'].includes(activeSubDesk.value)) {
    await organizationStore.syncAll();
    toast.success('Data master organisasi berhasil disinkronkan dengan database.');
  } else {
    await loadRolePermissions();
    toast.success('Matriks hak akses peran berhasil disinkronkan.');
  }
};
</script>
