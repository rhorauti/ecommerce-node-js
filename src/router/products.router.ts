import { Request, Response, NextFunction, Router } from 'express';

const productRouter = Router();

productRouter.get('/product', (request: Request, response: Response, next: NextFunction) => {});

export { productRouter };
