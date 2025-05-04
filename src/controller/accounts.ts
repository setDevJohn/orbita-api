import { Request, Response } from "express";
import { errorHandler } from "../helpers/errorHandler";
import { ResponseHandler } from "../helpers/responseHandler";
import { AccountsModel } from "../models/accounts";

export class AccountsController {
  private accountsModel: AccountsModel;

  public constructor () {
    this.accountsModel = new AccountsModel();
  }

  public async create (req: Request, res: Response) {
    try {
      const response = await this.accountsModel.create(req.body);

      return new ResponseHandler().success(
        res,
        201,
        response,
        'Conta criada com sucesso'
      );
    } catch (err) {
      return errorHandler(err as Error, res)
    }
  }

  public async findMany (req: Request, res: Response) {
    try {
      const response = await this.accountsModel.findMany();

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