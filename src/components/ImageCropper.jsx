import React, { useEffect, useState } from "react";
import { cropImage } from "../utils/imageProcessing";

const defaultCrop = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const ImageCropper = ({ image, disabled = false, onApplyCrop }) => {
  const [crop, setCrop] = useState(defaultCrop);
  const [isCropping, setIsCropping] = useState(false);

  useEffect(() => {
    setCrop(defaultCrop);
  }, [image]);

  if (!image) return null;

  const setPreset = (value) => {
    setCrop({ top: value, right: value, bottom: value, left: value });
  };

  const handleApplyCrop = async () => {
    setIsCropping(true);
    try {
      const croppedImage = await cropImage(image, crop);
      onApplyCrop(croppedImage);
      setCrop(defaultCrop);
    } catch (error) {
      console.error("Crop failed:", error);
    } finally {
      setIsCropping(false);
    }
  };

  const handleChange = (key) => (event) => {
    setCrop((current) => ({
      ...current,
      [key]: Number(event.target.value),
    }));
  };

  const totalHorizontal = crop.left + crop.right;
  const totalVertical = crop.top + crop.bottom;
  const hasCrop = totalHorizontal > 0 || totalVertical > 0;

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Crop Image</h2>
          <p className="mt-1 text-sm text-slate-600">
            Trim the edges before preprocessing and OCR.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPreset(0)}
            disabled={disabled || isCropping}
            className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Full Image
          </button>
          <button
            type="button"
            onClick={() => setPreset(5)}
            disabled={disabled || isCropping}
            className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Light Crop
          </button>
          <button
            type="button"
            onClick={() => setPreset(10)}
            disabled={disabled || isCropping}
            className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Medium Crop
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <img
            src={image}
            alt="Crop preview"
            className="max-h-72 w-full rounded-xl border border-slate-200 bg-white object-contain"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">
              Top trim: {crop.top}%
              <input
                type="range"
                min="0"
                max="40"
                value={crop.top}
                onChange={handleChange("top")}
                disabled={disabled || isCropping}
                className="mt-2 w-full accent-sky-600"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Bottom trim: {crop.bottom}%
              <input
                type="range"
                min="0"
                max="40"
                value={crop.bottom}
                onChange={handleChange("bottom")}
                disabled={disabled || isCropping}
                className="mt-2 w-full accent-sky-600"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Left trim: {crop.left}%
              <input
                type="range"
                min="0"
                max="40"
                value={crop.left}
                onChange={handleChange("left")}
                disabled={disabled || isCropping}
                className="mt-2 w-full accent-sky-600"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Right trim: {crop.right}%
              <input
                type="range"
                min="0"
                max="40"
                value={crop.right}
                onChange={handleChange("right")}
                disabled={disabled || isCropping}
                className="mt-2 w-full accent-sky-600"
              />
            </label>

            {hasCrop && (
              <p className="rounded-xl bg-sky-50 px-3 py-2 text-xs font-medium text-sky-700">
                Crop preview: removing {totalVertical}% from height and{" "}
                {totalHorizontal}% from width.
              </p>
            )}

            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleApplyCrop}
                disabled={disabled || isCropping || !hasCrop}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isCropping ? "Cropping..." : "Apply Crop"}
              </button>
              <button
                type="button"
                onClick={() => setCrop(defaultCrop)}
                disabled={disabled || isCropping}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              >
                Reset Crop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
