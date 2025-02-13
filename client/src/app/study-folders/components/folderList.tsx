'use client'
import Image from "next/image"
import Link from "next/link"
import { useAppContext } from "@/context/context"
import { useEffect, useRef } from "react"
import { CreateFolder } from "@/actions/folderAction"
export default function FolderList(){
    const {folders,setFolders,folderNameEmptyError, user,setActiveFolder,activeFolder, setFolderNameEmptyError, socket} = useAppContext()
    const inputRef = useRef<HTMLInputElement | null>(null)
    useEffect(()=>{
        inputRef.current?.focus()
    },[folders])
 
  
    return(
        <div className=" mt-8 flex flex-col gap-4">
        {
            folders.map((folder)=>(
                    <div key={folder.folderId} className='folder-card w-full'>
                        <Link href={`/study-folders/${folder.folderRoute}`}  className='folder-icon-div w-full'>
                        <Image src="/images/folder-dark.svg" alt='folder-icon' width={25} height={25} />
                         {folder.folderName===""?<input onKeyDown={(e)=>CreateFolder(e,folders, setFolders,  setFolderNameEmptyError)} ref={inputRef} className="border-[1px] text-black border-gray-400 outline-none" type="text" />:folder.folderName}
                         {folder.folderName === "" && folderNameEmptyError && (
                            <p className="text-red-600">Folder name cannot be Empty!</p>
                            )}
                     </Link>
                        <Image src="/images/menu.svg" alt='folder-icon' width={20} height={20} />
                    </div>
        
            ))
        }
        </div>
    )
}