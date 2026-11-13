'use strict';
/* =====================================================================
   PDF Studio Pro — editor (vector output, HarfBuzz Thai text)
   ===================================================================== */
const E = {
  tool: 'select', zoom: 1.25, annots: {}, sel: null, undo: [], redo: [], pages: [], drag: null, editing: null, ver: -1, clip: null,
  p: { font: 'THSarabunNew', size: 16, bold: false, italic: false, underline: false, strike: false, align: 'left', color: '#1d3fd6', bg: 'none', lh: 1, ls: 0,
       stroke: '#d7372b', fill: 'none', width: 2, opacity: 100, hlColor: '#ffe14d', penColor: '#1d3fd6' },
  search: { q: '', hits: [], i: -1 }, rail: true,
};
const ETOOLS = [
  ['select', 'cursor', 'เลือก / ย้าย (V)', 'เลือก'], ['edittext', 'textEdit', 'แก้ข้อความเดิมในไฟล์ (E)', 'แก้ข้อความเดิม'], ['text', 'text', 'เพิ่มข้อความ (T)', 'ข้อความ'],
  ['pen', 'pen', 'ปากกา (P)'], ['hl', 'hl', 'ไฮไลต์ (H)'], ['rect', 'rect', 'สี่เหลี่ยม (R)'], ['ellipse', 'ellipse', 'วงรี (O)'], ['line', 'line', 'เส้นตรง (L)'], ['arrow', 'arrow', 'ลูกศร (A)'],
  ['white', 'white', 'ลบ/ปิดทับด้วยสีพื้น (W)', 'ลบ'], ['redact', 'redact', 'ปิดข้อมูลถาวร (Redact)', 'ปิดถาวร'],
];
const STAMPS = [['อนุมัติ', '#15803d'], ['ไม่อนุมัติ', '#b91c1c'], ['สำเนาถูกต้อง', '#1d3fd6'], ['ได้รับแล้ว', '#1d3fd6'], ['ด่วนที่สุด', '#b91c1c'], ['ด่วน', '#b91c1c'], ['ลับ', '#b91c1c'], ['ชำระแล้ว', '#15803d'],
  ['ตรวจสอบแล้ว', '#15803d'], ['ยกเลิก', '#b91c1c'], ['APPROVED', '#15803d'], ['REJECTED', '#b91c1c'], ['PAID', '#15803d'], ['RECEIVED', '#1d3fd6'], ['CONFIDENTIAL', '#b91c1c'], ['DRAFT', '#6b7280']];
const BOXY = new Set(['rect', 'ellipse', 'white', 'redact', 'image', 'mark']);

function resetEdit() { E.annots = {}; E.sel = null; E.undo = []; E.redo = []; E.editing = null; E.ver = S.ver; E.search = { q: E.search.q, hits: [], i: -1 }; }
const hasAnnots = () => Object.values(E.annots).some(a => a.length);
function editPending() { return E.ver === S.ver && (hasAnnots() || !!E.editing); }
const cloneObj = o => ({ ...o, pts: o.pts ? o.pts.map(p => [...p]) : undefined });
const snap = () => { const s = {}; for (const k in E.annots) s[k] = E.annots[k].map(cloneObj); return s; };
function pushUndo() { E.undo.push(snap()); if (E.undo.length > 100) E.undo.shift(); E.redo = []; updUndoBtns(); }
function updUndoBtns() { const u = $('#eUndo'), r = $('#eRedo'); if (u) u.disabled = !E.undo.length; if (r) r.disabled = !E.redo.length; const c = $('#eCount'); if (c) { const n = Object.values(E.annots).reduce((a, b) => a + b.length, 0); c.textContent = n ? n + ' รายการ' : ''; } }
function eUndo() { finishText(); if (!E.undo.length) return; E.redo.push(snap()); E.annots = E.undo.pop(); E.sel = null; redrawAll(); updUndoBtns(); syncPropsUI(); }
function eRedo() { finishText(); if (!E.redo.length) return; E.undo.push(snap()); E.annots = E.redo.pop(); E.sel = null; redrawAll(); updUndoBtns(); syncPropsUI(); }
const selObj = () => E.sel ? E.annots[E.sel.p]?.[E.sel.i] : null;

/* ---------- geometry ---------- */
function stampLayout(o) {
  const t1 = { text: o.label, font: o.font || 'Kanit', bold: true, size: o.size, color: o.color, lh: 1, align: 'center' };
  const F1 = faceFor(t1); if (!F1) { requestFace(t1, redrawAll); return null; }
  const L1 = layoutText(t1, F1); let L2 = null, F2 = null, t2 = null;
  if (o.sub) { t2 = { text: o.sub, font: o.font || 'Kanit', bold: false, size: o.size * 0.42, color: o.color, lh: 1, align: 'center' }; F2 = faceFor(t2); if (!F2) { requestFace(t2, redrawAll); return null; } L2 = layoutText(t2, F2); }
  const pad = o.size * 0.32; const w = Math.max(L1.w, L2 ? L2.w : 0) + pad * 2.4, h = L1.h + (L2 ? L2.h : 0) + pad * 1.4;
  t1.x = o.x + (w - L1.w) / 2; t1.y = o.y + pad * 0.7; if (t2) { t2.x = o.x + (w - L2.w) / 2; t2.y = t1.y + L1.h - o.size * 0.05; }
  return { w, h, t1, F1, t2, F2 };
}
/* ---------- signature block (ลงชื่อ / ชื่อ / ตำแหน่ง / วันที่) ---------- */
const TH_DIG = s => String(s).replace(/[0-9]/g, d => '๐๑๒๓๔๕๖๗๘๙'[d]);
function sigLayout(o) {
  const lab = { font: o.font || 'THSarabunNew', size: o.size, color: o.labelColor || '#111111', lh: 1, align: 'left' };
  const val = { ...lab, color: o.ink, bold: !!o.inkBold };
  const FL = faceFor(lab), FV = faceFor(val); if (!FL) { requestFace(lab, redrawAll); return null; } if (!FV) { requestFace(val, redrawAll); return null; }
  const tw = t => layoutText({ ...lab, text: t }, FL).w; const L0 = layoutText({ ...lab, text: 'ก' }, FL);
  const rowH = o.size * 1.65, asc = L0.asc, gap = o.size * 0.25; const W = o.w; const texts = [], dots = [];
  const num = v => o.thaiDigits ? TH_DIG(v) : String(v);
  let y = o.y; const rows = [];
  if (o.showSign !== false) rows.push('sign'); if (o.showName !== false) rows.push('name'); if (o.showPos !== false) rows.push('pos'); if (o.showDate !== false) rows.push('date');
  const sigTop = y; let sigRect = null; if (o.showSign !== false && o.sigSrc) y += o.size * 1.4; // room for the handwritten signature
  const label = (t, x, by) => texts.push({ ...lab, text: t, x, y: by - asc, F: FL });
  const value = (t, x1, x2, by) => { if (!t) return; const w = layoutText({ ...val, text: t }, FV).w; texts.push({ ...val, text: t, x: (x1 + x2) / 2 - w / 2, y: by - asc - o.size * 0.08, F: FV }); };
  const dot = (x1, x2, by) => dots.push([x1, x2, by + o.size * 0.12]);
  const leftW = tw('(ลงชื่อ)') + gap;
  for (const r of rows) {
    const base = y + asc;
    if (r === 'sign') { label('(ลงชื่อ)', o.x, base); dot(o.x + leftW, o.x + W, base); if (o.sigSrc) sigRect = { x1: o.x + leftW, x2: o.x + W, top: sigTop, base }; }
    else if (r === 'name') { const pw = tw('('), x1 = o.x + leftW * 0.55, x2 = o.x + W - pw; label('(', x1 - pw - 1, base); label(')', x2 + 1, base); dot(x1, x2, base); value(o.name, x1, x2, base); }
    else if (r === 'pos') { const lw = tw(o.posLabel || 'ตำแหน่ง') + gap; label(o.posLabel || 'ตำแหน่ง', o.x, base); dot(o.x + lw, o.x + W, base); value(o.pos, o.x + lw, o.x + W, base); }
    else if (r === 'date') { const a = tw('วันที่') + gap * 0.6, b = tw('เดือน') + gap * 1.2, c = tw('พ.ศ.') + gap * 1.2; const rest = W - a - b - c;
      const d1 = rest * 0.2, d2 = rest * 0.44, d3 = rest * 0.36; let x = o.x;
      label('วันที่', x, base); x += a; dot(x, x + d1, base); value(num(o.day || ''), x, x + d1, base); x += d1 + gap * 0.6;
      label('เดือน', x, base); x += b - gap * 0.6; dot(x, x + d2, base); value(o.month || '', x, x + d2, base); x += d2 + gap * 0.6;
      label('พ.ศ.', x, base); x += c - gap * 0.6; dot(x, x + d3, base); value(num(o.year || ''), x, x + d3, base); }
    y += rowH;
  }
  let img = null; if (sigRect && o._img) { const ar = o._img.naturalWidth / o._img.naturalHeight; let h = o.size * 2.1, w = h * ar; const maxW = (sigRect.x2 - sigRect.x1) * 0.9; if (w > maxW) { w = maxW; h = w / ar; }
    img = { x: (sigRect.x1 + sigRect.x2) / 2 - w / 2, y: sigRect.base - h * 0.78, w, h }; }
  return { w: W, h: y - o.y - rowH + o.size * 1.4, texts, dots, img };
}
async function ensureSigFaces(o) { await ensureFace({ font: o.font || 'THSarabunNew' }); await ensureFace({ font: o.font || 'THSarabunNew', bold: !!o.inkBold }); if (o.sigSrc && !o._img) { o._img = new Image(); o._img.src = o.sigSrc; await o._img.decode().catch(() => { }); } }
function bbox(o) {
  if (o.type === 'text') { const F = faceFor(o); if (!F) { requestFace(o, redrawAll); return { x: o.x, y: o.y, w: Math.max(20, (o.text || '').length * o.size * 0.5), h: o.size * 1.4 }; }
    const L = layoutText(o, F); return { x: o.x, y: o.y, w: L.w, h: L.h }; }
  if (o.type === 'sigblock') { const S2 = sigLayout(o); const top = S2 && S2.img ? Math.min(o.y, S2.img.y) : o.y; return S2 ? { x: o.x - 2, y: top, w: S2.w + 4, h: S2.h + (o.y - top) } : { x: o.x, y: o.y, w: o.w, h: 80 }; }
  if (o.type === 'stamp') { const S2 = stampLayout(o); return S2 ? { x: o.x, y: o.y, w: S2.w, h: S2.h } : { x: o.x, y: o.y, w: 100, h: 40 }; }
  if (o.pts) { const xs = o.pts.map(p => p[0]), ys = o.pts.map(p => p[1]), m = o.width / 2; const x = Math.min(...xs) - m, y = Math.min(...ys) - m; return { x, y, w: Math.max(...xs) + m - x, h: Math.max(...ys) + m - y }; }
  if ('x1' in o) { const m = Math.max(3, o.width * 2); const x = Math.min(o.x1, o.x2) - m, y = Math.min(o.y1, o.y2) - m; return { x, y, w: Math.abs(o.x2 - o.x1) + 2 * m, h: Math.abs(o.y2 - o.y1) + 2 * m }; }
  const m = (o.type === 'rect' || o.type === 'ellipse') ? (o.width || 0) / 2 : 0;
  return { x: Math.min(o.x, o.x + o.w) - m, y: Math.min(o.y, o.y + o.h) - m, w: Math.abs(o.w) + 2 * m, h: Math.abs(o.h) + 2 * m };
}
function rrect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r); g.lineTo(x + w, y + h - r); g.quadraticCurveTo(x + w, y + h, x + w - r, y + h); g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r); g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.closePath(); }
function rrectPdf(x, y, w, h, r) { const k = 0.5523 * r; return `${nf(x + r)} ${nf(y)} m ${nf(x + w - r)} ${nf(y)} l ${nf(x + w - r + k)} ${nf(y)} ${nf(x + w)} ${nf(y + r - k)} ${nf(x + w)} ${nf(y + r)} c ${nf(x + w)} ${nf(y + h - r)} l ${nf(x + w)} ${nf(y + h - r + k)} ${nf(x + w - r + k)} ${nf(y + h)} ${nf(x + w - r)} ${nf(y + h)} c ${nf(x + r)} ${nf(y + h)} l ${nf(x + r - k)} ${nf(y + h)} ${nf(x)} ${nf(y + h - r + k)} ${nf(x)} ${nf(y + h - r)} c ${nf(x)} ${nf(y + r)} l ${nf(x)} ${nf(y + r - k)} ${nf(x + r - k)} ${nf(y)} ${nf(x + r)} ${nf(y)} c h`; }
function smoothPts(p) { // returns list of segments for quadratic smoothing: [['M',x,y],['Q',cx,cy,x,y]...,['L',x,y]]
  const s = [['M', p[0][0], p[0][1]]]; if (p.length === 1) { s.push(['L', p[0][0] + 0.01, p[0][1]]); return s; }
  for (let i = 1; i < p.length - 1; i++) s.push(['Q', p[i][0], p[i][1], (p[i][0] + p[i + 1][0]) / 2, (p[i][1] + p[i + 1][1]) / 2]);
  s.push(['L', p[p.length - 1][0], p[p.length - 1][1]]); return s;
}
function markSegs(o) { const { x, y, w, h } = o;
  if (o.kind === 'check') return [[[x + w * 0.12, y + h * 0.55], [x + w * 0.4, y + h * 0.85], [x + w * 0.9, y + h * 0.15]]];
  if (o.kind === 'cross') return [[[x + w * 0.15, y + h * 0.15], [x + w * 0.85, y + h * 0.85]], [[x + w * 0.85, y + h * 0.15], [x + w * 0.15, y + h * 0.85]]];
  return []; }

