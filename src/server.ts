import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { mongodb } from '@src/models';
import { routerUser } from './router/user.router';
import swaggerUi from 'swagger-ui-express';
import { swaggerTemplate } from './swagger';
import { errorHandling } from './middlewares/error.middleware';
import { onCheckValidToken } from './middlewares/jwtCheck.middleware';
import { productRouter } from './router/products.router';

export const app = express();
app.use(cors());
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerTemplate));
app.use(onCheckValidToken);
app.use('/v1', routerUser);
app.use('/v1', productRouter);
app.use(errorHandling);

mongodb
  .then((result) => {
    app.listen(process.env.PORT, () => {
      console.log(`Application is listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => console.log(error));
