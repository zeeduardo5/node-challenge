import express, { Request, Response, NextFunction } from 'express';
import json from 'body-parser';
import fetch from 'node-fetch';
import { Product } from './types';

const app = express();

app.use(json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.get('/products', async (req: Request, res: Response) => {
  const products: Product[] = [];
  // put your code here
  res.send(products);
});

app.post('/products', async (req: Request, res: Response) => {
  res.send();
});

app.post('/login', async (req: Request, res: Response) => {
  res.send();
});

app.post('/cart', async (req: Request, res: Response) => {
  res.send();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send();
});

export default app;
