'use client'
import { useAppContext } from "@/context/context"
import { useEffect } from "react"
export default function AlertDialogOverlay(){
    const {alertDialogOpen} = useAppContext()
    useEffect(()=>{
        console.log(alertDialogOpen)
    },[alertDialogOpen])
    return(
        <div className={`${alertDialogOpen?'alertDialogOverlay':'hidden'}`}>

        </div>
    )
}