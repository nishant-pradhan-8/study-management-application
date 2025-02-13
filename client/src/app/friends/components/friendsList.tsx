'use client'
import Image from "next/image"
import { Suspense, useEffect } from "react"
import { useAppContext } from "@/context/context"
import { getFriendList } from "@/actions/folderAction"
import { Skeleton } from "@/components/ui/skeleton"

export default function FriendsList(){
  const {friends, setFriends} = useAppContext()
  useEffect(()=>{
  
    if(!friends){
      const fetchFriends = async()=>{
        const friends = await getFriendList()
        setFriends(friends)
      }
      fetchFriends()
    }
     
  
  },[friends])
    return(
  
  <div className="border-[1px] border-gray-300 p-4 rounded-xl mt-6 ">
        <h3 className="text-lg font-semibold">Study Buddies</h3>
      
        <div className="mt-2 ">
        <div className="mt-2">
          {
            friends?(
              friends.length>0 ? (
                friends.map((friend) => (
                  <div key={friend._id} className="flex items-center justify-between py-4 border-b border-gray-300 last:border-none">
                    <div className="flex items-center gap-3">
                      <a><div className='w-8 h-8 bg-black rounded-full'> </div></a>
                      <div>
                        <p className="font-medium">{`${friend.firstName} ${friend.lastName}`}</p>
                        <p className="text-gray-400 text-sm">{friend.email} </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Image src="/images/menu.svg" alt="menu" width={25} height={25} />
                    </div>
                  </div>
                ))
              ):(<p>No Friends To Show</p>)
            ):  (<Skeleton className="w-[100px] h-[20px] rounded-full" />
            )
          }

</div>

          </div>
        
        </div>
  
      
    )
}