/**
 * xlsxCodec.js
 * Pembaca & penulis berkas Microsoft Excel OpenXML (.xlsx) murni (OOXML ZIP)
 * tanpa dependensi pihak ketiga, mendukung template multi-sheet SEVIMA.
 */

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder('utf-8');

const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    c = CRC32_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function readU16(view, offset) {
  return view.getUint16(offset, true);
}

function readU32(view, offset) {
  return view.getUint32(offset, true);
}

async function inflateRaw(bytes) {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('Browser tidak mendukung DecompressionStream untuk membaca .xlsx.');
  }
  const ds = new DecompressionStream('deflate-raw');
  const writer = ds.writable.getWriter();
  writer.write(bytes);
  writer.close();
  const ab = await new Response(ds.readable).arrayBuffer();
  return new Uint8Array(ab);
}

export function escapeXml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function unescapeXml(str) {
  return String(str ?? '')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&');
}

export function colIndexToLetters(idx) {
  let n = idx + 1;
  let letters = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    letters = String.fromCharCode(65 + rem) + letters;
    n = Math.floor((n - 1) / 26);
  }
  return letters;
}

export function colLettersToIndex(letters) {
  let idx = 0;
  for (let i = 0; i < letters.length; i++) {
    idx = idx * 26 + (letters.charCodeAt(i) - 64);
  }
  return idx - 1;
}

/**
 * Mengurai seluruh entri file di dalam arsip ZIP (.xlsx).
 */
export async function readZipEntries(arrayBuffer) {
  const bytes = arrayBuffer instanceof Uint8Array ? arrayBuffer : new Uint8Array(arrayBuffer);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  // Cari End of Central Directory (0x06054b50)
  const minOffset = Math.max(0, bytes.length - 65557);
  let eocdOffset = -1;
  for (let i = bytes.length - 22; i >= minOffset; i--) {
    if (
      bytes[i] === 0x50 &&
      bytes[i + 1] === 0x4b &&
      bytes[i + 2] === 0x05 &&
      bytes[i + 3] === 0x06
    ) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset === -1) {
    throw new Error('File bukan arsip .xlsx / ZIP yang valid.');
  }

  const totalEntries = readU16(view, eocdOffset + 10);
  const cdOffset = readU32(view, eocdOffset + 16);

  const entries = [];
  let ptr = cdOffset;
  for (let i = 0; i < totalEntries; i++) {
    if (readU32(view, ptr) !== 0x02014b50) {
      throw new Error('Struktur Central Directory ZIP tidak valid.');
    }
    const method = readU16(view, ptr + 10);
    const modTime = readU16(view, ptr + 12);
    const modDate = readU16(view, ptr + 14);
    const crc = readU32(view, ptr + 16);
    const compSize = readU32(view, ptr + 20);
    const uncompSize = readU32(view, ptr + 24);
    const nameLen = readU16(view, ptr + 28);
    const extraLen = readU16(view, ptr + 30);
    const commentLen = readU16(view, ptr + 32);
    const localOffset = readU32(view, ptr + 42);
    const name = textDecoder.decode(bytes.subarray(ptr + 46, ptr + 46 + nameLen));

    const lNameLen = readU16(view, localOffset + 26);
    const lExtraLen = readU16(view, localOffset + 28);
    const dataStart = localOffset + 30 + lNameLen + lExtraLen;
    const compressedData = bytes.slice(dataStart, dataStart + compSize);

    entries.push({
      name,
      method,
      modTime,
      modDate,
      crc,
      compSize,
      uncompSize,
      compressedData,
      async getData() {
        if (this.method === 0) return this.compressedData;
        if (this.method === 8) return await inflateRaw(this.compressedData);
        throw new Error(`Metode kompresi ZIP tidak didukung (${this.method}) pada ${this.name}`);
      },
    });

    ptr += 46 + nameLen + extraLen + commentLen;
  }

  return entries;
}

/**
 * Mengemas entri menjadi berkas ZIP (.xlsx) standar (mempertahankan kompresi entri lama atau STORE untuk entri baru).
 */
