import { FastifyReply, FastifyRequest } from 'fastify';

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  // aqui ele verifica se o token está presente no cookie e se ele é válido. Caso não seja, ele retorna um erro 401.
  await request.jwtVerify({
    onlyCookie: true,
  });

  // o request.user.sub fica disponível após a verificação do JWT (request.jwtVerify)

  const token = await reply.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub,
      },
    },
  );

  const refreshToken = await reply.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d',
      },
    },
  );

  return reply
    .setCookie('refreshToken', refreshToken, {
      secure: true,
      sameSite: true,
      httpOnly: true,
      path: '/',
    })
    .status(200)
    .send({
      token,
    });
}
