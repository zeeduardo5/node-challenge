import express, { Request, Response, NextFunction } from "express";
import json from "body-parser";
import axios, { AxiosError } from "axios";
import { Product } from "./types";
import { ErrorMessages } from "./messages/error";

const app = express();

app.use(json());

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
  res.send();
});

app.post("/cart", async (req: Request, res: Response) => {
  res.send();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send();
});

export default app;
