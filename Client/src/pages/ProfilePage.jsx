import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext.jsx'

const ProfilePage = () => {
  const {updateProfile, authUser} = useContext(AuthContext)
    const [image, setImage] = useState(null)
    const navigate = useNavigate()
    const [fullName, setFullName] = useState(authUser.fullName)
    const [bio, setBio] = useState(authUser.bio)

    

    const onSubmitHandler = async(event) => {
        event.preventDefault()
        if(!image) {
          await updateProfile({fullName, bio})
          navigate('/')
          return
        }
        
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = async ()=>{
          const base64Image = reader.result;
          await updateProfile({profilePic: base64Image, fullName, bio});
          navigate('/');
        }
    }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-5 p-10 flex-1">
            <h3 className="text-lg">Profile details</h3>
            <div className='flex gap-3'>
                <img src={image ? URL.createObjectURL(image) : assets.avatar_icon} alt="" className={`w-12 h-12 ${image && 'rounded-full'}`}/>
                <label htmlFor="upload" className='flex items-center gap-3 cursor-pointer'>
                    <input type="file" onChange={(e)=>setImage(e.target.files[0])} accept='.png, .jpg, .jpeg' id='upload' hidden/>
                    <p>Upload ur photo</p>
                </label>
            </div>

            <input className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' type="text" value={fullName} onChange={(e)=>setFullName(e.target.value)} placeholder='Enter ur full name...' />
            <textarea className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500" value={bio} onChange={(e)=>setBio(e.target.value)} placeholder='Enter a small bio' rows={4}></textarea>

            <button className="bg-linear-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer" type='submit'>Submit</button>
        </form> 

        <img src={authUser?.profilePic || assets.logo_icon} className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10`} alt="" />

      </div>
    </div>
  )
}

export default ProfilePage
