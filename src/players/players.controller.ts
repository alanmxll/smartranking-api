import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    await this.playersService.createPlayer(createPlayerDto);
  }

  @Get()
  async findAllPlayers(): Promise<Player[]> {
    return this.playersService.findlAllPlayers();
  }

  @Put(':id')
  async updatePlayer(@Body() player: Player) {
    return this.playersService.updatePlayer(player);
  }
}
