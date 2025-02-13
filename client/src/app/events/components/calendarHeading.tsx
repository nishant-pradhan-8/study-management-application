'use client'
import { useEffect } from "react"
import { useAppContext } from "@/context/context"
import { getEvents } from "@/actions/folderAction"
export default function CalendarHeading(){
    const {setAlertDialogOpen, setEventAlertDialogOpen, setEvents, events} = useAppContext()
    const handleEventAlertDialog = (action:string)=>{
        setAlertDialogOpen(true)
        if(action==="Create"){
            setEventAlertDialogOpen("Create")
        }else if(action==="Update"){
            setEventAlertDialogOpen("Update")
        }else if(action==="Delete"){
            setEventAlertDialogOpen("Delete")
        }
        }
       
  
    return(
          <div className="flex justify-between items-center">
                <h1 className="heading-1">Events</h1>
                <div className="flex flex-row gap-4 items-center">
                <button onClick={()=>handleEventAlertDialog('Create')} className="primary-btn">Create Events</button>
                <button onClick={()=>handleEventAlertDialog('Update')} className="primary-btn">Update Events</button>
                <button onClick={()=>handleEventAlertDialog('Delete')} className="primary-btn">Delete Events</button>
                </div>
                                 
            </div>
    )
}