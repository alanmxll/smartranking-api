import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ChallengeStatus } from '../interfaces/challenge-status.enum';

export class ChallengeStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    ChallengeStatus.ACCEPTED,
    ChallengeStatus.DENIED,
    ChallengeStatus.CANCELLED,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.isValidStatus(status)) {
      throw new BadRequestException(`'${status}' is not a valid status`);
    }

    return value;
  }

  private isValidStatus(status: any) {
    const idx = this.allowedStatuses.indexOf(status);
    // -1 if the element was not found
    return idx !== -1;
  }
}
