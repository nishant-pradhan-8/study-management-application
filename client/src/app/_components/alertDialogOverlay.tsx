"use client";
import { useUserContext } from "@/context/userContext";
import { useEffect } from "react";
export default function AlertDialogOverlay() {
  const { alertDialogOpen } = useUserContext();
  useEffect(()=>{
    console.log(alertDialogOpen)
  },[alertDialogOpen])
  return (
    <>
      <div
        className={`${alertDialogOpen ? "alertDialogOverlay" : "hidden"}`}
      ></div>
    
    </>
  );
}
