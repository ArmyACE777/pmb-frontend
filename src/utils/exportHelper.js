/**
 * exportHelper.js
 * Utility ekspor/impor Microsoft Excel asli (.xlsx) dan format resmi migrasi SEVIMA (.xlsx / .csv)
 * sesuai standar template 62-kolom & 12 sheet referensi (`format-migrasi-sevima.xlsx`).
 */
import { buildStyledXlsxBytes, patchSevimaTemplateXlsx, parseXlsxBuffer } from './xlsxCodec.js';

// =========================================================================
// 1. SKEMA LENGKAP 62 KOLOM FORMAT MIGRASI SEVIMA (20261007 format migrasi sevima.xlsx)
// Kolom Hijau (#92D050): WAJIB (8 kolom)
// Kolom Kuning (#FEBF00): OPSIONAL (54 kolom)
// =========================================================================
export const SEVIMA_MIGRATION_SCHEMA = [
  { key: 'registrationNumber', header: 'Kode Pendaftar', required: true, isGreen: true },
  { key: 'registrationDate', header: 'Tanggal Daftar (YYYY-MM-DD HH:mm:ss)', required: false, isYellow: true },
  { key: 'fullName', header: 'Nama Pendaftar', required: true, isGreen: true },
  { key: 'gender', header: 'Jenis Kelamin (L/P)', required: true, isGreen: true },
  { key: 'religion', header: 'Agama (Lihat Daftar Agama)', required: false, isYellow: true },
  { key: 'birthPlace', header: 'Tempat Lahir', required: true, isGreen: true },
  { key: 'birthDate', header: 'Tgl Lahir (YYYY-MM-DD)', required: true, isGreen: true },
  { key: 'address', header: 'Alamat', required: false, isYellow: true },
  { key: 'rt', header: 'RT', required: false, isYellow: true },
  { key: 'rw', header: 'RW', required: false, isYellow: true },
  { key: 'dusun', header: 'Dusun', required: false, isYellow: true },
  { key: 'subDistrict', header: 'Desa / Kelurahan', required: false, isYellow: true },
  { key: 'postalCode', header: 'Kodepos', required: false, isYellow: true },
  { key: 'citizenship', header: 'Kewarganegaraan (Lihat Daftar Negara)', required: false, isYellow: true, default: 'IDN' },
  { key: 'nik', header: 'NIK / Paspor', required: false, isYellow: true },
  { key: 'familyCardNumber', header: 'No. KK', required: false, isYellow: true },
  { key: 'phone', header: 'No HP', required: false, isYellow: true },
  { key: 'email', header: 'Email', required: false, isYellow: true },
  { key: 'almamaterSize', header: 'Ukuran Almamater (Lihat Daftar Almamater)', required: false, isYellow: true },
  { key: 'motherName', header: 'Nama Ibu', required: false, isYellow: true },
  { key: 'motherIncome', header: 'ID Penghasilan Ibu (Lihat Daftar Penghasilan)', required: false, isYellow: true },
  { key: 'motherEducation', header: 'Pendidikan Ibu (Lihat Daftar Pendidikan)', required: false, isYellow: true },
  { key: 'motherJob', header: 'Pekerjaan Ibu (Lihat Daftar Pekerjaan)', required: false, isYellow: true },
  { key: 'motherLifeStatus', header: 'Status Hidup Ibu (Lihat Daftar Status Hidup)', required: false, isYellow: true },
  { key: 'motherAddress', header: 'Alamat Ibu', required: false, isYellow: true },
  { key: 'motherBirthPlace', header: 'Tempat Lahir Ibu', required: false, isYellow: true },
  { key: 'motherBirthDate', header: 'Tgl Lahir Ibu (YYYY-MM-DD)', required: false, isYellow: true },
  { key: 'fatherName', header: 'Nama Ayah', required: false, isYellow: true },
  { key: 'fatherIncome', header: 'ID Penghasilan Ayah (Lihat Daftar Penghasilan)', required: false, isYellow: true },
  { key: 'fatherEducation', header: 'Pendidikan Ayah (Lihat Daftar Pendidikan)', required: false, isYellow: true },
  { key: 'fatherJob', header: 'Pekerjaan Ayah (Lihat Daftar Pekerjaan)', required: false, isYellow: true },
  { key: 'fatherLifeStatus', header: 'Status Hidup Ayah (Lihat Daftar Status Hidup)', required: false, isYellow: true },
  { key: 'fatherAddress', header: 'Alamat Ayah', required: false, isYellow: true },
  { key: 'fatherBirthPlace', header: 'Tempat Lahir Ayah', required: false, isYellow: true },
  { key: 'fatherBirthDate', header: 'Tgl Lahir Ayah (YYYY-MM-DD)', required: false, isYellow: true },
  { key: 'isPesantren', header: 'Pesantren? (1 = ya, 0 = tidak)', required: false, isYellow: true },
  { key: 'pesantrenName', header: 'Nama Pesantren', required: false, isYellow: true },
  { key: 'pesantrenDuration', header: 'Lama Pesantren', required: false, isYellow: true },
  { key: 'isKipKuliah', header: 'KIP Kuliah? (1 = ya, 0 = tidak)', required: false, isYellow: true },
  { key: 'isActive', header: 'Aktif? (1 = ya, 0 = tidak)', required: false, isYellow: true, default: '1' },
  { key: 'isFinalized', header: 'Finalisasi? (1 = ya, 0 = tidak)', required: false, isYellow: true },
  { key: 'programType', header: 'Jenis Program (Lihat Daftar Jenis Program)', required: true, isGreen: true, default: 'IPA' },
  { key: 'nim', header: 'NIM Mahasiswa', required: false, isYellow: true },
  { key: 'examNumber', header: 'No. Ujian', required: false, isYellow: true },
  { key: 'prodiChoice1', header: 'Kode Pilihan 1 (Lihat Daftar Sebaran Prodi)', required: false, isYellow: true },
  { key: 'concentrationChoice1', header: 'Kode Konsentrasi Pilihan 1 (Lihat Daftar Konsentrasi, kosongkan jika tidak ada)', required: false, isYellow: true },
  { key: 'prodiAccepted', header: 'Kode Pilihan Diterima (Lihat Daftar Sebaran Prodi)', required: false, isYellow: true },
  { key: 'isReRegistered', header: 'Daftar Ulang? (1 = ya, 0 = tidak)', required: false, isYellow: true },
  { key: 'job', header: 'Pekerjaan (Lihat Daftar Pekerjaan)', required: false, isYellow: true },
  { key: 'jobAgency', header: 'Instansi Pekerjaan', required: false, isYellow: true },
  { key: 'province', header: 'Provinsi (Lihat Daftar Provinsi)', required: false, isYellow: true },
  { key: 'city', header: 'Kota / Kabupaten (Lihat SIAKAD)', required: false, isYellow: true },
  { key: 'district', header: 'Kecamatan (Lihat SIAKAD)', required: false, isYellow: true },
  { key: 'lastEducation', header: 'Pendidikan Terakhir (Lihat Daftar Pendidikan)', required: true, isGreen: true, default: 'SMA' },
  { key: 'graduationYear', header: 'Tahun Lulus', required: false, isYellow: true },
  { key: 'nisn', header: 'NISN (Maks 10 digit)', required: false, isYellow: true },
  { key: 'majorName', header: 'Nama Jurusan', required: false, isYellow: true },
  { key: 'npsn', header: 'NPSN (Lihat SIAKAD)', required: false, isYellow: true },
  { key: 'institutionType', header: 'ID Jenis Institusi (Lihat Daftar Jenis Institusi)', required: true, isGreen: true, default: '1' },
  { key: 'institutionProvince', header: 'Provinsi Institusi (Lihat Daftar Provinsi)', required: false, isYellow: true },
  { key: 'institutionCity', header: 'Kota Institusi (Lihat SIAKAD)', required: false, isYellow: true },
  { key: 'unScore', header: 'Nilai UN/UAN', required: false, isYellow: true },
];

