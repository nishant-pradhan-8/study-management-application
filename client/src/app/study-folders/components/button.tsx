"use client";
import Image from "next/image";
import { Folder } from "@/types/types";
import { useFolderContext } from "@/context/folderContext";
export default function Button({
  action,
  src,
}: {
  action: string;
  src: string;
}) {
  const { setFolders } = useFolderContext();
  const folderAction = (action: string) => {
    if (action === "Create") {
      const newFolder: Folder = {
        _id: null,
        folderName: "",
        createdAt: null,
      };
      setFolders((val) => [...(val || []), newFolder]);
    }
  };
  return (
    <button onClick={() => folderAction(action)} className="primary-btn">
      <Image src={src} alt="demo" width={20} height={20} />
      {action}
    </button>
  );
}
