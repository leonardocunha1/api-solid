import { Prisma, Checkin } from '@prisma/client';
import { CheckInsRepository } from '../check-ins-repository';
import { randomUUID } from 'node:crypto';

// é uma simulação de um banco de dados em memória, para ser usado em testes unitários. Nesse exemplo, está simulando o prisma que está na pasta repositories/prisma/prisma-users-repository.ts

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: Checkin[] = [];

  async create(data: Prisma.CheckinUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gymId: data.gymId,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };

    this.items.push(checkIn);

    return checkIn;
  }
}
