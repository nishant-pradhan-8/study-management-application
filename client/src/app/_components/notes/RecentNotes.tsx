"use client";
import Image from "next/image";
import { useNoteContext } from "@/context/notesContext";
import { useEffect } from "react";
import { getLastViewedNotes } from "@/actions/notes/noteAction";
import useViewFile from "@/hooks/notes/useViewFile";
import FileMenu from "./fileMenu";
import useMenu from "@/hooks/useMenu";
import useViewInfo from "@/hooks/useViewInfo";
import { useUserContext } from "@/context/userContext";
import DeletingProcess from "../deletingProcess";
import ShareFile from "./shareFile";
import useOverlayDialog from "@/hooks/useOverlayDialog";
import TableLoadingSkeleton from "../skeletons/tableSkeleton";
import useMultipleSelection from "@/hooks/useMultipleSelection";
import DeleteBarNote from "./deleteBarNote";
import useShareNote from "@/hooks/notes/useShareNote";
import apiCall from "@/utils/backEndApiHandler";

export default function RecentNotes() {
  const { recentNotes, fileIcons, setRecentNotes, setActiveFile} =
    useNoteContext();

  const { isDeleting, setAlertDialogOpen, setPopUpMessage, user } =
    useUserContext();

  const { handleFileOpen } = useViewFile(setActiveFile, fileIcons);

  const {
    selectedMenuId,
    setSelectedMenuId,
    menuRef,
    infoVisible,
    setInfoVisible,
  } = useMenu();

  const { info } = useViewInfo(selectedMenuId,  "note");

  const { handleDialogOpen, handleDialogclose, overlayDialogOpen } =
    useOverlayDialog(selectedMenuId, setAlertDialogOpen, setSelectedMenuId);

  const {
    fileSelection,
    setFileSelection,
    selected,
    handleFileSelection,
    setSelected,
  } = useMultipleSelection();

  const {
    isSharing,
    shareList,
    setShareList,
    fileSharingError,
    handleShareNote,
  } = useShareNote(setPopUpMessage, user);

  useEffect(() => {
    if (!recentNotes && user) {
      const fetchNotes = async () => {
        const res = await getLastViewedNotes();
        if (!res || !res.data) {
          console.log("No folders to show");
          return;
        }
        setRecentNotes(res.data);
      };
      fetchNotes();
    }
  }, [recentNotes, user, setRecentNotes]);

  return (
    <div className="py-10 w-full">
      {selected ? (
        <DeleteBarNote
          selected={selected}
          setSelected={setSelected}
          fileSelection={fileSelection}
          setFileSelection={setFileSelection}
          isSharing={isSharing}
          handleDialogOpen={handleDialogOpen}
        />
      ) : (
        <h1 className="heading-1 max-sm:text-[20px]">Recently Viewed Notes</h1>
      )}

      {recentNotes ? (
        recentNotes.length > 0 ? (
          <>
            <table
              className="w-full  rounded-xl border-spacing-y-2 border-separate
}"
            >
              <thead className="bg-gray-300 mb-2">
                <tr className="text-left">
                  <th className="rounded-l-xl w-[50%] max-md:w-[80%] ">
                    Note Name
                  </th>
                  <th className="w-[10%] max-md:hidden">Type</th>
                  <th className="w-[10%] max-md:hidden">Size</th>
                  <th className="w-[20] max-md:hidden">Folder Name</th>
                  <th className="rounded-r-xl w-[10%]  max-md:w-[20%] "></th>
                </tr>
              </thead>
              <tbody>
                {recentNotes.map((note) => (
                  <tr key={note._id}>
                    <td className="">
                      <a
                        onClick={(e) => {
                          if (selected) {
                            e.preventDefault();
                            handleFileSelection(note);
                          } else {
                            handleFileOpen(note);
                            apiCall("api/note/updateLastViewed", "PATCH", {
                              noteId: note._id,
                            });
                          }
                        }}
                        className="flex flex-row items-center cursor-pointer"
                      >
                        <div
                          className={`bg-gray-300 rounded-[8px] ${
                            selected?.includes(note._id!)
                              ? " bg-lightBlue"
                              : "bg-gray-300"
                          }  p-2 mr-2`}
                        >
                          <Image
                            src={`/images/${fileIcons[note.contentType]}`}
                            alt="image-icon"
                            width={20}
                            height={20}
                          />
                        </div>
                        <p className="max-md:text-[0.9rem] max-sm:w-[8rem] max-sm:text-ellipsis max-sm:overflow-hidden  ">
                          {note.noteName}
                        </p>
                      </a>
                    </td>
                    <td className="max-md:hidden">{note.fileType}</td>
                    <td className="max-md:hidden">{note.fileSize}</td>
                    <td className="max-md:hidden">
                      <p className="max-md:text-[0.9rem] w-[8rem] max-sm:text-ellipsis max-sm:overflow-hidden ">
                        {note.folderName}
                      </p>
                    </td>
                    <td className="flex items-center justify-center">
                      <a
                        onClick={() => setSelectedMenuId(note._id)}
                        className="cursor-pointer relative"
                      >
                        <Image
                          src="/images/menu.svg"
                          alt="folder-icon"
                          width={20}
                          height={20}
                        />
                        {selectedMenuId === note._id &&
                          !isDeleting &&
                          !isSharing && (
                            <FileMenu
                              handleDialogOpen={handleDialogOpen}
                              info={info}
                              note={note}
                              infoVisible={infoVisible}
                              setInfoVisible={setInfoVisible}
                              setSelectedMenuId={setSelectedMenuId}
                              selectedMenuId={selectedMenuId}
                              menuRef={menuRef}
                              setSelected={setSelected}
                              setFileSelection={setFileSelection}
                              notesArray={recentNotes}
                            />
                          )}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {overlayDialogOpen && fileSelection && fileSelection.length > 0 && (
              <ShareFile
                fileSelection={fileSelection}
                handleDialogclose={handleDialogclose}
                isSharing={isSharing}
                shareList={shareList}
                setShareList={setShareList}
                fileSharingError={fileSharingError}
                handleShareNote={handleShareNote}
              />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <Image
              src="/images/focused.png"
              width={300}
              height={300}
              alt="study"
            />
            <p className="text-gray-600">
              No Notes To Display. Create a Folder and Upload a Note To Get
              Started!
            </p>
          </div>
        )
      ) : (
        <TableLoadingSkeleton />
      )}
      {isDeleting && <DeletingProcess />}
    </div>
  );
}
