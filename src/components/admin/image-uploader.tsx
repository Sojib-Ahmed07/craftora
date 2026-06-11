"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const uploadedUrls: string[] = [...value];

      // Loop through all selected images and post them sequentially to Cloudinary
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        // This must match your exact Cloudinary Unsigned Upload Preset name
        formData.append("upload_preset", "craftora_products"); 

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!res.ok) {
          throw new Error("Failed to upload image to Cloudinary infrastructure.");
        }

        const data = await res.json();
        // Append the secure HTTPS asset link returned from Cloudinary
        uploadedUrls.push(data.secure_url);
      }

      // Update the parent state
      onChange(uploadedUrls);
    } catch (error) {
      console.error("CLOUDINARY_UPLOAD_ERROR:", error);
      alert("Image uploading failed. Please verify your environment variables and Cloudinary Preset configurations.");
    } finally {
      setIsUploading(false);
      // Reset input element value so the same image file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (urlToRemove: string) => {
    onChange(value.filter((url) => url !== urlToRemove));
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-neutral-800">
          Product Images Assets
        </label>
        <span className="text-xs text-neutral-400 font-mono">
          {value.length} image{value.length !== 1 ? "s" : ""} selected
        </span>
      </div>

      {/* Image Thumbnail Grid Previews */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {value.map((url) => (
            <div
              key={url}
              className="relative aspect-square border border-neutral-200 rounded-xl overflow-hidden bg-neutral-100 group shadow-xs animate-in fade-in zoom-in duration-150"
            >
              <img
                src={url}
                alt="Product Preview Thumbnail"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Floating Delete Badge Trigger Option */}
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute top-2 right-2 p-1.5 bg-neutral-900/80 backdrop-blur-xs text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 shadow-sm"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropzone Trigger Zone Container Box Link */}
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center gap-2 transition-all duration-200 bg-neutral-50/40 select-none ${
          isUploading
            ? "border-neutral-300 bg-neutral-50 opacity-70 cursor-not-allowed animate-pulse"
            : "border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 cursor-pointer"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          accept="image/*"
          multiple
          disabled={isUploading}
          className="hidden"
        />

        {isUploading ? (
          <Loader2 className="h-6 w-6 text-neutral-900 animate-spin" />
        ) : (
          <UploadCloud className="h-6 w-6 text-neutral-400 transition-colors group-hover:text-neutral-600" />
        )}

        <div className="text-xs font-semibold text-neutral-700">
          {isUploading ? (
            <span>Processing media assets transmission...</span>
          ) : (
            <span>
              Click to select or drop{" "}
              <span className="text-neutral-950 underline underline-offset-2">
                gallery items
              </span>
            </span>
          )}
        </div>
        
        <p className="text-[10px] text-neutral-400 tracking-wide uppercase font-mono">
          PNG, JPG, WEBP • Max 5MB per asset
        </p>
      </div>
    </div>
  );
}