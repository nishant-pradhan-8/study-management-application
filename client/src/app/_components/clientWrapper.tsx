"use client"; // This makes it a Client Component

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar"
import AppHeading from "./app-heading";
import Overlay from "./overlay";
import AlertDialogOverlay from "./alertDialogOverlay";
import { useNoteContext } from "@/context/notesContext";
import { useUserContext } from "@/context/userContext";
import DeletingProcess from "./deletingProcess";
export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.includes("/login") || pathname.includes("/register") || pathname.includes("/reset-password")
  const {activeFile} = useNoteContext()
  const {alertDialogOpen, isDeleting} = useUserContext()
  return (
    <SidebarProvider>
      {!isAuthPage && <AppSidebar />}
      <main className="w-full h-screen flex flex-col gap-4">
        {!isAuthPage && (
          <div className="flex gap-4 bg-slate-50 m-4 mb-0  p-4 rounded-xl">
            <SidebarTrigger className="text-black" />
            <AppHeading />
          </div>
        )}
        <div className={`${!isAuthPage?"h-[calc(100%-7rem)] !overflow-x-hidden    custom-scrollbar mx-4 scrollbar-hide bg-slate-50 p-4 overflow-y-scroll rounded-xl":'bg-white'}`}>
          {children}
          {activeFile && <Overlay />}
          {alertDialogOpen && <AlertDialogOverlay />}
            {isDeleting && <DeletingProcess />}
        </div>
      </main>
    </SidebarProvider>
  );
}
