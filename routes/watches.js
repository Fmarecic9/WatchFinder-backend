import express from 'express'
import { connectToDatabase } from '../db.js'

const router = express.Router()
const db = await connectToDatabase()

router.get('/', async (req,res)=>{
    let ureCollection = db.collection('watches')
    let watches = await ureCollection.find().toArray()
    res.status(200).json(watches)
})

export default router