import { FastifyInstance } from 'fastify';

import { verifyJwt } from '@/middlewares/verify-jwt';

export async function gymsRoutes(app: FastifyInstance) {
  // a linha abaixo serve para verificar se o token JWT é válido em todas as rotas abaixo
  app.addHook('onRequest', verifyJwt);
}
