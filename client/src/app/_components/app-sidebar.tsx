"use client";
import type { navOptions } from "@/types/types";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { useUserContext } from "@/context/userContext";
import { useEffect } from "react";
import Link from "next/link";
import { getNotification } from "@/actions/notifications/notificationAction";
import { useFolderContext } from "@/context/folderContext";
import { showFolders } from "@/actions/folders/folderAction";
import { routeFormater } from "@/utils/utils";
import { Folder } from "@/types/types";

export function AppSidebar() {
  const navOptions: navOptions[] = [
    {
      id: 1,
      name: "Home",
      route: "/",
      icon: "/images/home-light.svg",
    },
    {
      id: 2,
      name: "Study Folders",
      route: "/study-folders",
      icon: "/images/folder-light.svg",
    },
    {
      id: 3,
      name: "Friends",
      route: "/friends",
      icon: "/images/friends-light.svg",
    },
    {
      id: 4,
      name: "Shared Resources",
      route: "/shared-resources",
      icon: "/images/sharedResources.svg",
    },
    {
      id: 5,
      name: "Events",
      route: "/events",
      icon: "/images/calendar.svg",
    },
  ];
  const { user, notifications, setNotifications } = useUserContext();
  const { folders, setFolders } = useFolderContext();
  useEffect(() => {
    if (user) {
      if (!notifications) {
        const fetchNotifications = async () => {
          const res = await getNotification();
          if (!res || !res.data) {
            console.log("Unable to fetch Notifications");
            return;
          }
          setNotifications(res.data);
        };
        fetchNotifications();
      }
      if (!folders) {
        const fetchFolders = async () => {
          const res = await showFolders();
          if (res.data) {
            const modifiedFolders = res.data.map((folder: Folder) => ({
              ...folder,
              folderRoute: routeFormater(folder.folderName),
            }));
            setFolders(modifiedFolders);
            return;
          } else {
            console.log("No folders to show");
            return;
          }
        };
        fetchFolders();
      }
    }
  }, [user, notifications, folders, setFolders, setNotifications]);

  return (
    <Sidebar>
      <SidebarContent className="relative">
        <SidebarGroup className="mt-[1.5rem] flex flex-row gap-2 items-center">
          <Image src="/images/logo.svg" alt="logo" width={40} height={50} />
          <h1 className="font-medium text-2xl text-black">StudyBuddy</h1>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navOptions.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <Link href={item.route}>
                      <Image
                        src={item.icon}
                        width={20}
                        height={20}
                        className="brightness-0"
                        alt="nav-icons"
                      />
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
  );
}
