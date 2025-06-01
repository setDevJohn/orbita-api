import { Request, Response } from "express";
import { errorHandler } from "../helpers/errorHandler";
import { ResponseHandler } from "../helpers/responseHandler";
import { CardsModel } from "../models/cards";
import { FindManyQuery } from "../interfaces/cards";
import { AppError, HttpStatus } from "../helpers/appError";

export class CardsController {
  private cardsModel: CardsModel;

  public constructor () {
    this.cardsModel = new CardsModel();
  }

  public async create (req: Request, res: Response) {
    try {
      const existingCard = await this.cardsModel.findOne({name: req.body.name});

      if (existingCard) {
        throw new AppError('Cartão ja cadastrado', HttpStatus.BAD_REQUEST)  
      }

      const payload = {
        name: req.body.name,
        creditLimit: req.body.creditLimit,
        closingDay: req.body.closingDay,
        dueDay: req.body.dueDay
      }

      const response = await this.cardsModel.create(payload);

      return new ResponseHandler().success(
        res,
        201,
        response,
        'Cartão criado com sucesso'
      );
    } catch (err) {
      return errorHandler(err as Error, res)
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const existingCard = await this.cardsModel.findOne({id: +req.body.id});

      if (!existingCard) {
        throw new AppError('Cartão nao encontrado', HttpStatus.BAD_REQUEST)  
      }   

      const existingCardByNames = await this.cardsModel.findOne({
        name: req.body.name,
        excludeId: +req.body.id
      });

      if (existingCardByNames) {
        throw new AppError('Cartão ja cadastrado', HttpStatus.BAD_REQUEST)  
      }

      const payload = {
        id: req.body.id,
        name: req.body.name,
        creditLimit: req.body.creditLimit,
        closingDay: req.body.closingDay,
        dueDay: req.body.dueDay
      }

      const response = await this.cardsModel.update(payload);

      return new ResponseHandler().success(
        res,
        201,
        response,
        'Cartão criado com sucesso'
      );
    } catch (err) {
      return errorHandler(err as Error, res)
    }
  }
  
  public async remove (req: Request, res: Response) {
    try {
      const { cardId } = req.params

      const existingCard = await this.cardsModel.findOne({id: +cardId});

      if (!existingCard) {
        throw new AppError('Cartão nao encontrado', HttpStatus.BAD_REQUEST)  
      }   

      await this.cardsModel.remove(+cardId);

      return new ResponseHandler().success(
        res,
        201,
        null,
        'Cartão removido com sucesso'
      );
    } catch (err) {
      return errorHandler(err as Error, res)
    }
  }
  
  public async findMany (req: Request, res: Response) {
    try {

      const findManyQuery: FindManyQuery = {
        month: String(req.query.month ?? new Date().getMonth() + 1)
      }

      const response = await this.cardsModel.findMany(findManyQuery);

      return new ResponseHandler().success(
        res,
        200,
        response,
        'Cartões listados com sucesso'
      );
    } catch (err) {
      return errorHandler(err as Error, res)
    }
  }
}