"use client";
import Image from "next/image";
import React from "react";
import { useNoteContext } from "@/context/notesContext";
import UploadProgress from "./uploadProgress";
import UploadAimation from "./animation";
export default function UploadButton() {
  const { getInputProps, open, uploadList, progressOpen, setProgressOpen } =
    useNoteContext();
  const { isUploading } = useNoteContext();

  return (
    <div className="relative flex flex-row gap-2 items-center">
      {isUploading && (
        <a onClick={() => setProgressOpen(true)} className="cursor-pointer">
          <UploadAimation />
        </a>
      )}

      <label
        htmlFor="upload"
        className={`cursor-pointer upload-label bg-slate-200 flex flex-row gap-2 py-2 px-4 rounded-xl font-semibold 
    ${isUploading ? "pointer-events-none opacity-50" : ""}`}
      >
        <Image src="/images/upload.svg" alt="demo" width={20} height={20} />
        Upload
        <input
          {...getInputProps()}
          disabled={isUploading}
          multiple
          onClick={isUploading ? undefined : open}
          className="hidden"
          type="file"
          id="upload"
        />
      </label>

      {uploadList.length > 0 && progressOpen && <UploadProgress />}
    </div>
  );
} 
