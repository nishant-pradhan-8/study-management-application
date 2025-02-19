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

export const routeFormater = (folderName:string):string=>{
  
  const formattedRoute:string = folderName.trim().toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-")

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

