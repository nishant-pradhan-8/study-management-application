import Image from "next/image";
import { SetStateAction } from "preact/compat";
import { Dispatch, useState } from "react";
import { useFolderContext } from "@/context/folderContext";
import { Folder } from "@/types/types";
import FolderInfo from "./folders/folderInfo";
import { useUserContext } from "@/context/userContext";
import { deleteFolder } from "@/actions/folders/folderAction";
import useViewInfo from "@/hooks/useViewInfo";
import { getFolderInfo } from "@/actions/folders/folderAction";
import { Info } from "@/hooks/useViewInfo";
const FolderMenu = ({
  setSelectedMenuId,
  selectedMenuId,
  menuRef,
  infoVisible,
  setInfoVisible,
  info
}: {
  setSelectedMenuId: Dispatch<SetStateAction<string | null>>;
  selectedMenuId: string | null;
  menuRef: React.RefObject<HTMLDivElement | null>;
  infoVisible: boolean;
  setInfoVisible: Dispatch<SetStateAction<boolean>>;
  info:Info[] | null
}) => {
  if(!selectedMenuId){
    return
  }
  const {
    faf,
    setFaf,
    setFolders,
    folders,
    setFolderRenameDialogOpen,
    setTempFolderId,
  } = useFolderContext();

  const { setAlertDialogOpen, user, setIsDeleting } = useUserContext();
  /*To Delete Folder*/
  const handleDeleteFolder = async () => {
    if (!user || !selectedMenuId) {
      return;
    }
    setSelectedMenuId(null);
    setIsDeleting(true);
    await deleteFolder(selectedMenuId, user._id)

    const newRecenFolders: Folder[] =
      faf?.filter((folder) => folder._id !== selectedMenuId) || [];
    const newFolders: Folder[] | null =
      folders?.filter((folder) => folder._id !== selectedMenuId) || null;

    setFolders(newFolders);
    setFaf(newRecenFolders);
    setIsDeleting(false);
  };

  /*To Rename Folder*/
  const handleRenameDialog = () => {
    setTempFolderId(selectedMenuId);
    setFolderRenameDialogOpen(true);
    setAlertDialogOpen(true);
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
      action: () => handleRenameDialog(),
      width: 20,
      height: 20,
    },
  ];

  return (
    <div
      tabIndex={0}
      ref={menuRef}
      className={` bg-slate-200 w-[12rem] z-10 px-4  absolute right-[-10.5rem] bottom-[-8rem] rounded-xl`}
    >
      <ul className="list-none">
        {folderMenu.map((menu, index) => (
          <li key={menu.id}>
            <button
              onClick={() => {
                menu.action();
              }}
              className={`flex w-full flex-row items-center gap-2 py-3 border-b-[1px] border-gray-400 
                  ${index === folderMenu.length - 1 ? "border-none" : ""}`}
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
};

export default FolderMenu;
