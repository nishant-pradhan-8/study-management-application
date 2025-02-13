'use client'
import Image from "next/image"
import { useEffect, useState } from "react"
import { getSharedNotes } from "@/actions/folderAction"
import { SharedNotes } from "@/types/types"
import { useAppContext } from "@/context/context"
import FileDisplay from "@/app/_components/fileDisplay"

import { Skeleton } from "@/components/ui/skeleton"

export default function SharedList(){
  const [sharedNotes, setSharedNotes] = useState<SharedNotes[] | null>()
  const {fileIcons,setActiveFile, activeFile} = useAppContext()
   useEffect(()=>{
    const fetchSharedNotes = async()=>{
      const response = await getSharedNotes()
      if(response){
        console.log('went')
        setSharedNotes(response)
      }
   
      console.log(response)
    }
    fetchSharedNotes()
   },[])
    return(
      <div>
         { activeFile && <FileDisplay />
                   } 
        {
            
            sharedNotes?(
              sharedNotes.length>0?(
                sharedNotes.map((note)=>(
                  <div  key={note._id} className="flex  flex-row  mt-4 items-center justify-between font-semibold border-y-[1px] border-gray-400 py-4 w-full">
                        <a onClick={()=>setActiveFile({fileIcon:fileIcons[note.contentType],fileName:note.noteName,fileUri:note.downloadUrl, contentType:note.contentType})}  className="flex flex-row gap-2 w-full items-center" >
                      <Image src={`/images/${fileIcons[note.contentType]}`}alt='image-icon' width={25} height={25} className="mr-2" />   
                        {note.noteName}
                    </a>
                    <div className="relative">
                        <a  >
                        <Image src={`/images/menu.svg`} alt='image-icon' width={20} height={20}/>
                        </a> 
                    
                      </div>
                   
                        </div>
                        
                ))
              ):<p>No Shared Notes</p>
            ): (<Skeleton className="w-[100px] h-[20px] rounded-full" />)
                  }
                </div>
   
    )
}