import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/main.css';

const CLEANUP_KEY = 'bth_storage_cleaned_v20261021_fix_admin';
try {
  if (typeof window !== 'undefined') {
    // 1. Bersihkan pendaftar admin yang tidak sengaja tersimpan di bth_admin_data_real_v5
    const adminRaw = localStorage.getItem('bth_admin_data_real_v5');
    if (adminRaw) {
      try {
        const list = JSON.parse(adminRaw);
        if (Array.isArray(list)) {
          const filtered = list.filter((a) => {
            const e = (a.email || '').toLowerCase().trim();
            const n = (a.fullName || '').toLowerCase().trim();
            return (
              !e.includes('superadmin') &&
              !e.includes('admin') &&
              !e.includes('@bth.id') &&
              !n.includes('administrator') &&
              !n.includes('super admin')
            );
          });
          localStorage.setItem('bth_admin_data_real_v5', JSON.stringify(filtered));
        }
      } catch {}
    }

    // 2. Bersihkan bth_applicant_v3_* yang berisikan akun admin
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith('bth_applicant_v3_')) {
        const raw = localStorage.getItem(k);
        if (
          raw &&
          (raw.includes('superadmin') ||
            raw.includes('Super Administrator') ||
            raw.includes('admin@bth') ||
            raw.includes('@bth.id'))
        ) {
          localStorage.removeItem(k);
        }
      }
    }

    // 3. Bersihkan sisa demo referral lama di bth_pmb_referrals_v2 jika masih tersimpan di browser
    const refRaw = localStorage.getItem('bth_pmb_referrals_v2');
    if (refRaw) {
      try {
        const refList = JSON.parse(refRaw);
        if (Array.isArray(refList)) {
          const demoCodes = ['MARHASBISA', 'TLM-UBTH', 'S2FARMASUBTH', 'JDUBTH', 'BKPOLOS2026', 'MKT-BTH2026', 'MKT-SINGAPARNA', 'SMKB1'];
          const cleanedRefs = refList.filter((r) => !demoCodes.includes((r.code || '').toUpperCase()));
          if (cleanedRefs.length !== refList.length) {
            localStorage.setItem('bth_pmb_referrals_v2', JSON.stringify(cleanedRefs));
          }
        }
      } catch {}
    }

    // 4. Perbarui data master prodi dan fakultas jika masih versi lama (< 15 prodi)
    try {
      const spRaw = localStorage.getItem('bth_study_programs');
      if (spRaw) {
        const spList = JSON.parse(spRaw);
        if (Array.isArray(spList) && spList.length < 15) {
          localStorage.removeItem('bth_study_programs');
          localStorage.removeItem('bth_faculties');
        }
      }
    } catch {}

    if (!localStorage.getItem(CLEANUP_KEY)) {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k) continue;
        if (
          k.startsWith('bth_applicant_') ||
          k.startsWith('bth_admin_') ||
          k.startsWith('bth_pmb_') ||
          k.startsWith('bth_cbt_') ||
          k === 'bth_bk_session' ||
          k === 'bth_marketing_session' ||
          k === 'bth_cbt_session_attempts'
        ) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));

      localStorage.setItem(CLEANUP_KEY, 'true');
    }
  }
} catch (e) {
  console.warn('Storage reset cleanup notice:', e);
}

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount('#app');