const SEVIMA_PROVINCE_MAP = {
  ACEH: '11', 'SUMATERA UTARA': '12', 'SUMATERA BARAT': '13', RIAU: '14', JAMBI: '15',
  'SUMATERA SELATAN': '16', BENGKULU: '17', LAMPUNG: '18', 'KEP. BANGKA BELITUNG': '19', 'BANGKA BELITUNG': '19',
  'KEP. RIAU': '21', 'KEPULAUAN RIAU': '21', 'DKI JAKARTA': '31', JAKARTA: '31',
  'JAWA BARAT': '32', 'JAWA TENGAH': '33', 'DI YOGYAKARTA': '34', YOGYAKARTA: '34',
  'JAWA TIMUR': '35', BANTEN: '36', BALI: '51', 'NUSA TENGGARA BARAT': '52', 'NUSA TENGGARA TIMUR': '53',
  'KALIMANTAN BARAT': '61', 'KALIMANTAN TENGAH': '62', 'KALIMANTAN SELATAN': '63',
  'KALIMANTAN TIMUR': '64', 'KALIMANTAN UTARA': '65', 'SULAWESI UTARA': '71',
  'SULAWESI TENGAH': '72', 'SULAWESI SELATAN': '73', 'SULAWESI TENGGARA': '74',
  GORONTALO: '75', 'SULAWESI BARAT': '76', MALUKU: '81', 'MALUKU UTARA': '82',
  'PAPUA BARAT': '91', PAPUA: '94', 'LAIN-LAIN': '999',
};

