import { Note, User } from "@/types/types";
import nextBackEndApiCall from "@/utils/nextBackEndApi";
import apiCall from "@/utils/backEndApiHandler";
export const shareNotes = async (
  shareList: string[],
  note: Note,
  user: User | null
) => {
  try {
    let notes = {
      
      downloadUrl: note.downloadUrl,
      shareList,
      sourceUserId: user,
      note,
    }
    
    const response = await nextBackEndApiCall("/api/fileSharing","POST",{notes})
    
    if (!response.error) {
      const data = response.data;
      const fbUploadedNotes = data.data;
      const BEres = await apiCall(`/api/sharedFiles/shareNote`, "POST", {fbUploadedNotes})
      if(BEres.error){
        console.log(BEres)
      }
    }
  } catch (e) {
    if (e instanceof Error) console.log(e.message);
  }
};

export const getSharedNotes = async () => {
    const { data } = await apiCall(`/api/sharedFiles/getSharedNotes`, "GET", null);
    return data;
 
};
