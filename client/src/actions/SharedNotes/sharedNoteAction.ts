import { Note, User, SharedNotes} from "@/types/types";
import nextBackEndApiCall from "@/utils/nextBackEndApi";
import apiCall from "@/utils/backEndApiHandler";
import { sharedNotesToDelete } from "@/types/types";
export const shareNotes = async (
  shareList: string[],
  notes: Note[] | null,
  user: User | null
) => {
  try {
    const sharingInfo = {
      shareList,
      sourceUserId: user?._id,
      notes,
    };

    const res = await nextBackEndApiCall("/api/fileSharing", "POST", { sharingInfo });

    if (!res || !res.data.data) {
      console.log("Unable to Upload to firebase");
      return res.data;
    }

    const { data } = await apiCall(`/api/sharedFiles/shareNote`, "POST", {
      notes: res.data.data,
    });

    return data;

  } catch (e) {
    if (e instanceof Error) console.log(e.message);
    return { status: "error", message: `Failed to share file`, data: null };
  }
};

export const getSharedNotes = async () => {
  const { data } = await apiCall(
    `/api/sharedFiles/getSharedNotes`,
    "GET",
    null
  );
  return data;
};
/*
export const transferNote = async (
  note: Partial<NoteSharing>,
  userId: string,
  folderId: string
) => {
  const res = await nextBackEndApiCall("/api/fileSharing", "PATCH", {
    fileName: note.noteName,
    folderId,
    userId,
    downloadUrl: note.downloadUrl,
    fileType: note.contentType,
  });
  if (res.data.status === "error") {
    return;
  }
  const transferredNote = {
    noteName: note.noteName,
    folderId,
    fileSize: note.fileSize,
    fileType: note.fileType,
    contentType: note.contentType,
    userId,
    downloadUrl: res.data.data,
  };
  const { data } = await apiCall("/api/sharedFiles/transferNote", "PATCH", {
    note: transferredNote,
    sharedNoteId: note._id,
  });
  return data;
};
*/

export const transferNote = async (
  notes: SharedNotes[],
  userId: string,
  folderId: string
) => {
  const res = await nextBackEndApiCall("/api/fileSharing", "PATCH", {
    notes,
    folderId,
    userId,

  });
  if (res.data.status === "error" || res.data.length===0) {
    return;
  }
  const notesToTransfer = notes.map((note)=>{
    const matchedNote = res.data.data.find((noteObj:{
      _id: string;
      downloadUrl: string;
    }) => noteObj._id === note._id);  
    return {
      _id:note._id,
      noteName: note.noteName,
      folderId,
      fileSize: note.fileSize,
      fileType: note.fileType,
      contentType: note.contentType,
      userId,
      downloadUrl: matchedNote?.downloadUrl || "",
    }
  }) ;
  const { data } = await apiCall("/api/sharedFiles/transferNote", "PATCH", {
    notesToTransfer,
  });
  return data;
};

export const deleteSharedNotes = async(sharedNotesToDelete:sharedNotesToDelete[],userId:string | null)=>{
  const res = await nextBackEndApiCall("/api/fileSharing", "DELETE", { sharedNotesToDelete, userId });

  if(res.data.status==="error"){
    return
  }
  const { data } = await apiCall(
    `/api/sharedFiles/deleteSharedNotes`,
    "DELETE",
    {sharedNotesToDelete}
  );
  return data;
}
