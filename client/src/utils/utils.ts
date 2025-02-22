import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { UploadList } from "@/types/types";
import { Dispatch } from "react";
import { SetStateAction } from "react";
import { Folder } from "@/types/types";

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

export function formatFileSize(bytes:number):string {
  if (bytes < 1024) {
      return bytes + " B"; 
  } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + " KB"; 
  } else if (bytes < 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + " MB"; 
  } else {
      return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB"; 
  }
}


export const validateFolderName = (name: string, currentFolders:Folder[] | null) => {
  name = name.trim();
  const duplicateName = currentFolders?.find(folder=>folder.folderName===name)
  if(duplicateName){
    return `Folder "${name}" already exists.`
  }
  const forbiddenChars = /[\/\\:*?"<>|#&%]/;

  if (!name) return "Folder name cannot be empty.";
  if (name.length > 255) return "Folder name must be under 255 characters.";
  if (forbiddenChars.test(name)) return "Folder name contains invalid characters.";
  if (/^\.+$/.test(name)) return "Folder name cannot contain only dots.";
  
  return ""; 
};