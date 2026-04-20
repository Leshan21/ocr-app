import React from "react";
import { PREPROCESS_OPTIONS } from "../constants/languages";

/**
 * Image preview component showing original and processed images
 */
const ImagePreview = ({
  originalImage,
  processedImage,
  preprocessing,
  isProcessing,
}) => {
  if (!originalImage) return null;

  const preprocessingName = PREPROCESS_OPTIONS.find(
    (o) => o.id === preprocessing,
  )?.name;

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900">Image Preview</h2>
      <p className="mt-1 text-sm text-slate-600">
        Compare original and processed images before extraction.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            Original Image
          </h3>
          <img
            src={originalImage}
            alt="original"
            className="h-72 w-full rounded-xl border border-slate-200 object-contain bg-white"
          />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            Preprocessed Image{" "}
            {preprocessing !== "none" && `(${preprocessingName})`}
          </h3>
          {preprocessing === "none" ? (
            <div className="flex h-72 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center text-slate-500">
              <p className="font-medium">No preprocessing selected</p>
              <small className="mt-1 block text-xs">
                Select a preprocessing option above to enhance the image
              </small>
            </div>
          ) : isProcessing ? (
            <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-cyan-300 bg-cyan-50 text-cyan-700">
              <p className="font-medium">⏳ Processing...</p>
            </div>
          ) : processedImage ? (
            <img
              src={processedImage}
              alt="processed"
              className="h-72 w-full rounded-xl border border-slate-200 object-contain bg-white"
            />
          ) : (
            <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-amber-300 bg-amber-50 text-amber-700">
              <p className="font-medium">⏳ Waiting for OpenCV...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
