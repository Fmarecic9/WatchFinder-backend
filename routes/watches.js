import express from 'express'
import { connectToDatabase } from '../db.js'
import { ObjectId } from 'mongodb'
import { authMiddleware, isAdmin} from '../middleware/auth.js'


const router = express.Router()
const db = await connectToDatabase()
const watchCollection = db.collection('watches')


router.get('/', async (req,res)=>{
    try{
    const { brand, color, type, materialHousing, materialBracelet, maxPrice, minPrice } = req.query;
    const filter = {}

    if(brand) filter.brand = brand
    if(color) filter.color = color
    if(type) filter.type = type
    if(materialHousing) filter.materialHousing = materialHousing
    if(materialBracelet) filter.materialBracelet = materialBracelet

    
    if (minPrice || maxPrice){
        filter.price={}
        if (minPrice) filter.price.$gte = parseFloat(minPrice);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    let watches = await watchCollection.find(filter).toArray()
    res.status(200).json(watches)
    }

    catch(e){

    }
})

router.get('/:id', async(req,res)=>{
    let watchId = req.params.id
    try{
    let selectedWatch = await watchCollection.findOne({_id: new ObjectId(watchId)})
    if (!selectedWatch){
        return res.status(404).json("Watch not found")
    }
    return res.status(200).json({watch: selectedWatch})
    }
    catch(e){
        console.error(`Error: ${e}`)
    }
})

router.post('/',  authMiddleware, isAdmin, async (req,res)=>{
    const {brand, model, price, color, type, materialHousing, 
        materialBracelet, weight, dimensions, features, images } = req.body

    const newWatch = {
        _id: new ObjectId,
        brand: brand,
        model: model,
        price: price,
        color: color,
        type: type,
        materialHousing: materialHousing,
        materialBracelet: materialBracelet,
        weight: weight,
        dimensions: dimensions,
        features: features,
        images: images
    }

    try{
        let result = await watchCollection.insertOne(newWatch)
        if (!result){
            return res.status(400).json("Could not add the watch")
        }
        return res.status(201).json({msg: "Watch added", watch: newWatch.model})
    }
    catch(e){
        console.error(`Error: ${e}`)
    }
})

router.delete('/:id', authMiddleware, isAdmin, async(req,res)=>{
    let watchId = req.params.id

    try{
        let watchToDelete = await watchCollection.deleteOne({_id: new ObjectId(watchId)})
        if (!watchToDelete){
            return res.status(400).json("Watch cannot be deleted")
        }
        return res.status(200).json({msg: "Watch deleted", watch: watchId})
    }
    
    catch(e){
        console.error(`Error: ${e}`)
    }

})

router.patch('/:id', authMiddleware, isAdmin, async (req,res)=>{
    let watchId = req.params.id
    let changes = req.body

    try{
        let filter = {_id: new ObjectId(watchId)}
        let update = {$set: changes}
        let result = await watchCollection.updateOne(filter, update)
        
        if (result.modifiedCount == 0){
            return res.status(400).json({msg: "No changes were made"})
        }
        res.status(200).json({ message: 'Watch updated successfully', result })
    }
    catch(e){
        console.error(`Error: ${e}`)
    }
})




export default router