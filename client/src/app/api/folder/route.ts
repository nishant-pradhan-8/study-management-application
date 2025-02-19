import { storage } from "@/lib/firebase";
import { ref, StorageReference } from "firebase/storage";
import { uploadBytes } from "firebase/storage";
import { Folder } from "@/types/types";
import { NextResponse } from "next/server";
import { Reference } from "react";
import { FolderRequestBody } from "@/types/types";
import { listAll } from "firebase/storage";
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
