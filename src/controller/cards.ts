import { Request, Response } from "express";
import { errorHandler } from "../helpers/errorHandler";
import { ResponseHandler } from "../helpers/responseHandler";
import { CardsModel } from "../models/cards";
import { FindManyQuery } from "../interfaces/cards";
import { AppError, HttpStatus } from "../helpers/appError";
import { ITokenData } from "../helpers/jwt";

export class CardsController {
  private cardsModel: CardsModel;

  public constructor () {
    this.cardsModel = new CardsModel();
  }

  public async create (req: Request, res: Response) {
    try {
      const { id: userId } = res.locals.user as ITokenData
      
      const existingCard = await this.cardsModel.findOne({ 
        userId,
        name: req.body.name
      });

      if (existingCard) {
        throw new AppError('Cartão ja cadastrado', HttpStatus.BAD_REQUEST)  
      }

      const payload = {
        name: req.body.name,
        creditLimit: req.body.creditLimit,
        closingDay: req.body.closingDay,
        dueDay: req.body.dueDay,
        userId,
      }

      const response = await this.cardsModel.create(payload);

      return new ResponseHandler().success(
        res,
        response,
        HttpStatus.CREATED,
      );
    } catch (err) {
      return errorHandler(err as Error, res)
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const { id: userId } = res.locals.user as ITokenData

      const existingCard = await this.cardsModel.findOne({
        userId,
        id: +req.body.id
      });

      if (!existingCard) {
        throw new AppError('Cartão nao encontrado', HttpStatus.BAD_REQUEST)  
      }   

      const existingCardByNames = await this.cardsModel.findOne({
        name: req.body.name,
        excludeId: +req.body.id,
        userId,
      });

      if (existingCardByNames) {
        throw new AppError('Cartão ja cadastrado', HttpStatus.BAD_REQUEST)  
      }

      const payload = {
        id: req.body.id,
        name: req.body.name,
        creditLimit: req.body.creditLimit,
        closingDay: req.body.closingDay,
        dueDay: req.body.dueDay,
        userId,
      }

      const response = await this.cardsModel.update(payload);

      return new ResponseHandler().success(res, response);
    } catch (err) {
      return errorHandler(err as Error, res)
    }
  }
  
  public async remove (req: Request, res: Response) {
    try {
      const { cardId } = req.params
      const { id: userId } = res.locals.user as ITokenData

      const existingCard = await this.cardsModel.findOne({
        userId,
        id: +cardId
      });

      if (!existingCard) {
        throw new AppError('Cartão nao encontrado', HttpStatus.BAD_REQUEST)  
      }   

      await this.cardsModel.remove(+cardId, userId);

      return new ResponseHandler().success(res, null);
    } catch (err) {
      return errorHandler(err as Error, res)
    }
  }
  
  public async findMany (req: Request, res: Response) {
    try {
      const { id: userId } = res.locals.user as ITokenData
      const { month, year } = req.query || {}

      const findManyQuery: FindManyQuery = {
        userId,
        ...(month && !Number.isNaN(+month) && { month: +month }),
        ...(year && !Number.isNaN(+year) && { year: +year })
      }

      const response = await this.cardsModel.findMany(findManyQuery);

      const cardsWithInvoiceValue = response.map(({transactions, ...card}) => {
        const monthlyTransactions = month ? transactions.filter(t => t.referenceMonth === +month ) : []
        const monthlyInvoice = monthlyTransactions.reduce((acc, cur) => acc + +cur.amount, 0)
        const totalInvoice = transactions.reduce((acc, cur) => acc + +cur.amount, 0)

        return {
          ...card,
          invoice: monthlyInvoice,
          availableCreditLimit: card?.creditLimit? +card.creditLimit - totalInvoice : 0
        }
      })

      return new ResponseHandler().success(res, cardsWithInvoiceValue);
    } catch (err) {
      return errorHandler(err as Error, res)
    }
  }
}