import apiCall from "@/utils/backEndApiHandler";
import { Folder, NoteResponse } from "@/types/types";
import { Dispatch, SetStateAction } from "react";
import { Note, User } from "@/types/types";
import nextBackEndApiCall from "@/utils/nextBackEndApi";
import { FileSelection } from "@/hooks/useMultipleSelection";
export const getNotes = async (folderId: string) => {
  const { data } = await apiCall(`/api/folder/${folderId}`, "GET", null);
  return data;
};
/*
export const deleteNote = async (
  fileId: string,
  fileName: string,
  user: User | null,
  folderId: string | null,
  notes: Note[] | null,
  setNotes: Dispatch<SetStateAction<Note[] | null>>,
  setFileMenuOpenId: Dispatch<SetStateAction<string | null>>
) => {
  if(!notes){
    return
  }
  const latestNotes = notes.filter((note) => note._id !== fileId);
  setNotes(latestNotes);
  setFileMenuOpenId(null);
  try {
    if (!user) {
      return console.log("User not found");
    }
    

    const response = await nextBackEndApiCall("/api/notes","DELETE",{
      userId: user._id,
      folderId,
      fileName,
    })
   
    if (!response.error) {
      await apiCall(`/api/note/deleteNote`, "DELETE", { fileId });
    }
    
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log(e.message);
    }
  }
};
*/
export const updateLast = async () => {
  const {data} = await apiCall("/api/note/updateLastViewed","PATCH",null)
  return data
}

export const getLastViewedNotes = async()=>{
  const {data} = await apiCall("/api/note/getLastViewedNotes","GET",null)
  return data
}



export const deleteNotes = async(notesToDelete:FileSelection[],userId:string) =>{
 
const {data} = await nextBackEndApiCall('/api/notes',"DELETE",{
    userId, notesToDelete
  } )
  if(data.status==='error'){
    return data
  }
const modifiedNTD = notesToDelete.map((note)=>{
  return {
    _id:note.fileId,
    folderId:note.folderId
  }
})
  
  const res = await apiCall(`/api/note/deleteNote`, "DELETE", {notesToDelete:modifiedNTD});

  return res

}


export const getNoteInfo = async(noteId:string | null) =>{
  const {data} = await apiCall(`/api/note/noteInfo/${noteId}`, "GET", null);
  return data
  
}
