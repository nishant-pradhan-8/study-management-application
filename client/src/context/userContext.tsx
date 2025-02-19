"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

import {User } from "@/types/types";
import { Notification } from "@/types/types";

interface ContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  friends: User[] | null;
  setFriends: Dispatch<SetStateAction<User[] | null>>;
  pendingRequests: User[] | null;
  setPendingRequests: Dispatch<SetStateAction<User[] | null>>;
  sentRequests: User[] | null;
  setSentRequests: Dispatch<SetStateAction<User[] | null>>;
  shareList: string[];
  setShareList: Dispatch<SetStateAction<string[]>>;
  alertDialogOpen: boolean;
  setAlertDialogOpen: Dispatch<SetStateAction<boolean>>;
  notifications: Notification[] | null;
  setNotifications: Dispatch<SetStateAction<Notification[] | null>>;

  notificationDialogOpen: boolean;
  setNotificationDialogOpen: Dispatch<SetStateAction<boolean>>;
}
const AppContext = createContext<ContextType | undefined>(undefined);

export default function UserProvider({ children }: { children: ReactNode }) {
  /*User Context*/
  const [user, setUser] = useState<User | null>(null);
  const [friends, setFriends] = useState<User[] | null>([
    {
      _id: "1",
      userName: "abc",
      profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    },
    {
      _id: "2",
      profilePicture: "https://randomuser.me/api/portraits/women/2.jpg",
      userName: "abc",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
    },
    {
      _id: "3",
      profilePicture: "https://randomuser.me/api/portraits/men/3.jpg",
      userName: "abc",
      firstName: "Michael",
      lastName: "Brown",
      email: "michael.brown@example.com",
    },
    {
      _id: "4",
      profilePicture: "https://randomuser.me/api/portraits/women/4.jpg",
      userName: "abc",
      firstName: "Emily",
      lastName: "Johnson",
      email: "emily.johnson@example.com",
    },
    {
      _id: "5",
      profilePicture: "https://randomuser.me/api/portraits/men/5.jpg",
      userName: "abc",
      firstName: "David",
      lastName: "Wilson",
      email: "david.wilson@example.com",
    },
    {
      _id: "6",
      profilePicture: "https://randomuser.me/api/portraits/women/6.jpg",
      userName: "abc",
      firstName: "Sophia",
      lastName: "Martinez",
      email: "sophia.martinez@example.com",
    },
    {
      _id: "7",
      profilePicture: "https://randomuser.me/api/portraits/men/7.jpg",
      userName: "abc",
      firstName: "Daniel",
      lastName: "Anderson",
      email: "daniel.anderson@example.com",
    },
  ]);
  const [pendingRequests, setPendingRequests] = useState<User[] | null>(null);
  const [sentRequests, setSentRequests] = useState<User[] | null>(null);
  const [shareList, setShareList] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[] | null>(
    null
  );
  const [notificationDialogOpen, setNotificationDialogOpen] =
    useState<boolean>(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        friends,
        setFriends,
        pendingRequests,
        setPendingRequests,
        sentRequests,
        setSentRequests,
        shareList,
        setShareList,
        alertDialogOpen,
        setAlertDialogOpen,
        notifications,
        setNotifications,
        notificationDialogOpen,
        setNotificationDialogOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useUserContext must be used within a ContextProvider");
  }
  return context;
}
