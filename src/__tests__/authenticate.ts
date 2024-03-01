import { Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/authenticate';
import { ErrorMessages } from '../messages/error';
import { apiUserResponseMock } from './__mocks__/userMock';

describe('Authentication middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse = {} as unknown as Response;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = { headers: {} };
    mockResponse.status = jest.fn(() => mockResponse);
    mockResponse.send = jest.fn();
    mockResponse.locals = {};
  });

  afterEach(() => jest.resetAllMocks());

  it('should call next with valid token', async () => {
    mockRequest.headers = { authorization: `Bearer ${<string>apiUserResponseMock.token}` };

    await authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.locals.customerId).toBe(15);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should fail without token', async () => {
    await authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.send).toBeCalledWith(ErrorMessages.NO_TOKEN);
  });

  it('should fail with invalid token', async () => {
    mockRequest.headers = { authorization: 'Bearer invalidToken' };
    await authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.send).toBeCalledWith(ErrorMessages.INVALID_TOKEN);
  });
});
