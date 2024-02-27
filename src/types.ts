import { z } from "zod";
import { UserCredentialsSchema } from "./validation/schemas";

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

export type UserCredentials = z.infer<typeof UserCredentialsSchema>;
