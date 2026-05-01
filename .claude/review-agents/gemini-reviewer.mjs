import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const AGENTS_DIR = __dirname;
const RESULTS_DIR = join(__dirname, "..", "review-results");

const REVIEWER = process.env.REVIEWER;
const BASE_REF = process.env.BASE_REF;
const GEMINI_KEYS = (process.env.GEMINI_API_KEYS || "").split(",").filter(Boolean);

if (!REVIEWER) {
  console.error("REVIEWER env var required");
  process.exit(1);
}
if (GEMINI_KEYS.length === 0) {
  console.error("GEMINI_API_KEYS env var required (comma-separated)");
  process.exit(1);
}

// ── Load reviewer prompt ──────────────────────────────────
const promptPath = join(AGENTS_DIR, `${REVIEWER}.md`);
const reviewerPrompt = readFileSync(promptPath, "utf-8");

// ── Get diff ──────────────────────────────────────────────
let diff = "";
try {
  const cleanEnv = { ...process.env };
  delete cleanEnv.GIT_EXTERNAL_DIFF;
  delete cleanEnv.DIFF_OPTS;
  cleanEnv.GIT_PAGER = "cat";
  diff = execSync(`git --no-pager diff --no-ext-diff origin/${BASE_REF}...HEAD`, {
    maxBuffer: 10 * 1024 * 1024,
    encoding: "utf-8",
    env: cleanEnv,
  });
} catch {
  console.error("Failed to get diff");
  process.exit(1);
}

if (!diff.trim()) {
  console.log("Empty diff, no review needed.");
  mkdirSync(RESULTS_DIR, { recursive: true });
  writeFileSync(join(RESULTS_DIR, `${REVIEWER}.json`), "[]");
  process.exit(0);
}

// Truncate diff to stay within Gemini context limits (~800K chars)
const MAX_DIFF = 600_000;
if (diff.length > MAX_DIFF) {
  diff = diff.slice(0, MAX_DIFF) + "\n\n... [TRUNCATED: diff exceeded 600K chars]";
}

// ── Build prompt ──────────────────────────────────────────
const systemPrompt = reviewerPrompt;
const userPrompt = `## Changed Diff\n\n\`\`\`diff\n${diff}\n\`\`\`\n\nReview the diff above following your instructions exactly. Output ONLY a valid JSON array of findings. No markdown fences, no commentary.`;

// ── Call Gemini with key rotation ─────────────────────────
async function callGemini(systemPrompt, userPrompt, keyIndex = 0) {
  if (keyIndex >= GEMINI_KEYS.length) {
    console.error("All Gemini keys exhausted");
    process.exit(1);
  }

  const key = GEMINI_KEYS[keyIndex];
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;

  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json",
    },
  };

  console.log(`Calling Gemini (key #${keyIndex + 1}/${GEMINI_KEYS.length})...`);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
  });

  if (res.status === 429 || res.status === 503) {
    console.warn(`Key #${keyIndex + 1} rate-limited (${res.status}), rotating...`);
    return callGemini(systemPrompt, userPrompt, keyIndex + 1);
  }

  if (!res.ok) {
    const err = await res.text();
    console.error(`Gemini error (${res.status}): ${err.slice(0, 300)}`);
    // Try next key on 401/403 (invalid key)
    if (res.status === 401 || res.status === 403) {
      return callGemini(systemPrompt, userPrompt, keyIndex + 1);
    }
    // On other errors, write empty result
    mkdirSync(RESULTS_DIR, { recursive: true });
    writeFileSync(join(RESULTS_DIR, `${REVIEWER}.json`), "[]");
    process.exit(0);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Validate JSON output
  let findings;
  try {
    findings = JSON.parse(text);
    if (!Array.isArray(findings)) {
      console.warn("Gemini returned non-array, wrapping");
      findings = [findings];
    }
  } catch {
    console.warn("Gemini returned invalid JSON, saving empty array");
    console.warn("Raw response (first 500 chars):", text.slice(0, 500));
    findings = [];
  }

  return findings;
}

// ── Main ──────────────────────────────────────────────────
const findings = await callGemini(systemPrompt, userPrompt);

mkdirSync(RESULTS_DIR, { recursive: true });
const outPath = join(RESULTS_DIR, `${REVIEWER}.json`);
writeFileSync(outPath, JSON.stringify(findings, null, 2));
console.log(`${REVIEWER}: ${findings.length} findings written to ${outPath}`);
