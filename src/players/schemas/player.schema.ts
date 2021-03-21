import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    phone: { type: String, unique: true },
    email: { type: String, unique: true },
    name: String,
    ranking: String,
    position: Number,
    photo: String,
  },
  { timestamps: true, collection: 'players' },
);
