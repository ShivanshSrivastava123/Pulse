import jwt from "jsonwebtoken"
import User from "../models/User.js"

//it will just protect the route by comparing the tokens
export const userAuth = async(req, res, next) => {
    try {
        const token = req.headers.token

        //then i will decode this token and compare it with the data in the dB
        const decodedToken = jwt.verify(token, process.env.SECRET_JWT)

        const user = await User.findById(decodedToken.userId).select("-password") //this will just remove the password from user 

        if(!user) {
            return res.send({success : false, message : "No such user exists !!!!"})
        }

        req.user = user;
        next()
        
    } catch (error) {
        console.log(error)
        res.send({success : false, message : error.message})
    }
}