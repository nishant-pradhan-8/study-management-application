import { useRef, useState } from "react";
import { createFolder } from "@/actions/folders/folderAction";
import { Folder } from "@/types/types";
import { Dispatch, SetStateAction } from "react";
import { validateFolderName } from "@/utils/utils";
export default function useCreateFolder(
  folders: Folder[] | null,
  setFolders: Dispatch<SetStateAction<Folder[] | null>>
) {
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [folderNameError, setFolderNameError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleCreateFolder = async () => {
    setFolderNameError(null);

    const validation = validateFolderName(newFolderName, folders);
    if (validation !== "") {
      setFolderNameError(validation);
      return;
    }

    try {
      const res = await createFolder(newFolderName);
      if (res && res.data) {
        const newFolder: Folder = {
          _id: res.data._id,
          folderName: res.data.folderName,
          createdAt: res.data.createdAt,
        };

        setFolders((prevFolders) => {
          if (prevFolders) {
            return prevFolders.map((folder) =>
              folder._id === null ? newFolder : folder
            );
          } else {
            return [newFolder];
          }
        });
        setNewFolderName("");
      } else {
        console.log("Unable to create Folder");
      }
    } catch (error) {
      console.error("Error creating folder:", error instanceof Error && error.message);
    }
  };
  return {
    newFolderName,
    setNewFolderName,
    folderNameError,
    inputRef,
    handleCreateFolder,
  };
}
