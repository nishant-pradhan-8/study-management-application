'use client'

import { Folder, NoteResponse } from "@/types/types"
import { Dispatch, SetStateAction } from "react"
import { Note, User } from "@/types/types"
import { fileValidation, routeFormater } from "@/lib/utils"
import { manageUploadList } from '@/lib/utils';
import { UploadList } from "@/types/types"

/*Get User Details*/
export const getNotification = async()=>{
  try{
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notification/getNotifications`,{
      method:"GET",
      headers:{
        Accept:"application/json",
        ContentType: "application/json",
        "Authorization":`Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`
      },
    })
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `HTTP Error: ${res.status}`);
    }
    const data = res.json()
    return data
  }catch(e){
     return {error: e instanceof Error ? e.message : "An unknown error occurred. Please Try Again" , data:null}
  }
  
}

export const updateLast = async()=>{
  try{
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/note/updateLastViewed`,{
      method:"PATCH",
      headers:{
        Accept:"application/json",
        "Content-Type": "application/json",
        "Authorization":`Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`
      },
    })
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `HTTP Error: ${res.status}`);
    }
    const data = res.json()
    return data
  }catch(e){
     return {error: e instanceof Error ? e.message : "An unknown error occurred. Please Try Again" , data:null}
  }
  
}

export const markNotificationRead = async()=>{
  try{
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notification/markNotificatonsRead`,{
      method:"PATCH",
      headers:{
        Accept:"application/json",
        "Content-Type": "application/json",
        "Authorization":`Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`
      },
    })
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `HTTP Error: ${res.status}`);
    }
    const data = res.json()
    return data
  }catch(e){
     return {error: e instanceof Error ? e.message : "An unknown error occurred. Please Try Again" , data:null}
  }
}

export const getUserDetails = async()=>{
  try{
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/userDetails`,{
      method:"GET",
      headers:{
        Accept:"application/json",
       "Content-Type": "application/json",
        "Authorization":`Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`
      },
    })
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `HTTP Error: ${res.status}`);
    }
    const data = res.json()
    return data
  }catch(e){
     return {error: e instanceof Error ? e.message : "An unknown error occurred. Please Try Again" , data:null}
  }
  
}

