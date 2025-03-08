import { useState, useEffect } from "react";
export interface Info{
    id:number,
    infoName:string,
    info:string 
  }

export default function useViewInfo(selectedMenuId:string| null, getInfo:(selectedMenuId:string)=>Promise<any>, infoFor:string){
  
  const [info, setInfo] = useState<Info[] | null>(null)
   useEffect(()=>{
        if(selectedMenuId){
          const fetchFolderInfo = async()=>{
            const res = await getInfo(selectedMenuId)
            if(!res.data){
              console.log("Unable to get Folder Info")
              return;
            }
            const data = res.data
            let modifiedInfo:Info[];
            if(infoFor==="folder"){
                modifiedInfo=[
                    {
                      id: 1,
                      infoName: "Folder Name",
                      info: data.folderName
                    },
                    {
                      id: 2,
                      infoName: "Created At",
                      info: data.createdAt
                    },
                    {
                      id: 3,
                      infoName: "Last Updated",
                      info: data.lastUpdated
                    },
                    {
                      id: 4,
                      infoName: "Total Notes",
                      info: data.totalNotes
                    },
        
                  ]
            }else{
                modifiedInfo=[
                    {
                      id: 1,
                      infoName: "Note Name",
                      info: data.noteName
                    },
                    {
                      id: 2,
                      infoName: "File Size",
                      info: data.fileSize
                    },
                    {
                      id: 3,
                      infoName: "File Type",
                      info: data.fileType
                    },
                    {
                      id:4,
                      infoName: "Folder",
                      info: data.folderName
                    },
                    {
                      id: 5,
                      infoName: "Uploaded At",
                      info: data.uploadedAt
                    },
                    {
                        id: 6,
                        infoName: "Last Viewed",
                        info: data.lastViewed
                    }
        
                  ]
            }
         
       
            setInfo(modifiedInfo)
          }
  
          fetchFolderInfo()
        }
     
      },[selectedMenuId])
   return {info}
}