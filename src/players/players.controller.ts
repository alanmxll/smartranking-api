import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
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
  async findPlayers(@Query('email') email: string): Promise<Player[]> {
    return this.playersService.findPlayers(email);
  }

  @Put()
  async updatePlayer(@Body() createPlayerDto: CreatePlayerDto): Promise<void> {
    return this.playersService.updatePlayer(createPlayerDto);
  }

  @Delete()
  async deletePlayer(@Query('email') email: string): Promise<void> {
    return this.playersService.deletePlayer(email);
  }
}
