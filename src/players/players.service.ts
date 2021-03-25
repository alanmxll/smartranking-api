import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player')
    private readonly playerModel: Model<Player>,
  ) {}

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayerDto;

    const playerAlreadyExists = await this.playerModel
      .findOne({ email })
      .exec();

    if (playerAlreadyExists) {
      throw new BadGatewayException(
        `There is already a player registered with the email: ${email}`,
      );
    }

    const player = new this.playerModel(createPlayerDto);
    return await player.save();
  }

  async findPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async findPlayerById(_id: string): Promise<Player> {
    const player = await this.playerModel.findOne({ _id }).exec();

    if (!player) {
      throw new NotFoundException(`Player with id ${_id} not found`);
    }

    return player;
  }

  async updatePlayer(
    _id: string,
    createPlayerDto: CreatePlayerDto,
  ): Promise<void> {
    const playerExists = await this.playerModel.findOne({ _id }).exec();

    if (!playerExists) {
      throw new NotFoundException(`Player with id ${_id} not found`);
    }

    await this.playerModel
      .findOneAndUpdate({ _id }, { $set: createPlayerDto })
      .exec();
  }

  async deletePlayer(_id: string): Promise<void> {
    const playerExists = await this.playerModel.findOne({ _id }).exec();

    if (!playerExists) {
      throw new NotFoundException(`Player with id ${_id} not found`);
    }

    await this.playerModel.deleteOne({ _id }).exec();
  }
}
