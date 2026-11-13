'use strict';
/* =====================================================================
   PDF Studio Pro — app shell & document-level tools
   ===================================================================== */
const IC = {
  open:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  undo:'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  redo:'<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',
  download:'<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
  pages:'<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="9" rx="1"/><rect x="3" y="15" width="7" height="6" rx="1"/><rect x="14" y="15" width="7" height="6" rx="1"/>',
  split:'<path d="M14 3h7v7"/><path d="M10 21H3v-7"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/>',
  edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z"/>',
  convert:'<path d="M4 7h13l-3-3"/><path d="M20 17H7l3 3"/>',
  water:'<path d="M12 2.7 6.3 9a7 7 0 1 0 11.4 0z"/>',
  num:'<path d="M4 9h16"/><path d="M4 15h16"/><path d="M10 3 8 21"/><path d="M16 3l-2 18"/>',
  compress:'<path d="M4 14h6v6"/><path d="M20 10h-6V4"/><path d="M14 10l7-7"/><path d="M3 21l7-7"/>',
  lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  unlock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/>',
  rotL:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  rotR:'<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
  trash:'<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/>',
  left:'<path d="m15 18-6-6 6-6"/>', right:'<path d="m9 18 6-6-6-6"/>', down:'<path d="m6 9 6 6 6-6"/>',
  plus:'<path d="M12 5v14"/><path d="M5 12h14"/>',
  file:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
  check:'<path d="M20 6 9 17l-5-5"/>', x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  cursor:'<path d="m4 4 7 17 2.5-7.5L21 11z"/>',
  text:'<path d="M5 6V4h14v2"/><path d="M12 4v16"/><path d="M9 20h6"/>',
  textEdit:'<path d="M4 7V5h11v2"/><path d="M9.5 5v12"/><path d="M7 17h5"/><path d="m14 19 5.5-5.5a1.5 1.5 0 0 0-2-2L12 17v2z"/>',
  pen:'<path d="M3 21c3-1 5-3 7-6l7-7a2 2 0 0 0-3-3l-7 7c-3 2-5 4-6 7z"/>',
  hl:'<path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/>',
  rect:'<rect x="3" y="5" width="18" height="14" rx="1"/>', ellipse:'<ellipse cx="12" cy="12" rx="9" ry="7"/>',
  line:'<path d="M5 19 19 5"/>', arrow:'<path d="M5 19 19 5"/><path d="M10 5h9v9"/>',
  white:'<path d="m7 21-4-4L14 6l7 7-8 8z"/><path d="M5 13l6 6"/><path d="M13 21h8"/>',
  redact:'<rect x="3" y="8" width="18" height="8" rx="1" fill="currentColor"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  sign:'<path d="M3 17c3-6 5-9 7-9s-1 8 1 8 3-4 4-4 1 3 3 3 3-1 3-1"/><path d="M3 21h18"/>',
  stamp:'<path d="M5 22h14"/><path d="M19.3 14.7H4.7a1.7 1.7 0 0 0-1.7 1.7V19h18v-2.6a1.7 1.7 0 0 0-1.7-1.7z"/><path d="M14 14.7V11a4 4 0 1 0-4 0v3.7"/>',
  zin:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/><path d="M11 8v6M8 11h6"/>',
  zout:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/><path d="M8 11h6"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  shield:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>',
  merge:'<path d="M8 3v5a4 4 0 0 0 4 4 4 4 0 0 1 4 4v5"/><path d="M16 3v5a4 4 0 0 1-4 4"/>',
  reverse:'<path d="M7 4v16"/><path d="m3 8 4-4 4 4"/><path d="M17 20V4"/><path d="m13 16 4 4 4-4"/>',
  copy:'<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
  crop:'<path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/>',
  form:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h4M7 13h10M7 17h6"/><rect x="14" y="7.5" width="3" height="3"/>',
  ocr:'<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
  header:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 8h18M3 16h18"/>',
  moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  bold:'<path d="M6 4h7a4 4 0 0 1 0 8H6z"/><path d="M6 12h8a4 4 0 0 1 0 8H6z"/>',
  italic:'<path d="M19 4h-9M14 20H5M15 4 9 20"/>', underline:'<path d="M6 4v6a6 6 0 0 0 12 0V4"/><path d="M4 21h16"/>',
  strike:'<path d="M16 4H9a3 3 0 0 0-2.8 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><path d="M4 12h16"/>',
  alL:'<path d="M4 6h16M4 12h10M4 18h14"/>', alC:'<path d="M4 6h16M7 12h10M5 18h14"/>', alR:'<path d="M4 6h16M10 12h10M6 18h14"/>',
  mark:'<path d="m4 12 5 5L20 6"/>', layers:'<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
  grid:'<rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/>',
  word:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="m8 12 1.5 6L12 13l2.5 5L16 12"/>',
  sidebar:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>',
  front:'<rect x="8" y="8" width="13" height="13" rx="1" fill="currentColor"/><path d="M4 16V4h12"/>',
  back:'<rect x="3" y="3" width="13" height="13" rx="1"/><path d="M20 8v12H8" />',
  dup:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
};
const icon = (n, s = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${s}>${IC[n] || ''}</svg>`;

/* ================= STATE ================= */
const S = { bytes: null, name: '', pdf: null, ver: 0, history: [], redo: [], tool: 'home', wasLocked: false, sizes: [] };
const main = document.getElementById('main');
const baseName = () => (S.name || 'document.pdf').replace(/\.pdf$/i, '');
async function loadCur() { return PDFDocument.load(S.bytes, { updateMetadata: false }); }

async function setDoc(bytes, name, { history = true } = {}) {
  if (history && S.bytes) { S.history.push({ bytes: S.bytes, name: S.name }); if (S.history.length > 20) S.history.shift(); S.redo = []; }
  S.bytes = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  S.name = name || S.name || 'document.pdf';
  S.ver++;
  if (S.pdf) { try { S.pdf.destroy(); } catch (e) { } }
  S.pdf = await pdfjsLib.getDocument({ data: S.bytes.slice(), isEvalSupported: false, useSystemFonts: true }).promise;
  S.sizes = [];
  for (let i = 1; i <= S.pdf.numPages; i++) { const v = (await S.pdf.getPage(i)).getViewport({ scale: 1 }); S.sizes.push([v.width, v.height]); }
  thumbs.clear(); ORG = null; TEXTLINES.clear(); if (typeof resetEdit === 'function') resetEdit();
  updateHeader();
  if (S.tool === 'home') S.tool = 'edit';
  renderTool();
}
function updateHeader() {
  const has = !!S.bytes;
  $('#docinfo').innerHTML = has ? `<b title="${esc(S.name)}">${esc(S.name)}</b><span class="chip">${S.pdf.numPages} หน้า</span><span class="chip sz">${fmtSize(S.bytes.length)}</span>${S.wasLocked ? `<span class="chip ok">${icon('unlock', 'width="12" height="12"')} ปลดล็อกแล้ว</span>` : ''}` : '<span class="muted">ยังไม่ได้เปิดไฟล์</span>';
  $('#bSave').disabled = !has; $('#bUndo').disabled = !S.history.length; $('#bRedo').disabled = !S.redo.length;
}
async function openFiles(files, mode = 'ask') {
  files = [...files]; if (!files.length) return;
  if (mode === 'ask' && S.bytes) {
    mode = await modal({ title: 'เปิดไฟล์', body: `<p style="margin:0;color:var(--ink2)">ต้องการเปิด ${files.length} ไฟล์นี้แทนไฟล์ปัจจุบัน หรือรวมเข้ากับไฟล์ปัจจุบัน?</p>`,
      buttons: [{ label: 'ยกเลิก', value: null }, { label: 'รวมต่อท้าย', value: 'append' }, { label: 'เปิดแทน', value: 'replace', pri: true }] });
    if (!mode) return;
  }
  try {
    busy(true, 'กำลังเปิดไฟล์…'); await tick();
    if (mode === 'append' && S.bytes) {
      await commitPending();
      const cur = await loadCur(); const r = await filesToPdf(files); const add = await PDFDocument.load(r.bytes);
      const pages = await cur.copyPages(add, add.getPageIndices());
      let at = cur.getPageCount();
      if (ORG_INSERT_AT != null) { at = clamp(ORG_INSERT_AT, 0, at); }
      pages.forEach((p, i) => cur.insertPage(at + i, p)); ORG_INSERT_AT = null;
      await setDoc(await cur.save(), S.name);
      toast(`รวม ${r.pages} หน้าเรียบร้อย`, 'ok');
    } else {
      await discardPending();
      const r = await filesToPdf(files);
      const first = files[0].name.replace(/\.[^.]+$/, '');
      S.wasLocked = r.wasLocked; S.history = []; S.redo = [];
      await setDoc(r.bytes, (files.length > 1 ? first + '_รวม' : first) + '.pdf', { history: false });
      if (r.wasLocked) toast('ปลดล็อกไฟล์เรียบร้อย', 'ok');
    }
  } catch (e) { if (e.message !== 'CANCEL') { console.error(e); toast(e.message || String(e), 'err'); } }
  finally { busy(false); }
}
let ORG_INSERT_AT = null;

/* ---------- thumbnails ---------- */
const thumbs = new Map(); let thumbQ = Promise.resolve();
function thumb(i, width = 170) {
  const key = S.ver + ':' + i + ':' + width; if (thumbs.has(key)) return thumbs.get(key);
  const ver = S.ver;
  const p = thumbQ = thumbQ.catch(() => { }).then(async () => {
    if (ver !== S.ver) return '';
    const page = await S.pdf.getPage(i + 1); const v1 = page.getViewport({ scale: 1 });
    const vp = page.getViewport({ scale: width * DPR / v1.width });
    const c = document.createElement('canvas'); c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height);
    await page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
    return c.toDataURL('image/jpeg', 0.82);
  });
  thumbs.set(key, p); return p;
}
const io = new IntersectionObserver(ents => ents.forEach(en => {
  if (!en.isIntersecting) return; const img = en.target; io.unobserve(img); const ver = S.ver;
  thumb(+img.dataset.pg, +img.dataset.w || 170).then(u => { if (ver === S.ver && u) img.src = u; });
}), { rootMargin: '400px' });
async function renderPageTo(canvas, i, width) {
  const page = await S.pdf.getPage(i + 1); const v1 = page.getViewport({ scale: 1 });
  const scale = width / v1.width; const vp = page.getViewport({ scale: scale * DPR });
  canvas.width = Math.ceil(vp.width); canvas.height = Math.ceil(vp.height);
  canvas.style.width = (vp.width / DPR) + 'px'; canvas.style.height = (vp.height / DPR) + 'px';
  await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
  return { W: v1.width, H: v1.height, scale };
}
const TEXTLINES = new Map();
async function getTextLines(pi) { const k = S.ver + ':' + pi; if (!TEXTLINES.has(k)) TEXTLINES.set(k, pageTextLines(await S.pdf.getPage(pi + 1))); return TEXTLINES.get(k); }

/* ================= FONT PICKER ================= */
function fontLabel(file) { return FONT_NAME[file] || file; }
function fontPickerHTML(id, value) {
  return `<button type="button" class="fp-btn" id="${id}" data-font="${value}"><span class="fp-name">${esc(fontLabel(value))}</span>${icon('down', 'width="14" height="14"')}</button>`;
}
function wireFontPicker(id, onChange) {
  const btn = document.getElementById(id); if (!btn) return;
  const setBtn = f => { btn.dataset.font = f; const n = $('.fp-name', btn); n.textContent = fontLabel(f);
    loadFaceData(f + '-Regular').then(d => { n.style.fontFamily = `"${d.css}", var(--thai)`; n.style.fontSize = /^THSarabun/.test(f) ? '19px' : ''; }).catch(() => { }); };
  setBtn(btn.dataset.font);
  btn.onclick = e => {
    e.stopPropagation(); closeFontPop();
    const pop = document.createElement('div'); pop.className = 'fp-pop'; pop.id = 'fpPop';
    pop.innerHTML = `<input class="inp" placeholder="ค้นหาฟอนต์…" id="fpQ"><div class="fp-list">${FONT_CATS.map(([cat, list]) => `<div class="fp-cat">${cat}</div>` +
      list.map(([n, f]) => `<div class="fp-row ${f === btn.dataset.font ? 'on' : ''}" data-f="${f}" data-n="${n.toLowerCase()}"><div class="fp-nm">${esc(n)}<span class="fp-st">${(FONT_FILES[f].includes('B') ? '<b>B</b>' : '') + (FONT_FILES[f].includes('I') ? '<i>I</i>' : '')}</span></div><div class="fp-sm">สวัสดีครับ ภาษาไทย ที่นี่ ปู่ ฎีกา 123 Aa</div></div>`).join('')).join('')}</div>`;
    document.body.appendChild(pop);
    const r = btn.getBoundingClientRect(); const ph = Math.min(440, innerHeight - 40);
    pop.style.left = clamp(r.left, 8, innerWidth - 340) + 'px'; pop.style.maxHeight = ph + 'px';
    pop.style.top = (r.bottom + 6 + ph > innerHeight ? Math.max(8, r.top - ph - 6) : r.bottom + 6) + 'px';
    const fio = new IntersectionObserver(ents => ents.forEach(en => { if (!en.isIntersecting) return; fio.unobserve(en.target);
      const f = en.target.dataset.f; loadFaceData(f + '-Regular').then(d => { const sm = $('.fp-sm', en.target); sm.style.fontFamily = d.css; if (/^THSarabun/.test(f)) sm.style.fontSize = '25px'; }).catch(() => { }); }), { root: $('.fp-list', pop) });
    $$('.fp-row', pop).forEach(row => { fio.observe(row); row.onclick = () => { setBtn(row.dataset.f); closeFontPop(); onChange(row.dataset.f); }; });
    $('#fpQ', pop).oninput = ev => { const q = ev.target.value.toLowerCase(); $$('.fp-row', pop).forEach(r => r.style.display = r.dataset.n.includes(q) ? '' : 'none'); };
    pop.addEventListener('pointerdown', ev => ev.stopPropagation());
    setTimeout(() => $('#fpQ', pop).focus(), 20);
    const on = $('.fp-row.on', pop); if (on) on.scrollIntoView({ block: 'center' });
  };
}
function closeFontPop() { const p = $('#fpPop'); if (p) p.remove(); }
document.addEventListener('pointerdown', closeFontPop);

/* ================= NAV ================= */
const TOOLS = [
  ['g', 'แก้ไข'],
  ['edit', 'edit', 'แก้ไข / เขียน / เซ็น', 'แก้ข้อความเดิม พิมพ์ไทย วาด เซ็น ตราประทับ'],
  ['forms', 'form', 'กรอกฟอร์ม', 'กรอกช่องฟอร์ม PDF ภาษาไทยสมบูรณ์'],
  ['watermark', 'water', 'ลายน้ำ', 'ข้อความ/โลโก้ ปรับมุม ความจาง'],
  ['header', 'header', 'หัว-ท้ายกระดาษ & เลขหน้า', 'เลขหน้า วันที่ ชื่อไฟล์'],
  ['g', 'จัดการหน้า'],
  ['organize', 'pages', 'จัดเรียง / รวมไฟล์', 'ลากสลับ หมุน ลบ ทำสำเนา รวมไฟล์'],
  ['split', 'split', 'แยกไฟล์ / ดึงหน้า', 'ทุกหน้า ตามช่วง ทุก N หน้า'],
  ['crop', 'crop', 'ครอป / ขนาดหน้า / N-up', 'ตัดขอบอัตโนมัติ ปรับเป็น A4 หลายหน้าต่อแผ่น'],
  ['g', 'แปลง & ปรับแต่ง'],
  ['convert', 'convert', 'แปลงไฟล์', 'PDF ⇄ รูป, PDF → Word, ข้อความ'],
  ['ocr', 'ocr', 'OCR สแกนเป็นข้อความ', 'ไทย+อังกฤษ ทำ PDF ค้นหาได้'],
  ['compress', 'compress', 'บีบอัดขนาดไฟล์', 'ลดขนาดก่อนส่งอีเมล'],
  ['g', 'ความปลอดภัย'],
  ['lock', 'lock', 'ล็อก / ปลดล็อก', 'รหัสผ่าน AES-256 จำกัดสิทธิ์'],
  ['props', 'info', 'ข้อมูลเอกสาร', 'ชื่อเรื่อง ผู้เขียน คำค้น'],
];
function renderNav() {
  $('#nav').innerHTML = TOOLS.map(t => t[0] === 'g' ? `<div class="grp">${t[1]}</div>` :
    `<button class="tool ${S.tool === t[0] ? 'act' : ''}" data-t="${t[0]}" title="${esc(t[3])}">${icon(t[1])}<span>${t[2]}</span></button>`).join('');
  $$('#nav .tool').forEach(b => b.onclick = () => go(b.dataset.t));
}
async function go(tool) {
  if (tool === S.tool) return;
  try { await commitPending(); } catch (e) { busy(false); toast(e.message, 'err'); return; }
  S.tool = tool; renderTool(); main.scrollTop = 0;
}
function renderTool() {
  renderNav(); closeFontPop();
  document.body.classList.toggle('editing', S.tool === 'edit' && !!S.bytes);
  const needDoc = !['convert', 'lock', 'home'].includes(S.tool);
  if (!S.bytes && (needDoc || S.tool === 'home')) return renderHome();
  const R = { organize: renderOrganize, split: renderSplit, edit: renderEdit, watermark: renderWatermark, header: renderHeader, crop: renderCrop,
    convert: renderConvert, compress: renderCompress, lock: renderLock, props: renderProps, forms: renderForms, ocr: renderOCR };
  (R[S.tool] || renderHome)();
}
function dropZone(text = 'ลากไฟล์ PDF หรือรูปภาพมาวางที่นี่') {
  return `<div class="drop" id="drop"><div class="big">${icon('file')}</div><h3>${text}</h3>
    <p class="sub" style="margin:0 0 14px">หรือ</p><button class="btn pri lg">${icon('open')} เลือกไฟล์จากเครื่อง</button>
    <p class="hint" style="margin-top:14px">PDF (รวมไฟล์ที่ติดรหัสผ่าน) · JPG · PNG · WEBP — เลือกหลายไฟล์เพื่อรวมเป็นไฟล์เดียว</p></div>`;
}
function wireDrop(cb = files => openFiles(files, 'replace')) {
  const d = $('#drop'); if (!d) return;
  d.onclick = async () => { const f = await pickFiles(); if (f.length) cb(f); };
  d.ondragover = e => { e.preventDefault(); e.stopPropagation(); d.classList.add('over'); };
  d.ondragleave = () => d.classList.remove('over');
  d.ondrop = e => { e.preventDefault(); e.stopPropagation(); d.classList.remove('over'); cb(e.dataTransfer.files); };
}
function renderHome() {
  const t = TOOLS.find(x => x[0] === S.tool);
  main.innerHTML = `<div class="wrap">
    <div class="hero"><div><h1>${S.tool === 'home' || !t ? 'จัดการและแก้ไข PDF แบบมืออาชีพ' : esc(t[2])}</h1>
    <p class="sub">${S.tool === 'home' || !t ? 'ภาษาไทยสระ-วรรณยุกต์ไม่ลอย · ฟอนต์ไทย 33 ตระกูล หนา/เอียงครบ · ประมวลผลในเครื่องคุณ 100%' : 'เปิดไฟล์ PDF ก่อนเพื่อใช้เครื่องมือนี้'}</p></div></div>
    ${dropZone()}
    <div class="privacy">${icon('shield', 'width="15" height="15"')} ไฟล์ไม่ถูกอัปโหลดไปที่ใด ทุกอย่างทำงานในเบราว์เซอร์ของคุณ</div>
    <div class="feat">${TOOLS.filter(x => x[0] !== 'g').map(f => `<div class="f" data-t="${f[0]}">${icon(f[1])}<div><b>${f[2]}</b><span>${f[3]}</span></div></div>`).join('')}</div>
  </div>`;
  wireDrop();
  $$('.feat .f').forEach(f => f.onclick = () => { S.tool = f.dataset.t; renderTool(); });
}
function previewCtl(id) { return `<div class="row" style="justify-content:center;margin-bottom:10px"><button class="btn sm" id="${id}P">${icon('left')}</button><span class="hint" id="${id}N" style="min-width:80px;text-align:center"></span><button class="btn sm" id="${id}X">${icon('right')}</button></div>`; }
async function previewWith(canvas, pi, width, drawFn) {
  const info = await renderPageTo(canvas, pi, width);
  const g = canvas.getContext('2d'); g.save(); g.scale(info.scale * DPR, info.scale * DPR); await drawFn(g, info.W, info.H, pi); g.restore();
}

/* ================= ORGANIZE ================= */
let ORG = null; let orgUid = 0;
function orgInit() { if (ORG && ORG.ver === S.ver) return; ORG = { ver: S.ver, items: [...Array(S.pdf.numPages).keys()].map(i => ({ id: ++orgUid, src: i, rot: 0 })), sel: new Set(), dirty: false, size: ORG?.size || 170 }; }
function renderOrganize() {
  orgInit();
  main.innerHTML = `<div class="wrap wide">
    <h2>จัดเรียง / รวมไฟล์</h2><p class="sub">คลิกเลือกหน้า (Shift = เลือกเป็นช่วง) · ลากเพื่อย้าย · เพิ่มไฟล์เพื่อรวม (แทรกหลังหน้าที่เลือก)</p>
    <div class="tbar">
      <button class="btn pri" id="oAdd">${icon('merge')} เพิ่มไฟล์ (รวม)</button>
      <button class="btn" id="oBlank">${icon('plus')} หน้าว่าง</button><span class="sep"></span>
      <button class="btn" id="oAll">เลือกทั้งหมด</button><button class="btn" id="oNone">ไม่เลือก</button><span class="sep"></span>
      <button class="btn" id="oRotL" title="หมุนซ้าย">${icon('rotL')}</button><button class="btn" id="oRotR" title="หมุนขวา">${icon('rotR')}</button>
      <button class="btn" id="oDup">${icon('dup')} สำเนา</button><button class="btn" id="oDel">${icon('trash')} ลบ</button>
      <button class="btn" id="oExt">${icon('download')} ดาวน์โหลดหน้าที่เลือก</button><button class="btn" id="oRev">${icon('reverse')} กลับลำดับ</button>
      <span style="flex:1"></span><input type="range" id="oSz" min="110" max="300" value="${ORG.size}" style="width:110px" title="ขนาดภาพย่อ"><span class="hint" id="oSelN"></span>
    </div><div id="oBanner"></div><div class="pgrid" id="pgrid"></div></div>`;
  drawOrgGrid();
  $('#oSz').oninput = e => { ORG.size = +e.target.value; $('#pgrid').style.setProperty('--ps', ORG.size + 'px'); };
  $('#pgrid').style.setProperty('--ps', ORG.size + 'px');
  $('#oAdd').onclick = async () => { const f = await pickFiles(); if (!f.length) return;
    const lastSel = ORG.sel.size ? Math.max(...[...ORG.sel].map(id => ORG.items.findIndex(x => x.id === id))) : -1;
    ORG_INSERT_AT = lastSel >= 0 ? lastSel + 1 : null; openFiles(f, 'append'); };
  $('#oBlank').onclick = () => {
    const at = ORG.sel.size ? Math.max(...[...ORG.sel].map(id => ORG.items.findIndex(x => x.id === id))) + 1 : ORG.items.length;
    const ref = ORG.items[Math.max(0, at - 1)]; let sz = ref ? (ref.blank || S.sizes[ref.src]) : [595.28, 841.89];
    if (ref && !ref.blank && ref.rot % 180) sz = [sz[1], sz[0]];
    ORG.items.splice(at, 0, { id: ++orgUid, blank: [sz[0], sz[1]], rot: 0 }); orgDirty();
  };
  $('#oAll').onclick = () => { ORG.items.forEach(it => ORG.sel.add(it.id)); drawOrgGrid(); };
  $('#oNone').onclick = () => { ORG.sel.clear(); drawOrgGrid(); };
  const selItems = () => ORG.items.filter(it => ORG.sel.has(it.id));
  const need = () => { if (!ORG.sel.size) { toast('เลือกหน้าก่อน (คลิกที่หน้า)'); return false; } return true; };
  $('#oRotL').onclick = () => { if (need()) { selItems().forEach(it => it.rot = norm(it.rot - 90)); orgDirty(); } };
  $('#oRotR').onclick = () => { if (need()) { selItems().forEach(it => it.rot = norm(it.rot + 90)); orgDirty(); } };
  $('#oDup').onclick = () => { if (!need()) return; const out = []; ORG.items.forEach(it => { out.push(it); if (ORG.sel.has(it.id)) out.push({ ...it, id: ++orgUid }); }); ORG.items = out; orgDirty(); };
  $('#oDel').onclick = () => { if (!need()) return; if (ORG.sel.size >= ORG.items.length) return toast('ต้องเหลืออย่างน้อย 1 หน้า', 'err'); ORG.items = ORG.items.filter(it => !ORG.sel.has(it.id)); ORG.sel.clear(); orgDirty(); };
  $('#oRev').onclick = () => { ORG.items.reverse(); orgDirty(); };
  $('#oExt').onclick = async () => { if (!need()) return; try { busy(true, 'กำลังสร้างไฟล์…'); const b = await buildOrg(selItems()); busy(false); await saveFile(b, baseName() + '_pages.pdf'); } catch (e) { busy(false); toast(e.message, 'err'); } };
}
function orgDirty() { ORG.dirty = true; drawOrgGrid(); }
let orgLastClick = null;
function drawOrgGrid() {
  const g = $('#pgrid'); if (!g) return;
  $('#oSelN').textContent = ORG.sel.size ? `เลือก ${ORG.sel.size} หน้า` : `${ORG.items.length} หน้า`;
  $('#oBanner').innerHTML = ORG.dirty ? `<div class="banner" style="margin-bottom:12px">${icon('edit', 'width="16" height="16"')}<span style="flex:1">มีการเปลี่ยนแปลงที่ยังไม่บันทึก (บันทึกอัตโนมัติเมื่อดาวน์โหลดหรือเปลี่ยนเครื่องมือ)</span><button class="btn sm" id="oCancel">ยกเลิก</button><button class="btn sm pri" id="oApply">${icon('check')} บันทึก</button></div>` : '';
  if (ORG.dirty) { $('#oApply').onclick = () => commitOrg().catch(e => toast(e.message, 'err')); $('#oCancel').onclick = () => { ORG = null; renderOrganize(); }; }
  const selOrder = ORG.items.filter(it => ORG.sel.has(it.id)).map(it => it.id);
  g.innerHTML = ORG.items.map((it, k) => `
    <div class="pcard ${ORG.sel.has(it.id) ? 'sel' : ''}" draggable="true" data-id="${it.id}">
      <div class="pbadge">${selOrder.indexOf(it.id) + 1}</div>
      <div class="pthumb">${it.blank ? `<div class="blank" style="aspect-ratio:${it.blank[0]}/${it.blank[1]}"></div>` :
        `<img data-pg="${it.src}" data-w="200" style="transform:rotate(${it.rot}deg) ${it.rot % 180 ? 'scale(.72)' : ''}" alt="">`}</div>
      <div class="pfoot"><span>${k + 1}${it.blank ? ' · ว่าง' : (it.src !== k ? ` <span class="hint">(เดิม ${it.src + 1})</span>` : '')}</span>
        <span class="pacts"><button data-a="l" title="เลื่อนซ้าย">${icon('left')}</button><button data-a="r" title="เลื่อนขวา">${icon('right')}</button><button data-a="rot" title="หมุน">${icon('rotR')}</button><button data-a="del" title="ลบ">${icon('trash')}</button></span></div>
    </div>`).join('');
  $$('img[data-pg]', g).forEach(img => io.observe(img));
  let dragId = null;
  $$('.pcard', g).forEach(card => {
    const id = +card.dataset.id; const idx = () => ORG.items.findIndex(x => x.id === id);
    card.onclick = e => {
      const a = e.target.closest('button')?.dataset.a;
      if (a) { e.stopPropagation(); const i = idx(); const it = ORG.items[i];
        if (a === 'rot') it.rot = norm(it.rot + 90);
        if (a === 'del') { if (ORG.items.length <= 1) return toast('ต้องเหลืออย่างน้อย 1 หน้า', 'err'); ORG.items.splice(i, 1); ORG.sel.delete(id); }
        if (a === 'l' && i > 0) [ORG.items[i - 1], ORG.items[i]] = [ORG.items[i], ORG.items[i - 1]];
        if (a === 'r' && i < ORG.items.length - 1) [ORG.items[i + 1], ORG.items[i]] = [ORG.items[i], ORG.items[i + 1]];
        return orgDirty(); }
      if (e.shiftKey && orgLastClick != null) { const a1 = ORG.items.findIndex(x => x.id === orgLastClick), b1 = idx(); for (let k = Math.min(a1, b1); k <= Math.max(a1, b1); k++) ORG.sel.add(ORG.items[k].id); }
      else ORG.sel.has(id) ? ORG.sel.delete(id) : ORG.sel.add(id);
      orgLastClick = id; drawOrgGrid();
    };
    card.ondragstart = e => { dragId = id; card.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(id)); };
    card.ondragend = () => { card.classList.remove('dragging'); $$('.pcard', g).forEach(c => c.classList.remove('dropL', 'dropR')); };
    card.ondragover = e => { if (dragId == null) return; e.preventDefault(); e.stopPropagation(); const r = card.getBoundingClientRect(); const after = e.clientX > r.left + r.width / 2; card.classList.toggle('dropR', after); card.classList.toggle('dropL', !after); };
    card.ondragleave = () => card.classList.remove('dropL', 'dropR');
    card.ondrop = e => {
      e.preventDefault(); e.stopPropagation(); if (dragId == null || dragId === id) return;
      const r = card.getBoundingClientRect(); const after = e.clientX > r.left + r.width / 2;
      const moving = ORG.sel.has(dragId) ? ORG.items.filter(x => ORG.sel.has(x.id)) : ORG.items.filter(x => x.id === dragId);
      if (moving.some(m => m.id === id)) return;
      ORG.items = ORG.items.filter(x => !moving.includes(x)); const at = ORG.items.findIndex(x => x.id === id) + (after ? 1 : 0);
      ORG.items.splice(at, 0, ...moving); dragId = null; orgDirty();
    };
  });
}
async function buildOrg(items) {
  const src = await loadCur(); const out = await PDFDocument.create();
  const real = items.filter(it => !it.blank); const copied = real.length ? await out.copyPages(src, real.map(it => it.src)) : []; let k = 0;
  for (const it of items) {
    if (it.blank) { const p = out.addPage(it.blank); if (it.rot) p.setRotation(degrees(it.rot)); }
    else { const p = out.addPage(copied[k++]); p.setRotation(degrees(norm(p.getRotation().angle + it.rot))); }
  }
  return out.save();
}
async function commitOrg() {
  if (!ORG || !ORG.dirty || ORG.ver !== S.ver) return;
  busy(true, 'กำลังบันทึกการจัดเรียง…'); await tick();
  try { const b = await buildOrg(ORG.items); await setDoc(b, S.name); toast('บันทึกการจัดเรียงแล้ว', 'ok'); } finally { busy(false); }
}

/* ================= SPLIT ================= */
function renderSplit() {
  const n = S.pdf.numPages;
  main.innerHTML = `<div class="wrap"><h2>แยกไฟล์ / ดึงหน้า</h2><p class="sub">ไฟล์นี้มี ${n} หน้า — ผลลัพธ์หลายไฟล์จะรวมเป็น ZIP</p>
    <div class="grid2"><div class="card">
      <div class="fld"><span class="lbl">วิธีแยก</span>
        <label class="chk"><input type="radio" name="sm" value="each" checked> แยกทุกหน้า (ไฟล์ละ 1 หน้า)</label>
        <label class="chk"><input type="radio" name="sm" value="every"> แยกทุก ๆ <input class="inp" id="sEvery" type="number" min="1" value="2" style="width:70px;padding:4px 8px"> หน้า</label>
        <label class="chk"><input type="radio" name="sm" value="ranges"> ตามช่วงหน้า (แต่ละช่วง = 1 ไฟล์)</label>
        <label class="chk"><input type="radio" name="sm" value="extract"> ดึงหน้าที่ระบุรวมเป็นไฟล์เดียว</label>
        <label class="chk"><input type="radio" name="sm" value="size"> แยกตามขนาดไฟล์ ไม่เกิน <input class="inp" id="sMB" type="number" min="0.2" step="0.5" value="5" style="width:70px;padding:4px 8px"> MB</label></div>
      <div class="fld" id="sRangeF"><label>ช่วงหน้า</label><input class="inp" id="sRange" placeholder="เช่น 1-3, 5, 8-${n}  หรือ  คี่ / คู่">
        <span class="hint">"5-" = หน้า 5 ถึงหน้าสุดท้าย · "5-1" = เรียงย้อนกลับ · "คี่" / "คู่" = หน้าคี่/คู่</span></div>
      <div class="row"><button class="btn pri" id="sGo">${icon('split')} แยกไฟล์และดาวน์โหลด</button><button class="btn" id="sUse">ใช้เป็นไฟล์ปัจจุบัน</button></div>
    </div><div class="card"><h3>ผลลัพธ์ที่จะได้</h3><div id="sOut" class="hint"></div></div></div></div>`;
  const mode = () => $('input[name=sm]:checked').value;
  const plan = () => {
    const m = mode();
    if (m === 'each') return [...Array(n).keys()].map(i => [i]);
    if (m === 'every') { const k = Math.max(1, parseInt($('#sEvery').value) || 1); const g = []; for (let i = 0; i < n; i += k) g.push([...Array(Math.min(k, n - i)).keys()].map(x => x + i)); return g; }
    if (m === 'size') return null;
    if (!$('#sRange').value.trim()) throw new Error('กรอกช่วงหน้า');
    return m === 'ranges' ? parseGroups($('#sRange').value, n) : [parseGroups($('#sRange').value, n).flat()];
  };
  const label = g => { const parts = []; let s = g[0], p = g[0]; for (let i = 1; i <= g.length; i++) { if (g[i] === p + 1) { p = g[i]; continue; } parts.push(s === p ? `${s + 1}` : `${s + 1}-${p + 1}`); s = p = g[i]; } return parts.join(','); };
  const fname = (g, i, tot) => tot === 1 ? `${baseName()}_หน้า${label(g)}.pdf` : `${baseName()}_${String(i + 1).padStart(String(tot).length, '0')}_p${label(g)}.pdf`;
  const upd = () => {
    const m = mode(); $('#sRangeF').style.display = (m === 'ranges' || m === 'extract') ? '' : 'none'; $('#sUse').style.display = m === 'extract' ? '' : 'none';
    if (m === 'size') { $('#sOut').innerHTML = `แบ่งไฟล์ให้แต่ละไฟล์ไม่เกิน ${esc($('#sMB').value)} MB (เหมาะกับการแนบอีเมล)`; return; }
    try { const p = plan(); $('#sOut').innerHTML = `<b style="color:var(--ink)">${p.length} ไฟล์</b><ul class="outlist">${p.slice(0, 300).map((g, i) => `<li><span>${esc(fname(g, i, p.length))}</span><span class="hint">หน้า ${label(g)} (${g.length})</span></li>`).join('')}</ul>`; }
    catch (e) { $('#sOut').innerHTML = `<span class="errtxt">${esc(e.message)}</span>`; }
  };
  $$('input[name=sm]').forEach(r => r.onchange = upd); $('#sRange').oninput = upd; $('#sEvery').oninput = upd; $('#sMB').oninput = upd;
  $('#sEvery').onfocus = () => { $('input[value=every]').checked = true; upd(); }; $('#sMB').onfocus = () => { $('input[value=size]').checked = true; upd(); };
  upd();
  const build = async () => {
    const src = await loadCur(); const files = [];
    if (mode() === 'size') {
      const lim = Math.max(0.2, +$('#sMB').value || 5) * 1048576; let cur = [], i = 0, part = 0;
      const flush = async (pages) => { const out = await PDFDocument.create(); (await out.copyPages(src, pages)).forEach(pg => out.addPage(pg)); return out.save(); };
      while (i < n) { busy(true, `กำลังคำนวณขนาด หน้า ${i + 1}/${n}…`, i / n * 100); await tick();
        const test = [...cur, i]; const b = await flush(test);
        if (b.length > lim && cur.length) { files.push({ name: `${baseName()}_part${++part}.pdf`, data: await flush(cur) }); cur = [i]; } else cur = test; i++; }
      if (cur.length) files.push({ name: `${baseName()}_part${++part}.pdf`, data: await flush(cur) });
      return files;
    }
    const p = plan();
    for (let i = 0; i < p.length; i++) { busy(true, `กำลังสร้างไฟล์ ${i + 1}/${p.length}…`, i / p.length * 100); if (i % 5 === 0) await tick();
      const out = await PDFDocument.create(); (await out.copyPages(src, p[i])).forEach(pg => out.addPage(pg)); files.push({ name: fname(p[i], i, p.length), data: await out.save() }); }
    return files;
  };
  $('#sGo').onclick = async () => { try { const f = await build(); busy(false); await saveZip(f, baseName() + '_split.zip'); } catch (e) { busy(false); toast(e.message, 'err'); } };
  $('#sUse').onclick = async () => { try { const f = await build(); await setDoc(f[0].data, S.name); busy(false); toast('เปิดหน้าที่ดึงมาเป็นไฟล์ปัจจุบันแล้ว', 'ok'); } catch (e) { busy(false); toast(e.message, 'err'); } };
}

/* ================= CROP / RESIZE / N-UP ================= */
const CR = { tab: 'crop', t: 10, r: 10, b: 10, l: 10, range: '', paper: 'a4', orient: 'auto', margin: 0, nup: 2, nupPaper: 'a4', gap: 6, border: false, pv: 0 };
function renderCrop() {
  const n = S.pdf.numPages; CR.pv = Math.min(CR.pv, n - 1);
  main.innerHTML = `<div class="wrap"><h2>ครอป / ขนาดหน้า / N-up</h2><p class="sub">ตัดขอบกระดาษ ปรับทุกหน้าให้เป็นขนาดมาตรฐาน หรือรวมหลายหน้าในแผ่นเดียวเพื่อพิมพ์ประหยัดกระดาษ</p>
  <div class="tabs">${[['crop', 'ครอป (ตัดขอบ)'], ['resize', 'ปรับขนาดกระดาษ'], ['nup', 'หลายหน้าต่อแผ่น (N-up)']].map(t => `<button class="btn ${CR.tab === t[0] ? 'on' : ''}" data-tab="${t[0]}">${t[1]}</button>`).join('')}</div>
  <div class="grid2"><div class="card" id="crBody"></div><div><div class="prev col">${previewCtl('cv')}<canvas id="cPrev"></canvas></div></div></div></div>`;
  $$('[data-tab]').forEach(b => b.onclick = () => { CR.tab = b.dataset.tab; renderCrop(); });
  const body = $('#crBody'); const mm = 72 / 25.4;
  if (CR.tab === 'crop') {
    body.innerHTML = `<div class="row" style="align-items:flex-end">${[['t', 'บน'], ['b', 'ล่าง'], ['l', 'ซ้าย'], ['r', 'ขวา']].map(([k, l]) => `<div class="fld" style="width:80px"><label>${l} (มม.)</label><input class="inp" type="number" step="1" min="0" data-k="${k}" value="${CR[k]}"></div>`).join('')}</div>
      <div class="row" style="margin-bottom:12px"><button class="btn" id="cAuto">${icon('crop')} ตัดขอบขาวอัตโนมัติ</button><span class="hint">วิเคราะห์จากหน้าที่แสดงอยู่</span></div>
      <div class="fld"><label>หน้าที่ครอป</label><input class="inp" id="cR" placeholder="ทั้งหมด" value="${esc(CR.range)}"></div>
      <button class="btn pri" id="cGo">${icon('check')} ครอปหน้า</button>`;
    $$('[data-k]', body).forEach(i => i.oninput = () => { CR[i.dataset.k] = Math.max(0, +i.value || 0); pv(); });
    $('#cR').oninput = e => CR.range = e.target.value;
    $('#cAuto').onclick = async () => {
      const page = await S.pdf.getPage(CR.pv + 1); const v1 = page.getViewport({ scale: 1 }); const sc = 1; const vp = page.getViewport({ scale: sc });
      const c = document.createElement('canvas'); c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height); const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
      await page.render({ canvasContext: g, viewport: vp }).promise; const d = g.getImageData(0, 0, c.width, c.height).data;
      let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0;
      for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) { const k = (y * c.width + x) * 4; if (d[k] < 235 || d[k + 1] < 235 || d[k + 2] < 235) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } }
      if (x1 <= x0) return toast('หน้านี้ว่างเปล่า');
      const pad = 6; CR.l = Math.max(0, Math.floor((x0 - pad) / mm)); CR.t = Math.max(0, Math.floor((y0 - pad) / mm)); CR.r = Math.max(0, Math.floor((c.width - x1 - pad) / mm)); CR.b = Math.max(0, Math.floor((c.height - y1 - pad) / mm));
      renderCrop(); toast('ตั้งค่าขอบอัตโนมัติแล้ว ตรวจดูตัวอย่างก่อนกดครอป');
    };
    $('#cGo').onclick = async () => { try {
      const pages = parseRange(CR.range, n); busy(true, 'กำลังครอป…'); const doc = await loadCur();
      for (const pi of pages) { const page = doc.getPage(pi); const G = geom(page); const m = dispMatrix(G);
        const x0 = CR.l * mm, y0 = CR.t * mm, x1 = G.W - CR.r * mm, y1 = G.H - CR.b * mm; if (x1 - x0 < 20 || y1 - y0 < 20) throw new Error('ขอบที่ตัดมากเกินไป (หน้า ' + (pi + 1) + ')');
        const a = mApply(m, x0, y0), b = mApply(m, x1, y1); const L = Math.min(a[0], b[0]), B = Math.min(a[1], b[1]);
        page.setCropBox(L, B, Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1])); }
      await setDoc(await doc.save(), S.name); busy(false); toast(`ครอป ${pages.length} หน้าแล้ว`, 'ok');
    } catch (e) { busy(false); toast(e.message, 'err'); } };
  } else if (CR.tab === 'resize') {
    body.innerHTML = `<div class="row" style="align-items:flex-end"><div class="fld"><label>ขนาดกระดาษ</label><select class="inp" id="rP">${Object.keys(PAPER).map(k => `<option value="${k}">${k.toUpperCase()}</option>`).join('')}</select></div>
      <div class="fld"><label>แนว</label><select class="inp" id="rO"><option value="auto">ตามหน้าเดิม</option><option value="port">แนวตั้ง</option><option value="land">แนวนอน</option></select></div>
      <div class="fld" style="width:100px"><label>ขอบ (มม.)</label><input class="inp" type="number" id="rM" min="0" value="${CR.margin}"></div></div>
      <p class="hint">ย่อ/ขยายเนื้อหาให้พอดีกระดาษโดยรักษาสัดส่วน ข้อความยังคงเป็นเวกเตอร์คมชัด</p><button class="btn pri" id="rGo">${icon('check')} ปรับขนาดทุกหน้า</button>`;
    $('#rP').value = CR.paper; $('#rO').value = CR.orient;
    $('#rP').onchange = e => { CR.paper = e.target.value; pv(); }; $('#rO').onchange = e => { CR.orient = e.target.value; pv(); }; $('#rM').oninput = e => { CR.margin = +e.target.value || 0; pv(); };
    $('#rGo').onclick = () => nupBuild(1).catch(e => { busy(false); toast(e.message, 'err'); });
  } else {
    body.innerHTML = `<div class="fld"><span class="lbl">จำนวนหน้าต่อแผ่น</span><div class="seg" id="nN">${[2, 4, 6, 8, 9, 16].map(k => `<button data-v="${k}">${k}</button>`).join('')}</div></div>
      <div class="row" style="align-items:flex-end"><div class="fld"><label>กระดาษ</label><select class="inp" id="nP">${Object.keys(PAPER).map(k => `<option value="${k}">${k.toUpperCase()}</option>`).join('')}</select></div>
      <div class="fld" style="width:100px"><label>ระยะห่าง (มม.)</label><input class="inp" type="number" id="nG" min="0" value="${CR.gap}"></div></div>
      <label class="chk"><input type="checkbox" id="nB" ${CR.border ? 'checked' : ''}> ตีเส้นกรอบแต่ละหน้า</label>
      <div style="margin-top:12px"><button class="btn pri" id="nGo">${icon('grid')} สร้างไฟล์ N-up</button></div>`;
    const seg = () => $$('#nN button').forEach(b => { b.classList.toggle('on', +b.dataset.v === CR.nup); b.onclick = () => { CR.nup = +b.dataset.v; seg(); pv(); }; }); seg();
    $('#nP').value = CR.nupPaper; $('#nP').onchange = e => { CR.nupPaper = e.target.value; pv(); };
    $('#nG').oninput = e => { CR.gap = +e.target.value || 0; }; $('#nB').onchange = e => CR.border = e.target.checked;
    $('#nGo').onclick = () => nupBuild(CR.nup).catch(e => { busy(false); toast(e.message, 'err'); });
  }
  const pv = () => previewWith($('#cPrev'), CR.pv, Math.min(440, main.clientWidth - 80), (g, W, H) => {
    $('#cvN').textContent = `หน้า ${CR.pv + 1} / ${n}`;
    if (CR.tab === 'crop') { g.fillStyle = 'rgba(15,23,42,.45)'; const t = CR.t * mm, b = CR.b * mm, l = CR.l * mm, r = CR.r * mm;
      g.fillRect(0, 0, W, t); g.fillRect(0, H - b, W, b); g.fillRect(0, t, l, H - t - b); g.fillRect(W - r, t, r, H - t - b);
      g.strokeStyle = '#ef4444'; g.lineWidth = 1.5; g.setLineDash([5, 4]); g.strokeRect(l, t, W - l - r, H - t - b); }
  });
  $('#cvP').onclick = () => { CR.pv = Math.max(0, CR.pv - 1); pv(); }; $('#cvX').onclick = () => { CR.pv = Math.min(n - 1, CR.pv + 1); pv(); };
  pv();
}
/* place source pages onto new sheets (k pages per sheet). k=1 → resize-to-paper */
async function nupBuild(k) {
  busy(true, 'กำลังจัดหน้า…'); await tick();
  const src = await loadCur(); const out = await PDFDocument.create(); const n = src.getPageCount(); const mm = 72 / 25.4;
  const grids = { 1: [1, 1], 2: [1, 2], 4: [2, 2], 6: [2, 3], 8: [2, 4], 9: [3, 3], 16: [4, 4] };
  const srcPages = src.getPages();
  const embedded = [];
  for (let i = 0; i < n; i++) { const G = geom(srcPages[i]); const cb = G.cb;
    embedded.push({ G, emb: await out.embedPage(srcPages[i], { left: cb.x, bottom: cb.y, right: cb.x + cb.width, top: cb.y + cb.height }) }); }
  for (let s = 0; s < n; s += k) {
    if (s % 20 === 0) { busy(true, `กำลังจัดหน้า ${s + 1}/${n}…`, s / n * 100); await tick(); }
    const first = embedded[s].G; let [pw, ph] = PAPER[k === 1 ? CR.paper : CR.nupPaper];
    let cols = grids[k][0], rows = grids[k][1];
    if (k === 1) { const land = CR.orient === 'land' || (CR.orient === 'auto' && first.W > first.H); if (land) [pw, ph] = [ph, pw]; }
    else if (k === 2 || k === 8 || k === 6) { // landscape sheet, pages side by side
      const srcLand = first.W > first.H; if (!srcLand) { [pw, ph] = [ph, pw]; [cols, rows] = [rows, cols]; } }
    const sheet = out.addPage([pw, ph]); const W = new PageWriter(out, sheet);
    const margin = k === 1 ? CR.margin * mm : 10 * mm, gap = k === 1 ? 0 : CR.gap * mm;
    const cw = (pw - margin * 2 - gap * (cols - 1)) / cols, chh = (ph - margin * 2 - gap * (rows - 1)) / rows;
    for (let j = 0; j < k && s + j < n; j++) {
      const { G, emb } = embedded[s + j]; const col = j % cols, row = Math.floor(j / cols);
      const sc = Math.min(cw / G.W, chh / G.H); const w = G.W * sc, h = G.H * sc;
      const ox = margin + col * (cw + gap) + (cw - w) / 2, oy = margin + row * (chh + gap) + (chh - h) / 2;
      const M = dispMatrix({ r: G.r, cb: { x: 0, y: 0, width: G.cb.width, height: G.cb.height } }); const Mi = mInv(M);
      const name = W.xobj(emb.ref);
      W.push('q', `${nf(sc)} 0 0 ${nf(sc)} ${nf(ox)} ${nf(oy)} cm`, Mi.map(nf).join(' ') + ' cm', name + ' Do', 'Q');
      if (CR.border && k > 1) W.push('q 0.6 0.6 0.6 RG 0.5 w', `${nf(ox)} ${nf(oy)} ${nf(w)} ${nf(h)} re S`, 'Q');
    }
    W.finish();
  }
  await setDoc(await out.save(), baseName() + (k === 1 ? '_' + CR.paper.toUpperCase() : `_${k}up`) + '.pdf'); busy(false);
  toast(k === 1 ? 'ปรับขนาดหน้าแล้ว' : `สร้างไฟล์ ${k} หน้าต่อแผ่นแล้ว`, 'ok');
}

/* ================= WATERMARK (vector) ================= */
const WM = { kind: 'text', text: 'CONFIDENTIAL', font: 'Kanit', bold: true, italic: false, size: 64, color: '#d7372b', opacity: 22, angle: 45, layout: 'center', img: null, imgFile: null, imgScale: 40, range: '', pv: 0, under: false };
function wmTextObj(F) { return { text: WM.text, font: WM.font, bold: WM.bold, italic: WM.italic, size: WM.size, color: WM.color, x: 0, y: 0, align: 'center', lh: 1 }; }
function wmPlacements(W, H, L) {
  const pl = []; if (WM.layout === 'tile') { const tw = (L ? L.w : 200) + WM.size * 1.6, th = (L ? L.h : 60) + WM.size * 2.2; const D = Math.hypot(W, H); let row = 0;
    for (let y = -D; y < D; y += th, row++) for (let x = -D + (row % 2) * tw / 2; x < D; x += tw) pl.push([x, y]); }
  else pl.push([0, 0]);
  return pl;
}
function drawWMCanvas(g, W, H) {
  g.save(); g.globalAlpha = WM.opacity / 100; g.translate(W / 2, H / 2); g.rotate(-WM.angle * Math.PI / 180);
  if (WM.kind === 'image') { if (WM.img) { const w = W * WM.imgScale / 100, h = w * WM.img.naturalHeight / WM.img.naturalWidth;
    wmPlacements(W, H, { w, h }).forEach(([x, y]) => g.drawImage(WM.img, x - w / 2, y - h / 2, w, h)); } }
  else { const o = wmTextObj(); const F = faceFor(o); if (!F) { requestFace(o, () => window._wmPv && window._wmPv()); g.restore(); return; }
    const L = layoutText(o, F); wmPlacements(W, H, L).forEach(([x, y]) => canvasText(g, { ...o, x: x - L.w / 2, y: y - L.h / 2 }, F)); }
  g.restore();
}
function renderWatermark() {
  const n = S.pdf.numPages;
  main.innerHTML = `<div class="wrap"><h2>ลายน้ำ</h2><p class="sub">ข้อความภาษาไทยคมชัดแบบเวกเตอร์ สระไม่ลอย หรือใช้โลโก้ของคุณ</p>
  <div class="grid2"><div class="card">
    <div class="fld"><span class="lbl">ชนิด</span><div class="seg" id="wKind"><button data-v="text">ข้อความ</button><button data-v="image">รูปภาพ / โลโก้</button></div></div>
    <div id="wText"><div class="fld"><label>ข้อความ (Enter = ขึ้นบรรทัดใหม่)</label><textarea class="inp" id="wT" rows="2">${esc(WM.text)}</textarea></div>
      <div class="row">${['สำเนา','ลับ','ลับมาก','ห้ามเผยแพร่','ตัวอย่าง','CONFIDENTIAL','DRAFT','COPY'].map(t => `<button class="btn sm" data-q="${t}">${t}</button>`).join('')}</div>
      <div class="row" style="align-items:flex-end;margin-top:10px"><div class="fld" style="flex:1;min-width:160px"><label>ฟอนต์</label>${fontPickerHTML('wF', WM.font)}</div>
        <div class="fld" style="width:80px"><label>ขนาด</label><input class="inp" type="number" id="wS" value="${WM.size}" min="6" max="400"></div>
        <div class="fld"><label>สี</label><input type="color" id="wC" value="${WM.color}"></div>
        <div class="fld"><label>&nbsp;</label><div class="seg"><button id="wB" class="${WM.bold ? 'on' : ''}">${icon('bold', 'width="14" height="14"')}</button><button id="wI" class="${WM.italic ? 'on' : ''}">${icon('italic', 'width="14" height="14"')}</button></div></div></div></div>
    <div id="wImg" class="fld"><button class="btn" id="wPick">${icon('image')} เลือกรูปภาพ (PNG พื้นใสดีที่สุด)</button>
      <label>ขนาด (% ความกว้างหน้า): <b id="wISv">${WM.imgScale}</b></label><input type="range" id="wIS" min="5" max="100" value="${WM.imgScale}"></div>
    <div class="fld"><label>ความทึบ: <b id="wOv">${WM.opacity}%</b></label><input type="range" id="wO" min="3" max="100" value="${WM.opacity}"></div>
    <div class="fld"><label>มุมเอียง: <b id="wAv">${WM.angle}°</b></label><input type="range" id="wA" min="-90" max="90" value="${WM.angle}"></div>
    <div class="fld"><span class="lbl">รูปแบบ</span><div class="seg" id="wL"><button data-v="center">ตรงกลาง</button><button data-v="tile">เรียงเต็มหน้า</button></div></div>
    <div class="fld"><label>หน้าที่ใส่</label><input class="inp" id="wR" placeholder="ทั้งหมด (หรือ 1-3, 5, คี่, คู่)" value="${esc(WM.range)}"></div>
    <label class="chk"><input type="checkbox" id="wU" ${WM.under ? 'checked' : ''}> วางไว้ใต้เนื้อหา (ไม่ทับตัวอักษร)</label>
    <div style="margin-top:12px"><button class="btn pri" id="wGo">${icon('check')} ใส่ลายน้ำ</button></div>
  </div><div><div class="prev col">${previewCtl('wv')}<canvas id="wPrev"></canvas></div></div></div></div>`;
  const seg = (id, key) => $$('#' + id + ' button').forEach(b => { b.classList.toggle('on', b.dataset.v === WM[key]); b.onclick = () => { WM[key] = b.dataset.v; seg(id, key); ui(); pv(); }; });
  const ui = () => { $('#wText').style.display = WM.kind === 'text' ? '' : 'none'; $('#wImg').style.display = WM.kind === 'image' ? '' : 'none'; };
  let pvT = 0; const pv = window._wmPv = () => { clearTimeout(pvT); pvT = setTimeout(async () => { if (WM.kind === 'text') await ensureFace(wmTextObj()).catch(() => { }); $('#wvN').textContent = `หน้า ${WM.pv + 1} / ${n}`; await previewWith($('#wPrev'), WM.pv, Math.min(460, main.clientWidth - 80), drawWMCanvas); }, 100); };
  seg('wKind', 'kind'); seg('wL', 'layout'); ui();
  wireFontPicker('wF', f => { WM.font = f; pv(); });
  $('#wT').oninput = e => { WM.text = e.target.value; pv(); };
  $$('[data-q]').forEach(b => b.onclick = () => { WM.text = b.dataset.q; $('#wT').value = WM.text; pv(); });
  $('#wS').oninput = e => { WM.size = +e.target.value || 60; pv(); }; $('#wC').oninput = e => { WM.color = e.target.value; pv(); };
  $('#wB').onclick = e => { WM.bold = !WM.bold; e.currentTarget.classList.toggle('on', WM.bold); pv(); };
  $('#wI').onclick = e => { WM.italic = !WM.italic; e.currentTarget.classList.toggle('on', WM.italic); pv(); };
  $('#wO').oninput = e => { WM.opacity = +e.target.value; $('#wOv').textContent = WM.opacity + '%'; pv(); };
  $('#wA').oninput = e => { WM.angle = +e.target.value; $('#wAv').textContent = WM.angle + '°'; pv(); };
  $('#wIS').oninput = e => { WM.imgScale = +e.target.value; $('#wISv').textContent = WM.imgScale; pv(); };
  $('#wR').oninput = e => WM.range = e.target.value; $('#wU').onchange = e => WM.under = e.target.checked;
  $('#wPick').onclick = async () => { const f = (await pickFiles({ accept: 'image/*', multiple: false }))[0]; if (!f) return; WM.imgFile = f; const img = new Image(); img.src = URL.createObjectURL(f); await img.decode(); WM.img = img; pv(); };
  $('#wvP').onclick = () => { WM.pv = Math.max(0, WM.pv - 1); pv(); }; $('#wvX').onclick = () => { WM.pv = Math.min(n - 1, WM.pv + 1); pv(); };
  WM.pv = Math.min(WM.pv, n - 1); pv();
  $('#wGo').onclick = async () => {
    try {
      if (WM.kind === 'image' && !WM.img) throw new Error('เลือกรูปภาพก่อน'); if (WM.kind === 'text' && !WM.text.trim()) throw new Error('กรอกข้อความลายน้ำ');
      const pages = parseRange(WM.range, n); busy(true, 'กำลังใส่ลายน้ำ…'); await tick();
      const doc = await loadCur(); let formRef = null, L = null, img = null, iw = 0, ih = 0;
      if (WM.kind === 'text') { // one Form XObject with vector glyphs, reused on every page
        const o = wmTextObj(); const F = await ensureFace(o); L = layoutText(o, F); const oo = { ...o, x: -L.w / 2, y: -L.h / 2 };
        const parts = pdfGlyphs(null, oo, F, layoutText(oo, F)); const col = rgbStr(WM.color);
        const str = `${col} rg ${col} RG\n` + (F.sb ? nf(o.size * 0.035) + ' w 1 j\n' : '') + parts.join('\n') + (F.sb ? '\nB' : '\nf');
        const big = Math.max(L.w, L.h) * 2 + 200;
        formRef = doc.context.register(doc.context.flateStream(str, { Type: 'XObject', Subtype: 'Form', BBox: [-big, -big, big, big], Resources: {} }));
      } else { const bytes = await canvasBytes((() => { const c = document.createElement('canvas'); c.width = WM.img.naturalWidth; c.height = WM.img.naturalHeight; c.getContext('2d').drawImage(WM.img, 0, 0); return c; })()); img = await doc.embedPng(bytes); iw = WM.img.naturalWidth; ih = WM.img.naturalHeight; }
      const a = -WM.angle * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
      for (let j = 0; j < pages.length; j++) {
        if (j % 10 === 0) { busy(true, `กำลังใส่ลายน้ำ ${j + 1}/${pages.length}…`, j / pages.length * 100); await tick(); }
        const page = doc.getPage(pages[j]); const W = new PageWriter(doc, page); const { W: PW, H: PH } = W.G;
        W.push('q', W.gs(WM.opacity / 100) + ' gs');
        if (formRef) { const nm = page.node.newXObject('Wm', formRef).toString();
          wmPlacements(PW, PH, L).forEach(([x, y]) => { const tx = PW / 2 + ca * x - sa * y, ty = PH / 2 + sa * x + ca * y; W.push(`q ${nf(ca)} ${nf(sa)} ${nf(-sa)} ${nf(ca)} ${nf(tx)} ${nf(ty)} cm ${nm} Do Q`); });
        } else { const nm = W.xobj(img.ref); const w = PW * WM.imgScale / 100, h = w * ih / iw;
          wmPlacements(PW, PH, { w, h }).forEach(([x, y]) => { const tx = PW / 2 + ca * x - sa * y, ty = PH / 2 + sa * x + ca * y;
            W.push(`q ${nf(ca)} ${nf(sa)} ${nf(-sa)} ${nf(ca)} ${nf(tx)} ${nf(ty)} cm ${nf(w)} 0 0 ${nf(-h)} ${nf(-w / 2)} ${nf(h / 2)} cm ${nm} Do Q`); }); }
        W.push('Q');
        if (WM.under) { // put stream first (under existing content)
          ensureWrapped(doc, page); const m = dispMatrix(W.G).map(nf).join(' ');
          const ref = doc.context.register(doc.context.flateStream('q\n' + m + ' cm\n' + W.ops.join('\n') + '\nQ'));
          const C = page.node.Contents(); C.insert(0, ref); W.ops = [];
        } else W.finish();
      }
      await setDoc(await doc.save(), S.name); busy(false); toast(`ใส่ลายน้ำ ${pages.length} หน้าแล้ว`, 'ok');
    } catch (e) { console.error(e); busy(false); toast(e.message, 'err'); }
  };
}

/* ================= HEADER / FOOTER / PAGE NUMBERS ================= */
const HF = { tl: '', tc: '', tr: '', bl: '', bc: 'หน้า {page} จาก {total}', br: '', font: 'THSarabunNew', size: 14, color: '#333333', bold: false, mx: 15, my: 10, range: '', skip: false, start: 1, pv: 0, line: false };
const HF_TOK = [['{page}', 'เลขหน้า'], ['{total}', 'จำนวนหน้า'], ['{thdate}', 'วันที่ไทย'], ['{date}', 'วันที่'], ['{file}', 'ชื่อไฟล์']];
function hfPlan(n) { let pages = parseRange(HF.range, n); if (HF.skip) pages = pages.filter(p => p !== 0); const map = new Map(); pages.forEach((p, k) => map.set(p, HF.start + k)); return { pages, map, total: pages.length + HF.start - 1 }; }
function hfText(t, num, total) { return t.replace(/\{page\}/g, num).replace(/\{total\}/g, total).replace(/\{thdate\}/g, thaiLongDate()).replace(/\{date\}/g, isoToday()).replace(/\{file\}/g, baseName()); }
function hfObjs(W, H, num, total) {
  const mm = 72 / 25.4, out = []; const base = { font: HF.font, bold: HF.bold, size: HF.size, color: HF.color, lh: 1 };
  for (const slot of ['tl', 'tc', 'tr', 'bl', 'bc', 'br']) { const t = HF[slot]; if (!t || !t.trim()) continue;
    const o = { ...base, text: hfText(t, num, total), align: slot[1] === 'l' ? 'left' : slot[1] === 'c' ? 'center' : 'right' };
    o.boxW = W - HF.mx * mm * 2; o.x = HF.mx * mm; o.slot = slot; out.push(o); }
  return out;
}
function placeHF(o, F, H) { const mm = 72 / 25.4; const L = layoutText(o, F); o.y = o.slot[0] === 't' ? HF.my * mm : H - HF.my * mm - L.h; return L; }
function renderHeader() {
  const n = S.pdf.numPages;
  const slot = (k, ph) => `<input class="inp hf" data-s="${k}" placeholder="${ph}" value="${esc(HF[k])}">`;
  main.innerHTML = `<div class="wrap"><h2>หัวกระดาษ / ท้ายกระดาษ / เลขหน้า</h2><p class="sub">ใส่ข้อความ 6 ตำแหน่ง พร้อมตัวแปรอัตโนมัติ — ข้อความเป็นเวกเตอร์ ค้นหาได้</p>
  <div class="grid2"><div class="card">
    <div class="lbl" style="margin-bottom:6px">หัวกระดาษ (ซ้าย / กลาง / ขวา)</div><div class="hfgrid">${slot('tl', 'ซ้าย')}${slot('tc', 'กลาง')}${slot('tr', 'ขวา')}</div>
    <div class="lbl" style="margin:10px 0 6px">ท้ายกระดาษ (ซ้าย / กลาง / ขวา)</div><div class="hfgrid">${slot('bl', 'ซ้าย')}${slot('bc', 'กลาง')}${slot('br', 'ขวา')}</div>
    <div class="row" style="margin:10px 0"><span class="hint">แทรก:</span>${HF_TOK.map(t => `<button class="btn sm" data-tok="${t[0]}">${t[1]}</button>`).join('')}</div>
    <div class="row" style="margin-bottom:10px"><span class="hint">แบบสำเร็จ:</span><button class="btn sm" data-pre="1">1</button><button class="btn sm" data-pre="2">- 1 -</button><button class="btn sm" data-pre="3">หน้า 1 จาก 9</button><button class="btn sm" data-pre="4">Page 1 of 9</button></div>
    <div class="row" style="align-items:flex-end"><div class="fld" style="flex:1;min-width:150px"><label>ฟอนต์</label>${fontPickerHTML('hF', HF.font)}</div>
      <div class="fld" style="width:72px"><label>ขนาด</label><input class="inp" type="number" id="hS" value="${HF.size}" min="5" max="72"></div>
      <div class="fld"><label>สี</label><input type="color" id="hC" value="${HF.color}"></div>
      <div class="fld"><label>&nbsp;</label><button class="btn ${HF.bold ? 'on' : ''}" id="hB">${icon('bold', 'width="14" height="14"')}</button></div></div>
    <div class="row" style="align-items:flex-end"><div class="fld" style="width:96px"><label>ขอบข้าง (มม.)</label><input class="inp" type="number" id="hMX" value="${HF.mx}" min="0"></div>
      <div class="fld" style="width:96px"><label>ขอบบน/ล่าง</label><input class="inp" type="number" id="hMY" value="${HF.my}" min="0"></div>
      <div class="fld" style="width:80px"><label>เริ่มเลข</label><input class="inp" type="number" id="hSt" value="${HF.start}" min="0"></div></div>
    <div class="fld"><label>หน้าที่ใส่</label><input class="inp" id="hR" placeholder="ทั้งหมด" value="${esc(HF.range)}"></div>
    <label class="chk"><input type="checkbox" id="hSk" ${HF.skip ? 'checked' : ''}> ข้ามหน้าแรก (หน้าปก)</label>
    <label class="chk"><input type="checkbox" id="hLn" ${HF.line ? 'checked' : ''}> ขีดเส้นคั่นหัว/ท้ายกระดาษ</label>
    <div style="margin-top:12px"><button class="btn pri" id="hGo">${icon('check')} ใส่หัว-ท้ายกระดาษ</button></div>
  </div><div><div class="prev col">${previewCtl('hv')}<canvas id="hPrev"></canvas></div></div></div></div>`;
  let lastInp = $('.hf[data-s=bc]');
  $$('.hf').forEach(i => { i.onfocus = () => lastInp = i; i.oninput = () => { HF[i.dataset.s] = i.value; pv(); }; });
  $$('[data-tok]').forEach(b => b.onclick = () => { const i = lastInp; const p = i.selectionStart ?? i.value.length; i.value = i.value.slice(0, p) + b.dataset.tok + i.value.slice(i.selectionEnd ?? p); HF[i.dataset.s] = i.value; i.focus(); pv(); });
  const PRE = { 1: '{page}', 2: '- {page} -', 3: 'หน้า {page} จาก {total}', 4: 'Page {page} of {total}' };
  $$('[data-pre]').forEach(b => b.onclick = () => { const i = lastInp; i.value = PRE[b.dataset.pre]; HF[i.dataset.s] = i.value; pv(); });
  wireFontPicker('hF', f => { HF.font = f; pv(); });
  const num = (id, k) => $('#' + id).oninput = e => { HF[k] = +e.target.value || 0; pv(); };
  num('hS', 'size'); num('hMX', 'mx'); num('hMY', 'my'); num('hSt', 'start');
  $('#hC').oninput = e => { HF.color = e.target.value; pv(); }; $('#hB').onclick = e => { HF.bold = !HF.bold; e.currentTarget.classList.toggle('on', HF.bold); pv(); };
  $('#hR').oninput = e => { HF.range = e.target.value; pv(); }; $('#hSk').onchange = e => { HF.skip = e.target.checked; pv(); }; $('#hLn').onchange = e => { HF.line = e.target.checked; pv(); };
  let pvT = 0; const pv = () => { clearTimeout(pvT); pvT = setTimeout(async () => {
    await ensureFace({ font: HF.font, bold: HF.bold }).catch(() => { }); $('#hvN').textContent = `หน้า ${HF.pv + 1} / ${n}`;
    let plan; try { plan = hfPlan(n); } catch (e) { plan = { map: new Map(), total: 0 }; }
    await previewWith($('#hPrev'), HF.pv, Math.min(460, main.clientWidth - 80), (g, W, H, pi) => { const k = plan.map.get(pi); if (k == null) return;
      hfObjs(W, H, k, plan.total).forEach(o => { const F = faceFor(o); if (!F) return; placeHF(o, F, H); canvasText(g, o, F); });
      if (HF.line) { const mm = 72 / 25.4; g.fillStyle = HF.color; const hasT = HF.tl + HF.tc + HF.tr, hasB = HF.bl + HF.bc + HF.br;
        if (hasT.trim()) g.fillRect(HF.mx * mm, HF.my * mm + HF.size * 1.45, W - HF.mx * mm * 2, 0.6); if (hasB.trim()) g.fillRect(HF.mx * mm, H - HF.my * mm - HF.size * 1.45 - 2, W - HF.mx * mm * 2, 0.6); }
    }); }, 100); };
  $('#hvP').onclick = () => { HF.pv = Math.max(0, HF.pv - 1); pv(); }; $('#hvX').onclick = () => { HF.pv = Math.min(n - 1, HF.pv + 1); pv(); };
  HF.pv = Math.min(HF.pv, n - 1); pv();
  $('#hGo').onclick = async () => { try {
    const plan = hfPlan(n); if (!plan.pages.length) throw new Error('ไม่มีหน้าที่จะใส่'); if (!['tl', 'tc', 'tr', 'bl', 'bc', 'br'].some(k => HF[k].trim())) throw new Error('กรอกข้อความอย่างน้อย 1 ช่อง');
    busy(true, 'กำลังใส่หัว-ท้ายกระดาษ…'); await tick(); const doc = await loadCur(); const mm = 72 / 25.4;
    for (let j = 0; j < plan.pages.length; j++) { if (j % 10 === 0) { busy(true, `กำลังใส่ ${j + 1}/${plan.pages.length}…`, j / plan.pages.length * 100); await tick(); }
      const pi = plan.pages[j]; const page = doc.getPage(pi); const W = new PageWriter(doc, page);
      for (const o of hfObjs(W.G.W, W.G.H, plan.map.get(pi), plan.total)) { const F = await ensureFace(o); placeHF(o, F, W.G.H); await pdfText(W, o); }
      if (HF.line) { const col = rgbStr(HF.color); const hasT = (HF.tl + HF.tc + HF.tr).trim(), hasB = (HF.bl + HF.bc + HF.br).trim();
        if (hasT) W.push(`q ${col} rg ${nf(HF.mx * mm)} ${nf(HF.my * mm + HF.size * 1.45)} ${nf(W.G.W - HF.mx * mm * 2)} 0.6 re f Q`);
        if (hasB) W.push(`q ${col} rg ${nf(HF.mx * mm)} ${nf(W.G.H - HF.my * mm - HF.size * 1.45 - 2)} ${nf(W.G.W - HF.mx * mm * 2)} 0.6 re f Q`); }
      W.finish(); }
    await setDoc(await doc.save(), S.name); busy(false); toast(`ใส่หัว-ท้ายกระดาษ ${plan.pages.length} หน้าแล้ว`, 'ok');
  } catch (e) { console.error(e); busy(false); toast(e.message, 'err'); } };
}

/* ================= FORMS ================= */
let FORM = null;
async function renderForms() {
  main.innerHTML = `<div class="wrap"><h2>กรอกฟอร์ม PDF</h2><p class="sub">กรอกภาษาไทยได้สมบูรณ์ — ระบบวาดตัวอักษรเองด้วย HarfBuzz สระ-วรรณยุกต์ไม่ลอย</p><div id="fmBody" class="card"><div class="spin"></div></div></div>`;
  try {
    const doc = await loadCur(); const form = doc.getForm(); const fields = form.getFields();
    const pagesRef = doc.getPages().map(p => p.ref);
    const L = PDFLib; const typeOf = f => f instanceof L.PDFTextField ? 'PDFTextField' : f instanceof L.PDFCheckBox ? 'PDFCheckBox' : f instanceof L.PDFRadioGroup ? 'PDFRadioGroup' : f instanceof L.PDFDropdown ? 'PDFDropdown' : f instanceof L.PDFOptionList ? 'PDFOptionList' : 'other';
    const list = fields.map(f => { const t = typeOf(f); const w = f.acroField.getWidgets();
      let page = -1; try { const P = w[0] && w[0].P(); if (P) page = pagesRef.findIndex(r => r === P || r.toString() === P.toString()); } catch (e) { }
      return { f, name: f.getName(), type: t, page, multi: t === 'PDFTextField' && f.isMultiline && f.isMultiline() }; })
      .filter(x => ['PDFTextField', 'PDFCheckBox', 'PDFRadioGroup', 'PDFDropdown', 'PDFOptionList'].includes(x.type));
    FORM = { list };
    if (!list.length) { $('#fmBody').innerHTML = `<div class="empty">${icon('form', 'width="40" height="40"')}<h3>ไฟล์นี้ไม่มีช่องฟอร์ม</h3><p class="hint">ใช้เครื่องมือ <b>แก้ไข / เขียน</b> เพื่อพิมพ์ข้อความลงบนหน้าได้ทุกตำแหน่ง</p><button class="btn pri" id="fmGoEd">${icon('edit')} ไปที่เครื่องมือแก้ไข</button></div>`; $('#fmGoEd').onclick = () => go('edit'); return; }
    const val = x => { try { if (x.type === 'PDFTextField') return x.f.getText() || ''; if (x.type === 'PDFCheckBox') return x.f.isChecked(); if (x.type === 'PDFRadioGroup') return x.f.getSelected() || ''; return (x.f.getSelected() || [])[0] || ''; } catch (e) { return ''; } };
    const inp = (x, i) => { const v = val(x);
      if (x.type === 'PDFTextField') return x.multi ? `<textarea class="inp" data-fi="${i}" rows="3">${esc(v)}</textarea>` : `<input class="inp" data-fi="${i}" value="${esc(v)}">`;
      if (x.type === 'PDFCheckBox') return `<label class="chk"><input type="checkbox" data-fi="${i}" ${v ? 'checked' : ''}> เลือก</label>`;
      const opts = x.f.getOptions(); return `<select class="inp" data-fi="${i}"><option value="">—</option>${opts.map(o => `<option ${o === v ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`; };
    $('#fmBody').innerHTML = `<div class="row" style="margin-bottom:12px"><span class="chip2">${list.length} ช่อง</span><span style="flex:1"></span>
        <div class="fld" style="margin:0;min-width:180px">${fontPickerHTML('fmF', 'THSarabunNew')}</div></div>
      <div class="formlist">${list.map((x, i) => `<div class="fitem"><label>${esc(x.name)} <span class="hint">${x.page >= 0 ? 'หน้า ' + (x.page + 1) : ''}</span></label>${inp(x, i)}</div>`).join('')}</div>
      <div class="fld" style="margin-top:14px"><span class="lbl">เมื่อบันทึก</span>
        <label class="chk"><input type="radio" name="fmM" value="flat" checked> <b>ล็อกค่าเป็นข้อความถาวร</b> — แสดงผลภาษาไทยสมบูรณ์ทุกโปรแกรม (แนะนำ)</label>
        <label class="chk"><input type="radio" name="fmM" value="keep"> คงเป็นฟอร์มที่แก้ไขต่อได้ (แนบลักษณะการแสดงผลภาษาไทยไว้ให้)</label></div>
      <button class="btn pri" id="fmGo">${icon('check')} บันทึกค่าลงฟอร์ม</button>`;
    let font = 'THSarabunNew'; wireFontPicker('fmF', f => font = f);
    $('#fmGo').onclick = async () => { try {
      busy(true, 'กำลังบันทึกฟอร์ม…'); await tick();
      const vals = $$('[data-fi]').map(el => el.type === 'checkbox' ? el.checked : el.value);
      const flat = $('input[name=fmM]:checked').value === 'flat';
      const doc2 = await loadCur(); const form2 = doc2.getForm(); const pages = doc2.getPages(); const pRefs = pages.map(p => p.ref.toString());
      const F = await ensureFace({ font }); const Fb = F;
      const writers = new Map(); const wr = pi => { if (!writers.has(pi)) writers.set(pi, new PageWriter(doc2, pages[pi])); return writers.get(pi); };
      for (let i = 0; i < list.length; i++) {
        const x = list[i]; const f = form2.getField(x.name); const v = vals[i]; const widgets = f.acroField.getWidgets();
        let daSize = 0; try { const da = f.acroField.getDefaultAppearance() || ''; const m = da.match(/([\d.]+)\s+Tf/); if (m) daSize = +m[1]; } catch (e) { }
        for (const w of widgets) {
          const r = w.getRectangle(); let pi = -1; try { const P = w.P(); if (P) pi = pRefs.indexOf(P.toString()); } catch (e) { }
          if (pi < 0) pi = x.page >= 0 ? x.page : 0;
          if (x.type === 'PDFTextField' || x.type === 'PDFDropdown' || x.type === 'PDFOptionList') {
            const text = String(v || ''); const multi = x.multi;
            const size = daSize > 0 ? daSize : clamp((r.height - 2) / ((F.d.asc + F.d.desc) * 1.02), 6, multi ? 13 : 16);
            const o = { text, font, size, color: '#000000', x: 2, y: 0, lh: 1, boxW: multi ? r.width - 4 : 0 };
            const L = layoutText(o, F); o.y = multi ? 1 : (r.height - L.h) / 2;
            if (flat) { if (text) { const Wp = wr(pi); const Mi = mInv(dispMatrix(Wp.G)); const a = mApply(Mi, r.x, r.y + r.height), b = mApply(Mi, r.x + r.width, r.y);
                const ox = Math.min(a[0], b[0]), oy = Math.min(a[1], b[1]); await pdfText(Wp, { ...o, x: ox + o.x, y: oy + o.y }); } }
            else { // build our own appearance stream (y-down local space)
              const tmp = { doc: doc2, page: pages[pi], ops: [], push(...s) { this.ops.push(...s); }, gs: () => '' };
              const parts = text ? pdfGlyphs(tmp, o, F, L) : [];
              const str = `/Tx BMC q 1 0 0 -1 0 ${nf(r.height)} cm 0 0 0 rg\n${parts.join('\n')}${parts.length ? '\nf' : ''}\nQ EMC`;
              const ap = doc2.context.register(doc2.context.flateStream(str, { Type: 'XObject', Subtype: 'Form', BBox: [0, 0, r.width, r.height], Resources: {} }));
              w.setNormalAppearance(ap); }
          } else if (x.type === 'PDFCheckBox') {
            if (flat) { if (v) { const Wp = wr(pi); const Mi = mInv(dispMatrix(Wp.G)); const a = mApply(Mi, r.x, r.y + r.height), b = mApply(Mi, r.x + r.width, r.y);
              const ox = Math.min(a[0], b[0]), oy = Math.min(a[1], b[1]), ww = Math.abs(a[0] - b[0]), hh = Math.abs(a[1] - b[1]);
              Wp.push(`q 0 0 0 RG ${nf(Math.max(1, Math.min(ww, hh) * 0.12))} w 1 J 1 j ${nf(ox + ww * 0.2)} ${nf(oy + hh * 0.52)} m ${nf(ox + ww * 0.42)} ${nf(oy + hh * 0.75)} l ${nf(ox + ww * 0.82)} ${nf(oy + hh * 0.25)} l S Q`); } }
          }
        }
        if (!flat) { try {
          if (x.type === 'PDFTextField') f.setText(String(v || '')); else if (x.type === 'PDFCheckBox') v ? f.check() : f.uncheck();
          else if (x.type === 'PDFRadioGroup') { if (v) f.select(v); } else if (v) f.select(v);
          } catch (e) { console.warn(e); } }
        else if (x.type === 'PDFRadioGroup' && v) { // draw a dot on the chosen option
          try { const opts = f.getOptions(); const k = opts.indexOf(v); const w = widgets[k]; if (w) { const r = w.getRectangle(); let pi = pRefs.indexOf(w.P()?.toString()); if (pi < 0) pi = Math.max(0, x.page);
            const Wp = wr(pi); const Mi = mInv(dispMatrix(Wp.G)); const c = mApply(Mi, r.x + r.width / 2, r.y + r.height / 2); const rr = Math.min(r.width, r.height) * 0.28;
            Wp.push(`q 0 0 0 rg ${ellipsePath(c[0] - rr, c[1] - rr, rr * 2, rr * 2)} f Q`); } } catch (e) { }
        }
      }
      writers.forEach(w => w.finish());
      if (flat) { for (const x of list) { try { form2.removeField(form2.getField(x.name)); } catch (e) { try { form2.getField(x.name).enableReadOnly(); } catch (_) { } } } }
      else { try { form2.acroForm.dict.set(PDFLib.PDFName.of('NeedAppearances'), PDFLib.PDFBool.False); } catch (e) { } }
      const out = await doc2.save({ updateFieldAppearances: false });
      await setDoc(out, S.name); busy(false); toast(flat ? 'กรอกฟอร์มและล็อกค่าแล้ว' : 'บันทึกค่าฟอร์มแล้ว', 'ok');
    } catch (e) { console.error(e); busy(false); toast('บันทึกฟอร์มไม่สำเร็จ: ' + e.message, 'err'); } };
  } catch (e) { $('#fmBody').innerHTML = `<p class="errtxt">อ่านฟอร์มไม่ได้: ${esc(e.message)}</p>`; }
}
function ellipsePath(x, y, w, h) { const k = 0.5523, rx = w / 2, ry = h / 2, cx = x + rx, cy = y + ry;
  return `${nf(cx + rx)} ${nf(cy)} m ${nf(cx + rx)} ${nf(cy + ry * k)} ${nf(cx + rx * k)} ${nf(cy + ry)} ${nf(cx)} ${nf(cy + ry)} c ${nf(cx - rx * k)} ${nf(cy + ry)} ${nf(cx - rx)} ${nf(cy + ry * k)} ${nf(cx - rx)} ${nf(cy)} c ${nf(cx - rx)} ${nf(cy - ry * k)} ${nf(cx - rx * k)} ${nf(cy - ry)} ${nf(cx)} ${nf(cy - ry)} c ${nf(cx + rx * k)} ${nf(cy - ry)} ${nf(cx + rx)} ${nf(cy - ry * k)} ${nf(cx + rx)} ${nf(cy)} c h`; }

