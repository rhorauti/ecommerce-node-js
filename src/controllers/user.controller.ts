import { TYPES } from '@src/containers/types';
import { CustomError } from '@src/core/interfaces/IError';
import { UserRepository } from '@src/repositories/user.respository';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class UserController {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}
  async onUserCreation(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const newUser = await this.userRepository.createNewData(request.body);
      if (!newUser) {
        const error = new Error('Erro ao criar o novo usuário!') as CustomError;
        error.statusCode = 500;
        error.status = false;
        next(error);
      } else {
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
}
