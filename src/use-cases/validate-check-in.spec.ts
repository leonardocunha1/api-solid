import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ValidateCheckInUseCase } from './validate-check-in';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe('Validate Check-in Use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to validate the check in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gymId: 'gym-01',
      user_id: 'user-01',
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it('should not be able to validate a non-existing check in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'non-existing-check-in-id',
      }),
    ).rejects.toThrowError(ResourceNotFoundError);
  });

  it('should not be able to validate the check-in after 20 minutes', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

    const createdCheckIn = await checkInsRepository.create({
      gymId: 'gym-01',
      user_id: 'user-01',
    });

    const twentyOneMinutesLaterInMs = 1000 * 60 * 21;

    vi.advanceTimersByTime(twentyOneMinutesLaterInMs);

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
