import { Request, Response } from "express";
import { errorHandler } from "../helpers/errorHandler";
import { ResponseHandler } from "../helpers/responseHandler";
import { CardsModel } from "../models/cards";

export class CardsController {
  private cardsModel: CardsModel;

  public constructor () {
    this.cardsModel = new CardsModel();
  }

  public async create (req: Request, res: Response) {
    try {
      const response = await this.cardsModel.create(req.body);

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
  
  public async findMany (req: Request, res: Response) {
    try {
      const response = await this.cardsModel.findMany();

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