import React from "react";

/**
 * Progress bar component
 */
const ProgressBar = ({ progress, visible }) => {
  if (!visible) return null;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-600">
        <span>OCR Progress</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
