import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '@/app';

describe('Refresh Token (2e2)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to refresh a token', async () => {
    await request(app.server).post('/users').send({
      name: 'Leonardo Oliveira',
      email: 'leonardo.oliveira@hotmail.com',
      password: '123456',
    });

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'leonardo.oliveira@hotmail.com',
      password: '123456',
    });

    const cookies = authResponse.get('Set-cookie');

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies as string)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
    expect(response.get('Set-cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ]);
  });
});
