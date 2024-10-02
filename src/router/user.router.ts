import Router, { NextFunction, Request, Response } from 'express';
import { container } from '@src/containers/inversify.config';
import { TYPES } from '@src/containers/types';
import { UserController } from '@src/controllers/user.controller';
import { body, validationResult } from 'express-validator';

const routerUser = Router();
const userController = container.get<UserController>(TYPES.UserController);

routerUser.post(
  `/user/signup`,
  [
    body('email')
      .notEmpty()
      .withMessage('O campo email não pode estar vazio!')
      .isEmail()
      .withMessage('Email inválido!'),
    body('username').notEmpty().withMessage('Username não pode estar vazio!'),
    body('password')
      .notEmpty()
      .withMessage('O campo senha não pode estar vazio!')
      .isStrongPassword({
        minLength: 6,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
      })
      .withMessage('Senha inválida!'),
  ],
  (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0];
      return response
        .status(400)
        .json({ status: false, message: firstError.msg, param: firstError.type });
    }
    next();
  },
  (request: Request, response: Response, next: NextFunction) => {
    userController.onUserCreation(request, response, next);
  }
);

export { routerUser };
