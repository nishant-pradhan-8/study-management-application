"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getSharedNotes } from "@/actions/SharedNotes/sharedNoteAction";
import { useNoteContext } from "@/context/notesContext";
import useViewFile from "@/hooks/notes/useViewFile";
import { SharedNotes } from "@/types/types";
import useMenu from "@/hooks/useMenu";
import SrMenu from "./srMenu";
import FolderSelection from "./folderSelection";
import useOverlayDialog from "@/hooks/useOverlayDialog";
import { useUserContext } from "@/context/userContext";
import TableLoadingSkeleton from "@/app/_components/skeletons/tableSkeleton";
import useMultipleSelection from "@/hooks/useMultipleSelection";
import SelectBar from "./selectBar";
import useTransferNote from "@/hooks/sharedNotes/useTransferNote";
export default function SharedList() {
  const [sharedNotes, setSharedNotes] = useState<SharedNotes[] | null>(null);
  const { setActiveFile, fileIcons } = useNoteContext();
  const { setAlertDialogOpen, user, setPopUpMessage } = useUserContext();
  const { handleFileOpen } = useViewFile(setActiveFile, fileIcons);
  const {
    selectedMenuId,
    setSelectedMenuId,
    menuRef
  } = useMenu();
  const { handleDialogOpen, handleDialogclose, overlayDialogOpen } =
    useOverlayDialog(selectedMenuId, setAlertDialogOpen, setSelectedMenuId);

  const {
    selected,
    handleSharedFileSelection,
    setSelected,
    sharedFileSelection,
    setSharedFileSelection,
  } = useMultipleSelection();

  const {
    selectedFolder,
    setSelectedFolder,
    transfering,
    transferError,
    handleNoteTransfer,
  } = useTransferNote(
    user?._id || null,
    sharedNotes,
    setSharedNotes,
    handleDialogclose,
    setPopUpMessage
  );

  useEffect(() => {
    if (!sharedNotes && user) {
      const fetchSharedNotes = async () => {
        const response = await getSharedNotes();
        if (!response.data) {
          return console.log("Unable to fetch shared notes!");
        }
        setSharedNotes(response.data);
      };
      fetchSharedNotes();
    }
  }, [sharedNotes, user]);

  return (
    <div className="container pb-10 h-full">
      {selected && (
        <SelectBar
          selected={selected}
          setSelected={setSelected}
          sharedFileSelection={sharedFileSelection}
          setSharedFileSelection={setSharedFileSelection}
          sharedNotes={sharedNotes}
          setSharedNotes={setSharedNotes}
          transfering={transfering}
          handleDialogOpen={handleDialogOpen}
        />
      )}
      {sharedNotes ? (
        sharedNotes.length > 0 ? (
          <>
            <table
              className="w-full  rounded-xl border-spacing-y-2 border-separate
  }"
            >
              <thead className="bg-gray-300 mb-2">
                <tr className="text-left">
                  <th className="rounded-l-xl w-[50%] max-md:w-[80%]">
                    Note Name
                  </th>
                  <th className="w-[10%] max-md:hidden">Type</th>
                  <th className="w-[10%] max-md:hidden">Size</th>
                  <th className="w-[20] max-md:hidden">Shared By</th>
                  <th className="rounded-r-xl w-[10%]  max-md:w-[20%] "></th>
                </tr>
              </thead>
              <tbody>
                {sharedNotes &&
                  sharedNotes.map((note) => (
                    <tr key={note._id}>
                      <td className="">
                        <a
                          onClick={(e) => {
                            if (selected) {
                              e.preventDefault();
                              handleSharedFileSelection(note);
                            } else {
                              handleFileOpen(note);
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
                        <p className=" overflow-hidden text-ellipsis max-md:text-[0.9rem] w-[8rem] max-sm:text-ellipsis max-sm:overflow-hidden ">
                          {note.sharedBy}
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
                          {selectedMenuId === note._id && (
                            <SrMenu
                              handleDialogOpen={handleDialogOpen}
                              setSelectedMenuId={setSelectedMenuId}
                              selectedMenuId={selectedMenuId}
                              menuRef={menuRef}
                              sharedNotes={sharedNotes}
                              note={note}
                              setSharedNotes={setSharedNotes}
                              setSelected={setSelected}
                              setSharedFileSelection={setSharedFileSelection}
                            />
                          )}
                        </a>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {overlayDialogOpen &&
              sharedFileSelection &&
              sharedFileSelection.length > 0 && (
                <FolderSelection
                  sharedFileSelection={sharedFileSelection}
                  userId={user?._id || null}
                  handleDialogclose={handleDialogclose}
                  selected={selected}
                  sharedNotes={sharedNotes}
                  setSharedNotes={setSharedNotes}
                  handleNoteTransfer={handleNoteTransfer}
                  setSelectedFolder={setSelectedFolder}
                  transferError={transferError}
                  selectedFolder={selectedFolder}
                  transfering={transfering}
                  setSelected={setSelected}
                  setSharedFileSelection={setSharedFileSelection}
                />
              )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 h-full ">
            <Image
              src="/images/sharedNotes.png"
              width={500}
              height={500}
              alt="study"
            />
            <p className="text-gray-600">No Notes Shared By Your Friends</p>
          </div>
        )
      ) : (
        <TableLoadingSkeleton />
      )}
    </div>
  );
}

/* 

  <div>
         { activeFile && <FileDisplay />
                   } 
        {
            
            sharedNotes?(
              sharedNotes.length>0?(
                sharedNotes.map((note)=>(
                  <div  key={note._id} className="flex  flex-row  mt-4 items-center justify-between font-semibold border-y-[1px] border-gray-400 py-4 w-full">
                        <a onClick={()=>setActiveFile({fileIcon:fileIcons[note.contentType],fileName:note.noteName,fileUri:note.downloadUrl, contentType:note.contentType})}  className="flex flex-row gap-2 w-full items-center" >
                      <Image src={`/images/${fileIcons[note.contentType]}`}alt='image-icon' width={25} height={25} className="mr-2" />   
                        {note.noteName}
                    </a>
                    <div className="relative">
                        <a  >
                        <Image src={`/images/menu.svg`} alt='image-icon' width={20} height={20}/>
                        </a> 
                    
                      </div>
                   
                        </div>
                        
                ))
              ):<p>No Shared Notes</p>
            ): (<Skeleton className="w-[100px] h-[20px] rounded-full" />)
                  }
                </div>

*/
