import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/monogodb';
import Room from '@/models/Room';

// POST /api/game/[code]/reset - Reset game to lobby
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

    // Reset all game state
    room.players.forEach((player: any) => {
      player.score = 0;
      player.isImposter = false;
      player.hasVoted = false;
      player.votedFor = undefined;
    });

    // Reset room game state
    room.gameState = 'waiting';
    room.currentRound = 0;
    room.word = undefined;
    room.firstWord = undefined;
    room.firstPlayerId = undefined;
    room.imposterPlayerId = undefined;
    room.imposterGuessedCorrectly = false;
    room.votes = [];
    room.roundResults = [];

    await room.save();

    return NextResponse.json(room.toObject());
  } catch (error) {
    console.error('Error resetting game:', error);
    return NextResponse.json({ error: 'Failed to reset game' }, { status: 500 });
  }
}
