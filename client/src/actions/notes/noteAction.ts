import apiCall from "@/utils/backEndApiHandler";
import nextBackEndApiCall from "@/utils/nextBackEndApi";
import { FileSelection } from "@/hooks/useMultipleSelection";
export const getNotes = async (folderId: string) => {
  const { data } = await apiCall(`/api/folder/${folderId}`, "GET", null);
  return data;
};

export const updateLast = async () => {
  const { data } = await apiCall("/api/note/updateLastViewed", "PATCH", null);
  return data;
};

export const getLastViewedNotes = async () => {
  const { data } = await apiCall("/api/note/getLastViewedNotes", "GET", null);
  return data;
};

export const deleteNotes = async (
  notesToDelete: FileSelection[],
  userId: string
) => {
  const { data } = await nextBackEndApiCall("/api/notes", "DELETE", {
    userId,
    notesToDelete,
  });
  if (data.status === "error") {
    return data;
  }
  const modifiedNTD = notesToDelete.map((note) => {
    return {
      _id: note.fileId,
      folderId: note.folderId,
    };
  });

  const res = await apiCall(`/api/note/deleteNote`, "DELETE", {
    notesToDelete: modifiedNTD,
  });

  return res;
};

export const getNoteInfo = async (noteId: string | null) => {
  const { data } = await apiCall(`/api/note/noteInfo/${noteId}`, "GET", null);
  return data;
};
