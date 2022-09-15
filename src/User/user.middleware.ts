import { NextFunction, Request, Response } from "express";
import { Collection, Db } from "mongodb";
import {
  closeConnection,
  database,
  openConnection,
} from "../utils/connection.utils";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    !req.body.name ||
    !req.body.lastname ||
    !req.body.email ||
    !req.body.password
  ) {
    !req.body.name
      ? res.status(400).json({ Error_name: "Name can't be blank" })
      : !req.body.lastname
      ? res.status(400).json({ Error_lastname: "Lastname can't be blank" })
      : !req.body.email
      ? res.status(400).json({ Error_email: "Email can't be blank" })
      : !req.body.password
      ? res.status(400).json({ Error_password: "Password can't be blank" })
      : null;
    return;
  }
  if (
    req.body.name &&
    req.body.lastname &&
    req.body.email &&
    req.body.password
  ) {
    //check if email is already registered

    await openConnection();
    let db: Db = await database();
    let userCollection: Collection = db.collection("User");
    let result = await userCollection.find({ email: req.body.email }).toArray();
    await closeConnection();

    //If email is being used, throwing an error to change the email
    if (result.length === 1) {
      res.status(400).json({ Error_email: "Email is already being used" });
      return;
    }
    next();
  }
};
