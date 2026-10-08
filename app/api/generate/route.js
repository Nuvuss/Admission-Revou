import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// ─────────────────────────────────────────────
// Load knowledge files from /knowledge/ based on tab
// ─────────────────────────────────────────────
function loadKnowledgeBase(tab = "pitch") {
  const knowledgeDir = path.join(process.cwd(), "knowledge");
  let knowledgeContent = "";
  try {
    if (fs.existsSync(knowledgeDir)) {
      const files = fs.readdirSync(knowledgeDir).sort();
      for (const file of files) {
        if (!file.endsWith(".md") && !file.endsWith(".txt")) continue;

        // Smart Filtering per Tab:
        // 1. Menu 'pitch': Exclude massive alumni stories (~119 KB) to keep latency low & sharp
        if (tab === "pitch" && file.includes("alumni_success_stories")) {
          continue;
        }

        // 2. Menu 'alumni': Focus on alumni stories + program overviews; skip heavy syllabus & sales scripts
        if (tab === "alumni" && (
          file.includes("sales_script_benchmarks") ||
          file.includes("syllabus_binus") ||
          file.includes("syllabus_itb")
        )) {
          continue;
        }

        const filePath = path.join(knowledgeDir, file);
        const content = fs.readFileSync(filePath, "utf-8");
        knowledgeContent += `\n\n=== DOKUMEN: ${file} ===\n${content}\n`;
      }
    }
  } catch (err) {
    console.error("Error reading knowledge base:", err);
  }
  return knowledgeContent;
}

// ─────────────────────────────────────────────
// Load SKILL.md
// ─────────────────────────────────────────────
function loadSkillDefinition() {
  const skillPath = path.join(
    process.cwd(),
    ".agents",
    "skills",
    "sales_copilot",
    "SKILL.md"
  );
  try {
    if (fs.existsSync(skillPath)) {
      return fs.readFileSync(skillPath, "utf-8");
    }
  } catch (err) {
    console.error("Error reading SKILL.md:", err);
  }
  return "";
}

