import { FastifyInstance } from 'fastify';
import { register } from './controllers/register';
import { authenticate } from './controllers/authenticate';

export async function AppRoutes(app: FastifyInstance) {
  app.post('/users', register);

  app.post('/sessions', authenticate);
}
