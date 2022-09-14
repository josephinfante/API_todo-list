import { MongoClient, Db } from "mongodb";
import 'dotenv/config'

const URI = process.env.DB_URL || 'mongodb://localhost:27017/todo-list_dev'
export const client: MongoClient = new MongoClient(URI)

export const Connection = async () => {
    try {
        // Connect the client to the server
        await client.connect();
        console.log(`Connected successfully to server: ${URI}`)
        // Establish and verify connection
        const db: Db = client.db(process.env.DB_NAME);
        console.log(`Connected to database: ${db.databaseName}`)

    } finally {
        //Ensures that the client will close when you finish/error
        await client.close()
    }
}

