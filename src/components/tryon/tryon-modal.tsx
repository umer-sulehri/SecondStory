"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Upload,
  X,
  RotateCcw,
  Download,
  Loader2,
  Shirt,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { toast } from "@/store/toast";
import { useTryOnHistory } from "@/store/tryon-history";
import { BeforeAfter } from "@/components/tryon/before-after";

type Stage = "upload" | "processing" | "result" | "error";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB upload limit
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export function TryOnModal({
  product,
  open,
  onClose,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
}) {
  const [stage, setStage] = useState<Stage>("upload");
  const [userImage, setUserImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [detectedType, setDetectedType] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const addHistory = useTryOnHistory((s) => s.add);

  const PROCESSING_STEPS = [
    "Analyzing product type…",
    "Detecting person in your photo…",
    "Compositing outfit onto your photo…",
    "Finalizing realistic preview…",
  ];

  const reset = useCallback(() => {
    setStage("upload");
    setUserImage(null);
    setResult(null);
    setDetectedType(null);
    setErrorMsg(null);
    setProcessingStep(0);
  }, []);

  function handleClose() {
    onClose();
    setTimeout(reset, 300);
  }

  /** Compress and validate uploaded image */
  function validateAndRead(file: File) {
    if (!ACCEPTED.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image too large — max 8MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      // Compress to max 900px, 80% quality to stay under Vercel's 4.5MB limit
      compressImage(reader.result as string, 900, 0.8).then(setUserImage);
    };
    reader.readAsDataURL(file);
  }

  function compressImage(dataUrl: string, maxDim: number, quality: number): Promise<string> {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = dataUrl;
    });
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndRead(file);
  }

  async function generate() {
    if (!userImage) return;
    setStage("processing");
    setProcessingStep(0);
    setErrorMsg(null);

    // Animate through processing steps while waiting
    const stepInterval = setInterval(() => {
      setProcessingStep((p) => Math.min(p + 1, PROCESSING_STEPS.length - 1));
    }, 3500);

    try {
      const res = await fetch("/api/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userImage,
          productImage: product.thumbnail,
          productName: product.name,
        }),
      });

      clearInterval(stepInterval);
      setProcessingStep(PROCESSING_STEPS.length - 1);

      const data = await res.json() as {
        image?: string;
        detected?: string;
        error?: string;
        simulated?: boolean;
      };

      if (!res.ok || !data.image) {
        // Surface the real error to the user
        const msg = data.error ?? "Generation failed. Please try again.";
        setErrorMsg(msg);
        setDetectedType(data.detected ?? null);
        setStage("error");
        return;
      }

      setResult(data.image);
      setDetectedType(data.detected ?? null);
      setStage("result");

      addHistory({
        id: Math.random().toString(36).slice(2),
        productId: product.id,
        userImageUrl: userImage,
        resultImageUrl: data.image,
        createdAt: new Date().toISOString(),
      });

      if (data.simulated) {
        toast.info("Demo mode: Add a Gemini API key for real AI try-on.");
      }
    } catch (err) {
      clearInterval(stepInterval);
      console.error("[tryon modal]", err);
      setErrorMsg("Network error. Please check your connection and try again.");
      setStage("error");
    }
  }

  function download() {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = `secondstory-tryon-${product.slug}.png`;
    a.click();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label="AI virtual try-on"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between border-b border-border p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-primary-light text-primary">
                  <Sparkles className="size-5" />
                </span>
                <div>
                  <h2 className="font-semibold">AI Virtual Try-On</h2>
                  <p className="text-xs text-text-secondary truncate max-w-xs">{product.name}</p>
                </div>
                {detectedType && (
                  <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-primary-light px-3 py-0.5 text-xs font-medium text-primary">
                    <Shirt className="size-3" />
                    {detectedType}
                  </span>
                )}
              </div>
              <button
                onClick={handleClose}
                aria-label="Close"
                className="grid size-9 place-items-center rounded-xl text-text-secondary transition-colors hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 overflow-y-auto p-6">

              {/* Product preview strip */}
              <div className="mb-5 flex items-center gap-3 rounded-2xl border border-border bg-slate-50 p-3">
                <div className="relative size-14 overflow-hidden rounded-xl border border-border shrink-0">
                  <Image src={product.thumbnail} alt={product.name} fill sizes="56px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Product to try on</p>
                  <p className="font-medium text-text-primary text-sm truncate">{product.name}</p>
                </div>
              </div>

              {/* ── Stage: Upload ── */}
              {stage === "upload" && (
                <div className="space-y-4">
                  {userImage ? (
                    <div className="relative mx-auto aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl border-2 border-primary/30">
                      <Image src={userImage} alt="Your photo" fill className="object-cover" />
                      <button
                        onClick={() => setUserImage(null)}
                        className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                        aria-label="Remove photo"
                      >
                        <X className="size-4" />
                      </button>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <div className="flex items-center gap-1.5 text-white">
                          <CheckCircle2 className="size-4 text-emerald-400" />
                          <span className="text-xs font-medium">Photo ready</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => inputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={onDrop}
                      className={`flex aspect-video w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed transition-all ${
                        dragging
                          ? "border-primary bg-primary-light scale-[1.01]"
                          : "border-border bg-slate-50 hover:border-primary hover:bg-primary-light/40"
                      }`}
                    >
                      <span className="grid size-16 place-items-center rounded-2xl bg-primary-light text-primary">
                        <Upload className="size-7" />
                      </span>
                      <div className="text-center">
                        <p className="font-semibold text-text-primary">Upload your full-body photo</p>
                        <p className="mt-1 text-sm text-text-secondary">
                          Drag & drop or click · JPG, PNG, WebP · max 8MB
                        </p>
                      </div>
                    </button>
                  )}
                  <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPTED.join(",")}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) validateAndRead(file);
                      e.target.value = "";
                    }}
                  />
                  <Button onClick={generate} disabled={!userImage} className="w-full" size="lg">
                    <Sparkles className="size-5" />
                    Generate AI Try-On
                  </Button>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs text-text-secondary">
                    <div className="rounded-xl border border-border bg-slate-50 p-2">✅ Clothing</div>
                    <div className="rounded-xl border border-border bg-slate-50 p-2">✅ Shoes</div>
                    <div className="rounded-xl border border-border bg-slate-50 p-2">✅ Accessories</div>
                  </div>
                  <p className="text-center text-xs text-text-secondary leading-relaxed">
                    For best results, use a clear front-facing full-body photo with good lighting.
                    Gemini AI detects the product type automatically.
                  </p>
                </div>
              )}

              {/* ── Stage: Processing ── */}
              {stage === "processing" && (
                <div className="flex flex-col items-center justify-center gap-6 py-12">
                  <div className="relative">
                    <div className="size-24 rounded-full border-4 border-primary-light flex items-center justify-center">
                      <Sparkles className="size-10 text-primary animate-pulse" />
                    </div>
                    <div className="absolute inset-0 size-24 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-semibold text-text-primary text-lg">Generating your preview…</p>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={processingStep}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="text-sm text-text-secondary"
                      >
                        {PROCESSING_STEPS[processingStep]}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  {/* Step indicators */}
                  <div className="flex gap-2">
                    {PROCESSING_STEPS.map((_, i) => (
                      <span
                        key={i}
                        className={`size-2 rounded-full transition-colors ${
                          i <= processingStep ? "bg-primary" : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-text-secondary">
                    This usually takes 10–30 seconds. Please wait.
                  </p>
                </div>
              )}

              {/* ── Stage: Error ── */}
              {stage === "error" && (
                <div className="space-y-5">
                  <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
                    <span className="grid size-14 place-items-center rounded-2xl bg-red-100 text-error">
                      <AlertCircle className="size-7" />
                    </span>
                    <div>
                      <p className="font-semibold text-text-primary">Generation failed</p>
                      <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                        {errorMsg ?? "An unknown error occurred."}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={reset} className="flex-1">
                      <RotateCcw className="size-4" />
                      Try again
                    </Button>
                    <Button variant="outline" onClick={handleClose} className="flex-1">
                      <X className="size-4" />
                      Cancel
                    </Button>
                  </div>
                  <div className="rounded-2xl border border-border bg-slate-50 p-4 text-xs text-text-secondary space-y-2">
                    <p className="font-semibold text-text-primary">Tips for better results:</p>
                    <ul className="space-y-1 list-disc pl-4">
                      <li>Use a clear, well-lit full-body photo</li>
                      <li>Stand facing the camera directly</li>
                      <li>Avoid busy backgrounds</li>
                      <li>Make sure your face and body are clearly visible</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* ── Stage: Result ── */}
              {stage === "result" && userImage && result && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-2.5">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <p className="text-sm text-emerald-700 font-medium">
                      Try-on complete!
                      {detectedType ? ` Detected: ${detectedType}.` : ""}
                    </p>
                  </div>
                  <BeforeAfter before={userImage} after={result} />
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={generate} className="flex-1">
                      <RotateCcw className="size-4" />
                      Regenerate
                    </Button>
                    <Button variant="outline" onClick={reset} className="flex-1">
                      <Upload className="size-4" />
                      New photo
                    </Button>
                    <Button onClick={download} className="flex-1">
                      <Download className="size-4" />
                      Download
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
