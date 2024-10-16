import { CustomError } from '@src/core/interfaces/IError';
import { NextFunction, Request } from 'express';
import { sign, verify } from 'jsonwebtoken';

export const createToken = (request: Request, next: NextFunction): string => {
  try {
    const token = sign({ email: request.body.email }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });
    if (!token) {
      const error = new Error('Erro ao criar o token de autenticação de usuário') as CustomError;
      error.statusCode = 401;
      next(error);
    } else {
      return token;
    }
  } catch (error) {
    next(error);
  }
};

export const verifyToken = (token: string, next: NextFunction) => {
  try {
    const decoded = verify(token, process.env.SECRET_KEY);
    return decoded;
  } catch (error) {
    const customError = error as CustomError;
    customError.message = 'Token inválido!';
    customError.statusCode = 401;
    next(error);
  }
};
