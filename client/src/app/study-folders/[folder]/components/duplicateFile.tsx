"use client";
import { useState, useEffect } from "react";
import { useNoteContext } from "@/context/notesContext";
export default function DuplicateFile() {
  const {
    repeatedFile,
    handleCancelDuplicateUpdate,
    handleContinueUploading,
  } = useNoteContext();
  const [duplicateOptionSelected, setDuplicateOptionSelected] = useState(false);

  const handleDuplicateFileOptionSelection = async (action: string) => {
    setDuplicateOptionSelected(true);

    if (action === "cancel") {
      handleCancelDuplicateUpdate();
    } else if (action === "upload") {
      await handleContinueUploading();
    }
    setDuplicateOptionSelected(false);
  };
  useEffect(() => {
    setDuplicateOptionSelected((prev) => !prev);
  }, [repeatedFile]);
  
  return (
    repeatedFile &&
    !duplicateOptionSelected && (
      <div
        className={` max-w-md p-6 bg-gray-800 rounded-2xl shadow-lg fixed top-[50%] left-[50%]  transform -translate-x-1/2 -translate-y-1/2 w-[30rem] max-sm:!w-[18rem] max-md:w-[24rem] ${
          repeatedFile ? "block" : "hidden"
        }`}
      >
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Upload options
        </h2>
        <p className="text-gray-300 mb-6">
          <span className="font-medium text-gray-100">
            {repeatedFile.length === 1
              ? repeatedFile[0].name
              : "One or more files"}
          </span>{" "}
          already exists. Do you want to replace the existing file with a new
          version or cancel the uploading of the file?
        </p>

        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={() => handleDuplicateFileOptionSelection("cancel")}
            className="px-4 py-2 text-gray-300 bg-gray-700 rounded-xl hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDuplicateFileOptionSelection("upload")}
            className="px-4 py-2 text-white bg-blue-600 rounded-xl hover:bg-blue-500"
          >
            Upload
          </button>
        </div>
      </div>
    )
  );
}
