import fs from "fs";
import path from "path";

const rootDir = process.cwd();
const splitDir = path.join(rootDir, "knowledge", "alumni_split");
const catalogPath = path.join(splitDir, "catalog.json");
const commonRulesPath = path.join(splitDir, "alumni_common_rules.md");
const defaultShowcasePath = path.join(splitDir, "alumni_default_showcase.md");

let cachedCatalog = null;
let cachedCommonRules = null;
let cachedDefaultShowcase = null;

function getCatalog() {
  if (!cachedCatalog && fs.existsSync(catalogPath)) {
    try {
      cachedCatalog = JSON.parse(fs.readFileSync(catalogPath, "utf-8"));
    } catch (e) {
      console.error("Failed to load alumni catalog:", e);
      cachedCatalog = [];
    }
  }
  return cachedCatalog || [];
}

function getCommonRules() {
  if (!cachedCommonRules && fs.existsSync(commonRulesPath)) {
    cachedCommonRules = fs.readFileSync(commonRulesPath, "utf-8");
  }
  return cachedCommonRules || "";
}

function getDefaultShowcase() {
  if (!cachedDefaultShowcase && fs.existsSync(defaultShowcasePath)) {
    cachedDefaultShowcase = fs.readFileSync(defaultShowcasePath, "utf-8");
  }
  return cachedDefaultShowcase || "";
}

// ── TIGHTENED PROGRAM REGEXES (Word boundaries & dropped ambiguous tokens) ──
export const ALUMNI_PROGRAM_PATTERNS = {
  binus: /\bbinus\b|applied\s*ai|ai\s*(?:analytics|automation|workflow)|otomasi\s*ai|agentic\s*ai/gi,
  itb: /\bitb\b|data[\s-]driven\s*decision(?:\s*making)?|decision\s*making|ai\s*for\s*leaders|pemimpin\s*berbasis\s*data/gi,
  fsda: /\bfsda\b|data\s*analytics?|data\s*analyst|data\s*science|\btableau\b|power\s*bi|looker\s*studio|applied\s*ds\b/gi,
  fsdm: /\bfsdm\b|digital\s*marketing|performance\s*market(?:ing|er)|social\s*media\s*market(?:ing|er)|meta\s*ads|google\s*ads|\bseo\b|\bsem\b|paid\s*ads/gi,
  fsse: /\bfsse\b|software\s*engineer(?:ing)?|software\s*developer|full\s*stack(?:\s*(?:engineer|developer|web))?|web\s*dev(?:elopment|eloper)?|front[\s-]?end\s*developer|back[\s-]?end\s*developer/gi,
  pm: /\bproduct\s*manag(?:ement|er)\b|\bproduct\s*owner\b|\bscrum\s*master\b/gi,
};

export const ALUMNI_FILE_MAP = {
  binus: "alumni_split/alumni_binus_applied_ai.md",
  itb: "alumni_split/alumni_itb_decision_making.md",
  fsda: "alumni_split/alumni_fsda.md",
  fsdm: "alumni_split/alumni_fsdm.md",
  fsse: "alumni_split/alumni_fsse.md",
  pm: "alumni_split/alumni_pm_other.md",
};

// Industry synonym groups (bilingual Indo/English mapping)
const INDUSTRY_SYNONYM_GROUPS = [
  ["manufaktur", "manufacture"],
  ["otomotif", "automotive"],
  ["medis", "kesehatan", "healthcare", "medical", "farmasi", "pharmaceutical", "bidan", "paramedis", "apoteker"],
  ["fmcg"],
  ["agensi", "agency", "marketing agency"],
  ["bank", "banking", "financial services", "keuangan", "finance"],
  ["tambang", "mining"],
  ["oil & gas", "minyak", "pertamina", "energi", "energy"],
  ["telekomunikasi", "telecommunication", "telkomsel"],
  ["retail", "jewellery", "properti", "property"],
  ["media", "publishing", "detikcom"],
  ["konstruksi", "construction"],
];

// Background & transition synonym groups
const BACKGROUND_SYNONYM_GROUPS = [
  ["bidan", "perawat", "apoteker", "paramedis"],
  ["guru", "dosen", "pendidik", "pengajar"],
  ["barista", "waiter", "f&b", "perhotelan"],
  ["career switcher", "banting setir", "switch career", "pindah karir"],
  ["ibu rumah tangga", "irt", "career break"],
  ["fresh graduate", "fresh grad", "lulusan baru"],
  ["admin", "akuntan", "accounting", "pajak", "audit"],
  ["sales", "customer service", "telesales"],
];

/**
 * Score a single story against query text using:
 * 1. Industry match with bilingual synonyms (weight: 100 per group match)
 * 2. Background / career type match with synonyms (weight: 10 per group match)
 * 3. Original source order as deterministic tiebreaker
 */
export function scoreStory(story, queryLower) {
  let score = 0;
  const storyTextLower = `${story.name} ${story.role || ""} ${story.company || ""} ${story.industry || ""} ${story.careerType || ""} ${story.summary || ""} ${story.text || ""}`.toLowerCase();

  for (const group of INDUSTRY_SYNONYM_GROUPS) {
    const queryHit = group.some((term) => queryLower.includes(term));
    const storyHit = group.some((term) => storyTextLower.includes(term));
    if (queryHit && storyHit) {
      score += 100;
    }
  }

  for (const group of BACKGROUND_SYNONYM_GROUPS) {
    const queryHit = group.some((term) => queryLower.includes(term));
    const storyHit = group.some((term) => storyTextLower.includes(term));
    if (queryHit && storyHit) {
      score += 10;
    }
  }

  return score;
}

