import Image from "next/image";
import RecentFolders from "./_components/folders/faf";
import RecentNotes from "./_components/notes/RecentNotes";

export default function Home() {

  return (    
    <div className="app">
        <div>
          <div className='flex justify-center'>
            <h1 className='title text-bg'>Welcome To StudyBuddy</h1>
            </div>
            <div className=''>
            <RecentFolders />
            <RecentNotes />
            </div>
          </div>
        </div>
  )
}
