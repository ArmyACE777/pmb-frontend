/**
 * exportHelper.js
 * Utility untuk mengekspor data ke Microsoft Excel (.xls) dan format resmi migrasi SEVIMA (.xls / .csv)
 * serta mengimpor data biodata pendaftar sesuai template standar SEVIMA 62-kolom.
 */

// =========================================================================
// 1. SKEMA LENGKAP 62 KOLOM FORMAT MIGRASI SEVIMA (20261007 format migrasi sevima.xlsx)
// Kolom Hijau: WAJIB (Required)
// Kolom Kuning/Putih: OPTIONAL (Bagus jika dilengkapi)
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
  { key: 'almamaterSize', header: 'Ukuran Almamater (Lihat Daftar Almamater)', required: false, isYellow: true, default: 'L' },
  { key: 'motherName', header: 'Nama Ibu', required: false, isYellow: true },
  { key: 'motherIncome', header: 'ID Penghasilan Ibu (Lihat Daftar Penghasilan)', required: false, isYellow: true },
  { key: 'motherEducation', header: 'Pendidikan Ibu (Lihat Daftar Pendidikan)', required: false, isYellow: true },
  { key: 'motherJob', header: 'Pekerjaan Ibu (Lihat Daftar Pekerjaan)', required: false, isYellow: true },
  { key: 'motherLifeStatus', header: 'Status Hidup Ibu (Lihat Daftar Status Hidup)', required: false, isYellow: true, default: '1' },
  { key: 'motherAddress', header: 'Alamat Ibu', required: false, isYellow: true },
  { key: 'motherBirthPlace', header: 'Tempat Lahir Ibu', required: false, isYellow: true },
  { key: 'motherBirthDate', header: 'Tgl Lahir Ibu (YYYY-MM-DD)', required: false, isYellow: true },
  { key: 'fatherName', header: 'Nama Ayah', required: false, isYellow: true },
  { key: 'fatherIncome', header: 'ID Penghasilan Ayah (Lihat Daftar Penghasilan)', required: false, isYellow: true },
  { key: 'fatherEducation', header: 'Pendidikan Ayah (Lihat Daftar Pendidikan)', required: false, isYellow: true },
  { key: 'fatherJob', header: 'Pekerjaan Ayah (Lihat Daftar Pekerjaan)', required: false, isYellow: true },
  { key: 'fatherLifeStatus', header: 'Status Hidup Ayah (Lihat Daftar Status Hidup)', required: false, isYellow: true, default: '1' },
  { key: 'fatherAddress', header: 'Alamat Ayah', required: false, isYellow: true },
  { key: 'fatherBirthPlace', header: 'Tempat Lahir Ayah', required: false, isYellow: true },
  { key: 'fatherBirthDate', header: 'Tgl Lahir Ayah (YYYY-MM-DD)', required: false, isYellow: true },
  { key: 'isPesantren', header: 'Pesantren? (1 = ya, 0 = tidak)', required: false, isYellow: true, default: '0' },
  { key: 'pesantrenName', header: 'Nama Pesantren', required: false, isYellow: true },
  { key: 'pesantrenDuration', header: 'Lama Pesantren', required: false, isYellow: true },
  { key: 'isKipKuliah', header: 'KIP Kuliah? (1 = ya, 0 = tidak)', required: false, isYellow: true, default: '0' },
  { key: 'isActive', header: 'Aktif? (1 = ya, 0 = tidak)', required: false, isYellow: true, default: '1' },
  { key: 'isFinalized', header: 'Finalisasi? (1 = ya, 0 = tidak)', required: false, isYellow: true, default: '1' },
  { key: 'programType', header: 'Jenis Program (Lihat Daftar Jenis Program)', required: true, isGreen: true, default: 'IPA' },
  { key: 'nim', header: 'NIM Mahasiswa', required: false, isYellow: true },
  { key: 'examNumber', header: 'No. Ujian', required: false, isYellow: true },
  { key: 'prodiChoice1', header: 'Kode Pilihan 1 (Lihat Daftar Sebaran Prodi)', required: false, isYellow: true },
  { key: 'concentrationChoice1', header: 'Kode Konsentrasi Pilihan 1 (Lihat Daftar Konsentrasi, kosongkan jika tidak ada)', required: false, isYellow: true },
  { key: 'prodiAccepted', header: 'Kode Pilihan Diterima (Lihat Daftar Sebaran Prodi)', required: false, isYellow: true },
  { key: 'isReRegistered', header: 'Daftar Ulang? (1 = ya, 0 = tidak)', required: false, isYellow: true, default: '0' },
  { key: 'job', header: 'Pekerjaan (Lihat Daftar Pekerjaan)', required: false, isYellow: true, default: '6' },
  { key: 'jobAgency', header: 'Instansi Pekerjaan', required: false, isYellow: true },
  { key: 'province', header: 'Provinsi (Lihat Daftar Provinsi)', required: false, isYellow: true },
  { key: 'city', header: 'Kota / Kabupaten (Lihat SIAKAD)', required: false, isYellow: true },
  { key: 'district', header: 'Kecamatan (Lihat SIAKAD)', required: false, isYellow: true },
  { key: 'lastEducation', header: 'Pendidikan Terakhir (Lihat Daftar Pendidikan)', required: true, isGreen: true, default: 'SMA' },
  { key: 'graduationYear', header: 'Tahun Lulus', required: false, isYellow: true },
  { key: 'nisn', header: 'NISN (Maks 10 digit)', required: false, isYellow: true },
  { key: 'majorName', header: 'Nama Jurusan', required: false, isYellow: true },
  { key: 'npsn', header: 'NPSN (Lihat SIAKAD)', required: false, isYellow: true },
  { key: 'institutionType', header: 'ID Jenis Institusi (Lihat Daftar Jenis Institusi)', required: true, isGreen: true, default: '7' },
  { key: 'institutionProvince', header: 'Provinsi Institusi (Lihat Daftar Provinsi)', required: false, isYellow: true },
  { key: 'institutionCity', header: 'Kota Institusi (Lihat SIAKAD)', required: false, isYellow: true },
  { key: 'unScore', header: 'Nilai UN/UAN', required: false, isYellow: true },
];

