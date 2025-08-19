import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../helpers/errorHandler";
import { AppError, HttpStatus } from "../helpers/appError";

export class AccountsMiddleware {
  constructor() {
  }

  public create (req: Request, res: Response, next: NextFunction) {
    try {
      const { name, balance } = req.body || {}

      if (!name) {
        throw new AppError('Nome da conta é obrigatorio', HttpStatus.BAD_REQUEST);
      }

      if (!balance) {
        throw new AppError('Saldo da conta é obrigatorio', HttpStatus.BAD_REQUEST);
      }

      if (balance.toString().length > 11 || Number.isNaN(+balance)) {
        throw new AppError('Saldo da conta inválido', HttpStatus.BAD_REQUEST);
      }

      next();
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }

  public update (req: Request, res: Response, next: NextFunction) {
    try {
      const { id, name, balance } = req.body || {}

      if (!name) {
        throw new AppError('Nome da conta é obrigatorio', HttpStatus.BAD_REQUEST);
      }

      if (!balance) {
        throw new AppError('Saldo da conta é obrigatorio', HttpStatus.BAD_REQUEST);
      }

      if (balance.toString().length > 11 || Number.isNaN(+balance)) {
        throw new AppError('Saldo da conta inválido', HttpStatus.BAD_REQUEST);
      }

      if (!id) {
        throw new AppError('Id da conta é obrigatorio', HttpStatus.BAD_REQUEST);
      }

      next();
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }

  public remove (req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params || {};

      if (!id) {
        throw new AppError('Id da conta é obrigatorio', HttpStatus.BAD_REQUEST);
      }

      next();
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }
}