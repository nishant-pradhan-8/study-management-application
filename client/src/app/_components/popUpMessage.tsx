'use client'
import { useUserContext } from "@/context/userContext"
export default function PopUpMessage(){
    const {popUpMessage} = useUserContext()
    return(
        <div className={`${popUpMessage?.success?'bg-green-400':'bg-red-400'} text-white z-50 fixed flex flex-row gap-2 top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl max-sm:w-[18rem]`}>
           
           <p>{popUpMessage?.message}</p> 
        </div>
    )
}