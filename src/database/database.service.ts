import {
  CartProduct,
  CartResponse,
  CustomerCart,
  InMemoryDatabase,
  Product,
  ProductId,
} from '../types';

export class DatabaseService {
  db: InMemoryDatabase;

  constructor() {
    this.db = new Map();
  }

  public addProduct(customerId: number, product: Product): CartResponse {
    const customerCart = this.getCustomerCart(customerId);
    const { cartProducts } = customerCart;
    let quantity = 1;

    customerCart.total += product.price;
    customerCart.totalProducts += 1;

    if (cartProducts.has(product.id)) {
      quantity = cartProducts.get(product.id)!.quantity + 1;
    }

    cartProducts.set(product.id, {
      quantity,
      product,
    });

    customerCart.cartProducts = new Map(cartProducts);

    this.db.set(customerId, customerCart);

    return this.getCartResponse(customerCart, customerId);
  }

  private getCustomerCart(customerId: number): CustomerCart {
    if (!this.db.has(customerId)) {
      this.db.set(customerId, this.initializeCustomerCart());
    }

    return this.db.get(customerId)!;
  }

  private getCartResponse(cart: CustomerCart, customerId: number) {
    const { cartProducts, total, totalProducts } = cart;
    return {
      products: Array.from(cartProducts, ([, value]) => value),
      total,
      totalProducts,
      customerId,
    };
  }

  private initializeCustomerCart(): CustomerCart {
    return {
      total: 0,
      totalProducts: 0,
      cartProducts: new Map<ProductId, CartProduct>(),
    };
  }
}
