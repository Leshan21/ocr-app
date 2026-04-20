import { useState, useEffect, useRef, useCallback } from "react";
import { preprocessImage, isOpenCVReady } from "../utils/imageProcessing";

/**
 * Custom hook for OpenCV image processing
 * @returns {Object} OpenCV state and functions
 */
export const useOpenCV = () => {
  const [cvReady, setCvReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);
  const canvasRef = useRef(null);

  // Check if OpenCV is loaded
  useEffect(() => {
    const checkCv = () => {
      if (isOpenCVReady()) {
        setCvReady(true);
      } else {
        setTimeout(checkCv, 100);
      }
    };
    checkCv();
  }, []);

  /**
   * Process an image with the specified preprocessing type
   */
  const processImage = useCallback(
    async (imageUrl, preprocessingType) => {
      if (!cvReady || !imageUrl || preprocessingType === "none") {
        setProcessedImage(null);
        return null;
      }

      setIsProcessing(true);

      const imgElement = document.createElement("img");
      imgElement.src = imageUrl;

      await new Promise((resolve) => {
        imgElement.onload = resolve;
      });

      const result = await preprocessImage(
        imgElement,
        canvasRef.current,
        preprocessingType,
      );
      setProcessedImage(result);
      setIsProcessing(false);

      return result;
    },
    [cvReady],
  );

  /**
   * Clear processed image
   */
  const clearProcessedImage = useCallback(() => {
    setProcessedImage(null);
  }, []);

  return {
    cvReady,
    isProcessing,
    processedImage,
    canvasRef,
    processImage,
    clearProcessedImage,
  };
};

export default useOpenCV;
