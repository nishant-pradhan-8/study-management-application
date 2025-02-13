import Button from "./components/button"
import FolderList from "./components/folderList"
export default function StudyFolder(){
   
    return(
        <div>
            <div className="flex justify-between">
                <h1 className="heading-1">Study Folders</h1>
                <div className="flex gap-4">
                <Button  action="Create" src="/images/plus.svg" />
                <Button action="Upload" src="/images/upload.svg" />
                </div>
            </div>
           <FolderList />
        </div>   
      
    )
}