import express from 'express'
import { connectToDatabase } from '../db.js'
import {authMiddleware} from '../middleware/auth.js'
import { ObjectId } from 'mongodb'

const router = express.Router()
const db = await connectToDatabase()

const userCollection = db.collection('users')
const watchCollection = db.collection('watches')

router.get('/', authMiddleware, async(req,res)=>{
    let user = req.user

    try{
        let foundUser = await userCollection.findOne({_id: new ObjectId(user)})
        if (!foundUser){
            return res.status(404).json("User not found")
        }
        
        const ownedWatchIds = (foundUser.ownedWatches || []).map(id => new ObjectId(id));
        const wishlistIds = (foundUser.wishlist || []).map(id => new ObjectId(id));

        const owned = await watchCollection.find({ _id: { $in: ownedWatchIds } }).toArray();
        const wishlist = await watchCollection.find({ _id: { $in: wishlistIds } }).toArray();

        return res.status(200).json({ ownedWatches: owned, wishlist: wishlist, user: foundUser});
    }
    catch(e){
        console.error(`Error: ${e}`)
    }

})

router.post('/:id', authMiddleware, async(req,res)=>{
    let watchId = req.params.id

    try{

    }
    catch(e){
        
    }
})












export default router