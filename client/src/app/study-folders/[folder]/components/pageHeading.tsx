'use client'
import { useUserContext } from "@/context/userContext";
import UploadButton from "./uploadButton";
import { Folder } from "@/types/types";
import { useFolderContext } from "@/context/folderContext";
import { useNoteContext } from "@/context/notesContext";
import useUploadFile from "@/hooks/notes/useUploadFile";

export default function PageHeadng({folderId}:{folderId:string}){
    const {folders} = useFolderContext()
    const {setPopUpMessage} = useUserContext()
   
    const selectedFolder:Folder | null =  folders?.find(folder=>folder._id===folderId) || null
   return(
       selectedFolder &&(
        <div className="flex justify-between mb-2 items-center">
        <h1 className="heading-1">{selectedFolder.folderName}</h1>
        <div className="flex items-center gap-4">
        
            <UploadButton folderId={selectedFolder._id || ""} />
        </div>
</div>
      )
       
   ) 
}