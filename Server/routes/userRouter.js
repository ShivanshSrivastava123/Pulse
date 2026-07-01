import express from 'express'
import { checkAuth, login, singUp, updateUser } from '../controllers/userController.js'
import { userAuth } from '../middleware/auth.js'

const userRouter = express.Router()


userRouter.post('/signup' , singUp)
userRouter.post('/login' , login)
userRouter.put('/update' , userAuth, updateUser)
userRouter.get('/check' , userAuth, checkAuth)

export default userRouter