import fs from "fs";
import path from "path";

const rootDir = process.cwd();
const masterFile = path.join(rootDir, "knowledge", "faq_master.md");
const outDir = path.join(rootDir, "knowledge", "FAQ");

if (!fs.existsSync(masterFile)) {
  console.error(`Master FAQ file not found: ${masterFile}`);
  process.exit(1);
}

const rawMaster = fs.readFileSync(masterFile, "utf-8");
// Normalize line endings to \n for consistent slicing & verbatim verification
const masterContent = rawMaster.replace(/\r\n/g, "\n");

const PROGRAM_SPECS = [
  {
    key: "fullstack",
    label: "Full Stack (DM / DA / SE)",
    outFile: "faq_fullstack.md",
    startMarker: "## Part 1. Full Stack FAQ",
    endMarker: "## Part 2. University programs",
    questionLevel: 4,
    categoryPattern: /^###\s+(.+)$/,
  },
  {
    key: "binus_applied_ai",
    label: "BINUS: Applied AI, Analytics, and Automation",
    outFile: "faq_binus_applied_ai.md",
    startMarker: "### BINUS: Applied AI, Analytics, and Automation",
    endMarker: "### BINUS: Applied Cybersecurity with AI",
    questionLevel: 4,
    categoryPattern: /^####\s+([A-Z]\.\s+.+)$/,
  },
  {
    key: "binus_cybersecurity",
    label: "BINUS: Applied Cybersecurity with AI",
    outFile: "faq_binus_cybersecurity.md",
    startMarker: "### BINUS: Applied Cybersecurity with AI",
    endMarker: "### ITB: Data-Driven Decision Making for Leaders",
    questionLevel: 5,
    categoryPattern: /^####\s+(.+)$/,
  },
  {
    key: "itb_leaders",
    label: "ITB: Data-Driven Decision Making for Leaders",
    outFile: "faq_itb_leaders.md",
    startMarker: "### ITB: Data-Driven Decision Making for Leaders",
    endMarker: "### ITB: Applied Data Science with AI",
    questionLevel: 4,
    categoryPattern: /^####\s+([A-Z]\.\s+.+)$/,
  },
  {
    key: "itb_applied_ds",
    label: "ITB: Applied Data Science with AI",
    outFile: "faq_itb_applied_ds.md",
    startMarker: "### ITB: Applied Data Science with AI",
    endMarker: "### UI: Strategic Finance",
    questionLevel: 5,
    categoryPattern: /^####\s+(.+)$/,
  },
  {
    key: "ui_finance",
    label: "UI: Strategic Finance",
    outFile: "faq_ui_finance.md",
    startMarker: "### UI: Strategic Finance",
    endMarker: "### ITS: AI for Leaders, Smart Operations",
    questionLevel: 5,
    categoryPattern: /^####\s+(.+)$/,
  },
  {
    key: "its_smart_ops",
    label: "ITS: AI for Leaders, Smart Operations",
    outFile: "faq_its_smart_ops.md",
    startMarker: "### ITS: AI for Leaders, Smart Operations",
    endMarker: "### RevoU: Strategic HR with AI",
    questionLevel: 5,
    categoryPattern: /^####\s+(.+)$/,
  },
  {
    key: "strategic_hr",
    label: "RevoU: Strategic HR with AI",
    outFile: "faq_strategic_hr.md",
    startMarker: "### RevoU: Strategic HR with AI",
    endMarker: null,
    questionLevel: 5,
    categoryPattern: /^####\s+(.+)$/,
  },
];

// Known stale-date notes from "To fix in source sheets"
const STALE_DATE_NOTES = [
  {
    program: "fullstack",
    match: /program start kapan/i,
    note: "Tanggal di sumber (October 2026) mungkin sudah lewat — cek tanggal batch terbaru sebelum kirim.",
  },
  {
    program: "fullstack",
    match: /maaf kak masih terlalu mahal/i,
    note: "Tanggal mulai kelas (Februari 2026) & cicilan (September/November 2026) perlu diperbarui ke batch aktif.",
  },
  {
    program: "binus_applied_ai",
    match: /program start kapan/i,
    note: "Tanggal di sumber (27 April 2026) mungkin sudah lewat — cek tanggal batch terbaru sebelum kirim.",
  },
  {
    program: "itb_leaders",
    match: /program start kapan/i,
    note: "Tanggal di sumber (2 Juni 2026) mungkin sudah lewat — cek tanggal batch terbaru sebelum kirim.",
  },
];

