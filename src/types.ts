import { z } from 'zod';
import { UserCredentialsSchema } from './validation/schemas';

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
};

export type User = {
  username: string;
  firstName: string;
  lastName: string;
  avatar: string;
  token: string;
};

export type CartPayload = {
  productId: number;
};

export type CredentialsPayload = z.infer<typeof UserCredentialsSchema>;

export type CustomerId = number;

export type ProductId = number;

export type Cart = {
  quantity: number;
};

export type UserCart = Map<ProductId, Cart>;

export type InMemoryDatabase = Map<CustomerId, UserCart>;

export type TokenPayload = User & { id: number };
