'use client'
import { useUserContext } from "@/context/userContext";
import JoinRoom from "./joinRoomDialog";
import { SocketMember } from "@/types/types";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
export default function RoomHeading(){
   const {setAlertDialogOpen, setJoinRoomAlertDialogOpen, joinRoomAlertDialogOpen, socket, user, openMedia, setOwnStream} = useUserContext()
   const router = useRouter()
   const joinRoom = async ()=>{
      setAlertDialogOpen(true)
      setJoinRoomAlertDialogOpen(true)
      console.log("pressed")
     
   }

   const handleRoomCreate = useCallback(async()=>{
     try{
     
      await socket.emit("create:room",user,async({member,roomId}:{member:SocketMember, roomId:string})=>{
         if(!member){
            return console.log("User not registered!")
         }
         if(!roomId){
            return console.log("Room not found!")
         }
         console.log(member, roomId)
         console.log('went')
         router.push(`/study-room/${roomId}`)
         let stream = await openMedia({audio:true, video:true})
         console.log(stream)
         setOwnStream(stream)
      })
     
     }catch(e:any){
      console.log(e.message)
     }
      
   
   },[])
  
 return(
   <>
      <div className="flex flex-row justify-between items-center">
      <div >
      <h2 className="heading-1">Study Room</h2>
      <p>If you don't feel like studying alone. Read With Your Study Buddies!</p>
      </div>
     <div className="flex flex-row gap-4">
   <button onClick={joinRoom } className="bg-slate-200 text-black px-4 py-2 rounded-xl hover:bg-slate-500">
   Join Room
   </button>
   <button onClick={handleRoomCreate}  className="bg-slate-200 text-black px-4 py-2 rounded-xl hover:bg-slate-500">
   Create Room
   </button>
     </div>
  </div>
  
  {joinRoomAlertDialogOpen && <JoinRoom />}
   </>

 )
}