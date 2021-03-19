import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  private players: Player[] = [];

  private readonly logger = new Logger(PlayersService.name);

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    const { email } = createPlayerDto;

    const alreadyExists = await this.players.find(
      (player) => player.email === email,
    );
    if (alreadyExists) {
      this.logger.log(`${email} already exists`);
    } else {
      await this.create(createPlayerDto);
    }
  }

  async findPlayers(email: string): Promise<Player[]> {
    if (email) {
      const player = await this.players.find(
        (_player) => _player.email === email,
      );

      if (player) {
        return [player];
      }
    }
    return await this.players;
  }

  async updatePlayer(player: Player): Promise<void> {
    await this.update(player);
  }

  private create(createPlayerDto: CreatePlayerDto): void {
    const { name, phone, email } = createPlayerDto;

    const player: Player = {
      _id: uuidv4(),
      phone,
      email,
      name,
      ranking: 'A',
      position: 1,
      photo: 'www.google.com.br/player.jpg',
    };
    this.logger.log(`createPlayerDto: ${JSON.stringify(player)}`);
    this.players.push(player);
  }

  private update(player: Player): void {
    const pIndex = this.players.findIndex(
      (_player) => _player._id === player._id,
    );

    if (pIndex !== null) {
      this.players[pIndex].name = player.name;
      this.players[pIndex].ranking = player.ranking;
      this.players[pIndex].position = player.position;
      this.players[pIndex].photo = player.photo;

      this.logger.log(`update: ${JSON.stringify(this.players[pIndex])}`);
    } else {
      this.logger.log(`update: Failed! Player was not found`);
    }
  }
}
