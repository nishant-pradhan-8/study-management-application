'use client'
import { useUserContext } from "@/context/userContext";
import UploadButton from "./uploadButton";
import { Folder } from "@/types/types";
import { useFolderContext } from "@/context/folderContext";
import { useNoteContext } from "@/context/notesContext";
import useUploadFile from "@/hooks/useUploadFile";
export default function PageHeadng({folderRoute}:{folderRoute:string}){
    const {folders,} = useFolderContext()
    const { fileRejected, fileSizeExceeded} = useNoteContext()
    const selectedFolder:Folder[] | null = folders && folders.filter(folder=>folder.folderRoute===folderRoute)
   return(
       selectedFolder &&(
        <div className="flex justify-between">
        <h1 className="heading-1">{selectedFolder[0].folderName}</h1>
        <div className="flex items-center gap-4">
            <p className={`text-red-500 ${fileRejected?'block':'hidden'}`}>* Some File couldn't be Uploaded due to Unsupported Format</p>
            <p className={`text-red-500 ${fileSizeExceeded?'block':'hidden'}`}>* Some File couldn't be Uploaded due to Large Size </p>
            <UploadButton folderId={selectedFolder[0]._id || ""} />
        </div>
</div>
      )
       
   ) 
}