/* ================= OCR ================= */
const OC = { tha: true, eng: true, range: '', mode: 'pdf', dpi: 300 };
let OCR_WORKER = null, OCR_LANGS = '';
async function getOcrWorker(langs, onProg) {
  if (OCR_WORKER && OCR_LANGS === langs.join('+')) return OCR_WORKER;
  if (OCR_WORKER) { try { await OCR_WORKER.terminate(); } catch (e) { } OCR_WORKER = null; }
  if (!window.Tesseract) await new Promise((res, rej) => { const s = document.createElement('script'); s.src = BASE + 'lib/ocr/tesseract.min.js'; s.onload = res; s.onerror = () => rej(new Error('โหลดโมดูล OCR ไม่สำเร็จ')); document.head.appendChild(s); });
  const langObjs = [];
  for (const l of langs) { onProg && onProg({ status: 'loading language', progress: langObjs.length / langs.length });
    const r = await fetch(BASE + 'lib/ocr/lang/' + l + '.b64.js'); if (!r.ok) throw new Error('โหลดข้อมูลภาษา ' + l + ' ไม่สำเร็จ');
    const b = atob((await r.text()).trim()); const a = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); langObjs.push({ code: l, data: a }); }
  OCR_WORKER = await Tesseract.createWorker(langObjs, 1, { workerPath: BASE + 'lib/ocr/worker.min.js', corePath: BASE + 'lib/ocr/core', cacheMethod: 'none', logger: m => onProg && onProg(m) });
  OCR_LANGS = langs.join('+'); return OCR_WORKER;
}
const fixThaiSpaces = s => s.replace(/([฀-๿]) (?=[฀-๿])/g, '$1');
function renderOCR() {
  const n = S.pdf.numPages;
  main.innerHTML = `<div class="wrap"><h2>OCR — แปลงภาพสแกนเป็นข้อความ</h2><p class="sub">อ่านตัวอักษรไทยและอังกฤษจากเอกสารสแกน แล้วฝังข้อความที่มองไม่เห็นลงในหน้า ให้ค้นหา/คัดลอกได้ ภาพเดิมไม่เปลี่ยน</p>
  <div class="grid2"><div class="card">
    <div class="fld"><span class="lbl">ภาษา</span><label class="chk"><input type="checkbox" id="oTh" ${OC.tha ? 'checked' : ''}> ไทย</label><label class="chk"><input type="checkbox" id="oEn" ${OC.eng ? 'checked' : ''}> English</label></div>
    <div class="fld"><label>หน้าที่ต้องการ</label><input class="inp" id="oR" placeholder="ทั้งหมด ${n} หน้า" value="${esc(OC.range)}"></div>
    <div class="fld"><label>ความละเอียดในการอ่าน</label><select class="inp" id="oD"><option value="200">200 DPI (เร็ว)</option><option value="300">300 DPI (แนะนำ)</option><option value="400">400 DPI (ตัวอักษรเล็ก)</option></select></div>
    <div class="fld"><span class="lbl">ผลลัพธ์</span><label class="chk"><input type="radio" name="oM" value="pdf" checked> ทำเป็น PDF ค้นหาข้อความได้ (Searchable PDF)</label><label class="chk"><input type="radio" name="oM" value="text"> ดึงเป็นข้อความอย่างเดียว</label></div>
    <button class="btn pri" id="oGo">${icon('ocr')} เริ่ม OCR</button>
    <p class="hint">ครั้งแรกต้องโหลดโมเดลภาษา (~4 MB) จากนั้นจะเร็วขึ้น · ใช้เวลาประมาณ 3–10 วินาทีต่อหน้า</p>
  </div><div class="card"><h3>ข้อความที่อ่านได้</h3><textarea class="inp" id="oOut" rows="20" readonly placeholder="ผลลัพธ์จะแสดงที่นี่" style="font-family:var(--thai)"></textarea>
    <div class="row" style="margin-top:8px"><button class="btn" id="oCp" disabled>${icon('copy')} คัดลอก</button><button class="btn" id="oDl" disabled>${icon('download')} ดาวน์โหลด .txt</button></div></div></div></div>`;
  $('#oD').value = OC.dpi;
  $('#oTh').onchange = e => OC.tha = e.target.checked; $('#oEn').onchange = e => OC.eng = e.target.checked; $('#oR').oninput = e => OC.range = e.target.value; $('#oD').onchange = e => OC.dpi = +e.target.value;
  $('#oCp').onclick = async () => { try { await navigator.clipboard.writeText($('#oOut').value); toast('คัดลอกแล้ว', 'ok'); } catch (e) { $('#oOut').select(); toast('กด Ctrl+C เพื่อคัดลอก'); } };
  $('#oDl').onclick = () => saveFile(new Blob([$('#oOut').value], { type: 'text/plain' }), baseName() + '_ocr.txt');
  $('#oGo').onclick = async () => {
    const langs = [OC.tha && 'tha', OC.eng && 'eng'].filter(Boolean); if (!langs.length) return toast('เลือกภาษาอย่างน้อย 1 ภาษา', 'err');
    const mode = $('input[name=oM]:checked').value;
    try {
      const pages = parseRange(OC.range, n); let cur = 0;
      busy(true, 'กำลังเตรียม OCR…', 0);
      const worker = await getOcrWorker(langs, m => { if (m.status === 'recognizing text') busy(true, `กำลังอ่านหน้า ${pages[cur] + 1} (${cur + 1}/${pages.length})…`, (cur + m.progress) / pages.length * 100);
        else if (/load|init/i.test(m.status)) busy(true, 'กำลังโหลดโมเดลภาษา… ' + Math.round((m.progress || 0) * 100) + '%'); });
      const doc = mode === 'pdf' ? await loadCur() : null; let fontObj = null;
      if (doc) { const F = await ensureFace({ font: 'THSarabunNew' }); fontObj = await embedTextFont(doc, F.d); }
      let all = '';
      for (cur = 0; cur < pages.length; cur++) {
        const pi = pages[cur]; const pg = await S.pdf.getPage(pi + 1); const sc = OC.dpi / 72; const vp = pg.getViewport({ scale: sc });
        const c = document.createElement('canvas'); c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height); const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
        await pg.render({ canvasContext: g, viewport: vp }).promise;
        const { data } = await worker.recognize(c, {}, { text: true, blocks: true });
        const txt = (data.text || ''); all += `===== หน้า ${pi + 1} =====\n${txt.trim()}\n\n`; $('#oOut').value = all;
        if (doc) { const page = doc.getPage(pi); const W = new PageWriter(doc, page);
          for (const b of data.blocks || []) for (const p of b.paragraphs || []) for (const ln of p.lines || []) {
            const t = (ln.text || '').replace(/\n/g, ' ').trim(); if (!t) continue; const bb = ln.bbox;
            const x = bb.x0 / sc, y = bb.y0 / sc, w = (bb.x1 - bb.x0) / sc, h = (bb.y1 - bb.y0) / sc; const size = h * 1.1;
            invisibleText(W, fontObj, t, x, y + h * 0.8, size, w); }
          W.finish(); }
        c.width = c.height = 0;
      }
      $('#oCp').disabled = $('#oDl').disabled = false;
      if (doc) { await setDoc(await doc.save(), S.name); toast('สร้าง PDF ค้นหาข้อความได้แล้ว — ลอง Ctrl+F ในไฟล์ที่ดาวน์โหลด', 'ok'); renderOCR(); $('#oOut').value = all; $('#oCp').disabled = $('#oDl').disabled = false; }
      else toast('OCR เสร็จแล้ว', 'ok');
      busy(false);
    } catch (e) { console.error(e); busy(false); toast('OCR ไม่สำเร็จ: ' + (e.message || e), 'err'); }
  };
}

