/**
 * Image preprocessing utilities using OpenCV.js
 */

/**
 * Apply preprocessing to an image using OpenCV
 * @param {HTMLImageElement} imgElement - The image element to process
 * @param {HTMLCanvasElement} canvas - Canvas element for processing
 * @param {string} preprocessingType - Type of preprocessing to apply
 * @returns {Promise<string|null>} - Data URL of processed image or null
 */
export const preprocessImage = (imgElement, canvas, preprocessingType) => {
  return new Promise((resolve) => {
    if (!window.cv || !window.cv.Mat || preprocessingType === "none") {
      resolve(null);
      return;
    }

    const cv = window.cv;
    const ctx = canvas.getContext("2d");

    // Draw image to canvas
    canvas.width = imgElement.naturalWidth;
    canvas.height = imgElement.naturalHeight;
    ctx.drawImage(imgElement, 0, 0);

    // Read image from canvas
    let src = cv.imread(canvas);
    let dst = new cv.Mat();

    try {
      switch (preprocessingType) {
        case "grayscale":
          cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
          break;

        case "threshold":
          cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
          cv.adaptiveThreshold(
            dst,
            dst,
            255,
            cv.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv.THRESH_BINARY,
            11,
            2,
          );
          break;

        case "denoise":
          cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
          cv.GaussianBlur(dst, dst, new cv.Size(3, 3), 0);
          break;

        case "sharpen":
          cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
          let sharpKernel = cv.matFromArray(
            3,
            3,
            cv.CV_32F,
            [0, -1, 0, -1, 5, -1, 0, -1, 0],
          );
          cv.filter2D(dst, dst, -1, sharpKernel);
          sharpKernel.delete();
          break;

        case "full":
        default:
          applyFullEnhancement(cv, src, dst);
          break;
      }

      // Write result to canvas
      cv.imshow(canvas, dst);
      const processedDataUrl = canvas.toDataURL("image/png");
      resolve(processedDataUrl);
    } catch (error) {
      console.error("OpenCV Error:", error);
      resolve(null);
    } finally {
      src.delete();
      dst.delete();
    }
  });
};

/**
 * Crop an image by trimming percentage margins from each edge
 * @param {string} imageUrl - Image URL to crop
 * @param {Object} crop - Crop margins in percentages
 * @returns {Promise<string>} - Cropped image data URL
 */
export const cropImage = (imageUrl, crop) => {
  return new Promise((resolve, reject) => {
    if (!imageUrl) {
      reject(new Error("No image provided"));
      return;
    }

    const imgElement = document.createElement("img");
    imgElement.crossOrigin = "anonymous";
    imgElement.src = imageUrl;

    imgElement.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const left = Math.max(0, Math.min(40, crop.left || 0));
      const right = Math.max(0, Math.min(40, crop.right || 0));
      const top = Math.max(0, Math.min(40, crop.top || 0));
      const bottom = Math.max(0, Math.min(40, crop.bottom || 0));

      const sourceWidth = imgElement.naturalWidth;
      const sourceHeight = imgElement.naturalHeight;

      const x = Math.round((sourceWidth * left) / 100);
      const y = Math.round((sourceHeight * top) / 100);
      const width = Math.max(
        1,
        Math.round(sourceWidth - (sourceWidth * (left + right)) / 100),
      );
      const height = Math.max(
        1,
        Math.round(sourceHeight - (sourceHeight * (top + bottom)) / 100),
      );

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(imgElement, x, y, width, height, 0, 0, width, height);

      resolve(canvas.toDataURL("image/png"));
    };

    imgElement.onerror = () => {
      reject(new Error("Failed to load image"));
    };
  });
};

/**
 * Apply full enhancement pipeline for best OCR results
 */
const applyFullEnhancement = (cv, src, dst) => {
  // 1. Convert to grayscale
  cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);

  // 2. Increase contrast using CLAHE
  let clahe = new cv.CLAHE(2.0, new cv.Size(8, 8));
  clahe.apply(dst, dst);
  clahe.delete();

  // 3. Denoise
  cv.GaussianBlur(dst, dst, new cv.Size(3, 3), 0);

  // 4. Sharpen
  let kernel = cv.matFromArray(
    3,
    3,
    cv.CV_32F,
    [0, -1, 0, -1, 5, -1, 0, -1, 0],
  );
  cv.filter2D(dst, dst, -1, kernel);
  kernel.delete();

  // 5. Apply adaptive threshold for clean text
  cv.adaptiveThreshold(
    dst,
    dst,
    255,
    cv.ADAPTIVE_THRESH_GAUSSIAN_C,
    cv.THRESH_BINARY,
    15,
    8,
  );

  // 6. Morphological operations to clean up
  let morphKernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(1, 1));
  cv.morphologyEx(dst, dst, cv.MORPH_CLOSE, morphKernel);
  morphKernel.delete();
};

/**
 * Check if OpenCV is loaded and ready
 * @returns {boolean}
 */
export const isOpenCVReady = () => {
  return window.cv && window.cv.Mat;
};
