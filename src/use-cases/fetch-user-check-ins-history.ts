import { Checkin } from '@prisma/client';
import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { GymsRepository } from '@/repositories/gyms-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';
import { MaxDistanceError } from './errors/max-distance-error';

interface FetchUserCheckInsHistoryUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface FetchUserCheckInsHistoryUseCaseResponse {
  checkIn: Checkin;
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(
    private checkInRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    // calcular distância entre o usuário e a academia
    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    );

    const MAX_DISTANCE_IN_KILOMETERS = 0.1;

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError();
    }

    const checkInOnSameDate = await this.checkInRepository.findByUserIdOnDate(
      userId,
      new Date(),
    );

    if (checkInOnSameDate) {
      throw new MaxNumberOfCheckInsError();
    }

    const checkIn = await this.checkInRepository.create({
      // está com nome diferente pois no schema do prisma está assim (gymId e user_id)
      gymId,
      user_id: userId,
    });

    return { checkIn };
  }
}