/* ================= CONVERT ================= */
let CV = { tab: 'img2pdf', imgs: [], size: 'a4', orient: 'auto', margin: 20, fmt: 'png', dpi: 150, range: '', docx: 'text' };
function renderConvert() {
  const has = !!S.bytes;
  main.innerHTML = `<div class="wrap"><h2>แปลงไฟล์</h2><p class="sub">แปลงรูปเป็น PDF, PDF เป็นรูป / Word / ข้อความ</p>
    <div class="tabs">${[['img2pdf', 'รูปภาพ → PDF'], ['pdf2img', 'PDF → รูปภาพ'], ['pdf2docx', 'PDF → Word (.docx)'], ['pdf2txt', 'PDF → ข้อความ']].map(t => `<button class="btn ${CV.tab === t[0] ? 'on' : ''}" data-tab="${t[0]}">${t[1]}</button>`).join('')}</div><div id="cvBody"></div></div>`;
  $$('[data-tab]').forEach(b => b.onclick = () => { CV.tab = b.dataset.tab; renderConvert(); });
  const body = $('#cvBody');
  if (CV.tab === 'img2pdf') {
    body.innerHTML = `<div class="card"><div class="row"><button class="btn" id="ciAdd">${icon('plus')} เพิ่มรูปภาพ</button><span class="hint">${CV.imgs.length} รูป · ลากรูปมาวางได้ · ใช้ลูกศรจัดลำดับ</span></div>
      <div class="ilist" id="ciList"></div>
      <div class="row" style="align-items:flex-end"><div class="fld"><label>ขนาดหน้า</label><select class="inp" id="ciSize"><option value="a4">A4</option><option value="letter">Letter</option><option value="a3">A3</option><option value="a5">A5</option><option value="fit">เท่ากับขนาดรูป</option></select></div>
        <div class="fld"><label>แนวกระดาษ</label><select class="inp" id="ciOr"><option value="auto">อัตโนมัติ</option><option value="port">แนวตั้ง</option><option value="land">แนวนอน</option></select></div>
        <div class="fld" style="width:90px"><label>ขอบ (pt)</label><input class="inp" type="number" id="ciM" value="${CV.margin}" min="0"></div></div>
      <div class="row"><button class="btn pri" id="ciGo">${icon('file')} สร้าง PDF</button>${has ? `<button class="btn" id="ciApp">${icon('merge')} เพิ่มต่อท้ายไฟล์ปัจจุบัน</button>` : ''}</div></div>`;
    $('#ciSize').value = CV.size; $('#ciOr').value = CV.orient;
    $('#ciSize').onchange = e => CV.size = e.target.value; $('#ciOr').onchange = e => CV.orient = e.target.value; $('#ciM').oninput = e => CV.margin = +e.target.value || 0;
    const addImgs = fs => { [...fs].filter(isImg).forEach(f => CV.imgs.push({ file: f, url: URL.createObjectURL(f) })); renderConvert(); };
    $('#ciList').innerHTML = CV.imgs.map((f, i) => `<div class="iitem"><img src="${f.url}"><div class="ell">${i + 1}. ${esc(f.file.name)}</div><div class="pacts"><button data-a="l" data-i="${i}">${icon('left')}</button><button data-a="r" data-i="${i}">${icon('right')}</button><button data-a="d" data-i="${i}">${icon('trash')}</button></div></div>`).join('') ||
      `<div class="drop" id="drop" style="grid-column:1/-1;padding:30px"><h3 style="font-size:15px">ลากรูปภาพมาวาง หรือคลิกเพื่อเลือก</h3></div>`;
    wireDrop(addImgs);
    $$('#ciList [data-a]').forEach(b => b.onclick = () => { const i = +b.dataset.i, a = b.dataset.a, L = CV.imgs; if (a === 'd') L.splice(i, 1); if (a === 'l' && i > 0) [L[i - 1], L[i]] = [L[i], L[i - 1]]; if (a === 'r' && i < L.length - 1) [L[i + 1], L[i]] = [L[i], L[i + 1]]; renderConvert(); });
    $('#ciAdd').onclick = async () => addImgs(await pickFiles({ accept: 'image/*' }));
    const build = async () => { if (!CV.imgs.length) throw new Error('เพิ่มรูปภาพก่อน'); const d = await PDFDocument.create();
      for (let i = 0; i < CV.imgs.length; i++) { busy(true, `กำลังแปลงรูป ${i + 1}/${CV.imgs.length}…`, i / CV.imgs.length * 100); await tick(); await addImagePage(d, CV.imgs[i].file, { size: CV.size, orient: CV.orient, margin: CV.margin }); } return d; };
    $('#ciGo').onclick = async () => { try { const d = await build(); const nm = CV.imgs[0].file.name.replace(/\.[^.]+$/, '') + (CV.imgs.length > 1 ? '_รวม' : '') + '.pdf';
      await discardPending(); S.wasLocked = false; S.history = []; S.redo = []; S.tool = 'organize'; await setDoc(await d.save(), nm, { history: false }); CV.imgs = []; busy(false); toast('สร้าง PDF แล้ว', 'ok'); } catch (e) { busy(false); toast(e.message, 'err'); } };
    if (has) $('#ciApp').onclick = async () => { try { const d = await build(); const cur = await loadCur(); (await cur.copyPages(d, d.getPageIndices())).forEach(p => cur.addPage(p)); await setDoc(await cur.save(), S.name); CV.imgs = []; busy(false); toast('เพิ่มรูปต่อท้ายแล้ว', 'ok'); } catch (e) { busy(false); toast(e.message, 'err'); } };
    return;
  }
  if (!has) { body.innerHTML = dropZone('เปิดไฟล์ PDF ที่ต้องการแปลง'); wireDrop(); return; }
  const n = S.pdf.numPages;
  if (CV.tab === 'pdf2img') {
    body.innerHTML = `<div class="card" style="max-width:560px"><div class="row" style="align-items:flex-end">
      <div class="fld"><label>รูปแบบ</label><select class="inp" id="cpF"><option value="png">PNG (คมชัด)</option><option value="jpg">JPG (ไฟล์เล็ก)</option></select></div>
      <div class="fld"><label>ความละเอียด</label><select class="inp" id="cpD"><option value="72">72 DPI</option><option value="150">150 DPI</option><option value="200">200 DPI</option><option value="300">300 DPI (พิมพ์)</option></select></div></div>
      <div class="fld"><label>หน้าที่ต้องการ</label><input class="inp" id="cpR" placeholder="ทั้งหมด ${n} หน้า" value="${esc(CV.range)}"></div>
      <button class="btn pri" id="cpGo">${icon('image')} แปลงและดาวน์โหลด</button><p class="hint">หลายหน้าจะรวมเป็น ZIP</p></div>`;
    $('#cpF').value = CV.fmt; $('#cpD').value = CV.dpi; $('#cpF').onchange = e => CV.fmt = e.target.value; $('#cpD').onchange = e => CV.dpi = +e.target.value; $('#cpR').oninput = e => CV.range = e.target.value;
    $('#cpGo').onclick = async () => { try { const pages = parseRange(CV.range, n); const files = []; const pad = String(n).length;
      for (let j = 0; j < pages.length; j++) { busy(true, `กำลังแปลงหน้า ${j + 1}/${pages.length}…`, j / pages.length * 100); await tick();
        const page = await S.pdf.getPage(pages[j] + 1); const v1 = page.getViewport({ scale: 1 }); const sc = Math.min(CV.dpi / 72, 8000 / Math.max(v1.width, v1.height)); const vp = page.getViewport({ scale: sc });
        const c = document.createElement('canvas'); c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height); const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
        await page.render({ canvasContext: g, viewport: vp }).promise; files.push({ name: `${baseName()}_p${String(pages[j] + 1).padStart(pad, '0')}.${CV.fmt}`, data: await canvasBlob(c, CV.fmt === 'png' ? 'image/png' : 'image/jpeg', 0.9) }); c.width = c.height = 0; }
      busy(false); await saveZip(files, baseName() + '_images.zip'); } catch (e) { busy(false); toast(e.message, 'err'); } };
    return;
  }
  if (CV.tab === 'pdf2docx') {
    body.innerHTML = `<div class="card" style="max-width:640px"><div class="fld"><span class="lbl">รูปแบบเอกสาร Word</span>
      <label class="chk"><input type="radio" name="dx" value="text" ${CV.docx === 'text' ? 'checked' : ''}> <b>ข้อความแก้ไขได้</b> — ดึงข้อความเป็นย่อหน้า ฟอนต์ TH Sarabun New</label>
      <label class="chk"><input type="radio" name="dx" value="image" ${CV.docx === 'image' ? 'checked' : ''}> <b>หน้าตาเหมือนต้นฉบับ</b> — แต่ละหน้าเป็นภาพ (แก้ข้อความไม่ได้)</label>
      <label class="chk"><input type="radio" name="dx" value="both" ${CV.docx === 'both' ? 'checked' : ''}> ทั้งสองแบบ — ภาพหน้า + ข้อความใต้ภาพ</label></div>
      <div class="fld"><label>หน้าที่ต้องการ</label><input class="inp" id="dxR" placeholder="ทั้งหมด ${n} หน้า" value="${esc(CV.range)}"></div>
      <button class="btn pri" id="dxGo">${icon('word')} แปลงเป็น Word</button><p class="hint">ไฟล์สแกน (ภาพ) ให้ทำ OCR ก่อนเพื่อได้ข้อความ</p></div>`;
    $$('input[name=dx]').forEach(r => r.onchange = () => CV.docx = r.value); $('#dxR').oninput = e => CV.range = e.target.value;
    $('#dxGo').onclick = () => pdfToDocx(parseRange(CV.range, n), CV.docx).catch(e => { busy(false); toast(e.message, 'err'); });
    return;
  }
  body.innerHTML = `<div class="card"><div class="row"><button class="btn pri" id="ctGo">${icon('text')} ดึงข้อความ</button><button class="btn" id="ctDl" disabled>${icon('download')} .txt</button><button class="btn" id="ctCp" disabled>${icon('copy')} คัดลอก</button></div>
    <p class="hint">ใช้ได้กับ PDF ที่มีข้อความจริง ถ้าเป็นภาพสแกน ใช้เครื่องมือ OCR</p><textarea class="inp" id="ctOut" rows="18" style="font-family:var(--thai)" readonly placeholder="ข้อความจะแสดงที่นี่"></textarea></div>`;
  $('#ctGo').onclick = async () => { try { let out = '';
    for (let i = 0; i < n; i++) { if (i % 5 === 0) { busy(true, `กำลังอ่านหน้า ${i + 1}/${n}…`, i / n * 100); await tick(); }
      const lines = await getTextLines(i); out += `===== หน้า ${i + 1} =====\n${lines.map(l => l.str).join('\n')}\n\n`; }
    busy(false); $('#ctOut').value = out; $('#ctDl').disabled = $('#ctCp').disabled = false;
    if (!out.replace(/=+ หน้า \d+ =+/g, '').trim()) toast('ไม่พบข้อความ — ไฟล์อาจเป็นภาพสแกน ลองใช้ OCR', 'err');
  } catch (e) { busy(false); toast(e.message, 'err'); } };
  $('#ctDl').onclick = () => saveFile(new Blob([$('#ctOut').value], { type: 'text/plain' }), baseName() + '.txt');
  $('#ctCp').onclick = async () => { try { await navigator.clipboard.writeText($('#ctOut').value); toast('คัดลอกแล้ว', 'ok'); } catch (e) { $('#ctOut').select(); toast('กด Ctrl+C เพื่อคัดลอก'); } };
}
const xmlEsc = s => String(s).replace(/[<>&"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c])).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
async function pdfToDocx(pages, mode) {
  busy(true, 'กำลังสร้างไฟล์ Word…', 0); const zip = new JSZip(); const body = []; const rels = []; let rid = 10;
  for (let j = 0; j < pages.length; j++) {
    busy(true, `กำลังแปลงหน้า ${j + 1}/${pages.length}…`, j / pages.length * 100); await tick();
    const pi = pages[j]; const [W, H] = S.sizes[pi];
    if (j > 0) body.push('<w:p><w:r><w:br w:type="page"/></w:r></w:p>');
    if (mode !== 'text') {
      const page = await S.pdf.getPage(pi + 1); const vp = page.getViewport({ scale: 2 }); const c = document.createElement('canvas'); c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height);
      const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); await page.render({ canvasContext: g, viewport: vp }).promise;
      const name = `p${pi + 1}.jpg`; zip.file('word/media/' + name, await canvasBytes(c, 'image/jpeg', 0.88)); const id = 'rId' + (++rid);
      rels.push(`<Relationship Id="${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${name}"/>`);
      const maxW = 6.3 * 914400, maxH = 9.2 * 914400; let cx = W / 72 * 914400, cy = H / 72 * 914400; const s = Math.min(maxW / cx, maxH / cy, 1); cx = Math.round(cx * s); cy = Math.round(cy * s);
      body.push(`<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${rid}" name="Page ${pi + 1}"/><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="${rid}" name="${name}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${id}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`);
      c.width = c.height = 0;
    }
    if (mode !== 'image') {
      const lines = await getTextLines(pi); const paras = []; let cur = null;
      lines.forEach((l, k) => { const prev = lines[k - 1]; const gap = prev ? l.base - prev.base : 0;
        if (!cur || gap > Math.max(l.size, prev.size) * 1.7 || Math.abs(l.size - cur.size) > 1.5) { cur = { text: l.str, size: l.size, x: l.x, bold: /bold/i.test(l.font + (l.style?.fontFamily || '')) }; paras.push(cur); }
        else cur.text += (/[฀-๿]$/.test(cur.text) && /^[฀-๿]/.test(l.str) ? '' : ' ') + l.str; });
      paras.forEach(p => { const center = Math.abs(p.x + 0 - (W / 2)) < W * 0.08 && p.text.length < 60; const sz = Math.round(clamp(p.size * (16 / 11), 14, 72));
        body.push(`<w:p><w:pPr>${center ? '<w:jc w:val="center"/>' : ''}<w:spacing w:after="80"/></w:pPr><w:r><w:rPr>${p.bold ? '<w:b/><w:bCs/>' : ''}<w:sz w:val="${sz * 2}"/><w:szCs w:val="${sz * 2}"/></w:rPr><w:t xml:space="preserve">${xmlEsc(p.text)}</w:t></w:r></w:p>`); });
    }
  }
  const font = 'TH Sarabun New';
  zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="jpg" ContentType="image/jpeg"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>`);
  zip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
  zip.file('word/_rels/document.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>${rels.join('')}</Relationships>`);
  zip.file('word/styles.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="${font}" w:hAnsi="${font}" w:cs="${font}" w:eastAsia="${font}"/><w:sz w:val="32"/><w:szCs w:val="32"/><w:lang w:val="th-TH" w:bidi="th-TH"/></w:rPr></w:rPrDefault></w:docDefaults></w:styles>`);
  zip.file('word/document.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"><w:body>${body.join('')}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1418" w:header="709" w:footer="709" w:gutter="0"/></w:sectPr></w:body></w:document>`);
  const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }); busy(false);
  await saveFile(blob, baseName() + '.docx');
}

