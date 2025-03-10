import Image from "next/image";
import { Note, SharedNotes } from "@/types/types";
import { SetStateAction,Dispatch } from "react";
import { useFolderContext } from "@/context/folderContext";
import { getNotes } from "@/actions/notes/noteAction";
export default function FolderSelection({
  handleDialogclose,
  sharedFileSelection,
  setSelectedFolder,
  transferError,
  handleNoteTransfer,
  transfering,
  selectedFolder,
  setSelected,
  setSharedFileSelection,
}: {
  userId: string | null;
  selected: string[] | null;
  handleDialogclose: () => void;
  sharedNotes: SharedNotes[] | null;
  setSharedNotes: Dispatch<SetStateAction<SharedNotes[] | null>>;
  sharedFileSelection: SharedNotes[] | null;
  setSelectedFolder: Dispatch<SetStateAction<string | null>>;
  transferError: boolean;
  handleNoteTransfer: (
    sharedFileSelection: SharedNotes[] | null
  ) => Promise<void>;
  transfering: boolean;
  selectedFolder: string | null;
  setSelected: Dispatch<SetStateAction<string[] | null>>;
  setSharedFileSelection: Dispatch<SetStateAction<SharedNotes[] | null>>;
}) {
  const { folders } = useFolderContext();

  const handleTransferToFolder = async () => {
    if (!selectedFolder || !sharedFileSelection) {
      return;
    }
    const res = await getNotes(selectedFolder);

    if (!res || !res.data) {
      return;
    }
    const noteNames: Set<string> = new Set(
      res.data.map((note: Note) => note.noteName)
    );

    const tempSharedFile: SharedNotes[] = sharedFileSelection.map((note) => {
      let counter = 0;
      let uniqueName = note.noteName;
      while (noteNames.has(note.noteName)) {
        counter++;
        uniqueName = `${note.noteName}(${counter})`;
      }
      noteNames.add(uniqueName);
      return counter !== 0 ? { ...note, noteName: uniqueName } : note;
    });

    await handleNoteTransfer(tempSharedFile);
    setSelected(null);
    setSharedFileSelection(null);
  };

  return (
    <div
      className={`bg-gray-800 p-4 rounded-xl fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[30rem] max-sm:!w-[18rem] max-md:w-[24rem] z-50`}
    >
      <div className="flex flex-col gap-2 mb-4 pb-4 border-b-[1px] border-gray-300">
        <div className="flex flex-row justify-between">
          <h2 className="text-white text-[1.5rem] font-semibold mr-2">
            Select Your Folder To Transfer
          </h2>
          <a className="cursor-pointer" onClick={handleDialogclose}>
            <Image
              alt="close"
              src="/images/cross-white.svg"
              width={25}
              height={25}
            />
          </a>
        </div>
      </div>

      <div className="pb-4">
        <h3 className="text-white text-[1rem] font-semibold mr-2">
          Your Folders
        </h3>
        <div className="overflow-y-scroll h-[14rem]">
          <form onSubmit={(e) => e.preventDefault()}>
            {folders &&
              folders?.map((folder) => (
                <label
                  key={folder._id}
                  htmlFor={folder._id!}
                  className="w-full friends-share-checkbox p-2 rounded-xl peer-checked:border-2 flex flex-row justify-between items-center cursor-pointer"
                >
                  <div className="mt-4 flex flex-row items-center gap-2">
                    <div className="bg-gray-300 rounded-[8px] p-2 mr-2">
                      <Image
                        src={`/images/folder-dark.svg`}
                        alt="image-icon"
                        width={20}
                        height={20}
                      />
                    </div>

                    <div className="text-white">
                      <p className="font-semibold">{folder.folderName}</p>
                    </div>
                  </div>
                  <input
                    onChange={() => setSelectedFolder(folder._id)}
                    id={folder._id!}
                    type="radio"
                    name="folder"
                  />
                </label>
              ))}
          </form>
        </div>
      </div>

      <div className="pt-2  border-t-[1px] border-gray-300">
        <p
          className={`text-red-400 mb-2 ${!transferError ? "invisible" : ""} `}
        >
          *Notes Sharing Failed. Please Try Again!
        </p>
        <button
          onClick={handleTransferToFolder}
          className={`${
            !selectedFolder ? "bg-gray-400 cursor-not-allowed" : ""
          } primary-btn w-full items-center justify-center h-10`}
          disabled={transfering || !selectedFolder}
        >
          {transfering ? <div className="loader"></div> : "Transfer"}
        </button>
      </div>
    </div>
  );
}
