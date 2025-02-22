'use client';
import Image from "next/image";
import Link from "next/link";
import { useUserContext } from "@/context/userContext";
import { useEffect, useState, useRef } from "react"; // Import useState
import { showFolders, createFolder } from "@/actions/folders/folderAction"; // Import both actions
import FolderLoader from "./folderLoader";
import { routeFormater } from "@/utils/utils";
import { Folder } from "@/types/types";
import { useFolderContext } from "@/context/folderContext";
import { updateAccessCount } from "@/actions/folders/folderAction";
import useCreateFolder from "@/hooks/folders/useCreateFolder";
export default function FolderList() {
    const { folders, setFolders, activeFolder, setActiveFolder, setFaf } = useFolderContext(); 
    const { user } = useUserContext();
   /* const [newFolderName, setNewFolderName] = useState<string>(""); 
    const [folderNameError, setFolderNameError] = useState(false); 
    const inputRef = useRef<HTMLInputElement | null>(null);
*/
   const {newFolderName, setNewFolderName,folderNameError,inputRef, handleCreateFolder} = useCreateFolder(folders,setFolders)
   

  /*  const handleCreateFolder = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setFolderNameError(false);
            if (newFolderName.trim() === "") { 
                setFolderNameError(true);
                return;
            }

            try {
                const res = await createFolder(newFolderName);
                if (res && res.data) {
                    console.log(res.data,' res.data')
                    const newFolder: Folder = {
                        _id: res.data._id,
                        folderName: res.data.folderName,
                        createdAt: res.data.createdAt,
                        
                    };

                    setFolders(prevFolders => {
                        if (prevFolders) {
                            return prevFolders.map(folder =>
                                folder._id === null ? newFolder : folder
                            );
                        } else {
                            return [newFolder]; // Handle initial folder creation
                        }
                    });
                    setNewFolderName(""); // Clear the input field
                } else {
                    console.log("Unable to create Folder");
                }
            } catch (error: any) {
                console.error("Error creating folder:", error.message); 
            }
        }
    };
*/
    useEffect(()=>{
        if(inputRef && inputRef.current){
            inputRef.current.focus()
        }
      
    },[folders])
    const manageCreateFolder = (e:React.KeyboardEvent<HTMLInputElement>)=>{
        if(e.key === "Enter"){
            handleCreateFolder()
            setFaf(null)

        }

    }

    const handleCreateFolderOnBlur = ()=>{
        const modifiedFolders:Folder[] = folders?.filter(folder=>folder._id!==null) || []
        setFolders(modifiedFolders)
    }
      
    


    return (
        <div className="mt-8 flex flex-col gap-4">
            {
               
            folders ? (
                folders.length > 0 ? (
                    folders.map((folder,i) => (
                        folder._id?
                        <div   key={i} className="folder-card w-full">
                            <Link onClick={folder._id ?() => updateAccessCount(folder._id) : undefined} href={`/study-folders/${folder._id}`}  className="folder-icon-div w-full">
                                <Image src="/images/folder-dark.svg" alt="folder-icon" width={25} height={25} />
                              
                                   { folder.folderName}
                                
                                
                            </Link>
                            <Image src="/images/menu.svg" alt="menu" width={20} height={20} /> 
                        </div>:  <div     key={i}  className="folder-card w-full">
                            <div   className="folder-icon-div w-full">
                                <Image src="/images/folder-dark.svg" alt="folder-icon" width={25} height={25} />
                               
                                    <input
                                        type="text"
                                        ref={inputRef}
                                        className="border-[1px] text-black border-gray-400 outline-none"
                                        value={newFolderName}
                                        onChange={e => setNewFolderName(e.target.value)} // Controlled input
                                        onKeyDown={manageCreateFolder}
                                        onBlur={handleCreateFolderOnBlur}
                                    />
                                {folderNameError && (
                                    <p className="text-red-600 font-normal">*{folderNameError}</p>
                                )}
                            </div>
                         
                        </div>
                    ))
                ) : (
                    <p>No Folders Created....</p>
                )
            ) : (
                <FolderLoader />
            ) }
        </div>
    );
}