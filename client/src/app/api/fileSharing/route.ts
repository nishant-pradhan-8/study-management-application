import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { NextResponse } from "next/server";
import { NoteSharing } from "@/types/types";
import { storage } from "@/lib/firebase"
export async function POST(req:Request) {
    try {

        const { downloadUrl, shareList, sourceUserId, note } = await req.json();

        if (!downloadUrl || !shareList || !sourceUserId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const response = await fetch(downloadUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch file from URL");
        }
        const blob = await response.blob();

       let notes:NoteSharing[] = []
        const uploadPromises = shareList.map(async (receiver:string) => {
            const newRef = ref(storage, `Students/${receiver}/sharedFiles/${note.noteName}`);
            const metadata = {
                customMetadata: { sourceUserId },
            };
            await uploadBytes(newRef, blob, metadata);
             const downloadUrl = await getDownloadURL(newRef);
             const noteObject = {
                noteName: note.noteName,
                contentType: note.contentType,
                downloadUrl,
                sharedBy: sourceUserId,
                receivedBy: receiver
              }; 
            notes.push(noteObject);
        });

        await Promise.all(uploadPromises);  
        return NextResponse.json({ message: "File shared successfully", data:notes }, { status: 201 });

    } catch (e) {
        if (e instanceof Error) return NextResponse.json({ error: `Failed to share file: ${e.message}` }, { status: 500 });
    }
}
