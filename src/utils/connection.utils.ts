import { client } from "../connections/db.connection";
import "dotenv/config";

export const openConnection = async () => {
  return await client.connect();
};

export const database = async () => {
  return await client.db(process.env.DB_NAME);
};

export const closeConnection = async () => {
  return client.close();
};
