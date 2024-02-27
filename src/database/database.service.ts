import { Cart, InMemoryDatabase, UserCart } from "../types";

export class DatabaseService {
  db: InMemoryDatabase;
  constructor() {
    this.db = new Map();
  }

  public addProduct(userId: number, productId: number) {
    const currentUserCart = this.getCurrentUserCart(userId);
    let quantity = 1;

    if (currentUserCart.has(productId)) {
      quantity = currentUserCart.get(productId)!.quantity + 1;
    }

    currentUserCart.set(productId, {
      quantity,
    });

    this.db.set(userId, currentUserCart);

    return this.getFormatedUserCart(currentUserCart);
  }

  private getCurrentUserCart(userId: number): UserCart {
    if (!this.db.has(userId)) {
      this.db.set(userId, new Map<number, Cart>());
    }

    return this.db.get(userId)!;
  }

  private getFormatedUserCart(cart: UserCart) {
    return Array.from(cart, ([key, value]) => ({
      productId: key,
      quantity: value.quantity,
    }));
  }
}
