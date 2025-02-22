"use client";
import Image from "next/image";
import { useNoteContext } from "@/context/notesContext";
import NotesSkeleton from "../skeletons/notesSkeleton";
import { useEffect } from "react";
import { getLastViewedNotes } from "@/actions/notes/noteAction";
import useViewFile from "@/hooks/notes/useViewFile";
import FileMenu from "./fileMenu";
import useMenu from "@/hooks/useMenu";
import useViewInfo from "@/hooks/useViewInfo";
import { getNoteInfo } from "@/actions/notes/noteAction";
import { useUserContext } from "@/context/userContext";
import DeletingProcess from "../deletingProcess";
export default function RecentNotes() {
  const {
    recentNotes,
    fileIcons,
    setRecentNotes,
    setActiveFile,
  } = useNoteContext();
  const {user, isDeleting} = useUserContext()
  const { handleFileOpen } = useViewFile(setActiveFile, fileIcons);
  const {selectedMenuId, setSelectedMenuId, menuRef,infoVisible, setInfoVisible} = useMenu()
  const {info} = useViewInfo(selectedMenuId,getNoteInfo, "note" )
  useEffect(() => {
    if (!recentNotes) {
      const fetchNotes = async () => {
        const res = await getLastViewedNotes();
        if (!res.data) {
          console.log("No folders to show");
          return;
        }
        setRecentNotes(res.data);
      };
      fetchNotes();
    }
  }, [recentNotes]);

  useEffect(()=>{
    console.log(selectedMenuId)
  },[selectedMenuId])
  return (
    <div className="container py-10 ">
      <h1 className="heading-1 ">Recently Viewed Study Notes</h1>

      {recentNotes ? (
        recentNotes.length > 0 ? (
          <table
            className="w-full  rounded-xl border-spacing-y-2 border-separate
  }"
          >
            <thead className="bg-gray-300 mb-2">
              <tr className="text-left">
                <th className="rounded-l-xl">Note Name</th>
                <th>Type</th>
                <th>Size</th>
                <th>Folder Name</th>
                <th className="rounded-r-xl"></th>
              </tr>
            </thead>
            <tbody>
              {recentNotes.map((note) => (
                <tr key={note._id}>
                  <td className="">
                    <a
                      onClick={() => handleFileOpen(note)}
                      className="flex flex-row items-center cursor-pointer"
                    >
                      <div className="bg-gray-300 rounded-[8px] p-2 mr-2">
                        <Image
                          src={`/images/${fileIcons[note.contentType]}`}
                          alt="image-icon"
                          width={20}
                          height={20}
                        />
                      </div>
                     <p>{note.noteName}</p> 
                    </a>
                  </td>
                  <td>{note.fileType}</td>
                  <td>{note.fileSize}</td>
                  <td className=""><p className=" overflow-hidden text-ellipsis">{note.folderName}</p></td>
                  <td className="relative">
                    <a
                      onClick={() => setSelectedMenuId(note._id)}
                      className="cursor-pointer"
                    >
                      <Image
                        src="/images/menu.svg"
                        alt="folder-icon"
                        width={20}
                        height={20}
                      />
                      {selectedMenuId === note._id && !isDeleting && <FileMenu info={info} note={note}  infoVisible={infoVisible} setInfoVisible={setInfoVisible} setSelectedMenuId={setSelectedMenuId}  selectedMenuId={selectedMenuId} menuRef={menuRef} /> }
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          < div className="flex flex-col items-center justify-center gap-2">
          <Image src="/images/focused.png" width={300} height={300} alt="study" />
          <p className="text-gray-600">No Notes To Display. Create a Folder and Upload a Note To Get Started!</p>
          </div>
        )
      ) : (
        <NotesSkeleton />
      )}
         {isDeleting && <DeletingProcess  />} 
    </div>
  );
}

/*
 <th>    
                <a   className="cursor-pointer">
                <Image
                  src="/images/menu.svg"
                  alt="folder-icon"
                  width={20}
                  height={20}
                />
                </a>
                </th>
"use client";
import Image from "next/image";
import { useEffect } from "react";
import { getLastViewedNotes } from "@/actions/notes/noteAction";
import { Note } from "@/types/types";
import { useNoteContext } from "@/context/notesContext";
import useViewFile from "@/hooks/useViewFile";
import NotificationSkeleton from "./notificationSkeleton";
import NotesSkeleton from "./notesSkeleton";
import { Folders } from "lucide-react";
import RenameDialog from "./renameDialog";
import { useFolderContext } from "@/context/folderContext";
export default function RecentNotes() {
  const {
    notes,
    fileIcons,
    setRecentNotes,
    recentNotes,
    setActiveFile,

  } = useNoteContext();
  const{folderRenameDialogOpen} = useFolderContext()

  const {handleFileOpen} = useViewFile(setActiveFile, fileIcons)


  return (
    <div>
      <h1 className="heading-1 my-4">Recent Study Notes</h1>
      <h2 className="text-[1rem] font-semibold mb-2">Note Name</h2>
       <div className=" flex flex-col">
 
  {recentNotes?
  recentNotes.length>0?
  recentNotes.slice(0, 5).map((note) => (
    <a
      key={note.noteId}
      onClick={() => handleFileOpen(note)}
      className="flex flex-row items-center font-semibold border-t-[1px] last:border-b-[1px] border-gray-400 py-2 w-full cursor-pointer"
    >
          <div className="bg-gray-300 rounded-[8px] p-2 mr-2"> 
          <Image
        src={`/images/${fileIcons[note.contentType]}`}
     
        alt="image-icon"
        width={20}
        height={20}
       
      />
              </div>
    
      {note.noteName}
    </a>
  ))

         :<p>No notes to Show</p>:
         <NotesSkeleton /> }
      </div>
     
    </div>
  );








       <td className="w-[22rem]">
                    <a
                      onClick={() => handleFileOpen(note)}
                      className="flex flex-row items-center cursor-pointer"
                    >
                      <div className="bg-gray-300 rounded-[8px] p-2 mr-2">
                        <Image
                          src={`/images/${fileIcons[note.contentType]}`}
                          alt="image-icon"
                          width={20}
                          height={20}
                        />
                      </div>
                     <p className="w-[18rem] overflow-hidden text-ellipsis">{note.noteName}</p> 
                    </a>
                  </td>
                  <td>{note.fileType}</td>
                  <td>{note.fileSize}</td>
                  <td className="w-[19rem]"><p className="w-[19rem] overflow-hidden text-ellipsis">{note.folderName}</p></td>
                  <td className="relative">
                    <a
                      onClick={() => setSelectedMenuId(note._id)}
                      className="cursor-pointer"
                    >
                      <Image
                        src="/images/menu.svg"
                        alt="folder-icon"
                        width={20}
                        height={20}
                      />
                      {selectedMenuId === note._id && !isDeleting && <FileMenu info={info} note={note}  infoVisible={infoVisible} setInfoVisible={setInfoVisible} setSelectedMenuId={setSelectedMenuId}  selectedMenuId={selectedMenuId} menuRef={menuRef} /> }
                    </a>
                  </td>
}*/
