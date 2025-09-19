import { Request, Response } from "express";
import { errorHandler } from "../helpers/errorHandler";
import { ResponseHandler } from "../helpers/responseHandler";
import { UsersModel } from "../models/users";
import { AppError, HttpStatus } from "../helpers/appError";
import bcrypt from 'bcrypt'
import fs from "fs";
import path from "path";  
import { generateToken, verifyToken } from "../helpers/jwt";
import { sendEmail } from "../emailService";
import { generateRandonToken } from "../helpers/generateToken";
import { UpdateUserParams } from "../interfaces/users";

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

      const IMAGE_API_URL = process.env.IMAGE_API_URL

      if (!IMAGE_API_URL) {
        throw new AppError(
          'Erro ao carregar variável de ambiente: IMAGE_API_URL',
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }
      
      const tokenData = {
        id: userExisting.id,
        email: userExisting.email,
        verified: userExisting.verified ?? false,
        name: userExisting.name,
        profileImage: userExisting.profileImage ? `${IMAGE_API_URL}/${userExisting.profileImage}` : null
      };

      const token = generateToken(tokenData, stayConect);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
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

  public async verifyUserToken (req: Request, res: Response) {
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
      sameSite: "lax"
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

      return new ResponseHandler().success(res, { id: user.id });
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

      return new ResponseHandler().success(res, null);
    } catch (err) {
      return errorHandler(err as Error, res);
    }
  }
  
  public async update (req: Request, res: Response) {
    try {
      const { id: userId } = res.locals.user || {}
      const data = req.body as UpdateUserParams|| {}

      const user = await this.usersModel.findOne({ id: +userId })

      if (!user) {
        throw new AppError('Usuário não encontrado', HttpStatus.NOT_FOUND)
      }

      if (data.email && data.email !== user.email) {
        const existingEmail = await this.usersModel.findOne({ email: data.email })

        if (existingEmail) {
          throw new AppError('Este e-mail já está em uso', HttpStatus.CONFLICT)
        }
        
        // TODO: Enviar token para confirmação de conta
      }

      const payload = {
        ...(data.name && { name: data.name }),
        ...(data.cellPhone && { cellPhone: data.cellPhone }),
        ...(data.email && { email: data.email }),
        ...(data.wage && { wage: data.wage }),
        ...(data.payday && { payday: data.payday }),
      }

      const userUpdated = await this.usersModel.update(+userId, payload)

      const userInfo = {
        id: userUpdated.id,
        name: userUpdated.name,
        email: userUpdated.email,
        cellPhone: userUpdated.cellPhone,
        wage: userUpdated.wage,
        payday: userUpdated.payday,
        verified: userUpdated.verified,
      }
      
      return new ResponseHandler().success(res, userInfo);
    } catch (err) {
      return errorHandler(err as Error, res);
    }
  }
  
  public async updatePassword (req: Request, res: Response) {
    try {
      const { id: userId } = res.locals.user || {}
      const { currentPassword, newPassword } = req.body || {}

      const user = await this.usersModel.findOne({ id: +userId })

      if (!user) {
        throw new AppError('Usuário não encontrado', HttpStatus.NOT_FOUND)
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      )

      if (!isPasswordValid) {
        throw new AppError(
          'Senha inválida!',
          HttpStatus.BAD_REQUEST
        )
      }

      const SALT_ROUNDS = 10
      const passHashed = await bcrypt.hash(newPassword, SALT_ROUNDS)

      await this.usersModel.update(userId, { password: passHashed })
      
      return new ResponseHandler().success(res, null);
    } catch (err) {
      return errorHandler(err as Error, res);
    }
  }
  
  public async findInfo (_req: Request, res: Response) {
    try {
      const { id: userId } = res.locals.user || {}

      const user = await this.usersModel.findOne({ id: +userId })

      if (!user) {
        throw new AppError('Usuário não encontrado', HttpStatus.NOT_FOUND)
      }

      const IMAGE_API_URL = process.env.IMAGE_API_URL

      if (!IMAGE_API_URL) {
        throw new AppError(
          'Erro ao carregar variável de ambiente: IMAGE_API_URL',
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }

      const userInfo = {
        id: user.id,
        name: user.name,
        email: user.email,
        cellPhone: user.cellPhone,
        wage: user.wage,
        payday: user.payday,
        verified: user.verified,
        profileImage: user.profileImage ? `${IMAGE_API_URL}/${user.profileImage}` : null,
      }
      
      return new ResponseHandler().success(res, userInfo);
    } catch (err) {
      return errorHandler(err as Error, res);
    }
  }
  
  public async updateProfileImage (req: Request, res: Response) {
    try {
      const { id: userId } = res.locals.user || {}

      const user = await this.usersModel.findOne({ id: +userId })

      if (!user) {
        throw new AppError('Usuário não encontrado', HttpStatus.NOT_FOUND)
      }

      const IMAGE_FOLDER_PATH = process.env.IMAGE_FOLDER_PATH

      if (!IMAGE_FOLDER_PATH) {
        throw new AppError(
          'Erro ao carregar variável de ambiente: IMAGE_FOLDER_PATH',
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }

      if (user.profileImage) {
        const oldImagePath = path.join(IMAGE_FOLDER_PATH, user.profileImage);

        if (fs.existsSync(oldImagePath)) {
          await fs.promises.unlink(oldImagePath); // remove o arquivo antigo
        }
      }

      if (!req.file) {
        throw new AppError("Nenhum arquivo enviado", HttpStatus.BAD_REQUEST);
      }

      await this.usersModel.update(user.id, {
        profileImage: req.file.filename,
      });
            
      return new ResponseHandler().success(res, null);
    } catch (err) {
      return errorHandler(err as Error, res);
    }
  }
  
  public async deleteAccount (req: Request, res: Response) {
    try {
      const { id: userId } = res.locals.user || {}

      const user = await this.usersModel.findOne({ id: +userId })

      if (!user) {
        throw new AppError('Usuário não encontrado', HttpStatus.NOT_FOUND)
      }

      await this.usersModel.update(user.id, {
        deletedAt: new Date()
      });
            
      return new ResponseHandler().success(res, null);
    } catch (err) {
      return errorHandler(err as Error, res);
    }
  }
  
  public async findSettings (_req: Request, res: Response) {
    try {
      const { id: userId } = res.locals.user || {}

      const user = await this.usersModel.findOne({ id: +userId })

      if (!user) {
        throw new AppError('Usuário não encontrado', HttpStatus.NOT_FOUND)
      }

      const settings = await this.usersModel.findSettings(+userId);
            
      return new ResponseHandler().success(res, settings);
    } catch (err) {
      return errorHandler(err as Error, res);
    }
  }
}