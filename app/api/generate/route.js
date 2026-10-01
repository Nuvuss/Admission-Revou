import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

// ─────────────────────────────────────────────
// Load all knowledge files from /knowledge/
// ─────────────────────────────────────────────
function loadKnowledgeBase() {
  const knowledgeDir = path.join(process.cwd(), "knowledge");
  let knowledgeContent = "";
  try {
    if (fs.existsSync(knowledgeDir)) {
      const files = fs.readdirSync(knowledgeDir).sort();
      for (const file of files) {
        if (file.endsWith(".md") || file.endsWith(".txt")) {
          const filePath = path.join(knowledgeDir, file);
          const content = fs.readFileSync(filePath, "utf-8");
          knowledgeContent += `\n\n=== DOKUMEN: ${file} ===\n${content}\n`;
        }
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

## ATURAN STATEMENT RELEVANSI SKILL AI & PENJELASAN SINGKAT PROGRAM (WAJIB DIIKUTI)
Sebelum atau saat menyusun script jawaban, AI WAJIB menyertakan:
1. **Pernyataan Relevansi Skill AI (ai_relevancy_statement):** Hubungkan secara spesifik dan natural bagaimana skill AI relevan & menjadi nilai tambah / force multiplier untuk bidang kerja / latar belakang prospect (misal: HR -> efisiensi reporting & data repetitif; Marketing -> scale-up ads & analytics; Leader/Consultant -> analisa proyek, risiko, & data-driven decisions; Fresh Grad -> skill pembeda di job market & portofolio nyata).
2. **Penjelasan Singkat Program Terpilih (program_overview_short):** Berikan ringkasan padat dan menarik mengenai program yang ditentukan dari knowledge base (durasi minggu/bulan, kolaborasi universitas/sertifikat resmi, tahapan belajar praktikal, dan capstone project untuk portofolio).
3. **Penyisipan dalam Script WhatsApp:** Di dalam variasi script pesan WhatsApp (\`scripts\`), sertakan secara natural statement relevansi bidang dan intisari program tersebut dengan bahasa yang santai dan CTA low-pressure.

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

## ATURAN PANJANG RESPONS (WAJIB DIIKUTI)
- Setiap variasi pesan WhatsApp: MAKSIMAL 4–5 kalimat pendek. BUKAN paragraf panjang.
- Gunakan maksimal 2 emoji per pesan WhatsApp.
- Kolom "whats_happening": Maksimal 2 kalimat ringkas.
- Kolom "recommended_approach": Maksimal 2 kalimat ringkas.
- Jangan menambahkan penjelasan di luar struktur JSON.

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
  "program_overview_short": "Penjelasan singkat program terpilih dari knowledge base (durasi, partner resmi/sertifikat, proses praktikal, capstone project) (2-3 kalimat)",
  "target_audience": "Target audiens resmi program sesuai dokumen knowledge base",
  "prerequisites": "Syarat & prasyarat masuk program sesuai dokumen knowledge base",
  "eligibility_check": "Penilaian kesiapan/kelayakan prospect terhadap prasyarat (max 2 kalimat)",
  "whats_happening": "Interpretasi underlying concern (max 2 kalimat)",
  "recommended_approach": "Saran pendekatan tim sales (max 2 kalimat)",
  "revision_summary": "Jika ada instruksi revisi/klarifikasi dari Sales, jelaskan secara cerdas & natural dalam 2-3 kalimat bagaimana draf dan strategi disesuaikan khusus untuk permintaan tersebut.",
  "scripts": [
    { "badge": "Variasi 1 — [Nama angle]", "text": "Pesan WA max 4-5 kalimat (menyertakan relevansi AI & gambaran program)" },
    { "badge": "Variasi 2 — [Nama angle]", "text": "Pesan WA max 4-5 kalimat" },
    { "badge": "Variasi 3 — [Nama angle]", "text": "Pesan WA max 4-5 kalimat" }
  ],
  "knowledge_details": {
    "summary": "Ringkasan fakta relevan dari knowledge base (max 2 kalimat)",
    "points": [{ "fact": "Fakta spesifik", "source": "Nama file — Bagian" }],
    "flags": "Catatan jika data tidak lengkap (atau: Data konsisten)",
    "sales_messaging_tip": "Tips singkat untuk tim sales (1 kalimat)"
  }
}
`.trim();
}

// Helper to delay
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ─────────────────────────────────────────────
// POST handler
// ─────────────────────────────────────────────
export async function POST(req) {
  try {
    const body = await req.json();
    const { situation, model = "gemini-3.5-flash-lite", tab = "objection" } = body;

    if (!situation || !situation.trim()) {
      return NextResponse.json(
        { error: "Field 'situation' tidak boleh kosong." },
        { status: 400 }
      );
    }

    const skillInstructions = loadSkillDefinition();
    const knowledgeBase = loadKnowledgeBase();
    const systemPrompt = buildSystemPrompt(skillInstructions, knowledgeBase, tab);

    const fullPrompt = `${systemPrompt}

===========================================
SITUASI DARI TIM SALES (Menu Aktif: ${tab}):
"""
${situation.trim()}
"""
===========================================

Instruksi: Analisis situasi di atas, cocokkan program dari knowledge base, dan hasilkan JSON valid sesuai format.`;

    // ── Try Gemini API ─────────────────────────────
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (geminiApiKey) {
      // Prioritize requested model, then fall back through resilient list
      const candidateModels = [
        model,
        "gemini-3.5-flash-lite",
        "gemini-3.5-flash",
        "gemini-3.6-flash",
        "gemini-3.7-flash",
      ].filter((m, idx, arr) => m && arr.indexOf(m) === idx);

      let lastError = null;

      for (const modelId of candidateModels) {
        // Try up to 2 attempts per model (handles brief 503 spikes)
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            if (attempt > 0) await wait(800);

            const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${geminiApiKey}`;

            const response = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
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
                  maxOutputTokens: 2048,
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
                    scripts: Array.isArray(parsed.scripts) ? parsed.scripts : [],
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
      modelUsed: model || "gemini-3.5-flash-lite",
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
