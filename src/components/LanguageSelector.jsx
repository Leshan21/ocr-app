import React from "react";
import { OCR_LANGUAGE_PRESETS } from "../constants/languages";

/**
 * Language selection component for OCR
 */
const LanguageSelector = ({
  selectedLangs,
  onLanguageChange,
  disabled = false,
}) => {
  const handlePreset = (languages) => {
    onLanguageChange(languages);
  };

  const selectedLabel = OCR_LANGUAGE_PRESETS.find((preset) => {
    if (preset.languages.length !== selectedLangs.length) return false;
    return preset.languages.every((lang) => selectedLangs.includes(lang));
  })?.label;

  return (
    <div>
      <label className="text-lg font-bold text-slate-900">OCR Language</label>
      <p className="mt-1 text-sm text-slate-600">
        Pick the main language, or use all three for mixed text.
      </p>
      <div className="mt-3">
        {selectedLabel && (
          <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 sm:text-sm">
            🌐 {selectedLabel}
          </span>
        )}
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {OCR_LANGUAGE_PRESETS.map((preset) => {
          const isActive =
            preset.languages.length === selectedLangs.length &&
            preset.languages.every((lang) => selectedLangs.includes(lang));

          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => handlePreset(preset.languages)}
              disabled={disabled}
              className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                isActive
                  ? "border-sky-300 bg-sky-50 text-sky-800"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
            >
              <span className="block">{preset.label}</span>
              <span className="mt-1 block text-xs font-normal text-slate-500">
                {preset.languages.length === 1
                  ? "Use this for single-language documents"
                  : "Best for mixed English, Sinhala, and Tamil text"}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Tip: single-language OCR is faster. Use all three only when needed.
      </p>
    </div>
  );
};

export default LanguageSelector;