export function writeZipEntries(entries) {
  const localParts = [];
  const cdParts = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = textEncoder.encode(entry.name);
    let payload;
    let method;
    let crcVal;
    let compSize;
    let uncompSize;

    if (entry.rawBytes) {
      payload = entry.rawBytes;
      method = 0; // STORE
      crcVal = crc32(payload);
      compSize = payload.length;
      uncompSize = payload.length;
    } else {
      payload = entry.compressedData;
      method = entry.method;
      crcVal = entry.crc;
      compSize = entry.compSize;
      uncompSize = entry.uncompSize;
    }

    const modTime = entry.modTime ?? 0;
    const modDate = entry.modDate ?? 0x5421;

    const lfh = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(lfh.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true); // version needed
    lv.setUint16(6, 0x0800, true); // UTF-8 flag
    lv.setUint16(8, method, true);
    lv.setUint16(10, modTime, true);
    lv.setUint16(12, modDate, true);
    lv.setUint32(14, crcVal >>> 0, true);
    lv.setUint32(18, compSize >>> 0, true);
    lv.setUint32(22, uncompSize >>> 0, true);
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true);
    lfh.set(nameBytes, 30);

    localParts.push(lfh, payload);

    const cdh = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(cdh.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0x0800, true);
    cv.setUint16(10, method, true);
    cv.setUint16(12, modTime, true);
    cv.setUint16(14, modDate, true);
    cv.setUint32(16, crcVal >>> 0, true);
    cv.setUint32(20, compSize >>> 0, true);
    cv.setUint32(24, uncompSize >>> 0, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true);
    cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true);
    cv.setUint16(36, 0, true);
    cv.setUint32(38, 0, true);
    cv.setUint32(42, offset >>> 0, true);
    cdh.set(nameBytes, 46);
    cdParts.push(cdh);

    offset += lfh.length + payload.length;
  }

  const cdOffset = offset;
  let cdSize = 0;
  for (const part of cdParts) cdSize += part.length;

  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, cdSize >>> 0, true);
  ev.setUint32(16, cdOffset >>> 0, true);
  ev.setUint16(20, 0, true);

  const totalLen = offset + cdSize + eocd.length;
  const result = new Uint8Array(totalLen);
  let pos = 0;
  for (const part of localParts) {
    result.set(part, pos);
    pos += part.length;
  }
  for (const part of cdParts) {
    result.set(part, pos);
    pos += part.length;
  }
  result.set(eocd, pos);
  return result;
}

function buildInlineRowXml(rowNumber, values, styleIdx = null) {
  const cells = [];
  for (let c = 0; c < values.length; c++) {
    const val = values[c];
    if (val === undefined || val === null || val === '') continue;
    const ref = `${colIndexToLetters(c)}${rowNumber}`;
    const styleAttr = styleIdx !== null ? ` s="${styleIdx}"` : '';
    cells.push(`<c r="${ref}"${styleAttr} t="inlineStr"><is><t xml:space="preserve">${escapeXml(val)}</t></is></c>`);
  }
  return `<row r="${rowNumber}">${cells.join('')}</row>`;
}

function resolveSheetPath(entriesMap, workbookXmlText, relsXmlText, preferredSheetName) {
  const targetDefault = 'xl/worksheets/sheet1.xml';
  if (!workbookXmlText) return entriesMap.has(targetDefault) ? targetDefault : null;

  const relMap = {};
  if (relsXmlText) {
    const relRegex = /<Relationship\b([^>]+)\/?>/g;
    let m;
    while ((m = relRegex.exec(relsXmlText)) !== null) {
      const attrs = m[1];
      const idMatch = attrs.match(/\bId="([^"]+)"/);
      const targetMatch = attrs.match(/\bTarget="([^"]+)"/);
      if (idMatch && targetMatch) {
        let target = targetMatch[1].replace(/^\/+/, '');
        if (!target.startsWith('xl/')) target = `xl/${target}`;
        relMap[idMatch[1]] = target;
      }
    }
  }

  const sheets = [];
  const sheetRegex = /<sheet\b([^>]+)\/?>/g;
  let sm;
  while ((sm = sheetRegex.exec(workbookXmlText)) !== null) {
    const attrs = sm[1];
    const nameMatch = attrs.match(/\bname="([^"]+)"/);
    const ridMatch = attrs.match(/\br:id="([^"]+)"/);
    if (nameMatch && ridMatch) {
      sheets.push({
        name: unescapeXml(nameMatch[1]),
        path: relMap[ridMatch[1]] || targetDefault,
      });
    }
  }

  if (preferredSheetName) {
    const found = sheets.find(
      (s) => s.name.trim().toLowerCase() === preferredSheetName.trim().toLowerCase()
    );
    if (found && entriesMap.has(found.path)) return found.path;
  }

  if (sheets.length > 0 && entriesMap.has(sheets[0].path)) {
    return sheets[0].path;
  }
  return entriesMap.has(targetDefault) ? targetDefault : null;
}

