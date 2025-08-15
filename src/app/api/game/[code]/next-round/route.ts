import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/monogodb';
import Room from '@/models/Room';
import { GameService } from '@/lib/gameService';

// POST /api/game/[code]/next-round - Start next round
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

    // Reset voting state for all players
    room.players.forEach((player: any) => {
      player.isImposter = false;
      player.hasVoted = false;
      player.votedFor = undefined;
    });

    // Select new random imposter
    const imposterPlayerId = GameService.selectRandomImposter(room.players);

    // Mark the new imposter
    room.players.forEach((player: any) => {
      if (player.id === imposterPlayerId) {
        player.isImposter = true;
      }
    });

    // Generate new word and first word
    const { word, firstWord } = await GameService.generateGameWord();

    // Select random first player
    const firstPlayerId = GameService.selectFirstPlayer(room.players);

    // Update game state
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
    console.error('Error starting next round:', error);
    return NextResponse.json({ error: 'Failed to start next round' }, { status: 500 });
  }
}
