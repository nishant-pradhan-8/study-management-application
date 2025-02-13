'use client'
import Image from "next/image"
import { useAppContext } from "@/context/context"
import React from "react"
import { UploadNotes } from "@/actions/folderAction"
import UploadProgress from "./uploadProgress"

export default function UploadButton({folderId}:{folderId:string}){
    const {getInputProps,open, isUploading} = useAppContext()
    
    return(
        <div className="relative">

        <label  htmlFor="upload" className='cursor-pointer upload-label bg-slate-200 flex flex-row gap-2 py-2 px-4 rounded-xl font-semibold '>
            <Image src="/images/upload.svg" alt="demo" width={20} height={20}/>
             Upload
             <input {...getInputProps()} disabled={isUploading}  multiple onClick={open} className="hidden" type="file" id="upload" />
         
        </label> 
        <UploadProgress />
        </div>
   
    )
}/*(e)=>UploadNotes(e,folderId,setFileRejected,setNotes, setFileSizeExceeded,user)*/