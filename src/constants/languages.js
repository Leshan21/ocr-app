// Supported OCR languages for this app
export const OCR_LANGUAGES = [
  { code: "eng", name: "English" },
  { code: "sin", name: "Sinhala" },
  { code: "tam", name: "Tamil" },
];

export const OCR_LANGUAGE_PRESETS = [
  { label: "English", languages: ["eng"] },
  { label: "Sinhala", languages: ["sin"] },
  { label: "Tamil", languages: ["tam"] },
  { label: "All three", languages: ["eng", "sin", "tam"] },
];

// Map OCR language codes to ResponsiveVoice voice names
export const VOICE_MAP = {
  eng: "UK English Female",
  sin: "Sinhala",
  tam: "Tamil",
};

// Available TTS voices with auto-detect support
export const TTS_VOICES = [
  { code: "auto", name: "🔮 Auto Detect", voice: null },
  { code: "eng", name: "English (UK)", voice: "UK English Female" },
  { code: "sin", name: "Sinhala", voice: "Sinhala" },
  { code: "tam", name: "Tamil", voice: "Tamil" },
];

// Preprocessing options for OpenCV
export const PREPROCESS_OPTIONS = [
  { id: "none", name: "None (Original)" },
  { id: "grayscale", name: "Grayscale" },
  { id: "threshold", name: "Adaptive Threshold" },
  { id: "denoise", name: "Denoise" },
  { id: "sharpen", name: "Sharpen" },
  { id: "full", name: "Full Enhancement" },
];