function mapSevimaGender(val) {
  if (!val) return '';
  const s = String(val).trim().toLowerCase();
  if (s === 'p' || s.startsWith('perempuan') || s.includes('wanita')) return 'P';
  if (s === 'l' || s.startsWith('laki') || s.includes('pria')) return 'L';
  return String(val).trim().toUpperCase();
}

function mapSevimaReligion(val) {
  if (!val) return '';
  const s = String(val).trim().toLowerCase();
  if (/^[1-7]$/.test(s)) return s;
  if (s.includes('islam')) return '1';
  if (s.includes('kristen') || s.includes('protestan')) return '2';
  if (s.includes('katolik') || s.includes('katholik')) return '3';
  if (s.includes('hindu')) return '4';
  if (s.includes('budh')) return '5';
  if (s.includes('konghucu') || s.includes('khonghucu')) return '6';
  return '7';
}

function mapSevimaIncome(val) {
  if (!val) return '';
  const s = String(val).trim().toLowerCase();
  if (/^[1-5]$/.test(s)) return s;
  if (s.includes('kurang') || s.includes('<= 1') || (s.includes('1.000.000') && !s.includes('-'))) return '1';
  if (s.includes('1.000.001') || s.includes('1 - 2') || s.includes('1-2')) return '2';
  if (s.includes('2.000.001') || s.includes('2.500.000') || s.includes('2 - 4') || s.includes('2-4') || s.includes('4.000.000')) return '3';
  if (s.includes('4.000.001') || s.includes('5.000.000') || s.includes('4 - 6') || s.includes('4-6') || s.includes('6.000.000')) return '4';
  if (s.includes('lebih') || s.includes('> 6') || s.includes('10.000.000')) return '5';
  return '';
}

