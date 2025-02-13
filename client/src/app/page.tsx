import Image from "next/image";
import RecentFolders from "./_components/RecentFolders";
import RecentNotes from './_components/RecentNotes';
export default function Home() {
  return (    
    <div className="app">
        <div>
          <div className='flex justify-center'>
            <h1 className='title'>Welcome To StudyBuddy</h1>
            </div>
            <div className=''>
            <RecentFolders />
            <RecentNotes />
            </div>
          </div>
        </div>
  )
}
