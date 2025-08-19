import { Request, Response } from "express";
import { errorHandler } from "../helpers/errorHandler";
import { ResponseHandler } from "../helpers/responseHandler";
import { UsersModel } from "../models/users";
import { AppError, HttpStatus } from "../helpers/appError";
import bcrypt from 'bcrypt'
import { generateToken, verifyToken } from "../helpers/jwt";
import { sendEmail } from "../emailService";
import { generateRandonToken } from "../helpers/generateToken";

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

      const user = await this.usersModel.create({
        name,
        email,
        password: passHashed,
      })

      return new ResponseHandler().success(
        res,
        { id: user.id, email: user.email },
      );
    } catch (err) {
      return errorHandler(err as Error, res)
    }
  }

  public async auth (req: Request, res: Response) {
    try {
      const { email, password, stayConect } = req.body

      const userExisting = await this.usersModel.findOne({ email })

      // TODO: Verificar se tem 8 tentativas erradas e retornar um aviso para redefinição de senha

      if (!userExisting) {
        throw new AppError(
          'Usuário ou senha inválida!',
          HttpStatus.UNAUTHORIZED
        )
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        userExisting.password
      )

      if (!isPasswordValid) {
        // TODO: Atualizar failedAttempts

        throw new AppError(
          'Usuário ou senha inválida!',
          HttpStatus.UNAUTHORIZED
        )
      }
      
      const tokenData = {
        id: userExisting.id,
        email: userExisting.email,
        verified: userExisting.verified ?? false,
      };

      const token = generateToken(tokenData, stayConect);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: stayConect
          ? 30 * 24 * 60 * 60 * 1000 // 30 dias
          : 2 * 60 * 60 * 1000       // 2 horas
      });

      // TODO: Atualizar data de login e failedAttempts para 0
      return new ResponseHandler().success(res, null);
    } catch (err) {
      return errorHandler(err as Error, res)
    }
  }

  public async verify (req: Request, res: Response) {
    try {
      const token = req.cookies?.token;

      if (!token) {
        throw new AppError("Não autenticado", HttpStatus.UNAUTHORIZED);
      }
      const decoded = verifyToken(token);

      return new ResponseHandler().success(res, decoded);
    } catch (err) {
      return errorHandler(err as Error, res);
    }
  }

  public async logout(req: Request, res: Response) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    return new ResponseHandler().success(res, null);
  }

  public async recoverPassword (req: Request, res: Response) {
    try {
      const { userId, password, token } = req.body

      const user = await this.usersModel.findOne({ id: +userId })

      if (!user) {
        throw new AppError('Usuário não encontrado', HttpStatus.NOT_FOUND)
      }

      if (user.passwordResetToken !== token) {
        throw new AppError('Token inválido', HttpStatus.BAD_REQUEST)
      }

      const SALT_ROUNDS = 10
      const passHashed = await bcrypt.hash(password, SALT_ROUNDS)

      await this.usersModel.update(userId, { 
        password: passHashed,
        passwordResetToken: null
      })

      return new ResponseHandler().success(res, user);
    } catch (err) {
      return errorHandler(err as Error, res);
    }
  }

  public async sendEmailToRecoverPassword (req: Request, res: Response) {
    try {
      const { email } = req.body

      const user = await this.usersModel.findOne({ email })

      if (!user) {
        throw new AppError('Usuário não encontrado', HttpStatus.NOT_FOUND)
      }

      const generatedToken = generateRandonToken()
      await this.usersModel.update(user.id, { passwordResetToken: generatedToken })

      await sendEmail({
        to: email,
        subject: 'Recuperação de senha',
        htmlFileName: 'resetPassword',
        token: generatedToken
      })

      return new ResponseHandler().success(res, user);
    } catch (err) {
      return errorHandler(err as Error, res);
    }
  }
  
  public async confirmTokenToRecoverPassword (req: Request, res: Response) {
    try {
      const { userId, token } = req.body

      const user = await this.usersModel.findOne({ id: +userId })

      if (!user) {
        throw new AppError('Usuário não encontrado', HttpStatus.NOT_FOUND)
      }
      
      if (user.passwordResetToken !== token) {
        throw new AppError('Token inválido', HttpStatus.BAD_REQUEST)
      }

      return new ResponseHandler().success(res, user);
    } catch (err) {
      return errorHandler(err as Error, res);
    }
  }
}