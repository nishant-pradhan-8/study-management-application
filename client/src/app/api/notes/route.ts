import { NextResponse } from "next/server";
import { getDownloadURL, ref, StorageReference } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { uploadBytes } from "firebase/storage";
import { NoteResponse } from "@/types/types";
import { deleteObject } from "firebase/storage";
import { formatFileSize } from "@/utils/utils";
import { FileSelection } from "@/hooks/useMultipleSelection";
export async function POST(request: Request) {
  try {
    const formData: FormData = await request.formData();
    const files: FormDataEntryValue[] = formData.getAll("file");
    const userId: FormDataEntryValue | null = formData.get("userId");
    const folderId: FormDataEntryValue | null = formData.get("folderId");

    if (!userId || !folderId) {
      return NextResponse.json(
        {
          status: "error",
          error: "Missing required userId or folderId",
          data: null,
        },
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
            `Students/${userId}/${folderId}/${file.name.replace(
              /\.[^/.]+$/,
              ""
            )}`
          );

          await uploadBytes(storageRef, blob, metaData);

          const downloadUrl = await getDownloadURL(storageRef);

          const noteObject: NoteResponse = {
            noteName: file.name.replace(/\.[^/.]+$/, ""),
            folderId,
            userId,
            contentType: file.type,
            fileSize: formatFileSize(file.size),
            fileType: file.name?.split(".")?.pop()?.toLowerCase() ?? "",
            downloadUrl,
          };

          notes.push(noteObject);
        } catch (error) {
         console.log(error instanceof Error && error)
          return NextResponse.json(
            {
              status: "error",
              error: `Failed to upload file "${file.name}". Please try again.`,
              data: null,
            },
            { status: 500 }
          );
        }
      }
    }
    return NextResponse.json(
      {
        status: "success",
        message: "File Uploaded to Firebase Sucessfullly",
        data: notes,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("Unhandled error in POST handler:", errorMessage);

    return new Response(
      JSON.stringify({ status: "error", error: errorMessage, data: null }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
export async function DELETE(request: Request) {
  try {
    const req = await request.json();

    const {
      userId,
      notesToDelete,
    }: { userId: string; notesToDelete: FileSelection[] } = req;

    if (
      !userId ||
      !Array.isArray(notesToDelete) ||
      notesToDelete.length === 0
    ) {
      return NextResponse.json(
        { status: "error", message: "Invalid userId or note list", data: null },
        { status: 400 }
      );
    }

    const failedNotes: string[] = [];

    await Promise.all(
      notesToDelete.map(async (note) => {
        try {
          if (!note.folderId || !note.fileName) {
            throw new Error("Invalid note details");
          }
          const storageRef: StorageReference = ref(
            storage,
            `Students/${userId}/${note.folderId}/${note.fileName}`
          );
          await deleteObject(storageRef);
        } catch (error) {
          console.error(
            `Error deleting file ${note.fileId || "unknown"}:`,
            error
          );
          if (note.fileId) failedNotes.push(note.fileId);
        }
      })
    );

    if (failedNotes.length > 0) {
      return NextResponse.json(
        {
          status: "partial_success",
          message: `Some notes failed to delete: ${failedNotes.join(", ")}`,
          data: null,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Files deleted successfully in Firebase",
        data: null,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error deleting the file:", e);
    return NextResponse.json(
      { status: "error", message: "Internal Server Error", data: null },
      { status: 500 }
    );
  }
}