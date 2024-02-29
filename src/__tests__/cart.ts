import app from '../app';
import supertest from 'supertest';
import axios, { AxiosError, AxiosHeaders } from 'axios';
import { ErrorMessages } from '../messages/error';
import {
  mockAxiosGetError,
  mockAxiosGetRequestSuccess,
} from './__mocks__/axiosRequestsMock';
import jwt from 'jsonwebtoken';

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

  it('should fail without token', async () => {
    const response = await request.post('/cart').send(cartPayload);

    expect(axios.get).toHaveBeenCalledTimes(0);
    expect(response.status).toBe(401);
    expect(response.text).toBe(ErrorMessages.NO_TOKEN);
  });

  it('should fail with invalid payload', async () => {
    const response = await request.post('/cart').set('authorization', 'token');

    expect(axios.get).toHaveBeenCalledTimes(0);
    expect(response.status).toBe(400);
  });

  it('should add product to the in memory db', async () => {
    const response = await request
      .post('/cart')
      .set('authorization', 'token')
      .send(cartPayload);

    const userCart = response.body;

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
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

    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(userCart.length).toBe(1);
    expect(userCart[0].productId).toBe(1);
    expect(userCart[0].quantity).toBe(3);
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

  it('should fail to add product when get product fails with axios error', async () => {
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
