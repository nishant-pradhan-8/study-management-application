import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import useDeleteSharedNotes from "@/hooks/sharedNotes/useDeleteSharedNotes";
import { useUserContext } from "@/context/userContext";
import { SharedNotes, sharedNotesToDelete } from "@/types/types";
export default function SrMenu({
  menuRef,
  handleDialogOpen,
  setSelectedMenuId,
  selectedMenuId,
  sharedNotes,
  setSharedNotes,
  note,
  setSelected,
  setSharedFileSelection,
}: {
  setSelectedMenuId: Dispatch<SetStateAction<string | null>>;
  handleDialogOpen: () => void;
  selectedMenuId: string | null;
  menuRef: React.RefObject<HTMLDivElement | null>
  sharedNotes: SharedNotes[] | null;
  setSharedNotes: Dispatch<SetStateAction<SharedNotes[] | null>>;
  note: SharedNotes | null;
  setSelected: Dispatch<SetStateAction<string[] | null>>;
  setSharedFileSelection: Dispatch<SetStateAction<SharedNotes[] | null>>;
}) {
  const { user, setIsDeleting } = useUserContext();
  const { handleDeleteSharedFile } = useDeleteSharedNotes(
    user,
    setIsDeleting,
    sharedNotes,
    setSharedNotes
  );

  const handleSharedNotesDelete = () => {
    if (!note) {
      return;
    }
    setSelectedMenuId(null);
    const selectedNote: sharedNotesToDelete = {
      _id: note._id,
      name: note.noteName,
    };
    handleDeleteSharedFile([selectedNote]);
  };

  const handleSelection = () => {
    setSelected([selectedMenuId!]);
    setSharedFileSelection([note!]);
    setSelectedMenuId(null);
  };

  const openTransferDialog = () => {
    const selectedNote: SharedNotes | null =
      sharedNotes?.find((note) => note._id === selectedMenuId) || null;
    if (!selectedNote) {
      return;
    }
    setSharedFileSelection([selectedNote]);
    handleDialogOpen();
  };

  const fileMenu = [
    {
      id: 0,
      menuIcon: "/images/move.svg",
      menuName: "Move To Folder",
      action: () => openTransferDialog(),
      width: 20,
      height: 20,
    },
    {
      id: 1,
      menuIcon: "/images/delete.svg",
      menuName: "Delete",
      action: () => handleSharedNotesDelete(),
      width: 20,
      height: 20,
    },

    {
      id: 2,
      menuIcon: "/images/select.svg",
      menuName: "Select",
      action: () => handleSelection(),
      width: 20,
      height: 20,
    },
  ];

  return (
    <div
      tabIndex={0}
      ref={menuRef}
      className={` bg-slate-200 w-[12rem] z-10 px-4  absolute left-[-11rem] rounded-xl`}
    >
      <ul className="list-none">
        {fileMenu.map((menu, index) => (
          <li key={menu.id}>
            <button
              onClick={(event) => {
                event.stopPropagation();
                menu.action();
              }}
              className={`flex w-full flex-row items-center gap-2 py-3 border-b-[1px] border-gray-400 
                              ${
                                index === fileMenu.length - 1
                                  ? "border-none"
                                  : ""
                              } `}
            >
              <Image
                alt={menu.menuIcon}
                src={menu.menuIcon}
                width={menu.width}
                height={menu.height}
              />
              {menu.menuName}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
