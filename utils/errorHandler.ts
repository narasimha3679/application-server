// errorMiddleware.ts
import { Request, Response, NextFunction } from "express";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(error);

  // Handle and format the error here
  res
    .status(500)
    .json({ error: "Internal Server Error", message: error.message });
}
