import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../helpers/errorHandler";
import { AppError, HttpStatus } from "../helpers/appError";
import { verifyToken } from "../helpers/jwt";

export class AuthMiddleware {
  constructor() {}

  public validate(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.token

      if (!token) {
        throw new AppError("Usuário não autenticado.", HttpStatus.UNAUTHORIZED);
      }

      const decoded = verifyToken(token);

      if (!decoded) {
        throw new AppError("Token inválido ou expirado. Faça login novamente", HttpStatus.UNAUTHORIZED);
      }

      res.locals.user = decoded;
      next();
    } catch (err) {
      errorHandler(err as Error, res);
    }
  }
}