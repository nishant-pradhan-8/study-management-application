"use client"
import type { navOptions } from "@/types/types"
import Image from "next/image"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAppContext } from "@/context/context"
import { useEffect } from "react"
import { getUserDetails } from "@/actions/folderAction"
import Link from "next/link"
import { getNotification } from "@/actions/folderAction"

export function AppSidebar() {
  const navOptions:navOptions[] = [
    {
       id: 1,
       name: 'Home',
       route: "/",
       icon: '/images/home-light.svg'
    },
    { 
      id: 2,
      name: 'Study Folders',
       route: "/study-folders",
      icon: '/images/folder-light.svg'
   },
   { 
    id: 3,
    name: 'Friends',
     route: "/friends",
    icon: '/images/friends-light.svg'
    },
    { 
      id: 4,
      name: 'Shared Resources',
      route: "/shared-resources",
      icon: '/images/sharedResources.svg'
    },
    { 
      id: 5,
      name: 'Events',
      route: "/events",
      icon: '/images/calendar.svg'
    },
    { 
      id: 6,
      name: 'Study Room',
      route: "/study-room",
      icon: '/images/studyRoom.svg'
    }
  ]

  const {setUser,user, notifications, setNotifications} = useAppContext()
   useEffect(()=>{
    
    if(!user){
      console.log(user)
      const fetchUserDetails =async()=>{
        const res = await getUserDetails()
        if(!res.data){
          return
        }
        console.log(res.data)
        setUser(res.data)
      }
      fetchUserDetails()
     
    }
    if(!notifications){
      const fetchNotifications = async()=>{
          const res =  await getNotification()
          if(!res.data){
              console.log("Unable to fetch Notifications")
          }
          setNotifications(res.data)
   
      }
      fetchNotifications()
  }
      
    },[])


  return (
    <Sidebar >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navOptions.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <Link href={item.route}>
                       <Image src={item.icon} width={20} height={20} className="brightness-0" alt='nav-icons' /> 
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
