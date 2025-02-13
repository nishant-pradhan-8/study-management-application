'use client';

import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/context/context';
import { Input } from 'postcss';
import { User } from '@/types/types';
import { updateProfile } from '@/actions/folderAction';
import MyFacebookLoader from './profileLoader';
export default function ProfileDetails() {
  
  const {user, setUser} = useAppContext()
  const [update, setUpdate] = useState<User | null>(null)
  const [changedFields, setChangedFields] = useState<Partial<User>>({})
  const [profilePictureChanged, setProfilePictureChanged] = useState<File | string | null>(null)
  const [tempUrl, setTempUrl] = useState<string>()
  const [saving, setSaving] = useState<boolean>(false)
  const [imageSizeExceeded, setImageSizeExceeded] = useState<boolean>(false)
  const handleUpdate = (field:keyof User, value:string )=>{
    setUpdate((val)=>val?{...val,[field]:value}:null)
    updateChangedFieldsState(field,value)
  
  }

  const updateChangedFieldsState = (field:keyof User, value:string|File)=>{
    setChangedFields((val)=>{
      if(user && user[field]===value){
        const {[field]:_,...rest} = val
        return rest
      }
      return {...val,[field]:value}
    })
  }

  useEffect(()=>{
    console.log('went')
    setUpdate(user)
  },[user])
 
  const handleUpdateProfileDetails = async(e:React.FormEvent)=>{
    if(!user){
      return console.log("No user found")
    }
    e.preventDefault()
    setSaving(true)
    let updates = changedFields
   
  
    if(profilePictureChanged){
      if(profilePictureChanged==="Delete"){
        const res = await fetch("http://localhost:3000/api/user",{
          method:"DELETE",
          headers:{
            Accept:"application/json",
            ContentType: "application/json"
          },
          body:JSON.stringify({downloadUrl: user.profilePicture})
        })
        const data = await res.json()
        if(data.status==="success"){
           updates = {...updates,profilePicture:""}
        }else{
          setSaving(false)
          return
        }
      }else{
        const formData = new FormData();
        console.log(profilePictureChanged)
        formData.append("profilePicture", profilePictureChanged)
        formData.append("userId", user._id)
        const res = await fetch("http://localhost:3000/api/user",{
          method:"POST",
          headers:{
            Accept:"application/json",
  
          },
          body:formData
        })
  
        const data = await res.json()
        if(data.data){
          updates = {...updates,profilePicture:data.data}
        }else{
          setSaving(false)
          return
        }
      
      }
    
    }
     const res = await updateProfile(updates)
     if(res.status==="error" || res.error){
      return console.log("Unexpected Error Occured")
     }
     console.log("Profile Updated Sucessfully")
     console.log(res.data)
     setUser((val) => ({
      ...val,
      ...res.data
    } as User));
    setProfilePictureChanged(null)
    setTempUrl(undefined)
     setSaving(false)
     setChangedFields({})
  }

   const handleProfilePictureUpdate = (file:File | undefined)=>{
    if(!file){
      return
    }
    if(file){
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>)=>{
        const img = new Image();
        console.log('went')
       img.onload = function() {
        
        if (img.width <= 600 && img.height <= 600) {
          console.log('Image is under 600x600.');
          setTempUrl(e.target?.result as string)
          setImageSizeExceeded(false)
         setProfilePictureChanged(file)
        } else {
          setImageSizeExceeded(true)
          console.log('Image exceeds 600x600.');
        }
      };
      
      img.src = e.target?.result as string; 
      
      }
      reader.readAsDataURL(file)
    }
   }
   const handleProfilePictureDelete = async()=>{
      setUpdate((val)=>({...val,profilePicture:""}) as User)
      setProfilePictureChanged("Delete")
   }

  

  return (
    update ?
     <div className="">
        <form onSubmit={ handleUpdateProfileDetails}>
        <div className="flex items-center space-x-4 mb-4">
       <img src={profilePictureChanged && profilePictureChanged!=="Delete"?tempUrl:update.profilePicture==="" || profilePictureChanged==="Delete"?"/images/profile.svg":update.profilePicture} className='rounded-full'width={100} height={100} alt='profile' />
        
        <div className="space-x-4">
          <label htmlFor='profilePicture' className="bg-[#7695FF] text-white px-4 py-3 rounded-xl cursor-pointer">Change picture
          <input onChange={(e)=>handleProfilePictureUpdate(e.target.files?.[0])} className='hidden' accept="image/*"  type='file' id='profilePicture' />
          </label>
       {
        update.profilePicture!=="" &&<button onClick={(e)=>handleProfilePictureDelete()} type='button' className="bg-red-500 text-white px-4 py-2 rounded-xl">Delete picture</button>
       }
         
        </div>
        <p  className={`text-red-400 ${imageSizeExceeded?"block":'hidden'} font-semibold`}>*File Size must be of 600x600</p>
      </div>

    
      
      <label htmlFor='firstName' className="block text-gray-700">First Name</label>
      <input
        type="text"
        id='firstName'
        value={update.firstName}
        onChange={(e)=>handleUpdate('firstName',e.target.value)}
        className="w-full p-2 border rounded-lg mb-4"
      />

<label  htmlFor='lastName'className="block text-gray-700">Last name</label>
      <input
       type="text"
        id='lastName'
        value={update.lastName}
        onChange={(e)=>handleUpdate('lastName',e.target.value)}
        className="w-full p-2 border rounded-lg mb-4"
      />

      <label htmlFor='email' className="block text-gray-700">Email <span className='text-[0.8rem] text-red-400
      '> *Email cannot be Changed!</span></label>
      <input  onChange={(e)=>handleUpdate('email',e.target.value)}   value={update.email} type="email" id='email'   className="w-full p-2 border rounded-lg mb-4 bg-gray-200 outline-none" readOnly/>
        
      
      <button 
  type='submit' disabled ={!profilePictureChanged}
  className={`w-full flex items-center justify-center ${Object.keys(changedFields).length === 0 && !profilePictureChanged ? "bg-gray-400 h-[40px] cursor-not-allowed" : "bg-lightBlue"} ${saving?'cursor-not-allowed':''} text-white px-4 py-2 rounded-xl`}
>
  {
    saving?<div className='loader'></div>:"Save changes"
  }
  
</button>

        </form>
    
    </div> : <MyFacebookLoader />
  );
}

/*<div className='w-full h-full flex flex-col items-center justify-center'>
            <img src="/images/error.jpg" width={300} height={300} alt="Error" />
            <p className='font-semibold text-[1.5rem]'>Unexpected Error Occured. {":("}</p>
           </div>*/