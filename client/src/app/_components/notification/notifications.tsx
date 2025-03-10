"use client";
import Image from "next/image";
import { useUserContext } from "@/context/userContext";
import Link from "next/link";
import NotificationSkeleton from "../skeletons/notificationSkeleton";

export default function Notifications({
  dialogRef,
}: {
  dialogRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { notifications } = useUserContext();

  const notificationIcon: Record<string, string> = {
    friendRequest: "/images/friends.svg",
    notesShared: "/images/sharedResources.svg",
  };

  return (
    <div
      ref={dialogRef}
      className="absolute w-[18rem] top-[3.5rem] z-[50] bg-white border-[1px] border-gray-400 right-[3rem] rounded-xl max-h-[10rem] overflow-y-scroll custom-scrollbar max-sm:fixed   max-sm:top-[4rem]  max-sm:left-[50%]  max-sm:-translate-x-1/2 "
    >
      <ul>
        {notifications ? (
          notifications.length > 0 ? (
            notifications.map((notification) => (
              <li key={notification._id}>
                <Link
                  className={`text-[0.8rem] ${
                    notification.notificationType === "notesShared"
                      ? "icon-black"
                      : ""
                  } last:border-none h-[55px] items-center  font-semibold border-b-[1px] border-gray-500  p-2 px-4 flex flex-row gap-2 cursor-pointer`}
                  href={
                    notification.notificationType === "friendRequest"
                      ? "/friends"
                      : "shared-resources"
                  }
                >
                  <Image
                    src={notificationIcon[notification.notificationType]}
                    width={20}
                    height={20}
                    alt="friends-logo"
                  />
                  {notification.notification}
                </Link>{" "}
              </li>
            ))
          ) : (
            <p className="p-4 font-semibold">
              No Notifications To Show . . . .
            </p>
          )
        ) : (
          <NotificationSkeleton />
        )}
      </ul>
    </div>
  );
}