/* ---------- canvas drawing ---------- */
function drawObj(g, o) {
  if (o._hide) return;
  g.save(); g.globalAlpha = (o.opacity ?? 100) / 100; g.lineCap = 'round'; g.lineJoin = 'round';
  switch (o.type) {
    case 'text': { if (o._box) { g.strokeStyle = '#2563eb'; g.lineWidth = 1 / E.zoom; g.setLineDash([4 / E.zoom, 3 / E.zoom]); g.strokeRect(o.x, o.y, o.w, o.h); break; } const F = faceFor(o); if (!F) { requestFace(o, redrawAll); break; } canvasText(g, o, F); break; }
    case 'pen': case 'hl': { g.strokeStyle = o.color; g.lineWidth = o.width; if (o.type === 'hl') { g.lineCap = 'butt'; g.globalCompositeOperation = 'multiply'; }
      g.beginPath(); for (const s of smoothPts(o.pts)) { if (s[0] === 'M') g.moveTo(s[1], s[2]); else if (s[0] === 'Q') g.quadraticCurveTo(s[1], s[2], s[3], s[4]); else g.lineTo(s[1], s[2]); } g.stroke(); break; }
    case 'rect': if (o.fill && o.fill !== 'none') { g.fillStyle = o.fill; g.fillRect(o.x, o.y, o.w, o.h); } if (o.width > 0) { g.strokeStyle = o.color; g.lineWidth = o.width; g.lineJoin = 'miter'; g.strokeRect(o.x, o.y, o.w, o.h); } break;
    case 'ellipse': g.beginPath(); g.ellipse(o.x + o.w / 2, o.y + o.h / 2, Math.abs(o.w / 2), Math.abs(o.h / 2), 0, 0, Math.PI * 2); if (o.fill && o.fill !== 'none') { g.fillStyle = o.fill; g.fill(); } if (o.width > 0) { g.strokeStyle = o.color; g.lineWidth = o.width; g.stroke(); } break;
    case 'white': g.fillStyle = o.color || '#fff'; g.fillRect(o.x, o.y, o.w, o.h); break;
    case 'redact': g.fillStyle = '#000'; g.fillRect(o.x, o.y, o.w, o.h); if (E.tool !== '__export') { g.strokeStyle = '#ef4444'; g.lineWidth = 1 / E.zoom; g.setLineDash([4 / E.zoom, 3 / E.zoom]); g.strokeRect(o.x, o.y, o.w, o.h); } break;
    case 'line': case 'arrow': { g.strokeStyle = g.fillStyle = o.color; g.lineWidth = o.width; g.beginPath(); g.moveTo(o.x1, o.y1); g.lineTo(o.x2, o.y2); g.stroke();
      if (o.type === 'arrow') { const a = Math.atan2(o.y2 - o.y1, o.x2 - o.x1), L = Math.max(8, o.width * 4); g.beginPath(); g.moveTo(o.x2, o.y2); g.lineTo(o.x2 - L * Math.cos(a - .45), o.y2 - L * Math.sin(a - .45)); g.lineTo(o.x2 - L * Math.cos(a + .45), o.y2 - L * Math.sin(a + .45)); g.closePath(); g.fill(); } break; }
    case 'image': if (o.img) g.drawImage(o.img, o.x, o.y, o.w, o.h); break;
    case 'mark': { g.strokeStyle = g.fillStyle = o.color; g.lineWidth = o.width || Math.max(1.5, o.w * 0.13);
      if (o.kind === 'dot') { g.beginPath(); g.arc(o.x + o.w / 2, o.y + o.h / 2, Math.min(o.w, o.h) * 0.3, 0, Math.PI * 2); g.fill(); }
      else markSegs(o).forEach(seg => { g.beginPath(); seg.forEach((p, i) => i ? g.lineTo(...p) : g.moveTo(...p)); g.stroke(); }); break; }
    case 'sigblock': { const L = sigLayout(o); if (!L) break;
      g.save(); g.strokeStyle = o.labelColor || '#111'; g.lineWidth = Math.max(0.6, o.size * 0.06); g.lineCap = 'round'; g.setLineDash([0, o.size * 0.17]);
      L.dots.forEach(([a, b, y]) => { g.beginPath(); g.moveTo(a, y); g.lineTo(b, y); g.stroke(); }); g.restore();
      if (L.img && o._img) g.drawImage(o._img, L.img.x, L.img.y, L.img.w, L.img.h);
      L.texts.forEach(t => canvasText(g, t, t.F)); break; }
    case 'stamp': { const L = stampLayout(o); if (!L) break; g.strokeStyle = o.color; const sw = o.size * 0.075;
      g.lineWidth = sw; rrect(g, o.x + sw / 2, o.y + sw / 2, L.w - sw, L.h - sw, o.size * 0.22); g.stroke();
      g.lineWidth = sw * 0.4; const ins = sw * 2.2; rrect(g, o.x + ins, o.y + ins, L.w - ins * 2, L.h - ins * 2, o.size * 0.14); g.stroke();
      canvasText(g, L.t1, L.F1); if (L.t2) canvasText(g, L.t2, L.F2); break; }
  }
  g.restore();
}
function redraw(pi) {
  const P = E.pages[pi]; if (!P) return; const g = P.ov.getContext('2d'); const k = E.zoom * DPR;
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, P.ov.width, P.ov.height); g.setTransform(k, 0, 0, k, 0, 0);
  if (E.tool === 'edittext' && P.lines) { g.save(); g.strokeStyle = 'rgba(37,99,235,.55)'; g.fillStyle = 'rgba(37,99,235,.06)'; g.lineWidth = 1 / E.zoom; g.setLineDash([3 / E.zoom, 2 / E.zoom]);
    P.lines.forEach((l, i) => { g.fillRect(l.x - 1, l.y, l.w + 2, l.h); if (i === P.hover) { g.save(); g.fillStyle = 'rgba(37,99,235,.16)'; g.fillRect(l.x - 1, l.y, l.w + 2, l.h); g.restore(); } g.strokeRect(l.x - 1, l.y, l.w + 2, l.h); }); g.restore(); }
  (E.annots[pi] || []).forEach(o => drawObj(g, o));
  if (E.search.hits.length) { g.save(); E.search.hits.forEach((h, i) => { if (h.p !== pi) return; g.fillStyle = i === E.search.i ? 'rgba(249,115,22,.45)' : 'rgba(250,204,21,.4)'; g.fillRect(h.x, h.y, h.w, h.h); }); g.restore(); }
  const o = E.sel && E.sel.p === pi ? selObj() : null;
  if (o && !o._hide) { const z = 1 / E.zoom; g.save(); g.strokeStyle = '#2563eb'; g.lineWidth = 1.3 * z;
    if ('x1' in o) { g.setLineDash([]); [[o.x1, o.y1], [o.x2, o.y2]].forEach(([x, y]) => { g.fillStyle = '#fff'; g.beginPath(); g.arc(x, y, 5.5 * z, 0, Math.PI * 2); g.fill(); g.stroke(); }); }
    else { const b = bbox(o); g.setLineDash([5 * z, 3 * z]); g.strokeRect(b.x - 3 * z, b.y - 3 * z, b.w + 6 * z, b.h + 6 * z); g.setLineDash([]);
      const hs = 10 * z; g.fillStyle = '#fff'; [[b.x + b.w + 3 * z, b.y + b.h + 3 * z]].forEach(([hx, hy]) => { g.fillRect(hx - hs / 2, hy - hs / 2, hs, hs); g.strokeRect(hx - hs / 2, hy - hs / 2, hs, hs); });
      if (o.type === 'text') { g.fillStyle = '#2563eb'; g.font = `${11 * z}px sans-serif`; g.fillText(o.boxW ? 'ตัดบรรทัดอัตโนมัติ' : '', b.x, b.y - 6 * z); } }
    g.restore(); }
}
const redrawAll = () => E.pages.forEach((_, i) => redraw(i));

