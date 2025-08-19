import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../helpers/errorHandler";
import { AppError, HttpStatus } from "../helpers/appError";

export class CategoriesMiddleware {
  constructor() {
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }

  public create(req: Request, res: Response, next: NextFunction): void {
    try {
      const { name } = req.body || {}

      if (!name) {
        throw new AppError('Nome da categoria é obrigatorio', HttpStatus.BAD_REQUEST)
      }
      
      next();
    } catch (err) {
      errorHandler(err as Error, res)       
    }
  }

  public update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, name } = req.body || {}

      if (!id) {
        throw new AppError('Id da categoria é obrigatorio', HttpStatus.BAD_REQUEST)
      }

      if (!name) {
        throw new AppError('Nome da categoria é obrigatorio', HttpStatus.BAD_REQUEST)
      }
      
      next(); 
    } catch (err) {
      errorHandler(err as Error, res) 
    }    
  }

  public remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.params || {}

      if (!categoryId) {
        throw new AppError('Id da categoria é obrigatorio', HttpStatus.BAD_REQUEST)
      }
      
      next();
    } catch (err) {
     errorHandler(err as Error, res)
    }
  }
}