const PLACEHOLDER_REGEX =
  /(\[HARI & JAM\]|\[DETAIL CICILAN\]|\[LINK BOOKING\]|\[BELUM ADA JAWABAN RESMI\]|\bNAMA\b|\bXXXXXX\b|\bxxxxx\b)/g;

function extractPlaceholders(text) {
  if (!text) return [];
  const found = text.match(PLACEHOLDER_REGEX) || [];
  return [...new Set(found)];
}

function parseProgramSection(sectionText, spec) {
  const lines = sectionText.split("\n");
  const qPrefix = "#".repeat(spec.questionLevel) + " ";
  const entries = [];

  let currentCategory = "Umum";
  let currentQuestion = null;
  let currentBodyLines = [];
  let inCodeBlock = false;
  let localCounter = 0;

  function flushEntry() {
    if (!currentQuestion) return;
    localCounter++;
    const bodyRaw = currentBodyLines.join("\n").trim();

    // Check continuation text before first code block (e.g. second sentence of a question)
    let questionText = currentQuestion.trim();
    const firstFenceIdx = bodyRaw.indexOf("```text");
    if (firstFenceIdx > 0) {
      const preFence = bodyRaw.slice(0, firstFenceIdx).trim();
      const preLines = preFence
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      // Only append if it's plain question continuation (not a **Bubble** / **Weekday** label, blockquote, or _Same as_)
      const plainContinuation = preLines.filter(
        (l) => !l.startsWith("**") && !l.startsWith(">") && !l.startsWith("_")
      );
      if (plainContinuation.length > 0) {
        questionText = `${questionText} ${plainContinuation.join(" ")}`.trim();
      }
    }

    // Parse ```text blocks (preserving optional **Label** above each block)
    const bubbles = [];
    const fenceRegex = /(?:^|\n)(?:\*\*([^\n*]+)\*\*\s*\n+)?```text\n([\s\S]*?)\n```/g;
    let m;
    while ((m = fenceRegex.exec(bodyRaw)) !== null) {
      const label = m[1] ? m[1].trim() : null;
      const text = m[2]; // 100% verbatim inside fence
      bubbles.push({ label, text });
    }

    // Parse _Same as: ..._ and _No answer in source._
    const sameAsMatch = bodyRaw.match(/^_Same as:\s*(.+?)_$/m);
    const sameAs = sameAsMatch ? sameAsMatch[1].trim() : null;
    const noAnswer = /^_No answer in source\._$/m.test(bodyRaw);

    // Parse > Status: ... and > Note: ...
    const blockquoteLines = bodyRaw
      .split("\n")
      .filter((l) => l.trim().startsWith(">"))
      .map((l) => l.replace(/^>\s*/, "").trim());

    let statusRaw = null;
    const acNotes = [];
    for (const bq of blockquoteLines) {
      const statusMatch = bq.match(/^Status:\s*([^.]+)(?:\.\s*AC note:\s*(.+))?$/i);
      if (statusMatch) {
        statusRaw = statusMatch[1].trim();
        if (statusMatch[2]) acNotes.push(statusMatch[2].trim());
      } else if (/^Note:/i.test(bq)) {
        acNotes.push(bq.replace(/^Note:\s*/i, "").trim());
      } else {
        acNotes.push(bq);
      }
    }

    const answerVerbatim = bubbles
      .map((b) => (b.label ? `${b.label}\n${b.text}` : b.text))
      .join("\n\n---\n\n");

    const staleHit = STALE_DATE_NOTES.find(
      (s) => s.program === spec.key && s.match.test(questionText)
    );
    if (staleHit) {
      acNotes.push(staleHit.note);
    }

    const placeholders = extractPlaceholders(answerVerbatim);
    const hasOfficialMissing = /\[BELUM ADA JAWABAN RESMI\]/i.test(answerVerbatim);
    const isNeedConfirmation =
      (statusRaw && /need confirmation/i.test(statusRaw)) ||
      /perlu konfirmasi|need confirmation/i.test(answerVerbatim) ||
      hasOfficialMissing ||
      placeholders.some((p) => p.startsWith("["));

    entries.push({
      id: `faq-${spec.key}-${String(localCounter).padStart(2, "0")}`,
      program: spec.key,
      program_label: spec.label,
      category: currentCategory,
      source_file: `knowledge/FAQ/${spec.outFile}`,
      question: questionText,
      bubbles,
      answer_verbatim: answerVerbatim,
      has_answer: !noAnswer && (bubbles.length > 0 || Boolean(sameAs)),
      same_as: sameAs,
      status: statusRaw || (noAnswer ? "No answer" : "Confirmed"),
      unconfirmed: Boolean(isNeedConfirmation),
      stale_date: Boolean(staleHit),
      ac_note: acNotes.length > 0 ? acNotes.join(" | ") : null,
      placeholders,
    });
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      if (currentQuestion) currentBodyLines.push(line);
      continue;
    }

    if (!inCodeBlock) {
      // Check category heading FIRST (handles #### A. Program related vs #### Question in BINUS/ITB)
      const catMatch = line.match(spec.categoryPattern);
      if (catMatch) {
        flushEntry();
        currentQuestion = null;
        currentBodyLines = [];
        currentCategory = catMatch[1].trim();
        continue;
      }

      // Check question heading
      if (line.startsWith(qPrefix) && !line.startsWith(qPrefix + "#")) {
        flushEntry();
        currentQuestion = line.slice(qPrefix.length).trim();
        currentBodyLines = [];
        continue;
      }
    }

    if (currentQuestion) {
      currentBodyLines.push(line);
    }
  }

  flushEntry();
  return entries;
}

