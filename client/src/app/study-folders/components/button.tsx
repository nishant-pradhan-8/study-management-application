'use client'
import Image from "next/image"
import { useAppContext } from "@/context/context"
import { Folder } from "@/types/types"
import { useEffect } from "react"
export default function Button({action,src}:{action:string, src:string}){
    const {folders, setFolders} = useAppContext()
    const folderAction = (action:string)=>{
        if(action==="Create"){
            const newFolder:Folder = {
                  folderId: null,
                  folderName: "",
                  folderRoute:""
            }
            setFolders(val=>[...val,newFolder])
        }
    }
 
    return(
        <button onClick={()=>folderAction(action)} className='primary-btn'>
            <Image src={src} alt="demo" width={20} height={20}/>
            {action}
        </button>
    )
}