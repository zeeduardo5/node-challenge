import { Cart, InMemoryDatabase, UserCart } from '../types';

export class DatabaseService {
  db: InMemoryDatabase;
  constructor() {
    this.db = new Map();
  }

  public addProduct(customerId: number, productId: number) {
    const currentUserCart = this.getCurrentUserCart(customerId);
    let quantity = 1;

    if (currentUserCart.has(productId)) {
      quantity = currentUserCart.get(productId)!.quantity + 1;
    }

    currentUserCart.set(productId, {
      quantity,
    });

    this.db.set(customerId, currentUserCart);

    return this.getFormatedUserCart(currentUserCart);
  }

  private getCurrentUserCart(customerId: number): UserCart {
    if (!this.db.has(customerId)) {
      this.db.set(customerId, new Map<number, Cart>());
    }

    return this.db.get(customerId)!;
  }

  private getFormatedUserCart(cart: UserCart) {
    return Array.from(cart, ([key, value]) => ({
      productId: key,
      quantity: value.quantity,
    }));
  }
}
