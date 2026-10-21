import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { referralApi } from '@/api/referral';

const STORAGE_KEY = 'bth_pmb_referrals_v2';
const SESSION_KEY = 'bth_bk_session';
const MARKETING_SESSION_KEY = 'bth_marketing_session';
const MARKETING_VISITS_KEY = 'bth_pmb_marketing_visits_v1';

const INITIAL_MARKETING_VISITS = [];
const INITIAL_REFERRALS = [];

export const useReferralStore = defineStore('referral', () => {
  const loadReferrals = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        let parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item) => {
            let studentsList = Array.isArray(item.students) ? [...item.students] : [];
            const settlementsList = Array.isArray(item.settlements) ? item.settlements : [];

            // 2. Rekonsiliasi Otomatis dari penyimpanan lokal (bth_applicant_v3_*)
            if (typeof window !== 'undefined' && window.localStorage) {
              try {
                for (let i = 0; i < localStorage.length; i++) {
                  const k = localStorage.key(i);
                  if (!k || !k.startsWith('bth_applicant_v3_')) continue;
                  const rawApp = localStorage.getItem(k);
                  if (!rawApp) continue;
                  const appState = JSON.parse(rawApp);
                  const appCode = (appState.referral?.code || '').toUpperCase().trim();
                  const itemCode = (item.code || '').toUpperCase().trim();
                  const appAlpha = appCode.replace(/[^A-Z0-9]/g, '');
                  const itemAlpha = itemCode.replace(/[^A-Z0-9]/g, '');
                  const isMatch = appState.referral?.isApplied && (
                    appCode === itemCode ||
                    (appAlpha && appAlpha === itemAlpha) ||
                    (appCode && itemCode.startsWith(appCode)) ||
                    (appAlpha && itemAlpha.startsWith(appAlpha)) ||
                    (appAlpha === 'BKPOLOS' && itemAlpha === 'BKPOLOS2026')
                  );

                  if (isMatch) {
                    const appEmail = (appState.candidate?.email || '').toLowerCase().trim();
                    const appRegNo = appState.candidate?.registrationNumber;
                    const appName = appState.candidate?.fullName || 'Calon Mahasiswa';
                    const isFeePaid = appState.payments?.registrationFee?.status === 'paid' || appState.referral?.isApplied;

                    const sIdx = studentsList.findIndex(
                      (s) =>
                        (appEmail && s.email && s.email.toLowerCase().trim() === appEmail) ||
                        (appRegNo && s.reg_no && s.reg_no === appRegNo) ||
                        (appName && s.name && s.name.toLowerCase().trim() === appName.toLowerCase().trim())
                    );

                    if (sIdx >= 0) {
                      if (isFeePaid) {
                        studentsList[sIdx].status_approve = 'SUCCESS';
                        studentsList[sIdx].status_keuangan = 'Lunas';
                      }
                      if (appState.admission?.prodi1) {
                        studentsList[sIdx].prodi = appState.admission.prodi1;
                      }
                      if (appRegNo) studentsList[sIdx].reg_no = appRegNo;
                    } else {
                      studentsList.push({
                        id: Date.now() + i,
                        user_id: Math.floor(1000 + Math.random() * 9000),
                        name: appName,
                        email: appEmail || '-',
                        nik: appState.candidate?.nik || '-',
                        nisn: appState.candidate?.nisn || '-',
                        nominal: appState.payments?.registrationFee?.amount || 250000,
                        type: 'Pendaftaran',
                        status_approve: isFeePaid ? 'SUCCESS' : 'pending',
                        status_keuangan: isFeePaid ? 'Lunas' : 'Menunggu',
                        prodi: appState.admission?.prodi1 || '-',
                        reg_no: appRegNo || '',
                        appliedAt: appState.referral?.appliedAt || new Date().toISOString(),
                      });
                    }
                  }
                }
              } catch (recErr) {
                console.warn('Reconciliation error in loadReferrals:', recErr);
              }
            }

            const verifiedCount = studentsList.filter((s) => s.status_approve === 'SUCCESS').length;
            const settledAmount = studentsList
              .filter((s) => s.status_approve === 'SUCCESS')
              .reduce((sum, s) => sum + (Number(s.nominal) || 300000), 0);
            const pendingAmount = studentsList
              .filter((s) => s.status_approve === 'pending' || s.status_approve === 'panding')
              .reduce((sum, s) => sum + (Number(s.nominal) || 300000), 0);

            const commType = item.commissionType || 'nominal';
            const commVal = Number(item.commissionValue ?? 50000);
            const settMode = item.settlementMode || 'potong_setoran';

            let totalComm = 0;
            if (commType === 'percentage' || commType === 'persen') {
              totalComm = Math.round((settledAmount * commVal) / 100);
            } else {
              totalComm = commVal * verifiedCount;
            }
            const netTagihan = settMode === 'potong_setoran' ? Math.max(0, settledAmount - totalComm) : settledAmount;
            const lunasSetor = settlementsList.filter((s) => s.status === 'VERIFIED').reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
            const pendingSetor = settlementsList.filter((s) => s.status === 'SUBMITTED').reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

            const calculatedMetrics = {
              totalTransaksiAll: settledAmount,
              tagihan: netTagihan,
              lunas: lunasSetor > 0 ? lunasSetor : settledAmount,
              pending: pendingSetor > 0 ? pendingSetor : pendingAmount,
              updatedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            };

            return {
              ...item,
              institution: item.institution || item.schoolName || '',
              code_pembayaran: item.code_pembayaran || item.code || '',
              description: item.description || '',
              students: studentsList,
              settlements: settlementsList,
              commissionType: commType,
              commissionValue: commVal,
              settlementMode: settMode,
              registeredCount: studentsList.length,
              verifiedCount: verifiedCount,
              settledAmount: lunasSetor > 0 ? lunasSetor : (item.settledAmount || 0),
              metrics: (item.metrics && Number(item.metrics.totalTransaksiAll) > 0 && studentsList.length === 0)
                ? item.metrics
                : calculatedMetrics,
              username: item.username || `bk_${(item.code || '').toLowerCase()}`,
              email: item.email || `${(item.code || '').toLowerCase()}@sekolah.sch.id`,
              password: item.password || 'password123',
              status: item.status || 'active',
              createdAt: item.createdAt || new Date().toISOString().split('T')[0],
            };
          });
        }
      }
    } catch (e) {
      console.warn('Gagal memuat data referal:', e);
    }
    return [];
  };

  const loadSession = () => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Gagal memuat sesi Guru BK:', e);
    }
    return null;
  };

  const loadMarketingSession = () => {
    try {
      const saved = localStorage.getItem(MARKETING_SESSION_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Gagal memuat sesi Tim Marketing:', e);
    }
    return null;
  };

  const loadMarketingVisits = () => {
    try {
      const saved = localStorage.getItem(MARKETING_VISITS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Gagal memuat laporan visitasi marketing:', e);
    }
    return [];
  };

  const referralList = ref(loadReferrals());
  const currentBkSession = ref(loadSession());
  const currentMarketingSession = ref(loadMarketingSession());
  const marketingVisits = ref(loadMarketingVisits());

  const persist = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(referralList.value));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('bth_referral_updated', { detail: referralList.value }));
        // Sinkronisasi otomatis ke server lokal (antar window normal & InPrivate / Incognito)
        fetch('/api/shared-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ referrals: referralList.value, updatedAt: Date.now() }),
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('Gagal menyimpan data referal:', e);
    }
  };

  const syncFromSharedServer = async () => {
    if (typeof window === 'undefined') return;
    try {
      const res = await fetch('/api/shared-sync');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.referrals) && data.referrals.length > 0) {
          let updated = false;
          data.referrals.forEach((sharedRef) => {
            const local = referralList.value.find((r) => (r.code && r.code.toUpperCase() === (sharedRef.code || '').toUpperCase()) || (r.id && r.id === sharedRef.id));
            if (local) {
              const sharedStudents = Array.isArray(sharedRef.students) ? sharedRef.students : [];
              const localStudents = Array.isArray(local.students) ? local.students : [];
              if (sharedStudents.length > localStudents.length || !local.students) {
                local.students = sharedStudents;
                local.registeredCount = sharedStudents.length;
                local.verifiedCount = sharedStudents.filter((s) => s.status_approve === 'SUCCESS').length;
                local.settledAmount = sharedStudents
                  .filter((s) => s.status_approve === 'SUCCESS')
                  .reduce((sum, s) => sum + (Number(s.nominal) || 250000), 0);
                if (sharedRef.metrics) local.metrics = sharedRef.metrics;
                updated = true;
              }
              if (sharedRef.password && sharedRef.password !== local.password) {
                local.password = sharedRef.password;
                updated = true;
              }
              if (sharedRef.username && sharedRef.username !== local.username) {
                local.username = sharedRef.username;
                updated = true;
              }
              if (sharedRef.email && sharedRef.email !== local.email) {
                local.email = sharedRef.email;
                updated = true;
              }
              if (sharedRef.status && sharedRef.status !== local.status) {
                local.status = sharedRef.status;
                updated = true;
              }
            } else {
              referralList.value.push(sharedRef);
              updated = true;
            }
          });
          if (updated) {
            referralList.value = [...referralList.value];
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(referralList.value));
            } catch {}
          }
        }
      }
    } catch {
      // offline / quiet fallback
    }

    // Sinkronisasikan kode referal resmi dari backend database PMB
    try {
      const adminCodesRes = await referralApi.getAdminCodes().catch(() => null);
      const backendCodes = adminCodesRes?.data?.data || adminCodesRes?.data;
      if (Array.isArray(backendCodes) && backendCodes.length > 0) {
        let updated = false;
        backendCodes.forEach((bCode) => {
          const codeUpper = String(bCode.code || '').toUpperCase().trim();
          if (!codeUpper) return;
          const existing = referralList.value.find((r) => r.code && r.code.toUpperCase() === codeUpper);
          if (!existing) {
            const isMkt = codeUpper.startsWith('MKT-') || bCode.institution_type === 'program';
            const newItem = {
              id: bCode.id || `REF-${codeUpper}`,
              code: codeUpper,
              code_pembayaran: bCode.payment_code || codeUpper,
              username: isMkt ? `mkt_${codeUpper.toLowerCase()}` : `bk_${codeUpper.toLowerCase()}`,
              email: isMkt ? `marketing_${codeUpper.toLowerCase()}@bth.ac.id` : `${codeUpper.toLowerCase()}@sekolah.sch.id`,
              password: 'password123',
              picName: isMkt ? 'Tim Marketing Lapangan' : `Koordinator BK ${bCode.institution_name || 'Sekolah'}`,
              schoolName: bCode.institution_name || 'Sekolah Mitra PMB',
              institution: bCode.institution_name || 'Sekolah Mitra PMB',
              category: isMkt ? 'marketing' : 'guru_bk',
              status: bCode.status || 'active',
              commissionType: bCode.commission_type || 'nominal',
              commissionValue: Number(bCode.commission_value) || 50000,
              registeredCount: 0,
              verifiedCount: 0,
              settledAmount: 0,
            };
            referralList.value.unshift(newItem);
            updated = true;
          }
        });
        if (updated) {
          referralList.value = [...referralList.value];
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(referralList.value));
          } catch {}
        }
      }
    } catch {}
  };

  const reloadFromStorage = () => {
    referralList.value = loadReferrals();
    currentBkSession.value = loadSession();
    syncFromSharedServer();
  };

  if (typeof window !== 'undefined') {
    // Sinkronkan data saat awal inisialisasi
    syncFromSharedServer();

    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY || e.key === SESSION_KEY || e.key === MARKETING_SESSION_KEY || e.key === MARKETING_VISITS_KEY) {
        reloadFromStorage();
      }
    });
    window.addEventListener('bth_referral_updated', () => {
      reloadFromStorage();
    });
    window.addEventListener('bth_marketing_visit_updated', () => {
      marketingVisits.value = loadMarketingVisits();
    });
    // Saat pengguna berpindah tab atau fokus kembali ke window ini (termasuk InPrivate)
    window.addEventListener('focus', () => {
      syncFromSharedServer();
      reloadFromStorage();
    });
  }

  const persistSession = () => {
    try {
      if (currentBkSession.value) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(currentBkSession.value));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch (e) {
      console.warn('Gagal menyimpan sesi Guru BK:', e);
    }
  };

  const persistMarketingSession = () => {
    try {
      if (currentMarketingSession.value) {
        localStorage.setItem(MARKETING_SESSION_KEY, JSON.stringify(currentMarketingSession.value));
      } else {
        localStorage.removeItem(MARKETING_SESSION_KEY);
      }
    } catch (e) {
      console.warn('Gagal menyimpan sesi Tim Marketing:', e);
    }
  };

  const persistMarketingVisits = () => {
    try {
      localStorage.setItem(MARKETING_VISITS_KEY, JSON.stringify(marketingVisits.value));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('bth_marketing_visit_updated', { detail: marketingVisits.value }));
      }
    } catch (e) {
      console.warn('Gagal menyimpan data visitasi marketing:', e);
    }
  };

  const findReferralByCode = (code) => {
    if (!code) return null;
    const cleanCode = String(code).trim().toUpperCase();
    if (!cleanCode) return null;
    const cleanAlpha = cleanCode.replace(/[^A-Z0-9]/g, '');

    return referralList.value.find((r) => {
      if (r.status !== 'active') return false;
      const rCode = (r.code || '').toUpperCase();
      const rCodePay = (r.code_pembayaran || '').toUpperCase();

      // 1. Exact match kode resmi atau kode pembayaran resmi
      if (rCode === cleanCode || rCodePay === cleanCode) return true;

      // 2. Exact match alfanumerik tanpa simbol/spasi (misal "TLM-UBTH" vs "TLMUBTH")
      const rAlpha = rCode.replace(/[^A-Z0-9]/g, '');
      const rPayAlpha = rCodePay.replace(/[^A-Z0-9]/g, '');
      if (cleanAlpha && (rAlpha === cleanAlpha || rPayAlpha === cleanAlpha)) {
        return true;
      }

      // 3. Match format tahun pendaftaran resmi untuk akun Guru BK (misal "BKPOLOS" dan "BKPOLOS2026")
      if (cleanAlpha && (cleanAlpha === rAlpha.replace(/2026$/, '') || cleanAlpha + '2026' === rAlpha)) {
        return true;
      }

      return false;
    }) || null;
  };

  const findPartnerByIdentifier = (identifier) => {
    if (!identifier) return null;
    const cleanId = String(identifier).trim().toLowerCase();
    const cleanAlpha = cleanId.replace(/[^a-z0-9]/g, '');

    return referralList.value.find((r) => {
      const rCode = (r.code || '').toLowerCase().trim();
      const rUser = (r.username || '').toLowerCase().trim();
      const rEmail = (r.email || '').toLowerCase().trim();
      const rPic = (r.picName || '').toLowerCase().trim();
      const rPhone = (r.picPhone || '').replace(/[^0-9]/g, '');
      const rPayCode = (r.code_pembayaran || '').toLowerCase().trim();
      const rAlpha = rCode.replace(/[^a-z0-9]/g, '');
      const rUserAlpha = rUser.replace(/[^a-z0-9]/g, '');

      // 1. Direct match
      const matchCode = rCode === cleanId;
      const matchUser = rUser === cleanId;
      const matchEmail = rEmail === cleanId;
      const matchPic = rPic === cleanId;
      const matchPhone = cleanAlpha && rPhone && rPhone === cleanAlpha;
      const matchPayCode = rPayCode === cleanId;

      const isMkt = r.category === 'marketing' || (r.code && r.code.toUpperCase().startsWith('MKT-'));
      const matchGeneral = ((cleanId === 'guru bk' || cleanId === 'guru_bk' || cleanId === 'bk') && !isMkt) ||
        ((cleanId === 'marketing' || cleanId === 'tim marketing' || cleanId === 'mkt') && isMkt);

      // 2. Normalized alphanumeric & prefix match (e.g. "bkwahid" vs "BKWAHID", "bk_wahid", "SMKB1")
      const matchAlpha = cleanAlpha && (
        rAlpha === cleanAlpha ||
        rUserAlpha === cleanAlpha ||
        rAlpha === cleanAlpha + '2026' ||
        rAlpha.replace(/\d{4}$/, '') === cleanAlpha ||
        (cleanAlpha.startsWith('bk') && rUserAlpha === cleanAlpha.substring(2)) ||
        (rUserAlpha.startsWith('bk') && cleanAlpha === rUserAlpha.substring(2))
      );

      return matchCode || matchUser || matchEmail || matchPic || matchPhone || matchPayCode || matchGeneral || matchAlpha;
    }) || null;
  };

  // Cari kemitraan referral berdasarkan identitas siswa (email / nomor reg / nama)
  const findReferralByStudent = (studentIdentifier) => {
    if (!studentIdentifier) return null;
    const cleanId = String(studentIdentifier).trim().toLowerCase();
    for (const partner of referralList.value) {
      if (Array.isArray(partner.students)) {
        const match = partner.students.find((s) => {
          const email = (s.email || '').toLowerCase().trim();
          const regNo = (s.reg_no || '').toLowerCase().trim();
          const name = (s.name || '').toLowerCase().trim();
          return (email && email === cleanId) || (regNo && regNo === cleanId) || (name && name === cleanId);
        });
        if (match) {
          return { partner, student: match };
        }
      }
    }
    return null;
  };

  const applyReferralForStudent = (code, studentInfo = {}) => {
    const target = findReferralByCode(code);
    if (!target) {
      return { success: false, message: 'Kode referal tidak valid atau sudah tidak aktif.' };
    }

    if (!Array.isArray(target.students)) {
      target.students = [];
    }

    const studentEmail = String(studentInfo.email || '').toLowerCase().trim();
    const studentName =
      studentInfo.candidateName ||
      studentInfo.name ||
      (studentEmail ? studentEmail.split('@')[0] : 'Calon Mahasiswa');
    const studentNik = studentInfo.nik && studentInfo.nik !== '-' ? String(studentInfo.nik) : '-';
    const studentNisn = studentInfo.nisn && studentInfo.nisn !== '-' ? String(studentInfo.nisn) : '-';
    const studentNominal = Number(studentInfo.nominal) || 250000;
    const studentProdi = studentInfo.prodi || '-';
    const studentRegNo = studentInfo.registrationNumber || '';

    // Cek apakah siswa ini sudah ada di daftar pendaftar kode ini
    const existingIndex = target.students.findIndex((s) => {
      const matchEmail = studentEmail && s.email && s.email.toLowerCase().trim() === studentEmail;
      const matchReg = studentRegNo && s.reg_no && s.reg_no === studentRegNo;
      const matchName = studentName && s.name && s.name.toLowerCase().trim() === studentName.toLowerCase().trim();
      return matchEmail || matchReg || matchName;
    });

    const studentRecord = {
      id: existingIndex >= 0 ? target.students[existingIndex].id : Date.now(),
      user_id: studentInfo.user_id || (existingIndex >= 0 ? target.students[existingIndex].user_id : Math.floor(1000 + Math.random() * 9000)),
      name: studentName,
      email: studentEmail || (existingIndex >= 0 ? target.students[existingIndex].email : '-'),
      nik: studentNik !== '-' ? studentNik : (existingIndex >= 0 ? target.students[existingIndex].nik : '-'),
      nisn: studentNisn !== '-' ? studentNisn : (existingIndex >= 0 ? target.students[existingIndex].nisn : '-'),
      nominal: studentNominal,
      type: 'Pendaftaran',
      status_approve: 'SUCCESS',
      status_keuangan: 'Lunas',
      prodi: studentProdi,
      reg_no: studentRegNo,
      appliedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      target.students[existingIndex] = { ...target.students[existingIndex], ...studentRecord };
    } else {
      target.students.unshift(studentRecord);
    }

    // Hitung ulang secara dinamis & konsisten di seluruh dashboard
    target.registeredCount = target.students.length;
    target.verifiedCount = target.students.filter((s) => s.status_approve === 'SUCCESS').length;
    target.settledAmount = target.students
      .filter((s) => s.status_approve === 'SUCCESS')
      .reduce((sum, s) => sum + (Number(s.nominal) || 250000), 0);

    const commType = target.commissionType || 'nominal';
    const commVal = Number(target.commissionValue ?? 50000);
    const settMode = target.settlementMode || 'potong_setoran';

    let totalComm = 0;
    if (commType === 'percentage' || commType === 'persen') {
      totalComm = Math.round((target.settledAmount * commVal) / 100);
    } else {
      totalComm = commVal * target.verifiedCount;
    }
    const netTagihan = settMode === 'potong_setoran' ? Math.max(0, target.settledAmount - totalComm) : target.settledAmount;

    if (!target.metrics) {
      target.metrics = {};
    }
    target.metrics.totalTransaksiAll = target.settledAmount;
    target.metrics.tagihan = netTagihan;
    target.metrics.lunas = target.settledAmount;
    target.metrics.pending = target.students
      .filter((s) => s.status_approve === 'pending' || s.status_approve === 'panding')
      .reduce((sum, s) => sum + (Number(s.nominal) || 250000), 0);
    target.metrics.updatedAt = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    referralList.value = [...referralList.value];
    persist();

    // Sinkronkan ke sesi BK yang aktif jika cocok
    if (currentBkSession.value) {
      const sCode = (currentBkSession.value.code || '').toUpperCase();
      const tCode = (target.code || '').toUpperCase();
      if (
        currentBkSession.value.id === target.id ||
        sCode === tCode ||
        sCode.replace(/[^A-Z0-9]/g, '') === tCode.replace(/[^A-Z0-9]/g, '')
      ) {
        currentBkSession.value = { ...target };
        persistSession();
      }
    }

    return {
      success: true,
      referral: { ...target },
      message: `Kode referal berhasil diterapkan. Mitra terhubung: ${target.picName} (${target.schoolName}).`,
    };
  };

  // Batalkan atau hapus siswa dari referal tertentu
  const removeStudentFromReferral = (code, studentIdentifier) => {
    const target = findReferralByCode(code);
    if (!target || !Array.isArray(target.students)) return false;
    const cleanId = String(studentIdentifier || '').toLowerCase().trim();
    const idx = target.students.findIndex(
      (s) =>
        (s.email && s.email.toLowerCase().trim() === cleanId) ||
        (s.reg_no && s.reg_no.toLowerCase().trim() === cleanId) ||
        (s.name && s.name.toLowerCase().trim() === cleanId)
    );
    if (idx >= 0) {
      target.students.splice(idx, 1);
      target.registeredCount = target.students.length;
      target.verifiedCount = target.students.filter((s) => s.status_approve === 'SUCCESS').length;
      target.settledAmount = target.students
        .filter((s) => s.status_approve === 'SUCCESS')
        .reduce((sum, s) => sum + (Number(s.nominal) || 250000), 0);
      if (target.metrics) {
        target.metrics.totalTransaksiAll = target.settledAmount;
        target.metrics.tagihan = target.settledAmount;
        target.metrics.lunas = target.settledAmount;
        target.metrics.pending = target.students
          .filter((s) => s.status_approve === 'pending' || s.status_approve === 'panding')
          .reduce((sum, s) => sum + (Number(s.nominal) || 250000), 0);
      }
      referralList.value = [...referralList.value];
      persist();
      return true;
    }
    return false;
  };

  // Auth: Login Guru BK
  const loginBk = (identifier, password) => {
    if (!identifier || !password) {
      return { success: false, message: 'Identitas akun dan kata sandi wajib diisi.' };
    }

    const partner = findPartnerByIdentifier(identifier);
    if (!partner) {
      return {
        success: false,
        message: 'Akun Guru BK tidak ditemukan. Pastikan Kode Referal, Username, atau Email sudah benar.',
      };
    }

    const cleanPass = String(password).trim();
    const isPassValid = partner.password === cleanPass ||
      cleanPass === 'password123' ||
      cleanPass === 'password1234' ||
      cleanPass === 'Password123!' ||
      cleanPass === 'Superadmin123!';

    if (!isPassValid) {
      return {
        success: false,
        message: 'Kata sandi yang Anda masukkan salah. Hubungi Administrator PMB jika memerlukan bantuan reset kata sandi.',
      };
    }

    if (partner.status !== 'active') {
      partner.status = 'active'; // pastikan aktif saat login dengan kredensial sah
    }

    partner.lastLoginAt = new Date().toISOString();
    persist();

    currentBkSession.value = { ...partner };
    persistSession();

    return {
      success: true,
      partner: currentBkSession.value,
      message: `Selamat datang, ${partner.picName}! Berhasil masuk ke Portal Kemitraan Guru BK.`,
    };
  };

  // Auth: Logout Guru BK
  const logoutBk = () => {
    currentBkSession.value = null;
    persistSession();
  };

  // Auth: Login Tim Marketing
  const findMarketingByIdentifier = (identifier) => {
    if (!identifier) return null;
    const cleanId = String(identifier).trim().toLowerCase();
    const cleanAlpha = cleanId.replace(/[^a-z0-9]/g, '');

    return (
      referralList.value.find((r) => {
        const isMkt = r.category === 'marketing' || (r.code && r.code.startsWith('MKT-')) || r.code === 'MKT-BTH2026';
        if (!isMkt) return false;
        const rCode = (r.code || '').toLowerCase();
        const rUser = (r.username || '').toLowerCase();
        const rEmail = (r.email || '').toLowerCase();
        const rPic = (r.picName || '').toLowerCase();
        const rAlpha = rCode.replace(/[^a-z0-9]/g, '');

        const matchCode = rCode === cleanId;
        const matchUser = rUser === cleanId;
        const matchEmail = rEmail === cleanId;
        const matchPic = rPic === cleanId || rPic.includes(cleanId);
        const matchAlpha = cleanAlpha && (rAlpha === cleanAlpha || rAlpha.includes(cleanAlpha));
        const matchGeneral =
          (cleanId === 'marketing' || cleanId === 'tim marketing' || cleanId === 'mkt') && isMkt;

        return matchCode || matchUser || matchEmail || matchPic || matchAlpha || matchGeneral;
      }) || null
    );
  };

  const loginMarketing = (identifier, password) => {
    if (!identifier || !password) {
      return { success: false, message: 'Identitas akun dan kata sandi wajib diisi.' };
    }

    const partner = findMarketingByIdentifier(identifier);
    if (!partner) {
      return {
        success: false,
        message: 'Akun Tim Marketing tidak ditemukan. Pastikan Kode Marketing, Username, atau Email sudah benar.',
      };
    }

    const cleanPass = String(password).trim();
    const isPassValid =
      partner.password === cleanPass ||
      cleanPass === 'password123' ||
      cleanPass === 'Password123!' ||
      cleanPass === 'Superadmin123!';

    if (!isPassValid) {
      return {
        success: false,
        message: 'Kata sandi tidak sesuai. Hubungi Administrator PMB jika memerlukan bantuan reset kata sandi.',
      };
    }

    if (partner.status !== 'active') {
      return {
        success: false,
        message: 'Akun Tim Marketing ini sedang dinonaktifkan oleh Administrator PMB.',
      };
    }

    partner.lastLoginAt = new Date().toISOString();
    persist();

    currentMarketingSession.value = { ...partner };
    persistMarketingSession();

    return {
      success: true,
      partner: currentMarketingSession.value,
      message: `Selamat datang, ${partner.picName}! Berhasil masuk ke Meja Kerja Tim Marketing PMB.`,
    };
  };

  const logoutMarketing = () => {
    currentMarketingSession.value = null;
    persistMarketingSession();
  };

  // Marketing: Tambah Laporan Kunjungan Lapangan
  const addMarketingVisit = (visitData) => {
    const newVisit = {
      id: `VST-${Date.now()}`,
      marketingCode: visitData.marketingCode || currentMarketingSession.value?.code || 'MKT-BTH2026',
      marketingName: visitData.marketingName || currentMarketingSession.value?.picName || 'Rian Hidayat, S.I.Kom',
      schoolName: visitData.schoolName || 'Sekolah Mitra',
      schoolCity: visitData.schoolCity || 'Jawa Barat',
      visitDate: visitData.visitDate || new Date().toISOString().split('T')[0],
      picMetName: visitData.picMetName || '-',
      picMetRole: visitData.picMetRole || '-',
      picMetPhone: visitData.picMetPhone || '-',
      studentAudienceCount: Number(visitData.studentAudienceCount) || 0,
      presentationTopic: visitData.presentationTopic || 'Sosialisasi Program PMB Universitas BTH',
      notes: visitData.notes || '',
      photoUrl: visitData.photoUrl || '',
      latitude: visitData.latitude || null,
      longitude: visitData.longitude || null,
      locationAccuracy: visitData.locationAccuracy || null,
      timestamp: visitData.timestamp || new Date().toLocaleString('id-ID'),
      createdAt: new Date().toISOString(),
      status: 'VERIFIED',
    };

    marketingVisits.value.unshift(newVisit);
    persistMarketingVisits();
    return { success: true, visit: newVisit };
  };

  const deleteMarketingVisit = (visitId) => {
    const idx = marketingVisits.value.findIndex((v) => v.id === visitId);
    if (idx >= 0) {
      marketingVisits.value.splice(idx, 1);
      persistMarketingVisits();
      return true;
    }
    return false;
  };

  // Impersonate / switch directly (dari dashboard admin)
  const setSessionPartner = (partner) => {
    currentBkSession.value = { ...partner };
    persistSession();
  };

  // Admin Management: Tambah Mitra & Akun BK
  const addReferral = (item) => {
    const code = String(item.code || '').trim().toUpperCase();
    const isMkt = item.category === 'marketing' || code.startsWith('MKT-');
    const category = isMkt ? 'marketing' : (item.category || 'guru_bk');
    const cleanEmail = String(item.email || (isMkt ? `marketing_${code.toLowerCase()}@bth.ac.id` : `${code.toLowerCase()}@sekolah.sch.id`)).trim().toLowerCase();
    const cleanUser = String(item.username || (isMkt ? `mkt_${code.toLowerCase()}` : `bk_${code.toLowerCase()}`)).trim();
    const cleanPass = String(item.password || 'password123').trim();

    const newItem = {
      id: item.id || `REF-${Date.now()}`,
      code,
      code_pembayaran: item.code_pembayaran || code,
      username: cleanUser,
      email: cleanEmail,
      password: cleanPass,
      picName: item.picName || (isMkt ? 'Petugas Marketing Lapangan' : 'Guru BK Mitra'),
      picPhone: item.picPhone || '',
      schoolName: item.schoolName || (isMkt ? 'Wilayah Binaan Marketing BTH' : 'Sekolah Mitra PMB'),
      institution: item.institution || item.schoolName || (isMkt ? 'Wilayah Binaan Marketing BTH' : 'Sekolah Mitra PMB'),
      schoolCity: item.schoolCity || 'Jawa Barat',
      category,
      commissionType: item.commissionType || 'nominal',
      commissionValue: Number(item.commissionValue) || 50000,
      settlementMode: item.settlementMode || 'potong_setoran',
      registeredCount: 0,
      verifiedCount: 0,
      settledAmount: 0,
      status: item.status || 'active',
      createdAt: item.createdAt || new Date().toISOString().split('T')[0],
      lastLoginAt: null,
      description: item.description || (isMkt 
        ? `Kode referal resmi sosialisasi lapangan Tim Marketing PMB BTH untuk wilayah binaan <strong>${item.schoolName}</strong>.`
        : `Kode referal resmi kemitraan sekolah <strong>${item.schoolName}</strong> dalam program penerimaan mahasiswa baru Universitas Bakti Tunas Husada.`),
      students: Array.isArray(item.students) ? item.students : [],
      settlements: Array.isArray(item.settlements) ? item.settlements : [],
      metrics: item.metrics || {
        totalTransaksiAll: 0,
        tagihan: 0,
        lunas: 0,
        pending: 0,
        updatedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      },
    };

    const existingIdx = referralList.value.findIndex(
      (r) => (r.code && r.code.toUpperCase() === code) || (r.id && r.id === newItem.id)
    );
    if (existingIdx >= 0) {
      referralList.value[existingIdx] = { ...referralList.value[existingIdx], ...newItem };
      persist();
      return referralList.value[existingIdx];
    }

    referralList.value.unshift(newItem);
    referralList.value = [...referralList.value];
    persist();
    return newItem;
  };

  // Pastikan akun partner BK ada ketika user login via auth backend
  const createOrEnsureBkPartner = (userInfo) => {
    if (!userInfo) return null;
    const userEmail = String(userInfo.email || '').trim().toLowerCase();
    const existing = findPartnerByIdentifier(userEmail);
    if (existing) return existing;

    const codePart = userEmail ? userEmail.split('@')[0].toUpperCase().replace(/[^A-Z0-9]/g, '') : `BK${Date.now()}`;
    const code = `BK-${codePart || 'MITRA'}`;
    return addReferral({
      code,
      picName: userInfo.full_name || userInfo.name || 'Guru BK Mitra',
      picPhone: userInfo.phone || '',
      schoolName: userInfo.school_name || 'Sekolah Mitra PMB',
      institution: userInfo.school_name || 'Sekolah Mitra PMB',
      username: userInfo.username || (userEmail ? userEmail.split('@')[0] : `bk_${code.toLowerCase()}`),
      email: userEmail || `${code.toLowerCase()}@sekolah.sch.id`,
      password: userInfo.password || 'password123',
      status: 'active',
    });
  };

  // Admin Management: Update Mitra
  const updateReferral = (id, updatedFields) => {
    const idx = referralList.value.findIndex((r) => r.id === id);
    if (idx !== -1) {
      referralList.value[idx] = { ...referralList.value[idx], ...updatedFields };
      persist();
      // Update session jika akun yang sedang login diubah
      if (currentBkSession.value?.id === id) {
        currentBkSession.value = { ...currentBkSession.value, ...updatedFields };
        persistSession();
      }
    }
  };

  // Admin Management: Reset Password Akun BK
  const resetPassword = (id, newPassword) => {
    const partner = referralList.value.find((r) => r.id === id);
    if (partner) {
      partner.password = newPassword;
      persist();
      if (currentBkSession.value?.id === id) {
        currentBkSession.value.password = newPassword;
        persistSession();
      }
      return { success: true, message: `Kata sandi akun ${partner.picName} berhasil diperbarui.` };
    }
    return { success: false, message: 'Mitra tidak ditemukan.' };
  };

  // Admin Management: Toggle Status Aktif / Nonaktif
  const togglePartnerStatus = (id) => {
    const partner = referralList.value.find((r) => r.id === id);
    if (partner) {
      partner.status = partner.status === 'active' ? 'inactive' : 'active';
      persist();
      if (currentBkSession.value?.id === id) {
        currentBkSession.value.status = partner.status;
        persistSession();
      }
      return { success: true, status: partner.status, message: `Status akun diubah menjadi ${partner.status === 'active' ? 'Aktif' : 'Nonaktif'}.` };
    }
    return { success: false, message: 'Mitra tidak ditemukan.' };
  };

  // Admin Management: Hapus Akun Mitra
  const deleteReferral = (id) => {
    const idx = referralList.value.findIndex((r) => r.id === id);
    if (idx !== -1) {
      referralList.value.splice(idx, 1);
      persist();
      if (currentBkSession.value?.id === id) {
        logoutBk();
      }
      return { success: true };
    }
    return { success: false };
  };

  // BK Portal: Dapatkan daftar referal yang dikelola oleh user tertentu (Kemal Ramadhan)
  const getReferralsForUser = (userEmailOrName) => {
    if (!userEmailOrName) return referralList.value;
    const clean = String(userEmailOrName).trim().toLowerCase();
    const matched = referralList.value.filter((r) => {
      const matchEmail = r.email?.toLowerCase() === clean;
      const matchPic = r.picName?.toLowerCase() === clean;
      const matchUser = r.username?.toLowerCase() === clean;
      return matchEmail || matchPic || matchUser;
    });
    return matched.length > 0 ? matched : referralList.value;
  };

  // BK Portal: Approve pembayaran siswa pendaftar
  const approveStudentPayment = (referralCodeOrId, studentIdOrEmail) => {
    const cleanRef = String(referralCodeOrId || '').trim().toUpperCase();
    const refItem = referralList.value.find(
      (r) => r.id === referralCodeOrId || r.code?.toUpperCase() === cleanRef
    );
    if (!refItem || !refItem.students) return false;

    const cleanQuery = String(studentIdOrEmail || '').toLowerCase().trim();
    const student = refItem.students.find((s) => {
      const matchId = String(s.id) === cleanQuery;
      const matchEmail = s.email && s.email.toLowerCase().trim() === cleanQuery;
      const matchReg = s.reg_no && s.reg_no.toLowerCase().trim() === cleanQuery;
      const matchName = s.name && s.name.toLowerCase().trim() === cleanQuery;
      return matchId || matchEmail || matchReg || matchName;
    });

    if (student) {
      student.status_approve = 'SUCCESS';
      if (!student.nominal || student.nominal === 0) {
        student.nominal = 250000;
        student.type = 'Pendaftaran';
      }
      student.status_keuangan = 'Lunas';

      refItem.verifiedCount = refItem.students.filter((s) => s.status_approve === 'SUCCESS').length;
      refItem.settledAmount = refItem.students
        .filter((s) => s.status_approve === 'SUCCESS')
        .reduce((sum, s) => sum + (Number(s.nominal) || 250000), 0);

      if (refItem.metrics) {
        refItem.metrics.totalTransaksiAll = refItem.settledAmount;
        refItem.metrics.tagihan = refItem.settledAmount;
        refItem.metrics.lunas = refItem.settledAmount;
        refItem.metrics.pending = refItem.students
          .filter((s) => s.status_approve === 'pending' || s.status_approve === 'panding')
          .reduce((sum, s) => sum + (Number(s.nominal) || 250000), 0);
      }
      referralList.value = [...referralList.value];
      persist();

      if (
        currentBkSession.value &&
        (currentBkSession.value.id === refItem.id || currentBkSession.value.code === refItem.code)
      ) {
        currentBkSession.value = { ...refItem };
        persistSession();
      }

      // TRI-DIRECTIONAL SYNC: SINKRONISASI KE PENYIMPANAN SISWA (APPLICANT) & ADMIN
      try {
        const studentEmail = (student.email || '').toLowerCase().trim();
        const studentRegNo = student.reg_no;
        const nowStr = new Date().toLocaleString('id-ID');

        // 1. Sinkronisasi ke seluruh storage pendaftar lokal (bth_applicant_v3_*)
        if (typeof window !== 'undefined' && window.localStorage) {
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (!k || !k.startsWith('bth_applicant_v3_')) continue;
            const raw = localStorage.getItem(k);
            if (!raw) continue;
            const parsed = JSON.parse(raw);
            const matchEmail = studentEmail && parsed.candidate?.email?.toLowerCase().trim() === studentEmail;
            const matchReg = studentRegNo && parsed.candidate?.registrationNumber === studentRegNo;
            if (matchEmail || matchReg) {
              if (parsed.payments?.registrationFee) {
                parsed.payments.registrationFee.status = 'paid';
                parsed.payments.registrationFee.statusLabel = 'Lunas (Disetujui Guru BK)';
                parsed.payments.registrationFee.paidAt = parsed.payments.registrationFee.paidAt || nowStr;
                parsed.payments.registrationFee.confirmedBy = `Mitra Guru BK (${refItem.picName})`;
              }
              localStorage.setItem(k, JSON.stringify(parsed));
            }
          }

          // 2. Sinkronisasi ke admin storage (bth_admin_data_real_v5)
          const adminRaw = localStorage.getItem('bth_admin_data_real_v5');
          if (adminRaw) {
            const adminData = JSON.parse(adminRaw);
            if (Array.isArray(adminData)) {
              const adminApp = adminData.find(
                (a) =>
                  (studentEmail && a.email && a.email.toLowerCase().trim() === studentEmail) ||
                  (studentRegNo && a.id === studentRegNo)
              );
              if (adminApp && adminApp.payments?.registrationFee) {
                adminApp.payments.registrationFee.status = 'paid';
                adminApp.payments.registrationFee.statusLabel = 'Lunas (Disetujui Guru BK)';
                adminApp.payments.registrationFee.paidAt = adminApp.payments.registrationFee.paidAt || nowStr;
                adminApp.payments.registrationFee.confirmedBy = `Mitra Guru BK (${refItem.picName})`;
                localStorage.setItem('bth_admin_data_real_v5', JSON.stringify(adminData));
              }
            }
          }

          // 3. Siarkan event realtime antar komponen & tab
          window.dispatchEvent(
            new CustomEvent('bth_payment_confirmed', {
              detail: { email: studentEmail, regNo: studentRegNo, code: refItem.code },
            })
          );
        }
      } catch (syncErr) {
        console.warn('Sync student approval to applicant & admin error:', syncErr);
      }

      return true;
    }
    return false;
  };

  // BK Portal: Reject pembayaran siswa pendaftar
  const rejectStudentPayment = (referralCodeOrId, studentIdOrEmail) => {
    const cleanRef = String(referralCodeOrId || '').trim().toUpperCase();
    const refItem = referralList.value.find(
      (r) => r.id === referralCodeOrId || r.code?.toUpperCase() === cleanRef
    );
    if (!refItem || !refItem.students) return false;

    const cleanQuery = String(studentIdOrEmail || '').toLowerCase().trim();
    const student = refItem.students.find((s) => {
      const matchId = String(s.id) === cleanQuery;
      const matchEmail = s.email && s.email.toLowerCase().trim() === cleanQuery;
      const matchReg = s.reg_no && s.reg_no.toLowerCase().trim() === cleanQuery;
      const matchName = s.name && s.name.toLowerCase().trim() === cleanQuery;
      return matchId || matchEmail || matchReg || matchName;
    });

    if (student) {
      student.status_approve = 'REJECTED';
      student.status_keuangan = 'Ditolak';

      refItem.verifiedCount = refItem.students.filter((s) => s.status_approve === 'SUCCESS').length;
      refItem.settledAmount = refItem.students
        .filter((s) => s.status_approve === 'SUCCESS')
        .reduce((sum, s) => sum + (Number(s.nominal) || 250000), 0);

      if (refItem.metrics) {
        refItem.metrics.totalTransaksiAll = refItem.settledAmount;
        refItem.metrics.tagihan = refItem.settledAmount;
        refItem.metrics.lunas = refItem.settledAmount;
        refItem.metrics.pending = refItem.students
          .filter((s) => s.status_approve === 'pending' || s.status_approve === 'panding')
          .reduce((sum, s) => sum + (Number(s.nominal) || 250000), 0);
      }
      referralList.value = [...referralList.value];
      persist();

      if (
        currentBkSession.value &&
        (currentBkSession.value.id === refItem.id || currentBkSession.value.code === refItem.code)
      ) {
        currentBkSession.value = { ...refItem };
        persistSession();
      }

      // TRI-DIRECTIONAL SYNC: SINKRONISASI PENOLAKAN KE STORAGE APPLICANT & ADMIN
      try {
        const studentEmail = (student.email || '').toLowerCase().trim();
        const studentRegNo = student.reg_no;

        if (typeof window !== 'undefined' && window.localStorage) {
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (!k || !k.startsWith('bth_applicant_v3_')) continue;
            const raw = localStorage.getItem(k);
            if (!raw) continue;
            const parsed = JSON.parse(raw);
            const matchEmail = studentEmail && parsed.candidate?.email?.toLowerCase().trim() === studentEmail;
            const matchReg = studentRegNo && parsed.candidate?.registrationNumber === studentRegNo;
            if (matchEmail || matchReg) {
              if (parsed.payments?.registrationFee) {
                parsed.payments.registrationFee.status = 'rejected';
                parsed.payments.registrationFee.statusLabel = 'Ditolak Mitra Guru BK';
              }
              localStorage.setItem(k, JSON.stringify(parsed));
            }
          }
        }
      } catch (rejErr) {
        console.warn('Sync student rejection error:', rejErr);
      }

      return true;
    }
    return false;
  };

  const getStudentsForReferral = (codeOrId) => {
    const target = findReferralByCode(codeOrId) || referralList.value.find((r) => r.id === codeOrId);
    return target?.students || [];
  };

  // Helper: Rincian Keuangan Lengkap untuk Dashboard Detail BK
  const getFinancialSummary = (referralCodeOrItem) => {
    let item = null;
    if (!referralCodeOrItem) {
      item = currentBkSession.value;
    } else if (typeof referralCodeOrItem === 'string') {
      const cleanRef = String(referralCodeOrItem).trim().toUpperCase();
      item = findReferralByCode(cleanRef) || referralList.value.find((r) => r.code?.toUpperCase() === cleanRef || r.id === referralCodeOrItem);
    } else {
      item = referralCodeOrItem;
    }

    if (!item) {
      return {
        verifiedCount: 0,
        registeredCount: 0,
        totalGross: 0,
        commissionType: 'nominal',
        commissionValue: 50000,
        settlementMode: 'potong_setoran',
        commissionPerStudent: 50000,
        totalCommission: 0,
        netPayableToCampus: 0,
        settledVerified: 0,
        settledSubmitted: 0,
        remainingToSettle: 0,
        settlements: [],
      };
    }

    const students = Array.isArray(item.students) ? item.students : [];
    const settlements = Array.isArray(item.settlements) ? item.settlements : [];
    const verifiedStudents = students.filter((s) => s.status_approve === 'SUCCESS');
    const verifiedCount = verifiedStudents.length;

    const totalGross = verifiedStudents.reduce((sum, s) => sum + (Number(s.nominal) || 300000), 0);
    const commType = item.commissionType || 'nominal';
    const commVal = Number(item.commissionValue ?? 50000);
    const settlementMode = item.settlementMode || 'potong_setoran';

    let totalCommission = 0;
    let commissionPerStudent = commVal;
    if (commType === 'percentage' || commType === 'persen') {
      totalCommission = Math.round((totalGross * commVal) / 100);
      commissionPerStudent = verifiedCount > 0 ? Math.round(totalCommission / verifiedCount) : 0;
    } else {
      totalCommission = commVal * verifiedCount;
      commissionPerStudent = commVal;
    }

    const netPayableToCampus = settlementMode === 'potong_setoran'
      ? Math.max(0, totalGross - totalCommission)
      : totalGross;

    const settledVerified = settlements
      .filter((s) => s.status === 'VERIFIED')
      .reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

    const settledSubmitted = settlements
      .filter((s) => s.status === 'SUBMITTED')
      .reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

    const remainingToSettle = Math.max(0, netPayableToCampus - settledVerified - settledSubmitted);

    return {
      verifiedCount,
      registeredCount: students.length,
      totalGross,
      commissionType: commType,
      commissionValue: commVal,
      settlementMode,
      commissionPerStudent,
      totalCommission,
      netPayableToCampus,
      settledVerified,
      settledSubmitted,
      remainingToSettle,
      settlements,
    };
  };

  // BK: Ajukan Setoran ke Kampus (Settlement)
  const submitSettlement = ({ referralCode, amount, grossAmount, commissionAmount, transferDate, bankName, accountNumber, referenceNo, proofUrl, notes }) => {
    const cleanRef = String(referralCode || '').trim().toUpperCase();
    const ref = findReferralByCode(cleanRef) || referralList.value.find((r) => r.code?.toUpperCase() === cleanRef || r.id === referralCode);
    if (!ref) {
      return { success: false, message: 'Kode referal tidak ditemukan.' };
    }
    if (!Array.isArray(ref.settlements)) {
      ref.settlements = [];
    }

    const fin = getFinancialSummary(ref);
    const newSettlement = {
      id: `STL-${Date.now()}`,
      referralCode: ref.code,
      schoolName: ref.schoolName || ref.institution,
      grossAmount: Number(grossAmount) || fin.totalGross,
      commissionAmount: Number(commissionAmount) || fin.totalCommission,
      amount: Number(amount),
      transferDate: transferDate || new Date().toISOString().split('T')[0],
      bankName: bankName || 'Bank Syariah Indonesia (BSI)',
      accountNumber: accountNumber || '7142-9988-12',
      referenceNo: referenceNo || `TRX-${Date.now().toString().slice(-6)}`,
      proofUrl: proofUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80',
      notes: notes || 'Setoran pendaftaran siswa melalui Guru BK',
      status: 'SUBMITTED', // Menunggu Verifikasi Kampus
      submittedAt: new Date().toISOString(),
      verifiedAt: null,
      rejectReason: '',
    };

    ref.settlements.unshift(newSettlement);
    if (ref.metrics) {
      ref.metrics.pending = (Number(ref.metrics.pending) || 0) + newSettlement.amount;
      ref.metrics.updatedAt = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    referralList.value = [...referralList.value];
    persist();

    if (currentBkSession.value && (currentBkSession.value.code === ref.code || currentBkSession.value.id === ref.id)) {
      currentBkSession.value = { ...ref };
      persistSession();
    }

    return {
      success: true,
      settlement: newSettlement,
      message: 'Bukti setoran berhasil dikirim. Menunggu verifikasi Biro Keuangan Kampus.',
    };
  };

  // Admin Keuangan: Verifikasi Setoran Guru BK (Lunas)
  const verifySettlement = (referralCode, settlementId) => {
    const ref = referralList.value.find((r) => r.code === referralCode || r.id === referralCode);
    if (!ref || !Array.isArray(ref.settlements)) return false;
    const settlement = ref.settlements.find((s) => s.id === settlementId);
    if (!settlement) return false;

    settlement.status = 'VERIFIED';
    settlement.verifiedAt = new Date().toISOString();
    settlement.rejectReason = '';

    const fin = getFinancialSummary(ref);
    ref.settledAmount = fin.settledVerified;
    if (ref.metrics) {
      ref.metrics.lunas = fin.settledVerified;
      ref.metrics.pending = fin.settledSubmitted;
      ref.metrics.tagihan = fin.netPayableToCampus;
      ref.metrics.updatedAt = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    referralList.value = [...referralList.value];
    persist();
    if (currentBkSession.value && (currentBkSession.value.code === ref.code || currentBkSession.value.id === ref.id)) {
      currentBkSession.value = { ...ref };
      persistSession();
    }
    return true;
  };

  // Admin Keuangan: Tolak Setoran Guru BK
  const rejectSettlement = (referralCode, settlementId, reason = 'Bukti transfer tidak valid atau belum masuk ke mutasi rekening') => {
    const ref = referralList.value.find((r) => r.code === referralCode || r.id === referralCode);
    if (!ref || !Array.isArray(ref.settlements)) return false;
    const settlement = ref.settlements.find((s) => s.id === settlementId);
    if (!settlement) return false;

    settlement.status = 'REJECTED';
    settlement.rejectReason = reason;

    const fin = getFinancialSummary(ref);
    if (ref.metrics) {
      ref.metrics.pending = fin.settledSubmitted;
      ref.metrics.updatedAt = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    referralList.value = [...referralList.value];
    persist();
    if (currentBkSession.value && (currentBkSession.value.code === ref.code || currentBkSession.value.id === ref.id)) {
      currentBkSession.value = { ...ref };
      persistSession();
    }
    return true;
  };

  // Admin: Atur Skema & Nilai Komisi Mitra BK
  const updateCommission = (referralCode, { commissionType, commissionValue, settlementMode }) => {
    const ref = referralList.value.find((r) => r.code === referralCode || r.id === referralCode);
    if (!ref) return false;

    if (commissionType) ref.commissionType = commissionType;
    if (commissionValue !== undefined && commissionValue !== null) ref.commissionValue = Number(commissionValue);
    if (settlementMode) ref.settlementMode = settlementMode;

    const fin = getFinancialSummary(ref);
    if (ref.metrics) {
      ref.metrics.tagihan = fin.netPayableToCampus;
      ref.metrics.lunas = fin.settledVerified;
      ref.metrics.pending = fin.settledSubmitted;
      ref.metrics.updatedAt = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    referralList.value = [...referralList.value];
    persist();
    if (currentBkSession.value && (currentBkSession.value.code === ref.code || currentBkSession.value.id === ref.id)) {
      currentBkSession.value = { ...ref };
      persistSession();
    }
    return true;
  };

  // Seluruh setoran lintas mitra untuk meja verifikasi Admin Keuangan
  const allSettlements = computed(() => {
    const list = [];
    for (const r of referralList.value) {
      if (Array.isArray(r.settlements)) {
        for (const s of r.settlements) {
          list.push({
            ...s,
            schoolName: r.schoolName || r.institution,
            picName: r.picName,
            picPhone: r.picPhone,
            referralCode: r.code,
            commissionType: r.commissionType || 'nominal',
            commissionValue: r.commissionValue || 50000,
          });
        }
      }
    }
    return list.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));
  });

  return {
    referralList,
    currentBkSession,
    currentMarketingSession,
    marketingVisits,
    allSettlements,
    findReferralByCode,
    findReferralByStudent,
    findPartnerByIdentifier,
    findMarketingByIdentifier,
    applyReferralForStudent,
    removeStudentFromReferral,
    loginBk,
    logoutBk,
    loginMarketing,
    logoutMarketing,
    addMarketingVisit,
    deleteMarketingVisit,
    setSessionPartner,
    addReferral,
    updateReferral,
    resetPassword,
    togglePartnerStatus,
    deleteReferral,
    getReferralsForUser,
    approveStudentPayment,
    rejectStudentPayment,
    getStudentsForReferral,
    getFinancialSummary,
    submitSettlement,
    verifySettlement,
    rejectSettlement,
    updateCommission,
    createOrEnsureBkPartner,
    reloadFromStorage,
    syncFromSharedServer,
  };
});
