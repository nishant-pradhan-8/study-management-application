import { useState, Dispatch, SetStateAction } from "react";
import { Note, UploadList, User, NoteResponse, Folder } from "@/types/types";
import useFileValidation from "./useFileValidation";
import { manageUploadList } from "@/utils/utils";
import nextBackEndApiCall from "@/utils/nextBackEndApi";
import apiCall from "@/utils/backEndApiHandler";

const useUploadFile = (setProgressOpen:Dispatch<SetStateAction<boolean>>) => {
  const uploadNotes = async (
    files: File[] | null,
    repeatedFile: File[] | null,
    folderId: string | null,
    setNotes: Dispatch<SetStateAction<Note[] | null>>,
    user: User | null,
    setUploadList: Dispatch<SetStateAction<UploadList[]>>,
    notes: Note[] | null,
    setRepeatedFile: Dispatch<SetStateAction<File[] | null>>,
    setHoldingFiles: Dispatch<SetStateAction<File[] | null>>,
    setIsUploading: Dispatch<SetStateAction<boolean>>,
    setErrorDuringUpload: Dispatch<SetStateAction<boolean>>,
    setPopUpMessage:Dispatch<SetStateAction<{success:boolean, message:string} | null>>,
    uploadList: UploadList[],
   
    folders: Folder[] | null
  ) => {
    if (!files && !repeatedFile) {
      return console.log("Atleast one file is required for upload!");
    }

    const acceptedFileTypes = [
      "application/pdf", // PDF
      "application/msword", // DOC
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
      "application/vnd.ms-powerpoint", // PPT
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
      "application/vnd.ms-excel", // XLS
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
      "image/jpeg", // JPEG/JPG
      "image/png", // PNG
      "image/svg+xml", // SVG
      "video/mp4", // MP4
      "video/x-matroska", // MKV
    ];

    const { fileValidation } = useFileValidation();

    if (files || repeatedFile) {
      setProgressOpen(true);

      setErrorDuringUpload(false);
      setIsUploading(true);
      

      /*Logic to check repeated File*/
      const uploadedFileName: string[] =
        (notes && notes.map((note) => note.noteName)) || [];
      const repeatedFileList: File[] =
        (files &&
          files.filter((file) => uploadedFileName.includes(file.name))) ||
        [];
      let holdingFiles: File[] =
        (files &&
          files.filter((file) => !uploadedFileName.includes(file.name))) ||
        [];
      if (repeatedFileList.length > 0) {
        setHoldingFiles(holdingFiles);
        setRepeatedFile(repeatedFileList);
        return;
      }

      const tempUploadList: UploadList[] = manageUploadList(
        holdingFiles,
        repeatedFile || [],
        uploadList
      );

      uploadList && setUploadList(tempUploadList);

      const formData: FormData = fileValidation(
        files || [],
        acceptedFileTypes,
        setPopUpMessage
      );
      let repeatedFilesFormData;
      if (repeatedFile) {
        repeatedFilesFormData = fileValidation(
          repeatedFile,
          acceptedFileTypes,
          setPopUpMessage
        );
      }

      if (user && folderId) {
        formData.append("folderId", folderId);
        formData.append("userId", user._id);
      }
      console.log(repeatedFilesFormData, "rffd");
      const repeatedUploadedFiles: FormDataEntryValue[] =
        repeatedFilesFormData?.getAll("file") || [];

      if (repeatedUploadedFiles.length !== 0) {
        for (let file of repeatedUploadedFiles) {
          formData.append("file", file);
        }
      }
      const uploadedFiles: FormDataEntryValue[] = formData.getAll("file");
      console.log(uploadedFiles, "uf");
      if (uploadedFiles.length !== 0) {
        const response = await nextBackEndApiCall(
          "/api/notes",
          "POST",
          formData
        );
        console.log(response, "response");
        if (!response.error) {
          const responseNotes = response.data.data;
          console.log(response.data.data, "responseNotes");
          let repeatedFileNames = repeatedUploadedFiles
            .filter((file) => file instanceof File)
            .map((file) => file.name);

          const newNotes = responseNotes.filter(
            (note: NoteResponse) => !repeatedFileNames.includes(note.noteName)
          );
          const replacingNotes = responseNotes.filter((note: NoteResponse) =>
            repeatedFileNames.includes(note.noteName)
          );

          try {
            let finalNoteList;
            if (replacingNotes.length !== 0) {
              console.log(folderId, "fd");
              const response = await Promise.all([
                await apiCall("/api/note/uploadNotes", "POST", {
                  newNotes,
                  folderId,
                }),
                await apiCall("/api/note/replaceNotes", "PUT", {
                  replacingNotes,
                }),
              ]);
              let uploadedNewNotesData = response[0];
              let uploadedNewNotes = uploadedNewNotesData.data.data;
              let replacedNotesData = response[1];
              let replacedNotes = replacedNotesData.data.data;

              const modifiedNewNotes: Note[] = uploadedNewNotes.map(
                (note: any) => {
                  return {
                    noteName: note.noteName,
                    _id: note._id,
                    contentType: note.contentType,
                    fileSize: note.fileSize,
                    fileType: note.fileType,
                    folderName: note.folderName,
                    downloadUrl: note.downloadUrl,
                  };
                }
              );
              const modifiedReplacedNotes: Note[] = replacedNotes.map(
                (note: any) => {
                  return {
                    noteName: note.noteName,
                    _id: note._id,
                    contentType: note.contentType,
                    fileSize: note.fileSize,
                    fileType: note.fileType,
                    folderName: note.folderName,
                    downloadUrl: note.downloadUrl,
                  };
                }
              );
              let replacedNoteList =
                notes &&
                notes.map((note: Note) => {
                  let replacement = modifiedReplacedNotes.find(
                    (updatedNote) => updatedNote._id === note._id
                  );
                  return replacement || note;
                });
              finalNoteList = [
                ...(replacedNoteList || []),
                ...modifiedNewNotes,
              ];
            } else {
              const response = await apiCall("/api/note/uploadNotes", "POST", {
                newNotes,
                folderId,
              });

              const data = response.data;

              let updatedNoteList = data.data.map((note: any) => {
                return {
                  noteName: note.noteName,
                  _id: note._id,
                  contentType: note.contentType,
                  fileSize: note.fileSize,
                  fileType: note.fileType,
                  folderName:
                    folders?.find((folder) => folder._id === note.folderId)
                      ?.folderName || "",
                  downloadUrl: note.downloadUrl,
                };
              });
              finalNoteList = [...(notes || []), ...updatedNoteList];
            }

            setNotes(finalNoteList);
          } catch (error: any) {
            setErrorDuringUpload(true);
            console.log(error.message);
          }
        }
      } else {
        setErrorDuringUpload(true);
      }
    }
    setIsUploading(false);
    setHoldingFiles(null);
    setRepeatedFile(null);
    setTimeout(() => {
      setUploadList([]);
      
    }, 5000);
  };
  return { uploadNotes};
};
export default useUploadFile;