fs.mkdirSync(outDir, { recursive: true });

const allEntries = [];
const splitSummaries = [];

for (const spec of PROGRAM_SPECS) {
  const startIdx = masterContent.indexOf(spec.startMarker);
  if (startIdx === -1) {
    console.error(`Start marker not found for ${spec.key}: ${spec.startMarker}`);
    process.exit(1);
  }
  const endIdx = spec.endMarker ? masterContent.indexOf(spec.endMarker, startIdx) : masterContent.length;
  if (endIdx === -1) {
    console.error(`End marker not found for ${spec.key}: ${spec.endMarker}`);
    process.exit(1);
  }

  const sliceText = masterContent.slice(startIdx, endIdx).trim();

  // VERBATIM CHECK 1: split file slice must exist 100% verbatim in master
  if (!masterContent.includes(sliceText)) {
    console.error(`VERBATIM ERROR: Split slice for ${spec.key} does not match master!`);
    process.exit(1);
  }

  const outPath = path.join(outDir, spec.outFile);
  fs.writeFileSync(outPath, sliceText + "\n", "utf-8");

  const entries = parseProgramSection(sliceText, spec);
  allEntries.push(...entries);
  splitSummaries.push({
    key: spec.key,
    outFile: spec.outFile,
    count: entries.length,
    unconfirmed: entries.filter((e) => e.unconfirmed).length,
    noAnswer: entries.filter((e) => !e.has_answer).length,
    sameAs: entries.filter((e) => e.same_as).length,
    chars: sliceText.length,
  });
}

// Resolve "_Same as: <Scope> > <Question>_" references to verbatim target answers
const SCOPE_TO_PROGRAM = {
  "part 1": "fullstack",
  "binus": "binus_applied_ai",
  "itb": "itb_leaders",
};

for (const entry of allEntries) {
  if (!entry.same_as) continue;
  const parts = entry.same_as.split(">").map((s) => s.trim());
  if (parts.length !== 2) {
    console.error(`Invalid Same as reference in ${entry.id}: ${entry.same_as}`);
    process.exit(1);
  }
  const targetProgram = SCOPE_TO_PROGRAM[parts[0].toLowerCase()];
  const targetQuestionLower = parts[1].toLowerCase();
  const target = allEntries.find(
    (e) =>
      e.program === targetProgram &&
      e.question.toLowerCase() === targetQuestionLower
  );
  if (!target) {
    console.error(`Could not resolve Same as target for ${entry.id}: ${entry.same_as}`);
    process.exit(1);
  }
  entry.bubbles = target.bubbles;
  entry.answer_verbatim = target.answer_verbatim;
  entry.has_answer = target.has_answer;
  entry.placeholders = target.placeholders;
  entry.resolved_from = target.id;
}

// VERBATIM CHECK 2: every bubble text in catalog must exist 100% verbatim in master
for (const entry of allEntries) {
  for (const bubble of entry.bubbles) {
    if (!masterContent.includes(bubble.text)) {
      console.error(`VERBATIM ERROR: Bubble text in ${entry.id} (${entry.question}) not found verbatim in master!`);
      process.exit(1);
    }
  }
}

const catalogPath = path.join(outDir, "catalog.json");
fs.writeFileSync(catalogPath, JSON.stringify(allEntries, null, 2) + "\n", "utf-8");

console.log("=== FAQ SPLIT SUMMARY ===");
console.table(splitSummaries);
console.log(`Total Q&A entries in catalog.json: ${allEntries.length}`);
console.log(`VERBATIM CHECK PASSED: All ${splitSummaries.length} split files and all bubble texts match knowledge/faq_master.md 100% verbatim!`);
