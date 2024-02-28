import express, { Request, Response, NextFunction } from 'express';
import axios, { AxiosError } from 'axios';
import { CartPayload, CredentialsPayload, Product, User } from './types';
import { ErrorMessages } from './messages/error';
import { ProductIdSchema, UserCredentialsSchema } from './validation/schemas';
import { authenticate } from './middleware/authenticate';
import { DatabaseService } from './database/database.service';

const app = express();

const baseUrl = process.env.URL ?? 'https://dummyjson.com';
const db = new DatabaseService();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.get('/products', async (req: Request, res: Response) => {
  try {
    const { products } = (
      await axios.get<{ products: Product[] }>(`${baseUrl}/products`)
    ).data;

    const filteredAndSortedProducts = products
      .map(({ id, title, description, price, thumbnail }) => ({
        id,
        title,
        description,
        price,
        thumbnail,
      }))
      .sort((product1, product2) =>
        product1.title.localeCompare(product2.title)
      );

    return res.send(filteredAndSortedProducts);
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
  let credentialsPayload: CredentialsPayload;

  try {
    credentialsPayload = UserCredentialsSchema.parse(req.body);
  } catch (e) {
    return res.status(400).send(e);
  }

  try {
    const user = (
      await axios.post<User>(
        `${baseUrl}/auth/login`,
        JSON.stringify(credentialsPayload),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    ).data;
    return res.send({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      token: user.token,
    });
  } catch (e) {
    if (e instanceof AxiosError) {
      return res.status(e.status ?? 401).send(e?.response?.data);
    }
    return res.status(500).send(ErrorMessages.LOGIN);
  }
});

app.post('/cart', authenticate, async (req: Request, res: Response) => {
  let cartPayload: CartPayload;

  try {
    cartPayload = ProductIdSchema.parse(req.body);
  } catch (e) {
    return res.status(400).send(e);
  }

  try {
    const product = (
      await axios.get<Product>(`${baseUrl}/products/${cartPayload.productId}`)
    ).data;

    if (!product || !product.id) {
      return res.status(400).send(ErrorMessages.INVALID_PRODUCT);
    }
  } catch (e) {
    if (e instanceof AxiosError) {
      return res.status(e.status ?? 400).send(e?.response?.data);
    }
    return res.status(500).send(ErrorMessages.PRODUCT);
  }

  return res.send(db.addProduct(res.locals.customerId, cartPayload.productId));
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send();
});

export default app;
