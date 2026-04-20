import { useState, useCallback } from "react";
import { TTS_VOICES, VOICE_MAP } from "../constants/languages";
import {
  detectLanguage,
  getVoiceForLanguage,
} from "../utils/languageDetection";

/**
 * Custom hook for text-to-speech functionality
 * @returns {Object} Speech state and control functions
 */
export const useSpeech = () => {
  const [selectedVoice, setSelectedVoice] = useState("auto");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState(null);

  /**
   * Speak the given text
   * @param {string} text - Text to speak
   * @param {string[]} selectedLangs - OCR languages selected (for hints)
   */
  const speak = useCallback(
    (text, selectedLangs = []) => {
      if (!text || !window.responsiveVoice) return;

      let voice;

      if (selectedVoice === "auto") {
        // Auto-detect language from text
        const detected = detectLanguage(text, selectedLangs);
        setDetectedLanguage(detected);
        voice = getVoiceForLanguage(detected);
      } else {
        // Use selected voice
        const voiceConfig = TTS_VOICES.find((v) => v.code === selectedVoice);
        voice = voiceConfig?.voice || "UK English Female";
        setDetectedLanguage(null);
      }

      window.responsiveVoice.speak(text, voice, {
        onstart: () => {
          setIsSpeaking(true);
          setIsPaused(false);
        },
        onend: () => {
          setIsSpeaking(false);
          setIsPaused(false);
          setDetectedLanguage(null);
        },
      });
    },
    [selectedVoice],
  );

  /**
   * Pause speech
   */
  const pause = useCallback(() => {
    if (window.responsiveVoice && isSpeaking) {
      window.responsiveVoice.pause();
      setIsPaused(true);
    }
  }, [isSpeaking]);

  /**
   * Resume speech
   */
  const resume = useCallback(() => {
    if (window.responsiveVoice && isPaused) {
      window.responsiveVoice.resume();
      setIsPaused(false);
    }
  }, [isPaused]);

  /**
   * Stop speech
   */
  const stop = useCallback(() => {
    if (window.responsiveVoice) {
      window.responsiveVoice.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setDetectedLanguage(null);
    }
  }, []);

  /**
   * Get display name for detected language
   */
  const getDetectedLanguageName = useCallback(() => {
    if (!detectedLanguage) return null;
    const lang = TTS_VOICES.find((v) => v.code === detectedLanguage);
    return lang?.name || detectedLanguage;
  }, [detectedLanguage]);

  return {
    selectedVoice,
    setSelectedVoice,
    isSpeaking,
    isPaused,
    detectedLanguage,
    speak,
    pause,
    resume,
    stop,
    getDetectedLanguageName,
    voices: TTS_VOICES,
  };
};

export default useSpeech;
