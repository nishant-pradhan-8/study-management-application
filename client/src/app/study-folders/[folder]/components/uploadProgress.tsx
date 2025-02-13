import Image from "next/image"
import { useAppContext } from "@/context/context"
import { useEffect } from "react"
export default function UploadProgress(){
    const {notes, uploadList,fileIcons, isUploading, errorDuringUpload} = useAppContext()
   
    return(
        <div className={`${uploadList && uploadList?.length>0?"":"hidden"} bg-slate-200 absolute p-4 right-0 w-[20rem] top-[3rem] rounded-xl flex flex-col gap-2 z-50`}>
           {
                    uploadList && uploadList?.map((uploads)=>(
                        <div key={uploads.fileId}  className="flex border-b-[1px] pb-3 border-b-gray-400 last:border-b-0 last:pb-0  flex-row items-center font-semibold   justify-between">
                            <div className="flex  flex-row items-center ">
                            <Image src={`/images/${fileIcons[uploads.contentType] || "unallowed.svg"}`} alt='image-icon' width={20} height={20} className="mr-2" />   
                        <div className="overflow-hidden w-[14rem]">
                        <p className="font-semibold">{uploads.fileName}
                            </p>
                        </div>
                            </div>
                           {
                            isUploading && fileIcons[uploads.contentType]?(<div className="loader"></div>):  fileIcons[uploads.contentType] && !errorDuringUpload? <Image alt="ok" src="/images/ok.svg" width={20} height={20} />:<Image alt="error" src="/images/error.svg" width={20} height={20} />
                           } 

                        </div>
                    
                    ))
           } 
            </div>
    )
} //  