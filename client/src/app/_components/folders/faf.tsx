"use client";
import Image from "next/image";
import { useFolderContext } from "@/context/folderContext";
import { useUserContext } from "@/context/userContext";
import CardSkeleton from "../skeletons/cardSkeleton";
import Link from "next/link";
import { updateAccessCount } from "@/actions/folders/folderAction";
import { getFrequentlyAccessedFolders } from "@/actions/folders/folderAction";
import { Folder } from "@/types/types";
import { useState, useEffect, useRef } from "react";
import { routeFormater } from "@/utils/utils";
import FolderMenu from "../folderMenu";
import RenameDialog from "./renameDialog";
import useMenu from "@/hooks/useMenu";
import useViewInfo from "@/hooks/useViewInfo";
import { getFolderInfo } from "@/actions/folders/folderAction";
import CreateFolderFaf from "./createFolderFaf";
import useOverlayDialog from "@/hooks/useOverlayDialog";
export default function RecentFolders() {
  const { faf, setFaf, setFolders } = useFolderContext();
  const {
    selectedMenuId,
    setSelectedMenuId,
    menuRef,
    infoVisible,
    setInfoVisible,
  } = useMenu();
  const { info } = useViewInfo(selectedMenuId, getFolderInfo, "folder");
  const { isDeleting, setAlertDialogOpen } = useUserContext();
  const { handleDialogOpen, handleDialogclose, tempId, overlayDialogOpen } =
    useOverlayDialog(selectedMenuId, setAlertDialogOpen, setSelectedMenuId);
  useEffect(() => {
    if (!faf) {
      const fetchFrequentlyAccessedFolders = async () => {
        const res = await getFrequentlyAccessedFolders();
        if (!res.data) {
          setFaf([]);
          return console.log("Unable to Fetch Frequently Accessed Folder ");
        }
        const updatedFaf = res.data.map((folder: Partial<Folder>) => {
          return { ...folder, folderRoute: routeFormater(folder.folderName!) };
        });
        setFaf(updatedFaf);
      };
      fetchFrequentlyAccessedFolders();
    }
  }, [faf]);

  return (
    <div>
      <h1 className="heading-1 ">Quick Access</h1>
      <div className="mt-4 flex flex-row justify-start gap-4">
        {faf ? (
          faf.length > 0 ? (
            faf?.map((folder, i) => (
              <div key={folder._id} className="folder-card relative">
                <Link
                  onClick={() => updateAccessCount(folder._id)}
                  href={`/study-folders/${folder._id}`}
                >
                  <div className="folder-icon-div ">
                    <Image
                      src="/images/folder-dark.svg"
                      alt="folder-icon"
                      width={25}
                      height={25}
                    />
                    <div className=" w-[10rem] overflow-hidden whitespace-nowrap overflow-ellipsis">
                      {folder.folderName}
                    </div>
                  </div>
                </Link>
                <a
                  onClick={() => setSelectedMenuId(folder._id)}
                  className="cursor-pointer"
                >
                  <Image
                    src="/images/menu.svg"
                    alt="folder-icon"
                    width={20}
                    height={20}
                  />
                </a>
                {selectedMenuId === folder._id && !isDeleting && (
                  <FolderMenu
                    handleDialogOpen={handleDialogOpen}
                    info={info}
                    infoVisible={infoVisible}
                    setInfoVisible={setInfoVisible}
                    setSelectedMenuId={setSelectedMenuId}
                    selectedMenuId={selectedMenuId}
                    menuRef={menuRef}
                  />
                )}
              </div>
            ))
          ) : (
            <CreateFolderFaf />
          )
        ) : (
          <CardSkeleton />
        )}
        {overlayDialogOpen && (
          <RenameDialog tempId={tempId} handleDialogclose={handleDialogclose} />
        )}
      </div>
    </div>
  );
} /*  {
  faf?
  faf.length>0?
   faf?.map((folder, i)=>(
      <Link onClick={()=>updateAccessCount(folder._id)} href={`/study-folders/${folder.folderRoute}`}  key={folder._id} className='folder-card'>
      <div className='folder-icon-div'>
      <Image src="/images/folder-dark.svg" alt='folder-icon' width={25} height={25} />
       {folder.folderName}
      </div>
      <Image src="/images/menu.svg" alt='folder-icon' width={20} height={20} />

    </Link>
  
    )):<p>No Folders To show</p>:
   
    <CardSkeleton />
} 
 */