/* ---------- UI ---------- */
function propsHTML() {
  const p = E.p; const sw = (attr, list) => list.map(c => `<button class="sw" data-${attr}="${c}" style="background:${c === 'none' ? 'linear-gradient(135deg,#fff 45%,#ef4444 47%,#ef4444 53%,#fff 55%)' : c}" title="${c === 'none' ? 'ไม่มี' : c}"></button>`).join('');
  return `
  <span class="pg g-text">${fontPickerHTML('pFont', p.font)}
    <input class="inp num" type="number" id="pSize" min="4" max="300" value="${p.size}" title="ขนาดตัวอักษร (pt)">
    <span class="seg sm"><button id="pB" title="ตัวหนา (Ctrl+B)">${icon('bold')}</button><button id="pI" title="ตัวเอียง (Ctrl+I)">${icon('italic')}</button><button id="pU" title="ขีดเส้นใต้ (Ctrl+U)">${icon('underline')}</button><button id="pS" title="ขีดฆ่า">${icon('strike')}</button></span>
    <span class="seg sm"><button data-al="left" title="ชิดซ้าย">${icon('alL')}</button><button data-al="center" title="กึ่งกลาง">${icon('alC')}</button><button data-al="right" title="ชิดขวา">${icon('alR')}</button></span>
    <label class="mini" title="ระยะบรรทัด">↕<input class="inp num" type="number" id="pLH" min="0.6" max="3" step="0.1" value="${p.lh}"></label>
    <label class="mini" title="ระยะตัวอักษร">↔<input class="inp num" type="number" id="pLS" min="-20" max="100" step="1" value="${p.ls}"></label>
    <label class="mini" title="สีพื้นหลังข้อความ">พื้น<input type="color" id="pBg" value="${p.bg === 'none' ? '#ffffff' : p.bg}"><button class="btn xs" id="pBgN" title="ไม่มีพื้น">✕</button></label></span>
  <span class="pg g-color"><span class="mini">สี</span><input type="color" id="pColor" value="${p.color}">${sw('c', ['#111111', '#1d3fd6', '#d7372b', '#15803d', '#ffe14d', '#ffffff'])}</span>
  <span class="pg g-fill"><span class="mini">เติม</span><input type="color" id="pFill" value="${p.fill === 'none' ? '#ffffff' : p.fill}">${sw('f', ['none', '#ffffff', '#ffe14d', '#dbeafe', '#111111'])}</span>
  <span class="pg g-width"><span class="mini">เส้น</span><input type="range" id="pWidth" min="0" max="30" value="${p.width}"><b id="pWv" class="mini">${p.width}</b></span>
  <span class="pg g-op"><span class="mini">ทึบ</span><input type="range" id="pOp" min="5" max="100" value="${p.opacity}"><b id="pOv" class="mini">${p.opacity}%</b></span>
  <span class="pg g-obj"><button class="btn xs" id="oFront" title="ไว้หน้าสุด">${icon('front')}</button><button class="btn xs" id="oBack" title="ไว้หลังสุด">${icon('back')}</button><button class="btn xs" id="oDup" title="ทำสำเนา (Ctrl+D)">${icon('dup')}</button><button class="btn xs" id="oDel" title="ลบ (Delete)">${icon('trash')}</button></span>
  <span class="hint" id="eHint"></span>`;
}
function renderEdit() {
  if (E.ver !== S.ver) resetEdit();
  main.innerHTML = `<div class="ed">
    <div class="ed-top">
      <div class="ed-row">
        <div class="etools" id="eTools">${ETOOLS.map(t => `<button class="btn ${E.tool === t[0] ? 'on' : ''}" data-et="${t[0]}" title="${t[2]}">${icon(t[1])}${t[3] ? `<span class="t">${t[3]}</span>` : ''}</button>`).join('')}</div>
        <div class="etools">
          <button class="btn" id="eImg" title="แทรกรูปภาพ / โลโก้">${icon('image')}<span class="t">รูป</span></button>
          <button class="btn" id="eSign" title="ลายเซ็น">${icon('sign')}<span class="t">ลายเซ็น</span></button>
          <div class="dd"><button class="btn" id="eStampB" title="ตราประทับ">${icon('stamp')}<span class="t">ตรายาง</span>${icon('down', 'width="12" height="12"')}</button>
            <div class="ddm" id="eStampM">${STAMPS.map(([t, c]) => `<button class="stp" data-st="${t}" data-c="${c}" style="color:${c};border-color:${c}">${t}</button>`).join('')}
              <label class="chk" style="grid-column:1/-1;margin:6px 2px 0"><input type="checkbox" id="eStDate" checked> ใส่วันที่ใต้ตรา</label>
              <button class="btn sm" id="eStCustom" style="grid-column:1/-1">${icon('edit')} ตรายางข้อความเอง…</button>
              <button class="btn sm pri" id="eSigBlock" style="grid-column:1/-1">${icon('sign')} แบบฟอร์มลงชื่อ + ชื่อ/ตำแหน่ง/วันที่</button></div></div>
          <div class="dd"><button class="btn" id="eMarkB" title="เครื่องหมาย">${icon('mark')}${icon('down', 'width="12" height="12"')}</button>
            <div class="ddm small" id="eMarkM"><button data-mk="check">✓ ถูก</button><button data-mk="cross">✗ ผิด</button><button data-mk="dot">● จุด</button><button data-dt="th">วันที่ไทย</button><button data-dt="th2">วัน/เดือน/ปี พ.ศ.</button><button data-dt="iso">วว/ดด/ปปปป ค.ศ.</button></div></div>
        </div>
        <div class="etools">
          <button class="btn" id="eUndo" title="เลิกทำ (Ctrl+Z)">${icon('undo')}</button><button class="btn" id="eRedo" title="ทำซ้ำ (Ctrl+Y)">${icon('redo')}</button>
          <button class="btn" id="eZo" title="ซูมออก">${icon('zout')}</button><button class="btn zv" id="eZv" title="พอดีความกว้าง">${Math.round(E.zoom * 100)}%</button><button class="btn" id="eZi" title="ซูมเข้า">${icon('zin')}</button>
          <button class="btn ${E.rail ? 'on' : ''}" id="eRailB" title="แสดงภาพย่อ">${icon('sidebar')}</button>
        </div>
        <div class="search"><span class="sico">${icon('search')}</span><input class="inp" id="eQ" placeholder="ค้นหาในเอกสาร…" value="${esc(E.search.q)}"><span class="hint" id="eQn"></span><button class="btn xs" id="eQp">${icon('left')}</button><button class="btn xs" id="eQx">${icon('right')}</button></div>
        <span style="flex:1"></span><span class="hint" id="eCount"></span>
        <button class="btn pri" id="eApply">${icon('check')} บันทึกลง PDF</button>
      </div>
      <div class="ed-row eprops" id="eProps">${propsHTML()}</div>
    </div>
    <div class="ed-body"><div class="ed-rail ${E.rail ? '' : 'hidden'}" id="eRail"></div><div class="ed-scroll" id="eScroll"><div class="epages" id="ePages"></div></div></div>
  </div>`;
  if (!E.zoomSet) { E.zoomSet = true; const sc = $('#eScroll'); const maxW = Math.max(...S.sizes.map(s => s[0])); E.zoom = clamp(Math.min(1.25, (sc.clientWidth - 48) / maxW), 0.3, 4); $('#eZv').textContent = Math.round(E.zoom * 100) + '%'; }
  wireEditUI(); buildRail(); buildEditPages(); setETool(E.tool, true); updUndoBtns();
}
const HINTS = {
  select: 'คลิกเพื่อเลือก · ลากเพื่อย้าย · ลากมุมขวาล่างเพื่อปรับขนาด (ข้อความ: กำหนดความกว้างตัดบรรทัด, Shift = ขยายตัวอักษร) · ดับเบิลคลิกเพื่อแก้ข้อความ',
  edittext: 'คลิกที่บรรทัดข้อความในไฟล์เพื่อแก้ไข — ระบบจะลบของเดิมและใส่ข้อความใหม่ด้วยฟอนต์/ขนาด/สีใกล้เคียงต้นฉบับ',
  text: 'คลิกบนหน้าเพื่อพิมพ์ · ลากเป็นกรอบเพื่อตัดบรรทัดอัตโนมัติ · Enter ขึ้นบรรทัดใหม่ · Esc เพื่อจบ',
  pen: 'ลากเพื่อวาดอิสระ', hl: 'ลากผ่านข้อความเพื่อไฮไลต์', rect: 'ลากเพื่อวาด (Shift = จัตุรัส)', ellipse: 'ลากเพื่อวาด (Shift = วงกลม)',
  line: 'ลากเพื่อวาดเส้น (Shift = แนวตรง)', arrow: 'ลากเพื่อวาดลูกศร', white: 'ลากคลุมสิ่งที่ต้องการลบ — เติมด้วยสีพื้นหลัง (เลือกสีได้)',
  redact: 'ลากคลุมข้อมูลลับ — เมื่อบันทึก หน้านั้นจะถูกแปลงเป็นภาพเพื่อลบข้อมูลใต้กล่องดำออกจริง',
};
function ctxGroups() {
  const o = selObj(); const t = o ? o.type : E.tool;
  const G = { text: ['text', 'color', 'op'], edittext: ['text', 'color'], stamp: ['color', 'op'], sigblock: ['op'], pen: ['color', 'width', 'op'], hl: ['color', 'width', 'op'], rect: ['color', 'fill', 'width', 'op'], ellipse: ['color', 'fill', 'width', 'op'],
    line: ['color', 'width', 'op'], arrow: ['color', 'width', 'op'], white: ['color'], redact: [], image: ['op'], mark: ['color', 'width'], select: [] }[t] || [];
  return o ? [...G, 'obj'] : G;
}
function syncPropsUI() {
  const box = $('#eProps'); if (!box) return; const gs = ctxGroups();
  $$('.pg', box).forEach(el => { const k = [...el.classList].find(c => c.startsWith('g-')).slice(2); el.style.display = gs.includes(k) ? '' : 'none'; });
  const o = selObj(); const p = E.p; const t = o ? o.type : E.tool;
  const col = o ? (o.color || p.color) : (t === 'hl' ? p.hlColor : t === 'pen' ? p.penColor : (t === 'rect' || t === 'ellipse' || t === 'line' || t === 'arrow') ? p.stroke : t === 'white' ? '#ffffff' : p.color);
  $('#pColor').value = col && col !== 'none' ? col : '#000000';
  const src = o && (o.type === 'text') ? o : p;
  $('#pSize').value = Math.round((src.size || p.size) * 10) / 10; $('#pB').classList.toggle('on', !!src.bold); $('#pI').classList.toggle('on', !!src.italic); $('#pU').classList.toggle('on', !!src.underline); $('#pS').classList.toggle('on', !!src.strike);
  $$('[data-al]').forEach(b => b.classList.toggle('on', (src.align || 'left') === b.dataset.al)); $('#pLH').value = src.lh || 1; $('#pLS').value = src.ls || 0;
  const fb = $('#pFont'); if (fb && fb.dataset.font !== (src.font || p.font)) { fb.dataset.font = src.font || p.font; wireFontPicker('pFont', onFontPick); }
  const w = o && o.width != null ? o.width : (t === 'hl' ? 14 : p.width); $('#pWidth').value = w; $('#pWv').textContent = Math.round(w * 10) / 10;
  const op = o ? (o.opacity ?? 100) : (t === 'hl' ? 100 : p.opacity); $('#pOp').value = op; $('#pOv').textContent = op + '%';
  $('#eHint').textContent = o ? '' : (HINTS[E.tool] || '');
}
function setETool(t, silent) {
  finishText();
  E.tool = t; $$('#eTools [data-et]').forEach(b => b.classList.toggle('on', b.dataset.et === t));
  if (t !== 'select') { E.sel = null; }
  E.pages.forEach(P => { P.ov.style.cursor = t === 'select' ? 'default' : t === 'text' ? 'text' : t === 'edittext' ? 'pointer' : 'crosshair'; P.ov.style.touchAction = t === 'select' ? 'pan-x pan-y' : 'none'; });
  if (t === 'edittext') { E.pages.forEach(P => loadLines(P)); if (!silent) toast('เส้นประสีน้ำเงิน = ข้อความที่แก้ไขได้ คลิกเพื่อแก้'); }
  syncPropsUI(); redrawAll();
}
async function loadLines(P) { if (P.lines) return; P.lines = await getTextLines(P.pi).catch(() => []); if (E.tool === 'edittext') redraw(P.pi); }
let propUndoArmed = false;
function applyProp(key, val, { undo = true } = {}) {
  const o = selObj(); const t = o ? o.type : E.tool;
  if (key === 'color') { if (t === 'hl') E.p.hlColor = val; else if (t === 'pen') E.p.penColor = val; else if (['rect', 'ellipse', 'line', 'arrow', 'mark'].includes(t)) E.p.stroke = val; else if (t !== 'white') E.p.color = val; }
  else if (key !== 'width' || t !== 'hl') E.p[key] = val;
  if (o) { if (undo && !propUndoArmed) { pushUndo(); propUndoArmed = true; setTimeout(() => propUndoArmed = false, 600); }
    if (key === 'color') o.color = val; else if (key === 'fill') o.fill = val; else if (key === 'width') { if ('width' in o) o.width = +val; } else if (key === 'opacity') o.opacity = +val;
    else if (o.type === 'text' && ['font', 'size', 'bold', 'italic', 'underline', 'strike', 'align', 'bg', 'lh', 'ls'].includes(key)) o[key] = val;
    else if (o.type === 'stamp' && key === 'size') o.size = +val;
    if (o.type === 'text') ensureFace(o).then(() => { redraw(E.sel.p); if (E.editing) styleTextarea(); }).catch(() => { });
    redraw(E.sel.p); }
  if (E.editing) styleTextarea();
}
function onFontPick(f) { applyProp('font', f); ensureFace({ ...E.p, font: f }).then(redrawAll).catch(e => toast(e.message, 'err')); }
function wireEditUI() {
  $$('#eTools [data-et]').forEach(b => b.onclick = () => setETool(b.dataset.et));
  $('#eUndo').onclick = eUndo; $('#eRedo').onclick = eRedo;
  $('#eZi').onclick = () => setZoom(E.zoom * 1.2); $('#eZo').onclick = () => setZoom(E.zoom / 1.2);
  $('#eZv').onclick = () => { const sc = $('#eScroll'); const maxW = Math.max(...S.sizes.map(s => s[0])); setZoom((sc.clientWidth - 48) / maxW); };
  $('#eRailB').onclick = () => { E.rail = !E.rail; $('#eRail').classList.toggle('hidden', !E.rail); $('#eRailB').classList.toggle('on', E.rail); };
  $('#eApply').onclick = () => commitEdit().catch(e => { busy(false); console.error(e); toast(e.message, 'err'); });
  wireFontPicker('pFont', onFontPick);
  $('#pSize').oninput = e => { const v = +e.target.value; if (v >= 4 && v <= 300) applyProp('size', v); };
  [['pB', 'bold'], ['pI', 'italic'], ['pU', 'underline'], ['pS', 'strike']].forEach(([id, k]) => $('#' + id).onclick = () => { const o = selObj(); const cur = o && o.type === 'text' ? o[k] : E.p[k]; applyProp(k, !cur); syncPropsUI(); });
  $$('[data-al]').forEach(b => b.onclick = () => { applyProp('align', b.dataset.al); syncPropsUI(); });
  $('#pLH').oninput = e => applyProp('lh', clamp(+e.target.value || 1, 0.6, 3)); $('#pLS').oninput = e => applyProp('ls', +e.target.value || 0);
  $('#pBg').oninput = e => applyProp('bg', e.target.value); $('#pBgN').onclick = () => applyProp('bg', 'none');
  $('#pColor').oninput = e => applyProp('color', e.target.value);
  $$('[data-c]', $('#eProps')).forEach(s => s.onclick = () => { applyProp('color', s.dataset.c); syncPropsUI(); });
  $('#pFill').oninput = e => applyProp('fill', e.target.value); $$('[data-f]').forEach(s => s.onclick = () => applyProp('fill', s.dataset.f));
  $('#pWidth').oninput = e => { $('#pWv').textContent = e.target.value; applyProp('width', +e.target.value); };
  $('#pOp').oninput = e => { $('#pOv').textContent = e.target.value + '%'; applyProp('opacity', +e.target.value); };
  $('#oDel').onclick = deleteSel; $('#oDup').onclick = dupSel;
  $('#oFront').onclick = () => reorder(1); $('#oBack').onclick = () => reorder(-1);
  $('#eImg').onclick = async () => { const f = (await pickFiles({ accept: 'image/*', multiple: false }))[0]; if (f) placeImage(await fileToDataURL(f), 220); };
  $('#eSign').onclick = signatureDialog;
  const dd = (b, m) => { $(b).onclick = e => { e.stopPropagation(); const open = $(m).classList.toggle('open'); if (open) { const r = $(b).getBoundingClientRect(), mm = $(m); mm.style.position = 'fixed'; mm.style.top = (r.bottom + 6) + 'px'; mm.style.left = Math.max(8, Math.min(r.left, innerWidth - mm.offsetWidth - 8)) + 'px'; mm.style.maxHeight = (innerHeight - r.bottom - 20) + 'px'; mm.style.overflowY = 'auto'; } $$('.ddm').forEach(x => { if (x !== $(m)) x.classList.remove('open'); }); if (open) setTimeout(() => document.addEventListener('pointerdown', function h(ev) { if (!ev.target.closest('.dd')) { $(m)?.classList.remove('open'); document.removeEventListener('pointerdown', h); } }), 0); }; };
  dd('#eStampB', '#eStampM'); dd('#eMarkB', '#eMarkM');
  $$('[data-st]').forEach(b => b.onclick = async () => { $('#eStampM').classList.remove('open');
    const o = { type: 'stamp', label: b.dataset.st, sub: $('#eStDate').checked ? thaiLongDate() : '', color: b.dataset.c, size: 22, font: 'Kanit', opacity: 90 };
    await ensureFace({ font: 'Kanit', bold: true }); await ensureFace({ font: 'Kanit' }); placeAtCenter(o); });
  $('#eStCustom').onclick = async () => { $('#eStampM').classList.remove('open'); const v = await stampDialog(); if (!v) return;
    await ensureFace({ font: v.font, bold: true }); await ensureFace({ font: v.font }); placeAtCenter({ type: 'stamp', ...v, size: 22, opacity: 90 }); };
  $('#eSigBlock').onclick = async () => { $('#eStampM').classList.remove('open'); const v = await sigBlockDialog(); if (!v) return; const o = { type: 'sigblock', ...v, opacity: 100 }; await ensureSigFaces(o); placeAtCenter(o); };
  $$('[data-mk]').forEach(b => b.onclick = () => { $('#eMarkM').classList.remove('open'); placeAtCenter({ type: 'mark', kind: b.dataset.mk, w: 18, h: 18, color: E.p.color === '#ffffff' ? '#111' : E.p.color, width: 2.4 }); });
  $$('[data-dt]').forEach(b => b.onclick = async () => { $('#eMarkM').classList.remove('open'); const d = new Date();
    const t = b.dataset.dt === 'th' ? thaiLongDate() : b.dataset.dt === 'th2' ? thaiToday() : isoToday();
    const o = { type: 'text', text: t, ...pickText() }; await ensureFace(o); placeAtCenter(o); });
  // search
  let st = 0; $('#eQ').oninput = e => { clearTimeout(st); st = setTimeout(() => runSearch(e.target.value), 250); };
  $('#eQ').onkeydown = e => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); stepSearch(e.shiftKey ? -1 : 1); } if (e.key === 'Escape') { e.target.value = ''; runSearch(''); } };
  $('#eQp').onclick = () => stepSearch(-1); $('#eQx').onclick = () => stepSearch(1);
  if (E.search.q) runSearch(E.search.q);
}
const pickText = () => { const p = E.p; return { font: p.font, size: p.size, bold: p.bold, italic: p.italic, underline: p.underline, strike: p.strike, align: p.align, color: p.color, bg: p.bg, lh: p.lh, ls: p.ls, opacity: 100 }; };
function placeAtCenter(o) {
  const pi = visiblePage(); const [W, H] = S.sizes[pi]; pushUndo();
  const b0 = { ...o, x: 0, y: 0 }; const b = bbox(b0); o.x = (W - b.w) / 2; o.y = Math.max(10, (H - b.h) / 2);
  (E.annots[pi] ||= []).push(o); setETool('select', true); E.sel = { p: pi, i: E.annots[pi].length - 1 }; syncPropsUI(); redraw(pi); updUndoBtns();
  toast('ลากเพื่อวางตำแหน่ง · ลากมุมเพื่อปรับขนาด');
}
function reorder(dir) { const o = selObj(); if (!o) return; pushUndo(); const arr = E.annots[E.sel.p]; arr.splice(E.sel.i, 1); if (dir > 0) arr.push(o); else arr.unshift(o); E.sel.i = arr.indexOf(o); redraw(E.sel.p); }
function dupSel() { const o = selObj(); if (!o) return; pushUndo(); const c = cloneObj(o); moveObj(c, 12, 12); E.annots[E.sel.p].push(c); E.sel = { p: E.sel.p, i: E.annots[E.sel.p].length - 1 }; redraw(E.sel.p); updUndoBtns(); }
function deleteSel() { const o = selObj(); if (!o) return toast('เลือกวัตถุก่อน'); pushUndo(); E.annots[E.sel.p].splice(E.sel.i, 1); const p = E.sel.p; E.sel = null; redraw(p); syncPropsUI(); updUndoBtns(); }
function moveObj(o, dx, dy) { if (o.pts) o.pts.forEach(p => { p[0] += dx; p[1] += dy; }); else if ('x1' in o) { o.x1 += dx; o.x2 += dx; o.y1 += dy; o.y2 += dy; } else { o.x += dx; o.y += dy; } }
function visiblePage() {
  const sc = $('#eScroll'); if (!sc) return 0; const mr = sc.getBoundingClientRect(); const cy = mr.top + mr.height / 2; let best = 0, bd = 1e9;
  E.pages.forEach((P, i) => { const r = P.wrap.getBoundingClientRect(); const d = cy < r.top ? r.top - cy : cy > r.bottom ? cy - r.bottom : 0; if (d < bd) { bd = d; best = i; } });
  return best;
}
async function placeImage(url, width) {
  const img = new Image(); img.src = url; await img.decode().catch(() => { });
  const pi = visiblePage(); const [W, H] = S.sizes[pi]; const w = Math.min(width, W * 0.6), h = w * img.naturalHeight / img.naturalWidth;
  pushUndo(); (E.annots[pi] ||= []).push({ type: 'image', img, src: url, x: (W - w) / 2, y: (H - h) / 2, w, h, opacity: 100 });
  setETool('select', true); E.sel = { p: pi, i: E.annots[pi].length - 1 }; syncPropsUI(); redraw(pi); updUndoBtns();
  toast('ลากเพื่อย้าย · ลากมุมขวาล่างเพื่อปรับขนาด');
}
function setZoom(z) { finishText(); const sc = $('#eScroll'); const pi = visiblePage(); E.zoom = clamp(z, 0.3, 4); $('#eZv').textContent = Math.round(E.zoom * 100) + '%'; buildEditPages(); E.pages[pi]?.wrap.scrollIntoView({ block: 'start' }); }

