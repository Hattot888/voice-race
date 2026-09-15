import { SPEECH_DEBUG } from "../config.js";

export function logSpeechDebug(assessment) {
  if (!SPEECH_DEBUG || !assessment) return;
  const lines = [
    "Expected:",
    assessment.expectedText || "",
    "",
    "Recognized:",
    assessment.recognizedText || "",
    "",
    "Normalized expected:",
    assessment.expectedNormalized || "",
    "",
    "Normalized recognized:",
    assessment.recognizedNormalized || "",
    "",
    "Pronunciation score:",
    String(assessment.pronunciationScore ?? ""),
    "",
    "Confidence:",
    String(assessment.confidence ?? ""),
    "",
    "Final:",
    assessment.status || String(assessment.result || "").toUpperCase(),
  ];
  console.info(`[SpeechDebug]\n${lines.join("\n")}`);
  window.dispatchEvent(new CustomEvent("speech-debug", { detail: lines.join("\n") }));
}

export class SpeechDebugPanel {
  constructor(root) {
    this.el = document.createElement("pre");
    this.el.className = "speech-debug-panel";
    this.el.hidden = true;
    root.appendChild(this.el);
    this.onUpdate = (event) => {
      this.el.textContent = event.detail;
      this.el.hidden = false;
    };
    if (SPEECH_DEBUG) {
      window.addEventListener("speech-debug", this.onUpdate);
    }
  }

  show(assessment) {
    if (!SPEECH_DEBUG || !assessment) return;
    logSpeechDebug(assessment);
  }
}
