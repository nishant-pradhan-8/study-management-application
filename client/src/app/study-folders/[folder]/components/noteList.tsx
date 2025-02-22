'use client'
import { useUserContext } from "@/context/userContext";
import { getNotes } from "@/actions/notes/noteAction"
import Image from "next/image"

import { Note } from "@/types/types";
import { useEffect} from "react";
import { Folder } from "@/types/types";

import FileDisplay from "@/app/_components/notes/fileDisplay";
import { useState } from "react";
import { useNoteContext } from "@/context/notesContext";
import { useFolderContext } from "@/context/folderContext";
import useViewFile from "@/hooks/notes/useViewFile";
export default  function NoteList({folderId}:{folderId:string}){
    const {notes, setNotes, displayFile, setDisplayFile, fileIcons, activeFile, setActiveFile, getRootProps, selectedFileMenu} = useNoteContext()
    const {folders, setActiveFolder,} = useFolderContext()
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>()
    const {handleFileOpen} = useViewFile(setActiveFile,fileIcons)

   useEffect(()=>{

    if(folderId){
      
      const selectedFolder:Folder[] | null = folders && folders.filter(folder=>folder._id===folderId)
      const selectedFolderId:string | null = selectedFolder && selectedFolder[0]._id
      setSelectedFolderId(selectedFolderId)
    }
    
   },[folders])

   useEffect(()=>{
    
    if(selectedFolderId){
      const fetchNotes = async()=>{
        const res = await getNotes(selectedFolderId)
        if(!res.data){
         return console.log("Unable to fetch Notes")
        }
        setActiveFolder(selectedFolderId)
        setNotes(res.data)
     }
     fetchNotes()
    }
   
   },[selectedFolderId])
  
  
   

    return(
        <div   {...getRootProps()} className="flex flex-col mt-4">
          
            {notes && notes.length!==0?
                notes.map((note:Note)=>{
                  return <div   className="flex  flex-row first:border-t-[1px] items-center justify-between font-semibold border-b-[1px] border-gray-400 py-4 w-full" key={note._id}>
                    <a onClick={()=>handleFileOpen(note)} className="flex flex-row gap-2 w-full items-center cursor-pointer" >
                  <Image src={`/images/${fileIcons[note.contentType]}`} alt='image-icon' width={25} height={25} className="mr-2" />   
                    {note.noteName}
                 </a>
                 <div className="relative">
                    <a className="cursor-pointer"  >
                    <Image src={`/images/menu.svg`} alt='image-icon' width={20} height={20}/>
                    </a> 
        
                  </div>
                 </div>
                }):<p>No Notes To Show</p>
            }
     
        </div>
    )
}
/*   {displayFile && (
                         {fileMenuOpenId === note.noteId &&  <FileMenu note={note} />}
               /* <iframe 
                src={`https://docs.google.com/gview?url=https://5405-2407-1400-aa58-4b18-e88b-90e7-6f55-7904.ngrok-free.app/api/note/678f5c88e95f64d0d3d7f6f1&embedded=true`}
                width="600" 
                height="400">
              </iframe>
              <embed className="fixed top-0 left-0 w-full h-full" src="https://950b-2407-1400-aa58-4b18-60e6-9fc-a466-61a7.ngrok-free.app/api/note/678f5c88e95f64d0d3d7f6f1" />
      
          )}
*/