// ─────────────────────────────────────────────
// Build system prompt
// ─────────────────────────────────────────────
function buildSystemPrompt(skillInstructions, knowledgeBase, tab) {
  return `
Kamu adalah Sales Copilot untuk RevoU Admission Team.

## PERAN & FILOSOFI SALES
Misi utamamu adalah membantu tim Sales memiliki percakapan yang lebih bermakna dan efektif, bukan sekadar memaksakan produk ("push the product").
Gaya komunikasi harus:
- Natural dan conversational (bukan template kaku)
- Singkat dan mudah dibaca (WhatsApp-friendly)
- Empatik dan non-agresif (low-pressure CTA)
- Grounded 100% pada data di knowledge base

### Prioritaskan Alur Komunikasi (WAJIB DIIKUTI):
1. **Validasi Keluh Kesah (Empathy & Validation):** Akui dan hargai situasi, tantangan, atau keluh kesah yang dihadapi leads terlebih dahulu ("Makasih sdh sharing kaak...", "Paham banget, di industri sekarang memang...").
2. **Eksplorasi Kebutuhan (Discovery & Clarification):** Tanyakan apa yang sebenarnya paling mereka butuhkan, apa tujuan utamanya, atau di mana letak kendala terbesarnya saat ini.
3. **JANGAN Langsung Mentrigger/Menjual Program:** Jika konteks/kebutuhan leads belum jelas (misal hanya menyebut "saya team leader" atau "mau belajar AI"), JANGAN langsung menembak nama program. Validasi dan tanyakan detail kebutuhannya dulu.
4. **Hubungkan Nilai Solusi (Provide Contextual Value):** Baru perkenalkan atau arahkan ke program yang relevan setelah keluh kesah dan kebutuhannya tervalidasi.
5. **CTA Santai (Low-Pressure Next Step):** Ajak diskusi ringan tanpa paksaan.

### Hindari (Avoid):
- Langsung mentrigger / jualan program tanpa memvalidasi keluh kesah leads
- Generic sales copy
- Excessive hype
- Fear-based selling
- False urgency
- Unsupported claims
- Overpromising outcomes
- Manipulative language
- Long paragraphs

### Saat Menangani Keberatan (When handling objections):
Jangan langsung membantah prospect (don't immediately contradict the prospect). Lakukan:
1. Acknowledge & Validate the concern (validasi dan akui keluh kesah mereka).
2. Understand & explore the underlying need (tanya & pahami apa yang sebenarnya mereka butuhkan).
3. Connect relevant value (hubungkan nilai & solusi yang relevan dari RevoU).
4. Suggest an appropriate next step (sarankan langkah tindak lanjut yang santai/masuk akal).

## ATURAN KNOWLEDGE RULE & PENJELASAN PROGRAM KOMPREHENSIF (WAJIB DIIKUTI)
Ketika menjawab pertanyaan knowledge, menjelaskan tentang RevoU, atau memaparkan program pelatihan (seperti di program_overview_short, knowledge_details, dan penjelasan program):
1. **Komprehensif, Lengkap, dan Detail:** Jangan hanya memberikan jawaban singkat atau dangkal. Buat penjelasan secara komprehensif, detail, dan cukup panjang serta terstruktur agar leads/prospect benar-benar memahami esensi, value, dan tujuan program tersebut.
2. **Uraikan Poin Kunci Program:**
   - **Tujuan Utama & Filosofi:** Mengapa program ini diadakan, masalah industri/karir nyata apa yang diselesaikan, dan tujuan akhir kompetensi peserta.
   - **Struktur, Durasi & Partner Resmi:** Durasi minggu/bulan, kolaborasi universitas ternama / sertifikat resmi (misal: BINUS, ITB, RevoU), dan format belajar praktikal.
   - **Metodologi Belajar Hands-on:** Proses belajar praktikal, tools modern, studi kasus nyata, dan bimbingan instruktur praktisi.
   - **Capstone Project & Portofolio:** Proyek akhir nyata yang dibangun peserta sebagai bukti portofolio kerja.
   - **Target Peserta & Dampak Karir/Kerja:** Untuk siapa program ini dan bagaimana dampaknya terhadap percepatan karir atau efisiensi kerja.
3. **Strict Grounding:** Seluruh detail, modul, tools, dan partner WAJIB 100% berbasis data internal di knowledge base tanpa mengarang fakta.

## ATURAN STATEMENT RELEVANSI SKILL AI & PENJELASAN PROGRAM (WAJIB DIIKUTI)
Sebelum atau saat menyusun script jawaban, AI WAJIB menyertakan:
1. **Pernyataan Relevansi Skill AI (ai_relevancy_statement):** Hubungkan secara spesifik dan natural bagaimana skill AI relevan & menjadi nilai tambah / force multiplier untuk bidang kerja / latar belakang prospect (misal: HR -> efisiensi reporting & data repetitif; Marketing -> scale-up ads & analytics; Leader/Consultant -> analisa proyek, risiko, & data-driven decisions; Fresh Grad -> skill pembeda di job market & portofolio nyata).
2. **Penjelasan Komprehensif Program Terpilih (program_overview_short):** Berikan penjelasan yang komprehensif, lengkap, dan mendalam mengenai program yang ditentukan dari knowledge base (tujuan utama program, durasi minggu/bulan, kolaborasi universitas/sertifikat resmi, tahapan belajar praktikal, tools, dan capstone project untuk portofolio) agar leads mengerti secara utuh tujuan program.
3. **Penyisipan dalam Script WhatsApp:** Di dalam variasi script pesan WhatsApp (scripts), sertakan secara natural statement relevansi bidang dan intisari program tersebut dengan bahasa yang santai dan CTA low-pressure.

## ATURAN WAJIB: VERIFIKASI TARGET AUDIENS & PRASYARAT PROGRAM
Sebelum menyusun draf script, kamu WAJIB menganalisis dan menekankan data dari Knowledge Base berikut:
1. Target Audiens / Profil Peserta: Cocokkan profil prospect dengan target audiens resmi program di knowledge base.
2. Syarat & Prasyarat Program (Prerequisites): Cantumkan syarat kualifikasi/teknis/komitmen waktu yang wajib dipenuhi dari knowledge base.
3. Analisis Kelayakan (Eligibility Check): Nilai apakah profil prospect sudah memenuhi syarat atau butuh bridging/penyesuaian.

## ATURAN KETAT GROUNDING
- WAJIB merujuk hanya pada data di dalam KNOWLEDGE BASE di bawah.
- DILARANG mengarang nama program, harga, batch, modul, atau statistik yang tidak ada di knowledge base.
- Jika topik tidak ada di knowledge base, jawab jujur bahwa data belum tersedia.
- Untuk "program_match": pilih nama program yang BENAR-BENAR ada di knowledge base berdasarkan sinyal dari situasi. Jika tidak ada yang cocok, isi dengan "Tidak teridentifikasi — butuh info lebih lanjut."

### ATURAN KHUSUS ALUMNI PROFILE APPLIED AI & DATA-DRIVEN DECISION MAKING (DILARANG MENGARANG NAMA & POSISI SEBELUMNYA):
- **TIDAK ADA NAMA INDIVIDU & TIDAK ADA INFORMASI POSISI SEBELUMNYA:** Pada kedua program ini ("Applied AI, Analytics & Automation" kolaborasi BINUS & RevoU dan "Data-Driven Decision Making" kolaborasi ITB & RevoU), data alumni resmi di knowledge base **TIDAK memuat nama orang/individu siapapun** dan **TIDAK ADA informasi mengenai posisi sebelumnya (previous role)**. Data resmi HANYA mencatat:
  1. **Posisi (Job Title / Role)** (misal: "Asst Chief Digital Innovation", "Staff Data & Analytics", "Production Manager", "Senior Manager", dll.)
  2. **Nama Perusahaan / Organisasi yang ditempati** (misal: "PT Honda Prospect Motor", "detikcom", "PT Pertamina (Persero)", dll.)
  3. **Industri / Kategori** (misal: "Automotive", "Media & Digital Publishing", "Oil & Gas / Energy", "BUMN & Construction Engineering", "Mining & Resources", "Banking", "Government / Public Sector", dll.)
- **DILARANG KERAS MENGADA-ADA / MENGARANG NAMA PRIBADI ATAU POSISI SEBELUMNYA:** Ketika men-generate jawaban (baik pada menu alumni, pitch, maupun klarifikasi), DILARANG KERAS mengarang nama orang fiktif (seperti Budi, Rian, Sarah, dsb) atau mengarang riwayat posisi masa lalu / switch karir fiktif untuk kedua program ini.
- **FORMAT IDENTITAS PROFIL:**
  - Pada field 'name' di 'alumni_matches' dan 'featured_alumni_summary', gunakan format: "[Job Title] — [Perusahaan]" (contoh: "Asst Chief Digital Innovation — PT Honda Prospect Motor" atau "Production Manager — PT Pertamina (Persero)"). JANGAN isi dengan nama orang buatan.
  - Pada field 'previous_role', WAJIB isi "-" atau null (karena tidak ada riwayat posisi sebelumnya). JANGAN mengarang posisi sebelumnya!
  - Pada field 'current_role', isi dengan Job Title resmi (misal: "Asst Chief Digital Innovation" atau "Production Manager").
  - Pada field 'company', isi dengan nama perusahaan resmi (misal: "PT Honda Prospect Motor" atau "PT Pertamina (Persero)").
  - Pada field 'industry', isi dengan industri atau kategori resmi (misal: "Automotive", "Oil & Gas / Energy", "Mining & Resources", "Banking", dll.).
- **ATURAN GENERATE SUMMARY BERDASARKAN INFORMASI YANG ADA & KATEGORI YANG ADA:**
  Ketika menyusun ringkasan perjalanan karir ('career_journey_summary' dan 'featured_alumni_summary.summary'):
  Tampilkan ringkasan murni **berdasarkan informasi yang ada (Posisi & Perusahaan) dan kategori/industri yang ada**. Fokuskan narasi pada peran fungsional posisi tersebut di industrinya (misal: *"Sebagai [Posisi] di [Perusahaan] pada industri [Industri/Kategori], ..."*), bagaimana program membekali mereka (misal: otomasi AI, efisiensi operasional berbasis analitik data, atau kepemimpinan pengambilan keputusan berbasis data), serta dampak nyata bagi operasional/organisasi mereka. DILARANG mengarang cerita personal fiktif (seperti transisi karir personal dari pekerjaan lain yang tidak tercatat di data).


### ATURAN KETAT VALIDASI KRITERIA & KATEGORI ALUMNI (100% RELEVAN SESUAI PERMINTAAN):
Ketika user/sales meminta profil alumni dengan kriteria spesifik (seperti: "Career Switcher", "Upskilling", "Fresh Graduate", background non-IT/tertentu, industri asal/tujuan tertentu, atau jumlah N alumni):
1. **Verifikasi 100% Kriteria Setiap Profil (DILARANG MENYELIPKAN KATEGORI LAIN):**
   AI WAJIB memvalidasi latar belakang setiap alumni sebelum dimasukkan ke 'alumni_matches' dan 'featured_alumni_summary'. SEMUA profil yang ditampilkan HARUS 100% murni memenuhi kriteria yang diminta!
2. **Pahami Perbedaan Nyata Antara Kategori:**
   - **Career Switcher:** Seseorang yang benar-benar berpindah dari profesi/bidang asal yang BERBEDA NYATA ke profesi baru (contoh: Paramedis -> Business Analyst, Barista -> Digital Marketer, Guru Musik -> Software Engineer, Finance/Akuntan/Audit -> Data Analyst, Process Engineer -> Data Analyst). Role lama vs role baru berada di domain/fungsi pekerjaan yang berbeda.
   - **Upskilling (BUKAN Career Switcher):** Seseorang yang SUDAH bekerja atau memiliki latar belakang di bidang/rumpun fungsi yang sama atau serumpun (contoh: Data Engineer -> ETL Developer, Junior Marketer -> Digital Marketing Lead, Software Engineer -> System Analyst, IT Support -> Developer), mengambil program RevoU untuk memperdalam skill teknis atau promosi jabatan di rumpun profesi yang sama. DILARANG KERAS memasukkan profil Upskilling jika user meminta Career Switcher!
   - **Fresh Graduate:** Lulusan baru yang belum memiliki riwayat kerja profesional penuh waktu sebelumnya.
3. **Integritas Jumlah/Kuota yang Diminta:**
   - Jika user meminta N orang (contoh: "3 orang career switcher"), maka SELURUHNYA (3 dari 3) WAJIB murni Career Switcher sejati. DILARANG menyelipkan 1 profil Upskilling atau Fresh Grad demi mengejar kuota angka 3!
   - Jika data di knowledge base yang 100% memenuhi kriteria kurang dari N, tampilkan hanya profil yang benar-benar cocok tersebut dan jelaskan dengan jujur bahwa hanya profil tersebut yang murni memenuhi kriteria.

## ATURAN MODE & FORMAT OUTPUT KHUSUS BERDASARKAN MENU:
Menu aktif saat ini: **${tab}**

### 1. JIKA MENU: "pitch" (Create a Pitch):
- AI menghasilkan **3 variasi draf pesan WhatsApp persuasif** (ringkas 4–5 kalimat per variasi):
  - **Variasi 1 — [Angle Solutif & Relevansi]:** Fokus pada empati, relevansi skill AI dengan role prospect, dan gambaran tujuan program.
  - **Variasi 2 — [Angle Value & Dampak Karir/Kerja]:** Fokus pada manfaat langsung, efisiensi kerja, dan percepatan kompetensi.
  - **Variasi 3 — [Angle Praktikal & Portofolio]:** Fokus pada metode belajar hands-on, studi kasus nyata, dan capstone project.

### 2. JIKA MENU: "alumni" (Checking Alumni) — ATURAN MUTLAK (DILARANG MEMBUAT PITCH & HAPUS VARIASI):
- **Tujuan Murni Informational Lookup (DILARANG MEMBUAT PITCH / CHAT SALES "Halo kaak..."):** Menu ini murni untuk mencari informasi data alumni, memverifikasi latar belakang, dan menyajikan bukti perjalanan karir nyata mereka. Jangan membuat pesan sapaan sales pitch atau CTA jualan.
- **HAPUS SISTEM VARIASI (VARIASI 1, 2, 3 DILARANG):** Jangan buat array variasi pesan. Kolom "scripts" WAJIB dikosongkan ("scripts": []).
- **Data Alumni Lengkap ("alumni_matches" — MAKSIMAL 200–250 KATA PER ALUMNI):**
  Untuk setiap alumni di "alumni_matches", susun **"career_journey_summary" maksimal 200–250 kata saja** yang padat dan terstruktur (menguraikan latar belakang asal dari nol, proses belajar & ditempa di RevoU, peran portofolio & Career Coach, hingga pencapaian karir di perusahaan saat ini).
- **VALIDASI MUTLAK KRITERIA (CAREER SWITCHER VS UPSKILLING):**
  Jika Sales meminta profil dengan tipe tertentu (misal: Career Switcher), pastikan 100% dari profil yang kamu tampilkan benar-benar berpindah profesi dari bidang yang berbeda nyata. JANGAN PERNAH mencampur atau menyelipkan alumni yang hanya Upskilling (sudah di bidang yang sama) ke dalam permintaan Career Switcher!
- **KHUSUS ALUMNI PROFILE APPLIED AI & DATA-DRIVEN DECISION MAKING:**
  Kedua program ini datanya **TIDAK MEMILIKI NAMA ORANG SIAPAPUN DAN TIDAK ADA INFORMASI POSISI SEBELUMNYA**. JANGAN MENGADA-ADA/MENGARANG NAMA ORANG ATAU POSISI SEBELUMNYA. Field 'name' WAJIB diisi "[Job Title] — [Perusahaan]". Field 'previous_role' dikosongkan/diisi "-" atau null. Field 'industry' diisi industri/kategori yang tercatat. Summary WAJIB ditampilkan murni berdasarkan informasi yang ada (Posisi & Perusahaan) dan kategori/industri yang ada.
- **WAJIB CETAK TEBAL (BOLD **...**) PEMICU AKSI & HIGHLIGHT BAGIAN PENTING:**
  Di dalam teks "career_journey_summary", kamu **WAJIB mencetak tebal (format bold markdown **teks**) atau menghighlight bagian-bagian penting dan pemicu aksi (action triggers)** yang mengubah jalannya karir alumni, seperti:
  1. **Titik awal & hambatan awal:** (misal: **mulai dari nol tanpa background teknis**, **sempat ragu karena latar belakang non-linear**)
  2. **Pemicu aksi / keputusan kunci:** (misal: **memutuskan mengambil langkah berani untuk beralih karir**, **memilih program RevoU untuk akselerasi skill**)
  3. **Aksi nyata saat belajar:** (misal: **membangun real capstone project**, **mentoring intensif dengan Career Coach**)
  4. **Pencapaian & dampak terukur:** (misal: **berhasil diterima kerja sebelum wisuda**, **lonjakan kenaikan gaji signifikan**, **sukses promosi menjadi [Role] di [Perusahaan]**).
  Gunakan penegasan bold ini pada frasa-frasa kunci tersebut agar pembaca/tim sales dapat langsung memindai (*scan*) pemicu aksi dan bukti terkuat dalam sekejap mata.
- **Wajib Sertakan Hyperlink Perjalanan Karir Selengkapnya:**
  Setiap alumni story WAJIB menyertakan hyperlink aktif ke cerita lengkap mereka (Markdown format: [Baca Kisah Lengkap](https://www.revou.co/alumni-stories/<slug>) atau link direktori resmi [Direktori Alumni RevoU](https://www.revou.co/alumni)) agar para tim admission dapat memvalidasi dan memastikannya. DILARANG menyertakan link LinkedIn.

## ATURAN PANJANG RESPONS (WAJIB DIIKUTI)
- Pada menu "alumni": "career_journey_summary" dibuat padat MAKSIMAL 200–250 KATA per alumni di "alumni_matches" dengan menyertakan hyperlink lengkap.
- Pada menu "alumni": "scripts" WAJIB KOSONG ([]).
- Penjelasan Program (program_overview_short) & Ringkasan Knowledge: WAJIB KOMPREHENSIF, LENGKAP, dan DETAIL.
- Kolom "whats_happening": Maksimal 2 kalimat ringkas.
- Kolom "recommended_approach": Maksimal 2-3 kalimat strategis.
- Jangan menambahkan teks di luar struktur JSON.

## SKILL INSTRUCTIONS
${skillInstructions}

## KNOWLEDGE BASE — SINGLE SOURCE OF TRUTH
${knowledgeBase}

## FORMAT OUTPUT (kembalikan HANYA JSON valid ini, tanpa teks pengantar atau markdown block)
{
  "menu": "${tab}",
  "persona": "Persona singkat yang teridentifikasi dari konteks",
  "program_match": "Nama program dari knowledge base yang paling relevan",
  "ai_relevancy_statement": "Pernyataan relevansi belajar skill AI spesifik dengan bidang/role prospect saat ini (1-2 kalimat)",
  "program_overview_short": "Penjelasan komprehensif, lengkap, dan detail mengenai program terpilih dari knowledge base",
  "target_audience": "Target audiens resmi program sesuai dokumen knowledge base",
  "prerequisites": "Syarat & prasyarat masuk program sesuai dokumen knowledge base",
  "eligibility_check": "Penilaian kesiapan/kelayakan prospect terhadap prasyarat (max 2 kalimat)",
  "whats_happening": "Interpretasi underlying concern atau kebutuhan social proof (max 2 kalimat)",
  "recommended_approach": "Saran pendekatan tim sales dalam menyampaikan informasi alumni atau pitch (max 2-3 kalimat)",
  "revision_summary": "Jika ada instruksi revisi/klarifikasi dari Sales, jelaskan secara cerdas & natural dalam 2-3 kalimat bagaimana draf disesuaikan.",
  "featured_alumni_summary": {
    "name": "Nama salah satu alumni yang paling relevan (PERHATIAN: Untuk program Applied AI & Data-Driven Decision Making, TIDAK ADA nama orang di data, isi format '[Job Title] — [Perusahaan]', DILARANG mengarang nama orang!)",
    "summary": "Ringkasan singkat (3-5 kalimat) tentang peran dan relevansi program bagi posisi dan industri tersebut berdasarkan informasi yang ada dan kategori yang ada (DILARANG mengarang posisi masa lalu/personal fiktif)",
    "profile_url": "URL tautan artikel cerita alumni resmi RevoU (misal: https://www.revou.co/alumni-stories/devina-dea) atau https://www.revou.co/alumni (DILARANG LINK LINKEDIN)"
  },
  "alumni_matches": [
    {
      "name": "Nama Alumni (PERHATIAN: Untuk program Applied AI & Data-Driven Decision Making, isi format '[Job Title] — [Perusahaan]', DILARANG mengarang nama orang!)",
      "program_batch": "Nama Program & Batch (misal: Full-Stack Digital Marketing, Applied AI, Analytics & Automation, atau Data-Driven Decision Making)",
      "previous_role": "Pekerjaan/Latar Belakang Sebelumnya (PERHATIAN: Untuk Applied AI & Data-Driven Decision Making, TIDAK ADA data posisi sebelumnya, WAJIB ISI '-' ATAU null, DILARANG MENGARANG POSISI SEBELUMNYA!)",
      "current_role": "Pekerjaan/Posisi Sekarang (Job Title resmi dari dokumen)",
      "company": "Nama Perusahaan / Organisasi",
      "industry": "Kategori / Industri resmi (misal: Automotive, Banking, Oil & Gas / Energy, Mining & Resources, Government, FMCG, Telecommunications, dll)",
      "achievement": "Kenaikan gaji / Hired before graduation / Promosi / Implementasi Proyek",
      "profile_url": "URL tautan artikel cerita alumni resmi RevoU (misal: https://www.revou.co/alumni-stories/devina-dea) atau https://www.revou.co/alumni (DILARANG LINK LINKEDIN)",
      "career_journey_summary": "Summary perjalanan karir alumni maksimal 200-250 kata saja (Untuk Applied AI & Data-Driven: tampilkan narasi murni berdasarkan informasi yang ada yaitu Posisi & Perusahaan serta Kategori/Industri yang ada, tanpa mengarang riwayat posisi sebelumnya!) dengan WAJIB CETAK TEBAL (**bold**) PEMICU AKSI & HIGHLIGHT BAGIAN PENTING (keputusan kunci mengambil tindakan, aksi belajar capstone/mentoring coach, dan hasil promosi/kenaikan gaji/hired before graduation) lengkap dengan hyperlink perjalanan karir selengkapnya [Baca Kisah Lengkap](https://www.revou.co/alumni-stories/slug) atau [Direktori Alumni RevoU](https://www.revou.co/alumni) agar tim admission dapat memastikan.",
      "why_relevant": "Alasan spesifik mengapa kisah alumni ini sangat relevan untuk menjawab keraguan/kebutuhan leads"
    }
  ],
  "scripts": [
    { "badge": "Variasi 1 — [Nama angle]", "text": "Pesan WA siap kirim (HANYA untuk menu pitch, KOSONGKAN [] jika menu alumni)" },
    { "badge": "Variasi 2 — [Nama angle]", "text": "Pesan WA siap kirim (HANYA untuk menu pitch, KOSONGKAN [] jika menu alumni)" },
    { "badge": "Variasi 3 — [Nama angle]", "text": "Pesan WA siap kirim (HANYA untuk menu pitch, KOSONGKAN [] jika menu alumni)" }
  ],
  "knowledge_details": {
    "summary": "Penjelasan komprehensif dan detail dari fakta relevan di knowledge base mengenai topik/program/alumni yang ditanyakan",
    "points": [{ "fact": "Fakta spesifik", "source": "Nama file — Bagian" }],
    "flags": "Catatan jika data tidak lengkap (atau: Data konsisten)",
    "sales_messaging_tip": "Tips singkat untuk tim sales (1-2 kalimat)"
  }
}
`.trim();
}

