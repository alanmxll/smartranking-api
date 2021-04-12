import * as mongoose from 'mongoose';

export const ChallengeSchema = new mongoose.Schema(
  {
    challengeDate: { type: Date },
    status: { type: String },
    requestDate: { type: Date },
    responseDate: { type: Date },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    category: { type: String },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
    },
  },
  { timestamps: true, collection: 'challenges' },
);
