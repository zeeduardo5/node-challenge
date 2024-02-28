import app from '../app';
import supertest from 'supertest';
import axios, { AxiosError, AxiosHeaders } from 'axios';
import { ErrorMessages } from '../messages/error';
import {
  mockAxiosGetAuthSuccessAndProductError,
  mockAxiosGetRequestSuccess,
} from './__mocks__/axiosRequestsMock';

const request = supertest(app);

const baseUrl = 'https://dummyjson.com';

const cartPayload = {
  productId: 1,
};
jest.mock('axios');

describe('POST /cart', () => {
  beforeEach(() => {
    mockAxiosGetRequestSuccess();
  });

  afterEach(() => jest.resetAllMocks());

  it('should fail without token', async () => {
    const response = await request.post('/cart').send(cartPayload);
    expect(axios.get).toHaveBeenCalledTimes(0);
    expect(response.status).toBe(401);
    expect(response.text).toBe(ErrorMessages.NO_TOKEN);
  });

  it('should fail with invalid payload', async () => {
    const response = await request.post('/cart').set('authorization', 'token');
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(400);
  });

  it('should add product to the in memory db', async () => {
    const response = await request
      .post('/cart')
      .set('authorization', 'token')
      .send(cartPayload);

    expect(response.status).toBe(200);
    const userCart = response.body;
    expect(userCart[0].productId).toBe(1);
    expect(userCart[0].quantity).toBe(1);
  });

  it('should not duplicate products', async () => {
    await request.post('/cart').set('Authorization', 'token').send(cartPayload);
    const response = await request
      .post('/cart')
      .set('Authorization', 'token')
      .send(cartPayload);

    const userCart = response.body;

    expect(userCart.length).toBe(1);
    expect(userCart[0].productId).toBe(1);
    expect(userCart[0].quantity).toBe(3);
  });

  it('should fail to add product that does not exists', async () => {
    mockAxiosGetRequestSuccess({})
    const response = await request
      .post('/cart')
      .set('authorization', 'token')
      .send(cartPayload);

    expect(response.status).toBe(400);
  });

  it('should fail to add product when get product fails with unknow error', async () => {
    mockAxiosGetAuthSuccessAndProductError();

    const response = await request
      .post('/cart')
      .set('authorization', 'token')
      .send(cartPayload);

    expect(response.status).toBe(500);
    expect(response.text).toBe(ErrorMessages.PRODUCT);
  });

  it('should fail to add product when get product fails with axios error', async () => {
    const error = new AxiosError();
    error.response = {
      config: { headers: new AxiosHeaders() },
      data: 'Axios error',
      headers: {},
      status: 400,
      statusText: '400 Bad Request',
    };

    mockAxiosGetAuthSuccessAndProductError(error);

    const response = await request
      .post('/cart')
      .set('authorization', 'token')
      .send(cartPayload);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Axios error');
  });
});
