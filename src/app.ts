import fastify from 'fastify';
import { AppRoutes } from './http/routes';
import { ZodError } from 'zod';
import { env } from 'process';

export const app = fastify();

app.register(AppRoutes);

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // TODO. Aqui poderia ser enviado um email para o time de desenvolvimento.
  }

  reply.status(500).send({ message: 'Internal server error.' });
});
