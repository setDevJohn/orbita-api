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
      const { name } = req.body
      const response = await this.categoriesModel.create({name});

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


  public async update (req: Request, res: Response) {
    try {
      const { id, name } = req.body
      const response = await this.categoriesModel.update({id, name});

      return new ResponseHandler().success(
        res,
        201,
        response,
        'Categoria atualizada com sucesso'
      );
    } catch (err) {
      return errorHandler(err as Error, res)
    }
  }

  public async findMany (req: Request, res: Response) {
    try {
      const response = await this.categoriesModel.findMany();

      return new ResponseHandler().success(
        res,
        200,
        response,
        'Categorias listadas com sucesso'
      );
    } catch (err) {
      return errorHandler(err as Error, res)
    }
  }

  public async remove (req: Request, res: Response) {
    try {
      const { categoryId } = req.params

      await this.categoriesModel.remove(+categoryId);

      return new ResponseHandler().success(
        res,
        200,
        null,
        'Categoria removida com sucesso'
      );
    } catch (err) {
      return errorHandler(err as Error, res)
    }
  }
}