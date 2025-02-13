'use client'
import { useAppContext } from "@/context/context";
import UploadButton from "./uploadButton";
import { Folder } from "@/types/types";
export default function PageHeadng({folderRoute}:{folderRoute:string}){
    const {folders, fileRejected, fileSizeExceeded} = useAppContext()
    const selectedFolder:Folder[] = folders.filter(folder=>folder.folderRoute===folderRoute)
   return(
        <div className="flex justify-between">
                            <h1 className="heading-1">{selectedFolder[0].folderName}</h1>
                            <div className="flex items-center gap-4">
                                <p className={`text-red-500 ${fileRejected?'block':'hidden'}`}>* Some File couldn't be Uploaded due to Unsupported Format</p>
                                <p className={`text-red-500 ${fileSizeExceeded?'block':'hidden'}`}>* Some File couldn't be Uploaded due to Large Size </p>
                                <UploadButton folderId={selectedFolder[0].folderId || ""} />
                            </div>
        </div>
   ) 
}