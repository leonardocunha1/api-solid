import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Validate Check-in (2e2)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to validate a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const gym = await prisma.gym.create({
      data: {
        title: 'Academia do Seu Zé',
        description: 'Academia top',
        phone: '123456789',
        latitude: 0,
        longitude: 0,
      },
    });

    const user = await prisma.user.findFirstOrThrow();

    let checkIn = await prisma.checkin.create({
      data: {
        user_id: user.id,
        gymId: gym.id,
      },
    });

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(204);

    checkIn = await prisma.checkin.findUniqueOrThrow({
      where: { id: checkIn.id },
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
  });
});
