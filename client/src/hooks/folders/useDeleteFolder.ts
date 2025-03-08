import { deleteFolder } from "@/actions/folders/folderAction";
import { Folder, User, Note } from "@/types/types";
import { SetStateAction } from "preact/compat";
import { Dispatch } from "react";
export default function useDeleteFolders(
  user: User | null,
  folderIds: string[] | null,
  setSelectedMenuId: Dispatch<SetStateAction<string | null>>,
  setIsDeleting: Dispatch<SetStateAction<boolean>>,
  faf: Folder[] | null,
  folders: Folder[] | null,
  setFolders: Dispatch<SetStateAction<Folder[] | null>>,
  setFaf: Dispatch<SetStateAction<Folder[] | null>>,
  setRecentNotes: Dispatch<SetStateAction<Note[] | null>>
) {
  const handleDeleteFolder = async () => {
    if (!user || !folderIds) {
      return;
    }
    setSelectedMenuId(null);
    setIsDeleting(true);
    const res = await deleteFolder(folderIds, user._id);
    if (res.status === "error") {
      setIsDeleting(false);
      return console.log("unable to delete folder");
    }
    const newRecenFolders: Folder[] =
      faf?.filter((folder) => !folderIds.includes(folder._id!)) || [];
    const newFolders: Folder[] | null =
      folders?.filter((folder) => !folderIds.includes(folder._id!)) || null;

    setFolders(newFolders);
    setFaf(newRecenFolders);
    setIsDeleting(false);
    setRecentNotes(null);
  };
  return { handleDeleteFolder };
}
