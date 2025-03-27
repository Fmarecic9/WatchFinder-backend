import express from 'express'
import { connectToDatabase } from './db.js'
import userRouter from './routes/users.js'

const app = express();

app.use(express.json())
const PORT = 3000

app.use('/users', userRouter)

const db = await connectToDatabase()

app.listen(PORT,error=>{
    if(error){
        console.log("Nešto ni u redu")
    }
    console.log(`Server dela na portu: http://localhost:${PORT}`)
    })
    

app.get('/', async (req,res)=>{
    let ureCollection = db.collection('watches')
    let watches = await ureCollection.find().toArray()
    res.status(200).json(watches)
})