/**
 * Ekspor data ke format file Excel (.xls) berformat tabel HTML/XML resmi.
 */
export function exportToExcelTable({
  filename = 'Laporan_PMB_BTH',
  title = 'UNIVERSITAS BAKTI TUNAS HUSADA',
  subtitle = 'LAPORAN SISTEM PENERIMAAN MAHASISWA BARU',
  metadata = [],
  columns = [],
  data = [],
  summary = null
}) {
  const safeFilename = filename.endsWith('.xls') ? filename : `${filename}.xls`;

  const tableHeaders = columns
    .map(col => `<th style="background-color: #1E3A8A; color: #FFFFFF; font-weight: bold; font-size: 11pt; padding: 10px 14px; border: 1px solid #0F172A; text-align: ${col.align || 'left'};">${col.header}</th>`)
    .join('');

  const tableRows = data.map((row, idx) => {
    const isEven = idx % 2 === 0;
    const bgStyle = isEven ? 'background-color: #FFFFFF;' : 'background-color: #F8FAFC;';
    
    const cells = columns.map(col => {
      let val = row[col.key] !== undefined && row[col.key] !== null ? row[col.key] : '';
      let style = `border: 1px solid #CBD5E1; padding: 8px 12px; font-size: 10pt; text-align: ${col.align || 'left'}; ${bgStyle}`;
      
      if (col.format === 'currency') {
        const num = Number(val) || 0;
        val = `Rp ${num.toLocaleString('id-ID')}`;
        style += ' font-weight: 600; color: #0F172A;';
      } else if (col.format === 'status') {
        const lower = String(val).toLowerCase();
        if (lower.includes('paid') || lower.includes('lunas') || lower.includes('disetujui') || lower.includes('lulus')) {
          val = `<span style="background-color: #DCFCE7; color: #166534; font-weight: bold; padding: 4px 8px; border-radius: 4px;">${val}</span>`;
        } else if (lower.includes('pending') || lower.includes('menunggu') || lower.includes('evaluasi')) {
          val = `<span style="background-color: #FEF3C7; color: #92400E; font-weight: bold; padding: 4px 8px; border-radius: 4px;">${val}</span>`;
        } else if (lower.includes('unpaid') || lower.includes('tolak') || lower.includes('gagal')) {
          val = `<span style="background-color: #FEE2E2; color: #991B1B; font-weight: bold; padding: 4px 8px; border-radius: 4px;">${val}</span>`;
        }
      }

      return `<td style="${style}">${val}</td>`;
    }).join('');

    return `<tr>${cells}</tr>`;
  }).join('');

  let summaryHtml = '';
  if (summary) {
    const colspan = summary.colspan || 1;
    summaryHtml = `
      <tr style="background-color: #E2E8F0; font-weight: bold;">
        <td colspan="${colspan}" style="border: 1px solid #94A3B8; padding: 10px 14px; font-size: 10pt; text-align: right; color: #1E3A8A;">
          ${summary.label || 'TOTAL KESELURUHAN:'}
        </td>
        <td style="border: 1px solid #94A3B8; padding: 10px 14px; font-size: 10pt; text-align: right; color: #1E3A8A; font-weight: bold;">
          ${summary.value !== undefined ? (typeof summary.value === 'number' ? `Rp ${summary.value.toLocaleString('id-ID')}` : summary.value) : ''}
        </td>
        ${columns.length > colspan + 1 ? `<td colspan="${columns.length - (colspan + 1)}" style="border: 1px solid #94A3B8; background-color: #E2E8F0;"></td>` : ''}
      </tr>
    `;
  }

  const metaRows = metadata.map(m => `
    <tr>
      <td colspan="${columns.length}" style="font-size: 9.5pt; color: #475569; padding: 3px 6px;">
        <strong>${m.label}:</strong> ${m.value}
      </td>
    </tr>
  `).join('');

  const htmlContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="Content-Type" content="application/vnd.ms-excel; charset=UTF-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Laporan PMB BTH</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        body { font-family: Calibri, Arial, Helvetica, sans-serif; }
        table { border-collapse: collapse; }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td colspan="${columns.length}" style="font-size: 15pt; font-weight: bold; color: #1E3A8A; padding: 12px 6px 4px 6px;">
            ${title}
          </td>
        </tr>
        <tr>
          <td colspan="${columns.length}" style="font-size: 11pt; font-weight: 600; color: #334155; padding: 0 6px 8px 6px;">
            ${subtitle}
          </td>
        </tr>
        ${metaRows}
        <tr><td colspan="${columns.length}" style="height: 12px;"></td></tr>
        <thead>
          <tr>
            ${tableHeaders}
          </tr>
        </thead>
        <tbody>
          ${tableRows}
          ${summaryHtml}
        </tbody>
      </table>
    </body>
    </html>
  `.trim();

  const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = safeFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Ekspor ke format CSV dengan UTF-8 BOM dan pemisah titik koma (;)
 */
export function exportToCsvSeparated({
  filename = 'Laporan_PMB_BTH',
  headers = [],
  rows = [],
  delimiter = ';'
}) {
  const safeFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;

  const escapeCell = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerLine = headers.map(escapeCell).join(delimiter);
  const dataLines = rows.map(r => r.map(escapeCell).join(delimiter));

  const csvBody = [
    `sep=${delimiter}`,
    headerLine,
    ...dataLines
  ].join('\r\n');

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
// 2. HELPER EKSPOR FORMAT KHUSUS MIGRASI SEVIMA (62 KOLOM, KEPALA HIJAU/KUNING)
// Sesuai Persis dengan template `20261007 format migrasi sevima.xlsx`
// =========================================================================

/**
 * Mengubah objek pendaftar internal ke baris standar 62 kolom SEVIMA.
 */
export function mapApplicantToSevimaRow(app) {
  const c = app.candidate || app;
  const p = app.prodi || app.study_program || {};
  const adm = app.admission || {};

  // Formatter tanggal
  const formatDateOnly = (d) => {
    if (!d) return '';
    try {
      const dt = new Date(d);
      if (isNaN(dt.getTime())) return String(d);
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

  // Jenis Kelamin L/P
  let genderCode = 'L';
  const gStr = String(c.gender || '').toLowerCase();
  if (gStr.startsWith('p') || gStr.includes('wanita') || gStr.includes('perempuan')) {
    genderCode = 'P';
  }

  // ID Agama: 1=Islam, 2=Kristen, 3=Katolik, 4=Hindu, 5=Budha, 6=Konghucu, 7=Lain-lain
  const religionMap = { islam: '1', kristen: '2', katolik: '3', hindu: '4', budha: '5', buddha: '5', konghucu: '6' };
  const religionCode = religionMap[String(c.religion || '').toLowerCase()] || (c.religion ? '1' : '');

  // ID Status Hidup: 1=Hidup, 2=Meninggal
  const lifeStatus = (val) => {
    if (!val) return '1';
    const s = String(val).toLowerCase();
    return s.includes('meninggal') || s === '2' ? '2' : '1';
  };

  // ID Penghasilan: 1=<=1jt, 2=1-2jt, 3=2-4jt, 4=4-6jt, 5=>6jt
  const incomeCode = (val) => {
    if (!val) return '3';
    const s = String(val);
    if (s.includes('1.000.000') && !s.includes('-')) return '1';
    if (s.includes('1.000.001') || s.includes('2.000.000')) return '2';
    if (s.includes('2.500.000') || s.includes('4.000.000')) return '3';
    if (s.includes('5.000.000') || s.includes('6.000.000')) return '4';
    if (s.includes('10.000.000') || s.includes('Lebih')) return '5';
    return '3';
  };

  // Jenjang / Pendidikan: SD, SMP, SMA, D1, D2, D3, D4, S1, Prof
  const eduCode = (val) => {
    if (!val) return 'SMA';
    const s = String(val).toUpperCase();
    if (s.includes('S1')) return 'S1';
    if (s.includes('D3')) return 'D3';
    if (s.includes('D4')) return 'D4';
    if (s.includes('SMK') || s.includes('SMA') || s.includes('MA')) return 'SMA';
    if (s.includes('SMP')) return 'SMP';
    if (s.includes('SD')) return 'SD';
    return 'SMA';
  };

  // ID Jenis Institusi: 7=Universitas, 8=Politeknik, 6=Sekolah Tinggi, 5=Akademi
  const institutionTypeCode = c.institutionType || '7';

  return {
    registrationNumber: c.registrationNumber || app.registration_number || app.id || 'BTH-2026-REG-00001',
    registrationDate: formatDateTime(app.createdAt || app.created_at || new Date()),
    fullName: c.fullName || app.full_name || 'Calon Mahasiswa',
    gender: genderCode,
    religion: religionCode,
    birthPlace: c.birthPlace || c.city || 'Tasikmalaya',
    birthDate: formatDateOnly(c.birthDate || '2005-01-01'),
    address: c.address || 'Jl. Raya No. 1',
    rt: c.rt || '01',
    rw: c.rw || '02',
    dusun: c.dusun || '',
    subDistrict: c.subDistrict || c.district || 'Cilolohan',
    postalCode: c.postalCode || '46115',
    citizenship: c.citizenship || 'IDN',
    nik: c.nik || '3206010000000000',
    familyCardNumber: c.familyCardNumber || c.noKk || '',
    phone: c.phone || '081234567890',
    email: c.email || app.email || 'pendaftar@bth.ac.id',
    almamaterSize: c.almamaterSize || 'L',
    motherName: c.motherName || 'Ibu Kandung',
    motherIncome: incomeCode(c.motherIncome || c.parentIncome),
    motherEducation: eduCode(c.motherEducation),
    motherJob: c.motherJob || 'Ibu Rumah Tangga',
    motherLifeStatus: lifeStatus(c.motherLifeStatus),
    motherAddress: c.motherAddress || c.address || '',
    motherBirthPlace: c.motherBirthPlace || c.birthPlace || '',
    motherBirthDate: formatDateOnly(c.motherBirthDate || ''),
    fatherName: c.fatherName || 'Ayah Kandung',
    fatherIncome: incomeCode(c.fatherIncome || c.parentIncome),
    fatherEducation: eduCode(c.fatherEducation),
    fatherJob: c.fatherJob || 'Wiraswasta',
    fatherLifeStatus: lifeStatus(c.fatherLifeStatus),
    fatherAddress: c.fatherAddress || c.address || '',
    fatherBirthPlace: c.fatherBirthPlace || c.birthPlace || '',
    fatherBirthDate: formatDateOnly(c.fatherBirthDate || ''),
    isPesantren: c.isPesantren ? '1' : '0',
    pesantrenName: c.pesantrenName || '',
    pesantrenDuration: c.pesantrenDuration || '',
    isKipKuliah: c.isKipKuliah || app.isKip ? '1' : '0',
    isActive: '1',
    isFinalized: app.status === 'registered' || app.isVerified ? '1' : '0',
    programType: c.programType || 'IPA',
    nim: app.nim || app.studentId || '',
    examNumber: app.examCardNumber || app.examNumber || '',
    prodiChoice1: p.code || adm.prodi1Code || '132',
    concentrationChoice1: '',
    prodiAccepted: app.acceptedProdiCode || p.code || '132',
    isReRegistered: app.isEnrolled || app.isPaid ? '1' : '0',
    job: c.job || '6', // 6 = Pelajar
    jobAgency: c.jobAgency || '',
    province: c.province || '32', // 32 = Jawa Barat
    city: c.city || 'Kota Tasikmalaya',
    district: c.district || 'Cihideung',
    lastEducation: eduCode(c.lastEducation),
    graduationYear: c.graduationYear || '2025',
    nisn: c.nisn || '0012345678',
    majorName: c.schoolMajor || 'IPA',
    npsn: c.npsn || '20200000',
    institutionType: institutionTypeCode,
    institutionProvince: c.schoolProvince || '32',
    institutionCity: c.schoolCity || 'Kota Tasikmalaya',
    unScore: c.unScore || c.averageScore || '85.5',
  };
}

/**
 * Ekspor file Excel (.xls) berstandar SEVIMA:
 * - 62 Kolom Resmi
 * - Kolom Hijau bernomor sel yang wajib diwarnai #92D050
 * - Kolom Kuning diwarnai #FEBF00
 * - Kompatibel langsung dibuka di MS Excel atau diunggah ke SIAKAD SEVIMA
 */
export function exportToSevimaMigrationExcel({
  filename = 'Format_Migrasi_SEVIMA_PMB_BTH',
  applicants = []
}) {
  const safeFilename = filename.endsWith('.xls') ? filename : `${filename}.xls`;

  // Header cells dengan pewarnaan sesuai Excel resmi Sevima
  const thHtml = SEVIMA_MIGRATION_SCHEMA.map(col => {
    let bgColor = '#F8FAFC';
    let textColor = '#0F172A';
    if (col.isGreen) {
      bgColor = '#92D050'; // Hijau resmi Sevima
      textColor = '#000000';
    } else if (col.isYellow) {
      bgColor = '#FEBF00'; // Kuning resmi Sevima
      textColor = '#000000';
    }
    return `<th style="background-color: ${bgColor}; color: ${textColor}; font-weight: bold; font-size: 10pt; padding: 8px 10px; border: 1px solid #000000; text-align: left; white-space: nowrap;">${col.header}</th>`;
  }).join('');

  // Baris Data
  const trHtml = applicants.map((app, idx) => {
    const rowObj = mapApplicantToSevimaRow(app);
    const isEven = idx % 2 === 0;
    const rowBg = isEven ? '#FFFFFF' : '#F9FAFB';

    const tdCells = SEVIMA_MIGRATION_SCHEMA.map(col => {
      const val = rowObj[col.key] !== undefined && rowObj[col.key] !== null ? rowObj[col.key] : (col.default || '');
      return `<td style="border: 1px solid #D1D5DB; padding: 6px 10px; font-size: 9.5pt; background-color: ${rowBg}; text-align: left;">${val}</td>`;
    }).join('');

    return `<tr>${tdCells}</tr>`;
  }).join('');

  const xmlContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="Content-Type" content="application/vnd.ms-excel; charset=UTF-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Format Isian</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        body { font-family: Arial, Calibri, sans-serif; }
        table { border-collapse: collapse; }
      </style>
    </head>
    <body>
      <table>
        <thead>
          <tr>${thHtml}</tr>
        </thead>
        <tbody>
          ${trHtml}
        </tbody>
      </table>
    </body>
    </html>
  `.trim();

  const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = safeFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Ekspor Format Migrasi SEVIMA versi CSV (UTF-8 BOM, titik koma)
 */
export function exportToSevimaMigrationCsv({
  filename = 'Format_Migrasi_SEVIMA_PMB_BTH',
  applicants = []
}) {
  const headers = SEVIMA_MIGRATION_SCHEMA.map(s => s.header);
  const rows = applicants.map(app => {
    const rowObj = mapApplicantToSevimaRow(app);
    return SEVIMA_MIGRATION_SCHEMA.map(s => rowObj[s.key] !== undefined && rowObj[s.key] !== null ? rowObj[s.key] : (s.default || ''));
  });

  exportToCsvSeparated({
    filename,
    headers,
    rows,
    delimiter: ';'
  });
}

/**
 * Parser file Impor SEVIMA (CSV atau teks tabel terpisah pemisah tab / koma / titik-koma)
 * Memvalidasi apakah kolom hijau/wajib sudah terisi dan mengembalikan pendaftar yang siap diimpor.
 */
export function parseSevimaImportContent(content) {
  if (!content || typeof content !== 'string') {
    throw new Error('Konten file kosong atau format tidak didukung.');
  }

  // Hilangkan BOM jika ada
  let cleanText = content.replace(/^\uFEFF/, '').trim();
  const lines = cleanText.split(/\r?\n/).filter(line => line.trim() && !line.startsWith('sep='));

  if (lines.length < 2) {
    throw new Error('File harus berisi minimal 1 baris header dan 1 baris data pendaftar.');
  }

  // Tentukan delimiter: tab, titik koma (;), atau koma (,)
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

  const headers = parseCsvLine(headerLine).map(h => h.replace(/^["']|["']$/g, '').trim());

  // Petakan indeks header ke kunci skema SEVIMA
  const keyMap = {};
  SEVIMA_MIGRATION_SCHEMA.forEach((schemaCol) => {
    // Cari kecocokan exact atau partial
    const idx = headers.findIndex(h => {
      const hClean = h.toLowerCase().replace(/[^a-z0-9]/g, '');
      const sClean = schemaCol.header.toLowerCase().replace(/[^a-z0-9]/g, '');
      return hClean.includes(sClean) || sClean.includes(hClean);
    });
    if (idx !== -1) {
      keyMap[schemaCol.key] = idx;
    }
  });

  const parsedRecords = [];
  const errors = [];

  for (let r = 1; r < lines.length; r++) {
    const rawLine = lines[r];
    if (!rawLine.trim()) continue;
    const rowValues = parseCsvLine(rawLine);

    const record = {};
    SEVIMA_MIGRATION_SCHEMA.forEach((schemaCol) => {
      const colIdx = keyMap[schemaCol.key];
      if (colIdx !== undefined && rowValues[colIdx] !== undefined) {
        record[schemaCol.key] = rowValues[colIdx];
      } else {
        record[schemaCol.key] = schemaCol.default || '';
      }
    });

    // Validasi kolom hijau (Wajib)
    const missingRequired = [];
    if (!record.fullName && !record.registrationNumber) {
      // Baris kosong abaikan
      continue;
    }

    if (!record.fullName) missingRequired.push('Nama Pendaftar');
    if (!record.birthPlace) missingRequired.push('Tempat Lahir');
    if (!record.birthDate) missingRequired.push('Tgl Lahir');
    if (!record.gender) missingRequired.push('Jenis Kelamin');

    if (missingRequired.length > 0) {
      errors.push({
        rowNumber: r + 1,
        message: `Baris ${r + 1} (${record.fullName || 'Tanpa Nama'}): Kolom wajib belum terisi (${missingRequired.join(', ')})`,
      });
    }

    parsedRecords.push({
      rowNumber: r + 1,
      isValid: missingRequired.length === 0,
      missingRequired,
      data: record,
    });
  }

  return {
    totalRows: lines.length - 1,
    validCount: parsedRecords.filter(p => p.isValid).length,
    invalidCount: parsedRecords.filter(p => !p.isValid).length,
    records: parsedRecords,
    errors,
  };
}
