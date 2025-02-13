'use client'
import Image from "next/image"
import Link from "next/link"
import { useAppContext } from "@/context/context"
import Notifications from "./notifications"
import { Notification } from "@/types/types"
import { useState, useEffect } from "react"
import { markNotificationRead } from "@/actions/folderAction"
export default function AppHeading(){
    const {user, setNotificationDialogOpen, notificationDialogOpen, setNotifications ,notifications} = useAppContext()
    const [unreadNotification, setUnreadNotification] = useState<Notification[]>([])
    useEffect(()=>{
        
        const unreadNotification:Notification[] | undefined = notifications?.filter(not=>!not.read)
        if(unreadNotification){
            setUnreadNotification(unreadNotification)
        }
     
    },[notifications])

    const handleNotificatonDialogOpen = async()=>{
        if(notifications){
            setNotificationDialogOpen(!notificationDialogOpen)
            const unreadNotification = notifications.filter(not=>!not.read)
            if(unreadNotification.length>0){
                await markNotificationRead()
                const modifiedNotification = notifications.map((not)=>{
                    return not.read?not:{...not,read:true}
                })
                setNotifications(modifiedNotification)
            }
               
            
        }
      
    }
    useEffect(()=>{
        console.log(notifications)
    },[notifications])
  
    
  
    return(
        <div className="flex relative flex-row justify-between items-center w-full">
            
            <h1 className='font-bold text-2xl text-black'>LOGO</h1>            
            <div className='flex items-center gap-4 '>
                   
                        <a onClick={()=>handleNotificatonDialogOpen()}><div className='cursor-pointer relative'> <Image src="/images/notifications.svg" width={20} height={20} alt='notifications' /> </div>
                        <div className={`w-2 h-2 bg-red-500 ${unreadNotification.length>0? "block":"hidden"} rounded-full top-[0.3rem] right-[2.9rem] absolute`}>

                   </div></a>
                        <Link className="cursor-pointer" href="/profile">
                        
                        <img src={user?.profilePicture==="" || !user?"/images/profile.svg":user?.profilePicture}className='rounded-full'width={30} height={30} alt='profile' />
                        </Link>
            </div>
           {notificationDialogOpen && <Notifications />}
        </div>
    )
}