import express from 'express'
import { connectToDatabase } from '../db.js'
import { hashPassword, comparePasswords, generateJWT, verifyJWT, authMiddleware} from '../middleware/auth.js';
import {body, validationResult} from 'express-validator'

const router = express.Router()

const db = await connectToDatabase();
const userCollection = db.collection('users')

router.post('/register', async (req,res)=>{
    const {username, email, password } = req.body
    
    const hashedPassword = await hashPassword(password, 10)

    if (!hashedPassword){
        return res.status(500).json("Greska prilikom hashiranja")
    }
   
    const newUser = {
        username,
        email,
        password: hashedPassword,
        role: "user"
    }

    try{
    let result = userCollection.insertOne(newUser)
    res.status(201).json({Result: result, user: newUser.username})
    }
    catch(e){
        console.error(`Its not good ${e}`)
    }

})


router.post('/login',async (req,res)=>{
    const {username, password} = req.body

    try{
        let foundUser = await userCollection.findOne({username})
        if (!foundUser){
            return res.status(404).json("User not found")
        }
        	
        let passwordComparison = await comparePasswords(password, foundUser.password)
        if (passwordComparison === false){
            return res.status(400).json("User cannot be authentificated")
            
        }
        let token = await generateJWT({id: foundUser._id, username: foundUser.username, role: foundUser.role})
        return res.status(200).json({msg: "User is authentificated", user: foundUser.username, role: foundUser.role, jwt: token})
    }   
    catch(e){
        console.error(`Its not good ${e}`)
    }
    
})



export default router