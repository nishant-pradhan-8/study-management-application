'use client'
import { useAppContext } from "@/context/context";
import { getNotes } from "@/actions/folderAction"
import Image from "next/image"
import { Folder } from "@/types/types";
import { Note } from "@/types/types";
import { useEffect} from "react";
import { getFile } from "@/actions/folderAction";
import FileMenu from "./fileMenu";
import FileDisplay from "../../../_components/fileDisplay";
import ShareFile from "./shareFile";
import AlertDialogOverlay from "@/app/_components/alertDialogOverlay";
export default  function NoteList({folderRoute}:{folderRoute:string}){
    const {folders,notes, setNotes, displayFile, setDisplayFile, fileIcons, activeFile, setActiveFile, getRootProps, setFileMenuOpenId, fileMenuOpenId, setActiveFolder,selectedFileMenu} = useAppContext()
   const selectedFolder:Folder[] = folders.filter(folder=>folder.folderRoute===folderRoute)
   const folderId:string | null = selectedFolder[0].folderId;

   if(!folderId){
    return <p>Unable to Show Notes</p>
   }

   useEffect(()=>{
     const fetchNotes = async()=>{
        const notes:Note[]= await getNotes(folderId) || []
        setActiveFolder(folderId)
        setNotes(notes)
     }
     fetchNotes()
   },[folderId])
  
 
   const handleFileMenuOpen = (noteId:string)=>{
    
      setFileMenuOpenId((prevId) => (prevId === noteId ? null : noteId));
    
    
   }
   
   const handleFileOpen = async(note:Note)=>{
    setActiveFile({fileIcon:fileIcons[note.contentType],fileName:note.noteName,fileUri:note.downloadUrl, contentType:note.contentType})
    console.log(note.noteId)
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/note/updateLastViewed`,{
     method:"PATCH",
     headers:{
       Accept:"application/json",
       "Content-Type": "application/json",
       "Authorization":`Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`
     },
     body:JSON.stringify({noteId: note.noteId})
   })
   }
   
   

    return(
        <div   {...getRootProps()} className="flex flex-col mt-4">
           { activeFile && <FileDisplay />
         } 
            {  notes.length!==0?
                notes.map((note:Note)=>{
                  return <div   className="flex  flex-row first:border-t-[1px] items-center justify-between font-semibold border-b-[1px] border-gray-400 py-4 w-full" key={note.noteId}>
                    <a onClick={()=>handleFileOpen(note)} className="flex flex-row gap-2 w-full items-center cursor-pointer" >
                  <Image src={`/images/${fileIcons[note.contentType]}`} alt='image-icon' width={25} height={25} className="mr-2" />   
                    {note.noteName}
                 </a>
                 <div className="relative">
                    <a className="cursor-pointer" onClick={()=>handleFileMenuOpen(note.noteId)}  >
                    <Image src={`/images/menu.svg`} alt='image-icon' width={20} height={20}/>
                    </a> 
                    {fileMenuOpenId === note.noteId &&  <FileMenu note={note} />}
                  
                  </div>
                 </div>
                }):<p>No Notes To Show</p>
            }
     
        </div>
    )
}
/*   {displayFile && (
             
               /* <iframe 
                src={`https://docs.google.com/gview?url=https://5405-2407-1400-aa58-4b18-e88b-90e7-6f55-7904.ngrok-free.app/api/note/678f5c88e95f64d0d3d7f6f1&embedded=true`}
                width="600" 
                height="400">
              </iframe>
              <embed className="fixed top-0 left-0 w-full h-full" src="https://950b-2407-1400-aa58-4b18-60e6-9fc-a466-61a7.ngrok-free.app/api/note/678f5c88e95f64d0d3d7f6f1" />
      
          )}
*/