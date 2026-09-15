const TASHKEEL = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const TATWEEL = /\u0640/g;
const INVISIBLE = /[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF\u00A0]/g;

export function normalizeArabic(text = "") {
  return String(text)
    .normalize("NFC")
    .replace(INVISIBLE, "")
    .replace(TASHKEEL, "")
    .replace(TATWEEL, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/[^\u0621-\u063A\u0641-\u064A]/g, "")
    .trim();
}

export function normalizeArabicLoose(text = "") {
  return normalizeArabic(text).replace(/ة/g, "ه");
}

export function levenshtein(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const grid = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let i = 0; i < rows; i += 1) grid[i][0] = i;
  for (let j = 0; j < cols; j += 1) grid[0][j] = j;
  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      grid[i][j] = Math.min(
        grid[i - 1][j] + 1,
        grid[i][j - 1] + 1,
        grid[i - 1][j - 1] + cost,
      );
    }
  }
  return grid[a.length][b.length];
}

export function similarityScore(expected, actual) {
  const a = normalizeArabic(expected);
  const b = normalizeArabic(actual);
  if (!a) return 0;
  if (a === b || normalizeArabicLoose(a) === normalizeArabicLoose(b)) return 100;
  if (!b) return 0;
  const distance = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length);
  return Math.round((1 - distance / maxLen) * 100);
}

export function analyzeArabicMatch(expectedText, recognizedText) {
  const expected = normalizeArabic(expectedText);
  const recognized = normalizeArabic(recognizedText);
  const expectedLoose = normalizeArabicLoose(expected);
  const recognizedLoose = normalizeArabicLoose(recognized);

  if (!expected) {
    return { kind: "empty", similarity: 0, expected, recognized, rank: 0 };
  }
  if (!recognized) {
    return { kind: "empty", similarity: 0, expected, recognized, rank: 0 };
  }
  if (expected === recognized || expectedLoose === recognizedLoose) {
    return { kind: "exact", similarity: 100, expected, recognized, rank: 100 };
  }
  if (recognized.includes(expected) && expected.length >= 2) {
    return { kind: "contains", similarity: 94, expected, recognized, rank: 90 };
  }

  const distance = levenshtein(expected, recognized);
  const maxLen = Math.max(expected.length, recognized.length);
  const similarity = Math.round((1 - distance / maxLen) * 100);
  const lengthDelta = recognized.length - expected.length;

  if (distance > 0 && distance === Math.abs(lengthDelta) && lengthDelta > 0 && lengthDelta <= 2) {
    return { kind: "insertion", similarity: Math.max(similarity, 86), expected, recognized, rank: 80 };
  }

  if (distance === 1 && recognized.length === expected.length) {
    return { kind: "substitution", similarity, expected, recognized, rank: 20 };
  }

  return {
    kind: similarity >= 50 ? "near" : "distant",
    similarity,
    expected,
    recognized,
    rank: similarity,
  };
}
