'use client'
import Image from "next/image"
import React from "react"
import { DocumentViewer } from 'react-documents';
import { useAppContext } from "@/context/context"
import { useEffect } from "react";


export default function FileDisplay(){
    const {activeFile, setActiveFile, fileTags} =useAppContext()
  
    const renderView = ()=>{
      if(activeFile && fileTags.iframe.includes(activeFile?.contentType) ){
        return (
          <DocumentViewer
            url={activeFile.fileUri}
            className="fixed top-0 left-0 h-full w-full z-40 pt-16"
          />
        )
      }else if(activeFile && fileTags.img.includes(activeFile?.contentType)){
        return (
          <img src={activeFile.fileUri} className="fixed top-[50%] left-[50%] max-w-[768px] max-h-[38rem] transform -translate-x-1/2 -translate-y-1/2 z-40 pt-16" />
        )
      }else if(activeFile && fileTags.video.includes(activeFile?.contentType)){
        return (
          <video className="fixed top-[50%] left-[50%] max-w-[768px] transform -translate-x-1/2 -translate-y-1/2 z-40 pt-16" controls>
            <source src={activeFile.fileUri} />
          </video>
        )
    }
  }
    return (
      <>
        {activeFile && (
          <>
            <nav className="flex flex-row justify-between items-center fixed top-0 w-full left-0 p-4 z-50">
              <div className="flex flex-row gap-2">
                <a className="cursor-pointer" onClick={() => setActiveFile(null)}>
                  <Image
                    className="icon-white"
                    alt="cross"
                    src="/images/cross.svg"
                    width={25}
                    height={25}
                  />
                </a>
                <div className="flex flex-row items-center font-medium text-white gap-1">
                  <Image
                    src={`/images/${activeFile.fileIcon}`}
                    alt="image-icon"
                    className="icon-white"
                    width={25}
                    height={25}
                  />
                  {activeFile.fileName}
                </div>
              </div>
              <div>
                <Image
                  alt="download"
                  src="/images/download.svg"
                  className="icon-white"
                  width={25}
                  height={25}
                />
              </div>
            </nav>
            {
              renderView()
            }
          </>
        )}
      </>
    );
    
}
