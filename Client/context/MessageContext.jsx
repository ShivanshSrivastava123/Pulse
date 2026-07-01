import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";



export const ChatContext = createContext()


export const ChatProvider = ({children}) => {

    const [selectedUser, setSelectedUser] = useState(null)
    const [unseenMessages, setUnseenMessages] = useState({})
    const [users, setUsers] = useState([]) //the users that i have to represent in the sidebar
    const [messages, setMessages] = useState([])

    const {axios, socket} = useContext(AuthContext)

    //function to get all the users for the sidebar
    const getUsers = async() => {
        //axios will already contain the token due to the authcontext as on page refreshing it is getting it
        try {
            const {data} = await axios.get('/api/messages/users')

            if(data.success) {
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
            else{
                console.log(error)
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast(error.message)
        }
    }

    //controller to fetch the messages with a certain user
    const getMessages = async(userId) => {
        try {
            if(!userId) return
            const { data } = await axios.get(`/api/messages/${userId}`)
            if(data.success) {
                setMessages(data.messages)
            }
            else {
                console.log("Error occurred in fetcing the messages")
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // now i have to send the messages
    const sendMessages = async(body) => {
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, body)

            if(data.success) {
                //just i have to update the messages
                setMessages((prevMessages) => [...prevMessages, data.newMessage])
                toast.success("Message sent successfully !!!")
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const subscribeToMessages = async() => {
        if(!socket) return


        socket.on("newMessage" , async (newMessage)=>{
            if(selectedUser && selectedUser._id === newMessage.senderId) {
                newMessage.seen = true
                setMessages((prevMessages) => [...prevMessages, newMessage])
                await axios.put(`/api/messages/mark/${newMessage._id}`)
            }
            else {
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages , 
                    [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }
    
    //importance is that in the prev function it cant change the selectedUser unless i off it and reasign the values means it will have stale values
    //also if i will not turn off the socket then 3-4-5 diff sockets listeners will be turned so i will be getting the same message that no of times
    const unsubscribeFromMessages = () => {
        if(socket) socket.off("newMessage")
    }

    useEffect(()=>{
        subscribeToMessages()
        return () => unsubscribeFromMessages() //this return is imp as i have to run it when i have to run the useeffect again 
        //if not used return then it should have run instantly and not have kept the socket on
    } , [socket, selectedUser])

    const value = {
        messages, users, selectedUser, getUsers, getMessages, sendMessages, setSelectedUser, unseenMessages, setUnseenMessages
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}