import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { PlayersService } from 'src/players/players.service';
import { AssignChallengeGameDto } from './dto/assign-challenge-game.dto';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { Challenge, Game } from './interfaces/challenge.interface';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('Game') private readonly gameModel: Model<Game>,
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

  async assignChallengeGame(
    _id: any,
    assignChallengeGameDto: AssignChallengeGameDto,
  ): Promise<void> {
    const challenge = await this.challengeModel.findById(_id).exec();

    if (!challenge) {
      throw new BadRequestException(`Challenge '${_id}' not registered`);
    }

    /**
     * Verify if the winner is in the challenge
     */
    const playerFiltered = challenge.players.filter(
      (player) => player._id == assignChallengeGameDto.def,
    );

    if (playerFiltered.length == 0) {
      throw new BadRequestException(`The player winner was not in challenge`);
    }

    /**
     * First lets create and persist the game object
     */
    const game = new this.gameModel(assignChallengeGameDto);

    /**
     * Assign the object game to category recovered in challenge
     */
    game.category = challenge.category;

    /**
     * Assign the object game to players that was in the challenge
     */
    game.players = challenge.players;

    const result = await game.save();

    /**
     * When one game was registered by a user, we change the
     * challenge status to REALIZED
     */
    challenge.status = ChallengeStatus.REALIZED;

    /**
     * Recover the ID of game and assign to challenge
     */
    challenge.game = result._id;

    try {
      await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: challenge })
        .exec();
    } catch (error) {
      /**
       * If the challenge update fails, we exclude the game saved before
       */
      await this.gameModel.deleteOne({ _id: result._id }).exec();
      throw new InternalServerErrorException();
    }
  }
    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: challenge })
      .exec();
  }
}
