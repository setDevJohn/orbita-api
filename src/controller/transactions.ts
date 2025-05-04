import { Request, Response } from "express";
import { errorHandler } from "../helpers/errorHandler";
import { ResponseHandler } from "../helpers/responseHandler";
import { TransactionsModel } from "../models/transactions";

export class TransactionsController {
  private transactionsModel: TransactionsModel;

  public constructor () {
    this.transactionsModel = new TransactionsModel();
  }

  public async create (req: Request, res: Response) {
    try {
      const response = await this.transactionsModel.create(req.body);

      return new ResponseHandler().success(
        res,
        201,
        response,
        'Transação criada com sucesso'
      );
    } catch (err) {
      return errorHandler(err as Error, res)
    }
  }
}