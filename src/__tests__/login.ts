import app from '../app';
import supertest from 'supertest';
import axios, { AxiosError, AxiosHeaders } from 'axios';
import { UserMock } from './__mocks__/userMock';
import { ErrorMessages } from '../messages/error';

const request = supertest(app);
const validCredentials = {
  username: 'username',
  password: 'password',
};
jest.mock('axios');

function mockAxiosPostSuccess() {
  (axios.post as jest.Mock).mockImplementation(() =>
    Promise.resolve({ data: UserMock })
  );
}

function mockAxiosPostError(axiosError?: AxiosError) {
  (axios.post as jest.Mock).mockImplementation(() =>
    Promise.reject(axiosError ?? null)
  );
}

describe('POST /login', () => {
  it('should fail schema validation', async () => {
    const response = await request.post('/login').send({
      username: 'test',
    });
    expect(axios.post).toHaveBeenCalledTimes(0);
    expect(response.status).toBe(400);
  });

  it('should login user succesfully', async () => {
    mockAxiosPostSuccess();
    const response = await request.post('/login').send(validCredentials);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(response.body.username).toBe(UserMock.username);
  });

  it('should return an user object', async () => {
    mockAxiosPostSuccess();
    const response = await request.post('/login').send(validCredentials);
    const user = response.body;

    expect(user.hasOwnProperty('firstName')).toBeTruthy();
    expect(user.hasOwnProperty('lastName')).toBeTruthy();
    expect(user.hasOwnProperty('token')).toBeTruthy();
    expect(user.hasOwnProperty('username')).toBeTruthy();

    expect(user.hasOwnProperty('gender')).toBeFalsy();
    expect(user.hasOwnProperty('image')).toBeFalsy();
  });

  it('should fail to login with error from the 3rd party', async () => {
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
    expect(response.status).toBe(401);
    expect(response.text).toBe('Invalid Credentials');
  });

  it('should fail to login with unknown error', async () => {
    mockAxiosPostError();
    const response = await request.post('/login').send(validCredentials);

    expect(response.status).toBe(500);
    expect(response.text).toBe(ErrorMessages.LOGIN);
  });
});
