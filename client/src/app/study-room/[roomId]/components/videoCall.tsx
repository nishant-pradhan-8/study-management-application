'use client'
import { useUserContext } from "@/context/userContext"
import ReactPlayer from "react-player"
export default function VideoCall(){
    const {ownStream} = useUserContext()
    return(
       ownStream && <ReactPlayer playing url={ownStream} muted width="100%" height="100%" />
    )
}