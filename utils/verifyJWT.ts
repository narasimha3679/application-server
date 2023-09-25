import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
require("dotenv").config();

const secretKey = process.env.JWT_SECRET as string;

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization || req.query.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, secretKey as string, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).send({ message: err });
    }
    req.userId = decoded.id;
    next();
  });
};
