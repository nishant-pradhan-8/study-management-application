'use client'


import apiCall from "@/utils/backEndApiHandler"
import nextBackEndApiCall from "@/utils/nextBackEndApi"



export const createFolder = async(folderName:string)=>{

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

export const deleteFolder = async(itemId:string[], userId:string) =>{
   const res = await nextBackEndApiCall('/api/folder',"DELETE",{folderIds:itemId,userId })
   if(res.data.status==='error'){
    return res.data
   }
   const {data} = await apiCall(`/api/folder/deleteFolders`, "DELETE", {folderIds:itemId});
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