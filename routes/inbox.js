import express from 'express'
import { connectToDatabase } from '../db.js'
import {authMiddleware, isAdmin} from '../middleware/auth.js'
import { ObjectId } from 'mongodb'

const router = express.Router()

const db = await connectToDatabase()
const inboxCollection = db.collection('inbox')

router.get('/', authMiddleware, isAdmin, async(req,res)=>{
    try{
        let result = await inboxCollection.find().toArray()
        if (!result.length === 0){
            res.status(404).json("No messages")
        }
        res.status(200).json(result)
    }
    catch(e){
        console.error(`Error: ${e}`)
    }
})
router.post('/', authMiddleware, async(req,res)=>{
    let messageText = req.body
    let userId = req.user.id
    let userName = req.user.username

    const newMessage = {
        _id: new ObjectId, 
        userId: new ObjectId(userId),
        user: userName,
        message: messageText,
        timestamp: new Date()
    }

    try{
        let sendMsg = await inboxCollection.insertOne(newMessage)
        if (!sendMsg){
            return res.status(400).json("Could not send message")
        }
        res.status(200).json({msg: "Posted!", user: newMessage.user})
    }
    catch(e){
        console.error(`Error: ${e}`)
    }
})

router.delete('/:id', authMiddleware, isAdmin, async(req,res)=>{
    let messageId = req.params.id
    
    try{
        let foundMsg = await inboxCollection.deleteOne({_id: new ObjectId(messageId)})
        if (!foundMsg){
            return res.status(404).json("Message not found")
        }
        return res.status(200).json({msg: "Message deleted"})

    }
    catch(e){
        console.error(`Error: ${e}`)
    }

})
export default router