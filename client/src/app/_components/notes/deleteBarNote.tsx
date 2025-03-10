import Image from "next/image";
import { SetStateAction, Dispatch } from "react";
import { useFolderContext } from "@/context/folderContext";
import { useNoteContext } from "@/context/notesContext";
import { useUserContext } from "@/context/userContext";
import useNoteDelete from "@/hooks/notes/useNoteDelete";
import { Note } from "@/types/types";
import { folderNameToFolderId } from "@/utils/utils";
export default function DeleteBarNote({
  selected,
  setSelected,
  fileSelection,
  setFileSelection,
  isSharing,
  handleDialogOpen,
}: {
  selected: string[] | null;
  setSelected: Dispatch<SetStateAction<string[] | null>>;
  fileSelection: Note[] | null;
  setFileSelection: Dispatch<SetStateAction<Note[] | null>>;
  isSharing: boolean;
  handleDialogOpen: () => void;
}) {
  const { user, setIsDeleting, isDeleting } = useUserContext();
  const { folders } = useFolderContext();
  const { setRecentNotes, notes, setNotes, recentNotes } = useNoteContext();

  const { handleDeleteFile } = useNoteDelete(
    user,
    folders,
    setIsDeleting,
    recentNotes,
    notes,
    setNotes,
    setRecentNotes
  );

  const handleMultipleDelete = async () => {
    const modFileSelection = fileSelection?.map((note) => {
      return {
        fileId: note._id,
        folderId: folderNameToFolderId(folders, note.folderName||""),
        fileName: note.noteName,
      };
    });
    if (!modFileSelection) {
      return;
    }
    await handleDeleteFile(modFileSelection);
    setFileSelection(null);
    setSelected(null);
  };
  return (
    <div className="w-full bg-gray-300 h-8 flex flex-row gap-2 rounded-[4px] items-center">
      <button
        disabled={isDeleting || isSharing}
        onClick={() => {
          setFileSelection(null);
          setSelected(null);
        }}
        className="cursor-pointer hover:bg-slate-50 h-full rounded-full px-1"
      >
        <Image src="/images/cross.svg" width={25} height={25} alt="close" />
      </button>
      <p className="text-[0.8rem] font-bold mr-2">
        {selected?.length} Selected
      </p>

      <button
        disabled={isDeleting || isSharing || selected?.length === 0}
        onClick={handleMultipleDelete}
        className="cursor-pointer hover:bg-slate-50 h-full rounded-full px-2"
      >
        <Image src="/images/delete.svg" width={18} height={18} alt="delete" />
      </button>

      <button
        disabled={isDeleting || isSharing || selected?.length === 0}
        onClick={handleDialogOpen}
        className="cursor-pointer hover:bg-slate-50 h-full rounded-full px-2"
      >
        <Image src="/images/share.svg" width={22} height={22} alt="delete" />
      </button>
    </div>
  );
}
