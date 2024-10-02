import { Container } from 'inversify';
import 'reflect-metadata';
import { TYPES } from './types';
import { UserController } from '@src/controllers/user.controller';
import { UserRepository } from '@src/repositories/user.respository';

const container = new Container();

container.bind(TYPES.UserController).to(UserController);
container.bind(TYPES.UserRepository).to(UserRepository);

export { container };
