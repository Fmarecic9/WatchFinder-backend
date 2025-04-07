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

router.post('/wishlist/:id', authMiddleware, async(req,res)=>{
    let userId = req.user.id
    let watchId = req.params.id

    try{
        let result = await userCollection.updateOne(
            {_id: new ObjectId(userId)},
            {$addToSet: {wishlist: new ObjectId(watchId)}}
            
        )
        if (result.modifiedCount === 0){
            return res.status(400).json({ message: "Watch was not added"});
        }
        res.status(200).json({ message: "Watch added to wishlist" });
       
    }
    catch(e){
        console.error(`Not good: ${e}`)
    }
})

router.post('/owned/:id', authMiddleware, async(req,res)=>{
    let userId = req.user.id
    let watchId = req.params.id

    try{
        let result = await userCollection.updateOne(
            {_id: new ObjectId(userId)},
            {$addToSet: {ownedWatches: new ObjectId(watchId)}}
            
        )
        if (result.modifiedCount === 0){
            return res.status(400).json({ message: "Watch was not added"});
        }
        res.status(200).json({ message: "Watch added to owned watches" });
       
    }
    catch(e){
        console.error(`Not good: ${e}`)
    }
})

router.patch('/wishlist/:id', authMiddleware, async(req,res)=>{
    let userId = req.user.id
    let watchId = req.params.id

    try{
        let result = await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { wishlist: new ObjectId(watchId)}} 
        );
        if (result.modifiedCount === 0){
            return res.status(400).json("Did not remove watch")
        }
        return res.status(200).json("Watch removed from wishlist")
    }
    catch(e){
        console.error(`Error: ${e}`)
    }
})

router.patch('/owned/:id', authMiddleware, async(req,res)=>{
    let userId = req.user.id
    let watchId = req.params.id

    try{
        let result = await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { ownedWatches: new ObjectId(watchId)}} 
        );
        if (result.modifiedCount === 0){
            return res.status(400).json("Did not remove watch")
        }
        return res.status(200).json("Watch removed from owned list")
    }
    catch(e){
        console.error(`Error: ${e}`)
    }
})

export default router