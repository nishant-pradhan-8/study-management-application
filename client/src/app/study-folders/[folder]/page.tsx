import PageHeadng from "./components/pageHeading";
import NoteList from "./components/noteList";
import DuplicateFile from "./components/duplicateFile";

export default async function StudyNotes({
  params,
}: {
  params: Promise<{ folder: string }>;
}) {
  const folderId = (await params).folder;
  return (
    <div>
      <PageHeadng folderId={folderId} />
      <NoteList folderId={folderId} />

      <DuplicateFile />
    </div>
  );
}
