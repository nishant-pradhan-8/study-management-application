"use client";
import { useUserContext } from "@/context/userContext";
export default function AlertDialogOverlay() {
  const { alertDialogOpen } = useUserContext();

  return (
    <>
      <div
        className={`${alertDialogOpen ? "alertDialogOverlay" : "hidden"}`}
      ></div>
    </>
  );
}
