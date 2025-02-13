import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { UploadList } from "@/types/types";
import { Dispatch } from "react";
import { SetStateAction } from "react";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getCurrentDate = ()=>{
  const currentDate = new Date();
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[currentDate.getMonth()];

  
  const formattedDate = `${day} ${month} ${year}`;
  return formattedDate

}
export const selectFileIcon = ()=>{
  const fileIcons = {
      "image/jpeg": "icons/image-icon.svg",
      "image/png": "icons/image-icon.svg",
      "application/pdf": "icons/pdf-icon.svg",
      "application/msword": "icons/word-icon.svg",
      "application/vnd.ms-excel": "icons/excel-icon.svg",
      "text/plain": "icons/text-icon.svg",
      "default": "icons/default-icon.svg", // Fallback icon
    };
    
}
export const routeFormater = (folderName:string):string=>{
  const formattedRoute:string = folderName
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, "")
  .replace(/\s+/g, "-")

  return formattedRoute
}

export const manageUploadList= (files:File[],repeatedFiles:File[] | [], uploadList:UploadList[]):UploadList[]=>{
  const fileList = [...files,...repeatedFiles]
  let tempFileId = uploadList.length >0
  ? uploadList[uploadList.length - 1].fileId + 1
  : 1;

  console.log(tempFileId)
  const tempUploadList:UploadList[] = fileList.map((file)=>{
      return {
          fileId: tempFileId++,
          fileName: file.name,
          contentType: file.type
      }
  })
  return tempUploadList
}

export const fileValidation = (files:File[],acceptedFileTypes:string[],setFileRejected:Dispatch<SetStateAction<boolean>>,setFileSizeExceeded:Dispatch<SetStateAction<boolean>>):FormData=>{
  const formData:FormData = new FormData();
  for(let i = 0; i<files.length; i++){
      const fileSizeInMB = Number((files[i].size / (1024 * 1024)).toFixed(2)); 
        if(acceptedFileTypes.includes(files[i].type) && fileSizeInMB<25){
          console.log(files[i].type)
           formData.append('file', files[i]);
        }else{
         if(!acceptedFileTypes.includes(files[i].type)){
           setFileRejected(true)
         }else{
          setFileSizeExceeded(true)
         }
        }
    } 
    return formData 
}

export const eventValidation = (e: React.FormEvent, setEmptyField:Dispatch<SetStateAction<Record<string,boolean>>>)=>{
 
  const formData = new FormData(e.currentTarget as HTMLFormElement);
  let eventName:string | null = formData.get('eventName')?.toString() || ""
  let  startDate:string | null  = formData.get('startDate')?.toString()|| ""
  let endDate:string | null   = formData.get('endDate')?.toString()|| ""
  let description:string | null  = formData.get('description')?.toString() || ""
  console.log(eventName, startDate, endDate, description)
  if(!eventName || !startDate || !endDate || !description){
    const newEmptyFields = { // Create a new errors object
      eventName: !eventName,
      startDate: !startDate,
      endDate: !endDate,
      description: !description
    }
    setEmptyField(newEmptyFields)

  
    console.log("All fields are required")
    return false
  }
  const start = new Date(startDate)
  const end = new Date(endDate)
  if(start>end){
    console.log('Start Date cannot be greater than end date')
    return false
  }
  const eventObj = {
    title:eventName,
    start: formData.get('startDate')!,
    end:formData.get('endDate')!,
    description
  }
  return eventObj
}