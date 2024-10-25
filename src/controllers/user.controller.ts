import { TYPES } from '@src/containers/types';
import { CustomError } from '@src/core/interfaces/IError';
import { IUser } from '@src/core/interfaces/IUser';
import { UserRepository } from '@src/repositories/user.respository';
import { EmailSender } from '@src/services/email.service';
import { decodePassword, encodePassword } from '@src/services/hash.service';
import { createToken, verifyToken } from '@src/services/jwt.service';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.EmailSender) private emailSender: EmailSender
  ) {}
  async addNewUser(request: Request, response: Response, next: NextFunction): Promise<Response> {
    try {
      const existingUser = await this.userRepository.findUser(request.body.email);
      if (existingUser) {
        const error = new Error('Já existe um usuário cadastrado com esse e-mail!') as CustomError;
        error.statusCode = 400;
        next(error);
      } else {
        const hashedPassword = await encodePassword(request.body.password, next);
        request.body.password = hashedPassword;
        request.body.emailConfirmed = false;
        const newUser = await this.userRepository.createNewData(request.body);
        if (!newUser) {
          const error = new Error('Erro ao criar o novo usuário!');
          next(error);
        } else {
          const token = createToken(request, next);
          this.emailSender.sendEmailConfirmationSignUp(request.body, token, next);
          return response.status(200).json({
            date: new Date().toString(),
            status: true,
            message: 'Usuário cadastrado com sucesso!',
            data: newUser,
          });
        }
      }
    } catch (error) {
      next(error);
    }
  }

  async authenticateUser(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user = await this.userRepository.findUser(request.body.email);
      const inputPassword = request.body.password;
      if (!user) {
        const error = new Error('Não existe usuário cadastrado com esse e-mail!') as CustomError;
        error.statusCode = 401;
        next(error);
      } else {
        const isPasswordMatched = await decodePassword(inputPassword, user.password, next);
        if (!isPasswordMatched) {
          const error = new Error('Senha inválida') as CustomError;
          error.statusCode = 400;
          next(error);
        } else {
          const token = createToken(request, next);
          return response.status(200).json({
            date: new Date().toString(),
            status: true,
            token: token,
            message: 'Usuário logado com sucesso!',
            data: {
              id: user._id,
              username: user.username,
              email: user.email,
              avatar: user.avatar,
            },
          });
        }
      }
    } catch (error) {
      next(error);
    }
  }

  async validateToken(request: Request, response: Response, next: NextFunction): Promise<Response> {
    const token = request.query.token as string;
    const decoded = verifyToken(token, next);
    if (decoded) {
      const user = await this.userRepository.findUser((decoded as { email: string }).email);
      user.emailConfirmed = true;
      await this.userRepository.updateData(user);
      return response.status(200).json({
        date: new Date().toString(),
        status: true,
        message: 'Email confirmado com sucesso!',
      });
    } else {
      const error = new Error('Falha de verificação do token. Tente novamente!') as CustomError;
      error.statusCode = 401;
      next(error);
    }
  }

  async sendRecoverEmail(request: Request, response: Response, next: NextFunction) {
    const user = await this.userRepository.findUser(request.body.email);
    const token = createToken(request, next);
    this.emailSender.sendEmailConfirmationResetPassword(user, token, next);
    return response.status(200).json({
      date: new Date().toString(),
      status: true,
      message: 'Email de recuperação enviado com sucesso!',
    });
  }

  async updatePassword(request: Request, response: Response, next: NextFunction) {
    try {
      const token = request.query.token as string;
      const decoded = verifyToken(token, next);
      const user = await this.userRepository.findUser((decoded as { email: string }).email);
      if (!user) {
        const error = new Error('Não existe usuário cadastrado com esse e-mail!') as CustomError;
        error.statusCode = 401;
        next(error);
      } else {
        const hashedPassword = await encodePassword(request.body.password, next)
        user.password = hashedPassword;
        const updatedUser = await this.userRepository.updateData(user);
        if (!updatedUser) {
          const error = new Error(
            'Falha ao atualizar a senha! Tente novamente mais tarde.'
          ) as CustomError;
          next(error);
        } else {
          return response.status(200).json({
            date: new Date().toString(),
            status: true,
            message: 'Senha atualizada com sucesso!',
          });
        }
      }
    } catch (error) {
      next(error);
    }
  }
}
