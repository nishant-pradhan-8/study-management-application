import { useEffect, useState, useRef } from "react";
export default function useCloseDialog() {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleDialogClose = (e: MouseEvent) => {
      if (
        dialogRef &&
        dialogOpen &&
        dialogRef.current &&
        !dialogRef.current.contains(e.target as Node)
      ) {
        setDialogOpen(false);
      }
    };
    document.addEventListener("click", handleDialogClose);
    return () => document.removeEventListener("click", handleDialogClose);
  }, [dialogOpen]);

  return { dialogOpen, setDialogOpen, dialogRef };
}
