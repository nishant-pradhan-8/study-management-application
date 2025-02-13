'use client'
import { useAppContext } from "@/context/context"
export default function Overlay(){
    const {activeFile} = useAppContext()
    return(
        <div className={`${activeFile?'overlay':'hidden'}`}>

        </div>
    )
}