import {
  CartProduct,
  InMemoryDatabase,
  Product,
  ProductId,
  UserCart,
} from '../types';

export class DatabaseService {
  db: InMemoryDatabase;
  constructor() {
    this.db = new Map();
  }

  public addProduct(customerId: number, product: Product) {
    const currentUserCart = this.getCurrentUserCart(customerId);
    const { cartProducts } = currentUserCart;
    let quantity = 1;

    currentUserCart.total += product.price;
    currentUserCart.totalProducts += 1;

    if (cartProducts.has(product.id)) {
      quantity = cartProducts.get(product.id)!.quantity + 1;
    }

    cartProducts.set(product.id, {
      quantity,
      product,
    });

    currentUserCart.cartProducts = new Map(cartProducts);

    this.db.set(customerId, currentUserCart);

    return this.getCartResponse(currentUserCart, customerId);
  }

  private getCurrentUserCart(customerId: number): UserCart {
    if (!this.db.has(customerId)) {
      this.db.set(customerId, this.initializeCustomerCart());
    }

    return this.db.get(customerId)!;
  }

  private getCartResponse(cart: UserCart, customerId: number) {
    const { cartProducts, total, totalProducts } = cart;
    return {
      products: Array.from(cartProducts, ([, value]) => value),
      total,
      totalProducts,
      customerId,
    };
  }

  private initializeCustomerCart(): UserCart {
    return {
      total: 0,
      totalProducts: 0,
      cartProducts: new Map<ProductId, CartProduct>(),
    };
  }
}
