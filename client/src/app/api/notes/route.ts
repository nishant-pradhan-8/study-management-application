import { NextResponse } from "next/server";
import { getDownloadURL, ref, StorageReference, } from "firebase/storage";
import { storage } from "@/lib/firebase"
import { getCurrentDate } from "@/lib/utils";
import { uploadBytes } from "firebase/storage";
import { NoteResponse } from "@/types/types";
import { deleteObject } from "firebase/storage";

export async function POST(request: Request) {
    try {
      const formData: FormData = await request.formData();
      const files: FormDataEntryValue[] = formData.getAll("file");
      const userId: FormDataEntryValue | null = formData.get("userId");
      const folderId: FormDataEntryValue | null = formData.get("folderId");
  
      if (!userId || !folderId) {
        return NextResponse.json(
          { error: "Missing required userId or folderId" },
          { status: 400 }
        );
      }
  
      const notes: NoteResponse[] = [];
  
      for (const file of files) {
        if (file instanceof File) {
          try {
              const metaData = {
                contentType: file.type,
              };

            const blob = file.slice(0, file.size);
            const storageRef = ref(
              storage,
              `Students/${userId}/${folderId}/${file.name}`
            );
  
            await uploadBytes(storageRef, blob, metaData);
  
            const downloadUrl = await getDownloadURL(storageRef);
  
            const noteObject: NoteResponse = {
              noteName: file.name,
              folderId,
              userId,
              contentType: file.type,
              downloadUrl,
            };
  
            notes.push(noteObject);
          } catch (error) {
           
            return NextResponse.json(
              { error: `Failed to upload file "${file.name}". Please try again.`, data:[] },
              { status: 500 }
            );
          }
        }
      }
      return NextResponse.json(
        { message: "File Uploaded to Firebase Sucessfullly", data:notes },
        { status: 200 }
      );
    
    
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred.";
        console.error("Unhandled error in POST handler:", errorMessage);
  
      return new Response(
        JSON.stringify({ error: errorMessage, data:[] }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
}
export async function DELETE(request:Request){
  const req = await request.json();
  console.log(req)
  const { userId, folderId, fileName } = req;
  console.log(userId)
  try {
  
    const storageRef: StorageReference = ref(storage, `Students/${userId}/${folderId}/${fileName}`);
    await deleteObject(storageRef);
    return NextResponse.json(
      { message: "File Deleted Successfully in Firebase" },
      { status: 200 }
    );

  } catch (e:any) {
    console.error("Error deleting the file:", e);
    return NextResponse.json(
      { message: e.message },
      { status: 500 }
    );
  }
}