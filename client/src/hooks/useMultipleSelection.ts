import { useState } from "react";
import { Note, SharedNotes } from "@/types/types";
export interface FileSelection {
  fileId: string | null;
  folderId: string | null;
  fileName: string | null;
}
export default function useMultipleSelection() {
  const [selected, setSelected] = useState<string[] | null>(null);
  const [fileSelection, setFileSelection] = useState<Note[] | null>(null);
  const [sharedFileSelection, setSharedFileSelection] = useState<
    SharedNotes[] | null
  >(null);
  const handleSelection = (Id: string) => {
    if (selected?.includes(Id)) {
      const newSelectionFolders = selected.filter((folder) => folder !== Id);
      setSelected(newSelectionFolders);
    } else {
      setSelected([...(selected || []), Id]);
    }
  };

  const handleFileSelection = (note: Note) => {
    if (selected?.includes(note._id)) {
      const newSelection =
        fileSelection?.filter((file) => file.noteName !== note.noteName) || [];
      const newSelectedFile = selected?.filter((ids) => ids !== note._id) || [];

      setSelected(newSelectedFile);
      setFileSelection(newSelection);
    } else {
      setSelected([...(selected || []), note._id]);
      setFileSelection([...(fileSelection || []), note]);
    }
  };

  const handleSharedFileSelection = (note: SharedNotes) => {
    if (selected?.includes(note._id)) {
      const newSelection =
        fileSelection?.filter((file) => file.noteName !== note.noteName) || [];
      const newSelectedFile = selected?.filter((ids) => ids !== note._id) || [];

      setSelected(newSelectedFile);
      setFileSelection(newSelection);
    } else {
      setSelected([...(selected || []), note._id]);
      setSharedFileSelection([...(sharedFileSelection || []), note]);
    }
  };

  return {
    selected,
    setSelected,
    handleSelection,
    handleFileSelection,
    fileSelection,
    setFileSelection,
    handleSharedFileSelection,
    sharedFileSelection,
    setSharedFileSelection,
  };
}
