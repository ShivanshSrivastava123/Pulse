import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import {AuthContext} from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("SignUp");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false)
  const navigate = useNavigate();


  const { login } = useContext(AuthContext)

  const onSubmitHandler = (event) => {
      event.preventDefault();

      if(currentState === "SignUp" && !isSubmitted) {
        setIsSubmitted(true)
        return
      }

      login(currentState === "SignUp" ? "signup" : "login" , {fullName, email, password, bio})

  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* left */}
      <img src={assets.logo} alt="" className='w-[min(30vw,250px)]'/>

      {/* right section containing the form */}
      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currentState}
          {isSubmitted && <img onClick={()=>setIsSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer'/>}
        </h2>

        {/* i have to print the username input only for sign up */}
        {currentState == "SignUp" && !isSubmitted && (
          <input type="text" value={fullName} onChange={(e)=>setFullName(e.target.value)} placeholder='Enter the Full Name...' className='p-2 border border-gray-500 rounded-md focus:outline-none' required/>
        )}

        {!isSubmitted && (
          <>
          <input type="text" value={email} onChange={(e)=> setEmail(e.target.value)} placeholder='Enter the email...' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' required/>
          <input type="text" value={password} onChange={(e)=> setPassword(e.target.value)} placeholder='Enter the password...' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' required/>
          </>
        )}

        {/* display the bio option only if the user is signing up */}
        {currentState === "SignUp" && isSubmitted && (
          <textarea value={bio} onChange={(e)=> setBio(e.target.value)} placeholder='Enter a small bio' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'></textarea>
        )}

        <button type='submit' className='py-3 bg-linear-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
          {currentState === "SignUp" ? "Create Account" : "LogIn"}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" required/>
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className='flex flex-col gap-2'>
          {/* you can print the logic for the login and signup transition */}
          {
            currentState === "SignUp" ? (
              <p className='text-sm text-gray-600'>Already have an account <span onClick={()=>{setIsSubmitted(false); setCurrentState("Login");}} className='font-medium text-violet-500 cursor-pointer'>Login Here</span></p>
            ) : (
              <p className='text-sm text-gray-600'>Create an account <span onClick={()=>{setIsSubmitted(false); setCurrentState("SignUp")}} className='font-medium text-violet-500 cursor-pointer'>Click here</span></p>
            )
          }
        </div>
      </form>
    </div>
  )
}

export default LoginPage
