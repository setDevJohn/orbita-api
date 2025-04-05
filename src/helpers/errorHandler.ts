import { Response } from "express";
import { AppError } from "./appError";

export function errorHandler(err: Error, res: Response) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message })
  } 

  console.error(err);
  res.status(500).json({ message: 'Erro interno no servidor' });
}