import { storage } from "@/lib/firebase";
import { ref, StorageReference } from "firebase/storage";
import { NextResponse } from "next/server";
import { listAll } from "firebase/storage";
import { deleteObject } from "firebase/storage";


export async function DELETE(request: Request) {
  try {
    const req = await request.json();
    const { userId, folderIds } = req;

   
    if (!userId || !Array.isArray(folderIds) || folderIds.length === 0) {
      return NextResponse.json(
        { status: "error", message: "Invalid userId or folderIds", data: null },
        { status: 400 }
      );
    }

    const failedFolders: string[] = [];

    for (const folderId of folderIds) {
      try {
        const storageRef: StorageReference = ref(storage, `Students/${userId}/${folderId}`);
        const fileList = await listAll(storageRef);
        const deletePromises = fileList.items.map((fileRef) => deleteObject(fileRef));

        await Promise.all(deletePromises);
      } catch (error) {
        console.log(`Error deleting folder ${folderId}:`, error);
        failedFolders.push(folderId);
      }
    }

    if (failedFolders.length > 0) {
      return NextResponse.json(
        {
          status: "success",
          message: `Some folders failed to delete: ${failedFolders.join(", ")}`,
          data: null,
        },
        { status: 207 } 
      );
    }

    return NextResponse.json(
      { status: "success", message: "Folders deleted successfully", data: null },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting folders:", error);
    return NextResponse.json(
      { status: "error", message: error, data: null },
      { status: 500 }
    );
  }
}