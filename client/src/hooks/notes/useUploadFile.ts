import {  Dispatch, SetStateAction } from "react";
import { Note, UploadList, User, NoteResponse, Folder } from "@/types/types";
import useFileValidation from "./useFileValidation";
import { manageUploadList } from "@/utils/utils";
import nextBackEndApiCall from "@/utils/nextBackEndApi";
import apiCall from "@/utils/backEndApiHandler";
import { folderIdToFolderName } from "@/utils/utils";
const useUploadFile = (setProgressOpen: Dispatch<SetStateAction<boolean>>) => {
  const { fileValidation } = useFileValidation();
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
    setPopUpMessage: Dispatch<
      SetStateAction<{ success: boolean; message: string } | null>
    >,
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

   

    if (files || repeatedFile) {
      setProgressOpen(true);

      setErrorDuringUpload(false);
      setIsUploading(true);

      /*Logic to check repeated File*/
      const uploadedFileName: string[] =
        (notes && notes.map((note) => note.noteName)) || [];
        console.log(uploadedFileName)
        console.log(files)

      const repeatedFileList: File[] =
          files?.filter((file) => uploadedFileName.includes(file.name.replace(/\.[^/.]+$/, ""))) ||
        [];

      const holdingFiles: File[] = files?.filter((file) => !uploadedFileName.includes(file.name.replace(/\.[^/.]+$/, ""))) ||
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

      if(uploadList){
        setUploadList(tempUploadList);
      } 

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
      const repeatedUploadedFiles: FormDataEntryValue[] =
        repeatedFilesFormData?.getAll("file") || [];

      if (repeatedUploadedFiles.length !== 0) {
        for (const file of repeatedUploadedFiles) {
          formData.append("file", file);
        }
      }
      const uploadedFiles: FormDataEntryValue[] = formData.getAll("file");
      if (uploadedFiles.length !== 0) {
        const response = await nextBackEndApiCall(
          "/api/notes",
          "POST",
          formData
        );
        if (!response.error) {
          const responseNotes = response.data.data;
        
          const repeatedFileNames = repeatedUploadedFiles
            .filter((file) => file instanceof File)
            .map((file) => file.name.replace(/\.[^/.]+$/, ""));

          const newNotes = responseNotes.filter(
            (note: NoteResponse) => !repeatedFileNames.includes(note.noteName)
          );
          const replacingNotes = responseNotes.filter((note: NoteResponse) =>
            repeatedFileNames.includes(note.noteName)
          );

          try {
            console.log(replacingNotes)
            let finalNoteList;
            if (replacingNotes.length !== 0) {
              const response = await Promise.all([
                await apiCall("/api/note/uploadNotes", "POST", {
                  newNotes,
                  folderId,
                }),
                await apiCall("/api/note/replaceNotes", "PUT", {
                  replacingNotes,
                }),
              ]);
              const uploadedNewNotesData = response[0];
              const uploadedNewNotes = uploadedNewNotesData.data.data;
              const replacedNotesData = response[1];
              const replacedNotes = replacedNotesData.data.data;

              const modifiedNewNotes: Note[] = uploadedNewNotes.map(
                (note:Partial<Note>) => {
                  return {
                    noteName: note.noteName,
                    _id: note._id,
                    contentType: note.contentType,
                    fileSize: note.fileSize,
                    fileType: note.fileType,
                    folderName: folderIdToFolderName(folders,note.folderId || ""),
                    downloadUrl: note.downloadUrl,
                  };
                }
              );
              console.log('replacedNotes',replacedNotes)
              const modifiedReplacedNotes: Note[] = replacedNotes.map(
                (note:Partial<Note>) => {
                  return {
                    noteName: note.noteName,
                    _id: note._id,
                    contentType: note.contentType,
                    fileSize: note.fileSize,
                    fileType: note.fileType,
                    folderName: folderIdToFolderName(folders,note.folderId || ""),
                    downloadUrl: note.downloadUrl,
                  };
                }
              );
              const replacedNoteList = notes?.map((note: Note) => {
                  const replacement = modifiedReplacedNotes.find(
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

              console.log('data',data)
              const updatedNoteList = data.data.map((note:Partial<Note>) => {
                return {
                  noteName: note.noteName,
                  _id: note._id,
                  contentType: note.contentType,
                  fileSize: note.fileSize,
                  fileType: note.fileType,
                  folderName: folderIdToFolderName(folders,note.folderId || ""),
                  downloadUrl: note.downloadUrl,
                };
              });
              finalNoteList = [...(notes || []), ...updatedNoteList];
            }

            setNotes(finalNoteList);
          } catch (error) {
            setErrorDuringUpload(true);
            console.log(error instanceof Error && error.message);
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
  return { uploadNotes };
};
export default useUploadFile;
