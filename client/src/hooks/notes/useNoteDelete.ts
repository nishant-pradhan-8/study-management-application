import { deleteNotes } from "@/actions/notes/noteAction";
import { Folder, User, Note } from "@/types/types";
import { SetStateAction } from "preact/compat";
import { Dispatch } from "react";
import { FileSelection } from "../useMultipleSelection";
export default function useNoteDelete(
  user: User | null,
  folders: Folder[] | null,
  setIsDeleting: Dispatch<SetStateAction<boolean>>,
  recentNotes: Note[] | null,
  notes: Note[] | null,
  setNotes: Dispatch<SetStateAction<Note[] | null>>,
  setRecentNotes: Dispatch<SetStateAction<Note[] | null>>
) {
  const handleDeleteFile = async (notesToDelete: FileSelection[] | null) => {
    if (!user || !folders || !notesToDelete || notesToDelete.length === 0) {
      return;
    }

    setIsDeleting(true);

    const res = await deleteNotes(notesToDelete, user._id);
    if (res.data.status === "error") {
      setIsDeleting(false);
      return;
    }

    const notesIds = notesToDelete.map((note) => note.fileId);

    const newRecentNotes: Note[] =
      recentNotes?.filter((note) => !notesIds.includes(note._id)) || [];
    const newNotes: Note[] | null =
      notes?.filter((note) => !notesIds.includes(note._id)) || null;

    setRecentNotes(newRecentNotes);
    setNotes(newNotes);
    setIsDeleting(false);
  };
  return { handleDeleteFile };
}
