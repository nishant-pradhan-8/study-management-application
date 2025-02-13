import Image from "next/image"
export default function RecentNotes(){
    return (
        <div>
        <h1 className='heading-1 mt-4'>Recent Study Notes</h1>
     
        <div className='mt-4 flex flex-col'>
           <a className="flex flex-row items-center font-semibold border-t-[1px] border-b-[1px] border-gray-400 py-2 w-full">
              <Image src="/images/image.svg" alt='image-icon' width={25} height={25} className="mr-2" />
              Chapter 1 | Biology
           </a>
           <a className="flex flex-row items-center font-semibold border-b-[1px] border-gray-400 py-2 w-full">
              <Image src="/images/image.svg" alt='image-icon' width={25} height={25} className="mr-2" />
              Chapter 1 | Biology
           </a>
           
        </div>
      </div>
    )
}