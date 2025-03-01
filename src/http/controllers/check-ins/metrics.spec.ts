import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Check-in Metrics (2e2)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to list the total count of check-ins', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const user = await prisma.user.findFirstOrThrow();

    const gym = await prisma.gym.create({
      data: {
        title: 'Academia do Seu Zé',
        description: 'Academia top',
        phone: '123456789',
        latitude: 0,
        longitude: 0,
      },
    });

    await prisma.checkin.createMany({
      data: [
        {
          user_id: user.id,
          gymId: gym.id,
        },
        {
          user_id: user.id,
          gymId: gym.id,
        },
      ],
    });

    const response = await request(app.server)
      .get(`/check-ins/metrics`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.checkInsCount).toEqual(2);
  });
});