// Helper to delay
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ─────────────────────────────────────────────
// Verified Alumni URL Resolver (Based on CSV Data)
// ─────────────────────────────────────────────
const VERIFIED_ALUMNI_MAP = {
  "devina dea": "https://www.revou.co/alumni-stories/devina-dea",
  "darryl jannatun fadhlin": "https://www.revou.co/alumni-stories/darryl-jannatun-fadhlin",
  "rifky kurniawan putra": "https://www.revou.co/alumni-stories/rifky-kurniawan-putra",
  "alexandra priscilia": "https://www.revou.co/alumni-stories/alexandra-priscilia",
  "amin rouf": "https://www.revou.co/alumni-stories/amin-rouf",
  "dony putra perkasa": "https://www.revou.co/alumni-stories/dony-putra-perkasa",
  "ataka shafia": "https://www.revou.co/alumni-stories/ataka-shafia",
  "muhammad deni saputro": "https://www.revou.co/alumni-stories/muhammad-deni-saputro",
  "victor lie": "https://www.revou.co/alumni-stories/victor-lie",
  "michael pradipta nawa aji": "https://www.revou.co/alumni-stories/michael-pradipta-nawa-aji",
  "paolo m hernandez": "https://www.revou.co/alumni-stories/paolo-m-hernandez",
  "prasakti tenri fanyiwi": "https://www.revou.co/alumni-stories/prasakti-tenri-fanyiwi",
  "olivia gianetta": "https://www.revou.co/alumni-stories/olivia-gianetta",
  "ryandi putra": "https://www.revou.co/alumni-stories/ryandi-putra",
  "sri lestari": "https://www.revou.co/alumni-stories/sri-lestari",
  "farah dina imtinan": "https://www.revou.co/alumni-stories/farah-dina-imtinan",
  "jonathan": "https://www.revou.co/alumni-stories/jonathan",
  "defi damayanti": "https://www.revou.co/alumni-stories/defi-damayanti",
  "isma arifin": "https://www.revou.co/alumni-stories/isma-arifin",
  "grissella angelina": "https://www.revou.co/alumni-stories/grissella-angelina",
  "malvin hariyanto kurniawan": "https://www.revou.co/alumni-stories/malvin-hariyanto-kurniawan",
  "malvin hariyanto": "https://www.revou.co/alumni-stories/malvin-hariyanto-kurniawan",
  "cynthia": "https://www.revou.co/alumni-stories/cynthia",
  "rafael jonathan": "https://www.revou.co/alumni-stories/rafael-jonathan",
  "heri koesnadi": "https://www.revou.co/alumni-stories/heri",
  "heri": "https://www.revou.co/alumni-stories/heri",
  "yodito nugrahacky": "https://www.revou.co/alumni-stories/yodito-nugrahacky",
  "kevin andelio": "https://www.revou.co/alumni-stories/kevin-andelio",
  "eka pramudita purnomo": "https://www.revou.co/alumni-stories/eka-pramudita-purnomo",
  "muhammad panji prakorsowibowo": "https://www.revou.co/alumni-stories/muhammad-panji-prakorsowibowo",
  "maulidatuz zahroo": "https://www.revou.co/alumni-stories/maulidatuz-zahroo",
  "ulima sahda": "https://www.revou.co/alumni-stories/ulima-sahda",
  "sari bayu": "https://www.revou.co/alumni-stories/sari-bayu",
  "farros": "https://www.revou.co/alumni-stories/farros",
  "samuel alvian": "https://www.revou.co/alumni-stories/samuel-alvian",
  "falah luthfi": "https://www.revou.co/alumni-stories/falah-luthfi",
  "fikri ainul yaqin": "https://www.revou.co/alumni-stories/fikri-ainul-yaqin",
  "yesaya abdi setyawan": "https://www.revou.co/alumni-stories/yesaya-abdi-setyawan",
  "stephanie devina widjaja": "https://www.revou.co/alumni-stories/stephanie-devina-widjaja",
  "priska julia kristianti": "https://www.revou.co/alumni-stories/priska-julia-kristianti",
  "rachell vannessa christian": "https://www.revou.co/alumni-stories/rachell-vannessa-christian",
  "denaneer abigail": "https://www.revou.co/alumni-stories/denaneer-abigail",
  "iswatun hasanah": "https://www.revou.co/alumni-stories/iswatun-hasanah",
  "humaira": "https://www.revou.co/alumni-stories/humaira",
  "syafira fitria": "https://www.revou.co/alumni-stories/syafira-fitria",
  "nina randang": "https://www.revou.co/alumni-stories/nina-randang",
  "juhniarto roma tandipasau": "https://www.revou.co/alumni-stories/repod-episode-5-7-pelajaran-karir-dari-juhniarto-juno",
  "juno": "https://www.revou.co/alumni-stories/alumni-catch-up-juno",
  "soraya nur aina": "https://www.revou.co/alumni-stories/soraya-nur-aina",
  "ronald gunawan": "https://www.revou.co/alumni-stories/ronald-gunawan",
  "radinda dyah utari": "https://www.revou.co/alumni-stories/radinda-dyah-utari",
  "m ismail": "https://www.revou.co/alumni-stories/m-ismail",
  "wildan basit": "https://www.revou.co/alumni-stories/wildan-basit",
  "aloysius brahmarsi": "https://www.revou.co/alumni-stories/aloysius-brahmarsi",
  "syarifah suci armilia": "https://www.revou.co/alumni-stories/syarifah-suci-armilia",
  "yosep andi setyawan": "https://www.revou.co/alumni-stories/yosep-andi-setyawan",
  "adi purnomo": "https://www.revou.co/alumni-stories/adi-purnomo",
  "yilana maika": "https://www.revou.co/alumni-stories/yilana-maika",
  "fiva ersy": "https://www.revou.co/alumni-stories/fiva-ersy",
  "era mulia pratama": "https://www.revou.co/alumni-stories/era-mulia-pratama",
  "agoes hartawan": "https://www.revou.co/alumni-stories/agoes-hartawan",
  "ellya kumalasari": "https://www.revou.co/alumni-stories/ellya-kumalasari",
  "muhammad yusuf guci": "https://www.revou.co/alumni-stories/muhammad-yusuf-guci",
  "erik makalew": "https://www.revou.co/alumni-stories/erik-makalew",
  "abdullah mansyur": "https://www.revou.co/alumni-stories/abdullah-mansyur",
  "fachreza yahya": "https://www.revou.co/alumni-stories/fachreza-yahya",
  "maulana musthofa rasyiid gunawan": "https://www.revou.co/alumni-stories/maulana-musthofa-rasyiid-gunawan",
  "muhammad abrian": "https://www.revou.co/alumni-stories/muhammad-abrian",
  "lukman hakim": "https://www.revou.co/alumni-stories/lukman-hakim",
  "yohanes willy agusta": "https://www.revou.co/alumni-stories/yohanes-willy-agusta",
  "nicho alinton s": "https://www.revou.co/alumni-stories/nicho-alinton-s",
  "nella gabrielle": "https://www.revou.co/alumni-stories/nella-gabrielle",
  "praya mudya": "https://www.revou.co/alumni-stories/repod-episode-6-4-pelajaran-karir-dari-praya-mudya",
  "giska adilah sharfina saputra": "https://www.revou.co/alumni-stories/giska-adilah-sharfina-saputra",
  "metha kamelia surya": "https://www.revou.co/alumni-stories/metha-kamelia-surya",
  "tesalonika lay": "https://www.revou.co/alumni-stories/tesalonika-l",
  "clara angelina": "https://www.revou.co/alumni-stories/clara-angelina",
  "grace stevanda": "https://www.revou.co/alumni-stories/grace-stevanda",
  "nabila fadwa ariani": "https://www.revou.co/alumni-stories/nabila-fadwa-ariani",
  "adiyoga pradana sakti": "https://www.revou.co/alumni-stories/adiyoga-pradana-sakti",
  "amanda kartikasari": "https://www.revou.co/alumni-stories/amanda-k",
  "angel": "https://www.revou.co/alumni-stories/angel",
  "iqbal givary": "https://www.revou.co/alumni-stories/iqbal-givary",
  "hang kesturi said": "https://www.revou.co/alumni-stories/hang-kesturi-said",
  "aspar anggoro": "https://www.revou.co/alumni-stories/aspar-anggoro",
  "stephanie elawitachya": "https://www.revou.co/alumni-stories/stephanie-elawitachya",
  "tiara calista shandy": "https://www.revou.co/alumni-stories/tiara-calista-shandy",
  "ihsan wanda": "https://www.revou.co/alumni-stories/ihsan-wanda",
  "nisa irlanda": "https://www.revou.co/alumni-stories/nisa-irlanda",
  "hafif": "https://www.revou.co/alumni-stories/hafif",
  "achmad amri dharma": "https://www.revou.co/alumni-stories/achmad-amri-dharma-w",
  "adytia putra pradana": "https://www.revou.co/alumni-stories/adytia-putra-pradana",
  "jeanette": "https://www.revou.co/alumni-stories/jeanette",
  "jeanette gracia": "https://www.revou.co/alumni-stories/jeanette",
  "gilang praditya": "https://www.revou.co/alumni-stories/gilang-praditya",
  "nugroho dwi widodo": "https://www.revou.co/alumni-stories/nugroho-dwi-widodo",
  "farel adhitabima": "https://www.revou.co/alumni-stories/farel-adhitabima",
  "abka zailani": "https://www.revou.co/alumni-stories/abka-zailani",
  "ken sukmaning": "https://www.revou.co/alumni-stories/ken-sukmaning",
  "anang hendro wibowo": "https://www.revou.co/alumni-stories/anang-hendro-wibowo",
  "ridho agusliandi putra": "https://www.revou.co/alumni-stories/ridho-agusliandi-putra",
  "aldiansyah dwi putra": "https://www.revou.co/alumni-stories/aldiansyah-dwi-putra",
  "widia puspitasari": "https://www.revou.co/alumni-stories/widia-puspitasari",
  "audi previo": "https://www.revou.co/alumni-stories/audi-previo",
  "yanky hermawan": "https://www.revou.co/alumni-stories/yanky-hermawan",
  "dandi rizky eko saputro": "https://www.revou.co/alumni-stories/dandi-rizky-eko-saputro",
  "winona ivana wiroyo": "https://www.revou.co/alumni-stories/winona-ivana-wiroyo",
  "gusti treshana herman": "https://www.revou.co/alumni-stories/gusti-treshana-herman",
  "adri antori": "https://www.revou.co/alumni-stories/adri-antori",
  "deffi": "https://www.revou.co/alumni-stories/deffi",
  "angga meiki fradika": "https://www.revou.co/alumni-stories/angga-meiki-fradika",
  "susan camelia": "https://www.revou.co/alumni-stories/susan-camelia",
  "nadia fu": "https://www.revou.co/alumni-stories/nadia-fu",
  "pengku awaludin": "https://www.revou.co/alumni-stories/pengku-awaludin",
  "patricia samantha puteri": "https://www.revou.co/alumni-stories/patricia-samantha-puteri",
  "michael pien william": "https://www.revou.co/alumni-stories/michael-pien-william",
  "fionna benita": "https://www.revou.co/alumni-stories/fionna-benita",
  "widyah astuti": "https://www.revou.co/alumni-stories/widyah-astuti",
  "vito atmo": "https://www.revou.co/alumni-stories/bhadrika-evandito-atmomintarso-vito-atmo",
  "rezki kiki fatimah": "https://www.revou.co/alumni-stories/rezki-kiki-fatimah",
  "emir arifin": "https://www.revou.co/alumni-stories/emir-arifin",
  "rakhmat satria wicaksono": "https://www.revou.co/alumni-stories/rakhmat-satria-wicaksono",
  "andy prayitno": "https://www.revou.co/alumni-stories/andy-prayitno",
  "faiz akbar abdurrahim": "https://www.revou.co/alumni-stories/faiz-akbar-abdurrahim",
  "pingkan rarumangkay": "https://www.revou.co/alumni-stories/pingkan-rarumangkay",
  "afrianto": "https://www.revou.co/alumni-stories/afrianto",
  "inneke soetantyo": "https://www.revou.co/alumni-stories/inneke-soetantyo",
  "nadzira azzahra": "https://www.revou.co/alumni-stories/nadzira-azzahra",
  "dominika": "https://www.revou.co/alumni-stories/dominika",
  "ryan lukito": "https://www.revou.co/alumni-stories/ryan-lukito",
  "dimas arbrianto": "https://www.revou.co/alumni-stories/dimas-arbrianto",
  "soeksmono boedi": "https://www.revou.co/alumni-stories/soeksmono-boedi",
  "liliek darmawan": "https://www.revou.co/alumni-stories/liliek-darmawan"
};

