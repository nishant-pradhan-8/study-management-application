import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { SharedNotes } from "@/types/types";
import { sharedNotesToDelete } from "@/types/types";
import useDeleteSharedNotes from "@/hooks/sharedNotes/useDeleteSharedNotes";
import { useUserContext } from "@/context/userContext";
export default function SelectBar({
  selected,
  setSelected,
  sharedFileSelection,
  setSharedFileSelection,
  sharedNotes,
  handleDialogOpen,
  setSharedNotes,
  transfering,
}: {
  selected: string[] | null;
  setSelected: Dispatch<SetStateAction<string[] | null>>;
  sharedFileSelection: SharedNotes[] | null;
  setSharedFileSelection: Dispatch<SetStateAction<SharedNotes[] | null>>;
  sharedNotes: SharedNotes[] | null;
  handleDialogOpen: () => void;
  setSharedNotes: Dispatch<SetStateAction<SharedNotes[] | null>>;
  transfering: boolean;
}) {
  const { user, setIsDeleting, isDeleting } = useUserContext();

  const { handleDeleteSharedFile } = useDeleteSharedNotes(
    user,
    setIsDeleting,
    sharedNotes,
    setSharedNotes
  );

  const handleMultipleDelete = async () => {
    const modFileSelection: sharedNotesToDelete[] =
      sharedFileSelection?.map((note) => {
        return {
          _id: note._id,
          name: note.noteName,
        };
      }) || [];
    if (!modFileSelection) {
      return;
    }
    await handleDeleteSharedFile(modFileSelection);
    setSharedFileSelection(null);
    setSelected(null);
  };

  return (
    <div className="w-full bg-gray-300 mb-4 h-8 flex flex-row gap-2 rounded-[4px] items-center">
      <button
        onClick={() => {
          setSharedFileSelection(null);
          setSelected(null);
        }}
        className="cursor-pointer hover:bg-slate-50 h-full rounded-full px-1"
      >
        <Image src="/images/cross.svg" width={25} height={25} alt="close" />
      </button>
      <p className="text-[0.8rem] font-bold mr-2">
        {selected && selected.length} Selected
      </p>

      <button
        disabled={isDeleting || selected?.length === 0}
        onClick={handleMultipleDelete}
        className="cursor-pointer hover:bg-slate-50 h-full rounded-full px-2"
      >
        <Image src="/images/delete.svg" width={18} height={18} alt="delete" />
      </button>

      <button
        onClick={handleDialogOpen}
        disabled={isDeleting || transfering || selected?.length === 0}
        className="cursor-pointer hover:bg-slate-50 h-full rounded-full px-2"
      >
        <Image src="/images/move.svg" width={22} height={22} alt="delete" />
      </button>
    </div>
  );
}
