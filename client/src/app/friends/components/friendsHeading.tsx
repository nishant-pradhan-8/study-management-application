"use client";
import { useState } from "react";
import { sendFriendRequest } from "@/actions/users/usersAction";
import { useUserContext } from "@/context/userContext";
export default function FriendsHeading() {
  const [receiverEmail, setReceiverEmail] = useState<string>("");
  const { setSentRequests, setPopUpMessage } = useUserContext();
  const handleFriendRequest = async () => {
    if (!receiverEmail) {
      setPopUpMessage({
        success: false,
        message: "Please Enter a valid user Email.",
      });
      setInterval(() => {
        setPopUpMessage(null);
      }, 5000);
      return;
    }
    const sentData = await sendFriendRequest(receiverEmail);

    if (!sentData || !sentData.data) {
      setPopUpMessage({
        success: false,
        message: sentData.message
          ? sentData.message
          : "Unexpected Error Occurred",
      });
      setInterval(() => {
        setPopUpMessage(null);
      }, 5000);
      return;
    }

    setPopUpMessage({ success: true, message: "Request Sent Successfully" });
    setInterval(() => {
      setPopUpMessage(null);
    }, 5000);
    setSentRequests((prev) => [...(prev || []), sentData.data]);
  };

  return (
    <div>
      <h2 className="heading-1">Add Your Study Buddies</h2>
      <div className="mt-4 flex flex-row gap-2 w-[80%] max-md:w-full max-sm:flex-col">
        <input
          type="email"
          placeholder="Enter profile Email ..."
          className="flex-1 p-2 rounded-[8px] bg-transparent border   border-gray-700 focus:outline-none"
          value={receiverEmail}
          onChange={(e) => setReceiverEmail(e.currentTarget.value)}
        />
        <button
          onClick={handleFriendRequest}
          className="bg-slate-200 text-black px-4 py-2 rounded-xl hover:bg-slate-200"
        >
          Send Invite
        </button>
      </div>
    </div>
  );
}
