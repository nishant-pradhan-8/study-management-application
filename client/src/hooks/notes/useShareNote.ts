import { shareNotes } from "@/actions/SharedNotes/sharedNoteAction";
import { SetStateAction, Dispatch } from "react";
import { useState } from "react";
import { Note, User } from "@/types/types";
export default function useShareNote(
  setPopUpMessage: Dispatch<
    SetStateAction<{ success: boolean; message: string } | null>
  >,
  user: User | null
) {
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [shareList, setShareList] = useState<string[]>([]);
  const [fileSharingError, setFileSharingError] = useState<boolean>(false);
  const handleShareNote = async (noteList: Note[] | null) => {
    setIsSharing(true);
    const res = await shareNotes(shareList, noteList, user);
    if (!res || res.status === "error") {
      setFileSharingError(true);
      setIsSharing(false);
      return;
    }
    setShareList([]);
    setIsSharing(false);
    setPopUpMessage({ success: true, message: `Note shared Successfully!` });
    setFileSharingError(false);
    setInterval(() => {
      setPopUpMessage(null);
    }, 2000);
  };
  return {
    isSharing,
    shareList,
    setShareList,
    fileSharingError,
    handleShareNote,
  };
}
