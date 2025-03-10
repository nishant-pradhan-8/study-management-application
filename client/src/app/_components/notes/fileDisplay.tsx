"use client";
import Image from "next/image";
import React from "react";
import { DocumentViewer } from "react-documents";
import { useNoteContext } from "@/context/notesContext";

export default function FileDisplay() {
  const { activeFile, setActiveFile, fileTags } = useNoteContext();

  const renderView = () => {
    if (activeFile && activeFile.fileUri) {
      if (fileTags.iframe.includes(activeFile?.contentType)) {
        return (
          <DocumentViewer
            url={activeFile.fileUri}
            className="fixed top-0 left-0 h-full w-full z-40 pt-16"
          />
        );
      } else if (fileTags.img.includes(activeFile?.contentType)) {
        return (
         
<Image
  alt="file"
  src={activeFile.fileUri}
  width={768} // Set a max width
  height={0} // Let height adjust automatically
  sizes="100vw" // Makes it responsive
  className="fixed top-[50%] left-[50%] w-full px-2 max-w-[768px] max-h-[38rem] transform -translate-x-1/2 -translate-y-1/2 z-40 pt-16"
/>
        );
      } else if (fileTags.video.includes(activeFile?.contentType)) {
        return (
          <video
            className="fixed top-[50%] left-[50%] max-w-[768px] transform -translate-x-1/2 -translate-y-1/2 z-40 pt-16"
            controls
          >
            <source src={activeFile.fileUri} />
          </video>
        );
      }
    }
    return null;
  };
  return (
    <>
      {activeFile && activeFile.fileUri && (
        <>
          <nav className="flex flex-row justify-between items-center fixed top-0 w-full left-0 p-4 z-50">
            <div className="flex flex-row gap-2">
              <a className="cursor-pointer" onClick={() => setActiveFile(null)}>
                <Image
                  className="icon-white"
                  alt="cross"
                  src="/images/cross.svg"
                  width={25}
                  height={25}
                />
              </a>
              <div className="flex flex-row items-center font-medium text-white gap-1">
                <Image
                  src={`/images/${activeFile.fileIcon}`}
                  alt="image-icon"
                  className="icon-white"
                  width={25}
                  height={25}
                />
                {activeFile.fileName}
              </div>
            </div>
          </nav>
          {renderView()}
        </>
      )}
    </>
  );
}
