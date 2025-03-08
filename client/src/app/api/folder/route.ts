import { storage } from "@/lib/firebase";
import { ref, StorageReference } from "firebase/storage";
import { uploadBytes } from "firebase/storage";
import { Folder } from "@/types/types";
import { NextResponse } from "next/server";
import { Reference } from "react";
import { FolderRequestBody } from "@/types/types";
import { listAll } from "firebase/storage";
import { deleteObject } from "firebase/storage";
export async function POST(request: Request) {
    try {
        const body:FolderRequestBody = await request.json();
        const { user, inputValue, folders, folderId } = body;
        const placeholder:Blob = new Blob([""], { type: "text/plain" });
        const storageRef:StorageReference = ref(storage, `Students/${user}/${inputValue}/.placeholder`);
        await uploadBytes(storageRef, placeholder);
      
        return NextResponse.json({
            message: "Post Successful",
          //  data: newFolders
        }, {
            status: 200
        });

    } catch (e: any) {
        return new Response(
            JSON.stringify({ error: e.message }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
export async function GET(){
    try{
        const studentNotesFolderRef = ref(storage,`Students/AkFfXEqk2rWuMiM0bSm3gFkqQOf2/`)
        const res = await listAll(studentNotesFolderRef);
        return NextResponse.json({
            status:"success",
            message:"Get Sucessfull",
            data:res
        },{
            status:200
        })
    }catch(e:any){
      return NextResponse.json({
        status:"error",
        message:e.message,
        data:null
      },{
        status:400,
        headers: { 'Content-Type': 'application/json' },
      })
    }
}
/*
export async function DELETE(request:Request){
     const req = await request.json();
      const { userId, folderId } = req;
      console.log(userId, folderId)
      try {
      
        const storageRef: StorageReference = ref(storage, `Students/${userId}/${folderId}`);
        const fileList = await listAll(storageRef)
        const deletePromises = fileList.items.map((fileRef) => deleteObject(fileRef));
        await Promise.all(deletePromises);
        return NextResponse.json(
          {status:"success", message: "Folder Deleted Successfully in Firebase", data:null },
          { status: 200 }
        );
    
      } catch (e:any) {
        console.error("Error deleting the folder:", e);
        return NextResponse.json(
          {status:"error",  message: e.message, data:null },
          { status: 500 }
        );
      }
}
*/

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
      } catch (error: any) {
        console.error(`Error deleting folder ${folderId}:`, error);
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

  } catch (error: any) {
    console.error("Error deleting folders:", error);
    return NextResponse.json(
      { status: "error", message: error.message, data: null },
      { status: 500 }
    );
  }
}