import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/util.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";


//firstly i will generate the function to sign up a new user
export const singUp = async (req, res) => {
    const {fullName, email, password, bio} = req.body;
    try {
        if(!fullName || !email || !password || !bio) {
            return res.json({success : false, message : "User details missing"})
        }

        const user = await User.findOne({email})

        if(user) {
            //if user exists then i dont have to sign up but to login
            return res.json({success : false, message : "User already exists"})
        }
        
        //encrypt the password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt)
        //it will just run the algo ,generate a random slat and then runs an algo 2^10 times to convert this into a hashed password using this salt and then when i want to compare i will just pass the password and then it will again convert it into the hash and then compare both


        //now i will generate the user ans store in the db
        const newUser = await User.create({
            fullName, email, password:hashedPass, bio
        });

        const token = generateToken(newUser._id)

        res.json({success : true, userData : newUser , token,  message : "User generated successfully !!!"})
    } catch (error) {
        console.log(error);
        res.json({success : false, message : error.message})
    }
}

//make the login functionality
export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});

        if(!user) {
            return res.json({success : false, message : "No such User exists !!!"})
        }

        //now i will have to check whether i have the correct password or not
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect) {
            return res.json({success : false , message : "Password given is incorrect"})
        }

        const token = generateToken(user._id);

        res.json({success : true, userData:user, token, message : "User Login successfully !!!"})
    } catch (error) {
        console.log(error)
        res.json({success : false , message : error.message})
    }
}

export const checkAuth = (req, res) => {
    res.json({success : true, user : req.user})
}

//function to update user profile
export const updateUser = async(req, res) => {
    try {
        const {fullName, bio, profilePic} = req.body;

        const userId = req.user._id; //in the userAuth middleware i was getting this user appended in our req;
        let updatedUser;

        if(!profilePic) {
            //if profile pic is not present then i will just skip the cloudinary process
            updatedUser = await User.findByIdAndUpdate(userId , {fullName, bio} , {new:true})
        }
        else{
            //firstly i will upload the image on cloudinary
            const upload = await cloudinary.uploader.upload(profilePic)

            updatedUser = await User.findByIdAndUpdate(userId, {fullName, bio, profilePic : upload.secure_url}, {new : true})
        }

        res.json({success : true, user : updateUser})
    } catch (error) {
        console.log(error)
        res.json({success:false , message : error.message})
    }
}