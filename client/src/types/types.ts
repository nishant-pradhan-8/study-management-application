export interface navOptions {
  id: number;
  name: string;
  route: string;
  icon: string;
}
export interface Folder {
  _id: string | null;
  folderName: string;
  createdAt: string | null;
}
export interface Note {
  noteName: string;
  _id: string;
  contentType: string;
  fileSize: string;
  fileType: string;
  folderName?: string;
  folderId?:string;
  downloadUrl: string;
}
export interface NoteResponse {
  noteName: string;
  folderId: FormDataEntryValue;
  userId: FormDataEntryValue;
  contentType: string;
  fileSize: string;
  fileType: string;
  downloadUrl: string;
}
export interface Metadata {
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
}
export interface FolderRequestBody {
  user: string | null;
  inputValue: string;
  folders: Folder[];
  folderId: number;
}
export interface FolderRequestBody {
  user: string | null;
  file: File;
  folderName: string;
}
export interface ActiveFile {
  fileIcon: string;
  fileName: string;
  fileUri: string;
  contentType: string;
}
export interface FileTags {
  iframe: string[];
  img: string[];
  video: string[];
}
export interface UploadList {
  fileId: number;
  fileName: string;
  contentType: string;
}

export interface User {
  _id: string;
  profilePicture: string;
  firstName: string;
  lastName: string;
  email: string;
  [key: string]: string;
}

export interface SharedNotes {
  _id: string;
  noteName: string;
  fileType: string;
  fileSize: string;
  contentType: string;
  downloadUrl: string;
  sharedBy: string;
}

export interface NoteSharing {
  _id: string;
  noteName: string;
  fileType: string;
  fileSize: string;
  contentType: string;
  downloadUrl: string;
  sharedBy: string;
  receivedBy: string;
}

export interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  description: string;
}

export interface SocketMember {
  userId: string;
  profilePicture: string;
  firstName: string;
  lastName: string;
  socketId: string;
  isOwner: boolean;
}

export interface Notification {
  _id: string;
  notification: string;
  notificationType: string;
  read: boolean;
  createdAt: string;
}

export interface FolderMenuPosition {
  top: string;
  bottom: string;
  left: string;
  right: string;
}

export interface sharedNotesToDelete {
  _id: string;
  name: string;
}
