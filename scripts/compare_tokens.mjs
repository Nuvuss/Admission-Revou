import fs from "fs";
import path from "path";
import { routeAlumniStories } from "../lib/alumniStoryRouter.js";

const rootDir = process.cwd();
const sourceFile = path.join(rootDir, "knowledge", "knowledge_base_alumni_success_stories.md");
const jointFile = path.join(rootDir, "knowledge", "joint_program_product_knowledge.md");
const skillFile = path.join(rootDir, ".agents", "skills", "sales_copilot", "SKILL.md");

const originalAlumniContent = fs.readFileSync(sourceFile, "utf-8");
const jointContent = fs.readFileSync(jointFile, "utf-8");
const skillContent = fs.readFileSync(skillFile, "utf-8");

// Estimate tokens using 3.7 chars per token standard
const estTokens = (val) => {
  if (typeof val === "number") return Math.round(val / 3.7);
  return Math.round((val || "").length / 3.7);
};

// 5 Test Inputs
const testInputs = [
  { type: "Specific Program", input: "saya ingin cari alumni program digital marketing" },
  { type: "2 Programs", input: "leads bingung antara data analytics atau digital marketing" },
  { type: "No Program (Vague)", input: "ceritakan kisah sukses alumni yang berhasil naik gaji" },
  { type: "Industry-Specific", input: "ada alumni yang kerja di industri manufaktur?" },
  { type: "Vague / Transition", input: "rekomendasi alumni switch career yang sukses" },
];

console.log("=========================================================================================================");
console.log("PERBANDINGAN REAL TOKEN COUNTS: SEBELUM vs SESUDAH PADA ALUMNI MODE");
console.log("=========================================================================================================");

testInputs.forEach((item, idx) => {
  // BEFORE: Loaded the entire 144KB knowledge_base_alumni_success_stories.md + joint_program_product_knowledge.md
  const beforeKnowledge = `\n\n=== DOKUMEN: knowledge_base_alumni_success_stories.md ===\n${originalAlumniContent}\n\n=== DOKUMEN: joint_program_product_knowledge.md ===\n${jointContent}\n`;
  const beforePromptChars = skillContent.length + beforeKnowledge.length + item.input.length + 32359;
  const beforePromptTokens = estTokens(beforePromptChars);

  // AFTER: Uses routeAlumniStories (Common rules + top 5 stories + joint_program_product_knowledge.md)
  const routed = routeAlumniStories(item.input);
  const afterKnowledge = `${routed.assembledKnowledgeText}\n\n=== DOKUMEN: joint_program_product_knowledge.md ===\n${jointContent}\n`;
  const afterPromptChars = skillContent.length + afterKnowledge.length + item.input.length + 32359;
  const afterPromptTokens = estTokens(afterPromptChars);

  const tokensSaved = beforePromptTokens - afterPromptTokens;
  const pctSaved = Math.round((tokensSaved / beforePromptTokens) * 100);

  // Cost estimates: Claude 3.5 Sonnet ($3 / 1M tokens) & Gemini 3.8 Flash ($0.15 / 1M tokens)
  const costBeforeSonnet = (beforePromptTokens * 3.0) / 1e6;
  const costAfterSonnet = (afterPromptTokens * 3.0) / 1e6;

  console.log(`\nInput ${idx + 1} [${item.type}]: "${item.input}"`);
  console.log(` - File Alumni Dimuat: ${routed.filesToLoad.map(f => f.replace('alumni_split/', '')).join(' + ')} (${routed.matchType})`);
  console.log(` - Cerita Terpilih: ${routed.stories.length > 0 ? routed.stories.length : 5} cerita`);
  console.log(` - Ukuran Prompt SEBELUM: ${beforePromptChars.toLocaleString()} karakter (~${beforePromptTokens.toLocaleString()} tokens) | Biaya Sonnet: $${costBeforeSonnet.toFixed(4)}`);
  console.log(` - Ukuran Prompt SESUDAH: ${afterPromptChars.toLocaleString()} karakter (~${afterPromptTokens.toLocaleString()} tokens) | Biaya Sonnet: $${costAfterSonnet.toFixed(4)}`);
  console.log(` - HEMAT: ${tokensSaved.toLocaleString()} tokens (${pctSaved}% penghematan token prompt!)`);
});
console.log("=========================================================================================================");
