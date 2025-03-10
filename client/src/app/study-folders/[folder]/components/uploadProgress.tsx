import Image from "next/image";
import { useEffect } from "react";
import { useNoteContext } from "@/context/notesContext";

export default function UploadProgress() {
  const {
    uploadList,
    fileIcons,
    isUploading,
    errorDuringUpload,
    progressDivRef,
    setProgressOpen,
    progressOpen,
  } = useNoteContext();
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        progressDivRef &&
        progressDivRef.current &&
        !progressDivRef.current.contains(event.target as Node)
      ) {
        setProgressOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [progressOpen, progressDivRef, setProgressOpen]);

  return (
    <div
      ref={progressDivRef}
      className={` bg-slate-200 absolute p-4 custom-scrollbar overflow-y-scroll max-h-[15rem] right-0 max-sm:w-[16rem] w-[20rem] top-[3.5rem] rounded-xl flex flex-col gap-2 z-50`}
    >
      {uploadList &&
        uploadList?.map((uploads) => (
          <div
            key={uploads.fileId}
            className="flex border-b-[1px] pb-3 border-b-gray-400 last:border-b-0 last:pb-0  flex-row items-center font-semibold   justify-between"
          >
            <div className="flex  flex-row items-center ">
              <Image
                src={`/images/${
                  fileIcons[uploads.contentType] || "unallowed.svg"
                }`}
                alt="image-icon"
                width={20}
                height={20}
                className="mr-2"
              />
              <div className="overflow-hidden w-[14rem] max-sm:w-[11rem]">
                <p className="font-semibold">{uploads.fileName}</p>
              </div>
            </div>
           
            {isUploading ? (
              <div className="loader"></div> 
            ) : fileIcons[uploads.contentType] && !errorDuringUpload ? (
              <Image alt="ok" src="/images/ok.svg" width={20} height={20} />
            ) : (
              <Image
                alt="error"
                src="/images/error.svg"
                width={20}
                height={20}
              />
            )}
          </div>
        ))}
    </div>
  );
} //