function resolveAlumniStoryUrl(rawUrl, alumniName = "") {
  let url = (rawUrl || "").trim();

  // If already alumni story pattern, normalize to https://www.revou.co/alumni-stories/
  if (url.includes("revou.co/id/alumni-stories-list/") || url.includes("revou.co/alumni-stories-list/") || url.includes("revou.co/alumni-stories/")) {
    const slugMatch = url.match(/alumni-stories(?:-list)?\/([a-zA-Z0-9_-]+)/);
    if (slugMatch && slugMatch[1]) {
      return `https://www.revou.co/alumni-stories/${slugMatch[1]}`;
    }
  }

  // If match by alumni name in verified map
  if (alumniName) {
    const cleanName = alumniName.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
    for (const [key, verifiedUrl] of Object.entries(VERIFIED_ALUMNI_MAP)) {
      if (cleanName.includes(key) || key.includes(cleanName)) {
        return verifiedUrl;
      }
    }
  }

  // If general directory or fallback
  if (url.includes("revou.co/alumni") || url.includes("/alumni")) {
    return "https://www.revou.co/alumni";
  }

  // If it's a linkedin URL or invalid/placeholder, check if name matches or fallback to directory
  if (url.includes("linkedin.com") || !url.startsWith("http")) {
    if (alumniName) {
      const cleanName = alumniName.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
      for (const [key, verifiedUrl] of Object.entries(VERIFIED_ALUMNI_MAP)) {
        if (cleanName.includes(key) || key.includes(cleanName)) {
          return verifiedUrl;
        }
      }
    }
    return "https://www.revou.co/alumni";
  }

  // Ensure default revou link uses https://www.revou.co/alumni
  return url.startsWith("https://www.revou.co") ? url : "https://www.revou.co/alumni";
}