function mapSevimaOccupation(val) {
  if (val === undefined || val === null || val === '') return '';
  const s = String(val).trim().toLowerCase();
  if (/^\d+$/.test(s) && Number(s) >= 0 && Number(s) <= 22) return String(Number(s));
  if (s.includes('tidak bekerja')) return '0';
  if (s.includes('ibu rumah tangga') || s === 'irt') return '2';
  if (s.includes('belum bekerja')) return '3';
  if (s.includes('tugas belajar')) return '18';
  if (s.includes('pns') || s.includes('asn') || s.includes('pegawai negeri')) return '4';
  if (s.includes('bumn')) return '5';
  if (s.includes('pelajar') || s.includes('mahasiswa')) return '6';
  if (s.includes('wiraswasta') || s.includes('wirausaha')) return '7';
  if (s.includes('guru')) return '8';
  if (s.includes('dosen')) return '9';
  if (s.includes('petani')) return '10';
  if (s.includes('nelayan')) return '11';
  if (s.includes('pedagang')) return '12';
  if (s.includes('tni')) return '13';
  if (s.includes('polri') || s.includes('polisi')) return '14';
  if (s.includes('buruh')) return '15';
  if (s.includes('supir') || s.includes('sopir')) return '16';
  if (s.includes('pensiunan')) return '17';
  if (s.includes('peneliti')) return '19';
  if (s.includes('magang')) return '20';
  if (s.includes('instruktur') || s.includes('fasilitator')) return '21';
  if (s.includes('pimpinan') || s.includes('manajer')) return '22';
  if (s.includes('bekerja') || s.includes('karyawan') || s.includes('swasta') || s.includes('pegawai')) return '1';
  return '1';
}

function mapSevimaEducation(val) {
  if (!val) return '';
  const s = String(val).trim().toUpperCase();
  if (s.includes('SMKS') || s.includes('SMK') || s.includes('MAN') || s === 'MA' || s.includes('MA ') || s.includes('SMA')) return 'SMA';
  if (s.includes('SMP')) return 'SMP';
  if (s.includes('SD')) return 'SD';
  if (s.includes('D1')) return 'D1';
  if (s.includes('D2')) return 'D2';
  if (s.includes('D3')) return 'D3';
  if (s.includes('D4')) return 'D4';
  if (s.includes('S1') || s.includes('SARJANA')) return 'S1';
  if (s.includes('PROF')) return 'Prof';
  if (s.includes('S2') || s.includes('MAGISTER')) return 'S2';
  if (s.includes('S3')) return 'S3';
  return 'SMA';
}

function mapSevimaInstitutionType(eduLevel, schoolName, explicitType) {
  const lvl = mapSevimaEducation(eduLevel) || 'SMA';
  const rawExp = String(explicitType || '').trim();
  if (/^\d+$/.test(rawExp)) {
    const n = Number(rawExp);
    // Untuk pendidikan SMA, Daftar Jenis Institusi SEVIMA hanya mengizinkan ID 1 (SMA), 2 (SMK), 3 (MAN), 4 (SMKS)
    if (lvl === 'SMA' && n >= 1 && n <= 4) return String(n);
    if (lvl !== 'SMA' && n >= 5 && n <= 43) return String(n);
  }
  const sName = String(schoolName || '').trim().toUpperCase();
  const sLvl = String(eduLevel || '').trim().toUpperCase();
  if (lvl === 'SMA') {
    if (sName.includes('SMKS')) return '4';
    if (sName.includes('SMK') || sLvl.includes('SMK')) return '2';
    if (sName.includes('MAN') || sName.startsWith('MA ') || sName.includes('MADRASAH') || sLvl === 'MA') return '3';
    return '1';
  }
  if (lvl === 'D3') {
    if (sName.includes('AKADEMI')) return '15';
    if (sName.includes('SEKOLAH TINGGI')) return '16';
    if (sName.includes('POLITEKNIK')) return '18';
    if (sName.includes('INSTITUT')) return '19';
    return '17';
  }
  if (lvl === 'D4') return '22';
  if (lvl === 'S1') return '38';
  if (lvl === 'S2') return '41';
  return '1';
}

function mapSevimaProvince(val) {
  if (!val) return '';
  const s = String(val).trim().toUpperCase();
  if (/^\d{2,3}$/.test(s)) return s;
  if (SEVIMA_PROVINCE_MAP[s]) return SEVIMA_PROVINCE_MAP[s];
  for (const [name, code] of Object.entries(SEVIMA_PROVINCE_MAP)) {
    if (s.includes(name)) return code;
  }
  return '999';
}

