
import PageHeadng from "./components/pageHeading"
import NoteList from "./components/noteList";
import FileDisplay from "../../_components/fileDisplay";
import Overlay from "../../_components/overlay";
import DuplicateFile from "./components/duplicateFile";
import ShareFile from "./components/shareFile";
export default async function StudyNotes({params}:{params:Promise<{folder:string}>}){
   
    const folderRoute = (await params).folder
    console.log(folderRoute)
        return(
            <div>
                <PageHeadng folderRoute={folderRoute} />
                <NoteList folderRoute={folderRoute}  />
             
                <DuplicateFile />
              
            </div>
            
          
        )
}