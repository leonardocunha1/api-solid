import { Checkin } from '@prisma/client';
import { CheckInsRepository } from '@/repositories/check-ins-repository';

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
}

interface CheckInUseCaseResponse {
  checkIn: Checkin;
}

export class CheckInUseCase {
  constructor(private checkInRepository: CheckInsRepository) {}

  async execute({
    userId,
    gymId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const checkInOnSameDate = await this.checkInRepository.findByUserIdOnDate(
      userId,
      new Date(),
    );

    if (checkInOnSameDate) {
      throw new Error();
    }

    const checkIn = await this.checkInRepository.create({
      // está com nome diferente pois no schema do prisma está assim (gymId e user_id)
      gymId,
      user_id: userId,
    });

    return { checkIn };
  }
}
