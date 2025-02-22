'use client'
import Image from "next/image";
import React from "react";

import { useUserContext } from "@/context/userContext";
import { useNoteContext } from "@/context/notesContext";
import { Dispatch, SetStateAction } from "react";
import { deleteNote } from "@/actions/notes/noteAction";
import { useFolderContext } from "@/context/folderContext";
import { Folder, Note } from "@/types/types";
import { useEffect } from "react";
import { Info } from "@/hooks/useViewInfo";
import NoteInfo from "./noteInfo";
export default function FileMenu({menuRef, 
  note,
  setSelectedMenuId,
  selectedMenuId,
  infoVisible,
  setInfoVisible,
 info
}: {
  setSelectedMenuId: Dispatch<SetStateAction<string | null>>;
  note:Note;
  selectedMenuId: string | null;
  menuRef: React.RefObject<HTMLDivElement | null>;
  infoVisible: boolean;
  setInfoVisible: Dispatch<SetStateAction<boolean>>;
  info:Info[] | null
}
  ){
  const {user, setIsDeleting} = useUserContext()
  const {recentNotes, notes, setRecentNotes, setNotes} = useNoteContext()
  const {folders} = useFolderContext()
 


  const handleDeleteFile = async () => {
   
     if (!user  || !selectedMenuId) {
       return;
     }
     setSelectedMenuId(null);
     setIsDeleting(true);
     if(!folders){
      return
     }
     const folder:Folder | undefined  = folders.find(folder=>folder.folderName===note.folderName)
     if(!folder || !folder._id){
      return
     
     }
     console.log(note.noteName)
     const res = await deleteNote(user._id,note.noteName,note.folderName, note._id)
     if(res.status==="error"){
      return 
     }
 
     const newRecenFolders: Note[] =
       recentNotes?.filter((note) => note._id !== selectedMenuId) || [];
     const newFolders: Note[] | null =
       notes?.filter((note) => note._id !== selectedMenuId) || null;
 
     setRecentNotes(newFolders);
     setNotes(newRecenFolders);
     setIsDeleting(false);
    
   };


  const openNoteSharingDialog = ()=>{
    
  }
    const fileMenu = [
        { id: 0, menuIcon: "/images/delete.svg", menuName: "Delete", action: () => handleDeleteFile(), width: 20, height: 20 },
        { id: 1, menuIcon: "/images/info.svg", menuName: "Folder Info", action: () => setInfoVisible(true), width: 20, height: 20 },
        { id: 3, menuIcon: "/images/share.svg", menuName: "Share Note", action: () => openNoteSharingDialog() , width: 20, height: 20 },
      ];
      
     return (
          <div 
            tabIndex={0} 
           ref={menuRef}
            className={` bg-slate-200 w-[12rem] z-10 px-4  absolute right-[4.5rem] bottom-[-8.5rem] rounded-xl`}
          >
            <ul className="list-none">
              {fileMenu.map((menu, index) => (
                <li key={menu.id}>
                  <button
                   
                    onClick={(event) => {
                      event.stopPropagation()
                      menu.action();
                      

                
                    }}
                    className={`flex w-full flex-row items-center gap-2 py-3 border-b-[1px] border-gray-400 
                      ${index === fileMenu.length - 1 ? "border-none" : ""} `}
                  >
                    <Image alt={menu.menuIcon} src={menu.menuIcon} width={menu.width} height={menu.height} />
                    {menu.menuName}
                  </button>
           
                 
                </li>
              ))}
                
            </ul>
              {infoVisible && <NoteInfo info={info} />}
          </div>
        );
}