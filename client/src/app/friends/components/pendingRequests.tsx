"use client";

import { useEffect } from "react";
import Image from "next/image";
import { getPendingRequests } from "@/actions/users/usersAction";

import { useUserContext } from "@/context/userContext";

import AvatarWithText from "@/app/_components/skeletons/avatarAndText";
import apiCall from "@/utils/backEndApiHandler";
import { User } from "@/types/types";

export default function PendingRequests() {
  const { pendingRequests, setPendingRequests, setPopUpMessage, setFriends } =
    useUserContext();
  useEffect(() => {
    if (!pendingRequests) {
      const fetchPendingRequests = async () => {
        const friends = await getPendingRequests();
        if (!friends.data) {
          return console.log("Failed to Fetch Pending Requests");
        }
        setPendingRequests(friends.data);
      };
      fetchPendingRequests();
    }
  }, [pendingRequests, setPendingRequests]);

  const handleFriendReqResponse = async (
    senderId: string,
    response: string
  ) => {
    const res = await apiCall("/api/users/respondFriendRequest", "PATCH", {
      senderId,
      response,
    });
    if (!res || !res.data || res.data.status === "error") {
      setPopUpMessage({
        success: false,
        message: "Unable to Delete. Please Try Again",
      });
      setInterval(() => {
        setPopUpMessage(null);
      }, 5000);
      return;
    }
    const newPendReq: User[] =
      pendingRequests?.filter((req) => req._id !== senderId) || [];
    setPendingRequests(newPendReq);
    if (response === "Accept") {
      const newFriend: User | null =
        pendingRequests?.find((fr) => fr._id === senderId) || null;
      if (!newFriend) {
        return;
      }
      setFriends((val) => [...(val ?? []), newFriend]);
    }
    return;
  };
  return (
    <div className="flex-1 border-[1px] border-gray-300 p-2 px-4 rounded-xl ">
      <h3 className="text-lg font-semibold ">Pending Requests</h3>

      {pendingRequests ? (
        pendingRequests.length > 0 ? (
          pendingRequests.map((req) => (
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
                    <p className="text-gray-400 text-sm w-[8rem] overflow-hidden  max-lg:w-[12rem] max-580:!w-[7rem] text-ellipsis">
                      {req.email}
                    </p>
                  </div>
                </div>
                <div className="text-right flex flex-row gap-2">
                  <button
                    onClick={() => handleFriendReqResponse(req._id, "Accept")}
                    className="px-4 py-2 max-sm:hidden bg-green-500 rounded-xl text-white font-semibold"
                  >
                    Accept
                  </button>
                  <Image
                    className="hidden max-sm:block"
                    src="/Images/accept.svg"
                    width={24}
                    height={24}
                    alt="accept"
                  />
                  <button
                    onClick={() => handleFriendReqResponse(req._id, "Reject")}
                    className="px-4 py-2 bg-red-500 rounded-xl max-sm:hidden text-white font-semibold"
                  >
                    Reject
                  </button>
                  <Image
                    className="hidden max-sm:block"
                    src="/Images/reject.svg"
                    width={24}
                    height={24}
                    alt="accept"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-2">No pending requests.</p>
        )
      ) : (
        <AvatarWithText />
      )}
    </div>
  );
}
