import { z } from 'zod';

export const UserCredentialsSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const ProductIdSchema = z.object({
  productId: z.preprocess((val) => {
    if (typeof val === 'string' && val.length > 0) {
      return Number(val);
    }
    return val;
  }, z.number()),
});
