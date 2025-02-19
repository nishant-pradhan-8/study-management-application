'use client'
import Image from "next/image"
import { useUserContext } from "@/context/userContext"
import { Folder } from "@/types/types"
import { useEffect } from "react"
import { useFolderContext } from "@/context/folderContext"
export default function Button({action,src}:{action:string, src:string}){
    const {folders, setFolders} = useFolderContext()
    const folderAction = (action:string)=>{
        if(action==="Create"){
            const newFolder:Folder = {
                  _id: null,
                  folderName: "",
                  createdAt:null,
                  folderRoute:null
            }
            setFolders(val=>[...val || [],newFolder])
        }
    }
 
    return(
        <button onClick={()=>folderAction(action)} className='primary-btn'>
            <Image src={src} alt="demo" width={20} height={20}/>
            {action}
        </button>
    )
}