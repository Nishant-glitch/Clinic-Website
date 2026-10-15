"use client";

import * as React from "react";
import imageCompression from "browser-image-compression";
import { UploadCloud, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
  label?: string;
  aspectRatio?: string;
}

export function ImageUploader({
  value,
  onChange,
  className,
  label = "Upload Image",
  aspectRatio = "aspect-video",
}: ImageUploaderProps) {
  const [isCompressing, setIsCompressing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [previewUrl, setPreviewUrl] = React.useState(value || "");
  const [prevValue, setPrevValue] = React.useState(value);
  const [fileDetails, setFileDetails] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (value !== prevValue) {
    setPrevValue(value);
    setPreviewUrl(value || "");
  }

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    try {
      setIsCompressing(true);
      setProgress(15);

      const options = {
        maxSizeMB: 1.0,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
        fileType: "image/webp",
        onProgress: (p: number) => {
          setProgress(Math.round(p));
        },
      };

      setProgress(30);
      const compressedBlob = await imageCompression(file, options);
      setProgress(85);

      // Create a local blob object URL for preview
      const localUrl = URL.createObjectURL(compressedBlob);
      setPreviewUrl(localUrl);
      setFileDetails(
        `Compressed to WebP: ${(compressedBlob.size / 1024).toFixed(0)} KB (from ${(
          file.size / 1024
        ).toFixed(0)} KB)`
      );
      setProgress(100);

      // In Step 4/5, this will upload to Firebase Storage /public/**
      onChange(localUrl);
    } catch (err) {
      console.error("Compression error:", err);
      // Fallback to raw object URL
      const fallbackUrl = URL.createObjectURL(file);
      setPreviewUrl(fallbackUrl);
      onChange(fallbackUrl);
    } finally {
      setTimeout(() => {
        setIsCompressing(false);
        setProgress(0);
      }, 400);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <span className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          {label}
        </span>
      )}

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-low transition-all duration-200 hover:border-primary hover:bg-surface-container",
          aspectRatio,
          "flex flex-col items-center justify-center p-4 text-center"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />

        {previewUrl ? (
          <div className="relative h-full w-full">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover rounded-xl"
              unoptimized={previewUrl.startsWith("blob:") || previewUrl.startsWith("data:")}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
              <span className="rounded-full bg-surface/90 px-3.5 py-1.5 text-xs font-semibold text-on-surface shadow-md">
                Click to change image
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-on-surface-variant">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high text-primary group-hover:scale-105 transition-transform">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs sm:text-sm font-medium text-on-surface">
                Drop image here or click to browse
              </p>
              <p className="text-[11px] text-on-surface-variant/80">
                Auto-compressed to WebP (max 1600px)
              </p>
            </div>
          </div>
        )}

        {/* Compression loading indicator */}
        {isCompressing && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-surface/90 backdrop-blur-xs p-4">
            <Loader2 className="h-7 w-7 text-primary animate-spin mb-2" />
            <p className="text-xs font-semibold text-on-surface">
              Compressing & optimizing WebP ({progress}%)...
            </p>
            <div className="mt-2 h-1.5 w-44 overflow-hidden rounded-full bg-surface-variant">
              <div
                className="h-full bg-primary transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {fileDetails && (
        <p className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
          <CheckCircle className="h-3.5 w-3.5" />
          <span>{fileDetails}</span>
        </p>
      )}
    </div>
  );
}
