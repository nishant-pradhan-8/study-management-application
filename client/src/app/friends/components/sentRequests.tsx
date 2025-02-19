'use client'

import { useState, useEffect } from "react"
import { getSentRequests } from "@/actions/users/usersAction"
import LoadingSkeleton from "./loadingSkeleton"
import { useUserContext } from "@/context/userContext"
import { Skeleton } from "@/components/ui/skeleton"

export default function SentRequests(){
  const{sentRequests, setSentRequests} = useUserContext()
   useEffect(()=>{
    if(!sentRequests){
      const fetchSentRequests = async()=>{
        const sentRequests = await getSentRequests()
        if(!sentRequests.data){
          return console.log("Unable to Fetch Sent Requests")
        }
        setSentRequests(sentRequests.data)
      }
      fetchSentRequests()
    }
       
      },[])
  return(
         <div className="flex-1 border-[1px] border-gray-300 p-2 px-4 rounded-xl ">
                 <h3 className="text-lg font-semibold ">Sent Requests</h3>
                 {sentRequests ? (
                   sentRequests.length > 0 ? ( 
                    sentRequests.map((req) => (
                       <div key={req._id} className="mt-2">
                         <div className="flex items-center justify-between py-2">
                           <div className="flex items-center gap-3">
                             <a>
                               <div className="w-8 h-8 bg-black rounded-full"></div>
                             </a>
                             <div>
                               <p className="font-medium">{`${req.firstName} ${req.lastName}`}</p>
                                   <p className="text-gray-400 text-sm">{req.email}</p>
                                 </div>
                               </div>
                               <div className="text-right flex flex-row gap-2">
                  <button className="px-4 py-2 bg-red-500 rounded-xl text-white font-semibold">Cancel</button>
                  </div>
                             </div>
                           </div>
                         ))
                       ) : ( 
                       <p className="text-gray-500 mt-2">No Sent Requets.</p>
                     )
                   ) : (
                    <Skeleton className="w-[100px] h-[20px] rounded-full" />
                   )}
 
                 </div>
     )
}   
