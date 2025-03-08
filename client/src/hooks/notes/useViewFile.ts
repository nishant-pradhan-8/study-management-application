import { ActiveFile, Folder } from "@/types/types"
import { Dispatch, SetStateAction } from "react"
import { routeFormater } from "@/utils/utils"
import apiCall from "@/utils/backEndApiHandler"
import { Note, SharedNotes } from "@/types/types"
export default function useViewFile(setActiveFile:Dispatch<SetStateAction<ActiveFile | null>>,fileIcons:Record<string,string>){
  const handleFileOpen = async(note:Note | SharedNotes):Promise<void>=>{
    setActiveFile({fileIcon:fileIcons[note.contentType],fileName:note.noteName,fileUri:note.downloadUrl, contentType:note.contentType})
    
   }
  return {handleFileOpen};
}