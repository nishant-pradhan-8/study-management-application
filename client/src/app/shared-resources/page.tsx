import Image from "next/image"
import SharedList from "./components/sharedList"
import Overlay from "../_components/overlay"
export default function SharedResources(){
    return(
       <div>
          <h1 className="heading-1">Resources Shared By Your Study Buddies</h1>
          <SharedList />
          <Overlay />
       </div>
    )
}