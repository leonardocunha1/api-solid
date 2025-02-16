import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('Search Gyms Use case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Academia 1',
      latitude: 0,
      longitude: 0,
    });

    await gymsRepository.create({
      title: 'Academia 2',
      latitude: 0,
      longitude: 0,
    });

    const { gyms } = await sut.execute({
      query: 'Academia',
      page: 1,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Academia 1',
      }),
      expect.objectContaining({
        title: 'Academia 2',
      }),
    ]);
  });

  it('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Academia ${i}`,
        latitude: 0,
        longitude: 0,
      });
    }

    const { gyms } = await sut.execute({
      query: 'Academia',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Academia 21',
      }),
      expect.objectContaining({
        title: 'Academia 22',
      }),
    ]);
  });
});
