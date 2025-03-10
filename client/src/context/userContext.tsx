"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

import { User } from "@/types/types";
import { Notification } from "@/types/types";

interface ContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  accessToken: string | null;
  setAccessToken: Dispatch<SetStateAction<string | null>>;
  friends: User[] | null;
  setFriends: Dispatch<SetStateAction<User[] | null>>;
  pendingRequests: User[] | null;
  setPendingRequests: Dispatch<SetStateAction<User[] | null>>;
  sentRequests: User[] | null;
  setSentRequests: Dispatch<SetStateAction<User[] | null>>;
  alertDialogOpen: boolean;
  setAlertDialogOpen: Dispatch<SetStateAction<boolean>>;
  notifications: Notification[] | null;
  setNotifications: Dispatch<SetStateAction<Notification[] | null>>;
  isDeleting: boolean;
  setIsDeleting: Dispatch<SetStateAction<boolean>>;
  popUpMessage: { success: boolean; message: string } | null;
  setPopUpMessage: Dispatch<
    SetStateAction<{ success: boolean; message: string } | null>
  >;
}
const AppContext = createContext<ContextType | undefined>(undefined);

export default function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [friends, setFriends] = useState<User[] | null>(null);
  const [pendingRequests, setPendingRequests] = useState<User[] | null>(null);
  const [sentRequests, setSentRequests] = useState<User[] | null>(null);
  const [notifications, setNotifications] = useState<Notification[] | null>(
    null
  );
  const [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [popUpMessage, setPopUpMessage] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        setAccessToken,
        friends,
        setFriends,
        pendingRequests,
        setPendingRequests,
        sentRequests,
        setSentRequests,

        alertDialogOpen,
        setAlertDialogOpen,
        notifications,
        setNotifications,
        isDeleting,
        setIsDeleting,
        popUpMessage,
        setPopUpMessage,
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
