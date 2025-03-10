import Image from "next/image";
import { SetStateAction, Dispatch } from "react";
import useDeleteFolders from "@/hooks/folders/useDeleteFolder";
import { useFolderContext } from "@/context/folderContext";
import { useNoteContext } from "@/context/notesContext";
import { useUserContext } from "@/context/userContext";
export default function DeleteBar({
  selected,
  setSelected,
  setSelectedMenuId,
}: {
  selected: string[] | null;
  setSelected: Dispatch<SetStateAction<string[] | null>>;
  setSelectedMenuId: Dispatch<SetStateAction<string | null>>;
}) {
  const { user, setIsDeleting, isDeleting } = useUserContext();
  const { faf, folders, setFolders, setFaf } = useFolderContext();
  const { setRecentNotes } = useNoteContext();

  const { handleDeleteFolder } = useDeleteFolders(
    user,
    selected,
    setSelectedMenuId,
    setIsDeleting,
    faf,
    folders,
    setFolders,
    setFaf,
    setRecentNotes
  );

  const handleMultipleDelete = async () => {
    await handleDeleteFolder();
    setSelected(null);
  };

  return (
    <div className="w-full bg-gray-300 h-8 flex flex-row gap-2 rounded-[4px] items-center">
      <button
        disabled={isDeleting}
        onClick={() => setSelected(null)}
        className="cursor-pointer hover:bg-slate-50 h-full rounded-full px-1"
      >
        <Image src="/images/cross.svg" width={25} height={25} alt="close" />
      </button>
      <p className="text-[0.8rem] font-bold mr-2">
        {selected?.length} Selected
      </p>

      <button
        onClick={handleMultipleDelete}
        disabled={isDeleting || selected?.length === 0}
        className="cursor-pointer hover:bg-slate-50 h-full rounded-full px-2"
      >
        <Image src="/images/delete.svg" width={18} height={18} alt="delete" />
      </button>
    </div>
  );
}
