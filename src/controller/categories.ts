import { Request, Response } from "express";
import { errorHandler } from "../helpers/errorHandler";
import { ResponseHandler } from "../helpers/responseHandler";
import { CategoriesModel } from "../models/categories";

export class CategoriesController {
  private categoriesModel: CategoriesModel;

  public constructor () {
    this.categoriesModel = new CategoriesModel();
  }

  public async create (req: Request, res: Response) {
    try {
      const response = await this.categoriesModel.create(req.body);

      return new ResponseHandler().success(
        res,
        201,
        response,
        'Categoria criada com sucesso'
      );
    } catch (err) {
      return errorHandler(err as Error, res)
    }
  }
}