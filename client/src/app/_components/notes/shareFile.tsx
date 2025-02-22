'use client'
import React, { useEffect, useState } from 'react';
import { useUserContext } from '@/context/userContext';
import { Note } from '@/types/types';
import { shareNotes } from '@/actions/SharedNotes/sharedNoteAction';
import LoadingSkeleton from '@/app/friends/components/loadingSkeleton';
import Image from 'next/image';
import { getFriendList } from '@/actions/users/usersAction';
import { User } from '@/types/types';
import { useNoteContext } from '@/context/notesContext';
import useCloseDialog from '@/hooks/useAlertDialog';
function ShareFile({ note }: { note: Note }) {
  const { shareList, setShareList, friends,  setFriends, user, setAlertDialogOpen } = useUserContext();
  const{selectedFileMenu, setSelectedFileMenu, setFileMenuOpenId} = useNoteContext()
  const [isSharing, setIsSharing] = useState(false)
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [searchKeyword, setSearchKeyword] = useState<string>("")
  const handleFriendsSelection = (friendId: string) => {
    if (shareList?.includes(friendId)) {
     
      const newShareList = shareList.filter(friend => friend !== friendId);
  
      setShareList(newShareList);
    } else {

      setShareList(prev => [...prev, friendId]);
    }
  };
  
  useEffect(()=>{
    console.log("friends",friends)
      if(!friends){
        const fetchFriends = async()=>{
          const friends = await getFriendList()
          if(friends.data){
            setFriends(friends)
            console.log(friends)
          }
        
        }
        
        fetchFriends()
      }
      
    },[friends])

  const handleShareNote = async()=>{
    await shareNotes(shareList, note, user)
  }

  const handleAlertDialogClose = ()=>{
    setFileMenuOpenId(null)
    setSelectedFileMenu(null)
    setAlertDialogOpen(false)
  }
  const handleFriendsSearch = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const searchKeyword = e.target.value.trim().toLowerCase().replace(/[^\w\s]/gi, '');
    const results:User[] = friends?.filter((friend) =>
        friend.firstName.toLowerCase().includes(searchKeyword) ||
        friend.lastName.toLowerCase().includes(searchKeyword)
      ) ?? [];

    setSearchResults(results)
    setSearchKeyword(searchKeyword)

  }
  return (
    <div className={`bg-gray-800 p-4 rounded-xl fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[30rem] z-50`}>
      <div className="flex flex-col gap-2 mb-4 pb-4 border-b-[1px] border-gray-300">
        <div className="flex flex-row justify-between">
          <h2 className="text-white text-[1.5rem] font-semibold mr-2">Share this File</h2>
          <a className='cursor-pointer' onClick={() =>handleAlertDialogClose() }>
            <Image alt="close" src="/images/cross-white.svg" width={25} height={25} />
          </a>
        </div>

        <input
          type="text"
          placeholder="Search friends..."
          className="bg-gray-700 text-white px-3 py-2 rounded-xl flex-grow outline-none"
          onChange={(e)=>handleFriendsSearch(e)}
        />
      </div>

      <div className='pb-4'>
        <h3 className='text-white text-[1rem] font-semibold mr-2'>Your Study Buddies</h3>
        <div className='overflow-y-scroll h-[14rem]'>
          <form>
          {friends ? (
  searchResults.length > 0 ? (
    searchResults.map((friend) => (
      <label
        key={friend._id}
        htmlFor={friend._id}
        className="w-full friends-share-checkbox p-2 rounded-xl peer-checked:border-2 flex flex-row justify-between items-center cursor-pointer"
      >
        <div className="mt-4 flex flex-row items-center gap-2">
          <div className="w-10 h-10 bg-black rounded-full"></div>
          <div className="text-white">
            <p className="font-semibold">
              {friend.firstName} {friend.lastName}
            </p>
            <p className="font-normal">{friend.email}</p>
          </div>
        </div>
        <input
          onChange={() => handleFriendsSelection(friend._id)}
          id={friend._id}
          type="checkbox"
          checked={shareList?.includes(friend._id)}
        />
      </label>
    ))
  ) : searchResults.length === 0 && searchKeyword ? ( // Show message only if searching
    <p className="text-white mt-4 text-center">No matching friends found</p>
  ) : friends.length > 0 ? (
    friends.map((friend) => (
      <label
        key={friend._id}
        htmlFor={friend._id}
        className="w-full friends-share-checkbox p-2 rounded-xl peer-checked:border-2 flex flex-row justify-between items-center cursor-pointer"
      >
        <div className="mt-4 flex flex-row items-center gap-2">
          <div className="w-10 h-10 bg-black rounded-full"></div>
          <div className="text-white">
            <p className="font-semibold">
              {friend.firstName} {friend.lastName}
            </p>
            <p className="font-normal">{friend.email}</p>
          </div>
        </div>
        <input
          onChange={() => handleFriendsSelection(friend._id)}
          id={friend._id}
          type="checkbox"
          checked={shareList?.includes(friend._id)}
        />
      </label>
    ))
  ) : (
    <p className="text-white mt-4 text-center">No Friends To Show</p>
  )
) : (
  <LoadingSkeleton />
)}

          </form>
        </div>
      </div>

      <div className='pt-4 border-t-[1px] border-gray-300'>
        <button
          onClick={() => handleShareNote()}
          className='primary-btn w-full items-center justify-center h-10'
          disabled={isSharing}
        >
        {
          isSharing?  <div className="loader"></div>:"Share"
        }
        </button>
      </div>
    </div>
  );
}

export default ShareFile;
