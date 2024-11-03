import { ProductModel } from '@src/models/product.model';
import { injectable } from 'inversify';

@injectable()
export class ProductRepository {
  async getAllProducts() {
    return await ProductModel.find();
  }
}