/* ================= COMPRESS ================= */
const CP = { mode: 'image', dpi: 110, q: 65, gray: false };
function renderCompress() {
  main.innerHTML = `<div class="wrap"><h2>บีบอัดขนาดไฟล์</h2><p class="sub">ขนาดปัจจุบัน <b>${fmtSize(S.bytes.length)}</b> · ${S.pdf.numPages} หน้า</p>
  <div class="cols"><div class="card"><label class="chk" style="margin:0 0 6px"><input type="radio" name="cm" value="image" ${CP.mode === 'image' ? 'checked' : ''}><b>บีบอัดสูง</b></label>
      <p class="hint" style="margin:0 0 12px">แปลงแต่ละหน้าเป็นภาพ JPG — ลดได้มากสำหรับไฟล์สแกน แต่ข้อความจะเลือก/ค้นหาไม่ได้ (ทำ OCR ต่อได้)</p>
      <div class="fld"><label>ความละเอียด</label><select class="inp" id="cD"><option value="72">72 DPI — เล็กที่สุด</option><option value="110">110 DPI — แนะนำ (อีเมล)</option><option value="150">150 DPI — คมชัด</option><option value="200">200 DPI — พิมพ์</option></select></div>
      <div class="fld"><label>คุณภาพภาพ: <b id="cQv">${CP.q}</b></label><input type="range" id="cQ" min="20" max="95" value="${CP.q}"></div>
      <label class="chk"><input type="checkbox" id="cG" ${CP.gray ? 'checked' : ''}> แปลงเป็นขาวดำ (เล็กลงอีก)</label></div>
    <div class="card"><label class="chk" style="margin:0 0 6px"><input type="radio" name="cm" value="lossless" ${CP.mode === 'lossless' ? 'checked' : ''}><b>บีบอัดพื้นฐาน (ไม่เสียคุณภาพ)</b></label>
      <p class="hint" style="margin:0">จัดโครงสร้างไฟล์ใหม่ให้กะทัดรัด ข้อความยังค้นหาได้ ลดได้เล็กน้อย</p></div></div>
  <div class="row" style="margin-top:14px"><button class="btn pri" id="cGo">${icon('compress')} บีบอัด</button></div><div id="cRes"></div></div>`;
  $('#cD').value = CP.dpi; $$('input[name=cm]').forEach(r => r.onchange = () => CP.mode = r.value);
  $('#cD').onchange = e => CP.dpi = +e.target.value; $('#cQ').oninput = e => { CP.q = +e.target.value; $('#cQv').textContent = CP.q; }; $('#cG').onchange = e => CP.gray = e.target.checked;
  $('#cGo').onclick = async () => { try {
    const before = S.bytes.length; let out;
    if (CP.mode === 'lossless') { busy(true, 'กำลังบีบอัด…'); await tick(); const d = await loadCur(); out = await d.save({ useObjectStreams: true }); }
    else { const d = await PDFDocument.create(); const n = S.pdf.numPages;
      for (let i = 0; i < n; i++) { busy(true, `กำลังบีบอัดหน้า ${i + 1}/${n}…`, i / n * 100); await tick();
        const page = await S.pdf.getPage(i + 1); const v1 = page.getViewport({ scale: 1 }); const vp = page.getViewport({ scale: Math.min(CP.dpi / 72, 6000 / Math.max(v1.width, v1.height)) });
        const c = document.createElement('canvas'); c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height); const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
        await page.render({ canvasContext: g, viewport: vp }).promise;
        if (CP.gray) { const id = g.getImageData(0, 0, c.width, c.height), a = id.data; for (let k = 0; k < a.length; k += 4) { const y = a[k] * .299 + a[k + 1] * .587 + a[k + 2] * .114; a[k] = a[k + 1] = a[k + 2] = y; } g.putImageData(id, 0, 0); }
        const img = await d.embedJpg(await canvasBytes(c, 'image/jpeg', CP.q / 100)); c.width = c.height = 0;
        const p = d.addPage([v1.width, v1.height]); p.drawImage(img, { x: 0, y: 0, width: v1.width, height: v1.height }); }
      out = await d.save({ useObjectStreams: true }); }
    busy(false); const pct = Math.round((1 - out.length / before) * 100);
    $('#cRes').innerHTML = `<div class="card" style="margin-top:16px"><div class="stat"><div><span>ก่อน</span><b>${fmtSize(before)}</b></div><div><span>หลัง</span><b>${fmtSize(out.length)}</b></div><div><span>ลดลง</span><b style="color:${pct > 0 ? 'var(--ok)' : 'var(--acc)'}">${pct > 0 ? pct + '%' : 'ไม่ลดลง'}</b></div></div>
      ${pct > 0 ? `<div class="row"><button class="btn pri" id="cUse">${icon('check')} ใช้ไฟล์ที่บีบอัด</button><button class="btn" id="cDl">${icon('download')} ดาวน์โหลดเลย</button></div>` : '<p class="hint">ลองลดความละเอียดหรือคุณภาพลง</p>'}</div>`;
    if (pct > 0) { $('#cUse').onclick = async () => { busy(true, 'กำลังเปิด…'); await setDoc(out, S.name); busy(false); toast('ใช้ไฟล์ที่บีบอัดแล้ว', 'ok'); }; $('#cDl').onclick = () => saveFile(out, baseName() + '_compressed.pdf'); }
  } catch (e) { busy(false); toast(e.message, 'err'); } };
}

