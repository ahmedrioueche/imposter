import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/monogodb';
import Room from '@/models/Room';
import { GameService } from '@/lib/gameService';

// POST /api/game/[code]/start - Start a new game
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await dbConnect();

    const { code } = await params;
    const room = await Room.findOne({ code, isActive: true });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    if (room.players.length < 3) {
      return NextResponse.json({ error: 'Need at least 3 players to start' }, { status: 400 });
    }

    // Initialize game state
    const gamePlayers = room.players.map((player: any) => ({
      id: player.id,
      name: player.name,
      isHost: player.isHost,
      joinedAt: player.joinedAt,
      score: player.score || 0,
      isImposter: false,
      hasVoted: false,
      votedFor: undefined,
    }));

    // Select random imposter
    const imposterPlayerId = GameService.selectRandomImposter(gamePlayers);

    // Mark the imposter
    gamePlayers.forEach((player: any) => {
      if (player.id === imposterPlayerId) {
        player.isImposter = true;
      }
    });

    // Generate word and first word
    const { word, firstWord } = await GameService.generateGameWord();

    // Select random first player
    const firstPlayerId = GameService.selectFirstPlayer(gamePlayers);

    // Update room with game data
    room.players = gamePlayers;
    room.gameState = 'word_reveal';
    room.currentRound = (room.currentRound || 0) + 1;
    room.word = word;
    room.firstWord = firstWord;
    room.firstPlayerId = firstPlayerId;
    room.imposterPlayerId = imposterPlayerId;
    room.imposterGuessedCorrectly = false;
    room.votes = [];

    await room.save();

    return NextResponse.json(room.toObject());
  } catch (error) {
    console.error('Error starting game:', error);
    return NextResponse.json({ error: 'Failed to start game' }, { status: 500 });
  }
}