/* ---------- rail ---------- */
function buildRail() {
  const r = $('#eRail'); r.innerHTML = S.sizes.map((s, i) => `<div class="rthumb" data-pi="${i}"><img data-pg="${i}" data-w="110" alt=""><span>${i + 1}</span></div>`).join('');
  $$('img', r).forEach(img => io.observe(img));
  $$('.rthumb', r).forEach(t => t.onclick = () => E.pages[+t.dataset.pi]?.wrap.scrollIntoView({ behavior: 'smooth', block: 'start' }));
}
function markRail() { const pi = visiblePage(); $$('#eRail .rthumb').forEach(t => t.classList.toggle('on', +t.dataset.pi === pi)); }

/* ---------- pages ---------- */
let pageIO = null;
function buildEditPages() {
  const box = $('#ePages'); box.innerHTML = ''; E.pages = []; if (pageIO) pageIO.disconnect();
  const sc = $('#eScroll');
  pageIO = new IntersectionObserver(ents => ents.forEach(en => { if (en.isIntersecting) { const P = E.pages[+en.target.dataset.pi]; if (P && !P.rendered) renderBase(P); } }), { root: sc, rootMargin: '800px' });
  S.sizes.forEach(([W, H], pi) => {
    const wrap = document.createElement('div'); wrap.className = 'epage'; wrap.dataset.pi = pi; wrap.style.width = W * E.zoom + 'px'; wrap.style.height = H * E.zoom + 'px';
    const base = document.createElement('canvas'), ov = document.createElement('canvas');
    [base, ov].forEach(c => { c.width = Math.round(W * E.zoom * DPR); c.height = Math.round(H * E.zoom * DPR); c.style.width = W * E.zoom + 'px'; c.style.height = H * E.zoom + 'px'; });
    const lab = document.createElement('div'); lab.className = 'plabel'; lab.textContent = `${pi + 1} / ${S.sizes.length}`;
    wrap.append(base, ov, lab); box.appendChild(wrap);
    const P = { wrap, base, ov, W, H, pi, rendered: false, lines: null, hover: -1 }; E.pages.push(P); pageIO.observe(wrap);
    ov.addEventListener('pointerdown', e => onDown(e, P)); ov.addEventListener('dblclick', e => onDbl(e, P));
    ov.addEventListener('pointermove', e => onHover(e, P)); ov.addEventListener('pointerleave', () => { if (P.hover >= 0) { P.hover = -1; redraw(P.pi); } });
    redraw(pi);
  });
  sc.onscroll = () => { clearTimeout(sc._t); sc._t = setTimeout(markRail, 80); }; markRail();
  if (E.tool === 'edittext') E.pages.forEach(P => loadLines(P));
}
async function renderBase(P) { P.rendered = true; const page = await S.pdf.getPage(P.pi + 1); const vp = page.getViewport({ scale: E.zoom * DPR }); await page.render({ canvasContext: P.base.getContext('2d'), viewport: vp }).promise.catch(() => { }); }
const ptOf = (e, P) => { const r = P.ov.getBoundingClientRect(); return { x: (e.clientX - r.left) / E.zoom, y: (e.clientY - r.top) / E.zoom }; };
function hitTest(pi, p) { const arr = E.annots[pi] || []; const tol = 4 / E.zoom;
  for (let i = arr.length - 1; i >= 0; i--) { const o = arr[i];
    if ('x1' in o) { const d = distSeg(p, [o.x1, o.y1], [o.x2, o.y2]); if (d < Math.max(6 / E.zoom, o.width)) return i; continue; }
    const b = bbox(o); if (p.x >= b.x - tol && p.x <= b.x + b.w + tol && p.y >= b.y - tol && p.y <= b.y + b.h + tol) return i; }
  return -1; }
