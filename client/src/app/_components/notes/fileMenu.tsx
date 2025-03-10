"use client";
import Image from "next/image";
import React from "react";
import useNoteDelete from "@/hooks/notes/useNoteDelete";
import { useUserContext } from "@/context/userContext";
import { useNoteContext } from "@/context/notesContext";
import { Dispatch, SetStateAction } from "react";
import { useFolderContext } from "@/context/folderContext";
import { Note } from "@/types/types";
import { Info } from "@/hooks/useViewInfo";
import NoteInfo from "./noteInfo";
import { folderNameToFolderId } from "@/utils/utils";
import { FileSelection } from "@/hooks/useMultipleSelection";
export default function FileMenu({
  handleDialogOpen,
  menuRef,
  note,
  setSelectedMenuId,
  selectedMenuId,
  infoVisible,
  setInfoVisible,
  info,
  setSelected,
  setFileSelection,
  notesArray,
}: {
  handleDialogOpen: () => void;
  setSelectedMenuId: Dispatch<SetStateAction<string | null>>;
  note: Note;
  selectedMenuId: string | null;
  menuRef: React.RefObject<HTMLDivElement | null>;
  infoVisible: boolean;
  setInfoVisible: Dispatch<SetStateAction<boolean>>;
  info: Info[] | null;
  setSelected: Dispatch<SetStateAction<string[] | null>>;
  setFileSelection: Dispatch<SetStateAction<Note[] | null>>;

  notesArray: Note[] | null;
}) {
  const { user, setIsDeleting } = useUserContext();
  const { recentNotes, notes, setRecentNotes, setNotes } = useNoteContext();
  const { folders } = useFolderContext();
  const { handleDeleteFile } = useNoteDelete(
    user,
    folders,
    setIsDeleting,
    recentNotes,
    notes,
    setNotes,
    setRecentNotes
  );

  const openNoteSharingDialog = () => {
    const selectedNote = notesArray?.find(
      (note) => note._id === selectedMenuId
    );
    if (!selectedNote) {
      return;
    }
    setFileSelection([selectedNote]);
    handleDialogOpen();
  };

  const handleSelection = () => {
    setSelected([selectedMenuId!]);
    setFileSelection([note]);
    setSelectedMenuId(null);
  };

  const prepareDelete = async () => {
    setSelectedMenuId(null);

    const noteToDelete: FileSelection = {
      fileId: note._id,
      folderId: folderNameToFolderId(folders, note.folderName || ""),
      fileName: note.noteName,
    };
    await handleDeleteFile([noteToDelete]);
    setSelectedMenuId(null);
  };

  const fileMenu = [
    {
      id: 0,
      menuIcon: "/images/delete.svg",
      menuName: "Delete",
      action: () => prepareDelete(),
      width: 20,
      height: 20,
    },
    {
      id: 1,
      menuIcon: "/images/info.svg",
      menuName: "File Info",
      action: () => setInfoVisible(true),
      width: 20,
      height: 20,
    },
    {
      id: 3,
      menuIcon: "/images/share.svg",
      menuName: "Share Note",
      action: () => openNoteSharingDialog(),
      width: 20,
      height: 20,
    },
    {
      id: 4,
      menuIcon: "/images/select.svg",
      menuName: "Select",
      action: () => handleSelection(),
      width: 20,
      height: 20,
    },
  ];

  return (
    <div
      tabIndex={0}
      ref={menuRef}
      className={` bg-slate-200 w-[12rem] z-10 px-4  absolute left-[-12rem] bottom-[-12.5rem] rounded-xl`}
    >
      <ul className="list-none">
        {fileMenu.map((menu, index) => (
          <li key={menu.id}>
            <button
              onClick={(event) => {
                event.stopPropagation();
                menu.action();
              }}
              className={`flex w-full flex-row items-center gap-2 py-3 border-b-[1px] left-[-12rem] border-gray-400 
                      ${index === fileMenu.length - 1 ? "border-none" : ""} `}
            >
              <Image
                alt={menu.menuIcon}
                src={menu.menuIcon}
                width={menu.width}
                height={menu.height}
              />
              {menu.menuName}
            </button>
          </li>
        ))}
      </ul>
      {infoVisible && <NoteInfo info={info} />}
    </div>
  );
}
