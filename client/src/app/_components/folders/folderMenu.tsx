"use client";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { useFolderContext } from "@/context/folderContext";
import useDeleteFolders from "@/hooks/folders/useDeleteFolder";
import { useUserContext } from "@/context/userContext";
import { useNoteContext } from "@/context/notesContext";
import FolderInfo from "./folderInfo";
import { Info } from "@/hooks/useViewInfo";

export default function FolderMenu({
  handleDialogOpen,
  setSelectedMenuId,
  selectedMenuId,
  menuRef,
  infoVisible,
  setInfoVisible,
  info,
  setSelected,
}: {
  handleDialogOpen: () => void | null;
  setSelectedMenuId: Dispatch<SetStateAction<string | null>>;
  selectedMenuId: string | null;
  menuRef: React.RefObject<HTMLDivElement | null>;
  infoVisible: boolean;
  setInfoVisible: Dispatch<SetStateAction<boolean>>;
  info: Info[] | null;
  setSelected: Dispatch<SetStateAction<string[] | null>>;
}) {
 

  const { faf, setFaf, setFolders, folders, menuPosition } = useFolderContext();
  const { setRecentNotes } = useNoteContext();
  const { user, setIsDeleting } = useUserContext();

  const { handleDeleteFolder } = useDeleteFolders(
    user,
    [selectedMenuId!],
    setSelectedMenuId,
    setIsDeleting,
    faf,
    folders,
    setFolders,
    setFaf,
    setRecentNotes
  );

  const handleSelection = () => {
    setSelected([selectedMenuId!]);
    setSelectedMenuId(null);
  };

  const folderMenu = [
    {
      id: 0,
      menuIcon: "/images/delete.svg",
      menuName: "Delete",
      action: () => handleDeleteFolder(),
      width: 20,
      height: 20,
    },
    {
      id: 1,
      menuIcon: "/images/info.svg",
      menuName: "Folder Info",
      action: () => setInfoVisible(true),
      width: 20,
      height: 20,
    },
    {
      id: 3,
      menuIcon: "/images/pencil.svg",
      menuName: "Rename",
      action: () => handleDialogOpen(),
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
      className={` bg-slate-200 w-[12rem] z-10 px-4  absolute  rounded-xl`}
      style={{
        right: menuPosition.right,
        bottom: menuPosition.bottom,
        left: menuPosition.left,
      }}
    >
      <ul className="list-none">
        {folderMenu.map((menu, index) => (
          <li key={menu.id}>
            <button
              onClick={() => {
                menu.action();
              }}
              className={`flex w-full flex-row items-center gap-2 py-3 border-b-[1px] border-gray-400 
                          ${
                            index === folderMenu.length - 1 ? "border-none" : ""
                          }`}
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
        {infoVisible && <FolderInfo info={info} />}
      </ul>
    </div>
  );
}
