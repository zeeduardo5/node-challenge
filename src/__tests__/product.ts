import app from '../app';
import supertest from 'supertest';
import axios, { AxiosError } from 'axios';
import { productsMock } from './__mocks__/productMock';
import { Product } from '../types';
import { ErrorMessages } from '../messages/error';

jest.mock('axios');
const request = supertest(app);

function mockAxiosGetSuccess() {
  (axios.get as jest.Mock).mockImplementation(() =>
    Promise.resolve({
      data: {
        products: [...productsMock],
      },
    })
  );
}

function mockAxiosGetError(axiosError?: AxiosError) {
  (axios.get as jest.Mock).mockImplementation(() =>
    Promise.reject(axiosError ?? null)
  );
}

describe('GET /products', () => {
  it('should return a list of products', async () => {
    mockAxiosGetSuccess();
    const response = await request.get('/products');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should return sorted products', async () => {
    const response = await request.get('/products');
    const products: Product[] = response.body;

    expect(products[0].id).toBe(productsMock[2].id);
    expect(products[0].title.localeCompare(products[1].title)).toBeLessThan(0);
  });

  it('should return an array of Product', async () => {
    const response = await request.get('/products');
    const products = response.body;
    const firstProduct = products[0];
    expect(firstProduct.hasOwnProperty('title')).toBeTruthy();
    expect(firstProduct.hasOwnProperty('description')).toBeTruthy();
    expect(firstProduct.hasOwnProperty('id')).toBeTruthy();
    expect(firstProduct.hasOwnProperty('price')).toBeTruthy();
    expect(firstProduct.hasOwnProperty('thumbnail')).toBeTruthy();

    expect(firstProduct.hasOwnProperty('brand')).toBeFalsy();
    expect(firstProduct.hasOwnProperty('category')).toBeFalsy();
  });

  it('should fail to return products', async () => {
    const error = new AxiosError();
    error.status = 400;

    mockAxiosGetError(error);
    const response = await request.get('/products');
    expect(response.status).toBe(400);
    expect(response.text).toBe(ErrorMessages.PRODUCTS);
  });

  it('should fail to return products with unknown error', async () => {
    mockAxiosGetError();
    const response = await request.get('/products');

    expect(response.status).toBe(500);
    expect(response.text).toBe(ErrorMessages.PRODUCTS);
  });
});
