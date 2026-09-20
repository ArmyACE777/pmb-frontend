<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-bth-blue selection:text-white">
    <!-- Top Institutional Navbar -->
    <header class="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-xs backdrop-blur-md bg-white/95">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <!-- Brand Info with Crest -->
        <div class="flex items-center gap-3.5">
          <div class="w-11 h-11 p-1 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs">
            <img src="/assets/icons/bth.png" alt="Logo Universitas BTH" class="h-8 w-8 object-contain" />
          </div>
          <div>
            <div class="font-sora font-extrabold text-slate-900 text-sm sm:text-base leading-snug tracking-tight">
              Universitas Bakti Tunas Husada
            </div>
            <div class="text-[11px] sm:text-xs text-bth-blue font-semibold flex items-center gap-1.5">
              <span>Portal Calon Mahasiswa Baru</span>
              <span class="text-slate-300">•</span>
              <span class="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono font-medium">TA 2026/2027</span>
            </div>
          </div>
        </div>

        <!-- Right Side: Helpdesk, Notifications & User Menu -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Switch to Admin Committee Portal Link -->
          <router-link
            to="/admin"
            class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#1E3A8A] hover:bg-blue-100 border border-blue-200/80 rounded-lg text-xs font-semibold font-sora transition-colors"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Portal Panitia PMB</span>
          </router-link>

          <!-- Quick WhatsApp Helpdesk Pill -->
          <a
            href="https://api.whatsapp.com/send?phone=6282117100200&text=Halo%20Helpdesk%20PMB%20BTH%2C%20saya%20ingin%20bertanya."
            target="_blank"
            rel="noopener noreferrer"
            class="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold font-sora transition-colors"
          >
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Helpdesk PMB</span>
          </a>

          <!-- Interactive Notification Bell Dropdown -->
          <div class="relative">
            <button
              @click="toggleNotifications"
              class="w-10 h-10 rounded-xl border border-slate-200 text-slate-600 hover:text-bth-navy hover:bg-slate-50 flex items-center justify-center relative transition-colors"
              aria-label="Pemberitahuan Pendaftaran"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <!-- Notification Dot -->
              <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">
                {{ unreadCount }}
              </span>
            </button>

            <!-- Notifications Dropdown Box -->
            <div
              v-if="showNotifications"
              class="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-fadeIn"
            >
              <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <span class="font-sora font-bold text-sm text-slate-800">Pengumuman Panitia PMB</span>
                <button @click="markAllAsRead" class="text-[11px] text-bth-blue hover:underline font-medium">
                  Tandai Dibaca
                </button>
              </div>
              <div class="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                <div
                  v-for="(notif, idx) in notifications"
                  :key="idx"
                  class="p-3 rounded-xl transition-colors"
                  :class="notif.isRead ? 'bg-slate-50/50' : 'bg-blue-50/60 border border-blue-100'"
                >
                  <div class="flex items-start justify-between gap-2">
                    <span class="font-sora font-semibold text-xs text-slate-800">{{ notif.title }}</span>
                    <span class="text-[10px] text-slate-400 whitespace-nowrap">{{ notif.time }}</span>
                  </div>
                  <p class="text-xs text-slate-600 mt-1 leading-relaxed">{{ notif.desc }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- User Profile Pill & Dropdown -->
          <div class="relative">
            <button
              @click="showProfileMenu = !showProfileMenu"
              class="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
            >
              <div class="w-8 h-8 rounded-lg bg-bth-navy text-white font-sora font-bold text-xs flex items-center justify-center shadow-xs">
                {{ userInitials }}
              </div>
              <div class="hidden sm:block">
                <div class="text-xs font-bold text-slate-900 font-sora truncate max-w-[130px] leading-tight">
                  {{ authStore.currentUser?.full_name || 'Calon Mahasiswa' }}
                </div>
                <div class="text-[10px] text-slate-400 truncate max-w-[130px]">
                  {{ authStore.currentUser?.email }}
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="showProfileMenu"
              class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-fadeIn"
            >
              <div class="px-3 py-2 border-b border-slate-100 sm:hidden">
                <div class="text-xs font-bold text-slate-900 font-sora">
                  {{ authStore.currentUser?.full_name }}
                </div>
                <div class="text-[10px] text-slate-400">
                  {{ authStore.currentUser?.email }}
                </div>
              </div>
              <div class="py-1">
                <button
                  @click="handleLogout"
                  class="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors font-sora"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Keluar dari Akun</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Body -->
    <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
      <slot />
    </main>

    <!-- Official BTH Institutional Footer -->
    <footer class="bg-white border-t border-slate-200/80 py-6 text-slate-500 text-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div class="flex items-center gap-3">
          <img src="/assets/icons/bth.png" alt="BTH" class="w-8 h-8 object-contain" />
          <div>
            <div class="font-sora font-bold text-slate-800 text-xs">Universitas Bakti Tunas Husada</div>
            <div class="text-[11px] text-slate-400">Gedung Rektorat & Sekretariat PMB • Jl. Cilolohan No. 36, Tasikmalaya 46115</div>
          </div>
        </div>
        <div class="text-[11px] text-slate-400 leading-relaxed font-sans">
          &copy; 2026 Panitia Penerimaan Mahasiswa Baru Universitas BTH. Seluruh Hak Dilindungi.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const showNotifications = ref(false);
const showProfileMenu = ref(false);

const notifications = ref([
  {
    title: 'Verifikasi Berkas Disetujui',
    desc: 'Dokumen Ijazah & Kartu Keluarga Anda telah diverifikasi valid oleh Panitia PMB.',
    time: 'Hari ini, 09:15',
    isRead: false,
  },
  {
    title: 'Jadwal Ujian CBT Diumumkan',
    desc: 'Simulasi dan ujian CBT online Gelombang 1 dijadwalkan pada hari Sabtu mendatang.',
    time: 'Kemarin',
    isRead: false,
  },
  {
    title: 'Pembayaran Formulir Berhasil',
    desc: 'Biaya pendaftaran Rp 250.000 telah lunas via Bank Syariah Indonesia (BSI).',
    time: '2 hari lalu',
    isRead: true,
  },
]);

const unreadCount = computed(() => notifications.value.filter((n) => !n.isRead).length);

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  if (showProfileMenu.value) showProfileMenu.value = false;
};

const markAllAsRead = () => {
  notifications.value.forEach((n) => (n.isRead = true));
};

const userInitials = computed(() => {
  const name = authStore.currentUser?.full_name || 'CM';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
});

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>
