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

export type CartProduct = {
  quantity: number;
  product: Product;
};

export type CustomerCart = {
  totalProducts: number;
  total: number;
  cartProducts: CartProducts;
};

export type CartResponse = {
  products: CartProduct[];
  total: number;
  totalProducts: number;
  customerId: number;
}

export type CartProducts = Map<ProductId, CartProduct>;

export type InMemoryDatabase = Map<CustomerId, CustomerCart>;

export type TokenPayload = User & { id: number };
