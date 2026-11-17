import fs from "fs";

const orig = fs.readFileSync("knowledge/knowledge_base_alumni_success_stories.md", "utf-8");
const showcase = fs.readFileSync("knowledge/alumni_split/alumni_default_showcase.md", "utf-8");

const stories = showcase
  .split(/\n---\n/)
  .map((s) => s.replace(/^# Alumni Flagship Showcase \(Curated Default Set\)\s*/, "").trim())
  .filter(Boolean);

console.log(`Total showcase items to verify: ${stories.length}`);

let allValid = true;
stories.forEach((st, idx) => {
  const isContained = orig.includes(st);
  console.log(`Item ${idx + 1} [${st.slice(0, 35)}...]: verbatim in original? -> ${isContained}`);
  if (!isContained) {
    allValid = false;
  }
});

if (allValid) {
  console.log("RESULT: ALL 5 items in alumni_default_showcase.md match knowledge_base_alumni_success_stories.md VERBATIM.");
} else {
  console.error("RESULT: VERBATIM MISMATCH!");
  process.exit(1);
}
