import { CustomError } from '@src/core/interfaces/IError';
import { verifyToken } from '@src/services/jwt.service';
import { NextFunction, Request, Response } from 'express';

export const onCheckValidToken = (request: Request, response: Response, next: NextFunction) => {
  if (
    request.path.includes('/v1/user/login') ||
    request.path.includes('/v1/user/signup') ||
    request.path.includes('/v1/user/check-token') ||
    request.path.includes('v1/user/password-recover') ||
    request.path.includes('v1/user/new-password')
  ) {
    console.log('jwt token skip condition...')
    next();
  } else {
    try {
      console.log('headers', request.headers);
      const token = request.headers.authorization.split(' ')[1];
      const decoded = verifyToken(token, next);
      if (decoded) {
        next();
      } else {
        const error = new Error('Token inválido!') as CustomError;
        error.statusCode = 401;
        next(error);
      }
    } catch (error) {
      next(error);
    }
  }
};
