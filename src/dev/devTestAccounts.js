/**
 * DEV-ONLY TEST ACCOUNTS & HELPERS
 * File ini hanya di-load secara dinamis saat `import.meta.env.DEV === true`
 * dan otomatis tereliminasi (tree-shaken) saat `npm run build`.
 */

export const DEV_PRESETS = [
  {
    key: 'camaba-baru',
    label: 'Camaba Baru',
    sublabel: 'Tahap 1 • Profil kosong',
    role: 'calon_mahasiswa',
    email: 'dev.baru@bth.local',
    backendPassword: 'Password123!',
    userId: '11111111-1111-4111-8111-111111111001',
    fullName: 'Raka Pratama (Uji Baru)',
    regNo: 'BTH-DEV-0001',
    stage: 'fresh',
  },
  {
    key: 'camaba-bayar',
    label: 'Camaba Siap Bayar',
    sublabel: 'Tahap 3 • Tagihan Rp 250rb',
    role: 'calon_mahasiswa',
    email: 'dev.bayar@bth.local',
    backendPassword: 'Password123!',
    userId: '32d44743-7a7a-4d22-9e65-56f63f6d91e0',
    fullName: 'Dinda Ayu Lestari (Uji Bayar)',
    regNo: 'BTH-DEV-0002',
    stage: 'payment',
  },
  {
    key: 'camaba-prestasi',
    label: 'Camaba Prestasi',
    sublabel: 'Non-CBT • Rapor & Berkas',
    role: 'calon_mahasiswa',
    email: 'dev.prestasi@bth.local',
    backendPassword: 'Password123!',
    userId: '11111111-1111-4111-8111-111111111003',
    fullName: 'Nadia Putri (Uji Prestasi)',
    regNo: 'BTH-DEV-0003',
    stage: 'prestasi',
  },
  {
    key: 'bk-partner',
    label: 'Mitra Guru BK',
    sublabel: 'Portal /bk • Kode DEV-BK01',
    role: 'guru_bk',
    email: 'dev-bk01@sekolah.sch.id',
    code: 'DEV-BK01',
  },
  {
    key: 'marketing',
    label: 'Tim Marketing',
    sublabel: 'Portal /marketing • MKT-DEV01',
    role: 'marketing',
    email: 'marketing_dev@bth.ac.id',
    code: 'MKT-DEV01',
  },
  {
    key: 'admin',
    label: 'Admin PMB',
    sublabel: 'Portal /admin & /cms',
    role: 'superadmin',
    email: 'superadmin@kampus.ac.id',
  },
];

function buildApplicantSeedState(preset) {
  if (preset.stage === 'fresh') {
    return {
      candidate: {
        fullName: preset.fullName,
        email: preset.email,
        registrationNumber: preset.regNo,
      },
      admission: {
        track: '',
        prodi1: '',
        prodi2: '',
        status: 'Belum Memilih Jalur',
      },
      payments: {
        registrationFee: {
          amount: 250000,
          status: 'unpaid',
          isFree: false,
          statusLabel: 'Menunggu Pembayaran',
        },
      },
    };
  }

  if (preset.stage === 'prestasi') {
    return {
      candidate: {
        fullName: preset.fullName,
        nik: '3278011508050002',
        nisn: '0058192044',
        email: preset.email,
        phone: '081299887766',
        birthPlace: 'Tasikmalaya',
        birthDate: '2005-08-15',
        gender: 'Perempuan',
        religion: 'Islam',
        schoolName: 'SMAN 1 Tasikmalaya',
        registrationNumber: preset.regNo,
      },
      admission: {
        track: 'Jalur Prestasi Akademik / Rapor',
        requiresExam: false,
        prodi1: 'S1 Farmasi',
        prodi2: 'D3 Farmasi',
        prodi1Degree: 'S1',
        prodi1Faculty: 'Fakultas Farmasi',
        status: 'Menunggu Pembayaran & Verifikasi',
        backendStatus: 'submitted',
      },
      payments: {
        registrationFee: {
          amount: 250000,
          status: 'paid',
          isFree: false,
          statusLabel: 'Lunas',
        },
      },
    };
  }

  // Default: stage === 'payment'
  return {
    candidate: {
      fullName: preset.fullName,
      nik: '3278011204040008',
      nisn: '0061284918',
      email: preset.email,
      phone: '081234567890',
      birthPlace: 'Tasikmalaya',
      birthDate: '2004-05-12',
      gender: 'Perempuan',
      religion: 'Islam',
      schoolName: 'SMK MARHAS MARGAHAYU',
      registrationNumber: preset.regNo,
    },
    admission: {
      track: 'Jalur Reguler Gelombang 1',
      requiresExam: true,
      prodi1: 'S1 Farmasi',
      prodi2: 'S1 Administrasi Rumah Sakit',
      prodi1Degree: 'S1',
      prodi1Faculty: 'Fakultas Farmasi',
      status: 'Menunggu Pembayaran Formulir',
    },
    payments: {
      registrationFee: {
        amount: 250000,
        status: 'unpaid',
        isFree: false,
        statusLabel: 'Menunggu Pembayaran',
        vaNumber: '9881234567890123',
      },
    },
  };
}

async function isBackendGatewayOnline() {
  try {
    const res = await fetch('/api/gateway-ping');
    if (!res.ok) return false;
    const data = await res.json();
    return data?.online === true;
  } catch {
    return false;
  }
}

