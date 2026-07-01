import { createContext } from "react"
import axios from 'axios'
import { useState } from "react"
import { useEffect } from "react"
import toast from "react-hot-toast"
import {io} from 'socket.io-client'


export const AuthContext = createContext();

//it will just append the baseurl to any query made using axios
const backendURL = import.meta.env.VITE_BACKEND_URL
axios.defaults.baseURL = backendURL



export const AuthProvider = ({children}) => {

    const [token , setToken] = useState(localStorage.getItem("token"))
    const [onlineUsers , setOnlineUsers] = useState([])
    const [authUser, setAuthUser] = useState(null)
    const [socket, setSocket] = useState(null)


    const connectSocket = (user) => {
        try {
            if(!user || socket?.connected) return;

            const newSocket = io(backendURL , {
                query : {userId : user._id}
            })

            newSocket.connect()
            setSocket(newSocket)

            //now the socket is active and we have to get all the online users through the getOnlineUsers channel
            //it will wait for the io.emit code to run in the client side and will autmatically update the onlineusers
            newSocket.on("getOnlineUsers" , (userId) => {
                setOnlineUsers(userId)
            })

        } catch (error) {
            toast.error(error.message)
        }
    }



    //it will just run by the useEffect and its role is to assign the setAuthUser and connect Socket if the token is present and valid
    const checkAuth = async() => {
        try {
            const { data } = await axios.get('/api/auth/check')

            if(data.success) {
                setAuthUser(data.user)
                connectSocket(data.user)
            } else {
                logout()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }



    useEffect(()=>{
        if(token) {
            axios.defaults.headers.common["token"] = token
        }
        checkAuth() // it will help to set the user data
    } , [])


    //now we will make a function to login the user but it will also be  used to singup as we are definign it as the state
    const login = async(state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}` , credentials)
            console.log(data)
            if(data.success) {
                setAuthUser(data.userData)
                connectSocket(data.userData)
                axios.defaults.headers.common["token"] = data.token
                //now set store this token in local storage and the state variables
                setToken(data.token)
                localStorage.setItem("token" , data.token)
                toast.success("User loggedin successfully !!!")
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //now i will logout the user ----> i am just loggin him out from the machine ie the token will be lost but the credentials in the db will be still there
    const logout = async() => {
        try {
            setToken(null)
            localStorage.removeItem("token")
            setAuthUser(null)
            setOnlineUsers([])
            axios.defaults.headers.common["token"] = null
            socket?.disconnect()
            toast.success("User logged out successfully !!!")
        } catch (error) {
            toast.error(error.message)
        }
    }

    //now i have to update the user details
    const updateProfile = async(body) => {
        try {
            const { data } = await axios.put("/api/auth/update" , body)

            if(data.success) {
                setAuthUser(data.user)
                toast.success("User updated successfully !!!")
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }

  return (
    <AuthContext.Provider value = {value}>
        {children}
    </AuthContext.Provider>
  )
}

