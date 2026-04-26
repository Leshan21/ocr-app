import { useState, useCallback } from "react";
import Tesseract from "tesseract.js";
import { Document, Packer, Paragraph, TextRun } from "docx";

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
   * Download extracted text as a .docx file
   */
  const downloadAsDoc = useCallback(async () => {
    if (!text) return false;

    try {
      const paragraphs = text.split(/\r?\n/).map((line) =>
        new Paragraph({
          children: [
            new TextRun({
              text: line || " ",
            }),
          ],
        }),
      );

      const doc = new Document({
        sections: [
          {
            children: paragraphs,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ocr-text-${Date.now()}.docx`;
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
