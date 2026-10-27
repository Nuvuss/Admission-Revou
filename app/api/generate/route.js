import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import {
  resolveApiKeys,
  getNextRoundRobinKey,
  recordKeyExecution,
  maskApiKey,
  getApiKeysStatus,
} from "../../../lib/apiKeyManager";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// ─────────────────────────────────────────────
// In-Memory Caching for Knowledge Base & System Prompts
// ─────────────────────────────────────────────
const rawFileCache = new Map();
const tabKnowledgeCache = new Map();
const systemPromptCache = new Map();
let cachedSkillDefinition = null;
let lastCacheCheck = 0;
const DEV_CACHE_TTL = 5000; // 5 detik di local development agar perubahan file lekas termuat

function checkCacheValidity() {
  if (process.env.NODE_ENV === "development") {
    const now = Date.now();
    if (now - lastCacheCheck > DEV_CACHE_TTL) {
      lastCacheCheck = now;
      rawFileCache.clear();
      tabKnowledgeCache.clear();
      systemPromptCache.clear();
      cachedSkillDefinition = null;
    }
  }
}

function getCachedFileContent(filePath) {
  if (rawFileCache.has(filePath)) {
    return rawFileCache.get(filePath);
  }
  const content = fs.readFileSync(filePath, "utf-8");
  rawFileCache.set(filePath, content);
  return content;
}

// ─────────────────────────────────────────────
// Smart Topic Filtering: Memetakan kata kunci ke file dokumen relevan
// ─────────────────────────────────────────────
function detectRelevantKnowledgeFiles(situation = "", tab = "pitch") {
  const text = (situation || "").toLowerCase();

  // Dokumen Inti (Core) yang selalu dimuat di tab pitch agar AI selalu punya konteks ekosistem RevoU:
  const CORE_FILES = [
    "joint_program_product_knowledge.md",
    "knowledge_base_sales_script_benchmarks_and_examples.md",
  ];

  // Khusus tab alumni: fokus ke kisah alumni
  if (tab === "alumni") {
    return [
      "knowledge_base_alumni_success_stories.md",
      "joint_program_product_knowledge.md",
    ];
  }

  // Khusus tab comparison: fokus ke battlecard & perbandingan
  if (tab === "comparison") {
    return [
      "knowledge_base_competitor_comparison.md",
      "joint_program_product_knowledge.md",
      "knowledge_base_sales_script_benchmarks_and_examples.md",
    ];
  }

  // Cek sinyal topik program spesifik dari situasi/pertanyaan leads:
  const detectedFiles = new Set(CORE_FILES);
  let matchedSpecificProgram = false;

  // 1. Digital Marketing (FSDM)
  // Keywords program & topik + Jurusan kuliah linear: Komunikasi, DKV, PR, Jurnalistik, Sastra, Perhotelan
  if (/marketing|fsdm|iklan|ads|meta ads|google ads|seo|sem|social media|sosmed|copywriting|content creator|komunikasi|ilmu komunikasi|\bdkv\b|desain komunikasi|public relation|humas|jurnalistik|sastra|perhotelan|pariwisata/i.test(text)) {
    detectedFiles.add("fsdm_digital_marketing.md");
    matchedSpecificProgram = true;
  }

  // 2. Data Analytics & Data Science (FSDA & Applied DS)
  // Keywords program & topik + Jurusan kuliah linear: Sistem Informasi, Matematika, Statistika, Teknik Industri, Fisika
  if (/data analytic|data analyst|fsda|data science|scientist|python|sql|tableau|looker|power bi|dashboard|sistem informasi|\bsi\b|matematika|statistika|teknik industri|fisika/i.test(text)) {
    detectedFiles.add("fsda_data_analytics.md");
    detectedFiles.add("knowledge_base_admission_applied_data_science_with_ai.md");
    matchedSpecificProgram = true;
  }

  // 3. Software Engineering (FSSE / Fullstack / Coding)
  // Keywords program & topik + Jurusan kuliah linear: Sistem Informasi, Teknik Informatika, Ilmu Komputer, TI, RPL
  if (/software engineer|developer|coding|programmer|fullstack|frontend|backend|fsse|react|javascript|typescript|golang|web dev|sistem informasi|teknik informatika|ilmu komputer|computer science|\bti\b|\brpl\b|rekayasa perangkat lunak/i.test(text)) {
    detectedFiles.add("knowledge_base_se_fullstack.md");
    detectedFiles.add("knowledge_base_software_engineering.md");
    matchedSpecificProgram = true;
  }

  // 4. Strategic HR with AI
  // Keywords program & topik + Jurusan kuliah linear: Psikologi, Manajemen SDM
  if (/hr|human resource|talent acquisition|recruiter|recruitment|compensation|benefit|remunerasi|payroll|psikologi|manajemen sdm/i.test(text)) {
    detectedFiles.add("knowledge_base_revou_strategic_hr_with_ai.md");
    matchedSpecificProgram = true;
  }

  // 5. Applied AI, Analytics & Automation (BINUS)
  if (/binus|applied ai|automation|otomasi|ai automation|workflow automation|no-code ai|administrasi bisnis/i.test(text)) {
    detectedFiles.add("knowledge_base_admission_applied_ai_analytics_automation_binus.md");
    detectedFiles.add("knowledge_base_syllabus_binus_ai_analytics.md");
    matchedSpecificProgram = true;
  }

  // 6. Strategic Finance (UI)
  // Keywords program & topik + Jurusan kuliah linear: Akuntansi, Keuangan, Perpajakan, Fiskal
  if (/finance|keuangan|akuntansi|accounting|tax|pajak|fpa|controller|treasury|audit|perpajakan|fiskal/i.test(text)) {
    detectedFiles.add("knowledge_base_admission_ai_strategic_finance_ui.md");
    // Jika ada indikasi fresh grad / pengangguran / cari kerja / switch ke data:
    if (/pengangguran|fresh grad|jobseeker|lulusan baru|cari kerja|switch|pindah/i.test(text)) {
      detectedFiles.add("fsda_data_analytics.md");
    }
    matchedSpecificProgram = true;
  }

  // 7. Data-Driven Decision Making for Leaders (ITB)
  if (/itb|leader|leadership|manager|kepemimpinan|decision maker|decision making|c-level|direktur|head of/i.test(text)) {
    detectedFiles.add("knowledge_base_itb_data_driven_ai_leaders.md");
    detectedFiles.add("knowledge_base_syllabus_itb_decision_making.md");
    matchedSpecificProgram = true;
  }

  // 8. Cybersecurity (BINUS)
  // Wajib ada kata kunci eksplisit keamanan / cyber / soc / pentest
  if (/cyber|security|keamanan|soc|pentest|red team|blue team|hacker|hacking/i.test(text)) {
    detectedFiles.add("knowledge_base_binus_cybersecurity.md");
    matchedSpecificProgram = true;
  }

  // 9. Medis / Kesehatan / Paramedis (Career Switcher)
  if (/bidan|kebidanan|perawat|keperawatan|farmasi|kesehatan|kedokteran|dokter/i.test(text)) {
    detectedFiles.add("fsdm_digital_marketing.md");
    detectedFiles.add("fsda_data_analytics.md");
    matchedSpecificProgram = true;
  }

  // 10. Competitor Mention (jika lead membandingkan dengan kompetitor di tab pitch)
  if (/hacktiv8|purwadhika|dibimbing|dqlab|kompetitor|bootcamp lain/i.test(text)) {
    detectedFiles.add("knowledge_base_competitor_comparison.md");
  }

  // JIKA TIDAK ADA SINYAL SPESIFIK (Input umum / eksplorasi / rekomendasi):
  // Fallback 100% aman: return null agar memuat seluruh dokumen program seperti sebelumnya
  if (!matchedSpecificProgram) {
    return null;
  }

  return Array.from(detectedFiles);
}