/**
 * Main router function for alumni mode
 */
export function routeAlumniStories(situationText = "") {
  const text = (situationText || "").trim();
  const textLower = text.toLowerCase();
  const catalog = getCatalog();
  const commonRules = getCommonRules();

  // 1. Count regex matches per program
  const programMatchCounts = [];
  for (const [prog, regex] of Object.entries(ALUMNI_PROGRAM_PATTERNS)) {
    // Reset regex state
    regex.lastIndex = 0;
    const matches = text.match(regex);
    if (matches && matches.length > 0) {
      programMatchCounts.push({
        program: prog,
        count: matches.length,
      });
    }
  }

  // Rank by number of keyword matches descending, tiebreak deterministically by program name
  programMatchCounts.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.program.localeCompare(b.program);
  });

  // Check if any industry or background signal exists in query
  const hasIndustrySignal = INDUSTRY_SYNONYM_GROUPS.some((group) => group.some((t) => textLower.includes(t)));
  const hasBackgroundSignal = BACKGROUND_SYNONYM_GROUPS.some((group) => group.some((t) => textLower.includes(t)));

  // Case A: 0 program match
  if (programMatchCounts.length === 0) {
    // Case A1: Has industry or background signal -> Search ACROSS ALL split files, rank, take top 5 overall
    if (hasIndustrySignal || hasBackgroundSignal) {
      const scoredAll = catalog.map((s) => ({
        story: s,
        score: scoreStory(s, textLower),
      }));

      // Sort by score descending, tiebreaker by sourceIndex ascending
      scoredAll.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.story.sourceIndex - b.story.sourceIndex;
      });

      const top5 = scoredAll.filter((item) => item.score > 0).slice(0, 5).map((item) => item.story);

      // If matches were found
      if (top5.length > 0) {
        const uniquePrograms = [...new Set(top5.map((s) => s.program))];
        const filesToLoad = uniquePrograms.map((p) => ALUMNI_FILE_MAP[p] || p);
        const storiesMarkdown = top5.map((s) => s.text).join("\n\n---\n\n");
        const assembled = `${commonRules}\n\n## KISAH ALUMNI PILIHAN (HASIL PENCARIAN RELEVAN):\n\n${storiesMarkdown}`;
        return {
          matchType: "cross_search",
          matchedPrograms: uniquePrograms,
          filesToLoad,
          stories: top5,
          assembledKnowledgeText: assembled,
        };
      }
    }

    // Case A2: Vague / No program / No signal -> Default Showcase (5 verbatim stories)
    const defaultText = getDefaultShowcase();
    return {
      matchType: "default_fallback",
      matchedPrograms: [],
      filesToLoad: ["alumni_split/alumni_default_showcase.md"],
      stories: [],
      assembledKnowledgeText: `${commonRules}\n\n${defaultText}`,
    };
  }

  // Case B: Exactly 1 program matched
  if (programMatchCounts.length === 1) {
    const prog = programMatchCounts[0].program;
    const progStories = catalog.filter((s) => s.program === prog);

    const scored = progStories.map((s) => ({
      story: s,
      score: scoreStory(s, textLower),
    }));

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.story.sourceIndex - b.story.sourceIndex;
    });

    const top5 = scored.slice(0, 5).map((item) => item.story);
    const storiesMarkdown = top5.map((s) => s.text).join("\n\n---\n\n");
    const assembled = `${commonRules}\n\n## KISAH ALUMNI RESMI (${prog.toUpperCase()} — TOP 5 TERPILIH):\n\n${storiesMarkdown}`;

    return {
      matchType: "single_program",
      matchedPrograms: [prog],
      filesToLoad: [ALUMNI_FILE_MAP[prog]],
      stories: top5,
      assembledKnowledgeText: assembled,
    };
  }

  // Case C: 2+ programs matched -> Take top 2 programs by match count, split cap 3 + 2 = 5
  const top2 = programMatchCounts.slice(0, 2);
  const p1 = top2[0].program;
  const p2 = top2[1].program;

  function pickTopN(progKey, n) {
    const progStories = catalog.filter((s) => s.program === progKey);
    const scored = progStories.map((s) => ({
      story: s,
      score: scoreStory(s, textLower),
    }));
    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.story.sourceIndex - b.story.sourceIndex;
    });
    return scored.slice(0, n).map((item) => item.story);
  }

  const p1Stories = pickTopN(p1, 3);
  const p2Stories = pickTopN(p2, 2);
  const combined = [...p1Stories, ...p2Stories];

  const storiesMarkdown = combined.map((s) => s.text).join("\n\n---\n\n");
  const assembled = `${commonRules}\n\n## KISAH ALUMNI RESMI (KOMBINASI ${p1.toUpperCase()} & ${p2.toUpperCase()} — TOP 5 TERPILIH):\n\n${storiesMarkdown}`;

  return {
    matchType: "multi_program_top2",
    matchedPrograms: [p1, p2],
    filesToLoad: [ALUMNI_FILE_MAP[p1], ALUMNI_FILE_MAP[p2]],
    stories: combined,
    assembledKnowledgeText: assembled,
  };
}