export const CreateFolder = async( e: React.KeyboardEvent<HTMLInputElement>,
    folders:Folder[],
    setFolders:Dispatch<React.SetStateAction<Folder[]>>, 
    setFolderNameEmptyError:Dispatch<React.SetStateAction<boolean>>
  )=>{
    if(e.key==="Enter"){
        setFolderNameEmptyError(false)
        if(e.currentTarget.value === ""){
            setFolderNameEmptyError(true)
            return
        }   
        try{
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/folder/createFolder`,{
            method: "POST",
            headers: {
              'authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzhiNDA0ZjkzODBkNTI0NmEzYWZkZTciLCJlbWFpbCI6InJhaHVsQGdtYWlsLmNvbSIsImlhdCI6MTczNzQ0MDc1MSwiZXhwIjoxNzM3NDc2NzUxfQ.tHRZVaLGZsQy9oA4sXqoEOm90FXTSC8QEWTYMmHjaWw',
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              folderName:e.currentTarget.value,
            })
          })

          const data = await response.json()
          const newFolder:Folder = {
            folderId: data.data._id,
            folderName: data.data.folderName,
            folderRoute: routeFormater(data.data.folderName)
          }
          const newFolders:Folder[] = folders.map((folder)=>{
            if(folder.folderId===null){
              return newFolder
            }else{
              return folder
            }
          })
         
         setFolders(newFolders)
        }catch(e:any){
          console.log(e.message)
        }
   
      
      
    }
}
export const getNotes = async(folderId:string)=>{
  try{
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/folder/${folderId}`,{
      method:"GET",
      headers:{
        "Accept":"Application/json",
        "Authorization":`Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
              }
    })
    const data = await response.json()
  
    return data.notes
  }catch(e:any){
    console.log(e.message)
  }
}
export const getFile = async(fileId:string)=>{
  try{
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/note/${fileId}`,{ method:"GET",
    headers:{
      'authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzhiNDA0ZjkzODBkNTI0NmEzYWZkZTciLCJlbWFpbCI6InJhaHVsQGdtYWlsLmNvbSIsImlhdCI6MTczNzI3NDU3NSwiZXhwIjoxNzM3MzEwNTc1fQ.hzIV-odtApPDyIWhQr2TQmWFiSF9_cM2ie8CJxnP2HI'
    }
    })
    if(response.ok){
      console.log(response.body)
      const blob = await response.blob()
      const fileUrl:string = URL.createObjectURL(blob)
      console.log(fileUrl)
      return fileUrl
    }else{
      return null
    }
  }catch(e){
    console.log(e)
     return null
  }
}
export const deleteNote = async(fileId:string, fileName:string, user:User | null,folderId:string | null, notes:Note[],setNotes:Dispatch<SetStateAction<Note[]>>, setFileMenuOpenId:Dispatch<SetStateAction<string | null>>)=>{

  const latestNotes = notes.filter(note=>note.noteId!==fileId)
  setNotes(latestNotes)
  setFileMenuOpenId(null)
  try{
    if(!user){
      return console.log("User not found")
    }
    console.log(user._id)
    const response = await fetch("http://localhost:3000/api/notes",
      {
        method:'DELETE',
        headers:{
          'Content-Type':"application/json",
          'Accept':"application/json"
        },
        body:JSON.stringify({
          userId:user._id,
          folderId,
          fileName, 
       
        })
  
      }
    )
    if(response.ok){
      try{
        await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/note/deleteNote/${fileId}`,
          {
            method: "DELETE",
            headers: {
              'Content-Type': 'application/json',
               accept: 'application/json',
               "Authorization":`Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`
            },
          }
        );
      }catch(e){
        console.log(e)
      }
    }
  }catch(e:unknown){
    if(e instanceof Error){
      console.log(e.message)
    }
  
  }
}
export const UploadNotes = async(files:File[] | null, repeatedFile:File[] | null, folderId:string | null, setFileRejected:Dispatch<SetStateAction<boolean>>, setNotes:Dispatch<SetStateAction<Note[]>>, setFileSizeExceeded:Dispatch<SetStateAction<boolean>>, user:User | null,setUploadList:Dispatch<SetStateAction<UploadList[]>>, setIsUploading:Dispatch<SetStateAction<boolean>>, setErrorDuringUpload:Dispatch<SetStateAction<boolean>>, notes:Note[], setRepeatedFile: Dispatch<SetStateAction<File[] | null>>, setHoldingFiles:Dispatch<SetStateAction<File[] | null>>, uploadList:UploadList[]) =>{
  const acceptedFileTypes = [
    'application/pdf',            // PDF
    'application/msword',         // DOC
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/vnd.ms-powerpoint', // PPT
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
    'application/vnd.ms-excel',   // XLS
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
    'image/jpeg',                 // JPEG/JPG
    'image/png',                  // PNG
    'image/svg+xml',              // SVG
    'video/mp4',                  // MP4
    'video/x-matroska',           // MKV

  ];
    
   
    if(files && files.length>0){
      setErrorDuringUpload(false)
      setIsUploading(true)
      setFileRejected(false)
      setFileSizeExceeded(false)
     
      /*Logic to check repeated File*/
      const uploadedFileName:string[] = notes.map(note=>note.noteName)
      const repeatedFileList:File[] = files
      .filter((file) => uploadedFileName.includes(file.name))
      let holdingFiles:File[] = files.filter(file=>!uploadedFileName.includes(file.name))
      if( repeatedFileList.length>0){
        setHoldingFiles(holdingFiles)
        setRepeatedFile( repeatedFileList)
        return
      }
    
      const tempUploadList:UploadList[] = manageUploadList(holdingFiles, repeatedFile || [], uploadList)
      
      uploadList && setUploadList(tempUploadList) 
      
      const formData:FormData = fileValidation(holdingFiles,acceptedFileTypes,setFileRejected,setFileSizeExceeded)
      let repeatedFilesFormData;
      if(repeatedFile){
      repeatedFilesFormData =  fileValidation(repeatedFile,acceptedFileTypes,setFileRejected,setFileSizeExceeded)
      }

      if(user && folderId){
        formData.append('folderId',folderId)
        formData.append('userId',user._id)
      }
   
      const repeatedUploadedFiles:FormDataEntryValue[] = repeatedFilesFormData?.getAll("file") || [];
      if(repeatedUploadedFiles.length!==0){
        for(let file of repeatedUploadedFiles){
          formData.append('file', file)
        }
      }
      const uploadedFiles: FormDataEntryValue[] = formData.getAll("file");
   
      if(uploadedFiles.length!==0){
        const response = await fetch(`http://localhost:3000/api/notes`,
          {
            method: 'POST',
            headers:{
              "Accept": "application/json",
            },
            body: formData
          }
         )
         if(response.ok){
          const data = await response.json()
          const responseNotes = data.data
      
        
          let repeatedFileNames = repeatedUploadedFiles
          .filter((file) => file instanceof File) 
          .map((file) => file.name); 
    
          const newNotes = responseNotes.filter((note:NoteResponse)=>!repeatedFileNames.includes(note.noteName))
          const replacingNotes = responseNotes.filter((note:NoteResponse)=>repeatedFileNames.includes(note.noteName))
          
          try {
           let finalNoteList;
            if(replacingNotes.length!==0){
              const response = await Promise.all([
                await fetch(
                  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/note/uploadNotes`,
                  {
                    method: "POST",
                    headers: {
                      "Accept": "application/json",
                      "Content-Type": "application/json",
                       "Authorization":`Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`

                    },
                    body: JSON.stringify({ newNotes }),
                  }
                ),
                await fetch(
                  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/note/replaceNotes`,
                  {
                    method: "PUT",
                    headers: {
                      "Accept": "application/json",
                      "Content-Type": "application/json",
                       "Authorization":`Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`
                    },
                    body: JSON.stringify({replacingNotes}),
                  }
                )
              ])
              let uploadedNewNotesData = await response[0].json()
              let uploadedNewNotes = await uploadedNewNotesData.data
              let replacedNotesData = await response[1].json()
              let replacedNotes = await replacedNotesData.data
        
              const modifiedNewNotes:Note[] = uploadedNewNotes.map((note:any)=>{
                return{
                 noteName:note.noteName,
                 noteId:note._id,
                 contentType:note.contentType,
                 downloadUrl: note.downloadUrl,
                } 
              })
              const modifiedReplacedNotes:Note[] = replacedNotes.map((note:any)=>{
                return{
                 noteName:note.noteName,
                 noteId:note._id,
                 contentType:note.contentType,
                 downloadUrl: note.downloadUrl,
                } 
              })
              let replacedNoteList = notes.map((note:Note)=>{
                let replacement = modifiedReplacedNotes.find(updatedNote=>updatedNote.noteId===note.noteId)
                return replacement || note
              }) 
              finalNoteList = [...replacedNoteList,...modifiedNewNotes]
              
            
  
            }else{
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/note/uploadNotes`,
                {
                  method: "POST",
                  headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                     "Authorization":`Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`
                  },
                  body: JSON.stringify({ newNotes }),
                }
              )
              const data = await response.json()
           
              let updatedNoteList = data.data.map((note:any)=>{
                return{
                 noteName:note.noteName,
                 noteId:note._id,
                 contentType:note.contentType,
                 downloadUrl: note.downloadUrl,
                } 
              
            })
            finalNoteList = [...notes,...updatedNoteList]
        
            }
            console.log(finalNoteList)
            setNotes(finalNoteList)
              }catch (error:any) {
                      setErrorDuringUpload(true)
                     console.log(error.message)
                }
               
          }
              
      }else{
          setErrorDuringUpload(true)
          }

    }
    setIsUploading(false)
    setTimeout(()=>{
        setUploadList([])
        setFileRejected(false)
        setFileSizeExceeded(false)
      },5000)
     
}
export const sendFriendRequest = async(receiverId:string)=>{
  
   try{
    const response = await fetch("http://localhost:5000/api/users/sendFriendRequest",{
      method:"POST",
      headers:{
        "Accept":"application/json",
        "Content-Type":"application/json",
        "Authorization":`Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
      },
      body:JSON.stringify({
      receiverId
      })
    })
    const data = await response.json()
    return data
   }catch(e:unknown){
    if(e instanceof Error) console.log(e.message)
   }
}
export const getFriendList = async()=>{
  try{
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/friends`,{
      method:"GET",
      headers:{
        "Accept":"application/json",
        "Content-Type":"application/json",
        'Authorization':`Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`
      }
    })
    if(response.ok){
      const data = await response.json()
      return data.data
    }
  }catch(e){
    console.log(e)
  }
 
}

export const getSentRequests = async()=>{
  try{
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/sentFriendRequests`,{
      method:"GET",
      headers:{
        "Accept":"application/json",
        "Content-Type":"application/json",
        'Authorization':`Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`
      }
    })
    if(response.ok){
      const data = await response.json()
      return data.data
    }
  }catch(e){
    console.log(e)
  }
 
}

export const getPendingRequests = async()=>{
  try{
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/pendingFriendRequests`,{
      method:"GET",
      headers:{
        "Accept":"application/json",
        "Content-Type":"application/json",
        'Authorization':`Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`
      }
    })
    if(response.ok){
      const data = await response.json()
      return data.data
    }
  }catch(e){
    console.log(e)
  }
 
}

export const shareNotes = async(shareList:string[], note:Note, user:string | null)=>{

  try{
 
      const response = await fetch(`http://localhost:3000/api/fileSharing`,
        {
          method: 'POST',
          headers:{
            "Accept": "application/json",
          },
          body: JSON.stringify({

            downloadUrl :note.downloadUrl,
            shareList,
            sourceUserId:user,
            note 
          })
        }
       )
       if(response.ok){
        const data = await response.json()
        const fbUploadedNotes = data.data
        const BEres = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sharedFiles/shareNote`,{
          method:"POST",
          headers:{
            "Accept":"application/json",
            "Content-Type":"application/json",
            "Authorization":`Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`
          },
          body:JSON.stringify({
            notes:fbUploadedNotes
          })})
        const BEdata = BEres.json()
        console.log(BEdata)
        
       }
  }catch(e){
    if(e instanceof Error)console.log(e.message)
  }
}

export const getSharedNotes = async () => {
  try {
  
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sharedFiles/getSharedNotes`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data; 
  } catch (e) {
    console.error("Error fetching shared notes:", e);
    return { error: e instanceof Error ? e.message : "An unknown error occurred" };
  }
};

export const addEvent = async(title:string,start:FormDataEntryValue,end:FormDataEntryValue,description:string)=>{
  try{
    console.log(title)
    const response:Response = await fetch("http://localhost:5000/api/events/addEvent",{
      method: 'POST',
      headers:{
        'Accept':'application/json',
       'Content-Type':'application/json',
        'Authorization':`Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`
      }, 
      body: JSON.stringify({
        title,
        start: start.toString(), 
        end: end.toString(),      
        description,
      }),
    })
    if(!response.ok){
      const errorMessage = `Error: ${response.status} - ${response.statusText}`;
      throw new Error(errorMessage);
    }
    const data = await response.json()
    return data
  }catch(e){
    if (e instanceof Error) console.log("Error", e.message)
      return {data:null}
  }
}

export const getEvents = async()=>{
  try {
  
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/getEvents`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data; 
  } catch (e) {
    console.error("Error fetching events:", e);
    return { error: e instanceof Error ? e.message : "An unknown error occurred", data:null };
  }
};

export const updateEvent = async(title:string,start:FormDataEntryValue,end:FormDataEntryValue,description:string, id:string | null)=>{
  try {
    if(!id){
      console.log('EventId is require')
      return
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/updateEvent`,
      {
        method: "PATCH",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          id,
          title,
          start: start.toString(), 
          end: end.toString(),      
          description,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }
    
    const data = await response.json();

    return data; 
  } catch (e) {
    console.error("Error fetching events:", e);
    return { error: e instanceof Error ? e.message : "An unknown error occurred" , data:null};
  }
}

export const deleteEvent = async(eventsToDelete:string[])=>{
  try {
 
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/deleteEvents`,
      {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
         eventsToDelete
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (e) {
    console.error("Error fetching events:", e);
    return {status:"error", error: e instanceof Error ? e.message : "An unknown error occurred", data:null };
  }
}

export const updateProfile = async(changedFields:Partial<User>)=>{
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/updateUserInfo`,
      {
        method: "PATCH",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({changedFields}),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }
    
    const data = await response.json();

    return data; 
  } catch (e) {
    return {error: e instanceof Error ? e.message : "An unknown error occurred. Please Try Again" , data:null};
  }
}