function triggerBytesDownload(bytes, filename, mimeType) {
  const blob = new Blob([bytes], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Ekspor laporan tabel umum ke format asli Microsoft Excel (.xlsx).
 */
export function exportToExcelTable({
  filename = 'Laporan_PMB_BTH',
  title = 'UNIVERSITAS BAKTI TUNAS HUSADA',
  subtitle = 'LAPORAN SISTEM PENERIMAAN MAHASISWA BARU',
  metadata = [],
  columns = [],
  data = [],
  summary = null,
}) {
  const baseName = filename.replace(/\.(xlsx|xls)$/i, '');
  const safeFilename = `${baseName}.xlsx`;

  const xlsxColumns = columns.map((c) => ({
    header: c.header,
    fillHex: '1E3A8A',
    fontColorHex: 'FFFFFF',
  }));

  const rows = data.map((row) =>
    columns.map((col) => {
      const val = row[col.key];
      if (val === undefined || val === null) return '';
      if (col.format === 'currency') {
        const num = Number(val) || 0;
        return `Rp ${num.toLocaleString('id-ID')}`;
      }
      return String(val);
    })
  );

  if (summary) {
    const colspan = summary.colspan || 1;
    const sumRow = new Array(columns.length).fill('');
    sumRow[Math.max(0, colspan - 1)] = summary.label || 'TOTAL KESELURUHAN:';
    if (colspan < columns.length) {
      sumRow[colspan] =
        summary.value !== undefined
          ? typeof summary.value === 'number'
            ? `Rp ${summary.value.toLocaleString('id-ID')}`
            : String(summary.value)
          : '';
    }
    rows.push(sumRow);
  }

  const banners = [title, subtitle, ...metadata.map((m) => `${m.label}: ${m.value}`)].filter(Boolean);
  const bytes = buildStyledXlsxBytes({
    sheetName: 'Laporan PMB BTH',
    columns: xlsxColumns,
    rows,
    topBannerRows: banners,
  });

  triggerBytesDownload(
    bytes,
    safeFilename,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
}

/**
 * Ekspor ke format CSV dengan UTF-8 BOM dan pemisah titik koma (;)
 */
export function exportToCsvSeparated({
  filename = 'Laporan_PMB_BTH',
  headers = [],
  rows = [],
  delimiter = ';',
}) {
  const safeFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;

  const escapeCell = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerLine = headers.map(escapeCell).join(delimiter);
  const dataLines = rows.map((r) => r.map(escapeCell).join(delimiter));

  const csvBody = [`sep=${delimiter}`, headerLine, ...dataLines].join('\r\n');

  const blob = new Blob(['\uFEFF' + csvBody], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = safeFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// =========================================================================
// 2. PEMETAAN BARIS & EKSPOR/IMPOR RESMI SEVIMA (.xlsx 62 KOLOM + 12 REFERENSI)
// =========================================================================

/**
 * Mengubah objek pendaftar internal ke baris standar 62 kolom SEVIMA.
 */
export function mapApplicantToSevimaRow(app) {
  const c = app.candidate || app;
  const p = app.prodi || app.study_program || {};
  const adm = app.admission || {};

  const formatDateOnly = (d) => {
    if (!d) return '';
    try {
      const s = String(d).trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
      const dt = new Date(s);
      if (isNaN(dt.getTime())) return s;
      return dt.toISOString().split('T')[0];
    } catch {
      return String(d);
    }
  };

  const formatDateTime = (d) => {
    if (!d) return '';
    try {
      const dt = new Date(d);
      if (isNaN(dt.getTime())) return String(d);
      return dt.toISOString().replace('T', ' ').substring(0, 19);
    } catch {
      return String(d);
    }
  };

  const lifeStatus = (val) => {
    if (!val) return '';
    const s = String(val).toLowerCase();
    return s.includes('meninggal') || s === '2' ? '2' : '1';
  };

  const lastEdu = mapSevimaEducation(c.lastEducation || adm.lastEducation || 'SMA') || 'SMA';
  const instType = mapSevimaInstitutionType(c.lastEducation || c.schoolName, c.schoolName, c.institutionType);
  const prodi1Code = p.code || adm.prodi1Code || app.prodi1Code || '';
  const isAccepted =
    app.selection?.passedStatus === 'passed' ||
    ['passed', 'reregistered', 'enrolled'].includes(String(app.status || '').toLowerCase()) ||
    Boolean(app.acceptedProdiCode);
  const isReReg =
    Boolean(app.isEnrolled) ||
    ['reregistered', 'enrolled'].includes(String(app.status || '').toLowerCase()) ||
    app.payments?.uktFee?.status === 'paid';

  const citizenshipRaw = String(c.citizenship || c.nationality || 'WNI').trim().toUpperCase();
  const citizenship = citizenshipRaw === 'WNI' || citizenshipRaw === 'INDONESIA' ? 'IDN' : citizenshipRaw || 'IDN';

  return {
    registrationNumber: c.registrationNumber || app.registration_number || app.id || '',
    registrationDate: formatDateTime(app.createdAt || app.created_at || ''),
    fullName: c.fullName || app.full_name || app.fullName || '',
    gender: mapSevimaGender(c.gender),
    religion: mapSevimaReligion(c.religion),
    birthPlace: c.birthPlace || '',
    birthDate: formatDateOnly(c.birthDate),
    address: c.address || '',
    rt: c.rt || '',
    rw: c.rw || '',
    dusun: c.dusun || '',
    subDistrict: c.subDistrict || '',
    postalCode: c.postalCode || '',
    citizenship,
    nik: c.nik || '',
    familyCardNumber: c.familyCardNumber || c.noKk || '',
    phone: c.phone || app.phone || '',
    email: c.email || app.email || '',
    almamaterSize: c.almamaterSize || '',
    motherName: c.motherName || '',
    motherIncome: mapSevimaIncome(c.motherIncome || c.parentIncome),
    motherEducation: mapSevimaEducation(c.motherEducation),
    motherJob: mapSevimaOccupation(c.motherJob),
    motherLifeStatus: lifeStatus(c.motherLifeStatus),
    motherAddress: c.motherAddress || '',
    motherBirthPlace: c.motherBirthPlace || '',
    motherBirthDate: formatDateOnly(c.motherBirthDate),
    fatherName: c.fatherName || '',
    fatherIncome: mapSevimaIncome(c.fatherIncome || c.parentIncome),
    fatherEducation: mapSevimaEducation(c.fatherEducation),
    fatherJob: mapSevimaOccupation(c.fatherJob),
    fatherLifeStatus: lifeStatus(c.fatherLifeStatus),
    fatherAddress: c.fatherAddress || '',
    fatherBirthPlace: c.fatherBirthPlace || '',
    fatherBirthDate: formatDateOnly(c.fatherBirthDate),
    isPesantren: c.isPesantren !== undefined && c.isPesantren !== '' ? (c.isPesantren === true || c.isPesantren === '1' ? '1' : '0') : '',
    pesantrenName: c.pesantrenName || '',
    pesantrenDuration: c.pesantrenDuration || '',
    isKipKuliah: c.isKipKuliah || app.isKip ? '1' : '0',
    isActive: app.status === 'cancelled' || app.status === 'withdrawn' ? '0' : '1',
    isFinalized:
      app.isVerified ||
      ['registered', 'submitted', 'verified', 'passed', 'reregistered', 'enrolled'].includes(String(app.status || '').toLowerCase())
        ? '1'
        : '0',
    programType: c.programType || adm.programType || 'IPA',
    nim: app.onboarding?.nim || app.nim || '',
    examNumber: app.examCardNumber || app.examNumber || '',
    prodiChoice1: prodi1Code,
    concentrationChoice1: c.concentrationChoice1 || '',
    prodiAccepted: app.acceptedProdiCode || (isAccepted ? prodi1Code : ''),
    isReRegistered: isReReg ? '1' : '0',
    job: mapSevimaOccupation(c.job || ''),
    jobAgency: c.jobAgency || '',
    province: mapSevimaProvince(c.province),
    city: c.city || '',
    district: c.district || '',
    lastEducation: lastEdu,
    graduationYear: c.graduationYear ? String(c.graduationYear) : '',
    nisn: c.nisn || '',
    majorName: c.schoolMajor || c.majorName || '',
    npsn: c.npsn || '',
    institutionType: instType,
    institutionProvince: mapSevimaProvince(c.schoolProvince || c.institutionProvince),
    institutionCity: c.schoolCity || c.institutionCity || '',
    unScore: c.unScore || c.averageScore ? String(c.unScore || c.averageScore) : '',
  };
}

/**
 * Ekspor file Microsoft Excel asli (.xlsx) berstandar resmi SEVIMA:
 * - Memakai template resmi 13 sheet (`/templates/format-migrasi-sevima.xlsx`) dengan warna sel #92D050 & #FEBF00
 * - Fallback otomatis ke builder OOXML .xlsx terstyle bila template offline tidak terjangkau
 */
export async function exportToSevimaMigrationExcel({
  filename = 'Format_Migrasi_SEVIMA_PMB_BTH',
  applicants = [],
}) {
  const baseName = filename.replace(/\.(xlsx|xls)$/i, '');
  const safeFilename = `${baseName}.xlsx`;

  const rowArrays = applicants.map((app) => {
    const rowObj = mapApplicantToSevimaRow(app);
    return SEVIMA_MIGRATION_SCHEMA.map((col) =>
      rowObj[col.key] !== undefined && rowObj[col.key] !== null ? String(rowObj[col.key]) : ''
    );
  });

  let xlsxBytes = null;
  if (typeof fetch === 'function') {
    try {
      const resp = await fetch('/templates/format-migrasi-sevima.xlsx');
      if (resp.ok) {
        const ab = await resp.arrayBuffer();
        xlsxBytes = await patchSevimaTemplateXlsx(ab, rowArrays, SEVIMA_MIGRATION_SCHEMA.length);
      }
    } catch {
      // Gunakan fallback builder OOXML murni jika template URL tidak tersedia
    }
  }

  if (!xlsxBytes) {
    xlsxBytes = buildStyledXlsxBytes({
      sheetName: 'Format Isian',
      columns: SEVIMA_MIGRATION_SCHEMA.map((col) => ({
        header: col.header,
        fillHex: col.isGreen ? '92D050' : 'FEBF00',
        fontColorHex: '000000',
      })),
      rows: rowArrays,
    });
  }

  triggerBytesDownload(
    xlsxBytes,
    safeFilename,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
}

/**
 * Ekspor Format Migrasi SEVIMA versi CSV (UTF-8 BOM, titik koma)
 */
export function exportToSevimaMigrationCsv({
  filename = 'Format_Migrasi_SEVIMA_PMB_BTH',
  applicants = [],
}) {
  const headers = SEVIMA_MIGRATION_SCHEMA.map((s) => s.header);
  const rows = applicants.map((app) => {
    const rowObj = mapApplicantToSevimaRow(app);
    return SEVIMA_MIGRATION_SCHEMA.map((s) =>
      rowObj[s.key] !== undefined && rowObj[s.key] !== null ? rowObj[s.key] : ''
    );
  });

  exportToCsvSeparated({
    filename,
    headers,
    rows,
    delimiter: ';',
  });
}

function validateAndBuildSevimaRecords(headers, dataRows) {
  const keyMap = {};
  SEVIMA_MIGRATION_SCHEMA.forEach((schemaCol) => {
    const sClean = schemaCol.header.toLowerCase().replace(/[^a-z0-9]/g, '');
    const idx = headers.findIndex((h) => {
      const hClean = String(h || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return hClean && (hClean === sClean || hClean.includes(sClean) || sClean.includes(hClean));
    });
    if (idx !== -1) {
      keyMap[schemaCol.key] = idx;
    }
  });

  const parsedRecords = [];
  const errors = [];

  for (let r = 0; r < dataRows.length; r++) {
    const rowValues = dataRows[r] || [];
    const record = {};
    SEVIMA_MIGRATION_SCHEMA.forEach((schemaCol) => {
      const colIdx = keyMap[schemaCol.key];
      if (colIdx !== undefined && rowValues[colIdx] !== undefined && rowValues[colIdx] !== '') {
        record[schemaCol.key] = String(rowValues[colIdx]).trim();
      } else {
        record[schemaCol.key] = schemaCol.default || '';
      }
    });

    const hasAnyValue = Object.values(record).some((v, i) => v && v !== (SEVIMA_MIGRATION_SCHEMA[i]?.default || ''));
    if (!hasAnyValue && !record.fullName && !record.registrationNumber) {
      continue;
    }

    // Validasi seluruh 8 kolom wajib hijau (#92D050) sesuai format resmi SEVIMA
    const missingRequired = [];
    if (!record.registrationNumber) missingRequired.push('Kode Pendaftar');
    if (!record.fullName) missingRequired.push('Nama Pendaftar');
    if (!record.gender || !['L', 'P'].includes(mapSevimaGender(record.gender))) {
      missingRequired.push('Jenis Kelamin (L/P)');
    } else {
      record.gender = mapSevimaGender(record.gender);
    }
    if (!record.birthPlace) missingRequired.push('Tempat Lahir');
    if (!record.birthDate) missingRequired.push('Tgl Lahir (YYYY-MM-DD)');
    if (!record.programType) missingRequired.push('Jenis Program');
    if (!record.lastEducation) missingRequired.push('Pendidikan Terakhir');
    if (!record.institutionType) missingRequired.push('ID Jenis Institusi');

    const rowNumber = r + 2;
    if (missingRequired.length > 0) {
      errors.push({
        rowNumber,
        message: `Baris ${rowNumber} (${record.fullName || 'Tanpa Nama'}): Kolom wajib belum lengkap (${missingRequired.join(', ')})`,
      });
    }

    parsedRecords.push({
      rowNumber,
      isValid: missingRequired.length === 0,
      missingRequired,
      data: record,
    });
  }

  return {
    totalRows: parsedRecords.length,
    validCount: parsedRecords.filter((p) => p.isValid).length,
    invalidCount: parsedRecords.filter((p) => !p.isValid).length,
    records: parsedRecords,
    errors,
  };
}

/**
 * Parser file Impor SEVIMA berbasis teks (CSV / TSV).
 */
export function parseSevimaImportContent(content) {
  if (!content || typeof content !== 'string') {
    throw new Error('Konten file kosong atau format tidak didukung.');
  }

  const cleanText = content.replace(/^\uFEFF/, '').trim();
  const lines = cleanText.split(/\r?\n/).filter((line) => line.trim() && !line.startsWith('sep='));

  if (lines.length < 2) {
    throw new Error('File harus berisi minimal 1 baris header dan 1 baris data pendaftar.');
  }

  const headerLine = lines[0];
  let delimiter = ';';
  if (headerLine.includes('\t')) delimiter = '\t';
  else if (headerLine.includes(';') && !headerLine.includes(',')) delimiter = ';';
  else if (headerLine.includes(',') && !headerLine.includes(';')) delimiter = ',';

  const parseCsvLine = (line) => {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const headers = parseCsvLine(headerLine).map((h) => h.replace(/^["']|["']$/g, '').trim());
  const dataRows = lines.slice(1).map((line) => parseCsvLine(line));
  return validateAndBuildSevimaRecords(headers, dataRows);
}

/**
 * Parser file Impor SEVIMA terpadu: mendukung .xlsx asli (OOXML) maupun .csv / .tsv.
 */
export async function parseSevimaImportFile(file) {
  if (!file) throw new Error('Tidak ada file yang dipilih.');
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const isZip = bytes.length >= 2 && bytes[0] === 0x50 && bytes[1] === 0x4b; // PK

  if (isZip || /\.xlsx$/i.test(file.name)) {
    const matrix = await parseXlsxBuffer(buffer, 'Format Isian');
    if (matrix.length < 2) {
      throw new Error('Sheet "Format Isian" pada file .xlsx tidak memiliki baris data.');
    }
    return validateAndBuildSevimaRecords(matrix[0], matrix.slice(1));
  }

  const text = new TextDecoder('utf-8').decode(bytes);
  return parseSevimaImportContent(text);
}
