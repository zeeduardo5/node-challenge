import { DatabaseService } from '../database/database.service';

let db: DatabaseService;
const customerID = 1;

describe('GET /', () => {
  beforeAll(() => {
    db = new DatabaseService();
  });

  it('should add one product', async () => {
    const cart = db.addProduct(customerID, 1);
    expect(cart[0].productId).toBe(1);
    expect(cart[0].quantity).toBe(1);
  });

  it('should increase quantity when add duplicate product', async () => {
    const cart = db.addProduct(customerID, 1);
    expect(cart[0].productId).toBe(1);
    expect(cart[0].quantity).toBe(2);
  });

  it('should add another product with different product id', async () => {
    const cart = db.addProduct(customerID, 2);
    expect(cart[0].productId).toBe(1);
    expect(cart[1].productId).toBe(2);
  });

  it('should add another product with different customer id', async () => {
    const cart = db.addProduct(2, 2);
    expect(cart[0].productId).toBe(2);
    expect(cart[1]).toBeUndefined();
  });
});