function distSeg(p, a, b) { const dx = b[0] - a[0], dy = b[1] - a[1]; const t = clamp(((p.x - a[0]) * dx + (p.y - a[1]) * dy) / (dx * dx + dy * dy || 1), 0, 1); return Math.hypot(p.x - a[0] - t * dx, p.y - a[1] - t * dy); }
function onHover(e, P) { if (E.tool !== 'edittext' || !P.lines) return; const p = ptOf(e, P); const i = P.lines.findIndex(l => p.x >= l.x - 2 && p.x <= l.x + l.w + 2 && p.y >= l.y && p.y <= l.y + l.h); if (i !== P.hover) { P.hover = i; redraw(P.pi); } }
function newObj(t, p) {
  const P = E.p;
  if (t === 'pen') return { type: t, pts: [[p.x, p.y]], color: P.penColor, width: P.width || 2, opacity: P.opacity };
  if (t === 'hl') return { type: t, pts: [[p.x, p.y]], color: P.hlColor, width: 14, opacity: 100 };
  if (t === 'line' || t === 'arrow') return { type: t, x1: p.x, y1: p.y, x2: p.x, y2: p.y, color: P.stroke, width: P.width || 2, opacity: P.opacity };
  if (t === 'white') return { type: t, x: p.x, y: p.y, w: 0, h: 0, color: '#ffffff' };
  if (t === 'redact') return { type: t, x: p.x, y: p.y, w: 0, h: 0 };
  if (t === 'text') return { type: 'text', text: '', x: p.x, y: p.y, w: 0, h: 0, _box: true, ...pickText() };
  return { type: t, x: p.x, y: p.y, w: 0, h: 0, color: P.stroke, fill: P.fill, width: P.width, opacity: P.opacity };
}
function onDown(e, P) {
  closeFontPop();
  if (E.editing) { const ed = E.editing; finishText(); if (E.tool === 'text' || E.tool === 'edittext') return; }
  const p = ptOf(e, P), pi = P.pi, t = E.tool;
  if (t === 'select') {
    const o = selObj();
    if (o && E.sel.p === pi) {
      const z = 1 / E.zoom;
      if ('x1' in o) { for (const [k, x, y] of [[1, o.x1, o.y1], [2, o.x2, o.y2]]) if (Math.hypot(p.x - x, p.y - y) < 9 * z) { e.preventDefault(); pushUndo(); E.drag = { mode: 'end', k, o, moved: false }; capture(e, P); return; } }
      else { const b = bbox(o); const hx = b.x + b.w + 3 * z, hy = b.y + b.h + 3 * z;
        if (Math.abs(p.x - hx) < 10 * z && Math.abs(p.y - hy) < 10 * z) { e.preventDefault(); pushUndo(); E.drag = { mode: 'resize', o, orig: cloneObj(o), bb: b, start: p, moved: false }; capture(e, P); return; } }
    }
    const hit = hitTest(pi, p);
    if (hit >= 0) { e.preventDefault(); const prev = E.sel; E.sel = { p: pi, i: hit }; if (prev && prev.p !== pi) redraw(prev.p); syncPropsUI();
      pushUndo(); E.drag = { mode: 'move', o: selObj(), orig: cloneObj(selObj()), start: p, moved: false }; capture(e, P); }
    else { const prev = E.sel; E.sel = null; if (prev) redraw(prev.p); syncPropsUI(); }
    redraw(pi); return;
  }
  e.preventDefault();
  if (t === 'edittext') { editExisting(P, p); return; }
  if (t === 'text') { const hit = hitTest(pi, p); if (hit >= 0 && E.annots[pi][hit].type === 'text') { E.sel = { p: pi, i: hit }; pushUndo(); editText(P, E.annots[pi][hit]); return; } }
  pushUndo(); const o = newObj(t, p); (E.annots[pi] ||= []).push(o); E.drag = { mode: 'draw', o, start: p }; capture(e, P);
}
function capture(e, P) {
  const pid = e.pointerId; try { P.ov.setPointerCapture(pid); } catch (_) { }
  const mv = ev => { if (ev.pointerId === pid) onMove(ev, P); };
  const up = ev => { if (ev.pointerId !== pid) return; P.ov.removeEventListener('pointermove', mv); P.ov.removeEventListener('pointerup', up); P.ov.removeEventListener('pointercancel', up); onUp(ev, P); };
  P.ov.addEventListener('pointermove', mv); P.ov.addEventListener('pointerup', up); P.ov.addEventListener('pointercancel', up);
}
function onMove(e, P) {
  const D = E.drag; if (!D) return; const p = ptOf(e, P), o = D.o;
  if (D.mode === 'end') { D.moved = true; if (D.k === 1) { o.x1 = p.x; o.y1 = p.y; } else { o.x2 = p.x; o.y2 = p.y; } }
  else if (D.mode === 'move') { const dx = p.x - D.start.x, dy = p.y - D.start.y; D.moved = D.moved || Math.abs(dx) + Math.abs(dy) > 0.5; const s = D.orig;
    if (o.pts) o.pts = s.pts.map(q => [q[0] + dx, q[1] + dy]); else if ('x1' in o) { o.x1 = s.x1 + dx; o.y1 = s.y1 + dy; o.x2 = s.x2 + dx; o.y2 = s.y2 + dy; } else { o.x = s.x + dx; o.y = s.y + dy; } }
  else if (D.mode === 'resize') { D.moved = true; const b = D.bb, s = D.orig; const dx = p.x - D.start.x, dy = p.y - D.start.y;
    let sx = Math.max(0.05, (b.w + dx) / b.w), sy = Math.max(0.05, (b.h + dy) / b.h);
    if (o.type === 'text') { if (e.shiftKey) { o.size = Math.max(4, s.size * Math.max(sx, sy)); o.boxW = s.boxW ? s.boxW * Math.max(sx, sy) : 0; E.p.size = Math.round(o.size); } else { o.boxW = Math.max(20, b.w + dx); } }
    else if (o.type === 'stamp') o.size = Math.max(8, s.size * Math.max(sx, sy));
    else if (o.type === 'sigblock') { const k = Math.max(0.3, Math.max(sx, sy)); if (e.shiftKey) o.w = Math.max(120, s.w * sx); else { o.size = Math.max(6, s.size * k); o.w = Math.max(80, s.w * k); } }
    else { if (o.type === 'image' || o.type === 'mark' || e.shiftKey) sx = sy = Math.max(sx, sy);
      const X = v => b.x + (v - b.x) * sx, Y = v => b.y + (v - b.y) * sy;
      if (o.pts) o.pts = s.pts.map(q => [X(q[0]), Y(q[1])]); else { o.x = X(s.x); o.y = Y(s.y); o.w = s.w * sx; o.h = s.h * sy; } }
    syncPropsUI(); }
  else if (D.mode === 'draw') { const dx = p.x - D.start.x, dy = p.y - D.start.y;
    if (o.pts) { const l = o.pts[o.pts.length - 1]; if (Math.hypot(p.x - l[0], p.y - l[1]) > 0.8 / E.zoom) o.pts.push([p.x, p.y]); }
    else if ('x1' in o) { o.x2 = p.x; o.y2 = p.y; if (e.shiftKey) { if (Math.abs(p.x - o.x1) > Math.abs(p.y - o.y1)) o.y2 = o.y1; else o.x2 = o.x1; } }
    else { o.w = dx; o.h = dy; if (e.shiftKey) { const m = Math.max(Math.abs(dx), Math.abs(dy)); o.w = Math.sign(dx || 1) * m; o.h = Math.sign(dy || 1) * m; } } }
  redraw(P.pi);
}
function onUp(e, P) {
  const D = E.drag; E.drag = null; if (!D) return; const o = D.o, arr = E.annots[P.pi];
  if ((D.mode === 'move' || D.mode === 'resize' || D.mode === 'end') && !D.moved) { E.undo.pop(); updUndoBtns(); }
  if (D.mode === 'draw') {
    if (o.type === 'text') { const big = Math.abs(o.w) > 24; if (o.w < 0) o.x += o.w; if (o.h < 0) o.y += o.h; o.boxW = big ? Math.abs(o.w) : 0; if (!big) { o.x = D.start.x; o.y = D.start.y - o.size * 0.75; } delete o.w; delete o.h; delete o._box;
      E.sel = { p: P.pi, i: arr.length - 1 }; ensureFace(o).then(() => editText(P, o, true)).catch(err => toast(err.message, 'err')); return; }
    if ('w' in o) { if (o.w < 0) { o.x += o.w; o.w = -o.w; } if (o.h < 0) { o.y += o.h; o.h = -o.h; } if (o.w < 3 && o.h < 3) { arr.pop(); E.undo.pop(); } else E.sel = { p: P.pi, i: arr.length - 1 }; }
    else if ('x1' in o) { if (Math.hypot(o.x2 - o.x1, o.y2 - o.y1) < 3) { arr.pop(); E.undo.pop(); } else E.sel = { p: P.pi, i: arr.length - 1 }; }
    if (o.type === 'pen' || o.type === 'hl') E.sel = null;
    if (o.type === 'redact' && !E._redactTold) { E._redactTold = true; toast('กล่องดำจะลบข้อมูลด้านใต้ออกจริงเมื่อบันทึก (หน้านั้นจะกลายเป็นภาพ)'); }
    updUndoBtns(); syncPropsUI();
  }
  redraw(P.pi);
}
function onDbl(e, P) { if (E.tool !== 'select') return; const p = ptOf(e, P); const hit = hitTest(P.pi, p); const o = hit >= 0 ? E.annots[P.pi][hit] : null;
  if (o && o.type === 'text') { E.sel = { p: P.pi, i: hit }; pushUndo(); editText(P, o); }
  else if (o && o.type === 'stamp') { stampDialog(o).then(async v => { if (!v) return; pushUndo(); Object.assign(o, v); await ensureFace({ font: o.font, bold: true }).catch(() => { }); await ensureFace({ font: o.font }).catch(() => { }); redraw(P.pi); }); }
  else if (o && o.type === 'sigblock') { sigBlockDialog(o).then(async v => { if (!v) return; pushUndo(); Object.assign(o, v); delete o._img; await ensureSigFaces(o); redraw(P.pi); }); } }

/* ---------- dialogs: custom stamp & signature block ---------- */
function inkSwatches(id, cur, list = ['#1d3fd6', '#0b1f8f', '#111111', '#b91c1c', '#15803d', '#6b7280']) {
  return `<div class="row" id="${id}">${list.map(c => `<button type="button" class="sw ${c === cur ? 'on' : ''}" data-ink="${c}" style="background:${c};${c === cur ? 'box-shadow:0 0 0 2px #2563eb' : ''}"></button>`).join('')}<input type="color" value="${cur}" data-inkc></div>`;
}
function wireInk(bk, id, set) { const box = $('#' + id, bk); const mark = c => $$('[data-ink]', box).forEach(x => x.style.boxShadow = x.dataset.ink === c ? '0 0 0 2px #2563eb' : '');
  $$('[data-ink]', box).forEach(b => b.onclick = () => { set(b.dataset.ink); mark(b.dataset.ink); $('[data-inkc]', box).value = b.dataset.ink; }); $('[data-inkc]', box).oninput = e => { set(e.target.value); mark(''); }; }
