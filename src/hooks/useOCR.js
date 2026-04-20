import { useState, useCallback } from "react";
import Tesseract from "tesseract.js";

/**
 * Custom hook for OCR functionality
 * @returns {Object} OCR state and functions
 */
export const useOCR = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  /**
   * Extract text from an image
   * @param {string} imageUrl - URL of the image to process
   * @param {string[]} languages - Array of language codes
   */
  const extractText = useCallback(async (imageUrl, languages = ["eng"]) => {
    if (!imageUrl) return;

    setLoading(true);
    setProgress(0);
    setError(null);

    try {
      const langString = languages.join("+");

      const {
        data: { text },
      } = await Tesseract.recognize(imageUrl, langString, {
        logger: (m) => {
          console.log(m);
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      setText(text);
      return text;
    } catch (err) {
      console.error("OCR Error:", err);
      setError("Error extracting text. Please try again.");
      setText("");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear extracted text
   */
  const clearText = useCallback(() => {
    setText("");
    setError(null);
    setProgress(0);
  }, []);

  /**
   * Copy text to clipboard
   */
  const copyToClipboard = useCallback(async () => {
    if (text) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.error("Copy failed:", err);
        return false;
      }
    }
    return false;
  }, [text]);

  /**
   * Download extracted text as a .doc file
   */
  const downloadAsDoc = useCallback(() => {
    if (!text) return false;

    try {
      const escapedText = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>");

      const htmlDoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>OCR Text</title></head><body>${escapedText}</body></html>`;
      const blob = new Blob([htmlDoc], {
        type: "application/msword;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ocr-text-${Date.now()}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      console.error("Download failed:", err);
      return false;
    }
  }, [text]);

  return {
    text,
    loading,
    progress,
    error,
    extractText,
    clearText,
    copyToClipboard,
    downloadAsDoc,
  };
};

export default useOCR;
