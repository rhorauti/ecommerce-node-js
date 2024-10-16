import Router, { NextFunction, Request, Response } from 'express';
import { container } from '@src/containers/inversify.config';
import { TYPES } from '@src/containers/types';
import { UserController } from '@src/controllers/user.controller';
import { body, query, validationResult } from 'express-validator';

const routerUser = Router();
const userController = container.get<UserController>(TYPES.UserController);
const sendErrorResponse = (request: Request, response: Response, next: NextFunction) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({
      status: false,
      message: errors.array()[0].msg,
    });
  }
  next();
};

routerUser.post(
  '/user/login',
  [
    body('email')
      .notEmpty()
      .withMessage('O campo email não pode estar vazio!')
      .isEmail()
      .withMessage('Formato de email inválido!'),
    body('password').notEmpty().withMessage('O campo senha não pode estar vazio!'),
  ],
  (request: Request, response: Response, next: NextFunction) => {
    sendErrorResponse(request, response, next);
  },
  (request: Request, response: Response, next: NextFunction) => {
    userController.authenticateUser(request, response, next);
  }
);

routerUser.post(
  '/user/signup',
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
    sendErrorResponse(request, response, next);
  },
  (request: Request, response: Response, next: NextFunction) => {
    userController.addNewUser(request, response, next);
  }
);

routerUser.get(
  '/user/check-token',
  [
    query('token')
      .exists()
      .withMessage('Token inexistente!')
      .isString()
      .withMessage('O token deve ser uma string'),
  ],
  (request: Request, response: Response, next: NextFunction) => {
    sendErrorResponse(request, response, next);
  },
  (request: Request, response: Response, next: NextFunction) => {
    userController.validateToken(request, response, next);
  }
);

routerUser.post(
  '/user/password-recover',
  (request: Request, response: Response, next: NextFunction) => {
    console.log('password-recover', request.body.email);
    userController.sendRecoverEmail(request, response, next);
  }
);

routerUser.put('/user/new-password', (request: Request, response: Response, next: NextFunction) => {
  userController.updatePassword(request, response, next);
});

export { routerUser };
