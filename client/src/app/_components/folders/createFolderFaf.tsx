"use client";
import useCreateFolder from "@/hooks/folders/useCreateFolder";
import { useFolderContext } from "@/context/folderContext";
import { useState } from "react";
import Image from "next/image";

const CreateFolderFaf = () => {
  const { setFolders, setFaf, folders } = useFolderContext();

  const { newFolderName, setNewFolderName, inputRef, handleCreateFolder } =
    useCreateFolder(folders, setFolders);

  const [creatingFolder, setCreatingFolder] = useState<boolean>(false);

  const allowFolderCreation = () => {
    if (inputRef.current) {
      setNewFolderName("");
      inputRef.current.focus();
    }
    setCreatingFolder(true);
  };

  const handleFolderCreationCancel = () => {
    setCreatingFolder(false);
    setNewFolderName("Create a Folder");
  };

  const manageCreateFolder = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      await handleCreateFolder();
      setFaf(null);
      setFolders(null);
    }
  };

  return (
    <a
      onClick={() => allowFolderCreation()}
      className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between w-64 cursor-pointer  border-[1px] border-gray-300"
    >
      {" "}
      <div className="flex items-center">
        <div className="bg-gray-800 rounded-xl p-2 mr-2">
          <Image
            src="/images/folder-light.svg"
            alt="folders"
            width={25}
            height={25}
          />
        </div>
        <input
          type="text"
          ref={inputRef}
          className="border-[1px] text-black border-gray-400 outline-none border-none w-[9rem] placeholder:text-black  "
          placeholder={!creatingFolder ? "Create a Folder" : ""}
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          readOnly={!creatingFolder}
          onBlur={() => handleFolderCreationCancel()}
          onKeyDown={manageCreateFolder}
        />
      </div>
      <button className="text-gray-500 hover:text-gray-700">
        {" "}
        <Image src="/images/plus.svg" alt="plus" width={20} height={20} />
      </button>
    </a>
  );
};

export default CreateFolderFaf;
