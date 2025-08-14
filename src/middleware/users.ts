import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../helpers/errorHandler";
import { AppError, HttpStatus } from "../helpers/appError";

export class UsersMiddleware {
  constructor() {
  }

  public auth (req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, stayConect } = req.body;

      if (!email) {
        throw new AppError('Email não enviado', HttpStatus.BAD_REQUEST);
      }

      if (!password) {
        throw new AppError('Senha não enviada', HttpStatus.BAD_REQUEST);
      }
      
      if (typeof(password) !== 'string') {
        throw new AppError('Senha deve ser uma string', HttpStatus.BAD_REQUEST)
      }
      
      req.body = { email, password, stayConect }
      next();
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }

  public create (req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body

      if (!name) {
        throw new AppError('Nome não enviado', HttpStatus.BAD_REQUEST);
      }

      if (!email) {
        throw new AppError('Email não enviado', HttpStatus.BAD_REQUEST);
      }

      if (!password) {
        throw new AppError('Senha não enviada', HttpStatus.BAD_REQUEST);
      }

      if (typeof(password) !== 'string') {
        throw new AppError('Senha deve ser uma string', HttpStatus.BAD_REQUEST)
      }

      if (password.length < 6) {
        throw new AppError('Senha deve ter no mínimo 6 caracteres', HttpStatus.BAD_REQUEST)
      }
      
      req.body = { 
        name,
        email,
        password: password.toString(),
      }
      next();
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }

  public recoverPassword (req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, password } = req.body

      if (!userId) {
        throw new AppError('Id do usuário é obrigatório', HttpStatus.BAD_REQUEST)
      }  

      if (Number.isNaN(+userId) || !Number.isInteger(+userId)) {
        throw new AppError('Id do usuário deve ser um número inteiro', HttpStatus.BAD_REQUEST)
      }

      if (!password) {
        throw new AppError('Senha não enviada', HttpStatus.BAD_REQUEST);
      }

      if (typeof(password) !== 'string') {
        throw new AppError('Senha deve ser uma string', HttpStatus.BAD_REQUEST)
      }

      if (password.length < 6) {
        throw new AppError('Senha deve ter no mínimo 6 caracteres', HttpStatus.BAD_REQUEST)
      }      

      next()
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }

  public sendEmailToRecoverPassword (req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body

      if (!email) {
        throw new AppError('Email não enviado', HttpStatus.BAD_REQUEST)
      }
       
      next()
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }

  public confirmTokenToRecoverPassword (req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, token } = req.body

      if (!userId) {
        throw new AppError('Id do usuário é obrigatório', HttpStatus.BAD_REQUEST)
      }  

      if (Number.isNaN(+userId) || !Number.isInteger(+userId)) {
        throw new AppError('Id do usuário deve ser um número inteiro', HttpStatus.BAD_REQUEST)
      }

      if (!token) {
        throw new AppError('Token não enviado', HttpStatus.BAD_REQUEST)
      } 

      if (token.lenth !== 6) {
        throw new AppError('Token inválido', HttpStatus.BAD_REQUEST)
      }
      
      next()
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }
}