import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { UserController } from '@src/controllers/user.controller';
import { UserRepository } from '@src/repositories/user.respository';
import { EmailSender } from '@src/services/email.service';
import { ProductController } from '@src/controllers/product.controller';
import { ProductRepository } from '@src/repositories/product.respository';

const container = new Container();

container.bind<UserController>(TYPES.UserController).to(UserController);
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<ProductController>(TYPES.ProductController).to(ProductController);
container.bind<ProductRepository>(TYPES.ProductRepository).to(ProductRepository);
container.bind<EmailSender>(TYPES.EmailSender).to(EmailSender);

export { container };
