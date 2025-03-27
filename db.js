import {MongoClient} from 'mongodb'
import { config } from 'dotenv';

config()

let url = process.env.MONGO_URI;
let dbName = process.env.MONGO_DB_NAME;

const client = new MongoClient(url);

async function connectToDatabase() {
    try {
        await client.connect();
        const db = client.db(dbName);
        return db;
    } catch (error) {
        console.error('Greška prilikom spajanja na bazu podataka', error);
        throw error;
    }
}

export { connectToDatabase };
