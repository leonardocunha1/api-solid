import { FastifyInstance } from 'fastify';

import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { nearby } from './nearby';
import { search } from './search';
import { create } from './create';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';

export async function gymsRoutes(app: FastifyInstance) {
  // a linha abaixo serve para verificar se o token JWT é válido em todas as rotas abaixo
  app.addHook('onRequest', verifyJwt);

  app.get('/gyms/search', search);
  app.get('/gyms/nearby', nearby);

  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create);
}
