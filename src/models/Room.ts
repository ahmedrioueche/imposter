import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  isHost: { type: Boolean, default: false },
  joinedAt: { type: Date, default: Date.now },

  // Game fields
  score: { type: Number, default: 0 },
  isImposter: { type: Boolean, default: false },
  hasVoted: { type: Boolean, default: false },
  votedFor: { type: String },
});

const VoteSchema = new mongoose.Schema({
  voterId: { type: String, required: true },
  votedForId: { type: String, required: true },
});

const RoundResultSchema = new mongoose.Schema({
  round: { type: Number, required: true },
  word: { type: String, required: true },
  firstWord: { type: String },
  imposterPlayerId: { type: String, required: true },
  votes: [VoteSchema],
  outcome: {
    type: String,
    enum: ['imposter_wins', 'team_wins', 'tie', 'imposter_wins_by_guess'],
    required: true,
  },
  winners: [{ type: String }],
});

const RoomSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  players: [PlayerSchema],
  maxPlayers: { type: Number, default: 8 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },

  // Game fields
  gameState: {
    type: String,
    enum: ['waiting', 'starting', 'word_reveal', 'discussion', 'voting', 'results', 'game_over'],
    default: 'waiting',
  },
  currentRound: { type: Number, default: 0 },
  word: { type: String },
  firstWord: { type: String },
  firstPlayerId: { type: String },
  imposterPlayerId: { type: String },
  imposterGuessedCorrectly: { type: Boolean, default: false },
  votes: [VoteSchema],
  roundResults: [RoundResultSchema],
});

// Auto-update lastActivity on save
RoomSchema.pre('save', function () {
  this.lastActivity = new Date();
});

// Clean up old rooms (older than 24 hours with no activity)
RoomSchema.statics.cleanupOldRooms = async function () {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.deleteMany({ lastActivity: { $lt: cutoff } });
};

export default mongoose.models.Room || mongoose.model('Room', RoomSchema);
