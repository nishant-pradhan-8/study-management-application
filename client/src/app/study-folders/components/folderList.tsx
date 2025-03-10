"use client";
import Image from "next/image";
import Link from "next/link";
import { useUserContext } from "@/context/userContext";
import { useEffect } from "react";
import FolderMenu from "@/app/_components/folders/folderMenu";
import { Folder } from "@/types/types";
import { useFolderContext } from "@/context/folderContext";
import { updateAccessCount } from "@/actions/folders/folderAction";
import useCreateFolder from "@/hooks/folders/useCreateFolder";
import useMenu from "@/hooks/useMenu";
import useOverlayDialog from "@/hooks/useOverlayDialog";
import useViewInfo from "@/hooks/useViewInfo";
import RenameDialog from "@/app/_components/folders/renameDialog";
import FolderSkeleton from "@/app/_components/skeletons/folderSkeleton";
import useMultipleSelection from "@/hooks/useMultipleSelection";
import DeleteBar from "@/app/_components/folders/deleteBarFolder";

export default function FolderList() {
  const { folders, setFolders, setInfoPosition, setFaf, setMenuPosition } =
    useFolderContext();

  const { isDeleting, setAlertDialogOpen } = useUserContext();

  const { selected, setSelected, handleSelection } = useMultipleSelection();

  const {
    selectedMenuId,
    setSelectedMenuId,
    menuRef,
    infoVisible,
    setInfoVisible,
  } = useMenu();

  const {
    newFolderName,
    setNewFolderName,
    folderNameError,
    inputRef,
    handleCreateFolder,
  } = useCreateFolder(folders, setFolders);

  const { handleDialogOpen, handleDialogclose, tempId, overlayDialogOpen } =
    useOverlayDialog(selectedMenuId, setAlertDialogOpen, setSelectedMenuId);

  const { info } = useViewInfo(selectedMenuId,  "folder");

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [folders, inputRef]);

  const manageCreateFolder = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      await handleCreateFolder();
      setFaf(null);
    }
  };

  const handleCreateFolderOnBlur = () => {
    const modifiedFolders: Folder[] =
      folders?.filter((folder) => folder._id !== null) || [];
    setFolders(modifiedFolders);
  };

  const handleMenuOpen = (folderId: string | null) => {
    setSelectedMenuId(folderId);
    setMenuPosition({ left: "-12rem", bottom: "-12rem" });
    setInfoPosition({ right: "0rem", bottom: "-12rem" });
  };

  return (
    <div className="mt-8 flex flex-col  gap-4">
      {selected && (
        <DeleteBar
          selected={selected}
          setSelected={setSelected}
          setSelectedMenuId={setSelectedMenuId}
        />
      )}

      {folders ? (
        folders.length > 0 ? (
          folders.map((folder) =>
            folder._id ? (
              <div
                key={folder._id}
                className={`folder-card w-full ${
                  selected?.includes(folder._id!)
                    ? "border-[2px] border-lightBlue"
                    : ""
                }  `}
              >
                <Link
                  onClick={(e) => {
                    if (selected) {
                      e.preventDefault();
                      handleSelection(folder._id!);
                    } else {
                      updateAccessCount(folder._id);
                    }
                  }}
                  href={`/study-folders/${folder._id}`}
                  className="folder-icon-div w-full "
                >
                  <Image
                    src="/images/folder-dark.svg"
                    alt="folder-icon"
                    width={25}
                    height={25}
                  />
                  <p className="w-[15rem] max-sm:w-[10rem] overflow-hidden text-ellipsis">
                    {folder.folderName}
                  </p>
                </Link>
                <a
                  onClick={() => {
                    handleMenuOpen(folder._id);
                  }}
                  className="cursor-pointer relative"
                >
                  <Image
                    src="/images/menu.svg"
                    alt="menu"
                    width={20}
                    height={20}
                  />
                  {selectedMenuId === folder._id &&
                    !isDeleting &&
                    !selected && (
                      <FolderMenu
                        handleDialogOpen={handleDialogOpen}
                        info={info}
                        infoVisible={infoVisible}
                        setInfoVisible={setInfoVisible}
                        setSelectedMenuId={setSelectedMenuId}
                        selectedMenuId={selectedMenuId}
                        menuRef={menuRef}
                        setSelected={setSelected}
                      />
                    )}
                </a>
              </div>
            ) : (
              <div key={folder._id} className="folder-card w-full">
                <div className="folder-icon-div w-full">
                  <Image
                    src="/images/folder-dark.svg"
                    alt="folder-icon"
                    width={25}
                    height={25}
                  />
                  <input
                    type="text"
                    ref={inputRef}
                    className="border-[1px] text-black border-gray-400 max-sm:w-[10rem] outline-none"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={manageCreateFolder}
                    onBlur={handleCreateFolderOnBlur}
                  />
                  {folderNameError && (
                    <p className="text-red-600 font-normal">
                      *{folderNameError}
                    </p>
                  )}
                </div>
              </div>
            )
          )
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <Image
              src="/images/folder.png"
              width={300}
              height={300}
              alt="study"
            />
            <p className="text-gray-600">
              No Folders Created. Create a Folder to start storing your study
              materials!
            </p>
          </div>
        )
      ) : (
        <FolderSkeleton />
      )}

      {overlayDialogOpen && (
        <RenameDialog tempId={tempId} handleDialogclose={handleDialogclose} />
      )}
    </div>
  );
}
