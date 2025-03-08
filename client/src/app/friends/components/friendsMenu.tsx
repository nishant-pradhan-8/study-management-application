import Image from "next/image";
import { removeFriend } from "@/actions/users/usersAction";
import { Dispatch, SetStateAction } from "react";
import { useUserContext } from "@/context/userContext";
import { User } from "@/types/types";
export default function FriendsMenu({
  setIsDeleting,
  menuRef,
  selectedMenuId,
  setSelectedMenuId,
  setPopUpMessage,
}: {
  setIsDeleting: Dispatch<SetStateAction<boolean>>;
  menuRef: React.RefObject<HTMLDivElement | null>;
  selectedMenuId: string | null;
  setSelectedMenuId: Dispatch<SetStateAction<string | null>>;
  setPopUpMessage: Dispatch<
    SetStateAction<{ success: boolean; message: string } | null>
  >;
}) {
  const { friends, setFriends } = useUserContext();
  const handleUnFriend = async () => {
    if (!selectedMenuId) {
      return;
    }
    setIsDeleting(true);
    const res = await removeFriend(selectedMenuId);
    if (!res || !res.status || res.status === "error") {
      setPopUpMessage({
        success: false,
        message: "Unable to Unfriend the User. Please Try Again.",
      });
      setIsDeleting(false);
      setSelectedMenuId(null);
      return;
    }
    const newFriendList: User[] =
      friends?.filter((friend) => friend._id !== selectedMenuId) || [];
    setFriends(newFriendList);
    setSelectedMenuId(null);
    setIsDeleting(false);
  };

  const fileMenu = [
    {
      id: 0,
      menuIcon: "/images/unfriend.svg",
      menuName: "UnFriend",
      action: () => handleUnFriend(),
      width: 20,
      height: 20,
    },
  ];

  return (
    <div
      tabIndex={0}
      ref={menuRef}
      className={` bg-slate-200 w-[12rem] left-[-11rem] z-10 px-4  absolute rounded-xl`}
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
