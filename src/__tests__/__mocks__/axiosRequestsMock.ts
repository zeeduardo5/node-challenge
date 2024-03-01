import axios, { AxiosError } from 'axios';
import { apiProductsResponseMock, productsMock } from './productsMock';
import { apiUserResponseMock } from './userMock';
import { PRODUCTS_URL } from '../../constants';

export function mockAxiosGetRequestSuccess(
  product?: Record<string, string | string[] | number>
) {
  (axios.get as jest.Mock).mockImplementation((url) => {
    switch (url) {
      case PRODUCTS_URL:
        return Promise.resolve({
          data: {
            products: [...apiProductsResponseMock],
          },
        });
      default:
        return Promise.resolve({
          data: product ?? apiProductsResponseMock[0],
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
    Promise.resolve({ data: apiUserResponseMock })
  );
}

export function mockAxiosPostError(axiosError?: AxiosError) {
  (axios.post as jest.Mock).mockImplementation(() =>
    Promise.reject(axiosError ?? null)
  );
}
