import app from '../app';
import supertest from 'supertest';
import axios, { AxiosError, AxiosHeaders } from 'axios';
import { ErrorMessages } from '../messages/error';
import {
  mockAxiosGetError,
  mockAxiosGetRequestSuccess,
} from './__mocks__/axiosRequestsMock';
import jwt from 'jsonwebtoken';
import { CartResponse } from '../types';

const request = supertest(app);

const cartPayload = {
  productId: 1,
};
jest.mock('axios');
jest.mock('jsonwebtoken');

function mockJwtDecode() {
  (jwt.decode as jest.Mock).mockImplementation(() => ({ id: 15 }));
}

describe('POST /cart', () => {
  beforeEach(() => {
    mockJwtDecode();
    mockAxiosGetRequestSuccess();
  });

  afterEach(() => jest.resetAllMocks());

  it('should add product to cart', async () => {
    const response = await request
      .post('/cart')
      .set('authorization', 'token')
      .send(cartPayload);

    const userCart: CartResponse = response.body;

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(201);
    expect(userCart.totalProducts).toBe(1);
    expect(userCart.products[0].quantity).toBe(1);
  });

  it('should not duplicate products in the cart', async () => {
    await request.post('/cart').set('Authorization', 'token').send(cartPayload);

    const response = await request
      .post('/cart')
      .set('Authorization', 'token')
      .send(cartPayload);

    const userCart: CartResponse = response.body;

    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(userCart.totalProducts).toBe(3);
    expect(userCart.products[0].quantity).toBe(3);
    expect(userCart.products.length).toBe(1);
  });

  it('should parse product id as numeric string', async () => {
    const response = await request
      .post('/cart')
      .set('authorization', 'token')
      .send({ productId: '10' });

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(201);
  });

  it('should fail without token', async () => {
    const response = await request.post('/cart').send(cartPayload);

    expect(axios.get).toHaveBeenCalledTimes(0);
    expect(response.status).toBe(401);
    expect(response.text).toBe(ErrorMessages.NO_TOKEN);
  });

  it('should fail without payload', async () => {
    const response = await request.post('/cart').set('authorization', 'token');

    expect(axios.get).toHaveBeenCalledTimes(0);
    expect(response.status).toBe(400);
  });

  it('should fail with invalid payload', async () => {
    const response = await request
      .post('/cart')
      .set('authorization', 'token')
      .send({
        productId: '',
      });

    expect(axios.get).toHaveBeenCalledTimes(0);
    expect(response.status).toBe(400);
  });

  it('should fail to add product that does not exists', async () => {
    mockAxiosGetRequestSuccess({});

    const response = await request
      .post('/cart')
      .set('authorization', 'token')
      .send(cartPayload);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(400);
    expect(response.text).toBe(ErrorMessages.INVALID_PRODUCT);
  });

  it('should fail to add product when get product fails with unknow error', async () => {
    mockAxiosGetError();

    const response = await request
      .post('/cart')
      .set('authorization', 'token')
      .send(cartPayload);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(500);
    expect(response.text).toBe(ErrorMessages.PRODUCT);
  });

  it('should fail to add product when get product fails with external api error', async () => {
    const error = new AxiosError();
    error.response = {
      config: { headers: new AxiosHeaders() },
      data: 'Axios error',
      headers: {},
      status: 400,
      statusText: '400 Bad Request',
    };

    mockAxiosGetError(error);

    const response = await request
      .post('/cart')
      .set('authorization', 'token')
      .send(cartPayload);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Axios error');
  });
});
