import { Db } from "mongodb";
import { client } from "../connections/db.connection";
import { User } from "../models/user.model";
import 'dotenv/config'

export const collection = async () => {
    try {
        await client.connect()
        const db: Db = client.db(process.env.DB_NAME);

        //create user collection
        await db.createCollection<User>('User', (err:any, res) => {
            //check if collection exist
            if (err) {
                if (err.codeName === 'NamespaceExists') {
                    console.log('Collection already exist'); 
                    return;
                }
                return console.log(err)
            }
            if(res) { console.log(res); return}
        })
    } catch {
        await client.close()
    }
}