'use client'
import { useAppContext } from "@/context/context"
import ReactPlayer from "react-player"
export default function VideoCall(){
    const {ownStream} = useAppContext()
    return(
       ownStream && <ReactPlayer playing url={ownStream} muted width="100%" height="100%" />
    )
}