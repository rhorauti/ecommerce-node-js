import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { UserController } from '@src/controllers/user.controller';
import { UserRepository } from '@src/repositories/user.respository';
import { EmailSender } from '@src/services/email.service';

const container = new Container();

container.bind<UserController>(TYPES.UserController).to(UserController);
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<EmailSender>(TYPES.EmailSender).to(EmailSender);

export { container };
