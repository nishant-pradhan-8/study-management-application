import { SetStateAction } from "preact/compat";
import { Dispatch, useState } from "react";

export default function useOverlayDialog(selectedMenuId:string | null, setAlertDialogOpen:Dispatch<SetStateAction<boolean>>, setSelectedMenuId:Dispatch<SetStateAction<string | null>>){
    const [tempId, setTempId] = useState<string | null>(null)
    const [overlayDialogOpen, setOverlayDialogOpen] = useState<boolean>(false)
    function handleDialogOpen  () {
        setTempId(selectedMenuId);
        setOverlayDialogOpen(true);
        setAlertDialogOpen(true);
        setSelectedMenuId(null);
      };

    const handleDialogclose = ()=>{
      setTempId(null);
      setOverlayDialogOpen(false);
      setAlertDialogOpen(false);
    }
    return {handleDialogOpen,handleDialogclose, tempId, overlayDialogOpen, setTempId,setOverlayDialogOpen}

}