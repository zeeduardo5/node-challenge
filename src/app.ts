import express, { Request, Response, NextFunction } from 'express';
import { AxiosError } from 'axios';
import { CartPayload, CredentialsPayload } from './types';
import { ErrorMessages } from './messages/error';
import { ProductIdSchema, UserCredentialsSchema } from './validation/schemas';
import { authenticate } from './middleware/authenticate';

import { ProductsController } from './controllers/products';
import { LoginController } from './controllers/login';
import { CartController } from './controllers/cart';

const app = express();

const productsController = new ProductsController();
const loginController = new LoginController();
const cartController = new CartController();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await productsController.getProducts();
    return res.status(200).json(products);
  } catch (e) {
    if (e instanceof AxiosError) {
      return res.status(e.status ?? 500).send(ErrorMessages.PRODUCTS);
    }
    return res.status(500).send(ErrorMessages.PRODUCTS);
  }
});

app.post('/products', async (req: Request, res: Response) => {
  res.send();
});

app.post('/login', async (req: Request, res: Response) => {
  const payloadValidation = UserCredentialsSchema.safeParse(req.body);

  if (!payloadValidation.success) {
    return res.status(400).send(payloadValidation.error.format());
  }

  const credentialsPayload: CredentialsPayload = payloadValidation.data;

  try {
    const user = await loginController.login(credentialsPayload);
    return res.status(200).json(user);
  } catch (e) {
    if (e instanceof AxiosError) {
      return res.status(e.status ?? 401).send(e?.response?.data);
    }
    return res.status(500).send(ErrorMessages.LOGIN);
  }
});

app.post('/cart', authenticate, async (req: Request, res: Response) => {
  const payloadValidation = ProductIdSchema.safeParse(req.body);

  if (!payloadValidation.success) {
    return res.status(400).send(payloadValidation.error.format());
  }

  const cartPayload: CartPayload = payloadValidation.data;

  try {
    const product = await productsController.getProductById(
      cartPayload.productId
    );

    if (!product || !product.id) {
      return res.status(400).send(ErrorMessages.INVALID_PRODUCT);
    }
    return res
      .status(201)
      .json(cartController.addProductToCart(res.locals.customerId, product));
  } catch (e) {
    if (e instanceof AxiosError) {
      return res.status(e.status ?? 400).send(e?.response?.data);
    }
    return res.status(500).send(ErrorMessages.PRODUCT);
  }
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send();
});

export default app;