/* ================= LOCK / UNLOCK ================= */
function renderLock() {
  const has = !!S.bytes;
  main.innerHTML = `<div class="wrap"><h2>ล็อก / ปลดล็อก PDF</h2><p class="sub">ตั้งรหัสผ่านเปิดไฟล์ (AES-256) จำกัดสิทธิ์พิมพ์/คัดลอก/แก้ไข หรือปลดรหัสจากไฟล์ที่คุณรู้รหัส</p>
  <div class="cols"><div class="card"><h3>${icon('lock', 'width="16" height="16" class="ic"')} ล็อกไฟล์ด้วยรหัสผ่าน</h3>
    ${has ? `<div class="fld"><label>รหัสผ่านสำหรับเปิดไฟล์</label><input class="inp" type="password" id="lP1" autocomplete="new-password"><div class="pwmeter"><i id="lStr"></i></div></div>
      <div class="fld"><label>ยืนยันรหัสผ่าน</label><input class="inp" type="password" id="lP2" autocomplete="new-password"></div>
      <label class="chk"><input type="checkbox" id="lShow"> แสดงรหัสผ่าน</label>
      <div class="fld" style="margin-top:10px"><span class="lbl">สิทธิ์ของผู้เปิดไฟล์</span>
        <label class="chk"><input type="checkbox" id="lPr" checked> อนุญาตให้พิมพ์</label><label class="chk"><input type="checkbox" id="lCp"> อนุญาตให้คัดลอกข้อความ</label><label class="chk"><input type="checkbox" id="lMd"> อนุญาตให้แก้ไข / ใส่ความเห็น / กรอกฟอร์ม</label></div>
      <details style="margin-bottom:12px"><summary class="hint" style="cursor:pointer">ตั้งค่าเพิ่มเติม</summary><div class="fld" style="margin-top:8px"><label>รหัสผ่านเจ้าของ (สำหรับเปลี่ยนสิทธิ์)</label><input class="inp" type="password" id="lOw" placeholder="เว้นว่าง = สร้างให้อัตโนมัติ" autocomplete="new-password">
        <span class="hint">ถ้าเว้นรหัสเปิดไฟล์ว่าง แต่ใส่รหัสเจ้าของ → เปิดอ่านได้โดยไม่ต้องใช้รหัส แต่ถูกจำกัดสิทธิ์</span></div></details>
      <button class="btn pri" id="lGo">${icon('lock')} ล็อกและดาวน์โหลด</button><p class="hint">ไฟล์ที่ทำงานอยู่ไม่ถูกล็อก แก้ไขต่อได้</p>` : `<p class="hint">เปิดไฟล์ PDF ก่อน</p><button class="btn" id="lOpen">${icon('open')} เปิดไฟล์</button>`}</div>
    <div class="card"><h3>${icon('unlock', 'width="16" height="16" class="ic"')} ปลดล็อกไฟล์</h3>
      ${S.wasLocked && has ? `<div class="banner okb" style="margin-bottom:12px">${icon('check', 'width="16" height="16"')} ไฟล์ปัจจุบันถูกปลดล็อกแล้ว</div><button class="btn pri" id="uDl">${icon('download')} ดาวน์โหลดไฟล์ที่ไม่มีรหัส</button><p></p>` : ''}
      <p class="hint" style="margin-top:0">เลือกไฟล์ที่มีรหัสผ่าน แล้วกรอกรหัส ระบบจะเอารหัสผ่านและข้อจำกัดออก (ต้องรู้รหัสของไฟล์)</p>
      <button class="btn" id="uPick">${icon('unlock')} เลือกไฟล์ที่ล็อกไว้</button></div></div></div>`;
  $('#uPick').onclick = async () => { const f = await pickFiles({ accept: 'application/pdf,.pdf', multiple: false }); if (!f.length) return; S.tool = 'lock'; await openFiles(f, 'replace'); };
  if ($('#uDl')) $('#uDl').onclick = () => downloadCurrent('_unlocked');
  if (!has) { $('#lOpen').onclick = async () => { const f = await pickFiles(); if (f.length) openFiles(f, 'replace'); }; return; }
  $('#lP1').oninput = e => { const v = e.target.value; let s = 0; if (v.length >= 8) s++; if (v.length >= 12) s++; if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++; if (/\d/.test(v)) s++; if (/[^A-Za-z0-9]/.test(v)) s++;
    const el = $('#lStr'); el.style.width = (v ? 20 + s * 16 : 0) + '%'; el.style.background = s < 2 ? '#ef4444' : s < 4 ? '#f59e0b' : '#16a34a'; };
  $('#lShow').onchange = e => ['lP1', 'lP2', 'lOw'].forEach(id => $('#' + id).type = e.target.checked ? 'text' : 'password');
  $('#lGo').onclick = async () => {
    const p1 = $('#lP1').value, p2 = $('#lP2').value; let ow = $('#lOw').value;
    if (p1 !== p2) return toast('รหัสผ่านทั้งสองช่องไม่ตรงกัน', 'err'); if (!p1 && !ow) return toast('กรอกรหัสผ่านอย่างน้อย 1 ช่อง', 'err');
    if (!ow) { const a = new Uint8Array(16); crypto.getRandomValues(a); ow = [...a].map(x => x.toString(16).padStart(2, '0')).join(''); }
    try { await commitPending(); busy(true, 'กำลังเข้ารหัส…'); await tick(); const d = await loadCur(); const md = $('#lMd').checked;
      d.encrypt({ userPassword: p1, ownerPassword: ow, permissions: { printing: $('#lPr').checked ? 'highResolution' : false, copying: $('#lCp').checked, modifying: md, annotating: md, fillingForms: md, documentAssembly: md, contentAccessibility: true } });
      const out = await d.save(); busy(false); await saveFile(out, baseName() + '_locked.pdf');
    } catch (e) { busy(false); toast('ล็อกไม่สำเร็จ: ' + e.message, 'err'); }
  };
}

