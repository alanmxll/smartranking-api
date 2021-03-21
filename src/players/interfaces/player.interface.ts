import { Document } from 'mongoose';

export interface Player extends Document {
  readonly phone: string;
  readonly email: string;
  name: string;
  ranking: string;
  position: number;
  photo: string;
}
