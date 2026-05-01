#!/usr/bin/env node
// Gemini-based PR reviewer with key rotation, diff slicing, and skip logic
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { execSync } from "child_process";

// --- Config ---
const REVIEWER = process.env.REVIEWER;
const PR_NUMBER = process.env.PR_NUMBER;
const GEMINI_API_KEYS = (process.env.GEMINI_API_KEYS || "").split(",").map((k) => k.trim()).filter(Boolean);
const RESULTS_DIR = ".claude/review-results";
const DIFF_RANGE = process.env.DIFF_RANGE || ""; // e.g. "abc123..def456"

const MODEL_MAP = {
  security: "gemini-2.5-pro",
  "type-safety": "gemini-2.5-pro",
  performance: "gemini-2.5-flash",
  a11y: "gemini-2.5-flash",
  "test-coverage": "gemini-2.5-flash",
  docs: "gemini-2.5-flash",
};

const DOMAIN_FILTERS = {
  security: { include: /\.(ts|tsx|js|jsx|mjs|py|env|yml|yaml|sql|json)$/i },
  performance: { include: /\.(ts|tsx|js|jsx|mjs|sql)$/i },
  "type-safety": { include: /\.(ts|tsx)$/i },
  a11y: { include: /\.(tsx|jsx|css|scss|html)$/i },
  "test-coverage": { include: /\.(ts|tsx|js|jsx|mjs)$/i },
  docs: { include: /\.(md|mdx|txt|yml|yaml|json)$/i },
};

const REVIEWER_ORDER = ["security", "performance", "type-safety", "a11y", "test-coverage", "docs"];

if (!REVIEWER) {
  console.error("REVIEWER env var required");
  process.exit(1);
}
if (!GEMINI_API_KEYS.length) {
  console.error("GEMINI_API_KEYS env var required (comma-separated)");
  process.exit(1);
}

// --- Key Rotation ---
const keyOffset = REVIEWER_ORDER.indexOf(REVIEWER);
const apiKey = GEMINI_API_KEYS[keyOffset % GEMINI_API_KEYS.length];

// --- Get Diff ---
function getDiff() {
  try {
    let cmd;
    if (DIFF_RANGE && DIFF_RANGE.includes("..")) {
      cmd = `git diff --no-ext-diff ${DIFF_RANGE}`;
    } else if (process.env.GITHUB_BASE_REF) {
      cmd = `git diff --no-ext-diff origin/${process.env.GITHUB_BASE_REF}...HEAD`;
    } else {
      cmd = `git diff --no-ext-diff HEAD~1 HEAD`;
    }
    return execSync(cmd, { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 });
  } catch (e) {
    console.error("Failed to get diff:", e.message);
    return "";
  }
}

// --- Diff Slicing ---
function sliceDiff(diff, filter) {
  if (!filter) return diff;
  const files = diff.split(/^diff --git /m).slice(1);
  const matched = files.filter((block) => {
    const header = block.split("\n")[0];
    const match = header.match(/b\/(.+)\s*$/);
    if (!match) return false;
    const path = match[1];
    return filter.include?.test(path) ?? true;
  });
  return matched.length ? "diff --git " + matched.join("diff --git ") : "";
}

// --- Load Reviewer Prompt ---
function loadPrompt() {
  const path = `.claude/review-agents/${REVIEWER}.md`;
  if (!existsSync(path)) {
    console.error(`Prompt file not found: ${path}`);
    process.exit(1);
  }
  return readFileSync(path, "utf-8");
}

// --- Call Gemini ---
async function callGemini(prompt, diffContent) {
  const model = MODEL_MAP[REVIEWER] || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${prompt}\n\n## Diff to review:\n\`\`\`diff\n${diffContent}\n\`\`\`\n\nOutput ONLY a valid JSON array of findings. If no issues, output [].`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 16384,
      responseMimeType: "application/json",
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`Gemini API error (${res.status}): ${errText.slice(0, 500)}`);
    return null;
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    console.error("No text in Gemini response");
    return null;
  }

  return text;
}

// --- Parse findings ---
function parseFindings(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\[[\s\S]*\]/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        console.error("Could not parse extracted JSON array");
        return [];
      }
    }
    console.error("No JSON array found in response");
    return [];
  }
}

// --- Main ---
async function main() {
  const fullDiff = getDiff();
  if (!fullDiff.trim()) {
    console.log("Empty diff, skipping.");
    mkdirSync(RESULTS_DIR, { recursive: true });
    writeFileSync(`${RESULTS_DIR}/${REVIEWER}.json`, "[]");
    return;
  }

  const filter = DOMAIN_FILTERS[REVIEWER];
  const slicedDiff = sliceDiff(fullDiff, filter);

  if (!slicedDiff.trim()) {
    console.log(`No ${REVIEWER}-relevant files in diff, skipping.`);
    mkdirSync(RESULTS_DIR, { recursive: true });
    writeFileSync(`${RESULTS_DIR}/${REVIEWER}.json`, "[]");
    return;
  }

  console.log(`Reviewing ${REVIEWER} with ${MODEL_MAP[REVIEWER]} (${slicedDiff.split("\n").length} diff lines)...`);

  const prompt = loadPrompt();
  const response = await callGemini(prompt, slicedDiff);

  if (!response) {
    mkdirSync(RESULTS_DIR, { recursive: true });
    writeFileSync(`${RESULTS_DIR}/${REVIEWER}.json`, "[]");
    return;
  }

  const findings = parseFindings(response);
  const enriched = (Array.isArray(findings) ? findings : []).map((f) => ({
    severity: f.severity || "LOW",
    file: f.file || "",
    line: f.line || 0,
    suggestion: f.suggestion || "",
    auto_fixable: Boolean(f.auto_fixable),
    category: f.category || "other",
    reviewer: REVIEWER,
  }));

  mkdirSync(RESULTS_DIR, { recursive: true });
  writeFileSync(`${RESULTS_DIR}/${REVIEWER}.json`, JSON.stringify(enriched, null, 2));
  console.log(`Found ${enriched.length} ${REVIEWER} issues.`);
}

main().catch((e) => {
  console.error(`Fatal: ${e.message}`);
  mkdirSync(RESULTS_DIR, { recursive: true });
  writeFileSync(`${RESULTS_DIR}/${REVIEWER}.json`, "[]");
  process.exit(1);
});
