import { Dispatch, SetStateAction, useState } from "react";
const useFileValidation = ()=>{
    const fileValidation = (files:File[],acceptedFileTypes:string[],setFileRejected:Dispatch<SetStateAction<boolean>>,setFileSizeExceeded:Dispatch<SetStateAction<boolean>>)=>{
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

    return {fileValidation}

}
export default useFileValidation