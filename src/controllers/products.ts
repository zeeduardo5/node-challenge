import axios from 'axios';
import { Product } from '../types';
import { PRODUCTS_URL } from '../constants';

export class ProductsController {
  async getProducts(): Promise<Product[]> {
    let { products } = (await axios.get<{ products: Product[] }>(PRODUCTS_URL))
      .data;

    products = this.filterProducts(products);
    products = this.sortProductsAlphabetical(products);
    return products;
  }

  private sortProductsAlphabetical(products: Product[]) {
    return [...products].sort((product1, product2) =>
      product1.title.localeCompare(product2.title)
    );
  }

  private filterProducts(products: Product[]) {
    return products.map((product) =>
      this.extractRequiredProductProperties(product)
    );
  }

  private extractRequiredProductProperties(product: Product): Product {
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail,
    };
  }

  async getProductById(productId: number): Promise<Product> {
    const product = (await axios.get<Product>(`${PRODUCTS_URL}/${productId}`))
      .data;
    return this.extractRequiredProductProperties(product);
  }
}
