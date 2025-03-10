"use client";
import Image from "next/image";
import { useFolderContext } from "@/context/folderContext";
import { useUserContext } from "@/context/userContext";
import CardSkeleton from "../skeletons/cardSkeleton";
import Link from "next/link";
import { updateAccessCount } from "@/actions/folders/folderAction";
import { getFrequentlyAccessedFolders } from "@/actions/folders/folderAction";
import { Folder } from "@/types/types";
import React, { useEffect } from "react";
import { routeFormater } from "@/utils/utils";
import CreateFolderFaf from "./createFolderFaf";
import useMultipleSelection from "@/hooks/useMultipleSelection";

export default function RecentFolders() {
  const { faf, setFaf } = useFolderContext();
  const { user } = useUserContext();

  const { selected, handleSelection } = useMultipleSelection();

  useEffect(() => {
    if (!faf && user) {
      const fetchFrequentlyAccessedFolders = async () => {
        const res = await getFrequentlyAccessedFolders();
        if (!res.data) {
          setFaf([]);
          return console.log("Unable to Fetch Frequently Accessed Folder ");
        }
        const updatedFaf = res.data.map((folder: Partial<Folder>) => {
          return { ...folder, folderRoute: routeFormater(folder.folderName!) };
        });
        setFaf(updatedFaf);
      };
      fetchFrequentlyAccessedFolders();
    }
  }, [faf, user, setFaf]);

  return (
    <div>
      <h1 className="heading-1 ">Quick Access</h1>

      <div
        className={`mt-4 flex flex-row justify-start gap-4 overflow-x-scroll custom-scrollbar`}
      >
        {faf ? (
          faf.length > 0 ? (
            faf?.map((folder) => (
              <div
                key={folder._id}
                className={`folder-card  ${
                  selected?.includes(folder._id!)
                    ? "border-[2px] border-lightBlue"
                    : ""
                } `}
              >
                <Link
                  onClick={(e) => {
                    if (selected) {
                      e.preventDefault();
                      handleSelection(folder._id!);
                    } else {
                      updateAccessCount(folder._id);
                    }
                  }}
                  href={`/study-folders/${folder._id}`}
                >
                  <div className="folder-icon-div ">
                    <Image
                      src="/images/folder-dark.svg"
                      alt="folder-icon"
                      width={25}
                      height={25}
                    />
                    <div className=" w-[10rem] max-sm:w-[7rem] overflow-hidden whitespace-nowrap overflow-ellipsis">
                      {folder.folderName}
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <CreateFolderFaf />
          )
        ) : (
          <CardSkeleton />
        )}
      </div>
    </div>
  );
}
