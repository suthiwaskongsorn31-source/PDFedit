# PDF Studio Pro — แก้ไข PDF ภาษาไทย สระไม่ลอย

เว็บแอปจัดการและแก้ไข PDF ที่ทำงานในเบราว์เซอร์ 100% — ไฟล์ไม่ถูกอัปโหลดไปที่ใด

## ฟีเจอร์

**แก้ไข**
- แก้ข้อความเดิมในไฟล์ (ตรวจจับฟอนต์/ขนาด/สี และลบข้อความเก่าออกจริง)
- พิมพ์ข้อความไทย สระ-วรรณยุกต์ไม่ลอย (จัดตัวอักษรด้วย HarfBuzz)
- ฟอนต์ไทย 33 ตระกูล หนา/เอียง — TH Sarabun New, TH SarabunPSK, Sarabun, Kanit, Prompt ฯลฯ
- ฟอนต์แทน Microsoft ที่ความกว้างตัวอักษรเท่ากัน: Arial → Liberation Sans, Times New Roman → Liberation Serif, Courier New → Liberation Mono, Calibri → Carlito, Cambria → Caladea
- เพิ่มฟอนต์ของคุณเองจากเครื่อง (.ttf .otf .ttc เช่น Angsana New, Cordia New, Tahoma จาก `C:\Windows\Fonts`) — เก็บในเบราว์เซอร์เครื่องนั้นเท่านั้น ไม่อยู่ใน repo
- ปากกา ไฮไลต์ รูปทรง ลูกศร รูปภาพ ลายเซ็น (วาด/พิมพ์/อัปโหลด) ตรายาง
- ปิดข้อมูลถาวร (Redact), ค้นหาในเอกสาร
- กรอกฟอร์ม PDF ภาษาไทย, ลายน้ำ, หัว-ท้ายกระดาษ & เลขหน้า

**จัดการหน้า** — จัดเรียง หมุน ลบ รวมไฟล์ แยกไฟล์ (ตามหน้า/ช่วง/ขนาดไฟล์) ครอป ปรับเป็น A4 หลายหน้าต่อแผ่น (N-up)

**แปลง & ปรับแต่ง** — รูป ⇄ PDF, PDF → Word (.docx), PDF → ข้อความ, OCR ไทย+อังกฤษ, บีบอัดไฟล์

**ความปลอดภัย** — ล็อกรหัสผ่าน AES-256 + จำกัดสิทธิ์, ปลดล็อก, แก้ข้อมูลเอกสาร

## ใช้งาน

เปิดผ่าน GitHub Pages: Settings → Pages → Source: `Deploy from a branch` → `main` / `(root)`

รันในเครื่อง (ต้องผ่านเว็บเซิร์ฟเวอร์ เปิดไฟล์ตรง ๆ ไม่ได้):

```bash
python3 -m http.server 8000
# แล้วเปิด http://localhost:8000
```

## โครงสร้าง

| ไฟล์ | หน้าที่ |
|---|---|
| `index.html` | หน้าหลักและ CSS |
| `js/core.js` | เอนจินฟอนต์ (HarfBuzz), ตัวเขียน PDF แบบเวกเตอร์, ตัวลบข้อความเดิม |
| `js/app.js` | เครื่องมือระดับเอกสาร (จัดเรียง แยก ลายน้ำ ฟอร์ม OCR แปลง ฯลฯ) |
| `js/editor.js` | ตัวแก้ไขหน้า |
| `fonts/` | ฟอนต์ไทย (.ttf) |
| `lib/hb/` | HarfBuzz (WebAssembly) |
| `lib/ocr/` | Tesseract.js + ข้อมูลภาษาไทย/อังกฤษ |

## ไลบรารีและสัญญาอนุญาต

- [@cantoo/pdf-lib](https://github.com/cantoo-scribe/pdf-lib), [@cantoo/fontkit](https://github.com/cantoo-scribe/fontkit) (MIT)
- [PDF.js](https://github.com/mozilla/pdf.js) (Apache-2.0), [JSZip](https://github.com/Stuk/jszip) (MIT)
- [HarfBuzz / harfbuzzjs](https://github.com/harfbuzz/harfbuzzjs) (MIT), [Tesseract.js](https://github.com/naptha/tesseract.js) (Apache-2.0)
- ฟอนต์ Google Fonts, Liberation, Carlito, Caladea: SIL Open Font License 1.1 · TH Sarabun New / TH SarabunPSK: สัญญาอนุญาต SIPA (`fonts/LICENSE-SIPA.txt`)

> หมายเหตุ: `lib/ocr/worker.min.js` แก้ไขจากต้นฉบับ 1 จุด (แก้บั๊กการส่งข้อมูลภาษาแบบ object ใน initialize)

> ฟอนต์ของ Microsoft มีลิขสิทธิ์ จึงไม่ได้ใส่ไว้ใน repo — ผู้ใช้เพิ่มเองจากเครื่องที่มีสิทธิ์ใช้งานได้
