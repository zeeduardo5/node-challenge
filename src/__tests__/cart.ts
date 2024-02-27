import app from "../app";
import supertest from "supertest";
import axios, { AxiosError, AxiosHeaders } from "axios";
import { UserMock } from "./__mocks__/userMock";
import { ErrorMessages } from "../messages/error";
import { productsMock } from "./__mocks__/productMock";

const request = supertest(app);

const baseUrl = "https://dummyjson.com";

const cartPayload = {
  productId: 1,
};
jest.mock("axios");

function mockAxiosGetSuccess(
  userData: Record<string, string | number>,
  product: Record<string, string | string[] | number>
) {
  (axios.get as jest.Mock).mockImplementation((url) => {
    switch (url) {
      case `${baseUrl}/auth/me`:
        return Promise.resolve({
          data: userData,
        });
      default:
        return Promise.resolve({
          data: product,
        });
    }
  });
}

function mockAxiosGetSuccessAndError(
  userData: Record<string, string | number>,
  axiosError?: AxiosError
) {
  (axios.get as jest.Mock).mockImplementation((url) => {
    switch (url) {
      case `${baseUrl}/auth/me`:
        return Promise.resolve({
          data: userData,
        });
      default:
        return Promise.reject(axiosError ?? null)
    }
  });
}

function mockAxiosGetError(axiosError?: AxiosError) {
  (axios.get as jest.Mock).mockImplementation(() =>
    Promise.reject(axiosError ?? null)
  );
}

describe("POST /cart", () => {
  it("should fail without token", async () => {
    const response = await request.post("/cart").send(cartPayload);
    expect(axios.get).toHaveBeenCalledTimes(0);
    expect(response.status).toBe(401);
    expect(response.text).toBe(ErrorMessages.NO_TOKEN);
  });

  it("should fail with invalid token", async () => {
    mockAxiosGetError();
    const response = await request
      .post("/cart")
      .set("Authorization", "token")
      .send(cartPayload);

    expect(axios.get).toHaveBeenCalled();
    expect(response.status).toBe(401);
    expect(response.text).toBe(ErrorMessages.INVALID_TOKEN);
  });

  it("should fail with invalid payload", async () => {
    mockAxiosGetSuccess(UserMock, {});
    const response = await request
      .post("/cart")
      .set("Authorization", "token")
      .send({});
    expect(response.status).toBe(400);
  });

  it("should add product to the in memory db", async () => {
    mockAxiosGetSuccess(UserMock, productsMock[0]);

    const response = await request
      .post("/cart")
      .set("Authorization", "token")
      .send(cartPayload);

    expect(response.status).toBe(200);
    const userCart = response.body;
    expect(userCart[0].productId).toBe(1);
    expect(userCart[0].quantity).toBe(1);
  });

  it("should fail to add product that does not exists", async () => {
    mockAxiosGetSuccess(UserMock, {});

    const response = await request
      .post("/cart")
      .set("Authorization", "token")
      .send(cartPayload);

    expect(response.status).toBe(400);
  });

  it("should fail to add product when get product fails with unknow error", async () => {
    mockAxiosGetSuccessAndError(UserMock);

    const response = await request
      .post("/cart")
      .set("Authorization", "token")
      .send(cartPayload);

    expect(response.status).toBe(500);
    expect(response.text).toBe(ErrorMessages.PRODUCT);
  });


  it("should fail to add product when get product fails with axios error", async () => {
    const error = new AxiosError();
    error.status = 400;
    mockAxiosGetSuccessAndError(UserMock, error);

    const response = await request
      .post("/cart")
      .set("Authorization", "token")
      .send(cartPayload);

    expect(response.status).toBe(400);
    expect(response.text).toBe(ErrorMessages.PRODUCT);
  });

  it("should add two diferent products to the in memory db", async () => {
    mockAxiosGetSuccess(UserMock, productsMock[0]);

    await request.post("/cart").set("Authorization", "token").send(cartPayload);

    await request.post("/cart").set("Authorization", "token").send(cartPayload);

    const response = await request
      .post("/cart")
      .set("Authorization", "token")
      .send({ productId: 2 });

    const userCart = response.body;

    expect(userCart.length).toBe(2);
    expect(userCart[0].productId).toBe(1);
    expect(userCart[0].quantity).toBe(3);
    expect(userCart[1].productId).toBe(2);
    expect(userCart[1].quantity).toBe(1);
  });
});
