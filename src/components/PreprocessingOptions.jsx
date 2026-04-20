import React from "react";
import { PREPROCESS_OPTIONS } from "../constants/languages";

/**
 * Image preprocessing options component
 */
const PreprocessingOptions = ({
  preprocessing,
  onPreprocessingChange,
  disabled = false,
  cvReady = false,
}) => {
  return (
    <div>
      <label className="text-lg font-bold text-slate-900">Preprocessing</label>
      <p className="mt-1 text-sm text-slate-600">
        Improve OCR quality by enhancing contrast, edges, and readability.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {PREPROCESS_OPTIONS.map((option) => (
          <label
            key={option.id}
            className={`inline-flex items-center rounded-full border px-3 py-2 text-sm font-medium transition ${
              preprocessing === option.id
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
            } ${disabled || !cvReady ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
          >
            <input
              type="radio"
              name="preprocessing"
              value={option.id}
              checked={preprocessing === option.id}
              onChange={(e) => onPreprocessingChange(e.target.value)}
              disabled={disabled || !cvReady}
              className="sr-only"
            />
            <span>{option.name}</span>
          </label>
        ))}
      </div>
      {!cvReady && (
        <p className="mt-3 text-xs font-medium text-amber-700">
          OpenCV is still loading, preprocessing options will unlock shortly.
        </p>
      )}
    </div>
  );
};

export default PreprocessingOptions;
