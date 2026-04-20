import React from "react";

/**
 * Text-to-speech controls component with auto-detect support
 */
const SpeechControls = ({ text, selectedLangs, speech, onCopy }) => {
  const {
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
    voices,
  } = speech;

  if (!text) return null;

  const handleSpeak = () => {
    speak(text, selectedLangs);
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900">Text-to-Speech</h2>
      <p className="mt-1 text-sm text-slate-600">
        Listen to extracted English, Sinhala, or Tamil text with manual or
        automatic voice selection.
      </p>

      <div className="mt-4">
        <label className="text-sm font-semibold text-slate-700">
          Select Voice
        </label>
        <div className="mt-2 flex max-h-48 flex-wrap gap-2 overflow-y-auto rounded-2xl border border-slate-200 p-3">
          {voices.map((voice) => (
            <label
              key={voice.code}
              className={`inline-flex cursor-pointer items-center rounded-full border px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
                selectedVoice === voice.code
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
              } ${isSpeaking ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <input
                type="radio"
                name="voice"
                value={voice.code}
                checked={selectedVoice === voice.code}
                onChange={(e) => setSelectedVoice(e.target.value)}
                disabled={isSpeaking}
                className="sr-only"
              />
              <span>{voice.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Auto-detect indicator */}
      {selectedVoice === "auto" && detectedLanguage && isSpeaking && (
        <div className="mt-3 inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800 sm:text-sm">
          🔮 Auto-detected: <strong>{getDetectedLanguageName()}</strong>
        </div>
      )}

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {!isSpeaking ? (
          <button
            onClick={handleSpeak}
            className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            ▶️ Play
          </button>
        ) : isPaused ? (
          <button
            onClick={resume}
            className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            ▶️ Resume
          </button>
        ) : (
          <button
            onClick={pause}
            className="rounded-xl bg-amber-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-amber-400"
          >
            ⏸️ Pause
          </button>
        )}

        <button
          onClick={stop}
          className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-rose-300"
          disabled={!isSpeaking && !isPaused}
        >
          ⏹️ Stop
        </button>

        <button
          onClick={onCopy}
          className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          📋 Copy Text
        </button>
      </div>

      {isSpeaking && (
        <div className="mt-3 inline-flex animate-pulse items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 sm:text-sm">
          {isPaused ? "⏸️ Paused" : "🔊 Speaking..."}
        </div>
      )}
    </div>
  );
};

export default SpeechControls;