/* ================= DOCUMENT PROPERTIES ================= */
async function renderProps() {
  const d = await loadCur(); const g = k => { try { return d['get' + k]() || ''; } catch (e) { return ''; } };
  const kw = g('Keywords');
  main.innerHTML = `<div class="wrap"><h2>ข้อมูลเอกสาร</h2><p class="sub">แก้ไขชื่อเรื่อง ผู้เขียน และคำค้น ที่แสดงในโปรแกรมอ่าน PDF และผลการค้นหา</p>
  <div class="card" style="max-width:640px">
    ${[['Title', 'ชื่อเรื่อง'], ['Author', 'ผู้เขียน'], ['Subject', 'หัวเรื่อง'], ['Creator', 'โปรแกรมที่สร้าง'], ['Producer', 'ผู้ผลิต']].map(([k, l]) => `<div class="fld"><label>${l}</label><input class="inp" data-m="${k}" value="${esc(g(k))}"></div>`).join('')}
    <div class="fld"><label>คำค้น (คั่นด้วย ,)</label><input class="inp" data-m="Keywords" value="${esc(Array.isArray(kw) ? kw.join(', ') : kw)}"></div>
    <div class="stat"><div><span>จำนวนหน้า</span><b>${d.getPageCount()}</b></div><div><span>ขนาดไฟล์</span><b>${fmtSize(S.bytes.length)}</b></div><div><span>ขนาดหน้าแรก</span><b style="font-size:14px">${Math.round(S.sizes[0][0] / 72 * 25.4)}×${Math.round(S.sizes[0][1] / 72 * 25.4)} มม.</b></div></div>
    <div class="row"><button class="btn pri" id="mGo">${icon('check')} บันทึก</button><button class="btn" id="mClr">${icon('trash')} ล้างข้อมูลส่วนตัวทั้งหมด</button></div></div></div>`;
  const save = async clear => { try { busy(true, 'กำลังบันทึก…'); const d2 = await loadCur();
    $$('[data-m]').forEach(i => { const k = i.dataset.m, v = clear ? '' : i.value.trim();
      if (k === 'Keywords') d2.setKeywords(v ? v.split(',').map(s => s.trim()).filter(Boolean) : []); else d2['set' + k](v); });
    if (clear) { try { d2.catalog.delete(PDFLib.PDFName.of('Metadata')); } catch (e) { } }
    await setDoc(await d2.save(), S.name); busy(false); toast(clear ? 'ล้างข้อมูลแล้ว' : 'บันทึกข้อมูลเอกสารแล้ว', 'ok');
  } catch (e) { busy(false); toast(e.message, 'err'); } };
  $('#mGo').onclick = () => save(false); $('#mClr').onclick = () => save(true);
}

