'use client';
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react';
import { useDropzone, DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';
import { Folder, Note, ActiveFile, FileTags, User } from '@/types/types';
import { UploadNotes } from '@/actions/folderAction';
import { UploadList } from '@/types/types';
import { Event } from '@/types/types';
import { Notification } from '@/types/types';
interface ContextType {
  user:User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  activeFolder: string | null;
  setActiveFolder: Dispatch<SetStateAction<string | null>>;
  folderNameEmptyError: boolean;
  setFolderNameEmptyError: Dispatch<SetStateAction<boolean>>;
  folders: Folder[];
  setFolders: Dispatch<SetStateAction<Folder[]>>;
  notes: Note[];
  setNotes: Dispatch<SetStateAction<Note[]>>;
  displayFile: string | null;
  setDisplayFile: Dispatch<SetStateAction<string | null>>;
  fileRejected: boolean;
  setFileRejected: Dispatch<SetStateAction<boolean>>;
  fileSizeExceeded: boolean;
  setFileSizeExceeded: Dispatch<SetStateAction<boolean>>;
  uploadList:UploadList[]
  setUploadList: Dispatch<SetStateAction<UploadList[]>>;
  repeatedFile: File[] | null
  setRepeatedFile: Dispatch<SetStateAction<File[] | null>>;
  holdingFiles: File[] | null
  setHoldingFiles:  Dispatch<SetStateAction<File[] | null>>;
  friends:User[] | null
  setFriends:  Dispatch<SetStateAction<User[] | null>>;
  pendingRequests:User[] | null, 
  setPendingRequests:Dispatch<SetStateAction<User[] | null>>,
  sentRequests:User[] | null,
  setSentRequests: Dispatch<SetStateAction<User[] | null>>,
  shareList: string[]
  setShareList:Dispatch<SetStateAction<string[]>>;
  selectedFileMenu: string | null
  alertDialogOpen: boolean
  setAlertDialogOpen: Dispatch<SetStateAction<boolean>>
  eventAlertDialogOpen: string | null
  joinRoomAlertDialogOpen: boolean,
  setJoinRoomAlertDialogOpen: Dispatch<SetStateAction<boolean>>
  setEventAlertDialogOpen: Dispatch<SetStateAction<string | null>>
  setSelectedFileMenu: Dispatch<SetStateAction<string | null>>;
  fileIcons: Record<string, string>;
  activeFile: ActiveFile | null;
  setActiveFile: Dispatch<SetStateAction<ActiveFile | null>>;
  fileTags: FileTags;
  isUploading:boolean;
  setIsUploading:Dispatch<SetStateAction<boolean>>;
  getRootProps: () => DropzoneRootProps;
  getInputProps: () => DropzoneInputProps;
  open: ()=>void;
  isDragActive: boolean;
  errorDuringUpload:boolean;
  setErrorDuringUpload:Dispatch<SetStateAction<boolean>>;
  fileMenuOpenId:string | null;
  events:Event[],
  eventsChanges:number,
  editingEventId:string | null, 
  notifications:Notification[] | null,
   setNotifications:Dispatch<SetStateAction<Notification[] | null>>,
  setEditingEventId:Dispatch<SetStateAction<string | null>>,
   setEventsChanges:Dispatch<SetStateAction<number>>,
   setEvents:Dispatch<SetStateAction<Event[]>>,
  setFileMenuOpenId:Dispatch<SetStateAction<string | null>>;
  handleContinueUploading:()=>Promise<void>,
  handleCancelDuplicateUpdate:()=>Promise<void>
  openMedia:(constraint:{audio:boolean, video:boolean})=>Promise<MediaStream>,
  ownStream:MediaStream | null,
  setOwnStream:Dispatch<SetStateAction<MediaStream | null>>
  notificationDialogOpen:boolean, 
  setNotificationDialogOpen:Dispatch<SetStateAction<boolean>>


}
const AppContext = createContext<ContextType | undefined>(undefined);

export default function ContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [activeFolder, setActiveFolder] = useState<string | null>(null)
  const [folderNameEmptyError, setFolderNameEmptyError] = useState<boolean>(false);
  const [folders, setFolders] = useState<Folder[]>([
    {
      folderId: '678b4bd9c5eddb5f5edb77e6',
      folderName: 'OSCA',
      folderRoute: 'osca',
    },
  ]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [displayFile, setDisplayFile] = useState<string | null>(null);
  const [fileRejected, setFileRejected] = useState<boolean>(false);
  const [fileSizeExceeded, setFileSizeExceeded] = useState<boolean>(false);
  const [uploadList, setUploadList] = useState<UploadList[]>([]);
  const [repeatedFile, setRepeatedFile] = useState<File[] | null>(null);
  const [holdingFiles, setHoldingFiles] = useState<File[] | null>(null);
  const [friends, setFriends] = useState<User[] |null>(
    [
      {
        _id: "1",
        userName:"abc",
        profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
      },
      {
        _id: "2",
        profilePicture: "https://randomuser.me/api/portraits/women/2.jpg",
        userName:"abc",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
      },
      {
        _id: "3",
        profilePicture: "https://randomuser.me/api/portraits/men/3.jpg",
        userName:"abc",
        firstName: "Michael",
        lastName: "Brown",
        email: "michael.brown@example.com",
      },
      {
        _id: "4",
        profilePicture: "https://randomuser.me/api/portraits/women/4.jpg",
        userName:"abc",
        firstName: "Emily",
        lastName: "Johnson",
        email: "emily.johnson@example.com",
      },
      {
        _id: "5",
        profilePicture: "https://randomuser.me/api/portraits/men/5.jpg",
        userName:"abc",
        firstName: "David",
        lastName: "Wilson",
        email: "david.wilson@example.com",
      },
      {
        _id: "6",
        profilePicture: "https://randomuser.me/api/portraits/women/6.jpg",
        userName:"abc",
        firstName: "Sophia",
        lastName: "Martinez",
        email: "sophia.martinez@example.com",
      },
      {
        _id: "7",
        profilePicture: "https://randomuser.me/api/portraits/men/7.jpg",
        userName:"abc",
        firstName: "Daniel",
        lastName: "Anderson",
        email: "daniel.anderson@example.com",
      },
 
    ]
  )


  const [pendingRequests, setPendingRequests] = useState<User[] |null>(null)
  const [sentRequests, setSentRequests] = useState<User[] |null>(null)
  const [shareList, setShareList] = useState<string[]>([])
  const [selectedFileMenu, setSelectedFileMenu] = useState<string | null>(null)
  const [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false)
  const [eventAlertDialogOpen, setEventAlertDialogOpen] = useState<string | null>(null)
  const [joinRoomAlertDialogOpen,setJoinRoomAlertDialogOpen] = useState<boolean>(false)
  const fileIcons: Record<string, string> = {
    'application/pdf': 'pdf.svg',
    'application/msword': 'word.svg',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docs.svg',
    'application/vnd.ms-powerpoint': 'ppt.svg',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'ppt.svg',
    'application/vnd.ms-excel': 'excel.svg',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel.svg',
    'image/jpeg': 'image.svg',
    'image/png': 'image.svg',
    'image/svg+xml': 'svg.svg',
    'video/mp4': 'mp4.svg',
    'video/x-matroska': 'mkv.svg',
  };

  const fileTags: FileTags = {
    iframe: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    img: ['image/jpeg', 'image/png', 'image/svg+xml'],
    video: ['video/mp4', 'video/x-matroska'],
  };

  const [activeFile, setActiveFile] = useState<ActiveFile | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [errorDuringUpload, setErrorDuringUpload] = useState<boolean>(false)
  const [fileMenuOpenId, setFileMenuOpenId] = useState<string | null>((null))
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsChanges, setEventsChanges] = useState<number>(0)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
 /* const socket:any = useMemo(()=>io("localhost:8000"),[]);*/
 const [notifications, setNotifications] = useState<Notification[] | null>(null)
  const onDrop = async(acceptedFiles: File[]) => {

    UploadNotes(acceptedFiles,repeatedFile,activeFolder,setFileRejected,setNotes,setFileSizeExceeded,user, setUploadList, setIsUploading, setErrorDuringUpload, notes, setRepeatedFile, setHoldingFiles, uploadList)
    
   
  }
  

   const handleContinueUploading = async():Promise<void>=>{
   UploadNotes(holdingFiles,repeatedFile,activeFolder,setFileRejected,setNotes,setFileSizeExceeded,user, setUploadList, setIsUploading, setErrorDuringUpload, notes, setRepeatedFile, setHoldingFiles, uploadList)
   setRepeatedFile(null)
  }

  const handleCancelDuplicateUpdate = async():Promise<void>=>{
      UploadNotes(holdingFiles,null,activeFolder,setFileRejected,setNotes,setFileSizeExceeded,user, setUploadList, setIsUploading, setErrorDuringUpload, notes, setRepeatedFile, setHoldingFiles, uploadList)
      setRepeatedFile(null)
  }

  const openMedia = async(constraint:{audio:boolean, video:boolean}):Promise<MediaStream>=>{
    return await navigator.mediaDevices.getUserMedia(constraint)
  }

 

  const { getRootProps, getInputProps, isDragActive,open } = useDropzone({ onDrop, noClick:true });
  const [ownStream, setOwnStream] = useState<MediaStream | null>(null)
  const [notificationDialogOpen, setNotificationDialogOpen] = useState<boolean>(false)
  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        activeFolder, 
        setActiveFolder,
        folderNameEmptyError,
        setFolderNameEmptyError,
        folders,
        setFolders,
        notes,
        setNotes,
        displayFile,
        setDisplayFile,
        fileRejected,
        setFileRejected,
        fileSizeExceeded,
        setFileSizeExceeded,
        uploadList,
        setUploadList,
        friends,
        setFriends,
        pendingRequests, 
        setPendingRequests,
        sentRequests, setSentRequests,
        shareList, 
        setShareList,
        selectedFileMenu, 
        alertDialogOpen, 
        setAlertDialogOpen,
        eventAlertDialogOpen, setEventAlertDialogOpen,
        joinRoomAlertDialogOpen,setJoinRoomAlertDialogOpen,
        setSelectedFileMenu,
        fileIcons,
        holdingFiles,
        setHoldingFiles,
        activeFile,
        setActiveFile,
        repeatedFile, setRepeatedFile,
        fileTags,
        isUploading, 
        setIsUploading,
        getRootProps,
        getInputProps,
        isDragActive,
        open,
        errorDuringUpload, 
        setErrorDuringUpload,
        fileMenuOpenId, 
        events, setEvents,
        eventsChanges, setEventsChanges,
        editingEventId, setEditingEventId,
        notifications, 
        setNotifications,
        setFileMenuOpenId,
        handleContinueUploading,
        handleCancelDuplicateUpdate,
        openMedia,
        ownStream, setOwnStream,
        notificationDialogOpen, setNotificationDialogOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within a ContextProvider');
  }
  return context;
}
