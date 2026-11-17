import fs from "fs";
import path from "path";

const rootDir = process.cwd();
const sourceFile = path.join(rootDir, "knowledge", "knowledge_base_alumni_success_stories.md");
const outDir = path.join(rootDir, "knowledge", "alumni_split");

if (!fs.existsSync(sourceFile)) {
  console.error(`Source file not found: ${sourceFile}`);
  process.exit(1);
}

const content = fs.readFileSync(sourceFile, "utf-8");

// Section boundaries
const sec1Start = content.indexOf("## 1. Ringkasan Statistik");
const sec2Start = content.indexOf("## 2. Alumni Profile: Applied AI");
const sec3Start = content.indexOf("## 3. Alumni Profile: Data-Driven Decision Making");
const sec4Start = content.indexOf("## 4. Alumni Profile: Full Stack Data Analytics");
const sec5Start = content.indexOf("## 5. Alumni Profile: Full Stack Digital Marketing");
const sec6Start = content.indexOf("## 6. Panduan Penggunaan Social Proof");
const sec7Start = content.indexOf("## 7. Direktori Lengkap Kisah Sukses");
const sec71Start = content.indexOf("### 7.1. Full Stack Digital Marketing");
const sec72Start = content.indexOf("### 7.2. Full Stack Data Analytics");
const sec73Start = content.indexOf("### 7.3. Full Stack Software Engineering");
const sec74Start = content.indexOf("### 7.4. Product Management");
const sec75Start = content.indexOf("### 7.5. AI Academy");
const sec8Start = content.indexOf("## 8. Profil Mendalam");

fs.mkdirSync(outDir, { recursive: true });

// 1. Common rules: Header + Section 1 + Section 6
const commonRules = `${content.slice(0, sec2Start).trim()}

---

${content.slice(sec6Start, sec7Start).trim()}
`;
fs.writeFileSync(path.join(outDir, "alumni_common_rules.md"), commonRules, "utf-8");

// 2. Binus Applied AI (Section 2)
const binusContent = content.slice(sec2Start, sec3Start).trim();
fs.writeFileSync(path.join(outDir, "alumni_binus_applied_ai.md"), binusContent, "utf-8");

// 3. ITB Data-Driven Decision Making (Section 3)
const itbContent = content.slice(sec3Start, sec4Start).trim();
fs.writeFileSync(path.join(outDir, "alumni_itb_decision_making.md"), itbContent, "utf-8");

// 4. FSDA (Section 4 + Section 7.2)
const fsdaSummary = content.slice(sec4Start, sec5Start).trim();
const fsdaDirectory = content.slice(sec72Start, sec73Start).trim();
const fsdaContent = `${fsdaSummary}\n\n---\n\n${fsdaDirectory}`;
fs.writeFileSync(path.join(outDir, "alumni_fsda.md"), fsdaContent, "utf-8");

// 5. FSDM (Section 5 + Section 7.1 + Section 8.1)
const fsdmSummary = content.slice(sec5Start, sec6Start).trim();
const fsdmDirectory = content.slice(sec71Start, sec72Start).trim();
const fsdmCaseStudies = content.slice(sec8Start).trim();
const fsdmContent = `${fsdmSummary}\n\n---\n\n${fsdmDirectory}\n\n---\n\n${fsdmCaseStudies}`;
fs.writeFileSync(path.join(outDir, "alumni_fsdm.md"), fsdmContent, "utf-8");

// 6. FSSE (Section 7.3)
const fsseContent = content.slice(sec73Start, sec74Start).trim();
fs.writeFileSync(path.join(outDir, "alumni_fsse.md"), fsseContent, "utf-8");

// 7. PM & Others (Section 7.4 + 7.5 + 7.6 + 7.7)
const pmContent = content.slice(sec74Start, sec8Start).trim();
fs.writeFileSync(path.join(outDir, "alumni_pm_other.md"), pmContent, "utf-8");

// 8. Build structured catalog of stories for deterministic filtering & top-5 selection
const catalog = [];
let storyCounter = 0;

