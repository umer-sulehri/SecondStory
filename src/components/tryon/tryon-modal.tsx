"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Upload, X, RotateCcw, Download, Loader2 } from "lucide-react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { toast } from "@/store/toast";
import { useTryOnHistory } from "@/store/tryon-history";
import { BeforeAfter } from "@/components/tryon/before-after";

type Stage = "upload" | "processing" | "result";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
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
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const addHistory = useTryOnHistory((s) => s.add);

  const reset = useCallback(() => {
    setStage("upload");
    setUserImage(null);
    setResult(null);
  }, []);

  function handleClose() {
    onClose();
    setTimeout(reset, 300);
  }

  function validateAndRead(file: File) {
    if (!ACCEPTED.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image is too large. Max size is 8MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      // Compress the image before storing so we don't hit Vercel's 4.5MB body limit
      compressImage(reader.result as string, 800, 0.75).then((compressed) =>
        setUserImage(compressed)
      );
    };
    reader.readAsDataURL(file);
  }

  function compressImage(
    dataUrl: string,
    maxDim: number,
    quality: number
  ): Promise<string> {
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
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
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
      if (!res.ok) throw new Error("Generation failed");
      const data = (await res.json()) as { image: string };
      setResult(data.image);
      setStage("result");
      addHistory({
        id: Math.random().toString(36).slice(2),
        productId: product.id,
        userImageUrl: userImage,
        resultImageUrl: data.image,
        createdAt: new Date().toISOString(),
      });
    } catch {
      toast.error("Couldn't generate the preview. Please try again.");
      setStage("upload");
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
            className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-5">
              <div className="flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-xl bg-primary-light text-primary">
                  <Sparkles className="size-5" />
                </span>
                <div>
                  <h2 className="font-semibold">Virtual Try-On</h2>
                  <p className="text-xs text-text-secondary">{product.name}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close"
                className="grid size-9 place-items-center rounded-xl text-text-secondary transition-colors hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Upload */}
              {stage === "upload" && (
                <div className="space-y-4">
                  {userImage ? (
                    <div className="relative mx-auto aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl border border-border">
                      <Image src={userImage} alt="Your upload" fill className="object-cover" />
                      <button
                        onClick={() => setUserImage(null)}
                        className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-black/60 text-white"
                        aria-label="Remove image"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => inputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                      }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={onDrop}
                      className={`flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed transition-colors ${
                        dragging
                          ? "border-primary bg-primary-light"
                          : "border-border bg-background hover:border-primary"
                      }`}
                    >
                      <span className="grid size-14 place-items-center rounded-2xl bg-primary-light text-primary">
                        <Upload className="size-6" />
                      </span>
                      <span className="font-medium">Drop your photo here</span>
                      <span className="text-sm text-text-secondary">
                        or click to browse · JPG, PNG, WebP · max 8MB
                      </span>
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
                    }}
                  />
                  <Button onClick={generate} disabled={!userImage} className="w-full" size="lg">
                    <Sparkles className="size-4" />
                    Generate preview
                  </Button>
                  <p className="text-center text-xs text-text-secondary">
                    For best results, use a clear, front-facing full-body photo.
                  </p>
                </div>
              )}

              {/* Processing */}
              {stage === "processing" && (
                <div className="flex flex-col items-center justify-center gap-4 py-16">
                  <Loader2 className="size-12 animate-spin text-primary" />
                  <p className="font-medium">Generating your preview…</p>
                  <p className="text-sm text-text-secondary">
                    Our AI is dressing you up. This takes a few seconds.
                  </p>
                </div>
              )}

              {/* Result */}
              {stage === "result" && userImage && result && (
                <div className="space-y-4">
                  <BeforeAfter before={userImage} after={result} />
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={generate} className="flex-1">
                      <RotateCcw className="size-4" />
                      Retry
                    </Button>
                    <Button variant="secondary" onClick={download} className="flex-1">
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
