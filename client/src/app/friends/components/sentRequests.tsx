"use client";

import {  useEffect } from "react";
import { getSentRequests } from "@/actions/users/usersAction";
import { useUserContext } from "@/context/userContext";
import AvatarWithText from "@/app/_components/skeletons/avatarAndText";
import apiCall from "@/utils/backEndApiHandler";
import { User } from "@/types/types";
import Image from "next/image";
export default function SentRequests() {
  const { sentRequests, setSentRequests, setPopUpMessage } = useUserContext();
  useEffect(() => {
    if (!sentRequests) {
      const fetchSentRequests = async () => {
        const sentRequests = await getSentRequests();
        if (!sentRequests || !sentRequests.data) {
          return console.log("Unable to Fetch Sent Requests");
        }
        setSentRequests(sentRequests.data);
      };
      fetchSentRequests();
    }
  }, [sentRequests, setSentRequests]);

  const handleCancelRequest = async(receiverId:string)=>{
    const res = await apiCall('/api/users/cancelRequestSent','DELETE',{receiverId})
    if(!res || !res.data || res.data.status==="error"){
      setPopUpMessage({success:false,message:"Unable to Delete. Please Try Again"})
      setInterval(()=>{
        setPopUpMessage(null)
      },5000)
      return
    }
    const newSentReq:User[] = sentRequests?.filter(req=>req._id!==receiverId) ||[];
    setSentRequests(newSentReq)

  }
  return (
    <div className="flex-1 border-[1px] border-gray-300 p-2 px-4 rounded-xl ">
      <h3 className="text-lg font-semibold ">Sent Requests</h3>
  
      {sentRequests ? (
        sentRequests.length > 0 ? (
          sentRequests.map((req) => (
            <div key={req._id} className="mt-2">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Image
                    src={
                      req?.profilePicture === "" || !req
                        ? "/images/profile.svg"
                        : req?.profilePicture
                    }
                    className="rounded-full"
                    width={30}
                    height={30}
                    alt="profile"
                  />
                  <div>
                  <p className="font-medium  w-[8rem] overflow-hidden max-lg:w-[12rem] text-ellipsis max-md: max-580:!w-[7rem]">{`${req.firstName} ${req.lastName}`}</p>
                  <p className="text-gray-400 text-sm w-[8rem] overflow-hidden  max-lg:w-[12rem] max-580:!w-[7rem] text-ellipsis">{req.email}</p>
                  </div>
                </div>
                <div className="text-right  flex flex-row gap-2">
                  <button onClick={()=>handleCancelRequest(req._id)} className="px-4 py-2 bg-red-500 rounded-xl text-white font-semibold">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-2">No Sent Requets.</p>
        )
      ) : (
        <AvatarWithText />
      )}
    </div>
  );
}
