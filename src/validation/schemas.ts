import { z } from "zod";

export const UserCredentialsSchema = z.object({
  username: z.string(),
  password: z.string(),
});

