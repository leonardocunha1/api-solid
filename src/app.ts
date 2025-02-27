import fastify from 'fastify';
import { usersRoutes } from './http/controllers/users/routes';
import { ZodError } from 'zod';
import fastifyJwt from '@fastify/jwt';
import { env } from './env';
import { gymsRoutes } from './http/controllers/gyms/routes';

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(usersRoutes);
app.register(gymsRoutes);

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() });
  }

  if (env.NODE_ENV !== 'prod') {
    console.error(error);
  } else {
    // TODO. Aqui poderia ser enviado um email para o time de desenvolvimento.
  }

  reply.status(500).send({ message: 'Internal server error.' });
});