function stampDialog(o = {}) {
  let color = o.color || '#b91c1c', font = o.font || 'Kanit';
  return modal({ title: o.label ? 'แก้ไขตรายาง' : 'ตรายางข้อความเอง', body: `
    <div class="fld"><label>ข้อความหลัก</label><input class="inp" id="sl" value="${esc(o.label || '')}" placeholder="เช่น ได้รับแล้ว, ตรวจถูกต้อง, KWE THAILAND"></div>
    <div class="fld"><label>บรรทัดล่าง (เว้นว่างได้)</label><input class="inp" id="ss" value="${esc(o.sub ?? thaiLongDate())}"><div class="row" style="margin-top:4px"><button type="button" class="btn xs" id="sTd">วันนี้ (ไทย)</button><button type="button" class="btn xs" id="sTd2">${isoToday()}</button><button type="button" class="btn xs" id="sClr">ไม่มี</button></div></div>
    <div class="row" style="align-items:flex-end"><div class="fld" style="flex:1"><label>ฟอนต์</label>${fontPickerHTML('sFont', font)}</div><div class="fld"><label>สีหมึก</label>${inkSwatches('sInk', color, ['#b91c1c', '#1d3fd6', '#15803d', '#111111', '#6b7280'])}</div></div>`,
    buttons: [{ label: 'ยกเลิก', value: null }, { label: o.label ? 'บันทึก' : 'วางตรายาง', pri: true, value: bk => { const l = $('#sl', bk).value.trim(); if (!l) { toast('กรอกข้อความ', 'err'); return null; } return { label: l, sub: $('#ss', bk).value.trim(), color, font }; } }],
    onOpen: bk => { wireFontPicker('sFont', f => font = f); wireInk(bk, 'sInk', c => color = c);
      $('#sTd', bk).onclick = () => $('#ss', bk).value = thaiLongDate(); $('#sTd2', bk).onclick = () => $('#ss', bk).value = isoToday(); $('#sClr', bk).onclick = () => $('#ss', bk).value = ''; } });
}
function sigBlockDialog(o) {
  let last = {}; try { last = JSON.parse(localStorage.getItem('pdfs_sigblock') || '{}'); } catch (e) { }
  let sigs = []; try { sigs = JSON.parse(localStorage.getItem('pdfs_sigs') || '[]'); } catch (e) { }
  const d = new Date();
  const v = Object.assign({ name: '', pos: '', posLabel: 'ตำแหน่ง', day: d.getDate(), month: TH_MONTHS[d.getMonth()], year: d.getFullYear() + 543, ink: '#1d3fd6', font: 'THSarabunNew', size: 16, w: 250, thaiDigits: true,
    showSign: true, showName: true, showPos: true, showDate: true, sigSrc: '' }, o ? {} : last, o || {});
  let ink = v.ink, font = v.font, sigSrc = v.sigSrc || '';
  return modal({ title: 'แบบฟอร์มลงชื่อ', wide: true, body: `
    <div class="cols" style="grid-template-columns:1fr 1fr;gap:10px 14px">
      <div class="fld"><label>ชื่อ-นามสกุล (ในวงเล็บ)</label><input class="inp" id="bN" value="${esc(v.name)}" placeholder="นางศศิธร สุดเจริญ"></div>
      <div class="fld"><label><select class="inp" id="bPL" style="width:auto;padding:2px 6px;display:inline-block">${['ตำแหน่ง', 'หน่วยงาน', 'บริษัท', 'ผู้รับ', 'ผู้ตรวจ'].map(x => `<option ${x === v.posLabel ? 'selected' : ''}>${x}</option>`).join('')}</select></label><input class="inp" id="bP" value="${esc(v.pos)}" placeholder="ประชาสัมพันธ์จังหวัดสุโขทัย"></div>
      <div class="fld"><label>วันที่</label><div class="row"><input class="inp" id="bD" value="${esc(v.day)}" style="width:64px"><select class="inp" id="bM" style="flex:1"><option value="">—</option>${TH_MONTHS.map(m => `<option ${m === v.month ? 'selected' : ''}>${m}</option>`).join('')}</select><input class="inp" id="bY" value="${esc(v.year)}" style="width:76px" placeholder="พ.ศ."></div>
        <div class="row" style="margin-top:4px"><button type="button" class="btn xs" id="bToday">วันนี้</button><button type="button" class="btn xs" id="bBlank">เว้นว่างไว้เขียนเอง</button></div></div>
      <div class="fld"><label>ฟอนต์ / ขนาด</label><div class="row">${fontPickerHTML('bF', font)}<input class="inp num" type="number" id="bS" min="8" max="40" value="${v.size}"></div></div>
      <div class="fld"><label>สีหมึกที่พิมพ์ (ค่าที่กรอก)</label>${inkSwatches('bInk', ink)}</div>
      <div class="fld"><label>แสดง</label><div class="row" style="gap:12px">
        <label class="chk"><input type="checkbox" id="bSS" ${v.showSign !== false ? 'checked' : ''}> ลงชื่อ</label><label class="chk"><input type="checkbox" id="bSN" ${v.showName !== false ? 'checked' : ''}> ชื่อ</label>
        <label class="chk"><input type="checkbox" id="bSP" ${v.showPos !== false ? 'checked' : ''}> ตำแหน่ง</label><label class="chk"><input type="checkbox" id="bSD" ${v.showDate !== false ? 'checked' : ''}> วันที่</label>
        <label class="chk"><input type="checkbox" id="bTD" ${v.thaiDigits ? 'checked' : ''}> ใช้เลขไทย ๑๒๓</label></div></div>
    </div>
    <div class="fld"><label>ลายเซ็นบนเส้น "ลงชื่อ"</label><div class="row" id="bSigs"><button type="button" class="btn sm ${!sigSrc ? 'on' : ''}" data-sg="">ไม่ใส่ (เซ็นเองภายหลัง)</button>${sigs.map((s, i) => `<span class="sgsaved"><img src="${s}" data-sg="${i}" style="${s === sigSrc ? 'outline:2px solid #2563eb' : ''}"></span>`).join('')}
      ${sigs.length ? '' : '<span class="hint">ยังไม่มีลายเซ็นที่บันทึกไว้ — สร้างได้จากปุ่ม "ลายเซ็น"</span>'}</div></div>
    <div class="prev" style="min-height:0;padding:10px"><canvas id="bPrev" width="560" height="190" style="width:100%;max-width:560px;background:#fff"></canvas></div>`,
    buttons: [{ label: 'ยกเลิก', value: null }, { label: o ? 'บันทึก' : 'วางลงเอกสาร', pri: true, value: bk => { const r = read(bk); try { const { sigSrc: _s, ...keep } = r; localStorage.setItem('pdfs_sigblock', JSON.stringify(keep)); } catch (e) { } return r; } }],
    onOpen: bk => {
      wireFontPicker('bF', f => { font = f; pv(); }); wireInk(bk, 'bInk', c => { ink = c; pv(); });
      $$('#bSigs [data-sg]', bk).forEach(el => el.onclick = () => { sigSrc = el.dataset.sg === '' ? '' : sigs[+el.dataset.sg]; $$('#bSigs [data-sg]', bk).forEach(x => { if (x.tagName === 'IMG') x.style.outline = x.src === sigSrc ? '2px solid #2563eb' : ''; else x.classList.toggle('on', !sigSrc); }); pv(); });
      $('#bToday', bk).onclick = () => { const t = new Date(); $('#bD', bk).value = t.getDate(); $('#bM', bk).value = TH_MONTHS[t.getMonth()]; $('#bY', bk).value = t.getFullYear() + 543; pv(); };
      $('#bBlank', bk).onclick = () => { $('#bD', bk).value = ''; $('#bM', bk).value = ''; $('#bY', bk).value = ''; pv(); };
      $$('input,select', bk).forEach(el => { el.addEventListener('input', pv); el.addEventListener('change', pv); });
      pv();
    } });
  function read(bk) { return { name: $('#bN', bk).value.trim(), pos: $('#bP', bk).value.trim(), posLabel: $('#bPL', bk).value, day: $('#bD', bk).value.trim(), month: $('#bM', bk).value, year: $('#bY', bk).value.trim(),
    ink, font, size: clamp(+$('#bS', bk).value || 16, 8, 40), w: (o && o.w) || 250 * clamp(+$('#bS', bk).value || 16, 8, 40) / 16, thaiDigits: $('#bTD', bk).checked,
    showSign: $('#bSS', bk).checked, showName: $('#bSN', bk).checked, showPos: $('#bSP', bk).checked, showDate: $('#bSD', bk).checked, sigSrc }; }
  async function pv() { const bk = $$('.mback').pop(); if (!bk || !$('#bPrev', bk)) return; const r = { type: 'sigblock', ...read(bk), x: 10, y: 0 };
    await ensureSigFaces(r); const L = sigLayout(r); if (!L) return; const c = $('#bPrev', bk); const top = L.img ? Math.min(0, L.img.y) : 0;
    const sc = Math.min(540 / (L.w + 20), 180 / (L.h - top + 14)); const g = c.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, c.width, c.height);
    g.setTransform(sc, 0, 0, sc, 0, (6 - top) * sc); const z = E.zoom; E.zoom = 1; drawObj(g, r); E.zoom = z; }
}

/* ---------- edit existing text ---------- */
const normF = x => (x || '').toLowerCase().replace(/^[a-z]{6}\+/, '').replace(/[^a-z0-9]/g, '');
function guessFont(name, str) {
  const s = normF(name);
  // 1) fonts the user added from their own computer (exact family match)
  for (const [file, fam] of Object.entries(USER_FAMS)) { const n = normF(fam.name); if (n && s.includes(n)) return file; }
  // 2) bundled fonts
  if (/sarabunpsk|thsarabunpsk/.test(s)) return 'THSarabunPSK'; if (/sarabunnew|thsarabun/.test(s)) return 'THSarabunNew';
  for (const f of Object.keys(FONT_FILES).filter(f => !f.startsWith('U_')).sort((a, b) => b.length - a.length)) if (s.includes(f.toLowerCase())) return f;
  // 3) Microsoft fonts → metric-compatible equivalents
  const thai = /[\u0E00-\u0E7F]/.test(str);
  if (/arial|helvetica|arimo|liberationsans/.test(s)) return 'LiberationSans';
  if (/timesnewroman|times|tinos|liberationserif/.test(s)) return 'LiberationSerif';
  if (/courier|cousine|liberationmono|consolas/.test(s)) return 'LiberationMono';
  if (/calibri|carlito/.test(s)) return 'Carlito';
  if (/cambria|caladea/.test(s)) return 'Caladea';
  if (/angsana|cordia|browallia|eucrosia|freesia|iris|jasmine|lily|kodchiang/.test(s)) return 'THSarabunNew';
  if (/tahoma|leelawadee|leelawad|segoe|verdana|microsoftsansserif|sans/.test(s)) return 'NotoSansThai';
  if (/georgia|serif|garamond|bookantiqua/.test(s)) return 'NotoSerifThai';
  return thai ? 'THSarabunNew' : 'LiberationSans';
}
const MS_HINT = [[/angsana/, 'Angsana New'], [/cordia/, 'Cordia New'], [/browallia/, 'Browallia New'], [/tahoma/, 'Tahoma'], [/leelawadee|leelawad/, 'Leelawadee'], [/microsoftsansserif/, 'Microsoft Sans Serif'], [/eucrosia/, 'EucrosiaUPC'], [/segoe/, 'Segoe UI'], [/verdana/, 'Verdana'], [/georgia/, 'Georgia']];
function msFontHint(name) { const s = normF(name); if (Object.values(USER_FAMS).some(f => s.includes(normF(f.name)))) return null; const h = MS_HINT.find(([re]) => re.test(s)); return h ? h[1] : null; }
function sampleColors(P, l) {
  const g = P.base.getContext('2d'); const k = E.zoom * DPR;
  const x = Math.max(0, Math.floor((l.x - 2) * k)), y = Math.max(0, Math.floor(l.y * k)), w = Math.max(1, Math.ceil((l.w + 4) * k)), h = Math.max(1, Math.ceil(l.h * k));
  let d; try { d = g.getImageData(x, y, Math.min(w, P.base.width - x), Math.min(h, P.base.height - y)); } catch (e) { return { bg: '#ffffff', fg: '#000000' }; }
  const a = d.data, cnt = {}; let dark = null, dl = 999;
  for (let i = 0; i < a.length; i += 4) { const key = (a[i] >> 3) + ',' + (a[i + 1] >> 3) + ',' + (a[i + 2] >> 3); cnt[key] = (cnt[key] || 0) + 1; const L = a[i] * .3 + a[i + 1] * .59 + a[i + 2] * .11; if (L < dl) { dl = L; dark = [a[i], a[i + 1], a[i + 2]]; } }
  let top = Object.entries(cnt).sort((p, q) => q[1] - p[1])[0][0].split(',').map(v => Math.min(255, (+v << 3) + 4));
  if (top.every(v => v >= 232)) top = [255, 255, 255];
  const hex = c => '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
  if (!P.rendered || (top[0] + top[1] + top[2] === 12)) return { bg: '#ffffff', fg: '#000000' };
  return { bg: hex(top), fg: dl > 200 ? '#000000' : hex(dark) };
}
async function editExisting(P, p) {
  if (!P.lines) await loadLines(P);
  const l = (P.lines || []).find(l => p.x >= l.x - 2 && p.x <= l.x + l.w + 2 && p.y >= l.y && p.y <= l.y + l.h);
  if (!l) { toast('คลิกบนบรรทัดข้อความที่มีกรอบเส้นประ (ถ้าไม่มีกรอบ ไฟล์อาจเป็นภาพสแกน — ใช้เครื่องมือ "ลบ" + "ข้อความ" แทน)'); return; }
  let fname = ''; try { const pg = await S.pdf.getPage(P.pi + 1); const fo = pg.commonObjs.get(l.font); fname = (fo && (fo.name || fo.loadedName)) || ''; } catch (e) { }
  fname += ' ' + (l.style?.fontFamily || '');
  const font = guessFont(fname, l.str); const bold = /bold|black|heavy|semibold|demi/i.test(fname); const italic = /italic|oblique/i.test(fname);
  const miss = msFontHint(fname); if (miss && !E._hinted?.[miss]) { (E._hinted ||= {})[miss] = 1; toast(`ไฟล์นี้ใช้ฟอนต์ ${miss} — กดเลือกฟอนต์ › "+ เพิ่มฟอนต์จากเครื่อง" เพื่อให้เหมือนต้นฉบับ 100% (ตอนนี้ใช้ ${fontLabel(font)} แทน)`); }
  const { bg, fg } = sampleColors(P, l);
  pushUndo(); const arr = (E.annots[P.pi] ||= []);
  arr.push({ type: 'white', x: l.x - 1.5, y: l.y - 0.5, w: l.w + 3, h: l.h + 1, color: bg, _orig: true, _line: { x: l.x, y: l.y, w: l.w, h: l.h } });
  const o = { type: 'text', text: l.str, font, bold, italic, underline: false, strike: false, align: 'left', color: fg, bg: 'none', lh: 1, ls: 0, size: Math.round(l.size * 10) / 10, opacity: 100, x: l.x, y: l.y };
  try { const F = await ensureFace(o); const L = layoutText(o, F); o.y = l.base - L.asc; } catch (e) { toast(e.message, 'err'); }
  arr.push(o); E.sel = { p: P.pi, i: arr.length - 1 }; Object.assign(E.p, { font, bold, italic, size: o.size, color: fg });
  P.lines = P.lines.filter(x => x !== l); syncPropsUI(); redraw(P.pi); editText(P, o, false, true);
}

