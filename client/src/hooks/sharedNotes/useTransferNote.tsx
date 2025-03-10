import { Dispatch, SetStateAction, useState } from "react";
import {
  transferNote,
} from "@/actions/SharedNotes/sharedNoteAction";
import {SharedNotes } from "@/types/types";
export default function useTransferNote(
  userId: string | null,
  sharedNotes: SharedNotes[] | null,
  setSharedNotes: Dispatch<SetStateAction<SharedNotes[] | null>>,
  handleDialogclose: () => void,
  setPopUpMessage: Dispatch<
    SetStateAction<{ success: boolean; message: string } | null>
  >
) {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [transfering, setTransfering] = useState<boolean>(false);
  const [transferError, setTransferError] = useState<boolean>(false);

  const handleNoteTransfer = async (
    noteList: SharedNotes[] | null
  ): Promise<void> => {
    if (!userId || !noteList || noteList.length === 0 || !selectedFolder) {
      return;
    }
    setTransferError(false);
    setTransfering(true);
    const res = await transferNote(noteList, userId, selectedFolder);
    if (res.status === "error") {
      setTransferError(true);
      setTransfering(false);
      return;
    }

    const noteIds = noteList.map((note) => note._id);
    const newSharedNotes =
      sharedNotes?.filter((note) => !noteIds.includes(note._id)) || [];
    setSharedNotes(newSharedNotes);

    handleDialogclose();
    setPopUpMessage({ success: true, message: `Note moved to Successfully!` });
    setTransfering(false);

    setInterval(() => {
      setPopUpMessage(null);
    }, 2000);
  };

  return {
    selectedFolder,
    setSelectedFolder,
    transfering,
    setTransfering,
    transferError,
    setTransferError,
    handleNoteTransfer,
  };
}
