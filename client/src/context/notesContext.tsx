"use client";
import { ReactNode, useContext } from "react";
import { createContext, Dispatch, useState } from "react";
import { SetStateAction } from "preact/compat";
import { Note, UploadList, ActiveFile,FileTags } from "@/types/types";
import apiCall from "@/utils/backEndApiHandler";
import { useDropzone } from "react-dropzone";
import { DropzoneInputProps, DropzoneRootProps } from "react-dropzone";
import { useUserContext } from "./userContext";
import { useFolderContext } from "./folderContext";
import useUploadFile from "@/hooks/notes/useUploadFile";
interface ContextType {
  notes: Note[] | null;
  setNotes: Dispatch<SetStateAction<Note[] | null>>;
  displayFile: string | null;
  setDisplayFile: Dispatch<SetStateAction<string | null>>;
 
  uploadList: UploadList[];
  setUploadList: Dispatch<SetStateAction<UploadList[]>>;
  repeatedFile: File[] | null;
  setRepeatedFile: Dispatch<SetStateAction<File[] | null>>;
  holdingFiles: File[] | null;
  setHoldingFiles: Dispatch<SetStateAction<File[] | null>>;
  isUploading:boolean;
  setIsUploading:Dispatch<SetStateAction<boolean>>;

  selectedFileMenu: string | null;
  setSelectedFileMenu: Dispatch<SetStateAction<string | null>>;
  activeFile: ActiveFile | null;
  setActiveFile: Dispatch<SetStateAction<ActiveFile | null>>;

  recentNotes: Note[] | null;
  setRecentNotes: Dispatch<SetStateAction<Note[] | null>>;
  fileIcons: Record<string, string>;
  fileTags: FileTags;
    getRootProps: () => DropzoneRootProps;
    getInputProps: () => DropzoneInputProps;
    isDragActive: boolean;
    open: ()=>void;
    onDrop: (acceptedFiles: File[]) => Promise<void>
  handleContinueUploading:()=>Promise<void>,
  handleCancelDuplicateUpdate:()=>Promise<void>
  errorDuringUpload:boolean;
  setErrorDuringUpload:Dispatch<SetStateAction<boolean>>;
  fileRejected: boolean;
  setFileRejected: Dispatch<SetStateAction<boolean>>;
  fileSizeExceeded: boolean;
  setFileSizeExceeded: Dispatch<SetStateAction<boolean>>;


}
const NotesContext = createContext<ContextType | undefined>(undefined);

export default function NotesProvider({ children }: { children: ReactNode }) {
  const {user} = useUserContext()
  const {activeFolder} = useFolderContext()
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [displayFile, setDisplayFile] = useState<string | null>(null);
 
  const [uploadList, setUploadList] = useState<UploadList[]>([]);
  const [repeatedFile, setRepeatedFile] = useState<File[] | null>(null);
  const [holdingFiles, setHoldingFiles] = useState<File[] | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [errorDuringUpload, setErrorDuringUpload] = useState<boolean>(false);
  const [fileRejected, setFileRejected] = useState<boolean>(false);
  const [fileSizeExceeded, setFileSizeExceeded] = useState<boolean>(false);
  const [selectedFileMenu, setSelectedFileMenu] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<ActiveFile | null>(null);
 
  
  const [recentNotes, setRecentNotes] = useState<Note[] | null>(null);
  
  const fileIcons: Record<string, string> = {
    "application/pdf": "pdf.svg",
    "application/msword": "word.svg",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docs.svg",
    "application/vnd.ms-powerpoint": "ppt.svg",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "ppt.svg",
    "application/vnd.ms-excel": "excel.svg",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      "excel.svg",
    "image/jpeg": "image.svg",
    "image/png": "image.svg",
    "image/svg+xml": "svg.svg",
    "video/mp4": "mp4.svg",
    "video/x-matroska": "mkv.svg",
  };
  const fileTags: FileTags = {
    iframe: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    img: ["image/jpeg", "image/png", "image/svg+xml"],
    video: ["video/mp4", "video/x-matroska"],
  };

  const {uploadNotes} = useUploadFile(
    )
   const onDrop = async(acceptedFiles: File[]): Promise<void> => {
     console.log("this was trigerred")
     await uploadNotes(acceptedFiles,repeatedFile,  activeFolder,
      setNotes,
      user,
      setUploadList,
      notes ,
      setRepeatedFile,
      setHoldingFiles,
      setIsUploading,
      setErrorDuringUpload,
      setFileRejected,
      uploadList,

    setFileSizeExceeded,
  )
  }
  
  
   const handleContinueUploading = async():Promise<void>=>{
    await uploadNotes(holdingFiles, repeatedFile, activeFolder,
      setNotes,
      user,
      setUploadList,
      notes ,
      setRepeatedFile,
      setHoldingFiles,
      setIsUploading,
      setErrorDuringUpload,
      setFileRejected,
      uploadList,
    setFileSizeExceeded)
   
  
  }
  
  const handleCancelDuplicateUpdate = async():Promise<void>=>{
  
    await uploadNotes(holdingFiles, null,   activeFolder,
      setNotes,
      user,
      setUploadList,
      notes ,
      setRepeatedFile,
      setHoldingFiles,
      setIsUploading,
      setErrorDuringUpload,
      setFileRejected,
      uploadList,
    setFileSizeExceeded)
  }
  
  const { getRootProps, getInputProps, isDragActive,open } = useDropzone({ onDrop, noClick:true });
  

  return (
    <NotesContext.Provider
      value={{
        notes,
        setNotes,
        displayFile,
        setDisplayFile,
      
        uploadList,
        setUploadList,
        holdingFiles,
        setHoldingFiles,
        repeatedFile,
        setRepeatedFile,
        selectedFileMenu, setSelectedFileMenu,
        activeFile, setActiveFile,
       
        recentNotes, setRecentNotes,
        fileIcons, fileTags,
        onDrop,handleContinueUploading, handleCancelDuplicateUpdate,
        isUploading, setIsUploading,
        errorDuringUpload, setErrorDuringUpload,fileRejected, setFileRejected,
        fileSizeExceeded, setFileSizeExceeded,
       
        getRootProps, getInputProps, isDragActive,open,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export const useNoteContext = ()=>{
  const context = useContext(NotesContext)
  if(!context){
    throw new Error('useFolderContext must be used within a ContextProvider');
}
return context
}