import { AppError, HttpStatus } from "./appError";
import jwt from "jsonwebtoken";


export interface ITokenData {
  id: number;
  email: string;
  verified: boolean;
  name: string;
  profileImage: string;
}

export function generateToken(user: ITokenData, stayConect: boolean): string {
  const SECRET_KEY = process.env.JWT_SECRET;

  if (!SECRET_KEY) {
    throw new AppError(
      "JWT_SECRET environment variable not set.",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  } 
  return jwt.sign(user, SECRET_KEY, { expiresIn: stayConect ? '30d' : '2h' });
}

export function verifyToken(token: string): any {
  const SECRET_KEY = process.env.JWT_SECRET;
  
  try {
    if (!SECRET_KEY) {
      throw new AppError(
        "JWT_SECRET environment variable not set.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.error('Error verifying token:', (error as Error).message);
    return null;
  }
}