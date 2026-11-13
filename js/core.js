'use strict';
/* =====================================================================
   PDF Studio Pro — core: state, helpers, Thai font engine, vector writer
   ===================================================================== */
const { PDFDocument, degrees } = PDFLib;
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
const DPR = Math.min(2, window.devicePixelRatio || 1);
const FK = (window.fontkit && window.fontkit.create) ? window.fontkit : (window.fontkit && window.fontkit.default);
const BASE = new URL('.', location.href).href;

/* ---------- tiny helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtSize = b => b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(2) + ' MB';
const norm = a => ((Math.round(a) % 360) + 360) % 360;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const tick = () => new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const nf = v => { const r = Math.round(v * 1000) / 1000; return (Object.is(r, -0) ? 0 : r).toString(); };
const hex2rgb = h => { h = (h || '#000').replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; };
const rgbStr = h => hex2rgb(h).map(nf).join(' ');
const thaiToday = () => { const d = new Date(); return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear() + 543}`; };
const isoToday = () => { const d = new Date(); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`; };
const TH_MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const thaiLongDate = () => { const d = new Date(); return `${d.getDate()} ${TH_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`; };

function toast(msg, kind = '') {
  const t = document.createElement('div'); t.className = 'toast ' + kind; t.textContent = msg;
  $('#toasts').appendChild(t); setTimeout(() => t.remove(), kind === 'err' ? 5500 : 3200);
}
function busy(on, text, pct) {
  $('#busy').classList.toggle('on', !!on); if (text) $('#busyT').textContent = text;
  const bar = $('#busyBar'); if (bar) { bar.style.display = pct == null ? 'none' : ''; if (pct != null) $('#busyBar i').style.width = clamp(pct, 0, 100) + '%'; }
}
function modal({ title, body, buttons = [{ label: 'ตกลง', value: true, pri: true }], onOpen, wide }) {
  return new Promise(res => {
    const bk = document.createElement('div'); bk.className = 'mback';
    bk.innerHTML = `<div class="modal ${wide ? 'wide' : ''}"><div class="mh">${title}</div><div class="mb">${body}</div><div class="mf"></div></div>`;
    const close = v => { bk.remove(); res(v); };
    bk._close = close;
    buttons.forEach(b => {
      const el = document.createElement('button'); el.className = 'btn' + (b.pri ? ' pri' : ''); el.textContent = b.label;
      el.onclick = () => close(typeof b.value === 'function' ? b.value(bk) : b.value);
      $('.mf', bk).appendChild(el);
    });
    bk.addEventListener('keydown', e => {
      if (e.key === 'Escape') close(null);
      if (e.key === 'Enter' && e.target.tagName === 'INPUT') { const p = $$('.mf .btn', bk).find(x => x.classList.contains('pri')); p && p.click(); }
    });
    bk.addEventListener('pointerdown', e => { if (e.target === bk) close(null); });
    document.body.appendChild(bk);
    onOpen && onOpen(bk);
    const f = $('input:not([type=checkbox]):not([type=radio]):not([type=color]):not([type=range])', bk); if (f) setTimeout(() => f.focus(), 30);
  });
}
function pickFiles({ accept = 'application/pdf,.pdf,image/*', multiple = true } = {}) {
  return new Promise(res => {
    const i = document.createElement('input'); i.type = 'file'; i.accept = accept; i.multiple = multiple;
    i.onchange = () => res([...i.files]); i.click();
  });
}
const fileToDataURL = f => new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(f); });
const canvasBlob = (c, type = 'image/png', q) => new Promise(r => c.toBlob(r, type, q));
const canvasBytes = async (c, type = 'image/png', q) => new Uint8Array(await (await canvasBlob(c, type, q)).arrayBuffer());

/* ---------- downloads ---------- */
let DL = null;
(async () => { for (let i = 0; i < 40 && !DL; i++) { try { if (window.claude && window.claude.use) { DL = await window.claude.use('downloads'); break; } } catch (e) { } await sleep(250); } })();
async function saveFile(data, filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const mime = { pdf: 'application/pdf', zip: 'application/zip', txt: 'text/plain', png: 'image/png', jpg: 'image/jpeg', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }[ext] || 'application/octet-stream';
  const blob = data instanceof Blob ? data : new Blob([data], { type: mime });
  if (!DL && window.claude && window.claude.use) { try { DL = await window.claude.use('downloads'); } catch (e) { } }
  if (DL) {
    try { await DL.save({ filename, data: blob }); toast('บันทึก ' + filename + ' แล้ว', 'ok'); return true; }
    catch (e) {
      if (e && e.code === 'declined') { toast('ยกเลิกการดาวน์โหลด'); return false; }
      if (e && e.code === 'rate_limited') { toast('มีหน้าต่างดาวน์โหลดเปิดอยู่ ลองใหม่อีกครั้ง', 'err'); return false; }
      if (e && e.code === 'too_large') { toast('ไฟล์ใหญ่เกินไปสำหรับการดาวน์โหลด', 'err'); return false; }
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000); return true;
}
async function saveZip(files, zipName) {
  if (files.length === 1) return saveFile(files[0].data, files[0].name);
  busy(true, 'กำลังรวมเป็นไฟล์ ZIP…');
  const zip = new JSZip(); files.forEach(f => zip.file(f.name, f.data));
  const blob = await zip.generateAsync({ type: 'blob' }); busy(false);
  return saveFile(blob, zipName);
}

/* =====================================================================
   FONT ENGINE — HarfBuzz shaping (Thai marks positioned correctly)
   ===================================================================== */
const FONT_FILES = {"Athiti":"BR","BaiJamjuree":"BIRX","ChakraPetch":"BIRX","Charm":"BR","Charmonman":"BR","Chonburi":"R","Fahkwang":"BIRX","IBMPlexSansThai":"BR","IBMPlexSansThaiLooped":"BR","Itim":"R","K2D":"BIRX","Kanit":"BIRX","KoHo":"BIRX","Kodchasan":"BIRX","Krub":"BIRX","Maitree":"BR","Mali":"BIRX","Mitr":"BR","Niramit":"BIRX","NotoSansThai":"BR","NotoSansThaiLooped":"BR","NotoSerifThai":"BR","Pattaya":"R","Pridi":"BR","Prompt":"BIRX","Sarabun":"BIRX","Sriracha":"R","Srisakdi":"BR","THSarabunNew":"BIRX","THSarabunPSK":"BIRX","Taviraj":"BIRX","Thasadith":"BIRX","Trirong":"BIRX"};
const FONT_CATS = [
  ['เอกสาร / ราชการ', [['TH Sarabun New', 'THSarabunNew'], ['TH SarabunPSK', 'THSarabunPSK'], ['Sarabun', 'Sarabun'], ['Noto Sans Thai', 'NotoSansThai'], ['Noto Sans Thai Looped', 'NotoSansThaiLooped'], ['Noto Serif Thai', 'NotoSerifThai'], ['IBM Plex Sans Thai', 'IBMPlexSansThai'], ['IBM Plex Sans Thai Looped', 'IBMPlexSansThaiLooped'], ['Taviraj', 'Taviraj'], ['Trirong', 'Trirong'], ['Pridi', 'Pridi'], ['Maitree', 'Maitree'], ['Athiti', 'Athiti'], ['Thasadith', 'Thasadith']]],
  ['โมเดิร์น / หัวเรื่อง', [['Kanit', 'Kanit'], ['Prompt', 'Prompt'], ['Mitr', 'Mitr'], ['Chakra Petch', 'ChakraPetch'], ['Bai Jamjuree', 'BaiJamjuree'], ['K2D', 'K2D'], ['Krub', 'Krub'], ['KoHo', 'KoHo'], ['Niramit', 'Niramit'], ['Kodchasan', 'Kodchasan'], ['Fahkwang', 'Fahkwang'], ['Chonburi', 'Chonburi']]],
  ['ลายมือ / ตกแต่ง', [['Mali', 'Mali'], ['Itim', 'Itim'], ['Sriracha', 'Sriracha'], ['Charm', 'Charm'], ['Charmonman', 'Charmonman'], ['Srisakdi', 'Srisakdi'], ['Pattaya', 'Pattaya']]],
];
const FONT_NAME = {}; FONT_CATS.forEach(c => c[1].forEach(([n, f]) => FONT_NAME[f] = n));
const DEFAULT_FONT = 'THSarabunNew';

let HB = null, HBP = null;
function initHB() {
  if (!HBP) HBP = import(BASE + 'lib/hb/index.mjs').then(m => { HB = m; }).catch(e => { console.warn('HarfBuzz unavailable, using fontkit shaping', e); HB = null; });
  return HBP;
}
const FACE_P = {};   // key -> Promise<face data>
const FACE = {};     // key -> face data (ready)
function styleFor(file, bold, italic) {
  const a = FONT_FILES[file] || 'R';
  if (bold && italic) { if (a.includes('X')) return ['BoldItalic', false, false]; if (a.includes('B')) return ['Bold', false, true]; if (a.includes('I')) return ['Italic', true, false]; return ['Regular', true, true]; }
  if (bold) return a.includes('B') ? ['Bold', false, false] : ['Regular', true, false];
  if (italic) return a.includes('I') ? ['Italic', false, false] : ['Regular', false, true];
  return ['Regular', false, false];
}
function faceKey(file, bold, italic) { const [st] = styleFor(file, bold, italic); return file + '-' + st; }
function loadFaceData(key) {
  if (FACE_P[key]) return FACE_P[key];
  return FACE_P[key] = (async () => {
    const [res] = await Promise.all([fetch(BASE + 'fonts/' + key + '.ttf'), initHB()]);
    if (!res.ok) throw new Error('โหลดฟอนต์ไม่สำเร็จ: ' + key);
    const buf = await res.arrayBuffer();
    const d = { key, bytes: new Uint8Array(buf), paths: new Map(), p2d: new Map(), shapes: new Map() };
    d.fk = FK.create(d.bytes);
    d.upem = d.fk.unitsPerEm;
    const hh = d.fk.hhea || {};
    d.asc = (hh.ascent ?? d.fk.ascent) / d.upem; d.desc = Math.abs(hh.descent ?? d.fk.descent) / d.upem;
    if (!(d.asc > 0.3)) d.asc = 0.9; if (!(d.desc > 0.05)) d.desc = 0.3;
    if (HB) { try { d.hb = new HB.Font(new HB.Face(new HB.Blob(buf))); } catch (e) { console.warn(e); } }
    d.css = 'PF_' + key.replace(/[^A-Za-z0-9]/g, '_');
    try { const ff = new FontFace(d.css, buf.slice(0)); await ff.load(); document.fonts.add(ff); } catch (e) { }
    FACE[key] = d; return d;
  })().catch(e => { delete FACE_P[key]; throw e; });
}
// resolve a style request into {d, synthBold, synthItalic} — sync (null if not loaded yet)
function faceFor(o) {
  const file = FONT_FILES[o.font] ? o.font : DEFAULT_FONT;
  const [st, sb, si] = styleFor(file, !!o.bold, !!o.italic);
  const d = FACE[file + '-' + st]; if (!d) return null;
  return { d, sb, si };
}
async function ensureFace(o) { const file = FONT_FILES[o.font] ? o.font : DEFAULT_FONT; await loadFaceData(faceKey(file, !!o.bold, !!o.italic)); return faceFor(o); }
let _faceWaiters = new Set();
function requestFace(o, cb) {
  const file = FONT_FILES[o.font] ? o.font : DEFAULT_FONT; const k = faceKey(file, !!o.bold, !!o.italic);
  loadFaceData(k).then(() => cb && cb()).catch(e => toast(e.message, 'err'));
}

function shapeRun(d, text) {
  let r = d.shapes.get(text); if (r) return r;
  let gl;
  if (d.hb) {
    const b = new HB.Buffer(); b.addText(text); b.guessSegmentProperties(); HB.shape(d.hb, b);
    gl = b.getGlyphInfosAndPositions().map(x => ({ g: x.codepoint, cl: x.cluster, ax: x.xAdvance, dx: x.xOffset, dy: x.yOffset }));
  } else {
    const run = d.fk.layout(text);
    let ci = 0;
    gl = run.glyphs.map((g, i) => { const p = run.positions[i]; return { g: g.id, cl: (g.codePoints && g.codePoints.length) ? i : i, ax: p.xAdvance, dx: p.xOffset, dy: p.yOffset }; });
    // fontkit: marks have zero advance; treat zero-advance glyphs as same cluster as previous
    gl.forEach((g, i) => { if (i && g.ax === 0) g.cl = gl[i - 1].cl; });
  }
  if (d.shapes.size > 3000) d.shapes.clear();
  d.shapes.set(text, gl); return gl;
}
function glyphSVG(d, g) {
  let s = d.paths.get(g); if (s !== undefined) return s;
  try { s = d.hb ? d.hb.glyphToPath(g) : d.fk.getGlyph(g).path.toSVG(); } catch (e) { s = ''; }
  d.paths.set(g, s); return s;
}
function glyphPath2D(d, g) { let p = d.p2d.get(g); if (!p) { p = new Path2D(glyphSVG(d, g) || ''); d.p2d.set(g, p); } return p; }
function glyphCmds(d, g) {
  const key = 'c' + g; let c = d.paths.get(key); if (c) return c;
  c = []; const s = glyphSVG(d, g); const re = /([MLQCZmlqcz])([^MLQCZmlqcz]*)/g; let m;
  while ((m = re.exec(s))) { const n = m[2].trim() ? m[2].trim().split(/[\s,]+/).map(Number) : []; c.push([m[1].toUpperCase(), n]); }
  d.paths.set(key, c); return c;
}
// measure width (font units → points) honouring letter spacing per cluster
function runWidth(d, gl, size, sp) {
  const s = size / d.upem; let w = 0;
  for (let i = 0; i < gl.length; i++) { w += gl[i].ax * s; if (sp && (i === gl.length - 1 || gl[i + 1].cl !== gl[i].cl)) w += sp; }
  return w;
}
const SEG_W = (typeof Intl !== 'undefined' && Intl.Segmenter) ? new Intl.Segmenter('th', { granularity: 'word' }) : null;
const SEG_G = (typeof Intl !== 'undefined' && Intl.Segmenter) ? new Intl.Segmenter('th', { granularity: 'grapheme' }) : null;
const LAYOUTS = new Map();
/* layout a text object: {text,size,font,bold,italic,boxW,align,lh,ls} */
function layoutText(o, F) {
  const d = F.d; const sp = (o.ls || 0) * o.size / 100;
  const key = [o.text, o.size, o.boxW || 0, o.align || 'left', o.lh || 1, o.ls || 0, d.key].join('\u0001');
  let L = LAYOUTS.get(key); if (L) return L;
  const W = str => runWidth(d, shapeRun(d, str), o.size, sp);
  const lines = [];
  for (const para of String(o.text ?? '').split('\n')) {
    if (!o.boxW || !para) { lines.push(para); continue; }
    const toks = SEG_W ? [...SEG_W.segment(para)].map(x => x.segment) : para.split(/(\s+)/).filter(Boolean);
    let cur = '';
    for (let t of toks) {
      const test = cur + t;
      if (W(test.replace(/\s+$/, '')) <= o.boxW || !cur.trim()) {
        if (!cur.trim() && W(t) > o.boxW) { // break long token by grapheme
          const gs = SEG_G ? [...SEG_G.segment(t)].map(x => x.segment) : [...t];
          for (const g of gs) { if (cur && W(cur + g) > o.boxW) { lines.push(cur); cur = g; } else cur += g; }
        } else cur = test;
      } else { lines.push(cur.replace(/\s+$/, '')); cur = t.replace(/^\s+/, ''); }
    }
    lines.push(cur.replace(/\s+$/, ''));
  }
  const adv = o.size * (d.asc + d.desc) * (o.lh || 1);
  const out = lines.map(str => { const gl = shapeRun(d, str || ' '); return { str, gl: str ? gl : [], w: str ? runWidth(d, gl, o.size, sp) : 0 }; });
  const w = o.boxW || Math.max(4, ...out.map(l => l.w));
  const ascOff = (adv - o.size * (d.asc + d.desc)) / 2 + o.size * d.asc; // CSS-like half leading
  L = { lines: out, adv, asc: ascOff, w, h: Math.max(1, out.length) * adv, sp };
  if (LAYOUTS.size > 1500) LAYOUTS.clear(); LAYOUTS.set(key, L); return L;
}
const ITALIC_K = 0.2;
/* iterate positioned glyphs: cb(gid, penX, baseline, scale) */
function forEachGlyph(o, F, L, cb) {
  const d = F.d, s = o.size / d.upem;
  L.lines.forEach((ln, i) => {
    const base = o.y + L.asc + i * L.adv;
    let x = o.x; const al = o.align || 'left';
    if (al === 'center') x += (L.w - ln.w) / 2; else if (al === 'right') x += L.w - ln.w;
    ln.x = x; ln.base = base;
    let pen = x;
    ln.gl.forEach((g, k) => {
      cb(g.g, pen + g.dx * s, base - g.dy * s, s);
      pen += g.ax * s; if (L.sp && (k === ln.gl.length - 1 || ln.gl[k + 1].cl !== g.cl)) pen += L.sp;
    });
  });
}
/* ---- canvas renderer for text objects ---- */
function canvasText(g, o, F) {
  const L = layoutText(o, F); const d = F.d;
  if (o.bg && o.bg !== 'none') { g.save(); g.fillStyle = o.bg; g.fillRect(o.x - 2, o.y - 1, L.w + 4, L.h + 2); g.restore(); }
  g.save(); g.fillStyle = o.color || '#000';
  const synthI = F.si, synthB = F.sb;
  if (synthB) { g.strokeStyle = o.color || '#000'; g.lineJoin = 'round'; }
  forEachGlyph(o, F, L, (gid, X, Y, s) => {
    g.save(); g.translate(X, Y); if (synthI) g.transform(1, 0, -ITALIC_K, 1, 0, 0); g.scale(s, -s);
    const p = glyphPath2D(d, gid); g.fill(p);
    if (synthB) { g.lineWidth = d.upem * 0.035; g.stroke(p); }
    g.restore();
  });
  if (o.underline || o.strike) {
    L.lines.forEach(ln => { if (!ln.w) return; const th = Math.max(0.6, o.size * 0.055);
      if (o.underline) g.fillRect(ln.x, ln.base + o.size * 0.12, ln.w, th);
      if (o.strike) g.fillRect(ln.x, ln.base - o.size * 0.28, ln.w, th); });
  }
  g.restore();
  return L;
}

/* =====================================================================
   PDF helpers
   ===================================================================== */
function geom(page) {
  const r = norm(page.getRotation().angle);
  const cb = page.getCropBox();
  return { r, cb, W: r % 180 ? cb.height : cb.width, H: r % 180 ? cb.width : cb.height };
}
// matrix that maps DISPLAY coords (top-left origin, y down, after /Rotate) to PDF user space
function dispMatrix(G) {
  const { r, cb } = G; const cx = cb.x, cy = cb.y, cw = cb.width, ch = cb.height;
  if (r === 0) return [1, 0, 0, -1, cx, cy + ch];
  if (r === 90) return [0, 1, 1, 0, cx, cy];
  if (r === 180) return [-1, 0, 0, 1, cx + cw, cy];
  return [0, -1, -1, 0, cx + cw, cy + ch];
}
const mApply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
function mInv(m) { const [a, b, c, d, e, f] = m; const det = a * d - b * c; return [d / det, -b / det, -c / det, a / det, (c * f - d * e) / det, (b * e - a * f) / det]; }
const WRAPPED = new WeakSet();
function ensureWrapped(doc, page) {
  if (WRAPPED.has(page.node)) return;
  page.node.normalize();
  const q = doc.context.register(doc.context.flateStream('q'));
  const Q = doc.context.register(doc.context.flateStream('Q'));
  page.node.wrapContentStreams(q, Q);
  WRAPPED.add(page.node);
}
/* Vector page writer: everything drawn in DISPLAY coordinates */
class PageWriter {
  constructor(doc, page) { this.doc = doc; this.page = page; this.G = geom(page); this.ops = []; this.gsCache = {}; this.fontCache = {}; }
  gs(opacity = 1, blend = 'Normal') {
    const k = opacity + blend; if (this.gsCache[k]) return this.gsCache[k];
    const ref = this.doc.context.register(this.doc.context.obj({ Type: 'ExtGState', ca: opacity, CA: opacity, BM: blend }));
    return this.gsCache[k] = this.page.node.newExtGState('GS', ref).toString();
  }
  xobj(ref) { return this.page.node.newXObject('Im', ref).toString(); }
  push(...s) { this.ops.push(...s); }
  finish() {
    if (!this.ops.length) return;
    ensureWrapped(this.doc, this.page);
    const m = dispMatrix(this.G).map(nf).join(' ');
    const str = 'q\n' + m + ' cm\n' + this.ops.join('\n') + '\nQ';
    const ref = this.doc.context.register(this.doc.context.flateStream(str));
    this.page.node.addContentStream(ref);
    this.ops = [];
  }
}
/* per-document caches: embedded fonts for invisible (searchable) text */
const DOCFONTS = new WeakMap();
async function embedTextFont(doc, d) {
  let m = DOCFONTS.get(doc); if (!m) { m = {}; DOCFONTS.set(doc, m); try { doc.registerFontkit(FK); } catch (e) { } }
  if (m[d.key] === undefined) { try { m[d.key] = await doc.embedFont(d.bytes, { subset: true }); } catch (e) { console.warn('embed font failed', e); m[d.key] = null; } }
  return m[d.key];
}
/* invisible text (render mode 3) so the PDF stays searchable/copyable */
function invisibleText(W, font, str, x, base, size, targetW) {
  if (!font || !str || !str.trim()) return;
  let hex, nat;
  try { hex = font.encodeText(str).toString(); nat = font.widthOfTextAtSize(str, size); } catch (e) { return; }
  const name = W.fontCache[font.ref.toString()] || (W.fontCache[font.ref.toString()] = W.page.node.newFontDictionary('F', font.ref).toString());
  const tz = targetW && nat > 0 ? clamp(100 * targetW / nat, 5, 1000) : 100;
  W.push(`BT ${name} ${nf(size)} Tf 3 Tr ${nf(tz)} Tz 1 0 0 -1 ${nf(x)} ${nf(base)} Tm ${hex} Tj ET`);
}
/* glyph outlines → PDF path operators */
function pdfGlyphs(W, o, F, L) {
  const d = F.d; const parts = []; const k = F.si ? ITALIC_K : 0;
  forEachGlyph(o, F, L, (gid, X, Y, s) => {
    const T = (gx, gy) => nf(X + s * (gx + k * gy)) + ' ' + nf(Y - s * gy);
    let cx = 0, cy = 0;
    for (const [op, n] of glyphCmds(d, gid)) {
      if (op === 'M') { parts.push(T(n[0], n[1]) + ' m'); cx = n[0]; cy = n[1]; }
      else if (op === 'L') { parts.push(T(n[0], n[1]) + ' l'); cx = n[0]; cy = n[1]; }
      else if (op === 'Q') { const [qx, qy, x, y] = n; parts.push(T(cx + 2 / 3 * (qx - cx), cy + 2 / 3 * (qy - cy)) + ' ' + T(x + 2 / 3 * (qx - x), y + 2 / 3 * (qy - y)) + ' ' + T(x, y) + ' c'); cx = x; cy = y; }
      else if (op === 'C') { parts.push(T(n[0], n[1]) + ' ' + T(n[2], n[3]) + ' ' + T(n[4], n[5]) + ' c'); cx = n[4]; cy = n[5]; }
      else if (op === 'Z') parts.push('h');
    }
  });
  return parts;
}
async function pdfText(W, o, { searchable = true } = {}) {
  const F = await ensureFace(o); const L = layoutText(o, F);
  const op = (o.opacity ?? 100) / 100;
  W.push('q'); if (op < 1) W.push(W.gs(op) + ' gs');
  if (o.bg && o.bg !== 'none') W.push(rgbStr(o.bg) + ' rg', `${nf(o.x - 2)} ${nf(o.y - 1)} ${nf(L.w + 4)} ${nf(L.h + 2)} re f`);
  const col = rgbStr(o.color || '#000');
  W.push(col + ' rg', col + ' RG');
  const parts = pdfGlyphs(W, o, F, L);
  if (parts.length) {
    if (F.sb) W.push(nf(o.size * 0.035) + ' w 1 j'); W.push(...parts, F.sb ? 'B' : 'f');
  }
  if (o.underline || o.strike) L.lines.forEach(ln => { if (!ln.w) return; const th = Math.max(0.6, o.size * 0.055);
    if (o.underline) W.push(`${nf(ln.x)} ${nf(ln.base + o.size * 0.12)} ${nf(ln.w)} ${nf(th)} re f`);
    if (o.strike) W.push(`${nf(ln.x)} ${nf(ln.base - o.size * 0.28)} ${nf(ln.w)} ${nf(th)} re f`); });
  W.push('Q');
  if (searchable) { const font = await embedTextFont(W.doc, F.d); L.lines.forEach(ln => invisibleText(W, font, ln.str, ln.x, ln.base, o.size, ln.w)); }
  return L;
}

/* ---------- pdf.js document helpers ---------- */
async function pageTextLines(pdfPage) {
  const vp = pdfPage.getViewport({ scale: 1 });
  const tc = await pdfPage.getTextContent();
  const items = [];
  for (const it of tc.items) {
    if (!it.str || !it.str.trim()) continue;
    const t = pdfjsLib.Util.transform(vp.transform, it.transform);
    if (Math.abs(t[1]) > 0.01 || Math.abs(t[2]) > 0.01) continue; // only horizontal text
    const size = Math.abs(t[3]) || Math.abs(t[0]); if (size < 2) continue;
    const w = it.width * (vp.scale || 1);
    items.push({ str: it.str, x: t[4], base: t[5], size, w, font: it.fontName, style: tc.styles[it.fontName] });
  }
  items.sort((a, b) => (Math.abs(a.base - b.base) < Math.min(a.size, b.size) * 0.35 ? a.x - b.x : a.base - b.base));
  const lines = [];
  for (const it of items) {
    const L = lines[lines.length - 1];
    if (L && Math.abs(L.base - it.base) < Math.min(L.size, it.size) * 0.35 && it.x - (L.x + L.w) < it.size * 1.6 && it.x - (L.x + L.w) > -it.size * 0.6) {
      const gap = it.x - (L.x + L.w);
      L.str += (gap > it.size * 0.2 && !/\s$/.test(L.str) ? ' ' : '') + it.str; L.w = Math.max(L.w, it.x + it.w - L.x); L.size = Math.max(L.size, it.size); L.items.push(it);
    } else lines.push({ str: it.str, x: it.x, base: it.base, size: it.size, w: it.w, font: it.font, style: it.style, items: [it] });
  }
  lines.forEach(L => { L.y = L.base - L.size * 0.92; L.h = L.size * 1.22; L.str = L.str.replace(/\s+/g, ' ').trim(); });
  return lines;
}

/* ---------- loading PDFs ---------- */
const isPdf = f => /pdf$/i.test(f.type) || /\.pdf$/i.test(f.name);
const isImg = f => /^image\//.test(f.type) || /\.(png|jpe?g|webp|gif|bmp)$/i.test(f.name);
async function askPassword(name, wrong) {
  return modal({
    title: wrong ? 'รหัสผ่านไม่ถูกต้อง ลองอีกครั้ง' : '🔒 ไฟล์นี้ถูกล็อกด้วยรหัสผ่าน',
    body: `<p style="margin:0 0 10px;color:var(--ink2)">กรอกรหัสผ่านเพื่อเปิด <b>${esc(name)}</b> — ระบบจะปลดล็อกเพื่อให้แก้ไขต่อได้</p><input class="inp" type="password" id="pw" placeholder="รหัสผ่าน" autocomplete="off">`,
    buttons: [{ label: 'ยกเลิก', value: null }, { label: 'ปลดล็อก', pri: true, value: bk => $('#pw', bk).value }]
  });
}
async function loadLib(bytes, name = 'ไฟล์') {
  try { return { doc: await PDFDocument.load(bytes, { updateMetadata: false }), wasLocked: false }; }
  catch (e) { if (!/encrypt/i.test(e.message || '')) throw new Error('ไม่สามารถอ่านไฟล์ PDF: ' + (e.message || e)); }
  try { return { doc: await PDFDocument.load(bytes, { password: '', updateMetadata: false }), wasLocked: true }; } catch (e) { }
  let wrong = false;
  while (true) {
    busy(false);
    const pw = await askPassword(name, wrong);
    if (pw === null) throw new Error('CANCEL');
    busy(true, 'กำลังปลดล็อก…');
    try { return { doc: await PDFDocument.load(bytes, { password: pw, updateMetadata: false }), wasLocked: true }; }
    catch (e) { wrong = true; }
  }
}
async function imageFileToEmbed(doc, file) {
  const bmp = await createImageBitmap(file).catch(() => null);
  if (!bmp) throw new Error('อ่านรูปไม่ได้: ' + file.name);
  const c = document.createElement('canvas'); c.width = bmp.width; c.height = bmp.height;
  const g = c.getContext('2d');
  const png = /png|gif|webp/i.test(file.type) || /\.(png|gif|webp)$/i.test(file.name);
  if (!png) { g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); }
  g.drawImage(bmp, 0, 0);
  const buf = await canvasBytes(c, png ? 'image/png' : 'image/jpeg', 0.92);
  return { img: png ? await doc.embedPng(buf) : await doc.embedJpg(buf), w: bmp.width, h: bmp.height };
}
const PAPER = { a4: [595.28, 841.89], a3: [841.89, 1190.55], a5: [419.53, 595.28], letter: [612, 792], legal: [612, 1008] };
async function addImagePage(doc, file, opt = {}) {
  const { size = 'fit', orient = 'auto', margin = 0 } = opt;
  const { img, w, h } = await imageFileToEmbed(doc, file);
  if (size === 'fit') { const k = 72 / 96; const p = doc.addPage([w * k + margin * 2, h * k + margin * 2]); p.drawImage(img, { x: margin, y: margin, width: w * k, height: h * k }); return; }
  let [pw, ph] = PAPER[size]; const land = orient === 'land' || (orient === 'auto' && w > h); if (land) [pw, ph] = [ph, pw];
  const p = doc.addPage([pw, ph]); const s = Math.min((pw - margin * 2) / w, (ph - margin * 2) / h);
  p.drawImage(img, { x: (pw - w * s) / 2, y: (ph - h * s) / 2, width: w * s, height: h * s });
}
async function filesToPdf(files) {
  files = [...files].filter(f => isPdf(f) || isImg(f));
  if (!files.length) throw new Error('รองรับเฉพาะไฟล์ PDF และรูปภาพ');
  let wasLocked = false;
  if (files.length === 1 && isPdf(files[0])) {
    const b = new Uint8Array(await files[0].arrayBuffer());
    const { doc, wasLocked: wl } = await loadLib(b, files[0].name);
    return { bytes: wl ? await doc.save() : b, wasLocked: wl, pages: doc.getPageCount() };
  }
  const out = await PDFDocument.create();
  for (const f of files) {
    busy(true, 'กำลังอ่าน ' + f.name + '…'); await tick();
    if (isPdf(f)) { const { doc, wasLocked: wl } = await loadLib(new Uint8Array(await f.arrayBuffer()), f.name); wasLocked ||= wl; (await out.copyPages(doc, doc.getPageIndices())).forEach(p => out.addPage(p)); }
    else await addImagePage(out, f, { size: 'fit' });
  }
  return { bytes: await out.save(), wasLocked, pages: out.getPageCount() };
}

