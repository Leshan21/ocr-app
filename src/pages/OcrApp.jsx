import { useState, useEffect } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

// Hooks
import { useOpenCV, useSpeech, useOCR, useChat } from "../hooks";
import { useAuth } from "../contexts/AuthContext";

// Components
import {
  LanguageSelector,
  PreprocessingOptions,
  ImagePreview,
  ImageUploader,
  ImageCropper,
  SpeechControls,
  ProgressBar,
  TextResult,
  ChatBot,
} from "../components";

function OcrApp() {
  // Image state
  const [originalImage, setOriginalImage] = useState(null);
  const [selectedLangs, setSelectedLangs] = useState(["eng"]);
  const [preprocessing, setPreprocessing] = useState("full");

  // Custom hooks
  const opencv = useOpenCV();
  const speech = useSpeech();
  const ocr = useOCR();
  const chat = useChat();
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Auto-preview when preprocessing option or image changes
  useEffect(() => {
    if (originalImage && opencv.cvReady) {
      opencv.processImage(originalImage, preprocessing);
    }
  }, [preprocessing, originalImage, opencv.cvReady]);

  // Handle image upload
  const handleImageUpload = (imageUrl) => {
    setOriginalImage(imageUrl);
    opencv.clearProcessedImage();
    ocr.clearText();
  };

  const handleCropApply = (croppedImageUrl) => {
    setOriginalImage(croppedImageUrl);
    speech.stop();
    opencv.clearProcessedImage();
    ocr.clearText();
  };

  // Handle text extraction
  const handleExtractText = async () => {
    const imageToProcess = opencv.processedImage || originalImage;
    await ocr.extractText(imageToProcess, selectedLangs);
  };

  // Handle reset
  const handleReset = () => {
    speech.stop();
    setOriginalImage(null);
    opencv.clearProcessedImage();
    ocr.clearText();
  };

  const handleLogout = () => {
    speech.stop();
    logout();
    navigate("/login", { replace: true });
  };

  // Handle copy
  const handleCopy = () => {
    ocr.copyToClipboard();
  };

  const handleDownloadDoc = () => {
    ocr.downloadAsDoc();
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_15%_15%,#dff2ff_0%,transparent_35%),radial-gradient(circle_at_85%_10%,#ffe6d9_0%,transparent_30%),linear-gradient(160deg,#f8fbff_0%,#fdf6ee_55%,#f5f7ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.45)] backdrop-blur md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                OCR Workspace
              </p>
              <h1 className="mt-2 text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
                English, Sinhala, and Tamil OCR + Speech + AI Assistant
              </h1>
              <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">
                Upload an image, choose English, Sinhala, Tamil, or all three,
                then extract text, listen, copy, and chat about the results.
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${
                  opencv.cvReady
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : "border-amber-300 bg-amber-50 text-amber-700"
                }`}
              >
                <span className="text-base">
                  {opencv.cvReady ? "✅" : "⏳"}
                </span>
                <span>
                  {opencv.cvReady ? "OpenCV Ready" : "Loading OpenCV"}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Log Out
              </button>
            </div>
          </div>
        </header>

        <main className="grid gap-6 lg:grid-cols-12">
          <section className="space-y-6 lg:col-span-8">
            <div className="rounded-3xl border border-slate-200/70 bg-white/85 p-5 shadow-sm sm:p-6">
              <ImageUploader onImageUpload={handleImageUpload} />
            </div>

            <div className="rounded-3xl border border-slate-200/70 bg-white/85 p-5 shadow-sm sm:p-6">
              <ImageCropper
                image={originalImage}
                disabled={ocr.loading}
                onApplyCrop={handleCropApply}
              />
            </div>

            <div className="rounded-3xl border border-slate-200/70 bg-white/85 p-5 shadow-sm sm:p-6">
              <PreprocessingOptions
                preprocessing={preprocessing}
                onPreprocessingChange={setPreprocessing}
                disabled={ocr.loading}
                cvReady={opencv.cvReady}
              />
            </div>

            <div className="rounded-3xl border border-slate-200/70 bg-white/85 p-5 shadow-sm sm:p-6">
              <LanguageSelector
                selectedLangs={selectedLangs}
                onLanguageChange={setSelectedLangs}
                disabled={ocr.loading}
              />
            </div>

            <div className="rounded-3xl border border-slate-200/70 bg-white/85 p-5 shadow-sm sm:p-6">
              <ImagePreview
                originalImage={originalImage}
                processedImage={opencv.processedImage}
                preprocessing={preprocessing}
                isProcessing={opencv.isProcessing}
              />
            </div>
          </section>

          <section className="space-y-6 lg:col-span-4">
            <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold text-slate-900">Actions</h2>
              <p className="mt-1 text-sm text-slate-600">
                Run OCR extraction and manage this workspace.
              </p>
              <div className="mt-4 grid gap-3">
                <button
                  onClick={handleExtractText}
                  disabled={!originalImage || ocr.loading}
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {ocr.loading
                    ? `Extracting text... ${ocr.progress}%`
                    : "Extract Text"}
                </button>
                <button
                  onClick={handleReset}
                  disabled={ocr.loading}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                >
                  Reset All
                </button>
              </div>
              <div className="mt-4">
                <ProgressBar progress={ocr.progress} visible={ocr.loading} />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-sm sm:p-6">
              <SpeechControls
                text={ocr.text}
                selectedLangs={selectedLangs}
                speech={speech}
                onCopy={handleCopy}
              />
            </div>
          </section>
        </main>

        <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-sm sm:p-6">
          <TextResult text={ocr.text} onDownload={handleDownloadDoc} />
        </section>

        <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-sm sm:p-6">
          <ChatBot text={ocr.text} chat={chat} />
        </section>

        {ocr.error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            ❌ {ocr.error}
          </div>
        )}

        {/* Hidden canvas for OpenCV processing */}
        <canvas ref={opencv.canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
}

export default OcrApp;
