'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import Image from "next/image"
import { useAppContext } from "@/context/context"
import { useState , useCallback, useEffect} from "react"
import { useRouter } from "next/navigation"
import { SocketMember } from "@/types/types"
export default function JoinRoom(){
    const {setAlertDialogOpen, setJoinRoomAlertDialogOpen, socket,user,openMedia,setOwnStream , } = useAppContext()
    const [roomId, setRoomId] = useState<string>("")
    const router = useRouter()

    const handleJoinRoomClose = ()=>{
        setAlertDialogOpen(false)
        setJoinRoomAlertDialogOpen(false)
    }
    const handleJoinRoom = useCallback(async(roomId:string)=>{
        try{
           console.log(roomId)
            await socket.emit("join:room",{user,roomId}, async({member,roomId}:{member:SocketMember, roomId:string})=>{
                if(!member){
                   return console.log("User not registered!")
                }
                router.push(`/study-room/${roomId}`)
                let stream = await openMedia({audio:true, video:true})
                setOwnStream(stream)
                setAlertDialogOpen(false)
                setJoinRoomAlertDialogOpen(false)
             })

        }catch(e:any){
            console.log(e.message)
        }
       
    
     },[socket, user, openMedia, setOwnStream, router])

     useEffect(()=>{
        console.log(roomId)
     },[roomId])
    
     /*
    useEffect(()=>{
     socket.on("room:join",handleJoinRoom)
     return()=>{
        socket.off('room:join',handleJoinRoom)
     }
    },[])*/
    return(
        <Card className="w-[35rem] bg-gray-900 p-2 rounded-xl fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-50 text-white">
        <CardHeader className="flex flex-row w-full justify-between"> 
        
          <CardTitle>Join Room</CardTitle>
             <a className="cursor-pointer" onClick={handleJoinRoomClose}><Image src="/images/cross-white.svg" alt="cross" width={25} height={25} /></a>
        </CardHeader>
        <CardContent className="">
       
       
            <div>
                <label  htmlFor="roomId">Room Id</label>
                <input value={roomId} onChange={(e)=>setRoomId(e.target.value)} type="text" className="input-field mt-2" id="roomId" placeholder="e.g. 98023" />
                <div className="flex justify-center mt-4">
                <button onClick={()=>handleJoinRoom(roomId)} className="primary-btn text-black w-full flex justify-center">Join</button>
                </div>
            </div>

          
        </CardContent>

        </Card>
  
    )
}