// ─────────────────────────────────────────────
// Load knowledge files from /knowledge/ based on tab & situation (Smart Cached)
// ─────────────────────────────────────────────
function loadKnowledgeBase(tab = "pitch", situation = "") {
  checkCacheValidity();

  const relevantFiles = detectRelevantKnowledgeFiles(situation, tab);
  const cacheKey = relevantFiles
    ? `${tab}:${relevantFiles.sort().join(",")}`
    : `${tab}:all`;

  if (tabKnowledgeCache.has(cacheKey)) {
    return tabKnowledgeCache.get(cacheKey);
  }

  const knowledgeDir = path.join(process.cwd(), "knowledge");
  let knowledgeContent = "";
  try {
    if (fs.existsSync(knowledgeDir)) {
      const allFiles = fs.readdirSync(knowledgeDir).sort();
      for (const file of allFiles) {
        if (!file.endsWith(".md") && !file.endsWith(".txt")) continue;

        // Jika terdeteksi file relevan spesifik:
        if (relevantFiles && !relevantFiles.includes(file)) {
          continue;
        }

        // Jika fallback (mode lengkap tanpa sinyal spesifik):
        if (!relevantFiles) {
          if (tab === "pitch" && file.includes("alumni_success_stories")) continue;
          if (tab === "alumni" && (
            file.includes("sales_script_benchmarks") ||
            file.includes("syllabus_binus") ||
            file.includes("syllabus_itb") ||
            file.includes("competitor_comparison")
          )) continue;
          if (tab === "comparison" && file.includes("alumni_success_stories")) continue;
        }

        const filePath = path.join(knowledgeDir, file);
        const content = getCachedFileContent(filePath);
        knowledgeContent += `\n\n=== DOKUMEN: ${file} ===\n${content}\n`;
      }
    }
  } catch (err) {
    console.error("Error reading knowledge base:", err);
  }

  tabKnowledgeCache.set(cacheKey, knowledgeContent);
  return knowledgeContent;
}

// ─────────────────────────────────────────────
// Load SKILL.md (Cached in Memory)
// ─────────────────────────────────────────────
function loadSkillDefinition() {
  checkCacheValidity();
  if (cachedSkillDefinition) {
    return cachedSkillDefinition;
  }
  const skillPath = path.join(
    process.cwd(),
    ".agents",
    "skills",
    "sales_copilot",
    "SKILL.md"
  );
  try {
    if (fs.existsSync(skillPath)) {
      cachedSkillDefinition = fs.readFileSync(skillPath, "utf-8");
      return cachedSkillDefinition;
    }
  } catch (err) {
    console.error("Error reading SKILL.md:", err);
  }
  return "";
}

