import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { AssignChallengeGameDto } from './dto/assign-challenge-game.dto';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatusValidationPipe } from './pipes/challenge-status-validation.pipe';

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

  @Put('/:challenge')
  async updateChallenge(
    @Body(ChallengeStatusValidationPipe) updateChallengeDto: UpdateChallengeDto,
    @Param('challenge') _id: string,
  ): Promise<void> {
    return await this.challengesService.updateChallenge(
      _id,
      updateChallengeDto,
    );
  }

  @Post('/:challenge/game/')
  async assignChallengeGame(
    @Body(ValidationPipe) assignChallengeGameDto: AssignChallengeGameDto,
    @Param('challenge') _id: string,
  ): Promise<void> {
    return await this.challengesService.assignChallengeGame(
      _id,
      assignChallengeGameDto,
    );
  }
}
