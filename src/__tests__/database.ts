import { DatabaseService } from '../database/database.service';
import { productsMock } from './__mocks__/productsMock';

let db: DatabaseService;
const customerID = 1;
const [mockProduct1, mockProduct2] = productsMock;

describe('GET /', () => {
  beforeAll(() => {});
  beforeEach(() => {
    db = new DatabaseService();
  });

  it('should add one product', async () => {
    const cart = db.addProduct(customerID, mockProduct1);
    expect(cart.totalProducts).toBe(1);
    expect(cart.total).toBe(mockProduct1.price);
    expect(cart.products.length).toBe(1);
  });

  it('should increase product quantity when add duplicate product', async () => {
    db.addProduct(customerID, mockProduct1);
    const cart = db.addProduct(customerID, mockProduct1);

    expect(cart.totalProducts).toBe(2);
    expect(cart.total).toBe(mockProduct1.price * 2);
    expect(cart.products.length).toBe(1);
    expect(cart.products[0].quantity).toBe(2);
  });

  it('should add another product with different product id', async () => {
    db.addProduct(customerID, mockProduct1);
    const cart = db.addProduct(customerID, mockProduct2);

    expect(cart.totalProducts).toBe(2);
    expect(cart.total).toBe(mockProduct1.price + mockProduct2.price);
    expect(cart.products.length).toBe(2);
  });

  it('should add another product with different customer id', async () => {
    const cartCustomer1 = db.addProduct(customerID, mockProduct1);
    const cartCustomer2 = db.addProduct(2, mockProduct1);

    expect(cartCustomer1.totalProducts).toBe(1);
    expect(cartCustomer2.totalProducts).toBe(1);
  });
});
