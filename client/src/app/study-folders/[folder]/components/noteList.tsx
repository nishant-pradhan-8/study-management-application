"use client";
import Image from "next/image";
import { useNoteContext } from "@/context/notesContext";
import apiCall from "@/utils/backEndApiHandler";
import { useEffect } from "react";
import useViewFile from "@/hooks/notes/useViewFile";
import FileMenu from "@/app/_components/notes/fileMenu";
import useMenu from "@/hooks/useMenu";
import useViewInfo from "@/hooks/useViewInfo";
import { useUserContext } from "@/context/userContext";
import ShareFile from "@/app/_components/notes/shareFile";
import useOverlayDialog from "@/hooks/useOverlayDialog";
import TableLoadingSkeleton from "@/app/_components/skeletons/tableSkeleton";
import { Folder } from "@/types/types";
import { useFolderContext } from "@/context/folderContext";
import { useState } from "react";
import { getNotes } from "@/actions/notes/noteAction";
import DeleteBarNote from "@/app/_components/notes/deleteBarNote";
import useMultipleSelection from "@/hooks/useMultipleSelection";
import useShareNote from "@/hooks/notes/useShareNote";
export default function NoteList({ folderId }: { folderId: string }) {
  const {fileIcons, setActiveFile } =
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

  const { handleDialogOpen, handleDialogclose,  overlayDialogOpen } =
    useOverlayDialog(selectedMenuId, setAlertDialogOpen, setSelectedMenuId);

  const { folders, setActiveFolder } = useFolderContext();

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const { setNotes, getRootProps, notes } = useNoteContext();

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
    if (folderId) {
      const selectedFolder: Folder | null =
        folders?.find((folder) => folder._id === folderId) || null;
      if (!selectedFolder) {
        return;
      }
      const selectedFolderId: string | null =
        selectedFolder && selectedFolder._id;
      setSelectedFolderId(selectedFolderId);
    }
  }, [folders,folderId]);

  useEffect(() => {
    if (selectedFolderId) {
      const fetchNotes = async () => {
        const res = await getNotes(selectedFolderId);
        if (!res.data) {
          return console.log("Unable to fetch Notes");
        }
        setActiveFolder(selectedFolderId);
        setNotes(res.data);
      };
      fetchNotes();
    }
  }, [selectedFolderId, setActiveFolder, setNotes]);

  return (
    <div {...getRootProps()} className="flex flex-col">
      {selected && (
        <DeleteBarNote
          selected={selected}
          setSelected={setSelected}
          fileSelection={fileSelection}
          setFileSelection={setFileSelection}
          isSharing={isSharing}
          handleDialogOpen={handleDialogOpen}
        />
      )}

      {notes ? (
        notes.length > 0 ? (
          <>
            <table className="w-full rounded-xl border-spacing-y-2 border-separate">
              <thead className="bg-gray-300 mb-2">
                <tr className="text-left">
                  <th className="rounded-l-xl w-[50%] max-md:w-[80%] ">
                    Note Name
                  </th>
                  <th className="w-[10%] max-md:hidden">Type</th>
                  <th className="w-[10%] max-md:hidden">Size</th>
                  <th className="w-[20] max-md:hidden">Folder Name</th>
                  <th className="rounded-r-xl w-[10%]   max-md:w-[20%] "></th>
                </tr>
              </thead>
              <tbody>
                {notes.map((note) => (
                  <tr key={note._id}>
                    <td>
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
                        className="cursor-pointer relative "
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
                              notesArray={notes}
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
              width={500}
              height={500}
              alt="study"
            />
            <p className="text-gray-600">
              No Notes To Display. Upload or Drag and Drop a Note To Get
              Started!
            </p>
          </div>
        )
      ) : (
        <TableLoadingSkeleton />
      )}
    </div>
  );
}
/*   {displayFile && (
                         {fileMenuOpenId === note.noteId &&  <FileMenu note={note} />}
               /* <iframe 
                src={`https://docs.google.com/gview?url=https://5405-2407-1400-aa58-4b18-e88b-90e7-6f55-7904.ngrok-free.app/api/note/678f5c88e95f64d0d3d7f6f1&embedded=true`}
                width="600" 
                height="400">
              </iframe>
              <embed className="fixed top-0 left-0 w-full h-full" src="https://950b-2407-1400-aa58-4b18-60e6-9fc-a466-61a7.ngrok-free.app/api/note/678f5c88e95f64d0d3d7f6f1" />
      
          )}
*/
