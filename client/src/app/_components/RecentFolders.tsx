"use client";
import Image from "next/image";
import { useFolderContext } from "@/context/folderContext";
import { useUserContext } from "@/context/userContext";
import CardSkeleton from "./cardSkeleton";
import Link from "next/link";
import { updateAccessCount } from "@/actions/folders/folderAction";
import { getFrequentlyAccessedFolders } from "@/actions/folders/folderAction";
import { Folder } from "@/types/types";
import { useState, useEffect, useRef } from "react";
import { routeFormater } from "@/utils/utils";
import { createFolder } from "@/actions/folders/folderAction";
import FolderMenu from "./folderMenu";


export default function RecentFolders() {
  const { faf, setFaf } = useFolderContext();
  const [newFolderName, setNewFolderName] = useState<string>("Create a Folder");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [creatingFolder, setCreatingFolder] = useState<boolean>(false)
  const [folderMenuOpenId,setFolderMenuOpenId] =  useState<string | null>(null)
  
  useEffect(() => {
    if (!faf) {
      const fetchFrequentlyAccessedFolders = async () => {
        const res = await getFrequentlyAccessedFolders();
        if (!res.data) {
          setFaf([]);
          return console.log("Unable to Fetch Frequently Accessed Folder ");
        }
        const updatedFaf = res.data.map((folder: Partial<Folder>) => {
          return { ...folder, folderRoute: routeFormater(folder.folderName!) };
        });
        setFaf(updatedFaf);
      };
      fetchFrequentlyAccessedFolders();
    }
  }, []);

 const allowFolderCreation = () => {
  if(inputRef.current){
    setNewFolderName("")
    inputRef.current.focus()
  }
     setCreatingFolder(true)

 };


 const handleFolderCreationCancel =()=>{
  setCreatingFolder(false)
  setNewFolderName("Create a Folder")

 }
 const handleFolderCreation = (e:React.KeyboardEvent)=>{
  if(e.key === "Enter"){
  
  }
 }

  return (
    <div>
      <h1 className="heading-1 ">Quick Access</h1>
      <div className="mt-4 flex flex-row justify-start gap-4">
        {faf ? (
          faf.length > 0 ? (
            faf?.map((folder, i) => (
              <div key={folder._id}   className="folder-card relative">
                <Link
                onClick={() => updateAccessCount(folder._id)}
                href={`/study-folders/${folder.folderRoute}`}
               
              
              >
                <div className="folder-icon-div ">
                  <Image
                    src="/images/folder-dark.svg"
                    alt="folder-icon"
                    width={25}
                    height={25}
                  />
                  <div className=" w-[10rem] overflow-hidden whitespace-nowrap overflow-ellipsis">
                    {folder.folderName}
                  </div>
                </div>
                </Link>
                <a  onClick={()=>setFolderMenuOpenId(folder._id)}  className="cursor-pointer">
                <Image
                  src="/images/menu.svg"
                  alt="folder-icon"
                  width={20}
                  height={20}
                />
                </a>
               {folderMenuOpenId === folder._id && <FolderMenu  setFolderMenuOpenId={setFolderMenuOpenId}  folderMenuOpenId={folderMenuOpenId}/>}
              </div>
           
              
            ))
          ) : (
            <p>No Folders To show</p>
          )
        ) : (
          <CardSkeleton />
        )}
     
      </div>
    </div>
  );
} /*  {
  faf?
  faf.length>0?
   faf?.map((folder, i)=>(
      <Link onClick={()=>updateAccessCount(folder._id)} href={`/study-folders/${folder.folderRoute}`}  key={folder._id} className='folder-card'>
      <div className='folder-icon-div'>
      <Image src="/images/folder-dark.svg" alt='folder-icon' width={25} height={25} />
       {folder.folderName}
      </div>
      <Image src="/images/menu.svg" alt='folder-icon' width={20} height={20} />

    </Link>
  
    )):<p>No Folders To show</p>:
   
    <CardSkeleton />
}   <a
          onClick={()=>allowFolderCreation()}
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
              className="border-[1px] text-black border-gray-400 outline-none border-none w-[9rem]  "
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)} 
              readOnly={!creatingFolder}
              onBlur={()=>handleFolderCreationCancel()}
              onKeyDown={(e)=>handleFolderCreation(e)}
            />
          </div>
          <button className="text-gray-500 hover:text-gray-700">
            {" "}
           
            <Image src="/images/plus.svg" alt="plus" width={20} height={20} />
          </button>
        </a>
 */