'use client'
import { createContext, useContext } from "react"
import { ReactNode } from "react"
import { useState } from "react"
import { Folder } from "@/types/types"
import { Dispatch, SetStateAction } from "react"
interface FolderContext{
  folders: Folder[] | null;
  setFolders: Dispatch<SetStateAction<Folder[] | null>>;
  activeFolder: string | null;
  setActiveFolder: Dispatch<SetStateAction<string | null>>;
  folderNameEmptyError: boolean;
  setFolderNameEmptyError:Dispatch<SetStateAction<boolean>>;
  recentFolders:Folder[] | null
  setRecentFolders:Dispatch<SetStateAction<Folder[] | null>>
  faf:Folder[] | null,
   setFaf:Dispatch<SetStateAction<Folder[] | null>>
   isDeleting:boolean,
    setIsDeleting: Dispatch<SetStateAction<boolean>>

}
const FolderContext = createContext<FolderContext | undefined>(undefined)

export default function FolderProvider({children}: { children: ReactNode }){
    const [folders, setFolders] = useState<Folder[] | null>(null);
    const [activeFolder, setActiveFolder] = useState<string | null>(null)
    const [folderNameEmptyError, setFolderNameEmptyError] = useState<boolean>(false);
    const [recentFolders, setRecentFolders] = useState<Folder[] | null>(null)
    const [faf, setFaf] = useState<Folder[] | null>(null)
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    return(
        <FolderContext.Provider value={{activeFolder, 
            setActiveFolder,
            folderNameEmptyError,
            setFolderNameEmptyError,
            folders,
            setFolders,
            recentFolders, setRecentFolders,faf, setFaf,isDeleting, setIsDeleting}}>
            {children}
        </FolderContext.Provider>
    )
}
export const useFolderContext = ()=>{
    const context = useContext(FolderContext)
    if(!context){
        throw new Error('useFolderContext must be used within a ContextProvider');
    }
    return context
}