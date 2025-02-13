'use client'

import { useState, useEffect } from "react"

import { getPendingRequests } from "@/actions/folderAction"
import LoadingSkeleton from "./loadingSkeleton"
import { useAppContext } from "@/context/context"
import { Skeleton } from "@/components/ui/skeleton"

export default function PendingRequests(){
   const {pendingRequests, setPendingRequests} = useAppContext()
   useEffect(()=>{
    if(!pendingRequests) {
      
      const fetchPendingRequests = async()=>{
        const friends = await getPendingRequests()
        setPendingRequests(friends)
        console.log(friends)
      }
      fetchPendingRequests()
    }
    },[pendingRequests])
    return(
        <div className="flex-1 border-[1px] border-gray-300 p-2 px-4 rounded-xl ">
                <h3 className="text-lg font-semibold ">Pending Requests</h3>
                {pendingRequests ? (
                  pendingRequests.length > 0 ? ( 
                    pendingRequests.map((req) => (
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
                                <button className="px-4 py-2 bg-green-500 rounded-xl text-white font-semibold">
                                  Accept
                                </button>
                                <button className="px-4 py-2 bg-red-500 rounded-xl text-white font-semibold">
                                  Reject
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                       
 
                     <p className="text-gray-500 mt-2">No pending requests.</p>
                    )
                  ) : (
                    <Skeleton className="w-[100px] h-[20px] rounded-full" />

                  )}

                </div>
    )
}