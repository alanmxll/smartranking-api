import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Body()
    createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    return await this.challengesService.createChallenge(createChallengeDto);
  }

  @Get()
  async findChallenges(@Query('idPlayer') _id: string): Promise<Challenge[]> {
    return _id
      ? await this.challengesService.findPlayerChallenge(_id)
      : await this.challengesService.findChallenges();
  }
}
