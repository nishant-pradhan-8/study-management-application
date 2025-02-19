'use client'
import Image from "next/image"
import { useEffect, useState, useRef } from "react"
import { useUserContext } from "@/context/userContext"
import AvatarWithText from "./avatarAndText"
import Link from "next/link"
import NotificationSkeleton from "./notificationSkeleton"
export default function Notifications(){
    const notificationDialogRef= useRef<HTMLDivElement | null>(null)
    const {notificationDialogOpen, setNotificationDialogOpen, setNotifications, notifications} = useUserContext()
    const handleDialogClose = (e:MouseEvent)=>{
        if(notificationDialogRef && notificationDialogOpen && notificationDialogRef.current && !notificationDialogRef.current.contains(e.target as Node)){
            setNotificationDialogOpen(false)
        }
    }
    useEffect(()=>{
        document.addEventListener('click',handleDialogClose)
        return () => document.removeEventListener("click", handleDialogClose);
    },[notificationDialogOpen])
  
    const notificationIcon:Record<string,string> ={
        friendRequest:"/images/friends.svg",
        notesShared:"/images/sharedResources.svg"
    }

    return(
        <div ref={notificationDialogRef} className="absolute w-[18rem] top-[3.5rem] z-[50] bg-white border-[1px] border-gray-400 right-[3rem] rounded-xl">
            <ul>
                {
                  
                    notifications?
                    notifications.length>0?
                      (notifications.map((notification)=>(
                        <li key={notification._id} >
                         <Link className={`text-[0.8rem] ${notification.notificationType==="notesShared"?"icon-black":""} last:border-none h-[55px] items-center  font-semibold border-b-[1px] border-gray-500  p-2 px-4 flex flex-row gap-2 cursor-pointer`} href={notification.notificationType==="friendRequest"?"/friends":"shared-resources"}>
                         <Image src={notificationIcon[notification.notificationType]}  width={20} height={20} alt="friends-logo" />
                         {notification.notification}
                         </Link> </li>  ))):
                        <p className="p-4 font-semibold">No Notifications To Show . . . .</p>
                        :(<NotificationSkeleton />)
                 
                }
            </ul>
        </div>
    )
}