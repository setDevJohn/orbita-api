import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../helpers/errorHandler";
import { AppError, HttpStatus } from "../helpers/appError";

export class CardsMiddleware {
  constructor() {
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }

  public create(req: Request, res: Response, next: NextFunction): void {
    try {
      const { name, creditLimit, closingDay, dueDay } = req.body || {}

      if (!name) {
        throw new AppError('Nome do cartão é obrigatorio', HttpStatus.BAD_REQUEST)
      }

      if (!creditLimit) {
        throw new AppError('Limite do cartão é obrigatorio', HttpStatus.BAD_REQUEST)
      }

      if (!closingDay) {
        throw new AppError('Dia de fechamento do cartão é obrigatorio', HttpStatus.BAD_REQUEST)
      }

      if (!dueDay) {
        throw new AppError('Dia de vencimento do cartão é obrigatorio', HttpStatus.BAD_REQUEST)
      }

      if (name.length > 50) {
        throw new AppError('Nome do cartão inválido', HttpStatus.BAD_REQUEST)
      }

      if (+creditLimit < 0 || creditLimit.toString().length > 11) {
        throw new AppError('Limite do cartão inválido', HttpStatus.BAD_REQUEST)
      }

      if (+closingDay < 1 || +closingDay > 31 || closingDay.length > 2) { 
        throw new AppError('Dia de fechamento do cartão inválido', HttpStatus.BAD_REQUEST)
      }

      if (+dueDay < 1 || +dueDay > 31 || dueDay.length > 2) {
        throw new AppError('Dia de vencimento do cartão inválido', HttpStatus.BAD_REQUEST)
      }

      next();
    } catch (err) {
      errorHandler(err as Error, res)       
    }
  }

  public update(req: Request, res: Response, next: NextFunction): void {
    try {
      const { id, name, creditLimit, closingDay, dueDay } = req.body || {}

      if (!id) {
        throw new AppError('Id do cartão é obrigatorio', HttpStatus.BAD_REQUEST)
      }

      if (!name) {
        throw new AppError('Nome do cartão é obrigatorio', HttpStatus.BAD_REQUEST)
      }

      if (!creditLimit) {
        throw new AppError('Limite do cartão é obrigatorio', HttpStatus.BAD_REQUEST)
      }

      if (!closingDay) {
        throw new AppError('Dia de fechamento do cartão é obrigatorio', HttpStatus.BAD_REQUEST)
      }

      if (!dueDay) {
        throw new AppError('Dia de vencimento do cartão é obrigatorio', HttpStatus.BAD_REQUEST)
      }

      if (name.length > 50) {
        throw new AppError('Nome do cartão inválido', HttpStatus.BAD_REQUEST)
      }

      if (+creditLimit < 0 || creditLimit.toString().length > 11) {
        throw new AppError('Limite do cartão inválido', HttpStatus.BAD_REQUEST)
      }

      if (+closingDay < 1 || +closingDay > 31 || closingDay.length > 2) { 
        throw new AppError('Dia de fechamento do cartão inválido', HttpStatus.BAD_REQUEST)
      }

      if (+dueDay < 1 || +dueDay > 31 || dueDay.length > 2) {
        throw new AppError('Dia de vencimento do cartão inválido', HttpStatus.BAD_REQUEST)
      }

      next();
    } catch (err) {
      errorHandler(err as Error, res)       
    }
  }

  public remove(req: Request, res: Response, next: NextFunction): void {
    try {
      const { cardId } = req.params || {}

      if (!cardId) {
        throw new AppError('Id do cartão é obrigatorio', HttpStatus.BAD_REQUEST)
      }

      next();
    } catch (err) {
      errorHandler(err as Error, res)       
    }
  }
}