/* ---------- ranges ---------- */
function parseGroups(str, n) {
  str = (str || '').trim(); if (!str || /^(all|ทั้งหมด)$/i.test(str)) return [[...Array(n).keys()]];
  const groups = [];
  for (const part of str.split(/[,;\s]+/).filter(Boolean)) {
    const m = part.match(/^(\d*)\s*-\s*(\d*)$/); let a, b;
    if (m) { a = m[1] ? +m[1] : 1; b = m[2] ? +m[2] : n; }
    else if (/^\d+$/.test(part)) a = b = +part;
    else if (/^(odd|คี่)$/i.test(part)) { groups.push([...Array(n).keys()].filter(i => i % 2 === 0)); continue; }
    else if (/^(even|คู่)$/i.test(part)) { groups.push([...Array(n).keys()].filter(i => i % 2 === 1)); continue; }
    else throw new Error('รูปแบบช่วงหน้าไม่ถูกต้อง: "' + part + '"');
    if (a < 1 || b < 1 || a > n || b > n) throw new Error(`หน้า ${part} อยู่นอกช่วง (มี ${n} หน้า)`);
    const g = []; if (a <= b) for (let k = a; k <= b; k++) g.push(k - 1); else for (let k = a; k >= b; k--) g.push(k - 1);
    groups.push(g);
  }
  return groups;
}
const parseRange = (str, n) => { const s = new Set(); parseGroups(str, n).flat().forEach(i => s.add(i)); return [...s].sort((a, b) => a - b); };

