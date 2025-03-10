import { getDownloadURL, ref, StorageReference } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { uploadBytes } from "firebase/storage";
import { NextResponse } from "next/server";
import { deleteObject } from "firebase/storage";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const profilePicture = formData.get("profilePicture");
    const userId = formData.get("userId");

    if (!(profilePicture instanceof File)) {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid file or missing data",
          data: null,
        },
        { status: 400 }
      );
    }
    const metaData = { contentType: profilePicture.type };
    const storageRef = ref(
      storage,
      `Students/${userId}/profile/profilePicture`
    );

    await uploadBytes(storageRef, profilePicture, metaData);
    const downloadUrl = await getDownloadURL(storageRef);
    
    return NextResponse.json(
      {
        status: "success",
        message: "Updated successfully in Firebase",
        data: downloadUrl,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json(
      { status: "error", message: "Unexpected Error Occurred", data: null },
      { status: 500 }
    );
  }
}
export async function DELETE(req: Request) {
  const { downloadUrl } = await req.json();
  try {
   
    const baseUrl = `${process.env.NEXT_PUBLIC_FIREBASE_BASE_URL}`;

    const decodedPath = decodeURIComponent(
      downloadUrl.split(baseUrl)[1].split("?")[0]
    );
    const storageRef: StorageReference = ref(storage, decodedPath);
    await deleteObject(storageRef);
    return NextResponse.json(
      {
        status: "success",
        message: "Profile Picture Deleted Sucessfully",
        data: null,
      },
      { status: 200 }
    );
  } catch (e) {
    if(e instanceof Error){
      console.error("Error deleting", e.message);
      return NextResponse.json(
        { status: "error", message: e.message, data: null },
        { status: 500 }
      );
    }
    
   
  }
}
