/**
 * Language detection utilities for auto-detecting speech language
 */

import { VOICE_MAP } from "../constants/languages";

// Unicode ranges for different scripts
const SCRIPT_PATTERNS = {
  sin: /[\u0D80-\u0DFF]/, // Sinhala
  tam: /[\u0B80-\u0BFF]/, // Tamil
};

/**
 * Detect the primary language from text
 * @param {string} text - Text to analyze
 * @param {string[]} selectedLangs - Languages selected for OCR (as hints)
 * @returns {string} - Detected language code
 */
export const detectLanguage = (text, selectedLangs = []) => {
  if (!text || text.trim().length === 0) {
    return "eng";
  }

  const scriptScores = {};

  // Count characters matching each script
  for (const [langCode, pattern] of Object.entries(SCRIPT_PATTERNS)) {
    const matches = text.match(new RegExp(pattern, "g"));
    if (matches) {
      scriptScores[langCode] = matches.length;
    }
  }

  // Find the script with highest count
  let detectedLang = null;
  let maxScore = 0;

  for (const [lang, score] of Object.entries(scriptScores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedLang = lang;
    }
  }

  // If a non-Latin script was detected with significant presence
  if (detectedLang && maxScore > text.length * 0.1) {
    return detectedLang;
  }

  // Treat Latin text as English for this app's focused language set
  if (/[A-Za-z]/.test(text)) {
    return "eng";
  }

  // Use OCR language selection as fallback hint
  if (selectedLangs.length > 0) {
    if (selectedLangs.includes("sin")) return "sin";
    if (selectedLangs.includes("tam")) return "tam";
  }

  // Default to English
  return "eng";
};

/**
 * Get the voice name for a detected language
 * @param {string} langCode - Language code
 * @returns {string} - Voice name for ResponsiveVoice
 */
export const getVoiceForLanguage = (langCode) => {
  return VOICE_MAP[langCode] || "UK English Female";
};

/**
 * Analyze text and return language breakdown
 * @param {string} text - Text to analyze
 * @returns {Object} - Object with language percentages
 */
export const analyzeTextLanguages = (text) => {
  if (!text || text.trim().length === 0) {
    return { eng: 100 };
  }

  const totalChars = text.replace(/\s/g, "").length;
  const breakdown = {};

  // Check each script
  for (const [langCode, pattern] of Object.entries(SCRIPT_PATTERNS)) {
    const matches = text.match(new RegExp(pattern, "g"));
    if (matches) {
      const count = matches.length;
      const percentage = Math.round((count / totalChars) * 100);
      if (percentage > 0) {
        breakdown[langCode] = percentage;
      }
    }
  }

  // Remaining characters are likely Latin/English
  const remainingPercentage =
    100 - Object.values(breakdown).reduce((a, b) => a + b, 0);
  if (remainingPercentage > 0) {
    breakdown["eng"] = remainingPercentage;
  }

  return breakdown;
};
