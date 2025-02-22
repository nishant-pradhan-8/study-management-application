"use client";
import Image from "next/image";
import Link from "next/link";
import { useUserContext } from "@/context/userContext";
import Notifications from "./notification/notifications";
import { Notification } from "@/types/types";
import { useState, useEffect } from "react";
import { markNotificationRead } from "@/actions/notifications/notificationAction";
import FileDisplay from "./notes/fileDisplay";
import { useNoteContext } from "@/context/notesContext";
import useCloseDialog from "@/hooks/useAlertDialog";

export default function AppHeading() {
  const { user, setNotifications, notifications } = useUserContext();
  const { activeFile } = useNoteContext();
  const [unreadNotification, setUnreadNotification] = useState<Notification[]>(
    []
  );
  const { dialogRef, setDialogOpen, dialogOpen } = useCloseDialog();

  useEffect(() => {
    const unreadNotification: Notification[] | undefined =
      notifications?.filter((not) => !not.read);
    if (unreadNotification) {
      setUnreadNotification(unreadNotification);
    }
  }, [notifications]);

  const handleNotificatonDialogOpen = async () => {
    if (notifications) {
      setDialogOpen(!dialogOpen);
      const unreadNotification = notifications.filter((not) => !not.read);
      if (unreadNotification.length > 0) {
        await markNotificationRead();
        const modifiedNotification = notifications.map((not) => {
          return not.read ? not : { ...not, read: true };
        });
        setNotifications(modifiedNotification);
      }
    }
  };

  return (
    <div className="flex relative flex-row justify-between items-center w-full">
      <h1 className="font-bold text-2xl text-black">LOGO</h1>
      <div className="flex items-center gap-4 ">
        <a onClick={() => handleNotificatonDialogOpen()}>
          <div className="cursor-pointer relative">
            {" "}
            <Image
              src="/images/notifications.svg"
              width={20}
              height={20}
              alt="notifications"
            />{" "}
          </div>
          <div
            className={`w-2 h-2 bg-red-500 ${
              unreadNotification.length > 0 ? "block" : "hidden"
            } rounded-full top-[0.3rem] right-[2.9rem] absolute`}
          ></div>
        </a>
        <Link className="cursor-pointer" href="/profile">
          <img
            src={
              user?.profilePicture === "" || !user
                ? "/images/profile.svg"
                : user?.profilePicture
            }
            className="rounded-full"
            width={30}
            height={30}
            alt="profile"
          />
        </Link>
      </div>
      {dialogOpen && <Notifications dialogRef={dialogRef} />}
      {activeFile && <FileDisplay />}
    </div>
  );
}
