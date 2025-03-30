import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv'

config()

let jwt_secret_key = process.env.JWT_SECRET

async function hashPassword (plainPassword, saltRounds){
try{
    let hash = await bcrypt.hash(plainPassword, saltRounds)
    return hash
}
catch(e){
    console.error(`Došlo je do greške prilikom hashiranja lozinke: ${e}`);
    return null;
}
}

async function comparePasswords(plainPassword, hashedPassword){
    try{
        let rezultat = await bcrypt.compare(plainPassword, hashedPassword)
        return rezultat
    } 
    catch(e){
        console.error(`Ni okej, ${e}`)
        return false
    }
}

// -------------------------------------- JWT DIO --------------------------------------
async function generateJWT(payload) {
    try {
    let token = jwt.sign(payload, jwt_secret_key); 
    return token;
    } catch (err) {
    console.error(`Error generating JWT token: ${err}`);
    return null;
    }
    }

async function verifyJWT(token) {
    try {
        let decoded = jwt.verify(token, jwt_secret_key,{expiresIn: '24h'}); 
        return decoded;
    } catch (err) {
        console.error(`Error verifying JWT token: ${err}`);
        return null;
    }
}


const authMiddleware = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ msg: "Missing Authorization header" });
    }
    let token = req.headers.authorization.split(' ')[1]
    try{
    let decoded = await verifyJWT(token); 
    if (!decoded||!decoded.id) {
    return res.status(401).send('Invalid JWT token!');
    }
    req.authorised_user = decoded; 
    next(); 
    }
    catch(e){
        console.error(`Its not good ${e}`)
    }
    };




export {hashPassword, comparePasswords, authMiddleware, generateJWT, verifyJWT}