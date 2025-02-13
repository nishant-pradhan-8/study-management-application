import Test from "./components/test"
import VideoCall from "./components/videoCall"
const Room = async({params}:{params:Promise<{roomId:string}>})=>{
   const room = (await params).roomId
  
   return(
      <>
        {room}
        <VideoCall />
      </>
   )
   
}
export default Room