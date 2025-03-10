"use client";
import Image from "next/image";
import { useEffect } from "react";
import { useUserContext } from "@/context/userContext";
import { getFriendList } from "@/actions/users/usersAction";
import useMenu from "@/hooks/useMenu";
import FriendsMenu from "./friendsMenu";
import AvatarWithText from "@/app/_components/skeletons/avatarAndText";
export default function FriendsList() {
  const { friends, setFriends } = useUserContext();
  const { selectedMenuId, setSelectedMenuId, menuRef } = useMenu();
  const { setIsDeleting, isDeleting, setPopUpMessage } = useUserContext();

  useEffect(() => {
    if (!friends) {
      const fetchFriends = async () => {
        const friends = await getFriendList();
        if (!friends.data) {
          return console.log("unable to get Friends List");
        }

        setFriends(friends.data);
      };
      fetchFriends();
    }
  }, [friends, setFriends]);
  return (
    <div className="border-[1px] border-gray-300 p-4 rounded-xl mt-6 ">
      <h3 className="text-lg font-semibold">Study Buddies</h3>

      <div className="mt-2 ">
        <div className="mt-2">
          {friends ? (
            friends.length > 0 ? (
              friends.map((friend) => (
                <div
                  key={friend._id}
                  className="flex items-center justify-between py-4 border-b border-gray-300 last:border-none"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={
                        friend?.profilePicture === "" || !friend
                          ? "/images/profile.svg"
                          : friend?.profilePicture
                      }
                      className="rounded-full"
                      width={30}
                      height={30}
                      alt="profile"
                    />
                    <div>
                      <p className="font-medium  w-[8rem] overflow-hidden max-lg:w-[12rem] text-ellipsis max-md: max-580:!w-[7rem]">{`${friend.firstName} ${friend.lastName}`}</p>
                      <p className="text-gray-400 text-sm w-[8rem] overflow-hidden  max-lg:w-[12rem] max-580:!w-[7rem] text-ellipsis">
                        {friend.email}{" "}
                      </p>
                    </div>
                  </div>
                  <div className="text-right relative">
                    <a
                      className="cursor-pointer"
                      onClick={() => setSelectedMenuId(friend._id)}
                    >
                      <Image
                        src="/images/menu.svg"
                        alt="menu"
                        width={25}
                        height={25}
                      />
                    </a>

                    {selectedMenuId === friend._id && !isDeleting && (
                      <FriendsMenu
                        menuRef={menuRef}
                        setIsDeleting={setIsDeleting}
                        selectedMenuId={selectedMenuId}
                        setSelectedMenuId={setSelectedMenuId}
                        setPopUpMessage={setPopUpMessage}
                      />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 ">No Friends To Show</p>
            )
          ) : (
            <AvatarWithText />
          )}
        </div>
      </div>
    </div>
  );
}
