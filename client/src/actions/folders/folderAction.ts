'use client'


import apiCall from "@/utils/backEndApiHandler"




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

export const deleteFolder = async(folderId:string | null) =>{
  
  if(!folderId){
    return console.log("FolderId is required")
  }
   await apiCall(`/api/folder/deleteFolder`, "DELETE", {folderId});
   
}

export const getFrequentlyAccessedFolders = async() =>{
  const { data } = await apiCall(`/api/folder/frequentlyAccessedFolders`, "GET", null);
  return data
  
}