'use client'
import { useUserContext } from "@/context/userContext"
import { useNoteContext } from "@/context/notesContext"
export default function Overlay(){
    const {activeFile} = useNoteContext()
    return(
        <div className={`${activeFile?'overlay':'hidden'}`}>

        </div>
    )
}