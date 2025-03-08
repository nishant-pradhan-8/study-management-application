import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  StorageReference,
  StorageError,
} from "firebase/storage";
import { NextResponse } from "next/server";
import { NoteSharing, SharedNotes } from "@/types/types";
import { storage } from "@/lib/firebase";
import { sharedNotesToDelete } from "@/types/types";
/*
export async function POST(req:Request) {
    try {
        const {notes} = await req.json();
     
         if (!notes) {
            return NextResponse.json({status:"success", message: "Missing required fields" , data:null}, { status: 400 });
        }
       
        const shareList = notes.shareList
        const sourceUserId = notes.sourceUserId
        const note = notes.note
    
        const response = await fetch(note.downloadUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch file from URL");
        }
        const blob = await response.blob();

       let notesToShare:NoteSharing[] = []
        const uploadPromises = shareList.map(async (receiver:string) => {
            const newRef = ref(storage, `Students/${receiver}/sharedFiles/${note.noteName}`);
            const metadata = {
                customMetadata: { sourceUserId },
            };
            await uploadBytes(newRef, blob, metadata);
             const downloadUrl = await getDownloadURL(newRef);
             const noteObject = {
                noteName: note.noteName,
                fileSize: note.fileSize,
                fileType: note.fileType,
                contentType: note.contentType,
                downloadUrl:downloadUrl,
                sharedBy: sourceUserId,
                receivedBy: receiver
              }; 
            notesToShare.push(noteObject);
        });

        await Promise.all(uploadPromises);  
        return NextResponse.json({status:'success', message: "File shared successfully", data:notesToShare }, { status: 201 });

    } catch (e) {
        if (e instanceof Error) return NextResponse.json({status:"error", message: `Failed to share file: ${e.message}`, data:null }, { status: 500 });
    }
}
*/
export async function POST(req: Request) {
  try {
    const { sharingInfo } = await req.json();

    if (!sharingInfo || sharingInfo.length === 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing required fields",
          data: null,
        },
        { status: 400 }
      );
    }

    const { shareList, sourceUserId, notes } = sharingInfo;

    let notesToShare: NoteSharing[] = [];

    for (let note of notes) {
      const response = await fetch(note.downloadUrl);
      const blob = await response.blob();

      const uploadPromises = shareList.map(async (receiver: string) => {
        let newRef = ref(
          storage,
          `Students/${receiver}/sharedFiles/${note.noteName}`
        );
        const metadata = { customMetadata: { sourceUserId } };

        let counter = 0;
        let uniqueName = false;
        while (!uniqueName) {
          try {
            await getDownloadURL(newRef);
            counter++;
            newRef = ref(
              storage,
              `Students/${receiver}/sharedFiles/${note.noteName}(${counter})`
            );
          } catch (e) {
            if (e instanceof StorageError) {
              uniqueName = true;
              break;
            } else {
              console.log("Error Chcecking Dupliacte Names");
              break;
            }
          }
        }

        await uploadBytes(newRef, blob, metadata);
        const downloadUrl = await getDownloadURL(newRef);

        notesToShare.push({
          _id: note._id,
          noteName:
            counter === 0 ? note.noteName : `${note.noteName}(${counter})`,
          fileSize: note.fileSize,
          fileType: note.fileType,
          contentType: note.contentType,
          downloadUrl,
          sharedBy: sourceUserId,
          receivedBy: receiver,
        });
      });

      await Promise.all(uploadPromises);
    }

    return NextResponse.json(
      {
        status: "success",
        message: "File shared successfully",
        data: notesToShare,
      },
      { status: 201 }
    );
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(
        {
          status: "error",
          message: `Failed to share file: ${e.message}`,
          data: null,
        },
        { status: 500 }
      );
    }
  }
}

/*
export async function PATCH(req:Request){
    try{
        const {fileName,folderId, userId, downloadUrl, fileType} = await req.json()
        const metaData = {
            contentType: fileType,
          };
        const sharedNoteRef = ref(storage, `Students/${userId}/sharedFiles/${fileName}`)
        const response = await fetch(downloadUrl);
        const blob = await response.blob();
     
        const noteRef = ref(storage, `Students/${userId}/${folderId}/${fileName}`)
        await uploadBytes(noteRef, blob, metaData);
        const newDownloadUrl = await getDownloadURL(noteRef);
        await deleteObject(sharedNoteRef)
        return NextResponse.json({status:"success", message: `File Transferred to the folder successfully`, data:newDownloadUrl }, { status: 201 })
    }catch(e:any){
        return NextResponse.json({status:"error", message: `Failed to transfer file :${e.message}`, data:null }, { status: 500 })
    }
    
    
}*/

export async function PATCH(req: Request) {
  try {
    const {
      folderId,
      userId,
      notes,
    }: { folderId: string; userId: string; notes: SharedNotes[] } =
      await req.json();

    const resObj: {
      _id: string;
      downloadUrl: string;
    }[] = [];

    const failedTransfers:string[] = []

    for (let note of notes) {
        try{
            const sharedNoteRef = ref(
                storage,
                `Students/${userId}/sharedFiles/${note.noteName}`
              );
        
              const metaData = {
                contentType: note.contentType,
              };

              const response = await fetch(note.downloadUrl);
        
              const blob = await response.blob();
        
              const noteRef = ref(
                storage,
                `Students/${userId}/${folderId}/${note.noteName}`
              );
        
              await uploadBytes(noteRef, blob, metaData);
              
              const newDownloadUrl = await getDownloadURL(noteRef);
        
              await deleteObject(sharedNoteRef);
        
              resObj.push({ _id: note._id, downloadUrl: newDownloadUrl });
        }catch(e){
            failedTransfers.push(note._id)
        }
    }
    if(failedTransfers.length>0){
        return NextResponse.json(
        {
          status: "success",
          message: `Some Notes Failed to transfer: ${failedTransfers.join(",")}`,
          data: resObj,
        },
        { status: 200
        })
    }

    return NextResponse.json(
      {
        status: "success",
        message: `File Transferred to the folder successfully`,
        data: resObj,
      },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        status: "error",
        message: `Failed to transfer file :${e.message}`,
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { sharedNotesToDelete, userId } = await req.json();

    if (!userId || !sharedNotesToDelete || sharedNotesToDelete.length === 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "UserId and Note Names are required.",
          data: null,
        },
        { status: 400 }
      );
    }

    const noteNames: string[] = sharedNotesToDelete.map(
      (note: sharedNotesToDelete) => note.name
    );
    console.log(noteNames);
    const failedOperations: string[] = [];
    for (let note of noteNames) {
      try {
        const storageRef: StorageReference = ref(
          storage,
          `Students/${userId}/sharedFiles/${note}`
        );
        await deleteObject(storageRef);
      } catch (e) {
        failedOperations.push(note);
      }
    }
    if (failedOperations.length > 0) {
      return NextResponse.json(
        {
          status: "success",
          message: `Some notes failed to delete: ${failedOperations.join(
            ", "
          )}`,
          data: null,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Shared Notes deleted successfully in Firebase",
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