/* =====================================================================
   Content-stream text remover — deletes original text runs inside boxes
   (keeps following text in place by replacing each run with a TJ shift)
   ===================================================================== */
function csTokenize(s) {
  const toks = []; let i = 0; const n = s.length;
  const isWs = c => c === 32 || c === 10 || c === 13 || c === 9 || c === 12 || c === 0;
  const isDelim = c => c === 40 || c === 41 || c === 60 || c === 62 || c === 91 || c === 93 || c === 123 || c === 125 || c === 47 || c === 37;
  while (i < n) {
    const c = s.charCodeAt(i);
    if (isWs(c)) { i++; continue; }
    if (c === 37) { while (i < n && s[i] !== '\n' && s[i] !== '\r') i++; continue; } // comment
    const st = i;
    if (c === 40) { let depth = 0; do { const ch = s[i]; if (ch === '\\') { i += 2; continue; } if (ch === '(') depth++; else if (ch === ')') depth--; i++; } while (i < n && depth > 0); toks.push({ t: 'str', st, en: i }); continue; }
    if (c === 60 && s[i + 1] === '<') { toks.push({ t: '<<', st, en: i + 2 }); i += 2; continue; }
    if (c === 62 && s[i + 1] === '>') { toks.push({ t: '>>', st, en: i + 2 }); i += 2; continue; }
    if (c === 60) { const e = s.indexOf('>', i); i = e < 0 ? n : e + 1; toks.push({ t: 'hex', st, en: i }); continue; }
    if (c === 91 || c === 93 || c === 123 || c === 125) { toks.push({ t: s[i], st, en: i + 1 }); i++; continue; }
    if (c === 47) { i++; while (i < n && !isWs(s.charCodeAt(i)) && !isDelim(s.charCodeAt(i))) i++; toks.push({ t: 'name', st, en: i }); continue; }
    while (i < n && !isWs(s.charCodeAt(i)) && !isDelim(s.charCodeAt(i))) i++;
    if (i === st) { i++; continue; }
    const w = s.slice(st, i);
    if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(w)) toks.push({ t: 'num', st, en: i, v: parseFloat(w) });
    else if (w === 'true' || w === 'false' || w === 'null') toks.push({ t: 'kw', st, en: i });
    else {
      toks.push({ t: 'op', st, en: i, v: w });
      if (w === 'ID') { // inline image binary: skip to EI
        let k = i + 1; while (k < n) { const e = s.indexOf('EI', k); if (e < 0) { k = n; break; } const b = s.charCodeAt(e - 1), a = s.charCodeAt(e + 2);
          if ((isWs(b)) && (isNaN(a) || isWs(a))) { k = e; break; } k = e + 2; }
        i = k;
      }
    }
  }
  return toks;
}
function csStrBytes(s, tok) {
  const raw = s.slice(tok.st, tok.en); const out = [];
  if (tok.t === 'hex') { let h = raw.slice(1, -1).replace(/\s+/g, ''); if (h.length % 2) h += '0'; for (let i = 0; i < h.length; i += 2) out.push(parseInt(h.substr(i, 2), 16)); return out; }
  const b = raw.slice(1, -1);
  for (let i = 0; i < b.length; i++) {
    let ch = b[i];
    if (ch !== '\\') { out.push(b.charCodeAt(i) & 255); continue; }
    ch = b[++i];
    const m = { n: 10, r: 13, t: 9, b: 8, f: 12, '(': 40, ')': 41, '\\': 92 };
    if (ch in m) out.push(m[ch]);
    else if (/[0-7]/.test(ch)) { let o = ch; while (o.length < 3 && /[0-7]/.test(b[i + 1])) o += b[++i]; out.push(parseInt(o, 8) & 255); }
    else if (ch === '\r') { if (b[i + 1] === '\n') i++; }
    else if (ch === '\n') { }
    else if (ch !== undefined) out.push(ch.charCodeAt(0) & 255);
  }
  return out;
}
const mMul = (A, B) => [A[0] * B[0] + A[1] * B[2], A[0] * B[1] + A[1] * B[3], A[2] * B[0] + A[3] * B[2], A[2] * B[1] + A[3] * B[3], A[4] * B[0] + A[5] * B[2] + B[4], A[4] * B[1] + A[5] * B[3] + B[5]];
function fontMetrics(doc, fontDict) {
  const L = PDFLib; const get = (d, k) => { try { return d.lookup(L.PDFName.of(k)); } catch (e) { return undefined; } };
  const num = v => v && v.asNumber ? v.asNumber() : (typeof v === 'number' ? v : undefined);
  const sub = get(fontDict, 'Subtype'); const subN = sub ? sub.toString() : '';
  if (subN === '/Type0') {
    const df = get(fontDict, 'DescendantFonts'); const cid = df && df.lookup ? df.lookup(0) : null; const map = new Map(); let dw = 1000;
    if (cid) { const DW = num(get(cid, 'DW')); if (DW != null) dw = DW; const W = get(cid, 'W');
      if (W && W.size) { const arr = W.asArray().map(x => doc.context.lookup(x) || x); let i = 0;
        while (i < arr.length) { const a = num(arr[i]); const nx = arr[i + 1];
          if (nx && nx.asArray) { nx.asArray().forEach((w, k) => map.set(a + k, num(doc.context.lookup(w) || w))); i += 2; }
          else { const b = num(arr[i + 1]), w = num(arr[i + 2]); for (let c = a; c <= b && c - a < 70000; c++) map.set(c, w); i += 3; } } } }
    return { two: true, k: 0.001, w: code => map.get(code) ?? dw };
  }
  const fc = num(get(fontDict, 'FirstChar')) ?? 0; const W = get(fontDict, 'Widths'); let miss = 0;
  try { const fd = get(fontDict, 'FontDescriptor'); if (fd) miss = num(get(fd, 'MissingWidth')) ?? 0; } catch (e) { }
  const ws = W && W.asArray ? W.asArray().map(x => num(doc.context.lookup(x) || x)) : null;
  let k = 0.001; if (subN === '/Type3') { try { const fm = get(fontDict, 'FontMatrix'); k = num(doc.context.lookup(fm.get(0)) || fm.get(0)) || 0.001; } catch (e) { } }
  return { two: false, k, w: code => ws ? (ws[code - fc] ?? miss) : 520 * 0.001 / k };
}
function removeTextInBoxes(doc, page, boxes) {
  const L = PDFLib; page.node.normalize();
  const contents = page.node.Contents(); if (!contents) return 0;
  const refs = contents.asArray ? contents.asArray() : [contents];
  let src = '';
  for (const r of refs) { const st = doc.context.lookup(r); if (!st) continue; let bytes;
    try { bytes = (st instanceof L.PDFRawStream) ? L.decodePDFRawStream(st).decode() : st.getUnencodedContents(); } catch (e) { console.warn('cannot decode content stream', e); return 0; }
    let t = ''; for (let i = 0; i < bytes.length; i += 8192) t += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192)); src += t + '\n'; }
  const toks = csTokenize(src);
  const res = page.node.Resources(); const fonts = res ? res.lookup(L.PDFName.of('Font')) : null; const fcache = {};
  const metrics = name => { if (fcache[name]) return fcache[name]; let fd = null; try { fd = fonts && fonts.lookup(L.PDFName.of(name.slice(1))); } catch (e) { } return fcache[name] = fd ? fontMetrics(doc, fd) : { two: false, k: 0.001, w: () => 520 }; };
  const Mi = mInv(dispMatrix(geom(page)));
  let gs = { ctm: [1, 0, 0, 1, 0, 0], Tc: 0, Tw: 0, Th: 1, TL: 0, font: null, size: 0, rise: 0 }; const stack = [];
  let Tm = [1, 0, 0, 1, 0, 0], Tlm = [1, 0, 0, 1, 0, 0];
  const edits = []; let removed = 0; let operands = [];
  const runAdvance = (bytesArr, fm) => { let tx = 0; if (fm.two) { for (let i = 0; i + 1 < bytesArr.length; i += 2) tx += (fm.w((bytesArr[i] << 8) | bytesArr[i + 1]) * fm.k * gs.size + gs.Tc) * gs.Th; }
    else for (const b of bytesArr) tx += (fm.w(b) * fm.k * gs.size + gs.Tc + (b === 32 ? gs.Tw : 0)) * gs.Th; return tx; };
  const inBox = (x0, x1) => { // run from text-space (0..x1) on baseline → display
    const M = mMul(Tm, gs.ctm); const a = mApply(M, 0, gs.rise), b = mApply(M, x1, gs.rise);
    const da = mApply(Mi, a[0], a[1]), db = mApply(Mi, b[0], b[1]); const mx = (da[0] + db[0]) / 2, my = (da[1] + db[1]) / 2;
    return boxes.some(B => mx >= B.x - 1 && mx <= B.x + B.w + 1 && my >= B.y - 1 && my <= B.y + B.h + 2 && Math.min(da[0], db[0]) >= B.x - gs.size && Math.max(da[0], db[0]) <= B.x + B.w + gs.size); };
  const show = (startTok, endTok, items, prefix) => { // items: array of {bytes}|{num}
    const fm = metrics(gs.font || '/F?'); let tx = 0;
    for (const it of items) { if (it.num != null) tx -= it.num / 1000 * gs.size * gs.Th; else tx += runAdvance(it.bytes, fm); }
    if (gs.size && inBox(0, tx)) { const k = gs.size * gs.Th; edits.push([startTok.st, endTok.en, (prefix || '') + (k ? `[${nf(-tx / k * 1000)}] TJ` : '')]); removed++; }
    Tm = mMul([1, 0, 0, 1, tx, 0], Tm);
  };
  for (let k = 0; k < toks.length; k++) {
    const tk = toks[k];
    if (tk.t !== 'op') { operands.push(k); continue; }
    const op = tk.v; const O = operands.map(i => toks[i]); const nums = O.filter(o => o.t === 'num').map(o => o.v);
    const first = O.length ? O[0] : tk;
    switch (op) {
      case 'q': stack.push({ ...gs, ctm: [...gs.ctm] }); break;
      case 'Q': if (stack.length) gs = stack.pop(); break;
      case 'cm': if (nums.length === 6) gs.ctm = mMul(nums, gs.ctm); break;
      case 'BT': Tm = [1, 0, 0, 1, 0, 0]; Tlm = [1, 0, 0, 1, 0, 0]; break;
      case 'Tm': if (nums.length === 6) { Tm = [...nums]; Tlm = [...nums]; } break;
      case 'Td': Tlm = mMul([1, 0, 0, 1, nums[0] || 0, nums[1] || 0], Tlm); Tm = [...Tlm]; break;
      case 'TD': gs.TL = -(nums[1] || 0); Tlm = mMul([1, 0, 0, 1, nums[0] || 0, nums[1] || 0], Tlm); Tm = [...Tlm]; break;
      case 'T*': Tlm = mMul([1, 0, 0, 1, 0, -gs.TL], Tlm); Tm = [...Tlm]; break;
      case 'Tc': gs.Tc = nums[0] || 0; break; case 'Tw': gs.Tw = nums[0] || 0; break; case 'Tz': gs.Th = (nums[0] ?? 100) / 100; break;
      case 'TL': gs.TL = nums[0] || 0; break; case 'Ts': gs.rise = nums[0] || 0; break;
      case 'Tf': { const nm = O.find(o => o.t === 'name'); gs.font = nm ? src.slice(nm.st, nm.en) : gs.font; gs.size = nums[0] ?? gs.size; break; }
      case 'Tj': { const s0 = O.find(o => o.t === 'str' || o.t === 'hex'); if (s0) show(first, tk, [{ bytes: csStrBytes(src, s0) }]); break; }
      case "'": { Tlm = mMul([1, 0, 0, 1, 0, -gs.TL], Tlm); Tm = [...Tlm]; const s0 = O.find(o => o.t === 'str' || o.t === 'hex'); if (s0) show(first, tk, [{ bytes: csStrBytes(src, s0) }], 'T* '); break; }
      case '"': { gs.Tw = nums[0] || 0; gs.Tc = nums[1] || 0; Tlm = mMul([1, 0, 0, 1, 0, -gs.TL], Tlm); Tm = [...Tlm]; const s0 = O.find(o => o.t === 'str' || o.t === 'hex');
        if (s0) show(first, tk, [{ bytes: csStrBytes(src, s0) }], `${nf(gs.Tw)} Tw ${nf(gs.Tc)} Tc T* `); break; }
      case 'TJ': { const items = O.filter(o => o.t === 'num' || o.t === 'str' || o.t === 'hex').map(o => o.t === 'num' ? { num: o.v } : { bytes: csStrBytes(src, o) }); show(first, tk, items); break; }
    }
    operands = [];
  }
  if (!removed) return 0;
  edits.sort((a, b) => b[0] - a[0]); let out = src;
  for (const [a, b, r] of edits) out = out.slice(0, a) + r + out.slice(b);
  const bytes = new Uint8Array(out.length); for (let i = 0; i < out.length; i++) bytes[i] = out.charCodeAt(i) & 255;
  const ref = doc.context.register(doc.context.flateStream(bytes));
  page.node.set(L.PDFName.of('Contents'), doc.context.obj([ref]));
  return removed;
}
