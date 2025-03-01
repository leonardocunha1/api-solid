import { FastifyInstance } from 'fastify';
import request from 'supertest';

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    name: 'Leonardo Oliveira',
    email: 'leonardo.oliveira@hotmail.com',
    password: '123456',
  });

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'leonardo.oliveira@hotmail.com',
    password: '123456',
  });

  const { token } = authResponse.body;

  return {
    token,
  };
}
