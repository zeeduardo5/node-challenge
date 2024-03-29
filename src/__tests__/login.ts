import app from '../app';
import supertest from 'supertest';
import axios, { AxiosError, AxiosHeaders } from 'axios';
import { apiUserResponseMock } from './__mocks__/userMock';
import { ErrorMessages } from '../messages/error';
import {
  mockAxiosPostError,
  mockAxiosPostSuccess,
} from './__mocks__/axiosRequestsMock';

jest.mock('axios');

const request = supertest(app);
const validCredentials = {
  username: 'username',
  password: 'password',
};

describe('POST /login', () => {
  beforeEach(() => {
    mockAxiosPostSuccess();
  });

  afterEach(() => jest.resetAllMocks());

  it('should login user succesfully', async () => {
    const response = await request.post('/login').send(validCredentials);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(response.body.username).toBe(apiUserResponseMock.username);
  });

  it('should return an user object', async () => {
    const response = await request.post('/login').send(validCredentials);
    const user = response.body;

    expect(user).toHaveProperty('firstName');
    expect(user).toHaveProperty('lastName');
    expect(user).toHaveProperty('token');
    expect(user).toHaveProperty('username');

    expect(user.hasOwnProperty('gender')).toBeFalsy();
    expect(user.hasOwnProperty('image')).toBeFalsy();
  });

  it('should fail schema validation', async () => {
    const response = await request.post('/login').send({
      username: 'test',
    });
    expect(axios.post).toHaveBeenCalledTimes(0);
    expect(response.status).toBe(400);
  });

  it('should fail to login with with external api error', async () => {
    const error = new AxiosError();
    error.response = {
      config: { headers: new AxiosHeaders() },
      data: 'Invalid Credentials',
      headers: {},
      status: 401,
      statusText: '401 Unauthorized',
    };

    mockAxiosPostError(error);

    const response = await request.post('/login').send(validCredentials);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(401);
    expect(response.text).toBe('Invalid Credentials');
  });

  it('should fail to login with unknown error', async () => {
    mockAxiosPostError();
    const response = await request.post('/login').send(validCredentials);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(500);
    expect(response.text).toBe(ErrorMessages.LOGIN);
  });
});
