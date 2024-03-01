import app from '../app';
import supertest from 'supertest';
import axios, { AxiosError } from 'axios';
import { productsMock } from './__mocks__/productsMock';
import { Product } from '../types';
import { ErrorMessages } from '../messages/error';
import {
  mockAxiosGetError,
  mockAxiosGetRequestSuccess,
} from './__mocks__/axiosRequestsMock';

jest.mock('axios');
const request = supertest(app);

describe('GET /products', () => {
  beforeEach(() => {
    mockAxiosGetRequestSuccess();
  });

  afterEach(() => jest.resetAllMocks());

  it('should return a list of products', async () => {
    const response = await request.get('/products');

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should return sorted products', async () => {
    const response = await request.get('/products');
    const products: Product[] = response.body;

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(products[0].id).toBe(productsMock[2].id);
    expect(products[0].title.localeCompare(products[1].title)).toBeLessThan(0);
  });

  it('should return an array of Product type', async () => {
    const response = await request.get('/products');
    const products = response.body;
    const firstProduct = products[0];

    expect(axios.get).toHaveBeenCalledTimes(1);

    expect(firstProduct).toHaveProperty('title');
    expect(firstProduct).toHaveProperty('id');
    expect(firstProduct).toHaveProperty('description');
    expect(firstProduct).toHaveProperty('price');
    expect(firstProduct).toHaveProperty('thumbnail');

    expect(firstProduct.hasOwnProperty('brand')).toBeFalsy();
    expect(firstProduct.hasOwnProperty('category')).toBeFalsy();
  });

  it('should fail to return products with external api error', async () => {
    const error = new AxiosError();
    error.status = 400;
    mockAxiosGetError(error);

    const response = await request.get('/products');

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(400);
    expect(response.text).toBe(ErrorMessages.PRODUCTS);
  });

  it('should fail to return products with unknown error', async () => {
    mockAxiosGetError();

    const response = await request.get('/products');

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(500);
    expect(response.text).toBe(ErrorMessages.PRODUCTS);
  });
});
