import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CheckInUseCase } from './check-in';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('Check-in Use case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'Academia 01',
      description: 'Descrição da academia 01',
      phone: '123456789',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(
      async () =>
        await sut.execute({
          gymId: 'gym-01',
          userId: 'user-01',
          userLatitude: 0,
          userLongitude: 0,
        }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in on distant gym (100m)', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    // -20.5428536,-47.3671858
    // -20.5698721,-47.3589234

    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Academia 01',
      description: 'Descrição da academia 01',
      phone: '123456789',
      latitude: new Decimal(-20.5428536),
      longitude: new Decimal(-47.3671858),
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -20.5698721,
        userLongitude: -47.3589234,
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
