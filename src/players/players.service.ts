import { Injectable, Logger } from '@nestjs/common';
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

  private readonly logger = new Logger(PlayersService.name);

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    const { email } = createPlayerDto;

    const alreadyExists = await this.playerModel.findOne({ email }).exec();

    if (alreadyExists) {
      this.logger.log(`${email} already exists`);
    } else {
      await this.create(createPlayerDto);
    }
  }

  async findPlayers(email: string): Promise<Player[]> {
    if (email) {
      const player = await this.playerModel.findOne({ email }).exec();

      if (player) {
        return [player];
      }
    }
    return await this.playerModel.find().exec();
  }

  async updatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    await this.update(createPlayerDto);
  }

  async deletePlayer(email: string): Promise<void> {
    await this.delete(email);
  }

  private async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const player = new this.playerModel(createPlayerDto);

    return await player.save();
  }

  private async update(createPlayerDto: CreatePlayerDto): Promise<Player> {
    return await this.playerModel
      .findOneAndUpdate(
        { email: createPlayerDto.email },
        { $set: createPlayerDto },
      )
      .exec();
  }

  private async delete(email: string): Promise<any> {
    return await this.playerModel.deleteOne({ email }).exec();
  }
}
