import { Request, Response } from "express";
import { errorHandler } from "../helpers/errorHandler";
import { ResponseHandler } from "../helpers/responseHandler";
import { AccountsModel } from "../models/accounts";
import { AppError, HttpStatus } from "../helpers/appError";
import { ITokenData } from "../helpers/jwt";

export class AccountsController {
  private accountsModel: AccountsModel;

  public constructor () {
    this.accountsModel = new AccountsModel();
  }

  public async create (req: Request, res: Response) {
    try {
      const {  name, balance } = req.body
      const { id: userId } = res.locals.user as ITokenData

      const existingAccount = await this.accountsModel.findOne({ userId, name });

      if (existingAccount) {
        throw new AppError('Conta ja cadastrada', HttpStatus.CONFLICT)
      }

      const payload = {
        name,
        balance,
        userId,
      }

      const response = await this.accountsModel.create(payload);

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
      const { id: userId } = res.locals.user as ITokenData

      const response = await this.accountsModel.findMany(userId);

      return new ResponseHandler().success(
        res,
        200,
        response,
        'Contas listadas com sucesso'
      );
    } catch (err) {
      return errorHandler(err as Error, res)
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const {id, name, balance } = req.body
      const { id: userId } = res.locals.user as ITokenData

      const existingAccount = await this.accountsModel.findOne({ userId, id: +id });

      if (!existingAccount) {
        throw new AppError('Conta nao encontrada', HttpStatus.NOT_FOUND)
      }

      const existingAccountName = await this.accountsModel.findOne({
        userId,
        name,
        excludeId: id
      });

      if (existingAccountName) {
        throw new AppError('Conta ja cadastrada', HttpStatus.CONFLICT)
      }

      const payload = {
        id,
        name,
        balance,
        userId, 
      }

      const response = await this.accountsModel.update(payload);

      return new ResponseHandler().success(
        res,
        200,
        response,
        'Conta atualizada com sucesso'
      );
    } catch (err) {
      return errorHandler(err as Error, res)
    }
  }

  public async remove (req: Request, res: Response) {
    try {
      const { id } = req.params
      const { id: userId } = res.locals.user as ITokenData


      const existingAccount = await this.accountsModel.findOne({ userId, id: +id });

      if (!existingAccount) {
        throw new AppError('Conta nao encontrada', HttpStatus.NOT_FOUND)
      }

      const response = await this.accountsModel.remove(+id, userId)

      return new ResponseHandler().success(
        res,
        200,
        response,
        'Conta removida com sucesso'
      );
    } catch (err) {
      return errorHandler(err as Error, res)
    }
  }
}