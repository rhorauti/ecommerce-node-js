import { CustomError } from '@src/core/interfaces/IError';
import { NextFunction, Request, Response } from 'express';

export const errorHandling = (
  error: CustomError,
  request: Request,
  response: Response,
  next: NextFunction
): Response => {
  if (!error.statusCode) error.statusCode = 500;
  if (!error.message) error.message = 'Erro interno do servidor';
  if (!error.status) error.status = false;
  return response.status(error.statusCode).json({
    date: new Date().toString(),
    status: error.status,
    message: error.message,
  });
};
