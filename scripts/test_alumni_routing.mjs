import { routeAlumniStories } from "../lib/alumniStoryRouter.js";

const samples = [
  "saya ingin cari alumni program digital marketing",
  "apakah ada alumni data analyst / fsda?",
  "tolong carikan alumni software engineering fsse",
  "alumni applied ai binus",
  "kisah peserta itb data-driven decision making",
  "rekomendasi alumni product management",
  "leads bingung antara data analytics atau digital marketing",
  "bisa share alumni software engineer dan product manager?",
  "alumni binus applied ai dan itb decision making",
  "alumni digital marketing di industri agensi marketing / fmcg",
  "ada alumni yang kerja di industri manufaktur?",
  "alumni mantan guru atau bidan yang switch career",
  "lead tanya soal ads budget",
  "lead seorang pemimpin tim mau belajar coding",
  "ceritakan kisah sukses alumni yang berhasil naik gaji",
];

console.log("| No | Input Leads / Sales | Match Type | Program Terpilih | File yang Dimuat | Total Cerita Terpilih |");
console.log("|:---:|---|---|---|---|:---:|");

samples.forEach((input, idx) => {
  const result = routeAlumniStories(input);
  const progStr = result.matchedPrograms.length > 0 ? result.matchedPrograms.map((p) => p.toUpperCase()).join(", ") : "-";
  const filesStr = result.filesToLoad.map((f) => f.replace("alumni_split/", "")).join(" + ");
  const storyCount = result.matchType === "default_fallback" ? "5 (Showcase)" : result.stories.length;
  console.log(`| ${idx + 1} | "${input}" | ${result.matchType} | ${progStr} | \`${filesStr}\` | ${storyCount} |`);
});
