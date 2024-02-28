import axios, { AxiosError } from 'axios';
import { productsMock } from './productMock';
import { userMock } from './userMock';

const baseUrl = 'https://dummyjson.com';

export function mockAxiosGetRequestSuccess(
  product?: Record<string, string | string[] | number>
) {
  (axios.get as jest.Mock).mockImplementation((url) => {
    switch (url) {
      case `${baseUrl}/auth/me`:
        return Promise.resolve({
          data: userMock,
        });
      case `${baseUrl}/products`:
        return Promise.resolve({
          data: {
            products: [...productsMock],
          },
        });
      default:
        return Promise.resolve({
          data: product ?? productsMock[0],
        });
    }
  });
}

export function mockAxiosGetError(axiosError?: AxiosError) {
  (axios.get as jest.Mock).mockImplementation(() =>
    Promise.reject(axiosError ?? null)
  );
}

export function mockAxiosPostSuccess() {
  (axios.post as jest.Mock).mockImplementation(() =>
    Promise.resolve({ data: userMock })
  );
}

export function mockAxiosPostError(axiosError?: AxiosError) {
  (axios.post as jest.Mock).mockImplementation(() =>
    Promise.reject(axiosError ?? null)
  );
}

export function mockAxiosGetAuthSuccessAndProductError(
  axiosError?: AxiosError
) {
  (axios.get as jest.Mock).mockImplementation((url) => {
    switch (url) {
      case `${baseUrl}/auth/me`:
        return Promise.resolve({
          data: userMock,
        });
      default:
        return Promise.reject(axiosError ?? null);
    }
  });
}
