import { Request, Response } from "express";
import { AppError, HttpStatus } from "../helpers/appError";
import { errorHandler } from "../helpers/errorHandler";
import path from "path";

export class ImagesController {
  public constructor () {}

  public async findOne (req: Request, res: Response) {
    try {
      const { fileName } = req.params;

      const IMAGE_FOLDER_PATH = process.env.IMAGE_FOLDER_PATH

      if (!IMAGE_FOLDER_PATH) {
        throw new AppError(
          'Erro ao carregar variável de ambiente: IMAGE_FOLDER_PATH',
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }

      return res.sendFile(path.join(IMAGE_FOLDER_PATH, fileName));
    } catch (err) {
      return errorHandler(err as Error, res)
    }
  }
}