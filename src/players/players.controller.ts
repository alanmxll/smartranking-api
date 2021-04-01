import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ParamValidationPipe } from '../common/pipes/param-validation.pipe';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(
    @Body() createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    return await this.playersService.createPlayer(createPlayerDto);
  }

  @Get()
  async findPlayers(): Promise<Player[]> {
    return this.playersService.findPlayers();
  }

  @Get('/:_id')
  async findPlayerById(
    @Param('_id', ParamValidationPipe) _id: string,
  ): Promise<Player> {
    return this.playersService.findPlayerById(_id);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Param('_id', ParamValidationPipe) _id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ): Promise<void> {
    return this.playersService.updatePlayer(_id, updatePlayerDto);
  }

  @Delete('/:_id')
  async deletePlayer(
    @Param('_id', ParamValidationPipe) _id: string,
  ): Promise<void> {
    return this.playersService.deletePlayer(_id);
  }
}
