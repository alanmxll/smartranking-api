import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { PlayersService } from 'src/players/players.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { Challenge } from './interfaces/challenge.interface';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    private readonly playersService: PlayersService,
    private readonly categoryService: CategoriesService,
  ) {}

  async createChallenge(
    createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    /**
     * Verify if players are registered
     */
    const players = await this.playersService.findPlayers();

    createChallengeDto.players.map((playerDto) => {
      const playerFiltered = players.filter(
        (player) => player._id == playerDto._id,
      );

      if (playerFiltered.length === 0) {
        throw new BadRequestException(
          `The id ${playerDto._id} isn't a Player!`,
        );
      }
    });

    /**
     * Verify if requester is a player in the challenge
     */
    const requesterIsInTheChallenge = createChallengeDto.players.filter(
      (player) => player._id == createChallengeDto.requester,
    );

    if (requesterIsInTheChallenge.length === 0) {
      throw new BadRequestException(
        `The requester must be a player in the match!`,
      );
    }

    /**
     * Find category using player id
     */
    const playerCategory = await this.categoryService.findPlayerCategory(
      createChallengeDto.requester,
    );

    /**
     * Requester must be in a category
     */
    if (!playerCategory) {
      throw new BadRequestException(
        `The requester must be registered in a category!`,
      );
    }

    const challenge = new this.challengeModel(createChallengeDto);
    challenge.category = playerCategory.category;
    challenge.requestDate = new Date();

    /**
     * When created the challenge status i'll be PENDING
     */
    challenge.status = ChallengeStatus.PENDING;

    return await challenge.save();
  }

  async findChallenges(): Promise<Challenge[]> {
    return await this.challengeModel
      .find()
      .populate('requester')
      .populate('players')
      .populate('game')
      .exec();
  }

  async findPlayerChallenge(_id: any): Promise<Challenge[]> {
    const players = await this.playersService.findPlayers();

    const playerFiltered = players.filter((player) => player._id == _id);

    if (playerFiltered.length === 0) {
      throw new BadRequestException(`The id '${_id}' isn't a player.`);
    }

    return await this.challengeModel
      .find()
      .where('players')
      .in(_id)
      .populate('requester')
      .populate('players')
      .populate('game')
      .exec();
  }

  async updateChallenge(
    _id: string,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<void> {
    const challenge = await this.challengeModel.findById(_id).exec();

    if (!challenge) {
      throw new NotFoundException(`Challenge '${_id}' not registered`);
    }

    /**
     * Update the response date when the status come filled
     */
    if (updateChallengeDto.status) {
      challenge.responseDate = new Date();
    }

    challenge.status = updateChallengeDto.status;
    challenge.challengeDate = updateChallengeDto.challengeDate;

    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: challenge })
      .exec();
  }
}
