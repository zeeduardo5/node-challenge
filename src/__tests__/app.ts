import app from '../app';
import supertest from 'supertest';

const request = supertest(app);

describe('GET /', () => {
  it('should return "Hello, World!"', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, World!');
  });
});

describe('GET /fakeroute', () => {
  it('should return http code 404 with non existing route', async () => {
    const response = await request.get('/fakeroute');
    expect(response.status).toBe(404);
    expect(response.text).toBe("");
  });
});


describe('POST /products', () => {
  it('should return http code 404 with non existing route', async () => {
    const response = await request.post('/products');
    expect(response.status).toBe(200);
    expect(response.text).toBe("");
  });
});