function parseStories(textSection, programKey) {
  const storyBlocks = textSection.split(/\n(?=- \[\*\*)/);
  for (const block of storyBlocks) {
    const trimmed = block.trim();
    if (!trimmed.startsWith("- [**")) continue;
    const nameMatch = trimmed.match(/- \[\*\*([^*]+)\*\*\]\(([^)]+)\)/);
    const name = nameMatch ? nameMatch[1].trim() : "";
    const url = nameMatch ? nameMatch[2].trim() : "";

    const progMatch = trimmed.match(/\*\*Program:\*\*\s*([^\n]+)/i);
    const program = progMatch ? progMatch[1].trim() : programKey;

    const careerMatch = trimmed.match(/\*\*Tipe Karir:\*\*\s*([^\n]+)/i);
    const careerType = careerMatch ? careerMatch[1].trim() : "";

    const summaryMatch = trimmed.match(/\*\*Ringkasan:\*\*\s*([^\n]+)/i);
    const summary = summaryMatch ? summaryMatch[1].trim() : "";

    // Industry can be in careerType, summary, or text
    let industry = "";
    const indMatch = trimmed.match(/industri:\s*([^|\n*]+)/i);
    if (indMatch) {
      industry = indMatch[1].trim();
    } else {
      // detect common industries
      const textLower = trimmed.toLowerCase();
      if (/medis|kesehatan|bidan|apoteker|paramedis/.test(textLower)) industry = "Medical / Healthcare";
      else if (/fmcg/.test(textLower)) industry = "FMCG";
      else if (/agensi|agency|marketing agency/.test(textLower)) industry = "Marketing Agency";
      else if (/otomotif|automotive/.test(textLower)) industry = "Automotive";
      else if (/manufaktur|manufacture/.test(textLower)) industry = "Manufacture";
      else if (/bank|banking|keuangan|finance/.test(textLower)) industry = "Banking & Financial Services";
      else if (/mining|tambang/.test(textLower)) industry = "Mining";
      else if (/oil|gas|pertamina/.test(textLower)) industry = "Oil & Gas";
      else if (/retail|jewellery/.test(textLower)) industry = "Retail";
      else if (/telekomunikasi|telkomsel/.test(textLower)) industry = "Telecommunications";
      else if (/media|jurnalistik/.test(textLower)) industry = "Media";
    }

    catalog.push({
      id: `story-${++storyCounter}`,
      program: programKey,
      name,
      url,
      careerType,
      industry,
      summary,
      text: trimmed,
      sourceIndex: storyCounter,
    });
  }
}

parseStories(fsdmDirectory, "fsdm");
parseStories(fsdaDirectory, "fsda");
parseStories(fsseContent, "fsse");
parseStories(pmContent, "pm");

// Parse Binus & ITB corporate profile bullet entries
function parseCorporate(sectionText, programKey) {
  const lines = sectionText.split("\n");
  let curIndustry = "General";
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("### Kategori Industri:")) {
      curIndustry = trimmed.replace("### Kategori Industri:", "").trim();
      continue;
    }
    if (trimmed.startsWith("- **")) {
      const match = trimmed.match(/^- \*\*([^*]+)\*\*\s*—\s*([^|]+)(?:\|\s*\*Industri:\s*([^*]+)\*)?/i);
      if (match) {
        const role = match[1].trim();
        const company = match[2].trim();
        const industry = match[3] ? match[3].trim() : curIndustry;
        const name = `${role} — ${company}`;
        catalog.push({
          id: `corp-${++storyCounter}`,
          program: programKey,
          name,
          role,
          company,
          industry,
          careerType: "Corporate Upskilling / Professional",
          summary: `Sebagai ${role} di ${company} pada industri ${industry}.`,
          text: trimmed,
          sourceIndex: storyCounter,
        });
      }
    }
  }
}

parseCorporate(binusContent, "binus");
parseCorporate(itbContent, "itb");

fs.writeFileSync(path.join(outDir, "catalog.json"), JSON.stringify(catalog, null, 2), "utf-8");

// 9. Default Showcase (5 Flagship Verbatim Stories)
// Find verbatim snippets from original file
const jasminSnippet = catalog.find((s) => (s.name || "").includes("Jasmin Arumsari"))?.text || "";
const donySnippet = catalog.find((s) => (s.name || "").includes("Dony Putra Perkasa"))?.text || "";
const paoloSnippet = catalog.find((s) => (s.name || "").includes("Paolo M Hernandez"))?.text || "";
const hondaSnippet = catalog.find((s) => (s.company || "").includes("PT Honda Prospect Motor"))?.text || "";
const pertaminaSnippet = catalog.find((s) => (s.company || "").includes("PT Pertamina (Persero)"))?.text || "";

const defaultShowcase = `# Alumni Flagship Showcase (Curated Default Set)

${jasminSnippet}

---

${donySnippet}

---

${paoloSnippet}

---

${hondaSnippet}

---

${pertaminaSnippet}
`;

// VERBATIM VERIFICATION: Ensure every snippet exists 100% in content
for (const [label, snippet] of [
  ["Jasmin Arumsari", jasminSnippet],
  ["Dony Putra Perkasa", donySnippet],
  ["Paolo M Hernandez", paoloSnippet],
  ["Honda Prospect Motor", hondaSnippet],
  ["Pertamina", pertaminaSnippet],
]) {
  if (!snippet || !content.includes(snippet)) {
    console.error(`VERBATIM ERROR: ${label} is not identical to source content!`);
    process.exit(1);
  }
}

fs.writeFileSync(path.join(outDir, "alumni_default_showcase.md"), defaultShowcase, "utf-8");

console.log(`Successfully split alumni stories! Total catalog items: ${catalog.length}`);
console.log(`Verbatim verification passed: All 5 showcase stories are 100% identical to source!`);
