import Image from "next/image"
export default function RecentFolders(){

    return(
        <div>
        <h1 className='heading-1'>Recent Study Folders</h1>
        <div className='mt-4 flex flex-row justify-start gap-4'>
          <div className='folder-card'>
            <div className='folder-icon-div'>
            <Image src="/images/folder-dark.svg" alt='folder-icon' width={25} height={25} />
            Biology
            </div>
            <Image src="/images/menu.svg" alt='folder-icon' width={20} height={20} />

          </div>
          <div className='folder-card'>
            <div className='folder-icon-div'>
            <Image src="/images/folder-dark.svg" alt='folder-icon' width={25} height={25} />
            Biology
            </div>
            <Image src="/images/menu.svg" alt='folder-icon' width={20} height={20} />

          </div>
          <div className='folder-card'>
            <div className='folder-icon-div'>
            <Image src="/images/folder-dark.svg" alt='folder-icon' width={25} height={25} />
            Biology
            </div>
            <Image src="/images/menu.svg" alt='folder-icon' width={20} height={20} />

          </div>
          <div className='folder-card'>
            <div className='folder-icon-div'>
            <Image src="/images/folder-dark.svg" alt='folder-icon' width={25} height={25} />
            Biology
            </div>
            <Image src="/images/menu.svg" alt='folder-icon' width={20} height={20} />

          </div>
        </div>
      </div>
    )
}