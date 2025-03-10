import { useState, useEffect } from "react";
import { getFolderInfo } from "@/actions/folders/folderAction";
import { getNoteInfo } from "@/actions/notes/noteAction";
export interface Info {
  id: number;
  infoName: string;
  info: string;
}

export default function useViewInfo(
  selectedMenuId: string | null,
  infoFor: string
) {
  const [info, setInfo] = useState<Info[] | null>(null);
  useEffect(() => {
    if (selectedMenuId) {
      const fetchFolderInfo = async () => {
        let res;
        if (infoFor === "folder") {
          res = await getFolderInfo(selectedMenuId);
        } else {
          res = await getNoteInfo(selectedMenuId);
        }
        if (!res.data) {
          console.log("Unable to get Folder Info");
          return;
        }
        const data = res.data;
        let modifiedInfo: Info[];
        if (infoFor === "folder") {
          modifiedInfo = [
            {
              id: 1,
              infoName: "Folder Name",
              info: data.folderName,
            },
            {
              id: 2,
              infoName: "Created At",
              info: data.createdAt,
            },
            {
              id: 3,
              infoName: "Last Updated",
              info: data.lastUpdated,
            },
            {
              id: 4,
              infoName: "Total Notes",
              info: data.totalNotes,
            },
          ];
        } else {
          modifiedInfo = [
            {
              id: 1,
              infoName: "Note Name",
              info: data.noteName,
            },
            {
              id: 2,
              infoName: "File Size",
              info: data.fileSize,
            },
            {
              id: 3,
              infoName: "File Type",
              info: data.fileType,
            },
            {
              id: 4,
              infoName: "Folder",
              info: data.folderName,
            },
            {
              id: 5,
              infoName: "Uploaded At",
              info: data.uploadedAt,
            },
            {
              id: 6,
              infoName: "Last Viewed",
              info: data.lastViewed,
            },
          ];
        }

        setInfo(modifiedInfo);
      };

      fetchFolderInfo();
    }
  }, [selectedMenuId, infoFor]);
  return { info };
}
