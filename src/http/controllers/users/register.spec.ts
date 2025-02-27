import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '@/app';

describe('Register (2e2)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a new user', async () => {
    const response = await request(app.server).post('/users').send({
      email: 'leonardo.oliveira@hotmail.com',
      name: 'Leonardo Oliveira',
      password: '123456',
    });

    expect(response.status).toBe(201);
  });
});
