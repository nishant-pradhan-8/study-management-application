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
export default function RecentNotes() {
  const {
    notes,
    fileIcons,
    setRecentNotes,
    recentNotes,
    setActiveFile,

  } = useNoteContext();

  const {handleFileOpen} = useViewFile(setActiveFile, fileIcons)

  useEffect(() => {
    if (!recentNotes) {
      const fetchNotes = async () => {
        const res = await getLastViewedNotes();
        if (!res.data) {
          console.log("No folders to show");
          return;
        }
        const formattedRes: Note[] = res.data.slice(0, 5).map((note: any) => {
          return {
            noteName: note.noteName,
            noteId: note._id,
            contentType: note.contentType,
            downloadUrl: note.downloadUrl,
          };
        });
        
        setRecentNotes(formattedRes);
      };
      fetchNotes();
    }
  }, []);


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
}/* */