// ─────────────────────────────────────────────
// Get System Prompt with Smart Topic Filtering & In-Memory Cache
// ─────────────────────────────────────────────
function getCachedSystemPrompt(tab, situation = "") {
  checkCacheValidity();

  const relevantFiles = detectRelevantKnowledgeFiles(situation, tab);
  const cacheKey = relevantFiles
    ? `${tab}:${relevantFiles.sort().join(",")}`
    : `${tab}:all`;

  if (systemPromptCache.has(cacheKey)) {
    return systemPromptCache.get(cacheKey);
  }
  const skillInstructions = loadSkillDefinition();
  const knowledgeBase = loadKnowledgeBase(tab, situation);
  const prompt = buildSystemPrompt(skillInstructions, knowledgeBase, tab);
  systemPromptCache.set(cacheKey, prompt);
  return prompt;
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


### ATURAN KETAT FILTER INDUSTRI & BIDANG (ZERO TOLERANCE SALAH INDUSTRI):
Ketika user/sales mencari alumni di INDUSTRI ATAU BIDANG TERTENTU (seperti: "Manufaktur / Manufacture", "Marketing Agency", "Automotive", "Banking", "Oil & Gas", "Chemical", "Mining", "FMCG", "Healthcare", "Government", "Construction", dll.):
1. **ZERO TOLERANCE SALAH INDUSTRI (DILARANG KERAS MENUKAR INDUSTRI):**
   - JIKA USER MEMINTA "MANUFAKTUR / MANUFACTURE":
     DILARANG KERAS memberikan profil dari industri Oil & Gas (seperti Pertamina), Mining, atau Banking!
     AI WAJIB 100% HANYA mengambil profil dari Kategori Industri "Manufacture", yaitu:
     * Pada Applied AI (Manufacture):
       - Staff — PT Karcher | Industri: Manufacture
       - Non-IT role — APP | Industri: Manufacture
       - Supervisor — PT Trias Sentosa Tbk | Industri: Manufacture
     * Pada Data-Driven Decision Making (Manufacture):
       - C-Level/VP — Gatra Mapan | Industri: Manufacture
       - C-level/VP/Head — Komatsu Remanufacturing Asia | Industri: Manufacture
   - JIKA USER MEMINTA "MARKETING AGENCY":
     AI WAJIB HANYA mengambil profil dari Kategori Industri "Marketing Agency" (seperti: Agency, Involve Asia, Shopcomm, Greenpark Digital, Lynk Media Group)!
   - JIKA USER MEMINTA "CHEMICAL":
     AI WAJIB HANYA mengambil profil dari Kategori Industri "Chemical company" (seperti: Dove Chemical, PT. Dover Chemical, Eonchemicals Putra)!
   - JIKA USER MEMINTA "OIL & GAS":
     Baru tampilkan perusahaan Oil & Gas (seperti: Pertamina, Pertamina Hulu Rokan, Pertamina Hulu Mahakam, Triyasa Pirsa Utama)!
2. **KONSISTENSI TOTAL DI 'featured_alumni_summary' & 'alumni_matches':**
   Profil utama ('featured_alumni_summary') dan daftar alumni ('alumni_matches') SELURUHNYA WAJIB berasal dari industri yang diminta! DILARANG menampilkan Pertamina/Oil & Gas di featured summary saat user meminta Manufaktur!
3. **FIELD 'industry' HARUS VALID:**
   Isi field 'industry' dengan nama industri resmi yang diminta (misal: "Manufacture"), BUKAN industri lain.

### ATURAN PEMETAAN JURUSAN KULIAH & STATUS KARIR LEADS (JOBSEEKER VS PROFESIONAL):
1. **Aturan Mutlak Jobseeker / Fresh Graduate / Pengangguran (Wajib RevoU NEXT & Program Full Stack):**
   - Jika prospect teridentifikasi sebagai **pengangguran, fresh graduate, atau sedang mencari kerja pertama**:
     * **DILARANG KERAS** merekomendasikan program joint eksekutif / short-course 3 bulan (seperti BINUS Cybersecurity, UI Strategic Finance, atau ITB) kecuali lead secara eksplisit meminta spesialisasi topik tersebut. Program 3 bulan TIDAK memiliki fasilitas pendampingan karir intensif RevoU NEXT.
     * **WAJIB** merekomendasikan program **Full Stack (FSDA, FSSE, atau FSDM selama 7 bulan)** dan **WAJIB mengangkat RevoU NEXT (Bulan 5–7)**: bimbingan 1:1 Career Coach, perombakan CV berstandar HR tech, mock interview, dan **Virtual Internship 12 minggu** (dengan real client project) sebagai jawaban atas kekhawatiran minimnya portofolio industri.
2. **Aturan Pemetaan Berdasarkan Jurusan Kuliah:**
   - **Sistem Informasi (SI), Teknik Informatika (TI), Ilmu Komputer, RPL:**
     * Latar belakang ini adalah modal emas di dunia teknologi. Jika lead belum spesifik memilih minat (misal hanya menyebut "ingin program yang relevan dengan SI"), **JANGAN menembak 1 program secara sepihak**. Jelaskan bahwa lulusan SI/TI umumnya berkembang di 2 jalur utama:
       - **Jalur Data (Full Stack Data Analytics - FSDA):** Mengolah database, SQL, dashboard visualisasi, dan analisa proses bisnis.
       - **Jalur Rekayasa Aplikasi (Full Stack Software Engineering - FSSE):** Software engineering, fullstack web development, dan arsitektur sistem aplikasi.
       Sertakan *discovery question* ramah di akhir draf untuk menanyakan kecenderungan minat mereka (apakah lebih suka analisa data bisnis atau coding/membangun sistem).
   - **Matematika, Statistika, Teknik Industri, Fisika:**
     * Sangat linear ke **Full Stack Data Analytics (FSDA)** (menghubungkan logika kuantitatif ke insight bisnis nyata).
   - **Komunikasi, DKV, PR, Jurnalistik, Sastra, Perhotelan:**
     * Sangat linear ke **Full Stack Digital Marketing (FSDM)** (kombinasi kreatif konten & analitik paid ads/SEO).
   - **Akuntansi, Manajemen Keuangan, Perpajakan:**
     * Jika Fresh Graduate / Pengangguran / Ingin Switch ke Data ➔ **Full Stack Data Analytics (FSDA)** (menonjolkan analisa finansial berbasis data/SQL).
     * Jika Profesional Aktif minimal 2 tahun di bidang keuangan/pajak ➔ **RevoU x UI AI-Enabled Strategic Finance**.
   - **Psikologi, Manajemen SDM, Hukum:**
     * Jika Praktisi / HR Officer ➔ **RevoU Strategic HR with AI**.
     * Jika Fresh Graduate / Jobseeker ➔ **FSDM** atau **FSDA**.
   - **Kesehatan & Medis (Bidan, Farmasi, Keperawatan), Keguruan, Non-IT Lainnya:**
     * Validasi bahwa RevoU ramah pemula dari nol. Tawarkan **FSDM** (bila tertarik ke media/kreatif/iklan) atau **FSDA** (bila tertarik ke ketelitian analisa data).

## ATURAN MODE & FORMAT OUTPUT KHUSUS BERDASARKAN MENU:
Menu aktif saat ini: **${tab}**

### 1. JIKA MENU: "pitch" (Create a Pitch) — ATURAN MUTLAK GENERATE PITCH:
- AI menghasilkan **3 variasi draf pesan WhatsApp persuasif** (tiap variasi wajib memakai sudut penyambungan berbeda, misal satu lewat hambatan waktu/fleksibilitas, satu lewat tujuan karier/leveling, satu lewat kasus nyata di pekerjaan/capstone).
- **ATURAN PANJANG KATA (WAJIB MINIMAL 120 KATA, RENTANG 120–300 KATA):**
  * Setiap variasi draf pesan WhatsApp **WAJIB MEMILIKI PANJANG MINIMAL 120 KATA** dengan rentang **120 sampai 300 kata**.
  * **DILARANG KERAS menghasilkan pesan yang terlalu pendek atau di bawah 120 kata!** Pastikan penjelasan empati, kurikulum/USP, dan studi kasus dielaborasi secara kaya, mendalam, dan relevan agar memenuhi standar minimal 120 kata.
- **STRUKTUR PESAN TIAP VARIASI (2 sampai 3 paragraf, mengalir alami & mendalam):**
  * **Paragraf 1 — Empati Spesifik & Validasi Profil (~35–70 kata):**
    - Buka dengan sapaan ramah: "Halo kak 😊", "Kak,", "Halo kak!", "Hai kak [Nama],", atau "Halo kak [Nama], salam kenal 😊 Aku [Nama AC] dari RevoU." (Gunakan nama hanya jika ada di data leads; jika tidak ada, sapa "Halo kak").
    - Sebut fakta nyata dari profil lead (durasi pengalaman, peran saat ini, latar belakang pendidikan, atau kondisi transisi).
    - Validasi beban, kompleksitas, atau tanggung jawabnya secara mendalam dengan kalimat apresiatif yang tulus dan hanya cocok untuk profil itu (hindari pujian klise generik).
    - Jika profil menyiratkan hal sensitif (jeda karier / career break, mengurus rumah tangga di luar negeri, banting setir, tekanan kerja berat), validasi dengan penuh hormat dan tunjukkan sisi tersebut sebagai modal/aset besar yang bernilai.
  * **Paragraf 2 — Penyambungan Profil ke USP Program, Kurikulum Konkret & Framing AI (~70–180 kata):**
    - Hubungkan eksplisit hambatan & tujuan lead ke USP program di knowledge base memakai kalimat seperti "karena kakak..." atau "jadi kakak bisa...".
    - Paparkan detail konkret dari knowledge base: nama program, minggu materi (misal W1-2), modul spesifik (misal Compensation & Benefits, regression/classification/forecasting/clustering), tools/stack industri (HTML/CSS/JS, TypeScript, Tailwind, React/Next.js, AWS), alur belajar praktikal, dan bentuk capstone project nyata berbasis real case lead.
    - **WAJIB FRAMING AI SEBAGAI FORCE MULTIPLIER:** Posisikan AI secara jelas sebagai penguat keahlian, bukan pengganti manusia: "Nah, AI itu bukan pengganti, tapi 'force multiplier' buat keahlian kakak 🚀" atau "Di era sekarang AI itu 'force multiplier', bukan pengganti: kerjaan repetitif dibantu AI, kakak fokus ke [strategi / problem solving / analisis]."
  * **Paragraf 3 — Ajakan Penutup / CTA (~15–50 kata, PILIH SATU OPSI CTA):**
    - Opsi Konsultasi Gratis / Real Case: "Tujuannya jadi profesional 'Top 1%' di bidang HR 💪 Boleh kita ngobrol singkat via konsultasi gratis, kak? Biar kita bisa bedah bareng real case kakak utk capstone nanti."
    - Opsi Bertahap: "Mau aku bantu jelasin gambaran kurikulum materinya dulu, atau langsung atur sesi konsultasi gratis kak? Siapa tau kakak bisa jadi profesional Top 1% di bidangnya ✨"
    - Opsi Tanya Menjelaskan Lebih Lanjut: "Boleh aku bantu jelaskan lebih lanjut kak tentang kurikulum dan jadwal belajarnya?"
    - Opsi Ngobrol 1:1: "Mau ngobrol santai 1:1 sama program advisor kami minggu ini? 😊"
    (Frasa aspirasional seperti "profesional Top 1% di bidangnya" boleh dipakai di 1-2 variasi saja, jangan di semua pesan).
- **GAYA BAHASA & FORMAT:**
  * Santai seperti chat WhatsApp sesama profesional, sapaan konsisten "kak".
  * Gunakan singkatan chat lazim WhatsApp: utk, yg, sdh, bgt, krn, dgn, jd, spt, lho.
  * Tepat 1 emoji per paragraf (maksimal 3 per pesan): 😊, 🚀, 💪, 🙏, ✨, 🙌.
  * JANGAN gunakan tanda pisah panjang (em dash —) dan titik koma (;).
  * Output HANYA teks isi pesan WhatsApp siap kirim, tanpa penjelasan meta tambahan.

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
- **ATURAN MUTLAK ANTI-DUPLIKASI & ROTASI CONTOH ALUMNI LAINNYA:**
  Ketika Sales meminta "contoh alumni lainnya", "ada alumni lain?", "profil lain", "siapa lagi?", atau meminta profil alternatif/tambahan:
  1. **DILARANG KERAS MENGULANG ALUMNI YANG SUDAH PERNAH DITAMPILKAN:** AI TIDAK BOLEH memunculkan kembali nama atau profil alumni yang sudah pernah disajikan pada respons awal maupun riwayat percakapan sebelumnya.
  2. **WAJIB AMBIL PROFIL BARU DAN BERBEDA DARI KNOWLEDGE BASE:** AI WAJIB menggali database knowledge base untuk menyajikan profil alumni BARU dan BERBEDA yang tetap relevan dengan kriteria (program, industri, latar belakang karir, atau gaji).
  3. **VARIASI SEGAR:** Seluruh entri di 'alumni_matches' dan 'featured_alumni_summary' WAJIB menampilkan figur baru yang belum pernah disebut di giliran sebelumnya.
  4. **PENEGASAN DI 'revision_summary':** Tuliskan secara eksplisit dalam 2-3 kalimat bahwa kamu menyajikan contoh profil alumni baru yang berbeda dari yang sudah ditampilkan untuk memperkaya referensi social proof bagi tim Sales.
- **Wajib Sertakan Hyperlink Perjalanan Karir Selengkapnya:**
  Setiap alumni story WAJIB menyertakan hyperlink aktif ke cerita lengkap mereka (Markdown format: [Baca Kisah Lengkap](https://www.revou.co/alumni-stories/<slug>) atau link direktori resmi [Direktori Alumni RevoU](https://www.revou.co/alumni)) agar para tim admission dapat memvalidasi dan memastikannya. DILARANG menyertakan link LinkedIn.

### 3. JIKA MENU: "comparison" (Comparison Table & Competitor Battlecards) — ATURAN MUTLAK (NOTES FOR PITA):
- **Tujuan:** Membantu tim Admission Counselor (AC) menjawab perbandingan program dan keberatan (*objections*) terkait kompetitor (Hacktiv8, Purwadhika, Dibimbing, IT Lab, dll) secara profesional, elegan, dan berbasis data verified.
- **SHARED ANSWER PATTERN UNTUK AC (NOTES FOR PITA) — WAJIB DIIKUTI:**
  1. **Tanya Apa yang Menarik (Discovery & Validation):** Mulai pesan dengan menanyakan apa hal spesifik yang membuat lead tertarik dengan kompetitor tersebut (*"Apa yang bikin tertarik sama [X]?"*).
  2. **Bandingkan HANYA pada Poin Tersebut:** Jangan membombardir dengan seluruh isi brosur. Fokuskan perbandingan secara objektif pada hal yang dipertimbangkan lead (misal: harga/cicilan, jadwal kelas malam, portofolio nyata, atau jaminan kerja).
  3. **Dukung dengan 1 Bukti Nyata (One Concrete Proof Point):** Sertakan minimal 1 bukti terverifikasi (Kredensial resmi ITB/BINUS/UI, rentang kenaikan gaji alumni up to 120%, atau portofolio riil 3 bulan RevoU Labs).
  4. **Dua Pantangan Mutlak:**
     - ❌ **DILARANG KERAS MENJELEKKAN ATAU MENGKRITISI KOMPETITOR (Never criticise the competitor).** Akui kelebihan mereka secara jujur. Sikap elegan dan profesional meningkatkan respek leads kepada RevoU.
     - ❌ **DILARANG KERAS MENJAWAB "I need to check" / "Saya cek dulu".** Seluruh data perbandingan sudah disiapkan di battlecards.
- **Variasi Pesan WhatsApp (scripts):**
  Buat 3 variasi pesan WhatsApp siap kirim (120–250 kata per variasi):
  - Variasi 1 — Nada Santai & Empatik (Casual WhatsApp)
  - Variasi 2 — Nada Konsultatif Profesional (Professional Consultative)
  - Variasi 3 — Perbandingan Nilai Langsung & Bukti (Direct Value & Proof Point)
  Semua variasi WAJIB mengikuti 4 shared answer pattern di atas dan diakhiri pertanyaan santai (low-pressure question).
- **Competitor Analysis Object ("competitor_analysis"):**
  Wajib mengisi objek "competitor_analysis" secara terstruktur sesuai data knowledge base.

## ATURAN PANJANG RESPONS (WAJIB DIIKUTI)
- Pada menu "pitch" & "comparison": Tiap draf variasi pesan WhatsApp di "scripts" WAJIB MINIMAL 120 KATA (rentang 120–300 KATA). DILARANG KERAS di bawah 120 kata.
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
  "competitor_analysis": {
    "competitor_name": "Hacktiv8 | Purwadhika | Dibimbing | IT Lab | Umum",
    "attraction_point": "Poin spesifik yang menarik perhatian lead",
    "honest_competitor_strength": "1 kalimat jujur & objektif mengenai apa yang kompetitor lakukan lebih baik",
    "where_revou_wins": "Di mana keunggulan mutlak RevoU pada konteks tersebut",
    "one_proof_point": "1 bukti konkret (kredensial ITB/BINUS, kenaikan gaji s.d 120%, atau RevoU Labs)"
  },
  "featured_alumni_summary": {
    "name": "Nama salah satu alumni yang paling relevan (PERHATIAN: Untuk program Applied AI & Data-Driven Decision Making, TIDAK ADA nama orang di data, isi format '[Job Title] — [Perusahaan]', DILARANG mengarang nama orang!)",
    "summary": "Ringkasan singkat (3-5 kalimat) tentang peran dan relevansi program bagi posisi dan industri tersebut (WAJIB 100% SESUAI DENGAN INDUSTRI YANG DICARI USER; jika user minta Manufaktur, WAJIB profil Manufaktur seperti Komatsu / Karcher / Trias Sentosa / Gatra Mapan, DILARANG menampilkan Oil & Gas / Pertamina!)",
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
    { "badge": "Variasi 1 — [Nama angle]", "text": "Pesan WA siap kirim (WAJIB MINIMAL 120 KATA, rentang 120-300 kata, HANYA untuk menu pitch & comparison, KOSONGKAN [] jika menu alumni)" },
    { "badge": "Variasi 2 — [Nama angle]", "text": "Pesan WA siap kirim (WAJIB MINIMAL 120 KATA, rentang 120-300 kata, HANYA untuk menu pitch & comparison, KOSONGKAN [] jika menu alumni)" },
    { "badge": "Variasi 3 — [Nama angle]", "text": "Pesan WA siap kirim (WAJIB MINIMAL 120 KATA, rentang 120-300 kata, HANYA untuk menu pitch & comparison, KOSONGKAN [] jika menu alumni)" }
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
  "paolo hernandez": "https://www.revou.co/alumni-stories/paolo-m-hernandez",
  "paolo": "https://www.revou.co/alumni-stories/paolo-m-hernandez",
  "prasakti tenri fanyiwi": "https://www.revou.co/alumni-stories/prasakti-tenri-fanyiwi",
  "tenri": "https://www.revou.co/alumni-stories/prasakti-tenri-fanyiwi",
  "jasmin arumsari": "https://www.revou.co/alumni-stories/jasmin-arie",
  "jasmin arie": "https://www.revou.co/alumni-stories/jasmin-arie",
  "jasmin": "https://www.revou.co/alumni-stories/jasmin-arie",
  "ahmad dzaky musthofa": "https://www.revou.co/alumni-stories/ahmad-dzaky-musthofa",
  "ahmad dzaky": "https://www.revou.co/alumni-stories/ahmad-dzaky-musthofa",
  "dzaky": "https://www.revou.co/alumni-stories/ahmad-dzaky-musthofa",
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
    // 1. Direct or substring matching
    for (const [key, verifiedUrl] of Object.entries(VERIFIED_ALUMNI_MAP)) {
      if (cleanName.includes(key) || key.includes(cleanName)) {
        return verifiedUrl;
      }
    }
    // 2. Token-based matching (handles middle initials e.g. "paolo hernandez" vs "paolo m hernandez")
    const cleanTokens = cleanName.split(/\s+/).filter((w) => w.length > 2);
    if (cleanTokens.length > 0) {
      for (const [key, verifiedUrl] of Object.entries(VERIFIED_ALUMNI_MAP)) {
        const keyTokens = key.split(/\s+/).filter((w) => w.length > 2);
        if (keyTokens.length > 0) {
          const allCleanInKey = cleanTokens.every((t) => keyTokens.includes(t));
          const allKeyInClean = keyTokens.every((t) => cleanTokens.includes(t));
          if (allCleanInKey || allKeyInClean) {
            return verifiedUrl;
          }
        }
      }
    }
  }

  // If general directory or fallback
  if (url.includes("revou.co/alumni") || url.includes("/alumni")) {
    return "https://www.revou.co/alumni";
  }

  // If it's a linkedin URL or invalid/placeholder, fallback to directory
  if (url.includes("linkedin.com") || !url.startsWith("http")) {
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
  if (resolvedUrl.includes("/alumni-stories/")) {
    summary = summary.replace(/\(https?:\/\/(?:www\.)?revou\.co\/alumni\/?\)/g, `(${resolvedUrl})`);
  }
  return {
    ...feat,
    profile_url: resolvedUrl,
    summary,
  };
}

function sanitizeAlumniMatches(matches) {
  if (!Array.isArray(matches)) return [];
  const seenNames = new Set();
  const uniqueMatches = [];

  for (const m of matches) {
    const rawName = (m?.name || "").trim();
    const normalizedName = rawName.toLowerCase();
    if (normalizedName && seenNames.has(normalizedName)) {
      continue; // Skip duplicate alumni within same response
    }
    if (normalizedName) {
      seenNames.add(normalizedName);
    }

    const resolvedUrl = resolveAlumniStoryUrl(m.profile_url, rawName);
    let summary = (m.career_journey_summary || "").replace(/https?:\/\/(?:www\.)?linkedin\.com\/[^\s)\]]+/gi, resolvedUrl);
    summary = summary.replace(/https?:\/\/(?:www\.)?revou\.co\/(?:id\/)?alumni-stories(?:-list)?\/([a-zA-Z0-9_-]+)/g, "https://www.revou.co/alumni-stories/$1");
    if (resolvedUrl.includes("/alumni-stories/")) {
      summary = summary.replace(/\(https?:\/\/(?:www\.)?revou\.co\/alumni\/?\)/g, `(${resolvedUrl})`);
    }
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
    uniqueMatches.push({
      ...m,
      previous_role: prevRole,
      industry: m.industry || null,
      profile_url: resolvedUrl,
      career_journey_summary: summary,
    });
  }

  return uniqueMatches;
}

// ─────────────────────────────────────────────
// POST handler
// ─────────────────────────────────────────────
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      situation,
      model = "gemini-3.5-flash",
      tab = "pitch",
      excluded_alumni = [],
      customKeys = null,
    } = body;

    if (!situation || !situation.trim()) {
      return NextResponse.json(
        { error: "Field 'situation' tidak boleh kosong." },
        { status: 400 }
      );
    }

    const systemPrompt = getCachedSystemPrompt(tab, situation);

    let exclusionDirective = "";
    if (Array.isArray(excluded_alumni) && excluded_alumni.length > 0) {
      exclusionDirective = `\n\n===========================================
DAFTAR ALUMNI YANG SUDAH PERNAH DITAMPILKAN SEBELUMNYA (DILARANG DIMUNCULKAN LAGI):
${excluded_alumni.map((name) => `- ${name}`).join("\n")}

PERINGATAN SANGAT PENTING (ZERO DUPLICATE / MANDATORY FRESH PROFILES):
Jika tim Sales meminta contoh alumni lainnya / berbeda / baru: DILARANG KERAS memunculkan kembali nama-nama alumni di atas!
Kamu WAJIB memilih profil alumni BARU dan BERBEDA dari database knowledge base!
===========================================`;
    }

    const fullPrompt = `${systemPrompt}

===========================================
SITUASI DARI TIM SALES (Menu Aktif: ${tab}):
"""
${situation.trim()}
"""
===========================================${exclusionDirective}

Instruksi: Analisis situasi di atas, cocokkan program dan data dari knowledge base, dan hasilkan JSON valid sesuai format.`;

    // ── Round Robin API Key Management ─────────────
    const availableKeys = resolveApiKeys(customKeys);

    if (availableKeys.length > 0) {
      // Dapatkan key urutan Round Robin saat ini
      const primaryKeyInfo = getNextRoundRobinKey(customKeys);
      const startIndex = (primaryKeyInfo.index - 1 + availableKeys.length) % availableKeys.length;

      // Susun urutan percobaan key (mulai dari giliran Round Robin, melingkar ke key lainnya jika kuota habis)
      const keyQueue = [];
      for (let i = 0; i < availableKeys.length; i++) {
        const idx = (startIndex + i) % availableKeys.length;
        keyQueue.push({
          key: availableKeys[idx],
          keyIndex: idx + 1,
          masked: maskApiKey(availableKeys[idx]),
          isInitialTurn: i === 0,
        });
      }

      const quotaNotifications = [];
      let lastError = null;

      // Coba setiap key dalam antrian Round Robin jika terjadi rate-limit (429)
      for (let keyAttempt = 0; keyAttempt < keyQueue.length; keyAttempt++) {
        const currentCandidate = keyQueue[keyAttempt];
        const nextCandidate = keyQueue[keyAttempt + 1] || null;

        // Prioritize fast, stable, and available models
        const candidateModels = [
          model || "gemini-3.5-flash",
          "gemini-3.5-flash",
          "gemini-3.5-flash-lite",
          "gemini-3.6-flash",
        ].filter((m, idx, arr) => m && arr.indexOf(m) === idx);

        let keyEncounteredQuota = false;
        let keyEncounteredInvalid = false;

        for (const modelId of candidateModels) {
          if (keyEncounteredQuota || keyEncounteredInvalid) break;

          try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${currentCandidate.key}`;

            const response = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              signal: AbortSignal.timeout(35000), // 35s timeout ensures complete response without stalling
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
                  maxOutputTokens: 4096, // Optimal size: fast generation without exceeding Vercel timeout
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

                  // Catat keberhasilan penggunaan key ini
                  recordKeyExecution(currentCandidate.key, currentCandidate.keyIndex, "success", 200);

                  return NextResponse.json({
                    success: true,
                    modelUsed: modelId,
                    apiKeyInfo: {
                      activeKeyIndex: currentCandidate.keyIndex,
                      totalKeys: availableKeys.length,
                      wasRotatedDueToQuota: !currentCandidate.isInitialTurn,
                      quotaNotifications: quotaNotifications,
                      poolStatus: getApiKeysStatus(customKeys),
                    },
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
                    competitor_analysis: parsed.competitor_analysis || null,
                    featured_alumni_summary: sanitizeFeaturedAlumni(parsed.featured_alumni_summary),
                    alumni_matches: sanitizeAlumniMatches(parsed.alumni_matches),
                    scripts: tab === "alumni" ? [] : (Array.isArray(parsed.scripts) ? parsed.scripts : []),
                    knowledge_details: parsed.knowledge_details || null,
                  });
                } catch (parseErr) {
                  console.error("JSON parse error for model", modelId, parseErr.message, rawText?.slice(0, 300));
                }
              }
            } else if (response.status === 429) {
              // Rate limit / Quota exceeded terdeteksi pada key ini!
              const errText = await response.text();
              console.warn(`[RoundRobin] Key #${currentCandidate.keyIndex} hit 429 quota:`, errText.slice(0, 120));

              recordKeyExecution(currentCandidate.key, currentCandidate.keyIndex, "rate_limited", 429, "Rate limit terlampaui");

              const rotationMsg = nextCandidate
                ? `API ${currentCandidate.keyIndex} mencapai limit kuota (429 Rate Limit). Otomatis dialihkan ke API ${nextCandidate.keyIndex} via Round Robin.`
                : `API ${currentCandidate.keyIndex} mencapai limit kuota (429 Rate Limit).`;
              quotaNotifications.push(rotationMsg);

              keyEncounteredQuota = true;
              break; // Segera keluar dari loop model untuk pindah ke key berikutnya!
            } else if (response.status === 400 || response.status === 403) {
              // Key tidak valid atau dinonaktifkan
              const errText = await response.text();
              console.warn(`[RoundRobin] Key #${currentCandidate.keyIndex} invalid (${response.status}):`, errText.slice(0, 120));

              recordKeyExecution(currentCandidate.key, currentCandidate.keyIndex, "invalid", response.status, "API tidak valid");

              const rotationMsg = nextCandidate
                ? `API ${currentCandidate.keyIndex} tidak valid (${response.status}). Otomatis dialihkan ke API ${nextCandidate.keyIndex} via Round Robin.`
                : `API ${currentCandidate.keyIndex} tidak valid (${response.status}).`;
              quotaNotifications.push(rotationMsg);

              keyEncounteredInvalid = true;
              break; // Keluar untuk mencoba key berikutnya
            } else if (response.status === 503) {
              const errText = await response.text();
              console.warn(`[Gemini 503 Spike] Model ${modelId} sedang high-demand:`, errText.slice(0, 120));
              lastError = `Model ${modelId} mengalami lonjakan trafik (503 Service Unavailable).`;
              continue; // Otomatis coba candidate model berikutnya
            } else {
              const errText = await response.text();
              console.warn(`Gemini API warning on ${modelId} (${response.status}):`, errText.slice(0, 150));
              lastError = `Model ${modelId} (${response.status}): ${errText.slice(0, 100)}`;
            }
          } catch (apiErr) {
            console.warn(`Gemini API call exception for ${modelId}:`, apiErr.message);
            lastError = apiErr.message;
            continue;
          }
        }
      }

      // Jika semua key telah dicoba dan semuanya gagal (misal seluruh 5 key kuotanya habis)
      if (quotaNotifications.length > 0) {
        return NextResponse.json({
          success: false,
          modelUsed: model || "gemini-3.5-flash",
          menu: tab,
          quotaExhausted: true,
          apiKeyInfo: {
            totalKeys: availableKeys.length,
            quotaNotifications: quotaNotifications,
            poolStatus: getApiKeysStatus(customKeys),
          },
          persona: "Semua Kuota API Habis",
          whats_happening: `Seluruh (${availableKeys.length}) API Key saat ini telah mencapai limit kuota (HTTP 429) atau sedang cooldown.`,
          recommended_approach: "Silakan tunggu 1-2 menit agar batas kuota per menit mereda, atau tambahkan API Key baru pada panel Manajemen API Key.",
          program_match: "",
          scripts: [
            {
              badge: "⚠️ Pemberitahuan Kuota API",
              text: `Semua API Key dalam pool Round Robin telah mencapai batas laju (Rate Limit). Riwayat rotasi:\n${quotaNotifications.map((n) => `• ${n}`).join("\n")}`,
            },
          ],
          knowledge_details: null,
        });
      }
    }

    // ── Fallback ──────────────
    const hasKeys = availableKeys && availableKeys.length > 0;
    return NextResponse.json({
      success: false,
      modelUsed: model || "gemini-3.5-flash",
      menu: tab,
      persona: hasKeys ? "Gangguan Server Google Gemini" : "Konfigurasi Diperlukan",
      whats_happening: hasKeys
        ? `API Key (${availableKeys.length} key) terkonfigurasi dengan baik, namun Google AI Studio saat ini sedang mengalami lonjakan beban atau timeout: ${lastError || "503 Service Unavailable"}.`
        : "Koneksi ke Gemini API tidak tersedia atau API Key belum dikonfigurasi.",
      recommended_approach: hasKeys
        ? "Coba klik tombol 'Generate Jawaban' lagi (sistem akan merotasi ke key berikutnya) atau pilih model Gemini 3.5 Flash."
        : "Pastikan minimal 1 hingga 5 GEMINI_API_KEY valid di .env.local atau diisi di panel Manajemen API Key.",
      program_match: "",
      scripts: [
        {
          badge: hasKeys ? "⚠️ Gangguan Sementara Google" : "⚠️ Konfigurasi Diperlukan",
          text: hasKeys
            ? `Google AI Studio sedang mengalami lonjakan antrean server (${lastError || "503 Demand Spike"}). Sistem Round Robin siap merotasi key. Silakan klik Generate ulang.`
            : "Pastikan minimal 1 sampai 5 GEMINI_API_KEY valid di .env.local atau di panel Manajemen API Key untuk mengaktifkan AI.",
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
