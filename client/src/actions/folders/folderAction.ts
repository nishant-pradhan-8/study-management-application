'use client'


import apiCall from "@/utils/backEndApiHandler"
import nextBackEndApiCall from "@/utils/nextBackEndApi"



export const createFolder = async(folderName:string)=>{
  console.log(folderName, 'as')
  const { data } = await apiCall(`/api/folder/createFolder`, "POST", {
    folderName
  });
  return data
}

export const showFolders = async() =>{
  const { data } = await apiCall(`/api/folder/showFolders`, "GET", null);
  return data
  
}
export const updateAccessCount = async(folderId:string | null) =>{
  if(!folderId){
    return console.log("FolderId is required")
  }
   await apiCall(`/api/folder/updateFolderAccessCount`, "PATCH", {folderId});
}

export const deleteFolder = async(itemId:string, userId:string) =>{
   await nextBackEndApiCall('/api/folder',"DELETE",{folderId:itemId,userId })
   const {data} = await apiCall(`/api/folder/deleteFolder`, "DELETE", {folderId:itemId});
   return data
   
}

export const getFrequentlyAccessedFolders = async() =>{
  const { data } = await apiCall(`/api/folder/frequentlyAccessedFolders`, "GET", null);
  return data
  
}

export const getFolderInfo = async(folderId:string | null) =>{
  const {data} = await apiCall(`/api/folder/folderInfo/${folderId}`, "GET", null);
  return data
  
}

export const renameFolder = async({newFolderName, folderId}:{newFolderName:string, folderId:string})=>{
  const {data} = await apiCall(`/api/folder/renameFolder`, "PATCH", {newFolderName, folderId});
  return data
  
}