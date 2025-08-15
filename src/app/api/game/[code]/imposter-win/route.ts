import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/monogodb';
import Room from '@/models/Room';

// POST /api/game/[code]/imposter-win - Host declares imposter guessed correctly
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await dbConnect();

    const { code } = await params;
    const { hostId } = await request.json();

    if (!hostId) {
      return NextResponse.json({ error: 'Host ID is required' }, { status: 400 });
    }

    const room = await Room.findOne({ code, isActive: true });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // Verify the requester is the host
    const host = room.players.find((player: any) => player.id === hostId && player.isHost);
    if (!host) {
      return NextResponse.json(
        { error: 'Only the host can declare imposter victory' },
        { status: 403 }
      );
    }

    if (room.gameState !== 'word_reveal' && room.gameState !== 'discussion') {
      return NextResponse.json(
        { error: 'Can only declare imposter victory during word reveal or discussion phase' },
        { status: 400 }
      );
    }

    // Mark imposter as having guessed correctly
    room.imposterGuessedCorrectly = true;

    // Award point to imposter
    const imposterIndex = room.players.findIndex(
      (player: any) => player.id === room.imposterPlayerId
    );
    if (imposterIndex >= 0) {
      room.players[imposterIndex].score = (room.players[imposterIndex].score || 0) + 1;
    }

    // Create round result
    const roundResult = {
      round: room.currentRound,
      word: room.word,
      firstWord: room.firstWord,
      imposterPlayerId: room.imposterPlayerId,
      votes: [], // No votes since imposter won by guessing
      outcome: 'imposter_wins_by_guess',
      winners: [room.imposterPlayerId],
    };

    if (!room.roundResults) {
      room.roundResults = [];
    }
    room.roundResults.push(roundResult);

    // Move to results phase
    room.gameState = 'results';

    await room.save();

    return NextResponse.json(room.toObject());
  } catch (error) {
    console.error('Error declaring imposter victory:', error);
    return NextResponse.json({ error: 'Failed to declare imposter victory' }, { status: 500 });
  }
}
