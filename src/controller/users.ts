import { Request, Response } from "express";
import { errorHandler } from "../helpers/errorHandler";
import { ResponseHandler } from "../helpers/responseHandler";
import { UsersModel } from "../models/users";
import { AppError, HttpStatus } from "../helpers/appError";
import bcrypt from 'bcrypt'

export class UsersController {
  private usersModel: UsersModel;

  public constructor () {
    this.usersModel = new UsersModel();
  }

  public async create (req: Request, res: Response) {
    try {
      const { name, email, password } = req.body

      const userExiting = await this.usersModel.findOne({ email })

      if (userExiting) {
        throw new AppError(
          'Esse usuário já possui uma conta, faça login ou redefina sua senha!',
          HttpStatus.BAD_REQUEST
        )
      }

      const SALT_ROUNDS = 10
      const passHashed = await bcrypt.hash(password, SALT_ROUNDS)

      const response = await this.usersModel.create({
        name,
        email,
        password: passHashed,
      })

      return new ResponseHandler().success(
        res,
        200,
        response,
        'Usuário criado com sucesso'
      );
    } catch (err) {
      return errorHandler(err as Error, res)
    }
  }

  public async auth (req: Request, res: Response) {
    try {
      const { email, password, stayConect } = req.body

      const userExiting = await this.usersModel.findOne({ email })

      // TODO: Verificar se tem 8 tentativas erradas e retornar um aviso para redefinição de senha

      if (!userExiting) {
        throw new AppError(
          'Usuário ou senha inválida!',
          HttpStatus.UNAUTHORIZED
        )
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        userExiting.password
      )

      if (!isPasswordValid) {
        // TODO: Atualizar failedAttempts

        throw new AppError(
          'Usuário ou senha inválida!',
          HttpStatus.UNAUTHORIZED
        )
      }

      // TODO: Atualizar data de login e failedAttempts para 0
      return new ResponseHandler().success(
        res,
        200,
        userExiting,
        'Usuário autenticado com sucesso!'
      );
    } catch (err) {
      return errorHandler(err as Error, res)
    }
  }
}