/**
 * Mengisi sheet "Format Isian" pada template resmi SEVIMA .xlsx dengan baris data riil,
 * mempertahankan seluruh warna sel header & 12 sheet referensi.
 */
export async function patchSevimaTemplateXlsx(templateBuffer, dataRows, totalColumns = 62) {
  const entries = await readZipEntries(templateBuffer);
  const entriesMap = new Map(entries.map((e) => [e.name, e]));

  const wbText = entriesMap.has('xl/workbook.xml')
    ? textDecoder.decode(await entriesMap.get('xl/workbook.xml').getData())
    : '';
  const relsText = entriesMap.has('xl/_rels/workbook.xml.rels')
    ? textDecoder.decode(await entriesMap.get('xl/_rels/workbook.xml.rels').getData())
    : '';

  const sheetPath = resolveSheetPath(entriesMap, wbText, relsText, 'Format Isian');
  if (!sheetPath) {
    throw new Error('Sheet "Format Isian" tidak ditemukan di dalam template SEVIMA.');
  }

  const sheetXml = textDecoder.decode(await entriesMap.get(sheetPath).getData());
  const row1Match = sheetXml.match(/<row\b[^>]*r="1"[^>]*>[\s\S]*?<\/row>/);
  if (!row1Match) {
    throw new Error('Header baris 1 tidak ditemukan di template SEVIMA.');
  }

  const rowXmls = [row1Match[0]];
  for (let i = 0; i < dataRows.length; i++) {
    rowXmls.push(buildInlineRowXml(i + 2, dataRows[i]));
  }

  const lastRow = Math.max(1, dataRows.length + 1);
  const lastCol = colIndexToLetters(totalColumns - 1);

  let updatedXml = sheetXml.replace(
    /<sheetData>[\s\S]*?<\/sheetData>/,
    `<sheetData>${rowXmls.join('')}</sheetData>`
  );
  if (/<dimension\b[^>]*\/>/.test(updatedXml)) {
    updatedXml = updatedXml.replace(
      /<dimension\b[^>]*\/>/,
      `<dimension ref="A1:${lastCol}${lastRow}"/>`
    );
  }

  const newEntries = entries.map((e) =>
    e.name === sheetPath ? { name: e.name, rawBytes: textEncoder.encode(updatedXml), modTime: e.modTime, modDate: e.modDate } : e
  );

  return writeZipEntries(newEntries);
}

/**
 * Membangun file .xlsx murni dari awal (digunakan untuk fallback offline SEVIMA & laporan tabel umum).
 */
