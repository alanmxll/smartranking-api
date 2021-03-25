import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    name: String,
    phone: String,
    ranking: String,
    position: Number,
    photo: String,
  },
  { timestamps: true, collection: 'players' },
);
