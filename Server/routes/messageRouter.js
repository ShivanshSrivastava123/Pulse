import express from 'express'
import { userAuth } from '../middleware/auth.js'
import { getMessages, getUserData, sendMessage, updateSeenMessage } from '../controllers/messageController.js'

const messageRouter = express.Router()

messageRouter.get('/users' , userAuth , getUserData)
messageRouter.get('/:id' , userAuth , getMessages)
messageRouter.put('/mark/:id' , userAuth , updateSeenMessage)
messageRouter.post('/send/:id' , userAuth , sendMessage)


export default messageRouter