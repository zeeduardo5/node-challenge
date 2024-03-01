import { Product } from '../types';
import { DatabaseService } from '../database/database.service';

export class CartController {
  private db: DatabaseService;
  constructor() {
    this.db = new DatabaseService();
  }
  addProductToCart(customerId: number, product: Product) {
    return this.db.addProduct(customerId, product);
  }
}
