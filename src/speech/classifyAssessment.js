import { analyzeArabicMatch, normalizeArabic, similarityScore } from "../utils/arabic.js";

function candidateTexts({ recognizedText = "", alternatives = [] }) {
  const texts = [];
  const push = (value) => {
    const text = typeof value === "string" ? value : value?.text;
    if (text && !texts.includes(text)) texts.push(text);
  };
  push(recognizedText);
  alternatives.forEach(push);
  return texts;
}

export function classifyAssessment({
  expectedText = "",
  recognizedText = "",
  alternatives = [],
  pronunciationScore = null,
  wordAccuracy = null,
  confidence = 0,
} = {}) {
  const expectedNormalized = normalizeArabic(expectedText);
  const candidates = candidateTexts({ recognizedText, alternatives });

  let best = {
    kind: "empty",
    similarity: 0,
    text: recognizedText || "",
    recognized: "",
    rank: -1,
  };

  if (!candidates.length) {
    best = { ...analyzeArabicMatch(expectedText, ""), text: "" };
  }

  for (const text of candidates) {
    const analysis = analyzeArabicMatch(expectedText, text);
    if (analysis.rank > best.rank) {
      best = { ...analysis, text };
    }
  }

  const pron = pronunciationScore == null || Number.isNaN(Number(pronunciationScore))
    ? null
    : Number(pronunciationScore);
  const wordAcc = wordAccuracy == null || Number.isNaN(Number(wordAccuracy))
    ? null
    : Number(wordAccuracy);
  const conf = Number(confidence) || 0;

  let status = "WRONG";

  if (best.kind === "exact") {
    status = "CORRECT";
  } else if (best.kind === "contains" || best.kind === "insertion") {
    status = pron != null && pron < 55 ? "CLOSE" : "CORRECT";
  } else if (best.kind === "substitution") {
    status = "WRONG";
  } else if (best.kind === "near") {
    if ((pron != null && pron >= 80) || (wordAcc != null && wordAcc >= 80)) status = "CLOSE";
    else if (best.similarity >= 80) status = "CLOSE";
    else status = "WRONG";
  } else if (best.kind === "empty") {
    if (pron != null && pron >= 80 && wordAcc != null && wordAcc >= 75) status = "CORRECT";
    else if (pron != null && pron >= 55 && wordAcc != null && wordAcc >= 50) status = "CLOSE";
    else status = "WRONG";
  } else {
    status = "WRONG";
  }

  if ((best.kind === "distant" || best.kind === "substitution") && status === "CORRECT") {
    status = "WRONG";
  }

  if (best.similarity < 45 && best.kind !== "empty") {
    status = "WRONG";
  }

  return {
    status,
    result: status.toLowerCase(),
    confidence: conf,
    recognizedText: best.text || recognizedText || "",
    expectedText,
    pronunciationScore: pron ?? best.similarity,
    wordAccuracy: wordAcc,
    similarity: best.similarity ?? similarityScore(expectedText, best.text || ""),
    expectedNormalized,
    recognizedNormalized: best.recognized || normalizeArabic(best.text || recognizedText || ""),
    matchKind: best.kind,
  };
}
