import Image from "next/image"
import { useAppContext } from "@/context/context"
import { deleteNote } from "@/actions/folderAction"
import { useEffect } from "react"
import { Note } from "@/types/types"
import ShareFile from "./shareFile"
export default function FileMenu({note}:{note:Note}){
    const {fileMenuOpenId, user, activeFolder, setNotes,notes, setFileMenuOpenId, setSelectedFileMenu, selectedFileMenu, setAlertDialogOpen } = useAppContext()
    const fileMenu = [
        {
            id:0,
            menuIcon:"/images/delete.svg",
            menuName:"Delete",
            action:()=>deleteNote(note.noteId, note.noteName, user,activeFolder,notes, setNotes, setFileMenuOpenId),
            width:18,
            height:18
        },
        {
            id:1,
            menuIcon:"/images/share.svg",
            menuName:"Share",
            action:()=>handleShareMenuOpen(),
            width:25,
            height:25
        },
    ]
    const handleShareMenuOpen = ()=>{
      //  setFileMenuOpenId(null)
        setSelectedFileMenu("Share")
       setAlertDialogOpen(true)
    }
    useEffect(()=>{
        console.log(selectedFileMenu)
    },[])
    return(
        <div>
        <div tabIndex={0}className={`bg-slate-200 w-[15rem] px-4  absolute right-[14px] ${note.noteId===fileMenuOpenId?"block":"hidden"} rounded-xl`}>
            <ul className="list-none">
                {
                  fileMenu.map((menu, index)=>(
                    <li key={menu.id}>   <a  onClick={()=>menu.action()} className={`flex z-50 flex-row items-center gap-2 py-4 border-b-[1px] border-gray-400 ${index === fileMenu.length - 1 ? "border-none" : ""} cursor-pointer`}>
                    <Image alt={menu.menuIcon} src={menu.menuIcon} width={menu.width} height={menu.height}   />
                    {menu.menuName}
                </a></li>
                  ))
                }
            </ul>
        </div>
        {selectedFileMenu==="Share" && <ShareFile note={note} />}
        </div>

    )
}
