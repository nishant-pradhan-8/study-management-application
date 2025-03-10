
import {  User } from "@/types/types";
import { SetStateAction } from "preact/compat";
import { Dispatch } from "react";
import { SharedNotes } from "@/types/types";
import { sharedNotesToDelete } from "@/types/types";
import { deleteSharedNotes } from "@/actions/SharedNotes/sharedNoteAction";
export default function useDeleteSharedNotes(
  user: User | null,
  setIsDeleting: Dispatch<SetStateAction<boolean>>,
  sharedNotes: SharedNotes[] | null,
  setSharedNotes: Dispatch<SetStateAction<SharedNotes[] | null>>
) {
  const handleDeleteSharedFile = async (
    sharedNotesToDelete: sharedNotesToDelete[]
  ) => {
    if (!user || !sharedNotesToDelete || sharedNotesToDelete.length === 0) {
      return;
    }

    setIsDeleting(true);

    const res = await deleteSharedNotes(sharedNotesToDelete, user._id);

    if (res.status === "error") {
      setIsDeleting(false);
      return;
    }

    const notesIds = sharedNotesToDelete.map((note) => note._id);

    const newSharedNotes: SharedNotes[] =
      sharedNotes?.filter((note) => !notesIds.includes(note._id)) || [];

    setSharedNotes(newSharedNotes);
    setIsDeleting(false);
  };
  return { handleDeleteSharedFile };
}
