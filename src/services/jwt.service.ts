import { CustomError } from '@src/core/interfaces/IError';
import { NextFunction, Request, Response } from 'express';
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

export const checkToken = (request: Request, response: Response, next: NextFunction) => {
  if (request.path.includes('/v1/user/login') || request.path.includes('/v1/user/signup')) {
    next();
  } else {
    try {
      const token = request.headers.authorization.split(' ')[1];
      const payload = verify(token, process.env.SECRET_KEY);
      next();
    } catch (error) {
      (error as CustomError).statusCode = 401;
      (error as CustomError).message = 'Usuário não autorizado!';
      next(error);
    }
  }
};