/* ---------- inline text editor ---------- */
function styleTextarea() {
  const ed = E.editing; if (!ed) return; const { ta, o } = ed; const z = E.zoom; const F = faceFor(o);
  const d = F ? F.d : null; const L = F ? layoutText({ ...o, text: o.text || ' ' }, F) : null;
  const fam = d ? `"${d.css}", "Sarabun", sans-serif` : 'sans-serif';
  Object.assign(ta.style, { left: o.x * z - 3 + 'px', top: o.y * z - 2 + 'px', fontFamily: fam, fontSize: o.size * z + 'px', lineHeight: (L ? L.adv : o.size * 1.4) * z + 'px',
    fontWeight: F && F.sb ? 'bold' : 'normal', fontStyle: F && F.si ? 'italic' : 'normal', color: o.color, textAlign: o.align || 'left', letterSpacing: (o.ls || 0) * o.size / 100 * z + 'px',
    textDecoration: [o.underline && 'underline', o.strike && 'line-through'].filter(Boolean).join(' ') || 'none',
    background: o.bg && o.bg !== 'none' ? o.bg : 'rgba(255,255,255,.7)', whiteSpace: o.boxW ? 'pre-wrap' : 'pre', width: o.boxW ? (o.boxW * z + 6) + 'px' : '' });
  fitTA();
}
function fitTA() { const ed = E.editing; if (!ed) return; const ta = ed.ta; ta.style.height = '0px'; ta.style.height = (ta.scrollHeight + 4) + 'px'; if (!ed.o.boxW) { ta.style.width = '0px'; ta.style.width = Math.max(40, ta.scrollWidth + 16) + 'px'; } }
function editText(P, o, isNew, selectAll) {
  finishText();
  const ta = document.createElement('textarea'); ta.className = 'etxt'; ta.value = o.text; ta.spellcheck = false; ta.setAttribute('lang', 'th');
  ta.oninput = () => { o.text = ta.value; fitTA(); };
  ta.onkeydown = ev => { ev.stopPropagation(); if (ev.key === 'Escape') { ev.preventDefault(); finishText(); }
    const mod = ev.ctrlKey || ev.metaKey; if (mod && ['b', 'i', 'u'].includes(ev.key.toLowerCase())) { ev.preventDefault(); const k = { b: 'bold', i: 'italic', u: 'underline' }[ev.key.toLowerCase()]; applyProp(k, !o[k], { undo: false }); syncPropsUI(); } };
  ta.onblur = () => setTimeout(() => { if (E.editing && E.editing.ta === ta && document.activeElement !== ta && !document.activeElement?.closest('.eprops, .fp-pop')) finishText(); }, 120);
  o._hide = true; P.wrap.appendChild(ta); E.editing = { ta, o, P }; redraw(P.pi); styleTextarea();
  setTimeout(() => { ta.focus(); if (selectAll) ta.select(); else ta.setSelectionRange(ta.value.length, ta.value.length); }, 0);
  syncPropsUI();
}
function finishText() {
  const ed = E.editing; if (!ed) return; E.editing = null;
  const { ta, o, P } = ed; o.text = ta.value.replace(/\s+$/, ''); o._hide = false; ta.remove();
  const arr = E.annots[P.pi] || []; const i = arr.indexOf(o);
  if (!o.text && i >= 0) { arr.splice(i, 1); E.sel = null; } else if (i >= 0) E.sel = { p: P.pi, i };
  redraw(P.pi); syncPropsUI(); updUndoBtns();
}

/* ---------- search ---------- */
async function runSearch(q) {
  E.search.q = q; E.search.hits = []; E.search.i = -1; const ql = q.trim().toLowerCase();
  if (ql) { for (let pi = 0; pi < S.sizes.length; pi++) { const lines = await getTextLines(pi); if (E.search.q !== q) return;
    for (const l of lines) { const s = l.str.toLowerCase(); let k = s.indexOf(ql); while (k >= 0) { const f0 = k / s.length, f1 = (k + ql.length) / s.length;
      E.search.hits.push({ p: pi, x: l.x + l.w * f0, y: l.y, w: Math.max(4, l.w * (f1 - f0)), h: l.h }); k = s.indexOf(ql, k + 1); } } } }
  $('#eQn').textContent = ql ? (E.search.hits.length ? `${E.search.hits.length} ผล` : 'ไม่พบ') : '';
  redrawAll(); if (E.search.hits.length) stepSearch(1);
}
function stepSearch(d) { const H = E.search.hits; if (!H.length) return; E.search.i = (E.search.i + d + H.length) % H.length; const h = H[E.search.i];
  $('#eQn').textContent = `${E.search.i + 1}/${H.length}`; const P = E.pages[h.p]; const sc = $('#eScroll');
  sc.scrollTo({ top: P.wrap.offsetTop + h.y * E.zoom - sc.clientHeight / 2, behavior: 'smooth' }); redrawAll(); }

/* ---------- keyboard ---------- */
function editKey(e) {
  const mod = e.ctrlKey || e.metaKey; const k = e.key.toLowerCase();
  if (mod && k === 'z' && !e.shiftKey) { e.preventDefault(); eUndo(); return true; }
  if (mod && (k === 'y' || (k === 'z' && e.shiftKey))) { e.preventDefault(); eRedo(); return true; }
  if (mod && k === 'd') { e.preventDefault(); dupSel(); return true; }
  if (mod && k === 'c' && selObj()) { E.clip = cloneObj(selObj()); toast('คัดลอกแล้ว'); return true; }
  if (mod && k === 'v' && E.clip) { e.preventDefault(); const pi = visiblePage(); pushUndo(); const c = cloneObj(E.clip); moveObj(c, 14, 14); E.clip = cloneObj(c); (E.annots[pi] ||= []).push(c); E.sel = { p: pi, i: E.annots[pi].length - 1 }; redraw(pi); updUndoBtns(); return true; }
  if (mod && k === 'f') { e.preventDefault(); $('#eQ').focus(); return true; }
  if (mod) return false;
  if ((e.key === 'Delete' || e.key === 'Backspace') && selObj()) { e.preventDefault(); deleteSel(); return true; }
  if (e.key === 'Escape') { E.sel = null; redrawAll(); syncPropsUI(); if (E.tool !== 'select') setETool('select'); return true; }
  const o = selObj();
  if (o && e.key.startsWith('Arrow')) { e.preventDefault(); const d = e.shiftKey ? 10 : 1; moveObj(o, e.key === 'ArrowLeft' ? -d : e.key === 'ArrowRight' ? d : 0, e.key === 'ArrowUp' ? -d : e.key === 'ArrowDown' ? d : 0); redraw(E.sel.p); return true; }
  const map = { v: 'select', e: 'edittext', t: 'text', p: 'pen', h: 'hl', r: 'rect', o: 'ellipse', l: 'line', a: 'arrow', w: 'white' };
  if (map[k]) { setETool(map[k]); return true; }
  return false;
}

/* ---------- signature ---------- */
function signatureDialog() {
  let saved = []; try { saved = JSON.parse(localStorage.getItem('pdfs_sigs') || '[]'); } catch (e) { }
  let pad, g, drawn = false, color = '#0b1f8f', width = 2.6, tab = 'draw', typed = { text: '', font: 'Charmonman' };
  modal({ title: 'ลายเซ็น', wide: true, body: `
    <div class="tabs" id="sgTabs"><button class="btn on" data-sg="draw">${icon('pen')} วาด</button><button class="btn" data-sg="type">${icon('text')} พิมพ์ชื่อ</button><button class="btn" data-sg="up">${icon('image')} อัปโหลดรูป</button></div>
    <div id="sgDraw"><div class="row" style="margin-bottom:8px"><span class="lbl">หมึก</span>${['#0b1f8f', '#111111', '#b42318'].map((c, i) => `<button class="sw" data-sc="${c}" style="background:${c};${i === 0 ? 'box-shadow:0 0 0 2px #2563eb' : ''}"></button>`).join('')}
      <span class="lbl">ความหนา</span><input type="range" id="sgW" min="1" max="6" step="0.2" value="2.6" style="width:90px"><span style="flex:1"></span><button class="btn sm" id="sgClr">ล้าง</button></div>
      <canvas class="sigpad" id="sgPad"></canvas><p class="hint" style="margin:6px 0 0">เซ็นด้วยเมาส์ ปากกา หรือนิ้ว — ลายเส้นนุ่มตามแรงกด</p></div>
    <div id="sgType" class="hidden"><input class="inp" id="sgTx" placeholder="พิมพ์ชื่อ-นามสกุล" style="font-size:18px"><div class="sgfonts" id="sgFonts"></div></div>
    ${saved.length ? `<div style="margin-top:12px"><span class="lbl">ลายเซ็นที่บันทึกไว้ (คลิกเพื่อใช้)</span><div class="row" style="margin-top:6px">${saved.map((s, i) => `<span class="sgsaved"><img src="${s}" data-si="${i}"><button data-sd="${i}" title="ลบ">×</button></span>`).join('')}</div></div>` : ''}`,
    buttons: [{ label: 'ยกเลิก', value: null }, { label: 'ใช้ลายเซ็น', pri: true, value: 'use' }],
    onOpen: bk => {
      pad = $('#sgPad', bk); const r = pad.getBoundingClientRect(); pad.width = r.width * 2; pad.height = r.height * 2; g = pad.getContext('2d'); g.scale(2, 2); g.lineCap = g.lineJoin = 'round';
      let last = null, lw = width;
      pad.onpointerdown = e => { pad.setPointerCapture(e.pointerId); const b = pad.getBoundingClientRect(); last = [e.clientX - b.left, e.clientY - b.top, performance.now()]; drawn = true; lw = width; };
      pad.onpointermove = e => { if (!last) return; const b = pad.getBoundingClientRect(); const p = [e.clientX - b.left, e.clientY - b.top, performance.now()];
        const v = Math.hypot(p[0] - last[0], p[1] - last[1]) / Math.max(1, p[2] - last[2]); const pr = e.pressure && e.pointerType === 'pen' ? e.pressure * 1.6 : 1;
        const target = clamp(width * pr * (1.4 - Math.min(1, v) * 0.7), width * 0.4, width * 2); lw = lw * 0.6 + target * 0.4;
        g.strokeStyle = color; g.lineWidth = lw; g.beginPath(); g.moveTo(last[0], last[1]); g.lineTo(p[0], p[1]); g.stroke(); last = p; };
      pad.onpointerup = pad.onpointercancel = () => last = null;
      $('#sgClr', bk).onclick = () => { g.clearRect(0, 0, pad.width, pad.height); drawn = false; };
      $('#sgW', bk).oninput = e => width = +e.target.value;
      $$('[data-sc]', bk).forEach(s => s.onclick = () => { color = s.dataset.sc; $$('[data-sc]', bk).forEach(x => x.style.boxShadow = ''); s.style.boxShadow = '0 0 0 2px #2563eb'; });
      $$('[data-sg]', bk).forEach(b => b.onclick = async () => { tab = b.dataset.sg; $$('[data-sg]', bk).forEach(x => x.classList.toggle('on', x === b));
        if (tab === 'up') { const f = (await pickFiles({ accept: 'image/*', multiple: false }))[0]; if (!f) return; bk._close(null); placeImage(await removeWhiteBg(await fileToDataURL(f)), 170); return; }
        $('#sgDraw', bk).classList.toggle('hidden', tab !== 'draw'); $('#sgType', bk).classList.toggle('hidden', tab !== 'type'); if (tab === 'type') { $('#sgTx', bk).focus(); renderTyped(); } });
      const SF = ['Charmonman', 'Srisakdi', 'Charm', 'Sriracha', 'Mali', 'Itim', 'Pattaya', 'THSarabunNew'];
      const renderTyped = () => { $('#sgFonts', bk).innerHTML = SF.map(f => `<button class="sgf ${typed.font === f ? 'on' : ''}" data-tf="${f}"><canvas width="260" height="64"></canvas><span>${fontLabel(f)}</span></button>`).join('');
        $$('[data-tf]', bk).forEach(async b => { b.onclick = () => { typed.font = b.dataset.tf; renderTyped(); };
          const o = { text: typed.text || 'ลายเซ็น', font: b.dataset.tf, size: 30, color, x: 6, y: 6, lh: 1 }; const F = await ensureFace(o).catch(() => null); if (!F) return;
          const c = $('canvas', b); const cg = c.getContext('2d'); const L = layoutText(o, F); const s = Math.min(1, 248 / L.w); cg.clearRect(0, 0, 260, 64); cg.save(); cg.scale(s, s); o.y = (64 / s - L.h) / 2; canvasText(cg, o, F); cg.restore(); }); };
      $('#sgTx', bk).oninput = e => { typed.text = e.target.value; renderTyped(); };
      $$('[data-si]', bk).forEach(im => im.onclick = () => { bk._close(null); placeImage(saved[+im.dataset.si], 170); });
      $$('[data-sd]', bk).forEach(b => b.onclick = () => { saved.splice(+b.dataset.sd, 1); try { localStorage.setItem('pdfs_sigs', JSON.stringify(saved)); } catch (e) { } b.parentElement.remove(); });
    }
  }).then(async v => {
    if (v !== 'use') return; let url;
    if (tab === 'type') { if (!typed.text.trim()) return toast('พิมพ์ชื่อก่อน');
      const o = { text: typed.text, font: typed.font, size: 60, color, x: 4, y: 4, lh: 1 }; const F = await ensureFace(o); const L = layoutText(o, F);
      const c = document.createElement('canvas'); c.width = Math.ceil(L.w + 8) * 2; c.height = Math.ceil(L.h + 8) * 2; const cg = c.getContext('2d'); cg.scale(2, 2); canvasText(cg, o, F); url = c.toDataURL('image/png'); }
    else { if (!drawn) return; const d = g.getImageData(0, 0, pad.width, pad.height).data; let x0 = pad.width, y0 = pad.height, x1 = 0, y1 = 0;
      for (let y = 0; y < pad.height; y++) for (let x = 0; x < pad.width; x++) if (d[(y * pad.width + x) * 4 + 3] > 10) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      if (x1 <= x0) return; const c = document.createElement('canvas'); c.width = x1 - x0 + 10; c.height = y1 - y0 + 10; c.getContext('2d').drawImage(pad, x0 - 5, y0 - 5, c.width, c.height, 0, 0, c.width, c.height); url = c.toDataURL('image/png'); }
    try { saved = saved.filter(s => s !== url); saved.unshift(url); localStorage.setItem('pdfs_sigs', JSON.stringify(saved.slice(0, 6))); } catch (e) { }
    placeImage(url, tab === 'type' ? 180 : 160);
  });
}
async function removeWhiteBg(url) { // make near-white pixels transparent (for photographed signatures)
  const img = new Image(); img.src = url; await img.decode(); const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight; const g = c.getContext('2d'); g.drawImage(img, 0, 0);
  try { const id = g.getImageData(0, 0, c.width, c.height), a = id.data; for (let i = 0; i < a.length; i += 4) { const L = (a[i] + a[i + 1] + a[i + 2]) / 3; if (L > 200) a[i + 3] = Math.max(0, 255 - (L - 200) * 4.6); } g.putImageData(id, 0, 0); return c.toDataURL('image/png'); } catch (e) { return url; }
}

