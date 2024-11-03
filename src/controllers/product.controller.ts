import { TYPES } from '@src/containers/types';
import { ProductRepository } from '@src/repositories/product.respository';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class ProductController {
  constructor(@inject(TYPES.ProductRepository) private productRepository: ProductRepository) {}

  async getAllProductsList(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response> {
    const productList = this.productRepository.getAllProducts();
    if (!productList) {
      return;
    }
    return;
  }
}
