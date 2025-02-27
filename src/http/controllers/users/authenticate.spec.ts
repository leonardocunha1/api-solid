import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '@/app';

describe('Authenticate (2e2)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'Leonardo Oliveira',
      email: 'leonardo.oliveira@hotmail.com',
      password: '123456',
    });

    const response = await request(app.server).post('/sessions').send({
      email: 'leonardo.oliveira@hotmail.com',
      password: '123456',
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
});
