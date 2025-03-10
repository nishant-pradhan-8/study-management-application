"use client";

import { useState } from "react";
import { useFolderContext } from "@/context/folderContext";
import { renameFolder } from "@/actions/folders/folderAction";
import { Folder } from "@/types/types";
import { useNoteContext } from "@/context/notesContext";
export default function RenameDialog({
  tempId,
  handleDialogclose,
}: {
  tempId: string | null;
  handleDialogclose: () => void;
}) {
  const { newFolderName, setNewFolderName, faf, setFolders, setFaf, folders } =
    useFolderContext();

  const { setRecentNotes } = useNoteContext();

  const [folderRenameError, setFolderRenameError] = useState<boolean>(false);

  const handleRenameFolder = async () => {
    if (!tempId) {
      return;
    }
    setFolderRenameError(false);
    const res = await renameFolder({
      newFolderName: newFolderName,
      folderId: tempId,
    });

    if (!res || !res.status || res.status === "error") {
      setFolderRenameError(true);
      setTimeout(() => {
        setFolderRenameError(false);
      }, 5000);
      return;
    }

    const updatedAccessFolders: Folder[] =
      faf?.map((folder) => {
        if (folder._id === tempId) {
          return { ...folder, folderName: newFolderName };
        }
        return folder;
      }) || [];

    const updatedFolders: Folder[] | null =
      folders?.map((folder) => {
        if (folder._id === tempId) {
          return { ...folder, folderName: newFolderName };
        }
        return folder;
      }) || null;

    setFolders(updatedFolders);
    setFaf(updatedAccessFolders);
    setRecentNotes(null);
    handleDialogclose();
  };

  const handleCloseRenameDialog = () => {
    handleDialogclose();
    setFolderRenameError(false);
  };

  return (
    <div className="bg-gray-800 p-6 z-50 rounded-xl shadow-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96">
      <div className="flex flex-row gap-2 items-center">
        <h2 className="text-white text-lg font-semibold">Rename</h2>{" "}
        <p className={`${folderRenameError ? "block" : "hidden"} text-red-400`}>
          *Unable to rename folder.
        </p>
      </div>
      <input
        value={newFolderName}
        onChange={(e) => setNewFolderName(e.target.value)}
        type="text"
        className="w-full mt-3 p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex justify-end gap-3 mt-4">
        <button
          className="text-blue-400 hover:text-blue-300"
          onClick={handleCloseRenameDialog}
        >
          Cancel
        </button>
        <button
          onClick={handleRenameFolder}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          OK
        </button>
      </div>
    </div>
  );
}
