import { FastifyInstance } from 'fastify';
import { register } from './controllers/register';
import { authenticate } from './controllers/authenticate';
import { profile } from './controllers/profile';
import { verifyJwt } from '@/middlewares/verify-jwt';

export async function AppRoutes(app: FastifyInstance) {
  app.post('/users', register);

  app.post('/sessions', authenticate);

  // ROTAS QUANDO O USUÁRIO ESTIVER AUTENTICADO
  app.get(
    '/me',
    {
      onRequest: [verifyJwt],
    },
    profile,
  );
}
