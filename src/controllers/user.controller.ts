import { TYPES } from '@src/containers/types';
import { CustomError } from '@src/core/interfaces/IError';
import { UserRepository } from '@src/repositories/user.respository';
import { EmailSender } from '@src/services/email.service';
import { decodePassword, encodePassword } from '@src/services/hash.service';
import { createToken } from '@src/services/jwt.service';
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
      const hashedPassword = await encodePassword(request.body.password, next);
      request.body.password = hashedPassword;
      request.body.emailConfirmed = false;
      const newUser = await this.userRepository.createNewData(request.body);
      if (!newUser) {
        const error = new Error('Erro ao criar o novo usuário!');
        next(error);
      } else {
        const token = createToken(request, next);
        await this.emailSender.sendEmailConfirmationSignUp(request.body, token, next);
        return response.status(200).json({
          status: true,
          message: 'Usuário cadastrado com sucesso!',
          data: newUser,
        });
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
            status: true,
            token: token,
            message: 'Usuário logado com sucesso!',
            data: user,
          });
        }
      }
    } catch (error) {
      next(error);
    }
  }
}
