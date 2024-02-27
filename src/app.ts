import express, { Request, Response, NextFunction } from "express";
import axios, { AxiosError } from "axios";
import { Product, User, UserCredentials } from "./types";
import { ErrorMessages } from "./messages/error";
import { UserCredentialsSchema } from "./validation/schemas";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.get("/products", async (req: Request, res: Response) => {
  try {
    const { products } = (
      await axios.get<{ products: Product[] }>(`https://dummyjson.com/products`)
    ).data;

    const filteredProducts = products
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

    return res.send(filteredProducts);
  } catch (e) {
    if (e instanceof AxiosError) {
      return res.status(e.status ?? 500).send(ErrorMessages.PRODUCTS);
    }
    return res.status(500).send(ErrorMessages.PRODUCTS);
  }
});

app.post("/products", async (req: Request, res: Response) => {
  res.send();
});

app.post("/login", async (req: Request, res: Response) => {
  let credentials: UserCredentials;
  try {
    credentials = UserCredentialsSchema.parse(req.body);
  } catch (e) {
    return res.status(400).send(e);
  }

  try {
    const user = (
      await axios.post<User>(
        "https://dummyjson.com/auth/login",
        JSON.stringify(credentials),
        {
          headers: {
            "Content-Type": "application/json",
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

app.post("/cart", async (req: Request, res: Response) => {
  res.send();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send();
});

export default app;