/* ---------- export (vector) ---------- */
const dataUrlBytes = u => { const b = atob(u.split(',')[1]); const a = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; };
async function pdfObj(W, o, imgCache) {
  const op = (o.opacity ?? 100) / 100; const pre = []; const post = ['Q'];
  const begin = (blend) => { W.push('q'); if (op < 1 || blend) W.push(W.gs(op, blend || 'Normal') + ' gs'); };
  switch (o.type) {
    case 'text': if (o.text && o.text.trim()) await pdfText(W, o); break;
    case 'pen': case 'hl': { begin(o.type === 'hl' ? 'Multiply' : null); W.push(rgbStr(o.color) + ' RG', nf(o.width) + ' w', o.type === 'hl' ? '0 J 1 j' : '1 J 1 j');
      let cx = 0, cy = 0; const segs = smoothPts(o.pts).map(s => { if (s[0] === 'M') { cx = s[1]; cy = s[2]; return `${nf(s[1])} ${nf(s[2])} m`; }
        if (s[0] === 'L') { cx = s[1]; cy = s[2]; return `${nf(s[1])} ${nf(s[2])} l`; } const [, qx, qy, x, y] = s; const r = `${nf(cx + 2 / 3 * (qx - cx))} ${nf(cy + 2 / 3 * (qy - cy))} ${nf(x + 2 / 3 * (qx - x))} ${nf(y + 2 / 3 * (qy - y))} ${nf(x)} ${nf(y)} c`; cx = x; cy = y; return r; });
      W.push(...segs, 'S', 'Q'); break; }
    case 'rect': case 'ellipse': { begin(); const path = o.type === 'rect' ? `${nf(o.x)} ${nf(o.y)} ${nf(o.w)} ${nf(o.h)} re` : ellipsePath(o.x, o.y, o.w, o.h);
      const fill = o.fill && o.fill !== 'none', stroke = o.width > 0; if (fill) W.push(rgbStr(o.fill) + ' rg'); if (stroke) W.push(rgbStr(o.color) + ' RG', nf(o.width) + ' w');
      if (fill || stroke) W.push(path, fill && stroke ? 'B' : fill ? 'f' : 'S'); W.push('Q'); break; }
    case 'white': W.push('q', rgbStr(o.color || '#fff') + ' rg', `${nf(o.x)} ${nf(o.y)} ${nf(o.w)} ${nf(o.h)} re f`, 'Q'); break;
    case 'line': case 'arrow': { begin(); W.push(rgbStr(o.color) + ' RG', rgbStr(o.color) + ' rg', nf(o.width) + ' w 1 J 1 j', `${nf(o.x1)} ${nf(o.y1)} m ${nf(o.x2)} ${nf(o.y2)} l S`);
      if (o.type === 'arrow') { const a = Math.atan2(o.y2 - o.y1, o.x2 - o.x1), L = Math.max(8, o.width * 4); W.push(`${nf(o.x2)} ${nf(o.y2)} m ${nf(o.x2 - L * Math.cos(a - .45))} ${nf(o.y2 - L * Math.sin(a - .45))} l ${nf(o.x2 - L * Math.cos(a + .45))} ${nf(o.y2 - L * Math.sin(a + .45))} l h f`); }
      W.push('Q'); break; }
    case 'image': { let img = imgCache.get(o.src); if (!img) { const b = dataUrlBytes(o.src); img = /^data:image\/jpe?g/i.test(o.src) ? await W.doc.embedJpg(b) : await W.doc.embedPng(b).catch(async () => { const c = document.createElement('canvas'); c.width = o.img.naturalWidth; c.height = o.img.naturalHeight; c.getContext('2d').drawImage(o.img, 0, 0); return W.doc.embedPng(await canvasBytes(c)); }); imgCache.set(o.src, img); }
      begin(); W.push(`${nf(o.w)} 0 0 ${nf(-o.h)} ${nf(o.x)} ${nf(o.y + o.h)} cm`, W.xobj(img.ref) + ' Do', 'Q'); break; }
    case 'mark': { begin(); const lw = o.width || Math.max(1.5, o.w * 0.13); W.push(rgbStr(o.color) + ' RG', rgbStr(o.color) + ' rg', nf(lw) + ' w 1 J 1 j');
      if (o.kind === 'dot') { const r = Math.min(o.w, o.h) * 0.3; W.push(ellipsePath(o.x + o.w / 2 - r, o.y + o.h / 2 - r, r * 2, r * 2), 'f'); }
      else markSegs(o).forEach(seg => W.push(seg.map((p, i) => `${nf(p[0])} ${nf(p[1])} ${i ? 'l' : 'm'}`).join(' ') + ' S'));
      W.push('Q'); break; }
    case 'sigblock': { await ensureSigFaces(o); const L = sigLayout(o); begin();
      W.push(rgbStr(o.labelColor || '#111111') + ' RG', nf(Math.max(0.6, o.size * 0.06)) + ' w 1 J', `[0 ${nf(o.size * 0.17)}] 0 d`);
      L.dots.forEach(([a, b, y]) => W.push(`${nf(a)} ${nf(y)} m ${nf(b)} ${nf(y)} l S`)); W.push('Q');
      if (L.img) await pdfObj(W, { type: 'image', img: o._img, src: o.sigSrc, ...L.img, opacity: 100 }, imgCache);
      for (const t of L.texts) { const { F, ...tt } = t; await pdfText(W, { ...tt, opacity: o.opacity ?? 100 }); }
      break; }
    case 'stamp': { const L = stampLayout(o); if (!L) { await ensureFace({ font: o.font || 'Kanit', bold: true }); await ensureFace({ font: o.font || 'Kanit' }); }
      const SL = stampLayout(o); begin(); const sw = o.size * 0.075; const ins = sw * 2.2;
      W.push(rgbStr(o.color) + ' RG', nf(sw) + ' w', rrectPdf(o.x + sw / 2, o.y + sw / 2, SL.w - sw, SL.h - sw, o.size * 0.22) + ' S', nf(sw * 0.4) + ' w', rrectPdf(o.x + ins, o.y + ins, SL.w - ins * 2, SL.h - ins * 2, o.size * 0.14) + ' S', 'Q');
      await pdfText(W, { ...SL.t1, opacity: o.opacity }); if (SL.t2) await pdfText(W, { ...SL.t2, opacity: o.opacity }); break; }
  }
}
async function commitEdit(silent) {
  finishText();
  if (!hasAnnots()) { if (!silent) toast('ยังไม่มีการแก้ไข'); return; }
  busy(true, 'กำลังบันทึกการแก้ไขลง PDF…'); await tick();
  try {
    const doc = await loadCur(); const imgCache = new Map(); const redacts = {};
    for (const k of Object.keys(E.annots)) {
      const arr = E.annots[k]; if (!arr.length) continue; const page = doc.getPage(+k);
      const boxes = arr.filter(o => o._orig && o._line).map(o => o._line);
      if (boxes.length) { try { removeTextInBoxes(doc, page, boxes); } catch (e) { console.warn('text removal failed, using cover only', e); } }
      const W = new PageWriter(doc, page);
      for (const o of arr) { if (o.type === 'redact') { (redacts[k] ||= []).push(o); continue; } await pdfObj(W, o, imgCache); }
      W.finish();
    }
    let bytes = await doc.save();
    if (Object.keys(redacts).length) bytes = await applyRedactions(bytes, redacts);
    resetEdit(); await setDoc(bytes, S.name);
    toast(Object.keys(redacts).length ? 'บันทึกแล้ว — ข้อมูลใต้กล่องดำถูกลบออกถาวร' : 'บันทึกการแก้ไขลง PDF แล้ว (ข้อความเป็นเวกเตอร์ ค้นหาได้)', 'ok');
  } finally { busy(false); }
}
async function applyRedactions(bytes, redacts) {
  busy(true, 'กำลังลบข้อมูลใต้กล่องดำ…');
  const pdf = await pdfjsLib.getDocument({ data: bytes.slice(), isEvalSupported: false }).promise; const doc = await PDFDocument.load(bytes);
  for (const k of Object.keys(redacts)) {
    const pi = +k; const pg = await pdf.getPage(pi + 1); const v1 = pg.getViewport({ scale: 1 }); const sc = 200 / 72; const vp = pg.getViewport({ scale: sc });
    const c = document.createElement('canvas'); c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height); const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
    await pg.render({ canvasContext: g, viewport: vp }).promise; g.fillStyle = '#000'; redacts[k].forEach(o => g.fillRect(o.x * sc, o.y * sc, o.w * sc, o.h * sc));
    const img = await doc.embedJpg(await canvasBytes(c, 'image/jpeg', 0.9)); c.width = c.height = 0;
    const np = doc.insertPage(pi, [v1.width, v1.height]); np.drawImage(img, { x: 0, y: 0, width: v1.width, height: v1.height }); doc.removePage(pi + 1);
  }
  pdf.destroy(); return doc.save();
}
