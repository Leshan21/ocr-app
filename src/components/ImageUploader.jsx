import React from "react";

/**
 * Image upload component
 */
const ImageUploader = ({ onImageUpload }) => {
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImageUpload(url);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900">Upload Image</h2>
      <p className="mt-1 text-sm text-slate-600">
        Pick a photo, scan, or screenshot to extract text.
      </p>
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        id="file-input"
        className="sr-only"
      />
      <label
        htmlFor="file-input"
        className="mt-4 inline-flex w-full cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5 hover:shadow-cyan-200 sm:w-auto"
      >
        📁 Choose Image
      </label>
    </div>
  );
};

export default ImageUploader;