/* ================= GLOBAL ACTIONS ================= */
async function commitPending() {
  if (ORG && ORG.dirty && ORG.ver === S.ver) await commitOrg();
  if (typeof editPending === 'function' && editPending()) await commitEdit(true);
}
async function discardPending() { ORG = null; if (typeof resetEdit === 'function') resetEdit(); }
async function downloadCurrent(suffix = '') {
  if (!S.bytes) return;
  try { await commitPending(); } catch (e) { busy(false); return toast(e.message, 'err'); }
  const nm = suffix ? baseName() + suffix + '.pdf' : (S.name.endsWith('.pdf') ? S.name : S.name + '.pdf');
  await saveFile(S.bytes, nm);
}
async function docUndo() {
  if (!S.history.length) return; await discardPending(); const h = S.history.pop(); S.redo.push({ bytes: S.bytes, name: S.name });
  busy(true, 'กำลังย้อนกลับ…'); try { await setDoc(h.bytes, h.name, { history: false }); toast('ย้อนกลับแล้ว'); } finally { busy(false); }
}
async function docRedo() {
  if (!S.redo.length) return; await discardPending(); const h = S.redo.pop(); S.history.push({ bytes: S.bytes, name: S.name });
  busy(true, 'กำลังทำซ้ำ…'); try { await setDoc(h.bytes, h.name, { history: false }); } finally { busy(false); }
}
function initShell() {
  $$('[data-i]').forEach(e => e.innerHTML = icon(e.dataset.i));
  $('#bSave').onclick = () => downloadCurrent();
  $('#bOpen').onclick = async () => { const f = await pickFiles(); if (f.length) openFiles(f); };
  $('#bUndo').onclick = docUndo; $('#bRedo').onclick = docRedo;
  $('#bTheme').onclick = () => { document.documentElement.classList.toggle('dark'); try { localStorage.setItem('pdfs_theme', document.documentElement.classList.contains('dark') ? 'dark' : ''); } catch (e) { } };
  try { if (localStorage.getItem('pdfs_theme') === 'dark') document.documentElement.classList.add('dark'); } catch (e) { }
  window.addEventListener('dragover', e => { if (e.dataTransfer && [...e.dataTransfer.types].includes('Files')) e.preventDefault(); });
  window.addEventListener('drop', e => { if (!e.dataTransfer || !e.dataTransfer.files.length) return; e.preventDefault();
    if (S.tool === 'convert' && CV.tab === 'img2pdf') { [...e.dataTransfer.files].filter(isImg).forEach(f => CV.imgs.push({ file: f, url: URL.createObjectURL(f) })); renderConvert(); return; }
    if (S.tool === 'edit' && S.bytes && [...e.dataTransfer.files].every(isImg) && typeof placeImage === 'function') { [...e.dataTransfer.files].forEach(async f => placeImage(await fileToDataURL(f), 220)); return; }
    openFiles(e.dataTransfer.files); });
  window.addEventListener('beforeunload', e => { if (S.bytes) { e.preventDefault(); e.returnValue = ''; } });
  document.addEventListener('keydown', e => {
    const tag = (e.target.tagName || '').toLowerCase(); if (tag === 'input' || tag === 'textarea' || tag === 'select' || $('.mback')) return;
    const mod = e.ctrlKey || e.metaKey;
    if (S.tool === 'edit' && S.bytes && typeof editKey === 'function' && editKey(e)) return;
    if (mod && e.key.toLowerCase() === 'z' && !e.shiftKey) { e.preventDefault(); docUndo(); }
    else if (mod && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) { e.preventDefault(); docRedo(); }
    else if (mod && e.key.toLowerCase() === 's') { e.preventDefault(); downloadCurrent(); }
    else if (mod && e.key.toLowerCase() === 'o') { e.preventDefault(); $('#bOpen').click(); }
  });
  loadFaceData('THSarabunNew-Regular').catch(() => { }); loadFaceData('Kanit-Bold').catch(() => { });
  updateHeader(); renderTool();
}
