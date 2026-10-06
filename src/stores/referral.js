import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const STORAGE_KEY = 'bth_pmb_referrals_v1';

const INITIAL_REFERRALS = [
  {
    id: 'REF-001',
    code: 'SMKCONTOH01',
    picName: 'Dra. Hj. Nurjanah, M.Pd.',
    picPhone: '0812-3456-7890',
    schoolName: 'SMK Bhakti Kencana Tasikmalaya',
    schoolCity: 'Kota Tasikmalaya',
    commissionType: 'nominal',
    commissionValue: 50000,
    registeredCount: 28,
    verifiedCount: 24,
    settledAmount: 6000000,
    status: 'active',
  },
  {
    id: 'REF-002',
    code: 'SMABTH2026',
    picName: 'Ahmad Fauzi, S.Pd., Kons.',
    picPhone: '0813-9876-5432',
    schoolName: 'SMA Negeri 1 Ciamis',
    schoolCity: 'Kab. Ciamis',
    commissionType: 'percentage',
    commissionValue: 10,
    registeredCount: 35,
    verifiedCount: 30,
    settledAmount: 7500000,
    status: 'active',
  },
  {
    id: 'REF-003',
    code: 'BK-SMAN1TSM',
    picName: 'Rina Marlina, S.Psi.',
    picPhone: '0852-1122-3344',
    schoolName: 'SMA Negeri 1 Tasikmalaya',
    schoolCity: 'Kota Tasikmalaya',
    commissionType: 'nominal',
    commissionValue: 50000,
    registeredCount: 42,
    verifiedCount: 39,
    settledAmount: 9750000,
    status: 'active',
  },
  {
    id: 'REF-004',
    code: 'SMKN2-TASIK',
    picName: 'Budi Santoso, M.Pd.',
    picPhone: '0878-5566-7788',
    schoolName: 'SMK Negeri 2 Tasikmalaya',
    schoolCity: 'Kota Tasikmalaya',
    commissionType: 'nominal',
    commissionValue: 50000,
    registeredCount: 19,
    verifiedCount: 15,
    settledAmount: 3750000,
    status: 'active',
  },
  {
    id: 'REF-005',
    code: 'SMK-FARMASI-TSM',
    picName: 'Siti Rahmawati, S.Farm.',
    picPhone: '0896-3344-5566',
    schoolName: 'SMK Farmasi BTH Tasikmalaya',
    schoolCity: 'Kota Tasikmalaya',
    commissionType: 'percentage',
    commissionValue: 10,
    registeredCount: 52,
    verifiedCount: 48,
    settledAmount: 12000000,
    status: 'active',
  },
];

export const useReferralStore = defineStore('referral', () => {
  const loadReferrals = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Gagal memuat data referal:', e);
    }
    return INITIAL_REFERRALS;
  };

  const referralList = ref(loadReferrals());

  const persist = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(referralList.value));
    } catch (e) {
      console.warn('Gagal menyimpan data referal:', e);
    }
  };

  const findReferralByCode = (code) => {
    if (!code) return null;
    const cleanCode = String(code).trim().toUpperCase();
    return referralList.value.find(
      (r) => r.code.toUpperCase() === cleanCode && r.status === 'active'
    ) || null;
  };

  const applyReferralForStudent = (code, studentInfo = {}) => {
    const target = findReferralByCode(code);
    if (!target) {
      return { success: false, message: 'Kode referal tidak valid atau sudah tidak aktif.' };
    }

    target.registeredCount = (target.registeredCount || 0) + 1;
    target.verifiedCount = (target.verifiedCount || 0) + 1;
    target.settledAmount = (target.settledAmount || 0) + 250000;
    persist();

    return {
      success: true,
      referral: { ...target },
      message: `Kode referal berhasil diterapkan. Mitra terhubung: ${target.picName} (${target.schoolName}).`,
    };
  };

  const addReferral = (item) => {
    referralList.value.unshift(item);
    persist();
  };

  const updateReferral = (id, updatedFields) => {
    const idx = referralList.value.findIndex((r) => r.id === id);
    if (idx !== -1) {
      referralList.value[idx] = { ...referralList.value[idx], ...updatedFields };
      persist();
    }
  };

  return {
    referralList,
    findReferralByCode,
    applyReferralForStudent,
    addReferral,
    updateReferral,
  };
});