function sanitizeFeaturedAlumni(feat) {
  if (!feat || typeof feat !== "object") return null;
  const name = feat.name || "";
  const resolvedUrl = resolveAlumniStoryUrl(feat.profile_url, name);
  let summary = (feat.summary || "").replace(/https?:\/\/(?:www\.)?linkedin\.com\/[^\s)\]]+/gi, resolvedUrl);
  summary = summary.replace(/https?:\/\/(?:www\.)?revou\.co\/(?:id\/)?alumni-stories(?:-list)?\/([a-zA-Z0-9_-]+)/g, "https://www.revou.co/alumni-stories/$1");
  return {
    ...feat,
    profile_url: resolvedUrl,
    summary,
  };
}

function sanitizeAlumniMatches(matches) {
  if (!Array.isArray(matches)) return [];
  return matches.map((m) => {
    const name = m.name || "";
    const resolvedUrl = resolveAlumniStoryUrl(m.profile_url, name);
    let summary = (m.career_journey_summary || "").replace(/https?:\/\/(?:www\.)?linkedin\.com\/[^\s)\]]+/gi, resolvedUrl);
    summary = summary.replace(/https?:\/\/(?:www\.)?revou\.co\/(?:id\/)?alumni-stories(?:-list)?\/([a-zA-Z0-9_-]+)/g, "https://www.revou.co/alumni-stories/$1");
    if (!summary.includes("https://www.revou.co")) {
      summary = `${summary.trim()}\n\n[Baca Kisah Lengkap](${resolvedUrl})`;
    }
    const isExecutiveOrApplied =
      (m.program_batch && (m.program_batch.toLowerCase().includes("applied ai") || m.program_batch.toLowerCase().includes("data-driven"))) ||
      (m.name && m.name.includes("—"));
    let prevRole = m.previous_role;
    if (isExecutiveOrApplied || !prevRole || prevRole === "-" || prevRole.toLowerCase() === "tidak ada" || prevRole.toLowerCase() === "null" || prevRole === m.current_role) {
      prevRole = null;
    }
    return {
      ...m,
      previous_role: prevRole,
      industry: m.industry || null,
      profile_url: resolvedUrl,
      career_journey_summary: summary,
    };
  });
}

