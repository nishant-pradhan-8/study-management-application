'use client'
import { useEffect, useState } from "react"
import { sendFriendRequest } from "@/actions/folderAction"
import { useAppContext } from "@/context/context"
export default function FriendsHeading(){
    const [receiverId, setReceiverId] = useState<string>("")
    const {setSentRequests, sentRequests} = useAppContext()
    const handleFriendRequest = async () => {
        console.log(receiverId)
        const sentData = await sendFriendRequest(receiverId);
        if (sentData.data) {
          setSentRequests((prev) => [...(prev || []), sentData.data]);
        }
      };
      
    return(
        <div>
            <h2 className="heading-1">Add Your Study Buddies</h2>
            <div className="mt-4 ">
            <input
            type="text"
            placeholder="Enter profile Id ..."
            className="flex-1 p-2 rounded-xl bg-transparent border mr-2 w-[25rem] border-gray-700 focus:outline-none"
            value={receiverId}
            onChange={(e)=>setReceiverId(e.currentTarget.value)}
            />
            <button onClick={handleFriendRequest} className="bg-slate-200 text-black px-4 py-2 rounded-xl hover:bg-slate-500">
            Send Invite
            </button>
            </div>
          
          
        </div>

    )
}