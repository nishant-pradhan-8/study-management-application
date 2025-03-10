
import RecentFolders from "./_components/folders/faf";
import RecentNotes from "./_components/notes/RecentNotes";

export default function Home() {
  return (
    <div className="app">
      <div>
        <div className="flex justify-center">
          <h1 className="title text-bg mb-5 max-sm:text-[24px] max-sm:text-center">
            Welcome To StudyBuddy
          </h1>
        </div>
        <div className="">
          <RecentFolders />
          <RecentNotes />
        </div>
      </div>
    </div>
  );
}
