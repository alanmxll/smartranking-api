import { Document } from 'mongoose';
import { Player } from 'src/players/interfaces/player.interface';
import { ChallengeStatus } from './challenge-status.enum';

export interface Challenge extends Document {
  challengeDate: Date;
  status: ChallengeStatus;
  requestDate: Date;
  responseDate: Date;
  requester: Player;
  category: string;
  players: Player[];
  game: Game;
}

export interface Game extends Document {
  category: string;
  players: Player[];
  def: Player;
  result: Result[];
}

export interface Result {
  set: string;
}
