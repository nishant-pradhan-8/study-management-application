import Image from "next/image"
import { SetStateAction } from "preact/compat"
import { Dispatch } from "react"
import { useRef } from "react";
import { useEffect } from "react";
import { deleteFolder } from "@/actions/folders/folderAction";
import { useFolderContext } from "@/context/folderContext";
import { Folder } from "@/types/types";
const FolderMenu = ({setFolderMenuOpenId, folderMenuOpenId }: { 
   
    setFolderMenuOpenId: Dispatch<SetStateAction<string | null>>, 
    folderMenuOpenId: string | null 

  }) => {
    const {setIsDeleting,setRecentFolders,faf,setFaf, setFolders, folders } = useFolderContext()
    const handleDeleteFolder = async()=>{
      setIsDeleting(true)
      await deleteFolder(folderMenuOpenId)
   
      const newRecenFolders:Folder[] = faf?.filter(folder=>folder._id!==folderMenuOpenId)|| []
      const newFolders:Folder[] | null = folders?.filter(folder=>folder._id!==folderMenuOpenId)|| null
      console.log(folders)
      console.log(faf)
      setFolders(newFolders)
      setFaf(newRecenFolders)
      setIsDeleting(false)
      setFolderMenuOpenId(null); 
    }

    
    const folderMenuRef = useRef<HTMLDivElement | null>(null)
    const folderMenu = [
      { id: 0, menuIcon: "/images/delete.svg", menuName: "Delete", action: () => handleDeleteFolder(), width: 20, height: 20 },
      { id: 1, menuIcon: "/images/info.svg", menuName: "Folder Info", action: () => console.log("Folder Info clicked"), width: 20, height: 20 },
      { id: 3, menuIcon: "/images/pencil.svg", menuName: "Rename", action: () => console.log("Rename clicked"), width: 20, height: 20 },
    ];
    useEffect(()=>{
        function handleClickOutside(event: MouseEvent) {
            if (folderMenuRef.current && !folderMenuRef.current.contains(event.target as Node)) {
              setFolderMenuOpenId(null); 
            }
          }
        document.addEventListener('click',handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          };
    },[folderMenuOpenId])
  
    return (
      <div 
        tabIndex={0} 
        ref={folderMenuRef}
        className={`bg-slate-200 w-[12rem] z-10 px-4  absolute right-[-10.5rem] bottom-[-8rem] rounded-xl`}
      >
        <ul className="list-none">
          {folderMenu.map((menu, index) => (
            <li key={menu.id}>
              <a 
               
                onClick={() => {
                  menu.action();
            
                }}
                className={`flex flex-row items-center gap-2 py-3 border-b-[1px] border-gray-400 
                  ${index === folderMenu.length - 1 ? "border-none" : ""} cursor-pointer`}
              >
                <Image alt={menu.menuIcon} src={menu.menuIcon} width={menu.width} height={menu.height} />
                {menu.menuName}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default FolderMenu;
  