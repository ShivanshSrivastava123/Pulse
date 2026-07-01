import cloudinary from "../lib/cloudinary.js"
import { Message } from "../models/Message.js"
import User from "../models/User.js"
import { io, socketUsers } from "../server.js"

//i want to get all the users except the current logged in user and want to have the unseen messages
export const getUserData = async(req, res) => {
    try {
        const userId = req.user._id
        const users = await User.find({_id : {$ne : userId}}).select("-password")

        //now i have to get all the unseen messages data and we will store in an object
        let unseenMessages = {}
        let promises = users.map(async(user) => {
            const userUnseenMessages = await Message.find({senderId : user._id , receiverId : userId, seen : false})

            if(userUnseenMessages.length > 0) unseenMessages[user._id] = userUnseenMessages.length
        })

        await Promise.all(promises)

        res.json({success : true, users, unseenMessages})
    } catch (error) {
        console.log(error)
        res.json({success : false, message : error.message})
    }
}

//now get all the messages for the selected user
export const getMessages = async(req, res) => {
    try {
        const {id : selectedUserId} = req.params
        //id will go into selectedUserId
        const userId = req.user._id

        const messages = await Message.find({
            $or : [
                {senderId : userId , receiverId : selectedUserId},
                {senderId : selectedUserId , receiverId : userId}
            ]
        })

        await Message.updateMany({senderId : selectedUserId , receiverId : userId} , {seen : true})
        res.json({success : true, messages})
    } catch (error) {
        console.log(error)
        res.json({success : false, message : error.message})
    }
}

//now there is a function to mark a given single message updated
export const updateSeenMessage = async(req, res) => {
    try {
        const { id } = req.params
        await Message.findByIdAndUpdate(id, {seen : true})
        res.json({success : true})
    } catch (error) {
        console.log(error)
        res.json({success : false, message : error.message})
    }
}

//now i have to write a controller function to send the message
export const sendMessage = async(req, res) => {
    try {
        const {text, image} = req.body
        const receiverId = req.params.id
        const userId = req.user._id
        
        let imageURL
        if(image) {
            //if the image exists then i will have to upload it onto the cloudinary and then use it
            const upload = await cloudinary.uploader.upload(image)
            imageURL = upload.secure_url
        }

        const newMessage = await Message.create({
            senderId : userId,
            receiverId,
            seen : false,
            text,
            image : imageURL
        })

        const receiverSocketId = socketUsers[receiverId];
        if (receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.json({success : true, newMessage})
    } catch (error) {
        console.log(error)
        res.json({success : false, message : error.message})
    }
}