// ─────────────────────────────────────────────
// POST handler
// ─────────────────────────────────────────────
export async function POST(req) {
  try {
    const body = await req.json();
    const { situation, model = "gemini-3.5-flash", tab = "pitch" } = body;

    if (!situation || !situation.trim()) {
      return NextResponse.json(
        { error: "Field 'situation' tidak boleh kosong." },
        { status: 400 }
      );
    }

    const skillInstructions = loadSkillDefinition();
    const knowledgeBase = loadKnowledgeBase(tab);
    const systemPrompt = buildSystemPrompt(skillInstructions, knowledgeBase, tab);

    const fullPrompt = `${systemPrompt}

===========================================
SITUASI DARI TIM SALES (Menu Aktif: ${tab}):
"""
${situation.trim()}
"""
===========================================

Instruksi: Analisis situasi di atas, cocokkan program dan data dari knowledge base, dan hasilkan JSON valid sesuai format.`;

    // ── Try Gemini API ─────────────────────────────
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (geminiApiKey) {
      // Prioritize requested model, then fall back through resilient active models
      const candidateModels = [
        model,
        "gemini-3.5-flash-lite",
        "gemini-3.5-flash",
      ].filter((m, idx, arr) => m && arr.indexOf(m) === idx);

      let lastError = null;

      for (const modelId of candidateModels) {
        // Try up to 2 attempts per model (handles brief 503 spikes)
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            if (attempt > 0) await wait(600);

            const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${geminiApiKey}`;

            const response = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              signal: AbortSignal.timeout(12000), // 12-second abort timeout prevents 504 Gateway Timeout
              body: JSON.stringify({
                contents: [
                  {
                    role: "user",
                    parts: [{ text: fullPrompt }],
                  },
                ],
                generationConfig: {
                  responseMimeType: "application/json",
                  temperature: 0.25,
                  maxOutputTokens: 16384,
                },
              }),
            });

            if (response.ok) {
              const data = await response.json();
              const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

              if (rawText) {
                try {
                  const cleanedText = rawText
                    .replace(/^```json\s*/i, "")
                    .replace(/^```\s*/i, "")
                    .replace(/\s*```$/i, "")
                    .trim();
                  const parsed = JSON.parse(cleanedText);

                  return NextResponse.json({
                    success: true,
                    modelUsed: modelId,
                    menu: parsed.menu || tab,
                    persona: parsed.persona || "Prospective Student",
                    whats_happening: parsed.whats_happening || "",
                    recommended_approach: parsed.recommended_approach || "",
                    program_match: parsed.program_match || "",
                    ai_relevancy_statement: parsed.ai_relevancy_statement || "",
                    program_overview_short: parsed.program_overview_short || "",
                    target_audience: parsed.target_audience || "",
                    prerequisites: parsed.prerequisites || "",
                    eligibility_check: parsed.eligibility_check || "",
                    revision_summary: parsed.revision_summary || "",
                    featured_alumni_summary: sanitizeFeaturedAlumni(parsed.featured_alumni_summary),
                    alumni_matches: sanitizeAlumniMatches(parsed.alumni_matches),
                    scripts: tab === "alumni" ? [] : (Array.isArray(parsed.scripts) ? parsed.scripts : []),
                    knowledge_details: parsed.knowledge_details || null,
                  });
                } catch (parseErr) {
                  console.error("JSON parse error for model", modelId, parseErr.message, rawText?.slice(0, 300));
                }
              }
            } else {
              const errText = await response.text();
              console.warn(`Gemini API warning on ${modelId} attempt ${attempt + 1} (${response.status}):`, errText.slice(0, 150));
              lastError = `Model ${modelId} (${response.status}): ${errText.slice(0, 100)}`;
              if (response.status !== 503) break; // Don't retry non-503s on same model
            }
          } catch (apiErr) {
            console.warn(`Gemini API call exception for ${modelId}:`, apiErr.message);
            lastError = apiErr.message;
          }
        }
      }
    }

    // ── Fallback ──────────────
    return NextResponse.json({
      success: false,
      modelUsed: model || "gemini-3.5-flash",
      menu: tab,
      persona: "Tidak dapat diidentifikasi",
      whats_happening: "Koneksi ke Gemini API tidak tersedia atau API Key belum dikonfigurasi.",
      recommended_approach: "Pastikan GEMINI_API_KEY valid di .env.local dan restart server.",
      program_match: "",
      scripts: [
        {
          badge: "⚠️ Konfigurasi Diperlukan",
          text: "Pastikan GEMINI_API_KEY valid di .env.local dan restart server untuk mengaktifkan AI yang grounded pada knowledge base.",
        },
      ],
      knowledge_details: null,
    });
  } catch (error) {
    console.error("Error in /api/generate:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
