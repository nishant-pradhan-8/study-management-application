import Image from "next/image"
import PendingRequests from "./pendingRequests"
import SentRequests from "./sentRequests"
export default function Requests(){
    return(
      <div className="flex flex-row items-center w-full gap-8 mt-6 ">
         <PendingRequests />
         <SentRequests />
      </div>
      
    )
}