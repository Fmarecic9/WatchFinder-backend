import express from 'express'
import cors from 'cors'
import { connectToDatabase } from './db.js'
import userRouter from './routes/users.js'
import watchRouter from './routes/watches.js'

const app = express();


app.use(express.json())
const PORT = 3000
app.use(cors())

app.use('/users', userRouter)
app.use('/watches', watchRouter)



app.listen(PORT,error=>{
    if(error){
        console.log("Nešto ni u redu")
    }
    console.log(`Server dela na portu: http://localhost:${PORT}`)
    })
    