export function buildStyledXlsxBytes({
  sheetName = 'Data',
  columns = [], // [{ header, fillHex?: '92D050'|'FEBF00'|'1E3A8A', fontColorHex?: '000000'|'FFFFFF' }]
  rows = [],    // array of string/number arrays matching columns
  topBannerRows = [], // optional string rows before header
}) {
  const safeSheet = escapeXml(String(sheetName).slice(0, 31) || 'Sheet1');
  const uniqueStyles = [];
  const styleIndexMap = new Map();

  // Style 0 = default
  // Collect distinct header fill colors
  const fillColors = [];
  const getHeaderStyleIdx = (fillHex = '1E3A8A', fontHex = 'FFFFFF') => {
    const key = `${fillHex}_${fontHex}`;
    if (styleIndexMap.has(key)) return styleIndexMap.get(key);
    const fillIdx = 2 + fillColors.length;
    fillColors.push({ fillHex: fillHex.replace('#', '').toUpperCase(), fontHex: fontHex.replace('#', '').toUpperCase() });
    const xfIdx = 1 + uniqueStyles.length;
    uniqueStyles.push({ fillIdx, fontHex: fontHex.replace('#', '').toUpperCase(), bold: true });
    styleIndexMap.set(key, xfIdx);
    return xfIdx;
  };

  columns.forEach((col) => {
    getHeaderStyleIdx(col.fillHex || '1E3A8A', col.fontColorHex || 'FFFFFF');
  });

  const bannerStyleIdx = getHeaderStyleIdx('FFFFFF', '1E3A8A');

  const fontsXml = [
    '<font><sz val="11"/><name val="Calibri"/></font>',
    ...uniqueStyles.map((s) => `<font><b/><sz val="11"/><color rgb="FF${s.fontHex}"/><name val="Calibri"/></font>`),
  ];

  const fillsXml = [
    '<fill><patternFill patternType="none"/></fill>',
    '<fill><patternFill patternType="gray125"/></fill>',
    ...fillColors.map((f) => `<fill><patternFill patternType="solid"><fgColor rgb="FF${f.fillHex}"/><bgColor indexed="64"/></patternFill></fill>`),
  ];

  const cellXfsXml = [
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>',
    ...uniqueStyles.map(
      (s, i) => `<xf numFmtId="0" fontId="${i + 1}" fillId="${s.fillIdx}" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>`
    ),
  ];

  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="${fontsXml.length}">${fontsXml.join('')}</fonts>
  <fills count="${fillsXml.length}">${fillsXml.join('')}</fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border><left style="thin"><color rgb="FF000000"/></left><right style="thin"><color rgb="FF000000"/></right><top style="thin"><color rgb="FF000000"/></top><bottom style="thin"><color rgb="FF000000"/></bottom><diagonal/></border>
  </borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="${cellXfsXml.length}">${cellXfsXml.join('')}</cellXlsPlaceholder>
</styleSheet>`.replace('</cellXlsPlaceholder>', '</cellXfs>');

  const sheetRowsXml = [];
  let rowNum = 1;

  for (const banner of topBannerRows) {
    sheetRowsXml.push(buildInlineRowXml(rowNum++, [banner], bannerStyleIdx));
  }
  if (topBannerRows.length > 0) {
    rowNum++; // blank spacer row
  }

  // Header row
  const headerCells = columns.map((col, idx) => {
    const sIdx = getHeaderStyleIdx(col.fillHex || '1E3A8A', col.fontColorHex || 'FFFFFF');
    const ref = `${colIndexToLetters(idx)}${rowNum}`;
    return `<c r="${ref}" s="${sIdx}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(col.header)}</t></is></c>`;
  });
  sheetRowsXml.push(`<row r="${rowNum++}">${headerCells.join('')}</row>`);

  // Data rows
  for (const r of rows) {
    sheetRowsXml.push(buildInlineRowXml(rowNum++, r));
  }

  const colWidths = columns
    .map((c, i) => `<col min="${i + 1}" max="${i + 1}" width="${Math.max(14, Math.min(42, String(c.header || '').length + 4))}" customWidth="1"/>`)
    .join('');

  const sheetXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <cols>${colWidths}</cols>
  <sheetData>${sheetRowsXml.join('')}</sheetData>
</worksheet>`;

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`;

  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="${safeSheet}" sheetId="1" r:id="rId1"/></sheets>
