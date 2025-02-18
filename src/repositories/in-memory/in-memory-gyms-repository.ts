import { Gym, Prisma } from '@prisma/client';
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository';
import { randomUUID } from 'node:crypto';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];

  async findById(id: string) {
    const gym = this.items.find((gym) => gym.id === id);

    if (!gym) {
      return null;
    }

    return gym;
  }

  async findManyNearby(params: FindManyNearbyParams) {
    const gyms = this.items.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: gym.latitude.toNumber(), // teve que passar para number pois o valor estava como Decimal que vem do Prisma
          longitude: gym.longitude.toNumber(),
        },
      );

      return distance <= 10; // 5km
    });

    return gyms;
  }

  async searchMany(query: string, page: number) {
    const gyms = this.items
      .filter((gym) => {
        return gym.title.toLowerCase().includes(query.toLowerCase());
      })
      .slice((page - 1) * 20, page * 20);

    return gyms;
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    };

    this.items.push(gym);

    return gym;
  }
}
