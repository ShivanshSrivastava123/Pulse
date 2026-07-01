import jwt from "jsonwebtoken"


//here i will generate a function to generate a token to authorize the user
export const generateToken = (userId) => {
    //so this will generate a token with the userId and then sign it with the secret key and then when i will verigy it i will use this same key to verify
    const token = jwt.sign({userId}, process.env.SECRET_JWT)
    return token
}