</workbook>`;

  const workbookRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

  return writeZipEntries([
    { name: '[Content_Types].xml', rawBytes: textEncoder.encode(contentTypesXml) },
    { name: '_rels/.rels', rawBytes: textEncoder.encode(rootRelsXml) },
    { name: 'xl/workbook.xml', rawBytes: textEncoder.encode(workbookXml) },
    { name: 'xl/_rels/workbook.xml.rels', rawBytes: textEncoder.encode(workbookRelsXml) },
    { name: 'xl/styles.xml', rawBytes: textEncoder.encode(stylesXml) },
    { name: 'xl/worksheets/sheet1.xml', rawBytes: textEncoder.encode(sheetXml) },
  ]);
}

/**
 * Mengurai file .xlsx menjadi matriks array string 2D untuk sheet tertentu (default "Format Isian").
 */
export async function parseXlsxBuffer(arrayBuffer, preferredSheetName = 'Format Isian') {
  const entries = await readZipEntries(arrayBuffer);
  const entriesMap = new Map(entries.map((e) => [e.name, e]));

  // Baca sharedStrings.xml jika ada
  const sharedStrings = [];
  if (entriesMap.has('xl/sharedStrings.xml')) {
    const ssXml = textDecoder.decode(await entriesMap.get('xl/sharedStrings.xml').getData());
    const siRegex = /<si\b[^>]*>([\s\S]*?)<\/si>/g;
    let m;
    while ((m = siRegex.exec(ssXml)) !== null) {
      const tMatches = m[1].match(/<t(?:\s+[^>]*)?>([\s\S]*?)<\/t>/g) || [];
      const text = tMatches
        .map((t) => unescapeXml(t.replace(/<t(?:\s+[^>]*)?>/, '').replace(/<\/t>$/, '')))
        .join('');
      sharedStrings.push(text);
    }
  }

  const wbText = entriesMap.has('xl/workbook.xml')
    ? textDecoder.decode(await entriesMap.get('xl/workbook.xml').getData())
    : '';
  const relsText = entriesMap.has('xl/_rels/workbook.xml.rels')
    ? textDecoder.decode(await entriesMap.get('xl/_rels/workbook.xml.rels').getData())
    : '';

  const sheetPath = resolveSheetPath(entriesMap, wbText, relsText, preferredSheetName);
  if (!sheetPath) {
    throw new Error('Tidak ditemukan worksheet yang valid di dalam file .xlsx.');
  }

  const sheetXml = textDecoder.decode(await entriesMap.get(sheetPath).getData());
  const rowsMatrix = [];

  const rowRegex = /<row\b([^>]*)>([\s\S]*?)<\/row>/g;
  let rMatch;
  while ((rMatch = rowRegex.exec(sheetXml)) !== null) {
    const rowAttrs = rMatch[1];
    const rowBody = rMatch[2];
    const rNumMatch = rowAttrs.match(/\br="(\d+)"/);
    const rowIdx = rNumMatch ? parseInt(rNumMatch[1], 10) - 1 : rowsMatrix.length;
    while (rowsMatrix.length <= rowIdx) rowsMatrix.push([]);

    const cellRegex = /<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g;
    let cMatch;
    while ((cMatch = cellRegex.exec(rowBody)) !== null) {
      const cAttrs = cMatch[1];
      const cInner = cMatch[2] || '';
      const refMatch = cAttrs.match(/\br="([A-Z]+)\d+"/);
      if (!refMatch) continue;
      const colIdx = colLettersToIndex(refMatch[1]);
      const typeMatch = cAttrs.match(/\bt="([^"]+)"/);
      const cellType = typeMatch ? typeMatch[1] : '';

      let value = '';
      if (cellType === 'inlineStr') {
        const tMatches = cInner.match(/<t(?:\s+[^>]*)?>([\s\S]*?)<\/t>/g) || [];
        value = tMatches
          .map((t) => unescapeXml(t.replace(/<t(?:\s+[^>]*)?>/, '').replace(/<\/t>$/, '')))
          .join('');
      } else {
        const vMatch = cInner.match(/<v>([\s\S]*?)<\/v>/);
        if (vMatch) {
          const rawVal = unescapeXml(vMatch[1]);
          if (cellType === 's') {
            const ssIdx = parseInt(rawVal, 10);
            value = sharedStrings[ssIdx] ?? '';
          } else {
            value = rawVal;
          }
        }
      }

      const targetRow = rowsMatrix[rowIdx];
      while (targetRow.length <= colIdx) targetRow.push('');
      targetRow[colIdx] = String(value).trim();
    }
  }

  return rowsMatrix.filter((r) => r.some((cell) => cell !== ''));
}

