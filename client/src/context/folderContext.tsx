"use client";
import { createContext, useContext } from "react";
import { ReactNode } from "react";
import { useState } from "react";
import { Folder } from "@/types/types";
import { Dispatch, SetStateAction } from "react";
import { FolderMenuPosition } from "@/types/types";
interface FolderContext {
  folders: Folder[] | null;
  setFolders: Dispatch<SetStateAction<Folder[] | null>>;
  activeFolder: string | null;
  setActiveFolder: Dispatch<SetStateAction<string | null>>;
  recentFolders: Folder[] | null;
  setRecentFolders: Dispatch<SetStateAction<Folder[] | null>>;
  faf: Folder[] | null;
  setFaf: Dispatch<SetStateAction<Folder[] | null>>;
  newFolderName: string;
  setNewFolderName: Dispatch<SetStateAction<string>>;
  menuPosition: Partial<FolderMenuPosition>;
  setMenuPosition: Dispatch<SetStateAction<Partial<FolderMenuPosition>>>;
  infoPosition: Partial<FolderMenuPosition>;
  setInfoPosition: Dispatch<SetStateAction<Partial<FolderMenuPosition>>>;
}
const FolderContext = createContext<FolderContext | undefined>(undefined);

export default function FolderProvider({ children }: { children: ReactNode }) {
  const [folders, setFolders] = useState<Folder[] | null>(null);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [recentFolders, setRecentFolders] = useState<Folder[] | null>(null);
  const [faf, setFaf] = useState<Folder[] | null>(null);
  const [menuPosition, setMenuPosition] = useState<Partial<FolderMenuPosition>>(
    {}
  );
  const [infoPosition, setInfoPosition] = useState<Partial<FolderMenuPosition>>(
    {}
  );
  const [newFolderName, setNewFolderName] =
    useState<string>("Untitled Document");

  return (
    <FolderContext.Provider
      value={{
        activeFolder,
        setActiveFolder,
        folders,
        setFolders,
        recentFolders,
        setRecentFolders,
        faf,
        setFaf,
        newFolderName,
        setNewFolderName,
        menuPosition,
        setMenuPosition,
        infoPosition,
        setInfoPosition,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
}
export const useFolderContext = () => {
  const context = useContext(FolderContext);
  if (!context) {
    throw new Error("useFolderContext must be used within a ContextProvider");
  }
  return context;
};