export async function loginDevPreset(preset, { authStore, referralStore, router, toast }) {
  if (preset.role === 'superadmin') {
    // Jika backend lokal menyala, utamakan login real agar mendapat JWT asli
    if (await isBackendGatewayOnline()) {
      try {
        await authStore.login('superadmin@kampus.ac.id', 'Superadmin123!');
        toast.success('Masuk Admin PMB (JWT Backend Aktif).');
        router.push('/admin');
        return;
      } catch {
        // Fallback ke sesi lokal dev jika kredensial belum sesuai
      }
    }
    const adminUser = {
      id: '00000000-0000-0000-0000-000000000001',
      full_name: 'Administrator PMB BTH (Dev)',
      name: 'Administrator PMB BTH (Dev)',
      email: 'admin@bth.ac.id',
      roles: ['superadmin', 'admin_pmb', 'panitia', 'keuangan', 'verifikator'],
      role: 'superadmin',
      status: 'active',
    };
    authStore.setAuth({
      access_token: 'mock_dev_admin_token',
      refresh_token: 'mock_dev_admin_refresh_token',
      user: adminUser,
    });
    localStorage.setItem('bth_allow_demo_admin', 'true');
    toast.info('Masuk mode Admin Dev Lokal.');
    router.push('/admin');
    return;
  }

  if (preset.role === 'guru_bk') {
    let partner = referralStore.findPartnerByIdentifier(preset.code);
    if (!partner) {
      partner = referralStore.addReferral({
        code: preset.code,
        email: preset.email,
        password: 'password123',
        picName: 'Ibu Sari, S.Pd (BK Uji)',
        schoolName: 'SMAN 1 Tasikmalaya (Uji Dev)',
        category: 'guru_bk',
      });
    }
    referralStore.setSessionPartner(partner);
    authStore.setBkUser(partner);
    toast.success(`Masuk Mitra Guru BK (${partner.code}).`);
    router.push('/bk');
    return;
  }

  if (preset.role === 'marketing') {
    let mkt = referralStore.findMarketingByIdentifier(preset.code);
    if (!mkt) {
      mkt = referralStore.addReferral({
        code: preset.code,
        email: preset.email,
        password: 'password123',
        picName: 'Tim Marketing Uji (Dev)',
        schoolName: 'Wilayah Priangan Timur (Uji Dev)',
        category: 'marketing',
      });
    }
    const res = referralStore.loginMarketing(mkt.code, mkt.password || 'password123');
    authStore.setMarketingUser(res.success ? res.partner : mkt);
    toast.success(`Masuk Tim Marketing (${mkt.code}).`);
    router.push('/marketing');
    return;
  }

  // Applicant preset: coba login real backend jika gateway menyala & akun sudah di-seed
  if (preset.backendPassword && (await isBackendGatewayOnline())) {
    try {
      await authStore.login(preset.email, preset.backendPassword);
      toast.success(`Masuk ${preset.fullName} (JWT Backend Aktif).`);
      router.push('/dashboard');
      return;
    } catch {
      // Fallback ke sesi lokal dev jika akun belum di-seed
    }
  }

  const applicantUser = {
    id: preset.userId,
    full_name: preset.fullName,
    name: preset.fullName,
    email: preset.email,
    roles: ['calon_mahasiswa'],
    role: 'calon_mahasiswa',
    status: 'active',
  };

  // Tulis seed state ke localStorage SEBELUM setAuth agar watcher applicantStore langsung membacanya
  const appKey = `bth_applicant_v3_${applicantUser.id}`;
  if (!localStorage.getItem(appKey)) {
    localStorage.setItem(appKey, JSON.stringify(buildApplicantSeedState(preset)));
  }

  authStore.setAuth({
    access_token: `mock_dev_applicant_token_${preset.key}`,
    refresh_token: `mock_dev_applicant_refresh_${preset.key}`,
    user: applicantUser,
  });

  toast.success(`Masuk sebagai ${preset.fullName}.`);
  router.push('/dashboard');
}

export function tryDevCredentialLogin(inputIdent, inputPass, ctx) {
  const cleanLowerIdent = String(inputIdent || '').trim().toLowerCase();
  const cleanPass = String(inputPass || '').trim();

  if (
    ['admin@bth.ac.id', 'admin', 'superadmin', 'admin_pmb'].includes(cleanLowerIdent) &&
    ['admin123', 'password123', 'admin'].includes(cleanPass)
  ) {
    const adminPreset = DEV_PRESETS.find((p) => p.key === 'admin');
    return loginDevPreset(adminPreset, ctx).then(() => true);
  }

  if (
    ['camaba@gmail.com', 'calon.maba@gmail.com', 'camaba', 'ujang@gmail.com', 'dinda@gmail.com'].includes(cleanLowerIdent) &&
    ['camaba123', 'password123', '123456', 'camaba'].includes(cleanPass)
  ) {
    const camabaPreset = DEV_PRESETS.find((p) => p.key === 'camaba-bayar');
    return loginDevPreset(camabaPreset, ctx).then(() => true);
  }

  return Promise.resolve(false);
}

export function resetDevLocalTestState(toast) {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && (k.startsWith('bth_applicant_v3_11111111-') || k === 'bth_applicant_v3_32d44743-7a7a-4d22-9e65-56f63f6d91e0')) {
      keysToRemove.push(k);
    }
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
  if (toast) {
    toast.info('Data cache akun uji lokal telah di-reset ke kondisi awal.');
  }
}
