/**
 * exportHelper.js
 * Utility untuk mengekspor data ke Microsoft Excel (.xls) dengan format tabel berdesain rapi
 * serta format CSV (.csv) dengan standar UTF-8 BOM dan pemisah kolom yang kompatibel dengan Excel.
 */

/**
 * Ekspor data ke format file Excel (.xls) berformat tabel HTML/XML resmi.
 * Format ini secara bawaan dibuka langsung oleh Microsoft Excel sebagai tabel ber-styling:
 * header berwarna, border sel, teks rata kiri/tengah/kanan, dan format mata uang Rupiah.
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

  // Bangun Header Kolom
  const tableHeaders = columns
    .map(col => `<th style="background-color: #1E3A8A; color: #FFFFFF; font-weight: bold; font-size: 11pt; padding: 10px 14px; border: 1px solid #0F172A; text-align: ${col.align || 'left'};">${col.header}</th>`)
    .join('');

  // Bangun Baris Data
  const tableRows = data.map((row, idx) => {
    const isEven = idx % 2 === 0;
    const bgStyle = isEven ? 'background-color: #FFFFFF;' : 'background-color: #F8FAFC;';
    
    const cells = columns.map(col => {
      let val = row[col.key] !== undefined && row[col.key] !== null ? row[col.key] : '';
      let style = `border: 1px solid #CBD5E1; padding: 8px 12px; font-size: 10pt; text-align: ${col.align || 'left'}; ${bgStyle}`;
      
      // Formatting khusus
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

  // Summary Row (jika ada)
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

  // Metadata block
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
 * Ekspor ke format CSV dengan UTF-8 BOM dan deklarasi pemisah kolom (sep=;)
 * sehingga saat dibuka di Microsoft Excel di Windows (Indonesia / Global),
 * data terbagi secara otomatis ke kolom-kolom tabel terpisah (tidak menumpuk di Kolom A).
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

  // Menambahkan direktif sep=; dan UTF-8 BOM (\uFEFF) untuk kompatibilitas mutlak Microsoft Excel di Windows
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
