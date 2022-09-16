import { NextFunction, Request, Response } from "express";
import { Collection, Db } from "mongodb";
import {
  closeConnection,
  database,
  openConnection,
} from "../utils/connection.utils";
import jwt, { VerifyErrors } from 'jsonwebtoken'
import 'dotenv/config'

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

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  let authHeader = req.headers.authorization
  let token = authHeader ? authHeader : null
  if (token === null) { res.status(401).json({ error: "No token was provided"}); return}
  try {
    let verifiedToken = jwt.verify(token, process.env.JWT_TOKEN ? process.env.JWT_TOKEN : '1234')
    res.locals.id = verifiedToken;
    next()
  } catch (error: VerifyErrors | any) {
    if (error.name === 'JsonWebTokenError') {
      error.message === 'invalid token' ? res.status(403).json({ error: "Token is not valid"}) : res.status(400).send()
      return
    }
  }
}
