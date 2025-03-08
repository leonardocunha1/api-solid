import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { FastifyInstance } from 'fastify';
import request from 'supertest';

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  // await request(app.server).post('/users').send({
  //   name: 'Leonardo Oliveira',
  //   email: 'leonardo.oliveira@hotmail.com',
  //   password: '123456',
  // });

  await prisma.user.create({
    data: {
      name: 'Leonardo Oliveira',
      email: 'leonardo.oliveira@hotmail.com',
      password_hash: await hash('123456', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
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
