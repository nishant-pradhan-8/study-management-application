
import PendingRequests from "./pendingRequests"
import SentRequests from "./sentRequests"
export default function Requests(){
    return(
      <div className="flex flex-roww-full gap-4 max-xl:flex-col mt-6 ">
         <PendingRequests />
         <SentRequests />
      </div>
      
    )
}