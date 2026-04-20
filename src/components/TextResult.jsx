import React from "react";

/**
 * Text result display component
 */
const TextResult = ({ text, onDownload }) => {
  if (!text) return null;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Extracted Text</h2>
          <p className="mt-1 text-sm text-slate-600">
            Review, copy, and reuse the recognized content.
          </p>
        </div>
        <button
          onClick={onDownload}
          className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
        >
          Download .doc
        </button>
      </div>
      <pre className="mt-4 max-h-[420px] overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-sm leading-6 text-slate-700 whitespace-pre-wrap">
        {text}
      </pre>
    </div>
  );
};

export default TextResult;
