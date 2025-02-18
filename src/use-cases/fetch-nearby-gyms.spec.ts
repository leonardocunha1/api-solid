import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch Nearby Gyms Use case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      // localização play academia
      latitude: -20.5383173,
      longitude: -47.3754999,
    });

    await gymsRepository.create({
      title: 'Far Gym',
      // localização em restinga
      latitude: -20.6006215,
      longitude: -47.4813865,
    });

    const { gyms } = await sut.execute({
      // localização q2
      userLatitude: -20.5409078,
      userLongitude: -47.3755292,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Near Gym',
      }),
    ]);
  });
});
